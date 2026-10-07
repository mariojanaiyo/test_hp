import workFintechImg from '../assets/images/work_fintech_1791348328255.jpg';
import workBrandingImg from '../assets/images/work_branding_1791348342140.jpg';
import workCommerceImg from '../assets/images/work_commerce_1791348355105.jpg';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  enTitle: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  leadTime: string;
  bestFor: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: 'web' | 'brand' | 'ec';
  categoryLabel: string;
  year: string;
  metrics: string;
  metricLabel: string;
  description: string;
  challenge: string;
  solution: string;
  image: string;
  stack: string[];
  duration: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  enName: string;
  price: string;
  popular?: boolean;
  target: string;
  description: string;
  features: string[];
  deliveryWeeks: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
}

export interface FaqItem {
  id: string;
  category: 'general' | 'cost' | 'tech';
  question: string;
  answer: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'design',
    number: '01',
    title: 'UI/UXデザイン & デザインシステム構築',
    enTitle: 'Product Design & Design Systems',
    description: '直感的な操作性とビジネス目標の達成を両立するUI/UX設計。Figmaを用いた高精度プロトタイピングと、拡張性の高いコンポーネントシステムを構築します。',
    deliverables: ['ユーザー調査・カスタマージャーニーマップ', '情報アーキテクチャ (IA) 設計', 'Figma 高精度インタラクティブプロトタイプ', 'トークン連動型デザインシステム'],
    techStack: ['Figma', 'Tokens Studio', 'Storybook', 'Tailwind CSS'],
    leadTime: '約 3〜6 週間',
    bestFor: 'SaaSプロダクト、新規Webサービス、社内基幹ツールの刷新',
  },
  {
    id: 'frontend',
    number: '02',
    title: 'モダンフロントエンド & Web開発',
    enTitle: 'Full-Stack & Frontend Engineering',
    description: 'React、Next.js、TypeScriptを軸にした堅牢で高速なWebアプリケーション実装。Core Web Vitalsの最適化と堅牢なアクセシビリティを徹底します。',
    deliverables: ['レスポンシブWebアプリケーション実装', 'ヘッドレスCMS (microCMS/Sanity) 統合', 'API設計およびバックエンド連携', 'SEO・表示速度（PageSpeed 90+）最適化'],
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Vercel / Cloud Run'],
    leadTime: '約 4〜10 週間',
    bestFor: '高い表示速度と洗練されたインタラクションを求める企業サイト・Webアプリ',
  },
  {
    id: 'branding',
    number: '03',
    title: 'ブランド戦略 & クリエイティブディレクション',
    enTitle: 'Brand Identity & Visual Strategy',
    description: '企業のコア価値を言語化し、ロゴ・タイポグラフィ・写真表現・キービジュアルまで一貫した世界観を構築。ステークホルダーの共感を生むブランド体験を提供します。',
    deliverables: ['ブランドコンセプト・ステートメント策定', 'ロゴマーク & ロゴタイプ設計', 'ブランドガイドライン規定書', '名刺・パンフレット・各種VIツール'],
    techStack: ['Illustrator', 'Photoshop', 'Brand Guideline System', 'Typography Design'],
    leadTime: '約 4〜8 週間',
    bestFor: 'スタートアップの創業期ブランディング、既存企業のリブランディング',
  },
  {
    id: 'growth',
    number: '04',
    title: 'コンバージョン改善 & グロース支援',
    enTitle: 'Growth Strategy & CRO Analytics',
    description: '公開後の数値を可視化し、A/Bテストやヒートマップ分析に基づいた継続的なUI改善を実施。獲得単価（CPA）の抑制と成約率（CVR）の最大化を追求します。',
    deliverables: ['GA4 / GTM / ヒートマップ計測環境構築', 'CVR改善に向けたUI/UX改善提案', '月次データレポート & 定例レビュー', '継続的A/Bテスト実装・検証'],
    techStack: ['Google Analytics 4', 'Clarity', 'Optimizely', 'BigQuery'],
    leadTime: '月額リテーナー契約（3ヶ月〜）',
    bestFor: '広告効果を高めたいLP、問い合わせ件数を倍増させたいB2Bサービス',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'aurora-fintech',
    title: '次世代資産運用プラットフォーム「AURORA」Webアプリ刷新',
    client: 'AURORA Financial Technologies 株式会社',
    category: 'web',
    categoryLabel: 'SaaS / Webアプリ',
    year: '2025',
    metrics: '+184%',
    metricLabel: '新規口座開設CVR',
    description: '複雑な投資ポートフォリオ管理を直感的なカードUIで再構築。モバイルファーストでの使いやすさを徹底追求し、大幅な成約率改善を実現。',
    challenge: '専門用語が多く複雑な投資設定画面により、初回登録ユーザーの約62%が途中で離脱していた。',
    solution: '3ステップで完了するウィザード形式のオンボーディングと、リアルタイム損益シミュレーションUIを導入。',
    image: workFintechImg,
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    duration: '約 3.5 ヶ月',
  },
  {
    id: 'kanso-craft',
    title: '工芸ライフスタイルブランド「KANSO」グローバルVI & EC構築',
    client: '株式会社 閑素 (KANSO Lifestyle Japan)',
    category: 'brand',
    categoryLabel: 'ブランディング / VI',
    year: '2025',
    metrics: '3.4倍',
    metricLabel: '海外からの月間受注額',
    description: '日本の伝統素材を生かしたライフスタイルブランドのCI策定から、多言語対応のオンラインストア設計までを一貫して担当。',
    challenge: '国内のみに依存していた販路を北米・欧州へ展開するため、普遍的で洗練された英語圏向けブランド構築が急務だった。',
    solution: '余白の美を重視したミニマルなタイポグラフィと高品質なテクスチャ撮影をディレクション。Shopify Headlessで超高速なストアを構築。',
    image: workBrandingImg,
    stack: ['Brand Identity', 'Shopify Storefront API', 'Next.js', 'Contentful'],
    duration: '約 4 ヶ月',
  },
  {
    id: 'nordic-living',
    title: 'デザイナーズ家具レンタル「NORDIC STUDIO」プラットフォーム',
    client: 'NORDIC LIVING JAPAN 合同会社',
    category: 'ec',
    categoryLabel: 'EC / サブスクリプション',
    year: '2024',
    metrics: '+210%',
    metricLabel: '年間アクティブ会員数',
    description: '高価格帯北欧家具のサブスクリプション型コマースサイト。3DプレビューとAR空間配置機能を組み合わせ、購買の不安を解消。',
    challenge: '大型家具の購入・レンタル検討において、部屋のサイズ感やインテリアとの調和への不安からカート落ちが多発していた。',
    solution: '寸法ガイド付きのインタラクティブシミュレータと、シンプルなプラン比較UIを実装。即時見積もり機能を提供。',
    image: workCommerceImg,
    stack: ['React', 'Next.js', 'Tailwind CSS', 'Stripe Connect'],
    duration: '約 5 ヶ月',
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'スタータープラン',
    enName: 'Starter Website',
    price: '450,000',
    target: '高品質なコーポレートサイト・プロモーションLPをお求めの企業様',
    description: '洗練されたデザインと高速な表示性能を備えた、信頼性の高いブランド発信基盤をスピーディーに構築します。',
    features: [
      'ページ構成: トップ + 主要下層4〜6ページ',
      'オリジナルUI/UXデザイン（Figma設計）',
      '完全レスポンシブ実装（スマホ・タブレット・PC）',
      'microCMS等のお知らせ・ブログ投稿機能',
      'SEO内部基本施策 & Googleアナリティクス設定',
      '公開後1ヶ月間の無償バグ修正サポート',
    ],
    deliveryWeeks: '約 3〜5 週間',
  },
  {
    id: 'growth',
    name: 'グロースプラン',
    enName: 'Growth Web Application',
    price: '1,200,000',
    popular: true,
    target: 'SaaS、Webアプリケーション、本格的な事業サイトをお求めの成長企業様',
    description: 'デザインシステム設計から複雑なフロントエンド実装、API連携まで網羅したハイエンドなWeb構築パッケージです。',
    features: [
      'ページ構成: 10〜20ページ規模、またはWebアプリ画面',
      'デザインシステム（Figmaコンポーネント規約）構築',
      'React / Next.js / TypeScript による超高速実装',
      '各種外部API・DB連携 & 認証フロー対応',
      'Core Web Vitals パフォーマンス最適化（PageSpeed 90+）',
      '専任ディレクターによる週次定例ミーティング',
      '公開後3ヶ月間の運用テクニカルサポート',
    ],
    deliveryWeeks: '約 6〜10 週間',
  },
  {
    id: 'custom',
    name: 'カスタムスタジオ',
    enName: 'Enterprise Custom',
    price: '2,800,000',
    target: '大規模リブランディング、DXシステム、グローバル展開をお考えの企業様',
    description: 'ブランド戦略策定から設計、実装、データ基盤構築まで、専属チームが伴走してビジネスの革新を実現します。',
    features: [
      '要件に合わせた完全フルオーダーメイド設計',
      'CI/VI策定（ロゴ・ガイドライン策定含む）',
      '多言語（日英）対応 & グローバルCDN配信設計',
      '複雑な権限管理・決済（Stripe）・業務基盤統合',
      'セキュリティ診断 & 高負荷ストレステスト',
      '専属チーム（PM・デザイナー・テックリード）体制',
      '年間リテーナー契約による継続的グロース支援',
    ],
    deliveryWeeks: '約 12 週間〜',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'ヒアリング & 戦略リサーチ',
    en: 'Discovery & Strategy',
    desc: '事業課題、競合環境、ターゲットユーザーの行動心理を徹底的に分析。プロジェクトの成功指標（KPI）を明確に定義します。',
    deliverables: ['要件定義書', 'サイトマップ', 'ペルソナ & ジャーニーマップ'],
    duration: '1〜2週間',
  },
  {
    step: '02',
    title: 'UI/UXプロトタイプ設計',
    en: 'Prototyping & System',
    desc: 'ワイヤーフレームからFigma上での高精度インタラクティブプロトタイプを作成。実際の挙動を早期に触って検証・合意形成を図ります。',
    deliverables: ['Figmaプロトタイプ', 'デザインシステム', 'アニメーション仕様書'],
    duration: '2〜3週間',
  },
  {
    step: '03',
    title: '高品質実装 & テスト検証',
    en: 'Engineering & QA',
    desc: 'TypeScriptとモダンフレームワークを用いた保守性の高いクリーンコード実装。複数デバイスでの動作検証、速度測定を厳格に実施。',
    deliverables: ['テスト環境（ステージング）', 'クロスブラウザ検証結果', '速度改善レポート'],
    duration: '3〜5週間',
  },
  {
    step: '04',
    title: 'ローンチ & 成長伴走',
    en: 'Launch & Growth',
    desc: 'ドメイン切り替え、各種分析ツールの計測確認を経て無事本番公開。公開後もデータ分析に基づき、改善提案を継続します。',
    deliverables: ['本番環境デプロイ', 'CMS操作マニュアル', '初月アクセス解析レポート'],
    duration: '公開後〜',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'デザインの美しさだけでなく、コンバージョンに直結するユーザー心理を熟知した設計に驚きました。リニューアル翌月から問い合わせ数が2.4倍に急増しました。',
    author: '佐藤 健一',
    role: '代表取締役 CEO',
    company: 'メディカルテック株式会社',
    metric: '問い合わせリード 2.4倍達成',
  },
  {
    id: 'test-2',
    quote: '技術力の高さとコミュニケーションの迅速さが圧倒的でした。タイトなスケジュールの中でも品質に一切妥協せず、期待以上のクオリティで納品いただきました。',
    author: '高橋 美咲',
    role: 'プロダクトマネージャー',
    company: 'クラウドネクスト合同会社',
    metric: 'リリース後 継続率98%維持',
  },
  {
    id: 'test-3',
    quote: '社内リブランディングの際、メンバー全員が納得できる言葉とビジュアルを丁寧に紡いでくれました。採用エントリー数が過去最高を更新しています。',
    author: '山本 拓也',
    role: 'ブランド推進部 室長',
    company: '株式会社 フロンティアキャピタル',
    metric: '採用応募数 +160% 増加',
  },
];

export const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'まだ要件が固まっていない段階でも相談できますか？',
    answer: 'はい、もちろん大歓迎です。「事業課題を解決したい」「現在のサイトの成約率を上げたい」といった大まかな目標から、最適な仕様や進め方を一緒に企画・設計いたします。',
  },
  {
    id: 'faq-2',
    category: 'cost',
    question: '制作費用の支払い条件や分割払いは可能ですか？',
    answer: '通常は「ご発注時（着手金50%）」「納品完了時（残金50%）」の2回払いを基本としております。大規模プロジェクトや長期開発の場合は、マイルストーンごとの分割払いにも柔軟に対応いたします。',
  },
  {
    id: 'faq-3',
    category: 'general',
    question: '全国・海外からのリモートでのご依頼は可能ですか？',
    answer: '日本全国および海外からのご相談に対応しております。Google MeetやSlack、Figmaを活用した円滑なリモート進行体制を整えております。都内近郊であれば対面での打ち合わせも可能です。',
  },
  {
    id: 'faq-4',
    category: 'tech',
    question: '納品後のサイト更新や修正は自社で行えますか？',
    answer: 'はい。microCMSやWordPress、Shopifyなどの管理画面（CMS）を導入し、専門知識のないスタッフの方でも直感的にテキストや画像の更新が行えるように納品いたします。納品時には丁寧な操作マニュアルをお渡しします。',
  },
  {
    id: 'faq-5',
    category: 'tech',
    question: 'セキュリティや機密保持契約（NDA）の締結は可能ですか？',
    answer: 'はい。事前のご相談段階から機密保持契約（NDA）の締結を承っております。情報セキュリティ基本方針に則り、お客様の事業情報・データを厳重に保護いたします。',
  },
];

export const CLIENT_LOGOS = [
  { name: 'TECH HORIZON', industry: 'Enterprise SaaS' },
  { name: 'NEXUS CAPITAL', industry: 'Venture Capital' },
  { name: 'AURORA FINTECH', industry: 'Finance & Banking' },
  { name: 'KANSO CRAFT', industry: 'Lifestyle Design' },
  { name: 'METRO MOBILITY', industry: 'Smart Transit' },
  { name: 'LUMINA MEDIA', industry: 'Digital Publishing' },
];
