import React, { useState } from 'react';
import {
  Sparkles, Copy, Check, ExternalLink, ShieldCheck, AlertTriangle,
  Layers, Target, DollarSign, Image as ImageIcon, Video, Compass,
  TrendingUp, Users, Calendar, FileText, CheckCircle2, ChevronRight,
  Share2, ArrowRight, Eye, RefreshCw, Smartphone, Laptop,
  BookOpen, HelpCircle, X, Zap, AlignLeft
} from 'lucide-react';
import { InstagramIcon, XIcon } from './SnsIcons';

// 6大ターゲット別 Meta広告クリエイティブマスタ（短文・長文両対応）
const CREATIVE_PATTERNS = [
  {
    id: 'ad_a',
    pattern: 'PATTERN A（認知的不協和・問いかけ型）',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    title: '3,000万円超の新築を買って、高額ローンと冬の寒さに悩むのはもうやめませんか？',
    targetAudience: '配信推奨先: https://lp.smile049.jp/saishin',
    headline: '新築より約820万円安いのに新築より暖かい家。鳩山町2,180万円',
    images: [
      '案1-A: 物件前でスタッフが笑顔で立つ写真 ＋ 帯文字「3,000万円超の新築を買って冬の寒さと高額ローンに悩むのはもうやめませんか？」',
      '案1-B: 片流れ屋根に並んだ太陽光パネル写真 ＋ 帯文字「なぜ新築より約820万円安いのに新築より暖かい家ができるのか？」'
    ],
    url: 'https://lp.smile049.jp/saishin',
    textShort: `【鳩山町・周辺の50〜70代ご夫婦へ】
新築建売に3,500万円払う前に、ちょっと待ってください。
新築より約820万円安い「2,180万円」で、新築以上のあたたかさ（超高断熱＆大容量太陽光）を実現したリノベ住宅が完成しました。
建て替えのような「仮住まい探し・2回の引越し」も不要。今の家から1回引っ越すだけ。
▼1日2組限定・冬の快適体感会（無料ガイド進呈中）
https://lp.smile049.jp/saishin`,
    textLong: `【鳩山町および近隣にお住まいの50代・60代・70代のご夫婦へ】

3,000万円以上の新築建売を買って、高額なローンと冬の寒さに悩むのは、もうやめませんか？

「子どもも独立したし、これからは夫婦2人で暖かく穏やかに暮らしたい」
そう思って家を探すと、周辺の新築は3,000万円超。一見綺麗ですが、冬場は寒く、高騰する電気代に頭を悩ませる方が後を絶ちません。

実は、比企郡鳩山町に「2,180万円」でありながら、一般新築の性能をはるかに凌駕する超高断熱（HEAT20 G2超）＆電気代を極小化する創エネリノベーション住宅が完成しました。

なぜ、新築より約820万円も安いのに、新築以上の快適さが出せるのか？
秘密は「あえて築25年超の骨組みを活用し、建物評価0で固定資産税を節税。浮いた予算を『片流れ屋根への変更＋Qセルズ8.0kW太陽光（年間8,789kWh発電）』や『見えない配管・配線の全面新品交換』に集中投資したから」です。
さらに完成済み物件のため、建て替えのような「仮住まい探し」や「2回の引越し」の心労も一切ゼロ。カギを受け取って今の家から1回引っ越すだけで済みます。

「本当にエアコン1台で家じゅう暖かいの？」と疑問に思った方へ。
売り込みは一切ありません。まずは【1日2組限定・冬の快適体感会＆光熱費試算会】でご自身の体で確かめてみませんか？

▼ 詳細・体感会のご予約はこちら（無料ガイドブックも進呈中）
https://lp.smile049.jp/saishin`
  },
  {
    id: 'ad_b',
    pattern: 'PATTERN B（開発ストーリー・人間味型）',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/30',
    title: '子ども部屋のための広いだけの家は、もういりません',
    targetAudience: '配信推奨先: https://lp.smile049.jp/saishin',
    headline: '子ども部屋のための広いだけの家は、もういりません。夫婦2人の終の住処',
    images: [
      '画像素材: 代表者が現場で腕組み・笑顔で立つ写真 ＋ 帯文字「子ども部屋のための広いだけの家は、もういりません」'
    ],
    url: 'https://lp.smile049.jp/saishin',
    textShort: `【子ども部屋のための広いだけの家は、もういりません】
50代からの家選びで一番大切なのは、見た目ではなく「健康・お金のゆとり・将来の安心」。
表面的なリフォームではなく、屋根・太陽光8.0kW・見えない配管配線までフル更新。
仮住まいや2回引越しのストレスもゼロ。鳩山町で叶える、夫婦2人のあたたかい終の住処（2,180万円）。
▼写真・スペック詳細を見る
https://lp.smile049.jp/saishin`,
    textLong: `【子ども部屋のための広いだけの家は、もういりません】

初めまして。比企郡で住宅再生を手掛ける住ま居る／すまいる設計の代表です。

子育てを終え、人生の後半戦をご夫婦お二人で楽しもうとされている方に、どうしてもお伝えしたいことがあり投稿しました。

50代〜70代からの家選びで一番大切なのは、見た目の豪華さではなく「健康・お金のゆとり・将来の安心」だと私たちは考えています。

だからこそ、この家づくりでは表面だけのきれいなリフォームは一切やめました。
屋根を一度解体して片流れに変更し、Qセルズ8.0kW太陽光パネルを設置（年間8,789kWh発電・ほぼ自家消費を超える創エネ設計）。さらに、ご入居後に突発的な修繕費用がかからないよう、壁の裏にある電気配線や給水給湯配管まで全て新品に取り換えました。

さらに、自宅の建て替えで誰もが苦しむ「仮住まい探し」や「2回の引っ越し」の心労をゼロにし、カギを受け取って今の家から1回引っ越すだけで済むように完成させました。

「新築建売を買うより、なぜこの家が賢い選択なのか？」
ぜひ、比企郡鳩山町の現地で直接お確かめください。

▼ 写真・スペック詳細はこちら
https://lp.smile049.jp/saishin`
  },
  {
    id: 'ad_c',
    pattern: 'PATTERN C（創エネ・経済合理性型）',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    title: '電気代高騰の冬、エアコンを我慢して暮らすのはもう終わりにしませんか？',
    targetAudience: '配信推奨先: https://lp.smile049.jp/saishin',
    headline: 'エアコンを我慢しない冬へ。太陽光8.0kW搭載で光熱費の不安をゼロにする家',
    images: [
      '画像素材: 青空と片流れ屋根の太陽光パネル写真 ＋ 帯文字「電気代が上がっても暖房をつけっぱなしにできる家」'
    ],
    url: 'https://lp.smile049.jp/saishin',
    textShort: `【月々の電気代、もう心配しなくて大丈夫です】
電気代高騰の時代に、エアコンを我慢していませんか？
Qセルズ8.0kW太陽光パネル搭載（年間8,789kWh発電）で、電気代を極小化。
高断熱HEAT20 G2基準だから、真冬でも家じゅうポカポカ。
鳩山町 2,180万円。新築より安く手に入る「光熱費不安ゼロの暮らし」。
▼光熱費シミュレーションを見る
https://lp.smile049.jp/saishin`,
    textLong: `【電気代高騰の冬、エアコンを我慢して暮らすのはもう終わりにしませんか？】

「毎月の電気代明細を見るのが怖い…」
寒さを我慢して厚着をし、こたつから出られない生活を送っていませんか？

比企郡鳩山町に完成した「再進の家（2,180万円）」は、冬場の電気代不安からあなたを完全に解放します。

屋根いっぱいに搭載したQセルズ8.0kW太陽光発電が年間8,789kWhを発電。昼間の自家消費はもちろん、売電収入も含めて年間の光熱費負担をほぼ相殺できる創エネ仕様です。

さらに、屋根遮熱材「銀次郎」と超高断熱サッシによるHEAT20 G2クラスの魔法瓶構造だから、真冬でも家じゅうあたたか。

「電気代が上がっても、エアコンをつけっぱなしにできる贅沢」
ぜひ、鳩山町のモデルハウスで暖かさをご体感ください。

▼ 光熱費シミュレーション・詳細はこちら
https://lp.smile049.jp/saishin`
  },
  {
    id: 'ad_d',
    pattern: 'PATTERN D（構造オタク・理系納得型）',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    title: '表面だけ綺麗にしたリフォーム住宅を、買ってはいけない理由',
    targetAudience: '配信推奨先: https://lp.smile049.jp/saishin/technology',
    headline: '建築士と大工が挑んだ、木造フルスケルトン再生の全記録（施工写真公開）',
    images: [
      '画像素材: スケルトン金物写真（feat_01_skeleton.jpg）または銀次郎通気写真 ＋ 帯文字「骨組みから完全再生」「耐震金物・配管更新」'
    ],
    url: 'https://lp.smile049.jp/saishin/technology',
    textShort: `【見えない壁の裏まで、すべて新築以上に再生】
「中古リフォームは配管や耐震が心配…」という方へ。
木造構造計算と配管・電気配線の完全更新を施工写真つきで全公開。
建築士と大工が本気で造った、新築建売を凌駕する再生住宅（2,180万円）。
▼施工記録・解体写真を今すぐ見る
https://lp.smile049.jp/saishin/technology`,
    textLong: `【表面だけ綺麗にしたリフォーム住宅を、買ってはいけない理由】

壁紙やフローリングだけ新しくした中古住宅。
一見ピカピカに見えますが、壁の裏の配管は築30年のまま、耐震金物も入っていない家が世の中には溢れています。

私たちは、構造計算と施工を自社で行う建築士集団です。
だからこそ「再進の家」では、柱と梁だけを残すフルスケルトン解体を行い、以下の工事を徹底しました：

1. 耐震金物の新設・補強（現行基準同等の耐震性能）
2. 給水管・給湯管・電気配線の全撤去＆新品引き直し
3. 壁内結露を防ぐ通気層と屋根遮熱「銀次郎」の施工
4. 基礎外断熱による床下からの冷気完全遮断

「見えない部分にこそ、命とお金をかける」
その全施工プロセスを、写真付きで完全公開しています。

▼ 木造再生の全記録・技術詳細はこちら
https://lp.smile049.jp/saishin/technology`
  },
  {
    id: 'ad_e',
    pattern: 'PATTERN E（奥様共感・健康長寿型）',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    title: '朝、布団から出る時の足元の冷たさ…もう終わりにしませんか？',
    targetAudience: '配信推奨先: https://lp.smile049.jp/saishin',
    headline: '真冬でもスリッパなしで歩ける家。ヒートショックのない終の住処（鳩山町2,180万円）',
    images: [
      '画像素材: タカラスタンダードホーローキッチン写真 ＋ 帯文字「真冬でも家中暖かい」「油汚れも水拭きだけでピカピカ」'
    ],
    url: 'https://lp.smile049.jp/saishin',
    textShort: `【冬の朝、布団から出る時の足元の冷たさ…もう終わりにしませんか？】
エアコン1台で家じゅう暖かい超高断熱（HEAT20 G2）住宅が鳩山町に完成。
油汚れも水拭きでピカピカのタカラスタンダード高品位ホーロー水回り＆将来も安心の1階完結平屋ライク設計。
奥様の毎日を助ける「寒くない終の住処（2,180万円）」。
▼体感会のご予約・詳細はこちら
https://lp.smile049.jp/saishin`,
    textLong: `【「毎朝、寒さで目が覚める」「夜中のトイレで身震いする」とお悩みの奥様へ】

真冬の朝、靴下を探して布団から出る辛さや、寒い脱衣所でお風呂に入る時の心臓への負担…。
「昔の家だから仕方がない」と我慢していませんか？

日本の家で最も怖いのは、暖かいリビングと凍える脱衣所の温度差によって起きる「ヒートショック」です。

比企郡鳩山町に完成した「再進の家（2,180万円）」は、
エアコン1台をゆるやかにつけておくだけで、LDKだけでなく廊下・トイレ・脱衣所まで家中ぽかぽか。
真冬の明け方でも室温15℃を下回らない、魔法瓶のような超高断熱（HEAT20 G2）住宅です。

さらに、奥様の毎日を助ける安心設計：
✔ タカラスタンダード高品位ホーロー水回り（油汚れも水拭きだけでピカピカ）
✔ 1階だけで日常が完結する平屋ライク設計（将来も階段の上り下りゼロ）
✔ 大容量8.0kW太陽光発電（電気代高騰を気にせず暖房をつけっぱなしにできる）
✔ 今の家からの引越しは1回だけ（仮住まい探しや2回引越しの過酷な心労ゼロ）

「本当にエアコン1台で家じゅう暖かいの？」
売り込みは一切ありません。まずは【1日2組限定・冬の快適体感会】で、ご夫婦で温かい空気感を直接確かめてみませんか？

▼ 詳細・体感会のご予約はこちら（無料ガイドブックも進呈中）
https://lp.smile049.jp/saishin`
  },
  {
    id: 'ad_f',
    pattern: 'PATTERN F（都心二拠点・週末別邸型）★新機軸',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    title: '都心から約1時間。2,180万円で手に入る「維持費実質ゼロ」の週末別邸',
    targetAudience: '配信推奨エリア: 東京23区・武蔵野・さいたま市',
    headline: '都心から約1時間。軽井沢の1/3の価格で手に入る「維持費実質ゼロ」の週末別邸',
    images: [
      '画像素材: 青空と街並みのドローン動画スナップ ＋ 木天井LDK写真 ＋ 帯文字「都心から約1時間の週末別邸」「軽井沢より近くて暖かい家」'
    ],
    url: 'https://lp.smile049.jp/saishin',
    textShort: `【池袋から約50分。別荘より気軽な「埼玉・鳩山の週末別邸」】
軽井沢や那須は遠すぎる・除雪や草刈りが重い…とお悩みの都心シニアへ。
除雪なし・温泉やゴルフ場至近・エアコン1台で家中暖かい超高断熱リノベ。
「金曜の夜に来て、月曜の朝帰る」大人の週末二拠点生活（2,180万円）。
▼特製A4ガイドブック（Web即時閲覧／PDF）はこちら
https://lp.smile049.jp/saishin`,
    textLong: `【東京・都心近郊にお住まいの50代・60代・70代のご夫婦へ】

「週末くらい、人混みやコンクリートから離れて、土の匂いと澄んだ空気の中で過ごしたい」
そう思っても、軽井沢や那須は片道3時間。通うだけで疲れてしまい、冬の寒さや維持管理費に悩む方が少なくありません。

実は、練馬ICから車で約50分（池袋から東武東上線で約50分）の埼玉県鳩山町に、
夫婦ふたりの週末二拠点にちょうどいい【2,180万円の極暖プライベートヴィラ】が完成しました。

✔ 土地72坪（南東・南西角地）：小さな家庭菜園やガーデニング、木漏れ日のテラスを満喫
✔ 維持費ゼロ設計：Qセルズ大容量8.0kW太陽光が年間8,789kWh発電。不在時も電力を創出し、固定費の負担を極小化
✔ 日本一の酷暑の夏も、底冷えする真冬もエアコン1台：屋根遮熱「銀次郎」× HEAT20 G2超高断熱（冬の別荘の底冷え・凍結とは無縁）
✔ 完全フルスケルトン再生：水回り（タカラ高品位ホーロー）・見えない配管・電気配線まで完全新品

都心の狭いマンションに閉じこもる週末を卒業して、
「都心と自然を行き来する、豊かな大人の休日」を一歩踏み出しませんか？

売り込みは一切ありません。まずは現地で、澄み切った空気とエアコン1台の暖かさをご体感ください。

▼ 詳細・特製ガイドブック（PDF）はこちら
https://lp.smile049.jp/saishin`
  }
];

export default function SaishinAdsPortalPanel() {
  const [activeTab, setActiveTab] = useState('metaAds'); // 初期表示を最もよく使う'metaAds'に設定
  const [copiedKey, setCopiedKey] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [textModes, setTextModes] = useState({
    ad_a: 'short',
    ad_b: 'short',
    ad_c: 'short',
    ad_d: 'short',
    ad_e: 'short',
    ad_f: 'short'
  });

  const toggleTextMode = (adId, mode) => {
    setTextModes(prev => ({ ...prev, [adId]: mode }));
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-stone-900 text-stone-100 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>プロマーケター仕様 ｜ 再進の家 販売促進システム</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              再進の家 SNS ＆ Facebook広告運用ポータル
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Meta広告規定（住宅特別カテゴリ）完全準拠・ワンクリック短文/長文切替コピペ入稿・運用マニュアル完備
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition"
              title="このツールの目的、意図、Meta広告マネージャでの出稿方法、テキスト長文/短文の使い分けマニュアルを表示"
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 運用マニュアル・出稿ガイド</span>
            </button>
            <a
              href="https://business.facebook.com/latest/composer?locale=ja_JP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition"
            >
              <span>Meta広告マネージャ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="/saishin"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm border border-stone-700 flex items-center gap-2 transition"
            >
              <span>LP実機プレビュー</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-stone-800 scrollbar-none text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('strategy')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'strategy'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>① アカウント戦略 ＆ Meta規約対策</span>
          </button>

          <button
            onClick={() => setActiveTab('metaAds')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'metaAds'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>② Meta広告（FB/IG）即戦力クリエイティブ</span>
          </button>

          <button
            onClick={() => setActiveTab('snsPosts')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'snsPosts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>③ Instagram / Threads オーガニック投稿</span>
          </button>

          <button
            onClick={() => setActiveTab('aiPrompts')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'aiPrompts'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>④ AI動画・画像生成プロンプト（Veo 3）</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'budget'
                ? 'bg-stone-700 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>⑤ 広告予算・CPAシミュレーション</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: アカウント戦略 & Meta規約対策
        ========================================================================= */}
        {activeTab === 'strategy' && (
          <div className="space-y-6 animate-fade-in">
            {/* マーケターの結論：アカウントは分けるべきか？ */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    プロマーケター目線での回答：アカウントはスマイチと同じでいいか？
                  </h2>
                  <p className="text-amber-300 font-bold text-sm mt-1">
                    結論：親となる「Metaビジネスマネージャ（会社アカウント）」は同じでOK。ただし、配信面（Facebookページ名・Instagramアカウント名）は『再進の家』専用に分けるのが鉄則です。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">1</span>
                    <span>ペルソナと信頼性の不一致</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed text-xs">
                    スマイチ（smile049_garage）は「木造ガレージ・物置・男の趣味基地」。
                    50〜60代夫婦が「ガレージ屋さんのアカウント」から終の住処の広告を見ても、「専門住宅会社じゃないの？」と不信感を抱き、クリック率が激減します。
                  </p>
                </div>

                <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">2</span>
                    <span>Meta機械学習のデータ汚染防止</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed text-xs">
                    Meta広告のAIはアカウントに反応したユーザー層を学習します。ガレージ好き（バイク・車）と断熱リノベ住宅希望（シニア・健康重視）が同一アカウントに混ざると、AIが混乱し広告単価（CPM/CPC）が高騰します。
                  </p>
                </div>

                <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">3</span>
                    <span>Threadsのレコメンド最適化</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed text-xs">
                    Threadsはアカウントの投稿トピックの専門性をAIが解析し、関心のあるユーザーのおすすめ欄に配信します。テーマを「高性能住宅・終の住処・鳩山暮らし」に特化させることで爆発的な拡散を狙えます。
                  </p>
                </div>
              </div>

              {/* 推奨アカウント設計図 */}
              <div className="mt-6 p-5 bg-stone-900/80 rounded-2xl border border-stone-800">
                <div className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-3">
                  推奨するMetaアカウント連携マップ
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <div className="text-stone-400 text-[11px]">Meta ビジネスマネージャ</div>
                    <div className="font-bold text-white mt-0.5">株式会社 住ま居る</div>
                    <div className="text-[10px] text-stone-500 mt-1">※親会社としてクレカ決済・ピクセルを一元管理</div>
                  </div>
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <div className="text-blue-400 text-[11px]">新設 Facebookページ</div>
                    <div className="font-bold text-white mt-0.5">再進の家｜鳩山ニュータウン</div>
                    <div className="text-[10px] text-stone-500 mt-1">※50代・60代が最も信頼する広告表示名</div>
                  </div>
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <div className="text-pink-400 text-[11px]">新設 Instagramアカウント</div>
                    <div className="font-bold text-white mt-0.5">@saishin_no_ie</div>
                    <div className="text-[10px] text-stone-500 mt-1">※美しい自然・LDK動画・間取りパースを投稿</div>
                  </div>
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <div className="text-stone-300 text-[11px]">Threadsアカウント</div>
                    <div className="font-bold text-white mt-0.5">@saishin_no_ie</div>
                    <div className="text-[10px] text-stone-500 mt-1">※建築士と大工の現場リアル・本音を発信</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta広告（住宅カテゴリ）の特別規定と回避策 */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Facebook広告の住宅ポリシー（Special Ad Category）の厳格ルール
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-3">
                  <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl">
                    <div className="font-bold text-red-400 mb-1">✕ システム上での絞り込みが禁止される項目</div>
                    <ul className="list-disc list-inside space-y-1 text-stone-300 text-xs">
                      <li><strong>年齢の指定不可:</strong> 18歳〜65歳以上で強制固定（「50歳以上だけ」の設定は不可能）</li>
                      <li><strong>性別の指定不可:</strong> 男女一括配信のみ</li>
                      <li><strong>郵便番号の指定不可:</strong> 特定の町名ピン留めは不可（最低半径約24km以上）</li>
                      <li><strong>特定除外の禁止:</strong> 家族構成や所得による除外不可</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 text-xs text-stone-400">
                    <strong className="text-stone-200 block mb-1">誇大表現のNG基準：</strong>
                    「絶対に光熱費がタダ」「日本一の断熱」「震度7でも100%無傷」などの絶対的表現は広告審査落ちやアカウント停止の対象になります。
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl">
                    <div className="font-bold text-emerald-400 mb-1">◎ プロマーケターの勝てる対策（自己選定クリエイティブ）</div>
                    <p className="text-stone-300 text-xs leading-relaxed mb-2">
                      システムで年齢を絞れないなら、<strong>「画像とコピーでターゲット以外を自然に弾き、50代以上のご夫婦だけを惹きつける」</strong>のがMeta運用の正解です。
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-stone-300 text-xs">
                      <li>画像内の大見出しで<strong>「50代・60代からの住み替え」「子供が独立されたご夫婦へ」</strong>と明記</li>
                      <li>若い世代や単身者がクリックしないため、無駄なクリック課金（広告費の浪費）を完全に遮断</li>
                      <li>「ほぼ光熱費実質ゼロ」「HEAT20 G2実証データ」「売主直接販売」と論理的に表記</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: Meta広告（FB/IG）即戦力クリエイティブ
        ========================================================================= */}
        {activeTab === 'metaAds' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <h2 className="text-xl font-bold text-white mb-2">
                6大ターゲット別 Meta広告クリエイティブセット（コピペで即出稿可能）
              </h2>
              <p className="text-xs text-stone-400">
                ペルソナのインサイト（都心二拠点・経済性・ヒートショック・奥様共感・夫婦別室・理系構造）に特化した、高クリック率（CTR 2%以上目標）の原稿設計。
              </p>
            </div>

            {/* 6大クリエイティブカード（短文/長文切り替え・文字数・ワンクリックコピー対応） */}
            {CREATIVE_PATTERNS.map((p) => {
              const currentMode = textModes[p.id] || 'short';
              const textContent = currentMode === 'short' ? p.textShort : p.textLong;
              const charCount = textContent.length;

              return (
                <div key={p.id} className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {p.title}
                      </h3>
                    </div>
                    <span className="text-xs text-stone-400">配信推奨エリア: {p.targetArea}</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400 text-xs font-bold">メインテキスト (Primary Text):</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-900 border border-stone-800 text-amber-400 font-bold">
                            {charCount}文字
                          </span>
                        </div>

                        {/* 短文 / 長文 切り替えトグル */}
                        <div className="inline-flex rounded-xl bg-stone-900 p-0.5 border border-stone-800">
                          <button
                            type="button"
                            onClick={() => setTextModes((prev) => ({ ...prev, [p.id]: 'short' }))}
                            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center gap-1 ${
                              currentMode === 'short'
                                ? 'bg-amber-500 text-stone-950 shadow'
                                : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            <Zap className="w-3 h-3" />
                            ⚡ 短文(要約)
                          </button>
                          <button
                            type="button"
                            onClick={() => setTextModes((prev) => ({ ...prev, [p.id]: 'long' }))}
                            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center gap-1 ${
                              currentMode === 'long'
                                ? 'bg-amber-500 text-stone-950 shadow'
                                : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            <AlignLeft className="w-3 h-3" />
                            📖 長文(詳細)
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono min-h-[170px] max-h-[300px] overflow-y-auto">
                        {textContent}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleCopy(textContent, p.id)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition shadow"
                        >
                          {copiedKey === p.id ? <Check className="w-3.5 h-3.5 text-stone-950" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === p.id ? 'コピー完了！' : `${currentMode === 'short' ? '短文' : '長文'}本文をコピー`}</span>
                        </button>
                        <span className="text-[11px] text-stone-400">
                          ※Meta広告マネージャの「プライマリテキスト」にそのまま貼り付けられます
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-stone-400 text-xs font-bold block mb-1">見出し (Headline):</span>
                        <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-bold text-white text-xs">
                          {p.headline}
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-400 text-xs font-bold block mb-1">推奨クリエイティブ素材（{p.mediaType}）:</span>
                        <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-1.5">
                          <div>・<strong>画像素材:</strong> {p.mediaDesc}</div>
                          <div>・<strong>画像帯文字:</strong> {p.mediaText}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-400 text-xs font-bold block mb-1">リンク先URL (LPアドレス):</span>
                        <div className="flex items-center gap-2">
                          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-emerald-400 flex-1 truncate">
                            {p.url}
                          </div>
                          <button
                            onClick={() => handleCopy(p.url, `${p.id}_url`)}
                            className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition"
                            title="URLをコピー"
                          >
                            {copiedKey === `${p.id}_url` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* カルーセル広告用 5枚スライドコピーセット */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                    CAROUSEL SET（横スライド5枚ストーリー型）
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    見込み客自身に「この家が一番賢い選択だ」とストーリーで納得させるカルーセル広告
                  </h3>
                </div>
                <span className="text-xs text-stone-400">配信面: Facebook / Instagramフィード</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">1枚目（表紙）</span>
                  <div className="font-bold text-white">代表者笑顔写真 ＋ 建物</div>
                  <p className="text-amber-300 font-bold leading-relaxed text-[11px]">
                    「子ども部屋のための広いだけの家は、もういりません」<br />
                    夫婦2人にちょうどいい、新築以上の超高断熱リノベーション住宅
                  </p>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-bold">2枚目（屋根）</span>
                  <div className="font-bold text-white">片流れ屋根 ＋ Qセルズ8kW</div>
                  <p className="text-stone-300 leading-relaxed text-[11px]">
                    「屋根を壊してまで片流れにした理由」<br />
                    年間8,789kWh創エネで、電気代高騰時代でも固定費に怯えない暮らし
                  </p>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-bold">3枚目（配管）</span>
                  <div className="font-bold text-white">壁裏の配管・電気配線工事</div>
                  <p className="text-stone-300 leading-relaxed text-[11px]">
                    「見えない配管・配線まで全新品に交換！」<br />
                    表側だけ綺麗にする上辺リフォームはしない。将来の突発的修繕リスクをゼロへ
                  </p>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-bold">4枚目（設備）</span>
                  <div className="font-bold text-white">新品キッチン・浴室・2台駐車</div>
                  <p className="text-stone-300 leading-relaxed text-[11px]">
                    「水回り全新品＆車2台駐車」<br />
                    現行耐震適合。仮住まい不要・引越し1回のみ。50代〜70代のセカンドライフを豊かに
                  </p>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">5枚目（オファー）</span>
                  <div className="font-bold text-amber-400">ガイドブック表紙画像</div>
                  <p className="text-white font-bold leading-relaxed text-[11px]">
                    【完全予約制・無料進呈】<br />
                    『50代〜70代のための失敗しない家選びガイド』＆「エアコン1台で暖かい」現地体感会
                  </p>
                </div>
              </div>
            </div>

            {/* 神田流 画像内文字入れ全8パターン＆作成テクニック解説 */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
              <div className="pb-4 border-b border-stone-800">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-block mb-2">
                  EMOTIONAL COPY GUIDELINES（神田流エモーショナル・マーケティング）
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  広告臭いカタログ写真を排除し、タイムラインで指を止める画像内コピー全8パターン
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Facebookユーザーはプロのカタログ写真を瞬時に「売り込み」と判断してスルーします。生活感・現場のリアル・文字の力（座布団帯）で勝負します。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                {/* パターン 1: 1枚画像広告用 */}
                <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>【パターン1】1枚画像広告用：認知的不協和＆強烈な問いかけ</span>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-300">案1-A / 案1-B</span>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-2">
                    <strong className="text-white block">案1-A（問いかけ＆ギャップ訴求）：</strong>
                    <div className="text-stone-300 pl-2 border-l-2 border-amber-500 space-y-0.5">
                      <div>上部帯：【比企郡にお住まいの50代・60代・70代のご夫婦へ】</div>
                      <div className="text-amber-300 font-bold">メイン：3,000万円超の新築を買って 冬の寒さと高額ローンに悩むのは もうやめませんか？</div>
                      <div>サブ：2,180万円で叶える「HEAT20 G2超」の超高断熱×創エネ住宅</div>
                      <div className="text-red-400 font-bold">右下バッジ：【先着10名】エアコン1台で暖かい体感会 開催中</div>
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-2">
                    <strong className="text-white block">案1-B（比較・価格ギャップ訴求）：</strong>
                    <div className="text-stone-300 pl-2 border-l-2 border-amber-500 space-y-0.5">
                      <div className="text-amber-300 font-bold">メイン：なぜ新築より約820万円安いのに 新築より暖かい家ができるのか？</div>
                      <div>サブ：築25年超の建物評価0を活用＝固定資産税も劇的節税！ 浮いた予算を超高断熱とQセルズ8kWソーラーへ集中投資。</div>
                      <div>下部帯：2,180万円／鳩山ニュータウン内／見学予約受付中</div>
                    </div>
                  </div>
                </div>

                {/* パターン 3 & 4: 現場リアル対比 ＆ インフォグラフィック */}
                <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
                  <div className="font-bold text-emerald-400 flex items-center justify-between">
                    <span>【パターン3＆4】現場リアル対比 ＆ 図解インフォグラフィック</span>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-300">自己説得型</span>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-2">
                    <strong className="text-white block">パターン3（現場のリアル・誠実さ強調型）：</strong>
                    <p className="text-stone-400 text-[11px]">左:配管引き直し施工現場写真 ／ 右:完成後の新築同様美しいLDK写真</p>
                    <div className="text-stone-300 pl-2 border-l-2 border-emerald-500 space-y-0.5">
                      <div className="text-amber-300 font-bold">中央帯：「表面だけ綺麗にする『上辺リフォーム』は絶対にしません。」</div>
                      <div>補足：割高な新築建売を買わなくても、2,180万円で「新築以上の暖かさと安心」は手に入ります。壁の裏の配管・配線まで全面刷新済み！</div>
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-2">
                    <strong className="text-white block">パターン4（図解・インフォグラフィック型 比較画像）：</strong>
                    <div className="text-stone-300 pl-2 border-l-2 border-emerald-500 space-y-0.5">
                      <div className="text-white font-bold">タイトル：「どちらが、これからの暮らしに賢い選択ですか？」</div>
                      <div className="text-[11px] grid grid-cols-2 gap-2 mt-1">
                        <div className="text-stone-400">左: 新築建売 3,000万超／冬寒い／電気代直撃／税高額</div>
                        <div className="text-emerald-300 font-bold">右: 本物件 2,180万（820万得）／HEAT20 G2／Qセルズ8kW／税激減</div>
                      </div>
                      <div className="text-amber-300 font-bold mt-1">下部キャッチ：浮いた約820万円で、夫婦の老後資金・趣味・旅行にゆとりを。</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 画像作成テクニック3箇条 */}
              <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 text-xs">
                <div className="font-bold text-white mb-2">クリエイティブ作成時の3つの鉄則テクニック：</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-stone-300">
                  <div className="p-2.5 bg-stone-950 rounded-xl">
                    <strong className="text-amber-300 block mb-0.5">① 太めのゴシック体を使用</strong>
                    スマホ画面は小さいため、明朝体や細字はスルーされます。濃背景に白太文字、白背景に濃紺太文字で可読性を最大化。
                  </div>
                  <div className="p-2.5 bg-stone-950 rounded-xl">
                    <strong className="text-amber-300 block mb-0.5">② テキストの背景に「帯（座布団）」を敷く</strong>
                    写真の上に直文字を置くと同化します。黒・濃紺・赤・黄色の単色帯を敷いて文字を一目で読ませます。
                  </div>
                  <div className="p-2.5 bg-stone-950 rounded-xl">
                    <strong className="text-amber-300 block mb-0.5">③ 文字量を画像全体の20〜30%に抑える</strong>
                    詰め込みすぎると画像がゴチャつきます。詳しい説明は広告本文に委ね、画像では「感情の引き金」だけを引きます。
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: Instagram / Threads オーガニック投稿
        ========================================================================= */}
        {activeTab === 'snsPosts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <h2 className="text-xl font-bold text-white mb-2">
                Instagram & Threads 日常運用テンプレート
              </h2>
              <p className="text-xs text-stone-400">
                広告だけでなく、現場のリアルや職人の想いを日常発信することで、広告を見たユーザーがプロフィールを訪れた際の信頼性を最大化します。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              {/* 投稿 1: 現場の裏側（銀次郎） */}
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="font-bold text-amber-400">POST 01: 現場のリアル「銀次郎」</span>
                  <span className="text-[11px] text-stone-500">Instagram / Threads共通</span>
                </div>
                <div className="p-4 bg-stone-900 rounded-xl text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`屋根を開けると、そこには銀色の遮熱通気スペーサー「銀次郎」が隙間なく並んでいます。

昭和51年築の家が、なぜ最新の新築より涼しくなるのか？
その秘密はこの「屋根の通気層」にあります。

夏の強烈な太陽光は、屋根から天井裏へと熱を伝えます。
そこで銀次郎のアルミ高反射面で熱線を97%跳ね返し、温まった空気を屋根のてっぺんから自然排熱する。

完成したら壁や天井の中に隠れて二度と見えなくなる部分。
でも、だからこそ建築士と大工さんはここに全魂を注ぎます。

#再進の家 #鳩山ニュータウン #高断熱リノベーション #銀次郎 #木造建築 #大工の仕事 #終の住処 #HEAT20`}
                </div>
                <button
                  onClick={() => handleCopy(`屋根を開けると、そこには銀色の遮熱通気スペーサー「銀次郎」が隙間なく並んでいます。\n\n昭和51年築の家が、なぜ最新の新築より涼しくなるのか？\nその秘密はこの「屋根の通気層」にあります。\n\n夏の強烈な太陽光は、屋根から天井裏へと熱を伝えます。\nそこで銀次郎のアルミ高反射面で熱線を97%跳ね返し、温まった空気を屋根のてっぺんから自然排熱する。\n\n完成したら壁や天井の中に隠れて二度と見えなくなる部分。\nでも、だからこそ建築士と大工さんはここに全魂を注ぎます。\n\n#再進の家 #鳩山ニュータウン #高断熱リノベーション #銀次郎 #木造建築 #大工の仕事 #終の住処 #HEAT20`, 'post_1')}
                  className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  {copiedKey === 'post_1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'post_1' ? 'コピー完了' : '投稿文をコピー'}</span>
                </button>
              </div>

              {/* 投稿 2: 鳩山ニュータウンの朝 */}
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="font-bold text-emerald-400">POST 02: 暮らしの空気感「鳩山の朝」</span>
                  <span className="text-[11px] text-stone-500">Instagramリール / Threads</span>
                </div>
                <div className="p-4 bg-stone-900 rounded-xl text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`鳩山ニュータウンの朝は、驚くほど静かです。

窓を開けると、都心では味わえない澄んだ空気と小鳥のさえずり。
南東・南西の角地だから、朝日がリビングの杉板天井に差し込んできます。

駅からはバスで11分。確かに「駅前徒歩5分」の便利さはありません。
でも、その代わりここには、
「喧騒のない静寂」「美味しい空気」「四季を感じる散歩コース」
そして新築以上の性能を持った暖かい家があります。

便利さだけに追われない、大人の豊かな暮らしとは何か。
毎朝この現場に来るたびに実感します。

#鳩山ニュータウン #終の住処 #田舎暮らし #スローライフ #澄んだ空気 #埼玉移住 #50代からの暮らし #再進の家`}
                </div>
                <button
                  onClick={() => handleCopy(`鳩山ニュータウンの朝は、驚くほど静かです。\n\n窓を開けると、都心では味わえない澄んだ空気と小鳥のさえずり。\n南東・南西の角地だから、朝日がリビングの杉板天井に差し込んできます。\n\n駅からはバスで11分。確かに「駅前徒歩5分」の便利さはありません。\nでも、その代わりここには、\n「喧騒のない静寂」「美味しい空気」「四季を感じる散歩コース」\nそして新築以上の性能を持った暖かい家があります。\n\n便利さだけに追われない、大人の豊かな暮らしとは何か。\n毎朝この現場に来るたびに実感します。\n\n#鳩山ニュータウン #終の住処 #田舎暮らし #スローライフ #澄んだ空気 #埼玉移住 #50代からの暮らし #再進の家`, 'post_2')}
                  className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  {copiedKey === 'post_2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'post_2' ? 'コピー完了' : '投稿文をコピー'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: AI動画・画像生成プロンプト（Veo 3）
        ========================================================================= */}
        {activeTab === 'aiPrompts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <h2 className="text-xl font-bold text-white mb-2">
                Veo 3 実物完全一致 シネマティック動画生成プロンプト
              </h2>
              <p className="text-xs text-stone-400">
                AIが勝手に架空の家具や文字を描画しないよう、「参照画像の実在する室内をそのまま維持し、カメラワークのみを指示する」最適化済みプロンプト集。
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="font-bold text-purple-400 text-sm">PROMPT 01: 太陽光が差し込む吹き抜けLDK（10秒動画）</span>
                  <span className="text-xs text-stone-500">参照画像: R0010055.JPG または LDK完成写真</span>
                </div>
                <div className="p-4 bg-stone-900 rounded-xl text-stone-200 text-xs font-mono leading-relaxed whitespace-pre-wrap">
{`【参照画像】: 指定のLDK実物写真（杉板木天井・シーリングファン・高窓）
【プロンプト】:
参照画像の実在する部屋の内装、杉板の木目天井、白い壁、シーリングファン、高窓の構造を100%完全に維持する。
日中の明るく澄んだ太陽光が、高窓から白い壁と無垢調フローリングに美しく斜めに差し込んでいる。
カメラはゆっくりと滑らかにリビングの中央に向かって前進するシネマティックなドリーイン。
シーリングファンが自然な速度で静かに回転している。
人物、テキスト、テロップ、不自然な家具の追加は一切行わない。フォトリアル、実写映像。`}
                </div>
                <button
                  onClick={() => handleCopy(`参照画像の実在する部屋の内装、杉板の木目天井、白い壁、シーリングファン、高窓の構造を100%完全に維持する。\n日中の明るく澄んだ太陽光が、高窓から白い壁と無垢調フローリングに美しく斜めに差し込んでいる。\nカメラはゆっくりと滑らかにリビングの中央に向かって前進するシネマティックなドリーイン。\nシーリングファンが自然な速度で静かに回転している。\n人物、テキスト、テロップ、不自然な家具の追加は一切行わない。フォトリアル、実写映像。`, 'prompt_1')}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'prompt_1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'prompt_1' ? 'コピー完了' : 'プロンプトをコピー'}</span>
                </button>
              </div>

              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="font-bold text-purple-400 text-sm">PROMPT 02: 鳩山ニュータウン外観＆青空ドローン（10秒動画）</span>
                  <span className="text-xs text-stone-500">参照画像: 建物外観写真（角地）</span>
                </div>
                <div className="p-4 bg-stone-900 rounded-xl text-stone-200 text-xs font-mono leading-relaxed whitespace-pre-wrap">
{`【参照画像】: 指定の外観角地写真（再進の家）
【プロンプト】:
参照画像の外観建物形状、敷地形状、道路の納まりを完全に維持する。
抜けるような青空と遠くの山並み、緑豊かな高台の鳩山ニュータウンの閑静な住宅街。
ドローンカメラが南東の角地からゆっくりと高度を上げながら、建物の全景と周囲の緑をパノラマで捉える。
車や歩行者は入れず、静寂と澄み切った空気感が伝わる映画のようなライティング。`}
                </div>
                <button
                  onClick={() => handleCopy(`参照画像の外観建物形状、敷地形状、道路の納まりを完全に維持する。\n抜けるような青空と遠くの山並み、緑豊かな高台の鳩山ニュータウンの閑静な住宅街。\nドローンカメラが南東の角地からゆっくりと高度を上げながら、建物の全景と周囲の緑をパノラマで捉える。\n車や歩行者は入れず、静寂と澄み切った空気感が伝わる映画のようなライティング。`, 'prompt_2')}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'prompt_2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'prompt_2' ? 'コピー完了' : 'プロンプトをコピー'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: 広告予算・CPAシミュレーション
        ========================================================================= */}
        {activeTab === 'budget' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <h2 className="text-xl font-bold text-white mb-2">
                Facebook / Instagram広告 運用シミュレーション
              </h2>
              <p className="text-xs text-stone-400">
                比企郡・東松山・坂戸・鶴ヶ島・川越周辺（半径25km）の持ち家層に向けた、推奨予算と獲得KPI目安。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-4">
                <div className="text-stone-400 font-bold uppercase text-xs">プラン 1（テスト運用）</div>
                <div className="text-2xl font-black text-white">月額 30,000 円</div>
                <div className="text-xs text-stone-400">1日あたり約1,000円</div>
                <div className="space-y-2 pt-4 border-t border-stone-800 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>推定インプレッション:</span>
                    <strong className="text-white">約 30,000 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>想定クリック数 (CTR 1.8%):</span>
                    <strong className="text-white">約 540 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>クリック単価 (CPC):</span>
                    <strong className="text-white">約 55 円</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>LP資料請求・内覧獲得:</span>
                    <strong className="text-amber-400 font-bold">2 〜 4 件</strong>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 p-6 rounded-3xl border border-amber-500/40 shadow-xl space-y-4 relative">
                <div className="absolute -top-3 right-6 bg-amber-500 text-stone-950 text-[10px] font-black px-3 py-0.5 rounded-full">
                  推奨プラン
                </div>
                <div className="text-amber-400 font-bold uppercase text-xs">プラン 2（標準運用）</div>
                <div className="text-2xl font-black text-white">月額 60,000 円</div>
                <div className="text-xs text-stone-400">1日あたり約2,000円</div>
                <div className="space-y-2 pt-4 border-t border-stone-800 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>推定インプレッション:</span>
                    <strong className="text-white">約 65,000 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>想定クリック数 (CTR 2.0%):</span>
                    <strong className="text-white">約 1,300 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>クリック単価 (CPC):</span>
                    <strong className="text-white">約 46 円</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>LP資料請求・内覧獲得:</span>
                    <strong className="text-amber-400 font-bold">6 〜 10 件</strong>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-4">
                <div className="text-stone-400 font-bold uppercase text-xs">プラン 3（早期売却集中）</div>
                <div className="text-2xl font-black text-white">月額 100,000 円</div>
                <div className="text-xs text-stone-400">1日あたり約3,300円</div>
                <div className="space-y-2 pt-4 border-t border-stone-800 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>推定インプレッション:</span>
                    <strong className="text-white">約 120,000 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>想定クリック数 (CTR 2.2%):</span>
                    <strong className="text-white">約 2,600 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>クリック単価 (CPC):</span>
                    <strong className="text-white">約 38 円</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>LP資料請求・内覧獲得:</span>
                    <strong className="text-amber-400 font-bold">12 〜 18 件</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-stone-300">
              <strong className="text-white block mb-1">投資対効果（ROI）の考え方：</strong>
              本物件は売主直売のため、一般的な仲介手数料（約85万円）が不要です。月額5万〜6万円の広告費を投じて2〜3ヶ月で成約に至れば、広告費総額15万円に対して十分すぎるほどの利益率と早期資金回収が達成されます。
            </div>
          </div>
        )}

      {/* =========================================================================
          運用マニュアル・出稿解説モーダル（担当者向けガイド）
      ========================================================================= */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-stone-700 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* モーダルヘッダー */}
            <div className="p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    Meta広告運用・出稿操作 完全マニュアル
                  </h2>
                  <p className="text-xs text-stone-400">
                    ツールの目的・意図、長文/短文の使い分け、Meta広告マネージャでの登録手順
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* モーダル本文（スクロール可能） */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-300">
              {/* セクション 1: このツールの目的と意図 */}
              <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">1</span>
                  このツールは何のためのツールか？（目的と意図）
                </h3>
                <p className="leading-relaxed text-stone-300">
                  本ツールは、鳩山町の再生モデルハウス<strong>「彩の神（2,180万円・土地72坪・Qセルズ太陽光8.0kW搭載）」</strong>への
                  <strong>「内覧予約」「現地体感会」「特製ガイドブック請求」</strong>を、Meta（Facebook/Instagram）広告を通じて最小の広告費で最大効率に獲得するための専門運用ダッシュボードです。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                    <strong className="text-amber-400 block mb-1">① 住宅規約審査のクリア</strong>
                    <p className="text-stone-400 text-xs">Meta住宅規約（年齢・性別の絞り込み禁止）に対応し、コピーで自然に対象外を弾いて無駄クリックを防ぎます。</p>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                    <strong className="text-amber-400 block mb-1">② ワンクリック出稿</strong>
                    <p className="text-stone-400 text-xs">6大ターゲット別に計算された原稿・見出し・URLが用意され、誰でも即座にコピペして出稿できます。</p>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
                    <strong className="text-amber-400 block mb-1">③ 成果のリアルタイム可視化</strong>
                    <p className="text-stone-400 text-xs">資料ダウンロード数や問合せ進捗を社内共有し、最も反響の出ている原稿に広告費を集中投下できます。</p>
                  </div>
                </div>
              </div>

              {/* セクション 2: なぜ「短文」と「長文」があるのか？（使い分け） */}
              <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">2</span>
                  広告文の長さに関する疑問（短文・長文の使い分けの真実）
                </h3>
                <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-200 text-xs leading-relaxed">
                  <strong>担当者からの声：</strong>「テキストが長すぎないか？ 誰も読まないのではないか？」<br />
                  <strong>マーケティングの結論：</strong>高額不動産（2,180万円）では<strong>「短文＝クリック集客」「長文＝本気客の選別・成約獲得」</strong>という役割の違いがあります。各カードのトグルボタンでどちらも選べるようになっています。
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white flex items-center gap-1.5 font-bold">
                        <Zap className="w-4 h-4 text-amber-400" /> ⚡ 短文版（約150〜250文字）
                      </strong>
                      <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">クリック率（CTR）重視</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-stone-300">
                      <li><strong>メリット:</strong> スマホ画面で「もっと見る」を押さずに要点が伝わり、気軽にタップされやすい。</li>
                      <li><strong>最適メディア:</strong> Instagramフィード、ストーリーズ、スマートフォンを素早くスクロールする層。</li>
                      <li><strong>おすすめ活用法:</strong> 広告配信初期に広く認知を取りたいとき、画像（ビジュアル）に強い自信があるとき。</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white flex items-center gap-1.5 font-bold">
                        <AlignLeft className="w-4 h-4 text-emerald-400" /> 📖 長文版（約500〜700文字）
                      </strong>
                      <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">成約確度（CVR）重視</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-stone-300">
                      <li><strong>メリット:</strong> 「なぜ新築より800万安いのか」「年間8,789kWh発電の根拠」を納得した<strong>本気度の高い50〜70代だけ</strong>がLPへ遷移。</li>
                      <li><strong>アルゴリズムの恩恵:</strong> 長文を立ち止まってスクロールした閲覧履歴をMetaのAIが高く評価し、類似の優良見込み客へ優先配信。</li>
                      <li><strong>冷やかし排除:</strong> 読む気のない若年層をふるい落とし、無駄なクリック課金（広告費の浪費）を自動防止。</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* セクション 3: Meta広告マネージャへの登録・出稿 4ステップ */}
              <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">3</span>
                  Meta広告マネージャへの登録方法（簡単4ステップ）
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800">
                    <div className="font-bold text-white text-xs mb-1">
                      STEP 1: キャンペーンの作成（※住宅カテゴリ必須）
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      Meta広告マネージャで「+ 作成」をクリック。目的は<strong>「リード（見込み客の獲得）」</strong>または<strong>「トラフィック」</strong>を選択。
                      <strong>【最重要】</strong>「特別な広告カテゴリ」で必ず<strong>「住宅 (Housing)」</strong>をオンにしてください（オンにしないと審査で即却下されます）。
                    </p>
                  </div>

                  <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800">
                    <div className="font-bold text-white text-xs mb-1">
                      STEP 2: 広告セットの設定（配信地域）
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      地域設定で「埼玉県鳩山町」を中心に「半径約40km（川越・東松山・坂戸・鶴ヶ島）」を指定。
                      二拠点生活パターンFを出稿する場合は「東京都（23区・武蔵野市）」を追加します。
                      ※住宅カテゴリのため、年齢や性別の絞り込みは行わず全世代配信のままでOKです（広告文が自然に選別します）。
                    </p>
                  </div>

                  <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800">
                    <div className="font-bold text-white text-xs mb-1">
                      STEP 3: 広告クリエイティブの設定（本ツールからコピペ）
                    </div>
                    <div className="text-stone-400 text-xs space-y-1.5 pt-1">
                      <div>・<strong>プライマリテキスト:</strong> 本ツールの対象パターンの「本文をコピー」を押し、Metaの本文欄に貼り付け。</div>
                      <div>・<strong>見出し:</strong> 本ツールの「見出し」をコピーして、Metaの見出し欄に貼り付け。</div>
                      <div>・<strong>リンク先URL:</strong> 本ツールの「URLをコピー」を押し、WebサイトURL（https://lp.smile049.jp/saishin）に貼り付け。</div>
                      <div>・<strong>メディア:</strong> 推奨クリエイティブ欄に記載された写真や動画をアップロード。</div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800">
                    <div className="font-bold text-white text-xs mb-1">
                      STEP 4: 公開・審査
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      右下の「公開」ボタンを押すと、Metaによる自動審査（通常数時間〜最長24時間）が開始され、審査完了後に自動配信されます。
                    </p>
                  </div>
                </div>
              </div>

              {/* セクション 4: 困ったときのQ&A */}
              <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">4</span>
                  よくある質問（FAQ）
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-stone-900 rounded-xl">
                    <strong className="text-stone-200 block mb-0.5">Q. どのパターンから出稿すればよいですか？</strong>
                    <span className="text-stone-400">A. まずは最も訴求がストレートな<strong>「パターンA（新築対比・短文）」</strong>と<strong>「パターンC（光熱費実質ゼロ・短文）」</strong>の2本からテスト出稿し、CTRが高い方に予算を集中させるのがおすすめです。</span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-xl">
                    <strong className="text-stone-200 block mb-0.5">Q. 広告費は1日いくらから始められますか？</strong>
                    <span className="text-stone-400">A. 1日1,000円〜1,500円（月3万〜4.5万円程度）からテスト可能です。反響を見ながら徐々に増額できます。</span>
                  </div>
                </div>
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow"
              >
                マニュアルを閉じて作業を続ける
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
