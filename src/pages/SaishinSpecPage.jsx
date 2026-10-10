import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sun,
  Coins,
  ShieldCheck,
  Compass,
  Bus,
  ShoppingBag,
  HeartPulse
} from 'lucide-react';

export default function SaishinSpecPage({ onNavigate }) {
  const [modalType, setModalType] = useState(null);
  const [activePlanFloor, setActivePlanFloor] = useState('1f');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      alert('資料のご請求・お問い合わせありがとうございます。担当者より迅速にご案内いたします。');
      setModalType(null);
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-amber-500 selection:text-white">
      {/* 上部ヘッダー */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 text-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-white text-base sm:text-lg tracking-wider">
              再進の家 <span className="text-amber-400 font-normal text-xs sm:text-sm">｜ 物件スペック＆周辺環境</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>物件資料請求(PDF)</span>
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
              onClick={() => onNavigate ? onNavigate('saishin-tech') : (window.location.href = '/saishin/technology')}
              className="px-3 py-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800 shrink-0 flex items-center gap-1 transition"
            >
              <span>② 構造・技術エビデンス詳説</span>
            </button>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1 rounded-md bg-amber-500 text-stone-950 shrink-0 flex items-center gap-1 shadow-sm"
            >
              <span>③ 物件スペック＆周辺環境</span>
            </button>
          </div>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-stone-950 to-stone-900 border-b border-stone-800 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>HEAT20 G2温熱データ ＆ 周辺環境の正直な事実</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
            数値で語る超高断熱スペックと、<br />
            <span className="text-amber-400">豊かな自然に囲まれた鳩山での暮らし</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            駅近の喧騒に費用をかけるのではなく、住環境の静けさと建物の圧倒的な本質性能にコストを全集中させた設計の全容。
          </p>
        </div>
      </section>

      {/* コンテンツ本体 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* 1. 3D間取り図ビューワー */}
        <section className="bg-stone-800/80 p-6 sm:p-8 rounded-3xl border border-stone-700 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-700">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">3D FLOOR PLAN</span>
              <h2 className="text-xl font-bold text-white mt-1">
                {activePlanFloor === '1f' ? '1階 3D立体間取り図（メイン居住空間）' : '2階 3D立体間取り図（吹き抜け・大容量フリースペース）'}
              </h2>
            </div>

            <div className="flex p-1 bg-stone-900 rounded-xl border border-stone-700">
              <button
                onClick={() => setActivePlanFloor('1f')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activePlanFloor === '1f' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-white'
                }`}
              >
                1階 平面3D（夫婦別室）
              </button>
              <button
                onClick={() => setActivePlanFloor('2f')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activePlanFloor === '2f' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-white'
                }`}
              >
                2階 平面3D（収納・趣味）
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-stone-700 bg-stone-950 flex items-center justify-center mb-4">
            <img
              src={activePlanFloor === '1f' ? '/assets/saishin/plans/3d_plan_1f.jpg' : '/assets/saishin/plans/3d_plan_2f.jpg'}
              alt="3D立体間取り図"
              className="w-full max-h-[500px] object-contain"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
            <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-700">
              <span className="font-bold text-amber-300 block mb-1">平屋ライクな1階完結動線：</span>
              水回り、LDK、そして独立した夫婦の寝室がすべて1階に集約。階段を使わずに日常生活が快適に完結します。
            </div>
            <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-700">
              <span className="font-bold text-amber-300 block mb-1">気配を共有する絶妙な距離感：</span>
              お互いのプライベートと睡眠を守りつつ、孤立しない心地よいレイアウトを実現しています。
            </div>
          </div>
        </section>

        {/* 2. 温熱シミュレーションデータ */}
        <section className="bg-stone-800/80 p-6 sm:p-8 rounded-3xl border border-stone-700 shadow-xl">
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">THERMAL SIMULATION</span>
          <h2 className="text-2xl font-bold text-white mt-1 mb-4">
            冬の未明でも無暖房で15℃を下回らないHEAT20 G2温熱環境
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
            断熱性能を示す外皮平均熱貫流率（UA値）は0.34W/㎡K相当（HEAT20 G2クラス）。
            夜間に暖房を切った状態でも室内の保温性能が極めて高いため、真冬の明け方でも室温が15℃以上をキープします。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700">
              <div className="text-stone-400 mb-1">外気温0℃の明け方室温</div>
              <div className="text-xl font-bold text-emerald-400">15 ℃ 以上保持</div>
              <div className="text-[11px] text-stone-500 mt-1">無暖房・自然放熱のみ</div>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700">
              <div className="text-stone-400 mb-1">暖房方式</div>
              <div className="text-xl font-bold text-amber-400">エアコン1台で家全体</div>
              <div className="text-[11px] text-stone-500 mt-1">吹き抜けシーリングファン循環</div>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700">
              <div className="text-stone-400 mb-1">ヒートショック対策</div>
              <div className="text-xl font-bold text-blue-400">脱衣所・トイレ温度差ゼロ</div>
              <div className="text-[11px] text-stone-500 mt-1">健康寿命延伸設計</div>
            </div>
          </div>
        </section>

        {/* 3. 周辺環境の正直な事実と生活網 */}
        <section className="bg-stone-800/80 p-6 sm:p-8 rounded-3xl border border-stone-700 shadow-xl">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">LOCATION & REALITY</span>
          <h2 className="text-2xl font-bold text-white mt-1 mb-3">
            立地の不便さは隠しません。その代わり「静寂と環境」に全振りしています。
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
            東武東上線「高坂」駅バス11分。駅まで歩ける距離ではないため、お車やタウン内バスのご利用が基本です。
            しかしその分、都心や駅前では手に入らない澄んだ空気、見晴らしの良い南東・南西角地の陽当たり、そして小鳥のさえずる静穏な日常が手に入ります。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-6">
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 flex items-start gap-3">
              <Bus className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white mb-0.5">バス停徒歩3分</div>
                <div className="text-stone-400">サブセンターバス停より高坂駅直通バスが定期運行。</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white mb-0.5">お買物環境</div>
                <div className="text-stone-400">タウン内西友・コープ等、日用品の買い物網が整備。</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white mb-0.5">医療・公共施設</div>
                <div className="text-stone-400">鳩山町診療所・郵便局・コミュニティ施設が近隣に存在。</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-stone-700 relative">
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
              緑豊かな高台：鳩山ニュータウンの閑静な街並み
            </div>
          </div>
        </section>

        {/* 4. 完全物件概要表 */}
        <section className="bg-stone-800/80 p-6 sm:p-8 rounded-3xl border border-stone-700 shadow-xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">OUTLINE</span>
          <h2 className="text-2xl font-bold text-white mt-1 mb-6">
            物件概要（2,180万円 税込 / 売主直売）
          </h2>

          <div className="bg-stone-900 rounded-2xl border border-stone-700 overflow-hidden text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-800">
              <span className="p-3.5 bg-stone-800 font-bold text-stone-300 md:border-r border-stone-700">物件名称</span>
              <span className="p-3.5 md:col-span-3 text-white font-bold">再進の家（鳩山ニュータウン高性能再生住宅）</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-800 bg-amber-500/10">
              <span className="p-3.5 bg-amber-500/20 font-bold text-amber-300 md:border-r border-stone-700">販売価格</span>
              <span className="p-3.5 md:col-span-3 text-amber-400 font-extrabold text-base sm:text-lg">
                2,180 万円 <span className="text-xs font-normal text-stone-400">（税込 / 土地・建物総額）</span>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-800">
              <span className="p-3.5 bg-stone-800 font-bold text-stone-300 md:border-r border-stone-700">所在地</span>
              <span className="p-3.5 md:col-span-3 text-stone-300">
                埼玉県比企郡鳩山町鳩ｹ丘2丁目867番400（住居表示：埼玉県比企郡鳩山町鳩ｹ丘2-9-8）
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-800">
              <span className="p-3.5 bg-stone-800 font-bold text-stone-300 md:border-r border-stone-700">交通</span>
              <span className="p-3.5 md:col-span-3 text-stone-300">
                東武東上線「高坂」駅 バス11分、サブセンターバス停より徒歩3分
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-800">
              <span className="p-3.5 bg-stone-800 font-bold text-stone-300 md:border-r border-stone-700">土地面積</span>
              <span className="p-3.5 md:col-span-3 text-stone-300">
                正味面積：239.93㎡（約72.57坪） / 私道他なし
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-800">
              <span className="p-3.5 bg-stone-800 font-bold text-stone-300 md:border-r border-stone-700">建物面積・構造</span>
              <span className="p-3.5 md:col-span-3 text-stone-300">
                1階：77.01㎡、2階：28.89㎡（延床面積：105.90㎡ / 約32.03坪） / 木造鋼板葺き / 昭和51年6月30日 築（フルスケルトン再生済）
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-800">
              <span className="p-3.5 bg-stone-800 font-bold text-stone-300 md:border-r border-stone-700">道路・接道</span>
              <span className="p-3.5 md:col-span-3 text-stone-300">
                南西9.9m公道に約15m接道、南東5.8m公道に約12m接道（開放的な角地）
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 bg-emerald-500/10">
              <span className="p-3.5 bg-emerald-500/20 font-bold text-emerald-300 md:border-r border-stone-700">取引態様</span>
              <span className="p-3.5 md:col-span-3 text-emerald-300 font-bold">
                売主（仲介手数料 約85万円が不要）
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* CTAセクション */}
      <section className="py-20 bg-stone-950 text-center border-t border-stone-800 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            現地での空気感・エアコン1台の暖かさをご体感ください
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={() => setModalType('doc')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>物件詳細資料（PDF）を請求する</span>
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-stone-950" />
              <span>現地体感内覧会を予約する（無料）</span>
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
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                SPEC & TOUR
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2">
                {modalType === 'doc' ? '物件詳細資料（PDF）のご請求' : '現地体感見学会のご予約'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                間取り・温熱シミュレーションデータ・周辺詳細をご案内
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
                  placeholder="周辺の買い物環境について詳しく知りたい、週末に見学希望、など"
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
