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
  Award,
  Heart,
  ThermometerSnowflake,
  Sun
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
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans selection:bg-amber-500 selection:text-white">
      {/* 上部ヘッダー */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-stone-900 text-base sm:text-lg tracking-wider">
              再進の家 <span className="text-amber-800 font-semibold text-xs sm:text-sm">｜ 構造・技術エビデンス</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>構造計算書請求(PDF)</span>
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>現地体感会を予約</span>
            </button>
          </div>
        </div>

        {/* 3ページのLP ナビゲーションバー */}
        <div className="bg-[#f2ece4] border-t border-stone-200 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-6 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
            <span className="text-stone-500 px-2 py-1 shrink-0 font-medium">【LP構成】</span>
            <button
              onClick={() => onNavigate ? onNavigate('saishin') : (window.location.href = '/saishin')}
              className="px-3 py-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-white/80 shrink-0 flex items-center gap-1 transition"
            >
              <span>① 総合案内（全体ストーリー）</span>
            </button>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1 rounded-md bg-stone-900 text-white shrink-0 flex items-center gap-1 shadow-sm font-black"
            >
              <span>② 構造・技術エビデンス詳説</span>
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('saishin-spec') : (window.location.href = '/saishin/spec')}
              className="px-3 py-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-white/80 shrink-0 flex items-center gap-1 transition"
            >
              <span>③ 物件スペック＆周辺環境</span>
              <ArrowRight className="w-3 h-3 text-amber-700" />
            </button>
          </div>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f5eee6] via-[#faf8f5] to-[#faf8f5] border-b border-stone-200 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-4 shadow-sm">
            <HardHat className="w-4 h-4 text-amber-800" />
            <span>大工と建築士が「見えない骨組み」に注ぎ込んだ、家族を守る技術のすべて</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 leading-tight mb-6">
            「なぜ、この家は30年後も<br className="hidden sm:inline" />
            <span className="text-amber-800">安心して笑顔で暮らせる</span>のか？」
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            表面的なクロス張り替えや新品設備だけの「見せかけのリフォーム」では決して手に入らない、<br className="hidden sm:inline" />
            <strong>大地震から命を守る耐震金物、病気を防ぐ温熱工学、そして老後資金を守る耐久性</strong>の全エビデンスを公開します。
          </p>
        </div>
      </section>

      {/* 施工記録と工学詳細 */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        {/* 1. スケルトン解体と金物補強 */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-md">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
                CHAPTER 01 ｜ 地震への安心
              </span>
              <h2 className="text-2xl font-black text-stone-900 mt-1 mb-4 leading-snug">
                フルスケルトン解体と構造計算金物補強<br />
                <span className="text-base font-bold text-amber-900">「新耐震基準1.5倍・大地震でも命と財産を守る骨組み」</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                昭和51年築の建物を一度、基礎と主要構造材（柱・梁・桁）だけの状態まで完全解体。目視で木材の健全性を一本ずつ精査し、経年乾燥によって現代の集成材以上に強度の増した良質な骨組みを残しながら、接合部に最新の耐震金物（ホールダウン金物・短冊金物・筋交いプレート）を緊結しました。
              </p>
              <div className="p-4 bg-[#f9f6f0] rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>生活者への安心ベネフィット：</span>
                </div>
                <div>・柱が土台から引き抜かれるのを防ぐホールダウン金物を適正配置</div>
                <div>・耐力壁のバランス配置（偏心率を低減し、ねじれ倒壊を根本防止）</div>
                <div>・万が一大地震が起きても建物が耐え抜き、住み続けられる安全性を確保</div>
              </div>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
              <img
                src="/assets/saishin/features/feat_01_skeleton.jpg"
                alt="フルスケルトン金物補強"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>

        {/* 2. 遮熱通気部材「銀次郎」と熱力学 */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-md">
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
                CHAPTER 02 ｜ 夏の快適性
              </span>
              <h2 className="text-2xl font-black text-stone-900 mt-1 mb-4 leading-snug">
                屋根遮熱通気層「銀次郎」による夏の熱気遮断<br />
                <span className="text-base font-bold text-amber-900">「真夏の熱中症を防ぎ、2階でもぐっすり眠れる家」</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                昔の木造住宅で「夏の2階がサウナのように暑くて耐えられない」最大の原因は、屋根面から放射される強烈な「輻射熱」です。本住宅では屋根垂木下に遮熱通気スペーサー「銀次郎」を隙間なく施工し、アルミ高反射面で熱線を97%反射します。
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                さらに垂木間に形成された連続通気層によって熱気を棟換気口から自然排熱するため、真夏でも2階天井が熱を持ちません。
              </p>
              <div className="p-4 bg-[#f9f6f0] rounded-2xl border border-stone-200 text-xs text-stone-700">
                <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-700" />
                  <span>生活者への安心ベネフィット：</span>
                </span>
                屋根直下の天井裏温度を外気温並みまで低下させ、エアコンがすばやく効きます。夏場の就寝時にエアコンを強運転して体を冷やしすぎる心配もありません。
              </div>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
              <img
                src="/assets/saishin/features/feat_02_ginjiro.jpg"
                alt="遮熱通気スペーサー銀次郎"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>

        {/* 3. YKK APW430トリプルガラス樹脂窓 */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-md">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mb-2">
                CHAPTER 03 ｜ 冬の健康
              </span>
              <h2 className="text-2xl font-black text-stone-900 mt-1 mb-4 leading-snug">
                世界最高水準：YKK APW430高性能トリプルガラス樹脂窓<br />
                <span className="text-base font-bold text-emerald-900">「窓際のひんやり感・結露・カビを一生涯根絶」</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                住宅の熱逃げの約6割は「窓」から発生します。一般的なアルミサッシ＋単板ガラスと比較して約4倍以上の断熱性能を誇る世界トップクラスの樹脂サッシ「APW430」を主要採光部に採用しました。
              </p>
              <div className="space-y-2 text-xs text-stone-700 mb-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>アルゴンガス封入トリプルガラス（3重ガラス）で冷気を遮断</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>オール樹脂フレームにより、毎朝の面倒な窓拭き結露・カビの発生を根絶</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>外の自動車騒音や風の音を遮断し、驚くほどの静寂とプライバシーを確保</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
              <img
                src="/assets/saishin/features/feat_03_window.jpg"
                alt="YKK APW430トリプルガラス樹脂窓"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4. 配管・配線・防蟻処理の全面リプレイス */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-md">
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
                CHAPTER 04 ｜ 老後資金の防衛
              </span>
              <h2 className="text-2xl font-black text-stone-900 mt-1 mb-4 leading-snug">
                隠蔽インフラ完全新品交換 ＆ ホウ酸防腐防蟻処理<br />
                <span className="text-base font-bold text-amber-900">「入居後の水漏れ・漏電トラブルゼロ。追加修繕費のかからない安心」</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                中古住宅で最も恐ろしいのは、入居後数年で発生する「床下や壁の中の配管破裂・赤錆水漏れ」や「古い電気配線のショート」です。本物件では床下の給排水管を耐久性の極めて高い架橋ポリエチレン管へ全交換。新設分電盤と幹線配線も完全引き直しを行いました。
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                さらに木部には半永久的に効果が持続し、人体にも安全な「ホウ酸系防腐防蟻処理」を施工。5年ごとの高額な農薬再散布が不要で、お孫さんやペットにも無害です。
              </p>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
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
      <section className="py-20 bg-[#2b2725] text-center border-t border-stone-800 px-4 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
            「構造図面・計算データ」を直接ご確認いただけます
          </h2>
          <p className="text-stone-300 text-xs sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            建築士・大工の施工チームが現地にて、耐震金物の施工箇所や配管ルートを直接ご説明いたします。強引な営業はいたしませんのでご安心ください。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-2 shadow"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>構造・温熱詳細資料（PDF）請求</span>
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-stone-950" />
              <span>現地体感内覧会を予約する</span>
            </button>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-[#1f1c1a] text-stone-400 py-12 border-t border-stone-800 text-xs text-center">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
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
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                TECHNICAL REPORT
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2 text-stone-900">
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
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">ご質問やご要望</label>
                <textarea
                  rows="3"
                  placeholder="構造計算の詳細を知りたい、実際の施工写真をもっと見たい、など"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                className="w-full py-3.5 rounded-xl font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg transition"
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
