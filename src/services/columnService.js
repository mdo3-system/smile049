/**
 * 悩み解決型 SEOコラムデータ管理サービス (columnService.js)
 * 
 * Googleの検索意図（インテント）に特化した高密度なSEOコラムを管理・自動生成します。
 * スタッフ様はテーマを選ぶだけで、長文SEO記事と4大SNS用テキストをワンクリック生成・公開できます。
 */

export const COLUMN_STORAGE_KEY = 'smile049_seo_columns_v1';

// 初期配備：検索ボリューム最大化 10大お悩み解決SEOコラム
export const DEFAULT_COLUMNS = [
  {
    id: 'col_01',
    slug: 'adjust-area-garage',
    category: '市街化調整区域・法規',
    badge: '法規・申請',
    title: '市街化調整区域でガレージ・倉庫は建てられる？建築士が教える許可基準とワンストップ申請のポイント',
    description: '「市街化調整区域だからガレージを諦めていた」「既製品メーカーに断られた」という方へ。都市計画法43条・農地法の手続きから、木造自由設計ガレージが調整区域で許可を取りやすい理由まで建築士が完全解説。',
    readTime: '約5分',
    publishedDate: '2026-10-09',
    tags: ['市街化調整区域', '建築許可', '農地転用', '都市計画法43条', '木造ガレージ', '確認申請'],
    heroImage: '/assets/plans/plan03.jpg',
    photos: [
      '/assets/construction/01/IMG_1487.jpeg',
      '/assets/construction/01/IMG_1623.jpeg',
      '/assets/construction/01/IMG_1840.JPG'
    ],
    simulatorCta: {
      planId: 'plan-agri',
      label: '市街化調整区域向け倉庫プランを3Dで試す',
      hint: 'トラクターや複数台保管の大開口・高天井モデル'
    },
    sections: [
      {
        h2: '1. なぜ市街化調整区域ではガレージ建築が難しいとされるのか？',
        content: `市街化調整区域は、都市計画法により「市街化を抑制すべき区域」と定められており、原則として建築物の新築・増築が厳しく制限されています。\n一般的な量販店やスチール物置メーカーでは、行政協議や法規調査、申請書類作成の専門部署を持たないため、「調整区域はお受けできません」と一律で断られてしまうケースが後を絶ちません。`,
        bulletPoints: [
          '都市計画法第43条（開発許可・建築許可基準）のハードル',
          '農地（田・畑）の場合は農業委員会への「農地転用（4条・5条）」が必須',
          '設計事務所と申請代行業者の窓口が分かれることによる費用高騰'
        ]
      },
      {
        h2: '2. 木造自由設計なら市街化調整区域でも建てられる理由',
        content: `スマイチでは、自社専任の建築士が敷地調査・都市計画法協議・農地法手続き・構造計算・確認申請までを一括ワンストップで代行します。\n農機具保管庫、既存宅地の緩和規定、自己用倉庫など、自治体ごとの運用基準に合わせて最適な名義・仕様で申請書を作成するため、高い許可取得率を実現しています。`,
        highlight: '【ポイント】分業せず窓口を一本化することで、申請期間を約1〜2ヶ月短縮し、余分な中間手数料をカットできます。'
      },
      {
        h2: '3. 調整区域ガレージ建築のよくある質問（Q&A）',
        faqs: [
          { q: '確認申請を出さずに建てるとどうなりますか？', a: '違法建築物となり、行政からの是正命令や罰則、将来の売却時に住宅ローンが組めなくなるなどの重大なリスクがあります。スマイチでは全棟正規の確認申請を代行します。' },
          { q: '農業を営んでいなくても倉庫を建てられますか？', a: '敷地が「既存宅地」の場合や、地域ごとの緩和条例に合致すれば非農家の方でも建築可能です。まずは敷地の求積図・公図をお送りいただければ建築士が無料判定いたします。' }
        ]
      }
    ],
    snsText: {
      x: '【市街化調整区域 ガレージ建築の真実】\n「既製品メーカーに断られた」という方へ。\n都市計画法43条や農地転用も、自社専任スタッフによる確認申請ワンストップなら解決可能！敷地に合わせて自分で描く木造ガレージで諦めていた夢を実現。\n無料3Dシミュレーターはこちら👇\nhttps://smile049.jp/column/adjust-area-garage\n#市街化調整区域 #木造ガレージ #スマイチ',
      note: '市街化調整区域でガレージや倉庫を建てる方法を、建築士の視点から徹底解説。規格品スチールガレージで断られてしまう理由と、木造自由設計なら許可を取得できる仕組みをまとめました。'
    }
  },
  {
    id: 'col_02',
    slug: 'deformed-narrow-land-garage',
    category: '変形地・狭小地活用',
    badge: '敷地最適化',
    title: '変形地・狭小地・敷地境界15cm！四角くない土地にぴったり納めるミリ単位木造ガレージ設計術',
    description: '台形地、三角地、旗竿地、境界ギリギリのデッドスペース。「既製品の四角い物置では土地が余る・入らない」というお悩みを、ミリ単位で角度や幅を変えられる木造自由設計が劇的に解決します。',
    readTime: '約4分',
    publishedDate: '2026-10-09',
    tags: ['変形地', '狭小地', '台形地', '敷地境界15cm', '軒ゼロ', '木造ガレージ', 'ミリ単位設計'],
    heroImage: '/assets/plans/plan02.jpg',
    photos: [
      '/assets/construction/01/IMG_1491.jpeg',
      '/assets/construction/01/IMG_1842.JPG',
      '/assets/construction/02/IMG_2310.jpeg'
    ],
    simulatorCta: {
      planId: 'plan-storage',
      label: '変形地・狭小ストッカーを3Dで試す',
      hint: '4辺の長さ・台形変形をリアルタイム操作'
    },
    sections: [
      {
        h2: '1. 既製品プレハブが「変形地」に弱い理由',
        content: `一般的な規格型ガレージは「直角の四角形（正方形・長方形）」モジュールしか存在しません。\n道路が斜めになっている土地や、境界線が斜めの角地に四角いガレージを置くと、デッドスペース（使えない三角の隙間）が生まれ、敷地を大きく無駄にしてしまいます。`,
        bulletPoints: [
          '敷地境界と建物の間に1m以上の無駄な隙間ができる',
          '屋根の「軒の出（ケラバ）」が隣地境界を越境しそうになる',
          '間口を広げると奥行きがはみ出し、次の規格サイズが入らない'
        ]
      },
      {
        h2: '2. 敷地境界実質15cmまで攻める「軒ゼロ木造設計」',
        content: `スマイチの木造ガレージは、4辺（正面・背面・左奥行・右奥行）の長さを1cm単位で独立変更できるため、台形地や隅欠き敷地にミリ単位でジャストフィットします。\nさらに、屋根の軒の出をゼロ（面一）にする「軒ゼロ金物工法」により、隣地境界から外壁仕上面まで実質15cm（柱芯30cm）の限界クリアランスを実現できます。`,
        highlight: '【実例】スマイチ第1号棟では、隣地駐車場との境界線から実質15cmまで寄せ、駐車2台分のスペースを1cmの無駄もなく使い切りました。'
      }
    ],
    snsText: {
      x: '【変形地・狭小地にガレージは建つ？】\n台形地や斜めの角地、既製品物置だと無駄な隙間ができて諦めていませんか？\nスマイチの木造自由設計なら、敷地境界から実質15cmまで寄せるミリ単位フィットが可能！\n3Dであなたの土地サイズを即時積算👇\nhttps://smile049.jp/column/deformed-narrow-land-garage\n#変形地 #狭小地 #木造ガレージ #スマイチ',
      note: '台形地や旗竿地などの変形地に、無駄な余白を残さずミリ単位で建てる木造ガレージの設計ノウハウを公開。軒ゼロ仕様による境界15cmの限界突破事例をご紹介します。'
    }
  },
  {
    id: 'col_03',
    slug: 'wood-vs-steel-garage',
    category: '構造・性能比較',
    badge: '徹底比較',
    title: '木造ガレージ vs スチール（鉄骨・プレハブ）物置を徹底比較！結露・断熱・耐久性・固定資産税の違い',
    description: 'ガレージ選びで誰もが迷う「木造」と「スチール（鉄骨）」の違いをプロの視点で完全比較。冬場の結露トラブル、夏のサウナ状態、サビ、自由な棚付けDIY、固定資産税の評価額まで総点検。',
    readTime: '約6分',
    publishedDate: '2026-10-09',
    tags: ['木造 vs 鉄骨', '結露対策', 'ガレージ断熱', '固定資産税', 'DIY棚付け', '耐久性比較'],
    heroImage: '/assets/plans/plan01.jpg',
    photos: [
      '/assets/construction/01/IMG_1676.jpeg',
      '/assets/construction/01/IMG_1707.jpeg',
      '/assets/construction/01/IMG_1811.jpeg'
    ],
    simulatorCta: {
      planId: 'plan-hobby',
      label: '愛車・ホビー向け木造ピットを3Dで試す',
      hint: '梁現しの高天井・木製棚を自由配置'
    },
    sections: [
      {
        h2: '1. 愛車や工具をサビ・カビから守る「結露・調湿性」の差',
        content: `金属板で囲まれたスチールガレージは熱伝導率が高く、冬場の冷え込みや梅雨時期に天井・壁の内側に大量の水滴（結露）が発生します。これが愛車のサビや大事な工具・資材のカビの原因になります。\n木造建築は、木材自体が呼吸するように湿気を吸放出する「天然の調湿作用」を持ち、さらに透湿防水シート＋通気胴縁の二重外壁構造により、結露の発生を極限まで抑えます。`
      },
      {
        h2: '2. 比較表：木造自由設計 vs 一般的な規格スチールガレージ',
        comparisonTable: [
          { item: '結露・湿気対策', wood: '◎ 木材の自然調湿＋外壁通気層で結露を抑制', steel: '△ 金属板が外気で冷え、天井から水滴が垂れやすい' },
          { item: '夏の室温上昇', wood: '◯ 木材と通気層の断熱効果で熱がこもりにくい', steel: '✕ 直射日光で鉄板が熱せられサウナ状態に' },
          { item: '内装DIY・棚追加', wood: '◎ 柱や合板下地に木ネジでどこでも棚やフックを固定', steel: '✕ 鉄板のためビスが効かず、専用高額オプションのみ' },
          { item: '寸法・形状の自由度', wood: '◎ ミリ単位調整・台形・変形地・軒ゼロ対応', steel: '✕ 決まった規格サイズのみ（10cm単位の調整不可）' },
          { item: '申請・工事体制', wood: '◎ 建築士ワンストップ（申請・基礎・建て方・電気一括）', steel: '△ 基礎・申請・電気は施主が別業者を手配' }
        ]
      }
    ],
    snsText: {
      x: '【木造 vs スチールガレージ徹底比較】\n愛車や農機具を保管するならどっち？\n冬の結露・夏の猛暑・壁面棚のDIY・確認申請の手間までプロが徹底比較！\n木造ならではの調湿性と自由度をチェック👇\nhttps://smile049.jp/column/wood-vs-steel-garage\n#木造ガレージ #ガレージ比較 #結露対策 #スマイチ',
      note: '木造ガレージとスチール製物置の性能・コスト・使い勝手を徹底比較。結露や湿気が気になる愛車・バイク派必見の解説記事です。'
    }
  },
  {
    id: 'col_04',
    slug: 'case-study-02-carport-conversion',
    category: '施工実例レポート',
    badge: '実例 第2号',
    title: '【施工実例 第2号】カーポート予定を急遽変更！住宅新築時に建てた1台用特注スリム木造ガレージ全記録',
    description: '自宅新築中に「やっぱりアルミカーポートではなく、雨風を完全に防げる木造ガレージにしたい」と変更された施主様の実例。敷地の細長い形状にミリ単位で合わせた88枚の現場写真を全公開。',
    readTime: '約4分',
    publishedDate: '2026-10-09',
    tags: ['施工実例', 'カーポートからガレージ', '1台用ガレージ', '細長敷地', '新築外構', '現場写真'],
    heroImage: '/assets/construction/02/IMG_2310.jpeg',
    photos: [
      '/assets/construction/02/IMG_2310.jpeg',
      '/assets/construction/02/IMG_2337.jpeg',
      '/assets/construction/02/IMG_2430.jpeg',
      '/assets/construction/02/IMG_2514.jpeg'
    ],
    simulatorCta: {
      planId: 'plan-hobby',
      label: '1台用スリムガレージを3Dで試す',
      hint: '愛車1台＋通路＋壁面収納のジャストサイズ'
    },
    sections: [
      {
        h2: '1. なぜアルミカーポートから木造ガレージへ変更したのか？',
        content: `当初は住宅メーカー提携の外構業者で一般的な2本柱のアルミカーポートを設置する予定でした。\nしかし、台風や横殴りの雨、冬場のフロントガラス凍結、防犯面への不安から「周囲を壁とシャッターで囲ったガレージにしたい」とご相談をいただきました。\n既製品のガレージでは住宅の軒や敷地境界との間口が合わず、スマイチの1台用特注スリム設計をご採用いただきました。`,
        bulletPoints: [
          '住宅新築の工程に合わせて基礎工事・建て方をスムーズに同期',
          '住宅の外観と調和するモダンなブラックガルバリウム仕上げ',
          '愛車の乗り降り寸法を確保しながら敷地幅を無駄なく活用'
        ]
      },
      {
        h2: '2. 現場写真で見る1台用特注ガレージの施工プロセス',
        content: `基礎の配筋・型枠から木造建て方、金物緊結、外壁ガルバリウム施工、シャッター取付まで、全88枚の写真から主要な工程を公開しています。\n大工の丁寧な手仕事により、住宅のサッシ高さやアプローチ動線と美しく一体化したガレージが完成しました。`
      }
    ],
    snsText: {
      x: '【施工実例 第2号公開】\n自宅新築中にカーポート予定を急遽変更！\n敷地の細長い形状にミリ単位でジャストフィットさせた「1台用特注木造ガレージ」の全工程写真88枚を公開しました👇\nhttps://smile049.jp/column/case-study-02-carport-conversion\n#施工実例 #木造ガレージ #カーポート変更 #スマイチ',
      note: 'アルミカーポートから木造ガレージへ変更されたお客様の施工実例。細長い敷地条件をミリ単位で克服した施工プロセスを現場写真とともに解説します。'
    }
  },
  {
    id: 'col_05',
    slug: 'agri-shed-subsidy',
    category: '農業・大型倉庫',
    badge: '補助金・税制',
    title: '農機具倉庫・トラクター車庫の建て方！市街化調整区域・農地転用と補助金・税制優遇の活用法',
    description: '大型トラクターやコンバイン、収穫物の保管に必要な大開口・高天井倉庫。農業用倉庫の建築確認申請、農地転用の流れ、導入時に活用できる補助金や減価償却のポイントをわかりやすく解説。',
    readTime: '約5分',
    publishedDate: '2026-10-09',
    tags: ['農機具倉庫', 'アグリシェッド', 'トラクター車庫', '農地転用', '農業補助金', '市街化調整区域'],
    heroImage: '/assets/plans/plan03.jpg',
    photos: [
      '/assets/plans/plan03.jpg',
      '/assets/construction/01/IMG_1671.jpeg',
      '/assets/construction/01/IMG_1840.JPG'
    ],
    simulatorCta: {
      planId: 'plan-agri',
      label: '農機具・大型倉庫を3Dで試す',
      hint: 'トラクター配置・大型シャッター連動'
    },
    sections: [
      {
        h2: '1. 大型農機具の保管で直面する「規格品の寸法不足」',
        content: `キャビン付きトラクターや大型作業機は全高が3m近くに達し、規格プレハブではシャッター有効高や間口が足りず、機材の出し入れで屋根に接触する危険があります。\nスマイチのアグリシェッドなら、軒高・水上高・開口幅をミリ単位で自由に設定できるため、複数台の通り抜け動線や天井ロフトも自在に組めます。`
      }
    ],
    snsText: {
      x: '【農機具倉庫・トラクター車庫の建て方】\n大型農機具が入る高天井・ワイド間口を自由に設計！\n市街化調整区域の申請から農地転用、農業補助金活用まで建築士が完全サポート。\n3Dで農機具を配置して即時積算👇\nhttps://smile049.jp/column/agri-shed-subsidy\n#農機具倉庫 #アグリシェッド #トラクター #農業倉庫 #スマイチ',
      note: '大型トラクターや農機具の保管に特化した木造アグリシェッドの建築ノウハウ。市街化調整区域の申請手順や補助金活用のポイントを解説します。'
    }
  },
  {
    id: 'col_06',
    slug: 'building-confirmation-10sqm-rule',
    category: '建築法規・申請',
    badge: '法規解説',
    title: 'ガレージ・倉庫に確認申請は必要？「10㎡以下なら不要」の落とし穴と安全な手続き基準',
    description: '「10㎡以下（約3坪・6畳）なら確認申請はいらない」という噂の真偽を建築士が徹底解説。防火・準防火地域、更地への新築、市街化調整区域など、申請が必要になる具体的なケースと無確認建築のリスク。',
    readTime: '約5分',
    publishedDate: '2026-10-09',
    tags: ['確認申請', '10㎡ルール', '建築基準法', '防火地域', '違法建築リスク', '建築士ワンストップ'],
    heroImage: '/assets/plans/plan02.jpg',
    photos: [
      '/assets/construction/01/IMG_1487.jpeg',
      '/assets/construction/01/IMG_1683.jpeg'
    ],
    simulatorCta: {
      planId: 'simulator',
      label: '3Dシミュレーターで面積と確認申請をチェック',
      hint: '靴ひも公式による精密な床面積・坪数をリアルタイム算出'
    },
    sections: [
      {
        h2: '1. 「10㎡以下なら確認申請不要」が通用しない3つの例外',
        content: `建築基準法第6条第2項では、防火地域・準防火地域外において、既存建築物がある敷地内での10㎡以内の「増築・改築・移転」に限り確認申請が不要とされています。\nしかし、以下のケースでは面積にかかわらず必ず確認申請が必要です。`,
        bulletPoints: [
          '防火地域または準防火地域内の敷地に建てる場合（1㎡でも申請必須）',
          '更地（主たる建物がない敷地）に新築する場合（面積にかかわらず申請必須）',
          '市街化調整区域で都市計画法の建築許可が必要な場合'
        ]
      }
    ],
    snsText: {
      x: '【ガレージの確認申請 10㎡ルールの落とし穴】\n「10㎡以下なら申請不要」と思っていませんか？\n更地への新築や準防火地域では1㎡でも確認申請が必須です！無確認建築のリスクを避けるための正しい法規知識を建築士が解説👇\nhttps://smile049.jp/column/building-confirmation-10sqm-rule\n#確認申請 #建築基準法 #ガレージ建築 #スマイチ',
      note: 'ガレージや倉庫の確認申請が必要な条件を建築士がわかりやすく解説。10㎡ルールの誤解と安全な建築手続きについてまとめました。'
    }
  },
  {
    id: 'col_07',
    slug: 'hobby-bike-garage-dimensions',
    category: '愛車・バイク',
    badge: '寸法・間取り',
    title: '愛車・大型バイク用ガレージの理想寸法！ドア開閉・整備動線・壁面ツールラックのレイアウト術',
    description: '「建ててみたらドアが壁に当たって降りられない」「大型バイクの取り回しが狭い」という失敗を防ぐ寸法設計。クルマ＋バイク2台＋作業ベンチを無理なく納める間口と奥行きの黄金比率。',
    readTime: '約5分',
    publishedDate: '2026-10-09',
    tags: ['愛車ガレージ', 'バイクガレージ', 'ガレージ寸法', '整備ピット', '大人の秘密基地', 'ツールラック'],
    heroImage: '/assets/plans/plan01.jpg',
    photos: [
      '/assets/construction/01/IMG_1811.jpeg',
      '/assets/plans/plan01.jpg'
    ],
    simulatorCta: {
      planId: 'plan-hobby',
      label: '愛車＋バイクの3D配置を試す',
      hint: 'SUV・大型バイクを画面に配置してドア開閉スペースを確認'
    },
    sections: [
      {
        h2: '1. 車種から逆算するガレージの必要有効寸法',
        content: `普通乗用車（SUVやセダン）の全幅は約1.8〜1.9m。ドアを無理なく開けて乗り降りするには、左右に各70〜80cm、合計で**「内法間口3.3m以上」**が理想です。\n規格スチールガレージで多い間口3.0m（外寸）では内寸が狭まり、毎日の乗り降りにストレスを感じることになります。`
      }
    ],
    snsText: {
      x: '【愛車・バイクガレージの理想寸法】\n「ドアが壁に当たって降りられない」失敗を防ぐ！\n車幅＋乗り降り動線＋大型バイクの取り回しをミリ単位で計算する木造ピット設計術。\n3DでSUVとバイクを配置してみよう👇\nhttps://smile049.jp/column/hobby-bike-garage-dimensions\n#バイクガレージ #愛車ガレージ #大人の秘密基地 #スマイチ',
      note: '愛車や大型バイクを心地よく保管・整備するためのガレージ寸法設計ガイド。失敗しない間口・奥行き・棚レイアウトのポイントを解説します。'
    }
  },
  {
    id: 'col_08',
    slug: 'asphalt-cloth-foundation',
    category: '施工技術・コスト',
    badge: 'コスト削減',
    title: '既存アスファルト・舗装を壊さずにガレージを建てる！布基礎工法で解体費・産廃費を大幅カットする知恵',
    description: 'すでにアスファルトが打ってある駐車場。「全解体して土間コンクリートを打ち直す」と言われて高額見積もりに悩んでいませんか？既存舗装を最大限活かして建築コストを抑えるスマイチ独自の基礎工法。',
    readTime: '約4分',
    publishedDate: '2026-10-09',
    tags: ['既存アスファルト活用', '布基礎', 'ガレージ基礎工事', 'コストダウン', '車止め再利用', '施工実例'],
    heroImage: '/assets/construction/01/IMG_1623.jpeg',
    photos: [
      '/assets/construction/01/IMG_1618.jpeg',
      '/assets/construction/01/IMG_1623.jpeg',
      '/assets/construction/01/IMG_1841.JPG'
    ],
    simulatorCta: {
      planId: 'simulator',
      label: '3Dシミュレーターで基礎と積算を確認',
      hint: '外周布基礎の積算メーター数を即時自動算出'
    },
    sections: [
      {
        h2: '1. 既存アスファルトの全解体にかかる「見えない大金」',
        content: `アスファルトの解体・運搬・産業廃棄物処分費用は、駐車2台分で数十万円に達します。\nスマイチでは、良好な状態のアスファルト舗装をそのまま床面として活用し、外周部のみを掘削して立ち上がり布基礎を打設する工法を採用。余分な解体費・産廃費をゼロに抑えます。`
      }
    ],
    snsText: {
      x: '【既存アスファルトを活かすガレージ建築】\n駐車場のアスファルト、壊さずにそのまま使えば数十万円のコストカットに！\nスマイチ第1号棟でも採用された「既存舗装＋布基礎工法」の仕組みを解説👇\nhttps://smile049.jp/column/asphalt-cloth-foundation\n#ガレージ基礎 #アスファルト活用 #コスト削減 #スマイチ',
      note: '既存のアスファルト舗装を壊さずにガレージを建てる技術とコストダウン手法を公開。スマイチの現場施工ノウハウをご紹介します。'
    }
  },
  {
    id: 'col_09',
    slug: 'property-tax-depreciation',
    category: '税金・建築費',
    badge: '税務・資金',
    title: '木造ガレージの固定資産税と減価償却！スチール造との税額差と法人・個人の賢い経費化',
    description: 'ガレージを建てると固定資産税はいくら上がる？木造と軽量鉄骨造の耐用年数（減価償却期間）の違い、事業用ガレージの経費計上、金融機関の融資審査を通りやすくする図面・見積書の揃え方。',
    readTime: '約5分',
    publishedDate: '2026-10-09',
    tags: ['固定資産税', '減価償却', '耐用年数', '木造ガレージ税金', '事業用融資', '日本政策金融公庫'],
    heroImage: '/assets/plans/plan01.jpg',
    photos: [
      '/assets/plans/plan01.jpg',
      '/assets/construction/01/IMG_1840.JPG'
    ],
    simulatorCta: {
      planId: 'simulator',
      label: '概算建築費用をリアルタイム積算する',
      hint: '融資資料にも使える精密積算見積もり'
    },
    sections: [
      {
        h2: '1. 木造ガレージの固定資産税の目安と仕組み',
        content: `屋根・壁・基礎があり土地に定着したガレージは「家屋」として固定資産税の課税対象となります。\n木造ガレージは軽量鉄骨造に比べて評価額の計算において経年減価が早く、長期的に見た固定資産税の負担を抑えやすいという特徴があります。`
      }
    ],
    snsText: {
      x: '【木造ガレージの固定資産税と減価償却】\nガレージを建てると税金はいくら増える？\n木造と鉄骨の法定耐用年数の違いや、事業者様の経費計上・融資資料作成のポイントを解説👇\nhttps://smile049.jp/column/property-tax-depreciation\n#固定資産税 #ガレージ税金 #減価償却 #事業資金 #スマイチ',
      note: '木造ガレージの固定資産税や減価償却、融資申請のポイントをわかりやすく解説。個人・法人を問わず役立つ資金計画ガイドです。'
    }
  },
  {
    id: 'col_10',
    slug: '15m-truss-workshop-finance',
    category: '事業用・大空間',
    badge: '大スパン工法',
    title: '柱のない15m大空間！木造トラス構法による事業用倉庫・作業場・スタジオ建築と事業性融資',
    description: '鉄骨造の高騰で注目を集める「木造トラス大空間構法」。無柱で最大15mスパンを実現し、鉄骨造より坪単価を抑えながら短工期で完成。日本政策金融公庫や地方銀行の事業性融資・創業融資にも完全対応。',
    readTime: '約5分',
    publishedDate: '2026-10-09',
    tags: ['木造トラス', '15m無柱空間', '事業用倉庫', '作業場建築', 'スタジオ', '事業性融資'],
    heroImage: '/assets/plans/plan01.jpg',
    photos: [
      '/assets/plans/plan01.jpg',
      '/assets/construction/01/IMG_1676.jpeg'
    ],
    simulatorCta: {
      planId: 'plan-workshop',
      label: '無柱大空間ワークショップを3Dで試す',
      hint: '大スパン木造トラス構法モデル'
    },
    sections: [
      {
        h2: '1. 鉄骨造高騰の今、木造トラス大空間が選ばれる理由',
        content: `鋼材価格の高騰が続く中、木造トラス構法は材料費と基礎工事費を大幅に抑えつつ、柱のない広々とした作業場・配送倉庫・スタジオ・道場を実現できる画期的な工法です。`
      }
    ],
    snsText: {
      x: '【柱のない15m大空間！木造トラス倉庫】\n鉄骨造の高騰でお悩みの事業者様へ。\n木造トラス構法ならコストを抑えて大スパン作業場・倉庫を実現！事業計画書・融資資料作成もワンストップ支援👇\nhttps://smile049.jp/column/15m-truss-workshop-finance\n#木造倉庫 #大空間 #トラス構法 #事業用倉庫 #スマイチ',
      note: '無柱15m大空間を実現する木造トラス構法の解説記事。鉄骨造とのコスト比較や事業者向け融資支援について詳しくご紹介します。'
    }
  }
];

/**
 * 全コラムの取得（LocalStorage優先、なければデフォルト）
 */
export function getAllColumns() {
  if (typeof window === 'undefined') return DEFAULT_COLUMNS;
  try {
    const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load columns from storage', e);
  }
  return DEFAULT_COLUMNS;
}

/**
 * スラッグでコラムを検索
 */
export function getColumnBySlug(slug) {
  const columns = getAllColumns();
  return columns.find(c => c.slug === slug || c.id === slug) || null;
}

/**
 * コラムの保存・更新
 */
export function saveColumn(columnData) {
  const columns = getAllColumns();
  const index = columns.findIndex(c => c.id === columnData.id);
  let updated;
  if (index >= 0) {
    updated = [...columns];
    updated[index] = { ...updated[index], ...columnData };
  } else {
    updated = [columnData, ...columns];
  }
  try {
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save columns to storage', e);
  }
  return updated;
}

/**
 * テーマから新しいSEOコラムを即座に自動生成（スタッフ様用ワンクリック機能）
 */
export function generateAutoColumn(themeTitle, category = 'お悩み解決・ノウハウ') {
  const timestamp = Date.now();
  const slug = 'seo-article-' + timestamp;
  const newCol = {
    id: 'col_' + timestamp,
    slug: slug,
    category: category,
    badge: '建築士監修',
    title: themeTitle,
    description: `【建築士が解説】${themeTitle}について、確認申請・敷地条件・コスト・施工手順の観点から詳しく解説します。`,
    readTime: '約4分',
    publishedDate: new Date().toISOString().split('T')[0],
    tags: ['木造ガレージ', '自由設計', '確認申請', 'スマイチ', 'お悩み解決'],
    heroImage: '/assets/plans/plan01.jpg',
    photos: [
      '/assets/construction/01/IMG_1676.jpeg',
      '/assets/construction/01/IMG_1840.JPG'
    ],
    simulatorCta: {
      planId: 'simulator',
      label: 'このテーマのサイズを3Dシミュレーターで試す',
      hint: '登録不要・概算建築費用をリアルタイム自動算出'
    },
    sections: [
      {
        h2: `1. ${themeTitle}における主な課題とポイント`,
        content: `木造ガレージや倉庫をご検討される際、多くのお客様が「敷地に収まるか」「確認申請はどうなるか」「コストはいくらかかるか」という点に悩まれます。\nスマイチでは自社専任スタッフが一括ワンストップで対応するため、複雑な手続きや敷地条件の制約をスムーズにクリアできます。`
      },
      {
        h2: '2. 建築士によるワンストップ解決フロー',
        content: `無料の3Dシミュレーターで概算積算を行い、敷地図面やご要望をもとに専任スタッフが構造計算・確認申請・基礎工事・建て方まで一貫管理します。`,
        highlight: '【安心のサポート】お見積りから完成まで窓口がひとつのため、余計な中間マージンや連絡ロスが一切ありません。'
      }
    ],
    snsText: {
      x: `【最新SEOコラム公開】\n${themeTitle}\n建築士が教える木造自由設計ガレージのポイントと解決策をわかりやすく解説！\n詳しくはこちら👇\nhttps://smile049.jp/column/${slug}\n#木造ガレージ #ガレージ建築 #スマイチ`,
      note: `${themeTitle}についての詳細解説記事を公開しました。木造自由設計ガレージのメリットと施工の流れをご紹介します。`
    }
  };
  return saveColumn(newCol);
}
