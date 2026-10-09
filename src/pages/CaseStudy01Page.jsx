import React, { useState } from 'react';
import { 
  Compass, ArrowRight, CheckCircle2, Shield, Clock, MapPin, 
  Building2, Ruler, Layers, Sparkles, MessageSquare, ChevronRight,
  Maximize2, X, AlertCircle, FileCheck, Check
} from 'lucide-react';
import { Analytics } from '../utils/analytics';

export default function CaseStudy01Page({ setCurrentRoute }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const navigateTo = (route) => {
    if (route === 'simulator') {
      Analytics.trackSimulatorStart('case_study_01');
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 厳選した工事写真リスト
  const constructionSteps = [
    {
      id: 'step1',
      category: 'survey',
      stepNum: '01',
      title: '現地調査・境界墨出し',
      subtitle: '隣地境界から実質15cmの限界設計',
      desc: '隣地駐車場との境界線ギリギリを狙い、柱芯30cm・外壁仕上離れ実質15cmを確保するための精密な位置出しを実施。既存のアスファルト舗装の勾配と水勾配を綿密に計測しました。',
      photos: [
        { src: '/assets/construction/01/IMG_1487.jpeg', title: '敷地境界と位置出し確認', caption: '隣地境界ラインと既存アスファルトの納まり確認' },
        { src: '/assets/construction/01/IMG_1491.jpeg', title: '地縄・配置確認', caption: '既存の駐車スペース2台分をフル活用する配置計画' },
        { src: '/assets/construction/01/1768610496243.JPG', title: '施工前現況確認', caption: '既存アスファルトと境界線の詳細調査' }
      ]
    },
    {
      id: 'step2',
      category: 'foundation',
      stepNum: '02',
      title: '基礎工事（既存アスファルト活用）',
      subtitle: '全解体せず既存舗装を活かして大幅コスト削減',
      desc: '一般的な規格ガレージでは「アスファルトを全面解体して新規土間コンクリート打ち」を求められますが、スマイチでは既存の良好な舗装面を活かし、外周部に高強度な布基礎を打設。余分な解体・再舗装費用を徹底的にカットしました。',
      photos: [
        { src: '/assets/construction/01/IMG_1618.jpeg', title: '基礎型枠・アンカーボルト配置', caption: '土台を強固に緊結するアンカーボルトを正確に配置' },
        { src: '/assets/construction/01/IMG_1623.jpeg', title: 'コンクリート打設完了', caption: '既存アスファルトとの段差をミリ単位で調整した立ち上がり' },
        { src: '/assets/construction/01/IMG_1630.jpeg', title: '型枠脱型・基礎天端レベラー', caption: '木造土台を据え付けるための精密な水平レベル出し' }
      ]
    },
    {
      id: 'step3',
      category: 'framing',
      stepNum: '03',
      title: '木造建て方・高耐震金物工法',
      subtitle: '自社専任スタッフによる構造計算と高精度施工',
      desc: '土台敷きから建て方へ。プレカットされた高精度な構造材と高耐震接合金物を採用。梁現しの美しい小屋組みと、地震・強風に粘り強い木造軸組構造を一気に組み上げました。',
      photos: [
        { src: '/assets/construction/01/IMG_1664.jpeg', title: '建て方開始・柱立柱', caption: '105角の主要柱と梁を金物工法で高精度に緊結' },
        { src: '/assets/construction/01/IMG_1671.jpeg', title: '屋根垂木・骨組み全景', caption: '軒ゼロのシャープな外観を実現する屋根下地' },
        { src: '/assets/construction/01/IMG_1676.jpeg', title: '内部・小屋組み梁現し構造', caption: '木造ならではの温かみと高い天井高を確保' },
        { src: '/assets/construction/01/IMG_1683.jpeg', title: '耐震金物・筋交い補強', caption: '建築士の構造計算に基づく高耐震補強金物' }
      ]
    },
    {
      id: 'step4',
      category: 'exterior',
      stepNum: '04',
      title: '外壁下地・屋根・透湿防水シート',
      subtitle: '雨風と結露から守る通気・断熱構造',
      desc: '耐力面材（構造用合板）で建物を一体化し、外壁全面に透湿防水シートと通気胴縁を施工。金属製物置で問題になりやすい「内部結露」を木造の調湿性と通気層で効果的に抑制します。',
      photos: [
        { src: '/assets/construction/01/IMG_1695.jpeg', title: '構造用合板張り', caption: '壁倍率を高める耐震面材を隙間なく施工' },
        { src: '/assets/construction/01/IMG_1700.jpeg', title: '屋根ルーフィング（防水層）', caption: '長期間の防水性を担保する高耐久アスファルトルーフィング' },
        { src: '/assets/construction/01/IMG_1707.jpeg', title: '透湿防水シート・通気層施工', caption: '湿気を外へ逃がし雨水の浸入を完全遮断する二重防水構造' }
      ]
    },
    {
      id: 'step5',
      category: 'cladding',
      stepNum: '05',
      title: 'ガルバリウム鋼板外壁 ＆ シャッター',
      subtitle: 'モダンな金属外観とスムーズな開口部',
      desc: '外壁には耐久性とデザイン性に優れたガルバリウム鋼板を採用。軒の出ゼロの美しいディテールと、使い勝手の良いワイドシャッターおよびサッシを設置しました。',
      photos: [
        { src: '/assets/construction/01/IMG_1752.jpeg', title: '外壁ガルバリウム鋼板施工', caption: 'シャープで洗練されたブラックガルバリウム仕上げ' },
        { src: '/assets/construction/01/IMG_1760.jpeg', title: '出入口サッシ・開口部納まり', caption: '雨仕舞いを徹底したサッシ周りの役物板金納まり' },
        { src: '/assets/construction/01/IMG_1770.jpeg', title: 'ワイドシャッター取付', caption: 'スムーズな開閉と高い防犯性を両立した軽量シャッター' },
        { src: '/assets/construction/01/IMG_1780.jpeg', title: '軒ゼロのシャープな妻側ディテール', caption: '敷地境界ギリギリまで寄せるための軒出ゼロ設計' }
      ]
    },
    {
      id: 'step6',
      category: 'interior',
      stepNum: '06',
      title: '内部造作・特注棚 ＆ 床仕上',
      subtitle: '工事中に追加要望された壁面棚も柔軟に製作',
      desc: '「工事中に内部の収納棚を追加したい」という施主様のご要望にも即座に対応できるのが木造の大きなメリット。構造用合板の下地を活かし、重量物もしっかり置ける頑丈な特注棚を自由な高さで造作しました。',
      photos: [
        { src: '/assets/construction/01/IMG_1794.jpeg', title: '内部特注収納棚の造作', caption: '保管物に合わせてミリ単位で高さを設定した木製棚' },
        { src: '/assets/construction/01/IMG_1811.jpeg', title: '広々とした内部保管空間', caption: '梁現しの開放的な天井と明るい木肌の内観' },
        { src: '/assets/construction/01/IMG_1821.jpeg', title: '頑丈な棚受け構造', caption: 'どこにでもビスが効く木造壁面だから後からのDIYも自由自在' }
      ]
    },
    {
      id: 'step7',
      category: 'complete',
      stepNum: '07',
      title: '完工・車止め復旧・引き渡し',
      subtitle: '相談から約3ヶ月でスピード引き渡し完了',
      desc: '工事のために一時撤去していた新しい車止めをきれいに再設置し、アスファルト舗装との取り合いも美しく仕上がりました。当初のCGパース・完成イメージ通りのガレージが完成し、施主様に大変ご満足いただきました。',
      photos: [
        { src: '/assets/construction/01/IMG_1840.JPG', title: '完成全景（正面外観）', caption: '駐車場2台分にジャストフィットした堂々たる佇まい' },
        { src: '/assets/construction/01/IMG_1841.JPG', title: '車止め復旧とアスファルトの連続性', caption: '既存の車止めを再利用し、無駄なコストを徹底排除' },
        { src: '/assets/construction/01/IMG_1842.JPG', title: '境界線ギリギリの側面納まり', caption: '隣地境界から実質15cmの隙間にピタリと納まった外壁' },
        { src: '/assets/construction/01/IMG_1843.JPG', title: '引き渡し完了・夕景', caption: '事業用車両や備品をたっぷり収納できる頼もしい木造ガレージ' }
      ]
    }
  ];

  const filteredSteps = activeTab === 'all' 
    ? constructionSteps 
    : constructionSteps.filter(s => s.category === activeTab);

  return (
    <div className="case-study-page" style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* ヒーローセクション */}
      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '70px 24px 80px',
        borderBottom: '4px solid var(--color-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: 13, fontWeight: 700, marginBottom: 20, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <FileCheck size={16} />
            <span>スマイチ施工実例レポート ［第1号棟］</span>
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 42px)', fontWeight: 800, lineHeight: 1.35, marginBottom: 24, letterSpacing: '-0.02em' }}>
            敷地境界15cmの限界突破 × 既存アスファルト活用<br />
            <span style={{ color: '#38bdf8' }}>大手規格品で断られた厳しい敷地条件を、木造自由設計で完全解決。</span>
          </h1>

          <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.85, maxWidth: 840, marginBottom: 36 }}>
            「基礎・電気・確認申請は自分で別々に手配して」「規格サイズしかないので敷地に合わない」「既存のアスファルトは全解体が必要」――。<br />
            大手スチールガレージメーカーで直面した数々の壁を、スマイチの<strong>「建築士ワンストップ対応」</strong>と<strong>「ミリ単位の木造自由設計」</strong>により、相談からわずか3ヶ月で完工したリアルな全記録です。
          </p>

          {/* 主要スペックバッジ */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '20px 24px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>用途・建築種別</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>事業用保管庫・ガレージ</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>構造・工法</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>木造軸組 金物工法（高耐震）</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>敷地離れ寸法</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#38bdf8' }}>隣地境界から実質15cm（柱芯30cm）</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>工期（相談〜完工）</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#4ade80' }}>約3ヶ月（確認申請含む）</div>
            </div>
          </div>

        </div>
      </section>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '60px 24px 80px' }}>
        
        {/* 背景と施主様のお悩みセクション */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>BACKGROUND & CHALLENGES</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#0f172a', marginTop: 6 }}>
              なぜ大手規格スチールガレージを諦めたのか？
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', marginTop: 10 }}>
              長年のお付き合いのある法人オーナー様が直面した「3つの大きな壁」
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24
          }}>
            {/* 壁① */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: '28px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444', fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
                <AlertCircle size={22} />
                <span>壁 1：手配がバラバラで面倒</span>
              </div>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, margin: 0 }}>
                大手規格メーカーに相談したところ、<strong>「本体の販売だけで、基礎工事・電気工事・確認申請はご自身で別々の業者を探して手配してください」</strong>と言われました。多忙な経営者にとって、個別の業者手配と日程調整は極めて重い負担でした。
              </p>
            </div>

            {/* 壁② */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: '28px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444', fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
                <AlertCircle size={22} />
                <span>壁 2：既存アスファルトの全解体</span>
              </div>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, margin: 0 }}>
                現地にはすでに舗装された綺麗なアスファルトと、まだ新しい車止めがありました。しかし規格品では<strong>「アスファルトを全部剥がして基礎を打ち直す必要がある」</strong>とされ、解体・産廃処分費用で全体の建築費が跳ね上がる見積もりでした。
              </p>
            </div>

            {/* 壁③ */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: '28px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444', fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
                <AlertCircle size={22} />
                <span>壁 3：境界ギリギリに建てられない</span>
              </div>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, margin: 0 }}>
                駐車スペース2台分を最大限有効活用するため、地主様の了解を得た上で「隣地境界ギリギリまで攻めたい」という強いご要望がありました。しかし規格ガレージは決まった寸法しかなく、帯に短したすきに長しでスペースが無駄になってしまいました。
              </p>
            </div>
          </div>
        </section>

        {/* スマイチの解決策 比較表 */}
        <section style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
          borderRadius: 16,
          padding: '36px 30px',
          marginBottom: 70,
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#16a34a', letterSpacing: '0.08em' }}>SOLUTIONS</span>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              スマイチの木造自由設計がすべて解決しました
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ background: '#ffffff', borderRadius: 10, padding: '20px 22px', border: '1px solid #86efac' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                <CheckCircle2 size={18} />
                <span>窓口一本化で約3ヶ月スピード完工</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, margin: 0 }}>
                お見積り・ご契約・確認申請・基礎工事・建て方・電気工事・施工管理まで、自社専任スタッフが一括ワンストップ対応。施主様の手間を徹底的に削減しました。
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 10, padding: '20px 22px', border: '1px solid #86efac' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                <CheckCircle2 size={18} />
                <span>既存アスファルト・車止めを再利用</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, margin: 0 }}>
                既存のアスファルトを活かした布基礎工法を採用。車止めも一旦取り外して完工後に再設置し、無駄な解体費用・資材費用をゼロに抑えました。
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 10, padding: '20px 22px', border: '1px solid #86efac' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                <CheckCircle2 size={18} />
                <span>境界実質15cmのミリ単位フィット</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, margin: 0 }}>
                木造自由設計＋軒ゼロ仕様により、隣地境界から柱芯30cm・外壁仕上離れ実質15cmまで寄せ、2台分の駐車スペースを余すことなく使い切りました。
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 10, padding: '20px 22px', border: '1px solid #86efac' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
                <CheckCircle2 size={18} />
                <span>工事中の特注棚追加にも柔軟対応</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, margin: 0 }}>
                スチール製では難しい「工事中の棚追加やレイアウト変更」も、木造なら自由自在。大工がその場で使い勝手に合わせた頑丈な木製棚を造作しました。
              </p>
            </div>
          </div>
        </section>

        {/* 現場写真・工程ドキュメンタリーギャラリー */}
        <section style={{ marginBottom: 70 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>CONSTRUCTION PROCESS</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#0f172a', marginTop: 6 }}>
              全工程 現場施工ドキュメンタリー
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', marginTop: 10 }}>
              現地調査から引き渡しまで。実際の現場で撮影された120枚超の写真から主要工程を公開
            </p>
          </div>

          {/* 工程別ステップタイムライン */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {filteredSteps.map((step, idx) => (
              <div 
                key={step.id} 
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  overflow: 'hidden'
                }}
              >
                {/* ステップヘッダー */}
                <div style={{
                  padding: '20px 24px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      background: 'var(--color-primary)',
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: 800
                    }}>
                      {step.stepNum}
                    </span>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {step.title}
                      </h3>
                      <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, marginTop: 2 }}>
                        {step.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ステップ説明文 */}
                <div style={{ padding: '20px 24px 12px' }}>
                  <p style={{ fontSize: 14.5, color: '#334155', lineHeight: 1.8, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>

                {/* 写真グリッド */}
                <div style={{
                  padding: '16px 24px 24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16
                }}>
                  {step.photos.map((photo, pIdx) => (
                    <div 
                      key={pIdx}
                      onClick={() => setSelectedPhoto(photo)}
                      style={{
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#f1f5f9',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#0f172a' }}>
                        <img 
                          src={photo.src} 
                          alt={photo.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: '#fff',
                          borderRadius: 4,
                          padding: '3px 6px',
                          fontSize: 11,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <Maximize2 size={12} />
                          <span>拡大</span>
                        </div>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                          {photo.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>
                          {photo.caption}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* 施主様の声＆その後の反響 */}
        <section style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '40px 32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          marginBottom: 70
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>💬</span>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                施主様からのご感想 ＆ その後の反響
              </h3>
              <div style={{ fontSize: 13, color: '#64748b' }}>法人オーナー様より</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '24px', borderLeft: '4px solid var(--color-primary)', marginBottom: 24 }}>
            <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.85, margin: 0 }}>
              「最初の相談から見積もり、確認申請、基礎、完成まで3ヶ月でスムーズに進み本当に助かりました。大手メーカーでは既存アスファルトを壊すと言われて諦めかけていましたが、舗装も車止めもそのまま活かしてコストを抑えてくれました。完成したガレージは想像通りの仕上がりで、工事中に追加してもらった頑丈な棚も大活躍しています。」
            </p>
          </div>

          <div style={{ background: '#eff6ff', borderRadius: 10, padding: '20px 24px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e40af', marginBottom: 6 }}>
              💡 この1号棟を見た別のお客様から「カーポートをガレージに変更」のご依頼も！
            </div>
            <p style={{ fontSize: 13.5, color: '#1e3a8a', lineHeight: 1.7, margin: 0 }}>
              完成した本物件の高い質感と敷地ジャストフィットの納まりをご覧になった別のお客様が、自宅新築工事中に予定していたアルミカーポートを急遽取りやめ、<strong>「スマイチの木造特注ガレージ（1台用スリム設計）」</strong>へとプラン変更されるなど、リアルな完成度の高さが大きな反響を呼んでいます。
            </p>
          </div>
        </section>

        {/* CTA（コンバージョン導線） */}
        <section style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 20,
          padding: '50px 32px',
          textAlign: 'center',
          color: '#ffffff',
          boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.4)'
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em' }}>TRY SIMULATOR</span>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#ffffff', marginTop: 8, marginBottom: 16 }}>
            あなたの敷地にも、ジャストフィットする木造ガレージを。
          </h2>
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, maxWidth: 680, margin: '0 auto 32px' }}>
            「うちの変形地にも入るかな？」「敷地境界ギリギリでいくらになる？」<br />
            まずは登録不要の3Dシミュレーターで、敷地の寸法を入れて概算金額を即時チェックしてみませんか？
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <button
              onClick={() => navigateTo('simulator')}
              className="btn-accent"
              style={{ fontSize: 16, padding: '16px 36px', display: 'inline-flex', alignItems: 'center', gap: 10 }}
            >
              <Compass size={20} />
              <span>無料3Dシミュレーターで設計してみる（登録不要）</span>
            </button>
            <button
              onClick={() => navigateTo('chat')}
              className="btn-secondary"
              style={{ fontSize: 15, padding: '16px 28px', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <MessageSquare size={18} />
              <span>敷地図面や変形地について建築士に相談する</span>
            </button>
          </div>
        </section>

      </div>

      {/* 写真拡大プレビューモーダル */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0f172a',
              borderRadius: 12,
              maxWidth: 900,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)'
            }}>
              <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>
                {selectedPhoto.title}
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex'
                }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#000' }}>
              <img 
                src={selectedPhoto.src} 
                alt={selectedPhoto.title} 
                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '16px 20px', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.6 }}>
              {selectedPhoto.caption}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
