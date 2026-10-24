import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { lessons } from '../lessons';
import type { Lesson } from '../lessons/types';
import { Logo } from './Logo';
import { Player } from './Player';
import { Quiz } from './Quiz';
import { usePlayer } from './usePlayer';

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const player = usePlayer(lesson.duration);
  const playerRef = useRef<HTMLDivElement>(null);
  const next = lessons[lessons.findIndex((l) => l.id === lesson.id) + 1];

  const jumpToScene = (i: number) => {
    player.pause();
    player.seek(lesson.scenes[i].at + 0.02);
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 場面の頭から再生して「なんで？」を見直す
    setTimeout(() => player.play(), 450);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-5 sm:px-6">
      <header className="mb-6 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-1.5 rounded-full border-4 border-ink bg-white px-4 py-1.5 text-sm font-black">
          <ArrowLeft size={16} strokeWidth={3} /> もくじ
        </a>
        <a href="#/"><Logo /></a>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-start lg:gap-12">
        <div ref={playerRef} className="scroll-mt-4 lg:sticky lg:top-4">
          <Player lesson={lesson} player={player} />
        </div>

        <main className="min-w-0 space-y-10">
          <div>
            <p className="font-pop text-sm text-pop">レッスン {lesson.no}</p>
            <h1 className="font-pop mt-1 text-2xl leading-snug sm:text-3xl">{lesson.why}</h1>
          </div>

          <section aria-labelledby="explain">
            <h2 id="explain" className="font-pop mb-4 inline-block rounded-full bg-ink px-4 py-1 text-sm text-sun">
              かいせつ
            </h2>
            <ol className="space-y-4">
              {lesson.steps.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-3xl border-4 border-ink bg-white p-4 sm:p-5">
                  <span className="font-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sun text-lg">{i + 1}</span>
                  <div>
                    <h3 className="font-pop mb-1.5 text-base leading-snug sm:text-lg">{s.title}</h3>
                    <p className="text-sm leading-[1.9] sm:text-base sm:leading-[1.9]">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-label="ポイント" className="relative mt-2 rounded-3xl border-4 border-ink bg-white px-5 pb-5 pt-7">
            <span className="font-pop absolute -top-4 left-4 bg-cream px-2 text-xl text-pop">Point</span>
            <p className="font-pop text-center text-xl leading-[1.7] sm:text-2xl [&_.c]:text-aqua-deep [&_.m]:text-pop">{lesson.point}</p>
          </section>

          {lesson.Playground && (
            <section aria-labelledby="play">
              <h2 id="play" className="font-pop mb-4 inline-block rounded-full bg-pop px-4 py-1 text-sm text-white">
                いじってみよう
              </h2>
              <lesson.Playground />
            </section>
          )}

          <section aria-labelledby="quiz">
            <h2 id="quiz" className="font-pop mb-4 inline-block rounded-full bg-aqua px-4 py-1 text-sm text-ink">
              もんだい
            </h2>
            <Quiz questions={lesson.quiz} onHint={jumpToScene} />
          </section>

          {next && (
            <a
              href={`#/lesson/${next.id}`}
              className="flex items-center justify-between gap-3 rounded-3xl border-4 border-ink bg-sun p-5 shadow-[6px_6px_0_0_var(--color-ink)] transition active:translate-y-0.5 active:shadow-none"
            >
              <span>
                <span className="font-pop block text-xs text-pop">つぎのレッスン {next.no}</span>
                <span className="font-pop text-lg">{next.why}</span>
              </span>
              <ArrowRight strokeWidth={3} className="shrink-0" />
            </a>
          )}
        </main>
      </div>
    </div>
  );
}
