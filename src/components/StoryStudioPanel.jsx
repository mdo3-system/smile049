import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Copy, Check, ExternalLink, Image as ImageIcon, Download, 
  Trash2, RefreshCw, Layers, CheckCircle2, ChevronDown, ChevronRight, 
  BookOpen, HelpCircle, Upload, ShieldCheck, ArrowRight, DollarSign, Vote,
  Calendar, Video, Film, Play, FolderOpen, Link as LinkIcon, Key, HardDrive, Share2,
  Search, Zap, Tag, FileText, MessageSquare, Mic, Volume2, Info
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, NoteIcon, XIcon } from './SnsIcons';
import { 
  getAllStories, saveAllStories, isStoryPublished, generateVeoPrompt, 
  generateVeo3CutPrompts, buildVeoDialogueBlock, STORY_STORAGE_KEY, GOOGLE_MASTER_INFO,
  extractGoogleDriveFileId, isGoogleDriveUrl, getGoogleDrivePreviewUrl, getGoogleDriveDownloadUrl,
  generateAssetFileName, getAutoDetectedAssetInfo, generateGoogleAppsScriptForFolders, getGoogleDriveSearchUrl,
  formatXPost, calculateXPostLength
} from '../services/storyService';
import { APP_VERSION } from '../version.js';

const STORAGE_KEY = STORY_STORAGE_KEY;

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

    const defaultDialogueList = [
      '土地や既製品のサイズに合わせるんじゃなくて、自分で敷地に合わせられるんだ',
      '画面の中でミリ単位で形になっていく…これなら理想通りに作れそう',
      '専任スタッフが構造計算から確認申請まで全部やってくれるから本当に心強いね',
      '木の香りがして結露もしない。木造ガレージにして本当に大正解だったよ',
      '作って本当に良かった。毎日の暮らしがこんなに快適で楽しくなるなんて'
    ];
    const dialogue = phaseData.dialogue || defaultDialogueList[(i - 1) % defaultDialogueList.length];
    const cuts = generateVeo3CutPrompts(englishPrompt, epTitle, i, { dialogue, protagonist: protagonist || presetData?.protagonist });

    const storyObj = {
      id: `story_${Date.now()}_${i}`,
      episodeNum: i,
      phase,
      title: epTitle,
      plot,
      assignedAccount: `Google AI Pro アカウント ${(i % 5) || 5}`,
      englishPrompt,
      dialogue,
      veoPrompt: cuts.scene3 || cuts.scene1,
      veoPromptScene1: cuts.scene1,
      veoPromptScene2: cuts.scene2,
      veoPromptScene3: cuts.scene3,
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
    };
    storyObj.xPost = formatXPost(storyObj);
    generated.push(storyObj);
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
  const [kitModalTab, setKitModalTab] = useState('manual'); // 'manual' | 'snsKit'

  // シナリオライター専用フィールド（クリエイティブスタジオ3部門体制 ＆ 5大要素連動）
  const [scTarget, setScTarget] = useState('新築予算で中古購入＋リノベ＋木造ガレージで暮らしの豊かさを優先する層'); // ターゲット像・ペルソナ
  const [scProblem, setScProblem] = useState('住宅展示場を回っても4,500万円と高額で手が出ず、駐車場代も月3万円かかっている'); // 誰のどんな悩み
  const [scResolution, setScResolution] = useState('中古住宅3,800万＋ガレージ300万で新築と同予算内でガレージ付き生活を実現し駐車場代ゼロへ'); // ガレージ・建築による解決
  const [scEmotionBenefit, setScEmotionBenefit] = useState('雨に濡れずに外出して帰宅できる贅沢、毎日の暮らしのゆとり'); // 住み手が手に入れる感情の変化
  const [scNgLine, setScNgLine] = useState('高級路線・派手な演出はNG（等身大の生活実感・賢い選択を重視）'); // 避けたい表現・NGライン
  const [scCta, setScCta] = useState('3Dシミュレーターでリアルタイム積算＆答え合わせ'); // 視聴した後のCTA
  const [scDuration, setScDuration] = useState(30); // 90 | 60 | 30 | 15 (ワンソース・マルチユース尺設計)
  const [scTone, setScTone] = useState('emotional'); // emotional | data | humor | comparison
  const [scKeyword, setScKeyword] = useState('雨に濡れない贅沢、月3万円の駐車場代ゼロ、ミリ単位設計'); // 必ず入れたいキーワード・数字
  const [scEpisodeCount, setScEpisodeCount] = useState(3);
  const [stories, setStories] = useState(() => getAllStories());

  const [copiedKey, setCopiedKey] = useState(null);
  const [activeStoryTab, setActiveStoryTab] = useState('instagram'); // 'instagram' | 'youtube' | 'note' | 'x'
  const [promptType, setPromptType] = useState('veo'); // 'veo' | 'nano'
  const [selectedVeoCut, setSelectedVeoCut] = useState('scene1'); // 'scene1' | 'scene2' | 'scene3' | 'all'
  const [showDialogueTips, setShowDialogueTips] = useState(false); // Veo 3 日本語台詞英語化防止Tips表示トグル

  // Google Drive（049smile02@gmail.com）集約管理ステート
  const [showDriveInfoModal, setShowDriveInfoModal] = useState(false);
  const [showFolderBuildModal, setShowFolderBuildModal] = useState(false);
  const [driveLinkInputs, setDriveLinkInputs] = useState({});
  const [activeLinkInputKey, setActiveLinkInputKey] = useState(null);

  // 共有ストレージ保存
  useEffect(() => {
    saveAllStories(stories);
  }, [stories]);

  // Google Drive共有リンク・URLの登録ハンドラー
  const handleRegisterDriveLink = (storyIndex, mediaType) => {
    const key = `${storyIndex}_${mediaType}`;
    const rawUrl = (driveLinkInputs[key] || '').trim();
    if (!rawUrl) return;

    const updated = [...stories];
    if (mediaType === 'video') {
      updated[storyIndex].videoUrl = rawUrl;
    } else {
      updated[storyIndex].imageUrl = rawUrl;
    }
    setStories(updated);
    setActiveLinkInputKey(null);
    setDriveLinkInputs(prev => ({ ...prev, [key]: '' }));
  };


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

      let sceneDialogue = '';
      if (i === 1) {
        sceneDialogue = `「${scProblem.slice(0, 18)}で悩んでたけど、自分で設計できるなら試してみよう」`;
      } else if (i === scEpisodeCount) {
        sceneDialogue = `「作って本当に良かった！${scResolution.slice(0, 16)}で暮らしが変わったよ」`;
      } else {
        sceneDialogue = `「敷地の形に合わせて数センチ単位で設計できるなんて、本当に助かるね」`;
      }

      return { phase, subTitle, plot: () => plot, englishPrompt, dialogue: sceneDialogue };
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
    const newStories = scenarioPhases.map((ph, idx) => {
      const cuts = generateVeo3CutPrompts(ph.englishPrompt, `${themeTitle} ${ph.subTitle}`, idx + 1, { dialogue: ph.dialogue, protagonist });
      const storyObj = {
        id: `story_${Date.now()}_${idx + 1}`,
        episodeNum: idx + 1,
        phase: ph.phase,
        title: `${themeTitle} ${ph.subTitle}`,
        plot: ph.plot(protagonist),
        assignedAccount: `Google AI Pro アカウント ${((idx + 1) % 5) || 5}`,
        englishPrompt: ph.englishPrompt,
        dialogue: ph.dialogue,
        veoPrompt: cuts.scene3 || cuts.scene1,
        veoPromptScene1: cuts.scene1,
        veoPromptScene2: cuts.scene2,
        veoPromptScene3: cuts.scene3,
        imageUrl: null,
        videoUrl: null,
        hashtags: scHashtags,
        quizEnabled: true,
        quizQuestion: scQuiz,
        quizOptions: fakePreset.defaultPriceOptions,
        quizAnswerHint: fakePreset.answerHint,
        isPostedInstagram: false,
        isPostedYouTube: false,
        isPostedNote: false,
        isPostedX: false,
        scheduledDate: new Date(Date.now() + idx * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      storyObj.xPost = formatXPost(storyObj);
      return storyObj;
    });
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


  // 役者セリフ（日本語台詞）変更時の即時再計算・保存
  const handleUpdateDialogue = (storyIndex, newDialogue) => {
    const updated = [...stories];
    const story = updated[storyIndex];
    const cuts = generateVeo3CutPrompts(story.englishPrompt, story.title, story.episodeNum, { dialogue: newDialogue, protagonist: story.protagonist || customProtagonist });
    updated[storyIndex] = {
      ...story,
      dialogue: newDialogue,
      veoPrompt: cuts.scene3 || cuts.scene1,
      veoPromptScene1: cuts.scene1,
      veoPromptScene2: cuts.scene2,
      veoPromptScene3: cuts.scene3
    };
    setStories(updated);
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

  // 動画アップロード処理（MP4 / WebM / MOV）
  const handleVideoFile = (file, storyIndex) => {
    if (!file || (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|avi)$/i))) {
      alert('動画ファイル（MP4, WebM, MOV等）を選択してください。');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...stories];
      updated[storyIndex].videoUrl = e.target.result;
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

  // Instagram用キャプション成形（動画×画像ハイブリッド・カルーセル最適化）
  const formatInstagramCaption = (story) => {
    let caption = '';
    if (story.videoUrl && story.imageUrl) {
      caption += `【🎥動画×画像カルーセル投稿】\n`;
      caption += `👉 スワイプで詳細パース＆図面をチェック！\n\n`;
    } else if (story.videoUrl) {
      caption += `【🎥リール動画・完成イメージ】\n\n`;
    }
    caption += `${story.phase}\n${story.title}\n\n${story.plot}\n\n`;

    if (story.quizEnabled) {
      caption += `―――――――――――――――\n`;
      caption += `💬【読者アンケート・コメントで教えてください！】\n`;
      caption += `Q. ${story.quizQuestion}\n\n`;
      story.quizOptions.forEach((opt) => {
        caption += `${opt}\n`;
      });
      caption += `\n👉 あなたの予想や「この金額なら建てたい！」をコメント欄（またはストーリーズ投票）で教えてください！\n`;
      caption += `※ プロフィールの3Dシミュレーター（@smile049_garage）で実際のリアルタイム積算見積もりがその場で答え合わせできます。\n\n`;
    }

    caption += `―――――――――――――――\n■ 木造自由設計ガレージ・倉庫【スマイチ】\n規格サイズに土地を合わせるのではなく、\nあなたの敷地にガレージを合わせる。\n\n・登録不要の3Dシミュレーター＆リアルタイム積算見積もり\n・ガルバリウム鋼板×木造現しの洗練されたモダンデザイン\n・専任スタッフによる構造計算・確認申請ワンストップ施工\n\nプロフィールのリンク（@smile049_garage）から3D設計をお試しいただけます。\nhttps://smile049.jp/\n\n${story.hashtags}`;
    return caption;
  };

  // YouTube用動画概要欄（Shorts / 通常動画対応、最初の3秒フック、あらすじ、アンケート、3D答え合わせリンク、仕様タグ）
  const formatYouTubeDescription = (story) => {
    let desc = `【木造自由設計ガレージ連載 第${story.episodeNum}話】\n`;
    desc += `${story.title}\n\n`;
    desc += `▼ 本編あらすじ\n${story.plot}\n\n`;
    desc += `――――――――――――――――――――――\n`;
    if (story.quizEnabled) {
      desc += `🗳️【視聴者アンケート】この木造ガレージ、いくらだと思いますか？\n`;
      desc += `Q. ${story.quizQuestion}\n`;
      story.quizOptions.forEach((opt) => {
        desc += `・${opt}\n`;
      });
      desc += `\nぜひ、コメント欄であなたの予想や「この仕様なら欲しい！」を教えてください！\n\n`;
      desc += `💡【答え合わせ】無料3Dシミュレーターでリアルタイム積算中！\n`;
      desc += `（概算目安: ${story.quizAnswerHint}）\n`;
      desc += `ご自身の敷地サイズを入力して、その場で建築費用を3D積算できます👇\n`;
      desc += `https://smile049.jp/simulator\n\n`;
    }
    desc += `――――――――――――――――――――――\n`;
    desc += `■ 木造自由設計ガレージ・倉庫「スマイチ」\n`;
    desc += `・敷地にガレージを合わせるミリ単位の自由設計（台形地・狭小地・変形地対応）\n`;
    desc += `・結露を防ぎ木の温もりを感じる木造構造 × ガルバリウム鋼板（軒出ゼロ）\n`;
    desc += `・登録不要！ブラウザ3Dシミュレーターで誰でもすぐ概算見積もり\n`;
    desc += `公式サイト: https://smile049.jp/\n\n`;
    desc += `${story.hashtags} #YouTubeShorts #Shorts #ガレージライフ`;
    return desc;
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

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="/stories"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #2d6a4f 100%)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(64, 145, 108, 0.35)'
            }}
          >
            <BookOpen size={16} />
            <span>🌐 サイト内連載ページ（/stories）を開く</span>
          </a>

          <button
            onClick={() => {
              setKitModalTab('manual');
              setShowKitModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.15) 100%)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              padding: '10px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(56, 189, 248, 0.2)',
              transition: 'all 0.2s'
            }}
          >
            <BookOpen size={16} />
            <span>📖 運用手順・操作マニュアル</span>
          </button>

          <button
            onClick={() => {
              setKitModalTab('snsKit');
              setShowKitModal(true);
            }}
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
            <ShieldCheck size={16} />
            <span>公式SNS開設キット・画像</span>
          </button>
        </div>
      </div>

      {/* ── 📁 Google Drive 素材共有センター（049smile02@gmail.com）集約管理バナー ── */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        border: '1.5px solid #bfdbfe',
        borderRadius: 10,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: '#2563eb',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
            flexShrink: 0
          }}>
            <HardDrive size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: '#1e40af' }}>
                📁 動画・画像マスター共有ストレージ（Google Drive 集約管理）
              </span>
              <span style={{
                background: '#dbeafe',
                color: '#1d4ed8',
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700
              }}>
                049smile02@gmail.com
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2 }}>
              各スタッフが作成した動画（Veo 3等）・AIパース画像はすべてこのドライブに保存・集約してください。どのPCからでも容量無制限で流用できます。
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <a
            href={GOOGLE_MASTER_INFO.accountChooserUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
              cursor: 'pointer'
            }}
          >
            <FolderOpen size={14} />
            <span>Google Drive を開く</span>
            <ExternalLink size={12} />
          </a>

          <button
            type="button"
            onClick={() => setShowFolderBuildModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)',
              cursor: 'pointer'
            }}
            title="Google Drive内に各話・各カットの階層フォルダを一瞬で自動生成します"
          >
            <Zap size={14} />
            <span>⚡ フォルダ自動構築ツール</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDriveInfoModal(true)}
            style={{
              background: '#fff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              padding: '7px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer'
            }}
          >
            <Key size={13} />
            <span>ログイン情報・集約手順</span>
          </button>
        </div>
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

      {/* ── シナリオライターパネル（クリエイティブ制作スタジオ体制 ＆ ワンソース・マルチユース） ── */}
      {storyMode === 'scenario' && (
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: 12, border: '1.5px solid #c4b5fd', padding: 24
        }}>
          {/* ヘッダー */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🎬</span>
              <div>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: '#5b21b6' }}>
                  クリエイティブ制作スタジオ ｜ シナリオライター（自由生成・マスター企画）
                </div>
                <div style={{ fontSize: 12, color: '#7c3aed', marginTop: 2 }}>
                  3部門・7大スペシャリストの視点を統合し、1つのマスター企画から全尺（90秒〜15秒）と全SNSへ自動連鎖展開
                </div>
              </div>
            </div>
            <div style={{ background: '#ede9fe', padding: '4px 10px', borderRadius: 6, fontSize: 11.5, color: '#6d28d9', fontWeight: 700 }}>
              ★ 建築プロデューサー伴走モデル
            </div>
          </div>

          {/* クリエイティブ制作スタジオ体制（3部門・7大スペシャリスト）解説バナー */}
          <div style={{
            background: '#ffffff',
            borderRadius: 10,
            border: '1px solid #ddd6fe',
            padding: '14px 18px',
            marginBottom: 20
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#5b21b6', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>👥</span>
              <span>スタジオ制作体制（各専門スタッフの連携ワークフロー）</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, fontSize: 11.5 }}>
              {/* ① 企画・ディレクション部門 */}
              <div style={{ background: '#f5f3ff', borderRadius: 8, padding: 10, border: '1px solid #e9d5ff' }}>
                <strong style={{ color: '#6d28d9', display: 'block', marginBottom: 4 }}>
                  (1) 企画・ディレクション部門
                </strong>
                <div style={{ color: '#4c1d95', lineHeight: 1.5 }}>
                  ・<strong>建築プロデューサー / CD:</strong> 建築意図・自然素材・機能美の世界観を統括<br />
                  ・<strong>映像ディレクター:</strong> 限られた尺での見どころ絵コンテ設計<br />
                  ・<strong>シナリオライター:</strong> 「最初の3秒のフック」＆数値を情緒体験へ翻訳
                </div>
              </div>

              {/* ② 撮影部門 */}
              <div style={{ background: '#f5f3ff', borderRadius: 8, padding: 10, border: '1px solid #e9d5ff' }}>
                <strong style={{ color: '#6d28d9', display: 'block', marginBottom: 4 }}>
                  (2) 撮影部門（建築・空間スペシャリスト）
                </strong>
                <div style={{ color: '#4c1d95', lineHeight: 1.5 }}>
                  ・<strong>建築シネマグラファー:</strong> 歪みのないレンズ選定、自然光と間接照明の美しさ<br />
                  ・<strong>ドローンパイロット:</strong> 敷地全体の広がり、変形地境界、周辺環境を俯瞰撮影
                </div>
              </div>

              {/* ③ 編集・ポストプロダクション部門 */}
              <div style={{ background: '#f5f3ff', borderRadius: 8, padding: 10, border: '1px solid #e9d5ff' }}>
                <strong style={{ color: '#6d28d9', display: 'block', marginBottom: 4 }}>
                  (3) 編集・ポストプロダクション部門
                </strong>
                <div style={{ color: '#4c1d95', lineHeight: 1.5 }}>
                  ・<strong>カラリスト:</strong> 木目の温もり、ガルバリウム鋼板の重厚感<br />
                  ・<strong>モーショングラフィックス:</strong> 無音視聴対応のフォント・テロップ<br />
                  ・<strong>サウンドデザイナー:</strong> 生活実感ある環境音（雨音・木肌の温もり。※高級路線NG）
                </div>
              </div>
            </div>
          </div>

          {/* ワンソース・マルチユース 尺セレクター */}
          <div style={{
            background: '#ffffff',
            borderRadius: 10,
            border: '1px solid #ddd6fe',
            padding: '12px 18px',
            marginBottom: 20
          }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#5b21b6', marginBottom: 8 }}>
              ⏱️ ワンソース・マルチユース展開（Gemini 1カット約8〜10秒固定に基づく尺・カット数設計）
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
              {[
                { sec: 30, label: '30秒（1話・全3カット / 約24〜30s）', desc: 'Shorts / リール王道（推奨）' },
                { sec: 60, label: '60秒（2話分・全6カット / 約48〜60s）', desc: 'WEBメイン・ブランド共感型' },
                { sec: 90, label: '90秒（3話分・全9カット / 約72〜90s）', desc: 'YouTube長尺・施工事例' },
                { sec: 15, label: '10〜15秒（単独1カット / 約8〜10s）', desc: 'ストーリーズ・バンパー広告' }
              ].map(d => (
                <button
                  key={d.sec}
                  type="button"
                  onClick={() => setScDuration(d.sec)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: `2px solid ${scDuration === d.sec ? '#7c3aed' : '#e2e8f0'}`,
                    background: scDuration === d.sec ? '#f5f3ff' : '#fff',
                    color: scDuration === d.sec ? '#6d28d9' : '#475569',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800 }}>{d.label}</div>
                  <div style={{ fontSize: 10.5, color: '#8b5cf6', marginTop: 2 }}>{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* シナリオライターに伝えるべき5大重要要素入力フォーム */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
                ① 誰に届けたいか（ターゲット像・ペルソナ） <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="例：新築住宅の予算で、中古住宅購入＋リノベ＋木造ガレージで暮らしの豊かさを優先する層"
                value={scTarget}
                onChange={e => setScTarget(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
                ② 誰のどんな悩み・課題（現状の不満・不自由） <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="例：住宅展示場を回っても4,500万円と高額。変形地で既製品物置が入らず、駐車場代も月3万円"
                value={scProblem}
                onChange={e => setScProblem(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
                ③ ガレージ・建築による解決（どう解決したか） <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="例：中古住宅3,800万＋ガレージ300万で新築と同予算内でガレージ付き生活を実現。駐車場代ゼロへ"
                value={scResolution}
                onChange={e => setScResolution(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
                ④ 住み手が手に入れる「感情の変化（ベネフィット）」 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="例：雨に濡れずに外出して帰宅できる贅沢、毎日の暮らしのゆとり、家族との団らん"
                value={scEmotionBenefit}
                onChange={e => setScEmotionBenefit(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
                ⑤ 避けたい表現・NGライン（ブランドのトーン＆マナー）
              </label>
              <input
                type="text"
                placeholder="例：きらびやかな高級路線・億ション風の演出はNG（等身大の暮らしの豊かさを重視）"
                value={scNgLine}
                onChange={e => setScNgLine(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>
                ⑥ 視聴した後にどうなってほしいか（CTA・次の行動）
              </label>
              <input
                type="text"
                placeholder="例：3Dシミュレーターでリアルタイム積算見積もり＆答え合わせ、または専任スタッフ無料相談"
                value={scCta}
                onChange={e => setScCta(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>⑦ ストーリーのトーン</label>
              <select
                value={scTone}
                onChange={e => setScTone(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              >
                <option value="emotional">😢 感動・共感系（雨に濡れない贅沢・暮らしの豊かさ）</option>
                <option value="comparison">⚖️ 比較訴求系（新築vs中古＋ガレージ）</option>
                <option value="data">📊 データ・論理系（月3万円削減・7年回収）</option>
                <option value="humor">😄 コミカル系（クスッとして気づく逆転発想）</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>⑧ 必ず入れたいキーワード・数字（任意）</label>
              <input
                type="text"
                placeholder="例：雨に濡れない贅沢、月3万円の駐車場代ゼロ、ミリ単位設計"
                value={scKeyword}
                onChange={e => setScKeyword(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5b21b6', marginBottom: 5 }}>⑨ 生成話数</label>
              <select
                value={scEpisodeCount}
                onChange={e => setScEpisodeCount(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1.5px solid #c4b5fd', fontSize: 12.5, background: '#fff' }}
              >
                <option value={3}>全3話（ミニ連載 / 1アカウント3カット×全話）</option>
                <option value={5}>全5話（標準連載 / 5アカウント×3カット=最大15動画）</option>
                <option value={7}>全7話（大型連載 / 中古＋ガレージ全景）</option>
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
            マスター企画 ＆ Veo 3（3カット×全話）プロンプトを一括生成する
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
          <div style={{ display: 'flex', background: '#e2e8f0', padding: 3, borderRadius: 8, gap: 4, flexWrap: 'wrap' }}>
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
              onClick={() => setActiveStoryTab('youtube')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: activeStoryTab === 'youtube' ? '#fff' : 'transparent',
                color: activeStoryTab === 'youtube' ? '#ef4444' : '#64748b',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: activeStoryTab === 'youtube' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <YoutubeIcon size={14} color={activeStoryTab === 'youtube' ? '#ef4444' : '#64748b'} />
              <span>YouTube用表示</span>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12 }}>
                  {/* 公開ステータスバッジ */}
                  {isStoryPublished(story) ? (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#059669',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <CheckCircle2 size={12} /> サイト公開中
                    </span>
                  ) : (
                    <span style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Calendar size={12} /> 予約公開予定
                    </span>
                  )}

                  {/* 配信予定日 編集ピッカー */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#64748b' }}>配信日:</span>
                    <input
                      type="date"
                      value={story.scheduledDate}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].scheduledDate = e.target.value;
                        setStories(updated);
                      }}
                      style={{
                        padding: '3px 6px',
                        borderRadius: 4,
                        border: '1px solid #cbd5e1',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#0f172a',
                        background: '#fff'
                      }}
                    />
                  </div>

                  {/* サイト公開プレビュー */}
                  <a
                    href={`/stories?ep=${story.episodeNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#fff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 11.5,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3
                    }}
                    title="Webサイト上の公開画面を確認"
                  >
                    <ExternalLink size={12} />
                    <span>サイト確認</span>
                  </a>

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
                {/* 左列：ストーリー本文 または X専用ポスト本文 */}
                <div>
                  {activeStoryTab === 'x' ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <XIcon size={14} color="#0f172a" />
                          <span>X (Twitter) ポスト本文（全角140文字厳守・リアルタイム積算CTA）</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...stories];
                            updated[idx].xPost = formatXPost(story);
                            setStories(updated);
                          }}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: 4,
                            padding: '3px 8px',
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#475569',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                          title="140文字仕様で自動再最適化して初期化"
                        >
                          <RefreshCw size={11} />
                          <span>140文字に再最適化</span>
                        </button>
                      </div>

                      {/* Xポスト入力エリア */}
                      <textarea
                        value={story.xPost || formatXPost(story)}
                        onChange={(e) => {
                          const updated = [...stories];
                          updated[idx].xPost = e.target.value;
                          setStories(updated);
                        }}
                        rows={7}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: '#0f172a',
                          border: calculateXPostLength(story.xPost || formatXPost(story)) > 140 ? '2px solid #ef4444' : '1px solid #cbd5e1',
                          background: '#fff',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                        placeholder="Xポスト本文を入力..."
                      />

                      {/* 文字数カウンター ＆ 判定インジケーター */}
                      {(() => {
                        const currentText = story.xPost || formatXPost(story);
                        const len = calculateXPostLength(currentText);
                        const isOver = len > 140;
                        const remain = 140 - len;
                        return (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 6,
                            padding: '6px 12px',
                            borderRadius: 6,
                            background: isOver ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            border: isOver ? '1px solid #fca5a5' : '1px solid #a7f3d0',
                            fontSize: 12
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {isOver ? (
                                <span style={{ color: '#dc2626', fontWeight: 800 }}>⚠️ 140文字を超過しています（Xに投稿できません）</span>
                              ) : (
                                <span style={{ color: '#059669', fontWeight: 700 }}>✅ 140文字以内（Xにそのままポスト可能）</span>
                              )}
                            </div>
                            <div style={{ fontWeight: 800, color: isOver ? '#dc2626' : '#059669', fontSize: 13 }}>
                              <span>{len}</span> / 140文字
                              <span style={{ fontSize: 11, fontWeight: 600, marginLeft: 6, color: isOver ? '#b91c1c' : '#047857' }}>
                                ({isOver ? `超過 +${len - 140}` : `残り ${remain}`})
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      <div style={{ marginTop: 8, fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
                        💡 <strong>X文字数仕様:</strong> URL（https://smile049.jp/simulator）はX公式仕様により一律23半角文字（全角11.5文字）として正確に加重計算されます。
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>

                {/* 右列：AIプロンプト（Veo 3 動画 3カット絵コンテ ＆ NanoBanana2 静止画） ＆ メディアスロット */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                    {/* タブ切り替え（Veo 3 / NanoBanana2） */}
                    <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 2, borderRadius: 6 }}>
                      <button
                        onClick={() => setPromptType('veo')}
                        style={{
                          background: promptType === 'veo' ? '#2563eb' : 'transparent',
                          color: promptType === 'veo' ? '#fff' : '#64748b',
                          border: 'none',
                          borderRadius: 4,
                          padding: '3px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Video size={12} />
                        <span>🎥 Veo 3 (4K絵コンテ 3カット)</span>
                      </button>
                      <button
                        onClick={() => setPromptType('nano')}
                        style={{
                          background: promptType === 'nano' ? '#0f172a' : 'transparent',
                          color: promptType === 'nano' ? '#fff' : '#64748b',
                          border: 'none',
                          borderRadius: 4,
                          padding: '3px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ImageIcon size={12} />
                        <span>🖼️ NanoBanana2 (静止画)</span>
                      </button>
                    </div>

                    {/* コピーボタン */}
                    {(() => {
                      const cuts = generateVeo3CutPrompts(story.englishPrompt, story.title, story.episodeNum, { dialogue: story.dialogue, protagonist: story.protagonist || customProtagonist });
                      const targetText = promptType === 'nano'
                        ? story.englishPrompt
                        : selectedVeoCut === 'scene1'
                        ? (story.veoPromptScene1 || cuts.scene1)
                        : selectedVeoCut === 'scene2'
                        ? (story.veoPromptScene2 || cuts.scene2)
                        : selectedVeoCut === 'scene3'
                        ? (story.veoPromptScene3 || cuts.scene3)
                        : `【Scene 1: 外観・ドローン全景】\n${story.veoPromptScene1 || cuts.scene1}\n\n【Scene 2: シャッター・木造現し構造】\n${story.veoPromptScene2 || cuts.scene2}\n\n【Scene 3: 雨の日入庫・生活実感（セリフ）】\n${story.veoPromptScene3 || cuts.scene3}`;

                      const copyKeyId = `prompt_${story.id}_${promptType}_${selectedVeoCut}`;

                      return (
                        <button
                          onClick={() => copyToClipboard(targetText, copyKeyId)}
                          style={{
                            background: copiedKey === copyKeyId ? '#10b981' : (promptType === 'veo' ? '#eff6ff' : '#f1f5f9'),
                            color: copiedKey === copyKeyId ? '#fff' : (promptType === 'veo' ? '#2563eb' : '#0f172a'),
                            border: promptType === 'veo' ? '1px solid #bfdbfe' : '1px solid #cbd5e1',
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
                          {copiedKey === copyKeyId ? <Check size={12} /> : <Copy size={12} />}
                          <span>
                            {copiedKey === copyKeyId 
                              ? 'コピー完了' 
                              : (promptType === 'veo' 
                                  ? (selectedVeoCut === 'all' ? '全3カット一括コピー（100%日本語）' : `${selectedVeoCut.toUpperCase()}をコピー（100%日本語）`)
                                  : '作画プロンプトをコピー')}
                          </span>
                        </button>
                      );
                    })()}
                  </div>

                  {/* Veo 3 選択時の役者セリフ（日本語発話・年代厳格指定）入力エリア ＆ 絵コンテ 3カット切り替えセレクター */}
                  {promptType === 'veo' && (
                    <div style={{ marginBottom: 8 }}>
                      {/* 🗣️ 役者セリフ（日本語台詞）編集ブロック */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        padding: '8px 10px',
                        marginBottom: 6
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Mic size={12} color="#2563eb" />
                            <span>🗣️ 役者セリフ（100%日本語発話＆年代固定）:</span>
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                              fontSize: 10,
                              padding: '1px 6px',
                              borderRadius: 4,
                              background: story.dialogue ? '#dcfce7' : '#f1f5f9',
                              color: story.dialogue ? '#15803d' : '#64748b',
                              fontWeight: 700
                            }}>
                              {story.dialogue ? '🇯🇵 100%日本語・年代厳密指定' : '🔇 環境音のみ（英語音声遮断）'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowDialogueTips(!showDialogueTips)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#2563eb',
                                fontSize: 10.5,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                                textDecoration: 'underline'
                              }}
                            >
                              <Info size={11} />
                              <span>{showDialogueTips ? '閉じる' : '100%日本語・年代固定の仕組み'}</span>
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input
                            type="text"
                            value={story.dialogue || ''}
                            onChange={(e) => handleUpdateDialogue(idx, e.target.value)}
                            placeholder="例: 雨の日でも濡れずに荷物が運べるなんて、本当に便利で助かるね"
                            style={{
                              flex: 1,
                              padding: '5px 8px',
                              fontSize: 11.5,
                              borderRadius: 4,
                              border: '1px solid #cbd5e1',
                              background: '#fff',
                              color: '#0f172a'
                            }}
                          />
                          {story.dialogue ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateDialogue(idx, '')}
                              title="セリフなし（環境音・BGMのみ）に変更"
                              style={{
                                padding: '4px 8px',
                                fontSize: 10.5,
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                borderRadius: 4,
                                color: '#64748b',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              セリフ消去
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const defaultList = [
                                  '土地込み4,500万円は厳しいよね…あ、この3Dシミュレーター、自分で設計できるんだ',
                                  'この金額でガレージが建つなら、中古住宅でも全然アリじゃない？',
                                  '新築と同じ予算で、憧れの木造ガレージまで手に入るんだね',
                                  '見て、この変形した敷地の形に、数センチ単位でぴったり収まったよ',
                                  '雨の日でも濡れずに荷物が運べるなんて、本当に便利で助かるね',
                                  '新築じゃなくて大正解だったね。ガレージも庭も楽しめて、暮らしが豊かになったよ',
                                  '敷地の形に合わせて自分で描いたガレージ。これを選んで本当に良かった'
                                ];
                                handleUpdateDialogue(idx, defaultList[(story.episodeNum - 1) % defaultList.length]);
                              }}
                              title="標準セリフを復元"
                              style={{
                                padding: '4px 8px',
                                fontSize: 10.5,
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                borderRadius: 4,
                                color: '#2563eb',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              セリフ復元
                            </button>
                          )}
                        </div>

                        {/* 100%日本語・年代固定・8〜10秒尺最適化Tipsアコーディオン */}
                        {showDialogueTips && (
                          <div style={{
                            marginTop: 6,
                            padding: '8px 10px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: 6,
                            fontSize: 11,
                            color: '#1e3a8a',
                            lineHeight: 1.5
                          }}>
                            <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span>💡 100%日本語プロンプト＆年代固定＆Gemini（8〜10秒固定）仕様</span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                              <li><strong>Gemini 1生成＝約8〜10秒固定</strong>: GeminiチャットUIのVeo呼び出しは内部パラメータ固定（約8〜10秒/生成）のため、プロンプト内で「前半0〜4秒（アプローチ） ➔ 後半5〜9秒（見どころ・セリフ発話・余韻）」の2段階タイムライン演出を組み込み、間延びや破綻を防ぎます。</li>
                              <li><strong>3カット結合で約30秒の王道ショート</strong>: 各話の3カット（Scene 1: 全景 ＋ Scene 2: 木造 ＋ Scene 3: セリフ）をそのまま結合するだけで、YouTube Shorts / Instagram Reelsに最適な約24〜30秒動画が完成します。</li>
                              <li><strong>100%日本語指示＆年代固定</strong>: 英語プロンプトを完全廃止し、50代設定時は「50代の落ち着いた日本人夫婦（50代相応の大人の佇まい、自然な笑いジワ、白髪交じりのナチュラルな髪型、若作りではない実年齢50代の自然な風貌）」を自動付加して若返りを防止します。</li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* カット切り替えタブ */}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {[
                          { key: 'scene1', label: 'Scene 1: 外観・ドローン全景', role: '建築カメラマン/ドローン' },
                          { key: 'scene2', label: 'Scene 2: シャッター・木造現し', role: 'シネマグラファー/カラリスト' },
                          { key: 'scene3', label: 'Scene 3: 雨の日入庫・生活実感（セリフ）', role: 'ディレクター/役者セリフ' },
                          { key: 'all', label: '📋 全3カット一括', role: '結合マスター' }
                        ].map(tab => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setSelectedVeoCut(tab.key)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: 4,
                              fontSize: 10.5,
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              background: selectedVeoCut === tab.key ? '#2563eb' : '#e0e7ff',
                              color: selectedVeoCut === tab.key ? '#fff' : '#3730a3',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title={tab.role}
                          >
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 100%日本語プロンプト枠 */}
                  <div style={{
                    background: promptType === 'veo' ? '#0b1329' : '#0f172a',
                    color: promptType === 'veo' ? '#93c5fd' : '#94a3b8',
                    border: promptType === 'veo' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                    padding: '10px 12px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    marginBottom: 8,
                    maxHeight: 110,
                    overflowY: 'auto'
                  }}>
                    {(() => {
                      if (promptType === 'nano') return story.englishPrompt;
                      const cuts = generateVeo3CutPrompts(story.englishPrompt, story.title, story.episodeNum, { dialogue: story.dialogue, protagonist: story.protagonist || customProtagonist });
                      if (selectedVeoCut === 'scene1') return `【Scene 1 / 建築全景】${story.veoPromptScene1 || cuts.scene1}`;
                      if (selectedVeoCut === 'scene2') return `【Scene 2 / 木造美】${story.veoPromptScene2 || cuts.scene2}`;
                      if (selectedVeoCut === 'scene3') return `【Scene 3 / 生活実感・セリフ】${story.veoPromptScene3 || cuts.scene3}`;
                      return `【Scene 1】\n${story.veoPromptScene1 || cuts.scene1}\n\n【Scene 2】\n${story.veoPromptScene2 || cuts.scene2}\n\n【Scene 3】\n${story.veoPromptScene3 || cuts.scene3}`;
                    })()}
                  </div>

                  {/* Veo 3 制作連携ガイダンス */}
                  {promptType === 'veo' && (
                    <div style={{ fontSize: 10.5, color: '#3b82f6', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>🎬</span>
                      <span>Google Gemini / Veo 3 にこのまま日本語で入力できます。1話あたり3カット（Scene 3は年代固定＆日本語台詞指定済）を生成します</span>
                    </div>
                  )}

                  {/* メディアスロット（動画枠 ＆ 画像枠のハイブリッド2列 + Google Drive共有連携） */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 12
                  }}>
                    {/* ① 動画スロット（リール・カルーセル1枚目用） */}
                    {(() => {
                      const videoFileName = generateAssetFileName(story, 'video', promptType === 'veo' ? selectedVeoCut : 'master');
                      const videoAutoInfo = getAutoDetectedAssetInfo(story, 'video', promptType === 'veo' ? selectedVeoCut : 'master');
                      const videoCopyKey = `fname_video_${story.id}_${selectedVeoCut}`;

                      return (
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            handleVideoFile(file, idx);
                          }}
                          style={{
                            border: isGoogleDriveUrl(story.videoUrl) ? '2px solid #3b82f6' : '2px dashed #93c5fd',
                            borderRadius: 8,
                            padding: 10,
                            textAlign: 'center',
                            background: story.videoUrl ? '#f0f9ff' : '#f8fafc',
                            position: 'relative',
                            minHeight: 155,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {/* スロットヘッダー（アセット自動判定タグ ＆ Drive検索） */}
                          <div style={{
                            position: 'absolute',
                            top: 6,
                            left: 8,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 4
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                                <Video size={11} />
                                <span>動画スロット</span>
                              </div>
                              <span style={{
                                background: videoAutoInfo.bg,
                                color: videoAutoInfo.color,
                                padding: '1px 6px',
                                borderRadius: 4,
                                fontSize: 9.5,
                                fontWeight: 800,
                                border: `1px solid ${videoAutoInfo.color}33`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2
                              }} title="ストーリーと選択中カットから自動判定">
                                <Tag size={9} />
                                <span>{videoAutoInfo.label}</span>
                              </span>
                              {isGoogleDriveUrl(story.videoUrl) && (
                                <span style={{ background: '#2563eb', color: '#fff', padding: '1px 5px', borderRadius: 3, fontSize: 9 }}>
                                  ☁️ Drive共有
                                </span>
                              )}
                            </div>

                            <a
                              href={getGoogleDriveSearchUrl(`第${story.episodeNum}話`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: 10,
                                color: '#64748b',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                                background: '#f1f5f9',
                                padding: '1px 5px',
                                borderRadius: 3
                              }}
                              title="Google Drive内でこの話の動画・画像を検索"
                            >
                              <Search size={10} />
                              <span>Drive検索</span>
                            </a>
                          </div>

                          {story.videoUrl ? (
                            <div style={{ width: '100%', marginTop: 24 }}>
                              {isGoogleDriveUrl(story.videoUrl) ? (
                                <iframe
                                  src={getGoogleDrivePreviewUrl(story.videoUrl)}
                                  style={{
                                    width: '100%',
                                    height: 140,
                                    borderRadius: 6,
                                    border: '1px solid #bfdbfe',
                                    background: '#000'
                                  }}
                                  allow="autoplay"
                                  title={`第${story.episodeNum}話 Google Drive動画`}
                                />
                              ) : (
                                <video
                                  src={story.videoUrl}
                                  controls
                                  muted
                                  loop
                                  style={{
                                    width: '100%',
                                    maxHeight: 140,
                                    borderRadius: 6,
                                    background: '#000'
                                  }}
                                />
                              )}

                              <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                                {isGoogleDriveUrl(story.videoUrl) && (
                                  <a
                                    href={story.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      background: '#eff6ff',
                                      color: '#1d4ed8',
                                      border: '1px solid #bfdbfe',
                                      padding: '4px 7px',
                                      borderRadius: 4,
                                      fontSize: 10.5,
                                      fontWeight: 700,
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 3
                                    }}
                                  >
                                    <FolderOpen size={11} />
                                    <span>Drive</span>
                                    <ExternalLink size={9} />
                                  </a>
                                )}
                                <a
                                  href={isGoogleDriveUrl(story.videoUrl) ? getGoogleDriveDownloadUrl(story.videoUrl) : story.videoUrl}
                                  download={videoFileName}
                                  target={isGoogleDriveUrl(story.videoUrl) ? '_blank' : undefined}
                                  rel="noopener noreferrer"
                                  style={{
                                    background: '#2563eb',
                                    color: '#fff',
                                    padding: '4px 9px',
                                    borderRadius: 4,
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3
                                  }}
                                  title={`ダウンロード名: ${videoFileName}`}
                                >
                                  <Download size={11} />
                                  <span>DL</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(videoFileName, videoCopyKey)}
                                  style={{
                                    background: copiedKey === videoCopyKey ? '#10b981' : '#f8fafc',
                                    color: copiedKey === videoCopyKey ? '#fff' : '#475569',
                                    border: '1px solid #cbd5e1',
                                    padding: '4px 7px',
                                    borderRadius: 4,
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3
                                  }}
                                  title={`推奨ファイル名: ${videoFileName}`}
                                >
                                  {copiedKey === videoCopyKey ? <Check size={11} /> : <Copy size={11} />}
                                  <span>{copiedKey === videoCopyKey ? '名コピー済' : 'ファイル名'}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const updated = [...stories];
                                    updated[idx].videoUrl = null;
                                    setStories(updated);
                                  }}
                                  style={{
                                    background: '#fee2e2',
                                    color: '#dc2626',
                                    border: 'none',
                                    padding: '4px 7px',
                                    borderRadius: 4,
                                    fontSize: 10.5,
                                    cursor: 'pointer'
                                  }}
                                  title="動画を解除"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ width: '100%', paddingTop: 20 }}>
                              <label style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                                <Film size={22} color="#3b82f6" style={{ marginBottom: 4 }} />
                                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1e40af' }}>
                                  🎥 動画をドロップ または クリック選択
                                </div>
                                <div style={{ fontSize: 9.5, color: '#64748b', marginTop: 2 }}>
                                  推奨名: <code style={{ color: '#2563eb' }}>{videoFileName}</code>
                                </div>
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleVideoFile(e.target.files?.[0], idx)}
                                  style={{ display: 'none' }}
                                />
                              </label>

                              {/* ファイル名コピー ＆ Drive登録フォーム */}
                              <div style={{ marginTop: 8, borderTop: '1px dashed #cbd5e1', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(videoFileName, videoCopyKey)}
                                    style={{
                                      background: copiedKey === videoCopyKey ? '#10b981' : '#f1f5f9',
                                      color: copiedKey === videoCopyKey ? '#fff' : '#475569',
                                      border: '1px solid #cbd5e1',
                                      padding: '2px 8px',
                                      borderRadius: 4,
                                      fontSize: 10,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 3
                                    }}
                                  >
                                    {copiedKey === videoCopyKey ? <Check size={10} /> : <Copy size={10} />}
                                    <span>{copiedKey === videoCopyKey ? '推奨名コピー済' : '📋 推奨ファイル名をコピー'}</span>
                                  </button>
                                </div>

                                {activeLinkInputKey === `${idx}_video` ? (
                                  <div style={{ display: 'flex', gap: 4, width: '100%' }}>
                                    <input
                                      type="text"
                                      placeholder="Google Driveの共有リンク (https://drive.google.com/file/d/...)"
                                      value={driveLinkInputs[`${idx}_video`] || ''}
                                      onChange={(e) => setDriveLinkInputs({ ...driveLinkInputs, [`${idx}_video`]: e.target.value })}
                                      style={{ flex: 1, fontSize: 10.5, padding: '3px 6px', borderRadius: 4, border: '1px solid #93c5fd' }}
                                      autoFocus
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRegisterDriveLink(idx, 'video')}
                                      style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 7px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                      登録
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setActiveLinkInputKey(null)}
                                      style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 4, padding: '3px 5px', fontSize: 10.5, cursor: 'pointer' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setActiveLinkInputKey(`${idx}_video`)}
                                    style={{
                                      background: '#eff6ff',
                                      color: '#1d4ed8',
                                      border: '1px solid #bfdbfe',
                                      borderRadius: 4,
                                      padding: '3px 8px',
                                      fontSize: 10,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <LinkIcon size={10} />
                                    <span>🔗 Google Drive共有リンクで登録</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* ② 静止画スロット（カルーセル2枚目・パース用） */}
                    {(() => {
                      const imageFileName = generateAssetFileName(story, 'image');
                      const imageAutoInfo = getAutoDetectedAssetInfo(story, 'image');
                      const imageCopyKey = `fname_image_${story.id}`;

                      return (
                        <div
                          onPaste={(e) => handlePasteImage(e, idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            handleImageFile(file, idx);
                          }}
                          style={{
                            border: isGoogleDriveUrl(story.imageUrl) ? '2px solid #059669' : '2px dashed #cbd5e1',
                            borderRadius: 8,
                            padding: 10,
                            textAlign: 'center',
                            background: story.imageUrl ? '#f8fafc' : '#f1f5f9',
                            position: 'relative',
                            minHeight: 155,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {/* スロットヘッダー（自動判定タグ ＆ Drive検索） */}
                          <div style={{
                            position: 'absolute',
                            top: 6,
                            left: 8,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 4
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(71, 85, 105, 0.1)', color: '#475569', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                                <ImageIcon size={11} />
                                <span>静止画枠</span>
                              </div>
                              <span style={{
                                background: imageAutoInfo.bg,
                                color: imageAutoInfo.color,
                                padding: '1px 6px',
                                borderRadius: 4,
                                fontSize: 9.5,
                                fontWeight: 800,
                                border: `1px solid ${imageAutoInfo.color}33`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2
                              }}>
                                <Tag size={9} />
                                <span>{imageAutoInfo.label}</span>
                              </span>
                              {isGoogleDriveUrl(story.imageUrl) && (
                                <span style={{ background: '#059669', color: '#fff', padding: '1px 5px', borderRadius: 3, fontSize: 9 }}>
                                  ☁️ Drive共有
                                </span>
                              )}
                            </div>

                            <a
                              href={getGoogleDriveSearchUrl(`第${story.episodeNum}話`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: 10,
                                color: '#64748b',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                                background: '#f8fafc',
                                padding: '1px 5px',
                                borderRadius: 3
                              }}
                              title="Google Drive内でこの話の素材を検索"
                            >
                              <Search size={10} />
                              <span>Drive検索</span>
                            </a>
                          </div>

                          {story.imageUrl ? (
                            <div style={{ width: '100%', marginTop: 24 }}>
                              {isGoogleDriveUrl(story.imageUrl) ? (
                                <img
                                  src={`https://drive.google.com/thumbnail?id=${extractGoogleDriveFileId(story.imageUrl)}&sz=w800`}
                                  alt={`第${story.episodeNum}話 イメージ`}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                  style={{
                                    width: '100%',
                                    maxHeight: 140,
                                    objectFit: 'cover',
                                    borderRadius: 6,
                                    border: '1px solid #a7f3d0'
                                  }}
                                />
                              ) : (
                                <img
                                  src={story.imageUrl}
                                  alt={`第${story.episodeNum}話 イメージ`}
                                  style={{
                                    width: '100%',
                                    maxHeight: 140,
                                    objectFit: 'cover',
                                    borderRadius: 6
                                  }}
                                />
                              )}

                              <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                                {isGoogleDriveUrl(story.imageUrl) && (
                                  <a
                                    href={story.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      background: '#f0fdf4',
                                      color: '#047857',
                                      border: '1px solid #a7f3d0',
                                      padding: '4px 7px',
                                      borderRadius: 4,
                                      fontSize: 10.5,
                                      fontWeight: 700,
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 3
                                    }}
                                  >
                                    <FolderOpen size={11} />
                                    <span>Drive</span>
                                    <ExternalLink size={9} />
                                  </a>
                                )}
                                <a
                                  href={isGoogleDriveUrl(story.imageUrl) ? getGoogleDriveDownloadUrl(story.imageUrl) : story.imageUrl}
                                  download={imageFileName}
                                  target={isGoogleDriveUrl(story.imageUrl) ? '_blank' : undefined}
                                  rel="noopener noreferrer"
                                  style={{
                                    background: '#475569',
                                    color: '#fff',
                                    padding: '4px 9px',
                                    borderRadius: 4,
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3
                                  }}
                                  title={`ダウンロード名: ${imageFileName}`}
                                >
                                  <Download size={11} />
                                  <span>DL</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(imageFileName, imageCopyKey)}
                                  style={{
                                    background: copiedKey === imageCopyKey ? '#10b981' : '#f8fafc',
                                    color: copiedKey === imageCopyKey ? '#fff' : '#475569',
                                    border: '1px solid #cbd5e1',
                                    padding: '4px 7px',
                                    borderRadius: 4,
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3
                                  }}
                                  title={`推奨ファイル名: ${imageFileName}`}
                                >
                                  {copiedKey === imageCopyKey ? <Check size={11} /> : <Copy size={11} />}
                                  <span>{copiedKey === imageCopyKey ? '名コピー済' : 'ファイル名'}</span>
                                </button>
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
                                    padding: '4px 7px',
                                    borderRadius: 4,
                                    fontSize: 10.5,
                                    cursor: 'pointer'
                                  }}
                                  title="画像を解除"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ width: '100%', paddingTop: 20 }}>
                              <label style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                                <ImageIcon size={22} color="#94a3b8" style={{ marginBottom: 4 }} />
                                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#475569' }}>
                                  🖼 画像をドロップ または Ctrl+V
                                </div>
                                <div style={{ fontSize: 9.5, color: '#64748b', marginTop: 2 }}>
                                  推奨名: <code style={{ color: '#059669' }}>{imageFileName}</code>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFile(e.target.files?.[0], idx)}
                                  style={{ display: 'none' }}
                                />
                              </label>

                              {/* ファイル名コピー ＆ Drive登録フォーム */}
                              <div style={{ marginTop: 8, borderTop: '1px dashed #cbd5e1', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(imageFileName, imageCopyKey)}
                                    style={{
                                      background: copiedKey === imageCopyKey ? '#10b981' : '#f1f5f9',
                                      color: copiedKey === imageCopyKey ? '#fff' : '#475569',
                                      border: '1px solid #cbd5e1',
                                      padding: '2px 8px',
                                      borderRadius: 4,
                                      fontSize: 10,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 3
                                    }}
                                  >
                                    {copiedKey === imageCopyKey ? <Check size={10} /> : <Copy size={10} />}
                                    <span>{copiedKey === imageCopyKey ? '推奨名コピー済' : '📋 推奨ファイル名をコピー'}</span>
                                  </button>
                                </div>

                                {activeLinkInputKey === `${idx}_image` ? (
                                  <div style={{ display: 'flex', gap: 4, width: '100%' }}>
                                    <input
                                      type="text"
                                      placeholder="Google Driveの共有リンク (https://drive.google.com/file/d/...)"
                                      value={driveLinkInputs[`${idx}_image`] || ''}
                                      onChange={(e) => setDriveLinkInputs({ ...driveLinkInputs, [`${idx}_image`]: e.target.value })}
                                      style={{ flex: 1, fontSize: 10.5, padding: '3px 6px', borderRadius: 4, border: '1px solid #a7f3d0' }}
                                      autoFocus
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRegisterDriveLink(idx, 'image')}
                                      style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 7px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                      登録
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setActiveLinkInputKey(null)}
                                      style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 4, padding: '3px 5px', fontSize: 10.5, cursor: 'pointer' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setActiveLinkInputKey(`${idx}_image`)}
                                    style={{
                                      background: '#f0fdf4',
                                      color: '#047857',
                                      border: '1px solid #a7f3d0',
                                      borderRadius: 4,
                                      padding: '3px 8px',
                                      fontSize: 10,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <LinkIcon size={10} />
                                    <span>🔗 Google Drive共有リンクで登録</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Instagram用 動画×画像ハイブリッド構成ガイド（Instagramタブ選択時） */}
              {activeStoryTab === 'instagram' && (
                <div style={{
                  background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
                  padding: '10px 18px',
                  borderTop: '1px solid #f0abfc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: '#c026d3', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                      エージェント推奨構成
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#86198f' }}>
                      【スライド1: 🎥動画】＋【スライド2: 🖼静止画】のカルーセル投稿
                    </span>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#a21caf' }}>
                    💡 Instagram投稿時に「複数選択」で動画と画像を選んで投稿すると、動画で指を止めさせ、スワイプで図面＆アンケートへ誘導できます！
                  </span>
                </div>
              )}

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
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
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
                      <a
                        href="https://business.facebook.com/latest/composer?locale=ja_JP"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#fff',
                          color: '#e1306c',
                          border: '1px solid #fbcfe8',
                          borderRadius: 6,
                          padding: '8px 12px',
                          fontSize: 12.5,
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                        title="Meta Business Suite（日本語）で日時指定予約投稿"
                      >
                        <Calendar size={13} />
                        <span>予約投稿（Meta Suite・日本語）</span>
                      </a>
                    </>
                  ) : activeStoryTab === 'youtube' ? (
                    <>
                      <button
                        onClick={() => copyToClipboard(formatYouTubeDescription(story), `yt_${story.id}`)}
                        style={{
                          background: copiedKey === `yt_${story.id}` ? '#10b981' : '#ef4444',
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
                        {copiedKey === `yt_${story.id}` ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedKey === `yt_${story.id}` ? 'YouTube概要欄をコピー済' : 'YouTube概要欄テキスト（Shorts・アンケート付）をコピー'}</span>
                      </button>
                      <a
                        href="https://studio.youtube.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#fff',
                          color: '#ef4444',
                          border: '1px solid #fecaca',
                          borderRadius: 6,
                          padding: '8px 12px',
                          fontSize: 12.5,
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>YouTube Studioを開く</span>
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
                        onClick={() => copyToClipboard(story.xPost || formatXPost(story), `x_${story.id}`)}
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
                        <span>{copiedKey === `x_${story.id}` ? 'Xポストをコピー済' : 'X (Twitter) ポスト（140文字仕様）をコピー'}</span>
                      </button>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(story.xPost || formatXPost(story))}`}
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

                {/* 投稿完了トグル（全4大SNS） */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer', color: '#ef4444', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={story.isPostedYouTube || false}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].isPostedYouTube = e.target.checked;
                        setStories(updated);
                      }}
                    />
                    <span>YouTube投稿済</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
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

              {/* ── 初心者向け：各SNSテキスト貼り付け先（ペースト場所）の完全手順ガイド ── */}
              
              {/* ① Instagram用ガイド */}
              {activeStoryTab === 'instagram' && (
                <div style={{
                  background: '#fdf4ff',
                  padding: '12px 20px',
                  borderTop: '1px solid #f0abfc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: 8,
                    padding: '10px 14px',
                    border: '1px solid #e879f9',
                    fontSize: 12,
                    color: '#4a044e',
                    lineHeight: 1.65
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ background: '#c026d3', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                        Instagram 貼り付け先
                      </span>
                      <strong style={{ color: '#86198f', fontSize: 12.5 }}>
                        📋 Instagramを開いた後の「テキスト貼り付け（ペースト）」場所と手順
                      </strong>
                    </div>
                    <ol style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                      <li>【<strong>Instagramを開く</strong>】ボタンを押してInstagramを開く ➡ 左メニューの【<strong>＋ 作成</strong>】をクリック。</li>
                      <li>ダウンロードした動画や画像をドラッグ＆ドロップ（※動画と画像の両方をカルーセル投稿する場合は、1枚目選択後に右下の「複数選択（重なった四角）」アイコンから追加）。</li>
                      <li>アスペクト比・フィルター画面で「<strong>次へ</strong>」を2回クリック。</li>
                      <li>
                        画面右側に表示される【<span style={{ background: '#fbcfe8', color: '#86198f', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>キャプションを入力...</span>】という大きな入力枠をクリックし、<br />
                        先ほどコピーした本文を貼り付け（キーボードの <kbd style={{ background: '#0f172a', color: '#fff', padding: '1px 5px', borderRadius: 3, fontSize: 11 }}>Ctrl + V</kbd> または右クリック貼り付け）します。
                      </li>
                      <li>右上の青い【<strong>シェア</strong>】ボタンを押せば投稿完了です！</li>
                    </ol>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#701a75' }}>
                    ⏰ <strong>予約投稿について:</strong> 上の【予約投稿（Meta Suite・日本語）】リンクから日時指定予約を行うか、またはスマホInstagramアプリの投稿最終画面最下部【詳細設定】➡【この投稿を日時指定】をONにするとアプリ単体で簡単に予約投稿が可能です。
                  </div>
                </div>
              )}

              {/* ② YouTube用ガイド */}
              {activeStoryTab === 'youtube' && (
                <div style={{
                  background: '#fef2f2',
                  padding: '12px 20px',
                  borderTop: '1px solid #fecaca',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: 8,
                    padding: '10px 14px',
                    border: '1px solid #f87171',
                    fontSize: 12,
                    color: '#7f1d1d',
                    lineHeight: 1.65
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ background: '#ef4444', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                        YouTube 貼り付け先
                      </span>
                      <strong style={{ color: '#b91c1c', fontSize: 12.5 }}>
                        📋 YouTube Studioを開いた後の「動画アップロード ＆ 概要欄貼り付け」場所と手順
                      </strong>
                    </div>
                    <ol style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                      <li>【<strong>YouTube Studioを開く</strong>】ボタンを押す ➡ 画面右上の【<strong>＋ 作成</strong>】アイコン ➡【<strong>動画をアップロード</strong>】をクリック。</li>
                      <li>作成・ダウンロードした動画ファイル（MP4）を画面中央にドラッグ＆ドロップします。</li>
                      <li>
                        【<strong>タイトル（必須）</strong>】枠に、エピソードタイトル（例: <span style={{ background: '#fee2e2', color: '#991b1b', padding: '1px 5px', borderRadius: 3 }}>第{story.episodeNum}話：{story.title}</span>）を入力。
                      </li>
                      <li>
                        その下の【<span style={{ background: '#fee2e2', color: '#991b1b', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>説明</span>】という大きな枠をクリックし、<br />
                        先ほどコピーしたYouTube概要欄テキストを貼り付け（キーボードの <kbd style={{ background: '#0f172a', color: '#fff', padding: '1px 5px', borderRadius: 3, fontSize: 11 }}>Ctrl + V</kbd> または右クリック貼り付け）します。
                      </li>
                      <li>【<strong>サムネイル</strong>】で静止画パース画像を選択（または動画から自動生成された好みのコマを選択）。</li>
                      <li>「次へ」を何度か押し、最後の【<strong>公開設定</strong>】で「公開」または「スケジュール設定（日時指定予約）」を選んで右下の【<strong>保存 / 公開</strong>】をクリックで完了！</li>
                    </ol>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#991b1b' }}>
                    💡 <strong>Shorts動画の自動認識:</strong> 縦型（9:16）または60秒以内の動画はYouTube Shortsとして自動公開され、通常の何倍もの拡散・再生回数が見込めます！概要欄の3D答え合わせリンク（smile049.jp/simulator）から読者が直接流入します。
                  </div>
                </div>
              )}

              {/* ③ note用ガイド */}
              {activeStoryTab === 'note' && (
                <div style={{
                  background: '#f0fdf4',
                  padding: '12px 20px',
                  borderTop: '1px solid #bbf7d0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: 8,
                    padding: '10px 14px',
                    border: '1px solid #4ade80',
                    fontSize: 12,
                    color: '#14532d',
                    lineHeight: 1.65
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ background: '#10b981', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                        note 貼り付け先
                      </span>
                      <strong style={{ color: '#166534', fontSize: 12.5 }}>
                        📋 note新規作成画面での「タイトル ＆ 本文貼り付け」場所と手順
                      </strong>
                    </div>
                    <ol style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                      <li>【<strong>note新規作成を開く</strong>】ボタンを押してnoteのエディタ画面を開きます。</li>
                      <li>
                        画面最上部の【<span style={{ background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>記事タイトル</span>】枠に、エピソードタイトル（例: <span style={{ background: '#dcfce7', color: '#166534', padding: '1px 5px', borderRadius: 3 }}>{story.title}</span>）を貼り付けます。
                      </li>
                      <li>
                        タイトル下の【<span style={{ background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>ここに文章を入力してください</span>】という大きな白い本文エリアをクリック。
                      </li>
                      <li>
                        先ほどコピーしたnote記事テキストをそのまま貼り付け（キーボードの <kbd style={{ background: '#0f172a', color: '#fff', padding: '1px 5px', borderRadius: 3, fontSize: 11 }}>Ctrl + V</kbd> または右クリック貼り付け）します。<br />
                        ※ 見出し・アンケートリスト・3D答え合わせリンクが自動で美しく整形されます。
                      </li>
                      <li>タイトルの上にある【<strong>＋ 見出し画像を追加</strong>】をクリックし、ダウンロードした静止画パースを選択して設定。</li>
                      <li>画面右上の緑色の【<strong>公開に進む</strong>】ボタンを押し、ハッシュタグを確認して【<strong>投稿する</strong>】をクリックで完了！</li>
                    </ol>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#15803d' }}>
                    💡 <strong>SEO・読者反応:</strong> noteはGoogle検索に非常に強く、「中古住宅 ガレージ」「変形地 ガレージ」で上位表示されます。アンケートの答え合わせリンクから3Dシミュレーターへダイレクトに送客されます。
                  </div>
                </div>
              )}

              {/* ④ X (旧Twitter)用ガイド */}
              {activeStoryTab === 'x' && (
                <div style={{
                  background: '#f8fafc',
                  padding: '12px 20px',
                  borderTop: '1px solid #cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: 8,
                    padding: '10px 14px',
                    border: '1px solid #94a3b8',
                    fontSize: 12,
                    color: '#0f172a',
                    lineHeight: 1.65
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ background: '#0f172a', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                        X (Twitter) 貼り付け先
                      </span>
                      <strong style={{ color: '#0f172a', fontSize: 12.5 }}>
                        📋 Xでの「ポスト作成 ＆ 画像・動画添付」場所と手順
                      </strong>
                    </div>
                    <ol style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                      <li>【<strong>Xでポストする</strong>】ボタンを押すと、投稿作成ウィンドウが開き、すでに文章が自動入力された状態になります。</li>
                      <li>
                        ※ もし文章が入っていない場合は、入力枠（「いまどうしてる？」）をクリックして <kbd style={{ background: '#0f172a', color: '#fff', padding: '1px 5px', borderRadius: 3, fontSize: 11 }}>Ctrl + V</kbd> で貼り付けてください。
                      </li>
                      <li>
                        入力枠の左下にある【<span style={{ background: '#e2e8f0', color: '#0f172a', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>🖼️ 写真・動画アイコン</span>】をクリックし、保存した動画（MP4）または静止画パースを選択して添付します。
                      </li>
                      <li>右下の青い【<strong>ポストする</strong>】ボタンを押せば投稿完了です！</li>
                    </ol>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#475569' }}>
                    💡 <strong>Xでの即効性 ＆ 140文字最適化:</strong> 全角140文字（半角280文字・URL23文字換算）以内で完全自動最適化成形されています。画面上で直接推敲・文字数確認も可能で、文字数エラーなくワンクリックでポストできます。画像や動画付きのポストはタイムラインで目を引き、3Dシミュレーターへのタップ誘導が極めて高くなります。
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 運用マニュアル ＆ アカウント開設キット 統合モーダル */}
      {showKitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            maxWidth: 880,
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            overflow: 'hidden'
          }}>
            {/* モーダルヘッダー */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0f172a',
              color: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Sparkles size={20} color="#80ed99" />
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                  Story Studio 運用ガイド ＆ 公式SNS完全キット
                </h4>
                <span style={{
                  fontSize: 11,
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontWeight: 700,
                  border: '1px solid rgba(56, 189, 248, 0.4)'
                }}>
                  v{APP_VERSION} 公式最新版
                </span>
              </div>
              <button
                onClick={() => setShowKitModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20, padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* モーダル内タブ切り替え */}
            <div style={{
              display: 'flex',
              background: '#1e293b',
              borderBottom: '1px solid #334155',
              padding: '0 24px'
            }}>
              <button
                onClick={() => setKitModalTab('manual')}
                style={{
                  padding: '12px 20px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: kitModalTab === 'manual' ? '3px solid #38bdf8' : '3px solid transparent',
                  color: kitModalTab === 'manual' ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s'
                }}
              >
                <BookOpen size={16} />
                <span>📖 運用手順・操作マニュアル（最新フロー v{APP_VERSION}）</span>
              </button>

              <button
                onClick={() => setKitModalTab('snsKit')}
                style={{
                  padding: '12px 20px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: kitModalTab === 'snsKit' ? '3px solid #80ed99' : '3px solid transparent',
                  color: kitModalTab === 'snsKit' ? '#80ed99' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s'
                }}
              >
                <ShieldCheck size={16} />
                <span>🛡️ 公式SNSアカウント開設キット・画像アセット</span>
              </button>
            </div>

            {/* モーダルコンテンツ */}
            <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* ── タブ1: 運用マニュアル ── */}
              {kitModalTab === 'manual' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  
                  {/* 全体モデルハイライト（ワンソース・マルチユース自動連鎖投稿構想） */}
                  <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    borderRadius: 12,
                    padding: '18px 20px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: '#2d6a4f', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                        ワンソース・マルチユース自動連鎖モデル
                      </span>
                      <strong style={{ fontSize: 14, color: '#166534' }}>
                        1つのマスター企画から全尺（90s〜15s）と全SNS（YouTube / Instagram / note / X）へ自動連鎖展開
                      </strong>
                    </div>
                    <p style={{ margin: 0, fontSize: 12.5, color: '#14532d', lineHeight: 1.65 }}>
                      ひとつの構想・物件（マスター企画）から、ゼロから別々にコンテンツを作るのではなく、<strong>「最長の構成を軸に引き算していく」</strong>ことで圧倒的な制作効率と世界観の統一を実現します。<br />
                      ・<strong>YouTube（30〜90秒動画 / Shorts）:</strong> Veo 3の3カットを結合した完成動画＋アンケート付き詳細概要欄<br />
                      ・<strong>note（記事＋パース画像）:</strong> 仕様解説＋読者参加型アンケート＋3Dシミュレーター答え合わせリンク<br />
                      ・<strong>Instagram（リール動画＋静止画カルーセル）:</strong> 動画で指を止めさせ、スワイプで図面＆アンケートへ誘導<br />
                      ・<strong>X（テキスト＋短縮リンク＋画像/動画）:</strong> 拡散性の高い問いかけで3D積算シミュレーターへ即座に誘導
                    </p>
                  </div>

                  {/* クリエイティブ制作スタジオ体制（3部門・7大スペシャリスト） */}
                  <div style={{ background: '#f5f3ff', borderRadius: 10, padding: 18, border: '1px solid #ddd6fe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 18 }}>🎬</span>
                      <h5 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: '#5b21b6' }}>
                        クリエイティブ制作スタジオ体制（3部門・7大スペシャリストの連携）
                      </h5>
                    </div>
                    <div style={{ fontSize: 12, color: '#4c1d95', lineHeight: 1.6, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                      <div style={{ background: '#fff', padding: 10, borderRadius: 6, border: '1px solid #e9d5ff' }}>
                        <strong style={{ color: '#6d28d9', display: 'block', marginBottom: 4 }}>① 企画・ディレクション部門</strong>
                        ・<strong>建築プロデューサー / CD:</strong> 建築意図・自然素材・機能美の世界観を統括<br />
                        ・<strong>映像ディレクター:</strong> 尺に合わせた見どころ絵コンテ設計<br />
                        ・<strong>シナリオライター:</strong> 「最初の3秒のフック」＆スペックを情緒体験へ翻訳
                      </div>
                      <div style={{ background: '#fff', padding: 10, borderRadius: 6, border: '1px solid #e9d5ff' }}>
                        <strong style={{ color: '#6d28d9', display: 'block', marginBottom: 4 }}>② 撮影部門</strong>
                        ・<strong>建築シネマグラファー:</strong> 歪みのないレンズ選定、自然光と間接照明の美しさ<br />
                        ・<strong>ドローンパイロット:</strong> 敷地全体の広がり、変形地境界、屋根形状を俯瞰撮影
                      </div>
                      <div style={{ background: '#fff', padding: 10, borderRadius: 6, border: '1px solid #e9d5ff' }}>
                        <strong style={{ color: '#6d28d9', display: 'block', marginBottom: 4 }}>③ 編集・ポストプロダクション部門</strong>
                        ・<strong>カラリスト:</strong> 木目の温もり、ガルバリウム鋼板の重厚感<br />
                        ・<strong>モーショングラフィックス:</strong> 無音視聴対応のフォント・テロップ<br />
                        ・<strong>サウンドデザイナー:</strong> 生活実感ある環境音（雨音・木肌の温もり。※高級路線NG）
                      </div>
                    </div>
                  </div>

                  {/* STEP 1: ストーリー作成 */}
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ background: '#0284c7', color: '#fff', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                        1
                      </div>
                      <h5 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0f172a' }}>
                        ストーリーを作成する（プリセット選択 or シナリオライター自由生成）
                      </h5>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, paddingLeft: 36 }}>
                      <div style={{ marginBottom: 8 }}>
                        <strong style={{ color: '#0f172a' }}>① プリセット選択タブ:</strong>
                        「中古住宅＋木造ガレージ（全7話・最重要推奨）」「子育て収納革命」「女性目線のガーデンシェッド」「狭小変形地ガレージ」の4大実戦テーマから選択し、ワンクリックで全話のプロット・アンケートを自動生成できます。
                      </div>
                      <div>
                        <strong style={{ color: '#0f172a' }}>② シナリオライター（自由生成）タブ:</strong>
                        ターゲット像（例: 新築予算で中古＋ガレージ層）、悩み、ガレージによる解決、住み手が手に入れる感情の変化（雨に濡れずに帰宅できる贅沢）、NGライン（高級路線NG）、尺（90s〜15s）を入力して【マスター企画＆Veo 3プロンプト一括生成】を実行します。
                      </div>
                    </div>
                  </div>

                    {/* STEP 2: 作画プロンプト ＆ 動画登録 ＆ Google Drive集約管理・自動フォルダ構築 */}
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ background: '#0284c7', color: '#fff', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                        2
                      </div>
                      <h5 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0f172a' }}>
                        Veo 3 動画 ＆ 静止画パース生成 ＆ Google Drive集約・フォルダ自動構築
                      </h5>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, paddingLeft: 36 }}>
                      各話ごとに「担当アカウント（Google AI Pro アカウント1〜5）」が割り当てられています。1アカウントあたり3つのシネマティックカット（Scene 1: 外観ドローン / Scene 2: 木造ディテール / Scene 3: 雨の日生活実感）が自動生成されます。
                      
                      <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: 6, border: '1px solid #bfdbfe', margin: '8px 0', fontSize: 12, color: '#1e40af' }}>
                        🎬 <strong>最大15動画アセットの組み合わせ連携:</strong> 5アカウントのメンバーが各3動画（計15動画）を分担生成し、それらを結合・編集することで、30秒〜90秒のハイクオリティなストーリー動画を共同で仕上げることができます。
                      </div>

                      {/* 🗣️ Veo 3 日本語台詞発話・英語化防止運用仕様 */}
                      <div style={{ background: '#f5f3ff', padding: '14px 16px', borderRadius: 8, border: '1.5px solid #8b5cf6', margin: '12px 0', fontSize: 12, color: '#5b21b6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 15 }}>🗣️</span>
                          <strong style={{ fontSize: 13, color: '#6d28d9' }}>
                            Veo 3 役者セリフを確実に日本語で喋らせる運用仕様（英語化防止）
                          </strong>
                        </div>
                        <div style={{ lineHeight: 1.7 }}>
                          Veo 3で英語プロンプトを用いて動画を生成する際、プロンプトのコンテキストに引きずられてセリフが英語（"Hello"等）になってしまう現象を防ぐため、以下の確定仕様がシステムに組み込まれています：<br />
                          1. <strong>言語明示・独立セクション化:</strong> プロンプト末尾に <code>Audio: Japanese spoken dialogue with authentic native Japanese accent...</code> を独立セクションとして配置。<br />
                          2. <strong>台詞の二重補強:</strong> <code>The character speaks fluent Japanese with precise natural lip-sync: 「〜」</code> により、英語への自動翻訳や発話ブレを完全防止。<br />
                          3. <strong>画面上で日本語セリフを自由編集:</strong> 各話カードの【🗣️ 役者セリフ】入力欄で台詞を編集するだけで、プロンプト内にリアルタイムで反映され、ワンクリックでコピーできます。<br />
                          4. <strong>非セリフシーンの英語混入防止:</strong> 外観や建具などセリフのないシーンでも <code>no English speech</code> を明示し、勝手な英語音声の生成を防ぎます。
                        </div>
                      </div>

                      {/* ① フォルダ階層全自動構築ツール（GAS）の解説 */}
                      <div style={{ background: '#ecfdf5', padding: '14px 16px', borderRadius: 8, border: '1.5px solid #10b981', margin: '12px 0', fontSize: 12, color: '#065f46' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 15 }}>⚡</span>
                          <strong style={{ fontSize: 13, color: '#047857' }}>
                            Google Drive フォルダ階層の全自動構築（手作業作成は一切不要！）
                          </strong>
                        </div>
                        <div style={{ lineHeight: 1.7 }}>
                          Google Drive内でフォルダを1つずつ手作業で作る必要はありません。<br />
                          1. 画面上部Google Driveバナーの【<strong style={{ color: '#059669' }}>⚡ フォルダ自動構築ツール</strong>】をクリック。<br />
                          2. 【<strong>📋 自動構築スクリプトをコピー</strong>】を押し、【<strong>🚀 Google Apps Script を開く</strong>】をクリック。<br />
                          3. 開いたエディタ画面にコードを貼り付け（<code>Ctrl + V</code>）て、画面上部の【<strong>▷ 実行</strong>】を押すだけ！<br />
                          <div style={{ background: '#fff', padding: '8px 12px', borderRadius: 6, border: '1px solid #a7f3d0', margin: '6px 0', fontSize: 11.5, color: '#047857' }}>
                            💡 <strong>【初回のみの確認画面が出た場合】:</strong><br />
                            「アクセスを承認」をクリック ➡ Googleアカウント（<code>049smile02@gmail.com</code>）を選択 ➡「詳細を表示」をクリック ➡「無題のプロジェクト（安全ではないページ）に移動」をクリック ➡「許可」を押せば実行されます。
                          </div>
                          <span style={{ fontSize: 12, color: '#047857', fontWeight: 800 }}>
                            ➡ たった10秒で、Google Driveのマイドライブ直下に「第1話〜第7話」「Scene 1〜3」「完成動画」「静止画」の全階層フォルダが完全自動生成されます。
                          </span>
                        </div>
                      </div>

                      {/* ② アセット自動判定 ＆ ファイル名統一 */}
                      <div style={{ background: '#fffbeb', padding: '14px 16px', borderRadius: 8, border: '1.5px solid #f59e0b', margin: '12px 0', fontSize: 12, color: '#92400e' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 15 }}>🏷️</span>
                          <strong style={{ fontSize: 13, color: '#b45309' }}>
                            「何の動画か」を自動判定 ＆ 推奨ファイル名ワンクリックコピー
                          </strong>
                        </div>
                        <div style={{ lineHeight: 1.7 }}>
                          ・<strong>自動判定タグ:</strong> 各話スロットの上部に「🏷️ 第1話 Scene 1: 外観ドローン全景」等のバッジが常時表示され、何の素材枠かが一目でわかります。<br />
                          ・<strong>推奨ファイル名コピー:</strong> スロット内の【<strong>📋 推奨ファイル名をコピー</strong>】を押すと、<code>smile049_ep01_scene1_外観ドローン全景.mp4</code> などの整理済みファイル名がコピーされます。Veo 3書き出し時やファイル名変更時にそのまま貼り付けてください。<br />
                          ・<strong>動画・画像DL時の自動反映:</strong> 画面上の【動画DL】【画像DL】ボタンを押した際も、この統一ファイル名が自動でセットされてPCに保存されます。<br />
                          ・<strong>Drive内ピンポイント検索:</strong> スロット右上の【<strong>🔍 Drive検索</strong>】を押すと、Google Drive内でその話数（例: 第1話）の素材だけが瞬時に絞り込み表示されます。
                        </div>
                      </div>

                      {/* ③ Google Drive集約管理の重要解説 ＆ リンク取得方法 */}
                      <div style={{ background: '#f0fdf4', padding: '14px 16px', borderRadius: 8, border: '1.5px solid #86efac', margin: '12px 0', fontSize: 12, color: '#166534' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 15 }}>📁</span>
                          <strong style={{ fontSize: 13, color: '#15803d' }}>
                            動画・画像の保存先：Google Drive集約管理（社内全PC・全スタッフで無制限共有）
                          </strong>
                        </div>
                        <div style={{ lineHeight: 1.7 }}>
                          ・<strong>サーバー容量の保護:</strong> 動画（数十MB〜数百MB）をWebサーバーに直接置くと容量が圧迫されます。またブラウザ一時記憶では別PCと共有できません。<br />
                          ・<strong>全社集約の仕組み:</strong> 作成した動画や画像は、マスターアカウント（<code>049smile02@gmail.com</code>）のGoogle Driveに保存してください。<br />
                          ・<strong>Google Drive共有リンクの取得と登録手順（初心者向け）:</strong><br />
                          <div style={{ background: '#fff', padding: '8px 12px', borderRadius: 6, border: '1px solid #bbf7d0', margin: '6px 0', fontSize: 11.5, color: '#14532d' }}>
                            1. Google Drive内の該当ファイルの上で「右クリック」 ➡【<strong>共有</strong>】➡【<strong>リンクをコピー</strong>】をクリック。<br />
                            （※「一般的なアクセス」が「リンクを知っている全員（閲覧者）」になっていることを確認してください）<br />
                            2. Story Studioの各話スロットの【<strong>🔗 Google Drive共有リンクで登録</strong>】欄に貼り付け（<code>Ctrl + V</code>）。<br />
                            ➡ これだけで、<strong>社内の全PCで動画がストリーミング再生され、誰でもダウンロード・流用</strong>できるようになります！
                          </div>
                        </div>
                      </div>

                      <ol style={{ margin: '6px 0 0', paddingLeft: 20 }}>
                        <li>カード内の【Scene 1〜3】または【全3カット一括コピー】ボタンで英語プロンプトをコピー。</li>
                        <li>Google AI Pro（VideoFX / NanoBanana2）の生成画面にプロンプトを貼り付けて動画・画像を生成。</li>
                        <li>生成した動画・画像を【📋 推奨ファイル名をコピー】でリネームし、Google Drive（<code>049smile02@gmail.com</code>）の該当フォルダにアップロード。</li>
                        <li>ファイルの「リンクをコピー」して、Story Studioの【🔗 Google Drive共有リンクで登録】に貼り付け（または直接ファイルをドロップ）。</li>
                      </ol>
                    </div>
                  </div>

                  {/* STEP 3: 配信予定日と特設ページ自動公開 */}
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ background: '#0284c7', color: '#fff', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                        3
                      </div>
                      <h5 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0f172a' }}>
                        配信予定日の設定とサイト内特設ページ（/stories）への自動連動
                      </h5>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, paddingLeft: 36 }}>
                      各話の「📅 配信予定日」カレンダーで公開日を設定できます。
                      <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
                        <li><strong>本日以前（過去または当日）:</strong> 特設連載ページ（<code>/stories</code>）で「公開中」として即座に閲覧可能になります。</li>
                        <li><strong>明日以降（未来の日付）:</strong> 「次回予告・○月○日公開予定」として自動カウントダウン表示され、次回のアクセスを期待させます。</li>
                        <li>画面上部の【🌐 サイト内連載ページ（/stories）を開く】から読者目線での見え方をいつでも確認できます。</li>
                      </ul>
                    </div>
                  </div>

                  {/* STEP 4: 読者アンケートと3D送客 */}
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ background: '#0284c7', color: '#fff', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                        4
                      </div>
                      <h5 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0f172a' }}>
                        読者参加型アンケート（価格予想＆希望価格リサーチ）の活用
                      </h5>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, paddingLeft: 36 }}>
                      各話には「このガレージ、いくらだと思いますか？（いくらなら欲しいですか？）」というアンケート設問と4つの選択肢が自動付与されます。
                      Webサイト上ではインタラクティブな投票機能が動き、投票後に「💡 3Dシミュレーターでリアルタイム積算見積もりの答え合わせをする」ボタンが表示され、高い送客率を実現します。
                    </div>
                  </div>

                  {/* STEP 5: 超親切！全SNS（Instagram / YouTube / note / X）への投稿手順ガイド */}
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, border: '2px solid #0284c7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ background: '#0284c7', color: '#fff', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                        5
                      </div>
                      <h5 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                        【初心者・未経験者専用】全SNS（Instagram / YouTube / note / X）投稿＆貼り付け手順完全ガイド
                      </h5>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.7, paddingLeft: 36 }}>
                      <p style={{ margin: '0 0 12px', color: '#0369a1', fontWeight: 600 }}>
                        ※ SNSをやったことがない方でも、以下のステップ通りに「コピー」して「貼り付け（Ctrl + V）」するだけで迷わず確実に投稿できます。
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* 1. Instagram */}
                        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid #f0abfc' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <span style={{ background: '#e1306c', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>1. Instagram</span>
                            <strong style={{ color: '#86198f', fontSize: 13 }}>リール動画 ＆ 画像カルーセル投稿</strong>
                          </div>
                          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#4a044e' }}>
                            <li>カードの【<strong>Instagram投稿テキストをコピー</strong>】をクリック。</li>
                            <li>【<strong>Instagramを開く</strong>】をクリック ➡ 画面左メニューの【<strong>＋ 作成</strong>】をクリック。</li>
                            <li>保存した動画（MP4）や画像をドラッグ＆ドロップ（※動画と画像の両方を投稿する場合は、1枚目選択後に右下の「複数選択」アイコンから追加）。</li>
                            <li>アスペクト比・フィルター画面で「<strong>次へ</strong>」を2回クリック。</li>
                            <li>画面右側の【<strong>キャプションを入力...</strong>】枠をクリックし、キーボードの <kbd style={{ background: '#0f172a', color: '#fff', padding: '1px 5px', borderRadius: 3 }}>Ctrl + V</kbd> で貼り付け。</li>
                            <li>右上の青い【<strong>シェア</strong>】ボタンを押せば完了！</li>
                          </ol>
                        </div>

                        {/* 2. YouTube */}
                        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid #fecaca' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <span style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>2. YouTube</span>
                            <strong style={{ color: '#b91c1c', fontSize: 13 }}>Shorts（30〜60秒）＆ 通常動画アップロード</strong>
                          </div>
                          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#7f1d1d' }}>
                            <li>カードの【<strong>YouTube概要欄テキストをコピー</strong>】をクリック。</li>
                            <li>【<strong>YouTube Studioを開く</strong>】をクリック ➡ 画面右上の【<strong>＋ 作成</strong>】➡【<strong>動画をアップロード</strong>】をクリック。</li>
                            <li>作成した動画ファイル（MP4）を画面中央へドラッグ＆ドロップ。</li>
                            <li>【<strong>タイトル（必須）</strong>】枠にエピソードタイトルを入力。</li>
                            <li>その下の【<strong>説明</strong>】枠をクリックし、キーボードの <kbd style={{ background: '#0f172a', color: '#fff', padding: '1px 5px', borderRadius: 3 }}>Ctrl + V</kbd> で概要欄を貼り付け。</li>
                            <li>【<strong>サムネイル</strong>】で静止画パースを選択。「次へ」を進んで公開設定で【<strong>公開</strong>】または【<strong>スケジュール設定（予約）</strong>】を選んで保存で完了！</li>
                          </ol>
                        </div>

                        {/* 3. note */}
                        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid #bbf7d0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <span style={{ background: '#10b981', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>3. note</span>
                            <strong style={{ color: '#166534', fontSize: 13 }}>連載記事 ＆ 見出し画像・アンケート投稿</strong>
                          </div>
                          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#14532d' }}>
                            <li>カードの【<strong>note記事テキストをコピー</strong>】をクリック。</li>
                            <li>【<strong>note新規作成を開く</strong>】をクリック。</li>
                            <li>最上部の【<strong>記事タイトル</strong>】枠にエピソードタイトルを貼り付け。</li>
                            <li>タイトル下の【<strong>ここに文章を入力してください</strong>】枠をクリックし、キーボードの <kbd style={{ background: '#0f172a', color: '#fff', padding: '1px 5px', borderRadius: 3 }}>Ctrl + V</kbd> で本文を貼り付け。</li>
                            <li>タイトル上の【<strong>＋ 見出し画像を追加</strong>】から静止画パースを設定。</li>
                            <li>右上の緑の【<strong>公開に進む</strong>】➡【<strong>投稿する</strong>】をクリックで完了！</li>
                          </ol>
                        </div>

                        {/* 4. X (Twitter) */}
                        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid #cbd5e1' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <span style={{ background: '#0f172a', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>4. X (旧Twitter)</span>
                            <strong style={{ color: '#0f172a', fontSize: 13 }}>要約テキスト ＆ メディア添付ポスト（140文字厳守仕様）</strong>
                          </div>
                          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#334155' }}>
                            <li>カードの【<strong>X (Twitter)用表示</strong>】タブで、リアルタイム文字数カウンターを確認しながら直接推敲可能（全角140文字・半角280文字・URL23文字換算）。</li>
                            <li>【<strong>Xでポストする</strong>】をクリック（140文字以内の文章が自動入力された投稿ウィンドウが開きます）。</li>
                            <li>入力枠左下の写真アイコン（🖼️）をクリックして動画または画像を添付。</li>
                            <li>右下の青い【<strong>ポストする</strong>】ボタンを押せば完了！</li>
                          </ol>
                        </div>
                      </div>

                      <div style={{ marginTop: 14, padding: 10, background: '#f0fdf4', borderRadius: 6, border: '1px solid #86efac', fontSize: 12, color: '#15803d', fontWeight: 700 }}>
                        ✓ 投稿が完了したSNSは、各エピソードカードの「[ ] 投稿済」チェックボックスをONにしておくことで、次回作業時にもどこまで進んだか一目で分かります。
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ── タブ2: SNS開設キット・画像アセット ── */}
              {kitModalTab === 'snsKit' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
              )}

            </div>

            {/* モーダルフッター */}
            <div style={{ padding: '12px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowKitModal(false)}
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 20px',
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

      {/* ── 📁 Google Drive（049smile02@gmail.com）素材集約管理モーダル ── */}
      {showDriveInfoModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            maxWidth: 680,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* モーダルヘッダー */}
            <div style={{
              padding: '16px 22px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
              color: '#fff',
              borderRadius: '12px 12px 0 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <HardDrive size={22} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  Google Drive 動画・画像マスター集約管理マニュアル
                </h3>
              </div>
              <button
                onClick={() => setShowDriveInfoModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  cursor: 'pointer',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* モーダル本文 */}
            <div style={{ padding: '22px', fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
              {/* 現状の保存先と集約の理由 */}
              <div style={{ background: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '12px 14px', borderRadius: 4, marginBottom: 18 }}>
                <strong style={{ color: '#92400e', display: 'block', marginBottom: 4, fontSize: 13.5 }}>
                  💡 現在の保存先と Google Drive 集約の重要性
                </strong>
                <p style={{ margin: 0, fontSize: 12, color: '#78350f' }}>
                  これまでは、作成した動画や画像は<strong>「お使いのパソコンのブラウザ内（一時記憶）」</strong>に保存されていました。そのため、<strong>「別のPCから見られない」「動画ファイルが重いとブラウザの容量上限（約5〜10MB）でエラーになる」</strong>という課題がありました。<br />
                  すべての動画・画像を <strong>Google Drive（049smile02@gmail.com）</strong> に保存・集約することで、<strong>サーバーやPCの容量を消費せず、社内のどのPC・どの担当者でも動画や画像を自由にプレビュー・流用・ダウンロード</strong>できるようになります！
                </p>
              </div>

              {/* Google アカウント情報 */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: 14, marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Key size={16} color="#2563eb" />
                  <span>Google Drive マスターアカウント情報</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                  <div style={{ background: '#fff', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>ログインメールアドレス</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <code style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>{GOOGLE_MASTER_INFO.email}</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(GOOGLE_MASTER_INFO.email, 'g_email')}
                        style={{ padding: '3px 8px', fontSize: 11, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 4, cursor: 'pointer' }}
                      >
                        {copiedKey === 'g_email' ? 'コピー済' : 'コピー'}
                      </button>
                    </div>
                  </div>

                  <div style={{ background: '#fff', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>ログインパスワード</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <code style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{GOOGLE_MASTER_INFO.password}</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(GOOGLE_MASTER_INFO.password, 'g_pass')}
                        style={{ padding: '3px 8px', fontSize: 11, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 4, cursor: 'pointer' }}
                      >
                        {copiedKey === 'g_pass' ? 'コピー済' : 'コピー'}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <a
                    href={GOOGLE_MASTER_INFO.accountChooserUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#2563eb',
                      color: '#fff',
                      padding: '8px 20px',
                      borderRadius: 6,
                      fontSize: 12.5,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <FolderOpen size={15} />
                    <span>このアカウントで Google Drive を開く</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* 3ステップ運用手順 */}
              <div style={{ marginBottom: 16 }}>
                <strong style={{ fontSize: 13.5, color: '#0f172a', display: 'block', marginBottom: 10 }}>
                  📋 誰でもできる！動画・画像の保存＆登録 3ステップ
                </strong>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li>
                    <strong>ステップ1: Google Driveにファイルを保存</strong><br />
                    上記ボタンからGoogle Driveを開き、Veo 3等で作成した動画や画像をドラッグ＆ドロップでアップロードします。
                  </li>
                  <li>
                    <strong>ステップ2: 共有リンクをコピー</strong><br />
                    アップロードしたファイルを右クリック ➡ <strong>「共有」</strong> ➡ <strong>「リンクをコピー」</strong> をクリックします。<br />
                    <span style={{ fontSize: 11, color: '#64748b' }}>※ 一般的なアクセスが「リンクを知っている全員」になっていることをご確認ください。</span>
                  </li>
                  <li>
                    <strong>ステップ3: Story Studioのスロットに登録</strong><br />
                    各話の動画スロットにある <strong>「🔗 Google Drive共有リンクで登録」</strong> をクリックし、コピーしたリンクを貼り付けて「登録」を押します。<br />
                    <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>
                      ➡ これだけで、社内のどのPCでも動画がプレビュー再生でき、ダウンロードしてSNSへ投稿できます！
                    </span>
                  </li>
                </ol>
              </div>

              {/* 推奨フォルダ構成 */}
              <div style={{ background: '#f1f5f9', padding: '12px 14px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                <strong style={{ color: '#334155', display: 'block', marginBottom: 4, fontSize: 12 }}>
                  📁 Google Drive内の推奨フォルダ構成（整理用）
                </strong>
                <pre style={{ margin: 0, fontSize: 11.5, fontFamily: 'monospace', color: '#475569', lineHeight: 1.5 }}>
{`📁 スマイチ_SNS共有素材（049smile02）
  ├── 📁 01_動画アセット（Veo3カット・完成動画）
  │    ├── ep1_外観ドローン_scene1.mp4
  │    ├── ep1_木造シャッター_scene2.mp4
  │    └── ep1_生活実感_scene3.mp4
  └── 📁 02_パース静止画（高画質AIパース）
       ├── ep1_パース1.png
       └── ep1_パース2.png`}
                </pre>
              </div>
            </div>

            {/* モーダルフッター */}
            <div style={{ padding: '12px 22px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', borderRadius: '0 0 12px 12px' }}>
              <button
                type="button"
                onClick={() => setShowDriveInfoModal(false)}
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                理解しました（閉じる）
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ⚡ Google Drive フォルダ階層全自動構築モーダル ── */}
      {showFolderBuildModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            maxWidth: 720,
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* モーダルヘッダー */}
            <div style={{
              padding: '16px 22px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff',
              borderRadius: '12px 12px 0 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={22} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  ⚡ Google Drive フォルダ階層 全自動構築ツール
                </h3>
              </div>
              <button
                onClick={() => setShowFolderBuildModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  cursor: 'pointer',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* モーダル本文 */}
            <div style={{ padding: '22px', fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
              {/* ガイダンスバナー */}
              <div style={{ background: '#ecfdf5', borderLeft: '4px solid #10b981', padding: '12px 14px', borderRadius: 4, marginBottom: 18 }}>
                <strong style={{ color: '#065f46', display: 'block', marginBottom: 4, fontSize: 13.5 }}>
                  🎯 現在のストーリー（全{stories.length}話）に完全一致したフォルダ構造を一瞬で自動生成！
                </strong>
                <p style={{ margin: 0, fontSize: 12, color: '#047857' }}>
                  手作業でフォルダを何十個も作る必要はありません。下記の<strong>Google Apps Script（自動作成コード）</strong>を実行するだけで、Google Drive（<code>049smile02@gmail.com</code>）の直下に、各話・各カット（Scene 1〜3・完成動画・静止画）の専用フォルダが一瞬で自動生成されます。
                </p>
              </div>

              {/* 3ステップ簡単操作ガイド */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: 14, marginBottom: 18 }}>
                <strong style={{ fontSize: 13.5, color: '#0f172a', display: 'block', marginBottom: 10 }}>
                  🚀 実行手順（たった3ステップ・約10秒で完了）
                </strong>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>
                    下の <strong>［📋 自動構築スクリプトをコピー］</strong> ボタンをクリックします。
                  </li>
                  <li>
                    <strong>［🚀 Google Apps Script を開く］</strong> ボタンをクリックして開きます。<br />
                    <span style={{ fontSize: 11, color: '#64748b' }}>※ ログイン画面が出た場合は <code>049smile02@gmail.com</code> でログインしてください。</span>
                  </li>
                  <li>
                    エディタ画面にコードを貼り付け（<code>Ctrl + V</code>）し、画面上部の <strong>［▷ 実行］</strong> ボタンを押すだけ！<br />
                    <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>
                      ➡ 初回のみ「アクセスを承認」が表示されます。「詳細」➡「移動」をクリックして許可すると、マイドライブに全フォルダが一瞬で完成します！
                    </span>
                  </li>
                </ol>

                <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generateGoogleAppsScriptForFolders(stories), 'gas_script')}
                    style={{
                      background: copiedKey === 'gas_script' ? '#10b981' : '#059669',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: 6,
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    {copiedKey === 'gas_script' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedKey === 'gas_script' ? 'スクリプトをコピー完了！' : '📋 自動構築スクリプトをコピー'}</span>
                  </button>

                  <a
                    href="https://script.google.com/home/start"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#fff',
                      color: '#059669',
                      border: '1.5px solid #059669',
                      padding: '7px 16px',
                      borderRadius: 6,
                      fontSize: 12.5,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>🚀 Google Apps Script を開く</span>
                  </a>
                </div>
              </div>

              {/* 自動構築されるフォルダツリー構造のプレビュー */}
              <div style={{ background: '#f1f5f9', padding: '12px 14px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
                <strong style={{ color: '#334155', display: 'block', marginBottom: 6, fontSize: 12 }}>
                  🌲 自動生成されるフォルダツリー階層（プレビュー）
                </strong>
                <pre style={{
                  margin: 0,
                  fontSize: 11.5,
                  fontFamily: 'monospace',
                  color: '#1e293b',
                  lineHeight: 1.6,
                  maxHeight: 180,
                  overflowY: 'auto',
                  background: '#fff',
                  padding: 10,
                  borderRadius: 4,
                  border: '1px solid #e2e8f0'
                }}>
{`📁 スマイチ_SNS共有素材（smile049）
  ├── 📁 00_共通_ロゴ・Canva・サムネイル素材
  ├── 📁 00_共通_BGM・環境音・効果音
` + stories.map(s => {
  const ep = String(s.episodeNum || 1).padStart(2, '0');
  const safeTitle = (s.title || `第${s.episodeNum}話`).replace(/[\/\\:*?"<>|]/g, '_').slice(0, 24);
  return `  ├── 📁 第${s.episodeNum}話_${safeTitle}
  │    ├── 📁 01_Veo3_Scene1_外観ドローン全景
  │    ├── 📁 02_Veo3_Scene2_木造シャッター
  │    ├── 📁 03_Veo3_Scene3_雨の日生活実感
  │    ├── 📁 04_完成マスター動画（30s-90s）
  │    └── 📁 05_AIパース静止画`;
}).join('\n')}
                </pre>
              </div>
            </div>

            {/* モーダルフッター */}
            <div style={{ padding: '12px 22px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', borderRadius: '0 0 12px 12px' }}>
              <button
                type="button"
                onClick={() => setShowFolderBuildModal(false)}
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 20px',
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
