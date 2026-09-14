import React from 'react';
import { Compass, ArrowRight, Check, Car, Wrench, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { Analytics } from '../utils/analytics';

export default function PlanHobbyPage({ setCurrentRoute }) {
  const navigateTo = (route) => {
    if (route === 'simulator') {
      Analytics.trackSimulatorStart('plan_hobby');
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="plan-hobby-page">
      {/* ヒーローセクション */}
      <section style={{
        background: 'linear-gradient(180deg, #f3ede4 0%, var(--bg-main) 100%)',
        padding: '70px 24px 80px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div className="section-tag" style={{ background: 'var(--color-wood-light)', color: 'var(--color-wood-dark)' }}>
            GARAGE PLAN 01
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.35,
            color: 'var(--text-main)',
            marginBottom: 20
          }}>
            愛車を眺めて、夜を明かす。<br />
            <span style={{ color: 'var(--color-wood)' }}>1cmの妥協もない、大人の木造ピットを自分で描く。</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 740, margin: '0 auto 28px' }}>
            「既製品の鉄骨ガレージでは、何か物足りない。」<br />
            車幅＋ドア開閉寸法、大型バイクの取り回し、壁一面のツールシェルフ。<br />
            木造だからできる自由なサイズとレイアウトを、画面の中で今すぐシミュレーション。<br />
            建築士の構造計算・確認申請から施工までワンストップで形にします。
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 36 }}>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-accent"
              style={{ fontSize: 16, padding: '16px 36px' }}
            >
              <Compass size={20} />
              <span>今すぐ3Dでガレージを作ってみる（登録不要・無料）</span>
            </button>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-secondary"
            >
              <span>作った3Dデータや敷地図面を建築士に相談する</span>
            </button>
          </div>

          {/* 生成モデル建物外観写真 */}
          <div style={{
            position: 'relative',
            maxWidth: 880,
            margin: '0 auto',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(0,0,0,0.14)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}>
            <img
              src="/assets/plans/plan01.jpg"
              alt="Plan 01 愛車・ホビー木造ガレージ 完成予想モデル"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fff',
              fontSize: 13
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                <Sparkles size={16} color="#38bdf8" />
                <span>PLAN 01：屋根・外壁ガルバリウム鋼板仕上げ × 軒ゼロシャープデザイン × 木造梁現しピット</span>
              </div>
            </div>
          </div>

          {/* 掲載モデル画像の注意事項 */}
          <p style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: 14,
            lineHeight: 1.6
          }}>
            ※掲載モデルは、3Dシミュレーション・自動見積もりでは表現しきれない多数のオプション項目が含まれております。あらかじめご承知おきください。
          </p>
        </div>
      </section>

      {/* 5つの妥協セクション */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag" style={{ background: '#fee2e2', color: '#b91c1c' }}>愛車派の悩み</span>
          <h2 className="section-title">規格ガレージで愛車派がぶつかる「5つの妥協」</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 840, margin: '0 auto' }}>
          {[
            { title: '1. ドアを開けたら壁に当たりそう', desc: '規格寸法では車のドア開閉や乗り降りが窮屈になりがち。' },
            { title: '2. 壁に工具棚やタイヤラックをビス止めできない', desc: '鉄板の壁は後加工に制約が多く、思い通りの壁面収納が作れません。' },
            { title: '3. 冬場の冷気・結露による大切な機材への不安', desc: '金属板は外気温度の影響を受けやすく、湿気や結露のコントロールが困難。' },
            { title: '4. 高さ（天井高・ロフト）が選べない', desc: '背の高いSUVやルーフキャリア付き車、上部空間（ロフト）の有効活用が制限されます。' },
            { title: '5. 味気ない「ただの車庫」になってしまう', desc: 'スチールやトタンの無機質な空間では、木に囲まれた温もりや居場所感が得られません。' }
          ].map((item, i) => (
            <div key={i} style={{
              background: '#ffffff',
              border: '1px solid #fee2e2',
              borderRadius: 'var(--radius-md)',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 13,
                fontWeight: 800
              }}>
                ✕
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 13.5, color: '#64748b' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 木造自由設計が選ばれる理由 */}
      <section style={{ background: '#f5f1ea', padding: '80px 24px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header">
            <span className="section-tag">選ばれる理由</span>
            <h2 className="section-title">木造自由設計ガレージが選ばれる5つの理由</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { num: '01', title: '車種・動線から逆算する寸法設計', desc: '車幅だけでなくドアの開きしろ、大型バイク2台＋整備動線など、理想のレイアウトに合わせてミリ単位で設計。' },
              { num: '02', title: '壁全面が「カスタムベース」', desc: '構造用合板下地を採用しているため、どこでも木ネジが効きます。工具掛けや棚、タイヤラックも自由自在。' },
              { num: '03', title: '断熱・調湿を考えた仕様で結露に配慮', desc: '木造ならではの断熱・調湿を考慮した仕様により、結露や湿気にも配慮。大切な愛車や工具に優しい環境です。' },
              { num: '04', title: '梁現しの立体空間＆ロフト設計', desc: '開放的な勾配天井や小屋組み現しにより、スペアタイヤやキャンプギアのストックに最適な上部ロフトを確保。' },
              { num: '05', title: '構造計算＆建築士ワンストップ', desc: '金物工法による耐震性と、自社建築士による確認申請の自社完結で、安心・安全な車庫空間を実現します。' }
            ].map((card, i) => (
              <div key={i} className="nature-card" style={{ background: '#ffffff' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-wood)', opacity: 0.6, marginBottom: 8 }}>{card.num}</div>
                <h3 style={{ fontSize: 17, marginBottom: 10, color: '#1e293b' }}>{card.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 参考レイアウト＆概算目安 */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag">参考レイアウト</span>
          <h2 className="section-title">参考レイアウト＆概算目安</h2>
          <p className="section-desc">仕様や広さに応じた標準的なプラン例です。3Dシミュレーターでアレンジ可能です。</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
          <div className="nature-card">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>単車趣味の秘密基地</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口3.0m × 奥行4.5m / バイク2台＋ピット</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>200万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>愛車バイクを眺めながらメンテナンスを楽しめるコンパクトなプライベートピット。</p>
          </div>

          <div className="nature-card" style={{ border: '2px solid var(--color-primary)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', background: 'var(--color-primary)', display: 'inline-block', padding: '2px 8px', borderRadius: 4, marginBottom: 8 }}>人気仕様</div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>愛車1台＋ゆったりピット</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口4.0m × 奥行6.5m / ワークベンチ＋棚</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>350万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>普通乗用車の左右にゆとりを持たせ、奥に作業机や大型収納棚を常設できる標準ピット。</p>
          </div>

          <div className="nature-card">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>クルマ＋バイク＋ロフト</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口5.5m × 奥行6.5m / 高天井・梁現し</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>500万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>車とバイクを同時に格納し、頭上の大空間ロフトに趣味の荷物をたっぷりストック。</p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigateTo('simulator')}
            className="btn-accent"
            style={{ fontSize: 16, padding: '16px 36px' }}
          >
            <Compass size={20} />
            <span>3Dシミュレーターで愛車を入れてみる</span>
          </button>
        </div>
      </section>
    </div>
  );
}
