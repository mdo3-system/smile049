import React, { useState } from 'react';
import {
  Sparkles, Copy, Check, ExternalLink, ShieldCheck, AlertTriangle,
  Layers, Target, DollarSign, Image as ImageIcon, Video, Compass,
  TrendingUp, Users, Calendar, FileText, CheckCircle2, ChevronRight,
  Share2, ArrowRight, Eye, RefreshCw, Smartphone, Laptop
} from 'lucide-react';
import { InstagramIcon, XIcon } from './SnsIcons';

export default function SaishinAdsPortalPanel() {
  const [activeTab, setActiveTab] = useState('strategy'); // 'strategy' | 'metaAds' | 'snsPosts' | 'aiPrompts' | 'budget'
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-stone-900 text-stone-100 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>プロマーケター仕様 ｜ 再進の家 販売促進システム</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              再進の家 SNS ＆ Facebook広告運用ポータル
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Meta広告規定（住宅特別カテゴリ）完全準拠・ターゲット自己選定コピー・3大LP連動マーケティング基盤
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://business.facebook.com/latest/composer?locale=ja_JP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition"
            >
              <span>Meta広告マネージャ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="/saishin"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm border border-stone-700 flex items-center gap-2 transition"
            >
              <span>LP実機プレビュー</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-stone-800 scrollbar-none text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('strategy')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'strategy'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>① アカウント戦略 ＆ Meta規約対策</span>
          </button>

          <button
            onClick={() => setActiveTab('metaAds')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'metaAds'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>② Meta広告（FB/IG）即戦力クリエイティブ</span>
          </button>

          <button
            onClick={() => setActiveTab('snsPosts')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'snsPosts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>③ Instagram / Threads オーガニック投稿</span>
          </button>

          <button
            onClick={() => setActiveTab('aiPrompts')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'aiPrompts'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>④ AI動画・画像生成プロンプト（Veo 3）</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'budget'
                ? 'bg-stone-700 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>⑤ 広告予算・CPAシミュレーション</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: アカウント戦略 & Meta規約対策
        ========================================================================= */}
        {activeTab === 'strategy' && (
          <div className="space-y-6 animate-fade-in">
            {/* マーケターの結論：アカウントは分けるべきか？ */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    プロマーケター目線での回答：アカウントはスマイチと同じでいいか？
                  </h2>
                  <p className="text-amber-300 font-bold text-sm mt-1">
                    結論：親となる「Metaビジネスマネージャ（会社アカウント）」は同じでOK。ただし、配信面（Facebookページ名・Instagramアカウント名）は『再進の家』専用に分けるのが鉄則です。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">1</span>
                    <span>ペルソナと信頼性の不一致</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed text-xs">
                    スマイチ（smile049_garage）は「木造ガレージ・物置・男の趣味基地」。
                    50〜60代夫婦が「ガレージ屋さんのアカウント」から終の住処の広告を見ても、「専門住宅会社じゃないの？」と不信感を抱き、クリック率が激減します。
                  </p>
                </div>

                <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">2</span>
                    <span>Meta機械学習のデータ汚染防止</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed text-xs">
                    Meta広告のAIはアカウントに反応したユーザー層を学習します。ガレージ好き（バイク・車）と断熱リノベ住宅希望（シニア・健康重視）が同一アカウントに混ざると、AIが混乱し広告単価（CPM/CPC）が高騰します。
                  </p>
                </div>

                <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800">
                  <div className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">3</span>
                    <span>Threadsのレコメンド最適化</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed text-xs">
                    Threadsはアカウントの投稿トピックの専門性をAIが解析し、関心のあるユーザーのおすすめ欄に配信します。テーマを「高性能住宅・終の住処・鳩山暮らし」に特化させることで爆発的な拡散を狙えます。
                  </p>
                </div>
              </div>

              {/* 推奨アカウント設計図 */}
              <div className="mt-6 p-5 bg-stone-900/80 rounded-2xl border border-stone-800">
                <div className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-3">
                  推奨するMetaアカウント連携マップ
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <div className="text-stone-400 text-[11px]">Meta ビジネスマネージャ</div>
                    <div className="font-bold text-white mt-0.5">株式会社 住ま居る</div>
                    <div className="text-[10px] text-stone-500 mt-1">※親会社としてクレカ決済・ピクセルを一元管理</div>
                  </div>
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <div className="text-blue-400 text-[11px]">新設 Facebookページ</div>
                    <div className="font-bold text-white mt-0.5">再進の家｜鳩山ニュータウン</div>
                    <div className="text-[10px] text-stone-500 mt-1">※50代・60代が最も信頼する広告表示名</div>
                  </div>
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <div className="text-pink-400 text-[11px]">新設 Instagramアカウント</div>
                    <div className="font-bold text-white mt-0.5">@saishin_no_ie</div>
                    <div className="text-[10px] text-stone-500 mt-1">※美しい自然・LDK動画・間取りパースを投稿</div>
                  </div>
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <div className="text-stone-300 text-[11px]">Threadsアカウント</div>
                    <div className="font-bold text-white mt-0.5">@saishin_no_ie</div>
                    <div className="text-[10px] text-stone-500 mt-1">※建築士と大工の現場リアル・本音を発信</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta広告（住宅カテゴリ）の特別規定と回避策 */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Facebook広告の住宅ポリシー（Special Ad Category）の厳格ルール
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-3">
                  <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl">
                    <div className="font-bold text-red-400 mb-1">✕ システム上での絞り込みが禁止される項目</div>
                    <ul className="list-disc list-inside space-y-1 text-stone-300 text-xs">
                      <li><strong>年齢の指定不可:</strong> 18歳〜65歳以上で強制固定（「50歳以上だけ」の設定は不可能）</li>
                      <li><strong>性別の指定不可:</strong> 男女一括配信のみ</li>
                      <li><strong>郵便番号の指定不可:</strong> 特定の町名ピン留めは不可（最低半径約24km以上）</li>
                      <li><strong>特定除外の禁止:</strong> 家族構成や所得による除外不可</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 text-xs text-stone-400">
                    <strong className="text-stone-200 block mb-1">誇大表現のNG基準：</strong>
                    「絶対に光熱費がタダ」「日本一の断熱」「震度7でも100%無傷」などの絶対的表現は広告審査落ちやアカウント停止の対象になります。
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl">
                    <div className="font-bold text-emerald-400 mb-1">◎ プロマーケターの勝てる対策（自己選定クリエイティブ）</div>
                    <p className="text-stone-300 text-xs leading-relaxed mb-2">
                      システムで年齢を絞れないなら、<strong>「画像とコピーでターゲット以外を自然に弾き、50代以上のご夫婦だけを惹きつける」</strong>のがMeta運用の正解です。
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-stone-300 text-xs">
                      <li>画像内の大見出しで<strong>「50代・60代からの住み替え」「子供が独立されたご夫婦へ」</strong>と明記</li>
                      <li>若い世代や単身者がクリックしないため、無駄なクリック課金（広告費の浪費）を完全に遮断</li>
                      <li>「ほぼ光熱費実質ゼロ」「HEAT20 G2実証データ」「売主直接販売」と論理的に表記</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: Meta広告（FB/IG）即戦力クリエイティブ
        ========================================================================= */}
        {activeTab === 'metaAds' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <h2 className="text-xl font-bold text-white mb-2">
                6大ターゲット別 Meta広告クリエイティブセット（コピペで即出稿可能）
              </h2>
              <p className="text-xs text-stone-400">
                ペルソナのインサイト（都心二拠点・経済性・ヒートショック・奥様共感・夫婦別室・理系構造）に特化した、高クリック率（CTR 2%以上目標）の原稿設計。
              </p>
            </div>

            {/* クリエイティブ 1: パターンA【認知的不協和・問いかけ型】（新築検討層への不協和） */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    PATTERN A（認知的不協和・問いかけ型）
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    3,000万円超の新築を買って、高額ローンと冬の寒さに悩むのはもうやめませんか？
                  </h3>
                </div>
                <span className="text-xs text-stone-400">配信推奨先: https://lp.smile049.jp/saishin</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">メインテキスト (Primary Text):</span>
                    <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed whitespace-pre-wrap relative font-mono">
{`【鳩山町および近隣にお住まいの50代・60代・70代のご夫婦へ】

3,000万円以上の新築建売を買って、高額なローンと冬の寒さに悩むのは、もうやめませんか？

「子どもも独立したし、これからは夫婦2人で暖かく穏やかに暮らしたい」
そう思って家を探すと、周辺の新築は3,000万円超。一見綺麗ですが、冬場は寒く、高騰する電気代に頭を悩ませる方が後を絶ちません。

実は、比企郡鳩山町に「2,180万円」でありながら、一般新築の性能をはるかに凌駕する超高断熱（HEAT20 G2超）＆電気代を極小化する創エネリノベーション住宅が完成しました。

なぜ、新築より約820万円も安いのに、新築以上の快適さが出せるのか？
秘密は「あえて築25年超の骨組みを活用し、建物評価0で固定資産税を節税。浮いた予算を『片流れ屋根への変更＋Qセルズ8.0kW太陽光（年間8,789kWh発電）』や『見えない配管・配線の全面新品交換』に集中投資したから」です。
さらに完成済み物件のため、建て替えのような「仮住まい探し」や「2回の引越し」の心労も一切ゼロ。カギを受け取って今の家から1回引っ越すだけで済みます。

「本当にエアコン1台で家じゅう暖かいの？」と疑問に思った方へ。
売り込みは一切ありません。まずは【1日2組限定・冬の快適体感会＆光熱費試算会】でご自身の体で確かめてみませんか？

▼ 詳細・体感会のご予約はこちら（無料ガイドブックも進呈中）
https://lp.smile049.jp/saishin`}
                    </div>
                    <button
                      onClick={() => handleCopy(`【鳩山町および近隣にお住まいの50代・60代・70代のご夫婦へ】\n\n3,000万円以上の新築建売を買って、高額なローンと冬の寒さに悩むのは、もうやめませんか？\n\n「子どもも独立したし、これからは夫婦2人で暖かく穏やかに暮らしたい」\nそう思って家を探すと、周辺の新築は3,000万円超。一見綺麗ですが、冬場は寒く、高騰する電気代に頭を悩ませる方が後を絶ちません。\n\n実は、比企郡鳩山町に「2,180万円」でありながら、一般新築の性能をはるかに凌駕する超高断熱（HEAT20 G2超）＆電気代を極小化する創エネリノベーション住宅が完成しました。\n\nなぜ、新築より約820万円も安いのに、新築以上の快適さが出せるのか？\n秘密は「あえて築25年超の骨組みを活用し、建物評価0で固定資産税を節税。浮いた予算を『片流れ屋根への変更＋Qセルズ8.0kW太陽光（年間8,789kWh発電）』や『見えない配管・配線の全面新品交換』に集中投資したから」です。\nさらに完成済み物件のため、建て替えのような「仮住まい探し」や「2回の引越し」の心労も一切ゼロ。カギを受け取って今の家から1回引っ越すだけで済みます。\n\n「本当にエアコン1台で家じゅう暖かいの？」と疑問に思った方へ。\n売り込みは一切ありません。まずは【1日2組限定・冬の快適体感会＆光熱費試算会】でご自身の体で確かめてみませんか？\n\n▼ 詳細・体感会のご予約はこちら（無料ガイドブックも進呈中）\nhttps://lp.smile049.jp/saishin`, 'ad_a')}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'ad_a' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'ad_a' ? 'コピー完了' : '本文をコピー'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">見出し (Headline):</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-bold text-white text-xs">
                      新築より約820万円安いのに新築より暖かい家。鳩山町2,180万円
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">推奨クリエイティブ素材（案1-A / 案1-B）:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-2">
                      <div>・<strong>案1-A:</strong> 物件前でスタッフが笑顔で立つ写真 ＋ 帯文字「3,000万円超の新築を買って冬の寒さと高額ローンに悩むのはもうやめませんか？」</div>
                      <div>・<strong>案1-B:</strong> 片流れ屋根に並んだ太陽光パネル写真 ＋ 帯文字「なぜ新築より約820万円安いのに新築より暖かい家ができるのか？」</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">リンク先URL:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-amber-400">
                      https://lp.smile049.jp/saishin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* クリエイティブ 2: パターンB【開発ストーリー・人間味型】（信頼と共感の獲得） */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                    PATTERN B（開発ストーリー・人間味型）
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    子ども部屋のための広いだけの家は、もういりません
                  </h3>
                </div>
                <span className="text-xs text-stone-400">配信推奨先: https://lp.smile049.jp/saishin</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 text-xs font-bold block mb-1">メインテキスト (Primary Text):</span>
                  <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`【子ども部屋のための広いだけの家は、もういりません】

初めまして。比企郡で住宅再生を手掛ける住ま居る／すまいる設計の代表です。

子育てを終え、人生の後半戦をご夫婦お二人で楽しもうとされている方に、どうしてもお伝えしたいことがあり投稿しました。

50代〜70代からの家選びで一番大切なのは、見た目の豪華さではなく「健康・お金のゆとり・将来の安心」だと私たちは考えています。

だからこそ、この家づくりでは表面だけのきれいなリフォームは一切やめました。
屋根を一度解体して片流れに変更し、Qセルズ8.0kW太陽光パネルを設置（年間8,789kWh発電・ほぼ自家消費を超える創エネ設計）。さらに、ご入居後に突発的な修繕費用がかからないよう、壁の裏にある電気配線や給水給湯配管まで全て新品に取り換えました。

さらに、自宅の建て替えで誰もが苦しむ「仮住まい探し」や「2回の引っ越し」の心労をゼロにし、カギを受け取って今の家から1回引っ越すだけで済むように完成させました。

「老後資金を守りながら、冬暖かく、電気代を気にせず笑って暮らせる拠点を作りたい」
そんな私たちの情熱とこだわりの詰まった家が、1棟限定で完成しました。

開発者の想いと見えない施工裏話をまとめた『50代〜70代のための失敗しない家選びガイド』を無料でお届けしています。気になる方は下記リンクよりお気軽にどうぞ。

▼ 『失敗しない家選びガイド』無料ダウンロードはこちら
https://lp.smile049.jp/saishin`}
                  </div>
                  <button
                    onClick={() => handleCopy(`【子ども部屋のための広いだけの家は、もういりません】\n\n初めまして。比企郡で住宅再生を手掛ける住ま居る／すまいる設計の代表です。\n\n子育てを終え、人生の後半戦をご夫婦お二人で楽しもうとされている方に、どうしてもお伝えしたいことがあり投稿しました。\n\n50代〜70代からの家選びで一番大切なのは、見た目の豪華さではなく「健康・お金のゆとり・将来の安心」だと私たちは考えています。\n\nだからこそ、この家づくりでは表面だけのきれいなリフォームは一切やめました。\n屋根を一度解体して片流れに変更し、Qセルズ8.0kW太陽光パネルを設置（年間8,789kWh発電・ほぼ自家消費を超える創エネ設計）。さらに、ご入居後に突発的な修繕費用がかからないよう、壁の裏にある電気配線や給水給湯配管まで全て新品に取り換えました。\n\nさらに、自宅の建て替えで誰もが苦しむ「仮住まい探し」や「2回の引っ越し」の心労をゼロにし、カギを受け取って今の家から1回引っ越すだけで済むように完成させました。\n\n「老後資金を守りながら、冬暖かく、電気代を気にせず笑って暮らせる拠点を作りたい」\nそんな私たちの情熱とこだわりの詰まった家が、1棟限定で完成しました。\n\n開発者の想いと見えない施工裏話をまとめた『50代〜70代のための失敗しない家選びガイド』を無料でお届けしています。気になる方は下記リンクよりお気軽にどうぞ。\n\n▼ 『失敗しない家選びガイド』無料ダウンロードはこちら\nhttps://lp.smile049.jp/saishin`, 'ad_b')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'ad_b' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ad_b' ? 'コピー完了' : '本文をコピー'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">見出し (Headline):</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-bold text-white text-xs">
                      50代からの家選び。子ども部屋のための広いだけの家は、もういりません
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">推奨クリエイティブ素材（カルーセル表紙 / スライド）:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-2">
                      <div>・<strong>1枚目:</strong> 代表者笑顔写真 ＋ 建物 ＋ 「子ども部屋のための広いだけの家は、もういりません」</div>
                      <div>・<strong>3枚目:</strong> 壁裏の配管・配線工事現場 ＋ 「見えない配管・配線まで全新品に交換！」</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">リンク先URL:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-red-400">
                      https://lp.smile049.jp/saishin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* クリエイティブ 3: パターンC【資産防衛・比較ノウハウ型】（理屈での納得） */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    PATTERN C（資産防衛・比較ノウハウ型）
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    新築より約820万円安いのに、新築より暖かい？ 賢い家選びと資産防衛3つの条件
                  </h3>
                </div>
                <span className="text-xs text-stone-400">配信推奨先: https://lp.smile049.jp/saishin</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 text-xs font-bold block mb-1">メインテキスト (Primary Text):</span>
                  <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`【新築より約820万円安いのに、新築より暖かい？】
50代・60代・70代夫婦が知っておくべき「賢い家選びと資産防衛」3つの条件

今の時代、高額な新築ローンを組むのはリスクです。
夫婦二人暮らしにちょうどいい「賢い住まい選び」のポイントをご存知ですか？

① 固定資産税の節税：築25年超の物件は建物評価がほぼ0。新築に比べて毎年の税負担が劇的に軽くなります。
② 光熱費リスクの遮断：HEAT20 G2超の断熱性＋Qセルズ8.0kW太陽光発電（年間8,789kWh）で、電気代高騰時代でも固定費に怯えません。
③ 見えないインフラの完全刷新：配管・配線・耐震基準を現行適合＆全新品にすることで、将来の修繕費ゼロへ。
④ 仮住まいゼロ・引越し1回のみ：自社不動産部門が現在のお住まいの売却・買取査定まで窓口ひとつでサポート。

近隣の新築建売（3,000万円超）と本物件（2,180万円）の年間トータルコスト比較データを公開中！

▼ 試算比較データ＆現地体感会のご案内はこちら
https://lp.smile049.jp/saishin`}
                  </div>
                  <button
                    onClick={() => handleCopy(`【新築より約820万円安いのに、新築より暖かい？】\n50代・60代・70代夫婦が知っておくべき「賢い家選びと資産防衛」3つの条件\n\n今の時代、高額な新築ローンを組むのはリスクです。\n夫婦二人暮らしにちょうどいい「賢い住まい選び」のポイントをご存知ですか？\n\n① 固定資産税の節税：築25年超の物件は建物評価がほぼ0。新築に比べて毎年の税負担が劇的に軽くなります。\n② 光熱費リスクの遮断：HEAT20 G2超の断熱性＋Qセルズ8.0kW太陽光発電（年間8,789kWh）で、電気代高騰時代でも固定費に怯えません。\n③ 見えないインフラの完全刷新：配管・配線・耐震基準を現行適合＆全新品にすることで、将来の修繕費ゼロへ。\n④ 仮住まいゼロ・引越し1回のみ：自社不動産部門が現在のお住まいの売却・買取査定まで窓口ひとつでサポート。\n\n近隣の新築建売（3,000万円超）と本物件（2,180万円）の年間トータルコスト比較データを公開中！\n\n▼ 試算比較データ＆現地体感会のご案内はこちら\nhttps://lp.smile049.jp/saishin`, 'ad_c')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'ad_c' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ad_c' ? 'コピー完了' : '本文をコピー'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">見出し (Headline):</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-bold text-white text-xs">
                      新築と本物件の生涯トータルコスト徹底比較データを公開中
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">推奨クリエイティブ素材（比較図解・インフォグラフィック）:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-2">
                      <div>・<strong>図解比較画像:</strong> 「どちらがこれからの暮らしに賢い選択ですか？」（左:新築3,000万超 / 右:本物件2,180万）</div>
                      <div>・<strong>下部帯コピー:</strong> 「浮いた約820万円で夫婦の老後資金・趣味・旅行にゆとりを」</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">リンク先URL:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-emerald-400">
                      https://lp.smile049.jp/saishin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* クリエイティブ 4: 構造・理系こだわり軸 */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                    PATTERN D（構造・理系こだわり層）
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    見えない躯体からフルスケルトン再生。建築士と大工が挑んだ木造住宅の技術エビデンス
                  </h3>
                </div>
                <span className="text-xs text-stone-400">配信推奨先: 構造技術LP（/saishin/technology）</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 text-xs font-bold block mb-1">メインテキスト (Primary Text):</span>
                  <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`【本質を見極めたいこだわり派の方へ】

単なる壁紙の張り替えやキッチン交換のリフォームは、構造やインフラの劣化を隠しているに過ぎません。

「再進の家」は、建築士と熟練大工が一度すべての骨組みまで丸裸に解体。

✔ 構造計算に基づき、柱・梁を最新の耐震金物で緊結補強
✔ 屋根遮熱通気部材「銀次郎」で夏の輻射熱を完全シャットアウト
✔ 給水・給湯・排水管および電気配線をすべて新品へリプレイス
✔ 木部には半永久的に揮発しないホウ酸防腐防蟻処理

木造建築の工学的な裏付けと施工プロセスの詳細記録をWeb上で全公開しています。`}
                  </div>
                  <button
                    onClick={() => handleCopy(`【本質を見極めたいこだわり派の方へ】\n\n単なる壁紙の張り替えやキッチン交換のリフォームは、構造やインフラの劣化を隠しているに過ぎません。\n\n「再進の家」は、建築士と熟練大工が一度すべての骨組みまで丸裸に解体。\n\n✔ 構造計算に基づき、柱・梁を最新の耐震金物で緊結補強\n✔ 屋根遮熱通気部材「銀次郎」で夏の輻射熱を完全シャットアウト\n✔ 給水・給湯・排水管および電気配線をすべて新品へリプレイス\n✔ 木部には半永久的に揮発しないホウ酸防腐防蟻処理\n\n木造建築の工学的な裏付けと施工プロセスの詳細記録をWeb上で全公開しています。`, 'ad_d')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'ad_d' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ad_d' ? 'コピー完了' : '本文をコピー'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">見出し (Headline):</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-bold text-white text-xs">
                      建築士と大工が挑んだ、木造フルスケルトン再生の全記録（施工写真公開）
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">推奨クリエイティブ素材:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-1">
                      <div>・<strong>画像素材:</strong> スケルトン金物写真（`feat_01_skeleton.jpg`）または銀次郎通気写真</div>
                      <div>・<strong>画像帯文字:</strong> 「骨組みから完全再生」「耐震金物・配管更新」</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">リンク先URL:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-blue-400">
                      https://lp.smile049.jp/saishin/technology
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* クリエイティブ 5: パターンE【奥様共感・健康長寿型】（冷え性・ヒートショック・毎日の家事） */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
                    PATTERN E（奥様共感・健康長寿型）
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    朝、布団から出る時の足元の冷たさ…もう終わりにしませんか？
                  </h3>
                </div>
                <span className="text-xs text-stone-400">配信推奨先: https://lp.smile049.jp/saishin</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 text-xs font-bold block mb-1">メインテキスト (Primary Text):</span>
                  <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`【「毎朝、寒さで目が覚める」「夜中のトイレで身震いする」とお悩みの奥様へ】

真冬の朝、靴下を探して布団から出る辛さや、寒い脱衣所でお風呂に入る時の心臓への負担…。
「昔の家だから仕方がない」と我慢していませんか？

日本の家で最も怖いのは、暖かいリビングと凍える脱衣所の温度差によって起きる「ヒートショック」です。

比企郡鳩山町に完成した「再進の家（2,180万円）」は、
エアコン1台をゆるやかにつけておくだけで、LDKだけでなく廊下・トイレ・脱衣所まで家中ぽかぽか。
真冬の明け方でも室温15℃を下回らない、魔法瓶のような超高断熱（HEAT20 G2）住宅です。

さらに、奥様の毎日を助ける安心設計：
✔ タカラスタンダード高品位ホーロー水回り（油汚れも水拭きだけでピカピカ）
✔ 1階だけで日常が完結する平屋ライク設計（将来も階段の上り下りゼロ）
✔ 大容量8.0kW太陽光発電（電気代高騰を気にせず暖房をつけっぱなしにできる）
✔ 今の家からの引越しは1回だけ（仮住まい探しや2回引越しの過酷な心労ゼロ）

「本当にエアコン1台で家じゅう暖かいの？」
売り込みは一切ありません。まずは【1日2組限定・冬の快適体感会】で、ご夫婦で温かい空気感を直接確かめてみませんか？

▼ 詳細・体感会のご予約はこちら（無料ガイドブックも進呈中）
https://lp.smile049.jp/saishin`}
                  </div>
                  <button
                    onClick={() => handleCopy(`【「毎朝、寒さで目が覚める」「夜中のトイレで身震いする」とお悩みの奥様へ】\n\n真冬の朝、靴下を探して布団から出る辛さや、寒い脱衣所でお風呂に入る時の心臓への負担…。\n「昔の家だから仕方がない」と我慢していませんか？\n\n日本の家で最も怖いのは、暖かいリビングと凍える脱衣所の温度差によって起きる「ヒートショック」です。\n\n比企郡鳩山町に完成した「再進の家（2,180万円）」は、\nエアコン1台をゆるやかにつけておくだけで、LDKだけでなく廊下・トイレ・脱衣所まで家中ぽかぽか。\n真冬の明け方でも室温15℃を下回らない、魔法瓶のような超高断熱（HEAT20 G2）住宅です。\n\nさらに、奥様の毎日を助ける安心設計：\n✔ タカラスタンダード高品位ホーロー水回り（油汚れも水拭きだけでピカピカ）\n✔ 1階だけで日常が完結する平屋ライク設計（将来も階段の上り下りゼロ）\n✔ 大容量8.0kW太陽光発電（電気代高騰を気にせず暖房をつけっぱなしにできる）\n✔ 今の家からの引越しは1回だけ（仮住まい探しや2回引越しの過酷な心労ゼロ）\n\n「本当にエアコン1台で家じゅう暖かいの？」\n売り込みは一切ありません。まずは【1日2組限定・冬の快適体感会】で、ご夫婦で温かい空気感を直接確かめてみませんか？\n\n▼ 詳細・体感会のご予約はこちら（無料ガイドブックも進呈中）\nhttps://lp.smile049.jp/saishin`, 'ad_e')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'ad_e' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ad_e' ? 'コピー完了' : '本文をコピー'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">見出し (Headline):</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-bold text-white text-xs">
                      朝の寒さ・冬のお風呂の不安をゼロに。夫婦で暖かく健康に暮らす家（鳩山町2,180万円）
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">推奨クリエイティブ素材（日常実感・温もり写真）:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-2">
                      <div>・<strong>画像素材:</strong> 陽光あふれるLDK・キッチン写真 ＋ タカラホーロー設備写真</div>
                      <div>・<strong>画像帯文字:</strong> 「靴下がいらない、冬でも暖かい家」「お風呂のヒートショック予防」</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">リンク先URL:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-pink-400">
                      https://lp.smile049.jp/saishin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* クリエイティブ 6: パターンF【都心二拠点・週末別邸型】（都心シニア・デュアルライフ） */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    PATTERN F（都心二拠点・週末別邸型）★新機軸
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    都心から約1時間。2,180万円で手に入る「維持費実質ゼロ」の週末別邸
                  </h3>
                </div>
                <span className="text-xs text-stone-400">配信推奨エリア: 東京23区・武蔵野・さいたま市</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 text-xs font-bold block mb-1">メインテキスト (Primary Text):</span>
                  <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`【東京・都心近郊にお住まいの50代・60代・70代のご夫婦へ】

「週末くらい、人混みやコンクリートから離れて、土の匂いと澄んだ空気の中で過ごしたい」
そう思っても、軽井沢や那須は片道3時間。通うだけで疲れてしまい、冬の寒さや維持管理費に悩む方が少なくありません。

実は、練馬ICから車で約50分（池袋から東武東上線で約50分）の埼玉県鳩山町に、
夫婦ふたりの週末二拠点にちょうどいい【2,180万円の極暖プライベートヴィラ】が完成しました。

✔ 土地72坪（南東・南西角地）：小さな家庭菜園やガーデニング、木漏れ日のテラスを満喫
✔ 維持費ゼロ設計：Qセルズ大容量8.0kW太陽光が年間8,789kWh発電。不在時も電力を創出し、固定費の負担を極小化
✔ 日本一の酷暑の夏も、底冷えする真冬もエアコン1台：屋根遮熱「銀次郎」× HEAT20 G2超高断熱（冬の別荘の底冷え・凍結とは無縁）
✔ 完全フルスケルトン再生：水回り（タカラ高品位ホーロー）・見えない配管・電気配線まで完全新品

都心の狭いマンションに閉じこもる週末を卒業して、
「都心と自然を行き来する、豊かな大人の休日」を一歩踏み出しませんか？

売り込みは一切ありません。まずは現地で、澄み切った空気とエアコン1台の暖かさをご体感ください。

▼ 詳細・特製ガイドブック（PDF）はこちら
https://lp.smile049.jp/saishin`}
                  </div>
                  <button
                    onClick={() => handleCopy(`【東京・都心近郊にお住まいの50代・60代・70代のご夫婦へ】\n\n「週末くらい、人混みやコンクリートから離れて、土の匂いと澄んだ空気の中で過ごしたい」\nそう思っても、軽井沢や那須は片道3時間。通うだけで疲れてしまい、冬の寒さや維持管理費に悩む方が少なくありません。\n\n実は、練馬ICから車で約50分（池袋から東武東上線で約50分）の埼玉県鳩山町に、\n夫婦ふたりの週末二拠点にちょうどいい【2,180万円の極暖プライベートヴィラ】が完成しました。\n\n✔ 土地72坪（南東・南西角地）：小さな家庭菜園やガーデニング、木漏れ日のテラスを満喫\n✔ 維持費ゼロ設計：Qセルズ大容量8.0kW太陽光が年間8,789kWh発電。不在時も電力を創出し、固定費の負担を極小化\n✔ 日本一の酷暑の夏も、底冷えする真冬もエアコン1台：屋根遮熱「銀次郎」× HEAT20 G2超高断熱（冬の別荘の底冷え・凍結とは無縁）\n✔ 完全フルスケルトン再生：水回り（タカラ高品位ホーロー）・見えない配管・電気配線まで完全新品\n\n都心の狭いマンションに閉じこもる週末を卒業して、\n「都心と自然を行き来する、豊かな大人の休日」を一歩踏み出しませんか？\n\n売り込みは一切ありません。まずは現地で、澄み切った空気とエアコン1台の暖かさをご体感ください。\n\n▼ 詳細・特製ガイドブック（PDF）はこちら\nhttps://lp.smile049.jp/saishin`, 'ad_f')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'ad_f' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ad_f' ? 'コピー完了' : '本文をコピー'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">見出し (Headline):</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-bold text-white text-xs">
                      都心から約1時間。軽井沢の1/3の価格で手に入る「維持費実質ゼロ」の週末別邸
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">推奨クリエイティブ素材（別邸・自然リトリート）:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-2">
                      <div>・<strong>画像素材:</strong> 青空と街並みのドローン動画スナップ ＋ 木天井LDK写真</div>
                      <div>・<strong>画像帯文字:</strong> 「都心から約1時間の週末別邸」「軽井沢より近くて暖かい家」</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 text-xs font-bold block mb-1">リンク先URL:</span>
                    <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-emerald-400">
                      https://lp.smile049.jp/saishin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* カルーセル広告用 5枚スライドコピーセット */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                    CAROUSEL SET（横スライド5枚ストーリー型）
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    見込み客自身に「この家が一番賢い選択だ」とストーリーで納得させるカルーセル広告
                  </h3>
                </div>
                <span className="text-xs text-stone-400">配信面: Facebook / Instagramフィード</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">1枚目（表紙）</span>
                  <div className="font-bold text-white">代表者笑顔写真 ＋ 建物</div>
                  <p className="text-amber-300 font-bold leading-relaxed text-[11px]">
                    「子ども部屋のための広いだけの家は、もういりません」<br />
                    夫婦2人にちょうどいい、新築以上の超高断熱リノベーション住宅
                  </p>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-bold">2枚目（屋根）</span>
                  <div className="font-bold text-white">片流れ屋根 ＋ Qセルズ8kW</div>
                  <p className="text-stone-300 leading-relaxed text-[11px]">
                    「屋根を壊してまで片流れにした理由」<br />
                    年間8,789kWh創エネで、電気代高騰時代でも固定費に怯えない暮らし
                  </p>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-bold">3枚目（配管）</span>
                  <div className="font-bold text-white">壁裏の配管・電気配線工事</div>
                  <p className="text-stone-300 leading-relaxed text-[11px]">
                    「見えない配管・配線まで全新品に交換！」<br />
                    表側だけ綺麗にする上辺リフォームはしない。将来の突発的修繕リスクをゼロへ
                  </p>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-bold">4枚目（設備）</span>
                  <div className="font-bold text-white">新品キッチン・浴室・2台駐車</div>
                  <p className="text-stone-300 leading-relaxed text-[11px]">
                    「水回り全新品＆車2台駐車」<br />
                    現行耐震適合。仮住まい不要・引越し1回のみ。50代〜70代のセカンドライフを豊かに
                  </p>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">5枚目（オファー）</span>
                  <div className="font-bold text-amber-400">ガイドブック表紙画像</div>
                  <p className="text-white font-bold leading-relaxed text-[11px]">
                    【完全予約制・無料進呈】<br />
                    『50代〜70代のための失敗しない家選びガイド』＆「エアコン1台で暖かい」現地体感会
                  </p>
                </div>
              </div>
            </div>

            {/* 神田流 画像内文字入れ全8パターン＆作成テクニック解説 */}
            <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
              <div className="pb-4 border-b border-stone-800">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-block mb-2">
                  EMOTIONAL COPY GUIDELINES（神田流エモーショナル・マーケティング）
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  広告臭いカタログ写真を排除し、タイムラインで指を止める画像内コピー全8パターン
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Facebookユーザーはプロのカタログ写真を瞬時に「売り込み」と判断してスルーします。生活感・現場のリアル・文字の力（座布団帯）で勝負します。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                {/* パターン 1: 1枚画像広告用 */}
                <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>【パターン1】1枚画像広告用：認知的不協和＆強烈な問いかけ</span>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-300">案1-A / 案1-B</span>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-2">
                    <strong className="text-white block">案1-A（問いかけ＆ギャップ訴求）：</strong>
                    <div className="text-stone-300 pl-2 border-l-2 border-amber-500 space-y-0.5">
                      <div>上部帯：【比企郡にお住まいの50代・60代・70代のご夫婦へ】</div>
                      <div className="text-amber-300 font-bold">メイン：3,000万円超の新築を買って 冬の寒さと高額ローンに悩むのは もうやめませんか？</div>
                      <div>サブ：2,180万円で叶える「HEAT20 G2超」の超高断熱×創エネ住宅</div>
                      <div className="text-red-400 font-bold">右下バッジ：【先着10名】エアコン1台で暖かい体感会 開催中</div>
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-2">
                    <strong className="text-white block">案1-B（比較・価格ギャップ訴求）：</strong>
                    <div className="text-stone-300 pl-2 border-l-2 border-amber-500 space-y-0.5">
                      <div className="text-amber-300 font-bold">メイン：なぜ新築より約820万円安いのに 新築より暖かい家ができるのか？</div>
                      <div>サブ：築25年超の建物評価0を活用＝固定資産税も劇的節税！ 浮いた予算を超高断熱とQセルズ8kWソーラーへ集中投資。</div>
                      <div>下部帯：2,180万円／鳩山ニュータウン内／見学予約受付中</div>
                    </div>
                  </div>
                </div>

                {/* パターン 3 & 4: 現場リアル対比 ＆ インフォグラフィック */}
                <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
                  <div className="font-bold text-emerald-400 flex items-center justify-between">
                    <span>【パターン3＆4】現場リアル対比 ＆ 図解インフォグラフィック</span>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-300">自己説得型</span>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-2">
                    <strong className="text-white block">パターン3（現場のリアル・誠実さ強調型）：</strong>
                    <p className="text-stone-400 text-[11px]">左:配管引き直し施工現場写真 ／ 右:完成後の新築同様美しいLDK写真</p>
                    <div className="text-stone-300 pl-2 border-l-2 border-emerald-500 space-y-0.5">
                      <div className="text-amber-300 font-bold">中央帯：「表面だけ綺麗にする『上辺リフォーム』は絶対にしません。」</div>
                      <div>補足：割高な新築建売を買わなくても、2,180万円で「新築以上の暖かさと安心」は手に入ります。壁の裏の配管・配線まで全面刷新済み！</div>
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-2">
                    <strong className="text-white block">パターン4（図解・インフォグラフィック型 比較画像）：</strong>
                    <div className="text-stone-300 pl-2 border-l-2 border-emerald-500 space-y-0.5">
                      <div className="text-white font-bold">タイトル：「どちらが、これからの暮らしに賢い選択ですか？」</div>
                      <div className="text-[11px] grid grid-cols-2 gap-2 mt-1">
                        <div className="text-stone-400">左: 新築建売 3,000万超／冬寒い／電気代直撃／税高額</div>
                        <div className="text-emerald-300 font-bold">右: 本物件 2,180万（820万得）／HEAT20 G2／Qセルズ8kW／税激減</div>
                      </div>
                      <div className="text-amber-300 font-bold mt-1">下部キャッチ：浮いた約820万円で、夫婦の老後資金・趣味・旅行にゆとりを。</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 画像作成テクニック3箇条 */}
              <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 text-xs">
                <div className="font-bold text-white mb-2">クリエイティブ作成時の3つの鉄則テクニック：</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-stone-300">
                  <div className="p-2.5 bg-stone-950 rounded-xl">
                    <strong className="text-amber-300 block mb-0.5">① 太めのゴシック体を使用</strong>
                    スマホ画面は小さいため、明朝体や細字はスルーされます。濃背景に白太文字、白背景に濃紺太文字で可読性を最大化。
                  </div>
                  <div className="p-2.5 bg-stone-950 rounded-xl">
                    <strong className="text-amber-300 block mb-0.5">② テキストの背景に「帯（座布団）」を敷く</strong>
                    写真の上に直文字を置くと同化します。黒・濃紺・赤・黄色の単色帯を敷いて文字を一目で読ませます。
                  </div>
                  <div className="p-2.5 bg-stone-950 rounded-xl">
                    <strong className="text-amber-300 block mb-0.5">③ 文字量を画像全体の20〜30%に抑える</strong>
                    詰め込みすぎると画像がゴチャつきます。詳しい説明は広告本文に委ね、画像では「感情の引き金」だけを引きます。
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: Instagram / Threads オーガニック投稿
        ========================================================================= */}
        {activeTab === 'snsPosts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <h2 className="text-xl font-bold text-white mb-2">
                Instagram & Threads 日常運用テンプレート
              </h2>
              <p className="text-xs text-stone-400">
                広告だけでなく、現場のリアルや職人の想いを日常発信することで、広告を見たユーザーがプロフィールを訪れた際の信頼性を最大化します。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              {/* 投稿 1: 現場の裏側（銀次郎） */}
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="font-bold text-amber-400">POST 01: 現場のリアル「銀次郎」</span>
                  <span className="text-[11px] text-stone-500">Instagram / Threads共通</span>
                </div>
                <div className="p-4 bg-stone-900 rounded-xl text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`屋根を開けると、そこには銀色の遮熱通気スペーサー「銀次郎」が隙間なく並んでいます。

昭和51年築の家が、なぜ最新の新築より涼しくなるのか？
その秘密はこの「屋根の通気層」にあります。

夏の強烈な太陽光は、屋根から天井裏へと熱を伝えます。
そこで銀次郎のアルミ高反射面で熱線を97%跳ね返し、温まった空気を屋根のてっぺんから自然排熱する。

完成したら壁や天井の中に隠れて二度と見えなくなる部分。
でも、だからこそ建築士と大工さんはここに全魂を注ぎます。

#再進の家 #鳩山ニュータウン #高断熱リノベーション #銀次郎 #木造建築 #大工の仕事 #終の住処 #HEAT20`}
                </div>
                <button
                  onClick={() => handleCopy(`屋根を開けると、そこには銀色の遮熱通気スペーサー「銀次郎」が隙間なく並んでいます。\n\n昭和51年築の家が、なぜ最新の新築より涼しくなるのか？\nその秘密はこの「屋根の通気層」にあります。\n\n夏の強烈な太陽光は、屋根から天井裏へと熱を伝えます。\nそこで銀次郎のアルミ高反射面で熱線を97%跳ね返し、温まった空気を屋根のてっぺんから自然排熱する。\n\n完成したら壁や天井の中に隠れて二度と見えなくなる部分。\nでも、だからこそ建築士と大工さんはここに全魂を注ぎます。\n\n#再進の家 #鳩山ニュータウン #高断熱リノベーション #銀次郎 #木造建築 #大工の仕事 #終の住処 #HEAT20`, 'post_1')}
                  className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  {copiedKey === 'post_1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'post_1' ? 'コピー完了' : '投稿文をコピー'}</span>
                </button>
              </div>

              {/* 投稿 2: 鳩山ニュータウンの朝 */}
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="font-bold text-emerald-400">POST 02: 暮らしの空気感「鳩山の朝」</span>
                  <span className="text-[11px] text-stone-500">Instagramリール / Threads</span>
                </div>
                <div className="p-4 bg-stone-900 rounded-xl text-stone-200 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`鳩山ニュータウンの朝は、驚くほど静かです。

窓を開けると、都心では味わえない澄んだ空気と小鳥のさえずり。
南東・南西の角地だから、朝日がリビングの杉板天井に差し込んできます。

駅からはバスで11分。確かに「駅前徒歩5分」の便利さはありません。
でも、その代わりここには、
「喧騒のない静寂」「美味しい空気」「四季を感じる散歩コース」
そして新築以上の性能を持った暖かい家があります。

便利さだけに追われない、大人の豊かな暮らしとは何か。
毎朝この現場に来るたびに実感します。

#鳩山ニュータウン #終の住処 #田舎暮らし #スローライフ #澄んだ空気 #埼玉移住 #50代からの暮らし #再進の家`}
                </div>
                <button
                  onClick={() => handleCopy(`鳩山ニュータウンの朝は、驚くほど静かです。\n\n窓を開けると、都心では味わえない澄んだ空気と小鳥のさえずり。\n南東・南西の角地だから、朝日がリビングの杉板天井に差し込んできます。\n\n駅からはバスで11分。確かに「駅前徒歩5分」の便利さはありません。\nでも、その代わりここには、\n「喧騒のない静寂」「美味しい空気」「四季を感じる散歩コース」\nそして新築以上の性能を持った暖かい家があります。\n\n便利さだけに追われない、大人の豊かな暮らしとは何か。\n毎朝この現場に来るたびに実感します。\n\n#鳩山ニュータウン #終の住処 #田舎暮らし #スローライフ #澄んだ空気 #埼玉移住 #50代からの暮らし #再進の家`, 'post_2')}
                  className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  {copiedKey === 'post_2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'post_2' ? 'コピー完了' : '投稿文をコピー'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: AI動画・画像生成プロンプト（Veo 3）
        ========================================================================= */}
        {activeTab === 'aiPrompts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <h2 className="text-xl font-bold text-white mb-2">
                Veo 3 実物完全一致 シネマティック動画生成プロンプト
              </h2>
              <p className="text-xs text-stone-400">
                AIが勝手に架空の家具や文字を描画しないよう、「参照画像の実在する室内をそのまま維持し、カメラワークのみを指示する」最適化済みプロンプト集。
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="font-bold text-purple-400 text-sm">PROMPT 01: 太陽光が差し込む吹き抜けLDK（10秒動画）</span>
                  <span className="text-xs text-stone-500">参照画像: R0010055.JPG または LDK完成写真</span>
                </div>
                <div className="p-4 bg-stone-900 rounded-xl text-stone-200 text-xs font-mono leading-relaxed whitespace-pre-wrap">
{`【参照画像】: 指定のLDK実物写真（杉板木天井・シーリングファン・高窓）
【プロンプト】:
参照画像の実在する部屋の内装、杉板の木目天井、白い壁、シーリングファン、高窓の構造を100%完全に維持する。
日中の明るく澄んだ太陽光が、高窓から白い壁と無垢調フローリングに美しく斜めに差し込んでいる。
カメラはゆっくりと滑らかにリビングの中央に向かって前進するシネマティックなドリーイン。
シーリングファンが自然な速度で静かに回転している。
人物、テキスト、テロップ、不自然な家具の追加は一切行わない。フォトリアル、実写映像。`}
                </div>
                <button
                  onClick={() => handleCopy(`参照画像の実在する部屋の内装、杉板の木目天井、白い壁、シーリングファン、高窓の構造を100%完全に維持する。\n日中の明るく澄んだ太陽光が、高窓から白い壁と無垢調フローリングに美しく斜めに差し込んでいる。\nカメラはゆっくりと滑らかにリビングの中央に向かって前進するシネマティックなドリーイン。\nシーリングファンが自然な速度で静かに回転している。\n人物、テキスト、テロップ、不自然な家具の追加は一切行わない。フォトリアル、実写映像。`, 'prompt_1')}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'prompt_1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'prompt_1' ? 'コピー完了' : 'プロンプトをコピー'}</span>
                </button>
              </div>

              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="font-bold text-purple-400 text-sm">PROMPT 02: 鳩山ニュータウン外観＆青空ドローン（10秒動画）</span>
                  <span className="text-xs text-stone-500">参照画像: 建物外観写真（角地）</span>
                </div>
                <div className="p-4 bg-stone-900 rounded-xl text-stone-200 text-xs font-mono leading-relaxed whitespace-pre-wrap">
{`【参照画像】: 指定の外観角地写真（再進の家）
【プロンプト】:
参照画像の外観建物形状、敷地形状、道路の納まりを完全に維持する。
抜けるような青空と遠くの山並み、緑豊かな高台の鳩山ニュータウンの閑静な住宅街。
ドローンカメラが南東の角地からゆっくりと高度を上げながら、建物の全景と周囲の緑をパノラマで捉える。
車や歩行者は入れず、静寂と澄み切った空気感が伝わる映画のようなライティング。`}
                </div>
                <button
                  onClick={() => handleCopy(`参照画像の外観建物形状、敷地形状、道路の納まりを完全に維持する。\n抜けるような青空と遠くの山並み、緑豊かな高台の鳩山ニュータウンの閑静な住宅街。\nドローンカメラが南東の角地からゆっくりと高度を上げながら、建物の全景と周囲の緑をパノラマで捉える。\n車や歩行者は入れず、静寂と澄み切った空気感が伝わる映画のようなライティング。`, 'prompt_2')}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'prompt_2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'prompt_2' ? 'コピー完了' : 'プロンプトをコピー'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: 広告予算・CPAシミュレーション
        ========================================================================= */}
        {activeTab === 'budget' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <h2 className="text-xl font-bold text-white mb-2">
                Facebook / Instagram広告 運用シミュレーション
              </h2>
              <p className="text-xs text-stone-400">
                比企郡・東松山・坂戸・鶴ヶ島・川越周辺（半径25km）の持ち家層に向けた、推奨予算と獲得KPI目安。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-4">
                <div className="text-stone-400 font-bold uppercase text-xs">プラン 1（テスト運用）</div>
                <div className="text-2xl font-black text-white">月額 30,000 円</div>
                <div className="text-xs text-stone-400">1日あたり約1,000円</div>
                <div className="space-y-2 pt-4 border-t border-stone-800 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>推定インプレッション:</span>
                    <strong className="text-white">約 30,000 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>想定クリック数 (CTR 1.8%):</span>
                    <strong className="text-white">約 540 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>クリック単価 (CPC):</span>
                    <strong className="text-white">約 55 円</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>LP資料請求・内覧獲得:</span>
                    <strong className="text-amber-400 font-bold">2 〜 4 件</strong>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 p-6 rounded-3xl border border-amber-500/40 shadow-xl space-y-4 relative">
                <div className="absolute -top-3 right-6 bg-amber-500 text-stone-950 text-[10px] font-black px-3 py-0.5 rounded-full">
                  推奨プラン
                </div>
                <div className="text-amber-400 font-bold uppercase text-xs">プラン 2（標準運用）</div>
                <div className="text-2xl font-black text-white">月額 60,000 円</div>
                <div className="text-xs text-stone-400">1日あたり約2,000円</div>
                <div className="space-y-2 pt-4 border-t border-stone-800 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>推定インプレッション:</span>
                    <strong className="text-white">約 65,000 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>想定クリック数 (CTR 2.0%):</span>
                    <strong className="text-white">約 1,300 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>クリック単価 (CPC):</span>
                    <strong className="text-white">約 46 円</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>LP資料請求・内覧獲得:</span>
                    <strong className="text-amber-400 font-bold">6 〜 10 件</strong>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-4">
                <div className="text-stone-400 font-bold uppercase text-xs">プラン 3（早期売却集中）</div>
                <div className="text-2xl font-black text-white">月額 100,000 円</div>
                <div className="text-xs text-stone-400">1日あたり約3,300円</div>
                <div className="space-y-2 pt-4 border-t border-stone-800 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>推定インプレッション:</span>
                    <strong className="text-white">約 120,000 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>想定クリック数 (CTR 2.2%):</span>
                    <strong className="text-white">約 2,600 回</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>クリック単価 (CPC):</span>
                    <strong className="text-white">約 38 円</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>LP資料請求・内覧獲得:</span>
                    <strong className="text-amber-400 font-bold">12 〜 18 件</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-stone-300">
              <strong className="text-white block mb-1">投資対効果（ROI）の考え方：</strong>
              本物件は売主直売のため、一般的な仲介手数料（約85万円）が不要です。月額5万〜6万円の広告費を投じて2〜3ヶ月で成約に至れば、広告費総額15万円に対して十分すぎるほどの利益率と早期資金回収が達成されます。
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
