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
  Coins,
  Heart,
  DoorOpen,
  ThermometerSnowflake,
  Flame,
  FileCheck2,
  Users,
  Check
} from 'lucide-react';

export default function EieRealEstatePage({ onNavigate }) {
  const [inquiryType, setInquiryType] = useState('used-renove');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      alert('無料相談・物件調査同行のご相談を受け付けました。専任の建築士・不動産スタッフよりご連絡差し上げます。');
      setFormSubmitted(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-900 border-b border-stone-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base md:text-lg">EIE不動産</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  中古購入＋リノベ専門店
                </span>
              </div>
              <p className="text-[10px] text-stone-400 hidden sm:block">専門調査機関(JFD)×二級建築士のワンストップ仲介 / 埼玉県・関東一円</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:049-271-2350"
              className="hidden md:flex items-center gap-1.5 text-xs text-stone-300 hover:text-white transition font-mono font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>049-271-2350</span>
            </a>
            <button
              onClick={() => onNavigate && onNavigate('saishin')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1 shadow-md"
            >
              <span>再進の家 モデルハウス</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-white text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-6 border border-blue-500/30">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>20代・30代のための賢いマイホーム戦略</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            新築4,000万は高すぎる。<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-emerald-300 to-amber-300">
              「中古を買ってリノベ」が正解な理由。
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            物件探しから専門調査機関（JFD）による精密調査、二級建築士によるリノベ設計・確認申請、低金利一括ローンまでワンストップ。新築の3/4の予算で、新築以上の広さと快適さを手に入れる。
          </p>

          {/* 3大比較バナー（新築 vs EIE中古リノベ） */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-6 bg-stone-950/70 rounded-2xl border border-stone-800 text-stone-300">
              <div className="text-xs font-bold text-red-400 mb-1">一般の新築建売（高騰期）</div>
              <div className="text-2xl font-black text-white mb-2">総額 4,000万円超</div>
              <ul className="text-xs space-y-1.5 text-stone-400">
                <li>✕ 土地が狭く、画一的な間取りで収納が足りない</li>
                <li>✕ 35年高額ローンで毎月の生活費・教育費が圧迫</li>
                <li>✕ 建物固定資産税が毎年10万〜15万円重くのしかかる</li>
              </ul>
            </div>

            <div className="p-6 bg-blue-950/40 rounded-2xl border border-blue-500/40 text-stone-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-stone-950 text-[10px] font-black px-3 py-1 rounded-bl-lg">
                EIEの提案ルート
              </div>
              <div className="text-xs font-bold text-blue-300 mb-1">中古購入 ＋ フルリノベーション</div>
              <div className="text-2xl font-black text-white mb-2">総額 約3,000万円<span className="text-xs text-blue-300 font-bold ml-1">（新築の3/4）</span></div>
              <ul className="text-xs space-y-1.5 text-blue-100">
                <li>◎ 土地広々・庭付き。夫婦の理想に合わせて自由設計</li>
                <li>◎ 建物評価0円で固定資産税が格安。浮いた予算をリノベへ</li>
                <li>◎ 構造計算と耐震補強で新築以上の耐震性能を確保</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 妻目線（家事・収納ストレス解放）4大リノベ提案 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
              FOR FAMILY & LIFESTYLE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              妻側目線で考える「家事・収納ストレスからの完全解放」
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              ガレージ＝男の趣味だけではありません。毎日の家事動線と収納不足を根底から解消する4つのリノベ提案。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 特徴 1: 死んだ勝手口の敷地境界ストッカー化 */}
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 hover:border-blue-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-5">
                <DoorOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                1. 死んだ勝手口を「敷地境界いっぱいストッカー」へ
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                築20年超の中古住宅に必ずある「使われない勝手口」。ここを解体し、隣地境界ギリギリまでパントリー兼屋外ストッカーを増築。
                まとめ買いした食品ストック、飲料ケース、ゴミの一時保管場所として大活躍します。
              </p>
            </div>

            {/* 特徴 2: 玄関土間拡張 */}
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 hover:border-blue-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5">
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

            {/* 特徴 3: 基礎外断熱＋床暖房 */}
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 hover:border-blue-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                3. 真冬の朝もスリッパなしでキッチンへ（基礎外断熱＋床暖房）
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                中古住宅の最大の弱点「冬の床下の底冷え」を、基礎の外側からすっぽり覆う基礎断熱と床暖房で完全克服。
                真冬の早朝のお弁当作りも足元からポカポカ。冷え性に悩む奥様のQOLが劇的に向上します。
              </p>
            </div>

            {/* 特徴 4: 内窓インプラス＋タカラ水回り */}
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 hover:border-blue-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                4. 内窓インプラス ＆ タカラ高品位ホーロー設備
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                既存の窓の内側にもう1枚樹脂窓を追加し、結露とすきま風を完全シャットアウト。
                キッチン・お風呂は油汚れも水拭きで落ちるタカラスタンダードのホーロー設備を標準採用し、お掃除の手間を半減させます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* なぜEIE不動産なのか？（3つの強み） */}
      <section className="py-20 bg-stone-100 border-t border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
              OUR STRENGTH
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              普通の不動産屋には絶対に真似できない、EIEの3つの強み
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                専門機関（JFD）精密調査 ＆ 二級建築士による法規・確認申請
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                一般的な不動産営業マンでは見抜けない敷地境界・法規・構造の盲点を、専門調査機関（JFD）の精密調査（測量・行政・法務局調査：約10万円）と自社の二級建築士が徹底解明。「この壁は抜けるか」「確認申請が通るか」を事前に明確化します。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                物件代＋リノベ工事代を「低金利一括ローン」
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                通常、物件とリフォームは別ローンになり金利が高くなります。EIEは提携金融機関と連携し、リノベ費用込みで超低金利な住宅ローンに一本化。月々の返済負担を極小化します。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                ワンストップで責任の所在が1つ
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                不動産屋とリフォーム工務店が別々だと「言った・言わない」のトラブルが多発します。EIEは物件契約から設計・施工・アフターまで自社一貫責任で伴走します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* お問い合わせ・無料相談フォーム */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
            FREE CONSULTATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-3 mb-4">
            中古物件探し ＆ 専門調査・建築士の無料相談
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mb-8 leading-relaxed">
            「気になっている中古物件がある」「新築と迷っている」「資金計画を相談したい」など、お気軽にご相談ください。
          </p>

          <form onSubmit={handleSubmit} className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 text-left space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">ご相談内容</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setInquiryType('used-renove')}
                  className={`p-3 rounded-xl border text-left font-bold transition ${inquiryType === 'used-renove' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-stone-900 border-stone-800 text-stone-400'}`}
                >
                  中古住宅購入＋リノベ相談
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('inspection')}
                  className={`p-3 rounded-xl border text-left font-bold transition ${inquiryType === 'inspection' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-stone-900 border-stone-800 text-stone-400'}`}
                >
                  気になっている物件の耐震・調査同行
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">お名前 *</label>
                <input
                  type="text"
                  required
                  placeholder="山田 太郎"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">お電話番号 *</label>
                <input
                  type="tel"
                  required
                  placeholder="090-1234-5678"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">メールアドレス *</label>
              <input
                type="email"
                required
                placeholder="example@mail.com"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">ご希望のエリア・ご予算など（任意）</label>
              <textarea
                rows={3}
                placeholder="例：川越・鶴ヶ島エリアで予算3,000万円以内。庭のある中古戸建てを探しています。"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitted}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>{formSubmitted ? '送信中...' : '建築士・不動産専門スタッフに無料相談する'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-stone-950 text-stone-400 py-12 text-xs text-center border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="font-bold text-stone-200">EIE不動産 ｜ 株式会社 住ま居る 不動産事業部</div>
          <p className="text-stone-500">
            埼玉県鶴ヶ島市町屋176番地5 ｜ 宅地建物取引業者免許：埼玉県知事(3)第23725号 ｜ 建築士事務所登録：埼玉県知事 第(5)10278号
          </p>
          <div className="text-stone-600">© 2026 SMILE Co., Ltd. / EIE Real Estate. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}
