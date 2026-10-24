import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, RotateCcw, Video, X } from 'lucide-react';
import type { Question } from '../lessons/types';

type Result = 'right' | 'wrong' | null;

export function Quiz({ questions, onHint }: { questions: Question[]; onHint: (scene: number) => void }) {
  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <QuestionCard key={i} no={i + 1} q={q} onHint={onHint} />
      ))}
    </div>
  );
}

function QuestionCard({ no, q, onHint }: { no: number; q: Question; onHint: (scene: number) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState<Result>(null);

  const check = () => {
    if (q.kind === 'choice') {
      if (picked === null) return;
      setResult(picked === q.answer ? 'right' : 'wrong');
    } else {
      const v = parseFloat(text.replace(/[，,]/g, '').replace(/[０-９．]/g, (c) => (c === '．' ? '.' : String(c.charCodeAt(0) - 0xff10))));
      if (Number.isNaN(v)) return;
      setResult(Math.abs(v - q.answer) <= (q.tolerance ?? 0.001) ? 'right' : 'wrong');
    }
  };
  const reset = () => {
    setPicked(null);
    setText('');
    setResult(null);
  };

  return (
    <div className="rounded-3xl border-4 border-ink bg-white p-4 sm:p-5">
      <p className="mb-3 flex gap-2 text-base font-bold leading-relaxed">
        <span className="font-pop mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-ink px-2 text-sm text-sun">{no}</span>
        <span>{q.q}</span>
      </p>

      {q.kind === 'choice' ? (
        <div className="grid grid-cols-2 gap-2.5">
          {q.choices.map((c, i) => {
            const state =
              result && i === q.answer ? 'bg-aqua' : result === 'wrong' && i === picked ? 'bg-pop/25' : picked === i ? 'bg-sun' : 'bg-cream';
            return (
              <button
                key={i}
                disabled={result !== null}
                onClick={() => setPicked(i)}
                aria-pressed={picked === i}
                className={`rounded-2xl border-4 border-ink px-3 py-3 text-sm font-bold transition active:translate-y-0.5 ${state}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            inputMode="decimal"
            value={text}
            disabled={result !== null}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            aria-label="答え"
            placeholder="こたえ"
            className="w-36 rounded-2xl border-4 border-ink bg-cream px-3 py-2 text-lg font-bold tabular-nums"
          />
          {q.unit && <span className="font-bold">{q.unit}</span>}
        </div>
      )}

      {result === null ? (
        <button
          onClick={check}
          className="font-pop mt-4 rounded-full border-4 border-ink bg-pop px-6 py-2 text-white shadow-[3px_3px_0_0_var(--color-ink)] active:translate-y-0.5 active:shadow-none disabled:opacity-40"
          disabled={q.kind === 'choice' ? picked === null : text.trim() === ''}
        >
          こたえあわせ
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-2xl border-4 border-ink p-4 ${result === 'right' ? 'bg-aqua/30' : 'bg-pop/10'}`}
          role="status"
        >
          <p className="font-pop mb-1 flex items-center gap-2 text-lg">
            {result === 'right' ? <><Check strokeWidth={4} className="text-aqua-deep" /> せいかい！</> : <><X strokeWidth={4} className="text-pop" /> おしい！</>}
          </p>
          <p className="text-sm leading-relaxed">{q.explain}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {result === 'wrong' && q.hintScene !== undefined && (
              <button onClick={() => onHint(q.hintScene!)} className="flex items-center gap-1.5 rounded-full border-4 border-ink bg-sun px-4 py-1.5 text-sm font-black active:translate-y-0.5">
                <Video size={16} strokeWidth={3} /> 動画でたしかめる
              </button>
            )}
            <button onClick={reset} className="flex items-center gap-1.5 rounded-full border-4 border-ink bg-white px-4 py-1.5 text-sm font-black active:translate-y-0.5">
              <RotateCcw size={16} strokeWidth={3} /> もういちど
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
