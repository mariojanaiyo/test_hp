import { ArrowRight } from 'lucide-react';
import { lessons } from '../lessons';
import { Logo } from './Logo';

export function Home() {
  return (
    <div className="min-h-screen">
      <div className="border-b-4 border-ink bg-sun px-4 pb-14 pt-10 text-center sm:pb-20">
        <Logo size="lg" />
        <h1 className="font-pop mx-auto mt-8 max-w-xl text-2xl leading-snug sm:text-4xl">
          公式は、<span className="text-pop">覚えなくていい。</span>
          <br />
          「なんで？」がわかれば、作れる。
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-bold leading-relaxed sm:text-base">
          ピザを切ったり、ならべたり。身近なものをうごかしながら、数学の「なんで？」をいっしょに見つけよう。
        </p>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h2 className="font-pop mb-5 inline-block rounded-full bg-ink px-4 py-1 text-sm text-sun">レッスン</h2>
        <ul className="grid gap-5">
          {lessons.map((l) => (
            <li key={l.id}>
              <a
                href={`#/lesson/${l.id}`}
                className="flex items-center gap-4 rounded-3xl border-4 border-ink bg-white p-5 shadow-[6px_6px_0_0_var(--color-ink)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-ink bg-sun text-3xl" aria-hidden>
                  {l.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-pop block text-xs text-pop">レッスン {l.no}　{l.title}</span>
                  <span className="font-pop mt-1 block text-lg leading-snug sm:text-xl">{l.why}</span>
                  <span className="mt-1 block text-xs font-bold text-ink/60">
                    動画 約{Math.round(l.duration)}秒 ・ かいせつ ・ もんだい{l.quiz.length}問
                  </span>
                </span>
                <ArrowRight strokeWidth={3} className="shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
