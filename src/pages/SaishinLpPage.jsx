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
  TrendingDown
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
    setTimeout(() => {
      alert('お問い合わせありがとうございます。担当者より迅速にご案内いたします。');
      setModalType(null);
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-amber-500 selection:text-white">
      {/* =========================================================================
          LP専用上部バー & 3大コンテンツナビゲーション
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 text-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-white text-base sm:text-lg tracking-wider">
              再進の家 <span className="text-amber-400 font-normal text-xs sm:text-sm">｜ 鳩山ニュータウン</span>
            </span>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              HEAT20 G2・自社物件直売
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>資料請求(PDF)</span>
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-950" />
              <span>プライベート内覧会</span>
            </button>
          </div>
        </div>

        {/* 3ページのLP（販売戦略 3大コンテンツナビゲーション） */}
        <div className="bg-stone-900 border-t border-stone-800/80 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-8 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
            <span className="text-stone-400 px-2 py-1 shrink-0 font-medium">【LP構成】</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-md bg-amber-500 text-stone-950 shrink-0 flex items-center gap-1 shadow-sm"
            >
              <span>① 総合案内（全体ストーリー）</span>
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('saishin-tech') : (window.location.href = '/saishin/technology')}
              className="px-3 py-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800 shrink-0 flex items-center gap-1 transition"
            >
              <span>② 構造・技術エビデンス詳説</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('saishin-spec') : (window.location.href = '/saishin/spec')}
              className="px-3 py-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800 shrink-0 flex items-center gap-1 transition"
            >
              <span>③ 物件スペック＆周辺環境</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-semibold tracking-wider text-amber-300 mb-6 shadow-xl animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>自社物件・売主直接販売（仲介手数料 約85万円が不要）</span>
          </div>

          {/* メインコピー */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.25] mb-6 drop-shadow-lg">
            新築の約2/3の価格で叶える、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              光熱費ゼロの終の住処
            </span>
          </h1>

          {/* サブコピー */}
          <p className="text-base sm:text-xl text-stone-200 max-w-3xl mx-auto mb-8 font-normal leading-relaxed drop-shadow">
            鳩山ニュータウン・<span className="font-extrabold text-amber-300 underline underline-offset-4">2,180万円（税込）</span>。<br className="hidden sm:inline" />
            HEAT20 G2の超高断熱と、建築士と大工さんが躯体から生まれ変わらせた<br className="hidden sm:inline" />
            「技術で裏付けられた安心」を。
          </p>

          {/* 権威付けバッジ（アイコン配置） */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-left">
            <div className="bg-stone-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">耐震金物補強</div>
                <div className="text-xs sm:text-sm font-bold text-white">構造計算実施済み</div>
              </div>
            </div>

            <div className="bg-stone-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">隠蔽インフラ一新</div>
                <div className="text-xs sm:text-sm font-bold text-white">配管・電気配線リプレイス</div>
              </div>
            </div>

            <div className="bg-stone-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">大容量7.1kWh</div>
                <div className="text-xs sm:text-sm font-bold text-white">太陽光発電搭載</div>
              </div>
            </div>

            <div className="bg-stone-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">真冬も無暖房15℃</div>
                <div className="text-xs sm:text-sm font-bold text-white">HEAT20 G2超高断熱</div>
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
            <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-100 px-3 py-1 rounded-full">
              PROBLEM & EMPATHY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3 leading-snug">
              「今の家、こんなお悩みはありませんか？」
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3">
              子育てが一段落し、これからの人生をゆったりと過ごしたいご夫婦が直面する切実な現実。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">子供が独立して2階を持て余している</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  急な階段の上り下りが億劫になり、使わない部屋の掃除ばかり。夫婦二人で暮らすには広すぎて手入れが追いつかない。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">冬場、廊下やトイレが寒くてヒートショックが心配</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  リビングを出ると身震いする寒さ。お風呂場やトイレの急激な温度差が、将来の血圧や健康寿命に大きな不安を与えている。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">定年後の年金生活で、毎月の高い光熱費や家の修繕費が不安</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  高騰し続ける電気代・ガス代。新築に3,500万円以上かけると虎の子の老後資金が枯渇し、かといって今の家も修繕費が重くのしかかる。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">夫婦それぞれのペースで生活したいが、今の間取りでは気を遣う</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  就寝時間や起きる時間、趣味のテレビや読書。お互いを尊重して寝室を分けたいが、完全に孤立するのは寂しい。
                </p>
              </div>
            </div>
          </div>

          {/* 解決の提示 */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white text-center shadow-xl border border-stone-700">
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-full inline-block mb-3">
              THE ANSWER
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-200 mb-3">
              「そのお悩み、すべてこの家で解決できます。」
            </h3>
            <p className="text-stone-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
              立地や華美な装飾ではなく、日々の健康・ランニングコスト・夫婦の心地よい距離感にコストを全集中させた、新しい住まいの解答です。
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. 3つのコア・バリュー（選ばれる理由）
      ========================================================================= */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
              CORE VALUES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-3">
              なぜ「再進の家」が選ばれるのか<br />
              <span className="text-stone-400 text-base sm:text-xl font-normal">
                本質を見極める大人のための3つの確信
              </span>
            </h2>
          </div>

          <div className="space-y-16">
            {/* -------------------------------------------------------------
                ① 経済的な安心：2,180万円で実現する「ランニングコスト・ゼロ」の暮らし
            ------------------------------------------------------------- */}
            <div className="p-8 sm:p-10 rounded-3xl bg-stone-800/80 border border-stone-700 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4">
                    <Coins className="w-4 h-4" />
                    <span>コア・バリュー 01</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-snug">
                    経済的な安心：<br />
                    2,180万円で実現する「ランニングコスト・ゼロ」の暮らし
                  </h3>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
                    初期費用を新築（約3,200万〜4,200万円）から<strong className="text-amber-300">約1,000万円以上抑制</strong>。さらにHEAT20 G2クラスの超高断熱と太陽光発電7.1kWhの自家消費によって、毎月の光熱費を実質極小化します。
                  </p>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-6">
                    浮いた資金で、ご夫婦での国内旅行や温泉巡り、趣味の時間を存分に楽しむ余裕が生まれます。築年数による建物評価額の逓減により、<strong className="text-emerald-400">将来の固定資産税も極めて安価</strong>に抑えられます。
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-700">
                      <div className="text-stone-400 mb-1">初期費用の抑制</div>
                      <div className="text-lg font-black text-amber-400">約 1,000 万円 浮く</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-700">
                      <div className="text-stone-400 mb-1">30年の生涯コスト差額</div>
                      <div className="text-lg font-black text-emerald-400">約 1,820 万円 軽減</div>
                    </div>
                  </div>
                </div>

                {/* 新築との生涯コストシミュレーショングラフ */}
                <div className="lg:w-1/2 w-full bg-stone-950 p-6 rounded-2xl border border-stone-700">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center justify-between">
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
                    <span className="text-xs text-amber-300 font-bold">
                      浮いた約1,820万円は、ご夫婦の豊かな時間・旅行・健康維持のために。
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                ② 構造的な安心：プロの目で躯体から見直した「見えない部分」へのこだわり
            ------------------------------------------------------------- */}
            <div className="p-8 sm:p-10 rounded-3xl bg-stone-800/80 border border-stone-700 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4">
                <Wrench className="w-4 h-4" />
                <span>コア・バリュー 02（最大の差別化ポイント）</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                構造的な安心：プロの目で躯体から見直した「見えない部分」へのこだわり
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-8">
                上辺だけの壁紙やキッチンの交換ではありません。建築士と熟練大工が一度すべての骨組み（フルスケルトン）まで解体し、木造建築の深い知見と構造計算に基づいて躯体を強固に再構築しました。
              </p>

              {/* 4枚の実写・現場構造証拠写真 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-700">
                  <img
                    src="/assets/saishin/features/feat_01_skeleton.jpg"
                    alt="スケルトン解体・構造金物補強"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-bold text-white mb-1">01. フルスケルトン金物補強</div>
                    <div className="text-[11px] text-stone-400">柱・梁・筋交いを現わしにし、最新基準の金物で緊結・耐震補強。</div>
                  </div>
                </div>

                <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-700">
                  <img
                    src="/assets/saishin/features/feat_02_ginjiro.jpg"
                    alt="遮熱通気スペーサー銀次郎"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-bold text-white mb-1">02. 遮熱通気部材「銀次郎」</div>
                    <div className="text-[11px] text-stone-400">屋根垂木下に通気層を確保し、夏の輻射熱を完全遮断。</div>
                  </div>
                </div>

                <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-700">
                  <img
                    src="/assets/saishin/features/feat_03_window.jpg"
                    alt="YKK APW430高性能トリプルガラス樹脂窓"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-bold text-white mb-1">03. トリプル樹脂サッシ</div>
                    <div className="text-[11px] text-stone-400">世界水準の断熱窓を採用。結露を根絶し高窓から採光。</div>
                  </div>
                </div>

                <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-700">
                  <img
                    src="/assets/saishin/features/feat_04_plumbing.jpg"
                    alt="給排水管・電気配線の完全リプレイス"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-bold text-white mb-1">04. 配管・インフラ完全更新</div>
                    <div className="text-[11px] text-stone-400">床下・壁内の給水・給湯・排水・電気配線を新品に交換。</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-stone-300">
                  <strong className="text-white">建築技術者としての本気度：</strong> なぜここまでの構造補強・断熱改修が必要なのか、CAD断面図や構造計算データを公開しています。
                </div>
                <button
                  onClick={() => onNavigate ? onNavigate('saishin-tech') : (window.location.href = '/saishin/technology')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition"
                >
                  <span>構造・技術エビデンスを詳しく読む</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------
                ③ 暮らしのゆとり：つかず離れず、自然と調和する大人の空間
            ------------------------------------------------------------- */}
            <div className="p-8 sm:p-10 rounded-3xl bg-stone-800/80 border border-stone-700 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-4">
                <Compass className="w-4 h-4" />
                <span>コア・バリュー 03</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-snug">
                暮らしのゆとり：つかず離れず、自然と調和する大人の空間
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
                夫婦であっても、就寝時間や読書・テレビの趣味は異なります。それぞれのプライベート時間を尊重できるよう、1階に<strong className="text-amber-300">独立した2つの寝室</strong>を配置しました。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-300">
                <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-700">
                  <div className="font-bold text-white text-base mb-2">気配を感じる絶妙な距離感</div>
                  <p className="text-xs leading-relaxed text-stone-400">
                    リビングと廊下を挟んで適度な距離を保ちながら、物音や明かりでお互いの安心感を確認できる設計。平屋感覚で1階だけで生活が完結します。
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-700">
                  <div className="font-bold text-white text-base mb-2">美味しい空気を吸いながらの散歩が日課に</div>
                  <p className="text-xs leading-relaxed text-stone-400">
                    南東・南西角地で窓を開ければ澄んだ空気と見晴らしの良い景色。喧騒のない閑静な住宅街での朝夕の散歩が、お二人の健康的な新しい習慣になります。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 3D間取り図 ＆ WEBバーチャル内覧ツアー（24時間体感）
      ========================================================================= */}
      <section id="virtual-tour" className="py-20 bg-stone-950 text-white border-t border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>3D間取りパース ＆ 360°WEBバーチャル内覧</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">
              立体間取りで全体を把握し、360度で中を歩く
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-3 max-w-2xl mx-auto">
              営業マンへの気兼ねは一切不要です。3Dパースで夫婦別室の絶妙な距離感を確かめながら、全天球パノラマですべての部屋を自由にご見学いただけます。
            </p>
          </div>

          {/* 3D間取り図ビューワー */}
          <div className="mb-12 bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">3D FLOOR PLAN</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {activePlanFloor === '1f' ? '1階 3D立体間取り図（LDK・夫婦別寝室・水回り）' : '2階 3D立体間取り図（吹き抜け・大容量フリースペース）'}
                </h3>
              </div>

              {/* 1F / 2F 切り替えタブ */}
              <div className="flex p-1 bg-stone-950 rounded-xl border border-stone-800">
                <button
                  onClick={() => setActivePlanFloor('1f')}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
                    activePlanFloor === '1f'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  1階 平面3D（メイン居住空間）
                </button>
                <button
                  onClick={() => setActivePlanFloor('2f')}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
                    activePlanFloor === '2f'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  2階 平面3D（趣味・収納・吹き抜け）
                </button>
              </div>
            </div>

            {/* 3D間取り図画像表示 */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 flex items-center justify-center">
              <img
                src={activePlanFloor === '1f' ? '/assets/saishin/plans/3d_plan_1f.jpg' : '/assets/saishin/plans/3d_plan_2f.jpg'}
                alt={activePlanFloor === '1f' ? '1階 3D立体間取り図' : '2階 3D立体間取り図'}
                className="w-full max-h-[550px] object-contain transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-stone-300 text-xs border border-white/10">
                {activePlanFloor === '1f' ? '延床面積 77.01㎡（約23.29坪）' : '延床面積 28.89㎡（約8.74坪）'}
              </div>
            </div>

            {/* 間取りの設計解説 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-stone-300">
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="font-bold text-amber-400 block mb-0.5">① 夫婦独立の2寝室（1階）</span>
                お互いの睡眠を邪魔せず、気配を感じられる絶妙なレイアウト。
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="font-bold text-amber-400 block mb-0.5">② 吹き抜け＆高窓LDK</span>
                杉板天井とシーリングファン。冬も日差しが奥まで届くパノラマ空間。
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="font-bold text-amber-400 block mb-0.5">③ 2階は大型多目的スペース</span>
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xl shadow-amber-500/20 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>実際に現地を体感する（プライベート見学予約）</span>
            </button>
            <p className="text-xs text-stone-400 mt-2">
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
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">物件名称</span>
              <span className="p-4 md:col-span-3 text-stone-900 font-bold">再進の家（鳩山ニュータウン高性能再生住宅）</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200 bg-amber-50/40">
              <span className="p-4 bg-amber-100/60 font-bold text-amber-900 md:border-r border-stone-200">価格</span>
              <span className="p-4 md:col-span-3 text-amber-900 font-extrabold text-lg sm:text-xl flex items-baseline gap-2">
                2,180 万円 <span className="text-xs font-normal text-stone-600">（税込 / 土地・建物総額）</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">所在地</span>
              <div className="p-4 md:col-span-3 text-stone-900 space-y-1">
                <div>埼玉県比企郡鳩山町鳩ｹ丘2丁目867番400</div>
                <div className="text-stone-600 text-xs">（住居表示）埼玉県比企郡鳩山町鳩ｹ丘2-9-8</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">交通</span>
              <span className="p-4 md:col-span-3 text-stone-900">
                東武東上線「高坂」駅 バス11分、サブセンターバス停より徒歩3分
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">土地</span>
              <div className="p-4 md:col-span-3 text-stone-900">
                正味面積：239.93㎡（約72.57坪） / 私道他なし
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">建物</span>
              <div className="p-4 md:col-span-3 text-stone-900 space-y-1">
                <div>1階：77.01㎡、2階：28.89㎡（延床面積：105.90㎡ / 約32.03坪）</div>
                <div className="text-stone-600 text-xs">木造鋼板葺き / 昭和51年6月30日 築（フルスケルトン性能向上リノベーション済）</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">法令上の制限</span>
              <div className="p-4 md:col-span-3 text-stone-900 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div><span className="font-semibold text-stone-700">土地権利：</span>所有権</div>
                <div><span className="font-semibold text-stone-700">地目：</span>宅地</div>
                <div><span className="font-semibold text-stone-700">都市計画：</span>市街化区域</div>
                <div><span className="font-semibold text-stone-700">用途地域：</span>第1種低層住居専用地域</div>
                <div className="sm:col-span-2"><span className="font-semibold text-stone-700">建ぺい率 / 容積率：</span>50（60）％ / 80％</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">備考・道路</span>
              <div className="p-4 md:col-span-3 text-stone-900 space-y-1">
                <div><span className="font-semibold text-stone-700">設備：</span>公営水道・東京電力・本下水</div>
                <div><span className="font-semibold text-stone-700">接道（角地）：</span>南西9.9m公道に約15m接道、南東5.8m公道に約12m接道</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">温熱・性能仕様</span>
              <div className="p-4 md:col-span-3 text-stone-900 space-y-1">
                <div className="font-semibold text-stone-800">HEAT20 G2水準超高断熱（冬期無暖房でも朝15℃を下回らない家）</div>
                <div className="text-stone-600 text-xs">
                  YKK APW430高性能トリプルガラス樹脂窓 / 屋根・壁付加断熱 / ホウ酸防腐防蟻処理 / フルスケルトン耐震補強・金物緊結
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">創エネ・主要設備</span>
              <div className="p-4 md:col-span-3 text-stone-900 space-y-1">
                <div>太陽光発電 7.1kWh（自家消費システム）＋高効率エコキュート（ほぼ光熱費実質ゼロ設計）</div>
                <div className="text-stone-600 text-xs">
                  タカラスタンダード高品位ホーローシステムキッチン・ホーローユニットバス / LIXIL洗面化粧台 / TOTOウォシュレット
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 bg-emerald-50/50">
              <span className="p-4 bg-emerald-100/60 font-bold text-emerald-900 md:border-r border-stone-200">取引態様</span>
              <span className="p-4 md:col-span-3 text-emerald-900 font-bold">
                売主（※仲介手数料 約85万円が不要です）
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. 開発者・設計者の声（建築士と大工の再生ストーリー）
      ========================================================================= */}
      <section className="py-20 bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
              DEVELOPER'S VOICE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-3">
              開発者・設計者の想い
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-2">
              理系層やこだわり派の方へ。なぜ私たちがこの家を造ったのか。
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-stone-800/80 border border-stone-700 shadow-xl space-y-6 text-sm sm:text-base leading-relaxed text-stone-300">
            <p>
              「日本の住宅は、築30年を過ぎると資産価値がゼロと見なされ、壊して新築を建てるのが通例でした。しかし、それはあまりにも不経済であり、お客様の大切な老後資金を消耗させてしまいます。」
            </p>
            <p>
              「私たちは建築士と熟練大工がタッグを組み、一度骨組みまで丸裸にすることで、既存の良質な柱や梁を活かしながら最新の耐震金物で補強し、世界水準の断熱材と遮熱通気層、新品の給排水管と電気配線を組み込みました。新築以上の暖かさと耐震性を持ちながら、価格は新築の2/3である2,180万円に抑える——これが、私たちが提示するこれからの住宅の最適解です。」
            </p>
            <div className="pt-4 border-t border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-400">
                株式会社 住ま居る / すまいる設計（建築士・熟練大工 施工チーム）
              </div>
              <button
                onClick={() => onNavigate ? onNavigate('saishin-tech') : (window.location.href = '/saishin/technology')}
                className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1 transition"
              >
                <span>詳しい構造計算と再生工程コラムを読む</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. クロージング（CTA：行動喚起）
      ========================================================================= */}
      <section className="py-20 bg-stone-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <span className="text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-full inline-block mb-3">
            NEXT ACTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            「本質を見極めたい」あなたへ。<br />
            2つの選べるアプローチ
          </h2>
          <p className="text-stone-400 text-xs sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            無理な営業やしつこい電話は一切いたしません。まずはじっくり資料で検証いただくか、現地でエアコン1台の暖かさをご体感ください。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto mb-12">
            {/* ハードルの低いオファー */}
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-400 bg-stone-800 px-2.5 py-1 rounded-full">
                  STEP 1（お気軽に）
                </span>
                <h3 className="text-lg font-bold text-white mt-3 mb-2">
                  詳細資料（PDF）を見てみる
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed mb-6">
                  間取り詳細図、構造計算根拠、温熱シミュレーションデータ、周辺アクセス詳細をまとめた特製資料をご送付します。
                </p>
              </div>
              <button
                onClick={() => setModalType('doc')}
                className="w-full py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>資料請求する（無料・即時）</span>
              </button>
            </div>

            {/* 本気度の高いオファー */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 to-amber-950/40 border border-amber-500/30 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                  STEP 2（1日1組限定）
                </span>
                <h3 className="text-lg font-bold text-white mt-3 mb-2">
                  現地体感型・プライベート内覧会
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-6">
                  他の来場者を気にせず、エアコン1台で家全体が暖かい空気感、静寂と眺望をご夫婦でゆっくり体感いただけます。
                </p>
              </div>
              <button
                onClick={() => setModalType('tour')}
                className="w-full py-3.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Calendar className="w-4 h-4 text-stone-950" />
                <span>現地内覧会を予約する（無料）</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          フッター
      ========================================================================= */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="font-bold text-stone-200 text-sm">
            株式会社 住ま居る / すまいる設計
          </div>
          <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
            〒350-2224 埼玉県鶴ヶ島市町屋176番地5<br />
            建設業許可：埼玉県知事(般-8)第66822号 / 宅地建物取引業：埼玉県知事(3)第23725号<br />
            建築士事務所登録：埼玉県知事 第(5)10278号
          </p>
          <div className="text-stone-600 text-[11px] pt-4 border-t border-stone-900">
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
                  ? '詳細資料（PDF）の無料ご請求'
                  : '現地プライベート体感見学会のご予約'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {modalType === 'doc'
                  ? '間取り詳細・構造計算の根拠・温熱シミュレーション資料をご送付'
                  : '1日1組限定。エアコン1台で家全体が快適な暖かさを現地で体感'}
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
                <label className="block font-bold text-stone-700 mb-1">ご希望や現在のお住まいのご相談</label>
                <textarea
                  rows="3"
                  placeholder="自宅の売却も相談したい、週末の午前中に見学希望、など"
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
                  <span>{modalType === 'doc' ? '資料を請求する（無料）' : '見学を予約する（無料）'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
