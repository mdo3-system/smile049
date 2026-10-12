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
  HeartPulse,
  Heart,
  Trees
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
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans selection:bg-amber-500 selection:text-white">
      {/* 上部ヘッダー */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-stone-900 text-base sm:text-lg tracking-wider">
              再進の家 <span className="text-amber-800 font-semibold text-xs sm:text-sm">｜ 物件スペック＆周辺環境</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>物件資料請求(PDF)</span>
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
              onClick={() => onNavigate ? onNavigate('saishin-tech') : (window.location.href = '/saishin/technology')}
              className="px-3 py-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-white/80 shrink-0 flex items-center gap-1 transition"
            >
              <span>② 構造・技術エビデンス詳説</span>
            </button>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1 rounded-md bg-stone-900 text-white shrink-0 flex items-center gap-1 shadow-sm font-black"
            >
              <span>③ 物件スペック＆周辺環境</span>
            </button>
          </div>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f5eee6] via-[#faf8f5] to-[#faf8f5] border-b border-stone-200 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <span>HEAT20 G2温熱データ ＆ 鳩山ニュータウンでの心地よい暮らし</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 leading-tight mb-6">
            数値で語る超高断熱スペックと、<br />
            <span className="text-amber-800">澄んだ空気・静寂に包まれるセカンドライフ</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            駅前の騒音や高額な地価にコストを割くのではなく、<br className="hidden sm:inline" />
            <strong>澄み切った高台の空気、開放的な角地の陽当たり、そして新築以上の建物性能</strong>に全集中させた暮らしの全容。
          </p>
        </div>
      </section>

      {/* コンテンツ本体 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* 1. 3D間取り図ビューワー */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-1">
                3D FLOOR PLAN
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                {activePlanFloor === '1f' ? '1階 3D立体間取り図（日常が完結する平屋ライク空間）' : '2階 3D立体間取り図（趣味・ゲストルーム・大容量収納）'}
              </h2>
            </div>

            <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-300">
              <button
                onClick={() => setActivePlanFloor('1f')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activePlanFloor === '1f' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                1階 平面3D（メイン空間）
              </button>
              <button
                onClick={() => setActivePlanFloor('2f')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activePlanFloor === '2f' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                2階 平面3D（趣味・客室）
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center mb-6 p-2">
            <img
              src={activePlanFloor === '1f' ? '/assets/saishin/plans/3d_plan_1f.jpg' : '/assets/saishin/plans/3d_plan_2f.jpg'}
              alt="3D立体間取り図"
              className="w-full max-h-[500px] object-contain rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
            <div className="p-4 bg-[#f9f6f0] rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">日常が1階だけで完結する平屋感覚：</span>
              約16帖の明るいLDK、タカラ新品水回り、そして約8帖の主寝室（セカンド寝室）がすべて1階に配置。将来階段の上り下りが億劫になっても、安心してワンフロアで生活できます。
            </div>
            <div className="p-4 bg-[#f9f6f0] rounded-2xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">気配を感じながら眠れる快適な距離感：</span>
              お互いのいびきや睡眠リズムを気にせず熟睡できる独立した寝室空間を確保しつつ、リビングでいつでも顔を合わせられる心地よい間取り設計です。
            </div>
          </div>
        </section>

        {/* 2. 温熱シミュレーションデータ */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
            THERMAL SIMULATION ｜ 冬の安心温熱
          </span>
          <h2 className="text-2xl font-black text-stone-900 mt-1 mb-4 leading-snug">
            真冬の明け方でも無暖房で15℃を下回らない HEAT20 G2温熱環境
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
            断熱性能を示す外皮平均熱貫流率（UA値）は0.34W/㎡K相当（HEAT20 G2クラス）。
            夜間に暖房を切った状態でも家全体が魔法瓶のように熱を逃がさないため、一番冷え込む真冬の朝5時〜6時でも室温が15℃以上をキープします。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#f9f6f0] border border-stone-200 text-center">
              <div className="text-stone-500 text-xs mb-1 font-medium">外気温0℃の明け方室温</div>
              <div className="text-2xl font-black text-emerald-800">15 ℃ 以上保持</div>
              <div className="text-[11px] text-stone-500 mt-1">無暖房・自然保温の実力値</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#f9f6f0] border border-stone-200 text-center">
              <div className="text-stone-500 text-xs mb-1 font-medium">暖房方式</div>
              <div className="text-2xl font-black text-amber-800">エアコン1台で家全体</div>
              <div className="text-[11px] text-stone-500 mt-1">吹き抜けシーリングファンで熱循環</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#f9f6f0] border border-stone-200 text-center">
              <div className="text-stone-500 text-xs mb-1 font-medium">ヒートショック対策</div>
              <div className="text-2xl font-black text-amber-800">脱衣所・トイレ温度差小</div>
              <div className="text-[11px] text-stone-500 mt-1">心臓・血管の負担を劇的低減</div>
            </div>
          </div>
        </section>

        {/* 3. 周辺環境の正直な事実と生活網 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
            LOCATION & ENVIRONMENT
          </span>
          <h2 className="text-2xl font-black text-stone-900 mt-1 mb-3 leading-snug">
            立地の不便さは隠しません。<br />
            その代わり「静寂・澄んだ空気・豊かな土地」に全集中しています。
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
            東武東上線「高坂」駅までバス11分。駅徒歩圏ではないため、毎日の移動はお車またはタウン内循環バスが基本となります。
            しかしその分、都心や駅前では絶対に手に入らない<strong>72.57坪のゆったりした土地、南東・南西角地の豊かな陽当たり、澄み切った高台の空気、そして小鳥のさえずる静穏な時間</strong>が手に入ります。庭先での家庭菜園やガーデニングも存分に楽しめます。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm mb-6">
            <div className="p-4 rounded-2xl bg-[#f9f6f0] border border-stone-200 flex items-start gap-3">
              <Bus className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-900 mb-0.5">バス停徒歩3分</div>
                <div className="text-stone-600 text-xs">サブセンターバス停より高坂駅直通バスが定期運行。雨の日やお車の運転をやめた後も安心。</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#f9f6f0] border border-stone-200 flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-900 mb-0.5">お買物・スーパー</div>
                <div className="text-stone-600 text-xs">タウン内西友・コープ等、日用品や生鮮食品の買い物網が生活圏に整っています。</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#f9f6f0] border border-stone-200 flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-900 mb-0.5">医療・公共施設</div>
                <div className="text-stone-600 text-xs">鳩山町診療所・郵便局・コミュニティマルシェが近隣にあり、かかりつけ医も安心。</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-stone-200 relative shadow-sm">
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
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-1">
            OUTLINE
          </span>
          <h2 className="text-2xl font-black text-stone-900 mt-1 mb-6">
            物件概要（2,180万円 税込 / 売主直売）
          </h2>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">物件名称</span>
              <span className="p-4 md:col-span-3 text-stone-900 font-bold">再進の家（鳩山ニュータウン高性能再生住宅）</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200 bg-amber-50/50">
              <span className="p-4 bg-amber-100/70 font-bold text-amber-900 md:border-r border-stone-200">販売価格</span>
              <span className="p-4 md:col-span-3 text-amber-900 font-extrabold text-lg sm:text-xl">
                2,180 万円 <span className="text-xs font-normal text-stone-600">（税込 / 土地・建物総額）</span>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">所在地</span>
              <span className="p-4 md:col-span-3 text-stone-800">
                埼玉県比企郡鳩山町鳩ｹ丘2丁目867番400（住居表示：埼玉県比企郡鳩山町鳩ｹ丘2-9-8）
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">交通</span>
              <span className="p-4 md:col-span-3 text-stone-800">
                東武東上線「高坂」駅 バス11分、サブセンターバス停より徒歩3分
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">土地面積</span>
              <span className="p-4 md:col-span-3 text-stone-800">
                正味面積：239.93㎡（約72.57坪） / 私道他なし
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">建物面積・構造</span>
              <span className="p-4 md:col-span-3 text-stone-800">
                1階：77.01㎡、2階：28.89㎡（延床面積：105.90㎡ / 約32.03坪） / 木造鋼板葺き / 昭和51年6月30日 築（フルスケルトン再生済）
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-stone-200">
              <span className="p-4 bg-stone-100 font-bold text-stone-700 md:border-r border-stone-200">道路・接道</span>
              <span className="p-4 md:col-span-3 text-stone-800">
                南西9.9m公道に約15m接道、南東5.8m公道に約12m接道（角地・日当たり良好）
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 bg-emerald-50/60">
              <span className="p-4 bg-emerald-100/70 font-bold text-emerald-900 md:border-r border-stone-200">取引態様</span>
              <span className="p-4 md:col-span-3 text-emerald-900 font-bold">
                売主（仲介手数料 約85万円が不要 ｜ ご自宅の売却・買取相談もワンストップ対応）
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* CTAセクション */}
      <section className="py-20 bg-[#2b2725] text-center border-t border-stone-800 px-4 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
            現地での澄んだ空気感とエアコン1台の暖かさをご体感ください
          </h2>
          <p className="text-stone-300 text-xs sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            1日2組限定の完全予約制です。他の来場者を気にせず、ご夫婦でゆっくりとお茶を飲むようなお気持ちでお越しください。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setModalType('doc')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-2 shadow"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>物件詳細資料（PDF）を請求する</span>
            </button>
            <button
              onClick={() => setModalType('tour')}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-stone-950" />
              <span>現地体感内覧会を予約する（無料）</span>
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
                SPEC & TOUR
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2 text-stone-900">
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
