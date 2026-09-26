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
    isPostedNote: false,
    isPostedX: false,
    // 28日後公開予定
    scheduledDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];

/**
 * 全ストーリーを取得（ローカルストレージ優先、なければデフォルト）
 */
export const getAllStories = () => {
  try {
    const saved = localStorage.getItem(STORY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load stories from localStorage:', e);
  }
  return DEFAULT_STORIES;
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
