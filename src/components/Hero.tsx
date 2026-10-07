import React from 'react';
import { ArrowUpRight, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { CLIENT_LOGOS } from '../data/siteData';

interface HeroProps {
  onOpenContact: (note?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-neutral-950 text-white">
      {/* Background visual asset with atmospheric scrim */}
      <div className="absolute inset-0 z-0 opacity-30 select-none pointer-events-none">
        <img
          src="/src/assets/images/hero_studio_tokyo_1791348311087.jpg"
          alt="KOUBOU Design Studio Tokyo"
          className="w-full h-full object-cover object-center filter grayscale contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle unboxed metadata kicker */}
        <div className="flex items-center gap-3 text-xs md:text-sm text-neutral-400 mb-6 font-medium tracking-wide">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>TOKYO & GLOBAL DIGITAL STUDIO</span>
          <span aria-hidden="true">/</span>
          <span>EST. 2019</span>
          <span aria-hidden="true">/</span>
          <span>新規案件ご相談受付中</span>
        </div>

        {/* Hero headline with balanced wrap */}
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.2] mb-6 [text-wrap:balance]">
            確かなデザインと高い技術力で、
            <br />
            ビジネスの未来を具現化する。
          </h1>
          <p className="text-base sm:text-xl text-neutral-300 leading-relaxed max-w-2xl font-normal mb-10">
            KOUBOUは、戦略立案からUI/UXデザイン、モダンフルスタック開発までを一気通貫で手掛けるデジタルクリエイティブスタジオです。見た目の美しさだけでなく、事業KPIを確実に押し上げるプロダクト体験を生み出します。
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16">
            <button
              onClick={() => onOpenContact()}
              className="px-7 py-4 text-sm font-semibold text-neutral-950 bg-white hover:bg-neutral-100 rounded-lg transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg active:scale-95"
            >
              <span>プロジェクトの相談を始める</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a
              href="#works"
              className="px-7 py-4 text-sm font-semibold text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>制作実績を見る</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quantified Rigor Proof Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-800">
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              250<span className="text-emerald-400 text-2xl font-bold">+</span>
            </div>
            <div className="text-xs text-neutral-400 mt-1 font-medium">支援完了プロジェクト</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              98.6<span className="text-emerald-400 text-2xl font-bold">%</span>
            </div>
            <div className="text-xs text-neutral-400 mt-1 font-medium">クライアント継続・推薦率</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              95<span className="text-emerald-400 text-2xl font-bold">+</span>
            </div>
            <div className="text-xs text-neutral-400 mt-1 font-medium">PageSpeed 高速表示スコア</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              100<span className="text-emerald-400 text-2xl font-bold">%</span>
            </div>
            <div className="text-xs text-neutral-400 mt-1 font-medium">専任ディレクター伴走体制</div>
          </div>
        </div>

        {/* Client Brands Bar */}
        <div className="mt-14 pt-8 border-t border-neutral-900">
          <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-5">
            信頼を寄せていただく主要クライアント・パートナー
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center">
            {CLIENT_LOGOS.map((client) => (
              <div
                key={client.name}
                className="text-neutral-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold tracking-wider text-center py-2 px-3 border border-neutral-800/80 rounded bg-neutral-900/40"
              >
                {client.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
