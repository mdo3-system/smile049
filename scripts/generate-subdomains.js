/**
 * scripts/generate-subdomains.js
 * ビルド成果物(dist/index.html)のJS/CSSアセットを抽出し、
 * 各サブドメイン(lp, eie, re)専用の完全静的HTML (SEO / AIO / OGP / 構造化データ) を自動生成する
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('[Error] dist/ directory not found. Please run "vite build" first.');
  process.exit(1);
}

const mainIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// 1. Viteが生成したJSおよびCSSのタグを抽出
const scriptTags = mainIndexHtml.match(/<script type="module" crossorigin src="\/assets\/[^"]+"><\/script>/g) || [];
const linkCssTags = mainIndexHtml.match(/<link rel="stylesheet" crossorigin href="\/assets\/[^"]+">/g) || [];
const extraScriptTags = mainIndexHtml.match(/<script src="\/Version\.js"><\/script>/g) || [];

const assetIncludes = `
    ${linkCssTags.join('\n    ')}
    ${extraScriptTags.join('\n    ')}
    ${scriptTags.join('\n    ')}
`;

// 2. 各サブドメインの設定定義
const subdomains = [
  {
    dir: 'lp',
    subdomain: 'lp.smile049.jp',
    title: '【公式】再進の家｜鳩山町 2,180万円・HEAT20 G2・ほぼ光熱費0円の高性能再生住宅',
    description: '練馬ICから車で約50分・埼玉県鳩山町。子供が独立した50代・60代・70代のご夫婦のための【2,180万円 フルスケルトン再生邸宅】。土地72坪・南西角地・Qセルズ大容量8.0kW太陽光発電（年間8,789kWh創エネ）・屋根遮熱銀次郎・タカラ高品位ホーロー設備。エアコン1台で家じゅう極暖の大人セカンドライフ。',
    keywords: '再進の家,鳩山町 リノベーション,鳩山ニュータウン 物件,50代 住み替え 埼玉,二拠点生活 関東,HEAT20 G2 リノベ,光熱費ゼロ住宅 埼玉,タカラスタンダード ホーロー',
    canonical: 'https://lp.smile049.jp/saishin/',
    ogpTitle: '【公式】再進の家｜鳩山町 2,180万円・HEAT20 G2・ほぼ光熱費0円の高性能再生住宅',
    ogpDesc: '子供が独立した50代〜70代からの住み替え・週末二拠点。新築以上の断熱性能（HEAT20 G2）とQセルズ太陽光8.0kWを搭載したフルスケルトン再生邸宅。',
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SingleFamilyResidence",
          "@id": "https://lp.smile049.jp/saishin/#residence",
          "name": "再進の家 鳩山町松栄モデルハウス",
          "description": "土地72坪・南西角地。HEAT20 G2相当の超高断熱（UA値0.46）と大容量8.0kW太陽光発電を標準搭載したフルスケルトン再生リノベーション邸宅。",
          "url": "https://lp.smile049.jp/saishin/",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "比企郡鳩山町松栄",
            "addressRegion": "埼玉県",
            "addressCountry": "JP"
          },
          "offers": {
            "@type": "Offer",
            "price": "21800000",
            "priceCurrency": "JPY",
            "availability": "https://schema.org/InStock",
            "businessFunction": "https://schema.org/Sell"
          },
          "numberOfRooms": 4,
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": 105.16,
            "unitCode": "MTK"
          }
        },
        {
          "@type": "GeneralContractor",
          "@id": "https://smile049.jp/#contractor",
          "name": "株式会社 住ま居る",
          "telephone": "+81-49-271-2350",
          "url": "https://smile049.jp/"
        }
      ]
    },
    bodyHtml: `
      <div id="initial-screen" style="min-height: 100vh; background: #0c0a09; color: #f5f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px;">
        <div style="max-width: 960px; margin: 0 auto;">
          <header style="border-bottom: 1px solid #292524; padding-bottom: 24px; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 4px 12px; background: #b45309; color: #fff; border-radius: 9999px; font-size: 13px; font-weight: bold; margin-bottom: 12px;">
              50代・60代・70代からの住み替え ＆ 週末二拠点別邸
            </div>
            <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.4; margin: 0 0 16px;">
              都心から約1時間。2,180万円で手に入る「維持費実質ゼロ」の極暖ヴィラ【再進の家】
            </h1>
            <p style="font-size: 16px; color: #a8a29e; line-height: 1.8; margin: 0;">
              埼玉県比企郡鳩山町松栄 ｜ 土地広々72坪・南西角地 ｜ Qセルズ大容量8.0kW太陽光発電 ｜ HEAT20 G2超高断熱 ｜ フルスケルトン再生・配管新品
            </p>
          </header>

          <main style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px;">
            <section style="background: #1c1917; padding: 20px; border-radius: 16px; border: 1px solid #44403c;">
              <h2 style="font-size: 18px; font-weight: 700; color: #f59e0b; margin-top: 0; margin-bottom: 8px;">
                ☀️ 太陽光8.0kW・年間発電8,789kWh
              </h2>
              <p style="font-size: 14px; color: #d6d3d1; line-height: 1.7;">
                年金暮らしでも電気代高騰の心配ゼロ。売電収入と自家消費で、年間の光熱費実質ゼロを実現。
              </p>
            </section>

            <section style="background: #1c1917; padding: 20px; border-radius: 16px; border: 1px solid #44403c;">
              <h2 style="font-size: 18px; font-weight: 700; color: #f59e0b; margin-top: 0; margin-bottom: 8px;">
                ❄️ 真冬もエアコン1台で家じゅうポカポカ
              </h2>
              <p style="font-size: 14px; color: #d6d3d1; line-height: 1.7;">
                HEAT20 G2（UA値0.46）× 屋根遮熱銀次郎。冬の脱衣所・トイレのヒートショック不安を根底から解消。
              </p>
            </section>

            <section style="background: #1c1917; padding: 20px; border-radius: 16px; border: 1px solid #44403c;">
              <h2 style="font-size: 18px; font-weight: 700; color: #f59e0b; margin-top: 0; margin-bottom: 8px;">
                ✨ 水回りはタカラ最高峰ホーロー新品
              </h2>
              <p style="font-size: 14px; color: #d6d3d1; line-height: 1.7;">
                油汚れも水拭きでスルリ。見えない床下配管・壁内電気配線まで全面新品交換済み。
              </p>
            </section>

            <section style="background: #1c1917; padding: 20px; border-radius: 16px; border: 1px solid #44403c;">
              <h2 style="font-size: 18px; font-weight: 700; color: #f59e0b; margin-top: 0; margin-bottom: 8px;">
                🏡 土地72坪・南西角地の贅沢な余白
              </h2>
              <p style="font-size: 14px; color: #d6d3d1; line-height: 1.7;">
                家庭菜園、ガーデニング、木漏れ日のウッドデッキ。夫婦それぞれの時間を尊重する2階独立居室。
              </p>
            </section>
          </main>

          <footer style="padding: 20px; background: #1c1917; border-radius: 12px; border: 1px solid #292524; text-align: center; font-size: 13px; color: #a8a29e;">
            <p style="margin: 0 0 6px;">
              <strong>売主直接販売（仲介手数料 約85万円が不要）</strong> ｜ 株式会社 住ま居る
            </p>
            <p style="margin: 0; font-size: 12px; color: #78716c;">
              ※モデルハウス写真ギャラリーおよび体感予約システムを読み込み中...
            </p>
          </footer>
        </div>
      </div>
    `
  },
  {
    dir: 'eie',
    subdomain: 'eie.smile049.jp',
    title: 'EIE不動産｜20代・30代からの中古購入＋リノベ正解ルート【専門調査(JFD)×二級建築士×一括住宅ローン】',
    description: '新築4,000万は高すぎる！20代・30代の賢いマイホーム戦略は「中古住宅を買ってリノベが正解」。提携専門調査機関（JFD）による精密物件調査（測量・行政・法務局調査：約10万円）と二級建築士による法規・確認申請・リノベ一括ローンまでワンストップ対応。埼玉県・関東一円。',
    keywords: 'EIE不動産,中古住宅 リノベーション 埼玉,中古購入 リノベ 20代 30代,JFD 物件調査,二級建築士 リノベ 埼玉,住宅ローン 一括 リノベ,狭山 川越 不動産',
    canonical: 'https://eie.smile049.jp/',
    ogpTitle: 'EIE不動産｜20代・30代からの中古購入＋リノベ正解ルート',
    ogpDesc: '新築高騰時代の賢い選択。専門調査機関（JFD）と二級建築士が連携する安心の中古＋リノベーション仲介。',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "@id": "https://eie.smile049.jp/#agent",
      "name": "EIE不動産 / 株式会社 住ま居る",
      "description": "20代・30代向けの中古住宅購入＋フルリノベーション専門ワンストップ不動産仲介。専門調査機関（JFD）による精密物件調査と二級建築士による法規・確認申請・住宅ローン一本化を自社一貫提供。",
      "url": "https://eie.smile049.jp/",
      "telephone": "+81-49-271-2350",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "町屋176番地5",
        "addressLocality": "鶴ヶ島市",
        "addressRegion": "埼玉県",
        "postalCode": "350-2224",
        "addressCountry": "JP"
      }
    },
    bodyHtml: `
      <div id="initial-screen" style="min-height: 100vh; background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px;">
        <div style="max-width: 960px; margin: 0 auto;">
          <header style="border-bottom: 1px solid #334155; padding-bottom: 24px; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 4px 12px; background: #2563eb; color: #fff; border-radius: 9999px; font-size: 13px; font-weight: bold; margin-bottom: 12px;">
              20代・30代からの賢いマイホーム戦略
            </div>
            <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.4; margin: 0 0 16px;">
              新築4,000万は高すぎる！「中古を買ってリノベ」が正解な3つの理由【EIE不動産】
            </h1>
            <p style="font-size: 16px; color: #94a3b8; line-height: 1.8; margin: 0;">
              専門調査機関（JFD）による精密調査 ｜ 二級建築士による法規・確認申請 ｜ 物件価格＋リノベ費用を一括住宅ローン化 ｜ 埼玉県・関東一円対応
            </p>
          </header>

          <main style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px;">
            <section style="background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid #334155;">
              <h2 style="font-size: 18px; font-weight: 700; color: #38bdf8; margin-top: 0; margin-bottom: 8px;">
                💡 新築の3/4の予算で高性能化
              </h2>
              <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7;">
                中古物件（約2,000万）＋フルリノベ（約1,000万）＝総額3,000万円。建物固定資産税はほぼ評価0円で毎年節税。
              </p>
            </section>

            <section style="background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid #334155;">
              <h2 style="font-size: 18px; font-weight: 700; color: #38bdf8; margin-top: 0; margin-bottom: 8px;">
                🔍 専門調査機関（JFD）精密調査×二級建築士
              </h2>
              <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7;">
                約10万円で測量・行政・法務局調査を実施。二級建築士が「この壁は抜けるか」「確認申請が通るか」を事前に明確化。
              </p>
            </section>

            <section style="background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid #334155;">
              <h2 style="font-size: 18px; font-weight: 700; color: #38bdf8; margin-top: 0; margin-bottom: 8px;">
                🏦 物件代＋リノベ代を低金利一括ローン
              </h2>
              <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7;">
                通常別々になるリフォームローン（金利高）を、低金利な住宅ローンに一本化。月々返済を大幅に軽減。
              </p>
            </section>

            <section style="background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid #334155;">
              <h2 style="font-size: 18px; font-weight: 700; color: #38bdf8; margin-top: 0; margin-bottom: 8px;">
                🚪 死んだ勝手口を境界ストッカーへ
              </h2>
              <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7;">
                築20年超の勝手口を活用し境界いっぱいまでパントリー増築。玄関土間拡張と基礎断熱でQOL向上。
              </p>
            </section>
          </main>

          <footer style="padding: 20px; background: #1e293b; border-radius: 12px; border: 1px solid #334155; text-align: center; font-size: 13px; color: #94a3b8;">
            <p style="margin: 0 0 6px;">
              <strong>宅地建物取引業者免許 埼玉県知事 (3)第23725号 ｜ 建築士事務所登録 第(5)10278号</strong> ｜ 株式会社 住ま居る
            </p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              ※EIE不動産 ポータルを読み込み中...
            </p>
          </footer>
        </div>
      </div>
    `
  },
  {
    dir: 're',
    subdomain: 're.smile049.jp',
    title: 'スマイチリフォーム RE｜戸建て断熱・耐震・水回りフルリノベーション【埼玉】',
    description: '冬寒く夏暑い家を、エアコン1台で快適な省エネ住宅へ。基礎外断熱＋床暖房、内窓インプラス、タカラ最高峰ホーロー設備、屋根遮熱銀次郎。二級建築士が耐震と温熱を計算するフルリノベーション。埼玉県全域対応。',
    keywords: 'スマイチリフォーム,戸建て 断熱リフォーム 埼玉,基礎外断熱 床暖房,耐震補強 リノベーション,タカラスタンダード ホーローリフォーム,窓断熱 内窓 埼玉',
    canonical: 'https://re.smile049.jp/',
    ogpTitle: 'スマイチリフォーム RE｜戸建て断熱・耐震・水回りフルリノベーション',
    ogpDesc: '基礎外断熱＋床暖房で冬の朝もスリッパ不要。二級建築士が手がける本物の断熱・耐震リノベーション。',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "GeneralContractor",
      "@id": "https://re.smile049.jp/#contractor",
      "name": "スマイチリフォーム RE / 株式会社 住ま居る",
      "description": "木造戸建ての断熱・耐震・水回りフルリノベーション専門ブランド。基礎外断熱工法とタカラスタンダード高品位ホーロー設備で快適な住まいを再生。",
      "url": "https://re.smile049.jp/",
      "telephone": "+81-49-271-2350"
    },
    bodyHtml: `
      <div id="initial-screen" style="min-height: 100vh; background: #18181b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px;">
        <div style="max-width: 960px; margin: 0 auto;">
          <header style="border-bottom: 1px solid #27272a; padding-bottom: 24px; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 4px 12px; background: #059669; color: #fff; border-radius: 9999px; font-size: 13px; font-weight: bold; margin-bottom: 12px;">
              戸建て断熱・耐震・水回りフルリノベーション
            </div>
            <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.4; margin: 0 0 16px;">
              真冬の朝も、スリッパなしでキッチンへ【スマイチリフォーム RE】
            </h1>
            <p style="font-size: 16px; color: #a1a1aa; line-height: 1.8; margin: 0;">
              基礎外断熱＋床暖房 ｜ 内窓インプラス ｜ タカラスタンダード高品位ホーロー設備 ｜ 屋根遮熱銀次郎 ｜ 埼玉県全域対応
            </p>
          </header>

          <main style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px;">
            <section style="background: #27272a; padding: 20px; border-radius: 16px; border: 1px solid #3f3f46;">
              <h2 style="font-size: 18px; font-weight: 700; color: #34d399; margin-top: 0; margin-bottom: 8px;">
                🔥 基礎外断熱＋床暖房
              </h2>
              <p style="font-size: 14px; color: #d4d4d8; line-height: 1.7;">
                床下からの底冷えを完全にシャットアウト。家中が均一に暖まるQOL爆上がりの快適工法。
              </p>
            </section>

            <section style="background: #27272a; padding: 20px; border-radius: 16px; border: 1px solid #3f3f46;">
              <h2 style="font-size: 18px; font-weight: 700; color: #34d399; margin-top: 0; margin-bottom: 8px;">
                🪟 先進的窓リノベ対応（内窓インプラス）
              </h2>
              <p style="font-size: 14px; color: #d4d4d8; line-height: 1.7;">
                既存窓の内側にもう1枚。結露を激減させ、冷暖房効率を約40%向上。補助金活用も対応。
              </p>
            </section>

            <section style="background: #27272a; padding: 20px; border-radius: 16px; border: 1px solid #3f3f46;">
              <h2 style="font-size: 18px; font-weight: 700; color: #34d399; margin-top: 0; margin-bottom: 8px;">
                🍳 タカラ最高峰ホーロー設備
              </h2>
              <p style="font-size: 14px; color: #d4d4d8; line-height: 1.7;">
                油汚れも水拭きだけ。磁石が付く自由な壁面収納と頑丈な磁器タイル床のシステムバス。
              </p>
            </section>

            <section style="background: #27272a; padding: 20px; border-radius: 16px; border: 1px solid #3f3f46;">
              <h2 style="font-size: 18px; font-weight: 700; color: #34d399; margin-top: 0; margin-bottom: 8px;">
                🌿 エコカラット・左官・木壁アクセント
              </h2>
              <p style="font-size: 14px; color: #d4d4d8; line-height: 1.7;">
                単なるクロス張替えにとどまらない、調湿・消臭と上質な空間意匠のハイブリッド提案。
              </p>
            </section>
          </main>

          <footer style="padding: 20px; background: #27272a; border-radius: 12px; border: 1px solid #3f3f46; text-align: center; font-size: 13px; color: #a1a1aa;">
            <p style="margin: 0 0 6px;">
              <strong>建築士事務所登録 埼玉県知事 第(5)10278号</strong> ｜ 株式会社 住ま居る
            </p>
            <p style="margin: 0; font-size: 12px; color: #71717a;">
              ※リフォーム概算診断・プランナーを読み込み中...
            </p>
          </footer>
        </div>
      </div>
    `
  }
];

// 3. 各サブドメインのディレクトリ作成とHTML・.htaccess生成
subdomains.forEach((item) => {
  const targetSubDir = path.join(distDir, item.dir);
  if (!fs.existsSync(targetSubDir)) {
    fs.mkdirSync(targetSubDir, { recursive: true });
  }

  const buildHtml = (customCanonical) => `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-EV2QGP2C62"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-EV2QGP2C62', { send_page_view: false });
    </script>

    <!-- SEO基本メタタグ -->
    <title>${item.title}</title>
    <meta name="description" content="${item.description}" />
    <meta name="keywords" content="${item.keywords}" />
    <link rel="canonical" href="${customCanonical || item.canonical}" />

    <!-- OGP (Open Graph Protocol) -->
    <meta property="og:title" content="${item.ogpTitle}" />
    <meta property="og:description" content="${item.ogpDesc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${customCanonical || item.canonical}" />
    <meta property="og:image" content="https://smile049.jp/assets/ogp.webp" />
    <meta property="og:site_name" content="${item.title.split('｜')[0]}" />
    <meta property="og:locale" content="ja_JP" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${item.ogpTitle}" />
    <meta name="twitter:description" content="${item.ogpDesc}" />
    <meta property="twitter:image" content="https://smile049.jp/assets/ogp.webp" />

    <!-- ファビコン・アイコン -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- 構造化データ (JSON-LD) -->
    <script type="application/ld+json">
${JSON.stringify(item.jsonLd, null, 2)}
    </script>

    <!-- アセット読み込み (親ドメインassetsパス) -->
${assetIncludes}
  </head>
  <body>
    <div id="root">
      <noscript>
        <div style="padding: 20px; text-align: center; background: #fff3cd; color: #856404;">
          ※コンテンツの完全な表示にはJavaScriptを有効にしてください。
        </div>
      </noscript>

${item.bodyHtml}
    </div>
  </body>
</html>`;

  // ルート用 index.html
  fs.writeFileSync(path.join(targetSubDir, 'index.html'), buildHtml(item.canonical), 'utf8');

  // lpの場合は /saishin/ 用のサブディレクトリも生成して両対応！
  if (item.dir === 'lp') {
    const saishinDir = path.join(targetSubDir, 'saishin');
    if (!fs.existsSync(saishinDir)) {
      fs.mkdirSync(saishinDir, { recursive: true });
    }
    fs.writeFileSync(path.join(saishinDir, 'index.html'), buildHtml('https://lp.smile049.jp/saishin/'), 'utf8');
    console.log(`[Success] Generated static HTML for https://lp.smile049.jp/saishin/ in dist/lp/saishin/`);
  }

  // SPAフォールバック用 .htaccess
  const htaccessContent = `RewriteEngine On
RewriteBase /
RewriteRule ^saishin/?$ /saishin/index.html [L]
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
`;
  fs.writeFileSync(path.join(targetSubDir, '.htaccess'), htaccessContent, 'utf8');

  console.log(`[Success] Generated static HTML & .htaccess for ${item.subdomain} in dist/${item.dir}/`);
});

console.log('[Complete] All subdomain static templates generated successfully.');
