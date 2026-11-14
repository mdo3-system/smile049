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
    title: 'EIE不動産｜中古購入×リノベ・土地探し×ガレージ【埼玉県西部エリア限定・工務店直営】',
    description: '新築4,000万は高すぎる！20代・30代の賢いマイホーム戦略は「中古住宅を買ってリノベ」「土地探し×木造ガレージ建築」が正解。販売図面をスマホ撮影してAI 3D化＆Stable Diffusionによるリフォーム後3Dパース即時プレビュー。提携専門調査機関（JFD）による精密物件調査と二級建築士による法規・確認申請・一括住宅ローン対応。鶴ヶ島・坂戸・川越・鳩山・越生・毛呂山・東松山・日高・飯能・所沢・狭山。',
    keywords: 'EIE不動産,図面 3Dパース AI,リフォーム 3Dパース,中古住宅 リノベーション 埼玉,土地探し ガレージ 埼玉,20代 30代 マイホーム,鶴ヶ島 川越 坂戸 鳩山 不動産,JFD 物件調査,二級建築士 リノベ',
    canonical: 'https://eie.smile049.jp/',
    ogpTitle: 'EIE不動産｜中古購入×リノベ・土地探し×ガレージ【図面3DパースAI対応】',
    ogpDesc: 'ただの不動産屋ではありません。販売図面スマホ撮影でAI 3Dリノベパース作成。工務店直営の中古＋リノベ＆土地＋ガレージ仲介。',
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
          "description": "埼玉県西部エリア限定（鶴ヶ島・坂戸・川越・鳩山・越生・毛呂山・東松山・日高・飯能・所沢・狭山）。中古購入×リノベセット、土地探し×木造ガレージセットの工務店直営ワンストップ不動産仲介。図面スマホ撮影によるAI 3Dパース作成サービス提供。",
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
              "name": "図面を撮影するだけでリフォーム後の3Dパースが見られますか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "はい。販売図面（マイソク）をスマホで撮影してアップロードいただくだけで、AIが間取りを認識し3D化。さらにStable DiffusionのControlNetと深度マップを駆使して、大空間LDKや対面キッチンなどリフォーム後のフォトリアルな3D完成予想パースを即時プレビューいただけます。"
              }
            },
            {
              "@type": "Question",
              "name": "物件調査は誰が行うのですか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "提携専門調査機関（JFD）に約10万円で委託し、測量・行政協議・法務局調査を実施します。その調査報告をもとに自社の二級建築士が『この壁を抜いて大空間にできるか』『建築基準法上の確認申請が必要か』を正確に判定します。"
              }
            },
            {
              "@type": "Question",
              "name": "中古住宅の購入やリフォームで受給できる補助金はいくらありますか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "国の『長期優良住宅化リフォーム推進事業（最大210万円）』や『先進的窓リノベ事業（最大100万円）』『給湯省エネ事業（最大46万円）』に加え、東京都の『省エネ改修促進事業（最大300万円）』や『埼玉県窓断熱リフォーム支援事業（国の交付額の1/2上乗せ）』など、国と自治体の上乗せを併用することで最大200万〜300万円以上の助成を受けることができます。株式会社住ま居るは登録事業者のため申請代行が可能です。"
              }
            },
            {
              "@type": "Question",
              "name": "補助金を受給する際の注意点は何ですか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "工事請負契約の前、または着工前に交付申請・事前相談を完了させておくことが鉄則です。契約後に遡って申請することは原則できません。また、登録事業者による施工が必須となるため、事前にご相談ください。"
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
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
              <span style="display: inline-block; padding: 4px 12px; background: #2563eb; color: #fff; border-radius: 9999px; font-size: 13px; font-weight: bold;">
                20代・30代からの賢いマイホーム戦略
              </span>
              <span style="display: inline-block; padding: 4px 12px; background: #059669; color: #fff; border-radius: 9999px; font-size: 13px; font-weight: bold;">
                埼玉県西部エリア限定（鶴ヶ島・坂戸・川越・鳩山・越生・毛呂山・東松山・日高・飯能・所沢・狭山）
              </span>
            </div>
            <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.4; margin: 0 0 16px;">
              ただの不動産屋ではありません。「中古＋リノベ」＆「土地＋ガレージ」工務店直営ワンストップ【EIE不動産】
            </h1>
            <p style="font-size: 16px; color: #94a3b8; line-height: 1.8; margin: 0;">
              専門調査機関（JFD）精密調査 ｜ 二級建築士による法規・確認申請 ｜ 物件＋リノベ一括住宅ローン ｜ 販売図面スマホ撮影 ➔ AI 3Dリノベパース即時プレビュー
            </p>
          </header>

          {/* 3DパースAI 特集ブロック */}
          <section style="background: linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%); border: 1px solid #8b5cf6; border-radius: 16px; padding: 24px; margin-bottom: 28px; color: #f3e8ff;">
            <div style="font-size: 12px; font-weight: bold; color: #c084fc; margin-bottom: 6px;">
              📸 【画期的サービス】図面をスマホで撮るだけ！
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 10px;">
              AIが間取りを3D化 ➔ Stable Diffusionでリフォーム後フォトリアルパースを即時生成
            </h2>
            <p style="font-size: 13px; color: #e9d5ff; line-height: 1.7; margin: 0;">
              気になった中古物件のマイソク図面をスマホで撮影するだけ。3Dホワイトモデルを自動構築し、ControlNet（深度・エッジ線画）と高精度プロンプトにより、大空間LDKや対面キッチン、無垢フローリング等のリノベ後イメージを実寸スケールで可視化します。
            </p>
          </section>

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
                🏎️ 自社預かり土地×木造ガレージ建築セット
              </h2>
              <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7;">
                川越・鶴ヶ島等の自社預かり土地5区画に、幅3.6m〜6mの本格木造ガレージ（スマイチ）を即日シミュレーション配置。
              </p>
            </section>
          </main>

          {/* 補助金・助成金ナビ（静的SEOブロック） */}
          <section id="subsidies" style="background: #022c22; border: 1px solid #059669; border-radius: 16px; padding: 24px; margin-bottom: 32px; color: #ecfdf5;">
            <div style="font-size: 13px; font-weight: bold; color: #34d399; margin-bottom: 6px;">
              【国・都・県・市町村】最新補助金・助成金制度まとめ
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 12px;">
              中古住宅の購入＋リノベで最大200万〜300万円受給！
            </h2>
            <p style="font-size: 13px; color: #a7f3d0; line-height: 1.7; margin: 0 0 16px;">
              国の「長期優良住宅化リフォーム推進事業（最大210万円）」「先進的窓リノベ2026事業（最大100万円）」「給湯省エネ2026事業（最大46万円）」に加え、東京都の省エネ改修促進事業（最大300万円）や埼玉県の窓断熱支援金（国交付額の1/2上乗せ）など、自治体との併用で自己負担を大幅に圧縮できます。
            </p>
            <div style="font-size: 12px; background: #064e3b; padding: 12px; border-radius: 8px; border: 1px solid #047857;">
              <strong>⚠️ 実務上の最重要ルール:</strong><br>
              多くの補助金・助成金は「工事請負契約の前、着工前の申請」が受給の絶対条件です。契約後の申請はできません。株式会社 住ま居るは国の登録事業者のため、物件調査から申請代行までワンストップで承ります。
            </div>
          </section>

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
    title: 'スマイチリフォーム RE｜戸建て断熱・耐震・水回りフルリノベ【埼玉県西部エリア限定】',
    description: '冬寒く夏暑い家を、エアコン1台で快適な省エネ住宅へ。自宅の図面をスマホ撮影してAI 3D化＆Stable Diffusionによるリフォーム後3Dパース即時生成。基礎外断熱＋床暖房、内窓インプラス、タカラ最高峰ホーロー設備、屋根遮熱銀次郎。二級建築士が耐震と温熱を計算する地域密着フルリノベーション工務店。鶴ヶ島・坂戸・川越・鳩山・越生・毛呂山・東松山・日高・飯能・所沢・狭山。',
    keywords: 'スマイチリフォーム,図面 3Dパース AI,リフォーム 3Dパース,戸建て 断熱リフォーム 埼玉,埼玉県西部 リフォーム,基礎外断熱 床暖房,耐震補強 リノベーション,タカラスタンダード ホーローリフォーム',
    canonical: 'https://re.smile049.jp/',
    ogpTitle: 'スマイチリフォーム RE｜戸建て断熱・耐震・水回りフルリノベ【図面3DパースAI対応】',
    ogpDesc: '埼玉県西部エリア限定。自宅図面スマホ撮影でリフォーム後の3DパースをAI即時生成。二級建築士・工務店直営の本物リノベーション。',
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
          "description": "埼玉県西部エリア限定（鶴ヶ島・坂戸・川越・鳩山・越生・毛呂山・東松山・日高・飯能・所沢・狭山）。木造戸建ての断熱・耐震・水回りフルリノベーション専門ブランド。自宅図面のAI 3D化およびControlNetフォトリアルパース作成サービス提供。",
          "url": "https://re.smile049.jp/",
          "telephone": "+81-49-271-2350"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "図面を撮影するだけでリフォーム後の3D完成イメージが分かりますか？",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "はい。ご自宅の平面図や間取り図をスマホで撮影してアップロードいただくだけで、AIが間取りを認識し3D化。さらにStable DiffusionのControlNetと深度マップを駆使して、大空間LDKや対面キッチンなどリフォーム後のフォトリアルな3D完成予想パースを即時プレビューいただけます。"
              }
            },
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
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
              <span style="display: inline-block; padding: 4px 12px; background: #059669; color: #fff; border-radius: 9999px; font-size: 13px; font-weight: bold;">
                戸建て断熱・耐震・水回りフルリノベーション
              </span>
              <span style="display: inline-block; padding: 4px 12px; background: #2563eb; color: #fff; border-radius: 9999px; font-size: 13px; font-weight: bold;">
                埼玉県西部エリア限定（鶴ヶ島・坂戸・川越・鳩山・越生・毛呂山・東松山・日高・飯能・所沢・狭山）
              </span>
            </div>
            <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.4; margin: 0 0 16px;">
              真冬の朝も、スリッパなしでキッチンへ【スマイチリフォーム RE】
            </h1>
            <p style="font-size: 16px; color: #a1a1aa; line-height: 1.8; margin: 0;">
              基礎外断熱＋床暖房 ｜ 内窓インプラス ｜ タカラスタンダード高品位ホーロー ｜ 屋根遮熱銀次郎 ｜ 自宅図面スマホ撮影 ➔ AI 3Dリノベパース即時プレビュー
            </p>
          </header>

          {/* 3DパースAI 特集ブロック */}
          <section style="background: linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%); border: 1px solid #8b5cf6; border-radius: 16px; padding: 24px; margin-bottom: 28px; color: #f3e8ff;">
            <div style="font-size: 12px; font-weight: bold; color: #c084fc; margin-bottom: 6px;">
              📸 【無料AIシミュレーター】自宅の図面をスマホで撮るだけ！
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 10px;">
              AIが間取りを3D化 ➔ Stable Diffusionでリフォーム後フォトリアルパースを即時生成
            </h2>
            <p style="font-size: 13px; color: #e9d5ff; line-height: 1.7; margin: 0;">
              「この壁を抜いて大空間LDKにできる？」「アイランドキッチンにしたらどう見える？」をお手元の図面写真から3D化。工務店直営ならではの構造判定と、実寸スケールに基づくフォトリアルなリノベ後パースで、失敗しないリフォーム計画をサポートします。
            </p>
          </section>

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

          {/* 補助金・助成金ナビ（静的SEOブロック） */}
          <section id="subsidies" style="background: #064e3b; border: 1px solid #10b981; border-radius: 16px; padding: 24px; margin-bottom: 32px; color: #ecfdf5;">
            <div style="font-size: 13px; font-weight: bold; color: #6ee7b7; margin-bottom: 6px;">
              【国・都・県・市町村】戸建てリノベーション補助金情報
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 12px;">
              性能向上リノベ・断熱改修・耐震補強で補助金を最大活用
            </h2>
            <p style="font-size: 13px; color: #a7f3d0; line-height: 1.7; margin: 0 0 16px;">
              既存住宅の性能向上リノベーションには、国の「長期優良住宅化リフォーム推進事業（最大210万円）」「先進的窓リノベ2026事業（最大100万円）」、東京都・埼玉県の単独上乗せ補助金、さいたま市・川越市・鶴ヶ島市・坂戸市・鳩山町・越生町等の独自支援が利用可能です。
            </p>
            <div style="font-size: 12px; background: #022c22; padding: 12px; border-radius: 8px; border: 1px solid #059669;">
              <strong>⚠️ 工事請負契約前の事前申請が必須です:</strong><br>
              株式会社 住ま居るは国交省・環境省・経産省の登録事業者です。二級建築士による耐震診断・インスペクションから補助金の事前交付申請までワンストップで代行します。
            </div>
          </section>

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

  // ファビコン・アセットのコピー（不動産・リフォーム・LP全サブドメインで統一）
  const faviconFiles = ['favicon.svg', 'favicon.ico', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'favicon.png'];
  faviconFiles.forEach(file => {
    const srcPath = path.join(__dirname, '../public', file);
    const destPath = path.join(targetSubDir, file);
    if (fs.existsSync(srcPath)) {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        // Dropboxなどのファイルロック時にもビルドを停止させない安全対策
        if (!fs.existsSync(destPath)) {
          console.warn(`[Warning] Could not copy ${file}:`, err.message);
        }
      }
    }
  });

  console.log(`[Success] Generated static HTML, .htaccess, sitemap.xml, robots.txt & Unified Favicons for ${item.subdomain}`);
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
      "@id": `https://smile049.jp/column/${col.slug}/#article`,
      "headline": col.title,
      "description": col.description,
      "datePublished": col.publishedDate || "2026-10-09",
      "dateModified": "2026-10-14",
      "mainEntityOfPage": `https://smile049.jp/column/${col.slug}/`,
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
          "item": `https://smile049.jp/column/${col.slug}/`
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
    <link rel="canonical" href="https://smile049.jp/column/${col.slug}/" />

    <!-- OGP (Open Graph Protocol) -->
    <meta property="og:title" content="${col.title}｜木造ガレージ・倉庫 スマイチ" />
    <meta property="og:description" content="${col.description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://smile049.jp/column/${col.slug}/" />
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
        <div style="font-size: 16px; line-height: 1.85; color: #475569; background: #f8fafc; border-left: 4px solid #b45309; padding: 18px 20px; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
          ${col.description}
        </div>

        <!-- メインアイキャッチ画像（SEO / AIO 最適化） -->
        ${col.heroImage ? `
        <figure style="margin: 0 0 32px 0;">
          <img 
            src="${col.heroImage}" 
            alt="${col.title} - 木造ガレージ・大型倉庫 施工実例・3D完成パース（埼玉県 鶴ヶ島市・川越市・鳩山町・狭山市 株式会社 住ま居る）" 
            loading="lazy" 
            decoding="async"
            style="width: 100%; height: auto; max-height: 460px; object-fit: cover; border-radius: 12px; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" 
          />
          <figcaption style="font-size: 12px; color: #64748b; margin-top: 6px; text-align: center;">
            ▲ ${col.title} 施工イメージ・完成パース（株式会社 住ま居る）
          </figcaption>
        </figure>
        ` : ''}

        <!-- 本文セクション -->
        ${sectionsHtml}

        <!-- 関連現場施工写真・工程ギャラリー（地域名・工法明記） -->
        ${(col.photos && col.photos.length > 0) ? `
        <section style="margin: 36px 0; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px; display: flex; align-items: center; gap: 8px;">
            <span>📷</span> 関連現場施工写真・施工プロセス（株式会社 住ま居る 実例）
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            ${col.photos.map((p, pIdx) => `
              <figure style="margin: 0; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;">
                <img 
                  src="${p}" 
                  alt="${col.title} 現場施工写真 ${pIdx + 1}（埼玉県比企郡・川越市・鶴ヶ島市 木造自由設計ガレージ・基礎配筋・建て方金物）" 
                  loading="lazy" 
                  decoding="async"
                  style="width: 100%; height: 180px; object-fit: cover; display: block;" 
                />
                <figcaption style="padding: 8px 10px; font-size: 11.5px; color: #64748b; text-align: center; background: #f8fafc;">
                  施工工程記録写真 0${pIdx + 1}
                </figcaption>
              </figure>
            `).join('')}
          </div>
        </section>
        ` : ''}

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

// =========================================================================
// 6. 親ドメイン主要固定ページの完全静的HTML (SSG/プリレンダリング) 生成
//    （「SPAの殻」打破：クローラー・AI向け固有title/meta/canonical/長文本文化）
// =========================================================================
console.log('[Building] Pre-rendering primary fixed pages (simulator, cases, stories, company, contact, plans)...');

const fixedPages = [
  {
    path: 'simulator',
    title: '3Dガレージシミュレーター＆即時自動見積もり｜木造自由設計ガレージ・倉庫 スマイチ',
    description: '会員登録不要・完全無料の木造ガレージ3Dシミュレーター。敷地寸法・変形地に合わせてミリ単位で間口・奥行き・高さを自由に変更可能。シャッターや窓、ドアの配置とリアルタイム積算見積もりが即座に出力できます。',
    keywords: '3Dガレージシミュレーター,木造ガレージ 見積もり,ガレージ 自動積算,ガレージ 自由設計,ガレージ 3D設計',
    canonical: 'https://smile049.jp/simulator/',
    h1: '登録不要・ミリ単位で描く 3Dガレージシミュレーター＆リアルタイム積算見積もり',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          自由設計木造ガレージの寸法・開口部・概算費用を3Dで可視化
        </h2>
        <p style="font-size: 15px; line-height: 1.85; color: #334155; margin-bottom: 16px;">
          スマイチの「3Dガレージシミュレーター」は、アプリのインストールや会員登録をすることなく、Webブラウザ（PC・スマートフォン・タブレット）上で直接操作できる対話型3D建築設計ツールです。
          一般的な既製品スチールガレージでは「間口3.0m・奥行き5.5m」など固定規格しか選べませんが、スマイチならミリ単位で間口・奥行き・柱高さを自由にアジャスト可能。敷地境界15cmの狭小地や、台形地・三角地などの変形地にもジャストフィットする形状を即座にシミュレーションできます。
        </p>
      </section>

      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          3Dシミュレーターの主な機能
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">📐 ミリ単位の寸法・屋根勾配調整</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0;">間口・奥行き・軒高をミリ単位で変更可能。屋根勾配（寸勾配）も調整でき、母屋の屋根と調和させたり斜線制限をクリアする勾配を検証できます。</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">🚪 シャッター・ドア・サッシの自由配置</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0;">三和シャッター製の手動・電動軽量シャッター、LIXIL製のアルミ框ドアや引違い窓、高所採光窓を4面の壁に自由に配置・サイズ変更できます。</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">💰 リアルタイム7項目積算エンジン</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0;">木工事（材料＋大工手間）、サッシ、屋根、外壁、基礎、建材（天井有無）、確認申請の7大項目をリアルタイムに自動積算。A4印刷・PDF出力に対応。</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">🤝 無料の代理作図サポート</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0;">「操作が難しい」「図面から作ってほしい」というお客様向けに、専任建築士が3Dモデルを代理作成。完成データをワンクリックで読み込めます。</p>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 32px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px;">
        <h3 style="font-size: 17px; font-weight: 700; color: #166534; margin: 0 0 10px;">
          🛠️ 3Dシミュレーターのご利用案内
        </h3>
        <p style="font-size: 14px; color: #15803d; line-height: 1.7; margin: 0 0 16px;">
          画面内の3Dビューアはマウスドラッグや指のタッチで360度回転・拡大縮小・ウォークスルーが可能です。作成したプランはブラウザに自動保存されるほか、プロジェクトファイル（JSON）として書き出し・読み込みが可能です。
        </p>
        <a href="/simulator/" style="display: inline-block; background: #16a34a; color: #ffffff; font-weight: 700; font-size: 14px; padding: 10px 24px; border-radius: 8px; text-decoration: none;">
          ▶ 3Dシミュレーターを開く
        </a>
      </section>
    `
  },
  {
    path: 'cases',
    title: '施工事例集・建築実績｜木造自由設計ガレージ・大型倉庫 スマイチ',
    description: '木造自由設計ガレージ・倉庫スマイチの施工実績一覧。狭小変形地ストッカー、農機具アグリシェッド、ホビーバイクガレージ、15mトラス無柱ワークショップの写真、工法スペック、価格内訳を公開中。',
    keywords: '木造ガレージ 施工事例,木造倉庫 実績,ガレージ 建築実例,ガレージ 価格 実績,変形地 ガレージ 実例',
    canonical: 'https://smile049.jp/cases/',
    h1: '木造自由設計ガレージ・倉庫 施工事例・建築実績アーカイブ',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          敷地と目的にジャストフィットした木造ガレージ・倉庫の実例
        </h2>
        <p style="font-size: 15px; line-height: 1.85; color: #334155; margin-bottom: 24px;">
          スマイチが手がけた木造自由設計ガレージ・倉庫の施工実績をご紹介します。既製品では収まらなかった狭小地・変形地、市街化調整区域での農機具倉庫、大空間ワークショップなど、多彩な建築実例をご覧いただけます。
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <article style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
            <div style="display: inline-block; padding: 3px 8px; background: #e0f2fe; color: #0369a1; border-radius: 4px; font-size: 12px; font-weight: 700; margin-bottom: 8px;">Plan 01</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 10px;">大人の秘密基地【愛車・ホビーガレージ】</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0 0 12px;">埼玉県鶴ヶ島市。車1台＋大型バイク＋工具棚＋中二階ロフトスペース。木造ならではの温もりのある内装と、結露知らずの快適な室内空間を実現。</p>
            <div style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px;">構造: 在来木造軸組工法 ｜ 床面積: 約22㎡ ｜ 外壁: ガルバリウム鋼板角波</div>
          </article>

          <article style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
            <div style="display: inline-block; padding: 3px 8px; background: #fef3c7; color: #92400e; border-radius: 4px; font-size: 12px; font-weight: 700; margin-bottom: 8px;">Plan 02</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 10px;">隙間・変形地活用【特注ストッカー倉庫】</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0 0 12px;">埼玉県川越市。敷地境界15cmまで攻めた軒ゼロ特注設計。道路が斜めの台形敷地に合わせて外壁を斜めに配置し、デッドスペースをゼロに。</p>
            <div style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px;">構造: 軒ゼロ耐火木造 ｜ 床面積: 約17㎡ ｜ 外壁: 高耐候サイディング</div>
          </article>

          <article style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
            <div style="display: inline-block; padding: 3px 8px; background: #dcfce7; color: #166534; border-radius: 4px; font-size: 12px; font-weight: 700; margin-bottom: 8px;">Plan 03</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 10px;">農機具大型格納庫【アグリシェッド】</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0 0 12px;">埼玉県坂戸市。市街化調整区域・農地転用（農地法4条・5条）許可取得。大型トラクター・コンバインの動線に合わせたW5.0m特注ワイドシャッター仕様。</p>
            <div style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px;">構造: 高耐力木造軸組 ｜ 床面積: 約60㎡ ｜ 許認可: 農業用倉庫建築許可</div>
          </article>

          <article style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
            <div style="display: inline-block; padding: 3px 8px; background: #fae8ff; color: #86198f; border-radius: 4px; font-size: 12px; font-weight: 700; margin-bottom: 8px;">Plan 04</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 10px;">BtoB無柱大空間【スマイチワークショップ】</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0 0 12px;">埼玉県東松山市。15m無柱木造トラス工法による配送デポ兼作業場。鉄骨造と比べて基礎工事費と固定資産税を大幅に圧縮し、事業融資を活用して建設。</p>
            <div style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 8px;">構造: 15m無柱木造トラス ｜ 床面積: 約120㎡ ｜ 用途: 事業用大型倉庫</div>
          </article>
        </div>
      </section>
    `
  },
  {
    path: 'stories',
    title: 'お客様の声・建築コラム一覧｜木造自由設計ガレージ スマイチ',
    description: 'スマイチで木造ガレージ・倉庫を建てられた施主様のインタビューと、一級・二級建築士が執筆する専門ノウハウコラム一覧。確認申請、市街化調整区域、固定資産税、鉄骨比較など役立つ情報満載。',
    keywords: '木造ガレージ 評判,ガレージ 口コミ,ガレージ コラム,木造ガレージ ブログ,ガレージ 建築士 ノウハウ',
    canonical: 'https://smile049.jp/stories/',
    h1: 'お客様の声（施主様インタビュー）＆ 建築士コラム一覧',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          施主様インタビュー・お客様の声
        </h2>
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
            <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">埼玉県鶴ヶ島市 ｜ K様邸（ホビーガレージ 15坪）</div>
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">「既製品では諦めていた斜めの境界線に、ぴったり合わせて建てられました」</h3>
            <p style="font-size: 14px; color: #334155; line-height: 1.8; margin: 0;">大手メーカーの物置カタログを見ていましたが、境界線が斜めになっており30cm以上の無駄な隙間ができてしまうのが悩みでした。スマイチさんに相談したところ、敷地ピッタリに斜め壁で設計していただき、さらに冬場でも車に結露がつかないのが最高です。</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
            <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">埼玉県坂戸市 ｜ S様（農機具アグリシェッド 20坪）</div>
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">「市街化調整区域の許可と農地転用まで全部代行してくれたので安心でした」</h3>
            <p style="font-size: 14px; color: #334155; line-height: 1.8; margin: 0;">トラクターの買い替えに伴い倉庫の新設を検討していましたが、土地が市街化調整区域で他社には断られていました。スマイチさんは建築士事務所でもあるため、農業用倉庫としての適法手続きや構造計算を一括で進めてくださり、無事に完了検査まで取得できました。</p>
          </div>
        </div>

        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          建築士が解説する 専門ノウハウコラム（全16記事）
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          ${DEFAULT_COLUMNS.map(col => `
            <a href="/column/${col.slug}/" style="display: block; padding: 14px 16px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; text-decoration: none; transition: border-color 0.2s;">
              <div style="font-size: 11px; color: #b45309; font-weight: 700; margin-bottom: 4px;">${col.category || 'コラム'}</div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.5; margin-bottom: 6px;">${col.title}</div>
              <div style="font-size: 12px; color: #64748b; line-height: 1.6;">${(col.description || '').slice(0, 75)}...</div>
            </a>
          `).join('')}
        </div>
      </section>
    `
  },
  {
    path: 'company',
    title: '会社概要・店舗アクセス・許認可情報｜株式会社 住ま居る スマイチ',
    description: '木造自由設計ガレージ・倉庫スマイチを運営する株式会社 住ま居るの会社概要。埼玉県鶴ヶ島市。代表挨拶、一級・二級建築士事務所登録、建設業許可（埼玉県知事 許可（般-8）第60650号）、宅建業免許、営業時間、アクセス地図。',
    keywords: '株式会社 住ま居る,住ま居る 鶴ヶ島,住ま居る 会社概要,住ま居る 建設業許可,スマイチ 運営会社',
    canonical: 'https://smile049.jp/company/',
    h1: '運営会社情報・許認可・店舗アクセス案内',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          会社概要 (Company Profile)
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155; margin-bottom: 24px; border: 1px solid #cbd5e1;">
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;"><th style="padding: 12px 16px; text-align: left; width: 25%; font-weight: 700; color: #0f172a;">会社名</th><td style="padding: 12px 16px;">株式会社 住ま居る（すまいる）</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a;">プロジェクト名</th><td style="padding: 12px 16px;">木造自由設計ガレージ・倉庫 スマイチ (smile049.jp)</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;"><th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a;">代表者</th><td style="padding: 12px 16px;">代表取締役 石井 孝</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a;">所在地</th><td style="padding: 12px 16px;">〒350-2224 埼玉県鶴ヶ島市町屋176番地5</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;"><th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a;">電話番号 / FAX</th><td style="padding: 12px 16px;">TEL: 049-271-2350 ｜ FAX: 049-271-2351</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a;">営業時間 / 定休日</th><td style="padding: 12px 16px;">9:00 〜 18:00（定休日：水曜日・日曜日・祝日）</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;"><th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a;">許認可・免許番号</th><td style="padding: 12px 16px; line-height: 1.8;">
              ・建設業許可：埼玉県知事 許可（般-8）第60650号<br>
              ・建築士事務所登録：埼玉県知事 第(5)10278号<br>
              ・宅地建物取引業者免許：埼玉県知事 (3)第23725号
            </td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a;">保有資格</th><td style="padding: 12px 16px; line-height: 1.8;">一級建築士、二級建築士、宅地建物取引士、1級建築施工管理技士、2級建築施工管理技士、既存住宅状況調査技術者</td></tr>
            <tr style="background: #f8fafc;"><th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a;">対応エリア</th><td style="padding: 12px 16px;">埼玉県全域（鶴ヶ島・川越・坂戸・東松山・さいたま・所沢・熊谷等）、東京都、群馬県、栃木県、茨城県、千葉県</td></tr>
          </tbody>
        </table>

        <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          アクセスマップ
        </h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #334155; margin: 0 0 10px;">
            関越自動車道「鶴ヶ島IC」より車で約8分。東武東上線「若葉駅」「一本松駅」よりアクセス可能です。
          </p>
          <a href="https://maps.google.com/?q=埼玉県鶴ヶ島市町屋176番地5" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none;">
            📍 Google Mapsでルートを確認する
          </a>
        </div>
      </section>
    `
  },
  {
    path: 'contact',
    title: '無料ご相談・無料代理作図依頼｜木造自由設計ガレージ スマイチ',
    description: '木造ガレージ・倉庫スマイチのお問い合わせ窓口。敷地図面や写真をお送りいただくだけで、専任建築士が3Dモデルと詳細見積書を無料で作成・お渡しいたします。Webチャット・公式LINE・お電話対応。',
    keywords: '木造ガレージ 問い合わせ,ガレージ 相談,ガレージ 代理作図,ガレージ 見積もり 依頼,スマイチ 問い合わせ',
    canonical: 'https://smile049.jp/contact/',
    h1: '無料ご相談・お見積り・無料3D代理作図窓口',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          選べる3つのご相談方法
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 28px;">
          <div style="background: #ffffff; border: 1.5px solid #2d6a4f; border-radius: 12px; padding: 20px;">
            <div style="font-size: 12px; color: #166534; font-weight: 700; margin-bottom: 6px;">方法 01【おすすめ】</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 10px;">公式Webチャット相談</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0 0 14px;">トップページ右下のチャットボタンより、ログイン不要ですぐにご相談いただけます。敷地図面や現場写真の添付、代理作図依頼もチャット内で完結します。</p>
            <a href="/" style="display: inline-block; background: #2d6a4f; color: #fff; font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 6px; text-decoration: none;">チャットを開く</a>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #06c755; border-radius: 12px; padding: 20px;">
            <div style="font-size: 12px; color: #15803d; font-weight: 700; margin-bottom: 6px;">方法 02</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 10px;">公式LINEで相談</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0 0 14px;">スマイチ公式LINEをお友だち追加いただき、トーク画面から写真やご要望をお送りください。返信通知をLINEでスムーズに受け取れます。</p>
            <a href="https://line.me/R/ti/p/@smile049" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #06c755; color: #fff; font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 6px; text-decoration: none;">LINE友だち追加</a>
          </div>

          <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 20px;">
            <div style="font-size: 12px; color: #64748b; font-weight: 700; margin-bottom: 6px;">方法 03</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 10px;">お電話でのお問い合わせ</h3>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.7; margin: 0 0 14px;">お急ぎのご相談や現地調査のご依頼は、お電話にて専任スタッフが承ります。<br>受付時間: 9:00〜18:00 (水・日・祝定休)</p>
            <a href="tel:049-271-2350" style="display: inline-block; background: #0f172a; color: #fff; font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 6px; text-decoration: none;">📞 049-271-2350</a>
          </div>
        </div>

        <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          建築士による「無料代理作図サービス」の流れ
        </h2>
        <ol style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 24px 18px 40px; font-size: 14px; color: #334155; line-height: 1.9; margin: 0;">
          <li><strong>図面・写真の送信:</strong> 敷地の測量図、配置図、または手描きの寸法メモや現地の写真をチャットまたはLINEでお送りください。</li>
          <li><strong>専任建築士による3D作図:</strong> 敷地境界、斜線制限、建ぺい率を考慮し、プロの建築士が3Dモデルと7項目積算見積もりを作成します。</li>
          <li><strong>完成データの送付・ブラウザ閲覧:</strong> 完成した3Dプロジェクトデータをチャットでお送りします。ワンクリックでご自身のスマホ・PCで立体モデルを自由に動かして確認できます。</li>
        </ol>
      </section>
    `
  },
  {
    path: 'plan-hobby',
    title: 'Plan 01 愛車・ホビーガレージ｜木造自由設計ガレージ スマイチ',
    description: '車＋大型バイク＋工具棚＋ロフトをミリ単位で自由設計。冬場の結露を防ぎ愛車を守る木造ホビーガレージの仕様・価格・施工例。3Dシミュレーターで即時自動見積もり対応。',
    keywords: 'ホビーガレージ,バイクガレージ,木造ガレージ 愛車,ガレージ ロフト,大人の秘密基地 ガレージ',
    canonical: 'https://smile049.jp/plan-hobby/',
    h1: 'Plan 01 大人の秘密基地【愛車・ホビーガレージ】',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          愛車と工具、ロフト空間をひとつの木造ガレージに凝縮
        </h2>
        <p style="font-size: 15px; line-height: 1.85; color: #334155; margin-bottom: 20px;">
          規格品の鉄骨ガレージでは味わえない、木造軸組構法ならではの温もりと調湿性。冬場の冷え込みによる愛車の結露やサビを防ぎ、大切な車やバイク、アウトドアギアを最高の環境で保管できます。
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; line-height: 1.8; font-size: 14px; color: #334155;">
          <strong>主な特徴:</strong><br>
          ・車1台＋大型バイク＋整備スペース＋壁面工具収納<br>
          ・中二階ロフトによる大容量タイヤ・パーツ保管<br>
          ・高耐力木造金物工法による耐震等級3相当設計<br>
          ・外壁ガルバリウム鋼板×内装OSB合板または現し梁仕上げ
        </div>
      </section>
    `
  },
  {
    path: 'plan-storage',
    title: 'Plan 02 隙間・変形地特注ストッカー倉庫｜木造自由設計 スマイチ',
    description: '敷地境界15cm、台形地・三角地にジャストフィット。既製品物置では収まらない敷地を100%有効活用する特注木造倉庫。軒ゼロ設計と確認申請対応。',
    keywords: '変形地 倉庫,狭小地 ガレージ,軒ゼロ ガレージ,境界15cm 物置,台形地 倉庫',
    canonical: 'https://smile049.jp/plan-storage/',
    h1: 'Plan 02 隙間・変形地活用【特注ストッカー倉庫】',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          敷地境界15cm・斜め境界線にミリ単位でジャストフィット
        </h2>
        <p style="font-size: 15px; line-height: 1.85; color: #334155; margin-bottom: 20px;">
          大手物置メーカーのカタログを見て「あと30cm広げたい」「境界が斜めで三角形のデッドスペースができる」とお困りの方に最適。ミリ単位の自由設計と特注軒ゼロディテールにより、敷地を無駄なく100%使い切るストッカー倉庫を実現します。
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; line-height: 1.8; font-size: 14px; color: #334155;">
          <strong>主な特徴:</strong><br>
          ・敷地境界15cmまで攻める「軒ゼロ・雨樋内蔵」設計<br>
          ・台形敷地や斜め道路に沿った偏芯・変形外壁施工<br>
          ・防火地域・準防火地域に準拠した耐火・延焼遮断仕様<br>
          ・10㎡超の確認申請および完了検査の自社一貫代行
        </div>
      </section>
    `
  },
  {
    path: 'plan-agri',
    title: 'Plan 03 農機具大型格納庫・アグリシェッド｜木造倉庫 スマイチ',
    description: 'トラクター・コンバインの動線から設計する大型農機具格納庫。市街化調整区域での建築許可・農地転用（農地法4条5条）も自社一括代行。',
    keywords: '農機具倉庫,トラクター 格納庫,市街化調整区域 倉庫,農地転用 ガレージ,アグリシェッド',
    canonical: 'https://smile049.jp/plan-agri/',
    h1: 'Plan 03 農機具・大型格納庫【アグリシェッド】',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          大型トラクターの旋回動線と農地法・調整区域申請を完全攻略
        </h2>
        <p style="font-size: 15px; line-height: 1.85; color: #334155; margin-bottom: 20px;">
          大型トラクターやコンバイン、乾燥機、肥料・収穫資材を雨風や湿気から守る専用木造シェッド。他社では断られがちな青地・白地の農地転用手続きや、市街化調整区域での農業用施設建築許可を専任建築士がワンストップで代行します。
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; line-height: 1.8; font-size: 14px; color: #334155;">
          <strong>主な特徴:</strong><br>
          ・大型農機具のスムーズな出入りを実現するW5.0m特注ワイドシャッター<br>
          ・重量車両の乗り入れに耐える補強ベタ基礎工法<br>
          ・農地法第4条・第5条転用申請、都市計画法第34条・43条許可代行<br>
          ・農業近代化資金等の公的融資・補助金申請サポート対応
        </div>
      </section>
    `
  },
  {
    path: 'plan-workshop',
    title: 'Plan 04 BtoB無柱大空間 15mトラスワークショップ｜木造倉庫 スマイチ',
    description: '木造トラス構法による最大15m無柱空間。配送デポ・加工場・スタジオ・事業用大型倉庫を鉄骨比低コスト・短工期で実現。事業用ローン対応。',
    keywords: '木造トラス 倉庫,無柱大空間 木造,事業用 木造倉庫,加工場 建築,木造デポ 埼玉',
    canonical: 'https://smile049.jp/plan-workshop/',
    h1: 'Plan 04 BtoB無柱大空間【スマイチワークショップ】',
    bodyContent: `
      <section style="margin-bottom: 32px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; border-left: 4px solid #2d6a4f; padding-left: 12px; margin-bottom: 16px;">
          15m無柱スパンの木造トラス。鉄骨造比で建設費・固定資産税を大幅削減
        </h2>
        <p style="font-size: 15px; line-height: 1.85; color: #334155; margin-bottom: 20px;">
          木造トラス構法（大スパン架構）を採用することで、室内に柱を一切立てずに最大15mの無柱大空間を実現。物流配送デポ、自動車整備ピット、木工・金属加工場、撮影スタジオなど、事業用大型スペースを鉄骨造よりも基礎工事費と工期を大幅に抑えて建設可能です。
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; line-height: 1.8; font-size: 14px; color: #334155;">
          <strong>主な特徴:</strong><br>
          ・最大15mの無柱大空間（フォークリフトや大型車の自由な旋回動線）<br>
          ・鉄骨造に比べて建物の自重が軽く、地盤改良・基礎工事費用を削減<br>
          ・法定耐用年数22年による早期減価償却（法人節税効果）<br>
          ・日本政策金融公庫や民間銀行の事業計画書・融資支援サポート
        </div>
      </section>
    `
  }
];

fixedPages.forEach((page) => {
  const pageDir = path.join(distDir, page.path);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  const pageHtml = `<!DOCTYPE html>
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

    <!-- SEO基本メタタグ（ページ固有完全定義） -->
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="keywords" content="${page.keywords}" />
    <link rel="canonical" href="${page.canonical}" />

    <!-- OGP (Open Graph Protocol) -->
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${page.canonical}" />
    <meta property="og:image" content="https://smile049.jp/assets/ogp.webp" />
    <meta property="og:site_name" content="木造ガレージ・倉庫 スマイチ" />
    <meta property="og:locale" content="ja_JP" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta property="twitter:image" content="https://smile049.jp/assets/ogp.webp" />

    <!-- ファビコン・アイコン -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- 構造化データ (JSON-LD: パンくずリスト & 企業情報) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
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
              "name": "${page.title.split('｜')[0]}",
              "item": "${page.canonical}"
            }
          ]
        },
        {
          "@type": "GeneralContractor",
          "@id": "https://smile049.jp/#contractor",
          "name": "株式会社 住ま居る / スマイチ",
          "url": "https://smile049.jp/",
          "telephone": "+81-49-271-2350",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "町屋176番地5",
            "addressLocality": "鶴ヶ島市",
            "addressRegion": "埼玉県",
            "postalCode": "350-2224",
            "addressCountry": "JP"
          }
        }
      ]
    }
    </script>

    <!-- アセット読み込み（React SPA hydrate） -->
${assetIncludes}
  </head>
  <body style="background: #f8fafc; color: #1e293b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0;">
    <div id="root">
      <noscript>
        <div style="padding: 16px; text-align: center; background: #fff3cd; color: #856404; font-size: 14px;">
          ※シミュレーターや対話機能をご利用の場合は、JavaScriptを有効にしてください。
        </div>
      </noscript>

      <!-- 静的ページコンテンツ (検索エンジン & AIクローラー向け即時レンダリング) -->
      <article style="max-width: 920px; margin: 0 auto; padding: 36px 20px; background: #ffffff; min-height: 100vh; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <!-- パンくずリスト -->
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 20px;">
          <a href="/" style="color: #64748b; text-decoration: none;">ホーム</a>
          <span style="margin: 0 8px;">&gt;</span>
          <span style="color: #0f172a; font-weight: 600;">${page.title.split('｜')[0]}</span>
        </nav>

        <!-- H1タイトル -->
        <h1 style="font-size: 26px; line-height: 1.45; font-weight: 800; color: #0f172a; margin: 0 0 16px;">
          ${page.h1}
        </h1>

        <!-- 導入リード文 -->
        <div style="font-size: 15px; line-height: 1.85; color: #475569; background: #f8fafc; border-left: 4px solid #2d6a4f; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 32px;">
          ${page.description}
        </div>

        <!-- 本文 -->
        ${page.bodyContent}

        <!-- 会社情報＆フッター -->
        <footer style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 12.5px; color: #64748b; text-align: center; line-height: 1.8;">
          <div style="font-weight: 700; color: #1e293b; margin-bottom: 4px;">
            株式会社 住ま居る ｜ 木造自由設計ガレージ・倉庫 スマイチ
          </div>
          <div>〒350-2224 埼玉県鶴ヶ島市町屋176番地5 ｜ TEL: 049-271-2350 ｜ 営業時間: 9:00〜18:00 (水・日・祝定休)</div>
          <div>建築士事務所登録：埼玉県知事 第(5)10278号 ／ 建設業許可：埼玉県知事 許可（般-8）第60650号</div>
          <div style="margin-top: 8px;">© 2026 SMILE Co., Ltd. All Rights Reserved.</div>
        </footer>
      </article>
    </div>
  </body>
</html>`;

  fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf8');
  console.log(`[Success] Generated static HTML for https://smile049.jp/${page.path}/ in dist/${page.path}/index.html`);
});

console.log(`[Success] Successfully pre-rendered all ${fixedPages.length} primary fixed pages to static HTML.`);
console.log('[Complete] All static generation completed successfully.');
