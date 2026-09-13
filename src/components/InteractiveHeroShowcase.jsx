import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Compass, Sliders, ChevronRight, CheckCircle2,
  Sparkles, Maximize2, Layers
} from 'lucide-react';

/**
 * 本物の3Dシミュレーター実機画面を使った、敷地形状 ①〜⑤ ＆ 3D多機能ツアーショーカー
 */
export default function InteractiveHeroShowcase({ onNavigateToSimulator }) {
  // 現在のタブインデックス (0: 長方形, 1: 左直角, 2: 右直角, 3: 自由台形, 4: 隅欠き, 5: 透過モード, 6: リアル青空, 7: 土色地面)
  const [activeItemKey, setActiveItemKey] = useState('shape_0');
  
  // 自動再生ステート
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);

  // ツアーのステップ定義（すべて本物の3Dシミュレーター実機画像）
  const tourItems = [
    {
      key: 'shape_0',
      type: 'shape',
      shapeNum: '①',
      title: '長方形 (四角形)',
      sub: '四角い標準敷地',
      img: '/assets/manual/shape_regular.png',
      badge: '標準基本タイプ',
      badgeBg: '#e2e8f0',
      badgeColor: '#334155',
      dimInfo: '正面幅: 5400mm / 奥行: 6000mm（床面積 9.8坪）',
      desc: '四隅がすべて90°直角の基本形。左右・前後の柱が対称に美しく立ち上がります。',
      siteType: 'regular'
    },
    {
      key: 'shape_1',
      type: 'shape',
      shapeNum: '②',
      title: '片側直角 (左直角)',
      sub: '右壁105°扇状開き',
      img: '/assets/manual/shape_trapezoid_left.png',
      badge: '斜め境界・扇状拡大',
      badgeBg: '#e0f2fe',
      badgeColor: '#0369a1',
      dimInfo: '正面幅: 5400mm / 背面幅: 7008mm（約1.6m拡大！）',
      desc: '左壁を直角に保ち、右壁を105°に広げて斜め境界ギリギリまでガレージを最大化！',
      siteType: 'trapezoid_left'
    },
    {
      key: 'shape_2',
      type: 'shape',
      shapeNum: '③',
      title: '片側直角 (右直角)',
      sub: '左壁開き',
      img: '/assets/manual/shape_trapezoid_right.png',
      badge: '斜め境界・左壁追従',
      badgeBg: '#e0f2fe',
      badgeColor: '#0369a1',
      dimInfo: '右壁90°固定 / 左壁開き角スライダー連動',
      desc: '右境界はお隣に沿って直角固定、左壁を開いて斜め敷地の隅々まで空間を広げます。',
      siteType: 'trapezoid_right'
    },
    {
      key: 'shape_3',
      type: 'shape',
      shapeNum: '④',
      title: '自由台形・偏芯',
      sub: '平行四辺形・斜行',
      img: '/assets/manual/shape_trapezoid_free.png',
      badge: 'ツールの真骨頂',
      badgeBg: '#fef3c7',
      badgeColor: '#b45309',
      dimInfo: '背面左右ズレ: ±1500mm スライド調整',
      desc: '背面壁全体がスライドし、敷地の傾斜に完全に平行な平行四辺形ガレージを実現！',
      siteType: 'trapezoid_free'
    },
    {
      key: 'shape_4',
      type: 'shape',
      shapeNum: '⑤',
      title: '障害物・隅欠き',
      sub: '電柱・桝のL字回避',
      img: '/assets/manual/shape_obstacle_cutout.png',
      badge: '障害物クリア機能',
      badgeBg: '#dcfce7',
      badgeColor: '#15803d',
      dimInfo: '角を幅1500mm×奥行1500mmでL字切り欠き',
      desc: '邪魔な電柱や雨水桝のある角だけを綺麗にくり抜き、本体は大容量2台用を維持！',
      siteType: 'corner_notch'
    },
    {
      key: 'feature_perspective',
      type: 'feature',
      shapeNum: '🔍',
      title: '透視モード',
      sub: '木造骨組み露出',
      img: '/assets/manual/showcase_perspective.png',
      badge: '内部・愛車・棚確認',
      badgeBg: '#fef08a',
      badgeColor: '#854d0e',
      dimInfo: '外壁半透明化 / 柱・梁・筋交い・愛車・棚板を立体透過',
      desc: '外壁を透視して、内部の木造骨組みや車のドア開閉スペース、棚の配置を見渡せます。',
      siteType: 'regular'
    },
    {
      key: 'feature_real_sky',
      type: 'feature',
      shapeNum: '🌤',
      title: '空・リアル青空',
      sub: '自然光テクスチャ',
      img: '/assets/manual/showcase_real_sky.png',
      badge: 'フォトリアル背景',
      badgeBg: '#bae6fd',
      badgeColor: '#0284c7',
      dimInfo: '上空グラデーション ⇄ 実写青空パノラマ切替',
      desc: 'AIパース生成に適した美しい空模様を設定。建築後のイメージが鮮明に湧きます。',
      siteType: 'regular'
    },
    {
      key: 'feature_soil',
      type: 'feature',
      shapeNum: '🏁',
      title: '地面・土色切替',
      sub: 'アスファルト/土',
      img: '/assets/manual/showcase_soil.png',
      badge: '現況敷地再現',
      badgeBg: '#fed7aa',
      badgeColor: '#c2410c',
      dimInfo: '土間コンクリート／砕石／舗装前の土質を選択',
      desc: '未舗装の農地・宅地やアスファルト駐車場など、ご自宅の現況に合わせて地面を変更。',
      siteType: 'regular'
    }
  ];

  // 現在のツアーステップ
  const currentIndex = tourItems.findIndex(item => item.key === activeItemKey);
  const currentItem = tourItems[currentIndex >= 0 ? currentIndex : 0];

  // 自動ループタイマー（3.8秒ごとに切り替え）
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = 50; // 50msごとにプログレス更新
    const stepTime = 3800; // 1ステップ3.8秒
    const stepIncrement = (interval / stepTime) * 100;

    const timer = setInterval(() => {
      setAutoPlayProgress(prev => {
        if (prev >= 100) {
          // 次のステップへ
          const nextIdx = (currentIndex + 1) % tourItems.length;
          setActiveItemKey(tourItems[nextIdx].key);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, currentIndex, tourItems]);

  const selectItem = (key) => {
    setActiveItemKey(key);
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
            3Dシミュレーター実機ツアー
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
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
          📐 【敷地タイプ変形】をクリックして3Dパースの変化を体験：
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          {tourItems.slice(0, 5).map((item, idx) => {
            const isActive = activeItemKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  selectItem(item.key);
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
                  transition: 'all 0.15s',
                  boxShadow: isActive ? '0 4px 10px rgba(45, 106, 79, 0.25)' : 'none'
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 800 }}>
                  {item.shapeNum}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100%' }}>
                  {item.title.split(' ')[0]}
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
      </div>

      {/* メインの3Dシミュレーター実機スクリーンショット枠 */}
      <div style={{
        position: 'relative',
        height: 290,
        borderRadius: 12,
        overflow: 'hidden',
        border: '2px solid var(--color-primary)',
        background: '#0f172a',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* 本物の3Dシミュレーター画面（高精細パース） */}
        <img 
          src={currentItem.img} 
          alt={currentItem.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.25s ease-in-out'
          }}
        />

        {/* 上部オーバーレイ：形状名 ＆ バッジ */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: '10px 12px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#f8fafc',
              fontSize: 12,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {currentItem.shapeNum} {currentItem.title}
            </span>
            <span style={{
              background: currentItem.badgeBg,
              color: currentItem.badgeColor,
              fontSize: 10.5,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 20
            }}>
              {currentItem.badge}
            </span>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#38bdf8',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 6,
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            {currentItem.dimInfo}
          </div>
        </div>

        {/* 右上インセット：真上鳥瞰図ミニマップ（敷地境界赤点線と建物適合の対比） */}
        {currentItem.siteType && (
          <div style={{
            position: 'absolute',
            top: 48,
            right: 12,
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '6px 8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 130
          }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: '#1e293b' }}>
              🗺️ 真上（敷地）から見た形
            </div>
            <svg viewBox="0 0 100 45" style={{ width: '100%', height: 36 }}>
              {/* 敷地境界（赤点線） */}
              {currentItem.siteType === 'regular' && (
                <rect x="5" y="5" width="90" height="35" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              )}
              {currentItem.siteType === 'trapezoid_left' && (
                <polygon points="5,40 5,5 95,5 75,40" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              )}
              {currentItem.siteType === 'trapezoid_right' && (
                <polygon points="25,40 5,5 95,5 95,40" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              )}
              {currentItem.siteType === 'trapezoid_free' && (
                <polygon points="5,40 25,5 95,5 75,40" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
              )}
              {currentItem.siteType === 'corner_notch' && (
                <g>
                  <rect x="5" y="5" width="90" height="35" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
                  <rect x="70" y="5" width="25" height="15" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
                </g>
              )}

              {/* 建物（緑塗りつぶし） */}
              {currentItem.siteType === 'regular' && (
                <rect x="10" y="8" width="80" height="29" fill="rgba(34, 197, 94, 0.4)" stroke="#16a34a" strokeWidth="1.5" />
              )}
              {currentItem.siteType === 'trapezoid_left' && (
                <polygon points="10,36 10,8 90,8 72,36" fill="rgba(34, 197, 94, 0.4)" stroke="#16a34a" strokeWidth="1.5" />
              )}
              {currentItem.siteType === 'trapezoid_right' && (
                <polygon points="28,36 10,8 90,8 90,36" fill="rgba(34, 197, 94, 0.4)" stroke="#16a34a" strokeWidth="1.5" />
              )}
              {currentItem.siteType === 'trapezoid_free' && (
                <polygon points="10,36 28,8 90,8 72,36" fill="rgba(34, 197, 94, 0.4)" stroke="#16a34a" strokeWidth="1.5" />
              )}
              {currentItem.siteType === 'corner_notch' && (
                <polygon points="10,36 10,8 68,8 68,20 90,20 90,36" fill="rgba(34, 197, 94, 0.4)" stroke="#16a34a" strokeWidth="1.5" />
              )}
            </svg>
            <div style={{ fontSize: 8.5, color: '#15803d', fontWeight: 700, textAlign: 'center' }}>
              敷地にジャスト追従！
            </div>
          </div>
        )}

        {/* 下部オーバーレイ：説明テキスト */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: '10px 14px',
          background: 'linear-gradient(0deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 70%, transparent 100%)',
          color: '#f8fafc',
          fontSize: 12,
          lineHeight: 1.5
        }}>
          {currentItem.desc}
        </div>
      </div>

      {/* 3Dシミュレーターならではの機能切替タブ（透視、空、地面） */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
          ✨ 【3D多機能切替】シミュレーターのリアルな表示機能：
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {tourItems.slice(5).map((item) => {
            const isActive = activeItemKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  selectItem(item.key);
                  setIsAutoPlaying(false);
                }}
                style={{
                  border: `1.5px solid ${isActive ? 'var(--color-primary)' : '#cbd5e1'}`,
                  background: isActive ? '#f0fdf4' : '#ffffff',
                  color: isActive ? 'var(--color-primary-dark)' : '#334155',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '6px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  transition: 'all 0.15s'
                }}
              >
                <span>{item.shapeNum}</span>
                <span>{item.title}</span>
              </button>
            );
          })}
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
          padding: '12px 18px',
          fontSize: 14,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
          transition: 'transform 0.15s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <Compass size={18} />
        <span>このガレージを3Dシミュレーターで自分で動かす（無料）</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
