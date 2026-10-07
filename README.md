# KOUBOU サンプルサイト

React + Vite + Tailwind CSS で作成した静的サイトです。GitHub Pages で公開できます。

## ローカルで動かす

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # dist/ に静的ファイルを出力
npm run preview  # ビルド結果を確認
```

## GitHub Pages で公開する

1. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定
2. `main` ブランチに push すると `.github/workflows/deploy.yml` が自動でビルド・公開します
   （Actions タブから手動実行も可能）
3. 公開 URL: `https://<ユーザー名>.github.io/<リポジトリ名>/`

ビルドは相対パス (`base: './'`) で出力するため、リポジトリ名を変えても設定変更は不要です。
