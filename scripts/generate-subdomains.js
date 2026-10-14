/**
 * scripts/generate-subdomains.js
 * 
 * 1. サブドメイン(lp, eie, re)専用の完全静的HTML (SEO / AIO / OGP / 構造化データ) の自動生成
 * 2. 各サブドメイン専用の sitemap.xml および robots.txt の自動生成
 * 3. 親ドメイン用 sitemap-index.xml の自動生成
 * 4. 全15本のSEOコラム記事 (columnService.js) の完全静的HTML (SSG/プリレンダリング) 自動生成
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_COLUMNS } from '../src/services/columnService.js';

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
    sitemapUrls: [
      { loc: 'https://lp.smile049.jp/', priority: '1.0', changefreq: 'daily' },
      { loc: 'https://lp.smile049.jp/saishin/', priority: '0.95', changefreq: 'daily' },
      { loc: 'https://lp.smile049.jp/technology', priority: '0.85', changefreq: 'weekly' },
      { loc: 'https://lp.smile049.jp/spec', priority: '0.85', changefreq: 'weekly' }
    ],
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
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "本当に年間の光熱費はほぼゼロになりますか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Qセルズ大容量8.0kW太陽光発電により年間約8,789kWhを発電します。HEAT20 G2相当の高断熱と屋根遮熱銀次郎により冷暖房負荷を最小化しているため、自家消費と売電収入を合算することで年間の光熱費収支実質ゼロ円を実現します。"
              }
            },
            {
              "@type": "Question",
              "name": "仲介手数料約85万円が不要なのはなぜですか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "売主が施工者である株式会社 住ま居る直接のため、一般的な不動産売買で発生する仲介手数料（物件価格の3%＋6万円＋消費税＝約85万円）が一切かかりません。"
              }
            }
          ]
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
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #292524; display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; font-size: 12px;">
              <a href="https://smile049.jp/" style="color: #fbbf24; text-decoration: none;">【住ま居る公式】木造ガレージ・倉庫 スマイチ</a>
              <span style="color: #57534e;">|</span>
              <a href="https://eie.smile049.jp/" style="color: #38bdf8; text-decoration: none;">【EIE不動産】20代30代からの中古＋リノベ</a>
              <span style="color: #57534e;">|</span>
              <a href="https://re.smile049.jp/" style="color: #34d399; text-decoration: none;">【スマイチリフォーム RE】戸建てフルリノベ</a>
            </div>
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
    sitemapUrls: [
      { loc: 'https://eie.smile049.jp/', priority: '1.0', changefreq: 'daily' }
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
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
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "なぜ20代・30代に中古購入＋リノベを推奨するのですか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "資材高騰により新築建売は4,000万円を超え、毎月の住宅ローン負担が重くのしかかります。立地条件の良い築20年〜30年の中古物件（約2,000万円）を購入し、約1,000万円で断熱・水回りをフルリノベすれば、総額3,000万円で新築以上の快適空間が手に入り、建物固定資産税も大幅に抑えられます。"
              }
            },
            {
              "@type": "Question",
              "name": "物件調査は誰が行うのですか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "提携専門調査機関（JFD）に約10万円で委託し、測量・行政協議・法務局調査を実施します。その調査報告をもとに自社の二級建築士が『この壁を抜いて大空間にできるか』『建築基準法上の確認申請が必要か』を正確に判定します。"
              }
            }
          ]
        }
      ]
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
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #334155; display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; font-size: 12px;">
              <a href="https://smile049.jp/" style="color: #fbbf24; text-decoration: none;">【住ま居る公式】木造ガレージ・倉庫 スマイチ</a>
              <span style="color: #64748b;">|</span>
              <a href="https://lp.smile049.jp/saishin/" style="color: #f59e0b; text-decoration: none;">【再進の家】50代〜70代 鳩山町2,180万</a>
              <span style="color: #64748b;">|</span>
              <a href="https://re.smile049.jp/" style="color: #34d399; text-decoration: none;">【スマイチリフォーム RE】戸建てフルリノベ</a>
            </div>
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
    sitemapUrls: [
      { loc: 'https://re.smile049.jp/', priority: '1.0', changefreq: 'daily' }
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "GeneralContractor",
          "@id": "https://re.smile049.jp/#contractor",
          "name": "スマイチリフォーム RE / 株式会社 住ま居る",
          "description": "木造戸建ての断熱・耐震・水回りフルリノベーション専門ブランド。基礎外断熱工法とタカラスタンダード高品位ホーロー設備で快適な住まいを再生。",
          "url": "https://re.smile049.jp/",
          "telephone": "+81-49-271-2350"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "基礎外断熱工法のメリットは何ですか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "従来の床下断熱では防ぎきれない床下の冷気を根本から遮断し、コンクリート基礎を蓄熱体として利用します。真冬でもスリッパなしで素足で歩ける快適性と、床暖房の熱効率最大化を実現します。"
              }
            }
          ]
        }
      ]
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
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #3f3f46; display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; font-size: 12px;">
              <a href="https://smile049.jp/" style="color: #fbbf24; text-decoration: none;">【住ま居る公式】木造ガレージ・倉庫 スマイチ</a>
              <span style="color: #71717a;">|</span>
              <a href="https://lp.smile049.jp/saishin/" style="color: #f59e0b; text-decoration: none;">【再進の家】50代〜70代 鳩山町2,180万</a>
              <span style="color: #71717a;">|</span>
              <a href="https://eie.smile049.jp/" style="color: #38bdf8; text-decoration: none;">【EIE不動産】20代30代からの中古＋リノベ</a>
            </div>
          </footer>
        </div>
      </div>
    `
  }
];

// 3. 各サブドメインのディレクトリ作成とHTML・.htaccess・sitemap.xml・robots.txt生成
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

  // サブドメイン専用 sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${item.sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(targetSubDir, 'sitemap.xml'), sitemapXml, 'utf8');

  // サブドメイン専用 robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://${item.subdomain}/sitemap.xml
`;
  fs.writeFileSync(path.join(targetSubDir, 'robots.txt'), robotsTxt, 'utf8');

  console.log(`[Success] Generated static HTML, .htaccess, sitemap.xml & robots.txt for ${item.subdomain}`);
});

// 4. 親ドメイン用 sitemap-index.xml の生成
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://smile049.jp/sitemap.xml</loc>
    <lastmod>2026-10-14</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://lp.smile049.jp/sitemap.xml</loc>
    <lastmod>2026-10-14</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://eie.smile049.jp/sitemap.xml</loc>
    <lastmod>2026-10-14</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://re.smile049.jp/sitemap.xml</loc>
    <lastmod>2026-10-14</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), sitemapIndexXml, 'utf8');
console.log('[Success] Generated dist/sitemap-index.xml');

// 5. 全15本のSEOコラム記事の完全静的HTML (SSG/プリレンダリング) 生成
console.log(`[Building] Pre-rendering ${DEFAULT_COLUMNS.length} SEO Column articles to static HTML...`);

const columnBaseDir = path.join(distDir, 'column');
if (!fs.existsSync(columnBaseDir)) {
  fs.mkdirSync(columnBaseDir, { recursive: true });
}

DEFAULT_COLUMNS.forEach((col) => {
  const colDir = path.join(columnBaseDir, col.slug);
  if (!fs.existsSync(colDir)) {
    fs.mkdirSync(colDir, { recursive: true });
  }

  // 構造化データ (Article & FAQPage)
  const jsonLdGraph = [
    {
      "@type": "Article",
      "@id": `https://smile049.jp/column/${col.slug}#article`,
      "headline": col.title,
      "description": col.description,
      "datePublished": col.publishedDate || "2026-10-09",
      "dateModified": "2026-10-14",
      "mainEntityOfPage": `https://smile049.jp/column/${col.slug}`,
      "image": col.heroImage ? `https://smile049.jp${col.heroImage}` : "https://smile049.jp/assets/ogp.webp",
      "author": {
        "@type": "Organization",
        "name": "株式会社 住ま居る 一級・二級建築士設計部",
        "url": "https://smile049.jp/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "株式会社 住ま居る",
        "logo": {
          "@type": "ImageObject",
          "url": "https://smile049.jp/favicon-32x32.png"
        }
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ホーム",
          "item": "https://smile049.jp/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "コラム一覧",
          "item": "https://smile049.jp/stories"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": col.title,
          "item": `https://smile049.jp/column/${col.slug}`
        }
      ]
    }
  ];

  // FAQPageの抽出
  const allFaqs = [];
  (col.sections || []).forEach(sec => {
    if (Array.isArray(sec.faqs)) {
      sec.faqs.forEach(f => {
        allFaqs.push({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        });
      });
    }
  });

  if (allFaqs.length > 0) {
    jsonLdGraph.push({
      "@type": "FAQPage",
      "mainEntity": allFaqs
    });
  }

  // 記事本文HTMLの組み立て
  const sectionsHtml = (col.sections || []).map((sec, idx) => `
    <section style="margin-bottom: 36px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #b45309; padding-left: 12px; margin-bottom: 16px; line-height: 1.4;">
        ${sec.h2}
      </h2>
      ${sec.content ? `<div style="font-size: 16px; line-height: 1.85; color: #334155; margin-bottom: 16px; white-space: pre-line;">${sec.content}</div>` : ''}
      ${sec.bulletPoints ? `
        <ul style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px 16px 36px; margin: 16px 0; color: #1e293b; line-height: 1.8;">
          ${sec.bulletPoints.map(bp => `<li style="margin-bottom: 6px;">${bp}</li>`).join('')}
        </ul>
      ` : ''}
      ${sec.highlight ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 8px 8px 0; font-weight: 600; color: #92400e; margin: 16px 0;">
          ${sec.highlight}
        </div>
      ` : ''}
      ${sec.comparisonTable ? `
        <div style="overflow-x: auto; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; background: #fff; border: 1px solid #cbd5e1;">
            <thead>
              <tr style="background: #0f172a; color: #fff;">
                <th style="padding: 10px 14px; border: 1px solid #cbd5e1;">比較項目</th>
                <th style="padding: 10px 14px; border: 1px solid #cbd5e1; background: #b45309;">木造自由設計（スマイチ）</th>
                <th style="padding: 10px 14px; border: 1px solid #cbd5e1;">規格スチールガレージ</th>
              </tr>
            </thead>
            <tbody>
              ${sec.comparisonTable.map(row => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 14px; font-weight: 600; background: #f8fafc; border: 1px solid #cbd5e1;">${row.item}</td>
                  <td style="padding: 10px 14px; color: #166534; font-weight: 500; border: 1px solid #cbd5e1;">${row.wood}</td>
                  <td style="padding: 10px 14px; color: #64748b; border: 1px solid #cbd5e1;">${row.steel}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
      ${sec.faqs ? `
        <div style="margin: 20px 0; display: flex; flex-direction: column; gap: 12px;">
          ${sec.faqs.map(f => `
            <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; border-left: 4px solid #0284c7;">
              <h3 style="font-size: 16px; font-weight: 700; color: #0369a1; margin: 0 0 8px;">Q. ${f.q}</h3>
              <p style="font-size: 15px; color: #334155; margin: 0; line-height: 1.7;">A. ${f.a}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `).join('');

  const colHtml = `<!DOCTYPE html>
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
    <title>${col.title}｜木造ガレージ・倉庫 スマイチ公式</title>
    <meta name="description" content="${col.description}" />
    <meta name="keywords" content="${(col.tags || []).join(',')},木造ガレージ,スマイチ,住ま居る" />
    <link rel="canonical" href="https://smile049.jp/column/${col.slug}" />

    <!-- OGP (Open Graph Protocol) -->
    <meta property="og:title" content="${col.title}｜木造ガレージ・倉庫 スマイチ" />
    <meta property="og:description" content="${col.description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://smile049.jp/column/${col.slug}" />
    <meta property="og:image" content="${col.heroImage ? `https://smile049.jp${col.heroImage}` : 'https://smile049.jp/assets/ogp.webp'}" />
    <meta property="og:site_name" content="木造ガレージ・倉庫 スマイチ" />
    <meta property="og:locale" content="ja_JP" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${col.title}" />
    <meta name="twitter:description" content="${col.description}" />
    <meta property="twitter:image" content="${col.heroImage ? `https://smile049.jp${col.heroImage}` : 'https://smile049.jp/assets/ogp.webp'}" />

    <!-- ファビコン・アイコン -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- 構造化データ (JSON-LD: Article + Breadcrumb + FAQPage) -->
    <script type="application/ld+json">
${JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLdGraph }, null, 2)}
    </script>

    <!-- アセット読み込み -->
${assetIncludes}
  </head>
  <body style="background: #f8fafc; color: #1e293b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0;">
    <div id="root">
      <noscript>
        <div style="padding: 16px; text-align: center; background: #fff3cd; color: #856404; font-size: 14px;">
          ※シミュレーターや対話機能をご利用の場合は、JavaScriptを有効にしてください。
        </div>
      </noscript>

      <!-- 静的記事コンテンツ (検索エンジン & AIクローラー向け即時レンダリング) -->
      <article style="max-width: 860px; margin: 0 auto; padding: 32px 20px; background: #ffffff; min-height: 100vh; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <!-- パンくずリスト -->
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
          <a href="/" style="color: #64748b; text-decoration: none;">ホーム</a>
          <span style="margin: 0 8px;">&gt;</span>
          <a href="/stories" style="color: #64748b; text-decoration: none;">コラム一覧</a>
          <span style="margin: 0 8px;">&gt;</span>
          <span style="color: #0f172a; font-weight: 600;">${col.title}</span>
        </nav>

        <!-- カテゴリ＆公開日 -->
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <span style="display: inline-block; padding: 4px 10px; background: #fef3c7; color: #92400e; border-radius: 9999px; font-size: 12px; font-weight: 700;">
            ${col.category || 'お悩み解決コラム'}
          </span>
          <time datetime="${col.publishedDate || '2026-10-09'}" style="font-size: 13px; color: #94a3b8;">
            公開日: ${col.publishedDate || '2026-10-09'}
          </time>
          <span style="font-size: 13px; color: #94a3b8;">
            読了目安: ${col.readTime || '約5分'}
          </span>
        </div>

        <!-- 記事タイトル (H1) -->
        <h1 style="font-size: 26px; line-height: 1.45; font-weight: 800; color: #0f172a; margin: 0 0 20px;">
          ${col.title}
        </h1>

        <!-- 導入リード文 -->
        <div style="font-size: 16px; line-height: 1.85; color: #475569; background: #f8fafc; border-left: 4px solid #b45309; padding: 18px 20px; border-radius: 0 8px 8px 0; margin-bottom: 32px;">
          ${col.description}
        </div>

        <!-- 本文セクション -->
        ${sectionsHtml}

        <!-- 3DシミュレーターCTA -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 28px; text-align: center; color: #ffffff; margin: 40px 0;">
          <div style="font-size: 13px; color: #38bdf8; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px;">
            SMILE049 3D SIMULATOR
          </div>
          <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 12px;">
            あなたの土地の形状・寸法で、無料3D配置＆概算見積もり
          </h3>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px;">
            変形地、境界15cm、大型農機具、2台用ガレージなど、リアルタイムに3D表示。
          </p>
          <a href="/simulator" style="display: inline-block; background: #f59e0b; color: #000; font-weight: 700; font-size: 15px; padding: 12px 28px; border-radius: 9999px; text-decoration: none; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
            ▶ 無料3Dシミュレーターを起動する
          </a>
        </div>

        <!-- グループ事業相互リンクフッター -->
        <footer style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <div style="font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 12px;">
            株式会社 住ま居る グループ事業ネットワーク
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            <a href="https://smile049.jp/" style="display: block; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-decoration: none;">
              <div style="font-weight: 700; font-size: 13px; color: #0f172a;">木造ガレージ・倉庫 スマイチ</div>
              <div style="font-size: 11px; color: #64748b;">30代〜 / 敷地に合わせて描く自由設計</div>
            </a>
            <a href="https://lp.smile049.jp/saishin/" style="display: block; padding: 10px 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; text-decoration: none;">
              <div style="font-weight: 700; font-size: 13px; color: #b45309;">再進の家（鳩山町2,180万）</div>
              <div style="font-size: 11px; color: #92400e;">50代〜70代 / HEAT20 G2 / 光熱費実質ゼロ</div>
            </a>
            <a href="https://eie.smile049.jp/" style="display: block; padding: 10px 12px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; text-decoration: none;">
              <div style="font-weight: 700; font-size: 13px; color: #0284c7;">EIE不動産（中古＋リノベ）</div>
              <div style="font-size: 11px; color: #0369a1;">20代・30代 / JFD専門調査×二級建築士</div>
            </a>
            <a href="https://re.smile049.jp/" style="display: block; padding: 10px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-decoration: none;">
              <div style="font-weight: 700; font-size: 13px; color: #16a34a;">スマイチリフォーム RE</div>
              <div style="font-size: 11px; color: #15803d;">持ち家再生 / 基礎外断熱＋床暖房</div>
            </a>
          </div>
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
            © 株式会社 住ま居る / 建築士事務所登録 埼玉県知事 第(5)10278号
          </div>
        </footer>
      </article>
    </div>
  </body>
</html>`;

  fs.writeFileSync(path.join(colDir, 'index.html'), colHtml, 'utf8');
});

console.log(`[Success] Successfully pre-rendered all ${DEFAULT_COLUMNS.length} SEO Column articles to static HTML.`);
console.log('[Complete] All static generation completed successfully.');
