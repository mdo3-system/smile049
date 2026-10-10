import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Sparkles, 
  Home, 
  Warehouse, 
  Hammer, 
  ShieldCheck, 
  Coins 
} from 'lucide-react';

export default function EieRealEstatePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-900 border-b border-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base md:text-lg">スマイチ不動産 (EIE)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  不動産 × スマイチ
                </span>
              </div>
              <p className="text-[10px] text-stone-400 hidden sm:block">中古戸建×リノベ / 土地探し×木造ガレージ</p>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-6 border border-emerald-500/30">
            <Building2 className="w-4 h-4" />
            <span>一般的な仲介ではない「提案型」不動産事業</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            中古を買って、ガレージを建てる。<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">
              中古を買って、新築以上の性能に再生する。
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            物件探しから木造自由設計ガレージ・倉庫の建築、フルスケルトン高断熱リノベーションまで、建築士がワンストップで伴走する新しい不動産のかたち。
          </p>

          {/* ピックアップ物件：自社物件「再進の家」 */}
          <div className="max-w-3xl mx-auto bg-stone-950/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-xs font-black px-4 py-1.5 rounded-bl-xl shadow-md">
              自社売主・仲介手数料0円
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <img
                src="/assets/saishin/sales/sales_01.jpg"
                alt="再進の家 外観"
                className="w-full sm:w-56 h-40 object-cover rounded-2xl border border-stone-800"
              />
              <div className="flex-1">
                <span className="text-xs text-amber-400 font-bold">【自社特選物件】ほぼ光熱費0円・終の住処</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 mb-2">再進の家（鳩山ニュータウン）</h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  HEAT20 G2基準超高断熱・太陽光自家消費・躯体配管全面更新。新築の約2/3の価格で叶える理想の再生住宅。
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-amber-400">2,100 万円<span className="text-xs text-stone-400 font-normal">（税込）</span></span>
                  <button
                    onClick={() => onNavigate && onNavigate('saishin')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center gap-1.5 shadow-lg"
                  >
                    <span>専用LPを見る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 自社預かり売り地5区画セクション */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
              LAND PROJECT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              自社管理 預かり売り地（全5区画）
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2">
              愛車のための特注ガレージハウスや、ゆとりある平屋・倉庫建築に最適な土地をご案内。
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">
                  ガレージ・倉庫の自由設計に最適な整形地
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                  「規格ガレージを置くには幅が足りない」「市街化調整区域で建築できるか分からない」といったお悩みも、建築士が法規チェックから確認申請まで完全対応いたします。
                </p>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>建築条件なし・お好みのプランで施工可能</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>スマイチ木造ガレージ3Dシミュレーター連動対応</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>国税局API連携による詳細BtoB販売戦略準備中</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm text-center">
                <span className="text-xs text-stone-500 font-bold block mb-1">区画情報・現地確認のお問い合わせ</span>
                <div className="text-2xl font-black text-stone-900 mb-3">全5区画 分譲受付中</div>
                <p className="text-xs text-stone-500 mb-6">詳しい所在地・実測図面・価格表はお問い合わせください。</p>
                <button
                  onClick={() => alert('売り地5区画の詳細資料請求を受け付けました。')}
                  className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
                >
                  売り地5区画の資料・図面を請求する
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-stone-950 text-stone-400 py-12 text-xs text-center border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="font-bold text-stone-200">株式会社 住ま居る 不動産事業部 (EIE)</div>
          <p className="text-stone-500">
            埼玉県鶴ヶ島市町屋176番地5 / 宅地建物取引業：埼玉県知事(2)第23725号
          </p>
          <div className="text-stone-600">© 2026 SMILE Co., Ltd.</div>
        </div>
      </footer>
    </div>
  );
}
