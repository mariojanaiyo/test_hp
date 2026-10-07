import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand & Address */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span className="text-xl font-black tracking-wider">KOUBOU</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              株式会社KOUBOU (KOUBOU Inc.)
              <br />
              〒150-0001 東京都渋谷区神宮前4丁目26-18
              <br />
              原宿ピアザビル 7F デジタルラボラトリー
            </p>
            <div className="text-xs text-neutral-400 pt-1">
              事業内容: UI/UXデザイン設計、モダンWeb/SaaSフロントエンド受託開発、ブランドアイデンティティ策定、成長支援分析コンサルティング
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  コアサービス (Capabilities)
                </a>
              </li>
              <li>
                <a href="#works" className="hover:text-white transition-colors">
                  制作実績 (Selected Works)
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  開発プロセス (Workflow)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  料金プラン & 試算 (Pricing)
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  よくある質問 (FAQ)
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  お問い合わせ (Contact)
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Accreditations */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Compliance & Security
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              プライバシーマーク（JIS Q 15001）準拠。全プロジェクトにおいて機密保持契約（NDA）の事前締結を標準としております。
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-neutral-400 font-mono">
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">
                ISO/IEC 27001 COMPLIANT
              </span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">
                SSL/TLS 256-BIT ENCRYPTION
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div className="flex items-center gap-4">
            <span>© 2019-{new Date().getFullYear()} KOUBOU Inc. All rights reserved.</span>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-white transition-colors cursor-pointer underline underline-offset-2"
            >
              プライバシーポリシー
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-white transition-colors cursor-pointer underline underline-offset-2"
            >
              特定商取引法に基づく表記
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer self-end sm:self-auto"
          >
            <span>ページ上部へ戻る</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
