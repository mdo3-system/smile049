import React, { useState } from 'react';
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
  Wrench 
} from 'lucide-react';

export default function ReRenovationPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-900 border-b border-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              RE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base md:text-lg">スマイチ リフォーム (RE)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  性能向上リノベーション
                </span>
              </div>
              <p className="text-[10px] text-stone-400 hidden sm:block">新築以上の性能を、3/4の価格で実現するフルスケルトン再生</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('saishin')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1 shadow-md"
            >
              <span>再進の家 特設LPへ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-white text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-6 border border-blue-500/30">
            <Hammer className="w-4 h-4" />
            <span>一級建築士事務所が手がける本質的な構造改修</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            今の家を、壊さずに新築以上へ。<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-amber-200 to-amber-300">
              HEAT20 G2・光熱費0円の超高断熱リノベ
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            表面の壁紙や機器を取り替えるだけの化粧リフォームは終わり。<br />
            壁・床・天井をすべて剥がし、断熱ライン・耐震金物・配管設備を新築以上に再構築します。
          </p>

          {/* 代表作「再進の家」バナー */}
          <div className="max-w-3xl mx-auto bg-stone-950/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl text-left">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <img
                src="/assets/saishin/sales/sales_01.jpg"
                alt="再進の家"
                className="w-full sm:w-56 h-40 object-cover rounded-2xl border border-stone-800"
              />
              <div className="flex-1">
                <span className="text-xs text-amber-400 font-bold">【当社のフルリノベ実例・完成販売中】</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 mb-2">再進の家（鳩山ニュータウン）</h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  築古戸建を内部全撤去し、HEAT20 G2超高断熱＋太陽光発電で再生した自社施工モデル。実際の住み心地を現地でご体感いただけます。
                </p>
                <button
                  onClick={() => onNavigate && onNavigate('saishin')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center gap-1.5 shadow-lg"
                >
                  <span>「再進の家」特設LP・360°内覧を見る</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 施工プロセスギャラリー */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase">
              PROCESS GALLERY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              見えない部分まで徹底公開。改修プロセスの裏側
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200">
              <img
                src="/assets/saishin/construction/step_06.jpg"
                alt="スケルトン解体"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <span className="text-[10px] font-bold text-blue-600">STEP 01</span>
                <h4 className="font-bold text-stone-900 text-sm mt-0.5 mb-1">内部全撤去・スケルトン化</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  壁・天井・床をすべて撤去し、既存の構造躯体を完全に露出させて点検。
                </p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200">
              <img
                src="/assets/saishin/construction/step_07.jpg"
                alt="銀次郎 遮熱通気"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <span className="text-[10px] font-bold text-blue-600">STEP 02</span>
                <h4 className="font-bold text-stone-900 text-sm mt-0.5 mb-1">銀次郎 遮熱通気スペーサー</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  屋根裏に遮熱通気層を確保し、夏の熱気と湿気のこもりを解消。
                </p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200">
              <img
                src="/assets/saishin/construction/step_05.jpg"
                alt="配管全交換"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <span className="text-[10px] font-bold text-blue-600">STEP 03</span>
                <h4 className="font-bold text-stone-900 text-sm mt-0.5 mb-1">隠蔽配管・配線の全面更新</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  将来の漏水リスクを根絶するため、給排水管・電気配線を新品リプレイス。
                </p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200">
              <img
                src="/assets/saishin/sales/sales_06.jpg"
                alt="高断熱サッシ"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <span className="text-[10px] font-bold text-blue-600">STEP 04</span>
                <h4 className="font-bold text-stone-900 text-sm mt-0.5 mb-1">超高断熱サッシ・気密化</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  HEAT20 G2クラスを実現する樹脂サッシと隙間ない断熱材の充填。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => alert('リノベーションのご相談・現地調査依頼を受け付けました。')}
              className="px-8 py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition"
            >
              今のお住まいの高断熱リノベ相談・見積依頼（無料）
            </button>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-stone-950 text-stone-400 py-12 text-xs text-center border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="font-bold text-stone-200">株式会社 住ま居る リフォーム事業部 (RE)</div>
          <p className="text-stone-500">
            埼玉県鶴ヶ島市町屋176番地5 / 建設業許可：埼玉県知事(般-4)第66822号 / 建築士事務所登録：埼玉県知事 第(5)10278号
          </p>
          <div className="text-stone-600">© 2026 SMILE Co., Ltd.</div>
        </div>
      </footer>
    </div>
  );
}
