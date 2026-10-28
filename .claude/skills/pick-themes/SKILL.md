---
name: pick-themes
description: 「つながり」(public/shorts)の次に作るショートのテーマを、ユーザーの興味プロフィールに沿って自動で絞り込む。「次のテーマ」「何を作る?」「ネタを出して」と言われたとき、またはテーマ指定なしでショートの追加を頼まれたときに使う。
---

# テーマを自動で絞り込む

ユーザーの興味(`public/shorts/PROFILE.md`)を基準に、候補を出し、採点し、1〜3本を「選定」にして BACKLOG に残す。ユーザーに「何を作りますか？」と聞き返さない。聞くのは選んだ結果を見せるときだけ。

## 手順

### 1. 読み込む
- `public/shorts/PROFILE.md`(軸・採点・並べ方・学習メモ)
- `public/shorts/SOURCES.md`(作成済み)と `public/shorts/BACKLOG.md`(候補)

### 2. 候補が足りるか見る
- BACKLOG の「候補」状態が **5件未満**なら、次の手順で補充する。足りていれば手順4へ。

### 3. 候補を補充する
- PROFILE の軸ごとに、WebSearch で「有名な古典的研究」や「総説」を探す。検索語の例:
  - A: `trophic cascade classic study`, `keystone species removal experiment`
  - B: `mass extinction ecosystem recovery review`, `plate tectonics biodiversity`
  - C: `evolutionary psychology replicated finding`, `cooperation animals experiment`
  - D/E: `gut brain axis mouse study`, `parasite manipulates host behavior`
  - F: `E. O. Wilson island biogeography experiment`, `biophilia evidence`
  - 学習メモにある「境界・衝突・接触で何かが生まれる」型: `hybrid zone speciation`, `biotic interchange`
- 1つの候補につき、次を決める: 仮フック(問いで終える)、核心の事実(1文)、論文(仮)、軸。
- 再現されていない結果、検証が難しい結果は、「事実の確かさ=1」にして、`caveat` で扱えるときだけ残す。

### 4. 採点して選ぶ
- PROFILE の採点表で全候補に点を付ける(軸の適合 / 映像 / 確かさ / センターピン / 新規性)。
- 条件を満たさない候補は落とす。
- **並べ方の決まり**(同じ軸が続かない、ミクロとマクロを交互に、最初はA・B・F優先)を守って、上位から1〜3本を選ぶ。
- BACKLOG を更新する。順位・点の内訳・状態(選定)を書く。

### 5. ここで止める
- このスキルは**選ぶところまで**。動画は作らない。作るのは、ユーザーが「アプリ生成」「1本作って」と言ったときに動く `generate-short` の役目。
- 選んだものは、BACKLOG で状態を「選定」にして、順位の高い順に並べておく。

## ユーザーへの報告
次の形で短く返す。
- 選んだテーマと、仮のフック(1行ずつ)。
- なぜ選んだか(どの軸に当たるか。ユーザーの言葉のどこに近いか)。
- 見送った上位候補と、その理由。

## 学習(好みを更新する)
- ユーザーが反応(「最高」「微妙」「もっとこういうの」)を返したら、`PROFILE.md` の「学習メモ」に、**何に対する反応か**と**採点の変更**(加点・減点する軸や型)を追記する。
- 追記したら、BACKLOG の点を付け直して順位を更新する。
