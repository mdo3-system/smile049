import React, { useState } from 'react';
import SubsidyFinderSection from '../components/SubsidyFinderSection';
import ReformMortgageSection from '../components/ReformMortgageSection';
import MortgageFinderSection from '../components/MortgageFinderSection';
import RenoveBeforeAfterSlider from '../components/RenoveBeforeAfterSlider';
import Plan3dAiModal from '../components/Plan3dAiModal';
import EmotionalMangaViewer from '../components/EmotionalMangaViewer';
import { 
  Hammer, 
  Flame, 
  Sun, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  FileText, 
  Home, 
  Wrench,
  Coins,
  Sparkles,
  Camera,
  MapPin,
  Banknote,
  DoorOpen,
  Check,
  Building,
  Car,
  Zap,
  Droplets,
  Paintbrush
} from 'lucide-react';

export default function ReRenovationPage({ onNavigate }) {
  const [isPlan3dModalOpen, setIsPlan3dModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      alert('リフォーム・高断熱リノベーションのご相談・現地建物調査のお申し込みを受け付けました。専任担当者よりご連絡差し上げます。');
      setFormSubmitted(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header (Clean Emerald & Forest Tone) */}
      <header 
        style={{ backgroundColor: 'rgba(6, 78, 59, 0.98)' }}
        className="sticky top-0 z-50 backdrop-blur border-b border-emerald-600 text-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-white text-sm shadow-md">
              RE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base md:text-lg">スマイチ リフォーム (RE)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-400/30 text-emerald-200 border border-emerald-400/50 font-bold">
                  3DパースAI ＆ 性能向上リフォーム
                </span>
              </div>
              <p className="text-[10px] text-emerald-100/80 hidden sm:block">AI 3Dパースで楽しくリフォーム / 埼玉県西部エリア限定（自社社員電気工事）</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsPlan3dModalOpen(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-md transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">自宅図面</span>
              <span>3DパースAI</span>
            </button>
            <a
              href="#subsidies"
              className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition font-bold"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>補助金ナビ</span>
            </a>
            <a
              href="#mortgage-reform"
              className="hidden lg:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-stone-900 text-stone-300 border border-stone-800 hover:text-white transition font-bold"
            >
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
              <span>借換・無担保ローン</span>
            </a>
            <a
              href="#evidence-section"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-900/80 text-teal-200 border border-teal-500/40 hover:bg-teal-700 hover:text-white transition flex items-center gap-1 shadow-md"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>技術の裏付け・実績</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero: AIを使った3Dパース生成で、家族みんなで楽しむリフォーム！ (明るいグリーン基調) */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/40 text-stone-900 text-center overflow-hidden border-b border-emerald-200">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-400/15 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>何度でも無料！スマホでポチッと3Dパース体験</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-black border border-teal-300">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>埼玉県西部エリア限定（自社社員の電気工事士が責任施工）</span>
            </span>
          </div>

          {/* ① メインタイトル：AIを使った3Dパース生成で、家族みんなで楽しむリフォーム！ */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4 text-stone-900">
            AIを使った3Dパース生成で、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              家族みんなで楽しむリフォーム！
            </span>
          </h1>

          <div className="text-base sm:text-xl font-extrabold text-stone-800 max-w-3xl mx-auto mb-4 leading-relaxed">
            自宅の間取り図や写真を撮るだけ！ボタンをポチッと押せば、憧れの北欧リビングやホテルライクなお風呂が3Dで目の前に！
          </div>

          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            「お風呂を温かいユニットバスにしたい」「キッチンの油汚れタイルをお手入れ簡単なキッチンボードと食洗機にしたい」「トイレにエコカラットを取り入れたい」…<br className="hidden sm:inline" />
            家族で「これだ！」と決まるまで何枚でも遊んで、そのままワンタップで見積もり・現地調査へ！
          </p>

          {/* 安心の裏付け（控えめに表示） */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-300 mb-8 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>【安心の技術裏付け】フルスケルトン再生・長期優良住宅認定も手掛ける熟練技術集団が自社施工</span>
          </div>

          {/* 3DパースAI CTA & 各種ナビボタン（高コントラスト視認性抜群仕様） */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-10">
            <button
              onClick={() => setIsPlan3dModalOpen(true)}
              style={{ backgroundColor: '#059669', color: '#ffffff' }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-700/30 transition transform hover:-translate-y-0.5 border-2 border-emerald-400 cursor-pointer"
            >
              <Camera className="w-5 h-5 text-white" />
              <span className="text-white font-black">自宅の図面を撮影 ➔ 簡単ボタンで3Dリフォームパース生成</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            <a
              href="#reform-services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-sm shadow-md transition border-2 border-emerald-300"
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>主力リフォームメニュー一覧</span>
            </a>

            <a
              href="#subsidies"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm shadow-md transition border-2 border-stone-300"
            >
              <Coins className="w-4 h-4 text-amber-600" />
              <span>リフォーム補助金自動診断</span>
            </a>
          </div>

          {/* ② 3D生成から見積もり・面談・完成までのワクワクストーリー漫画 */}
          <EmotionalMangaViewer 
            onOpenModal={() => setIsPlan3dModalOpen(true)} 
            defaultTab="reformFun"
          />

          {/* 3大安心技術エビデンス（明るいホワイトカード仕様） */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left mt-8">
            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-xs mb-1">
                <Hammer className="w-4 h-4 text-emerald-600" />
                <span>フルスケルトン再生の確かな大工技術</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                内部全解体し、傷んだ柱の交換・耐震梁の追設・基礎補強までやり切る技術力。器具1つの交換でも下地を見逃しません。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-teal-200 shadow-sm">
              <div className="flex items-center gap-2 text-teal-800 font-black text-xs mb-1">
                <Zap className="w-4 h-4 text-teal-600" />
                <span>電気工事はすべて自社社員が施工</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                下請け任せにせず、自社の有資格電気工事士が直接施工。エアコン専用回路やIH、太陽光・蓄電池も安心安全。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-cyan-200 shadow-sm">
              <div className="flex items-center gap-2 text-cyan-800 font-black text-xs mb-1">
                <Building className="w-4 h-4 text-cyan-600" />
                <span>長期優良住宅認定 取得実績</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                難易度の高い中古住宅での長期優良住宅認定（増改築）を取得。公的な性能基準をクリアする構造・温熱設計力。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 【主力業務一覧】水回り設備・給湯器・エアコン・太陽光・カーポート・外装 */}
      {/* 【主力業務一覧】水回り設備・給湯器・エアコン・太陽光・カーポート・外装 */}
      <section id="reform-services" className="py-16 bg-emerald-950 text-emerald-50 border-b border-emerald-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black text-emerald-300 bg-emerald-900/90 px-3.5 py-1.5 rounded-full uppercase border border-emerald-500/50 shadow-sm">
              OUR MAIN REFORM SERVICES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
              スマイチの主力リフォーム業務メニュー
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
              埼玉県西部エリア限定だから迅速・丁寧。器具1台の交換からトータル工事まで、確かな技術で承ります。各工事のビフォーアフターをご覧ください。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. お風呂（UBへの変換） */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    お風呂（在来タイル ➔ 高断熱UB変換）
                  </h3>
                </div>

                {/* ビフォーアフター画像サムネイル */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-700/60">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/bath_before.jpg" 
                      alt="お風呂リフォーム前" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-stone-900/90 text-stone-200 text-[9px] font-black px-1.5 py-0.5 rounded">Before: 在来タイル</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/bath_after_aligned.jpg" 
                      alt="お風呂リフォーム後" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">After: ほっカラリUB</span>
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  冬場ヒートショックが怖い冷たい在来タイル風呂を、高断熱ユニットバス（UB）へ丸ごと変換。TOTOほっカラリ床・魔法びん浴槽・浴室暖房乾燥機で極上の温もりへ。
                </p>
              </div>
              <div className="text-[11px] text-emerald-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ ユニットバス変換工事 ＋ 高断熱仕様対応
              </div>
            </div>

            {/* 2. キッチン（キッチンボード＆深型食洗機） */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    キッチン（キッチンボード ＆ 深型食洗機）
                  </h3>
                </div>

                {/* ビフォーアフター画像サムネイル */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-700/60">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/kitchen_before.jpg" 
                      alt="キッチンリフォーム前" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-stone-900/90 text-stone-200 text-[9px] font-black px-1.5 py-0.5 rounded">Before: 目地タイル</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/kitchen_after.jpg" 
                      alt="キッチンリフォーム後" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">After: キッチンボード</span>
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  油汚れが染み込むタイル壁を高品位キッチンボードに変えて、サッと一拭きのお手入れフリーへ！大容量スライド収納と深型食洗機（ミーレ/パナ）で毎日の洗い物ストレスゼロ。
                </p>
              </div>
              <div className="text-[11px] text-emerald-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ お手入れ激変キッチンボード ＆ 食洗機設置
              </div>
            </div>

            {/* 3. トイレ（エコカラット調湿壁 ＆ 超節水） */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Home className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    トイレ（エコカラット調湿壁 ＆ 超節水）
                  </h3>
                </div>

                {/* ビフォーアフター画像サムネイル */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-700/60">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/toilet_before.jpg" 
                      alt="トイレビフォー" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-stone-900/90 text-stone-200 text-[9px] font-black px-1.5 py-0.5 rounded">Before: 旧型13L</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/toilet_after.jpg" 
                      alt="トイレアフター" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">After: エコカラット壁</span>
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  LIXILエコカラットをアクセント壁に施工し、気になるニオイと湿気を天然呼吸で強力消臭・調湿。超節水タンクレストイレと手洗いカウンターで清潔なホテルライク空間へ。
                </p>
              </div>
              <div className="text-[11px] text-amber-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ エコカラット壁デザイン ＋ 節水タンクレストイレ
              </div>
            </div>

            {/* 4. 洗面化粧台交換 ＆ 内装クロス貼り替え */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    洗面化粧台交換 ＆ 内装一新リフレッシュ
                  </h3>
                </div>

                {/* ビフォーアフター画像サムネイル */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-700/60">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/washroom_before_single.jpg" 
                      alt="洗面化粧台ビフォー" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-stone-900/90 text-stone-200 text-[9px] font-black px-1.5 py-0.5 rounded">Before: プラ洗面台</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/washroom_after_aligned.jpg" 
                      alt="洗面化粧台アフター" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-teal-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">After: 三面鏡LED</span>
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  古くなった洗面台をワイド三面鏡LED洗面化粧台へ交換。同時に湿気で傷んだ壁紙クロスと防カビ・防汚クッションフロアも貼り替え、洗面脱衣室全体を明るく生まれ変わらせます。
                </p>
              </div>
              <div className="text-[11px] text-teal-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ 三面鏡LED洗面化粧台 ＋ 壁・床内装トータル施工
              </div>
            </div>

            {/* 5. 内窓インプラス＆窓断熱リフォーム */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    内窓インプラス ＆ 先進的窓リノベ
                  </h3>
                </div>

                {/* ビフォーアフター画像サムネイル */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-700/60">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/window_before.jpg" 
                      alt="窓ビフォー" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-stone-900/90 text-stone-200 text-[9px] font-black px-1.5 py-0.5 rounded">Before: 単板ガラス</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-800">
                    <img 
                      src="/assets/renovation/window_after.jpg" 
                      alt="窓アフター" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-cyan-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">After: LIXIL内窓</span>
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  既存の窓の内側にもう1枚樹脂窓を取り付けるだけで、結露ゼロ＆冷暖房費を最大40%削減！「先進的窓リノベ事業」補助金（最大200万円）を即時値引き適用。
                </p>
              </div>
              <div className="text-[11px] text-cyan-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ 国の先進的窓リノベ補助金（最大200万）即時適用
              </div>
            </div>

            {/* 6. 給湯器交換（自社電気工事・最短即日） */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-300 flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    高効率給湯器（エコキュート / エコジョーズ）
                  </h3>
                </div>

                {/* ビフォーアフター図解 */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-700/60">
                  <div className="p-3 bg-stone-850 rounded-xl text-center flex flex-col justify-center aspect-[4/3]">
                    <div className="text-[10px] text-stone-400 font-bold">Before: 旧型給湯器</div>
                    <div className="text-sm font-black text-stone-300 mt-1">従来型ガス/石油</div>
                    <div className="text-[9px] text-stone-400 mt-1">熱効率約80%・高光熱費</div>
                  </div>
                  <div className="p-3 bg-emerald-900/80 rounded-xl text-center flex flex-col justify-center border border-emerald-500/50 aspect-[4/3]">
                    <div className="text-[10px] text-emerald-300 font-bold">After: エコ給湯器</div>
                    <div className="text-sm font-black text-emerald-300 mt-1">熱効率 95%超</div>
                    <div className="text-[9px] text-emerald-100 mt-1">国の補助金 最大13万引</div>
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  突然のお湯トラブルにも迅速対応。高効率ガス給湯器エコジョーズやヒートポンプ式エコキュートへの交換。国の「給湯省エネ事業（最大13万円）」補助金も即時適用。
                </p>
              </div>
              <div className="text-[11px] text-red-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ 国の給湯省エネ補助金（最大13万）即時値引き対応
              </div>
            </div>

            {/* 7. エアコン交換（自社社員電気工事） */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    エアコン交換・増設（自社社員施工）
                  </h3>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  省エネエアコンの交換・新設。下請け任せにせず【自社社員の電気工事士】が直接施工するため、専用電源回路の増設や外壁化粧カバー、隠蔽配管工事も美しく長寿命に仕上げます。
                </p>
              </div>
              <div className="text-[11px] text-blue-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ 電気工事はすべて自社社員が責任施工
              </div>
            </div>

            {/* 8. 太陽光発電設備 ＆ 蓄電池設置 */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    太陽光発電設備 ＆ 蓄電池設置
                  </h3>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  電気代高騰から家計を守る屋根太陽光パネル設置。屋根の耐荷重・瓦の劣化診断から、自社電気工事士による配線連系・蓄電池ハイブリッドシステムまで一貫施工。
                </p>
              </div>
              <div className="text-[11px] text-amber-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ 構造診断 ＋ 自社電気工事で雨漏りリスクゼロ
              </div>
            </div>

            {/* 9. カーポート設置・外構リフォーム */}
            <div className="p-6 rounded-3xl bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 transition shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white">
                    カーポート設置・外構リフォーム
                  </h3>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
                  愛車を雨や紫外線、鳥糞から守る耐風圧・遮熱ポリカーボネート屋根カーポート（1台〜2台用）。雨の日の荷物の出し入れやお子様の乗り降りも濡れずに快適。土間コンクリート打ちも一括対応。
                </p>
              </div>
              <div className="text-[11px] text-purple-200 font-bold bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-center">
                ★ 耐風圧カーポート ＋ 土間コンクリート一括施工
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 【最大の目玉】AI 3Dパース ＆ マイいえカルテ ＆ 見積もり・現地調査直行セクション */}
      <section className="py-12 bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-950 border-y border-emerald-500/40 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-900/95 to-emerald-950/95 border-2 border-emerald-400/60 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-400/50 text-emerald-200 text-xs font-black tracking-wide shadow-sm">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>スマイチ リフォーム最大の目玉サービス（無料・使い放題）</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  自宅の図面・現況写真から<br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                    3Dパース生成 ➔「マイいえカルテ」にストック！
                  </span>
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
                  スマホで「現在の間取り図」や「今のお部屋の写真」を撮ってアップするだけ。直感的なボタン操作で、北欧モダンやホテルライクなど多彩な3Dパースを瞬時に生成し、家族専用のカルテに何枚でも保存できます。
                </p>
                <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-600/50 flex items-start gap-3 shadow-inner">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-black text-sm">
                    💡
                  </div>
                  <div className="text-xs text-emerald-100 leading-relaxed">
                    <strong className="text-emerald-300">「これだ！」が決まったらワンタップで見積もり・現地調査依頼へ：</strong><br />
                    ストックしたパースから気に入った1枚を選び、希望日時（第1〜第3希望）を添えて送信するだけで、専任担当者が現地調査と精密概算見積もりをスムーズにご案内します。
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlan3dModalOpen(true)}
                  className="px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-base shadow-2xl shadow-emerald-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-3 border border-emerald-300 text-center"
                >
                  <Camera className="w-5 h-5 text-stone-950" />
                  <span>今すぐ図面・写真をUPして3Dパース体験</span>
                  <ArrowRight className="w-5 h-5 text-stone-950" />
                </button>
                <div className="text-center text-[11px] text-stone-400">
                  ※ 登録後、何枚でも無料でお試しいただけます
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After 劇的比較スライダー */}
      <RenoveBeforeAfterSlider onOpenModal={() => setIsPlan3dModalOpen(true)} />

      {/* ③ 妻目線（家事・収納ストレス解放）4大リノベ提案 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full uppercase border border-emerald-200">
              FOR FAMILY & LIFESTYLE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              妻側目線で考える「家事・収納ストレスからの完全解放」
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              ただ綺麗にするだけではありません。毎日の家事動線、お掃除、収納不足を根底から解消する4つのリノベ提案。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 特徴 1: 死んだ勝手口の敷地境界ストッカー化 */}
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 hover:border-emerald-300 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-5">
                <DoorOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                1. 死んだ勝手口を「敷地境界いっぱいストッカー」へ
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                築20年超の戸建てに必ずある「使われない勝手口」。ここを解体し、隣地境界ギリギリまでパントリー兼屋外ストッカーを増築。
                まとめ買いした食品ストック、飲料ケース、ゴミの一時保管場所として大活躍します。
              </p>
            </div>

            {/* 特徴 2: 玄関土間拡張 */}
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 hover:border-emerald-300 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                2. ベビーカーもキャンプ用品もそのまま「玄関土間拡張」
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                狭くて靴であふれかえる既存の玄関を、広々としたウォークイン土間収納へリノベ。
                泥付きのベビーカーやアウトドアギア、子供の三輪車をそのまま収納でき、玄関は常にホテルライクな美しさを保ちます。
              </p>
            </div>

            {/* 特徴 3: 基礎外断熱＋床暖房＋小屋裏全館冷房 */}
            <div className="p-8 bg-emerald-50/40 rounded-3xl border border-emerald-300 hover:border-emerald-500 hover:shadow-lg transition relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl">
                標準仕様
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                3. 真冬の素足生活 ＆ 真夏の小屋裏さらさら全館冷房
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                中古住宅の最大の弱点「冬の底冷えと夏の2階サウナ」を根本から解決。<br />
                冬は床下の<strong className="text-emerald-800">基礎外断熱＋温水床暖房</strong>と<strong className="text-emerald-800">LIXIL内窓インプラス</strong>で早朝から素足ポカポカ。
                夏は<strong className="text-emerald-800">小屋裏エアコン1台による全館冷房システム</strong>で、家中どこにいても26℃前後のサラサラ空間を実現。熱中症の心配も夜の寝苦しさも完全解消します。
              </p>
            </div>

            {/* 特徴 4: ミーレ海外食洗機＆住設NET最安値保証 */}
            <div className="p-8 bg-emerald-50/40 rounded-3xl border border-emerald-300 hover:border-emerald-500 hover:shadow-lg transition relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl">
                NET最安値保証
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                4. ミーレ（Miele）等海外住設も対応 ＆ NET最安値での設置保証
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                タカラスタンダード、LIXIL、TOTO、Panasonicはもちろん、ドイツ名門<strong className="text-emerald-800">ミーレ（Miele）</strong>やボッシュ（Bosch）など人気の海外製大型食洗機・輸入機器も柔軟に取り扱い・施工いたします。<br />
                <span className="inline-block mt-2 font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                  ★ お好きなメーカーさんの住設をNETで広告されている価格が確認できれば、その価格にて設置いたします。
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 施工プロセスギャラリー（正規の工事写真へ完全合致） */}
      <section className="py-20 bg-stone-100 border-t border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-200">
              PROCESS GALLERY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              見えない部分まで徹底公開。改修プロセスの裏側
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              専任担当技術者と熟練大工が、躯体の金物補強から配管更新まで新築同等の品質で再生します。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col">
              <div className="w-full h-44 overflow-hidden shrink-0 bg-stone-100">
                <img
                  src="/assets/saishin/features/feat_01_skeleton.jpg"
                  alt="スケルトン解体・耐震補強"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600">STEP 01</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-0.5 mb-1">内部全撤去・スケルトン化</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    壁・天井・床をすべて撤去し、既存の構造躯体を完全に露出。シロアリ・腐朽を点検し金物補強。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col">
              <div className="w-full h-44 overflow-hidden shrink-0 bg-stone-100">
                <img
                  src="/assets/saishin/features/feat_02_ginjiro.jpg"
                  alt="銀次郎 遮熱通気スペーサー"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600">STEP 02</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-0.5 mb-1">銀次郎 遮熱通気スペーサー</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    屋根裏に遮熱通気層を確保し、夏の屋根からの強烈な輻射熱を完全シャットアウト。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col">
              <div className="w-full h-44 overflow-hidden shrink-0 bg-stone-100">
                <img
                  src="/assets/saishin/features/feat_04_plumbing.jpg"
                  alt="隠蔽配管・配線の全面更新"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600">STEP 03</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-0.5 mb-1">隠蔽配管・配線の全面更新</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    将来の漏水リスクを根絶するため、床下の給水給湯ヘッダー管・電気配線を新品リプレイス。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col">
              <div className="w-full h-44 overflow-hidden shrink-0 bg-stone-100">
                <img
                  src="/assets/saishin/features/feat_03_window.jpg"
                  alt="超高断熱サッシ・気密化"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600">STEP 04</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-0.5 mb-1">超高断熱サッシ・気密化</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    HEAT20 G2クラスを実現する高性能樹脂窓・内窓インプラスと隙間のない高気密断熱充填。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 技術の裏付け ＆ 実証モデル「再進の家」・長期優良住宅認定実績 (明るいグリーン調) */}
      <section id="evidence-section" className="py-16 sm:py-20 bg-gradient-to-b from-white via-emerald-50/40 to-white text-stone-900 border-t border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-300 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-80 h-56 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-200 shadow-md relative group">
                <img
                  src="/assets/saishin/sales/sales_05.jpg"
                  alt="技術実証モデルハウス 再進の家（吹抜け・高断熱リビング）"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm">
                  実証モデルハウス（鳩山）
                </div>
              </div>

              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>確かな技術の裏付け ＆ 公的エビデンス</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug mb-3">
                  中古住宅での「長期優良住宅認定（増改築）」を取得した実績。<br className="hidden sm:inline" />
                  技術集団だからこそできる本物の性能向上再生。
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                  新築以上に取得難易度が高いとされる「既存（中古）住宅の長期優良住宅認定」。<br />
                  当社は、鳩山ニュータウンの実証モデルハウス「再進の家」をはじめ、厳格な耐震基準・省エネルギー対策・維持管理対策を公的にクリアした実績を有しています。
                  この確固たる構造工学と大工の現場力があるからこそ、お客様のご自宅のリフォームも安心してお任せいただけます。
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigate && onNavigate('saishin')}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center gap-1.5 shadow-md font-black"
                  >
                    <span>実証モデル「再進の家」特設LP・360°WEB内覧を見る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('saishin-tech')}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition flex items-center gap-1.5"
                  >
                    <span>構造・技術エビデンス詳細</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 市町村別 リフォーム補助金・助成金ナビ＆シミュレーター */}
      <SubsidyFinderSection 
        defaultCity="鶴ヶ島市" 
        onInquiryClick={(subsidyName) => {
          const el = document.getElementById('contact-form');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ④ リフォームローン ＆ 住宅ローン借り換え一体型セクション */}
      <ReformMortgageSection 
        onInquiryClick={() => {
          const el = document.getElementById('contact-form');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ⑤ リフォームAIローンボット ＆ 最適金融機関マッチング */}
      <div id="mortgage-bot-section">
        <MortgageFinderSection 
          onInquiryClick={(bank) => {
            const el = document.getElementById('contact-form');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* お問い合わせ・無料現地調査フォーム */}
      <section id="contact-form" className="py-20 bg-stone-950 text-white relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-800">
            FREE INSPECTION & ESTIMATE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-3 mb-4">
            今のお住まいの耐震・断熱診断 ＆ リフォーム無料相談
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mb-8 leading-relaxed">
            「冬寒くて耐えられない」「間取りを変えたい」「住宅ローンの借換と同時にリフォームできる？」など、専任アドバイザーと資金専門スタッフが無料でご提案します。
          </p>

          <form onSubmit={handleSubmit} className="bg-stone-900/90 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 text-left space-y-4 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">お名前 *</label>
                <input
                  type="text"
                  required
                  placeholder="山田 太郎"
                  className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">お電話番号 *</label>
                <input
                  type="tel"
                  required
                  placeholder="090-1234-5678"
                  className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">メールアドレス *</label>
              <input
                type="email"
                required
                placeholder="example@mail.com"
                className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">ご相談内容・ご自宅の築年数など（任意）</label>
              <textarea
                rows={3}
                placeholder="例：築28年の戸建て。冬の底冷えを解消したい。住宅ローンの残債が1,500万円あり、借り換えと同時にリフォームしたい。"
                className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitted}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
            >
              <span>{formSubmitted ? '送信中...' : '専任アドバイザーに無料相談・現地調査を申し込む'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-stone-950 text-stone-400 py-12 text-xs text-center border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="font-bold text-stone-200">株式会社 住ま居る リフォーム事業部 (RE)</div>
          <p className="text-stone-500">
            埼玉県鶴ヶ島市町屋176番地5 ｜ 建設業許可：埼玉県知事(般-8)第66822号 ｜ 建築士事務所登録：埼玉県知事 第(5)10278号
          </p>
          <div className="text-stone-600">© 2026 SMILE Co., Ltd. / RE Renovation. All Rights Reserved.</div>
        </div>
      </footer>

      {/* 自宅図面 3D化＆SDリフォームパース AIモーダル */}
      <Plan3dAiModal
        isOpen={isPlan3dModalOpen}
        onClose={() => setIsPlan3dModalOpen(false)}
        mode="renovation"
      />
    </div>
  );
}
