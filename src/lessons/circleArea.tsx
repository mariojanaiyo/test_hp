import { useState } from 'react';
import { Dim, PizzaArrangement, PopText, AQUA, POP, arrangedBox } from '../components/pizza';
import { prog, easeOut } from './math';
import type { Lesson } from './types';

const CX = 400;
const CY = 480;
const R = 190;

function Stage({ t }: { t: number }) {
  const cut = prog(t, 4, 7);
  const p8 = prog(t, 8, 12);
  const f16 = prog(t, 13.5, 14.5);
  const f48 = prog(t, 16, 17);
  const showFine = t >= 13.5;
  const b = arrangedBox(48, CX, CY, R);

  const labelsIn = prog(t, 18.6, 19.6);
  const tateIn = prog(t, 22.2, 23.4);
  const yokoIn = prog(t, 27.3, 28.7);
  const mid = (b.top + b.bottom) / 2;
  const popIn = easeOut(prog(t, 0, 0.6));

  return (
    <g>
      <g transform={`translate(${CX} ${CY}) scale(${t < 3.5 ? 0.9 + 0.1 * popIn : 1}) translate(${-CX} ${-CY})`}>
        <PizzaArrangement n={8} cx={CX} cy={CY} r={R} p={p8} cut={cut} opacity={showFine ? 1 - f16 : 1} />
      </g>
      {showFine && <PizzaArrangement n={16} cx={CX} cy={CY} r={R} p={1} opacity={f16 * (1 - f48)} />}
      {t >= 16 && <PizzaArrangement n={48} cx={CX} cy={CY} r={R} p={1} opacity={f48} />}

      {t >= 12.2 && t < 13.5 && (
        <PopText x={CX} y={b.bottom + 70} size={34} fill="#fff" opacity={prog(t, 12.2, 12.8)}>ギザギザ…</PopText>
      )}

      {/* たて */}
      {t >= 18.6 && (
        <g>
          <Dim x1={b.left - 30} y1={b.bottom} x2={b.left - 30} y2={b.top} color={AQUA} p={labelsIn} />
          <g transform={`translate(${b.left - 62} ${mid}) rotate(-90)`} opacity={labelsIn}>
            <PopText x={0} y={0} size={34} fill={AQUA}>{tateIn > 0.5 ? '半径' : 'たて'}</PopText>
          </g>
        </g>
      )}
      {/* よこ */}
      {t >= 18.6 && (
        <g>
          <Dim x1={b.left} y1={b.top - 34} x2={b.right} y2={b.top - 34} color={POP} p={labelsIn} />
          <PopText x={CX} y={b.top - 56} size={34} fill={POP} opacity={labelsIn}>
            {yokoIn > 0.5 ? '耳（円周）の半分' : 'よこ'}
          </PopText>
        </g>
      )}
      {t >= 27.3 && (
        <PopText x={CX} y={b.bottom + 70} size={30} fill="#fff" opacity={yokoIn}>
          耳は、上と下に半分ずつ！
        </PopText>
      )}
      {t >= 22.2 && t < 27 && (
        <PopText x={CX} y={b.bottom + 70} size={30} fill="#fff" opacity={tateIn}>
          ピザの中心から耳まで ＝ 半径
        </PopText>
      )}
    </g>
  );
}

const L1 = <span key="tate">たて ＝ <span className="c">半径</span></span>;
const L2 = <span key="yoko">よこ ＝ 円周の半分</span>;
const L3 = <span key="yoko2">＝ 直径×π÷2 ＝ <span className="m">半径×π</span></span>;
const L4 = <span key="s1">面積 ＝ たて × よこ</span>;
const L5 = <span key="s2">＝ <span className="c">半径</span> × (<span className="c">半径</span>×<span className="m">π</span>)</span>;
const L6 = <span key="s3">＝ <span className="c">半径</span>×<span className="c">半径</span>×<span className="m">π</span></span>;

function Playground() {
  const [half, setHalf] = useState(8);
  const [p, setP] = useState(1);
  const n = half * 2;
  const yoko = n * Math.sin(Math.PI / n);
  return (
    <div className="rounded-3xl border-4 border-ink bg-white p-4 sm:p-5">
      <svg viewBox="0 0 800 420" className="w-full rounded-2xl bg-sun" role="img"
        aria-label={`ピザを${n}等分して並べたようす`}>
        <PizzaArrangement n={n} cx={400} cy={210} r={165} p={p} />
      </svg>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          切る数: <span className="text-pop text-lg font-pop">{n}</span> 等分
          <input className="seek mt-1 w-full" type="range" min={2} max={50} value={half}
            onChange={(e) => setHalf(+e.target.value)} />
        </label>
        <label className="block text-sm font-bold">
          ならべる: {Math.round(p * 100)}%
          <input className="seek mt-1 w-full" type="range" min={0} max={1} step={0.01} value={p}
            onChange={(e) => setP(+e.target.value)} />
        </label>
      </div>
      <p className="mt-3 text-sm leading-relaxed">
        いまの「よこ」は、半径の <b className="text-pop text-lg">{yoko.toFixed(3)}</b> 倍くらい。
        細かく切るほど <b>3.14159…（π）</b> に近づくよ。
      </p>
    </div>
  );
}

export const circleArea: Lesson = {
  id: 'circle-area',
  no: 2,
  emoji: '🍕',
  title: '円の面積',
  why: '円の面積は、なんで「半径×半径×π」なの？',
  duration: 44,
  Stage,
  Playground,
  point: <>切ってならべると長方形<br />たて ＝ <span className="c">半径</span>、よこ ＝ <span className="m">半径×π</span><br />面積 ＝ 半径 × 半径 × π</>,
  scenes: [
    { at: 0, big: true, caption: <>円の面積の公式って<br />なんで <span className="m">半径×半径×π</span><br />なの？</> },
    { at: 3.5, caption: <>ピザを <span className="c">8等分</span> に<br />切ってみよう</> },
    { at: 7.5, caption: <>ピースを <span className="c">上・下</span> 交互に<br />向きをかえてならべる</> },
    { at: 13, caption: <>もっと <span className="m">細かく</span><br />切ったらどうなる？</> },
    { at: 18.5, caption: <><span className="m">長方形</span>っぽくなった！</> },
    { at: 22, caption: <>たては？<br />→ <span className="c">半径</span> だ！</>, formula: [L1] },
    { at: 27, caption: <>よこは？<br />→ <span className="m">耳の半分</span> だ！</>, formula: [L1, L2] },
    { at: 30.5, caption: <>円周は <span className="c">直径×π</span><br />だったよね</>, formula: [L1, L2, L3] },
    { at: 34, caption: <>かけ算すると…</>, formula: [L4, L5, L6] },
    { at: 40, big: true, caption: <>公式は<span className="c">ピザ</span>を思い出せば<br />自分で作れる！</>, formula: [L4, L5, L6] },
  ],
  steps: [
    {
      title: '円には角がない。どうやって面積を出す？',
      body: (
        <>
          面積は「たて × よこ」で出せるのは、四角形のとき。円にはたてもよこもありません。
          そこで発想をかえます。<b>切って、ならべかえて、知っている形にする。</b>
          切ってならべかえても、ピザのチーズの量（面積）は変わりません。これが大きなヒントです。
        </>
      ),
    },
    {
      title: '細かく切るほど、長方形に近づく',
      body: (
        <>
          8等分だとギザギザだけど、16、48…と細かく切るほどギザギザは小さくなって、ほぼ長方形になります。
          （この「限りなく近づける」考え方は、高校で習う<b>極限</b>につながります。）
          下の「いじってみよう」で、切る数を変えて確かめてみてください。
        </>
      ),
    },
    {
      title: 'たては「半径」',
      body: (
        <>
          ピースは中心から耳（ふち）まで。その長さは<b>半径</b>です。ならべても長さは変わらないので、
          長方形のたては<b>半径</b>になります。
        </>
      ),
    },
    {
      title: 'よこは「耳の半分」＝ 半径×π',
      body: (
        <>
          ピザの耳（円周）は、ならべると上と下に<b>半分ずつ</b>分かれます。だから、よこ ＝ 円周の半分。
          円周は<b>直径×π</b>（レッスン1）なので、
          よこ ＝ 直径×π÷2 ＝ 半径×2×π÷2 ＝ <b>半径×π</b> です。
        </>
      ),
    },
    {
      title: 'かけ算すると、公式のできあがり',
      body: (
        <>
          面積 ＝ たて × よこ ＝ 半径 × (半径×π) ＝ <b>半径×半径×π</b>。
          公式の中に半径が2回出てくるのは、「たての半径」と「よこの中にいる半径」だったんです。
        </>
      ),
    },
    {
      title: '覚えなくていい理由',
      body: (
        <>
          忘れても大丈夫。<b>ピザを切ってならべる</b>ところを思い出せば、「たては半径、よこは耳の半分」から、
          公式は何度でも自分で作り直せます。丸暗記より、ずっと強い武器です。
        </>
      ),
    },
  ],
  quiz: [
    {
      kind: 'choice',
      q: <>ピザを切ってならべた「長方形っぽい形」。<b>たて</b>の長さは何？</>,
      choices: ['半径', '直径', '円周', '円周の半分'],
      answer: 0,
      hintScene: 5,
      explain: <>ピースの「中心から耳まで」の長さ、つまり半径がそのままたてになります。</>,
    },
    {
      kind: 'choice',
      q: <>では、<b>よこ</b>の長さは何？</>,
      choices: ['半径', '直径', '円周', '円周の半分'],
      answer: 3,
      hintScene: 6,
      explain: <>耳は上と下に半分ずつ分かれてならぶので、よこは円周の半分（＝半径×π）です。</>,
    },
    {
      kind: 'number',
      q: <>半径 10cm のピザの面積は？（π＝3.14）</>,
      answer: 314,
      unit: 'cm²',
      hintScene: 8,
      explain: <>10 × 10 × 3.14 ＝ 314 cm²。</>,
    },
    {
      kind: 'number',
      q: <><b>直径</b> 8cm の丸いおせんべいの面積は？（π＝3.14）</>,
      answer: 50.24,
      tolerance: 0.01,
      unit: 'cm²',
      hintScene: 5,
      explain: <>公式に入れるのは半径！ 直径8cm → 半径4cm なので 4 × 4 × 3.14 ＝ 50.24 cm²。</>,
    },
  ],
};
