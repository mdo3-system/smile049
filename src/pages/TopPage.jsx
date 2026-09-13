import React, { useState, useEffect } from 'react';
import { 
  Compass, ArrowRight, Check, AlertTriangle, ShieldCheck, 
  Sparkles, Layers, FileText, ChevronRight, Ruler, Wrench, Home, Car, Warehouse, Trees,
  ZoomIn, X, Building2, HelpCircle, Calendar, Landmark, Scale, MessageSquare
} from 'lucide-react';
import InteractiveHeroShowcase from '../components/InteractiveHeroShowcase';

export default function TopPage({ setCurrentRoute }) {
  const [previewStep, setPreviewStep] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewStep(null);
      }
    };
    if (previewStep) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [previewStep]);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="top-page">
      {/* =========================================================
          ファーストビュー (Hero Section)
         ========================================================= */}
      <section style={{
        background: 'linear-gradient(180deg, #f5f1eb 0%, var(--bg-main) 100%)',
        padding: '70px 24px 80px',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 背景の柔らかなアクセント幾何装飾 */}
        <div style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(64, 145, 108, 0.08) 0%, rgba(251, 250, 248, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div className="section-tag" style={{ background: 'var(--color-wood-light)', color: 'var(--color-wood-dark)', margin: 0 }}>
                ★ 登録不要・ブラウザですぐ動く3Dシミュレーター
              </div>
              <div className="section-tag" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', margin: 0, fontWeight: 700 }}>
                関東・埼玉県全域対応
              </div>
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              lineHeight: 1.35,
              color: 'var(--text-main)',
              marginBottom: 20
            }}>
              あと少し大きく。<br />
              あと少し小さく。<br />
              <span style={{ color: 'var(--color-primary)' }}>木造自由設計ガレージ、自分で描いてみませんか？</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
              敷地に合わせて、サイズも形も棚も自由自在。<br />
              画面の中で3D設計すると、リアルタイムに概算建築費用を自動見積もり。<br />
              規格サイズに土地を合わせるのではなく、あなたの土地に、あなたのガレージを合わせる。
            </p>
            <div style={{
              background: '#ffffff',
              borderLeft: '4px solid var(--color-primary)',
              padding: '12px 16px',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              marginBottom: 32,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <p style={{ fontSize: 13.5, color: '#334155', margin: 0, fontWeight: 500 }}>
                変形地・狭小地・市街化調整区域も完全対応。自社専任スタッフによる構造計算・確認申請から施工・融資相談まで、ワンストップでお任せいただけます。
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <button 
                onClick={() => navigateTo('simulator')}
                className="btn-accent"
                style={{ fontSize: 16, padding: '16px 32px' }}
              >
                <Compass size={20} />
                <span>今すぐ触ってみる（無料 3D設計＋自動見積）</span>
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('qa-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-secondary"
                style={{ fontSize: 15 }}
              >
                <span>専任スタッフにプロ相談する（Q&A・個別相談）</span>
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#8c7e72', marginTop: 10 }}>
              ※「ちょっと試してみる」だけでも大歓迎です。登録や個人情報は不要です。
            </div>
          </div>

          {/* ヒーロー動的ショーカー（①〜⑤敷地変形 ＆ 寸法/透過/地面/空 ライブツアー） */}
          <div>
            <InteractiveHeroShowcase onNavigateToSimulator={() => navigateTo('simulator')} />
          </div>
        </div>
      </section>

      {/* =========================================================
          3Dシミュレーター体験エリア
         ========================================================= */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag">体験する</span>
          <h2 className="section-title">
            まずは、触ってみてください。<br />
            「こんなガレージが欲しい」を、画面の中で作れます。
          </h2>
          <p className="section-desc">
            写真を見ているだけではありません。自分で動かして、自分で作る。<br />
            幅を変える。奥行きを変える。高さを変える。棚を置く。作業台を置く。車を入れる。大型バイクを置く。<br />
            そして、サイズや仕様を変更すると――<strong>金額も、その場で変わります。</strong>
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          marginBottom: 40
        }}>
          <div className="nature-card">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              marginBottom: 16
            }}>
              <Compass size={22} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>3Dで自由に設計</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              敷地の幅・奥行き・高さを変更しながら、完成イメージをリアルタイムで確認。変形した敷地にも合わせて、自分だけの空間を組み立てられます。
            </p>
          </div>

          <div className="nature-card">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-wood-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-wood)',
              marginBottom: 16
            }}>
              <Ruler size={22} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>サイズを変えると、見積金額も変わる</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              「このサイズなら予算内」「もう少し大きくしてみよう」「棚を追加したらいくら？」そんな試行錯誤を何度でも。見積もりを待つ必要はありません。
            </p>
          </div>

          <div className="nature-card">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(224, 122, 95, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
              marginBottom: 16
            }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>完成までの流れも見える</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              工事開始から完成までの標準的な工程やおおよそのスケジュールも確認できます。「いつ完成するのか分からない」そんな不安も初期から減らします。
            </p>
          </div>
        </div>

        {/* =========================================================
            3D設計〜AIフォトリアルパース受領までの一連ステップギャラリー
           ========================================================= */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 24px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-card)',
          marginBottom: 44
        }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{
              background: 'linear-gradient(135deg, rgba(45, 106, 79, 0.12), rgba(82, 183, 136, 0.2))',
              color: 'var(--color-primary-dark)',
              padding: '6px 18px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.05em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}>
              <Sparkles size={15} color="var(--color-primary)" />
              <span>実際の操作画面でわかる！体験ストーリー</span>
            </span>
            <h3 style={{
              fontSize: 'clamp(22px, 3.2vw, 30px)',
              color: 'var(--text-main)',
              marginTop: 14,
              marginBottom: 12,
              fontWeight: 800,
              lineHeight: 1.35
            }}>
              自分で思い通りに描いて、プロ＆AIフォトリアルパースを無料ゲット！
            </h3>
            <p style={{ fontSize: 14.5, color: 'var(--text-muted)', maxWidth: 720, margin: '0 auto', lineHeight: 1.75 }}>
              「まずはブラウザで自由に触ってシミュレーション」➡️「気に入ったらワンクリックで無料依頼」➡️「専任スタッフが光や愛車までリアルなAIパースを無料作成してお届け」。
              <br />
              誰でもかんたんに理想のガレージを形にできる一連の流れをご覧ください。（※ 各画像をクリックすると拡大表示できます）
            </p>
          </div>

          {/* 6ステップ グリッド表示 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 24,
            marginBottom: 28
          }}>
            {[
              {
                step: '01',
                title: '【自分で設計】操作パネルで寸法調整！リアルタイム立体化',
                desc: '敷地や用途に合わせて幅・奥行・高さを左パネルのスライダーや数値入力で直感調整。3D寸法線と連動し、敷地ぴったりにミリ単位でガレージが立ち上がります。',
                img: './assets/steps/step1.png',
                tag: '自由設計',
                category: '自分でシミュレーション'
              },
              {
                step: '02',
                title: '【自分で配置】シャッターやサッシを好きな位置へワンタップ',
                desc: 'ガレージ用軽量シャッター（細スリットリブ付）や採光窓、出入口ドアを自在に配置。位置やサイズの変更もリアルタイムに3D空間へ反映されます。',
                img: './assets/steps/step2.png',
                tag: '建具配置',
                category: '自分でシミュレーション'
              },
              {
                step: '03',
                title: '【自分でレイアウト】内部造作棚＆「透視モード」で隅々まで確認',
                desc: 'タイヤや工具をしまう造作棚を自由に設定。「透視モード」をONにすれば、壁を透過して柱梁の骨組みや内部の広がりをチェックできます。',
                img: './assets/steps/step3.png',
                tag: '内部空間',
                category: '自分でシミュレーション'
              },
              {
                step: '04',
                title: '【自分で確認】愛車・SUVを配置して実寸サイズ感を体感',
                desc: '愛車やSUVをガレージ内に格納。車のドア開閉スペースや出入り動線、作業クリアランスを実寸大の立体空間でリアルに確認できます。',
                img: './assets/steps/step4.png',
                tag: '車両格納',
                category: '自分でシミュレーション'
              },
              {
                step: '05',
                title: '【完全無料・登録不要】作ったモデルのままワンタップでパース依頼！',
                desc: '面倒な会員登録やパスワード設定は一切不要！あなたがシミュレーションした3Dモデルがそのまま届き、ワンクリックで専任スタッフへ無料パース作成を依頼できます。',
                img: './assets/steps/step5.png',
                tag: '無料依頼',
                category: 'プロ＆AIが無料作成'
              },
              {
                step: '06',
                title: '【専任スタッフ作成】専用チャットに超美麗AIパースをお届け！',
                desc: '光や影、外壁ガルバリウムの金属感、愛車の映り込みまで忠実に再現された完成予想パース（3D sample）がチャットに届きます。仕様変更や見積相談もそのまま無料で相談OK！',
                img: './assets/steps/step6.jpg',
                tag: '無料パース完成',
                category: 'プロ＆AIが無料作成'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  cursor: 'pointer'
                }}
                className="step-card-hover"
                onClick={() => setPreviewStep(item)}
                title="クリックして拡大表示"
              >
                {/* ステップ画像プレビュー枠 */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '62%',
                  background: '#0f172a',
                  overflow: 'hidden',
                  cursor: 'zoom-in'
                }}>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      // 代替表示
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* ステップバッジ */}
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <span style={{ color: item.step === '05' || item.step === '06' ? '#fbbf24' : '#80ed99' }}>STEP</span>
                    <span>{item.step}</span>
                  </div>

                  {/* カテゴリ/タグバッジ */}
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: item.step === '05' || item.step === '06' ? 'rgba(217, 119, 6, 0.92)' : 'rgba(45, 106, 79, 0.92)',
                    color: '#ffffff',
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 6,
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    {item.tag}
                  </div>

                  {/* 拡大インジケーター（右下） */}
                  <div 
                    className="zoom-badge"
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(15, 23, 42, 0.8)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ZoomIn size={12} color="#93c5fd" />
                    <span>拡大して見る</span>
                  </div>
                </div>

                {/* カードテキスト */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    fontSize: 11, 
                    fontWeight: 700, 
                    color: item.step === '05' || item.step === '06' ? '#d97706' : 'var(--color-primary)', 
                    marginBottom: 4 
                  }}>
                    {item.category}
                  </div>
                  <h4 style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: 8,
                    lineHeight: 1.45
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: 13,
                    color: '#64748b',
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 今すぐ触ってみるCTAボタン */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigateTo('simulator')}
            className="btn-accent"
            style={{ fontSize: 17, padding: '16px 40px', boxShadow: '0 6px 20px rgba(224, 122, 95, 0.4)' }}
          >
            <Compass size={22} />
            <span>今すぐ触ってみる（無料 3D設計＋自動見積）</span>
          </button>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 10 }}>
            ※ 会員登録や個人情報の入力なしで、今すぐブラウザで自由に動かせます。
          </div>
        </div>
      </section>


      {/* =========================================================
          お悩み共感セクション
         ========================================================= */}
      <section style={{ background: '#f4f1ea', padding: '80px 24px', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-header">
            <span className="section-tag" style={{ background: '#fee2e2', color: '#b91c1c' }}>お悩み解決</span>
            <h2 className="section-title">
              こんな「あと一歩」で、<br />
              規格ガレージを諦めていませんか？
            </h2>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 32px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            {[
              '「あと20cm広ければ、車が入るのに。」',
              '「次のサイズにすると、敷地からはみ出してしまう。」',
              '「この変形した土地に、既製品は置けない。」',
              '「確認申請まで自分で手配するのは面倒。」',
              '「本体・基礎・申請……業者がバラバラで誰に頼めばいいのか分からない。」',
              '「せっかくのガレージなのに、棚や作業台を自由に付けられない。」',
              '「鉄板のガレージは、結露やサビが心配。」'
            ].map((text, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 15,
                color: '#334155',
                padding: '8px 0',
                borderBottom: idx === 6 ? 'none' : '1px dashed #e2e8f0'
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#fef2f2',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  ✕
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 30,
            textAlign: 'center',
            padding: '20px',
            background: 'var(--color-primary-soft)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #b7e4c7'
          }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>
              その「あと一歩」を、木造自由設計ならすべて解決できます。
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          選ばれる理由 (4つの特徴)
         ========================================================= */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag">選ばれる理由</span>
          <h2 className="section-title">木造自由設計ガレージが支持される4つの理由</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 24
        }}>
          <div className="nature-card">
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-wood)', opacity: 0.6, marginBottom: 8 }}>01</div>
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>敷地に合わせて、ミリ単位で設計</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              規格サイズに土地を合わせる必要はありません。正方形・長方形だけでなく、台形地、三角形、狭小地、旗竿地などにも対応。敷地の形状を最大限に活かし、使える空間を無駄にしません。
            </p>
          </div>

          <div className="nature-card">
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-wood)', opacity: 0.6, marginBottom: 8 }}>02</div>
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>建築士が、申請から施工までワンストップ</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              本体はメーカー、基礎は別業者、確認申請は自分で建築士を探す……そんな面倒を解消。法令チェック、図面作成、構造計算、確認申請、基礎工事、建て方まで建築士が一括管理します。
            </p>
          </div>

          <div className="nature-card">
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-wood)', opacity: 0.6, marginBottom: 8 }}>03</div>
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>木造だからこそ、自由に作れる</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              木造の構造を活かして、棚、壁面収納、作業台などを自由に計画。木造ならではの断熱・調湿を考えた仕様で、結露や湿気にも配慮します。
            </p>
          </div>

          <div className="nature-card">
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-wood)', opacity: 0.6, marginBottom: 8 }}>04</div>
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>構造計算で、強さまで考える</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              建築士が構造安全性を確認し、必要に応じて構造計算を実施。接合部には高精度な金物工法を採用し、「自由に作れる」と「しっかり造る」を両立します。
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          規格ガレージとの比較表
         ========================================================= */}
      <section style={{ background: '#ffffff', padding: '80px 24px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header">
            <span className="section-tag">比較する</span>
            <h2 className="section-title">一般的な規格ガレージとの違い</h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 14, color: '#475569', borderBottom: '2px solid #e2e8f0', width: '25%' }}>比較項目</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 14, color: '#64748b', borderBottom: '2px solid #e2e8f0', width: '35%' }}>一般的な規格ガレージ</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 15, color: 'var(--color-primary-dark)', background: 'var(--color-primary-soft)', borderBottom: '2px solid var(--color-primary)', width: '40%', fontWeight: 700 }}>当社の木造自由設計ガレージ</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 14 }}>
                {[
                  { item: 'サイズ調整', standard: '決まった規格モジュールのみ', ours: '敷地寸法に合わせて自由設計' },
                  { item: '形状', standard: '基本的に四角形', ours: '変形地（台形・三角地等）にも対応' },
                  { item: '細かな調整', standard: '10cm単位の調整は困難', ours: '敷地条件に合わせて調整可能' },
                  { item: '棚・収納', standard: '後付けやビス止めに制約あり', ours: '設計段階から棚・作業台を自在に計画' },
                  { item: '確認申請', standard: '別途手配が必要な場合あり', ours: '建築士が一括ワンストップ対応' },
                  { item: '構造検討', standard: '商品既定の仕様', ours: '建築士が構造安全性を確認（金物工法）' },
                  { item: '見積もり', standard: '問い合わせ・現地採寸待ち', ours: '3Dシミュレーター上で概算を即時確認' }
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#fbfaf8' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#334155' }}>{row.item}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>{row.standard}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', color: 'var(--color-primary-dark)', background: 'rgba(232, 245, 233, 0.4)', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Check size={16} color="var(--color-primary)" />
                        <span>{row.ours}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================
          目的別 4つの特化プラン紹介
         ========================================================= */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag">プランを探す</span>
          <h2 className="section-title">あなたなら、何を入れますか？</h2>
          <p className="section-desc">目的や敷地条件に特化した4つの代表的なプランをご提案しています。</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24
        }}>
          {/* Plan 1 */}
          <div className="nature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, overflow: 'hidden' }}>
            <div>
              <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
                <img
                  src="/assets/plans/plan01.jpg"
                  alt="Plan 01 愛車・ホビー木造ガレージ"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span>PLAN 01</span>
                  <span style={{ color: '#38bdf8' }}>愛車・ホビー</span>
                </div>
              </div>
              <div style={{ padding: '20px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-primary)' }}>屋根外壁ガルバリウム × 軒ゼロ</span>
                  <Car size={18} color="var(--color-primary)" />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-main)', lineHeight: 1.4 }}>
                  大人の秘密基地<br />
                  【愛車・大型バイク・ホビー】
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
                  「自分が一番長くいたくなる場所」を設計。ガルバリウム鋼板と軒ゼロのシャープな外観、内部は温もりある木造梁現し。
                </p>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <button
                onClick={() => navigateTo('plan-hobby')}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '10px 14px', fontSize: 13.5 }}
              >
                <span>愛車ガレージを見る</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Plan 2 */}
          <div className="nature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, overflow: 'hidden' }}>
            <div>
              <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
                <img
                  src="/assets/plans/plan02.jpg"
                  alt="Plan 02 狭小・変形地向け木造ストッカー"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span>PLAN 02</span>
                  <span style={{ color: '#fbbf24' }}>狭小・変形地</span>
                </div>
              </div>
              <div style={{ padding: '20px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-wood)' }}>ガルバリウム × 台形フィット</span>
                  <Home size={18} color="var(--color-wood)" />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-main)', lineHeight: 1.4 }}>
                  デッドスペースを収納に<br />
                  【狭小地・変形地ストッカー】
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
                  既製品では使えなかったスペースを活かし、軒の出ゼロで敷地境界ギリギリまで活用。耐久ガルバリウム外壁仕様。
                </p>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <button
                onClick={() => navigateTo('plan-storage')}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '10px 14px', fontSize: 13.5 }}
              >
                <span>狭小ストッカーを見る</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Plan 3 */}
          <div className="nature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, overflow: 'hidden' }}>
            <div>
              <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
                <img
                  src="/assets/plans/plan03.jpg"
                  alt="Plan 03 農機具・大型倉庫向けアグリシェッド"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span>PLAN 03</span>
                  <span style={{ color: '#4ade80' }}>農機具・大型倉庫</span>
                </div>
              </div>
              <div style={{ padding: '20px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-accent)' }}>ガルバリウム × 木造トラス構法</span>
                  <Warehouse size={18} color="var(--color-accent)" />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-main)', lineHeight: 1.4 }}>
                  作業動線から逆算する<br />
                  【農機具・大型アグリシェッド】
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
                  トラクターや農機具の出入り、収穫物保管を逆算設計。市街化調整区域や農地の面倒な手続きもワンストップ。
                </p>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <button
                onClick={() => navigateTo('plan-agri')}
                className="btn-accent"
                style={{ width: '100%', justifyContent: 'center', padding: '10px 14px', fontSize: 13.5 }}
              >
                <span>大型倉庫を見る</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Plan 4 */}
          <div className="nature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, overflow: 'hidden' }}>
            <div>
              <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
                <img
                  src="/assets/plans/plan04.jpg"
                  alt="Plan 04 スマイチホール・大空間ワークショップ＆事業用倉庫"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span>PLAN 04</span>
                  <span style={{ color: '#a78bfa' }}>無柱大空間・ホール</span>
                </div>
              </div>
              <div style={{ padding: '20px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#7c3aed' }}>15m×15m・桁下6m ガルバリウム</span>
                  <Building2 size={18} color="#7c3aed" />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-main)', lineHeight: 1.4 }}>
                  中柱のない圧倒的大空間<br />
                  【道場・スタジオ・学習塾・事業倉庫】
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
                  トラス工法で間口15m超の完全無柱大空間を実現。高断熱・調湿性と22年早期償却で、スクールからBtoB事業まで対応。
                </p>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <button
                onClick={() => navigateTo('plan-workshop')}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '10px 14px', fontSize: 13.5, background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}
              >
                <span>大空間ホール・倉庫を見る</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* 掲載モデル画像の注意事項 */}
        <p style={{
          fontSize: 12.5,
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: 24,
          lineHeight: 1.6
        }}>
          ※掲載モデルは、3Dシミュレーション・自動見積もりでは表現しきれない多数のオプション項目が含まれております。あらかじめご承知おきください。
        </p>
      </section>

      {/* =========================================================
          専任スタッフ プロ相談 ＆ よくあるご質問（Q&A ＆ ワンストップ安心ガイド）
         ========================================================= */}
      <section id="qa-section" style={{ background: '#f8fafc', padding: '80px 24px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header">
            <span className="section-tag" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              専任スタッフにプロ相談
            </span>
            <h2 className="section-title">
              スケジュール・法規制・一括依頼・融資相談。<br />
              ガレージ・倉庫建築の「不安」をワンストップで解消します。
            </h2>
            <p className="section-desc">
              「土地の手続きが難しそう」「誰に頼めばいいかわからない」という心配は一切不要です。<br />
              自社専任スタッフが窓口ひとつで、設計・申請・工事・融資まで責任を持って伴走いたします。
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
            {/* Q1: スケジュール・工期 */}
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #e2e8f0',
              padding: '28px 32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 16
                }}>
                  Q1
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  検討開始から完成・引き渡しまで、どのくらいのスケジュールがかかりますか？
                </h3>
              </div>
              <div style={{ paddingLeft: 48 }}>
                <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.8, margin: 0 }}>
                  一般的なオーダー建築と異なり、スマイチでは<strong>ご相談から完成まで最短約2.5〜3.5ヶ月</strong>で実現可能です。<br />
                  3Dシミュレーションで初期プランを即日可視化し、自社専任スタッフが構造計算・確認申請・基礎工事・建て方まで一貫管理するため、<strong>設計事務所と工務店の間の引き継ぎ待ちや連絡ロスが一切ありません</strong>。事業用倉庫やスクール開業など、オープン時期が決まっている場合もお気軽にご相談ください。
                </p>
              </div>
            </div>

            {/* Q2: 法規制・敷地条件 */}
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #e2e8f0',
              padding: '28px 32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 16
                }}>
                  Q2
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  市街化調整区域や農地、狭小地や境界線ギリギリでも建てられますか？
                </h3>
              </div>
              <div style={{ paddingLeft: 48 }}>
                <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.8, margin: '0 0 10px' }}>
                  <strong>はい、すべての手続きを自社専任スタッフが一括代行・対応いたします。</strong><br />
                  既製品ガレージでは断られがちな「市街化調整区域での建築許可」や「農地転用手続き」、防火・準防火地域の仕様、道路斜線・北側斜線の制限調査まで完全対応。
                </p>
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: 13,
                  color: '#92400e',
                  lineHeight: 1.6
                }}>
                  💡 敷地境界ギリギリまで攻める「軒ゼロ（軒の出0mm）設計」や、道路が斜めの土地に合わせた「台形・偏芯設計」も自由設計ならではの強みです。
                </div>
              </div>
            </div>

            {/* Q3: 一括依頼の安心 vs バラバラ発注の心理的ハードル */}
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--color-primary-soft)',
              padding: '28px 32px',
              boxShadow: '0 8px 24px rgba(64, 145, 108, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 16
                }}>
                  Q3
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  なぜ「一括依頼（ワンストップ）」を選ぶと心理的ハードルが圧倒的に下がるのですか？
                </h3>
              </div>
              <div style={{ paddingLeft: 48 }}>
                <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>
                  自分で業者を個別に手配する「バラバラ発注（分離発注）」は、専門知識のないお客様にとって<strong>精神的・時間的に極めて重い心理的ハードル</strong>となります。スマイチに一括依頼することで、その不安はすべて解消されます。
                </p>

                {/* 対比表カード */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 16,
                  marginBottom: 10
                }}>
                  {/* バラバラ発注のハードル */}
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px'
                  }}>
                    <div style={{ fontWeight: 800, color: '#dc2626', fontSize: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>✕ バラバラ発注の過酷なハードル</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>
                      <li>設計士・工務店・基礎屋・確認申請代行・銀行を自分で探し回る</li>
                      <li>業者間の板挟みになり、トラブル時に責任の押し付け合い</li>
                      <li>工期が延び、予期せぬ追加費用が次々に発生する不安</li>
                    </ul>
                  </div>

                  {/* スマイチ一括依頼の安心感 */}
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px'
                  }}>
                    <div style={{ fontWeight: 800, color: '#16a34a', fontSize: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>⭕ スマイチ一括依頼（心理的ハードルゼロ）</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#14532d', lineHeight: 1.7 }}>
                      <li><strong>窓口は専任スタッフひとつだけ</strong>。想いを伝えるだけでOK</li>
                      <li>3D設計・構造計算・申請・基礎・施工・保証まで一貫完結</li>
                      <li>追加費用のない明瞭な積算見積もりと最短スケジュール</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Q4: 融資相談・ローンを含めたワンストップ利便性 */}
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #e2e8f0',
              padding: '28px 32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#f3e8ff',
                  color: '#9333ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 16
                }}>
                  Q4
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  銀行の融資やローンの相談もワンストップで任せられますか？
                </h3>
              </div>
              <div style={{ paddingLeft: 48 }}>
                <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.8, margin: 0 }}>
                  <strong>はい、資金計画・融資申請までトータルで強力にサポートいたします。</strong><br />
                  ・<strong>BtoB・事業者様</strong>：日本政策金融公庫や地方銀行の事業性融資・創業融資への申請資料作成。<br />
                  ・<strong>個人のお客様</strong>：マイカーローン、リフォームローン、住宅ローンへの組み込み支援。<br />
                  スマイチなら<strong>初期段階から「正確な3D完成パース」「詳細な設計図面」「細目別積算見積書」がすべて揃っているため、金融機関への提出書類審査が圧倒的にスムーズで、融資承認率が大幅に向上</strong>します。
                </p>
              </div>
            </div>
          </div>

          {/* Q&Aセクション内 CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 30px',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.2)'
          }}>
            <h3 style={{ fontSize: 21, color: '#ffffff', marginBottom: 10 }}>
              「うちの土地でも建てられる？」「大体いくらになる？」
            </h3>
            <p style={{ fontSize: 14.5, color: '#94a3b8', lineHeight: 1.8, maxWidth: 640, margin: '0 auto 24px' }}>
              疑問や図面の確認は、無料相談チャットから今すぐ専任スタッフへお気軽にどうぞ。<br />
              敷地の写真や手書きの間取り図を添付していただくだけで、プロがその場でご案内します。
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <button
                onClick={() => {
                  navigateTo('chat');
                }}
                className="btn-accent"
                style={{
                  fontSize: 15,
                  padding: '14px 28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(224, 122, 95, 0.4)'
                }}
              >
                <MessageSquare size={18} />
                <span>無料相談チャットを開く（敷地図面・写真も送信可能）</span>
              </button>
              <button
                onClick={() => navigateTo('simulator')}
                className="btn-secondary"
                style={{
                  fontSize: 15,
                  padding: '14px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.2)'
                }}
              >
                <Compass size={18} />
                <span>自分で3Dシミュレーターを動かしてみる</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ご相談から完成までの流れ
         ========================================================= */}
      <section style={{ background: '#f5f1ea', padding: '80px 24px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-header">
            <span className="section-tag">ステップ</span>
            <h2 className="section-title">ご相談から完成までの流れ</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { step: '01', title: 'まずは3Dで作る', desc: '無料シミュレーターで試作・概算金額を即時確認。登録不要で何度でも試せます。' },
              { step: '02', title: '3Dデータを送る', desc: '作成した3Dデータをもとに、建築士が法規・敷地条件をチェックします。' },
              { step: '03', title: '現地を確認', desc: '敷地境界・高低差・搬入経路・地盤などを専門スタッフが実測調査。' },
              { step: '04', title: '最終設計・お見積もり', desc: '詳細な仕上げ・仕様を決定。AIフォトリアルパースを作成・ご提示します。' },
              { step: '05', title: 'クラウド電子契約', desc: '来店や押印不要。スマホやPCからオンラインで安全に契約締結できます。' },
              { step: '06', title: '確認申請・施工', desc: '建築士による確認申請代行から基礎工事、建て方、完成まで一貫サポート。' }
            ].map((st, i) => (
              <div key={i} style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#ffffff',
                  background: 'var(--color-primary)',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {st.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                    STEP {st.step}：{st.title}
                  </div>
                  <div style={{ fontSize: 13.5, color: '#64748b' }}>
                    {st.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          最終CTA
         ========================================================= */}
      <section style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
        color: '#ffffff',
        padding: '70px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', marginBottom: 16, color: '#ffffff' }}>
            その敷地に、ぴったりのガレージを。
          </h2>
          <p style={{ fontSize: 16, color: '#d8f3dc', lineHeight: 1.8, marginBottom: 32 }}>
            まずは登録不要の3Dシミュレーターで、ミリ単位の自由設計をお試しください。<br />
            金額もその場で変わります。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-accent"
              style={{ fontSize: 16, padding: '16px 36px' }}
            >
              <Compass size={20} />
              <span>今すぐ3Dで作ってみる（登録不要・無料）</span>
            </button>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-secondary"
              style={{ background: '#ffffff', color: 'var(--color-primary-dark)', border: 'none', fontSize: 15 }}
            >
              <span>3Dデータ・図面を送って専任スタッフに相談</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          ステップ画像拡大モーダル（ライトボックス）
         ========================================================= */}
      {previewStep && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            animation: 'fadeInModal 0.2s ease-out'
          }}
          onClick={() => setPreviewStep(null)}
        >
          <div 
            style={{
              background: '#0f172a',
              borderRadius: 'var(--radius-xl, 16px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              maxWidth: 1040,
              width: '100%',
              maxHeight: '94vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div style={{
              padding: '16px 20px',
              background: '#1e293b',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  background: previewStep.step === '05' || previewStep.step === '06' ? '#d97706' : 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 20
                }}>
                  STEP {previewStep.step}
                </span>
                <h3 style={{ margin: 0, fontSize: 17, color: '#f8fafc', fontWeight: 700 }}>
                  {previewStep.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewStep(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="modal-close-btn"
                title="閉じる (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* モーダル画像表示エリア */}
            <div style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#020617',
              flex: 1,
              minHeight: 0,
              overflow: 'hidden'
            }}>
              <img 
                src={previewStep.img} 
                alt={previewStep.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '66vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                }}
              />
            </div>

            {/* モーダルフッター（解説＋CTA） */}
            <div style={{
              padding: '16px 22px',
              background: '#1e293b',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap'
            }}>
              <p style={{
                margin: 0,
                fontSize: 13.5,
                color: '#cbd5e1',
                lineHeight: 1.6,
                flex: 1,
                minWidth: 260
              }}>
                {previewStep.desc}
              </p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setPreviewStep(null);
                    navigateTo('simulator');
                  }}
                  className="btn-accent"
                  style={{
                    padding: '10px 20px',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Compass size={16} />
                  <span>3Dシミュレーターで試す</span>
                </button>
                <button
                  onClick={() => setPreviewStep(null)}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md, 8px)',
                    fontSize: 13.5,
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .step-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.1) !important;
          border-color: var(--color-primary-light) !important;
        }
        .step-card-hover:hover img {
          transform: scale(1.03);
        }
        .step-card-hover:hover .zoom-badge {
          background: rgba(15, 23, 42, 0.95) !important;
          color: #60a5fa !important;
          border-color: rgba(96, 165, 250, 0.5) !important;
        }
        .modal-close-btn:hover {
          background: rgba(239, 68, 68, 0.8) !important;
          transform: rotate(90deg);
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

