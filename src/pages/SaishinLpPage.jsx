import React, { useState } from 'react';
import {
  ShieldCheck,
  Sun,
  Flame,
  Coins,
  ArrowRight,
  ChevronDown,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  Wrench,
  Maximize2,
  Layers,
  ThermometerSnowflake,
  Compass,
  Building2,
  Home,
  Check,
  AlertCircle,
  MapPin,
  TrendingDown,
  HelpCircle,
  Heart
} from 'lucide-react';
import VirtualTour360 from '../components/VirtualTour360';

export default function SaishinLpPage({ onNavigate }) {
  const [modalType, setModalType] = useState(null); // 'doc' | 'tour' | null
  const [activePlanFloor, setActivePlanFloor] = useState('1f'); // '1f' | '2f'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const isDocRequest = modalType === 'doc';
    setTimeout(() => {
      alert(isDocRequest 
        ? 'ガイドブックの請求ありがとうございます。別タブにて特製ガイドブック（PDF印刷対応）を開きます。' 
        : '体感会のご予約ありがとうございます。担当者より迅速にご案内いたします。'
      );
      if (isDocRequest) {
        window.open('/saishin-dual-life-guide.html', '_blank');
      }
      setModalType(null);
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans selection:bg-amber-500 selection:text-white">
      {/* =========================================================================
          LP専用上部バー & 3大コンテンツナビゲーション
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-stone-900 text-base sm:text-lg tracking-wider">
              再進の家 <span className="text-amber-700 font-semibold text-xs sm:text-sm">｜ 鳩山ニュータウン</span>
            </span>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              HEAT20 G2・自社物件直売
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>資料請求(PDF)</span>
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>プライベート内覧会</span>
            </button>
          </div>
        </div>

        {/* 3ページのLP（販売戦略 3大コンテンツナビゲーション） */}
        <div className="bg-[#f5f1eb] border-t border-stone-200 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-8 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
            <span className="text-stone-500 px-2 py-1 shrink-0 font-medium">【LP構成】</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-md bg-amber-700 text-white shrink-0 flex items-center gap-1 shadow-sm"
            >
              <span>① 総合案内（全体ストーリー）</span>
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('saishin-tech') : (window.location.href = '/saishin/technology')}
              className="px-3 py-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 shrink-0 flex items-center gap-1 transition"
            >
              <span>② 構造・技術エビデンス詳説</span>
              <ArrowRight className="w-3 h-3 text-amber-600" />
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('saishin-spec') : (window.location.href = '/saishin/spec')}
              className="px-3 py-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 shrink-0 flex items-center gap-1 transition"
            >
              <span>③ 物件スペック＆周辺環境</span>
              <ArrowRight className="w-3 h-3 text-amber-600" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          1. ファーストビュー（一番最初に目に入る部分）
      ========================================================================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* ビジュアル: 太陽光が差し込むリビング動画 (最適化済み ldk_sunlight.mp4) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-55 scale-105 transform transition-transform duration-1000"
        >
          <source src="/assets/saishin/videos/ldk_sunlight.mp4" type="video/mp4" />
        </video>

        {/* 高級グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/75" />

        {/* ヒーローコンテンツ */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center text-white">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-semibold tracking-wider text-amber-300 mb-6 shadow-xl animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>【売主直売】仲介手数料 約85万円不要</span>
            <span className="hidden sm:inline text-stone-400">｜</span>
            <span className="text-emerald-300 font-bold">都心から約1時間の週末別邸 ＆ ご夫婦の温もりあるセカンドライフ</span>
          </div>

          {/* メインコピー（感情の情景＋コントラスト） */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.3] mb-6 drop-shadow-lg">
            「朝、布団から出るのが怖くない。」<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              ただそれだけで、人生の冬は<br className="sm:hidden" />こんなにも幸せになる。
            </span>
          </h1>

          {/* サブヘッド & サブコピー */}
          <div className="max-w-3xl mx-auto mb-8 space-y-3">
            <p className="text-sm sm:text-base md:text-lg font-bold text-amber-300 drop-shadow">
              高額な新築ローンや維持費のかかる別荘はもういらない。ご夫婦2人のための「2,180万円・維持費実質ゼロの極暖プライベートヴィラ」。
            </p>
            <p className="text-xs sm:text-base text-stone-200 font-normal leading-relaxed drop-shadow">
              子育てを終えた今、本当に欲しかったのは広すぎる部屋ではなく、<br className="hidden sm:inline" />
              <strong className="text-white font-bold">「日本一の酷暑の夏も、底冷えする真冬も、家中どこにいても春のように快適な拠点」</strong>でした。<br />
              比企郡鳩山町 ｜ <span className="font-extrabold text-amber-300 underline underline-offset-4">2,180万円（税込・売主直売・土地72坪）</span> ｜ 屋根遮熱「銀次郎」× HEAT20 G2極暖断熱 ＆ Qセルズ8.0kW太陽光発電
            </p>
          </div>

          {/* 権威付けバッジ（スペック名を生活実感・安心へ変換） */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-left">
            <div className="bg-stone-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">大地震でも安心の骨組み</div>
                <div className="text-xs sm:text-sm font-bold text-white">構造計算・現行耐震適合</div>
              </div>
            </div>

            <div className="bg-stone-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">30年後も水漏れ知らず</div>
                <div className="text-xs sm:text-sm font-bold text-white">配管・電気配線全面新品</div>
              </div>
            </div>

            <div className="bg-stone-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">物価高でも電気代相殺</div>
                <div className="text-xs sm:text-sm font-bold text-white">年金生活を守る8.0kW太陽光</div>
              </div>
            </div>

            <div className="bg-stone-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">夜中もヒートショックなし</div>
                <div className="text-xs sm:text-sm font-bold text-white">真冬も無暖房15℃（G2超）</div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#virtual-tour"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2 group"
            >
              <span>3D間取り ＆ 360°WEBバーチャル内覧へ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setModalType('tour')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>プライベート内覧会（エアコン1台の快適さを体感）</span>
            </button>
          </div>
        </div>

        {/* スクロールガイド */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-stone-400 flex flex-col items-center text-xs animate-bounce">
          <span>SCROLL</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* =========================================================================
          2. 共感・課題提起（ターゲットの心の声を代弁）
      ========================================================================= */}
      <section className="py-20 bg-stone-100 text-stone-900 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-800 tracking-widest uppercase bg-amber-200/60 border border-amber-300 px-3.5 py-1 rounded-full">
              REAL PAIN & TRUTH
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3 leading-snug">
              「寒い家で我慢を重ね、老後資金を減らし続ける毎日に、<br className="hidden sm:inline" />不安はありませんか？」
            </h2>
            <p className="text-stone-600 text-xs sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              子育てを終え、これからの人生をご夫婦で穏やかに楽しみたい50代・60代・70代が、<br className="hidden sm:inline" />
              誰にも言えずに抱えている6つの切実な本音。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">階段の上り下りが億劫で、2階は物置同然の開かずの間に</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  急な階段を上るたびに膝や腰に負担。使わない部屋の掃除と草むしりに追われ、「夫婦2人には広すぎて持て余している」とため息が出る。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 bg-red-50/30 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">一番怖いのは、真冬の脱衣所やトイレでの「ヒートショック」</h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  暖房の効いた部屋を一歩出ると凍える寒さ。「ある晩、連れ合いが風呂場で倒れたらどうしよう」という恐怖を、毎年冬が来るたびに心のどこかで怯えている。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">電気代の明細を見るたび溜息。年金生活で新築ローンは絶対組みたくない</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  物価も電気代も上がり続ける時代。3,000万超の新築ローンで老後資金を枯渇させるのは自殺行為。かといって今の古い家も毎月の光熱費と修繕費が怖い。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">夫婦お互いの趣味や就寝リズムを邪魔せず、気配を感じて暮らしたい</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  就寝時間、テレビや読書。お互いの生活リズムを尊重した個室空間が欲しいけれど、完全に孤立して気配が分からなくなるのは寂しい。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200 bg-amber-50/50 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                5
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">リフォーム工事中の「仮住まい探し」や「2回の引越し」が体力的に無理</h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  自宅の大規模工事は、仮住まい探し・荷造りと荷解きを2回繰り返す過酷な重労働。費用も労力も限界で、住み替えそのものを諦めてしまう。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200 bg-amber-50/50 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                6
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">「いま住んでいる自宅が売れるかどうか」が不安で決断できない</h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  持ち家がいくらで売れるのか見当がつかず、売れ残った場合の二重生活リスクが怖くて、前に進むことができない。
                </p>
              </div>
            </div>
          </div>

          {/* 解決の提示 */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white text-center shadow-xl border border-stone-700">
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-full inline-block mb-3">
              THE 4-POINT ANSWER
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-200 mb-3">
              「我慢も不安も、すべて過去のものに。<br className="hidden sm:inline" />『再進の家』がご夫婦の余生をお守りします。」
            </h3>
            <p className="text-stone-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
              価格・暖かさ・将来の修繕費、そして住み替えに伴う心労まで。<br className="hidden sm:inline" />
              50代〜70代のセカンドライフを阻む4大バリアを完全解消しました。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-left max-w-3xl mx-auto">
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-amber-400 font-bold block mb-0.5">① お金の不安を解消</span>
                <span className="text-stone-300 text-[11px]">2,180万で手元資金を守り、建物評価0で固定資産税激減</span>
              </div>
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-amber-400 font-bold block mb-0.5">② 寒さ・命の不安を解消</span>
                <span className="text-stone-300 text-[11px]">HEAT20 G2超高断熱＋Qセルズ8kWで光熱費を相殺</span>
              </div>
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-amber-400 font-bold block mb-0.5">③ 修繕・耐震の不安解消</span>
                <span className="text-stone-300 text-[11px]">配管・電気配線全面新品＋構造計算による耐震金物補強</span>
              </div>
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-emerald-400 font-bold block mb-0.5">④ 引越し・売却の心労解消</span>
                <span className="text-stone-300 text-[11px]">完成済みで引越し1回完結＋自宅売却・買取をワンストップ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. 3つのコア・バリュー（選ばれる理由）
      ========================================================================= */}
      <section className="py-20 bg-[#f7f4ee] text-stone-900 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-amber-800 tracking-widest uppercase bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
              CORE VALUES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              なぜ「再進の家」が選ばれるのか<br />
              <span className="text-stone-600 text-base sm:text-xl font-normal">
                本質を見極める大人のための3つの確信
              </span>
            </h2>
          </div>

          <div className="space-y-12">
            {/* -------------------------------------------------------------
                ① 経済的な安心：2,180万円で実現する「ランニングコスト・ゼロ」の暮らし
            ------------------------------------------------------------- */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/90 shadow-md text-stone-900">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-4">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    <span>コア・バリュー 01 ｜ お金の解放</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-4 leading-snug">
                    【価格と暖かさの革命】<br />
                    新築の2/3の予算で手に入れる、一生「寒さとお金の不安」から解放される暮らし
                  </h3>
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed mb-6">
                    初期費用を新築（約3,000万〜4,000万円）から<strong className="text-amber-800 font-bold">約820万〜1,800万円抑制</strong>。さらに真冬でも家中春の暖かさを保つHEAT20 G2クラスの超高断熱と、<strong className="text-amber-800 font-bold">Qセルズ太陽光8.0kW（年間8,789kWh創エネ）</strong>の自家消費により、毎月跳ね上がる電気代をほぼ相殺します。
                  </p>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                    「毎月の光熱費を気にしてエアコンを我慢する」生活は、今日でおしまいです。浮いた資金で、ご夫婦での温泉旅行やお孫さんへのプレゼントなど、心にゆとりのある余生が広がります。築25年超の良質な躯体を活かしているため、<strong className="text-emerald-700 font-bold">毎年の固定資産税も新築の数分の一</strong>で済みます。
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-stone-200">
                      <div className="text-stone-500 mb-1 font-medium">手元に残る老後資金</div>
                      <div className="text-lg font-black text-amber-700">約 1,000 万円 ゆとり</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-stone-200">
                      <div className="text-stone-500 mb-1 font-medium">30年の生涯コスト差額</div>
                      <div className="text-lg font-black text-emerald-700">約 1,820 万円 軽減</div>
                    </div>
                  </div>
                </div>

                {/* 新築との生涯コストシミュレーショングラフ */}
                <div className="lg:w-1/2 w-full bg-stone-900 text-white p-6 rounded-2xl border border-stone-800 shadow-inner">
                  <div className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>生涯住居コストシミュレーション（30年間）</span>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-300">独自試算</span>
                  </div>

                  <div className="space-y-5 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1.5 text-stone-300">
                        <span>一般新築住宅（3,200万円＋光熱費・高額固定資産税）</span>
                        <span className="text-stone-400 font-extrabold text-sm">約 4,200 万円</span>
                      </div>
                      <div className="w-full bg-stone-800 h-6 rounded-lg overflow-hidden flex">
                        <div className="bg-stone-600 h-full w-[76%] flex items-center justify-end pr-2 text-[10px] font-bold text-white">本体 3,200万</div>
                        <div className="bg-red-900 h-full w-[24%] flex items-center justify-center text-[10px] font-bold text-red-200">光熱費・税 1,000万</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1.5 text-amber-300">
                        <span>再進の家（2,180万円＋ほぼ光熱費0円＋低額固定資産税）</span>
                        <span className="text-amber-400 font-extrabold text-sm">約 2,380 万円</span>
                      </div>
                      <div className="w-full bg-stone-800 h-6 rounded-lg overflow-hidden flex">
                        <div className="bg-amber-600 h-full w-[52%] flex items-center justify-end pr-2 text-[10px] font-bold text-stone-950">本体 2,180万</div>
                        <div className="bg-emerald-800 h-full w-[5%] flex items-center justify-center text-[9px] font-bold text-white">200万</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                    <p className="text-xs text-amber-300 font-bold">
                      浮いた約 1,820 万円で、夫婦の老後生活に揺るぎない安心が手に入ります
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                ② 構造的な安心：プロの目で躯体から見直した「見えない部分」へのこだわり
            ------------------------------------------------------------- */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/90 shadow-md text-stone-900">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold mb-4">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>コア・バリュー 02 ｜ 30年の耐久性</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3 leading-snug">
                【目に見えない安心】<br />
                大工歴40年の熟練の技と構造計算。骨組みから配管まで新品に蘇らせた「30年安心の耐久性」
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-3xl mb-8">
                表側だけのクロスやキッチンの貼り替えではありません。建築士と熟練大工が一度すべての骨組み（フルスケルトン）まで解体し、木の一本一本の健全性を精査。構造計算に基づき、最新の耐震金物で緊結・再構築しました。
              </p>

              {/* 4枚の実写・現場構造証拠写真 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#faf8f5] rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <img
                    src="/assets/saishin/features/feat_01_skeleton.jpg"
                    alt="スケルトン解体・構造金物補強"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-bold text-stone-900 mb-1">01. フルスケルトン金物補強</div>
                    <div className="text-[11px] text-stone-600">柱・梁・筋交いを現わしにし、大地震に耐えうる最新金物で緊結。</div>
                  </div>
                </div>

                <div className="bg-[#faf8f5] rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <img
                    src="/assets/saishin/features/feat_02_ginjiro.jpg"
                    alt="遮熱通気スペーサー銀次郎"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-bold text-stone-900 mb-1">02. 遮熱通気部材「銀次郎」</div>
                    <div className="text-[11px] text-stone-600">屋根垂木下に通気層を確保し、酷暑の熱気を家に入れません。</div>
                  </div>
                </div>

                <div className="bg-[#faf8f5] rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <img
                    src="/assets/saishin/features/feat_03_window.jpg"
                    alt="YKK APW430高性能トリプルガラス樹脂窓"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-bold text-stone-900 mb-1">03. トリプル樹脂サッシ</div>
                    <div className="text-[11px] text-stone-600">世界基準の断熱窓。嫌な窓の結露を根絶し、外の騒音も遮断。</div>
                  </div>
                </div>

                <div className="bg-[#faf8f5] rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <img
                    src="/assets/saishin/features/feat_04_plumbing.jpg"
                    alt="給排水管・電気配線の完全リプレイス"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-bold text-stone-900 mb-1">04. 配管・インフラ完全新品</div>
                    <div className="text-[11px] text-stone-600">見えない給排水管・電気配線を全交換。将来の水漏れリスクをゼロに。</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-stone-800">
                  <strong className="text-stone-900 font-bold">建築士・大工チームの誠実な約束：</strong> なぜここまでの構造補強・断熱改修が必要なのか、CAD図面や構造計算書を包み隠さず公開しています。
                </div>
                <button
                  onClick={() => onNavigate ? onNavigate('saishin-tech') : (window.location.href = '/saishin/technology')}
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition shadow-sm"
                >
                  <span>構造・技術エビデンスを詳しく読む</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------
                ③ 暮らしのゆとり：つかず離れず、自然と調和する大人の空間
            ------------------------------------------------------------- */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/90 shadow-md text-stone-900">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-4">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>コア・バリュー 03 ｜ 心地よい距離感</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-4 leading-snug">
                【夫婦の程よい距離感】<br />
                1階だけで快適に完結する「平屋感覚」。お互いの時間を尊重しながら、温もりを感じ合える間取り
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
                夫婦であっても、就寝時間や読書・テレビの趣味は異なります。それぞれのプライベート時間を尊重できるよう、1階に<strong className="text-amber-800 font-bold">独立した2つの寝室</strong>を配置しました。階段を使わずにワンフロアですべてが完結します。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-800">
                <div className="p-5 rounded-2xl bg-[#faf8f5] border border-stone-200">
                  <div className="font-bold text-stone-900 text-base mb-2">気配を感じる絶妙な距離感</div>
                  <p className="text-xs leading-relaxed text-stone-600">
                    リビングと廊下を挟んで適度な距離を保ちながら、物音や明かりでお互いの安心感を確認できる設計。足腰に負担のない平屋感覚で、一生快適に過ごせます。
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#faf8f5] border border-stone-200">
                  <div className="font-bold text-stone-900 text-base mb-2">美味しい空気を吸いながらの散歩が日課に</div>
                  <p className="text-xs leading-relaxed text-stone-600">
                    南東・南西角地で窓を開ければ澄んだ空気と見晴らしの良い景色。排気ガスや騒音のない閑静な住宅街での朝夕の散歩が、お二人の健康的な新しい習慣になります。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          理屈での正当化：新築建売 vs 本物件 徹底比較表（感情の後に頭で納得）
      ========================================================================= */}
      <section className="py-20 bg-[#f0ebe3] text-stone-900 border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-800 tracking-widest uppercase bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
              LOGICAL COMPARISON
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 leading-snug text-stone-900">
              「どちらが、これからの人生に賢い選択ですか？」<br />
              <span className="text-stone-600 text-base sm:text-xl font-normal">
                近隣新築建売住宅と本物件の冷徹なコスト・性能比較
              </span>
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-3 max-w-2xl mx-auto">
              人は感情で欲しくなり、最後に理屈（数字）で納得します。50代〜70代のご夫婦にとってどちらがリスクが少ないか、客観的な事実を整理しました。
            </p>
          </div>

          {/* 比較テーブル */}
          <div className="bg-white rounded-3xl border border-stone-300 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-100/90 text-stone-800">
                    <th className="p-4 sm:p-5 font-bold text-stone-600 w-1/4">比較項目</th>
                    <th className="p-4 sm:p-5 font-bold text-stone-600 w-1/3">近隣の新築建売住宅</th>
                    <th className="p-4 sm:p-5 font-extrabold text-amber-900 bg-amber-50/80 w-5/12 border-l border-amber-300">
                      再進の家（2,180万フルリノベ）
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-700">
                  <tr className="hover:bg-stone-50 transition">
                    <td className="p-4 sm:p-5 font-bold text-stone-900 bg-stone-50/80">購入価格（初期費用）</td>
                    <td className="p-4 sm:p-5 text-stone-600">3,000万円超〜3,500万円</td>
                    <td className="p-4 sm:p-5 font-bold text-amber-900 bg-amber-50/40 border-l border-amber-200">
                      <div className="text-base sm:text-lg text-amber-700 font-black">2,180 万円（税込）</div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">約820万〜1,320万円を老後資金・趣味・旅行へ</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50 transition">
                    <td className="p-4 sm:p-5 font-bold text-stone-900 bg-stone-50/80">断熱性能（冬の暖かさ）</td>
                    <td className="p-4 sm:p-5 text-stone-600">
                      一般省エネ基準（等級4〜5程度）<br />
                      <span className="text-[11px] text-stone-400">※冬の朝は10℃前後まで下がり寒い</span>
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-emerald-900 bg-amber-50/40 border-l border-amber-200">
                      <div className="text-base sm:text-lg text-emerald-700 font-black">HEAT20 G2超（新築以上）</div>
                      <div className="text-[11px] text-stone-600 mt-0.5">真冬の未明も無暖房15℃キープ・ヒートショック予防</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50 transition">
                    <td className="p-4 sm:p-5 font-bold text-stone-900 bg-stone-50/80">毎月の光熱費（電気代）</td>
                    <td className="p-4 sm:p-5 text-stone-600">
                      電気代高騰の影響を直撃<br />
                      <span className="text-[11px] text-stone-400">※太陽光なし、または小容量が多い</span>
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-amber-900 bg-amber-50/40 border-l border-amber-200">
                      <div className="text-base sm:text-lg text-amber-700 font-black">Qセルズ 8.0kW搭載</div>
                      <div className="text-[11px] text-stone-600 mt-0.5">年間8,789kWh発電・自家消費＆売電で固定費極小化</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50 transition">
                    <td className="p-4 sm:p-5 font-bold text-stone-900 bg-stone-50/80">毎年の固定資産税</td>
                    <td className="p-4 sm:p-5 text-stone-600">
                      新築建物評価のため高額<br />
                      <span className="text-[11px] text-stone-400">※毎年10万〜15万円前後の税負担</span>
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-emerald-900 bg-amber-50/40 border-l border-amber-200">
                      <div className="text-base sm:text-lg text-emerald-700 font-black">建物評価ほぼ0で大幅節税</div>
                      <div className="text-[11px] text-stone-600 mt-0.5">築25年超の骨組み活用で毎年の税金負担が極小</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50 transition">
                    <td className="p-4 sm:p-5 font-bold text-stone-900 bg-stone-50/80">配管・電気配線インフラ</td>
                    <td className="p-4 sm:p-5 text-stone-600">新築のため新品</td>
                    <td className="p-4 sm:p-5 font-bold text-stone-900 bg-amber-50/40 border-l border-amber-200">
                      <div className="text-base sm:text-lg text-stone-900 font-black">目に見えない配管・配線 全新品</div>
                      <div className="text-[11px] text-stone-600 mt-0.5">表面だけのリフォームではない。突発的な修繕リスク0</div>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50 transition">
                    <td className="p-4 sm:p-5 font-bold text-stone-900 bg-stone-50/80">住み替え・仮住まいの負担</td>
                    <td className="p-4 sm:p-5 text-stone-600">
                      建売会社は「今の家の売却」に無関心<br />
                      <span className="text-[11px] text-stone-400">※リフォームの場合は仮住まい＋2回引越しが必須</span>
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-emerald-900 bg-amber-50/40 border-l border-amber-200">
                      <div className="text-base sm:text-lg text-emerald-700 font-black">引越し1回のみ ＋ 自宅売却支援</div>
                      <div className="text-[11px] text-stone-600 mt-0.5">完成済み即入居・自社不動産部門が自宅売却・買取を窓口代行</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          新強み：仮住まい不要 ＆ 自宅売却・買取ワンストップサポート
      ========================================================================= */}
      <section className="py-20 bg-[#faf8f5] text-stone-900 border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-white via-amber-50/40 to-emerald-50/30 p-8 sm:p-12 rounded-3xl border border-amber-300 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-7/12 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                  <span>50代〜70代に選ばれる最大の理由</span>
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                  「今の家の建て替えやリフォームで、<br />
                  <span className="text-amber-800">仮住まい探しや2回の引っ越し</span>に苦しむのは、もうやめませんか？」
                </h3>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                  50代以上のご夫婦が今の家の寒さや老朽化を感じながらも住み替えをためらう最大の理由は、<strong className="text-stone-900">「仮住まい探しの面倒」「大量の荷物を抱えた2回の引っ越しによる体力・気力の限界」「無駄な仮住まい費用」</strong>です。
                </p>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                  本物件はすでにフルリノベーションが完成しているため、<strong className="text-emerald-800 font-bold">カギを受け取って今の家から1回引っ越すだけ</strong>。仮住まいの心労も無駄な敷金・賃料も一切かかりません。
                </p>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs space-y-2 shadow-sm">
                  <div className="font-bold text-amber-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>不動産事業（スマイチ不動産）直営だからできる「自宅売却・買取ワンストップサポート」</span>
                  </div>
                  <p className="text-stone-600 pl-6 leading-relaxed">
                    「今の家がいくらで売れるか分からない」「売れる前に新しい家を買って大丈夫か」という不安もすべてお任せください。当社が窓口ひとつで現在のご自宅の無料査定・仲介売却・買取相談までトータルでお手伝いいたします。二重ローンの心配なく、新築以上の暖かい暮らしへスムーズにお引越しいただけます。
                  </p>
                </div>
              </div>

              {/* ビジュアルカード */}
              <div className="lg:w-5/12 w-full space-y-3">
                <div className="bg-stone-100 p-5 rounded-2xl border border-stone-200 text-center">
                  <div className="text-xs font-bold text-stone-500 mb-1">一般のリフォーム・建て替えの場合</div>
                  <div className="text-red-600 font-bold text-sm">仮住まい探し ＋ 引越し2回 ＋ 家賃負担</div>
                  <div className="text-[11px] text-stone-500 mt-1">「体力的に無理」「気力が持たない」と挫折</div>
                </div>

                <div className="text-center font-bold text-amber-700 text-lg">▼ 「再進の家」なら</div>

                <div className="bg-gradient-to-r from-amber-100/80 to-emerald-100/80 p-5 rounded-2xl border border-emerald-300 text-center shadow-sm">
                  <div className="text-xs font-bold text-amber-900 mb-1">完成済み ＆ 自社不動産直営サポート</div>
                  <div className="text-emerald-900 font-black text-base sm:text-lg">カギ受取 → 引越し1回だけで即完了！</div>
                  <div className="text-[11px] text-stone-700 mt-2">
                    現在の持ち家売却査定・買取まで窓口一本化。<br />
                    面倒な手続きと不安をゼロにします。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 3D間取り図 ＆ WEBバーチャル内覧ツアー（24時間体感）
      ========================================================================= */}
      <section id="virtual-tour" className="py-20 bg-white text-stone-900 border-t border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>3D間取りパース ＆ 360°WEBバーチャル内覧</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900">
              立体間取りで全体を把握し、360度で中を歩く
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-3 max-w-2xl mx-auto">
              営業マンへの気兼ねは一切不要です。3Dパースで夫婦別室の絶妙な距離感を確かめながら、全天球パノラマですべての部屋を自由にご見学いただけます。
            </p>
          </div>

          {/* 3D間取り図ビューワー */}
          <div className="mb-12 bg-[#faf8f5] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">3D FLOOR PLAN</span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
                  {activePlanFloor === '1f' ? '1階 3D立体間取り図（LDK・夫婦別寝室・水回り）' : '2階 3D立体間取り図（吹き抜け・大容量フリースペース）'}
                </h3>
              </div>

              {/* 1F / 2F 切り替えタブ */}
              <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200">
                <button
                  onClick={() => setActivePlanFloor('1f')}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
                    activePlanFloor === '1f'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  1階 平面3D（メイン居住空間）
                </button>
                <button
                  onClick={() => setActivePlanFloor('2f')}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
                    activePlanFloor === '2f'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  2階 平面3D（趣味・収納・吹き抜け）
                </button>
              </div>
            </div>

            {/* 3D間取り図画像表示 */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-white flex items-center justify-center">
              <img
                src={activePlanFloor === '1f' ? '/assets/saishin/plans/3d_plan_1f.jpg' : '/assets/saishin/plans/3d_plan_2f.jpg'}
                alt={activePlanFloor === '1f' ? '1階 3D立体間取り図' : '2階 3D立体間取り図'}
                className="w-full max-h-[550px] object-contain transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
                {activePlanFloor === '1f' ? '延床面積 77.01㎡（約23.29坪）' : '延床面積 28.89㎡（約8.74坪）'}
              </div>
            </div>

            {/* 間取りの設計解説 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-stone-700">
              <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm">
                <span className="font-bold text-amber-800 block mb-0.5">① 夫婦独立の2寝室（1階）</span>
                お互いの睡眠を邪魔せず、気配を感じられる絶妙なレイアウト。
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm">
                <span className="font-bold text-amber-800 block mb-0.5">② 吹き抜け＆高窓LDK</span>
                杉板天井とシーリングファン。冬も日差しが奥まで届くパノラマ空間。
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm">
                <span className="font-bold text-amber-800 block mb-0.5">③ 2階は大型多目的スペース</span>
                趣味部屋、季節物の大容量収納、来客用スペースとして自在に活用。
              </div>
            </div>
          </div>

          {/* 360度ビューワーコンポーネント */}
          <div className="mb-8">
            <VirtualTour360 />
          </div>

          <div className="text-center">
            <button
              onClick={() => setModalType('tour')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 transition"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>実際に現地を体感する（プライベート見学予約）</span>
            </button>
            <p className="text-xs text-stone-500 mt-2">
              ※1日1組限定。エアコン1台で家全体が暖かい感動をぜひ現地でお確かめください。
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. スペック詳細・温熱データ・周辺環境（正直なスタンス）
      ========================================================================= */}
      <section className="py-20 bg-stone-100 text-stone-900 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-100 px-3 py-1 rounded-full">
              SPEC & ENVIRONMENT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              HEAT20 G2温熱性能 ＆ 周辺環境の正直な事実
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
              50代以上の堅実な方へ、誇大広告のない本質をお伝えします。
            </p>
          </div>

          {/* 温熱シミュレーションデータ */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  温熱シミュレーション実証
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-3 mb-4">
                  冬の未明でも「室温15℃」を下回らない安心
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  HEAT20 G2水準（外皮平均熱貫流率 UA値 0.34W/㎡K相当）。一般的な既存住宅では冬の明け方に室温が8℃〜10℃まで急低下しますが、本住宅は無暖房でも15℃以上をキープ。
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>YKK APW430 高性能樹脂サッシ＋トリプルガラス（アルゴンガス封入）</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>屋根・外壁の通気遮熱銀次郎＋高性能断熱材の隙間なき充填施工</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ヒートショックのリスクを根絶し、健康寿命を延伸</span>
                  </div>
                </div>
              </div>

              {/* 比較グラフ */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <div className="text-xs font-bold text-stone-600 mb-3">冬期（外気温0℃）の明け方最低室温比較</div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-stone-500">昭和50年代の無断熱住宅</span>
                      <span className="font-bold text-red-600">約 5 ℃ 〜 8 ℃（極寒）</span>
                    </div>
                    <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                      <div className="bg-red-400 h-full w-[25%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-stone-500">現行基準の一般新築（等級4）</span>
                      <span className="font-bold text-stone-700">約 10 ℃ 〜 12 ℃</span>
                    </div>
                    <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                      <div className="bg-stone-500 h-full w-[45%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-stone-900">再進の家（HEAT20 G2水準）</span>
                      <span className="font-bold text-emerald-600 text-sm">無暖房で 15 ℃ 以上キープ</span>
                    </div>
                    <div className="w-full bg-stone-200 h-4 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[80%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Qセルズ太陽光発電シミュレーション実証データ */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Qセルズ公式 発電シミュレーション実証
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-3 mb-2">
                  年間推定発電量「8,789 kWh」の創エネ力
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  南面片流れ屋根（傾斜2.0寸）に、世界最高峰の単結晶高効率モジュール<strong className="text-stone-900">「Q.PEAK DUO M-G11 400」を20枚（合計出力8.0kW）</strong>集中配置。最新パワコン（過積載率145.5%）により、朝夕や曇天時でも高効率に発電します。
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-4">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <div className="text-[11px] text-stone-500 font-medium">モジュール出力</div>
                    <div className="text-base font-black text-amber-700">8.0 kW (20枚)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <div className="text-[11px] text-stone-500 font-medium">年間推定発電量</div>
                    <div className="text-base font-black text-amber-700">8,789 kWh</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center col-span-2 sm:col-span-1">
                    <div className="text-[11px] text-stone-500 font-medium">CO2削減換算</div>
                    <div className="text-base font-black text-emerald-700">杉の木 251本分</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>灯油削減 1,995リットル相当 ＆ 石油資源の大幅保全</span>
                  </div>
                  <p className="text-stone-600 pl-5 text-[11px]">
                    夫婦2人暮らしの年間標準消費電力量（約3,500〜4,500 kWh）の約2倍を発電。昼間の自家消費はもちろん、余剰売電による収入が期待できます。
                  </p>
                </div>
              </div>

              {/* 月別発電量グラフ */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-700">月別発電量シミュレーション（kWh/月）</span>
                  <span className="text-[10px] text-stone-500">Qセルズ公式試算データ</span>
                </div>

                <div className="grid grid-cols-6 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">1月</div>
                    <div className="font-extrabold text-stone-800 text-xs">649</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">2月</div>
                    <div className="font-extrabold text-stone-800 text-xs">700</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">3月</div>
                    <div className="font-extrabold text-stone-800 text-xs">831</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">4月</div>
                    <div className="font-extrabold text-stone-800 text-xs">891</div>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-lg border border-amber-300">
                    <div className="text-[10px] text-amber-800 font-bold">5月(最高)</div>
                    <div className="font-black text-amber-900 text-xs">931</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">6月</div>
                    <div className="font-extrabold text-stone-800 text-xs">772</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">7月</div>
                    <div className="font-extrabold text-stone-800 text-xs">770</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">8月</div>
                    <div className="font-extrabold text-stone-800 text-xs">864</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">9月</div>
                    <div className="font-extrabold text-stone-800 text-xs">620</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">10月</div>
                    <div className="font-extrabold text-stone-800 text-xs">609</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">11月</div>
                    <div className="font-extrabold text-stone-800 text-xs">556</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-bold">12月</div>
                    <div className="font-extrabold text-stone-800 text-xs">595</div>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-stone-100 text-[11px] text-stone-600 text-center">
                  日照時間が短い冬場でも月550〜700kWh、春〜夏は770〜930kWhの超安定発電
                </div>
              </div>
            </div>
          </div>

          {/* 周辺環境の正直な事実（ペルソナへの誠実なメッセージ） */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>周辺環境とアクセスについて</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-3">
                  立地の不便さは隠しません。<br />
                  その分「静寂・環境・建物性能」に全振りしています。
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  東武東上線「高坂」駅までバス11分。駅徒歩圏ではないため、日々の移動はお車またはバスが前提となります。
                </p>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  しかし、駅前の喧騒や高額な地価にコストを割く代わりに、<strong className="text-stone-900">澄み切った空気、小鳥のさえずる静けさ、開放的な角地の陽当たり、そして新築以上の建物性能</strong>を手に入れることができます。
                </p>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                  <strong className="text-stone-900 block mb-1">生活インフラはしっかり確保：</strong>
                  タウン内には循環バスが運行し、サブセンターバス停まで徒歩3分。スーパー（西友・コープ等）や診療所、郵便局が整っており、日常生活に不自由はありません。
                </div>
              </div>

              {/* ドローン環境動画 */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md relative">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 sm:h-80 object-cover"
                >
                  <source src="/assets/saishin/videos/nature_drone.mp4" type="video/mp4" />
                </video>
                <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
                  鳩山ニュータウン 高台の美しい街並み
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5.5. 奥様目線の生活実感 Q&A（エモーショナル・リアルライフ安心設計）
      ========================================================================= */}
      <section className="py-20 bg-[#f7f3eb] text-stone-900 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-800 tracking-widest uppercase bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-amber-700" />
              <span>REAL LIFE Q&A ｜ 奥様目線の暮らし実感</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 mt-3 leading-snug">
              「エアコン1台で本当に寒くないの？」<br />
              奥様が一番気になる5つの疑問に率直にお答えします
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              UA値や工法などの難しい建築用語よりも大切なのは、<strong>「毎朝、毎晩、どれだけ体がラクに、笑顔で暮らせるか」</strong>。
              これからのご夫婦お二人の生活実感をまとめました。
            </p>
          </div>

          <div className="space-y-5">
            {/* Q1: 朝の寒さと夜のトイレ */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                  Q1
                </span>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    真冬の朝、布団から出る時の足元の冷たさや、夜中のトイレは本当に寒くありませんか？
                  </h3>
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-start gap-3 text-stone-700 text-xs sm:text-sm leading-relaxed">
                    <span className="flex-shrink-0 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs mt-0.5">
                      回答
                    </span>
                    <div className="space-y-2">
                      <p className="font-bold text-stone-900">
                        靴下を探さずにスリッパなしでも歩けます。夜中に起きたときの身震いするような寒さとも無縁です。
                      </p>
                      <p className="text-stone-600">
                        HEAT20 G2基準を満たす超高断熱（樹脂トリプルガラス＋付加断熱）により、エアコン1台を20℃前後のゆるやかな設定にしておくだけで、LDKだけでなく廊下・トイレ・洗面所まで室温差がほとんど生じません。「朝起きるのが億劫でなくなった」「冬でも手足が冷えない」という心地よさを現地でご体感いただけます。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Q2: お風呂・脱衣所のヒートショック */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                  Q2
                </span>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    冬場のお風呂や脱衣所で倒れる「ヒートショック」が一番不安です。高齢になっても大丈夫ですか？
                  </h3>
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-start gap-3 text-stone-700 text-xs sm:text-sm leading-relaxed">
                    <span className="flex-shrink-0 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs mt-0.5">
                      回答
                    </span>
                    <div className="space-y-2">
                      <p className="font-bold text-stone-900">
                        服を脱ぐときの寒さがなく、心臓や血管への負担を劇的に減らします。
                      </p>
                      <p className="text-stone-600">
                        日本の住まいでヒートショックが起きる最大の原因は「暖かい居間」と「凍える脱衣所・浴室」の10℃以上の温度差です。再進の家は家全体が魔法瓶のように断熱されているため、脱衣所とお風呂場もリビングに近い温度を保ちます。湯冷めしにくく、長風呂で体を痛めるリスクも予防できます。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Q3: 太陽光8.0kWと冬の暖房代 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                  Q3
                </span>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    「エアコンを一日中つけっぱなしにしたら電気代が跳ね上がるのでは？」と我慢してしまいそうです。
                  </h3>
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-start gap-3 text-stone-700 text-xs sm:text-sm leading-relaxed">
                    <span className="flex-shrink-0 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs mt-0.5">
                      回答
                    </span>
                    <div className="space-y-2">
                      <p className="font-bold text-stone-900">
                        Qセルズ大容量8.0kW太陽光（年間発電8,789kWh）が稼働するため、電気代を我慢する生活は終わります。
                      </p>
                      <p className="text-stone-600">
                        一般的な住宅の倍近い8.0kWソーラーを搭載しており、晴れた日中にたっぷり創エネ。高気密・高断熱住宅は一度暖まると熱が逃げないため、エアコンを細かく消すよりも「弱で一定運転」する方が消費電力が極めて少なくなります。年金暮らしでも電気代の請求書に怯える心配はありません。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Q4: 水回りのお手入れ・お掃除 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                  Q4
                </span>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    水回り（キッチン・浴室・洗面）のお掃除やお手入れの負担はどう変わりますか？
                  </h3>
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-start gap-3 text-stone-700 text-xs sm:text-sm leading-relaxed">
                    <span className="flex-shrink-0 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs mt-0.5">
                      回答
                    </span>
                    <div className="space-y-2">
                      <p className="font-bold text-stone-900">
                        タカラスタンダードの「高品位ホーロー」を採用。油汚れも水垢もサッと水拭きだけで落ちます。
                      </p>
                      <p className="text-stone-600">
                        キッチンとお風呂は完全新品。金属にガラス質を高熱で焼き付けたホーロー素材は、油性ペンで落書きしても水拭きで消えるほど頑丈で傷つきません。ゴシゴシ洗いの重労働やカビ取り剤のツンとした臭いから解放され、家事の時間をゆったりとした読書やお茶の時間に変えられます。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Q5: 2階建てだけど将来の足腰は？平屋ライク動線 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                  Q5
                </span>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    2階建てですが、将来足腰が痛くなったり階段がつらくなったらどう暮らせばいいですか？
                  </h3>
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-start gap-3 text-stone-700 text-xs sm:text-sm leading-relaxed">
                    <span className="flex-shrink-0 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs mt-0.5">
                      回答
                    </span>
                    <div className="space-y-2">
                      <p className="font-bold text-stone-900">
                        日常の生活はすべて「1階だけで完結する平屋感覚」で過ごせる間取り設計です。
                      </p>
                      <p className="text-stone-600">
                        1階にLDK（約16帖）・新品水回り・そして約8帖の主寝室（セカンド寝室）が揃っているため、普段の食事・就寝・着替え・お風呂で階段を1段も上る必要がありません。2階は、書斎・趣味の道具置き場、あるいは盆正月に子どもたちやお孫さんが泊まりに来たときの専用ゲストルームとして、無理なく使い分けができます。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 現地体感への誘導バナー */}
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-100/80 to-amber-50 border border-amber-300 text-center">
            <h4 className="text-base sm:text-lg font-extrabold text-stone-900 mb-2">
              「本当に暖かいかどうか」は、ご夫婦で現地でお確かめください
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 mb-6 max-w-xl mx-auto">
              百聞は一見にしかず。冷え込みの厳しい日ほど、この家の真価がはっきりと分かります。<br className="hidden sm:inline" />
              強引な営業はいたしませんので、お茶を飲むようなお気持ちでお気軽にお越しください。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setModalType('tour')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/10 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>冬の快適体感 ＆ 光熱費試算会を予約する（無料）</span>
              </button>
              <button
                onClick={() => setModalType('doc')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 shadow-sm transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>無料ガイドブックを請求する</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. 物件概要
      ========================================================================= */}
      <section className="py-20 bg-stone-50 text-stone-900 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-100 px-3 py-1 rounded-full">
              PROPERTY OUTLINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
              物件概要
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              安心の売主直売・仲介手数料不要。詳細な図面や検査書類もすべて現地でご確認いただけます。
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">物件名称</span>
              <span className="p-3.5 sm:p-4 text-stone-900 font-bold flex-1 w-full">再進の家（鳩山ニュータウン高性能再生住宅）</span>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200 bg-amber-50/40">
              <span className="p-3.5 sm:p-4 bg-amber-100/60 font-bold text-amber-900 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">価格</span>
              <div className="p-3.5 sm:p-4 text-amber-900 font-extrabold text-lg sm:text-xl flex-1 w-full flex items-baseline gap-2">
                2,180 万円 <span className="text-xs font-normal text-stone-600">（税込 / 土地・建物総額）</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">所在地</span>
              <div className="p-3.5 sm:p-4 text-stone-900 space-y-1 flex-1 w-full">
                <div>埼玉県比企郡鳩山町鳩ｹ丘2丁目867番400</div>
                <div className="text-stone-600 text-xs">（住居表示）埼玉県比企郡鳩山町鳩ｹ丘2-9-8</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">交通</span>
              <span className="p-3.5 sm:p-4 text-stone-900 flex-1 w-full">
                東武東上線「高坂」駅 バス11分、サブセンターバス停より徒歩3分
              </span>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">土地</span>
              <div className="p-3.5 sm:p-4 text-stone-900 flex-1 w-full">
                正味面積：239.93㎡（約72.57坪） / 私道他なし
              </div>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">建物</span>
              <div className="p-3.5 sm:p-4 text-stone-900 space-y-1 flex-1 w-full">
                <div>1階：77.01㎡、2階：28.89㎡（延床面積：105.90㎡ / 約32.03坪）</div>
                <div className="text-stone-600 text-xs">木造鋼板葺き / 昭和51年6月30日 築（フルスケルトン性能向上リノベーション済）</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">法令上の制限</span>
              <div className="p-3.5 sm:p-4 text-stone-900 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs flex-1 w-full">
                <div><span className="font-semibold text-stone-700">土地権利：</span>所有権</div>
                <div><span className="font-semibold text-stone-700">地目：</span>宅地</div>
                <div><span className="font-semibold text-stone-700">都市計画：</span>市街化区域</div>
                <div><span className="font-semibold text-stone-700">用途地域：</span>第1種低層住居専用地域</div>
                <div className="sm:col-span-2"><span className="font-semibold text-stone-700">建ぺい率 / 容積率：</span>50（60）％ / 80％</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">備考・道路</span>
              <div className="p-3.5 sm:p-4 text-stone-900 space-y-1 flex-1 w-full">
                <div><span className="font-semibold text-stone-700">設備：</span>公営水道・東京電力・本下水</div>
                <div><span className="font-semibold text-stone-700">接道（角地）：</span>南西9.9m公道に約15m接道、南東5.8m公道に約12m接道</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">温熱・性能仕様</span>
              <div className="p-3.5 sm:p-4 text-stone-900 space-y-1 flex-1 w-full">
                <div className="font-semibold text-stone-800">HEAT20 G2水準超高断熱（冬期無暖房でも朝15℃を下回らない家）</div>
                <div className="text-stone-600 text-xs">
                  YKK APW430高性能トリプルガラス樹脂窓 / 屋根・壁付加断熱 / ホウ酸防腐防蟻処理 / フルスケルトン耐震補強・金物緊結
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-stone-200">
              <span className="p-3.5 sm:p-4 bg-stone-100 font-bold text-stone-700 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">創エネ・主要設備</span>
              <div className="p-3.5 sm:p-4 text-stone-900 space-y-1 flex-1 w-full">
                <div>Qセルズ太陽光発電 8.0kW（20枚・年間推定発電量 8,789 kWh）＋高効率エコキュート（電気代相殺・売電設計）</div>
                <div className="text-stone-600 text-xs">
                  タカラスタンダード高品位ホーローシステムキッチン・ホーローユニットバス / LIXIL洗面化粧台 / TOTOウォシュレット
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row bg-emerald-50/50">
              <span className="p-3.5 sm:p-4 bg-emerald-100/60 font-bold text-emerald-900 sm:w-48 sm:shrink-0 sm:border-r border-stone-200 flex items-center">取引態様</span>
              <span className="p-3.5 sm:p-4 md:col-span-3 text-emerald-900 font-bold flex-1 w-full">
                売主（※仲介手数料 約85万円不要 ｜ 自宅売却・買取査定ワンストップ対応）
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. 開発者・設計者の声（人間関係を売る開発ストーリー）
      ========================================================================= */}
      <section className="py-20 bg-[#fcfaf7] text-stone-900 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-amber-800 tracking-widest uppercase bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300">
              DEVELOPER'S HEART
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-3 text-stone-900">
              「なぜ、私たちはこの家をつくったのか？」
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 font-medium">
              一生懸命働いて子育てを終えられたご夫婦へ、大工と建築士がどうしても伝えたかった想い
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-xl space-y-6 text-sm sm:text-base leading-relaxed text-stone-700">
            <p className="font-bold text-stone-900 text-base sm:text-lg leading-snug">
              「子育てを終え、これからの人生をご夫婦お二人で穏やかに楽しみたい――。<br className="hidden sm:inline" />
              そんな大切なお客様が、3,000万円以上もする新築建売を買って高額なローンに怯えたり、冬の寒さで体を壊したりする姿を、私たちはどうしても見たくありませんでした。」
            </p>
            <p>
              だからこそ、あえて建物評価額が低く固定資産税の負担が極めて少ない『築25年超の良質な優良骨組み』を厳選。無駄な購入コストを極限まで削り、浮いた予算のすべてを<strong className="text-amber-900 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">『真冬でも靴下がいらない、HEAT20 G2超の極暖断熱』</strong>と、<strong className="text-amber-900 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">『電気代高騰を相殺するQセルズ8.0kW太陽光発電』</strong>、そして<strong className="text-amber-900 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">『見えない配管・電気配線の完全新品交換』</strong>に注ぎ込みました。
            </p>
            <p>
              子ども部屋のための広いだけの家はいりません。さらに、今の家の建て替えに伴う『仮住まい探し』や『2回の過酷な引越し』という心労を完全になくし、カギを受け取って引越し1回だけで新しい生活がスタートできる安心の体制を整えました。
            </p>
            <p className="text-amber-900 font-semibold bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              ご夫婦2人が健康で、お金の心配なく、一生安心して笑って暮らせる『人生後半の最高の拠点』をお届けしたい――それが私たちの唯一の願いです。
            </p>
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500 font-medium">
                株式会社 住ま居る / すまいる設計（建築士・熟練大工 施工チーム）
              </div>
              <button
                onClick={() => onNavigate ? onNavigate('saishin-tech') : (window.location.href = '/saishin/technology')}
                className="text-amber-800 hover:text-amber-900 text-xs font-bold flex items-center gap-1 transition group"
              >
                <span className="group-hover:underline">詳しい構造計算と再生工程コラムを読む</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. クロージング（段階式オファー：心理的ハードルの低い手挙げの誘導）
      ========================================================================= */}
      <section className="py-20 bg-[#2b2725] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <span className="text-xs font-bold text-amber-300 tracking-widest uppercase bg-amber-950/80 border border-amber-500/40 px-3.5 py-1 rounded-full inline-block mb-3">
            STEP-BY-STEP OFFERS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black mb-4 text-white">
            「賢いセカンドライフ」を一歩踏み出したいご夫婦へ。<br />
            無理のない2つの安心ステップ
          </h2>
          <p className="text-stone-300 text-xs sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            強引な売り込みや突然の訪問営業は一切いたしません。まずは無料ガイドブックでゆっくりご検討いただくか、現地でエアコン1台の暖かさをご体感ください。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto mb-12">
            {/* オファー1：無料ガイドブック */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#383330] border border-stone-600 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-300 bg-stone-700/80 px-2.5 py-1 rounded-full">
                  オファー 01（Web/PDF・無料）
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-3 mb-2 leading-snug">
                  『50代〜70代のための失敗しない家選び：老後資金を守り、夫婦で健康に暮らす高断熱リノベの秘密』
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-6">
                  新築建売との生涯コスト比較データ、Qセルズ年間8,789kWh発電シミュレーション根拠、見えない配管施工写真、自宅売却の進め方をまとめた特製小冊子を進呈。
                </p>
              </div>
              <button
                onClick={() => setModalType('doc')}
                className="w-full py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-2 text-xs sm:text-sm shadow"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>無料ガイドブックを請求する（即時）</span>
              </button>
            </div>

            {/* オファー2：現地体感会 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#383330] to-amber-950/60 border border-amber-500/50 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-900/60 px-2.5 py-1 rounded-full border border-amber-500/40">
                  オファー 02（1日2組限定・完全予約制）
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-3 mb-2 leading-snug">
                  「エアコン1台で本当に家中暖かいの？」<br />
                  冬の快適体感 ＆ 光熱費試算会
                </h3>
                <p className="text-xs text-stone-200 leading-relaxed mb-6">
                  他の来場者を気にせず、エアコン1台で家じゅう暖かい空気感と静寂を現地体感。現在お住まいのご自宅の売却・買取査定のご相談も窓口ひとつで承ります。
                </p>
              </div>
              <button
                onClick={() => setModalType('tour')}
                className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Calendar className="w-4 h-4 text-stone-950" />
                <span>体感会・光熱費試算会を予約する</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          フッター
      ========================================================================= */}
      <footer className="bg-[#1f1c1a] text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="font-bold text-stone-200 text-sm">
            株式会社 住ま居る / すまいる設計
          </div>
          <p className="text-stone-400 max-w-xl mx-auto leading-relaxed">
            〒350-2224 埼玉県鶴ヶ島市町屋176番地5<br />
            建設業許可：埼玉県知事(般-8)第66822号 / 宅地建物取引業：埼玉県知事(3)第23725号<br />
            建築士事務所登録：埼玉県知事 第(5)10278号
          </p>
          <div className="text-stone-500 text-[11px] pt-4 border-t border-stone-800">
            © 2026 SMILE Co., Ltd. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* =========================================================================
          モーダル（資料請求 / 内覧予約フォーム）
      ========================================================================= */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative text-stone-900">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                {modalType === 'doc' ? 'DOCUMENT' : 'RESERVATION'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2">
                {modalType === 'doc'
                  ? '『50代〜70代のための失敗しない家選び』無料ガイドブック請求'
                  : '【1日2組限定】冬の快適体感 ＆ 光熱費試算会 予約'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {modalType === 'doc'
                  ? '新築との生涯コスト比較・Qセルズ8.0kW年間8,789kWh試算・自宅売却サポート資料を即時送付'
                  : 'エアコン1台で家じゅう暖かい空間を現地体感。現在のお住まいの売却・買取相談も承ります'}
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">お名前 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="山田 太郎"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">お電話番号 <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="090-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="taro@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">ご希望や現在のお住まいのご相談（任意）</label>
                <textarea
                  rows="3"
                  placeholder="現在住んでいる自宅の売却査定も希望、週末の午前に見学したい、など"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                className="w-full py-3.5 rounded-xl font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20 transition flex items-center justify-center gap-2"
              >
                {formSubmitted ? (
                  <span>送信中...</span>
                ) : (
                  <span>{modalType === 'doc' ? '無料ガイドブック（PDF）を請求する' : '体感会・光熱費試算会を予約する（無料）'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
