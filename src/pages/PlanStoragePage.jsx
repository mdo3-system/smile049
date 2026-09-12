import React from 'react';
import { Compass, ArrowRight, Check, Home, ShieldCheck, ChevronRight, Layers, Maximize, Sparkles } from 'lucide-react';

export default function PlanStoragePage({ setCurrentRoute }) {
  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="plan-storage-page">
      {/* ヒーローセクション */}
      <section style={{
        background: 'linear-gradient(180deg, #f2efe9 0%, var(--bg-main) 100%)',
        padding: '70px 24px 80px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div className="section-tag" style={{ background: 'var(--color-wood-light)', color: 'var(--color-wood-dark)' }}>
            GARAGE PLAN 02
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.35,
            color: 'var(--text-main)',
            marginBottom: 20
          }}>
            「入らない」と諦めていた角やスキマに、ぴったり納める。<br />
            <span style={{ color: 'var(--color-primary)' }}>変形地を最大活用する木造ストッカーを、自分で描く。</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 740, margin: '0 auto 28px' }}>
            「既製品の物置だと、敷地境界との間に無駄な余白ができる」<br />
            「四角い規格サイズでは、斜めの角地に入らない」<br />
            建物の4辺の長さ、屋根の形状や勾配、ドアや窓の位置まで画面上で自由自在にシミュレーション。<br />
            リアルタイムに概算見積もりを確認しながら、あなただけのジャストサイズを組み立てられます。
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 36 }}>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-accent"
              style={{ fontSize: 16, padding: '16px 36px' }}
            >
              <Compass size={20} />
              <span>今すぐ3Dでストッカーを作ってみる（登録不要・無料）</span>
            </button>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-secondary"
            >
              <span>敷地図面を送って建築士に納まりを相談する</span>
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
              src="/assets/plans/plan02.jpg"
              alt="Plan 02 狭小・変形地向け木造ストッカーガレージ 完成予想モデル"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fff',
              fontSize: 13
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                <Sparkles size={16} color="#38bdf8" />
                <span>PLAN 02 完成予想パース：斜め境界にジャストフィット × 片流れ屋根 × 直角台形ガレージ</span>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>シミュレーターでこの形状からカスタマイズ可能</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5つの壁セクション */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag" style={{ background: '#fee2e2', color: '#b91c1c' }}>狭小・変形地の壁</span>
          <h2 className="section-title">規格物置・プレハブで直面する「5つの壁」</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 840, margin: '0 auto' }}>
          {[
            { title: '1. 境界との間に「もったいない隙間」ができる', desc: '規格モジュールでは敷地境界との間に半端なスペースが残り、有効活用できません。' },
            { title: '2. 三角形や台形の角地には四角い物置しか置けない', desc: '変形した敷地形状に既製品がフィットせず、デッドスペースが生まれてしまいます。' },
            { title: '3. 通路や母屋の窓・屋根と干渉してしまう', desc: '既製品では高さや屋根勾配が固定のため、母屋の窓や軒、勝手口動線を邪魔しがちです。' },
            { title: '4. 確認申請や建蔽率の計算が不安', desc: 'ホームセンターや物置メーカーでは、防火地域や建蔽率などの建築確認申請手続きに対応できません。' },
            { title: '5. 冬場の冷気・結露による保管物への不安', desc: '金属板物置は内部温度の変化が激しく、大切なキャンプ用品やストック品が湿気で傷む不安があります。' }
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

      {/* 選ばれる理由 */}
      <section style={{ background: '#f5f1ea', padding: '80px 24px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header">
            <span className="section-tag">選ばれる理由</span>
            <h2 className="section-title">木造自由設計ストッカーが選ばれる5つの理由</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { num: '01', title: '4辺の長さ・角度を決める「多角形モデリング」', desc: '正面幅・背面幅・左右奥行を個別に設定でき、台形地や隅切り地を余すことなく収納化。' },
              { num: '02', title: '屋根形状・勾配・高さをミリ単位で調整', desc: '水流し方向の切り替え（前/後/左/右）と勾配調整で、母屋の軒との干渉を綺麗に回避。' },
              { num: '03', title: '断熱・調湿を考えた仕様で結露に配慮', desc: '木造ならではの断熱・調湿を考慮した仕様により、結露や湿気にも配慮。大切な荷物の保管環境を整えます。' },
              { num: '04', title: '内部の壁一面がすべて棚になる高効率収納', desc: '変形した奥の角スペースも特注の間仕切り・棚ユニットで隙間なく使い切れます。' },
              { num: '05', title: '構造計算＆建築士ワンストップ', desc: '母屋との離隔距離チェックや防火規定、確認申請の代行まで建築士が責任を持って対応。' }
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
          <div className="nature-card">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>隙間活用スリムストッカー</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口1.2m × 奥行4.0m / 通路・境界沿い</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>120万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>母屋の横の細長い通路スペースを最大限に生かし、長尺物やタイヤを収納。</p>
          </div>

          <div className="nature-card" style={{ border: '2px solid var(--color-primary)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', background: 'var(--color-primary)', display: 'inline-block', padding: '2px 8px', borderRadius: 4, marginBottom: 8 }}>変形地対応</div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>変形角地フィットシェッド</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口2.5m × 奥行3.0m / 台形・隅切り対応</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>180万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>敷地の斜めラインに合わせて外壁を配置し、敷地境界ギリギリまで無駄なく活用。</p>
          </div>

          <div className="nature-card">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>旗竿地・奥庭ストレージ</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口3.0m × 奥行3.5m / 母屋裏独立スペース</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>230万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>母屋裏の独立したスペースに設置。作業スペースとしても使えるゆとり設計。</p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigateTo('simulator')}
            className="btn-accent"
            style={{ fontSize: 16, padding: '16px 36px' }}
          >
            <Compass size={20} />
            <span>まずは建物の形を作ってみる：3Dシミュレーターへ</span>
          </button>
        </div>
      </section>
    </div>
  );
}
