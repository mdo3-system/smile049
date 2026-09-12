import React, { useEffect } from 'react';
import { X, BookOpen, Layers, Maximize2, Compass, Move, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ManualModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      step: 'STEP 1',
      title: '外形・柱芯寸法の入力（台形・変形地対応）',
      icon: Maximize2,
      desc: '敷地に合わせて「正面幅」「背面幅」「左奥行」「右奥行」をミリ単位で入力します。前後左右の寸法を変えることで、台形や斜め敷地にも正確に追従します。外壁ふかし（+100mm）や内装仕上ライン（+65mm）は自動計算されます。',
      points: [
        '正面幅を基準ラインとして四隅の柱芯座標を自動算出します。',
        '変形地でも靴ひも公式により、床面積・坪数がリアルタイムに算出されます。'
      ]
    },
    {
      step: 'STEP 2',
      title: '屋根勾配・水流し方向・天井仕様の選択',
      icon: Compass,
      desc: '水流し方向を「後へ流す」「前へ流す」「右へ流す」「左へ流す」の4方向から選択。屋根勾配（1.0〜10.0寸）に応じ、水上側の桁天端高さがミリ単位で立ち上がります。',
      points: [
        '小屋組み現し（標準仕様）：梁ラインと屋根勾配を開放し、大空間とロフト感を演出。',
        'フラット天井：水下桁天端より -320mm 位置にPB天井面を生成。',
        '勾配天井：桁天端から屋根なりの斜め天井を生成します。'
      ]
    },
    {
      step: 'STEP 3',
      title: '開口部・シャッターの配置と開閉操作',
      icon: Layers,
      desc: '大型シャッター、片引き戸、框ドア、引き違い窓、FIX窓を配置する壁面を選んで追加します。',
      points: [
        '逃げ100mmルール：左右の柱芯から100mm未満の配置は施工NG警告が表示されます。',
        'シャッター内付け納まり：室内側100mmセットバック。GL+300mm基礎立ち上がりの凹みも自動表現。',
        '開閉率スライダー：シャッターの巻き上げや窓の引き違いを3D上でリアルタイムに動かせます。'
      ]
    },
    {
      step: 'STEP 4',
      title: '内部棚・間仕切りユニットの設置',
      icon: Move,
      desc: '選択した壁の内法有効最大寸法ガイドを見ながら、棚幅・出幅（奥行）を設定。各段ごとの棚板天端高さを自由に指定できます。',
      points: [
        '出幅 D ≦ 600mm は壁厚60mm、D > 600mm は壁厚90mm、棚板厚30mmを自動選定。',
        'スパン2000mm以内で自動等分立柱され、実際の木造施工に即した部材構成を再現。'
      ]
    },
    {
      step: 'STEP 5',
      title: '2D図面（平面・立面4面）の確認と画像出力',
      icon: BookOpen,
      desc: '画面上部タブで「3Dパース」「平面図」「正立面図」「裏立面図」「左側立面図」「右側立面図」を瞬時に切り替え可能。仮想ミリキャンバス（SVG）により引出線付きで正確な寸法が自動描画されます。',
      points: [
        '図面縮尺（50%〜200%）と寸法文字サイズ（0.6x〜2.5x）をスライダーで自由調整。',
        '「表示中の画面を画像保存」で、AIフォトリアルパース生成（ArchiX / Stable Diffusion）連携用PNGを書き出せます。'
      ]
    },
    {
      step: 'STEP 6',
      title: 'プロジェクトの保存と読込（JSON）',
      icon: Save,
      desc: '作成中の建物寸法、屋根・天井設定、開口部、棚、車両配置データをJSON形式でPCに保存できます。',
      points: [
        '「設定を保存」でいつでもバックアップをローカル保存。',
        '「設定を読み込む」で過去の検討データを瞬時に復元・再編集できます。',
        '建築士へのオンライン相談時にも、このJSONデータをもとにスムーズなお打合せが可能です。'
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }} onClick={onClose}>
      <div 
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--color-primary-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, color: '#0f172a', margin: 0 }}>
                3Dシミュレーター 操作マニュアル
              </h2>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                敷地に合わせた設計から2D図面・積算・パース出力までの使い方ガイド
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              padding: 8,
              borderRadius: 8,
              color: '#64748b',
              background: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            title="閉じる (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* モーダル本文（スクロール可能） */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 28
        }}>
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#ffffff',
                    background: 'var(--color-primary)',
                    padding: '3px 10px',
                    borderRadius: 20
                  }}>
                    {item.step}
                  </span>
                  <h3 style={{ fontSize: 16, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={18} color="var(--color-primary)" />
                    {item.title}
                  </h3>
                </div>

                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  {item.desc}
                </p>

                {/* 将来画像差し替え用プレースホルダー枠 */}
                <div className="manual-img-placeholder" style={{
                  width: '100%',
                  height: 140,
                  backgroundColor: '#edf2f7',
                  border: '2px dashed #cbd5e1',
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  color: '#94a3b8',
                  fontSize: 12
                }}>
                  <Icon size={24} opacity={0.5} />
                  <span>【操作画面イメージ枠：{item.step}】</span>
                  <small style={{ fontSize: 10, color: '#a0aec0' }}>※将来的な操作画面スクリーンショット差し替え用コンテナ</small>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #edf2f7',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-wood)' }}>
                    ポイント ＆ 施工ルール
                  </div>
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <CheckCircle2 size={14} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* モーダルフッター */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '8px 24px', fontSize: 14 }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
