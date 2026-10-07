import React, { useState, useMemo } from 'react';
import { Check, Calculator, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRICING_PLANS } from '../data/siteData';

interface PricingCalculatorProps {
  onOpenContact: (prefillNote?: string) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onOpenContact }) => {
  // Simulator State
  const [pageCount, setPageCount] = useState<number>(5);
  const [hasCMS, setHasCMS] = useState<boolean>(true);
  const [hasMultilingual, setHasMultilingual] = useState<boolean>(false);
  const [hasAnimation, setHasAnimation] = useState<boolean>(true);
  const [hasAuthOrPayment, setHasAuthOrPayment] = useState<boolean>(false);
  const [isExpress, setIsExpress] = useState<boolean>(false);

  // Dynamic price calculation
  const calculatedEstimate = useMemo(() => {
    let base = 350000; // Base planning & direction
    base += pageCount * 45000; // per page design + coding
    if (hasCMS) base += 120000;
    if (hasMultilingual) base += 180000;
    if (hasAnimation) base += 80000;
    if (hasAuthOrPayment) base += 250000;
    if (isExpress) base *= 1.25;

    // Round to nearest 10,000 yen
    return Math.round(base / 10000) * 10000;
  }, [pageCount, hasCMS, hasMultilingual, hasAnimation, hasAuthOrPayment, isExpress]);

  const handleApplyEstimate = () => {
    const details = [
      `【オンライン見積試算結果】`,
      `・想定ページ数: ${pageCount}ページ`,
      `・CMS（更新機能）: ${hasCMS ? 'あり' : 'なし'}`,
      `・多言語（日英）対応: ${hasMultilingual ? 'あり' : 'なし'}`,
      `・リッチアニメーション: ${hasAnimation ? 'あり' : 'なし'}`,
      `・会員認証/決済機能: ${hasAuthOrPayment ? 'あり' : 'なし'}`,
      `・特急納品オプション: ${isExpress ? '希望する' : '希望しない'}`,
      `・概算シミュレーション金額: ¥${calculatedEstimate.toLocaleString()} (税抜)`,
    ].join('\n');

    onOpenContact(details);
  };

  return (
    <section id="pricing" className="py-24 bg-neutral-50 text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-semibold text-neutral-700 uppercase tracking-widest mb-3">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mb-4 [text-wrap:balance]">
            明瞭で分かりやすい料金体系とオンライン試算
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            ご予算やフェーズに応じた3つのパッケージプランに加え、ご希望の要件に合わせて即座に概算費用を計算できるシミュレーターをご用意しています。
          </p>
        </div>

        {/* 3 Standard Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-neutral-900 text-white shadow-xl ring-2 ring-neutral-900'
                  : 'bg-white text-neutral-900 border border-neutral-200 shadow-xs'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-7 bg-emerald-500 text-neutral-950 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  人気プラン
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <span className={`text-xs font-mono ${plan.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {plan.enName}
                  </span>
                </div>
                <p className={`text-xs mb-6 ${plan.popular ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {plan.target}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-medium">¥</span>
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums">
                      {plan.price}
                    </span>
                    <span className={`text-xs ${plan.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      〜 (税抜)
                    </span>
                  </div>
                  <div className={`text-xs mt-1.5 ${plan.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    標準納期: {plan.deliveryWeeks}
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.popular ? 'text-emerald-400' : 'text-neutral-900'
                        }`}
                      />
                      <span className={plan.popular ? 'text-neutral-200' : 'text-neutral-700'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenContact(`【プラン指定】「${plan.name}（¥${plan.price}〜）」についてのお問い合わせ`)}
                className={`w-full py-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  plan.popular
                    ? 'bg-white text-neutral-950 hover:bg-neutral-100 shadow-sm'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <span>このプランで相談する</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Interactive Instant Cost Simulator */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-900 text-white rounded-xl">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-950">
                  リアルタイム費用シミュレーター
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  ご希望の構成を選択すると、その場ですぐに開発費用の目安を算出できます。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200 self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>追加請求なしの固定見積り保証</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
            {/* Options Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Page Count Slider */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-900 mb-2">
                  <span>想定ページ数</span>
                  <span className="font-mono text-base font-bold text-neutral-950 tabular-nums">
                    {pageCount} ページ
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={pageCount}
                  onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                  className="w-full accent-neutral-900 cursor-pointer h-2 bg-neutral-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>1P (LP単体)</span>
                  <span>10P (標準コーポレート)</span>
                  <span>25P (大規模ポータル)</span>
                </div>
              </div>

              {/* Toggles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">CMS (更新機能) 導入</div>
                    <div className="text-[11px] text-neutral-500">お知らせ・事例・ブログ</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasCMS}
                    onChange={(e) => setHasCMS(e.target.checked)}
                    className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">多言語対応 (日英など)</div>
                    <div className="text-[11px] text-neutral-500">海外展開・言語切替</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasMultilingual}
                    onChange={(e) => setHasMultilingual(e.target.checked)}
                    className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">リッチアニメーション演出</div>
                    <div className="text-[11px] text-neutral-500">ブランド感を高める演出</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasAnimation}
                    onChange={(e) => setHasAnimation(e.target.checked)}
                    className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">会員ログイン / 決済機能</div>
                    <div className="text-[11px] text-neutral-500">Stripe / ユーザー認証</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasAuthOrPayment}
                    onChange={(e) => setHasAuthOrPayment(e.target.checked)}
                    className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Express option */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-amber-950">特急納品対応（短納期希望）</div>
                  <div className="text-[11px] text-amber-800">通常納期の半分程度で優先納品</div>
                </div>
                <input
                  type="checkbox"
                  checked={isExpress}
                  onChange={(e) => setIsExpress(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Calculated Output Summary Card */}
            <div className="lg:col-span-5 bg-neutral-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-lg">
              <div>
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                  ESTIMATED INVESTMENT
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-lg font-light text-neutral-300">¥</span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tight tabular-nums text-white">
                    {calculatedEstimate.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">〜 (税抜)</span>
                </div>
                <div className="text-xs text-neutral-400 mb-6">
                  ※ 要件詳細により変動する場合があります。正確なお見積りはヒアリング後にご提示します。
                </div>

                <div className="space-y-2 py-4 border-t border-neutral-800 text-xs">
                  <div className="flex justify-between text-neutral-300">
                    <span>基本設計 & ディレクション</span>
                    <span className="tabular-nums">¥350,000</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>画面デザイン & 実装 ({pageCount}P)</span>
                    <span className="tabular-nums">¥{(pageCount * 45000).toLocaleString()}</span>
                  </div>
                  {hasCMS && (
                    <div className="flex justify-between text-neutral-300">
                      <span>CMS構築 (microCMS)</span>
                      <span className="tabular-nums">¥120,000</span>
                    </div>
                  )}
                  {hasMultilingual && (
                    <div className="flex justify-between text-neutral-300">
                      <span>多言語化対応</span>
                      <span className="tabular-nums">¥180,000</span>
                    </div>
                  )}
                  {hasAnimation && (
                    <div className="flex justify-between text-neutral-300">
                      <span>インタラクション演出</span>
                      <span className="tabular-nums">¥80,000</span>
                    </div>
                  )}
                  {hasAuthOrPayment && (
                    <div className="flex justify-between text-neutral-300">
                      <span>会員認証 / Stripe決済連携</span>
                      <span className="tabular-nums">¥250,000</span>
                    </div>
                  )}
                  {isExpress && (
                    <div className="flex justify-between text-amber-400 font-medium">
                      <span>特急優先枠割増 (+25%)</span>
                      <span className="tabular-nums">適用済み</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800">
                <button
                  onClick={handleApplyEstimate}
                  className="w-full py-3.5 bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                >
                  <span>この試算内容でお問い合わせ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
