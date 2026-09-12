import React from 'react';
import { 
  Compass, ArrowRight, Check, AlertTriangle, ShieldCheck, 
  Sparkles, Layers, FileText, ChevronRight, Ruler, Wrench, Home, Car, Warehouse, Trees
} from 'lucide-react';

export default function TopPage({ setCurrentRoute }) {
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
            <div className="section-tag" style={{ background: 'var(--color-wood-light)', color: 'var(--color-wood-dark)' }}>
              ★ 登録不要・ブラウザですぐ動く3Dシミュレーター
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              lineHeight: 1.35,
              color: 'var(--text-main)',
              marginBottom: 20
            }}>
              あと少し大きく。<br />
              あと少し小さく。<br />
              <span style={{ color: 'var(--color-primary)' }}>そのガレージ、自分で描いてみませんか？</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
              敷地に合わせて、サイズも形も棚も自由自在。<br />
              画面の中で3D設計すると、概算金額までその場でわかります。<br />
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
                木造だからできる自由設計。建築士による構造設計・確認申請から施工まで、まとめてワンストップでお任せいただけます。
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
                onClick={() => navigateTo('simulator')}
                className="btn-secondary"
                style={{ fontSize: 15 }}
              >
                <span>建築士にプロ相談する</span>
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#8c7e72', marginTop: 10 }}>
              ※「ちょっと試してみる」だけでも大歓迎です。登録や個人情報は不要です。
            </div>
          </div>

          {/* ヒーロービジュアル（親しみやすい3Dモック・カード風） */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: 24,
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-card)',
            position: 'relative'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px 24px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 20 }}>
                  リアルタイム積算連動
                </span>
                <span style={{ fontSize: 12, color: '#a7f3d0' }}>ミリ単位自動算出</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>
                幅 5,400mm × 奥行 6,000mm
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>概算建築費用目安</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#fde047' }}>
                  2,560,000<span style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}> 円〜</span>
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', fontSize: 11 }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 4px', borderRadius: 6 }}>
                  床面積: 9.8坪
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 4px', borderRadius: 6 }}>
                  勾配: 1.5寸水流し
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 4px', borderRadius: 6 }}>
                  シャッター+棚完備
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-wood)' }}>
                <Trees size={16} />
                <span>木造・金物工法 / 建築士専任設計</span>
              </div>
              <button 
                onClick={() => navigateTo('simulator')}
                style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>3D画面へ</span>
                <ArrowRight size={14} />
              </button>
            </div>
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
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}>
              実際の画面でわかる！体験ストーリー
            </span>
            <h3 style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              color: 'var(--text-main)',
              marginTop: 10,
              marginBottom: 10
            }}>
              0ベースの自由設計から、AIフォトリアルパース完成まで
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto' }}>
              スマホやPCの画面上で、あなたの敷地に合わせたガレージがカタチになり、
              プロ建築士監修の超リアルな完成予想パースがチャットに届くまでの一連の流れをご覧ください。
            </p>
          </div>

          {/* 6ステップ グリッド表示 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 24,
            marginBottom: 20
          }}>
            {[
              {
                step: '01',
                title: '幅・奥行・屋根勾配をミリ単位で設計',
                desc: '敷地境界や変形地に合わせてミリ単位で入力。3D寸法線が連動し、立体空間が即座に立ち上がります。',
                img: './assets/steps/step1.png',
                tag: '自由設計'
              },
              {
                step: '02',
                title: 'シャッター・ドア・サッシを自由配置',
                desc: '大型電動シャッターや片開きドア、高所換気窓を直感配置。内付け・半外付け・基礎切欠きも自動連動。',
                img: './assets/steps/step2.png',
                tag: '建具配置'
              },
              {
                step: '03',
                title: '内部の造作棚・ラックをレイアウト',
                desc: '木造の柱間に合わせた収納棚を自由に設計。透視モードをONにすると内部の広がりが隅々まで見通せます。',
                img: './assets/steps/step3.png',
                tag: '内部空間'
              },
              {
                step: '04',
                title: '愛車・バイク・農機具を配置確認',
                desc: 'SUVやスポーツカー、農業用トラクターをガレージ内に格納。車の出入り動線やクリアランスを実寸確認。',
                img: './assets/steps/step4.png',
                tag: '車両格納'
              },
              {
                step: '05',
                title: 'ワンタップでAIパース作成を依頼',
                desc: 'パスワード登録不要。作成した3Dデータが自動添付され、お名前とご連絡先だけで即座に無料依頼できます。',
                img: './assets/steps/step5.png',
                tag: '無料依頼'
              },
              {
                step: '06',
                title: 'LINE風チャットでAIパースを受領！',
                desc: '専任建築士との専用チャットに超高画質フォトリアルパースが届きます。図面の相談や仕様変更もチャットで完結。',
                img: './assets/steps/step6.png',
                tag: 'パース完成'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
                className="step-card-hover"
              >
                {/* ステップ画像プレビュー枠 */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '62%',
                  background: '#0f172a',
                  overflow: 'hidden'
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
                    background: 'rgba(30, 41, 59, 0.9)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <span style={{ color: '#80ed99' }}>STEP</span>
                    <span>{item.step}</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(45, 106, 79, 0.9)',
                    color: '#ffffff',
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4
                  }}>
                    {item.tag}
                  </div>
                </div>

                {/* カードテキスト */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{
                    fontSize: 15.5,
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: 8,
                    lineHeight: 1.4
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
          目的別 3つの特化プラン紹介
         ========================================================= */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag">プランを探す</span>
          <h2 className="section-title">あなたなら、何を入れますか？</h2>
          <p className="section-desc">目的や敷地条件に特化した3つの代表的なプランをご提案しています。</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 28
        }}>
          {/* Plan 1 */}
          <div className="nature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-wood)', background: 'var(--color-wood-light)', padding: '3px 10px', borderRadius: 12 }}>
                  PLAN 01
                </span>
                <Car size={22} color="var(--color-primary)" />
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-main)' }}>
                大人の秘密基地<br />
                【愛車・大型バイク・ホビー】
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                「自分が一番長くいたくなる場所」を設計。無垢の木に囲まれた落ち着いた空間で愛車と過ごす時間を創ります。壁面全面がカスタムベース。
              </p>
            </div>
            <button
              onClick={() => navigateTo('plan-hobby')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>愛車・ホビーガレージを見る</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Plan 2 */}
          <div className="nature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-wood)', background: 'var(--color-wood-light)', padding: '3px 10px', borderRadius: 12 }}>
                  PLAN 02
                </span>
                <Home size={22} color="var(--color-wood)" />
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-main)' }}>
                デッドスペースを、収納に。<br />
                【狭小地・変形地向け特注ストッカー】
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                既製品では使えなかったスペースを活かし、敷地の形に合わせて収納空間をつくります。斜めの境界沿い、母屋の軒下にもぴったりフィット。
              </p>
            </div>
            <button
              onClick={() => navigateTo('plan-storage')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>狭小・変形地向けストッカーを見る</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Plan 3 */}
          <div className="nature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-wood)', background: 'var(--color-wood-light)', padding: '3px 10px', borderRadius: 12 }}>
                  PLAN 03
                </span>
                <Warehouse size={22} color="var(--color-accent)" />
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-main)' }}>
                作業動線から、逆算する。<br />
                【農機具・収穫物向けアグリシェッド】
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                トラクターや農機具の出入り、収穫物保管など「何を入れるか」から逆算して設計。市街化調整区域や農地の面倒な手続きもワンストップ。
              </p>
            </div>
            <button
              onClick={() => navigateTo('plan-agri')}
              className="btn-accent"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>農機具・大型倉庫を見る</span>
              <ChevronRight size={16} />
            </button>
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
              <span>3Dデータ・図面を送って建築士に相談</span>
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .step-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.08) !important;
          border-color: var(--color-primary-light) !important;
        }
        .step-card-hover:hover img {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}

