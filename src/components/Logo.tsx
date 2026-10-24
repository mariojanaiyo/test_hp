/** 「スウガク / なんで？がわかる / nan_suu」のロゴ */
export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg';
  return (
    <div className="inline-flex flex-col items-center leading-none">
      <span className={`font-pop text-ink ${lg ? 'text-sm' : 'text-[10px]'} tracking-wider`}>
        なんで<span className="text-pop">？</span>がわかる
      </span>
      <span
        className={`font-pop text-pop ${lg ? 'text-6xl' : 'text-3xl'} mt-1`}
        style={{ WebkitTextStroke: `${lg ? 3 : 2}px var(--color-ink)`, paintOrder: 'stroke fill', textShadow: `${lg ? 3 : 2}px ${lg ? 4 : 3}px 0 var(--color-ink)` }}
      >
        スウガク
      </span>
      <span className={`font-pop text-ink/60 ${lg ? 'text-xs' : 'text-[9px]'} mt-1 tracking-widest`}>nan_suu</span>
    </div>
  );
}
