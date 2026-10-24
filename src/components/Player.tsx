import { AnimatePresence, motion } from 'motion/react';
import { isValidElement } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { Lesson } from '../lessons/types';
import type { usePlayer } from './usePlayer';

type PlayerState = ReturnType<typeof usePlayer>;

export const sceneIndexAt = (lesson: Lesson, t: number) => {
  let idx = 0;
  lesson.scenes.forEach((s, i) => {
    if (t >= s.at) idx = i;
  });
  return idx;
};

export function Player({ lesson, player }: { lesson: Lesson; player: PlayerState }) {
  const { t, playing, rate, setRate, seek, play, pause } = player;
  const idx = sceneIndexAt(lesson, t);
  const scene = lesson.scenes[idx];
  const atStart = t === 0 && !playing;
  const ended = t >= lesson.duration - 0.01;
  const { Stage } = lesson;

  const goScene = (i: number) => {
    const s = lesson.scenes[Math.max(0, Math.min(lesson.scenes.length - 1, i))];
    seek(s.at + 0.02);
  };
  // 場面の頭に戻る（途中なら今の場面の頭、頭の近くなら1つ前）
  const prevScene = () => goScene(t - lesson.scenes[idx].at > 1.2 ? idx : idx - 1);

  return (
    <section aria-label={`${lesson.title}のアニメーション`}>
      <div className="stage relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[2.2rem] border-4 border-ink shadow-[8px_8px_0_0_var(--color-ink)]"
        style={{
          background: lesson.theme?.bg ?? 'var(--color-sun)',
          ['--t-a' as string]: lesson.theme?.a,
          ['--t-b' as string]: lesson.theme?.b,
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[2.2%]" style={{ background: lesson.theme?.band ?? '#f0a020' }} />
        <div className="absolute inset-x-0 bottom-0 h-[2.2%]" style={{ background: lesson.theme?.band ?? '#f0a020' }} />
        <svg viewBox="0 0 800 1000" className="absolute inset-0 h-full w-full" role="img" aria-label={lesson.why}>
          <Stage t={t} />
        </svg>

        {/* テロップ */}
        <div className="pointer-events-none absolute inset-x-0 top-[3.5%] px-[4%] text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className={`telop ${scene.big ? 'telop-lg' : 'telop-sm'}`}
            >
              {scene.caption}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 式 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[3%] flex flex-col items-center gap-[1cqw] px-[4%]">
          <AnimatePresence initial={false}>
            {(scene.formula ?? []).map((line, i) => (
              <motion.div
                key={isValidElement(line) && line.key != null ? line.key : i}
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="formula formula-box"
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 再生ボタン */}
        {(atStart || ended) && (
          <button
            onClick={play}
            aria-label={ended ? 'もう一度見る' : '再生する'}
            className="absolute inset-0 flex items-end justify-center bg-ink/10 pb-[26%] backdrop-blur-[1px] transition hover:bg-ink/0"
          >
            <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-ink bg-white text-pop shadow-[5px_5px_0_0_var(--color-ink)]">
              {ended ? <RotateCcw size={44} strokeWidth={3} /> : <Play size={48} strokeWidth={3} fill="currentColor" />}
            </span>
          </button>
        )}
      </div>

      {/* コントロール */}
      <div className="mx-auto mt-5 w-full rounded-2xl border-4 border-ink bg-white px-4 py-3">
        <div className="relative">
          <input
            type="range"
            className="seek w-full"
            min={0}
            max={lesson.duration}
            step={0.01}
            value={t}
            aria-label="再生位置"
            onChange={(e) => seek(+e.target.value)}
          />
          <div className="pointer-events-none absolute inset-x-0 top-[70%] h-2">
            {lesson.scenes.slice(1).map((s, i) => (
              <span key={i} className="absolute h-2 w-0.5 bg-ink/40" style={{ left: `calc(${(s.at / lesson.duration) * 100}% )` }} />
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <IconBtn label="前の場面" onClick={prevScene}><ChevronLeft size={22} strokeWidth={3} /></IconBtn>
            <button
              onClick={playing ? pause : play}
              aria-label={playing ? '一時停止' : '再生'}
              className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-ink bg-pop text-white active:translate-y-0.5"
            >
              {playing ? <Pause size={22} strokeWidth={3} fill="currentColor" /> : <Play size={22} strokeWidth={3} fill="currentColor" />}
            </button>
            <IconBtn label="次の場面" onClick={() => goScene(idx + 1)}><ChevronRight size={22} strokeWidth={3} /></IconBtn>
          </div>
          <span className="text-xs font-bold tabular-nums text-ink/70">
            場面 {idx + 1}/{lesson.scenes.length}
          </span>
          <div className="flex gap-1" role="group" aria-label="再生速度">
            {[0.5, 1, 1.5].map((r) => (
              <button
                key={r}
                onClick={() => setRate(r)}
                aria-pressed={rate === r}
                className={`rounded-full border-2 border-ink px-2.5 py-1 text-xs font-black ${rate === r ? 'bg-ink text-white' : 'bg-white'}`}
              >
                ×{r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-ink bg-sun-soft active:translate-y-0.5">
      {children}
    </button>
  );
}
