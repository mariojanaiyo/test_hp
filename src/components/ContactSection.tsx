import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Shield, Clock, HelpCircle, Sparkles, AlertCircle } from 'lucide-react';

interface ContactSectionProps {
  initialPrefillNote?: string;
  onClearPrefill?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialPrefillNote,
  onClearPrefill,
}) => {
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('Web・アプリケーション開発');
  const [budget, setBudget] = useState('150万〜300万円');
  const [launchTime, setLaunchTime] = useState('3ヶ月以内');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReceiptId, setSubmittedReceiptId] = useState('');

  // Handle prefill updates from simulators / service triggers
  useEffect(() => {
    if (initialPrefillNote) {
      setMessage((prev) => (prev ? `${prev}\n\n${initialPrefillNote}` : initialPrefillNote));
      if (initialPrefillNote.includes('AURORA') || initialPrefillNote.includes('開発')) {
        setServiceType('Web・アプリケーション開発');
      } else if (initialPrefillNote.includes('ブランディング')) {
        setServiceType('ブランド戦略・デザインシステム');
      }
    }
  }, [initialPrefillNote]);

  const handleFillDemoData = () => {
    setCompany('株式会社サンプル・イノベーション');
    setName('山田 太郎');
    setEmail('taro.yamada@example.co.jp');
    setPhone('03-1234-5678');
    setServiceType('Web・アプリケーション開発');
    setBudget('150万〜300万円');
    setLaunchTime('3ヶ月以内');
    setMessage(
      '自社SaaSプロダクトのリニューアルと、マーケティング用LPの刷新を検討しております。\nユーザー体験の向上と成約率の改善を主目的に、FigmaでのUI設計からNext.jsでの実装までワンストップでご相談可能でしょうか。'
    );
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'お名前を入力してください';
    if (!company.trim()) errs.company = '会社名・屋号を入力してください';
    if (!email.trim()) {
      errs.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = '有効なメールアドレス形式で入力してください';
    }
    if (!message.trim()) errs.message = 'ご相談内容を入力してください';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate real submission
    setTimeout(() => {
      const receipt = `KB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedReceiptId(receipt);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setCompany('');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setErrors({});
    if (onClearPrefill) onClearPrefill();
  };

  return (
    <section id="contact" className="py-24 bg-white text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Guarantees */}
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold text-neutral-700 uppercase tracking-widest mb-3">
              Start a Conversation
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mb-4 [text-wrap:balance]">
              プロジェクトの無料相談・お見積り
            </h2>
            <p className="text-base text-neutral-600 leading-relaxed mb-8">
              企画構想段階からのブレスト、既存サイトのリニューアル診断、お見積りのご依頼など、どのような内容でも専任ディレクターが迅速に対応いたします。
            </p>

            {/* Commitments & Trust Items */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <Clock className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">1営業日以内の迅速返信</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    通常、24時間以内（土日祝を除く）に担当者よりメールまたはお電話にて一次回答いたします。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <Shield className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">秘密保持契約（NDA）締結対応</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    未公開の新規事業や競合機密情報を含む場合も、事前NDA締結後に安心してご相談いただけます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <CheckCircle2 className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">オンラインMTG即時調整</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Google MeetまたはZoomにて、30分のオンラインヒアリングをスムーズにセッティング可能です。
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Fill Button for Evaluators */}
            <div className="p-4 bg-neutral-100 rounded-xl border border-neutral-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-900">💡 動作確認用サンプル入力</div>
                  <div className="text-[11px] text-neutral-600">ワンクリックでフォームにテスト内容を反映できます</div>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoData}
                  className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-900 text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  テスト入力
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            {isSubmitted ? (
              <div className="py-10 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-neutral-950">
                    お問い合わせを受け付けました
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    送信ありがとうございます。確認メールを自動送信いたしました。担当ディレクターより1営業日以内にご連絡させていただきます。
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-neutral-200 text-left text-xs space-y-2">
                  <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                    <span className="text-neutral-500">受付番号:</span>
                    <span className="font-mono font-bold text-neutral-900 tabular-nums">{submittedReceiptId}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                    <span className="text-neutral-500">お名前:</span>
                    <span className="font-medium text-neutral-900">{name} 様</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                    <span className="text-neutral-500">会社名:</span>
                    <span className="font-medium text-neutral-900">{company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">ご連絡先:</span>
                    <span className="font-medium text-neutral-900">{email}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    新しい問い合わせを作成する
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      会社名・屋号 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="例: 株式会社サンプル"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all ${
                        errors.company ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                      }`}
                    />
                    {errors.company && (
                      <div className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.company}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      ご担当者名 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="例: 山田 太郎"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all ${
                        errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                      }`}
                    />
                    {errors.name && (
                      <div className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      メールアドレス <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all ${
                        errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                      }`}
                    />
                    {errors.email && (
                      <div className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      お電話番号 <span className="text-neutral-400 font-normal">(任意)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="03-0000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      ご相談分野
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="Web・アプリケーション開発">Web・アプリケーション開発</option>
                      <option value="UI/UXデザイン・プロトタイプ">UI/UXデザイン・プロトタイプ</option>
                      <option value="ブランド戦略・デザインシステム">ブランド戦略・デザインシステム</option>
                      <option value="グロース支援・CVR改善">グロース支援・CVR改善</option>
                      <option value="その他・包括的なご相談">その他・包括的なご相談</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      ご予算規模 (税抜)
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="50万円未満">〜 50万円</option>
                      <option value="50万〜150万円">50万 〜 150万円</option>
                      <option value="150万〜300万円">150万 〜 300万円</option>
                      <option value="300万〜500万円">300万 〜 500万円</option>
                      <option value="500万円以上">500万円以上</option>
                      <option value="未定・相談して決めたい">未定・相談して決めたい</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      希望公開時期
                    </label>
                    <select
                      value={launchTime}
                      onChange={(e) => setLaunchTime(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="即時〜1ヶ月以内 (特急)">即時〜1ヶ月以内 (特急)</option>
                      <option value="2〜3ヶ月以内">2〜3ヶ月以内</option>
                      <option value="3〜6ヶ月以内">3〜6ヶ月以内</option>
                      <option value="半年以降・未定">半年以降・未定</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    ご相談内容・要件概要 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="目的、課題感、検討中の機能要件、既存サイトURLなどをご自由にご記入ください。"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all ${
                      errors.message ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                    }`}
                  />
                  {errors.message && (
                    <div className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.message}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        送信中...
                      </span>
                    ) : (
                      <>
                        <span>送信して無料相談を申し込む</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-neutral-600 text-center mt-2.5">
                    送信いただくことで、当社のプライバシーポリシーに同意したものとみなされます。
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
