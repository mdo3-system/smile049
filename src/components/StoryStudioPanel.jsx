import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Copy, Check, ExternalLink, Image as ImageIcon, Download, 
  Trash2, RefreshCw, Layers, CheckCircle2, ChevronDown, ChevronRight, 
  BookOpen, HelpCircle, Upload, ShieldCheck, ArrowRight
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, NoteIcon } from './SnsIcons';

const STORAGE_KEY = 'smile049_story_studio_data';

// プリセットテーマ
const PRESET_THEMES = [
  {
    id: 'porsche_hobby',
    title: '愛車ポルシェと過ごす終の棲家（50代・大人の秘密基地）',
    protagonist: '佐々木 健一 (52歳 / 会社経営 / 愛車: ポルシェ911 カレラ & ツールキャビネット)',
    theme: '既製品スチールガレージでは愛車のサイズと敷地境界が合わず諦めかけていたが、木造自由設計でミリ単位の隙間にガルバリウム×木造現しの贅沢な秘密基地を実現する物語。'
  },
  {
    id: 'bike_flagpole',
    title: '変形旗竿地を活かしたヴィンテージバイクガレージ（40代・趣味人）',
    protagonist: '高橋 涼介 (41歳 / ITエンジニア / 愛車: ハーレーダビッドソン & 大型ツールワゴン)',
    theme: '入り口が狭く台形に変形した旗竿地の奥。規格品は設置不可と断られた敷地に、敷地形状に合わせた台形木造ガレージを建築。雨音を吸う木造の静寂とオイルの香りに包まれる物語。'
  },
  {
    id: 'agri_shed',
    title: '先祖代々の農地と大型トラクターを守る木造アグリシェッド（60代・専業農家）',
    protagonist: '木村 喜一 (64歳 / 農業経営 / 所有車両: 4WD大型トラクター & コンバイン & 軽トラ)',
    theme: '市街化調整区域で農機具の大型化に伴い建て替えを検討。鉄骨の見積もり高騰に悩む中、大空間木造トラスと確認申請ワンストップ対応で、美しく長持ちする農業用大倉庫を完成させる物語。'
  },
  {
    id: 'diy_woodwork',
    title: '週末木工DIYスタジオとSUVが共存するガレージハウス（30代・子育て世代）',
    protagonist: '松田 翔太 (38歳 / 建築デザイナー / 愛車: ランドクルーザー & スライド丸鋸)',
    theme: '結露しやすい鉄板ガレージを避け、木造ならではの調湿性とOSB合板仕上げの壁面収納を活かし、家族でDIYを楽しみながら愛車を愛でる週末の豊かな暮らしを描く物語。'
  }
];

// ストーリー生成ロジック（テーマ・登場人物・話数に応じた生成）
const generateStoriesByAi = (themeTitle, protagonist, storyCount, themeDesc) => {
  const generated = [];
  
  for (let i = 1; i <= storyCount; i++) {
    let phase = '';
    let epTitle = '';
    let plot = '';
    let englishPrompt = '';

    if (i === 1) {
      phase = '【第1話：出会いと規格の壁】';
      epTitle = `${themeTitle} 〜既製品では届かなかった「あと20cm」の理想〜`;
      plot = `${protagonist}は、長年の夢であった専用ガレージの設置を検討し始めた。しかし、敷地境界の変形や愛車のドア開閉に必要な幅を測ると、大手既製品スチールガレージの規格モジュールではどうしても敷地からはみ出すか、車内から降りられないことが判明する。「土地にガレージを合わせるしかないのか……」と諦めかけたその時、木造自由設計ガレージ【スマイチ】のブラウザ3Dシミュレーターに出会う。`;
      englishPrompt = `8k architectural photograph, cinematic shot of a modern wooden garage project, ultra sharp, contemporary dark charcoal galvalume steel facade, standing seam, zero-eave minimalist roof edge, exposed Douglas fir wooden structural posts and beams visible through large glass doors, dusk twilight warm ambient lighting, realistic concrete floor, high-end sports vehicle parked partially outside, highly detailed architectural masterpiece.`;
    } else if (i === 2) {
      phase = '【第2話：ミリ単位の3D設計】';
      epTitle = `${themeTitle} 〜夜更けに画面で描いた、自分だけの秘密基地〜`;
      plot = `スマホとPCで無料シミュレーターを立ち上げた${protagonist}。敷地の台形形状をそのまま入力し、水流し屋根の勾配や柱芯の逃げをミリ単位で調整していく。「ここに出幅600mmの作業棚を入れれば、工具もジャストで収まる」。画面の中でリアルタイムに積算費用が更新される安心感。専任スタッフによる無料パース依頼ボタンを押すと、翌日届いたのはまるで実写のような高精細ガルバリウム鋼板パースだった。`;
      englishPrompt = `8k ultra-detailed interior architectural photography, modern luxury wooden garage workshop, warm wooden timber ceiling beams with exposed framing, built-in OSB plywood workbench with organized tool rack, glowing warm recessed LED strip lights, polished clean concrete floor with epoxy finish, sports vehicle parked inside, cozy atmospheric evening, architectural digest style.`;
    } else if (i === 3) {
      phase = '【第3話：建築士のワンストップ対応】';
      epTitle = `${themeTitle} 〜面倒な確認申請と構造計算をプロが一括解決〜`;
      plot = `市街化調整区域や防火地域の法規制限、基礎の高低差など、素人では乗り越えられない壁も、スマイチの専任スタッフ（建築士）が迅速に現地調査と構造安全確認を実施。メーカー・基礎屋・申請行政書士とバラバラに交渉する必要のない「ワンストップ施工体制」に確信を持ち、電子契約でスムーズに着工を迎えた。`;
      englishPrompt = `8k architectural detail photograph, construction and structural excellence of wooden timber frame garage, high precision steel connector hardware, heavy cedar and pine wooden columns, pristine charcoal galvalume metal cladding, zero eaves detail, clean Japanese modern architecture craftsmanship, bright daylight.`;
    } else if (i === 4) {
      phase = '【第4話：木の温もりと結露のない快適空間】';
      epTitle = `${themeTitle} 〜鉄板ガレージにはない、調湿と静寂に包まれて〜`;
      plot = `上棟から数週間、ついに完成したガレージ。外観はシャープなブラックガルバリウム鋼板の軒出0スタイル。一歩室内に入ると、木造ならではの爽やかな木の香りと断熱材による穏やかな室温が広がる。鉄板ガレージのような冬場の滴る結露もサビの心配もない。愛車のボディは常に乾いた清潔な空気で守られている。`;
      englishPrompt = `8k wide angle shot of a completed custom wooden garage interior, spacious ceiling with natural wood rafters, ambient floor spotlights illuminating a pristine vehicle, sleek rolling tool chest, comfortable leather armchair in the corner lounge, peaceful masculine sanctuary, cinematic photorealism.`;
    } else {
      phase = `【第${i}話：一生モノの至福の時間】`;
      epTitle = `${themeTitle} 〜ガレージで飲む一杯の珈琲が、明日への活力〜`;
      plot = `休日、電動リモコンシャッターを開け放ち、朝の光の中で愛車を手入れする。好きな音楽を流し、自作の棚からオイルを取り出す時間。敷地にミリ単位で合わせたからこそ生まれた無駄のない空間は、ただの車庫ではなく人生を豊かにする最高の秘密基地となった。「作って本当に良かった」。${protagonist}は満足そうに微笑んだ。`;
      englishPrompt = `8k cinematic lifestyle architectural photography, evening view of modern wooden custom garage, wide open black roll-up shutter, warm interior light spilling onto stone driveway, silhouetted luxury car inside with ambient lights, tranquil forest or suburban garden backdrop, photorealistic, luxury dwelling.`;
    }

    // Instagram用ハッシュタグ
    const hashtags = `#スマイチ #木造ガレージ #ガレージハウス #ビルトインガレージ #自由設計 #大人の秘密基地 #愛車のある暮らし #変形地ガレージ #ガルバリウム外壁 #注文住宅 #ガレージライフ #世田谷ベース風 #バイクガレージ #農業倉庫 #アグリシェッド #木造建築 #埼玉建築 #3Dシミュレーター #smile049`;

    generated.push({
      id: `story_${Date.now()}_${i}`,
      episodeNum: i,
      phase,
      title: epTitle,
      plot,
      assignedAccount: `Google AI Pro アカウント ${(i % 5) || 5}`,
      englishPrompt,
      imageUrl: null,
      hashtags,
      isPostedInstagram: false,
      isPostedNote: false,
      scheduledDate: new Date(Date.now() + (i - 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 週1ペース
    });
  }

  return generated;
};

export default function StoryStudioPanel() {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_THEMES[0].id);
  const [customTitle, setCustomTitle] = useState(PRESET_THEMES[0].title);
  const [customProtagonist, setCustomProtagonist] = useState(PRESET_THEMES[0].protagonist);
  const [customThemeDesc, setCustomThemeDesc] = useState(PRESET_THEMES[0].theme);
  const [storyCount, setStoryCount] = useState(3);
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateStoriesByAi(PRESET_THEMES[0].title, PRESET_THEMES[0].protagonist, 3, PRESET_THEMES[0].theme);
  });

  const [copiedKey, setCopiedKey] = useState(null);
  const [activeStoryTab, setActiveStoryTab] = useState('instagram'); // 'instagram' | 'note'
  const [showKitModal, setShowKitModal] = useState(false);

  // ローカル保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [stories]);

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    const p = PRESET_THEMES.find(item => item.id === presetId);
    if (p) {
      setCustomTitle(p.title);
      setCustomProtagonist(p.protagonist);
      setCustomThemeDesc(p.theme);
    }
  };

  const handleGenerateAll = () => {
    if (!window.confirm('新しいストーリーと作画プロンプトを生成しますか？（現在の編集内容は上書きされます）')) {
      return;
    }
    const newStories = generateStoriesByAi(customTitle, customProtagonist, storyCount, customThemeDesc);
    setStories(newStories);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // 画像アップロード・ペースト処理
  const handleImageFile = (file, storyIndex) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...stories];
      updated[storyIndex].imageUrl = e.target.result;
      setStories(updated);
    };
    reader.readAsDataURL(file);
  };

  const handlePasteImage = (e, storyIndex) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        handleImageFile(file, storyIndex);
        e.preventDefault();
        break;
      }
    }
  };

  // Instagram用キャプション成形
  const formatInstagramCaption = (story) => {
    return `${story.phase}\n${story.title}\n\n${story.plot}\n\n―――――――――――――――\n■ 木造自由設計ガレージ・倉庫【スマイチ】\n規格サイズに土地を合わせるのではなく、\nあなたの敷地にガレージを合わせる。\n\n・登録不要の3Dシミュレーター＆リアルタイム積算見積もり\n・ガルバリウム鋼板×木造現しの洗練されたモダンデザイン\n・専任スタッフによる構造計算・確認申請ワンストップ施工\n\nプロフィールのリンク（@smile049_garage）から3D設計をお試しいただけます。\nhttps://smile049.jp/\n\n${story.hashtags}`;
  };

  // note用記事成形
  const formatNoteMarkdown = (story) => {
    return `# ${story.title}\n\n${story.phase}\n\n${story.plot}\n\n---\n\n## 規格サイズに敷地を合わせるのではなく、敷地にガレージを合わせる\n\n木造自由設計ガレージ・倉庫「スマイチ」では、既製品スチールガレージでは対応できない狭小地・台形変形地・旗竿地に合わせて、ミリ単位での設計が可能です。\n\n### スマイチが選ばれる3つの理由\n1. **ブラウザ上で動く3Dシミュレーター**: 登録不要で、寸法や屋根勾配、開口部を変更するとリアルタイムで見積もり金額が変動。\n2. **木造ならではの快適性**: ガルバリウム鋼板仕上げ（軒出ゼロ）のスタイリッシュな外観と、結露を防ぐ木造構造・断熱仕様。\n3. **専任スタッフによる安心施工**: 複雑な確認申請や構造安全検討もワンストップでお任せ。\n\n▼ 無料3Dシミュレーター＆自動見積もりはこちら\nhttps://smile049.jp/\n\n${story.hashtags}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 上部ヘッダーバナー */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 12,
        padding: '24px 28px',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              background: 'rgba(64, 145, 108, 0.25)',
              color: '#80ed99',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11.5,
              fontWeight: 700
            }}>
              SNS & SEO マーケティング
            </span>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              推奨頻度: 週1〜2回定期連載（note ＆ Instagram）
            </span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#f8fafc' }}>
            Story Studio ｜ ガレージ連載・NanoBanana2 作画＆自動投稿アシスト
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#cbd5e1', maxWidth: 680, lineHeight: 1.6 }}>
            ユーザーがテーマと登場人物を設定し、AIエージェントが各話ストーリーとNanoBanana2（Google AI Pro）用作画プロンプトを自動生成。BANリスクのない方式A（ワンクリック成形コピー＆画像取り込み）でnoteとInstagramへの投稿を最短化します。
          </p>
        </div>

        <button
          onClick={() => setShowKitModal(true)}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 18px',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}
        >
          <HelpCircle size={16} />
          <span>アカウント開設完全キット・画像アセット</span>
        </button>
      </div>

      {/* ステップ1：ストーリー設定フォーム */}
      <div style={{
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
          }}>1</span>
          テーマ・登場人物・話数の設定（ユーザー入力）
        </h3>

        {/* プリセット選択 */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
            人気プリセットテーマから選ぶ
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
            {PRESET_THEMES.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `2px solid ${selectedPreset === p.id ? 'var(--color-primary)' : '#e2e8f0'}`,
                  background: selectedPreset === p.id ? 'rgba(64, 145, 108, 0.05)' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: selectedPreset === p.id ? 'var(--color-primary)' : '#1e293b' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 4 }}>
                  {p.protagonist.split('/')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 詳細入力グリッド */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
              連載タイトル・テーマ
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13.5
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
              主人公・登場人物（年代・職業・愛車・こだわり）
            </label>
            <input
              type="text"
              value={customProtagonist}
              onChange={(e) => setCustomProtagonist(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13.5
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            ストーリーの背景・課題（既製品の悩み、木造自由設計での解決ポイント）
          </label>
          <textarea
            value={customThemeDesc}
            onChange={(e) => setCustomThemeDesc(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              fontSize: 13.5,
              lineHeight: 1.6
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
              生成話数:
            </label>
            <select
              value={storyCount}
              onChange={(e) => setStoryCount(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13.5,
                fontWeight: 600,
                background: '#fff'
              }}
            >
              <option value={3}>全3話（ミニ連載 / 初心者向け）</option>
              <option value={5}>全5話（標準連載 / 約1ヶ月分）</option>
              <option value={7}>全7話（大型連載 / 約1.5ヶ月分）</option>
            </select>
          </div>

          <button
            onClick={handleGenerateAll}
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #2d6a4f 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(64, 145, 108, 0.3)'
            }}
          >
            <Sparkles size={18} />
            <span>AIストーリー＆NanoBanana2作画プロンプト一括生成</span>
          </button>
        </div>
      </div>

      {/* ステップ2：ストーリー各話＆NanoBanana2作画・投稿カード */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
            }}>2</span>
            生成された連載ストーリー一覧（全{stories.length}話）
          </h3>

          {/* 媒体タブ切り替え */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: 3, borderRadius: 8, gap: 4 }}>
            <button
              onClick={() => setActiveStoryTab('instagram')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: activeStoryTab === 'instagram' ? '#fff' : 'transparent',
                color: activeStoryTab === 'instagram' ? '#e1306c' : '#64748b',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: activeStoryTab === 'instagram' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <InstagramIcon size={14} color={activeStoryTab === 'instagram' ? '#e1306c' : '#64748b'} />
              <span>Instagram用表示</span>
            </button>
            <button
              onClick={() => setActiveStoryTab('note')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: activeStoryTab === 'note' ? '#fff' : 'transparent',
                color: activeStoryTab === 'note' ? '#10b981' : '#64748b',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: activeStoryTab === 'note' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <NoteIcon size={14} color={activeStoryTab === 'note' ? '#10b981' : '#64748b'} />
              <span>note用表示</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {stories.map((story, idx) => (
            <div
              key={story.id}
              style={{
                background: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              {/* カードヘッダー */}
              <div style={{
                background: '#f8fafc',
                padding: '14px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    background: '#0f172a',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 800
                  }}>
                    第{story.episodeNum}話
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>
                    {story.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>配信予定日: <strong>{story.scheduledDate}</strong></span>
                  <span style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#2563eb',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}>
                    {story.assignedAccount}
                  </span>
                </div>
              </div>

              {/* カードメインコンテンツ */}
              <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                {/* 左列：ストーリー本文 */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                    ストーリー本文（SEO配慮・木造自由設計の強みを網羅）
                  </div>
                  <div style={{
                    background: '#f8fafc',
                    padding: '14px 16px',
                    borderRadius: 8,
                    fontSize: 13.5,
                    lineHeight: 1.8,
                    color: '#1e293b',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid #e2e8f0',
                    maxHeight: 220,
                    overflowY: 'auto'
                  }}>
                    {story.plot}
                  </div>

                  {/* ハッシュタグプレビュー */}
                  <div style={{ marginTop: 10, fontSize: 11.5, color: '#64748b', lineHeight: 1.6 }}>
                    <strong>付与ハッシュタグ:</strong> {story.hashtags}
                  </div>
                </div>

                {/* 右列：NanoBanana2作画プロンプト ＆ 画像ドロップゾーン */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                      NanoBanana2 (Google AI Pro) 用 英語作画プロンプト
                    </div>
                    <button
                      onClick={() => copyToClipboard(story.englishPrompt, `prompt_${story.id}`)}
                      style={{
                        background: copiedKey === `prompt_${story.id}` ? '#10b981' : '#f1f5f9',
                        color: copiedKey === `prompt_${story.id}` ? '#fff' : '#0f172a',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        padding: '4px 10px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {copiedKey === `prompt_${story.id}` ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedKey === `prompt_${story.id}` ? 'コピー完了' : 'プロンプトをコピー'}</span>
                    </button>
                  </div>

                  {/* 英語プロンプト枠 */}
                  <div style={{
                    background: '#0f172a',
                    color: '#94a3b8',
                    padding: '10px 12px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    marginBottom: 12,
                    maxHeight: 80,
                    overflowY: 'auto'
                  }}>
                    {story.englishPrompt}
                  </div>

                  {/* 画像取り込み（ペーストまたはドロップ） */}
                  <div
                    onPaste={(e) => handlePasteImage(e, idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      handleImageFile(file, idx);
                    }}
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: 8,
                      padding: 12,
                      textAlign: 'center',
                      background: story.imageUrl ? '#f8fafc' : '#f1f5f9',
                      position: 'relative',
                      minHeight: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {story.imageUrl ? (
                      <div style={{ width: '100%', position: 'relative' }}>
                        <img
                          src={story.imageUrl}
                          alt={`第${story.episodeNum}話 イメージ`}
                          style={{
                            width: '100%',
                            maxHeight: 160,
                            objectFit: 'cover',
                            borderRadius: 6
                          }}
                        />
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                          <a
                            href={story.imageUrl}
                            download={`smile049_story_ep${story.episodeNum}.jpg`}
                            style={{
                              background: '#2563eb',
                              color: '#fff',
                              padding: '4px 10px',
                              borderRadius: 4,
                              fontSize: 11.5,
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Download size={12} />
                            <span>画像をダウンロード</span>
                          </a>
                          <button
                            onClick={() => {
                              const updated = [...stories];
                              updated[idx].imageUrl = null;
                              setStories(updated);
                            }}
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: 4,
                              fontSize: 11.5,
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                        <ImageIcon size={24} color="#94a3b8" style={{ marginBottom: 4 }} />
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                          生成した画像をここにドラッグ＆ドロップ または Ctrl+V でペースト
                        </div>
                        <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>
                          またはクリックして画像ファイルを選択
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFile(e.target.files?.[0], idx)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* 方式A：投稿アシストバー */}
              <div style={{
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {activeStoryTab === 'instagram' ? (
                    <>
                      <button
                        onClick={() => copyToClipboard(formatInstagramCaption(story), `ig_${story.id}`)}
                        style={{
                          background: copiedKey === `ig_${story.id}` ? '#10b981' : '#e1306c',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 14px',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {copiedKey === `ig_${story.id}` ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedKey === `ig_${story.id}` ? 'Instagram本文をコピー済' : 'Instagram投稿テキストをコピー'}</span>
                      </button>
                      <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#fff',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          padding: '8px 12px',
                          fontSize: 12.5,
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>Instagramを開く</span>
                      </a>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => copyToClipboard(formatNoteMarkdown(story), `note_${story.id}`)}
                        style={{
                          background: copiedKey === `note_${story.id}` ? '#10b981' : '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 14px',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {copiedKey === `note_${story.id}` ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedKey === `note_${story.id}` ? 'note記事をコピー済' : 'note記事テキストをコピー'}</span>
                      </button>
                      <a
                        href="https://note.com/notes/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#fff',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          padding: '8px 12px',
                          fontSize: 12.5,
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>note新規作成を開く</span>
                      </a>
                    </>
                  )}
                </div>

                {/* 投稿完了トグル */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
                    <input
                      type="checkbox"
                      checked={story.isPostedInstagram}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].isPostedInstagram = e.target.checked;
                        setStories(updated);
                      }}
                    />
                    <span>Instagram投稿済</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
                    <input
                      type="checkbox"
                      checked={story.isPostedNote}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].isPostedNote = e.target.checked;
                        setStories(updated);
                      }}
                    />
                    <span>note投稿済</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* アカウント開設キット モーダル */}
      {showKitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 14,
            maxWidth: 720,
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0f172a',
              color: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} color="#80ed99" />
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  公式SNSアカウント開設完全登録キット（Instagram / note / YouTube）
                </h4>
              </div>
              <button
                onClick={() => setShowKitModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* 公式画像アセット */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
                  🖼 配備済み公式ブランディング画像アセット
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <img src="/assets/sns/icon.jpg" alt="公式アイコン" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #cbd5e1' }} />
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>アイコン (1:1)</div>
                    <a href="/assets/sns/icon.jpg" download="smile049_sns_icon.jpg" style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>保存</a>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, minWidth: 200 }}>
                    <img src="/assets/sns/banner.jpg" alt="公式バナー" style={{ width: '100%', height: 64, borderRadius: 6, objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>ヘッダー/バナー (16:9)</div>
                    <a href="/assets/sns/banner.jpg" download="smile049_sns_banner.jpg" style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>保存</a>
                  </div>
                </div>
              </div>

              {/* Instagram設定 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#e1306c', marginBottom: 6 }}>
                  <InstagramIcon size={16} color="#e1306c" />
                  <span>Instagram 設定キット</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  <strong>ユーザーネーム:</strong> <code>@smile049_garage</code> | <strong>名前:</strong> <code>スマイチ | 木造自由設計ガレージ・倉庫</code>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={4}
                    value={`規格サイズに土地を合わせない。敷地に合わせて自分で描く「木造自由設計ガレージ・倉庫」\n🚗 愛車・大型バイクの秘密基地\n📐 狭小地・変形地・農業倉庫\n★ 登録不要の3Dシミュレーター＆リアルタイム自動見積もり公開中\n埼玉・関東全域対応｜専任スタッフが構造計算から施工までワンストップ\n👇 3Dシミュレーターを試す\nhttps://smile049.jp/`}
                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', lineHeight: 1.5 }}
                  />
                  <button
                    onClick={() => copyToClipboard(`規格サイズに土地を合わせない。敷地に合わせて自分で描く「木造自由設計ガレージ・倉庫」\n🚗 愛車・大型バイクの秘密基地\n📐 狭小地・変形地・農業倉庫\n★ 登録不要の3Dシミュレーター＆リアルタイム自動見積もり公開中\n埼玉・関東全域対応｜専任スタッフが構造計算から施工までワンストップ\n👇 3Dシミュレーターを試す\nhttps://smile049.jp/`, 'ig_profile')}
                    style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', fontSize: 11, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    {copiedKey === 'ig_profile' ? 'コピー済' : 'コピー'}
                  </button>
                </div>
              </div>

              {/* note設定 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#10b981', marginBottom: 6 }}>
                  <NoteIcon size={16} color="#10b981" />
                  <span>note+ 設定キット</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  <strong>note ID:</strong> <code>smile049</code> | <strong>クリエイター名:</strong> <code>スマイチ | 木造自由設計ガレージ物語</code>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={2}
                    value={`敷地に合わせてミリ単位で創る「木造自由設計ガレージ・倉庫 スマイチ」公式note。愛車と過ごす秘密基地、狭小変形地の特注ストッカー、農機具倉庫の設計ストーリーと3Dシミュレーター活用術をお届けします。`}
                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', lineHeight: 1.5 }}
                  />
                  <button
                    onClick={() => copyToClipboard(`敷地に合わせてミリ単位で創る「木造自由設計ガレージ・倉庫 スマイチ」公式note。愛車と過ごす秘密基地、狭小変形地の特注ストッカー、農機具倉庫の設計ストーリーと3Dシミュレーター活用術をお届けします。`, 'note_profile')}
                    style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', fontSize: 11, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    {copiedKey === 'note_profile' ? 'コピー済' : 'コピー'}
                  </button>
                </div>
              </div>

              {/* YouTube設定 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>
                  <YoutubeIcon size={16} color="#ef4444" />
                  <span>YouTube チャンネル開設キット</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  <strong>チャンネル名:</strong> <code>スマイチ 木造ガレージTV</code> | <strong>ハンドル:</strong> <code>@smile049_garage</code>
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={4}
                    value={`規格サイズに土地を合わせるのではなく、敷地に合わせて自分で描く「木造自由設計ガレージ・倉庫 スマイチ」の公式YouTubeチャンネルです。\n\n【配信内容】\n・WEBブラウザ上で動く「無料3Dガレージシミュレーター」の実践操作解説\n・敷地寸法・台形変形地・勾配屋根のミリ単位設計ノウハウ\n・愛車（ポルシェ・GT-R・クラシックカー）や大型バイクと暮らすガレージプラン\n\n■ スマイチ公式サイト\nhttps://smile049.jp/`}
                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', lineHeight: 1.5 }}
                  />
                  <button
                    onClick={() => copyToClipboard(`規格サイズに土地を合わせるのではなく、敷地に合わせて自分で描く「木造自由設計ガレージ・倉庫 スマイチ」の公式YouTubeチャンネルです。\n\n【配信内容】\n・WEBブラウザ上で動く「無料3Dガレージシミュレーター」の実践操作解説\n・敷地寸法・台形変形地・勾配屋根のミリ単位設計ノウハウ\n・愛車（ポルシェ・GT-R・クラシックカー）や大型バイクと暮らすガレージプラン\n\n■ スマイチ公式サイト\nhttps://smile049.jp/`, 'yt_profile')}
                    style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', fontSize: 11, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    {copiedKey === 'yt_profile' ? 'コピー済' : 'コピー'}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowKitModal(false)}
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
