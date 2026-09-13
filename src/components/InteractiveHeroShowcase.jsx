import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Compass, Sliders, ChevronRight
} from 'lucide-react';

/**
 * 敷地形状 ①〜⑤ ＋ 3D多機能プレビュー（寸法/透過/地面/空）動的ショーカー
 */
export default function InteractiveHeroShowcase({ onNavigateToSimulator }) {
  // 現在の形状タイプ: 0: regular, 1: trapezoid_left, 2: trapezoid_right, 3: trapezoid_free, 4: corner_notch
  const [currentShapeIdx, setCurrentShapeIdx] = useState(0);
  
  // 3Dシミュレーター機能トグル
  const [showDimensions, setShowDimensions] = useState(true);
  const [isSeeThrough, setIsSeeThrough] = useState(false);
  const [groundType, setGroundType] = useState('asphalt'); // 'asphalt' | 'soil'
  const [skyType, setSkyType] = useState('gradient'); // 'gradient' | 'real_sky'
  
  // 自動再生ステート
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);

  const shapes = [
    {
      id: 'regular',
      num: '①',
      title: '長方形 (四角形)',
      sub: '標準四角い敷地',
      wFront: 5400,
      wBack: 5400,
      dLeft: 6000,
      dRight: 6000,
      areaTsubo: '9.8',
      desc: '四隅がすべて直角（90°）の基本形。標準的な敷地にぴったり。',
      bgTag: '標準基本'
    },
    {
      id: 'trapezoid_left',
      num: '②',
      title: '片側直角 (左直角)',
      sub: '右壁105°扇状開き',
      wFront: 5400,
      wBack: 7008,
      dLeft: 6000,
      dRight: 6000,
      areaTsubo: '11.3',
      desc: '左は直角、右壁が扇状に105°開き！背面が約1.6m広がり土地を100%活用。',
      bgTag: '道路・斜め対応'
    },
    {
      id: 'trapezoid_right',
      num: '③',
      title: '片側直角 (右直角)',
      sub: '左壁開き',
      wFront: 5400,
      wBack: 6850,
      dLeft: 6000,
      dRight: 6000,
      areaTsubo: '11.1',
      desc: '右は直角、左壁が斜め境界に沿って開閉！敷地角の隅々まで建物を配置。',
      bgTag: '斜め境界密着'
    },
    {
      id: 'trapezoid_free',
      num: '④',
      title: '自由台形・偏芯',
      sub: '平行四辺形・斜行',
      wFront: 5400,
      wBack: 5400,
      dLeft: 6000,
      dRight: 6000,
      areaTsubo: '9.8',
      desc: '背面の左右スライダーで平行四辺形に変形！菱形敷地にも完全フィット。',
      bgTag: 'ツールの真骨頂'
    },
    {
      id: 'corner_notch',
      num: '⑤',
      title: '障害物・隅欠き',
      sub: '電柱・桝のL字回避',
      wFront: 5400,
      wBack: 5400,
      dLeft: 6000,
      dRight: 6000,
      areaTsubo: '9.1',
      desc: '角の電柱や雨水浸透桝をL字にきれいに回避！本体は大容量2台用を維持。',
      bgTag: '障害物クリア'
    }
  ];

  const currentShape = shapes[currentShapeIdx];

  // 自動ループタイマー（3.8秒ごとに切り替え、機能トグルもデモ）
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = 50; // 50msごとにプログレス更新
    const stepTime = 3800; // 1ステップ3.8秒
    const stepIncrement = (interval / stepTime) * 100;

    const timer = setInterval(() => {
      setAutoPlayProgress(prev => {
        if (prev >= 100) {
          // 次のステップへ
          setCurrentShapeIdx(sIdx => {
            const nextIdx = (sIdx + 1) % shapes.length;
            
            // ステップに合わせて機能トグルもデモ的に切り替える
            if (nextIdx === 1) {
              setShowDimensions(true);
              setIsSeeThrough(false);
              setGroundType('asphalt');
              setSkyType('gradient');
            } else if (nextIdx === 2) {
              // 透過モードをデモ
              setIsSeeThrough(true);
            } else if (nextIdx === 3) {
              // 土地面 ＆ リアル青空をデモ
              setIsSeeThrough(false);
              setGroundType('soil');
              setSkyType('real_sky');
            } else if (nextIdx === 4) {
              // 隅欠き ＆ アスファルト
              setIsSeeThrough(false);
              setGroundType('asphalt');
              setSkyType('gradient');
            } else {
              setIsSeeThrough(false);
              setGroundType('asphalt');
              setSkyType('gradient');
            }

            return nextIdx;
          });
          return 0;
        }
        return prev + stepIncrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, shapes.length]);

  const selectShape = (idx) => {
    setCurrentShapeIdx(idx);
    setAutoPlayProgress(0);
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 上部ヘッダー：タイトル ＆ オートプレイ制御 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: 10,
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 6
          }}>
            3Dシミュレーター機能ツアー
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>
            敷地に合わせて形が自在に変わる！
          </span>
        </div>

        {/* 再生/一時停止ボタン */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: '1px solid #cbd5e1',
            background: isAutoPlaying ? '#f8fafc' : '#fef3c7',
            color: isAutoPlaying ? '#475569' : '#b45309',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          title={isAutoPlaying ? "自動ツアーを一時停止" : "自動ツアーを再開"}
        >
          {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
          <span>{isAutoPlaying ? '自動再生中' : '手動操作中'}</span>
        </button>
      </div>

      {/* ①〜⑤ 敷地形状選択タブ（自動で進むプログレスバー付き） */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
        {shapes.map((s, idx) => {
          const isActive = currentShapeIdx === idx;
          return (
            <button
              key={s.id}
              onClick={() => {
                selectShape(idx);
                setIsAutoPlaying(false);
              }}
              style={{
                background: isActive ? 'linear-gradient(135deg, #1b4332, #2d6a4f)' : '#f8fafc',
                color: isActive ? '#ffffff' : '#475569',
                border: `1.5px solid ${isActive ? '#2d6a4f' : '#e2e8f0'}`,
                borderRadius: 8,
                padding: '6px 2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 10px rgba(45, 106, 79, 0.25)' : 'none'
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800 }}>
                {s.num}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100%' }}>
                {s.title.split(' ')[0]}
              </div>

              {/* アクティブ時の自動再生プログレスバー */}
              {isActive && isAutoPlaying && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: 3,
                  width: `${autoPlayProgress}%`,
                  background: '#fde047',
                  transition: 'width 0.05s linear'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* メインの3Dビジュアル ＆ 鳥瞰ダイアグラム表示キャンバス */}
      <div style={{
        position: 'relative',
        height: 260,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #cbd5e1',
        background: skyType === 'real_sky'
          ? 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 40%, #93c5fd 80%, #dbeafe 100%)'
          : 'linear-gradient(180deg, #2563eb 0%, #60a5fa 45%, #bfdbfe 85%, #eff6ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 上部オーバーレイ：形状名 ＆ 敷地適合バッジ */}
        <div style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#f8fafc',
              fontSize: 11,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              {currentShape.num} {currentShape.title}
            </span>
            <span style={{
              background: '#fef08a',
              color: '#854d0e',
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: 20
            }}>
              {currentShape.bgTag}
            </span>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#38bdf8',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 6,
            backdropFilter: 'blur(4px)'
          }}>
            床面積 {currentShape.areaTsubo} 坪
          </div>
        </div>

        {/* 3Dパース ＆ 動的SVGモーフィングエリア */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* 地面 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '46%',
            background: groundType === 'soil'
              ? 'linear-gradient(180deg, #785838 0%, #4d3319 100%)'
              : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }} />

          {/* ガレージ 3D / ベクトルモデル (形状ごとにダイナミック変形) */}
          <div style={{
            position: 'relative',
            zIndex: 5,
            width: '88%',
            maxWidth: 400,
            height: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="heroWallDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="heroShutterRibs" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>

              {/* 敷地境界線（赤点線） */}
              {currentShapeIdx === 1 && (
                <polygon points="40,145 40,25 380,25 320,145" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
              )}
              {currentShapeIdx === 2 && (
                <polygon points="120,145 50,25 370,25 370,145" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
              )}
              {currentShapeIdx === 3 && (
                <polygon points="50,145 110,25 375,25 315,145" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
              )}
              {currentShapeIdx === 4 && (
                <g>
                  <rect x="50" y="20" width="310" height="125" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
                  <rect x="285" y="20" width="75" height="40" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" rx="3" />
                  <text x="322" y="38" fontSize="8.5" fill="#c2410c" fontWeight="bold" textAnchor="middle">⚡電柱・雨水桝</text>
                </g>
              )}

              {/* 基礎コンクリート立ち上がり */}
              <polygon 
                points={
                  currentShapeIdx === 0 ? "70,146 70,135 330,135 330,146" :
                  currentShapeIdx === 1 ? "60,146 60,135 345,135 325,146" :
                  currentShapeIdx === 2 ? "90,146 60,135 340,135 340,146" :
                  currentShapeIdx === 3 ? "75,146 75,135 335,135 315,146" :
                  "70,146 70,135 280,135 280,105 330,105 330,146"
                }
                fill="#e2e8f0" 
                stroke="#cbd5e1" 
                strokeWidth="1" 
              />

              {/* ガレージ本体（外壁 / 透過モード） */}
              <polygon 
                points={
                  currentShapeIdx === 0 ? "70,135 70,45 330,45 330,135" :
                  currentShapeIdx === 1 ? "60,135 60,45 355,40 325,135" :
                  currentShapeIdx === 2 ? "90,135 50,40 340,45 340,135" :
                  currentShapeIdx === 3 ? "75,135 100,45 355,45 315,135" :
                  "70,135 70,45 280,45 280,105 330,105 330,135"
                }
                fill={isSeeThrough ? "rgba(30, 41, 59, 0.4)" : "url(#heroWallDark)"}
                stroke={isSeeThrough ? "#38bdf8" : "#0f172a"}
                strokeWidth={isSeeThrough ? "2" : "1.5"}
                style={{ transition: 'all 0.3s ease' }}
              />

              {/* 透過モード時の木造軸組スケルトン */}
              {isSeeThrough && (
                <g stroke="#f59e0b" strokeWidth="1.5" opacity="0.9">
                  <line x1="72" y1="45" x2="72" y2="135" />
                  <line x1="328" y1="45" x2="328" y2="135" />
                  <line x1="200" y1="45" x2="200" y2="135" />
                  <line x1="72" y1="50" x2="328" y2="50" strokeWidth="2.5" />
                  <line x1="72" y1="45" x2="135" y2="135" strokeDasharray="3,3" />
                  <line x1="265" y1="45" x2="328" y2="135" strokeDasharray="3,3" />
                </g>
              )}

              {/* 正面大型電動シャッター（横リブ線付き） */}
              <rect x="95" y="62" width="130" height="73" fill="url(#heroShutterRibs)" stroke="#475569" strokeWidth="1.5" rx="2" />
              {/* シャッター横リブ線 */}
              {[1, 2, 3, 4, 5, 6].map(i => (
                <line key={i} x1="95" y1={62 + i * 10.5} x2="225" y2={62 + i * 10.5} stroke="#334155" strokeWidth="1" opacity="0.6" />
              ))}

              {/* サッシ窓 */}
              <rect x="245" y="68" width="55" height="38" fill="#93c5fd" stroke="#ffffff" strokeWidth="2" rx="1" />
              <line x1="272" y1="68" x2="272" y2="106" stroke="#ffffff" strokeWidth="1.5" />

              {/* 屋根 */}
              <polygon 
                points={
                  currentShapeIdx === 0 ? "65,45 335,45 330,38 70,38" :
                  currentShapeIdx === 1 ? "55,45 360,40 355,33 65,38" :
                  currentShapeIdx === 2 ? "45,40 345,45 340,38 50,33" :
                  currentShapeIdx === 3 ? "95,45 360,45 355,38 90,38" :
                  "65,45 285,45 285,38 70,38"
                }
                fill="#0f172a" 
                stroke="#334155" 
                strokeWidth="1.5" 
              />

              {/* 寸法線の表示（ON時） */}
              {showDimensions && (
                <g fill="#38bdf8" stroke="#38bdf8" strokeWidth="1.2">
                  <line x1="70" y1="154" x2="330" y2="154" />
                  <line x1="70" y1="150" x2="70" y2="158" />
                  <line x1="330" y1="150" x2="330" y2="158" />
                  <text x="200" y="153" fontSize="8.5" fontWeight="bold" textAnchor="middle" stroke="none" fill="#f8fafc">
                    正面幅: {currentShape.wFront}mm / 奥行: 6000mm
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* 下部オーバーレイ：特徴説明テキスト */}
        <div style={{
          padding: '8px 12px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(6px)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          color: '#e2e8f0',
          fontSize: 11.5,
          lineHeight: 1.4,
          zIndex: 10
        }}>
          {currentShape.desc}
        </div>
      </div>

      {/* 3Dシミュレーターのリアルタイム機能トグルボタンバー */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 6
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sliders size={12} color="var(--color-primary)" />
          <span>画面機能:</span>
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {/* 寸法表示 */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            style={{
              border: `1px solid ${showDimensions ? '#38bdf8' : '#cbd5e1'}`,
              background: showDimensions ? '#e0f2fe' : '#ffffff',
              color: showDimensions ? '#0369a1' : '#64748b',
              fontSize: 10.5,
              fontWeight: 700,
              padding: '3px 6px',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            📏 寸法: {showDimensions ? 'ON' : 'OFF'}
          </button>

          {/* 透過 */}
          <button
            onClick={() => setIsSeeThrough(!isSeeThrough)}
            style={{
              border: `1px solid ${isSeeThrough ? '#f59e0b' : '#cbd5e1'}`,
              background: isSeeThrough ? '#fef3c7' : '#ffffff',
              color: isSeeThrough ? '#b45309' : '#64748b',
              fontSize: 10.5,
              fontWeight: 700,
              padding: '3px 6px',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            🔍 透過: {isSeeThrough ? 'ON' : 'OFF'}
          </button>

          {/* 地面 */}
          <button
            onClick={() => setGroundType(groundType === 'asphalt' ? 'soil' : 'asphalt')}
            style={{
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: 10.5,
              fontWeight: 700,
              padding: '3px 6px',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            {groundType === 'asphalt' ? '🏁 アスファルト' : '🟤 土'}
          </button>

          {/* 空 */}
          <button
            onClick={() => setSkyType(skyType === 'gradient' ? 'real_sky' : 'gradient')}
            style={{
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: 10.5,
              fontWeight: 700,
              padding: '3px 6px',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            {skyType === 'gradient' ? '🌤 青空グラデ' : '☁️ リアル空'}
          </button>
        </div>
      </div>

      {/* アクションボタン：シミュレーターを開く */}
      <button
        onClick={onNavigateToSimulator}
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          color: '#ffffff',
          border: 'none',
          borderRadius: 8,
          padding: '11px 16px',
          fontSize: 13.5,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)'
        }}
      >
        <Compass size={16} />
        <span>このガレージを3Dで自由に動かしてみる（無料）</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
