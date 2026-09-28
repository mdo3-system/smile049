/**
 * 連載ストーリー（StoryStudio）データ管理サービス
 * 
 * サイト内特設ページ（/stories）およびStoryStudio管理画面でストーリーデータ・配信予定日を共有・制御します。
 */

export const STORY_STORAGE_KEY = 'smile049_story_studio_data_v2';

// 初回デフォルトストーリー（最重要テーマ：中古住宅＋木造ガレージ 全7話）
export const DEFAULT_STORIES = [
  {
    id: 'story_default_1',
    episodeNum: 1,
    phase: '【第1話：新築か中古か、2,000万円の分岐点】',
    title: '中古住宅＋木造ガレージで新築以上の暮らしを 〜住宅展示場を回り続けた末に気づいた、もうひとつの選択肢〜',
    plot: `山本恵子（42歳・共働き）は、週末のたびに住宅展示場を訪れていた。営業担当者に「土地込み4,500万円が標準ですよ」と言われるたびに、胸の奥で何かが引っかかる。「本当にこれしか選択肢はないのだろうか？」帰り道、スマホで「中古住宅 ガレージ 埼玉」と検索したその瞬間、木造自由設計ガレージ【スマイチ】のブラウザ3Dシミュレーターに出会った。`,
    assignedAccount: 'Google AI Pro アカウント 1',
    englishPrompt: '8k cinematic photograph, warm suburban Japanese family neighborhood at dusk, young Japanese family of four walking together, beautiful modern dark charcoal wooden garage attached to a renovated mid-century Japanese house, warm garden lights, hopeful atmosphere, photorealistic.',
    imageUrl: null,
    hashtags: '#スマイチ #中古住宅ガレージ #中古住宅リノベ #ガレージのある暮らし #木造ガレージ #自由設計 #変形地ガレージ #ガルバリウム外壁 #3Dシミュレーター #smile049',
    quizEnabled: true,
    quizQuestion: '中古住宅を買って木造ガレージを建てる場合、新築購入と比べて総額はどのくらい変わると思いますか？',
    quizOptions: [
      'A. 180万円〜220万円（駐車1台＋収納）',
      'B. 230万円〜270万円（駐車2台対応）',
      'C. 280万円〜320万円（ガレージ＋趣味スペース）',
      'D. 330万円以上（ガレージハウス仕様）'
    ],
    quizAnswerHint: '約248万円（3Dシミュレーター積算目安）',
    isPostedInstagram: true,
    isPostedYouTube: true,
    isPostedNote: true,
    isPostedX: true,
    // 過去日付にして第1話は即時公開
    scheduledDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'story_default_2',
    episodeNum: 2,
    phase: '【第2話：「ガレージが建てられる土地」から物件を探す逆転発想】',
    title: '中古住宅＋木造ガレージで新築以上の暮らしを 〜シミュレーターが教えてくれた、土地の見方が変わる瞬間〜',
    plot: `恵子はスマイチのシミュレーターで「幅5m×奥行き6m、台形地対応」のガレージを試作してみた。概算248万円。「この金額でガレージが建つなら、中古住宅でも全然アリじゃない？」物件探しの基準が変わった。不動産サイトで変形地や旗竿地の安い物件を見る目が、全く変わった。「ガレージが建てられるかどうか」で土地を選べばいい。`,
    assignedAccount: 'Google AI Pro アカウント 2',
    englishPrompt: '8k illustration style, split screen comparison, left side shows expensive new-build Japanese house, right side shows used Japanese house with beautiful custom wooden garage addition, family car parked inside, price difference highlighted, clean modern infographic style, photorealistic rendering.',
    imageUrl: null,
    hashtags: '#スマイチ #中古住宅ガレージ #土地探し #変形地 #木造ガレージ #自由設計 #smile049',
    quizEnabled: true,
    quizQuestion: '変形地や旗竿地などの残地に建てる木造ガレージ、既製品と比べてどのくらい自由が利くと思いますか？',
    quizOptions: [
      'A. 10cm単位で調整可能',
      'B. ミリ単位・台形・角度付きでジャストフィット',
      'C. 既製品と変わらない',
      'D. 屋根勾配・天井高・棚までミリ単位で自由自在'
    ],
    quizAnswerHint: '正解は B & D！ミリ単位で土地境界に合わせられます',
    isPostedInstagram: true,
    isPostedYouTube: false,
    isPostedNote: true,
    isPostedX: true,
    // 過去日付にして第2話も即時公開
    scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'story_default_3',
    episodeNum: 3,
    phase: '【第3話：中古3,800万円＋ガレージ300万円。新築4,500万円と「ほぼ同じ予算」でガレージ付きを選んだ夜】',
    title: '中古住宅＋木造ガレージで新築以上の暮らしを 〜同じお金を使うなら、ガレージも付いてくる選択がある〜',
    plot: `夜、ダイニングテーブルに向かい合って座った夫婦。スマイチのシミュレーターを開き、希望のガレージを3D設計する。概算建築費が画面に目安300万円と表示された。「中古住宅3,800万円＋リノベ300万円＋ガレージ300万円＋諸費用…合計でおよそ4,400万円。さっきまで考えていた新築4,500万円とほぼ同じ想定の中で、ガレージが入っている」。夜更けに笑い合った夫婦のその夜が、大きな決断の出発点になった。`,
    assignedAccount: 'Google AI Pro アカウント 3',
    englishPrompt: '8k intimate lifestyle photography, Japanese couple sitting at dining table at night, laptop screen showing 3D garage simulator with real-time price calculator, warm kitchen lighting, family planning atmosphere, notebooks and house listing papers on table, hopeful and decisive mood, photorealistic.',
    imageUrl: null,
    hashtags: '#スマイチ #予算計画 #マイホーム計画 #中古住宅 #木造ガレージ #見積もり #smile049',
    quizEnabled: true,
    quizQuestion: 'あなたの理想のガレージ、いくらの予算なら今すぐ建ててみたいですか？',
    quizOptions: [
      'A. 150万円〜200万円（コンパクト1台用）',
      'B. 220万円〜280万円（ゆったり1台＋棚・ワークスペース）',
      'C. 300万円〜380万円（車2台＋バイク・作業台）',
      'D. 400万円以上（本格ホビーピット・ロフト付き）'
    ],
    quizAnswerHint: '3Dシミュレーター上でいつでもリアルタイム積算中！',
    isPostedInstagram: false,
    isPostedYouTube: false,
    isPostedNote: false,
    isPostedX: false,
    // 本日公開
    scheduledDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'story_default_4',
    episodeNum: 4,
    phase: '【第4話：既存建物の外壁ラインに、数センチ単位で合わせるガレージ設計】',
    title: '中古住宅＋木造ガレージで新築以上の暮らしを 〜「規格品では無理」と言われた変形敷地に、ぴったり収まった木造の奇跡〜',
    plot: `購入した中古住宅の敷地は、南側が台形に斜めになっていた。不動産会社の担当者に「既製品の物置やガレージは入りませんよ」と言われていた部分だ。しかしスマイチの専任スタッフが現地測量を行い、既存外壁のラインに合わせ、その台形の角まで余すことなく使い切る木造ガレージを設計。数センチ単位の精度で、まるでそこに最初からあったかのように建物は収まった。`,
    assignedAccount: 'Google AI Pro アカウント 4',
    englishPrompt: '8k architectural photography, top-down aerial view of Japanese suburban house plot showing a perfectly fitted custom wooden garage built to match the irregular trapezoidal shape of the land, dark galvalume cladding, zero-eave design, fitting seamlessly between property boundaries, crisp sunlight, photorealistic.',
    imageUrl: null,
    hashtags: '#スマイチ #変形地設計 #台形地 #ガルバリウム #ミリ単位 #専任スタッフ #smile049',
    quizEnabled: true,
    quizQuestion: '敷地の角地が斜めになっている台形地、木造ならどのくらいスペースを有効活用できる？',
    quizOptions: [
      'A. 既製品と同じで角はデッドスペースになる',
      'B. 角度に合わせて壁を斜めに建てて100%使い切る',
      'C. 申請が通らないので諦める',
      'D. 専任スタッフが構造計算して限界まで広げる'
    ],
    quizAnswerHint: 'B & D！敷地境界に沿って壁を斜めに作れます',
    isPostedInstagram: false,
    isPostedYouTube: false,
    isPostedNote: false,
    isPostedX: false,
    // 7日後公開予定（次回予告）
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'story_default_5',
    episodeNum: 5,
    phase: '【第5話：月3万円の駐車場代がゼロになった日、7年で元が取れる試算】',
    title: '中古住宅＋木造ガレージで新築以上の暮らしを 〜ガレージを建てたことで、毎月の生活費が変わった〜',
    plot: `完成から3ヶ月。恵子の家計簿に「駐車場代 ¥0」と書かれた月が初めて訪れた。それまで月3万円、年間36万円を払い続けていた駐車場代が消えた。ガレージの建設費250万円を単純計算すると、約7年で元が取れる。しかし実際のメリットはそれだけではなかった。雨の日に車に乗り込む手間がなくなり、荷物の積み下ろしが楽になり、休日の家族の動き方そのものが変わっていた。`,
    assignedAccount: 'Google AI Pro アカウント 5',
    englishPrompt: '8k warm lifestyle photography, happy Japanese mother loading groceries from car directly into wooden garage attached to house on a rainy day, covered walkway, family dog sitting nearby, suburban garden background, sense of everyday comfort and convenience, photorealistic.',
    imageUrl: null,
    hashtags: '#スマイチ #駐車場代節約 #家計改善 #7年で回収 #生活の質向上 #smile049',
    quizEnabled: true,
    quizQuestion: '月3万円の駐車場代を払っている場合、250万円のガレージは何年で元が取れる？',
    quizOptions: [
      'A. 約5年',
      'B. 約7年（年間36万円節約）',
      'C. 約10年',
      'D. 雨の日の快適性を考えると実質初年度で価値あり'
    ],
    quizAnswerHint: 'B（計算上7年）＆ D（毎日の快適さはプライスレス）！',
    isPostedInstagram: false,
    isPostedYouTube: false,
    isPostedNote: false,
    isPostedX: false,
    // 14日後公開予定
    scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'story_default_6',
    episodeNum: 6,
    phase: '【第6話：「新築じゃなくてよかった」と思った瞬間】',
    title: '中古住宅＋木造ガレージで新築以上の暮らしを 〜1,750万円の差額で、暮らしはこんなに変わった〜',
    plot: `新築同期の友人宅を訪ねた恵子は、ふと感じた。お互いに4,000万円台の住宅ローンだと思っていたのに、自分の家にはガレージがあり、庭にはウッドデッキがあり、将来のリノベーション資金も手元に残っている。「中古住宅を選んで、ガレージを建てて、残った1,750万円で人生を豊かにする。これが令和の賢い家の作り方だったんだ」と、恵子は静かに確信した。`,
    assignedAccount: 'Google AI Pro アカウント 1',
    englishPrompt: '8k cinematic lifestyle photography, happy Japanese family evening scene outside their renovated house with custom wooden garage, string lights in garden, children playing, parents with coffee cups, warm golden hour light, sense of contentment and good life choices, photorealistic.',
    imageUrl: null,
    hashtags: '#スマイチ #賢い選択 #中古リノベ #ウッドデッキ #豊かな人生 #smile049',
    quizEnabled: true,
    quizQuestion: '浮いた予算（1,000万〜1,700万円）があったら、ガレージの次に何をしたいですか？',
    quizOptions: [
      'A. 庭に本格ウッドデッキやサウナを作る',
      'B. 愛車や大型バイクのカスタムに使う',
      'C. 将来の教育資金・投資に回す',
      'D. ガレージ内装をOSB合板やエアコン付きの秘密基地に仕上げる'
    ],
    quizAnswerHint: '木造なら内装DIYやエアコン設置も自由自在です',
    isPostedInstagram: false,
    isPostedYouTube: false,
    isPostedNote: false,
    isPostedX: false,
    // 21日後公開予定
    scheduledDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: 'story_default_7',
    episodeNum: 7,
    phase: '【第7話：この家を選んで良かった、ガレージを建てて正解だった】',
    title: '中古住宅＋木造ガレージで新築以上の暮らしを 〜中古住宅×木造ガレージという選択が、家族の未来を広げた〜',
    plot: `休日の朝、電動シャッターをゆっくり開けると、整然と並んだ家族の自転車と、愛車の濡れていないボディが迎えてくれる。恵子は振り返る——新築の展示場を回り続けた日々、シミュレーターで夜中に試算した夜、専任スタッフと敷地を測った日。「敷地の形に、数センチ単位で合わせてもらったガレージ。新築ではこうはいかなかった」。令和の豊かな暮らしは、中古住宅から始まった。`,
    assignedAccount: 'Google AI Pro アカウント 2',
    englishPrompt: '8k cinematic wide shot, sunrise morning scene of a beautiful renovated Japanese house with custom-built dark wooden garage, garage door slowly opening, silhouette of a family car inside, golden morning light, dew on the garden grass, peaceful suburban street, sense of a life well-chosen, photorealistic masterpiece.',
    imageUrl: null,
    hashtags: '#スマイチ #木造ガレージ #ガレージライフ #自由設計 #愛車のある暮らし #smile049',
    quizEnabled: true,
    quizQuestion: 'あなたもご自身の敷地に合わせたガレージ、3Dで試してみませんか？',
    quizOptions: [
      'A. 登録不要の3Dシミュレーターですぐ試してみる',
      'B. 概算見積もりをその場で確認する',
      'C. 無料パース作成を依頼してみる',
      'D. まずは相談チャットで専任スタッフに聞いてみる'
    ],
    quizAnswerHint: 'すべてWeb上で今すぐ無料・登録不要でお試しいただけます！',
    isPostedInstagram: false,
    isPostedYouTube: false,
    isPostedNote: false,
    isPostedX: false,
    // 28日後公開予定
    scheduledDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];

/**
 * Veo 3（Google AI Pro / VideoFX）用シネマティック4K動画生成プロンプト（単一・メインカット）
 */
export const generateVeoPrompt = (englishPrompt, title = '', episodeNum = 1) => {
  const cuts = generateVeo3CutPrompts(englishPrompt, title, episodeNum);
  return cuts.scene1;
};

/**
 * Veo 3（Google AI Pro / VideoFX）用 3カット連動・絵コンテプロンプト生成
 * 1アカウントあたり3つの異なるシネマティックカット（外観全景 / 開口木造ディテール / 生活実感雨の日）を生成
 */
export const generateVeo3CutPrompts = (englishPrompt, title = '', episodeNum = 1) => {
  let clean = (englishPrompt || '')
    .replace(/^8k (cinematic photograph|illustration style|intimate lifestyle photography|architectural photography|warm lifestyle photography|cinematic wide shot),?\s*/i, '')
    .replace(/photorealistic( rendering| masterpiece)?\.?/gi, '')
    .trim();

  // カット1: 外観・ドローン全景（建築カメラマン＆ドローンパイロット視点）
  const scene1Motions = [
    'Cinematic 4k 24fps smooth drone push-in tracking shot over Japanese suburban neighborhood, revealing dark charcoal galvalume custom wooden garage attached to renovated house',
    'Cinematic 4k 24fps majestic low-angle wide tilt-up camera movement showing zero-eave roofline and timber structure fitting perfectly on lot',
    'Cinematic 4k 24fps slow orbiting panoramic crane shot around modern wooden garage at dusk twilight'
  ];
  const scene1 = `${scene1Motions[(episodeNum - 1) % scene1Motions.length]}, ${clean}, crisp architectural symmetry, realistic natural lighting, photorealistic 4k video.`;

  // カット2: シャッター開閉・木造現し構造（建築シネマグラファー＆カラリスト視点）
  const scene2Actions = [
    'Cinematic 4k 24fps eye-level dolly shot moving into garage interior, electric motorized roller shutter smoothly rising, warm LED strip lights illuminating exposed wooden rafters and OSB plywood workbench',
    'Cinematic 4k 24fps slow-motion tracking shot inside garage, warm wood grain textures, tool wall neatly organized, gentle golden light spilling across polished concrete floor',
    'Cinematic 4k 24fps panning shot across ceiling wooden timber trusses and dark metallic walls, modern high-end architectural finish'
  ];
  const scene2 = `${scene2Actions[(episodeNum - 1) % scene2Actions.length]}, authentic Japanese timber craftsmanship, realistic physics, 4k 24fps video.`;

  // カット3: 雨の日入庫・生活実感の豊かさ（映像ディレクター＆サウンドデザイナー視点）
  const scene3Lifestyles = [
    'Cinematic 4k 24fps slow dolly tracking shot on rainy evening, raindrops softly trickling off galvalume eaves, family car smoothly parking inside dry warm garage, family stepping out without getting wet, warm smiling faces',
    'Cinematic 4k 24fps heartwarming dusk lifestyle shot, Japanese couple admiring their organized garage space with steaming mugs of coffee, tranquil suburban rain outside',
    'Cinematic 4k 24fps uplifting morning shot, golden sunrise breaking through morning mist, electric shutter rolling open, family preparing bicycles and car for weekend outing'
  ];
  const scene3 = `${scene3Lifestyles[(episodeNum - 1) % scene3Lifestyles.length]}, cozy heartfelt atmosphere, no luxury exaggeration, honest Japanese suburban lifestyle, photorealistic 4k.`;

  return { scene1, scene2, scene3 };
};

/**
 * X（旧Twitter）仕様の文字数カウント関数
 * - 全角文字（日本語、漢字、ひらがな、カタカナ、全角記号、絵文字など）: 1文字 = 1カウント (上限140)
 * - 半角英数、半角記号、半角スペース、改行: 1文字 = 0.5カウント (上限140、半角換算280)
 * - URL (http:// または https://): 長さに関わらず一律 23半角文字 = 11.5文字分カウント (X公式 t.co 仕様)
 */
export const calculateXPostLength = (text) => {
  if (!text) return 0;
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urlMatches = text.match(urlRegex) || [];
  let remainingText = text.replace(urlRegex, '');
  
  let halfWidthCount = urlMatches.length * 23;
  for (let i = 0; i < remainingText.length; i++) {
    const code = remainingText.charCodeAt(i);
    if ((code >= 0x0000 && code <= 0x007f) || (code >= 0xff61 && code <= 0xff9f)) {
      halfWidthCount += 1;
    } else {
      halfWidthCount += 2;
    }
  }
  return Math.ceil(halfWidthCount / 2);
};

/**
 * X（旧Twitter）用ポスト成形（140文字厳守・尺引き算アプローチ）
 * 全角140文字（加重280）以内にフック、要約、アンケート、3D答え合わせリンク、ハッシュタグを確実に収めます。
 */
export const formatXPost = (story) => {
  if (!story) return '';
  const epNum = story.episodeNum || 1;
  const header = `【木造ガレージ連載 第${epNum}話】\n`;
  
  // サブタイトルや冗長修飾をスマートに整理
  let cleanTitle = (story.title || '')
    .replace(/^中古住宅＋木造ガレージで新築以上の暮らしを\s*〜?/, '')
    .replace(/^[〜～]\s*/, '')
    .replace(/\s*[〜～]$/, '')
    .replace(/[〜～].*?[〜～]/g, '')
    .replace(/【.*?】/g, '')
    .replace(/《.*?》/g, '')
    .trim();
  if (!cleanTitle) cleanTitle = (story.title || '').slice(0, 28);
  if (cleanTitle.length > 28) {
    cleanTitle = cleanTitle.slice(0, 26) + '…';
  }

  // クイズ/アンケート問いかけ（1行・要約）
  let quizLine = '';
  if (story.quizEnabled && story.quizQuestion) {
    let cleanQ = story.quizQuestion;
    if (cleanQ.includes('新築4,500万円と中古3,000万円') || cleanQ.includes('どのくらい変わると思いますか')) {
      cleanQ = '新築vs中古＋ガレージ、総額いくら変わる？';
    } else if (cleanQ.includes('変形地や旗竿地') || cleanQ.includes('どのくらい自由が利く')) {
      cleanQ = '変形地・旗竿地、木造なら既製品とどう違う？';
    } else if (cleanQ.includes('いくらの予算なら今すぐ建ててみたい')) {
      cleanQ = 'あなたの理想のガレージ、いくらなら建てたい？';
    } else if (cleanQ.includes('台形地') || cleanQ.includes('スペースを有効活用')) {
      cleanQ = '台形の敷地、木造ならどのくらい広く使える？';
    } else if (cleanQ.includes('駐車場代') || cleanQ.includes('何年でモト')) {
      cleanQ = '月3万の駐車場代、ガレージは何年で元が取れる？';
    } else if (cleanQ.includes('浮いた予算') || cleanQ.includes('次に何をしたい')) {
      cleanQ = '浮いた予算があったらガレージの次に何したい？';
    } else if (cleanQ.includes('3Dで試してみませんか')) {
      cleanQ = 'あなたの敷地ならいくら？3Dで試してみませんか？';
    } else if (cleanQ.includes('総額いくらだと思いますか') || cleanQ.includes('いくらなら買いたい')) {
      cleanQ = 'この木造ガレージ建築、総額いくらだと思う？';
    } else {
      cleanQ = cleanQ.trim();
      if (cleanQ.length > 28) {
        cleanQ = cleanQ.slice(0, 26) + '…？';
      }
    }
    quizLine = `💬 Q. ${cleanQ}\n`;
  }

  const ctaLine = `正解は3Dシミュレーターで即時積算中👇\n`;
  const url = `https://smile049.jp/simulator\n`;
  const tags = `#スマイチ #木造ガレージ`;

  let body = `${header}${cleanTitle}\n${quizLine ? quizLine + '\n' : '\n'}${ctaLine}${url}${tags}`;

  // 万が一140文字を超過している場合の自動短縮・調整
  if (calculateXPostLength(body) > 140 && quizLine) {
    quizLine = `💬 Q. いくらだと思う？\n`;
    body = `${header}${cleanTitle}\n${quizLine}\n${ctaLine}${url}${tags}`;
  }

  // それでも超える場合はタイトルを切り詰め
  while (calculateXPostLength(body) > 140 && cleanTitle.length > 8) {
    cleanTitle = cleanTitle.slice(0, -2) + '…';
    body = `${header}${cleanTitle}\n\n${ctaLine}${url}${tags}`;
  }

  return body;
};

/**
 * 全ストーリーを取得（ローカルストレージ優先、なければデフォルト）
 */
export const getAllStories = () => {
  try {
    const saved = localStorage.getItem(STORY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s, idx) => {
          const cuts = generateVeo3CutPrompts(s.englishPrompt, s.title, s.episodeNum || idx + 1);
          return {
            ...s,
            veoPrompt: s.veoPrompt || cuts.scene1,
            veoPromptScene1: cuts.scene1,
            veoPromptScene2: cuts.scene2,
            veoPromptScene3: cuts.scene3,
            xPost: s.xPost || formatXPost(s),
            isPostedYouTube: typeof s.isPostedYouTube === 'boolean' ? s.isPostedYouTube : false
          };
        });
      }
    }
  } catch (e) {
    console.error('Failed to load stories from localStorage:', e);
  }
  return DEFAULT_STORIES.map((s, idx) => {
    const cuts = generateVeo3CutPrompts(s.englishPrompt, s.title, s.episodeNum || idx + 1);
    return {
      ...s,
      veoPrompt: s.veoPrompt || cuts.scene1,
      veoPromptScene1: cuts.scene1,
      veoPromptScene2: cuts.scene2,
      veoPromptScene3: cuts.scene3,
      xPost: s.xPost || formatXPost(s),
      isPostedYouTube: typeof s.isPostedYouTube === 'boolean' ? s.isPostedYouTube : false
    };
  });
};

/**
 * ストーリーを保存
 */
export const saveAllStories = (stories) => {
  try {
    localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(stories));
    // カスタムイベントを発火して同一ブラウザ内の他のタブや画面を同期
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('smile049_stories_updated', { detail: stories }));
    }
    return true;
  } catch (e) {
    console.error('Failed to save stories to localStorage:', e);
    return false;
  }
};

/**
 * ストーリーが現在公開中かどうか判定（scheduledDate <= 今日）
 */
export const isStoryPublished = (story) => {
  if (!story?.scheduledDate) return true;
  const todayStr = new Date().toISOString().split('T')[0];
  return story.scheduledDate <= todayStr;
};

/**
 * 公開中のストーリー一覧を取得（配信順）
 */
export const getPublishedStories = () => {
  const all = getAllStories();
  return all.filter(isStoryPublished);
};

/**
 * 最新の公開エピソードを取得
 */
export const getLatestPublishedStory = () => {
  const published = getPublishedStories();
  if (published.length === 0) return getAllStories()[0];
  return published[published.length - 1];
};

/**
 * 次回公開予定（未公開の中で最も近い日付）のエピソードを取得
 */
export const getNextUpcomingStory = () => {
  const all = getAllStories();
  const upcoming = all.filter(s => !isStoryPublished(s));
  return upcoming[0] || null;
};

/**
 * Google Master（049smile02@gmail.com）共有管理情報
 */
export const GOOGLE_MASTER_INFO = {
  email: '049smile02@gmail.com',
  password: '@Smile2656',
  accountChooserUrl: 'https://accounts.google.com/AccountChooser?Email=049smile02@gmail.com&continue=https://drive.google.com/drive/my-drive',
  driveDirectUrl: 'https://drive.google.com/drive/my-drive'
};

/**
 * Google DriveのファイルIDを抽出
 * - https://drive.google.com/file/d/FILE_ID/view...
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export const extractGoogleDriveFileId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const matchPath = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchPath && matchPath[1]) return matchPath[1];
  const matchParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchParam && matchParam[1]) return matchParam[1];
  return null;
};

/**
 * Google Drive URLかどうか判定
 */
export const isGoogleDriveUrl = (url) => {
  return !!extractGoogleDriveFileId(url);
};

/**
 * Google Driveの埋め込みプレビュー用URLを生成
 */
export const getGoogleDrivePreviewUrl = (url) => {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Google Driveの直接ダウンロードURLを生成
 */
export const getGoogleDriveDownloadUrl = (url) => {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Google Drive 内の検索URLを生成
 */
export const getGoogleDriveSearchUrl = (keyword) => {
  const query = keyword ? `"${keyword}"` : 'smile049';
  return `https://drive.google.com/drive/search?q=${encodeURIComponent(query)}`;
};

/**
 * ストーリー情報から「何の動画・画像か」が直感的にわかるファイル名を自動生成
 */
export const generateAssetFileName = (story, assetType = 'video', cut = 'scene1') => {
  if (!story) return 'smile049_asset';
  const ep = String(story.episodeNum || 1).padStart(2, '0');
  
  if (assetType === 'video') {
    const cutMap = {
      scene1: 'scene1_外観ドローン全景',
      scene2: 'scene2_木造シャッター',
      scene3: 'scene3_雨の日生活実感',
      master: 'master_完成結合動画',
      all: 'cut_master'
    };
    const cutLabel = cutMap[cut] || cutMap.scene1;
    return `smile049_ep${ep}_${cutLabel}.mp4`;
  } else {
    return `smile049_ep${ep}_AIパース静止画.jpg`;
  }
};

/**
 * 自動判定アセット情報（バッジ表示用ラベル）
 */
export const getAutoDetectedAssetInfo = (story, assetType = 'video', cut = 'scene1') => {
  const ep = story?.episodeNum || 1;
  if (assetType === 'video') {
    const cutMap = {
      scene1: { label: `第${ep}話 Scene 1: 外観ドローン全景`, color: '#2563eb', bg: '#eff6ff' },
      scene2: { label: `第${ep}話 Scene 2: シャッター・木造現し`, color: '#7c3aed', bg: '#faf5ff' },
      scene3: { label: `第${ep}話 Scene 3: 雨の日入庫・生活実感`, color: '#059669', bg: '#f0fdf4' },
      all: { label: `第${ep}話 全3カット結合マスター`, color: '#d97706', bg: '#fffbeb' },
      master: { label: `第${ep}話 完成マスター動画`, color: '#ea580c', bg: '#fff7ed' }
    };
    return cutMap[cut] || cutMap.scene1;
  } else {
    return { label: `第${ep}話 AIパース高精細静止画`, color: '#0d9488', bg: '#f0fdfa' };
  }
};

/**
 * Google Apps Script（GAS）用 フォルダ構造全自動構築コードを動的に生成
 * Google Drive（049smile02@gmail.com）で実行すると、各話・各カットのフォルダが一瞬で自動生成される
 */
export const generateGoogleAppsScriptForFolders = (stories, rootFolderName = 'スマイチ_SNS共有素材（smile049）') => {
  const list = stories && stories.length > 0 ? stories : getAllStories();
  const folderData = list.map(s => {
    const ep = String(s.episodeNum || 1).padStart(2, '0');
    const safeTitle = (s.title || `第${s.episodeNum}話`).replace(/[\/\\:*?"<>|]/g, '_').slice(0, 30);
    return {
      folderName: `第${s.episodeNum}話_${safeTitle}`,
      epNum: ep,
      subFolders: [
        `01_Veo3_Scene1_外観ドローン全景`,
        `02_Veo3_Scene2_木造シャッター`,
        `03_Veo3_Scene3_雨の日生活実感`,
        `04_完成マスター動画（30s-90s）`,
        `05_AIパース静止画`
      ]
    };
  });

  return `/**
 * 【スマイチ公式】Google Drive フォルダ階層全自動構築スクリプト
 * 実行アカウント: 049smile02@gmail.com
 * 
 * 使い方:
 * 1. Google Drive (drive.google.com) を開きます。
 * 2. 左上「新規」➡「その他」➡「Google Apps Script」をクリック（または script.google.com を開く）
 * 3. このコードをそのまま貼り付けて、上部の「実行」ボタンを押します。
 * 4. 初回のみ「権限を確認」が出るので、許可（詳細 ➡ 移動）すると、マイドライブに全フォルダが自動作成されます！
 */
function createSmile049FolderStructure() {
  var rootName = "${rootFolderName}";
  var rootFolder;
  
  // 既存の同名フォルダを検索、無ければ新規作成
  var folders = DriveApp.getFoldersByName(rootName);
  if (folders.hasNext()) {
    rootFolder = folders.next();
    Logger.log("既存のルートフォルダを使用します: " + rootName);
  } else {
    rootFolder = DriveApp.createFolder(rootName);
    Logger.log("新規ルートフォルダを作成しました: " + rootName);
  }

  // 共通アセットフォルダ
  var commonFolders = ["00_共通_ロゴ・Canva・サムネイル素材", "00_共通_BGM・環境音・効果音"];
  for (var c = 0; c < commonFolders.length; c++) {
    var cName = commonFolders[c];
    if (!rootFolder.getFoldersByName(cName).hasNext()) {
      rootFolder.createFolder(cName);
    }
  }

  // ストーリー各話の階層データ
  var episodes = ${JSON.stringify(folderData, null, 2)};

  for (var i = 0; i < episodes.length; i++) {
    var ep = episodes[i];
    var epFolder;
    var epFolders = rootFolder.getFoldersByName(ep.folderName);
    if (epFolders.hasNext()) {
      epFolder = epFolders.next();
    } else {
      epFolder = rootFolder.createFolder(ep.folderName);
      Logger.log("話数フォルダ作成: " + ep.folderName);
    }

    // 各話のサブフォルダ（Scene 1〜3、完成動画、静止画）
    for (var j = 0; j < ep.subFolders.length; j++) {
      var subName = ep.subFolders[j];
      if (!epFolder.getFoldersByName(subName).hasNext()) {
        epFolder.createFolder(subName);
        Logger.log("  └ サブフォルダ作成: " + subName);
      }
    }
  }

  Logger.log("=========================================");
  Logger.log("全フォルダの自動構築が完了しました！");
  Logger.log("Google Driveを開いてご確認ください。");
  Logger.log("=========================================");
}
`;
};


