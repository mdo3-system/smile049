import React, { useState } from 'react';
import {
  ShieldCheck,
  Wrench,
  Layers,
  ArrowRight,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  HardHat,
  Cpu,
  Flame,
  Award
} from 'lucide-react';

export default function SaishinTechPage({ onNavigate }) {
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      alert('技術資料のご請求・お問い合わせありがとうございます。担当者より迅速にご案内いたします。');
      setModalType(null);
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* 上部ヘッダー */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 text-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-white text-base sm:text-lg tracking-wider">
              再進の家 <span className="text-blue-400 font-normal text-xs sm:text-sm">｜ 構造・技術エビデンス</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-300" />
              <span>構造計算書請求(PDF)</span>
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-950" />
              <span>プライベート内覧会</span>
            </button>
          </div>
        </div>

        {/* 3ページのLP ナビゲーションバー */}
        <div className="bg-stone-900 border-t border-stone-800/80 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-8 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
            <span className="text-stone-400 px-2 py-1 shrink-0 font-medium">【LP構成】</span>
            <button
              onClick={() => onNavigate ? onNavigate('saishin') : (window.location.href = '/saishin')}
              className="px-3 py-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800 shrink-0 flex items-center gap-1 transition"
            >
              <span>① 総合案内（全体ストーリー）</span>
            </button>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1 rounded-md bg-blue-600 text-white shrink-0 flex items-center gap-1 shadow-sm"
            >
              <span>② 構造・技術エビデンス詳説</span>
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

      {/* ヒーロー */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-stone-950 to-stone-900 border-b border-stone-800 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-4">
            <HardHat className="w-4 h-4" />
            <span>理系層・こだわり派のための建築技術レポート</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
            建築士と大工さんが躯体から見直した、<br />
            <span className="text-blue-400">「見えない部分」の技術的裏付け</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            表面的なクロスや設備交換にとどまらない、木造骨組みの構造計算と物理工学に基づいたフルスケルトン再生の全記録。
          </p>
        </div>
      </section>

      {/* 施工記録と工学詳細 */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        {/* 1. スケルトン解体と金物補強 */}
        <div className="bg-stone-800/80 p-6 sm:p-10 rounded-3xl border border-stone-700 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">CHAPTER 01</span>
              <h2 className="text-2xl font-bold text-white mt-1 mb-4">
                木造フルスケルトン解体と構造計算金物補強
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                昭和51年築の建物を一度基礎と主要構造材（柱・梁・桁）だけの状態まで完全解体。目視で木材の健全性を一本ずつ精査し、経年で強度の増した良質な骨組みを残しながら、接合部に最新の耐震金物（ホールダウン金物・短冊金物・筋交いプレート）を緊結しました。
              </p>
              <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-700 text-xs text-stone-300 space-y-1">
                <div className="font-bold text-white">技術チェックポイント：</div>
                <div>・耐力壁のバランス配置（偏心率の低減）</div>
                <div>・柱脚・柱頭の金物引抜力計算に基づいた緊結</div>
                <div>・床剛性を高める火打ち梁の適正配置</div>
              </div>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden border border-stone-700">
              <img
                src="/assets/saishin/features/feat_01_skeleton.jpg"
                alt="フルスケルトン金物補強"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>

        {/* 2. 遮熱通気部材「銀次郎」と熱力学 */}
        <div className="bg-stone-800/80 p-6 sm:p-10 rounded-3xl border border-stone-700 shadow-xl">
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">CHAPTER 02</span>
              <h2 className="text-2xl font-bold text-white mt-1 mb-4">
                屋根遮熱通気層「銀次郎」による夏の輻射熱遮断
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                夏の2階が耐え難く暑くなる原因は、屋根面から放射される強烈な「輻射熱」です。本住宅では屋根垂木下に遮熱通気スペーサー「銀次郎」を隙間なく施工し、アルミ高反射面で熱線を97%反射。
              </p>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                さらに垂木間に形成された連続通気層によって熱気を棟換気口から自然排熱するため、真夏でも2階天井が熱を持ちません。
              </p>
              <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-700 text-xs text-stone-300">
                <span className="font-bold text-amber-300 block mb-1">物理的効果：</span>
                屋根直下の天井裏温度を外気温並みまで低下させ、エアコン効率を飛躍的に高めます。
              </div>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden border border-stone-700">
              <img
                src="/assets/saishin/features/feat_02_ginjiro.jpg"
                alt="遮熱通気スペーサー銀次郎"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>

        {/* 3. YKK APW430トリプルガラス樹脂窓 */}
        <div className="bg-stone-800/80 p-6 sm:p-10 rounded-3xl border border-stone-700 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">CHAPTER 03</span>
              <h2 className="text-2xl font-bold text-white mt-1 mb-4">
                世界最高水準：YKK APW430高性能トリプルガラス樹脂サッシ
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                住宅の熱流出の約6割は開口部（窓）から発生します。一般的なアルミサッシ＋単板ガラスと比較して約4倍以上の断熱性能を誇る「APW430」を主要採光部に採用。
              </p>
              <div className="space-y-2 text-xs text-stone-300 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>アルゴンガス封入トリプルガラス（3重ガラス）仕様</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>樹脂フレームにより窓枠の結露・カビの発生を根絶</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>高窓配置によりプライバシーを保ちつつ南面の自然光を最大確保</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden border border-stone-700">
              <img
                src="/assets/saishin/features/feat_03_window.jpg"
                alt="YKK APW430トリプルガラス樹脂窓"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4. 配管・配線・防蟻処理の全面リプレイス */}
        <div className="bg-stone-800/80 p-6 sm:p-10 rounded-3xl border border-stone-700 shadow-xl">
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">CHAPTER 04</span>
              <h2 className="text-2xl font-bold text-white mt-1 mb-4">
                隠蔽インフラ完全リプレイス ＆ ホウ酸防腐防蟻処理
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                中古住宅で最もトラブルになりやすい「壁内・床下の給排水管の赤錆・漏水」および「電気配線の劣化」。本物件では床下の架橋ポリエチレン管への全面更新、新設分電盤と幹線配線の引き直しを実施。
              </p>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                さらに木部には半永久的に揮発・分解しない安心の「ホウ酸系防腐防蟻処理」を施工し、シロアリと腐朽菌から建物を長期間保護します。
              </p>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden border border-stone-700">
              <img
                src="/assets/saishin/features/feat_04_plumbing.jpg"
                alt="配管・インフラ完全更新"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-stone-950 text-center border-t border-stone-800 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            「構造図面・計算データ」を直接ご確認いただけます
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mb-8 leading-relaxed">
            建築士・大工の施工チームが現地にて、耐震金物の施工箇所や配管ルートを直接ご説明いたします。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-300" />
              <span>構造・温熱詳細資料（PDF）請求</span>
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>現地体感内覧会を予約する</span>
            </button>
          </div>
        </div>
      </section>

      {/* モーダル */}
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
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                TECHNICAL REPORT
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2">
                {modalType === 'doc' ? '技術資料（PDF）のご請求' : '現地体感見学会のご予約'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                構造計算根拠・断熱施工図面・温熱シミュレーションデータをご案内
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">お名前 *</label>
                <input
                  type="text"
                  required
                  placeholder="山田 太郎"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">お電話番号 *</label>
                <input
                  type="tel"
                  required
                  placeholder="090-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">メールアドレス *</label>
                <input
                  type="email"
                  required
                  placeholder="taro@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">ご質問やご要望</label>
                <textarea
                  rows="3"
                  placeholder="構造計算の詳細を知りたい、実際の施工写真をもっと見たい、など"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                className="w-full py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition"
              >
                {formSubmitted ? '送信中...' : '送信する'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
