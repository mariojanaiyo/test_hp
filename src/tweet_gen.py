"""テキスト -> MBTI_CONCEPT.md のフレームワークで解釈 -> 140字ツイート生成。

使い方:
  python src/tweet_gen.py --input transcript.txt              # 1回生成
  python src/tweet_gen.py --input transcript.txt --watch 30   # 30分ごとに生成
  cat transcript.txt | python src/tweet_gen.py                # 標準入力
ANTHROPIC_API_KEY が設定されていれば Claude で生成、なければルールベース。
"""
import argparse
import json
import math
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONCEPT_MD = ROOT / "MBTI_CONCEPT.md"
RESULTS = ROOT / "output" / "results.json"
MAX_LEN = 140
HASHTAG = " #MBTI"
LAYER_RE = re.compile(r"^###\s*([①②③④⑤])\s*(.+)$")
NOISE = "│├└─┌┐┘┬┴┼↓→←✓⚠※*`>|"


def load_concepts(path=CONCEPT_MD):
    """mdを層ごとのコンセプト行に分解する: [(層ラベル, 行), ...]"""
    concepts, layer = [], None
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = LAYER_RE.match(raw)
        if m:
            layer = m.group(1) + re.sub(r"[（(].*", "", m.group(2)).strip()
            continue
        if raw.startswith("## "):
            layer = None
        if layer is None:
            continue
        line = raw.strip().lstrip("- ").translate({ord(c): None for c in NOISE}).strip()
        if 8 <= len(line) <= 100 and re.search(r"[ぁ-んァ-ン一-龥]", line):
            concepts.append((layer, line))
    return concepts


def bigrams(text):
    t = re.sub(r"\s+", "", text)
    return {t[i:i + 2] for i in range(len(t) - 1)}


def split_sentences(text):
    parts = re.split(r"[。！？!?\n]+", text)
    return [p.strip() for p in parts if len(p.strip()) >= 6]


def rank_concepts(text, concepts):
    """入力テキストとの関連度が高い順にコンセプトを並べる。"""
    text_bg = bigrams(text)
    scored = []
    for layer, line in concepts:
        bg = bigrams(line)
        if not bg:
            continue
        score = len(bg & text_bg) / math.sqrt(len(bg))
        scored.append((score, layer, line))
    scored.sort(key=lambda x: -x[0])
    return scored


def fit(body, tag=HASHTAG, limit=MAX_LEN):
    room = limit - len(tag)
    if len(body) > room:
        body = body[: room - 1] + "…"
    return body + tag


def rule_based(text, concepts, used):
    ranked = [r for r in rank_concepts(text, concepts) if r[2] not in used]
    if len(ranked) < 2:
        used.clear()
        ranked = rank_concepts(text, concepts)
    _, layer, line = ranked[0]
    used.add(line)
    body = f"【{layer}】{line}"
    for _, l2, line2 in ranked[1:]:
        if l2 != layer and len(body) + len(line2) + 2 <= MAX_LEN - len(HASHTAG):
            body += f"。【{l2}】{line2}"
            used.add(line2)
            line += " / " + line2
            break
    return fit(body), layer, line


def with_claude(text, concepts, used):
    import anthropic

    ranked = [r for r in rank_concepts(text, concepts) if r[2] not in used] or rank_concepts(text, concepts)
    _, layer, line = ranked[0]
    used.add(line)
    framework = CONCEPT_MD.read_text(encoding="utf-8")
    client = anthropic.Anthropic()
    msg = client.messages.create(
        model=os.environ.get("CLAUDE_MODEL", "claude-sonnet-5-5"),
        max_tokens=400,
        system=f"以下のフレームワークで入力テキストを解釈し、ツイートを書く。\n\n{framework}",
        messages=[{
            "role": "user",
            "content": f"注目する層: {layer}\n注目する概念: {line}\n\n入力テキスト:\n{text[:12000]}\n\n"
                       f"この層・概念の観点から{MAX_LEN - len(HASHTAG)}字以内の日本語ツイート本文だけを出力。",
        }],
    )
    return fit(msg.content[0].text.strip().replace("\n", " ")), layer, line


def generate(text, state):
    concepts = load_concepts()
    used = set(state["used"])
    fn = with_claude if os.environ.get("ANTHROPIC_API_KEY") else rule_based
    tweet, layer, line = fn(text, concepts, used)
    state["used"] = sorted(used)
    state["history"].append({
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "layer": layer, "concept": line, "tweet": tweet, "length": len(tweet),
    })
    return tweet


def load_state():
    if RESULTS.exists():
        return json.loads(RESULTS.read_text(encoding="utf-8"))
    return {"used": [], "history": []}


def save_state(state):
    RESULTS.parent.mkdir(exist_ok=True)
    RESULTS.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", help="入力テキストファイル(省略時は標準入力)")
    ap.add_argument("--watch", type=int, metavar="MIN", help="N分ごとに繰り返し生成")
    args = ap.parse_args()

    read = (lambda: Path(args.input).read_text(encoding="utf-8")) if args.input else sys.stdin.read
    while True:
        state = load_state()
        tweet = generate(read(), state)
        save_state(state)
        print(f"[{datetime.now():%H:%M}] ({len(tweet)}字) {tweet}", flush=True)
        if not args.watch:
            break
        time.sleep(args.watch * 60)


if __name__ == "__main__":
    main()
