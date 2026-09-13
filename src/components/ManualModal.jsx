import React, { useState, useEffect } from 'react';
import { 
  X, BookOpen, Layers, Maximize2, Compass, Move, Save, 
  CheckCircle2, AlertCircle, Sparkles, ZoomIn, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';

export default function ManualModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('shapes'); // 'shapes' | 'steps'
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (previewImage) {
          setPreviewImage(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, previewImage]);

  if (!isOpen) return null;

  // 建物形状・敷地タイプの詳細データ
  const siteShapeGuides = [
    {
      id: 'regular',
      title: '1. 長方形 (四角形) 〜標準的な四角い敷地〜',
      badge: '標準基本タイプ',
      badgeBg: '#e2e8f0',
      badgeColor: '#334155',
      img: '/assets/manual/shape_regular.png',
      caption: '長方形モード：正面幅・左奥行を入力すると四隅がすべて90°の直角に固定されます',
      features: [
        {
          label: 'どこを操作するか（操作方法）',
          text: '左パネル「4辺寸法」タブ内の【⬛ 長方形 (四角形)】ボタンをクリックします。「正面幅」または「左奥行」の入力欄にミリ単位で数字を入力（またはスライダーで調整）します。'
        },
        {
          label: 'どこが変わるか（画面・寸法の変化）',
          text: '「正面幅」を変更すると「背面幅」も自動的に同じ数値に同期ロックされます。「左奥行」を変更すると「右奥行」も自動的に同じ数値に同期します。3Dビューでは四隅の柱がすべて90°（直角）の綺麗な四角形として立ち上がります。'
        },
        {
          label: 'プロの活用アドバイス',
          text: '一般的な正方形・長方形の敷地や、分譲地の区画にぴったりです。まずはこの形状で作り、後から敷地に合わせて斜めタイプに切り替えることも可能です。'
        }
      ]
    },
    {
      id: 'trapezoid_left',
      title: '2. 片側直角 (左直角) 〜左境界が直角、右境界が斜めの敷地〜',
      badge: '道路・隣地斜め対応',
      badgeBg: '#e0f2fe',
      badgeColor: '#0369a1',
      img: '/assets/manual/shape_trapezoid_left.png',
      caption: '左直角モード：左壁を90°に保ち、右壁の開き角度（75°〜110°）をスライダーで自由に設定',
      features: [
        {
          label: 'どこを操作するか（操作方法）',
          text: '【📐 片側直角 (左直角)】ボタンをクリックします。現れる「📐 右壁の開き角度を設定」スライダーを左右に動かすか、下のプリセットボタン（75°, 85°, 90°, 100°, 105°, 110°）をワンタップします。'
        },
        {
          label: 'どこが変わるか（画面・寸法の変化）',
          text: '左壁は直角（90°）を保ったまま、右壁だけが指定した角度に斜めに傾斜します。角度を変えると「背面幅」がミリ単位で自動計算され、画面上の3Dモデル右側が扇状に美しく広がります（または先細りになります）。難しい三角関数の計算は一切不要です！'
        },
        {
          label: 'プロの活用アドバイス',
          text: '「左側はお隣のブロック塀に沿ってまっすぐ建てたいが、右側は斜めの道路や境界線に沿ってギリギリまで広く建てたい！」という敷地に最適です。デッドスペースをゼロにできます。'
        }
      ]
    },
    {
      id: 'trapezoid_right',
      title: '3. 片側直角 (右直角) 〜右境界が直角、左境界が斜めの敷地〜',
      badge: '道路・隣地斜め対応',
      badgeBg: '#e0f2fe',
      badgeColor: '#0369a1',
      img: '/assets/manual/shape_trapezoid_right.png',
      caption: '右直角モード：右壁を90°に保ち、左壁の開き角度をスライダーやプリセットで直感調整',
      features: [
        {
          label: 'どこを操作するか（操作方法）',
          text: '【📐 片側直角 (右直角)】ボタンをクリックします。現れる「📐 左壁の開き角度を設定」スライダーまたは角度ボタン（75°〜110°）を操作します。'
        },
        {
          label: 'どこが変わるか（画面・寸法の変化）',
          text: '右壁が隣地に沿って90°に固定され、左壁の開き角度がリアルタイムに変化します。左壁が開くにつれて背面幅がミリ単位で自動連動し、左奥の柱位置が斜め外側に張り出します。'
        },
        {
          label: 'プロの活用アドバイス',
          text: '敷地の右側が通路や直角境界で、左側が斜行している場合に威力を発揮します。車を斜めに駐車するアプローチや、敷地角の有効利用に絶大な効果があります。'
        }
      ]
    },
    {
      id: 'trapezoid_free',
      title: '4. 自由台形・偏芯 〜左右両方が斜め・平行四辺形・変形地〜',
      badge: 'ツールの真骨頂・完全自由設計',
      badgeBg: '#fef3c7',
      badgeColor: '#b45309',
      img: '/assets/manual/shape_trapezoid_free.png',
      caption: '自由台形・偏芯モード：背面の左右ズレスライダー（±1500mm）と4辺ミリ個別入力の組み合わせ',
      features: [
        {
          label: 'どこを操作するか（操作方法）',
          text: '【▱ 自由台形・偏芯】ボタンをクリックします。「▱ 背面の左右ズレ (偏芯・斜行)」スライダー（-1500mm〜+1500mm）をドラッグして左右に振るか、下部の「正面幅」「背面幅」「左奥行」「右奥行」の各入力欄に直接数値を打ち込みます。'
        },
        {
          label: 'どこが変わるか（画面・寸法の変化）',
          text: 'スライダーを右に動かすと、背面の壁全体が右へスライドし「右に傾いた平行四辺形・菱形」に変化します。左に動かせば「左に傾いた斜行形状」になります。「中央リセット」を押すといつでも左右対称に戻ります。左右どちらの角度も自由自在に変化します。'
        },
        {
          label: 'プロの活用アドバイス',
          text: '大手既製ガレージメーカーが「施工不可能」とお断りする変形地・菱形敷地・旗竿地でも、土地の境界線に合わせてミリ単位の限界まで建てられます。靴ひも公式により、どんな変形地でも正確な床面積・概算費用が瞬時に算出されます！'
        }
      ]
    },
    {
      id: 'corner_notch',
      title: '5. 敷地の障害物・隅欠き（凸凹回避） 〜電柱・擁壁・雨水桝をよける〜',
      badge: '敷地障害物クリア機能',
      badgeBg: '#dcfce7',
      badgeColor: '#15803d',
      img: '/assets/manual/shape_obstacle_cutout.png',
      caption: '隅欠き機能：敷地角にある電柱や雨水桝、隣地ブロック壁をL字型に美しく回避して建築',
      features: [
        {
          label: 'どこを操作するか（操作方法）',
          text: '左パネル下部の【☑ 敷地の障害物・隅欠き（凸凹回避）】チェックボックスをONにします。障害物のある角位置（「右奥」「左奥」「右手前」「左手前」）を選択し、「欠き取り幅」「欠き取り奥行」にミリ数値を入力します。'
        },
        {
          label: 'どこが変わるか（画面・寸法の変化）',
          text: '指定したコーナー部分の外壁・土台・基礎コンクリートがL字型に凹んで切り欠かれます！3Dモデルにもリアルタイムに欠き込みが反映され、立面図・平面図にも正確な切り欠き製図が自動生成されます。'
        },
        {
          label: 'プロの活用アドバイス',
          text: '「敷地の隅に電柱や支線があってガレージが入らない」「水道メーター桝や雨水浸透桝を埋められない」という現場で大活躍します。邪魔な角だけを避けて、最大限大きなガレージを実現できます。'
        }
      ]
    }
  ];

  // 通常操作ステップ
  const steps = [
    {
      step: 'STEP 1',
      title: '外形・4辺柱芯寸法の入力と敷地形状選択',
      icon: Maximize2,
      img: '/assets/steps/step1.png',
      desc: '敷地に合わせて「正面幅」「背面幅」「左奥行」「右奥行」をミリ単位で入力。四辺の数値を自在に変えることで、台形や斜め敷地にも正確に追従します。外壁ふかし（+100mm）や内装仕上ライン（+65mm）は自動計算されます。',
      points: [
        '正面幅を基準ラインとして四隅の柱芯座標を自動算出します。',
        '変形地でも靴ひも公式により、正確な床面積・坪数がリアルタイムに自動計算されます。'
      ]
    },
    {
      step: 'STEP 2',
      title: '開口部・シャッター・サッシの配置と開閉操作',
      icon: Layers,
      img: '/assets/steps/step2.png',
      desc: '大型電動シャッター、片引き戸、框ドア、引き違い窓、FIX窓を配置する壁面を選んで追加します。',
      points: [
        '逃げ100mmルール：左右の柱芯から100mm未満の配置は施工NG警告が表示され、安全な設計をサポート。',
        'シャッター内付け納まり：室内側100mmセットバック。GL+300mm基礎立ち上がりの凹みも自動表現。',
        'シャッタースラットには細いグレーの横線リブが等間隔で表現され、リアルな立体感を体感できます。'
      ]
    },
    {
      step: 'STEP 3',
      title: '内部棚・収納ユニットの設置 ＆「透視モード」',
      icon: Move,
      img: '/assets/steps/step3.png',
      desc: '選択した壁の内法有効最大寸法ガイドを見ながら、棚幅・出幅（奥行）を設定。各段ごとの棚板天端高さを自由に指定できます。',
      points: [
        '「透視モード」をONにすると、外壁が半透明になり、柱梁の架構や内部収納の広がりを外から見渡せます。',
        'スパン2000mm以内で自動等分立柱され、実際の木造施工に即した部材構成を忠実に再現。'
      ]
    },
    {
      step: 'STEP 4',
      title: '愛車（SUV・乗用車・バイク）の配置とクリアランス確認',
      icon: Compass,
      img: '/assets/steps/step4.png',
      desc: 'ガレージ内に実寸大のSUVや乗用車、バイクを配置し、車の乗り降りスペースや荷物の出し入れ動線を立体確認できます。',
      points: [
        '車のボディカラー変更や、室内・屋外への配置移動が可能。',
        '車を置いた状態でシャッターの開閉や内部棚の干渉がないかを視覚的にチェックできます。'
      ]
    },
    {
      step: 'STEP 5',
      title: 'ワンタップでAIパース作成を依頼（完全無料・登録不要）',
      icon: Sparkles,
      img: '/assets/steps/step5.png',
      desc: 'シミュレーターでモデリングしたデータをもとに、「パース依頼 (無料)」を行うと、専任スタッフが社内PC（Stable Diffusion）を用いて本物の写真のようなフォトリアルパースを作成します。',
      points: [
        '面倒な会員登録やパスワード設定は一切不要！お名前とメール・電話番号だけで即座に依頼可能。',
        '現在設計中の3Dモデル形状（寸法・開口部・屋根勾配など）が自動的に添付されて専任スタッフへ送信されます。'
      ]
    },
    {
      step: 'STEP 6',
      title: '専用チャットルームに超美麗フォトリアルパースが届く！',
      icon: Sparkles,
      img: '/assets/steps/step6.jpg',
      isPerspectiveStep: true,
      desc: '専任スタッフが3Dモデルをベースに生成した、光や影、ガルバリウム鋼板の質感、愛車の映り込みまで忠実なフォトリアルパースがチャットに届きます。',
      points: [
        '正面シャッターや側面サッシ窓、基礎立ち上がりなど、あなたが作成したモデル形状を忠実に反映。',
        '外壁・屋根はスタイリッシュなブラックガルバリウム鋼板角波仕上げ、軒の出0のシャープなデザインを再現。',
        '完成パースは専用チャットルームや「重要ドキュメントスロット」から高解像度ダウンロードが可能です。'
      ]
    },
    {
      step: 'STEP 7',
      title: '2D図面（平面・立面4面）の自動製図と概算見積もり',
      icon: BookOpen,
      img: '/assets/manual/manual_elevation.png',
      desc: '画面上部タブで「平面図」「正立面図」「裏立面図」「左側立面図」「右側立面図」を瞬時に切り替え可能。仮想ミリキャンバス（SVG）により引出線付きで正確な寸法が自動描画されます。',
      points: [
        '「見積書(7大枠)」ボタンで、基礎工事・躯体工事・外壁屋根・建具・電気等の詳細概算見積書を即座に確認。',
        '「表示中の画面を画像保存」で、手元の検討用PNG画像をいつでも高画質で書き出せます。'
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
      backgroundColor: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
      boxSizing: 'border-box'
    }} onClick={onClose}>
      <div 
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: 960,
          maxHeight: '94vh',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(45, 106, 79, 0.3)'
            }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, color: '#0f172a', margin: 0, fontWeight: 800 }}>
                3Dシミュレーター 公式操作マニュアル
              </h2>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                敷地に合わせた変形自由設計から2D図面製図・見積積算・AIパース作成までの完全ガイド
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
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            title="閉じる (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* タブナビゲーション */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f1f5f9',
          padding: '0 16px'
        }}>
          <button
            onClick={() => setActiveTab('shapes')}
            style={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 800,
              border: 'none',
              background: activeTab === 'shapes' ? '#ffffff' : 'transparent',
              color: activeTab === 'shapes' ? 'var(--color-primary-dark)' : '#64748b',
              borderBottom: activeTab === 'shapes' ? '3px solid var(--color-primary)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: 16 }}>📐</span>
            <span>【ツールの極み】建物形状・敷地タイプ設定（変形地・台形対応）</span>
            <span style={{
              background: '#e11d48',
              color: '#fff',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 10,
              fontWeight: 700
            }}>
              必見
            </span>
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            style={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 800,
              border: 'none',
              background: activeTab === 'steps' ? '#ffffff' : 'transparent',
              color: activeTab === 'steps' ? 'var(--color-primary-dark)' : '#64748b',
              borderBottom: activeTab === 'steps' ? '3px solid var(--color-primary)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: 16 }}>📋</span>
            <span>基本操作ステップ（STEP 1 〜 STEP 7）</span>
          </button>
        </div>

        {/* モーダル本文（スクロール可能） */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          flex: 1
        }}>

          {/* =========================================================
              TAB 1: 建物形状・敷地タイプ設定（ツールの極み）
             ========================================================= */}
          {activeTab === 'shapes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* 特集イントロバナー */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(45, 106, 79, 0.08), rgba(82, 183, 136, 0.15))',
                border: '1px solid rgba(45, 106, 79, 0.25)',
                borderRadius: 12,
                padding: '18px 22px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start'
              }}>
                <div style={{
                  fontSize: 32,
                  lineHeight: 1,
                  padding: '8px',
                  background: '#ffffff',
                  borderRadius: 10,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}>
                  👑
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--color-primary-dark)', fontWeight: 800 }}>
                    大手メーカー規格品では真似できない「このツールの真骨頂」
                  </h3>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.7 }}>
                    一般的な大手規格ガレージは「直角の四角形」しか作れないため、境界線が斜めの敷地では大きなデッドスペース（無駄な隙間）が生まれてしまいます。<br />
                    スマイチの3Dシミュレーターなら、<strong>「左直角」「右直角」「自由台形・偏芯」「障害物の切り欠き」</strong>を選ぶだけで、
                    スライダー1つでミリ単位・1度単位で敷地の境界線ギリギリまでぴったり沿わせることができます。素人の方でも直感的に使える仕組みを詳しく解説します。
                  </p>
                </div>
              </div>

              {/* 各敷地タイプの詳細カード一覧 */}
              {siteShapeGuides.map((guide, gIdx) => (
                <div 
                  key={guide.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* カードヘッダー */}
                  <div style={{
                    padding: '14px 20px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        background: 'var(--color-primary)',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 6
                      }}>
                        TYPE {gIdx + 1}
                      </span>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                        {guide.title}
                      </h4>
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: guide.badgeBg,
                      color: guide.badgeColor,
                      padding: '4px 10px',
                      borderRadius: 20
                    }}>
                      {guide.badge}
                    </span>
                  </div>

                  {/* カード本体：スクショ ＋ 詳細解説 */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* スクリーンショットプレビュー枠 */}
                    <div 
                      style={{
                        position: 'relative',
                        borderRadius: 10,
                        overflow: 'hidden',
                        border: '1px solid #cbd5e1',
                        background: '#0f172a',
                        cursor: 'zoom-in'
                      }}
                      onClick={() => setPreviewImage(guide.img)}
                      title="クリックで高解像度拡大表示"
                    >
                      <img 
                        src={guide.img} 
                        alt={guide.title}
                        style={{
                          width: '100%',
                          maxHeight: 340,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      {/* キャプション ＆ 拡大バッジ */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.9) 70%)',
                        padding: '16px 14px 10px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box'
                      }}>
                        <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>
                          📸 {guide.caption}
                        </span>
                        <span style={{
                          background: 'rgba(30, 41, 59, 0.9)',
                          color: '#60a5fa',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          <ZoomIn size={12} />
                          <span>クリックで拡大</span>
                        </span>
                      </div>
                    </div>

                    {/* 3段階の丁寧な解説ボックス */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {guide.features.map((feat, fIdx) => (
                        <div 
                          key={fIdx}
                          style={{
                            background: fIdx === 0 ? '#f8fafc' : fIdx === 1 ? '#f0fdf4' : '#fffbeb',
                            border: `1px solid ${fIdx === 0 ? '#e2e8f0' : fIdx === 1 ? '#bbf7d0' : '#fde68a'}`,
                            borderRadius: 8,
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4
                          }}
                        >
                          <div style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: fIdx === 0 ? '#1e293b' : fIdx === 1 ? '#15803d' : '#92400e',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}>
                            <span>{fIdx === 0 ? '👉' : fIdx === 1 ? '✨' : '💡'}</span>
                            <span>{feat.label}</span>
                          </div>
                          <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.65 }}>
                            {feat.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================================================
              TAB 2: 基本操作ステップ（STEP 1〜7）
             ========================================================= */}
          {activeTab === 'steps' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}>
                    {/* ステップ見出し */}
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
                      <h3 style={{ fontSize: 16, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8, margin: 0, fontWeight: 800 }}>
                        <Icon size={18} color="var(--color-primary)" />
                        {item.title}
                      </h3>
                    </div>

                    <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: 0 }}>
                      {item.desc}
                    </p>

                    {/* 実際の操作画面スクリーンショット */}
                    <div 
                      style={{
                        position: 'relative',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #cbd5e1',
                        background: '#0f172a',
                        cursor: 'zoom-in'
                      }}
                      onClick={() => setPreviewImage(item.img)}
                      title="クリックで高解像度拡大表示"
                    >
                      <img 
                        src={item.img} 
                        alt={item.title}
                        style={{
                          width: '100%',
                          maxHeight: 280,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#60a5fa',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <ZoomIn size={12} />
                        <span>クリックで拡大</span>
                      </div>
                    </div>

                    {/* ポイント ＆ 施工ルール */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #edf2f7',
                      borderRadius: 8,
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6
                    }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--color-wood-dark)' }}>
                        📌 設計・操作の重要ポイント
                      </div>
                      {item.points.map((pt, pIdx) => (
                        <div key={pIdx} style={{ fontSize: 12.5, color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5 }}>
                          <CheckCircle2 size={15} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* モーダルフッター */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            ※ ご不明な形状や敷地の割り付けは、3D作成後に「パース依頼 (無料)」またはチャットから専任スタッフへお気軽にご相談ください。
          </div>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '8px 24px', fontSize: 14 }}
          >
            閉じる
          </button>
        </div>
      </div>

      {/* =========================================================
          マニュアル内画像 拡大ライトボックスモーダル
         ========================================================= */}
      {previewImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            boxSizing: 'border-box',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '92vh',
              background: '#020617',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '10px 16px',
              background: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 700 }}>
                🔍 操作画面 高解像度プレビュー
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={previewImage} 
                alt="拡大プレビュー" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: 6
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
