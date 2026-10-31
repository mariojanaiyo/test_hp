# 出典台帳

各ショートの主張と原著論文の確認状況。`scenes.js` の `source` / `caveat` と対応させる。
状態の定義と照合手順は `.claude/skills/verify-sources/SKILL.md`。未確認 → 書誌確認済み → 主張確認済み(ズレがあれば要修正)。
新しいショートを足したら、必ずここに行を足す。「確認済み」にするまで公開しない。

| id | 動画の核心の主張 | 出典 | 状態 |
|---|---|---|---|
| vole | 遺伝子(V1aR)を足すとメドウハタネズミが特定のメスを好むようになった | Lim et al. 2004, Nature 429:754 | 書誌確認済み (2026-10-28)。主張は未照合 |
| wolf | オオカミ再導入後にヤナギ・ポプラが回復(栄養カスケード)。川の形への影響は議論あり | Ripple & Beschta 2012, Biol Conserv 145:205 | 未確認 |
| bear | クマが運ぶサケ由来の窒素が樹木に取り込まれる | Hilderbrand et al. 1999, Oecologia 121:546 | 未確認 |
| myco | 菌根ネットワーク経由の炭素移動(1997)/ 過大解釈との批判(2023) | Simard 1997 Nature 388:579 / Karst 2023 Nat Ecol Evol 7:501 | 未確認 |
| ant | フェロモンによる自己組織化(アルゼンチンアリ) | Deneubourg et al. 1990, J Insect Behav 3:159 | 未確認 |
| gut | 腸内細菌約38兆個 / 腸脳相関 | Sender 2016 PLoS Biol / Cryan 2019 Physiol Rev 99:1877 | 未確認 |
| color | 3色型色覚は果実・若葉の発見に有利という仮説 | Regan et al. 2001, Phil Trans R Soc B 356:229 | 未確認 |
| laugh | 類人猿とヒトの笑い声の音響比較。起源は共通祖先まで遡る | Davila Ross et al. 2009, Curr Biol 19:1106 | 未確認 |
| legume | 根粒菌の窒素固定と宿主による制裁 | Kiers et al. 2003, Nature 425:78 | 未確認 |
| gondwana | ゴンドワナ分裂と有袋類の拡散 | Nilsson et al. 2010, PLoS Biol 8:e1000436 | 未確認 |
| interchange | アメリカ大交差。陸橋の時期は議論あり | Marshall 1982 Science 215:1351 / Montes 2015 Science 348:226 | 未確認 |
| goe | 大酸化イベントと縞状鉄鉱層 | Lyons et al. 2014, Nature 506:307 | 未確認 |
| deer | シカの過密で林床の植物が減り、昆虫・鳥にも波及する。単純化した状態は元に戻りにくいことがある | Côté et al. 2004, Annu Rev Ecol Evol Syst 35:113-147 | 主張確認済み (2026-10-30、抄録まで)。本文は未入手 |
| bat | 野生の吸血コウモリの血の分け合いは、血縁の近さとお返しの機会の両方に左右される | Wilkinson 1984, Nature 308:181-184 | 主張確認済み (2026-10-31、抄録まで)。本文は未入手 |
| milk | 母乳オリゴ糖(HMO)は乳児に多くが消化されず大腸に届き、特定のビフィズス菌のエサになると考えられている | Bode 2012, Glycobiology 22(9):1147-1162 | 主張確認済み (2026-10-31、抄録と本文前半まで)。後半は未確認 |

## 確認メモ

- **vole** (2026-10-28): 検索結果から、著者・年・雑誌・巻ページ(Lim, Wang, Olazábal, Ren, Terwilliger, Young / Nature 429:754–757 / DOI 10.1038/nature02539)が一致することを確認。ウイルスベクターで腹側前脳のV1aRを増やすと、メドウハタネズミで特定のパートナーを好む行動が増えた。ただし著者の主張は「1遺伝子が一夫一妻か乱婚かを決める」よりも狭く、既存の神経回路の中でその1遺伝子を変えると効く、という言い方。現行のフック「遺伝子1つで一途に」は強め。抄録・本文での照合はまだなので、状態は「書誌確認済み」止まり。

- **deer** (2026-10-30): 書誌(Côté, Rooney, Tremblay, Dussault, Waller / Annu Rev Ecol Evol Syst 35:113–147 / DOI 10.1146/annurev.ecolsys.35.021103.105725)を Wright State 大学リポジトリ(https://corescholar.libraries.wright.edu/biology/43)と scilit で照合。抄録(scilit 掲載)で、シカの増加、選択採食による植物の被度・多様性の低下、昆虫・鳥・哺乳類への波及、単純化した代替状態が安定で戻りにくい、を確認。ただし鳥についての数値は抄録になく、動画に数字は出していない。BACKLOG 仮フックの「熊や狼を消すと」(捕食者の除去がシカ増加の原因)は本文で確認できていないので、動画では扱わず「シカが増えすぎると」に絞った。本文PDFは取得できず(別論文のPDFが返ったため不採用)。

- **otter** (2026-10-30): 書誌(Estes & Palmisano / Science 185(4156):1058–1060 / DOI 10.1126/science.185.4156.1058)と抄録を USGS の出版物記録(https://pubs.usgs.gov/publication/1007670)で照合。抄録: アリューシャン列島西部でラッコのいる島といない島を比較、ラッコが草食の無脊椎動物を抑え、いないと食害で海藻群落が壊れる。観察による比較で、同一の島の前後実験ではない → caveat に記載。後続の Estes et al. 1998 Science 282:473(シャチ捕食によるラッコ急減とウニ増加・ケルプ減少)は検索結果の要約のみで確認、動画には使わず caveat で触れた。数値は動画に出していない。本文は未入手。YouTube 限定公開で投稿済み(2026-10-30): https://youtube.com/shorts/hLwj4Tn2nHE

- **bat** (2026-10-31): 書誌(Wilkinson / Nature 308(5955):181–184 / DOI 10.1038/308181a0 / 1984-03-08)を USF デジタルコモンズ(https://digitalcommons.usf.edu/kip_articles/5110)と reflectionsonpaperspast.com(書誌・研究概要)で照合。抄録: 野生の吸血コウモリの吐き戻しによる血の分け合いは、血縁度とお返しの機会の指標に独立に、ほぼ同程度に依存。血縁・非血縁の混在群でお返しが働き、飼育下で非血縁個体が血を交換。本文は未入手でサンプル数は未確認、動画に数字は出していない。反論・更新: Carter & Wilkinson 2013 Proc R Soc B 280:20122573(飼育20匹、過去に受けた分与が血縁より分与をよく予測)を検索結果の要約で確認、caveat に記載。BACKLOG 仮フックの「覚えている？」は記憶の直接証拠ではなく、お返しの偏りから推定される話なので、動画では「？」型の問いに留め、字幕は「お返しが効く、と報告」とした。 YouTube 限定公開で投稿済み(2026-10-31): https://youtube.com/shorts/msdrOaUMTaQ

- **新チャンネル(toriaezu_test)への投稿** (2026-10-31): 投稿先を toriaezu_test(UCH_pPsd1BvsaZSgyc8OSfeQ)に切り替え、既存の3本を限定公開で上げた。deer: https://youtube.com/shorts/MqHR23avoOc / otter: https://youtube.com/shorts/bbQLfIcUHGk / bat: https://youtube.com/shorts/HV-7hpQadWs

- **milk** (2026-10-31): 書誌(Bode, L. / Glycobiology 22(9):1147–1162 / DOI 10.1093/glycob/cws074 / PMC3406618)を PMC(https://pmc.ncbi.nlm.nih.gov/articles/PMC3406618/)で照合。総説の抄録と本文の前半(約10万字)を読んだ。HMO は胃酸・消化酵素に耐えて大部分が大腸に届き(約1%が吸収)、B. infantis など一部のビフィズス菌のエサになる。ビフィズス菌すべてに効くわけではない。働きの多くは試験管・動物・観察研究で、人での介入試験が必要と著者が述べている。BACKLOG 仮フックの「赤ちゃんのためじゃない」は言い過ぎなので、「消化されない？」の問いにとどめた。本文後半は未確認。
