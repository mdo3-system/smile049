import React, { useState, useEffect } from 'react';
import { 
  Compass, ArrowRight, CheckCircle2, Shield, Clock, MapPin, 
  Building2, Ruler, Layers, Sparkles, MessageSquare, ChevronRight,
  Maximize2, X, AlertCircle, FileCheck, Check, Tractor, DoorOpen, HardHat, FileText, Scale
} from 'lucide-react';
import { Analytics } from '../utils/analytics';

export default function CaseStudiesPage({ setCurrentRoute, initialCase = 'case-urban' }) {
  const [selectedCaseId, setSelectedCaseId] = useState('case-adjust');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activePhotoCategory, setActivePhotoCategory] = useState('all');

  useEffect(() => {
    if (initialCase) {
      if (initialCase === 'case-a' || initialCase === 'urban' || initialCase === 'case-01') {
        setSelectedCaseId('case-urban');
      } else {
        setSelectedCaseId('case-adjust');
      }
    }
  }, [initialCase]);

  const navigateTo = (route) => {
    if (route === 'simulator') {
      Analytics.trackSimulatorStart(`case_study_${selectedCaseId}`);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 実例データ（市街化区域 / 市街化調整区域 の2大実例）
  const casesData = {
    'case-adjust': {
      id: 'case-adjust',
      tag: '市街化調整区域・適合証明・検査済証取得',
      areaType: '市街化調整区域（建築制限区域）',
      title: '市街化調整区域での適合証明＆完了検査合格！農機具収納・勝手口直結ロング特注ガレージ',
      subtitle: '大手鉄骨メーカーが対応できない「間口2.73m × 奥行6.37m」の特殊寸法と勝手口動線を木造自由設計でクリア',
      location: '埼玉県内（市街化調整区域）',
      buildingType: '木造軸組工法（自由設計）平屋建',
      dimensions: '間口 2.73m × 奥行 6.37m（約17.38㎡ / 約5.26坪）',
      specs: [
        { label: '用途', val: '自家用車ガレージ ＋ 奥側農業用物置・機具保管' },
        { label: '都市計画', val: '市街化調整区域（埼玉県への適合証明取得）' },
        { label: '行政検査', val: '確認申請 ＆ 埼玉県建築主事による完了検査合格（検査済証受領）' },
        { label: '構造・仕様', val: '木造軸組＋高耐震金物、ブラックガルバリウム鋼板、手動ワイドシャッター' },
        { label: '特注ポイント', val: '母屋勝手口への最短動線サイドドア、奥側農機具スペース確保のロング奥行き' }
      ],
      points: [
        { label: '市街化調整区域も正規合格', text: '埼玉県への適合証明申請から完了検査まで自社専任スタッフが一貫代行。正規の検査済証を取得。' },
        { label: 'W2.73m × D6.37m 特注寸法', text: '大手S造では規格外となる縦長サイズ。奥に農機具や肥料をたっぷり収納できる深さを木造で実現。' },
        { label: '勝手口への直結動線ドア', text: '雨の日も濡れずに母屋へ行き来できるよう、勝手口の正面ピンポイントに出入口を設置。' }
      ],
      constructionSteps: [
        {
          id: 'b-step1',
          category: 'survey',
          stepNum: '01',
          title: '現況調査・地縄・行政事前協議',
          desc: '市街化調整区域における適合証明協議と、母屋勝手口に合わせたミリ単位の地縄・配置確認。',
          photos: [
            { src: '/assets/construction/02/IMG_2310.jpeg', title: '施工前現況確認', caption: '母屋との位置関係と敷地の確認' },
            { src: '/assets/construction/02/IMG_2311.jpeg', title: '地縄・境界確認', caption: '間口2.73m×奥行6.37mの正確な位置出し' }
          ]
        },
        {
          id: 'b-step2',
          category: 'foundation',
          stepNum: '02',
          title: '基礎工事（配筋・型枠・コンクリート打設）',
          desc: '車両や重量のある農機具の荷重に耐える強固な配筋と、高精度なアンカーボルト配置。',
          photos: [
            { src: '/assets/construction/02/IMG_2339.jpeg', title: '鉄筋配筋組み', caption: '構造計算に基づくD10/D13鉄筋結束' },
            { src: '/assets/construction/02/IMG_2341.JPG', title: '型枠建込み', caption: '立ち上がり幅とかぶり厚を厳密に確保' },
            { src: '/assets/construction/02/IMG_2343.JPG', title: 'コンクリート打設', caption: 'ジャンカのない密実な打設' },
            { src: '/assets/construction/02/IMG_2344.JPG', title: '基礎脱型完了', caption: '十分な養生期間を経て型枠解体' }
          ]
        },
        {
          id: 'b-step3',
          category: 'framing',
          stepNum: '03',
          title: '木造建て方・特注小屋組み',
          desc: '奥行6.37mのロングスパンを堅牢に支える木造軸組と、勝手口ドア開口部の高精度な造作。',
          photos: [
            { src: '/assets/construction/02/IMG_2423.JPG', title: '柱建て・梁架け', caption: '高精度プレカット材による迅速な組み上げ' },
            { src: '/assets/construction/02/IMG_2425.JPG', title: '耐震金物施工', caption: 'ホールダウン金物・筋交いプレートで補強' },
            { src: '/assets/construction/02/IMG_2427.JPG', title: '建て方骨組み完成', caption: '間口2.73m×奥行6.37mのフレーム' }
          ]
        },
        {
          id: 'b-step4',
          category: 'exterior',
          stepNum: '04',
          title: '耐力面材・透湿防水・外壁ガルバリウム',
          desc: '通気層工法で内部結露を防止。勝手口直結ドアとブラックガルバでシャープに仕上げ。',
          photos: [
            { src: '/assets/construction/02/IMG_2430.jpeg', title: '構造用合板耐力壁', caption: '耐震性を高める面材工法' },
            { src: '/assets/construction/02/IMG_2433.jpeg', title: '透湿防水シート', caption: '雨水を遮断し湿気を逃がす二重防水' },
            { src: '/assets/construction/02/IMG_2436.jpeg', title: 'ガルバリウム外壁施工', caption: '高耐久・メンテナンスフリーの外壁' }
          ]
        },
        {
          id: 'b-step5',
          category: 'inspection',
          stepNum: '05',
          title: 'シャッター取付・埼玉県完了検査合格・完成',
          desc: '埼玉県の建築主事による現地完了検査に合格し「検査済証」を取得。安心のお引渡し。',
          photos: [
            { src: '/assets/construction/02/IMG_2466.jpeg', title: '勝手口直結ドア動線', caption: '母屋勝手口と雨に濡れず直結' },
            { src: '/assets/construction/02/IMG_2470.jpeg', title: '奥側農機具スペース', caption: '車＋農機具がたっぷり入る奥行き' },
            { src: '/assets/construction/02/IMG_2514.jpeg', title: '完成外観', caption: 'ブラックガルバとワイドシャッター' },
            { src: '/assets/construction/02/IMG_2534.jpeg', title: 'お引渡し完了', caption: '施主様のご要望をすべて実現' }
          ]
        }
      ]
    },
    'case-urban': {
      id: 'case-urban',
      tag: '市街化区域・法22条地域・境界15cm',
      areaType: '市街化区域（建築基準法第22条指定区域）',
      title: '市街化区域（法22条地域）での確認申請合格！敷地境界15cm・既存アスファルト活用ガレージ',
      subtitle: '大手規格メーカーが「基礎・申請は自己手配」「アスファルト全解体」と断った案件をワンストップ＆低コストで完工',
      location: '埼玉県鶴ヶ島市（市街化区域・法22条区域）',
      buildingType: '木造軸組工法（自由設計）平屋建',
      dimensions: '間口 5.46m × 奥行 5.46m（約29.8㎡ / 約9.0坪）2台用ワイド',
      specs: [
        { label: '用途', val: '法人様・事業用資材および車両保管庫' },
        { label: '都市計画', val: '市街化区域（建築基準法第22条・屋根不燃規制区域）' },
        { label: '行政検査', val: '建築確認申請・消防協議・完了検査取得' },
        { label: '構造・仕様', val: '木造軸組＋軒ゼロ設計、ブラックガルバリウム鋼板、特注木製壁面棚' },
        { label: '特注ポイント', val: '隣地境界から外壁離れ実質15cm、既存アスファルト活用外周布基礎、車止め再利用' }
      ],
      points: [
        { label: '市街化区域・法22条区域に対応', text: '鶴ヶ島市の法22条防火指定をクリアする屋根不燃・外壁仕様で正規の確認申請を完了。' },
        { label: '隣地境界から実質15cmの限界施工', text: '軒の出ゼロ設計と高精度墨出しにより、駐車スペース2台分を敷地いっぱいミリ単位でフル活用。' },
        { label: '既存アスファルト活用でコスト削減', text: '全面解体せず外周布基礎を打設。余分な解体・再舗装費をカットし、既存車止めも再設置。' }
      ],
      constructionSteps: [
        {
          id: 'a-step1',
          category: 'survey',
          stepNum: '01',
          title: '現地調査・境界墨出し',
          desc: '隣地境界線ギリギリ（実質15cm）を狙う精密な位置出しと、既存アスファルトの勾配計測。',
          photos: [
            { src: '/assets/construction/01/IMG_1487.jpeg', title: '敷地境界確認', caption: '隣地駐車場境界ラインの精密墨出し' },
            { src: '/assets/construction/01/IMG_1491.jpeg', title: '地縄・配置確認', caption: '駐車2台分をフル活用する配置' }
          ]
        },
        {
          id: 'a-step2',
          category: 'foundation',
          stepNum: '02',
          title: '基礎工事（既存アスファルト活用布基礎）',
          desc: '既存舗装を壊さず外周部に高強度布基礎を打設。余分な解体・再舗装費用を大幅カット。',
          photos: [
            { src: '/assets/construction/01/IMG_1618.jpeg', title: '基礎型枠・アンカー', caption: '土台を強固に緊結するアンカーボルト' },
            { src: '/assets/construction/01/IMG_1623.jpeg', title: 'コンクリート打設完了', caption: '既存舗装との段差を調整した立ち上がり' }
          ]
        },
        {
          id: 'a-step3',
          category: 'framing',
          stepNum: '03',
          title: '木造建て方・高耐震金物工法',
          desc: '自社大工による高精度プレカット建て方。梁現しの美しい小屋組みと頑丈な軸組。',
          photos: [
            { src: '/assets/construction/01/IMG_1664.jpeg', title: '建て方開始', caption: '105角主要柱と梁を金物工法で緊結' },
            { src: '/assets/construction/01/IMG_1676.jpeg', title: '内部・小屋組み梁現し', caption: '木造ならではの温かみと高い天井高' }
          ]
        },
        {
          id: 'a-step4',
          category: 'exterior',
          stepNum: '04',
          title: '透湿防水・ガルバリウム外壁・特注棚造作',
          desc: '法22条の不燃外壁仕様。工事中に追加要望された頑丈な壁面収納棚も大工が即座に造作。',
          photos: [
            { src: '/assets/construction/01/IMG_1707.jpeg', title: '透湿防水シート施工', caption: '結露を防ぐ二重防水・通気層' },
            { src: '/assets/construction/01/IMG_1752.jpeg', title: 'ブラックガルバ外壁', caption: '軒ゼロのシャープな外観' },
            { src: '/assets/construction/01/IMG_1794.jpeg', title: '特注壁面収納棚造作', caption: '使い勝手に合わせてミリ単位で造作' },
            { src: '/assets/construction/01/IMG_1840.JPG', title: '完成全景', caption: '境界15cm・既存車止めも綺麗に再設置' }
          ]
        }
      ]
    }
  };

  const currentCase = casesData[selectedCaseId] || casesData['case-adjust'];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: '"Inter", "Noto Sans JP", sans-serif' }}>
      
      {/* 1. ヒーローバナー：市街化区域も市街化調整区域も両方対応 */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)',
        color: '#fff',
        padding: '50px 20px 45px',
        borderBottom: '4px solid #f59e0b',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fbbf24', padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
            <Sparkles size={15} />
            木造自由設計ガレージ・現場施工実例
          </div>

          <h1 style={{ fontSize: 'clamp(22px, 3.8vw, 34px)', fontWeight: 800, lineHeight: 1.35, marginBottom: 14 }}>
            「市街化区域（法22条）」も「市街化調整区域」も。<br />
            <span style={{ color: '#38bdf8' }}>どちらの土地でも、確認申請・適合証明から施工まで余裕で叶えます。</span>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 1.6vw, 15.5px)', color: '#cbd5e1', maxWidth: 840, lineHeight: 1.65, marginBottom: 24 }}>
            大手鉄骨・既製品メーカーでは「規格外」「敷地に入らない」「申請や基礎は自分で手配して」と断られがちな条件でも大丈夫。<br />
            スマイチなら一級建築士事務所として、法規・確認申請・完了検査・特注寸法まで自社専任スタッフが一括ワンストップで対応します。
          </p>

          {/* 2大エリア対応の対比カード */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            
            {/* 市街化区域 */}
            <div 
              onClick={() => setSelectedCaseId('case-urban')}
              style={{
                background: selectedCaseId === 'case-urban' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                border: selectedCaseId === 'case-urban' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                padding: '16px 18px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                  実例 ① 鶴ヶ島市
                </span>
                <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 700 }}>詳しく見る ▸</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                市街化区域（法22条・防火指定区域）
              </div>
              <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.4 }}>
                法22条不燃仕様・境界15cm・既存アスファルト活用・確認申請済
              </div>
            </div>

            {/* 市街化調整区域 */}
            <div 
              onClick={() => setSelectedCaseId('case-adjust')}
              style={{
                background: selectedCaseId === 'case-adjust' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                border: selectedCaseId === 'case-adjust' ? '2px solid #34d399' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                padding: '16px 18px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                  実例 ② 埼玉県内
                </span>
                <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>詳しく見る ▸</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                市街化調整区域（建築制限区域）
              </div>
              <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.4 }}>
                埼玉県適合証明・完了検査合格（検査済証取得）・特注W2.73×D6.37m
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. メインコンテンツ（選択された実例の要点と写真） */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 20px 70px' }}>

        {/* 実例切り替えタブ */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, borderBottom: '2px solid #e2e8f0', paddingBottom: 12, overflowX: 'auto' }}>
          <button
            onClick={() => setSelectedCaseId('case-adjust')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 8,
              border: selectedCaseId === 'case-adjust' ? '2px solid #059669' : '1px solid #cbd5e1',
              background: selectedCaseId === 'case-adjust' ? '#ecfdf5' : '#fff',
              color: selectedCaseId === 'case-adjust' ? '#065f46' : '#475569',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Tractor size={18} color={selectedCaseId === 'case-adjust' ? '#059669' : '#64748b'} />
            【実例：市街化調整区域】農機具収納・特注ロングガレージ（W2.73×D6.37m）
          </button>

          <button
            onClick={() => setSelectedCaseId('case-urban')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 8,
              border: selectedCaseId === 'case-urban' ? '2px solid #0284c7' : '1px solid #cbd5e1',
              background: selectedCaseId === 'case-urban' ? '#f0f9ff' : '#fff',
              color: selectedCaseId === 'case-urban' ? '#0369a1' : '#475569',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Building2 size={18} color={selectedCaseId === 'case-urban' ? '#0284c7' : '#64748b'} />
            【実例：鶴ヶ島市・市街化区域（法22条）】境界15cm・既存アスファルト活用
          </button>
        </div>

        {/* 実例詳細カード */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', marginBottom: 32 }}>
          
          <div style={{ display: 'inline-block', background: selectedCaseId === 'case-adjust' ? '#d1fae5' : '#e0f2fe', color: selectedCaseId === 'case-adjust' ? '#065f46' : '#0369a1', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
            {currentCase.tag}
          </div>

          <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginBottom: 8 }}>
            {currentCase.title}
          </h2>

          <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
            {currentCase.subtitle}
          </p>

          {/* 3大ポイント（簡潔にまとめたもの） */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 20 }}>
            {currentCase.points.map((pt, idx) => (
              <div key={idx} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 13.5, color: '#0f172a', marginBottom: 6 }}>
                  <CheckCircle2 size={17} color="#16a34a" />
                  {pt.label}
                </div>
                <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5 }}>
                  {pt.text}
                </div>
              </div>
            ))}
          </div>

          {/* スペック表（シンプル表示） */}
          <div style={{ background: '#fafafa', borderRadius: 8, padding: '12px 16px', border: '1px solid #eee', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, fontSize: 12.5 }}>
            {currentCase.specs.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontWeight: 700, color: '#64748b', flexShrink: 0 }}>{item.label}:</span>
                <span style={{ color: '#1e293b', fontWeight: 600 }}>{item.val}</span>
              </div>
            ))}
          </div>

        </div>

        {/* 3. 現場施工写真（工程順にスッキリ配置） */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <HardHat size={20} color="#0284c7" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              実際の現場施工写真（工程順）
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {currentCase.constructionSteps.map((step) => (
              <div key={step.id} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 800 }}>
                    STEP {step.stepNum}
                  </span>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {step.title}
                  </h4>
                </div>

                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 14px', lineHeight: 1.5 }}>
                  {step.desc}
                </p>

                {/* 写真 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {step.photos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => setSelectedPhoto(photo)}
                      style={{
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'transform 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ height: 140, background: '#cbd5e1', overflow: 'hidden' }}>
                        <img
                          src={photo.src}
                          alt={photo.title}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                          {photo.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>
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

        {/* 4. 写真拡大モーダル */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 850,
                width: '100%',
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X size={18} />
              </button>

              <div style={{ maxHeight: '65vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                />
              </div>

              <div style={{ padding: '16px 20px' }}>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  {selectedPhoto.title}
                </h4>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. 3Dシミュレーター誘導CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: 16,
          padding: '32px 24px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, marginBottom: 10 }}>
            あなたの敷地（市街化区域・調整区域問わず）でシミュレーション
          </h2>
          <p style={{ fontSize: 14.5, color: '#e0f2fe', maxWidth: 640, margin: '0 auto 22px', lineHeight: 1.6 }}>
            「うちの敷地でも建てられるか相談したい」「特注サイズの概算費用を知りたい」など、3Dシミュレーターで即座に積算・ご相談いただけます。
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigateTo('simulator')}
              style={{
                background: '#f59e0b',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 30px',
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Compass size={18} />
              無料で3Dシミュレーターを試す
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
