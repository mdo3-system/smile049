import React from 'react';
import { Compass, ArrowRight, Check, Warehouse, ShieldCheck, ChevronRight, Wrench, Trees } from 'lucide-react';

export default function PlanAgriPage({ setCurrentRoute }) {
  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="plan-agri-page">
      {/* ヒーローセクション */}
      <section style={{
        background: 'linear-gradient(180deg, #edf5ef 0%, var(--bg-main) 100%)',
        padding: '70px 24px 80px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div className="section-tag" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)' }}>
            GARAGE PLAN 03
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.35,
            color: 'var(--text-main)',
            marginBottom: 20
          }}>
            トラクターの出入りも、収穫物の保管もスムーズ。<br />
            <span style={{ color: 'var(--color-primary)' }}>作業動線から逆算する木造アグリシェッドを、自分で描く。</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 740, margin: '0 auto 28px' }}>
            「大型農機具に合わせた天井高・間口が規格品にない」<br />
            「市街化調整区域や農地だから、手続きが難しくて進まない」<br />
            建物の4辺の長さ、屋根の形状や勾配、大型シャッターや出入口の位置まで画面上で自由自在にシミュレーション。<br />
            リアルタイムに概算見積もりを確認しながら、作業動線に合わせた理想の納屋・倉庫を組み立てられます。<br />
            建築士の構造計算・確認申請から施工まで、面倒な行政手続きもまとめてお任せいただけます。
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-accent"
              style={{ fontSize: 16, padding: '16px 36px' }}
            >
              <Compass size={20} />
              <span>今すぐ3Dでアグリシェッドを作ってみる（登録不要・無料）</span>
            </button>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-secondary"
            >
              <span>敷地図面を送って建築士に申請・配置を相談する</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5つの壁セクション */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag" style={{ background: '#fee2e2', color: '#b91c1c' }}>農業倉庫の悩み</span>
          <h2 className="section-title">規格鉄骨倉庫やプレハブで直面する「農業・農具保管の5つの壁」</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 840, margin: '0 auto' }}>
          {[
            { title: '1. 保有する機械のサイズに間口・天井高が合わない', desc: '規格品だと無駄に大きすぎるか、作業機付きトラクターがギリギリ入らないかのどちらかになりがちです。' },
            { title: '2. 市街化調整区域や農地法の手続きでつまずく', desc: '農地転用や開発許可、調整区域での建築確認申請など、専門的な法規手続きに対応できる相談窓口がありません。' },
            { title: '3. 作業動線に合わせた「土間・出入口・水場」が作りにくい', desc: 'トラクターで前進進入・バック出庫ではなく「通り抜け」にしたい等の動線計画が規格品では組めません。' },
            { title: '4. 冬場の冷気・結露による農機具や資材の劣化', desc: '金属板むき出しの倉庫は朝夕の結露が激しく、大切な機械のサビや収穫物・段ボールのカビ原因になります。' },
            { title: '5. 農薬・肥料・長柄農具の専用棚がうまく組めない', desc: '鉄骨壁は後から木ネジや釘が打てず、コンテナや長柄農具の専用壁面収納をDIYで作るのが困難です。' }
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
            <h2 className="section-title">木造自由設計アグリシェッドが選ばれる5つの理由</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { num: '01', title: '機材ファースト設計（4辺・高さを自在に決定）', desc: 'トラクター＋ロータリー作業機の全長・全高から逆算し、無駄のない最適な間口・天井高をミリ単位で設計。' },
              { num: '02', title: '大型シャッター・通り抜け開口・土間スロープ対応', desc: '段差なしのスムーズな出入りや、前後通り抜けの2連シャッターなど、農作業動線を徹底重視。' },
              { num: '03', title: '断熱・調湿を考えた仕様で結露に配慮', desc: '木造ならではの断熱・調湿を考慮した仕様により、結露や湿気にも配慮。大切な農機具のサビ防止や資材の保管に最適です。' },
              { num: '04', title: '内部の壁一面がすべて「特注収納棚」に変わる', desc: '合板下地の壁面を活かし、農具フック、収穫コンテナ棚、肥料置き場を作業性に合わせて自由にレイアウト。' },
              { num: '05', title: '構造計算＆市街化調整区域の申請もワンストップ', desc: '建築士が市街化調整区域の法規確認から農地法関連、金物工法による耐震構造計算まで一貫代行。' }
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
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>農具・管理機ミニシェッド</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口3.0m × 奥行4.0m / 小型農機＋農具棚</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>180万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>管理機（小型耕運機）や刈払機、長柄農具の壁面収納に最適なコンパクトサイズ。</p>
          </div>

          <div className="nature-card" style={{ border: '2px solid var(--color-primary)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', background: 'var(--color-primary)', display: 'inline-block', padding: '2px 8px', borderRadius: 4, marginBottom: 8 }}>標準仕様</div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>トラクター標準アグリベース</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口4.5m × 奥行6.0m / 中型トラクター＋コンテナ</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>360万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>作業機付きトラクターが余裕で入るハイルーフ仕様。左右にコンテナラックも設置可能。</p>
          </div>

          <div className="nature-card">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>大型農機2台＋収穫物作業場</h3>
            <div style={{ fontSize: 13, color: 'var(--color-wood)', fontWeight: 700, marginBottom: 12 }}>間口7.0m × 奥行8.0m / 2連大開口＋作業場</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>650万円台〜</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>トラクターと軽トラを並列格納し、奥で出荷調整や選別作業ができる本格アグリハブ。</p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigateTo('simulator')}
            className="btn-accent"
            style={{ fontSize: 16, padding: '16px 36px' }}
          >
            <Compass size={20} />
            <span>3Dシミュレーターで農機具を入れてみる</span>
          </button>
        </div>
      </section>
    </div>
  );
}
