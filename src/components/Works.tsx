import React, { useState } from 'react';
import { ArrowUpRight, X, ExternalLink, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { CASE_STUDIES, CaseStudy } from '../data/siteData';

interface WorksProps {
  onOpenContact: (note?: string) => void;
}

export const Works: React.FC<WorksProps> = ({ onOpenContact }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'web' | 'brand' | 'ec'>('all');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  const filteredCases = activeCategory === 'all'
    ? CASE_STUDIES
    : CASE_STUDIES.filter((c) => c.category === activeCategory);

  return (
    <section id="works" className="py-24 bg-neutral-50 text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-neutral-700 uppercase tracking-widest mb-3">
              Selected Case Studies
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mb-3 [text-wrap:balance]">
              成果に直結した、代表的なプロジェクト実績
            </h2>
            <p className="text-base text-neutral-600">
              単なる制作に留まらず、定量的・定性的なビジネスインパクトを創出したプロジェクト事例を掲載しています。
            </p>
          </div>

          {/* Interactive Filter Tabs (Buttons with click handlers) */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-xl shadow-xs self-start md:self-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setActiveCategory('web')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'web'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Web・SaaS
            </button>
            <button
              onClick={() => setActiveCategory('brand')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'brand'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              ブランディング
            </button>
            <button
              onClick={() => setActiveCategory('ec')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'ec'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              EC・プラットフォーム
            </button>
          </div>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedCase(item)}
              className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden hover:border-neutral-400 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
            >
              {/* Image Container with 4:3 aspect ratio */}
              <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {/* Clean quantitative badge */}
                <div className="absolute bottom-3 left-3 bg-neutral-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="tabular-nums font-bold">{item.metrics}</span>
                  <span className="text-neutral-300 font-normal">({item.metricLabel})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Unboxed Metadata */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2 font-medium">
                    <span>{item.client}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.year}</span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono">期間: {item.duration}</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    詳細を見る <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote reassurance */}
        <div className="mt-12 text-center text-xs text-neutral-500">
          ※ 守秘義務契約（NDA）の規定に基づき、一部の数値・名称を抽象化して表記している事例がございます。
        </div>
      </div>

      {/* Case Study Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header Image */}
            <div className="relative aspect-16/9 w-full bg-neutral-100 overflow-hidden">
              <img
                src={selectedCase.image}
                alt={selectedCase.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 p-2 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full transition-colors cursor-pointer"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-neutral-950 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md">
                <span className="text-emerald-700 font-bold text-sm tabular-nums">{selectedCase.metrics}</span>
                <span className="text-neutral-600">{selectedCase.metricLabel} を記録</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1.5 font-medium">
                  <span>{selectedCase.client}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedCase.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>開発期間: {selectedCase.duration}</span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-950">
                  {selectedCase.title}
                </h3>
              </div>

              {/* Challenge & Solution Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1.5">
                    課題・ボトルネック (Challenge)
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    {selectedCase.challenge}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                    解決策・アプローチ (Solution)
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                    {selectedCase.solution}
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  採用技術・フレームワーク
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.stack.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-md text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-neutral-500">
                  同種のプロジェクト要件や概算スケジュールについてもお気軽にご相談ください。
                </span>
                <button
                  onClick={() => {
                    const title = selectedCase.title;
                    setSelectedCase(null);
                    onOpenContact(`【事例参照】「${title}」のような開発・リニューアルについて`);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>この事例に類似した案件を相談</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
