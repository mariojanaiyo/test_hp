import React from 'react';
import { Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/siteData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-semibold text-neutral-700 uppercase tracking-widest mb-3">
            Client Voices & Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mb-4 [text-wrap:balance]">
            プロジェクトをご一緒したお客様の声
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            スタートアップから東証上場企業まで、確かな成果を生み出してきたクライアント様からの率直なフィードバックをご紹介します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-neutral-50 rounded-2xl p-7 border border-neutral-200 flex flex-col justify-between"
            >
              <div>
                {/* Metric achievement highlight */}
                <div className="inline-block bg-white border border-neutral-200 text-neutral-900 font-bold text-xs px-3 py-1.5 rounded-lg mb-6 shadow-2xs tabular-nums">
                  成果: {t.metric}
                </div>

                <Quote className="w-6 h-6 text-neutral-400 mb-3" />
                <p className="text-sm text-neutral-700 leading-relaxed mb-6 font-normal">
                  「{t.quote}」
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200/80">
                <div className="text-sm font-bold text-neutral-950">{t.author}</div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {t.role} · {t.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
