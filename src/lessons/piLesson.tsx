import { AQUA, CHEESE_A, CRUST, INK, PEPPERONI, POP, PopText } from '../components/pizza';
import { easeInOut, easeOut, prog } from './math';
import type { Lesson } from './types';

const FRAC = 0.14159;

interface UnrollProps {
  cx: number; cy: number; r: number; lineY: number;
  /** 耳をほどいた割合 0→1 */
  p: number;
  /** 棒の進み具合。0〜3 が直径の棒1〜3本め、3〜4 があまり */
  bp: number;
  showDiameter: boolean;
  opacity?: number;
}

function Unroll({ cx, cy, r, lineY, p, bp, showDiameter, opacity = 1 }: UnrollProps) {
  const d = 2 * r;
  const circ = Math.PI * d;
  const x0 = cx - circ / 2;
  const crustW = Math.max(7, r * 0.14);
  const rc = r - crustW / 2;
  const L = 2 * Math.PI * rc;
  const barH = Math.max(30, r * 0.46);
  const barY = lineY + 20;
  const done = (i: number) => Math.min(1, Math.max(0, bp - i));
  const rem = Math.min(1, Math.max(0, bp - 3));

  return (
    <g opacity={opacity}>
      {/* ピザ本体 */}
      <circle cx={cx} cy={cy} r={r} fill={CHEESE_A} stroke={INK} strokeWidth={4} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i * Math.PI) / 3 + 0.4;
        return <circle key={i} cx={cx + 0.5 * r * Math.cos(a)} cy={cy + 0.5 * r * Math.sin(a)} r={r * 0.13} fill={PEPPERONI} />;
      })}
      {/* 耳（ほどけていく） */}
      <path
        d={`M${cx} ${cy - rc} A${rc} ${rc} 0 1 1 ${cx} ${cy + rc} A${rc} ${rc} 0 1 1 ${cx} ${cy - rc}`}
        fill="none" stroke={CRUST} strokeWidth={crustW} strokeLinecap="butt"
        strokeDasharray={`${L * (1 - p)} ${L * 2}`} strokeDashoffset={-L * p}
      />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={4} />
      {showDiameter && (
        <g strokeLinecap="round">
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={INK} strokeWidth={13} />
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={AQUA} strokeWidth={8} />
        </g>
      )}
      {/* ほどいた耳 */}
      {p > 0 && (
        <g strokeLinecap="round">
          <line x1={x0} y1={lineY} x2={x0 + circ * p} y2={lineY} stroke={INK} strokeWidth={crustW + 6} />
          <line x1={x0} y1={lineY} x2={x0 + circ * p} y2={lineY} stroke={CRUST} strokeWidth={crustW} />
        </g>
      )}
      {/* 直径の棒 */}
      {[0, 1, 2].map((i) =>
        done(i) > 0 ? (
          <g key={i}>
            <rect x={x0 + i * d} y={barY} width={d * done(i)} height={barH} fill={AQUA} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            {done(i) >= 1 && (
              <PopText x={x0 + i * d + d / 2} y={barY + barH * 0.72} size={barH * 0.62} fill="#fff">{i + 1}</PopText>
            )}
          </g>
        ) : null,
      )}
      {rem > 0 && (
        <g>
          <rect x={x0 + 3 * d} y={barY} width={d * FRAC * rem} height={barH} fill={POP} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          {rem >= 1 && (
            <PopText x={x0 + 3 * d + (d * FRAC) / 2} y={barY + barH + barH * 0.95} size={barH * 0.62} fill={POP}>
              あまり 0.14…
            </PopText>
          )}
        </g>
      )}
    </g>
  );
}

function Stage({ t }: { t: number }) {
  const pop = easeOut(prog(t, 0, 0.6));
  const p1 = easeInOut(prog(t, 4.2, 9));
  const bp1 = t < 12.6 ? 3 * prog(t, 9.4, 12.6) : 3 + prog(t, 12.9, 13.9);
  const row2In = easeOut(prog(t, 17, 17.8));
  const p2 = easeInOut(prog(t, 17.8, 19.8));
  const bp2 = t < 21.4 ? 3 * prog(t, 19.9, 21.4) : 3 + prog(t, 21.5, 22.2);
  const diaLabel = prog(t, 0.8, 1.4) * (1 - prog(t, 4, 4.4));

  return (
    <g>
      <g transform={`translate(400 350) scale(${0.85 + 0.15 * pop}) translate(-400 -350)`}>
        <Unroll cx={400} cy={350} r={85} lineY={500} p={p1} bp={bp1} showDiameter={t < 9.2} />
      </g>
      {diaLabel > 0 && <PopText x={400} y={266} size={32} fill={AQUA} opacity={diaLabel}>直径（はしからはし）</PopText>}
      {t >= 17 && (
        <>
          <Unroll cx={400} cy={640} r={52} lineY={722} p={p2} bp={bp2} showDiameter={t < 19.8} opacity={row2In} />
        </>
      )}
    </g>
  );
}

const A1 = <span key="a1">円周 ÷ 直径 ＝ <span className="m">π</span> ＝ 3.14159…</span>;
const A2 = <span key="a2">円周 ＝ 直径 × <span className="m">π</span></span>;

export const piLesson: Lesson = {
  id: 'pi',
  no: 1,
  emoji: '🍕',
  title: '円周率 π',
  why: 'πって、そもそもなんの数なの？',
  duration: 32,
  Stage,
  point: <>耳は直径の <span className="m">約3.14本ぶん</span><br />円周 ＝ 直径 × π</>,
  scenes: [
    { at: 0, big: true, caption: <>円周率 <span className="m">π</span> って<br />そもそもなんの数？</> },
    { at: 3.5, caption: <>ピザの <span className="c">耳</span>（円周）を<br />ほどいてみよう</> },
    { at: 9.2, caption: <><span className="c">直径</span>の長さの棒で<br />耳をはかると…</> },
    { at: 13, caption: <>だいたい <span className="m">3つ</span> と<br /><span className="c">ちょっと</span>！</> },
    { at: 16.8, caption: <>ちいさいピザでも<br />やってみよう</> },
    { at: 22.6, big: true, caption: <>どんな大きさでも<br /><span className="m">3つとちょっと</span>！</>, formula: [A1] },
    { at: 27.5, caption: <>この数が<br /><span className="m">円周率 π</span> だ！</>, formula: [A1, A2] },
  ],
  steps: [
    {
      title: 'πは「円周は直径の何倍か」という数',
      body: (
        <>
          大きいピザも小さいピザも、<b>耳（円周）の長さ ÷ 直径</b>を計算すると、不思議といつも同じ数になります。
          その数が<b>円周率 π</b>（約3.14）です。
        </>
      ),
    },
    {
      title: 'ピザの耳を、直径の棒で測ってみる',
      body: (
        <>
          耳をまっすぐにほどいて、直径と同じ長さの棒をならべると、<b>3本とちょっと</b>（0.14…本ぶん）。
          つまり耳の長さは「直径の約3.14倍」。だから <b>円周 ＝ 直径 × π</b> です。
        </>
      ),
    },
    {
      title: 'なんでいつも同じ数になるの？',
      body: (
        <>
          ピザを2倍に拡大すると、直径も耳の長さも<b>ちょうど2倍</b>。割り算の答えは変わりません。
          円はどんな大きさでも「同じ形（拡大・縮小）」だから、いつも同じ数になるんです。
        </>
      ),
    },
    {
      title: 'πは、ずっと続く数',
      body: (
        <>
          π ＝ 3.14159265… と、割り切れずにどこまでも続きます。ふだんの計算では<b>3.14</b>を使います。
          半径がわかっているときは、直径＝半径×2 なので、円周 ＝ 半径×2×π です。
        </>
      ),
    },
    {
      title: '覚えなくていい理由',
      body: (
        <>
          「円周の公式」は、「耳は直径の3.14本ぶん」と思い出せばすぐ作れます。
          次のレッスンでは、このπを使って、円の面積の公式を作ります。
        </>
      ),
    },
  ],
  quiz: [
    {
      kind: 'choice',
      q: <>ピザの耳（円周）の長さは、直径のだいたい何倍？</>,
      choices: ['約2倍', '約3.14倍', '約4倍', '約6.28倍'],
      answer: 1,
      hintScene: 3,
      explain: <>直径の棒が3本とちょっと（0.14…）。これが円周率πです。</>,
    },
    {
      kind: 'number',
      q: <>直径 10cm のピザの、耳（円周）の長さは？（π＝3.14）</>,
      answer: 31.4,
      tolerance: 0.01,
      unit: 'cm',
      hintScene: 5,
      explain: <>10 × 3.14 ＝ 31.4 cm。</>,
    },
    {
      kind: 'number',
      q: <><b>半径</b> 3cm のピザの、耳（円周）の長さは？（π＝3.14）</>,
      answer: 18.84,
      tolerance: 0.01,
      unit: 'cm',
      hintScene: 5,
      explain: <>半径3cm → 直径6cm。6 × 3.14 ＝ 18.84 cm。</>,
    },
  ],
};
