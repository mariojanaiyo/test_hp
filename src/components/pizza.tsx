import { clamp, deg, easeInOut, lerp } from '../lessons/math';

export const INK = '#2b1b3d';
export const AQUA = '#19e3d0';
export const POP = '#ff2d95';
export const CHEESE_A = '#fff6d8';
export const CHEESE_B = '#ffc77a';
export const CRUST = '#d98324';
export const PEPPERONI = '#e5247f';

/** 太さ付きの文字（SVG 用テロップ風） */
export function PopText({
  x, y, children, size = 34, fill = '#fff', anchor = 'middle', opacity = 1,
}: {
  x: number; y: number; children: React.ReactNode; size?: number; fill?: string;
  anchor?: 'start' | 'middle' | 'end'; opacity?: number;
}) {
  return (
    <text
      x={x} y={y} textAnchor={anchor} fontSize={size} fill={fill} opacity={opacity}
      className="svg-pop" strokeWidth={size * 0.28}
    >
      {children}
    </text>
  );
}

interface ArrangementProps {
  /** ピースの数（偶数） */
  n: number;
  cx: number;
  cy: number;
  r: number;
  /** 0: 丸いピザ → 1: ならべ終わり */
  p: number;
  /** 切れ目の線を描く進み具合 0→1（1 以降は各ピースの輪郭になる） */
  cut?: number;
  opacity?: number;
}

/** ならべ終わりの形の寸法（ラベル配置用） */
export function arrangedBox(n: number, cx: number, cy: number, r: number) {
  const th = (2 * Math.PI) / n;
  const a = r * Math.sin(th / 2);
  const h0 = r * Math.cos(th / 2);
  const x0 = cx - ((n - 1) * a) / 2;
  const yA = cy - h0 / 2;
  return { th, a, h0, x0, yA, left: x0 - a, right: x0 + (n - 1) * a + a, top: yA, bottom: yA + r };
}

/**
 * ピザを n 等分し、1枚ずつ向きをかえて交互にならべる。
 * 下半分のピースは「先が上」、上半分のピースは「先が下」になり、かみ合って長方形に近づく。
 */
export function PizzaArrangement({ n, cx, cy, r, p, cut = 1, opacity = 1 }: ArrangementProps) {
  const { th, a, h0, x0, yA } = arrangedBox(n, cx, cy, r);
  const half = n / 2;
  const hh = th / 2;
  const crustW = Math.max(3, r * 0.075);
  const r0 = r - crustW;

  const wedge = `M0 0 L${r * Math.cos(-hh)} ${r * Math.sin(-hh)} A${r} ${r} 0 0 1 ${r * Math.cos(hh)} ${r * Math.sin(hh)} Z`;
  const crust =
    `M${r0 * Math.cos(-hh)} ${r0 * Math.sin(-hh)} L${r * Math.cos(-hh)} ${r * Math.sin(-hh)} ` +
    `A${r} ${r} 0 0 1 ${r * Math.cos(hh)} ${r * Math.sin(hh)} L${r0 * Math.cos(hh)} ${r0 * Math.sin(hh)} ` +
    `A${r0} ${r0} 0 0 0 ${r0 * Math.cos(-hh)} ${r0 * Math.sin(-hh)} Z`;
  const pepR = Math.min(r * 0.11, 0.42 * 0.6 * r * th);
  const strokeW = n <= 16 ? 3 : n <= 32 ? 2 : n <= 64 ? 1.2 : 0.6;
  const outline = cut >= 1 ? 1 : 0;

  const sectors = Array.from({ length: n }, (_, j) => {
    const upper = j < half;
    // 丸いときの向き（真上が -90°）
    const beta = -Math.PI + (j + 0.5) * th;
    // ならべたときの位置
    const k = upper ? 2 * j + 1 : 2 * (half - 1 - (j - half));
    const tx = x0 + k * a;
    const ty = upper ? yA + h0 : yA;
    const targetRot = upper ? -90 : 90;
    // ピースごとに少しずつ遅らせて動かす
    const delay = (k / n) * 0.45;
    const e = easeInOut(clamp((p - delay) / (1 - 0.45)));
    const x = lerp(cx, tx, e);
    const y = lerp(cy, ty, e);
    const rot = lerp(deg(beta), targetRot, e);
    return (
      <g key={j} transform={`translate(${x} ${y}) rotate(${rot})`}>
        <path d={wedge} fill={upper ? CHEESE_B : CHEESE_A} stroke={INK} strokeOpacity={outline}
          strokeWidth={strokeW} strokeLinejoin="round" />
        <path d={crust} fill={CRUST} stroke={INK} strokeOpacity={outline} strokeWidth={strokeW * 0.6} strokeLinejoin="round" />
        <circle cx={0.6 * r} cy={0} r={pepR} fill={PEPPERONI} />
      </g>
    );
  });

  // 切れ目（円のまま見えるとき）
  const showCuts = p === 0 && cut > 0 && cut < 1;
  return (
    <g opacity={opacity}>
      {sectors}
      {p === 0 && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={strokeW} strokeOpacity={cut >= 1 ? 0 : 1} />
      )}
      {showCuts &&
        Array.from({ length: n }, (_, j) => {
          const ang = -Math.PI + j * th;
          const len = r * cut;
          return (
            <line key={j} x1={cx} y1={cy} x2={cx + len * Math.cos(ang)} y2={cy + len * Math.sin(ang)}
              stroke={INK} strokeWidth={strokeW} strokeLinecap="round" />
          );
        })}
    </g>
  );
}

/** 長さを示す線（両端に目印つき）。p で左→右（下→上）に伸びる */
export function Dim({
  x1, y1, x2, y2, color, p = 1, w = 7,
}: { x1: number; y1: number; x2: number; y2: number; color: string; p?: number; w?: number }) {
  if (p <= 0) return null;
  const ex = lerp(x1, x2, p);
  const ey = lerp(y1, y2, p);
  const horizontal = Math.abs(y2 - y1) < Math.abs(x2 - x1);
  const cap = 12;
  const nx = horizontal ? 0 : cap;
  const ny = horizontal ? cap : 0;
  return (
    <g strokeLinecap="round">
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={INK} strokeWidth={w + 5} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} stroke={INK} strokeWidth={w + 5} />
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={w} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} stroke={color} strokeWidth={w} />
      {p >= 1 && <>
        <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} stroke={INK} strokeWidth={w + 5} />
        <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} stroke={color} strokeWidth={w} />
      </>}
    </g>
  );
}
