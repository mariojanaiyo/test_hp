import { PopText } from '../components/pizza';
import { prog } from './math';
import type { Lesson } from './types';

type Pt = [number, number];

// 鏡のように、円を台座にのせて描く
const O: Pt = [400, 440];
const R = 190;
const INK = '#2b1b3d';
const LINE = '#ffffff';
const X_COL = '#ffd36e';
const Y_COL = '#9cf5dc';
const X_DEEP = '#ffb23e';
const Y_DEEP = '#4fdcb4';
const CORAL = '#ff8f7a';

/** 数学の角度（反時計回り、真右が0°）で円周上の点 */
const onCircle = (deg: number): Pt => [O[0] + R * Math.cos((deg * Math.PI) / 180), O[1] - R * Math.sin((deg * Math.PI) / 180)];
const A_DEG = 200;
const B_DEG = 320;
const P0_DEG = 100;
const A = onCircle(A_DEG);
const B = onCircle(B_DEG);
const P0 = onCircle(P0_DEG);
const P1 = onCircle(P0_DEG + 180);

const ang = (from: Pt, to: Pt) => Math.atan2(to[1] - from[1], to[0] - from[0]);
const lerp = (p: Pt, q: Pt, k: number): Pt => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
const deg = (r: number) => (r * 180) / Math.PI;

/** center を要とする、to1 から to2 への小さい角の扇形と、その二等分線上の位置 */
function wedgeGeom(c: Pt, to1: Pt, to2: Pt, r: number) {
  const a1 = ang(c, to1);
  let d = ang(c, to2) - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const p1: Pt = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)];
  const p2: Pt = [c[0] + r * Math.cos(a1 + d), c[1] + r * Math.sin(a1 + d)];
  const path = `M${c[0]} ${c[1]} L${p1[0]} ${p1[1]} A${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${p2[0]} ${p2[1]} Z`;
  const mid = a1 + d / 2;
  return { path, mid, size: Math.abs(deg(d)) };
}

function Wedge({
  c, to1, to2, r, fill, label, labelR, opacity = 1, size = 28,
}: { c: Pt; to1: Pt; to2: Pt; r: number; fill: string; label?: string; labelR?: number; opacity?: number; size?: number }) {
  if (opacity <= 0) return null;
  const g = wedgeGeom(c, to1, to2, r);
  const lr = labelR ?? r + 24;
  return (
    <g opacity={opacity}>
      <path d={g.path} fill={fill} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {label && <PopText x={c[0] + lr * Math.cos(g.mid)} y={c[1] + lr * Math.sin(g.mid) + size * 0.35} size={size} fill="#fff">{label}</PopText>}
    </g>
  );
}

function Seg({ a, b, k = 1, w = 4, dash }: { a: Pt; b: Pt; k?: number; w?: number; dash?: string }) {
  if (k <= 0) return null;
  const e = lerp(a, b, k);
  return (
    <g strokeLinecap="round">
      <line x1={a[0]} y1={a[1]} x2={e[0]} y2={e[1]} stroke={INK} strokeWidth={w + 4} strokeDasharray={dash} />
      <line x1={a[0]} y1={a[1]} x2={e[0]} y2={e[1]} stroke={LINE} strokeWidth={w} strokeDasharray={dash} />
    </g>
  );
}

function Dot({ p, label, dx, dy, color = '#fff' }: { p: Pt; label: string; dx: number; dy: number; color?: string }) {
  return (
    <g>
      <circle cx={p[0]} cy={p[1]} r={9} fill={color} stroke={INK} strokeWidth={4} />
      <PopText x={p[0] + dx} y={p[1] + dy} size={36} fill="#fff">{label}</PopText>
    </g>
  );
}

/** 等しい長さの目印（短い横線） */
function Tick({ a, b }: { a: Pt; b: Pt }) {
  const m = lerp(a, b, 0.5);
  const th = ang(a, b) + Math.PI / 2;
  const dx = 11 * Math.cos(th);
  const dy = 11 * Math.sin(th);
  return (
    <g strokeLinecap="round">
      <line x1={m[0] - dx} y1={m[1] - dy} x2={m[0] + dx} y2={m[1] + dy} stroke={INK} strokeWidth={9} />
      <line x1={m[0] - dx} y1={m[1] - dy} x2={m[0] + dx} y2={m[1] + dy} stroke="#fff" strokeWidth={4} />
    </g>
  );
}

function Pedestal() {
  const cy = O[1] + R + 22;
  return (
    <g fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" opacity={0.85}>
      <ellipse cx={O[0]} cy={cy} rx={235} ry={46} />
      <path d={`M${O[0] - 235} ${cy} v56 a235 46 0 0 0 470 0 v-56`} />
      <path d={`M${O[0] - 150} ${cy + 14} q150 40 300 0`} opacity={0.45} />
    </g>
  );
}

function Stage({ t }: { t: number }) {
  // ---- 場面ごとの表示 ----
  const dance = t >= 34 && t < 43;
  const construct = t < 34;
  const danceDeg = dance ? P0_DEG + 62 * Math.sin(((t - 34) / 9) * Math.PI * 2 * 1.0) : P0_DEG;
  const P = dance ? onCircle(danceDeg) : P0;

  const diam = prog(t, 4.6, 6.6);
  const tri1 = prog(t, 9.4, 10.2) * (1 - prog(t, 21, 21.5));
  const tri2 = prog(t, 21.4, 22.2) * (1 - prog(t, 27, 27.5));
  const showX = t >= 10.2 && construct;
  const showExtA = t >= 15.4 && construct;
  const showY = t >= 22.2 && construct;
  const showExtB = t >= 23.5 && construct;
  const centralTotal = t >= 27.6 && construct;
  const hookWedges = t < 4.4 || !construct;
  const intro = 1;

  const centralDeg = wedgeGeom(O, A, B, 10).size;
  const inscribedDeg = wedgeGeom(P, A, B, 10).size;

  return (
    <g opacity={intro}>
      <Pedestal />
      <circle cx={O[0]} cy={O[1]} r={R} fill="#ffffff" fillOpacity={0.12} stroke="#fff" strokeWidth={5} />
      <circle cx={O[0]} cy={O[1]} r={R + 9} fill="none" stroke="#fff" strokeWidth={2} opacity={0.4} />

      {/* 三角形の塗り */}
      {tri1 > 0 && <polygon points={`${O} ${P} ${A}`} fill={X_COL} fillOpacity={0.45 * tri1} />}
      {tri2 > 0 && <polygon points={`${O} ${P} ${B}`} fill={Y_COL} fillOpacity={0.45 * tri2} />}

      {/* 基本の線 */}
      <Seg a={P} b={A} />
      <Seg a={P} b={B} />
      <Seg a={O} b={A} />
      <Seg a={O} b={B} />
      <Seg a={P} b={P1} k={construct ? diam : 0} dash="14 9" />

      {/* 中心角・円周角 */}
      {hookWedges && (
        <>
          <Wedge c={O} to1={A} to2={B} r={70} fill={CORAL} label={t < 4.4 ? '中心角' : `${Math.round(centralDeg)}°`} labelR={t < 4.4 ? 118 : 96} size={t < 4.4 ? 24 : 32} />
          <Wedge c={P} to1={A} to2={B} r={52} fill={X_COL} label={t < 4.4 ? undefined : `${Math.round(inscribedDeg)}°`} labelR={76} size={32} />
          {t < 4.4 && <PopText x={P[0] + 108} y={P[1] + 80} size={24} fill="#fff">円周角</PopText>}
        </>
      )}

      {showX && (
        <>
          <Wedge c={P} to1={O} to2={A} r={56} fill={X_COL} label="x" labelR={78} opacity={prog(t, 10.2, 10.9)} />
          <Wedge c={A} to1={O} to2={P} r={46} fill={X_COL} label="x" labelR={68} opacity={prog(t, 12, 12.7)} />
          {t < 21.5 && <><Tick a={O} b={P} /><Tick a={O} b={A} /></>}
        </>
      )}
      {showExtA && <Wedge c={O} to1={A} to2={P1} r={78} fill={X_DEEP} label="2x" labelR={106} opacity={prog(t, 15.4, 16.2)} size={34} />}

      {showY && (
        <>
          <Wedge c={P} to1={O} to2={B} r={64} fill={Y_COL} label="y" labelR={86} opacity={prog(t, 22.2, 22.9)} />
          <Wedge c={B} to1={O} to2={P} r={44} fill={Y_COL} label="y" labelR={66} opacity={prog(t, 22.9, 23.6)} />
          {t < 27.5 && <><Tick a={O} b={P} /><Tick a={O} b={B} /></>}
        </>
      )}
      {showExtB && <Wedge c={O} to1={P1} to2={B} r={78} fill={Y_DEEP} label="2y" labelR={106} opacity={prog(t, 23.5, 24.3)} size={34} />}

      {centralTotal && (
        <>
          <PopText x={O[0]} y={O[1] + 150} size={28} fill="#fff" opacity={prog(t, 27.6, 28.4)}>中心角 ＝ 2x ＋ 2y</PopText>
        </>
      )}

      {/* 点 */}
      <Dot p={A} label="A" dx={-30} dy={12} />
      <Dot p={B} label="B" dx={32} dy={12} />
      <Dot p={P} label="P" dx={0} dy={-22} />
      <Dot p={O} label="O" dx={-26} dy={34} color={CORAL} />
      {diam > 0.95 && construct && <Dot p={P1} label="P'" dx={30} dy={36} />}

    </g>
  );
}

const K1 = <span key="k1">中心角 ＝ 2x ＋ 2y</span>;
const K2 = <span key="k2">＝ 2 × (x ＋ y)</span>;
const K3 = <span key="k3">＝ 2 × <span className="c">円周角</span></span>;
const E1 = <span key="e1">∠AOP' ＝ x ＋ x ＝ <span className="c">2x</span></span>;
const E2 = <span key="e2">∠P'OB ＝ y ＋ y ＝ <span className="m">2y</span></span>;
const Z1 = <span key="z1">円周角 ＝ <span className="c">60°</span>（ずっと同じ）</span>;
const Z2 = <span key="z2">中心角 ＝ <span className="m">120°</span></span>;

export const inscribedAngle: Lesson = {
  id: 'inscribed-angle',
  no: 5,
  emoji: '🪞',
  title: '円周角の定理',
  why: '中心角は、なんで円周角の2倍なの？',
  theme: { bg: '#68add0', a: '#ffe27a', b: '#ffb09e', band: '#2f7fa8' },
  duration: 52,
  Stage,
  point: <>円周角は、同じ弧なら<span className="c">どこでも同じ</span><br />そして、中心角の<span className="m">半分</span></>,
  scenes: [
    { at: 0, big: true, caption: <><span className="c">中心角</span>って<br />なんで<span className="m">円周角</span>の<br />2倍？</> },
    { at: 4.4, caption: <>P から中心 O を通る線を<br />ひいてみよう</> },
    { at: 9.2, caption: <>OP と OA はどちらも<span className="c">半径</span><br />→ 二等辺三角形！</> },
    { at: 12, caption: <>二等辺三角形の<br /><span className="c">2つの底角は同じ</span></> },
    { at: 15.2, caption: <><span className="c">外角</span>は、となりあわない<br />2つの内角の和</>, formula: [E1] },
    { at: 21.2, caption: <>OP と OB も半径<br />→ また二等辺三角形！</> },
    { at: 23.4, caption: <>同じように…<br /><span className="m">外角 ＝ 2y</span></>, formula: [E1, E2] },
    { at: 27.5, caption: <>中心角を<br />足してみよう</>, formula: [K1, K2, K3] },
    { at: 31.5, big: true, caption: <>中心角は<br />円周角の<span className="m">2倍</span>！</>, formula: [K1, K2, K3] },
    { at: 34, caption: <>P を動かしても…？<br />円周角は変わらない！</>, formula: [Z1, Z2] },
    { at: 43, caption: <>同じ弧なら<br /><span className="c">円周角はぜんぶ同じ</span></>, formula: [Z1, Z2] },
    { at: 47.5, big: true, caption: <>三角形の<span className="c">2つの発見</span>から<br />自分で作れる！</>, formula: [K1, K2, K3] },
  ],
  steps: [
    {
      title: '中心角と円周角',
      body: (
        <>
          円の中心を頂点にした角が<b>中心角</b>、円周上の点を頂点にした角が<b>円周角</b>です。
          同じ弧（A から B まで）を見ている2つの角を比べると、中心角は円周角の<b>ちょうど2倍</b>になります。
        </>
      ),
    },
    {
      title: '作戦：中心を通る線をひく',
      body: (
        <>
          頂点 P から中心 O を通る線（直径）をひいて、反対側の点を P' とします。すると、
          半径どうしでできる<b>二等辺三角形</b>が2つ現れます（OP＝OA、OP＝OB）。
        </>
      ),
    },
    {
      title: '二等辺三角形の底角は等しい',
      body: (
        <>
          三角形 OPA は OP＝OA の二等辺三角形なので、底角 ∠OPA と ∠OAP は同じ大きさ。それを <b>x</b> とおきます。
          同じように三角形 OPB の底角を <b>y</b> とおきます。
        </>
      ),
    },
    {
      title: '外角は、中の2つの角の和',
      body: (
        <>
          三角形の<b>外角</b>（辺をのばしてできる角）は、となりあわない2つの内角の和に等しい。
          だから ∠AOP' ＝ x ＋ x ＝ <b>2x</b>、∠P'OB ＝ y ＋ y ＝ <b>2y</b>。
        </>
      ),
    },
    {
      title: '足すと、ちょうど2倍',
      body: (
        <>
          中心角 ∠AOB ＝ 2x ＋ 2y ＝ 2 × (x ＋ y)。そして円周角 ∠APB ＝ x ＋ y。
          だから<b>中心角 ＝ 円周角の2倍</b>です。
        </>
      ),
    },
    {
      title: 'P が動いても、円周角は同じ',
      body: (
        <>
          中心角（弧 AB で決まる）は P の場所と関係なく一定。その半分である円周角も、<b>P がどこにあっても同じ</b>です。
          これが「同じ弧に対する円周角は等しい」の理由です。直径に対する円周角が90°になるのも、中心角が180°だからです。
        </>
      ),
    },
    {
      title: '覚えなくていい理由',
      body: (
        <>
          「半径が2本 → 二等辺三角形 → 外角」と思い出せば、2倍になる理由は何度でも作れます。
          （中心が三角形の外にあるときは、足し算のかわりに引き算で同じように示せます。）
        </>
      ),
    },
  ],
  quiz: [
    {
      kind: 'choice',
      q: <>中心角が 100° のとき、同じ弧に対する円周角は？</>,
      choices: ['25°', '50°', '100°', '200°'],
      answer: 1,
      hintScene: 8,
      explain: <>円周角は中心角の半分なので 50°。</>,
    },
    {
      kind: 'number',
      q: <>円周角が 35° のとき、同じ弧に対する中心角は何度？</>,
      answer: 70,
      unit: '°',
      hintScene: 8,
      explain: <>中心角は円周角の2倍なので 35 × 2 ＝ 70°。</>,
    },
    {
      kind: 'choice',
      q: <>同じ弧 AB に対する円周角で、点 P を円周上で動かすと、角の大きさは？</>,
      choices: ['大きくなる', '小さくなる', '変わらない', '中心角と同じになる'],
      answer: 2,
      hintScene: 9,
      explain: <>弧 AB が決める中心角は一定。その半分の円周角も、P がどこにあっても同じです。</>,
    },
    {
      kind: 'number',
      q: <>AB が直径のとき、円周上の点 P から見た ∠APB は何度？</>,
      answer: 90,
      unit: '°',
      hintScene: 8,
      explain: <>直径に対する中心角は 180°。円周角はその半分なので 90° です。</>,
    },
  ],
};
