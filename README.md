# スウガク（nan_suu）

公式を暗記せず、「なんで？」から理解するための算数・数学アニメーション教材。
動画（アニメーション）＋かいせつ＋いじってみよう＋もんだい、で1レッスン。

## レッスン
1. 円周率 π（ピザの耳をほどいて直径で測る）
2. 円の面積（ピザを切ってならべる → 半径×半径×π）
3. 三角形の面積（2枚で長方形 → 底辺×高さ÷2）

## 開発
```
npm install
npm run dev     # http://localhost:3000
npm run lint    # 型チェック
npm run build
```

## レッスンの足し方
1. `src/lessons/` に `Lesson` 型（`types.ts`）のオブジェクトを作る。
   - `Stage({ t })` は「t 秒の絵」を返す関数。時刻だけで絵が決まるので、シーク・倍速・戻る が自動で効く。
   - `scenes` はテロップと式（場面の開始秒つき）。`theme` でレッスンごとに配色を変えられる。
   - `steps`（かいせつ）/ `point` / `quiz`（`hintScene` で間違えたら該当場面へ戻れる）。
2. `src/lessons/index.ts` の配列に足す。

`src/components/pizza.tsx` に、ピザを n 等分して交互にならべる部品（`PizzaArrangement`）などがある。
