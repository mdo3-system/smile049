import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Copy, Check, ExternalLink, Image as ImageIcon, Download, 
  Trash2, RefreshCw, Layers, CheckCircle2, ChevronDown, ChevronRight, 
  BookOpen, HelpCircle, Upload, ShieldCheck, ArrowRight, DollarSign, Vote
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, NoteIcon, XIcon } from './SnsIcons';

const STORAGE_KEY = 'smile049_story_studio_data_v2';

// プリセットテーマ（女性・家族・一般生活目線）
const PRESET_THEMES = [
  {
    id: 'family_storage',
    title: '子育て家族の「もう捨てなくていい」収納革命（30代・共働き主婦）',
    protagonist: '田中 さおり (34歳 / パート勤務・2児の母 / 悩み: 自転車4台・子供用品・季節物で玄関・庭が常に散らかる)',
    theme: '既製品の物置は敷地の角地形状に合わず、「どうせ入らない」と諦めていた。木造自由設計なら台形の敷地にぴったり収まる収納を、家族が笑顔になれる価格帯で実現できた物語。「結局、新築より快適だった」という気づきを描く。',
    defaultPriceOptions: [
      'A. 80万円〜120万円（小型収納・自転車置場）',
      'B. 130万円〜160万円（家族4人分の収納＋趣味スペース）',
      'C. 170万円〜200万円（車1台＋大容量収納）',
      'D. 210万円以上（車2台＋室内作業スペース付き）'
    ],
    answerHint: '約148万円（3Dシミュレーター積算目安）'
  },
  {
    id: 'used_home_plus_garage',
    title: '中古住宅＋木造ガレージで新築以上の暮らしを（40代・家族で賢い選択）',
    protagonist: '山本 恵子 (42歳 / フルタイム共働き・夫と子2人 / 新築は予算オーバーで中古住宅を購入)',
    theme: '新築4,500万円か中古2,500万円か迷っていた家族が「中古住宅2,500万円＋スマイチガレージ250万円」という選択をした話。敷地形状に合わせたガレージで、新築以上に快適で豊かな暮らしが実現した。既存建物の外壁ラインに合わせ、数センチ単位で設計できる自由設計の強みが刺さった物語。',
    defaultPriceOptions: [
      'A. 180万円〜220万円（駐車1台＋収納）',
      'B. 230万円〜270万円（駐車2台対応）',
      'C. 280万円〜320万円（ガレージ＋趣味スペース）',
      'D. 330万円以上（ガレージハウス仕様）'
    ],
    answerHint: '約248万円（3Dシミュレーター積算目安）'
  },
  {
    id: 'womens_garden_storage',
    title: '庭仕事好きな主婦が手に入れた「全部入るガーデンシェッド」（50代・専業主婦）',
    protagonist: '鈴木 陽子 (51歳 / 専業主婦・ガーデニング歴20年 / 悩み: 土・肥料・鉢・道具が雨ざらしで劣化)',
    theme: '大手通販の物置は敷地の変形スペースに合わず、結露でガーデニング道具が錆びていた。木造だから湿気に優しく、台形の残地にもジャストフィット。夫が「やっと庭が片付いた」と感激し、家族仲も改善した物語。',
    defaultPriceOptions: [
      'A. 70万円〜100万円（小型シェッド）',
      'B. 110万円〜140万円（ガーデン収納フルサイズ）',
      'C. 150万円〜180万円（作業スペース＋収納）',
      'D. 190万円以上（温室機能付き特注仕様）'
    ],
    answerHint: '約125万円（3Dシミュレーター積算目安）'
  },
  {
    id: 'narrow_lot_garage',
    title: '「入らない」と言われた狭小変形地に、夫婦の車が2台収まった話（30〜40代・共働き夫婦）',
    protagonist: '伊藤 美香 (38歳 / 看護師・夫は会社員 / 悩み: 駐車場代が月3万円、でも自宅敷地は変形で車が入らない)',
    theme: '不動産業者に「この形の土地には既製品は無理」と断言されたが、スマイチなら台形地にミリ単位で合わせた木造ガレージが建てられた。月3万円の駐車場代がゼロになり、7年で元が取れる計算に家族全員が驚いた物語。',
    defaultPriceOptions: [
      'A. 150万円〜190万円（1台＋収納）',
      'B. 200万円〜250万円（2台対応・変形地対応）',
      'C. 260万円〜300万円（2台＋作業スペース）',
      'D. 310万円以上（EV充電設備付き）'
    ],
    answerHint: '約225万円（3Dシミュレーター積算目安）'
  }
];


// ─────────────────────────────────────────────────────
// プリセット別ストーリーアーク定義
// ─────────────────────────────────────────────────────
const STORY_ARCS = {

  // ① 中古住宅＋ガレージ → 最重要テーマ
  used_home_plus_garage: {
    hashtags: '#スマイチ #中古住宅ガレージ #中古住宅リノベ #ガレージのある暮らし #木造ガレージ #自由設計 #変形地ガレージ #ガルバリウム外壁 #中古戸建 #埼玉不動産 #一次取得層 #家づくり #マイホーム計画 #住まいの知恵 #3Dシミュレーター #smile049',
    quizQuestion: '中古住宅を買ってガレージを建てる場合、新築購入と比べて総額はどのくらい変わると思いますか？',
    phases: [
      {
        phase: '【第1話：新築か中古か、2,000万円の分岐点】',
        subTitle: '〜住宅展示場を回り続けた末に気づいた、もうひとつの選択肢〜',
        plot: (p) => `${p}は、週末のたびに住宅展示場を訪れていた。営業担当者に「土地込み4,500万円が標準ですよ」と言われるたびに、胸の奥で何かが引っかかる。「本当にこれしか選択肢はないのだろうか？」帰り道、スマホで「中古住宅 ガレージ 埼玉」と検索したその瞬間、スマイチの3Dシミュレーターに出会った。`,
        englishPrompt: `8k cinematic photograph, warm suburban Japanese family neighborhood at dusk, young Japanese family of four walking together, beautiful modern dark charcoal wooden garage attached to a renovated mid-century Japanese house, warm garden lights, hopeful atmosphere, photorealistic.`
      },
      {
        phase: '【第2話：「ガレージが建てられる土地」から物件を探す逆転発想】',
        subTitle: '〜シミュレーターが教えてくれた、土地の見方が変わる瞬間〜',
        plot: (p) => `${p}はスマイチのシミュレーターで「幅5m×奥行き6m、台形地対応」のガレージを試作してみた。概算248万円。「この金額でガレージが建つなら、中古住宅でも全然アリじゃない？」物件探しの基準が変わった。不動産サイトで変形地や旗竿地の安い物件を見る目が、全く変わった。「ガレージが建てられるかどうか」で土地を選べばいい。`,
        englishPrompt: `8k illustration style, split screen comparison, left side shows expensive new-build Japanese house, right side shows used Japanese house with beautiful custom wooden garage addition, family car parked inside, price difference highlighted, clean modern infographic style, photorealistic rendering.`
      },
      {
        phase: '【第3話：中古3,800万円＋ガレージ300万円。新築4,500万円と「ほぼ同じ予算」でガレージ付きを選んだ夜】',
        subTitle: '〜同じお金を使うなら、ガレージも付いてくる選択がある〜',
        plot: (p) => `夜、ダイニングテーブルに向かい合って座った${p}夫婦。スマイチのシミュレーターを開き、希望のガレージを3D設計する。概算建築費が画面に目安300万円と表示された。「中古住宅3,800万円＋リノベ300万円＋ガレージ300万円＋諸費用…合計でおよそ4,400万円。さっきまで考えていた新築4,500万円とほぼ同じ想定の中で、ガレージが入っている」。夜更けに笑い合った夫婦のその夜が、大きな決断の出発点になった。`,
        englishPrompt: `8k intimate lifestyle photography, Japanese couple sitting at dining table at night, laptop screen showing 3D garage simulator with real-time price calculator, warm kitchen lighting, family planning atmosphere, notebooks and house listing papers on table, hopeful and decisive mood, photorealistic.`
      },

      {
        phase: '【第4話：既存建物の外壁ラインに、数センチ単位で合わせるガレージ設計】',
        subTitle: '〜「規格品では無理」と言われた変形敷地に、ぴったり収まった木造の奇跡〜',
        plot: (p) => `購入した中古住宅の敷地は、南側が台形に斜めになっていた。不動産会社の担当者に「既製品の物置やガレージは入りませんよ」と言われていた部分だ。しかしスマイチの専任スタッフが現地測量を行い、既存外壁のラインに合わせ、その台形の角まで余すことなく使い切る木造ガレージを設計。数センチ単位の精度で、まるでそこに最初からあったかのように建物は収まった。`,
        englishPrompt: `8k architectural photography, top-down aerial view of Japanese suburban house plot showing a perfectly fitted custom wooden garage built to match the irregular trapezoidal shape of the land, dark galvalume cladding, zero-eave design, fitting seamlessly between property boundaries, crisp sunlight, photorealistic.`
      },
      {
        phase: '【第5話：月3万円の駐車場代がゼロになった日、7年で元が取れる試算】',
        subTitle: '〜ガレージを建てたことで、毎月の生活費が変わった〜',
        plot: (p) => `完成から3ヶ月。${p}の家計簿に「駐車場代 ¥0」と書かれた月が初めて訪れた。それまで月3万円、年間36万円を払い続けていた駐車場代が消えた。ガレージの建設費250万円を単純計算すると、約7年で元が取れる。しかし実際のメリットはそれだけではなかった。雨の日に車に乗り込む手間がなくなり、荷物の積み下ろしが楽になり、休日の家族の動き方そのものが変わっていた。`,
        englishPrompt: `8k warm lifestyle photography, happy Japanese mother loading groceries from car directly into wooden garage attached to house on a rainy day, covered walkway, family dog sitting nearby, suburban garden background, sense of everyday comfort and convenience, photorealistic.`
      },
      {
        phase: '【第6話：「新築じゃなくてよかった」と思った瞬間】',
        subTitle: '〜1,750万円の差額で、暮らしはこんなに変わった〜',
        plot: (p) => `新築同期の友人宅を訪ねた${p}は、ふと感じた。お互いに4,000万円台の住宅ローンだと思っていたのに、自分の家にはガレージがあり、庭にはウッドデッキがあり、将来のリノベーション資金も手元に残っている。「中古住宅を選んで、ガレージを建てて、残った1,750万円で人生を豊かにする。これが令和の賢い家の作り方だったんだ」と、${p}は静かに確信した。`,
        englishPrompt: `8k cinematic lifestyle photography, happy Japanese family evening scene outside their renovated house with custom wooden garage, string lights in garden, children playing, parents with coffee cups, warm golden hour light, sense of contentment and good life choices, photorealistic.`
      },
      {
        phase: '【第7話：この家を選んで良かった、ガレージを建てて正解だった】',
        subTitle: '〜中古住宅×木造ガレージという選択が、家族の未来を広げた〜',
        plot: (p) => `休日の朝、電動シャッターをゆっくり開けると、整然と並んだ家族の自転車と、愛車の濡れていないボディが迎えてくれる。${p}は振り返る——新築の展示場を回り続けた日々、シミュレーターで夜中に試算した夜、専任スタッフと敷地を測った日。「敷地の形に、数センチ単位で合わせてもらったガレージ。新築ではこうはいかなかった」。令和の豊かな暮らしは、中古住宅から始まった。`,
        englishPrompt: `8k cinematic wide shot, sunrise morning scene of a beautiful renovated Japanese house with custom-built dark wooden garage, garage door slowly opening, silhouette of a family car inside, golden morning light, dew on the garden grass, peaceful suburban street, sense of a life well-chosen, photorealistic masterpiece.`
      }
    ]
  },

  // ② 子育て家族の収納革命
  family_storage: {
    hashtags: '#スマイチ #収納革命 #木造物置 #ガーデンシェッド #子育て家族 #変形地物置 #自由設計 #ガルバリウム外壁 #主婦の味方 #家族のある暮らし #収納アイデア #ガレージのある暮らし #埼玉建築 #3Dシミュレーター #smile049',
    quizQuestion: '家族4人分の荷物（自転車4台・子供用品・季節物）が全部入る木造収納、総額いくらだと思いますか？',
    phases: [
      {
        phase: '【第1話：玄関が散らかる家は、家族の心も散らかっていた】',
        subTitle: '〜子育てと仕事の間で積み上がった「どうにかしたい」〜',
        plot: (p) => `${p}の朝は戦場だ。玄関には自転車4台分のヘルメット、習い事のバッグ、使い終わったスポーツ用品。庭には季節外れの子供用プール、スコップ、植木鉢。「既製品の物置を買っても、どうせ入らないし……」と諦めていたある日、スマイチの3Dシミュレーターをたまたまスマホで見かけた。`,
        englishPrompt: `8k lifestyle photography, chaotic Japanese suburban house entrance with bicycles helmets sports bags overflowing, stressed but hopeful young Japanese mother looking at smartphone screen showing 3D garage planner, warm morning light, photorealistic.`
      },
      {
        phase: '【第2話：台形の残地に、家族全員分の収納が入った日】',
        subTitle: '〜「どうせ無理」が「これなら入る」に変わった3Dシミュレーターの夜〜',
        plot: (p) => `${p}はスマイチのシミュレーターで、家の西側にある台形のデッドスペースを入力した。4辺の長さをミリ単位で設定すると、3Dモデルがぴたりとはまる。「ここなら自転車4台と、子供用品全部と、季節物も入る」。画面に表示された概算金額を見て、夫に見せた。「これ、絶対やろう」。それが決断の夜だった。`,
        englishPrompt: `8k intimate lifestyle photography, Japanese couple at kitchen table at night, laptop screen showing 3D simulator of compact wooden storage shed perfectly fitting trapezoidal garden corner, excited expressions, warm kitchen lighting, photorealistic.`
      },
      {
        phase: '【第3話：完成。玄関が変わると、家族の空気が変わった】',
        subTitle: '〜片付いた玄関が生んだ、予想外の家族時間〜',
        plot: (p) => `木造シェッドが完成してから3週間。${p}の家の玄関は、生まれて初めて「すっきり」した状態を保っている。自転車はシェッドへ、子供用品も季節物も全部収まった。夕方、子供たちが「お母さん、玄関広くなったね」と言った。その言葉が、一番の正解だったと確信させてくれた。`,
        englishPrompt: `8k warm lifestyle photography, beautifully organized wooden storage shed attached to Japanese suburban house, family bicycles neatly arranged inside, children helping organize, garden flowers visible, tidy suburban home exterior, warm afternoon light, photorealistic.`
      }
    ]
  },

  // ③ 女性のガーデンシェッド
  womens_garden_storage: {
    hashtags: '#スマイチ #ガーデンシェッド #木造物置 #ガーデニング #主婦の味方 #変形地物置 #湿気に強い木造 #自由設計 #庭収納 #ガルバリウム外壁 #女性の家づくり #埼玉建築 #3Dシミュレーター #smile049',
    quizQuestion: '変形した残地にぴったり収まる木造ガーデンシェッド、総額いくらだと思いますか？',
    phases: [
      {
        phase: '【第1話：20年のガーデニング道具が、ついに雨ざらしを卒業する日】',
        subTitle: '〜錆びていくシャベルを眺めながら思ったこと〜',
        plot: (p) => `${p}のガーデニング歴は20年。愛着のある道具たちは毎年、梅雨の雨ざらしで少しずつ錆びていく。大手通販の物置を買ったこともある。でも敷地の角が斜めになっていて、どうしてもすき間ができてしまった。「この角の形に合う収納は、世の中に存在しないのかもしれない」。そう諦めかけていたとき、スマイチの3Dシミュレーターを見つけた。`,
        englishPrompt: `8k lifestyle photography, Japanese woman in her 50s looking sadly at rusty garden tools left in the rain, suburban garden corner with irregular trapezoidal shape, overcast day, sense of resignation about to change, photorealistic.`
      },
      {
        phase: '【第2話：台形の残地が、夢のガーデンスタジオに変わった】',
        subTitle: '〜木造だから湿気に優しい、道具を大切にする暮らし〜',
        plot: (p) => `${p}が設計したガーデンシェッドは、家の南西角の台形スペースにぴったり収まる木造建築だ。木造ならではの調湿効果で、土も肥料も錆びにくい環境が生まれた。専任スタッフが既存外壁のラインに合わせ、数センチ単位で設計した建物は、まるで最初からそこにあったかのよう。夫が「やっと庭が片付いたな」と言ったとき、20年のガーデニング人生で一番嬉しかった。`,
        englishPrompt: `8k architectural lifestyle photography, beautiful compact wooden garden shed with dark galvalume exterior perfectly fitting the angled corner of a Japanese suburban garden, neatly organized gardening tools visible through open door, woman arranging plants inside, warm sunlight, photorealistic.`
      },
      {
        phase: '【第3話：道具が守られる空間で、ガーデニングがもっと好きになった】',
        subTitle: '〜毎朝シェッドのドアを開ける瞬間が、一日の楽しみになった〜',
        plot: (p) => `完成から半年が経った。${p}の愛用のシャベルは、今も光っている。錆ひとつない。「道具を大切にできる場所があるだけで、こんなに気持ちが変わるとは思わなかった」。毎朝シェッドのドアを開ける瞬間が、一日の楽しみになった。家族も庭に出てくるようになった。ガーデンシェッドは、家族の「庭時間」を取り戻してくれた。`,
        englishPrompt: `8k warm lifestyle photography, happy Japanese woman in her 50s opening the door of her new wooden garden shed in the morning sunlight, shiny well-maintained garden tools inside, lush garden surroundings, husband watching from porch with coffee, sense of contentment and daily joy, photorealistic.`
      }
    ]
  },

  // ④ 狭小変形地に車2台
  narrow_lot_garage: {
    hashtags: '#スマイチ #変形地ガレージ #狭小地ガレージ #駐車場代節約 #木造ガレージ #自由設計 #ガルバリウム外壁 #EV充電 #共働き夫婦 #台形地 #旗竿地ガレージ #埼玉建築 #3Dシミュレーター #smile049',
    quizQuestion: '台形の変形地に木造ガレージを建てて月3万円の駐車場代をゼロにする場合、元が取れるのは何年後だと思いますか？',
    phases: [
      {
        phase: '【第1話：「この土地には無理」と言われた変形地の、もうひとつの可能性】',
        subTitle: '〜不動産会社が諦めた角地に、スマイチなら答えがあった〜',
        plot: (p) => `${p}の自宅敷地は南側が台形に斜めになっている。「ここには規格品のガレージは入りません」と不動産会社の担当者にはっきり言われた。月3万円の駐車場代を払いながら、毎朝雨の中で車に乗り込む日々が続いていた。ある日、スマイチのサイトで「変形地・台形地対応」という文字を見つけた。`,
        englishPrompt: `8k lifestyle photography, aerial view of Japanese suburban house with irregular trapezoidal land shape, currently used as parking with rain puddles, Japanese woman holding umbrella loading groceries into wet car, sense of daily inconvenience about to change, photorealistic.`
      },
      {
        phase: '【第2話：3Dシミュレーターで「入った」と確信した瞬間】',
        subTitle: '〜ミリ単位の設計が、「無理」を「可能」に変えた〜',
        plot: (p) => `${p}はスマイチのシミュレーターで、台形の敷地の4辺の長さをそのまま入力した。3Dモデルが形になっていく。車2台が並んで入る幅、既存の外壁ラインとの整合、斜めの角との精度——全て画面で確認できた。「これ、本当に建てられる……！」。概算金額も即座に表示された。月3万円の駐車場代と比べると、7年で元が取れる計算だった。`,
        englishPrompt: `8k detail shot, hands holding smartphone showing a 3D wooden garage simulator perfectly fitting a trapezoidal land shape, two cars fitting inside the 3D model, price calculator visible on screen, excited Japanese woman's face reflected in screen, photorealistic.`
      },
      {
        phase: '【第3話：月3万円の駐車場代がゼロになった、その後の暮らし】',
        subTitle: '〜7年で元が取れる試算が現実になった日〜',
        plot: (p) => `完成から1年。${p}の家計から「駐車場代 ¥30,000」の行が消えた。年間36万円、7年で252万円の節約。でも数字より大きかったのは、生活の質の変化だ。雨の日も荷物を車に積みやすく、子供の送迎も楽になった。「変形地だからこそ安く買えた土地が、こんなに豊かな暮らしの土台になるとは」。${p}は今、この家を選んで本当に良かったと思っている。`,
        englishPrompt: `8k warm lifestyle photography, happy Japanese woman carrying grocery bags from car into dark wooden garage on a rainy day, completely dry, smiling, suburban garden, sense of daily comfort and financial freedom, photorealistic.`
      }
    ]
  }
};

// デフォルトアーク（カスタムテーマや未定義のプリセット用）
const DEFAULT_ARC_PHASES = [
  {
    phase: '【第1話：出会いと規格の壁】',
    subTitle: '〜既製品では届かなかった「あと20cm」の理想〜',
    plot: (p) => `${p}は、長年の夢であった専用ガレージの設置を検討し始めた。しかし、敷地境界の変形や必要な幅を測ると、大手既製品スチールガレージの規格モジュールではどうしても敷地からはみ出すことが判明する。「土地にガレージを合わせるしかないのか……」と諦めかけたその時、木造自由設計ガレージ【スマイチ】のブラウザ3Dシミュレーターに出会う。`,
    englishPrompt: `8k architectural photograph, cinematic shot of a modern wooden garage project, contemporary dark charcoal galvalume steel facade, zero-eave minimalist roof edge, exposed wooden structural posts visible, dusk twilight warm ambient lighting, realistic concrete floor, highly detailed architectural masterpiece.`
  },
  {
    phase: '【第2話：ミリ単位の3D設計】',
    subTitle: '〜夜更けに画面で描いた、自分だけの空間〜',
    plot: (p) => `スマホとPCで無料シミュレーターを立ち上げた${p}。敷地の形状をそのまま入力し、屋根の勾配や柱芯の逃げをミリ単位で調整していく。画面の中でリアルタイムに積算費用が更新される安心感。専任スタッフによる無料パース依頼ボタンを押すと、翌日届いたのはまるで実写のような高精細パースだった。`,
    englishPrompt: `8k ultra-detailed interior architectural photography, modern luxury wooden garage workshop, warm wooden timber ceiling beams, built-in OSB plywood workbench, glowing warm recessed LED strip lights, polished concrete floor, cozy atmospheric evening, architectural digest style.`
  },
  {
    phase: '【第3話：建築士のワンストップ対応】',
    subTitle: '〜面倒な確認申請と構造計算をプロが一括解決〜',
    plot: (p) => `市街化調整区域や防火地域の法規制限、基礎の高低差など、素人では乗り越えられない壁も、スマイチの専任スタッフが迅速に現地調査と構造安全確認を実施。ワンストップ施工体制に確信を持ち、電子契約でスムーズに着工を迎えた。`,
    englishPrompt: `8k architectural detail photograph, construction of wooden timber frame garage, high precision steel connector hardware, heavy cedar pine wooden columns, pristine charcoal galvalume metal cladding, zero eaves detail, clean Japanese modern architecture craftsmanship, bright daylight.`
  },
  {
    phase: '【第4話：完成。木の温もりと静寂に包まれた空間】',
    subTitle: '〜鉄板ガレージにはない、調湿と木の香り〜',
    plot: (p) => `上棟から数週間、ついに完成した。外観はシャープなブラックガルバリウム鋼板の軒出0スタイル。一歩室内に入ると、木造ならではの爽やかな木の香りと断熱材による穏やかな室温が広がる。鉄板ガレージのような冬場の結露もサビの心配もない。`,
    englishPrompt: `8k wide angle shot of a completed custom wooden garage interior, spacious ceiling with natural wood rafters, ambient floor spotlights, comfortable armchair, peaceful sanctuary, cinematic photorealism.`
  },
  {
    phase: '【第5話：一生モノの至福の時間】',
    subTitle: '〜作って良かった、と思える毎日〜',
    plot: (p) => `休日、電動リモコンシャッターを開け放ち、朝の光の中で空間を楽しむ${p}。敷地にミリ単位で合わせたからこそ生まれた無駄のない空間は、人生を豊かにする場所となった。「作って本当に良かった」。${p}は満足そうに微笑んだ。`,
    englishPrompt: `8k cinematic lifestyle architectural photography, evening view of modern wooden custom garage, wide open black roll-up shutter, warm interior light spilling onto stone driveway, tranquil suburban garden backdrop, photorealistic.`
  }
];

// ─────────────────────────────────────────────────────
// ストーリー生成ロジック（プリセットID対応・テーマ別ストーリーアーク）
// ─────────────────────────────────────────────────────
const generateStoriesByAi = (themeTitle, protagonist, storyCount, themeDesc, presetData) => {
  const generated = [];
  const priceOptions = presetData?.defaultPriceOptions || PRESET_THEMES[0].defaultPriceOptions;
  const answerHint = presetData?.answerHint || PRESET_THEMES[0].answerHint;
  const presetId = presetData?.id || '';

  // プリセット専用アーク or デフォルトアーク
  const arc = STORY_ARCS[presetId] || null;
  const phases = arc?.phases || DEFAULT_ARC_PHASES;
  const hashtags = arc?.hashtags ||
    '#スマイチ #木造ガレージ #ガレージハウス #ビルトインガレージ #自由設計 #愛車のある暮らし #変形地ガレージ #ガルバリウム外壁 #木造建築 #埼玉建築 #3Dシミュレーター #smile049';
  const quizQuestion = arc?.quizQuestion ||
    'あなたはこの木造ガレージ・収納、総額いくらだと思いますか？（いくらなら欲しいですか？）';

  for (let i = 1; i <= storyCount; i++) {
    const phaseData = phases[i - 1] || phases[phases.length - 1];
    const phase = phaseData.phase || `【第${i}話】`;
    const subTitle = phaseData.subTitle || '';
    const epTitle = `${themeTitle} ${subTitle}`;
    const plot = typeof phaseData.plot === 'function'
      ? phaseData.plot(protagonist)
      : (phaseData.plot || '');
    const englishPrompt = phaseData.englishPrompt ||
      `8k architectural lifestyle photography, beautiful modern wooden custom garage, dark galvalume steel exterior, Japanese suburban setting, warm natural lighting, photorealistic.`;

    generated.push({
      id: `story_${Date.now()}_${i}`,
      episodeNum: i,
      phase,
      title: epTitle,
      plot,
      assignedAccount: `Google AI Pro アカウント ${(i % 5) || 5}`,
      englishPrompt,
      imageUrl: null,
      hashtags,
      quizEnabled: true,
      quizQuestion,
      quizOptions: [...priceOptions],
      quizAnswerHint: answerHint,
      isPostedInstagram: false,
      isPostedNote: false,
      isPostedX: false,
      scheduledDate: new Date(Date.now() + (i - 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  return generated;
};


export default function StoryStudioPanel() {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_THEMES[0].id);
  const [customTitle, setCustomTitle] = useState(PRESET_THEMES[0].title);
  const [customProtagonist, setCustomProtagonist] = useState(PRESET_THEMES[0].protagonist);
  const [customThemeDesc, setCustomThemeDesc] = useState(PRESET_THEMES[0].theme);
  const [storyMode, setStoryMode] = useState('preset'); // 'preset' | 'scenario'
  const [showKitModal, setShowKitModal] = useState(false);

  // シナリオライター専用フィールド
  const [scTarget, setScTarget] = useState(''); // 訂跢層・誦求対象
  const [scProblem, setScProblem] = useState(''); // 誰のどんな悩み
  const [scResolution, setScResolution] = useState(''); // ガレージ・倉庫による解決
  const [scTone, setScTone] = useState('emotional'); // emotional | data | humor | comparison
  const [scKeyword, setScKeyword] = useState(''); // 必ず入れたいキーワード・数字
  const [scEpisodeCount, setScEpisodeCount] = useState(3);
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateStoriesByAi(PRESET_THEMES[0].title, PRESET_THEMES[0].protagonist, 3, PRESET_THEMES[0].theme, PRESET_THEMES[0]);
  });

  const [copiedKey, setCopiedKey] = useState(null);
  const [activeStoryTab, setActiveStoryTab] = useState('instagram'); // 'instagram' | 'note'


  // ローカル保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [stories]);

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    const p = PRESET_THEMES.find(item => item.id === presetId);
    if (p) {
      setCustomTitle(p.title);
      setCustomProtagonist(p.protagonist);
      setCustomThemeDesc(p.theme);
    }
  };

  const [storyCount, setStoryCount] = useState(3);

  // シナリオライター自由生成
  const handleScenarioGenerate = () => {
    if (!scTarget.trim() || !scProblem.trim() || !scResolution.trim()) {
      alert('訂跢層・悩み・解決ストーリーの3項目を入力してください。');
      return;
    }
    if (!window.confirm('シナリオライターでストーリーを自由生成しますか？（現在のストーリーは上書きされます）')) return;

    const toneLabel = { emotional: '感動・共感系', data: 'データ・論理系', humor: 'わかりやすコミカル系', comparison: '新築vs中古・比較系' }[scTone] || '感動系';
    const themeTitle = `${scTarget}の「${scProblem.slice(0, 15)}」を解決する物語`;
    const protagonist = scTarget;
    const keywordNote = scKeyword ? `キーワード: ${scKeyword}` : '';

    // シナリオライター自由アークを動的生成
    const scenarioPhases = Array.from({ length: scEpisodeCount }, (_, idx) => {
      const i = idx + 1;
      let phase, subTitle, plot, englishPrompt;

      if (i === 1) {
        phase = `《第${i}話：${scTarget}の「${scProblem.slice(0, 18)}」という措り》`;
        subTitle = `〜どうかしたかった、その思いが変わった日〜`;
        plot = (scTone === 'data')
          ? `${scTarget}が直面していた最大の問題―「${scProblem}」。既製品や大手メーカーに相談しても「解決できません」の一言。年間平均コストを計算すると、現状のままでは10年後も同じ問題を抱えていることに気づいた。その数字が、スマイチの3Dシミュレーターを調べるきっかけになった。${keywordNote}`
          : scTone === 'humor'
          ? `${scTarget}にとって「${scProblem}」はもはや笑えないレベルの問題だった。「どうせたいしてこうなるんだ」と諦めていた日々。そんなとき、かわいい感じのスマイチの広告をたまたま見かけた。「もしかして渡りに裁をつけてる？」という轻い気持ちで、この物語は始まった。${keywordNote}`
          : `${scTarget}のある日、「${scProblem}」という悩みは頂点に達した。既製品は割高で酷い。プロに相談しても「難しいですね」と言われる。そんなとき、スマイチの3Dシミュレーターをスマホで触れた。画面の中で場所と建物がリアルタイムに形になっていく。「これならどうかなるかも」。${keywordNote}`;
        englishPrompt = `8k lifestyle photography, Japanese ${scTarget}, scene of daily struggle with: ${scProblem}, feeling of change about to happen, warm residential suburban Japan setting, hopeful mood, photorealistic.`;
      } else if (i === scEpisodeCount) {
        phase = `《第${i}話：${scResolution.slice(0, 20)}で実現した新しい日常》`;
        subTitle = `〜作って本当に良かった、と思える毎日〜`;
        plot = (scTone === 'data')
          ? `${scTarget}の生活から「${scProblem}」に関わるコストが消えた。${scResolution}のおかげで、年間简略計算でおよぐ36万円以上の節約に成功。建設費を制御するまでの期間も年単位で計算ができ、論理的に「正解」であると確信している。`
          : `スマイチの木造自由設計による${scResolution}が完成してから、${scTarget}の日常は明らかに変わった。「${scProblem}」がもはや毎日のストレスではなくなり、代わりにわくわくする日常が広がった。「作って本当に良かった」。その一言が、すべての答えだった。`;
        englishPrompt = `8k warm lifestyle photography, happy Japanese ${scTarget} enjoying everyday life after solving their problem, beautiful wooden custom structure by Sumaichi visible, warm suburban Japanese home setting, golden hour light, sense of life improvement and satisfaction, photorealistic.`;
      } else {
        const midLabels = [
          ['3D設計と見積もり', '〜ミリ単位の設計が「無理」を「可能」に変えた〜'],
          ['専任スタッフとの現地調査', '〜確認申請・構造計算をプロが一括解決〜'],
          ['各所に割り入る設計の妙味', '〜敷地の形状に、數センチ単位で共存させる〜'],
          ['大工とき、完成の前夜に', '〜山になった木材を見山ごしに、封印の夜を贇った〜']
        ];
        const midIdx = (i - 2) % midLabels.length;
        phase = `《第${i}話：${midLabels[midIdx][0]}》`;
        subTitle = midLabels[midIdx][1];
        plot = `${scTarget}は、スマイチの3Dシミュレーターで${scResolution}の設計を進める。敷地の形と既存建物の外壁ラインに合わせ、数センチ単位で調整することで、「入らない」と言われた場所にめどあの空間が生まれることを確信する。専任スタッフが現地を訪れ、構造安全や確認申請もワンストップで対応。「これは本当に建てられるんだ」。`;
        englishPrompt = `8k architectural photography, custom wooden garage or storage building under construction in Japan, professional timber frame, dark galvalume cladding panels being fitted, craftsmen at work, clear blue sky, sense of progress and precision construction, photorealistic.`;
      }

      return { phase, subTitle, plot: () => plot, englishPrompt };
    });

    // ハッシュタグをトーン別に調整
    const scHashtags = scTone === 'comparison'
      ? '#スマイチ #中古住宅ガレージ #中古戦略 #新築vs中古 #ガレージのある暮らし #木造ガレージ #自由設計 #変形地ガレージ #ガルバリウム外壁 #家づくり #3Dシミュレーター #smile049'
      : scTone === 'data'
      ? '#スマイチ #ガレージ建築 #決断のデータ #起業コスト節約 #駐車場代節約 #木造ガレージ #自由設計 #変形地対応 #埼玉建築 #3Dシミュレーター #smile049'
      : '#スマイチ #木造ガレージ #ガレージのある暮らし #変形地ガレージ #自由設計 #ガルバリウム外壁 #木造建築 #埼玉建築 #3Dシミュレーター #smile049';

    const scQuiz = scTone === 'data' || scTone === 'comparison'
      ? `${scTarget}の「${scProblem.slice(0, 15)}」を解決するスマイチの木造建築、总額いくらだと思いますか？`
      : `この建築、いくらなら買いたいですか？`;

    const fakePreset = {
      id: '_scenario_free',
      title: themeTitle,
      protagonist,
      theme: scProblem,
      defaultPriceOptions: [
        'A. 50万円〜100万円（小型コンパクト）',
        'B. 110万円〜180万円（標準サイズ）',
        'C. 190万円〜270万円（中大型＋趣味スペース）',
        'D. 280万円以上（建築・車広フル仕様）'
      ],
      answerHint: 'スマイチの3Dシミュレーターで確認できます！'
    };

    // STORY_ARCSをバイパスして直接生成
    const newStories = scenarioPhases.map((ph, idx) => ({
      id: `story_${Date.now()}_${idx + 1}`,
      episodeNum: idx + 1,
      phase: ph.phase,
      title: `${themeTitle} ${ph.subTitle}`,
      plot: ph.plot(protagonist),
      assignedAccount: `Google AI Pro アカウント ${((idx + 1) % 5) || 5}`,
      englishPrompt: ph.englishPrompt,
      imageUrl: null,
      hashtags: scHashtags,
      quizEnabled: true,
      quizQuestion: scQuiz,
      quizOptions: fakePreset.defaultPriceOptions,
      quizAnswerHint: fakePreset.answerHint,
      isPostedInstagram: false,
      isPostedNote: false,
      isPostedX: false,
      scheduledDate: new Date(Date.now() + idx * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    setStories(newStories);
  }; // end handleScenarioGenerate

  const handleGenerateAll = () => {
    if (!window.confirm('新しいストーリーと作画プロンプトを生成しますか？（現在の編集内容は上書きされます）')) {
      return;
    }
    const currentPreset = PRESET_THEMES.find(p => p.id === selectedPreset) || PRESET_THEMES[0];
    const newStories = generateStoriesByAi(customTitle, customProtagonist, storyCount, customThemeDesc, currentPreset);
    setStories(newStories);
  };


  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // 画像アップロード・ペースト処理
  const handleImageFile = (file, storyIndex) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...stories];
      updated[storyIndex].imageUrl = e.target.result;
      setStories(updated);
    };
    reader.readAsDataURL(file);
  };

  const handlePasteImage = (e, storyIndex) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        handleImageFile(file, storyIndex);
        e.preventDefault();
        break;
      }
    }
  };

  // Instagram用キャプション成形（価格アンケート・コメント促進付き）
  const formatInstagramCaption = (story) => {
    let caption = `${story.phase}\n${story.title}\n\n${story.plot}\n\n`;

    if (story.quizEnabled) {
      caption += `―――――――――――――――\n`;
      caption += `💬【読者アンケート・コメントで教えてください！】\n`;
      caption += `Q. ${story.quizQuestion}\n\n`;
      story.quizOptions.forEach((opt, idx) => {
        caption += `${opt}\n`;
      });
      caption += `\n👉 あなたの予想や「この金額なら建てたい！」をぜひコメント欄（またはストーリーズ投票）で教えてください！\n`;
      caption += `※ プロフィールの3Dシミュレーター（@smile049_garage）で実際のリアルタイム積算見積もりがその場で答え合わせできます。\n\n`;
    }

    caption += `―――――――――――――――\n■ 木造自由設計ガレージ・倉庫【スマイチ】\n規格サイズに土地を合わせるのではなく、\nあなたの敷地にガレージを合わせる。\n\n・登録不要の3Dシミュレーター＆リアルタイム積算見積もり\n・ガルバリウム鋼板×木造現しの洗練されたモダンデザイン\n・専任スタッフによる構造計算・確認申請ワンストップ施工\n\nプロフィールのリンク（@smile049_garage）から3D設計をお試しいただけます。\nhttps://smile049.jp/\n\n${story.hashtags}`;
    return caption;
  };

  // note用記事成形（大見出し＋仕様解説＋読者参加型アンケート＋答え合わせCTA導線）
  const formatNoteMarkdown = (story) => {
    let md = `# ${story.title}\n\n${story.phase}\n\n${story.plot}\n\n---\n\n`;
    
    md += `## 規格サイズに敷地を合わせるのではなく、敷地にガレージを合わせる\n\n`;
    md += `木造自由設計ガレージ・倉庫「スマイチ」では、既製品スチールガレージでは対応できない狭小地・台形変形地・旗竿地に合わせて、ミリ単位での設計が可能です。\n\n`;
    md += `### スマイチが選ばれる3つの理由\n`;
    md += `1. **ブラウザ上で動く3Dシミュレーター**: 登録不要で、寸法や屋根勾配、開口部を変更するとリアルタイムで見積もり金額が変動。\n`;
    md += `2. **木造ならではの快適性**: ガルバリウム鋼板仕上げ（軒出ゼロ）のスタイリッシュな外観と、結露を防ぐ木造構造・断熱仕様。\n`;
    md += `3. **専任スタッフによる安心施工**: 複雑な確認申請や構造安全検討もワンストップでお任せ。\n\n`;

    if (story.quizEnabled) {
      md += `---\n\n`;
      md += `### 🗳️【読者参加型アンケート】このガレージ、いくらだと思いますか？（いくらなら欲しいですか？）\n\n`;
      md += `今回ご紹介したガレージ（ガルバリウム鋼板軒出ゼロ・木造現し構造・電動リモコンシャッター完備）について、読者の皆さまにアンケートです！\n\n`;
      md += `**Q. ${story.quizQuestion}**\n\n`;
      story.quizOptions.forEach((opt) => {
        md += `- **${opt}**\n`;
      });
      md += `\nぜひ、noteのコメント欄や「スキ❤️」のリアクションで、あなたの予想や「この価格帯なら手に入れたい！」というご意見を教えてください！\n\n`;
      md += `#### 💡 答え合わせ：3Dシミュレーターでリアルタイム積算中！\n`;
      md += `実はこのガレージ、スマイチの無料WEBシミュレーター上で幅・奥行き・高さをミリ単位で変更しながら、**その場ですぐに概算建築費用を自動積算**できます。\n`;
      md += `「実際の建築費用の答え合わせ（目安: ${story.quizAnswerHint}）」や「ご自身の敷地ならいくらになるか」を、ぜひ登録不要のシミュレーターで確かめてみてください。\n\n`;
      md += `👉 [無料3Dシミュレーター＆リアルタイム積算で答え合わせをする](https://smile049.jp/simulator)\n\n`;
    }

    md += `▼ スマイチ公式サイト（無料3Dシミュレーター＆自動見積もり）\nhttps://smile049.jp/\n\n${story.hashtags}`;
    return md;
  };

  // X（旧Twitter）用ポスト成形（アンケート・短縮URL・ハッシュタグ）
  const formatXPost = (story) => {
    let text = `【木造自由設計ガレージ連載 第${story.episodeNum}話】\n`;
    text += `${story.title}\n\n`;
    if (story.quizEnabled) {
      text += `💬 Q. ${story.quizQuestion}\n`;
      story.quizOptions.slice(0, 4).forEach((opt) => {
        text += `・${opt}\n`;
      });
      text += `\n正解は3Dシミュレーターでリアルタイム積算中👇\n`;
    }
    text += `https://smile049.jp/simulator\n\n`;
    text += `#スマイチ #木造ガレージ #ガレージハウス #秘密基地`;
    return text;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 上部ヘッダーバナー */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 12,
        padding: '24px 28px',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              background: 'rgba(64, 145, 108, 0.25)',
              color: '#80ed99',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11.5,
              fontWeight: 700
            }}>
              SNS ＆ SEO マーケティング
            </span>
            <span style={{
              background: 'rgba(234, 179, 8, 0.2)',
              color: '#fde047',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11.5,
              fontWeight: 700
            }}>
              ★ 読者参加型 価格アンケート・希望価格リサーチ連動
            </span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#f8fafc' }}>
            Story Studio ｜ ガレージ連載・NanoBanana2 作画＆自動投稿アシスト
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#cbd5e1', maxWidth: 740, lineHeight: 1.6 }}>
            ユーザーがテーマと登場人物を設定し、AIエージェントが各話ストーリーとNanoBanana2（Google AI Pro）用作画プロンプトを自動生成。
            <strong>「あなたはこのガレージいくらだと思いますか？いくらなら欲しいですか？」</strong>という読者参加型アンケートを自動付与し、コメント獲得・SEO滞在時間・3Dシミュレーターへの答え合わせ送客を最大化します。
          </p>
        </div>

        <button
          onClick={() => setShowKitModal(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px 18px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          <HelpCircle size={16} />
          <span>アカウント開設完全キット・画像アセット</span>
        </button>
      </div>


      {/* ── モード切り替えタブ ── */}
      <div style={{ display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
        <button
          onClick={() => setStoryMode('preset')}
          style={{
            flex: 1, padding: '11px 0', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
            background: storyMode === 'preset' ? 'var(--color-primary)' : '#f8fafc',
            color: storyMode === 'preset' ? '#fff' : '#64748b',
            border: 'none', transition: 'all 0.2s'
          }}
        >
          📋 プリセット起動
        </button>
        <button
          onClick={() => setStoryMode('scenario')}
          style={{
            flex: 1, padding: '11px 0', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
            background: storyMode === 'scenario' ? '#7c3aed' : '#f8fafc',
            color: storyMode === 'scenario' ? '#fff' : '#64748b',
            border: 'none', borderLeft: '1.5px solid #e2e8f0', transition: 'all 0.2s'
          }}
        >
          ✍️ シナリオライター（自由生成）
        </button>
      </div>

      {/* ── シナリオライターパネル ── */}
      {storyMode === 'scenario' && (
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: 12, border: '1.5px solid #c4b5fd', padding: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 22 }}>✍️</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#5b21b6' }}>シナリオライター</div>
              <div style={{ fontSize: 12, color: '#7c3aed', marginTop: 2 }}>プリセット無視で、あらゆるターゲット・悩み・解決ストーリーを自由に設定してSNS連載を生成</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
                ① 訴求ターゲット・主人公 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="例：30代共働き夫婦、50代ガーデニング主婦、EV乗りの会社員"
                value={scTarget}
                onChange={e => setScTarget(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 13, background: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
                ② 誰のどんな悩み・課題 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="例：月3万円の駐車場代が無駄、変形地に既製品が入らない、ガーデン道具が雨ざらし"
                value={scProblem}
                onChange={e => setScProblem(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 13, background: '#fff' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
              ③ ガレージ・倉庫建築でどう解決したか <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              placeholder="例：中古住宅3,800万＋ガレージ300万で、新築4,500万と同程度の総額でガレージ付き生活を実現。台形の残地にぴったり収まる木造ガレージで駐車場代もゼロに。"
              value={scResolution}
              onChange={e => setScResolution(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 13, lineHeight: 1.6, background: '#fff' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>④ ストーリーのトーン</label>
              <select
                value={scTone}
                onChange={e => setScTone(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 13, background: '#fff' }}
              >
                <option value="emotional">😢 感動・共感系（暮らしが変わった）</option>
                <option value="comparison">⚖️ 比較訴求系（新築vs中古＋ガレージ）</option>
                <option value="data">📊 データ・論理系（数字で見る節約効果）</option>
                <option value="humor">😄 コミカル系（クスッとして気づく）</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>⑤ 必ず入れたい数字・キーワード（任意）</label>
              <input
                type="text"
                placeholder="例：7年で元が取れる、1,750万円の差、数センチ単位"
                value={scKeyword}
                onChange={e => setScKeyword(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 13, background: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>⑥ 生成話数</label>
              <select
                value={scEpisodeCount}
                onChange={e => setScEpisodeCount(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 13, background: '#fff' }}
              >
                <option value={3}>全3話（ミニ連載）</option>
                <option value={5}>全5話（標準連載）</option>
                <option value={7}>全7話（大型連載）</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleScenarioGenerate}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
            }}
          >
            <Sparkles size={18} />
            シナリオライターで全話を自由生成する
          </button>
        </div>
      )}

      {/* ステップ1：ストーリー設定フォーム（プリセットモード） */}
      {storyMode === 'preset' && (

      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
          }}>1</span>
          テーマ・登場人物・話数の設定（ユーザー入力）
        </h3>

        {/* プリセット選択 */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
            人気プリセットテーマから選ぶ
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
            {PRESET_THEMES.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `2px solid ${selectedPreset === p.id ? 'var(--color-primary)' : '#e2e8f0'}`,
                  background: selectedPreset === p.id ? 'rgba(64, 145, 108, 0.05)' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: selectedPreset === p.id ? 'var(--color-primary)' : '#1e293b' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 4 }}>
                  {p.protagonist.split('/')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 詳細入力グリッド */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
              連載タイトル・テーマ
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13.5
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
              主人公・登場人物（年代・職業・愛車・こだわり）
            </label>
            <input
              type="text"
              value={customProtagonist}
              onChange={(e) => setCustomProtagonist(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13.5
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            ストーリーの背景・課題（既製品の悩み、木造自由設計での解決ポイント）
          </label>
          <textarea
            value={customThemeDesc}
            onChange={(e) => setCustomThemeDesc(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              fontSize: 13.5,
              lineHeight: 1.6
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
              生成話数:
            </label>
            <select
              value={storyCount}
              onChange={(e) => setStoryCount(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13.5,
                fontWeight: 600,
                background: '#fff'
              }}
            >
              <option value={3}>全3話（ミニ連載 / 初心者向け）</option>
              <option value={5}>全5話（標準連載 / 約1ヶ月分）</option>
              <option value={7}>全7話（大型連載 / 約1.5ヶ月分）</option>
            </select>
          </div>

          <button
            onClick={handleGenerateAll}
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #2d6a4f 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(64, 145, 108, 0.3)'
            }}
          >
            <Sparkles size={18} />
            <span>AIストーリー＆作画プロンプト＆価格アンケート一括生成</span>
          </button>
        </div>
      </div>
      )} {/* end preset mode */}

      {/* ステップ2：ストーリー各話＆NanoBanana2作画・価格アンケート・投稿カード */}

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
            }}>2</span>
            生成された連載ストーリー一覧（全{stories.length}話）
          </h3>

          {/* 媒体タブ切り替え */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: 3, borderRadius: 8, gap: 4 }}>
            <button
              onClick={() => setActiveStoryTab('instagram')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: activeStoryTab === 'instagram' ? '#fff' : 'transparent',
                color: activeStoryTab === 'instagram' ? '#e1306c' : '#64748b',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: activeStoryTab === 'instagram' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <InstagramIcon size={14} color={activeStoryTab === 'instagram' ? '#e1306c' : '#64748b'} />
              <span>Instagram用表示</span>
            </button>
            <button
              onClick={() => setActiveStoryTab('note')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: activeStoryTab === 'note' ? '#fff' : 'transparent',
                color: activeStoryTab === 'note' ? '#10b981' : '#64748b',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: activeStoryTab === 'note' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <NoteIcon size={14} color={activeStoryTab === 'note' ? '#10b981' : '#64748b'} />
              <span>note用表示</span>
            </button>
            <button
              onClick={() => setActiveStoryTab('x')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: activeStoryTab === 'x' ? '#fff' : 'transparent',
                color: activeStoryTab === 'x' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: activeStoryTab === 'x' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <XIcon size={14} color={activeStoryTab === 'x' ? '#0f172a' : '#64748b'} />
              <span>X (Twitter)用表示</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {stories.map((story, idx) => (
            <div
              key={story.id}
              style={{
                background: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              {/* カードヘッダー */}
              <div style={{
                background: '#f8fafc',
                padding: '14px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    background: '#0f172a',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 800
                  }}>
                    第{story.episodeNum}話
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>
                    {story.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>配信予定日: <strong>{story.scheduledDate}</strong></span>
                  <span style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#2563eb',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}>
                    {story.assignedAccount}
                  </span>
                </div>
              </div>

              {/* カードメインコンテンツ */}
              <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                {/* 左列：ストーリー本文 ＆ 価格アンケート */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                    ストーリー本文（SEO配慮・木造自由設計の強みを網羅）
                  </div>
                  <div style={{
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: 8,
                    fontSize: 13.5,
                    lineHeight: 1.8,
                    color: '#1e293b',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid #e2e8f0',
                    maxHeight: 180,
                    overflowY: 'auto'
                  }}>
                    {story.plot}
                  </div>

                  {/* 読者参加型 価格アンケート・希望価格リサーチ枠 */}
                  <div style={{
                    marginTop: 16,
                    background: 'rgba(234, 179, 8, 0.06)',
                    borderRadius: 8,
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    padding: '12px 14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: '#b45309' }}>
                        <Vote size={15} />
                        <span>読者参加型 価格アンケート・希望価格リサーチ</span>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, cursor: 'pointer', color: '#78350f' }}>
                        <input
                          type="checkbox"
                          checked={story.quizEnabled}
                          onChange={(e) => {
                            const updated = [...stories];
                            updated[idx].quizEnabled = e.target.checked;
                            setStories(updated);
                          }}
                        />
                        <span>記事・投稿に含める</span>
                      </label>
                    </div>

                    {story.quizEnabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input
                          type="text"
                          value={story.quizQuestion}
                          onChange={(e) => {
                            const updated = [...stories];
                            updated[idx].quizQuestion = e.target.value;
                            setStories(updated);
                          }}
                          placeholder="質問文"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: '1px solid #cbd5e1',
                            background: '#fff'
                          }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 6 }}>
                          {story.quizOptions.map((opt, optIdx) => (
                            <input
                              key={optIdx}
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const updated = [...stories];
                                updated[idx].quizOptions[optIdx] = e.target.value;
                                setStories(updated);
                              }}
                              style={{
                                padding: '4px 8px',
                                fontSize: 11.5,
                                borderRadius: 4,
                                border: '1px solid #cbd5e1',
                                background: '#fff'
                              }}
                            />
                          ))}
                        </div>
                        <div style={{ fontSize: 11, color: '#78350f', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          <span>💡 答え合わせ目安:</span>
                          <strong>{story.quizAnswerHint}</strong>
                          <span style={{ color: '#92400e' }}>（3Dシミュレーター導線で即座に答え合わせ）</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ハッシュタグプレビュー */}
                  <div style={{ marginTop: 10, fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
                    <strong>付与タグ:</strong> {story.hashtags}
                  </div>
                </div>

                {/* 右列：NanoBanana2作画プロンプト ＆ 画像ドロップゾーン */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                      NanoBanana2 (Google AI Pro) 用 英語作画プロンプト
                    </div>
                    <button
                      onClick={() => copyToClipboard(story.englishPrompt, `prompt_${story.id}`)}
                      style={{
                        background: copiedKey === `prompt_${story.id}` ? '#10b981' : '#f1f5f9',
                        color: copiedKey === `prompt_${story.id}` ? '#fff' : '#0f172a',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        padding: '4px 10px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {copiedKey === `prompt_${story.id}` ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedKey === `prompt_${story.id}` ? 'コピー完了' : 'プロンプトをコピー'}</span>
                    </button>
                  </div>

                  {/* 英語プロンプト枠 */}
                  <div style={{
                    background: '#0f172a',
                    color: '#94a3b8',
                    padding: '10px 12px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    marginBottom: 12,
                    maxHeight: 75,
                    overflowY: 'auto'
                  }}>
                    {story.englishPrompt}
                  </div>

                  {/* 画像取り込み（ペーストまたはドロップ） */}
                  <div
                    onPaste={(e) => handlePasteImage(e, idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      handleImageFile(file, idx);
                    }}
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: 8,
                      padding: 12,
                      textAlign: 'center',
                      background: story.imageUrl ? '#f8fafc' : '#f1f5f9',
                      position: 'relative',
                      minHeight: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {story.imageUrl ? (
                      <div style={{ width: '100%', position: 'relative' }}>
                        <img
                          src={story.imageUrl}
                          alt={`第${story.episodeNum}話 イメージ`}
                          style={{
                            width: '100%',
                            maxHeight: 160,
                            objectFit: 'cover',
                            borderRadius: 6
                          }}
                        />
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                          <a
                            href={story.imageUrl}
                            download={`smile049_story_ep${story.episodeNum}.jpg`}
                            style={{
                              background: '#2563eb',
                              color: '#fff',
                              padding: '4px 10px',
                              borderRadius: 4,
                              fontSize: 11.5,
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Download size={12} />
                            <span>画像をダウンロード</span>
                          </a>
                          <button
                            onClick={() => {
                              const updated = [...stories];
                              updated[idx].imageUrl = null;
                              setStories(updated);
                            }}
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: 4,
                              fontSize: 11.5,
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                        <ImageIcon size={24} color="#94a3b8" style={{ marginBottom: 4 }} />
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                          生成した画像をここにドラッグ＆ドロップ または Ctrl+V でペースト
                        </div>
                        <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>
                          またはクリックして画像ファイルを選択
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFile(e.target.files?.[0], idx)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* 方式A：投稿アシストバー */}
              <div style={{
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {activeStoryTab === 'instagram' ? (
                    <>
                      <button
                        onClick={() => copyToClipboard(formatInstagramCaption(story), `ig_${story.id}`)}
                        style={{
                          background: copiedKey === `ig_${story.id}` ? '#10b981' : '#e1306c',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 14px',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {copiedKey === `ig_${story.id}` ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedKey === `ig_${story.id}` ? 'Instagram本文をコピー済' : 'Instagram投稿テキスト（アンケート付）をコピー'}</span>
                      </button>
                      <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#fff',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          padding: '8px 12px',
                          fontSize: 12.5,
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>Instagramを開く</span>
                      </a>
                    </>
                  ) : activeStoryTab === 'note' ? (
                    <>
                      <button
                        onClick={() => copyToClipboard(formatNoteMarkdown(story), `note_${story.id}`)}
                        style={{
                          background: copiedKey === `note_${story.id}` ? '#10b981' : '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 14px',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {copiedKey === `note_${story.id}` ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedKey === `note_${story.id}` ? 'note記事をコピー済' : 'note記事テキスト（アンケート・答え合わせCTA付）をコピー'}</span>
                      </button>
                      <a
                        href="https://note.com/notes/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#fff',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          padding: '8px 12px',
                          fontSize: 12.5,
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>note新規作成を開く</span>
                      </a>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => copyToClipboard(formatXPost(story), `x_${story.id}`)}
                        style={{
                          background: copiedKey === `x_${story.id}` ? '#10b981' : '#0f172a',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 14px',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {copiedKey === `x_${story.id}` ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedKey === `x_${story.id}` ? 'Xポストをコピー済' : 'X (Twitter) ポストをコピー'}</span>
                      </button>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(formatXPost(story))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#fff',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          padding: '8px 12px',
                          fontSize: 12.5,
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>Xでポストする</span>
                      </a>
                    </>
                  )}
                </div>

                {/* 投稿完了トグル */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
                    <input
                      type="checkbox"
                      checked={story.isPostedInstagram}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].isPostedInstagram = e.target.checked;
                        setStories(updated);
                      }}
                    />
                    <span>Instagram投稿済</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
                    <input
                      type="checkbox"
                      checked={story.isPostedNote}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].isPostedNote = e.target.checked;
                        setStories(updated);
                      }}
                    />
                    <span>note投稿済</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
                    <input
                      type="checkbox"
                      checked={story.isPostedX}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].isPostedX = e.target.checked;
                        setStories(updated);
                      }}
                    />
                    <span>X投稿済</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* アカウント開設キット モーダル */}
      {showKitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 14,
            maxWidth: 720,
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0f172a',
              color: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} color="#80ed99" />
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  公式SNSアカウント開設完全登録キット（Instagram / note / YouTube）
                </h4>
              </div>
              <button
                onClick={() => setShowKitModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* 公式画像アセット */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
                  🖼 配備済み公式ブランディング画像アセット
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <img src="/assets/sns/icon.jpg" alt="公式アイコン" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #cbd5e1' }} />
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>アイコン (1:1)</div>
                    <a href="/assets/sns/icon.jpg" download="smile049_sns_icon.jpg" style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>保存</a>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, minWidth: 200 }}>
                    <img src="/assets/sns/banner.jpg" alt="公式バナー" style={{ width: '100%', height: 64, borderRadius: 6, objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>ヘッダー/バナー (16:9)</div>
                    <a href="/assets/sns/banner.jpg" download="smile049_sns_banner.jpg" style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>保存</a>
                  </div>
                </div>
              </div>

              {/* Instagram設定 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#e1306c', marginBottom: 6 }}>
                  <InstagramIcon size={16} color="#e1306c" />
                  <span>Instagram 設定キット</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  <strong>ユーザーネーム:</strong> <code>@smile049_garage</code> | <strong>名前:</strong> <code>スマイチ | 木造自由設計ガレージ・倉庫</code>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={4}
                    value={`規格サイズに土地を合わせない。敷地に合わせて自分で描く「木造自由設計ガレージ・倉庫」\n🚗 愛車・大型バイクの秘密基地\n📐 狭小地・変形地・農業倉庫\n★ 登録不要の3Dシミュレーター＆リアルタイム自動見積もり公開中\n埼玉・関東全域対応｜専任スタッフが構造計算から施工までワンストップ\n👇 3Dシミュレーターを試す\nhttps://smile049.jp/`}
                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', lineHeight: 1.5 }}
                  />
                  <button
                    onClick={() => copyToClipboard(`規格サイズに土地を合わせない。敷地に合わせて自分で描く「木造自由設計ガレージ・倉庫」\n🚗 愛車・大型バイクの秘密基地\n📐 狭小地・変形地・農業倉庫\n★ 登録不要の3Dシミュレーター＆リアルタイム自動見積もり公開中\n埼玉・関東全域対応｜専任スタッフが構造計算から施工までワンストップ\n👇 3Dシミュレーターを試す\nhttps://smile049.jp/`, 'ig_profile')}
                    style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', fontSize: 11, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    {copiedKey === 'ig_profile' ? 'コピー済' : 'コピー'}
                  </button>
                </div>
              </div>

              {/* note設定 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#10b981', marginBottom: 6 }}>
                  <NoteIcon size={16} color="#10b981" />
                  <span>note+ 設定キット</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  <strong>note ID:</strong> <code>smile049</code> | <strong>クリエイター名:</strong> <code>スマイチ | 木造自由設計ガレージ物語</code>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={2}
                    value={`敷地に合わせてミリ単位で創る「木造自由設計ガレージ・倉庫 スマイチ」公式note。愛車と過ごす秘密基地、狭小変形地の特注ストッカー、農機具倉庫の設計ストーリーと3Dシミュレーター活用術をお届けします。`}
                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', lineHeight: 1.5 }}
                  />
                  <button
                    onClick={() => copyToClipboard(`敷地に合わせてミリ単位で創る「木造自由設計ガレージ・倉庫 スマイチ」公式note。愛車と過ごす秘密基地、狭小変形地の特注ストッカー、農機具倉庫の設計ストーリーと3Dシミュレーター活用術をお届けします。`, 'note_profile')}
                    style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', fontSize: 11, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    {copiedKey === 'note_profile' ? 'コピー済' : 'コピー'}
                  </button>
                </div>
              </div>

              {/* YouTube設定 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>
                  <YoutubeIcon size={16} color="#ef4444" />
                  <span>YouTube チャンネル開設キット</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  <strong>チャンネル名:</strong> <code>スマイチ 木造ガレージTV</code> | <strong>ハンドル:</strong> <code>@smile049_garage</code>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={4}
                    value={`規格サイズに土地を合わせるのではなく、敷地に合わせて自分で描く「木造自由設計ガレージ・倉庫 スマイチ」の公式YouTubeチャンネルです。\n\n【配信内容】\n・WEBブラウザ上で動く「無料3Dガレージシミュレーター」の実践操作解説\n・敷地寸法・台形変形地・勾配屋根のミリ単位設計ノウハウ\n・愛車（ポルシェ・GT-R・クラシックカー）や大型バイクと暮らすガレージプラン\n\n■ スマイチ公式サイト\nhttps://smile049.jp/`}
                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', lineHeight: 1.5 }}
                  />
                  <button
                    onClick={() => copyToClipboard(`規格サイズに土地を合わせるのではなく、敷地に合わせて自分で描く「木造自由設計ガレージ・倉庫 スマイチ」の公式YouTubeチャンネルです。\n\n【配信内容】\n・WEBブラウザ上で動く「無料3Dガレージシミュレーター」の実践操作解説\n・敷地寸法・台形変形地・勾配屋根のミリ単位設計ノウハウ\n・愛車（ポルシェ・GT-R・クラシックカー）や大型バイクと暮らすガレージプラン\n\n■ スマイチ公式サイト\nhttps://smile049.jp/`, 'yt_profile')}
                    style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', fontSize: 11, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    {copiedKey === 'yt_profile' ? 'コピー済' : 'コピー'}
                  </button>
                </div>
              </div>

              {/* X（旧Twitter）設定 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  <XIcon size={16} color="#0f172a" />
                  <span>X（旧Twitter） アカウント開設キット</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  <strong>ユーザー名:</strong> <code>@smile049_garage</code> | <strong>名前:</strong> <code>スマイチ | 木造自由設計ガレージ・倉庫</code>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={4}
                    value={`規格サイズに土地を合わせない。敷地に合わせてミリ単位で描く「木造自由設計ガレージ・倉庫 スマイチ」公式X。🚗愛車・大型バイクの秘密基地／狭小変形地ストッカー／農機具倉庫。登録不要の3Dシミュレーター＆自動見積もり公開中！埼玉・関東全域対応。専任スタッフが構造計算から施工までワンストップ。\nhttps://smile049.jp/`}
                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', lineHeight: 1.5 }}
                  />
                  <button
                    onClick={() => copyToClipboard(`規格サイズに土地を合わせない。敷地に合わせてミリ単位で描く「木造自由設計ガレージ・倉庫 スマイチ」公式X。🚗愛車・大型バイクの秘密基地／狭小変形地ストッカー／農機具倉庫。登録不要の3Dシミュレーター＆自動見積もり公開中！埼玉・関東全域対応。専任スタッフが構造計算から施工までワンストップ。\nhttps://smile049.jp/`, 'x_profile')}
                    style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', fontSize: 11, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    {copiedKey === 'x_profile' ? 'コピー済' : 'コピー'}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowKitModal(false)}
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
