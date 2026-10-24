import { AQUA, CHEESE_A, CHEESE_B, INK, PEPPERONI, POP, PopText } from '../components/pizza';
import { easeInOut, easeOut, prog } from './math';
import type { Lesson } from './types';

// 三角形（三角ピザ）の頂点
const P1 = { x: 110, y: 700 };
const P2 = { x: 590, y: 700 };
const P3 = { x: 260, y: 370 };
const BASE = P2.x - P1.x;
const HEIGHT = P1.y - P3.y;
const M = { x: (P2.x + P3.x) / 2, y: (P2.y + P3.y) / 2 };
const tri = `${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}`;

function Defs() {
  return (
    <defs>
      {[['dotsA', CHEESE_A], ['dotsB', CHEESE_B]].map(([id, bg]) => (
        <pattern key={id} id={`tri-${id}`} width="70" height="70" patternUnits="userSpaceOnUse">
          <rect width="70" height="70" fill={bg} />
          <circle cx="18" cy="20" r="9" fill={PEPPERONI} />
          <circle cx="52" cy="52" r="9" fill={PEPPERONI} />
        </pattern>
      ))}
      <clipPath id="tri-keep"><rect x={P3.x} y="300" width="600" height="460" /></clipPath>
      <clipPath id="tri-wedge"><rect x="60" y="300" width={P3.x - 60} height="460" /></clipPath>
    </defs>
  );
}

function Pieces({ rot, copyOpacity }: { rot: number; copyOpacity: number }) {
  return (
    <>
      <polygon points={tri} fill="url(#tri-dotsA)" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <g transform={`rotate(${rot} ${M.x} ${M.y})`} opacity={copyOpacity}>
        <polygon points={tri} fill="url(#tri-dotsB)" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </>
  );
}

function Stage({ t }: { t: number }) {
  const pop = easeOut(prog(t, 0, 0.6));
  const labelIn = prog(t, 4, 5);
  const copyIn = prog(t, 8.2, 9);
  const rot = 180 * easeInOut(prog(t, 9.6, 12));
  const slide = BASE * easeInOut(prog(t, 18, 21));
  const rectIn = prog(t, 23, 24);
  const dim = prog(t, 30, 31);

  return (
    <g>
      <Defs />
      <g transform={`translate(${P1.x + BASE / 2} 600) scale(${0.85 + 0.15 * pop}) translate(${-(P1.x + BASE / 2)} -600)`}>
        {slide > 0 ? (
          <>
            <g clipPath="url(#tri-keep)"><Pieces rot={180} copyOpacity={1 - 0.65 * dim} /></g>
            <g transform={`translate(${slide} 0)`}>
              <g clipPath="url(#tri-wedge)"><Pieces rot={180} copyOpacity={1 - 0.65 * dim} /></g>
            </g>
          </>
        ) : (
          <Pieces rot={rot} copyOpacity={copyIn} />
        )}
      </g>

      {/* 三角形の底辺と高さ */}
      {t >= 4 && t < 17.5 && (
        <g opacity={labelIn * (1 - prog(t, 16.5, 17.2))}>
          <line x1={P1.x} y1={P1.y + 30} x2={P2.x} y2={P1.y + 30} stroke={INK} strokeWidth={12} strokeLinecap="round" />
          <line x1={P1.x} y1={P1.y + 30} x2={P2.x} y2={P1.y + 30} stroke={AQUA} strokeWidth={7} strokeLinecap="round" />
          <PopText x={P1.x + BASE / 2} y={P1.y + 78} size={34} fill={AQUA}>底辺</PopText>
          <line x1={P3.x} y1={P3.y} x2={P3.x} y2={P1.y} stroke={INK} strokeWidth={9} strokeDasharray="14 10" />
          <line x1={P3.x} y1={P3.y} x2={P3.x} y2={P1.y} stroke={POP} strokeWidth={5} strokeDasharray="14 10" />
          <rect x={P3.x} y={P1.y - 26} width={26} height={26} fill="none" stroke={INK} strokeWidth={4} />
          <PopText x={P3.x - 18} y={(P3.y + P1.y) / 2} size={34} fill={POP} anchor="end">高さ</PopText>
        </g>
      )}

      {/* 回転の中心 */}
      {t >= 8.6 && t < 12.6 && (
        <g opacity={prog(t, 8.6, 9.2) * (1 - prog(t, 12, 12.6))}>
          <circle cx={M.x} cy={M.y} r={13} fill={POP} stroke={INK} strokeWidth={4} />
          <PopText x={M.x + 24} y={M.y - 24} size={30} fill="#fff" anchor="start">この点を中心に</PopText>
        </g>
      )}

      {/* 平行四辺形 */}
      {t >= 13 && t < 17.5 && (
        <PopText x={420} y={P3.y - 36} size={38} fill="#fff" opacity={prog(t, 13, 13.8) * (1 - prog(t, 16.5, 17.2))}>
          平行四辺形！
        </PopText>
      )}
      {t >= 18 && t < 23.5 && (
        <PopText x={400} y={P3.y - 36} size={30} fill="#fff" opacity={prog(t, 17.6, 18.2)}>
          ここを切って、反対側へ！
        </PopText>
      )}

      {/* 長方形のたて・よこ */}
      {t >= 23 && (
        <g opacity={rectIn}>
          <line x1={P3.x} y1={P1.y + 30} x2={P3.x + BASE} y2={P1.y + 30} stroke={INK} strokeWidth={12} strokeLinecap="round" />
          <line x1={P3.x} y1={P1.y + 30} x2={P3.x + BASE} y2={P1.y + 30} stroke={AQUA} strokeWidth={7} strokeLinecap="round" />
          <PopText x={P3.x + BASE / 2} y={P1.y + 78} size={34} fill={AQUA}>よこ ＝ 底辺</PopText>
          <line x1={P3.x - 26} y1={P3.y} x2={P3.x - 26} y2={P1.y} stroke={INK} strokeWidth={12} strokeLinecap="round" />
          <line x1={P3.x - 26} y1={P3.y} x2={P3.x - 26} y2={P1.y} stroke={POP} strokeWidth={7} strokeLinecap="round" />
          <g transform={`translate(${P3.x - 58} ${(P3.y + P1.y) / 2}) rotate(-90)`}>
            <PopText x={0} y={0} size={34} fill={POP}>たて ＝ 高さ</PopText>
          </g>
        </g>
      )}
      {t >= 31 && (
        <PopText x={400} y={P3.y - 36} size={40} fill="#fff" opacity={dim}>
          元の三角形は{' '}半分！
        </PopText>
      )}
    </g>
  );
}

const T1 = <span key="t1">長方形 ＝ <span className="c">底辺</span> × <span className="m">高さ</span></span>;
const T2 = <span key="t2">三角形 ＝ 長方形の半分</span>;
const T3 = <span key="t3">＝ <span className="c">底辺</span> × <span className="m">高さ</span> ÷ 2</span>;

export const triangleArea: Lesson = {
  id: 'triangle-area',
  no: 3,
  emoji: '🔺',
  title: '三角形の面積',
  why: '三角形の面積は、なんで「底辺×高さ÷2」なの？',
  theme: { bg: '#b977ab', a: '#8ff0d0', b: '#ffd49a', band: '#7d4a8f' },
  duration: 40,
  Stage,
  point: <>三角形 ＝ <span className="c">2枚で長方形</span> の半分<br />底辺 × 高さ ÷ 2</>,
  scenes: [
    { at: 0, big: true, caption: <>三角形の面積って<br />なんで <span className="m">÷2</span> なの？</> },
    { at: 3.5, caption: <>三角ピザの<br /><span className="c">底辺</span> と <span className="m">高さ</span></> },
    { at: 8, caption: <>同じピザをもう1枚<br />くるっと回して…</> },
    { at: 13, caption: <>2枚合わせると<br /><span className="m">平行四辺形</span>！</> },
    { at: 17.5, caption: <>はみ出した<span className="c">三角</span>を<br />反対側へ</> },
    { at: 23, caption: <><span className="m">長方形</span>になった！</>, formula: [T1] },
    { at: 28, caption: <>これは三角形<span className="c">2枚分</span><br />だったよね</>, formula: [T1] },
    { at: 30.5, caption: <>だから三角形は<br />その <span className="m">半分</span>！</>, formula: [T1, T2, T3] },
    { at: 36, big: true, caption: <>「2枚で長方形」<br />を思い出せば<span className="c">OK</span>！</>, formula: [T1, T2, T3] },
  ],
  steps: [
    {
      title: '三角形のままでは、面積は出しにくい',
      body: (
        <>
          長方形なら「たて × よこ」。でも三角形は斜めの辺があって、そのままではかけ算できません。
          そこで、<b>同じ三角形をもう1つ</b>用意します。
        </>
      ),
    },
    {
      title: '2つ合わせると平行四辺形になる',
      body: (
        <>
          同じ三角形を、斜めの辺の真ん中を中心に<b>180°回して</b>くっつけると、ぴったり<b>平行四辺形</b>になります。
          平行四辺形の底辺と高さは、元の三角形と同じです。
        </>
      ),
    },
    {
      title: '平行四辺形は、切ってずらすと長方形',
      body: (
        <>
          はみ出した三角をちょん切って反対側に移すと、<b>長方形</b>になります。
          たて ＝ 三角形の高さ、よこ ＝ 三角形の底辺。面積は 底辺 × 高さ です。
        </>
      ),
    },
    {
      title: 'もとの三角形は、その半分',
      body: (
        <>
          長方形は三角形<b>2枚分</b>だったので、三角形1枚は半分。つまり
          <b>三角形の面積 ＝ 底辺 × 高さ ÷ 2</b>。「÷2」は、2枚合わせて作ったから出てくるんです。
        </>
      ),
    },
    {
      title: '覚えなくていい理由',
      body: (
        <>
          「2枚で長方形」と思い出せば、「÷2」を忘れることはありません。
          形がちがう三角形（とがった三角形、広がった三角形）でも、同じように2枚合わせて考えられます。
        </>
      ),
    },
  ],
  quiz: [
    {
      kind: 'choice',
      q: <>同じ三角形を2つ合わせて（180°回してくっつけて）できる形は？</>,
      choices: ['台形', '平行四辺形', 'ひし形', '円'],
      answer: 1,
      hintScene: 3,
      explain: <>斜めの辺の真ん中を中心に回してくっつけると、平行四辺形になります。</>,
    },
    {
      kind: 'number',
      q: <>底辺 10cm、高さ 6cm の三角形の面積は？</>,
      answer: 30,
      unit: 'cm²',
      hintScene: 7,
      explain: <>10 × 6 ÷ 2 ＝ 30 cm²。</>,
    },
    {
      kind: 'choice',
      q: <>底辺 8cm・高さ 5cm の三角形は、同じ底辺・高さの長方形の面積の何倍？</>,
      choices: ['1倍', '2倍', '半分（1/2倍）', '4分の1倍'],
      answer: 2,
      hintScene: 6,
      explain: <>長方形は三角形2枚分なので、三角形は長方形の半分です。</>,
    },
  ],
};
