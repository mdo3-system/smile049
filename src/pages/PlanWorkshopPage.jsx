import React from 'react';
import { Compass, ArrowRight, Check, Warehouse, ShieldCheck, ChevronRight, Sparkles, Building2, Users, Flame, Award, Ruler } from 'lucide-react';
import { Analytics } from '../utils/analytics';

export default function PlanWorkshopPage({ setCurrentRoute }) {
  const navigateTo = (route) => {
    if (route === 'simulator') {
      Analytics.trackSimulatorStart('plan_workshop');
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="plan-workshop-page">
      {/* ヒーローセクション */}
      <section style={{
        background: 'linear-gradient(180deg, #edf2f7 0%, var(--bg-main) 100%)',
        padding: '70px 24px 80px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div className="section-tag" style={{ background: '#e2e8f0', color: '#1e293b' }}>
            GARAGE & HALL PLAN 04
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.35,
            color: 'var(--text-main)',
            marginBottom: 20
          }}>
            中柱のない、圧倒的な木造大空間。<br />
            <span style={{ color: 'var(--color-primary)' }}>トラス工法で間口15m超・桁下6mの自由を拓く。</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 780, margin: '0 auto 28px' }}>
            「道場や体操教室に邪魔な柱をなくしたい。」「ヨガやセミナーに木の温もりと高断熱がほしい。」<br />
            木造トラス構造を採用することで、<strong>間口最大15m超の無柱大スパン・桁下6mの広大な空間</strong>を低コスト・短工期で実現。<br />
            武道場・ヨガスタジオ・体操教室・学習塾・セミナールームからBtoB事業用倉庫まで。<br />
            専任スタッフ・自社設計による構造計算・用途変更・確認申請から施工までワンストップでお届けします。
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 36 }}>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-accent"
              style={{ fontSize: 16, padding: '16px 36px' }}
            >
              <Compass size={20} />
              <span>3Dシミュレーターで大空間を描いてみる（無料）</span>
            </button>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-secondary"
            >
              <span>専任スタッフに大スパン・事業用設計を相談する</span>
            </button>
          </div>

          {/* 生成モデル建物外観写真（15m×15m・桁下6mの事業用倉庫・ホール） */}
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
              src="/assets/plans/plan04.jpg"
              alt="Plan 04 スマイチホール・大空間ワークショップ＆事業用倉庫 完成予想モデル"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              background: 'rgba(15, 23, 42, 0.88)',
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
                <span>PLAN 04：15m×15m 桁下6m 屋根・外壁ガルバリウム鋼板仕上げ × 木造トラス無柱大スパン設計</span>
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
          <span className="section-tag" style={{ background: '#fee2e2', color: '#b91c1c' }}>従来の課題</span>
          <h2 className="section-title">鉄骨造や賃貸テナントで直面する「5つの妥協」</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 840, margin: '0 auto' }}>
          {[
            { 
              title: '1. 部屋の真ん中にある「邪魔な中柱」で動線が寸断される', 
              desc: '道場や体操・ヨガ・ダンスでは柱が安全上のリスクになり、倉庫でもフォークリフトやパレット配置の死角になります。' 
            },
            { 
              title: '2. 鉄骨造は冬底冷え・夏蒸し風呂で、空調光熱費が莫大にかかる', 
              desc: '鉄骨特有のヒートブリッジ（熱橋）と結露で、生徒が裸足で過ごす道場やスタジオでは過酷な環境になりがちです。' 
            },
            { 
              title: '3. テナント賃料を払い続けても、自社の資産に残らない', 
              desc: '高額な家賃と共益費を毎月支払い、退去時には数百万円の原状回復費用を請求されるリスクを抱え続けます。' 
            },
            { 
              title: '4. 鉄骨造は基礎・鋼材費が高騰し、初期投資の回収が長期化する', 
              desc: '近年鋼材価格が急騰。鉄骨造の坪単価が高騰し、自己資金の圧迫や融資審査のハードルが高くなっています。' 
            },
            { 
              title: '5. 無機質なスチール空間では生徒や利用者がリラックスできない', 
              desc: '鉄骨むき出しやトタン壁の無機質な空間では、木に包まれた温もりや集中できる心地よいスクール環境が作れません。' 
            }
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

      {/* スマイチ大スパン木造トラスが選ばれる理由 */}
      <section style={{ background: '#f8fafc', padding: '80px 24px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header">
            <span className="section-tag" style={{ background: '#dbeafe', color: '#1d4ed8' }}>選ばれる理由</span>
            <h2 className="section-title">スマイチ木造トラス大空間が選ばれる5つの理由</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { 
                num: '01', 
                title: '間口15m超・桁下6mの完全無柱大空間', 
                desc: '三角形を組み合わせた強固な「木造トラス工法」により、室内に中柱が一切ない広大な空間を実現。武道場の畳敷きや体操マット、大型ラック配置も自由自在です。' 
              },
              { 
                num: '02', 
                title: '木の調湿・高断熱性能で一年中クリーン＆快適', 
                desc: '木材は鉄骨の約350倍の断熱性を持ち、自然な調湿効果を発揮。冷暖房効率が極めて高く、生徒や講師が素足でも底冷えしない心地よい空気環境を保ちます。' 
              },
              { 
                num: '03', 
                title: '早期減価償却（22年）でBtoB事業投資に圧倒的優位', 
                desc: '鉄骨造（法定耐用年数34年）に比べ、木造事務所・店舗は22年で償却可能。毎年の節税効果を高め、キャッシュフローを早期に最大化できます。' 
              },
              { 
                num: '04', 
                title: '防音壁・無垢床・鏡張り・ロフトなど自由内装', 
                desc: '構造用合板が下地となるため、壁面の大型鏡貼り・吸音防音工事・造作棚の設置が容易。用途に合わせた理想のレイアウトを低コストで構築できます。' 
              },
              { 
                num: '05', 
                title: '構造計算・用途変更・確認申請をワンストップ完結', 
                desc: '大スパン建築に必要な許容応力度計算から、特殊建築物の用途変更、消防協議、建築確認申請まで、自社専任スタッフが一括で迅速に対応いたします。' 
              }
            ].map((card, i) => (
              <div key={i} className="nature-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', opacity: 0.8, marginBottom: 8 }}>{card.num}</div>
                <h3 style={{ fontSize: 17, marginBottom: 10, color: '#1e293b' }}>{card.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 用途別活用シーン */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag">多彩な用途</span>
          <h2 className="section-title">柱のない大空間だからこそ広がる、多彩な用途</h2>
          <p className="section-desc">スクール運営から地域コミュニティ、BtoBビジネスまで幅広く活躍します。</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { icon: '🥋', title: '武道場・アカデミー', desc: '空手・柔道・合気道・剣道など。柱の衝突リスクがなく、畳敷きやスプリング床の施工も安心。' },
            { icon: '🧘', title: 'ヨガ・ピラティススタジオ', desc: '木の温もりと柔らかな自然光。高い天井とクリーンな空気で、極上のリラックス体験を提供。' },
            { icon: '🤸', title: '体操教室・ダンススクール', desc: '跳び箱・マット運動・チアリーディングなど、大スパン・高天井を生かしたのびのびとした指導環境。' },
            { icon: '📚', title: '学習塾・カルチャースクール', desc: '集中力を高める木質空間。可動間仕切りで大教室から個別指導ブースまで柔軟にレイアウト。' },
            { icon: '🎤', title: 'セミナールーム・イベントホール', desc: '地域交流スペースや社員研修、展示発表会に。プロジェクター投影や音響設計もスムーズ。' },
            { icon: '📦', title: 'BtoB事業用倉庫・作業場', desc: 'フォークリフト作業や大型パレット保管に。軒下6mの高さを生かした多段ラックで容積効率最大化。' }
          ].map((use, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{use.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{use.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{use.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 参考レイアウト＆概算目安 */}
      <section style={{ background: '#f8fafc', padding: '80px 24px', borderTop: '1px solid var(--border-light)' }}>
        <div className="section-container" style={{ padding: 0 }}>
          <div className="section-header">
            <span className="section-tag">参考モデル</span>
            <h2 className="section-title">参考規模＆概算目安</h2>
            <p className="section-desc">木造トラスの広さや天井高に応じたモデル例です。3Dシミュレーターでアレンジ可能です。</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
            <div className="nature-card" style={{ background: '#fff' }}>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>ヨガ・ダンス・個別塾モデル</h3>
              <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, marginBottom: 12 }}>間口8.0m × 奥行8.0m（約20坪）/ 天井高3.5m</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>800万円台〜</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>壁面一面ミラーや更衣室ブースを完備。15名前後のスタジオ・少人数スクールに最適なコンパクト大空間。</p>
            </div>

            <div className="nature-card" style={{ background: '#fff', border: '2px solid var(--color-primary)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', background: 'var(--color-primary)', display: 'inline-block', padding: '2px 8px', borderRadius: 4, marginBottom: 8 }}>人気仕様</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>本格武道場・体操スタジオモデル</h3>
              <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, marginBottom: 12 }}>間口10.0m × 奥行12.0m（約36坪）/ 桁下4.5m</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>1,400万円台〜</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>中柱が一切ない50畳以上の広々とした演武・マットスペース。見学者ベンチや器具庫もすっきり配置。</p>
            </div>

            <div className="nature-card" style={{ background: '#fff' }}>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>15m×15m 事業用大型倉庫・ホール</h3>
              <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, marginBottom: 12 }}>間口15.0m × 奥行15.0m（約68坪）/ 桁下6.0m</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 12 }}>2,500万円台〜</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>大型電動シャッター・高窓付き。フォークリフトによる荷役作業や大規模セミナールームに対応するフラッグシップ仕様。</p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-accent"
              style={{ fontSize: 16, padding: '16px 36px' }}
            >
              <Compass size={20} />
              <span>3Dシミュレーターで大空間を自分で描いてみる</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
