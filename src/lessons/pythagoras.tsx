import { PopText } from '../components/pizza';
import { easeInOut, prog } from './math';
import type { Lesson } from './types';

type Pt = [number, number];

// 3-4-5 の直角三角形。単位は「タイル1枚の辺」。右上が直角の頂点 C、斜辺 AB は水平
const S = 56;
const X0 = 260;
const Y0 = 503;
const px = ([x, y]: Pt): Pt => [X0 + S * x, Y0 + S * y];
const A: Pt = [0, 0];
const B: Pt = [5, 0];
const C: Pt = [1.8, -2.4];
const D: Pt = [1.8, 0];
const As: Pt = [0, 5];
const Bs: Pt = [5, 5];
const Ds: Pt = [1.8, 5];
const Aa: Pt = [-2.4, -1.8];
const Ca: Pt = [-0.6, -4.2];
const Bb: Pt = [7.4, -3.2];
const Cb: Pt = [4.2, -5.6];

const WHITE = '#ffffff';
const INK = '#2b1b3d';
const C_A = '#d96b78';
const C_B = '#5f9e78';
const C_C = '#7b87b0';
const C_L = '#eaa2ab';
const C_R = '#a6d2b6';
const C_T = '#fff0a6';

const pts = (ps: Pt[]) => ps.map((p) => px(p).join(',')).join(' ');
const lerp2 = (p: Pt, q: Pt, k: number): Pt => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
const rotate = (p: Pt, c: Pt, deg: number): Pt => {
  const r = (deg * Math.PI) / 180;
  const dx = p[0] - c[0];
  const dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(r) - dy * Math.sin(r), c[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};
const center = (ps: Pt[]): Pt => [ps.reduce((a, p) => a + p[0], 0) / ps.length, ps.reduce((a, p) => a + p[1], 0) / ps.length];

/** 正方形の中のタイルの線 */
function Grid({ o, u, v, n, opacity }: { o: Pt; u: Pt; v: Pt; n: number; opacity: number }) {
  if (opacity <= 0) return null;
  const lines = [];
  for (let i = 1; i < n; i++) {
    const k = i / n;
    const a1 = px([o[0] + u[0] * k, o[1] + u[1] * k]);
    const a2 = px([o[0] + u[0] * k + v[0], o[1] + u[1] * k + v[1]]);
    const b1 = px([o[0] + v[0] * k, o[1] + v[1] * k]);
    const b2 = px([o[0] + v[0] * k + u[0], o[1] + v[1] * k + u[1]]);
    lines.push(<line key={`u${i}`} x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} />);
    lines.push(<line key={`v${i}`} x1={b1[0]} y1={b1[1]} x2={b2[0]} y2={b2[1]} />);
  }
  return <g stroke={WHITE} strokeWidth={1.6} opacity={opacity * 0.55}>{lines}</g>;
}

interface Leg {
  pivot: Pt;
  other: Pt;
  apexStart: Pt;
  apexEnd: Pt;
  rotDeg: number;
  /** 動画の中で、この脚の説明が始まる秒 */
  at: number;
}
const legA: Leg = { pivot: A, other: Aa, apexStart: Ca, apexEnd: B, rotDeg: 90, at: 14 };
const legB: Leg = { pivot: B, other: Bb, apexStart: Cb, apexEnd: A, rotDeg: -90, at: 30 };

function MovingTriangle({ t, leg }: { t: number; leg: Leg }) {
  const o = leg.at;
  if (t < o || t >= o + 11) return null;
  const sh1 = easeInOut(prog(t, o + 0.8, o + 2.8));
  const rot = easeInOut(prog(t, o + 4.4, o + 7));
  const sh2 = easeInOut(prog(t, o + 8, o + 10.4));
  const apex0 = lerp2(leg.apexStart, leg.apexEnd, sh1);
  let v0 = rotate(leg.other, leg.pivot, leg.rotDeg * rot);
  const v1 = leg.pivot;
  const v2 = rotate(apex0, leg.pivot, leg.rotDeg * rot);
  if (sh2 > 0) v0 = lerp2(C, D, sh2);
  const fade = Math.min(prog(t, o, o + 0.5), 1 - prog(t, o + 10.6, o + 11));
  return (
    <polygon points={pts([v0, v1, v2])} fill={C_T} fillOpacity={0.92 * fade} stroke={INK} strokeOpacity={fade}
      strokeWidth={4} strokeLinejoin="round" />
  );
}

function Stage({ t }: { t: number }) {
  const gridOp = prog(t, 4, 5) * (1 - prog(t, 13, 14));
  const split = prog(t, 9.6, 10.6);
  const altP = prog(t, 9.2, 10.8);
  const eqA = Math.min(prog(t, 25, 25.6), 1 - prog(t, 29.6, 30)) * (0.6 + 0.4 * Math.sin(t * 8));
  const eqB = Math.min(prog(t, 41, 41.6), 1 - prog(t, 45.6, 46)) * (0.6 + 0.4 * Math.sin(t * 8));
  const all = prog(t, 46, 46.6) * (0.6 + 0.4 * Math.sin(t * 6));
  const labA = 1 - Math.min(prog(t, 13.6, 14), 1 - prog(t, 24.6, 25));
  const labB = 1 - Math.min(prog(t, 29.6, 30), 1 - prog(t, 40.6, 41));

  const qa: Pt[] = [A, C, Ca, Aa];
  const qb: Pt[] = [C, B, Bb, Cb];
  const qc: Pt[] = [A, B, Bs, As];
  const rectL: Pt[] = [A, D, Ds, As];
  const rectR: Pt[] = [D, B, Bs, Ds];
  const cA = center(qa);
  const cB = center(qb);
  const cL = center(rectL);
  const cR = center(rectR);
  const cC = center(qc);
  const Cp = px(C);
  const Dp = px(D);
  const Dsp = px(Ds);

  const glow = (poly: Pt[], k: number) =>
    k > 0.02 ? <polygon points={pts(poly)} fill="none" stroke="#ffe36e" strokeWidth={9} strokeLinejoin="round" opacity={k} /> : null;

  return (
    <g>
      <polygon points={pts(qa)} fill={C_A} stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />
      <polygon points={pts(qb)} fill={C_B} stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />
      <polygon points={pts(qc)} fill={C_C} stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />
      <polygon points={pts(rectL)} fill={C_L} fillOpacity={split} stroke={WHITE} strokeWidth={3} strokeOpacity={split} />
      <polygon points={pts(rectR)} fill={C_R} fillOpacity={split} stroke={WHITE} strokeWidth={3} strokeOpacity={split} />
      <Grid o={A} u={[1.8, -2.4]} v={[-2.4, -1.8]} n={3} opacity={gridOp} />
      <Grid o={C} u={[3.2, 2.4]} v={[2.4, -3.2]} n={4} opacity={gridOp} />
      <Grid o={A} u={[5, 0]} v={[0, 5]} n={5} opacity={gridOp} />
      <polygon points={pts([A, B, C])} fill={C_T} stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />
      {altP > 0 && (
        <line x1={Cp[0]} y1={Cp[1]} x2={Cp[0]} y2={Cp[1] + (Dsp[1] - Cp[1]) * altP} stroke={WHITE} strokeWidth={4} strokeDasharray="10 7" />
      )}
      {altP >= 1 && <rect x={Dp[0] - 18} y={Dp[1] - 18} width={18} height={18} fill="none" stroke={WHITE} strokeWidth={3} />}
      <MovingTriangle t={t} leg={legA} />
      <MovingTriangle t={t} leg={legB} />
      {glow(qa, eqA)}
      {glow(rectL, eqA)}
      {glow(qb, eqB)}
      {glow(rectR, eqB)}
      {glow(qa, all)}
      {glow(qb, all)}
      {glow(qc, all)}

      {/* 辺の記号と面積のラベル */}
      <PopText x={px([1.15, -1.0])[0]} y={px([1.15, -1.0])[1]} size={28} fill={WHITE}>a</PopText>
      <PopText x={px([3.4, -0.85])[0]} y={px([3.4, -0.85])[1]} size={28} fill={WHITE}>b</PopText>
      <PopText x={px(cA)[0]} y={px(cA)[1] + 14} size={44} fill={WHITE} opacity={labA}>a²</PopText>
      <PopText x={px(cB)[0]} y={px(cB)[1] + 14} size={44} fill={WHITE} opacity={labB}>b²</PopText>
      <PopText x={px(cC)[0]} y={px(cC)[1] + 14} size={50} fill={WHITE} opacity={1 - split}>c²</PopText>
      {gridOp > 0.5 && t < 9.4 && (
        <>
          <PopText x={px(cA)[0]} y={px(cA)[1] + 60} size={26} fill="#fff7c2" opacity={gridOp}>9まい</PopText>
          <PopText x={px(cB)[0]} y={px(cB)[1] + 60} size={26} fill="#fff7c2" opacity={gridOp}>16まい</PopText>
          <PopText x={px(cC)[0]} y={px(cC)[1] + 64} size={26} fill="#fff7c2" opacity={gridOp}>25まい</PopText>
        </>
      )}
      {split > 0.5 && (
        <>
          <PopText x={px(cL)[0]} y={px(cL)[1] + 48} size={34} fill={WHITE} opacity={t < 14 || (t >= 25 && t < 30) || t >= 41 ? 1 : 0.0}>左</PopText>
          <PopText x={px(cR)[0]} y={px(cR)[1] + 48} size={34} fill={WHITE} opacity={t < 30 || t >= 41 ? 1 : 0.0}>右</PopText>
        </>
      )}
    </g>
  );
}

const F1 = <span key="f1">3×3 ＋ 4×4 ＝ 5×5</span>;
const F2 = <span key="f2">9 ＋ 16 ＝ 25</span>;
const G1 = <span key="g1"><span className="c">a²</span> ＝ 左の長方形</span>;
const G2 = <span key="g2"><span className="m">b²</span> ＝ 右の長方形</span>;
const H1 = <span key="h1"><span className="c">a²</span> ＋ <span className="m">b²</span> ＝ 左 ＋ 右</span>;
const H2 = <span key="h2">＝ c²</span>;
const H3 = <span key="h3">a² ＋ b² ＝ c²</span>;

export const pythagoras: Lesson = {
  id: 'pythagoras',
  no: 4,
  emoji: '📐',
  title: '三平方の定理',
  why: '三平方の定理は、なんで a²＋b²＝c² なの？',
  theme: { bg: '#a9b3d4', a: '#fff08a', b: '#ffb3c0', band: '#6c78a5' },
  duration: 56,
  Stage,
  point: <>直角三角形の3辺に正方形（タイル）<br />小さい2つの面積の和 ＝ 大きい1つ<br /><span className="c">a² ＋ b² ＝ c²</span></>,
  scenes: [
    { at: 0, big: true, caption: <>三平方の定理って<br />なんで <span className="c">a²＋b²＝c²</span><br />なの？</> },
    { at: 4, caption: <>3辺に<span className="c">正方形のタイル</span>を<br />しきつめてみよう</>, formula: [F1, F2] },
    { at: 9.5, caption: <>いちばん大きい正方形を<br /><span className="m">2つの長方形</span>に分ける</> },
    { at: 14, caption: <><span className="c">a²</span> の半分の三角形。<br />頂点をずらしても面積は同じ</> },
    { at: 17.8, caption: <><span className="c">90°</span> 回すと<br />ぴったり重なる別の三角形</> },
    { at: 21.6, caption: <>また頂点をずらすと<br /><span className="m">長方形の半分</span>！</> },
    { at: 25, caption: <>半分どうしが同じだから<br />ぜんぶも同じ！</>, formula: [G1] },
    { at: 30, caption: <>こんどは <span className="m">b²</span> でやってみよう<br />半分の三角形…</> },
    { at: 33.8, caption: <><span className="c">90°</span> 回して…</> },
    { at: 37.6, caption: <>ずらして<br /><span className="m">長方形の半分</span>！</> },
    { at: 41, caption: <>だから <span className="m">b²</span> ＝ 右の長方形</>, formula: [G1, G2] },
    { at: 46, caption: <>左 ＋ 右 ＝ いちばん大きい正方形</>, formula: [H1, H2] },
    { at: 51, big: true, caption: <>タイルで考えれば<br />公式は<span className="c">自分で作れる</span>！</>, formula: [H3] },
  ],
  steps: [
    {
      title: '長さの2乗は、正方形のタイルの枚数',
      body: (
        <>
          直角三角形の3辺（短い辺 a、b と、いちばん長い斜辺 c）に、それぞれ正方形をつくります。
          長さの2乗は、その正方形の<b>面積（タイルの枚数）</b>です。3・4・5 の三角形なら、
          3×3＝9まいと 4×4＝16まいを合わせると、5×5＝25まいにぴったりになります。
        </>
      ),
    },
    {
      title: '証明の作戦：大きい正方形を2つに分ける',
      body: (
        <>
          直角の頂点から斜辺に垂直な線をおろし、c² を<b>左右2つの長方形</b>に分けます。
          a² が左の長方形、b² が右の長方形と同じ面積だとわかれば、足して c² になります。
        </>
      ),
    },
    {
      title: '面積が変わらない2つのワザ',
      body: (
        <>
          ① 三角形の底辺を固定して、頂点を底辺と<b>平行にずらしても</b>面積は変わらない。
          ② 三角形を<b>回転しても</b>面積は変わらない（合同だから）。
          この2つだけで、形をつくりかえます。
        </>
      ),
    },
    {
      title: 'a² ＝ 左の長方形',
      body: (
        <>
          a² の正方形の半分の三角形 → ずらしても同じ面積 → 90°回すと別の三角形 → ずらすと左の長方形の半分。
          半分どうしが同じなので、<b>a² ＝ 左の長方形</b>です。
        </>
      ),
    },
    {
      title: 'b² ＝ 右の長方形、そして足し算',
      body: (
        <>
          右側も同じ手順で、<b>b² ＝ 右の長方形</b>。左と右を合わせると c² 全体なので、
          <b>a² ＋ b² ＝ c²</b>。どんな直角三角形でも、この手順は同じように使えます。
        </>
      ),
    },
    {
      title: '覚えなくていい理由',
      body: (
        <>
          「3辺にタイル → 大きい正方形を2つに分けて、半分の三角形で比べる」と思い出せば、公式は作り直せます。
          三平方の定理の証明は100通り以上あると言われています。自分のお気に入りを探してみるのも楽しいです。
        </>
      ),
    },
  ],
  quiz: [
    {
      kind: 'choice',
      q: <>直角をはさむ2辺が 3cm と 4cm の直角三角形。斜辺の長さは？</>,
      choices: ['5cm', '6cm', '7cm', '12cm'],
      answer: 0,
      hintScene: 1,
      explain: <>3×3 ＋ 4×4 ＝ 25 ＝ 5×5 なので、斜辺は 5cm です。</>,
    },
    {
      kind: 'number',
      q: <>直角をはさむ2辺が 6cm と 8cm。斜辺は何 cm？</>,
      answer: 10,
      unit: 'cm',
      hintScene: 11,
      explain: <>6×6 ＋ 8×8 ＝ 36 ＋ 64 ＝ 100。10×10 ＝ 100 なので 10cm。</>,
    },
    {
      kind: 'number',
      q: <>斜辺が 13cm、1辺が 5cm の直角三角形。もう1辺は何 cm？</>,
      answer: 12,
      unit: 'cm',
      hintScene: 11,
      explain: <>13×13 － 5×5 ＝ 169 － 25 ＝ 144。12×12 ＝ 144 なので 12cm。</>,
    },
    {
      kind: 'choice',
      q: <>斜辺の正方形を、直角の頂点からおろした線で2つに分けた。a² と同じ面積なのは？</>,
      choices: ['a 側（左）の長方形', 'b 側（右）の長方形', 'c² ぜんぶ', 'どれでもない'],
      answer: 0,
      hintScene: 6,
      explain: <>a² の半分の三角形を回してずらすと、左の長方形の半分になります。だから a² ＝ 左の長方形。</>,
    },
  ],
};
