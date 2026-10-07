import React from 'react';
import { X, Shield } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-neutral-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-900" />
            <h3 className="text-lg font-bold text-neutral-900">
              {type === 'privacy' ? 'プライバシーポリシー' : '特定商取引法に基づく表記'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                株式会社KOUBOU（以下、「当社」）は、個人情報保護の重要性を深く認識し、お客様からお預かりした個人情報を適切に管理・保護するために以下の基本方針を定めます。
              </p>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">1. 個人情報の収集・利用目的</h4>
                <p>
                  当社はお問い合わせへの回答、お見積りの作成、プロジェクトの進行連絡、および当社サービスに関するご案内の目的にのみ個人情報を適法かつ公正な手段で利用いたします。
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">2. 第三者への開示・提供の禁止</h4>
                <p>
                  当社はお預かりした個人情報を適切に管理し、法令に基づき開示することが必要である場合を除き、お客様の事前同意なく第三者に開示または提供いたしません。
                </p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">3. 安全管理措置</h4>
                <p>
                  個人情報への不正アクセス、紛失、改ざんおよび漏洩を防止するため、通信の暗号化（SSL/TLS）、厳格なアクセス制御等のセキュリティ対策を実施しています。
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-2">
                  <span className="font-bold text-neutral-900">販売事業者名</span>
                  <span className="col-span-2">株式会社KOUBOU (KOUBOU Inc.)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-2">
                  <span className="font-bold text-neutral-900">所在地</span>
                  <span className="col-span-2">〒150-0001 東京都渋谷区神宮前4丁目26-18</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-2">
                  <span className="font-bold text-neutral-900">代表責任者</span>
                  <span className="col-span-2">代表取締役 神崎 健太郎</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-2">
                  <span className="font-bold text-neutral-900">支払方法</span>
                  <span className="col-span-2">銀行振込、クレジットカード（Stripe請求書払い）</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-2">
                  <span className="font-bold text-neutral-900">納品・役務提供時期</span>
                  <span className="col-span-2">個別プロジェクトのご契約書・仕様合意書に定める期日</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-bold text-neutral-900">キャンセル・返品</span>
                  <span className="col-span-2">
                    受注制作・役務提供の性質上、着手後のキャンセルによる返金は原則承っておりません。
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
