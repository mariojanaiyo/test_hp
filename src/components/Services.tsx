import React, { useState } from 'react';
import { ArrowRight, Check, Layers, Code, Palette, TrendingUp, Clock, Target } from 'lucide-react';
import { SERVICES_DATA, ServiceItem } from '../data/siteData';

interface ServicesProps {
  onOpenContact: (prefillNote?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenContact }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem>(SERVICES_DATA[0]);

  const serviceIcons = {
    design: Layers,
    frontend: Code,
    branding: Palette,
    growth: TrendingUp,
  };

  return (
    <section id="services" className="py-24 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with quiet unboxed category */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold text-neutral-700 uppercase tracking-widest mb-3">
            Capabilities & Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mb-4 [text-wrap:balance]">
            事業成長を加速する、4つの専門コア領域
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            企画段階の構想からUI/UX設計、高水準なエンジニアリング、そして公開後のグロース分析まで、各領域のエキスパートが一貫して伴走します。
          </p>
        </div>

        {/* 2-Column Interactive Bento View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 4 Service Selector Cards */}
          <div className="lg:col-span-5 space-y-3">
            {SERVICES_DATA.map((service) => {
              const isSelected = selectedService.id === service.id;
              const Icon = serviceIcons[service.id as keyof typeof serviceIcons] || Layers;

              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-1 ring-neutral-900'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border-neutral-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-800 border border-neutral-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div
                          className={`text-xs font-mono font-medium ${
                            isSelected ? 'text-neutral-400' : 'text-neutral-500'
                          }`}
                        >
                          {service.number} · {service.enTitle}
                        </div>
                        <h3 className="text-base font-bold mt-0.5 tracking-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform shrink-0 mt-2 ${
                        isSelected ? 'translate-x-1 text-white' : 'text-neutral-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Deep-Dive Inspector Panel */}
          <div className="lg:col-span-7 bg-neutral-50 border border-neutral-200/90 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-3">
              <div>
                <span className="text-xs font-mono font-semibold text-neutral-500">
                  {selectedService.number} / SERVICE SPECIFICATION
                </span>
                <h3 className="text-2xl font-bold text-neutral-900 mt-1">
                  {selectedService.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                  {selectedService.enTitle}
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-neutral-700 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shrink-0">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>目安期間: {selectedService.leadTime}</span>
              </div>
            </div>

            <div className="py-6 border-b border-neutral-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                サービス概要
              </h4>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            {/* Target Audience / Best for */}
            <div className="py-6 border-b border-neutral-200">
              <div className="flex items-start gap-2.5">
                <Target className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    最適な活用ケース
                  </h4>
                  <p className="text-sm text-neutral-800 font-medium">
                    {selectedService.bestFor}
                  </p>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="py-6 border-b border-neutral-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                主な提供成果物 (Deliverables)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedService.deliverables.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology & Tools Stack */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  使用技術・主要ツール
                </h4>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-600">
                  {selectedService.techStack.map((tech, i) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-white border border-neutral-200 rounded text-neutral-800 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onOpenContact(`【ご相談種別】${selectedService.title}について`)}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>この分野の相談をする</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
