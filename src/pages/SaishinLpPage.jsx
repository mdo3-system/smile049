import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Flame, 
  Coins, 
  MapPin, 
  FileText, 
  Calendar, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles, 
  Eye, 
  Compass, 
  Home, 
  Train, 
  Layers, 
  HeartHandshake, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import VirtualTour360 from '../components/VirtualTour360';

export default function SaishinLpPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [modalType, setModalType] = useState(null); // 'doc' or 'tour'
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setModalType(null);
      setFormSubmitted(false);
      alert('お問い合わせありがとうございます。担当建築士より速やかにご連絡申し上げます。');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* =========================================================================
          1. 固定トップバー（ブランド＆問い合わせ導線）
      ========================================================================= */}
      <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shadow-md">
              再
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base md:text-lg">再進の家</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  鳩山ニュータウン
                </span>
              </div>
              <p className="text-[10px] text-stone-400 hidden sm:block">ほぼ光熱費0円・HEAT20 G2 高性能再生住宅</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="tel:0120953450"
              className="hidden md:flex items-center gap-1.5 text-xs text-stone-300 hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>0120-95-3450</span>
            </a>
            <button
              onClick={() => setModalType('doc')}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs font-bold bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700 transition"
            >
              資料請求（PDF）
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/30 transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>内覧予約</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. ファーストビュー（実物LDKシネマティック動画背景）
      ========================================================================= */}
      <section className="relative w-full h-[88vh] min-h-[600px] max-h-[920px] bg-stone-950 flex items-center justify-center overflow-hidden">
        {/* 背景動画 (Veo 3生成 実物一致LDKウォークスルー) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/saishin/sales/sales_01.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transform transition-transform duration-1000"
        >
          <source src="/assets/saishin/videos/hero_ldk.mp4" type="video/mp4" />
        </video>

        {/* 高級グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70" />

        {/* ヒーローコンテンツ */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-medium tracking-widest text-amber-300 mb-6 shadow-xl animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>自社物件・売主直接販売（仲介手数料 0円）</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.2] mb-6 drop-shadow-md">
            新築以上の安心と、大人のゆとり。<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              光熱費ほぼゼロの「終の住処」
            </span>
          </h1>

          <p className="text-base sm:text-xl text-stone-200 max-w-3xl mx-auto mb-8 font-normal leading-relaxed drop-shadow">
            鳩山ニュータウン。一級建築士が躯体からフルスケルトン再生。<br className="hidden sm:inline" />
            新築3,000万円超と同等以上のHEAT20 G2超高断熱を、<span className="font-bold text-amber-300 underline underline-offset-4">2,100万円</span>で。
          </p>

          {/* 3大キラーフックバッジ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10 text-left">
            <div className="bg-stone-900/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">太陽光×HEAT20 G2</div>
                <div className="text-sm font-bold text-white">ほぼ光熱費0円生活</div>
              </div>
            </div>

            <div className="bg-stone-900/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">築年数で建物評価ゼロ</div>
                <div className="text-sm font-bold text-white">固定資産税が激減</div>
              </div>
            </div>

            <div className="bg-stone-900/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 font-medium">スケルトン躯体再生</div>
                <div className="text-sm font-bold text-white">配管・配線も全更新</div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#virtual-tour"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 group"
            >
              <Eye className="w-4 h-4 text-stone-950" />
              <span>24時間 WEBバーチャル内覧へ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setModalType('tour')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>現地体感内覧会（エアコン1台の暖かさを体感）</span>
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
          3. 共感と課題提起（50代・60代の心の声を代弁）
      ========================================================================= */}
      <section className="py-20 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-100 px-3 py-1 rounded-full">
              Insight
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              「今の家、寒くて広すぎて、<br className="hidden sm:inline" />持て余していませんか？」
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3">
              子育てが一段落した50代・60代の皆様が抱える、共通の切実な悩みがあります。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">冬の寒さとヒートショックの不安</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  築30年超の家は断熱性能が低く、冬の廊下や脱衣所が極寒。毎年の暖房費も高騰し、将来の健康寿命に不安がある。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">子供が独立し、2階が物置化</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  階段の上り下りが負担になり、使わない部屋の掃除ばかり。夫婦二人で暮らすには広すぎて無駄が多い。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">定年後の光熱費・固定資産税の重荷</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  新築に3,500万円払うと老後資金が圧迫される。かといって今の家に住み続けても、電気代と修繕費が重くのしかかる。
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-1">生活リズムの違いと夫婦の距離感</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  就寝時間や趣味が異なるため寝室は別にしたいが、完全に孤立するのではなく、お互いの気配は感じていたい。
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl text-white text-center shadow-xl">
            <h3 className="text-lg sm:text-2xl font-black mb-3">
              そのお悩み、すべて「再進の家」が解決します。
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed max-w-2xl mx-auto">
              ただの中古住宅でも、表面的な化粧リフォームでもありません。<br />
              建築士が構造躯体と断熱ラインを新築以上に再構築した、全く新しい合理的な選択肢です。
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 3大コアバリュー（選ばれる理由）
      ========================================================================= */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase">CORE VALUES</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-2">
              なぜ「再進の家」なのか？ 3つの決定的な価値
            </h2>
          </div>

          {/* バリュー1: 経済合理性 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4">
                <Coins className="w-4 h-4" />
                <span>VALUE 01. 経済的な安心</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight mb-4">
                新築より1,000万円以上浮き、<br />
                老後の固定費（光熱費・税金）が極小化。
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                一般的な高断熱新築住宅（3,200万円超）に対し、本物件は<span className="font-bold text-stone-900">2,100万円（税込）</span>。
                初期費用で浮いた約1,000万円は、老後のゆとり資金やご夫婦での旅行へ。
              </p>

              <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs sm:text-sm mb-6">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900">太陽光自家消費で「光熱費ほぼ0円」：</span>
                    <span className="text-stone-600">HEAT20 G2基準＋大容量太陽光で、毎月の電気代不安を解消。</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900">建物の固定資産税評価額が「ほぼゼロ」：</span>
                    <span className="text-stone-600">新築なら年15〜20万円かかる固定資産税が、築年数により土地分等のわずかな金額で済みます。</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900">「大人の休日倶楽部」で巡るゆとりの旅：</span>
                    <span className="text-stone-600">浮いた住居費で、新幹線グリーン車を使った国内旅行や温泉巡りを無理なく楽しめます。</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 p-8 rounded-3xl text-white shadow-xl border border-stone-800">
              <h4 className="text-sm font-bold text-stone-400 mb-4 tracking-wider">生涯住居コストシミュレーション比較</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-300">一般的な新築高性能住宅</span>
                    <span className="font-bold text-stone-300">約 4,200 万円（30年）</span>
                  </div>
                  <div className="w-full h-4 bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-stone-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">本体3,200万 ＋ 固定資産税（年18万×30年）＋ 光熱費</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-400 font-bold">再進の家（鳩山ニュータウン）</span>
                    <span className="font-bold text-amber-400">約 2,300 万円（30年）</span>
                  </div>
                  <div className="w-full h-4 bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                  <div className="text-[11px] text-amber-300 font-medium mt-1">本体2,100万 ＋ 固定資産税激減 ＋ 光熱費ほぼ0円</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-800 text-center">
                <span className="text-xs text-stone-400">30年間で生み出される「ゆとり資金」</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
                  約 1,900 万円の差額効果
                </div>
              </div>
            </div>
          </div>

          {/* バリュー2: 構造躯体と断熱の安心（一級建築士の技術エビデンス） */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200">
                  <img
                    src="/assets/saishin/construction/step_06.jpg"
                    alt="木造スケルトン解体と梁の現し"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-2.5 bg-white text-[11px] font-bold text-stone-800 text-center">
                    内部全撤去・スケルトン現し
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200">
                  <img
                    src="/assets/saishin/construction/step_07.jpg"
                    alt="銀次郎 遮熱通気スペーサー施工"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-2.5 bg-white text-[11px] font-bold text-stone-800 text-center">
                    銀次郎 遮熱通気スペーサー
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200">
                  <img
                    src="/assets/saishin/sales/sales_06.jpg"
                    alt="高断熱サッシと明るい室内"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-2.5 bg-white text-[11px] font-bold text-stone-800 text-center">
                    新品高断熱サッシ・窓枠
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200">
                  <img
                    src="/assets/saishin/sales/sales_05.jpg"
                    alt="新品洗面化粧台・水回り"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-2.5 bg-white text-[11px] font-bold text-stone-800 text-center">
                    配管全更新・新品設備導入
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4">
                <Layers className="w-4 h-4" />
                <span>VALUE 02. 見えない部分の安心</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight mb-4">
                上辺だけの化粧直しではない。<br />
                躯体・配管・配線まで新築以上に再生。
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                普通のリフォームは壁紙やキッチンを取り替えるだけですが、「再進の家」は内部壁・床・天井をすべて撤去。
                一級建築士が構造安全性を確認した上で、柱・梁を金物補強し、見えないインフラまで一新しています。
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block mb-1">■ HEAT20 G2基準・超高断熱設計</span>
                  <span className="text-stone-600">
                    同等仕様での当社実績では、真冬の無暖房でも明け方14℃以上を維持。生活熱だけで約20℃近くを保ち、ヒートショックリスクをゼロに近づけます。
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block mb-1">■ 給排水管・電気配線の全面更新</span>
                  <span className="text-stone-600">
                    築古で最も怖い「隠蔽配管の漏水事故」を防ぐため、床下・壁内のインフラ設備を新品にリプレイス。向こう30年以上安心です。
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* バリュー3: つかず離れずの空間設計 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-4">
                <HeartHandshake className="w-4 h-4" />
                <span>VALUE 03. 大人のゆとり空間</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight mb-4">
                寝室は別々、でも気配は感じる。<br />
                熟年夫婦に心地よい「絶妙な距離感」。
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                お互いの睡眠時間や個人の時間を尊重しながら、引き戸を開ければ光と風が通り抜ける設計。
                吹き抜けから落ちる朝の光を浴びながら、広々としたリビングで穏やかな時間を共有できます。
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm text-stone-700">
                <p className="font-bold text-amber-900 mb-1">「夜の読書も、朝の起床も、気兼ねなく。」</p>
                引き戸の開閉ひとつで、個室にも一体の大空間にも可変。自然な空気循環により、どの部屋にいても温度差がありません。
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200 relative group">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-80 object-cover"
              >
                <source src="/assets/saishin/videos/corridor_flow.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
                廊下と建具から差し込む陽光
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. 24時間 WEBバーチャル内覧会（360度ビューワー組み込み）
      ========================================================================= */}
      <section id="virtual-tour" className="py-20 bg-stone-900 text-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>24時間 無人営業・いつでも見学可能</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">
              WEBバーチャル内覧ツアー
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-3 max-w-2xl mx-auto">
              営業マンへの気兼ねは一切不要です。画面をドラッグまたはスワイプして、360度すべての空間をご自身のペースでお確かめください。
            </p>
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
              ※1日1組限定。エアコン1台で家全体が暖かい感動をぜひ現地で体感してください。
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. 立地と環境（鳩山ニュータウン・高台の静謐なリトリート）
      ========================================================================= */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200 relative">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-80 sm:h-96 object-cover"
              >
                <source src="/assets/saishin/videos/nature_drone.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
                鳩山ニュータウン 高台の美しい街並み
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-100 px-3 py-1 rounded-full">
                LOCATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3 mb-4">
                喧騒から離れた高台。<br />
                美味しい空気と景色に包まれる日常路。
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                都心の駅近では決して手に入らない、静寂と圧倒的な開放感。
                見晴らしの良い高台に位置し、毎朝の美味しい空気の中で楽しむ散歩が、ご夫婦二人の日課と健康づくりに直結します。
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <div className="font-bold text-stone-900 mb-0.5">閑静な第一種低層</div>
                  <div className="text-stone-500">高い建物がなく日当たり抜群</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <div className="font-bold text-stone-900 mb-0.5">高台の強固な地盤</div>
                  <div className="text-stone-500">水害リスクのない安心立地</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. 不動産事業との連携：自宅売却・住み替えワンストップ相談
      ========================================================================= */}
      <section className="py-20 bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-4 border border-white/20">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>宅地建物取引業者免許保有・ワンストップ対応</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            「今の家をどう売却するか」も、<br />
            当社が一括してお引き受けします。
          </h2>

          <p className="text-stone-200 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            住み替えで最も不安なのは、「今住んでいる家がいくらで売れるか、残債や手続きはどうなるか」です。<br />
            当社は不動産事業も直営しているため、現在のお住まいの査定・売却・処分から、本物件への住み替え資金計画までワンストップでサポートいたします。
          </p>

          <button
            onClick={() => setModalType('tour')}
            className="px-8 py-4 rounded-xl text-sm font-bold bg-white text-stone-900 hover:bg-stone-100 shadow-xl transition"
          >
            ご自宅の売却・住み替えを相談する
          </button>
        </div>
      </section>

      {/* =========================================================================
          8. 物件概要
      ========================================================================= */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 text-center mb-10">
            物件概要
          </h2>

          <div className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden text-xs sm:text-sm">
            <div className="grid grid-cols-3 p-4 border-b border-stone-200">
              <span className="font-bold text-stone-700">物件名称</span>
              <span className="col-span-2 text-stone-900 font-semibold">再進の家（鳩山ニュータウン）</span>
            </div>
            <div className="grid grid-cols-3 p-4 border-b border-stone-200 bg-white">
              <span className="font-bold text-stone-700">販売価格</span>
              <span className="col-span-2 text-stone-900 font-bold text-amber-700 text-base">
                2,100 万円（税込）
              </span>
            </div>
            <div className="grid grid-cols-3 p-4 border-b border-stone-200">
              <span className="font-bold text-stone-700">所在地</span>
              <span className="col-span-2 text-stone-900">埼玉県比企郡鳩山町（鳩山ニュータウン内）</span>
            </div>
            <div className="grid grid-cols-3 p-4 border-b border-stone-200 bg-white">
              <span className="font-bold text-stone-700">建物構造</span>
              <span className="col-span-2 text-stone-900">木造スレート葺2階建（フルスケルトン再生）</span>
            </div>
            <div className="grid grid-cols-3 p-4 border-b border-stone-200">
              <span className="font-bold text-stone-700">温熱・省エネ性能</span>
              <span className="col-span-2 text-stone-900">
                HEAT20 G2基準超高断熱 / 大容量太陽光発電自家消費システム / オール電化
              </span>
            </div>
            <div className="grid grid-cols-3 p-4 border-b border-stone-200 bg-white">
              <span className="font-bold text-stone-700">主要改修部位</span>
              <span className="col-span-2 text-stone-900">
                構造躯体補強・配管全更新・電気配線全更新・外壁屋根遮熱塗装・新品サッシ・新品設備
              </span>
            </div>
            <div className="grid grid-cols-3 p-4">
              <span className="font-bold text-stone-700">取引態様</span>
              <span className="col-span-2 text-stone-900 font-bold text-emerald-700">
                売主（※仲介手数料 約75万円が不要です）
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. 3大事業（スマイチ × 不動産 × リフォーム）相互ナビゲーション
      ========================================================================= */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-stone-500 tracking-wider uppercase">GROUP NETWORK</span>
            <h3 className="text-xl font-bold text-stone-900 mt-1">スマイチ × 不動産 × リフォーム</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition text-left group"
            >
              <div className="text-xs font-bold text-amber-700 mb-1">木造自由設計ガレージ・倉庫</div>
              <div className="text-base font-bold text-stone-900 flex items-center justify-between">
                <span>スマイチ本体</span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-stone-500 mt-1">3Dシミュレーターで自分で描ける木造ガレージ</p>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('eie')}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition text-left group"
            >
              <div className="text-xs font-bold text-emerald-700 mb-1">土地探し×ガレージ / 売り地5区画</div>
              <div className="text-base font-bold text-stone-900 flex items-center justify-between">
                <span>スマイチ不動産 (EIE)</span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-stone-500 mt-1">中古を買ってガレージを建てる・預かり物件</p>
            </button>

            <button
              onClick={() => onNavigate && onNavigate('re')}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition text-left group"
            >
              <div className="text-xs font-bold text-blue-700 mb-1">性能向上フルリノベーション</div>
              <div className="text-base font-bold text-stone-900 flex items-center justify-between">
                <span>スマイチリフォーム (RE)</span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-stone-500 mt-1">今のお住まいをHEAT20 G2クラスへフル再生</p>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. フッター
      ========================================================================= */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="font-bold text-stone-200 text-sm">
            株式会社 住ま居る / すまいる設計
          </div>
          <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
            〒350-2224 埼玉県鶴ヶ島市町屋176番地5<br />
            建設業許可：埼玉県知事(般-4)第66822号 / 宅地建物取引業：埼玉県知事(2)第23725号<br />
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
                  ? '構造計算の根拠・改修前後の図面・温熱計算データを即時ご案内'
                  : '1日1組限定。エアコン1台で家中快適な暖かさをじっくり体感'}
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
