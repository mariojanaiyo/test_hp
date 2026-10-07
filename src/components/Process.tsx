import React, { useState } from 'react';
import { CheckCircle2, Calendar, FileText, ChevronRight } from 'lucide-react';
import { PROCESS_STEPS } from '../data/siteData';

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-24 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-semibold text-neutral-700 uppercase tracking-widest mb-3">
            Workflow & Quality Assurance
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mb-4 [text-wrap:balance]">
            手戻りを防ぎ、確実な成果を創出する4ステップ
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            曖昧な仕様や認識のズレによる手戻りをゼロにするため、早期の動くプロトタイプ検証と透明性の高い週次進捗共有を徹底しています。
          </p>
        </div>

        {/* 4 Steps Horizontal / Grid Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {PROCESS_STEPS.map((item, index) => {
            const isCurrent = activeStep === index;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(index)}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-1 ring-neutral-900'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border-neutral-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      isCurrent ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    STEP {item.step}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isCurrent ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    {item.duration}
                  </span>
                </div>
                <h3 className="text-base font-bold tracking-tight mb-1">
                  {item.title}
                </h3>
                <div
                  className={`text-xs ${
                    isCurrent ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {item.en}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Showcase Container */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-8 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-500 mb-1">
                <span>PHASE {PROCESS_STEPS[activeStep].step}</span>
                <span aria-hidden="true">/</span>
                <span>{PROCESS_STEPS[activeStep].en}</span>
              </div>
              <h4 className="text-2xl font-bold text-neutral-950">
                {PROCESS_STEPS[activeStep].title}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 px-3.5 py-2 rounded-lg self-start lg:self-auto shrink-0">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>標準所要期間: {PROCESS_STEPS[activeStep].duration}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
            <div className="md:col-span-7">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                このフェーズの目的と具体的な進め方
              </h5>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                {PROCESS_STEPS[activeStep].desc}
              </p>
              <div className="mt-4 p-4 bg-white border border-neutral-200/80 rounded-xl">
                <div className="text-xs font-semibold text-neutral-800 mb-1">
                  💡 KOUBOUの品質保証ポイント
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Slack/Chatwork等での常時即レス体制に加え、毎週の定例オンラインMTGにて進捗デモをご提示。お客様の意思決定スピードを最大化します。
                </p>
              </div>
            </div>

            <div className="md:col-span-5 bg-white border border-neutral-200 rounded-xl p-5">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-neutral-700" />
                <span>確定納品成果物 (Deliverables)</span>
              </h5>
              <ul className="space-y-2.5">
                {PROCESS_STEPS[activeStep].deliverables.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
