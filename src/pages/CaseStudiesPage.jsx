import React, { useState, useEffect } from 'react';
import { 
  Compass, ArrowRight, CheckCircle2, Shield, Clock, MapPin, 
  Building2, Ruler, Layers, Sparkles, MessageSquare, ChevronRight,
  Maximize2, X, AlertCircle, FileCheck, Check, Tractor, DoorOpen, HardHat, FileText, Scale, Heart, Wind
} from 'lucide-react';
import { Analytics } from '../utils/analytics';

export default function CaseStudiesPage({ setCurrentRoute, initialCase = 'case-urban' }) {
  const [selectedCaseId, setSelectedCaseId] = useState('case-urban');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activePhotoCategory, setActivePhotoCategory] = useState('all');

  useEffect(() => {
    if (initialCase) {
      if (initialCase === 'case-a' || initialCase === 'urban' || initialCase === 'case-01') {
        setSelectedCaseId('case-urban');
      } else if (initialCase === 'case-b' || initialCase === 'adjust' || initialCase === 'case-02') {
        setSelectedCaseId('case-adjust');
      } else if (initialCase === 'case-03' || initialCase === 'woodcabin') {
        setSelectedCaseId('case-woodcabin');
      } else if (initialCase === 'case-04' || initialCase === 'narrow-ac') {
        setSelectedCaseId('case-narrow-ac');
      } else if (initialCase === 'case-05' || initialCase === 'cat-office') {
        setSelectedCaseId('case-cat-office');
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

  // 実例データ（厳選5大実例）
  const casesData = {
    'case-urban': {
      id: 'case-urban',
      num: '実例 01',
      tag: 'スマイチ事業 誕生のきっかけとなった第1号棟・鶴ヶ島市',
      areaType: '埼玉県鶴ヶ島市 / 市街化区域（法22条区域）',
      title: '「大手規格品では帯に短したすきに長し」から始まったスマイチの原点！敷地境界15cm × 中段・枕棚の特注造作',
      subtitle: '大手規格メーカーが「規格外」「申請・基礎は自己手配」と断った敷地を、建築士ワンストップ＆ミリ単位木造自由設計で完全解決',
      location: '埼玉県鶴ヶ島市（市街化区域・法22条屋根不燃規制区域）',
      buildingType: '木造軸組工法（自由設計）平屋建',
      dimensions: '間口 5.46m × 奥行 5.46m（約29.8㎡ / 約9.0坪）2台用ワイド',
      specs: [
        { label: '用途', val: '法人様・事業用資材および車両保管庫' },
        { label: '都市計画', val: '市街化区域（建築基準法第22条・屋根不燃規制区域）' },
        { label: '行政検査', val: '建築確認申請・消防協議・完了検査済証取得' },
        { label: '構造・仕様', val: '木造軸組＋軒ゼロ設計、ブラックガルバリウム鋼板、大工特注壁面中段・枕棚' },
        { label: '特注ポイント', val: '隣地境界から外壁離れ実質15cm、既存アスファルト活用外周布基礎、車止め再利用' },
        { label: '実績の背景', val: '東松山市や鶴ヶ島市等で小屋・物置の実績は多数。このお客様のご相談を機に「スマイチ事業」として本格始動した記念碑的1号棟' }
      ],
      points: [
        { label: '大手規格品では帯に短したすきに長しを解決', text: '駐車2台分の敷地に対して大きすぎて入らない・小さすぎて無駄ができる規格サイズを、ミリ単位で敷地目一杯に設計。' },
        { label: '基礎・確認申請の手間をゼロ化', text: '「本体のみ販売、申請と基礎は自分で探して」という大手の不親切と決別。設計・申請・基礎・施工を一括ワンストップ。' },
        { label: '頑丈な「中段・枕棚」の大工手仕事造作', text: '鉄骨プレハブ物置ではビスが効かず棚を付けられない不満を解消。長尺物や重量物をすっきり収める特注棚を造作。' },
        { label: 'スマイチ事業誕生の原点', text: '東松山や鶴ヶ島など地域密着で小屋を手掛けてきた技術を集結し、「お客様の諦めをなくす」ために生まれた第1号棟です。' }
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
          title: '透湿防水・ガルバリウム外壁・特注中段枕棚造作',
          desc: '法22条の不燃外壁仕様。使い勝手に合わせて頑丈な中段・枕棚を大工がミリ単位で造作。',
          photos: [
            { src: '/assets/construction/01/IMG_1707.jpeg', title: '透湿防水シート施工', caption: '結露を防ぐ二重防水・通気層' },
            { src: '/assets/construction/01/IMG_1752.jpeg', title: 'ブラックガルバ外壁', caption: '軒ゼロのシャープな外観' },
            { src: '/assets/construction/01/IMG_1794.jpeg', title: '特注中段・枕棚造作', caption: '荷物に合わせて大工が頑丈に造作した収納棚' },
            { src: '/assets/construction/01/IMG_1840.JPG', title: '完成全景', caption: '境界15cm・敷地一杯・既存車止めも綺麗に再設置' }
          ]
        }
      ]
    },
    'case-adjust': {
      id: 'case-adjust',
      num: '実例 02',
      tag: '市街化調整区域・適合証明・検査済証取得',
      areaType: '埼玉県内（市街化調整区域・建築制限区域）',
      title: '市街化調整区域での適合証明＆完了検査合格！農機具収納・勝手口直結ロング特注ガレージ',
      subtitle: '大手鉄骨メーカーが対応できない「間口2.73m × 奥行6.37m」の特殊寸法と勝手口動線を木造自由設計でクリア',
      location: '埼玉県内（市街化調整区域）',
      buildingType: '木造軸組工法（自由設計）平屋建',
      dimensions: '間口 2.73m × 奥行 6.37m（約17.38㎡ / 約5.26坪）',
      specs: [
        { label: '用途', val: '自家用車ガレージ ＋ 奥側農業用物置・機具保管' },
        { label: '都市計画', val: '市街化調整区域（埼玉県への適合証明取得）' },
        { label: '行政検査', val: '確認申請 ＆ 埼玉県建築主事による完了検査合格（検査済証受領）' },
        { label: '構造・仕様', val: '木造軸組＋耐震金物、ホワイト角波ガルバリウム鋼板、手動ワイドシャッター' },
        { label: '特注ポイント', val: '母屋勝手口への最短動線サイドドア、奥側農機具スペース＆特注固定木製棚' }
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
          title: '現況調査・根切り掘削・丁張り出し',
          desc: '市街化調整区域における適合証明協議完了後、母屋勝手口との位置関係に合わせて間口2.73m×奥行6.37mをミリ単位で根切り掘削。',
          photos: [
            { src: '/assets/construction/02/IMG_2310.jpeg', title: '着工前現況・根切り掘削', caption: '母屋勝手口との離隔・通りを確認し基礎根切り掘削' },
            { src: '/assets/construction/02/IMG_2311.jpeg', title: '掘削溝底・丁張り確認', caption: '砕石地業に向け、掘削深さとレベル（水平）を精密に確認' }
          ]
        },
        {
          id: 'b-step2',
          category: 'foundation',
          stepNum: '02',
          title: '基礎工事（配筋検査・型枠・土間コンクリート金鏝押さえ）',
          desc: '愛車および重量のある農機具の長期荷重を支える強固な基礎。配筋検査合格後、高強度土間コンクリートを金鏝で平滑に仕上げ。',
          photos: [
            { src: '/assets/construction/02/IMG_2341.JPG', title: '耐圧盤 配筋ピッチ検査', caption: 'D13/D10鉄筋を規定ピッチ（300mm）通りに正確に結束検測' },
            { src: '/assets/construction/02/IMG_2343.JPG', title: '立ち上がり配筋・かぶり厚検査', caption: 'スペーサーブロックで設計通りのかぶり厚を厳密に確保' },
            { src: '/assets/construction/02/IMG_2339.jpeg', title: '外周型枠・アンカー設置', caption: '土台と基礎を強固に締結するアンカーボルトを高精度にセット' },
            { src: '/assets/construction/02/IMG_2430.jpeg', title: '基礎完了・土間金鏝仕上げ', caption: '車両乗り入れに耐える高強度土間コンクリートを金鏝で平滑に仕上げ' }
          ]
        },
        {
          id: 'b-step3',
          category: 'framing',
          stepNum: '03',
          title: '木造建て方・高耐震金物工法・小屋組み',
          desc: '間口2.73m×奥行き6.37mのロングスパンを堅牢に支える木造軸組構造。自社大工による高精度プレカット施工と適材適所の耐震金物。',
          photos: [
            { src: '/assets/construction/02/IMG_2433.jpeg', title: '土台敷き・柱建て開始', caption: '防腐防蟻処理されたヒノキ土台に105角主要柱を直立' },
            { src: '/assets/construction/02/IMG_2443.jpeg', title: '建て方骨組み・開口部構築', caption: 'シャッター上部に耐力壁合板と仮筋交いを配置し狂いのない骨組みを構築' },
            { src: '/assets/construction/02/IMG_2436.jpeg', title: '梁・柱 羽子板ボルト接合', caption: '梁の引き抜けを防止する耐震金物（羽子板ボルト）で頑強に緊結' },
            { src: '/assets/construction/02/IMG_2466.jpeg', title: '土台アンカー座金締め', caption: '基礎アンカーボルトを規定トルクで確実に締結' },
            { src: '/assets/construction/02/IMG_2458.jpeg', title: '筋交いプレート耐震補強', caption: '地震・強風の水平荷重に抵抗する耐震金物・耐力壁を施工' }
          ]
        },
        {
          id: 'b-step4',
          category: 'exterior',
          stepNum: '04',
          title: '透湿防水シート・通気胴縁・外壁ホワイトガルバ・勝手口直結ドア',
          desc: '壁体内の湿気を逃がし雨水を防ぐ通気工法。母屋勝手口直結の片引き戸サッシを設置し、清潔感のあるホワイトガルバリウム鋼板を施工。',
          photos: [
            { src: '/assets/construction/02/IMG_2514.jpeg', title: '透湿防水シート全面施工', caption: '雨水を遮断し湿気を逃がす高機能透湿防水シートを施工' },
            { src: '/assets/construction/02/IMG_2535.jpeg', title: '勝手口直結サッシ・通気胴縁', caption: '母屋勝手口の真向かいに片引き戸を設置し外壁通気胴縁を施工' },
            { src: '/assets/construction/02/IMG_2536.jpeg', title: 'ホワイトガルバリウム外壁張り', caption: '清潔感と高耐久・低メンテナンスを両立する角波ガルバリウム鋼板' }
          ]
        },
        {
          id: 'b-step5',
          category: 'completion',
          stepNum: '05',
          title: '完工・ワイドシャッター・内部特注固定棚・完了検査合格',
          desc: '埼玉県の完了検査に無事合格し「検査済証」受領。雨に濡れない勝手口動線、たっぷり収納できる奥側特注棚、手動ワイドシャッターが完成。',
          photos: [
            { src: '/assets/construction/02/IMG_2560.jpg', title: '完成外観（ワイドシャッター閉）', caption: '清潔感のあるホワイトガルバリウム外壁と母屋の佇まいに美しく調和' },
            { src: '/assets/construction/02/IMG_2556.jpg', title: '完成正面（シャッター全開）', caption: '間口いっぱいの手動ワイドシャッターと段差のない金鏝仕上げ土間コン' },
            { src: '/assets/construction/02/IMG_2558.jpg', title: '母屋勝手口との直結動線', caption: '側面片引き戸を出ると目の前が母屋勝手口。雨の日でも濡れずに行き来可能' },
            { src: '/assets/construction/02/IMG_2559.jpg', title: '内部完成（奥側 特注造作固定棚）', caption: '奥スペースに農機具・備品を整理できる特注固定棚と引き違い窓を完備' },
            { src: '/assets/construction/02/IMG_2557.jpg', title: 'サイド全景（片流れ屋根・奥行6.37m）', caption: '敷地にミリ単位で収まった奥行き6.37mの美しいロングプロポーション' }
          ]
        }
      ]
    },
    'case-woodcabin': {
      id: 'case-woodcabin',
      num: '実例 03',
      tag: '東松山市・山小屋風ホビーガレージ・木の温もり',
      areaType: '埼玉県東松山市 / こだわりホビーピット',
      title: '四角い金属物置は嫌だ！板張りと木の温もりで創る「山小屋風」趣味小屋ガレージ',
      subtitle: '大手スチールガレージには真似できない、板張りと木造現しの質感。自然豊かな東松山の風景に美しく溶け込む大人の隠れ家',
      location: '埼玉県東松山市',
      buildingType: '木造軸組工法（山小屋風自由設計）平屋建',
      dimensions: '特注ホビーサイズ（愛車・大型バイク・木工DIY作業ピット）',
      specs: [
        { label: '用途', val: '愛車・バイク保管 ＋ 木工DIY・趣味の秘密基地' },
        { label: '外観意匠', val: '木製板張りサイディング × 耐久ガルバリウム鋼板ハイブリッド' },
        { label: '内部仕様', val: '木造現し構造、どこでも棚が付けられる構造用合板仕上げ' },
        { label: '構造・工法', val: '木造軸組工法＋高耐震金物、防腐防蟻処理' },
        { label: '特注ポイント', val: '自然景観に溶け込む山小屋風デザイン、手作りの温かみ' }
      ],
      points: [
        { label: '既製品にはない圧倒的デザイン性', text: '「四角い鉄の箱」では満足できない趣味人へ。木肌の温もりと経年変化を楽しめる山小屋スタイル。' },
        { label: '壁面どこでもビスが効く自由度', text: '柱や合板下地に直接ビスを打ち込み、工具ラックやロードバイクハンガーを自在にDIY可能。' },
        { label: '自然豊かな東松山の風景に調和', text: '周囲の緑や母屋の庭園と調和する、景観を損なわないナチュラルデザイン。' }
      ],
      constructionSteps: [
        {
          id: 'c-step1',
          category: 'complete',
          stepNum: '01',
          title: '山小屋風デザイン・完成全景',
          desc: '木の質感とシャープな金属屋根が融合した、東松山市の山小屋風ホビーガレージ。',
          photos: [
            { src: '/assets/construction/03/IMG_6408.jpg', title: '山小屋風ガレージ完成全景', caption: '木造ならではの温かみと高い意匠性を誇る外観（埼玉県東松山市）' }
          ]
        }
      ]
    },
    'case-narrow-ac': {
      id: 'case-narrow-ac',
      num: '実例 04',
      tag: '鶴ヶ島市・狭小建物ギリギリ・高さいっぱいいっぱい×エアコン完備',
      areaType: '埼玉県鶴ヶ島市 / 狭小敷地目一杯活用',
      title: '母屋ギリギリ・高さいっぱいいっぱい！エアコン完備で年中快適な特注狭小ガレージ',
      subtitle: '規格物置では入らない建物との極小隙間をミリ単位で攻略。冷暖房エアコン完備で「夏涼しく冬暖かい」快適作業空間を実現',
      location: '埼玉県鶴ヶ島市',
      buildingType: '木造軸組工法（ミリ単位狭小特注）平屋建',
      dimensions: '敷地限界寸法（母屋離れ・高さいっぱいいっぱい設計）',
      specs: [
        { label: '用途', val: '車両・バイク保管 ＋ 年中快適なワークスペース' },
        { label: '空調設備', val: '高効率エアコン完備（夏涼しく冬暖かい完全断熱仕様）' },
        { label: '敷地納まり', val: '母屋外壁・境界ギリギリのクリアランス、軒ゼロ金物設計' },
        { label: '構造・外壁', val: '木造軸組高耐震金物工法、耐久ガルバリウム外壁' },
        { label: '特注ポイント', val: '高さいっぱいいっぱいまで確保した室内有効気積、気密断熱' }
      ],
      points: [
        { label: '母屋ギリギリ・高さいっぱいいっぱい', text: '規格品では軒がぶつかる・高さが足りない狭小スペースを、ミリ単位の屋根勾配で限界突破。' },
        { label: 'エアコン完備で真夏も真冬も極楽', text: 'スチール物置の「夏サウナ・冬冷凍庫」と決別。断熱＋エアコンで年中快適な趣味・作業空間。' },
        { label: '鶴ヶ島市の住宅街にジャストフィット', text: '敷地境界と建物の余白を1cmも無駄にしない、計算し尽くされた特注ガレージ。' }
      ],
      constructionSteps: [
        {
          id: 'n-step1',
          category: 'survey',
          stepNum: '01',
          title: '母屋との離隔確認・建て方骨組み',
          desc: '母屋のサッシや軒との干渉をミリ単位でかわしながら、高耐震金物で骨組みを構築。',
          photos: [
            { src: '/assets/construction/04/IMG_6240.jpg', title: '建物ギリギリの建て方軸組', caption: '母屋外壁とのクリアランスを極限まで詰めた骨組み施工' },
            { src: '/assets/construction/04/IMG_6241.jpg', title: '高耐震金物・柱梁緊結', caption: '狭小スペースでも高い耐震性を確保する金物緊結' }
          ]
        },
        {
          id: 'n-step2',
          category: 'exterior',
          stepNum: '02',
          title: '透湿防水シート・屋根板金・高さいっぱいいっぱい設計',
          desc: '雨仕舞いを徹底した二重防水層と、高さいっぱいいっぱいの勾配屋根。',
          photos: [
            { src: '/assets/construction/04/IMG_6242.jpg', title: '屋根下地・透湿防水施工', caption: '隣家や母屋への雨水落雪に配慮した軒ゼロ板金施工' },
            { src: '/assets/construction/04/IMG_6243.jpg', title: '外壁下地合板張り', caption: '断熱性と耐震性を兼ね備えた高気密外壁下地' }
          ]
        },
        {
          id: 'n-step3',
          category: 'completion',
          stepNum: '03',
          title: '完工・エアコン設置・狭小スペース完全攻略',
          desc: '建物ギリギリに美しく納まり、室内には冷暖房エアコンを完備。年中快適なガレージが完成。',
          photos: [
            { src: '/assets/construction/04/kansei.jpg', title: '完成外観全景（鶴ヶ島市）', caption: '母屋と境界の隙間にミリ単位でジャストフィットした堂々たる佇まい' },
            { src: '/assets/construction/04/IMG_6355.jpg', title: '外観ディテール・軒納まり', caption: '高さいっぱいいっぱいに攻めたシャープなプロポーション' }
          ]
        }
      ]
    },
    'case-cat-office': {
      id: 'case-cat-office',
      num: '実例 05',
      tag: '日高市・単独浄化槽補助金入替 ➜ 物置増築 ➜ 仮住まい転用 ➜ 既存浄化槽利用で建て替え ➜ 事務所恒久活用',
      areaType: '埼玉県日高市 / 行政事前調整・補助金フル活用・ステップバイステップ',
      title: 'ペット可の仮住まい難民を救え！単独浄化槽の合併浄化槽補助金入替 ➜ 6坪物置増築 ➜ 仮住まい転用 ➜ 建て替え ➜ 事務所転用物語',
      subtitle: '「猫を飼っていて仮住まい賃貸が見つからない」施主様のために、行政側と事前に「この手法での補助金受給OK」「この浄化槽を使っての建て替えOK」と綿密に調整しながらステップバイステップで完遂',
      location: '埼玉県日高市',
      buildingType: '木造軸組工法（高断熱・住宅仕様・6坪）平屋建',
      dimensions: '約6坪（約20㎡ / 猫と快適に暮らせる住宅水準仕様）',
      specs: [
        { label: 'プロジェクト手法', val: '物置の増築 ➜ 猫と暮らす仮住まいに転用 ➜ 既存の合併浄化槽を利用して母屋建て替え ➜ 建て替え後は専用事務所・オフィスとして恒久活用' },
        { label: '浄化槽補助金', val: '既存建物の単独浄化槽を、高度合併処理浄化槽へ補助金受給で先行入替' },
        { label: '行政事前調整', val: '日高市行政とあらかじめ「この手法での補助金受給はOK」「この浄化槽を使っての母屋建て替えOK」と調整済み' },
        { label: '建物性能・設備', val: '木造軸組工法、ペアガラスサッシ、高断熱充填、電気・水道・トイレ・エアコン完備' },
        { label: '最大の価値', val: '100万〜150万円の賃貸仮住まい費用の捨て金をゼロにし、建て替え後も一生モノの快適な事務所・書斎として資産化' }
      ],
      points: [
        { label: 'ステップ①：単独浄化槽を合併浄化槽へ補助金入替', text: '既存の単独浄化槽から合併浄化槽への入れ替え補助金を先行受給。行政と「この浄化槽を将来の建て替え時にも利用する」条件を事前調整。' },
        { label: 'ステップ②：6坪の物置増築 ➜ 仮住まいへ転用', text: '猫を飼っていてペット可の賃貸仮住まいが見つからない施主様のため、敷地内に住宅仕様の6坪木造建物を増築し、快適な仮住まいとして転用。' },
        { label: 'ステップ③：既存合併浄化槽を利用して母屋建て替え', text: '行政側とあらかじめ調整していた通り、先行設置した合併浄化槽をそのまま利用して母屋のスムーズな建て替えを実現。' },
        { label: 'ステップ④：建て替え後は施主様の専用事務所へ恒久活用', text: '仮住まい期間が終わった後も壊さず、施主様の仕事部屋・オフィスとして恒久活用。仮住まい費用のムダを資産に変えました。' }
      ],
      constructionSteps: [
        {
          id: 'o-step1',
          category: 'survey',
          stepNum: '01',
          title: '現況調査・行政事前調整（補助金＆建て替え利用協議）',
          desc: '日高市行政側と「単独浄化槽の合併浄化槽補助金受給OK」「この浄化槽を使っての建て替えOK」とあらかじめ緻密に調整し、配置計画を確定。',
          photos: [
            { src: '/assets/construction/05/step_01.jpg', title: '着工前現況・敷地調査', caption: '敷地内での配置計画と浄化槽埋設位置の確認' },
            { src: '/assets/construction/05/step_02.jpg', title: '基礎根切り・レベル出し', caption: '住宅水準の強固な基礎工事を開始' }
          ]
        },
        {
          id: 'o-step2',
          category: 'foundation',
          stepNum: '02',
          title: '基礎配筋工事・合併処理浄化槽入替',
          desc: '単独浄化槽を最新の高度合併処理浄化槽へ入替工事。基礎は住宅同等の強固な配筋・型枠施工。',
          photos: [
            { src: '/assets/construction/05/step_04.jpg', title: '基礎型枠・アンカーセット', caption: '高精度な基礎立ち上がり型枠工事' },
            { src: '/assets/construction/05/step_06.jpg', title: 'コンクリート打設・養生', caption: '6坪とは思えない住宅品質の堅牢な基礎が完成' }
          ]
        },
        {
          id: 'o-step3',
          category: 'framing',
          stepNum: '03',
          title: '木造建て方・高耐震金物・屋根遮熱ルーフィング',
          desc: '人間と愛猫が冬暖かく夏涼しく過ごせるよう、住宅用の木造軸組と高気密・遮熱仕様で建て方。',
          photos: [
            { src: '/assets/construction/05/step_08.jpg', title: '木造軸組建て方全景', caption: 'プレカット材を高耐震金物で緊結する骨組み' },
            { src: '/assets/construction/05/step_10.jpg', title: '屋根ルーフィング・垂木施工', caption: '遮熱性と雨仕舞いを徹底した屋根構造' }
          ]
        },
        {
          id: 'o-step4',
          category: 'exterior',
          stepNum: '04',
          title: '断熱サッシ・透湿防水・外壁施工・インフラ引込',
          desc: '仮住まいとして快適に暮らすため、水道・電気・下水・エアコン・断熱サッシを完全装備。',
          photos: [
            { src: '/assets/construction/05/step_14.jpg', title: '断熱サッシ取付・透湿防水シート', caption: '猫が外を眺められる窓配置と高気密断熱' },
            { src: '/assets/construction/05/step_18.jpg', title: '外壁サイディング施工', caption: '将来事務所としても堂々と使える上質な外観デザイン' }
          ]
        },
        {
          id: 'o-step5',
          category: 'completion',
          stepNum: '05',
          title: '完工 ➜ 猫と暮らす仮住まい ➜ 建て替え後、立派な事務所へ',
          desc: '母屋の建て替え工事中も愛猫とストレスなく暮らし、母屋完成後はそのまま施主様のオフィス・仕事場として大活躍！',
          photos: [
            { src: '/assets/construction/05/step_24.jpg', title: '完成外観（日高市 6坪木造オフィス）', caption: '住宅クオリティの断熱・サッシ・エアコン完備の独立ハウス' },
            { src: '/assets/construction/05/step_26.jpg', title: '事務所・オフィスとして恒久活用', caption: '賃貸費用を捨てず、一生モノの仕事部屋として資産化に成功' }
          ]
        }
      ]
    }
  };

  const currentCase = casesData[selectedCaseId] || casesData['case-urban'];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: '"Inter", "Noto Sans JP", sans-serif' }}>
      
      {/* 1. ヒーローバナー：スマイチ5大施工実例 */}
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
            木造自由設計ガレージ・現場施工実例（全5大事例）
          </div>

          <h1 style={{ fontSize: 'clamp(22px, 3.8vw, 34px)', fontWeight: 800, lineHeight: 1.35, marginBottom: 14 }}>
            「規格外」「帯に短したすきに長し」と断られた方へ。<br />
            <span style={{ color: '#38bdf8' }}>敷地一杯・ミリ単位・行政調整・補助金まで、木造自由設計で完全解決。</span>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 1.6vw, 15.5px)', color: '#cbd5e1', maxWidth: 840, lineHeight: 1.65, marginBottom: 24 }}>
            大手鉄骨・スチール規格メーカーでは断られがちな厳しい敷地条件や、ペット仮住まい・浄化槽補助金といった特殊な課題も大丈夫。<br />
            スマイチなら建築士事務所として、法規・確認申請・完了検査・特注大工造作まで自社一貫ワンストップで叶えます。
          </p>

          {/* 5大実例セレクターカード */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            
            {/* 実例 01: 鶴ヶ島市 第1号棟 */}
            <div 
              onClick={() => setSelectedCaseId('case-urban')}
              style={{
                background: selectedCaseId === 'case-urban' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: selectedCaseId === 'case-urban' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, background: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                  実例 01 鶴ヶ島市
                </span>
                <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>創業原点</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 2 }}>
                規格品帯に短したすきに長し
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>
                境界15cm・既存アスファルト・中段枕棚
              </div>
            </div>

            {/* 実例 02: 市街化調整区域 */}
            <div 
              onClick={() => setSelectedCaseId('case-adjust')}
              style={{
                background: selectedCaseId === 'case-adjust' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: selectedCaseId === 'case-adjust' ? '2px solid #34d399' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, background: '#059669', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                  実例 02 埼玉近郊
                </span>
                <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>法規適合</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 2 }}>
                市街化調整区域・適合証明
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>
                完了検査済証・特注W2.73×D6.37m
              </div>
            </div>

            {/* 実例 03: 東松山市 山小屋風 */}
            <div 
              onClick={() => setSelectedCaseId('case-woodcabin')}
              style={{
                background: selectedCaseId === 'case-woodcabin' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: selectedCaseId === 'case-woodcabin' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, background: '#b45309', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                  実例 03 東松山市
                </span>
                <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700 }}>意匠美</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 2 }}>
                山小屋風ホビーガレージ
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>
                木の温もり・板張り外観・DIYピット
              </div>
            </div>

            {/* 実例 04: 鶴ヶ島市 狭小エアコン付き */}
            <div 
              onClick={() => setSelectedCaseId('case-narrow-ac')}
              style={{
                background: selectedCaseId === 'case-narrow-ac' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: selectedCaseId === 'case-narrow-ac' ? '2px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, background: '#7e22ce', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                  実例 04 鶴ヶ島市
                </span>
                <span style={{ fontSize: 11, color: '#c084fc', fontWeight: 700 }}>限界狭小</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 2 }}>
                建物ギリギリ×エアコン付き
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>
                高さいっぱい・年中快適冷暖房完備
              </div>
            </div>

            {/* 実例 05: 日高市 猫仮住まい→事務所 */}
            <div 
              onClick={() => setSelectedCaseId('case-cat-office')}
              style={{
                background: selectedCaseId === 'case-cat-office' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: selectedCaseId === 'case-cat-office' ? '2px solid #f472b6' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, background: '#be185d', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                  実例 05 日高市
                </span>
                <span style={{ fontSize: 11, color: '#f472b6', fontWeight: 700 }}>ペット救済</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 2 }}>
                猫の仮住まい➜事務所転用
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>
                6坪住宅仕様・合併浄化槽補助金受給
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. メインコンテンツ（選択された実例の要点と写真） */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 20px 70px' }}>

        {/* 実例切り替えタブバー */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '2px solid #e2e8f0', paddingBottom: 12, overflowX: 'auto' }}>
          {Object.values(casesData).map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                border: selectedCaseId === c.id ? '2px solid #0f172a' : '1px solid #cbd5e1',
                background: selectedCaseId === c.id ? '#0f172a' : '#fff',
                color: selectedCaseId === c.id ? '#fff' : '#475569',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span>{c.num}</span>
              <span>{c.tag.split('・')[0]}</span>
            </button>
          ))}
        </div>

        {/* 実例タイトル＆基本情報 */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: 32 }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, background: '#0f172a', color: '#fff', padding: '3px 10px', borderRadius: 6 }}>
              {currentCase.num}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, background: '#f1f5f9', color: '#0369a1', padding: '3px 10px', borderRadius: 6 }}>
              {currentCase.areaType}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, background: '#ecfdf5', color: '#059669', padding: '3px 10px', borderRadius: 6 }}>
              {currentCase.location}
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, margin: '0 0 10px' }}>
            {currentCase.title}
          </h2>

          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: '0 0 24px' }}>
            {currentCase.subtitle}
          </p>

          {/* スペックグリッド */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, background: '#f8fafc', padding: '16px 18px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            {currentCase.specs.map((s, idx) => (
              <div key={idx}>
                <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 700, marginTop: 2 }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* 解決ポイント 3項目 */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {currentCase.points.map((p, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #cbd5e1', borderLeft: '4px solid #0284c7', padding: '12px 14px', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0284c7', marginBottom: 4 }}>
                  ✓ {p.label}
                </div>
                <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.6 }}>
                  {p.text}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 現場写真・施工プロセスギャラリー */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <HardHat size={22} color="#f59e0b" />
              <span>現場施工プロセス写真 ＆ 施工の証拠</span>
            </h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>※クリックで拡大表示</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {currentCase.constructionSteps.map((step) => (
              <div key={step.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>
                    STEP {step.stepNum}
                  </span>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {step.title}
                  </h4>
                </div>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {step.desc}
                </p>

                {/* 写真グリッド */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  {step.photos.map((photo, pIdx) => (
                    <div 
                      key={pIdx}
                      onClick={() => setSelectedPhoto(photo)}
                      style={{ 
                        borderRadius: 8, 
                        overflow: 'hidden', 
                        border: '1px solid #e2e8f0', 
                        cursor: 'pointer',
                        background: '#f8fafc',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                        <img 
                          src={photo.src} 
                          alt={`${currentCase.title} - ${photo.title}（${currentCase.location} 木造ガレージ施工 株式会社 住ま居る）`}
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Maximize2 size={10} />
                          <span>拡大</span>
                        </div>
                      </div>
                      <div style={{ padding: '10px' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{photo.title}</div>
                        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{photo.caption}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* 3DシミュレーターCTA */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 16, padding: '36px 24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 13, color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>
            SMILE049 3D SIMULATOR
          </div>
          <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, margin: '0 0 12px' }}>
            あなたの敷地の寸法・形状で、3Dリアルタイム積算
          </h3>
          <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 640, margin: '0 auto 24px', lineHeight: 1.6 }}>
            大手規格品では入らなかった敷地も、ミリ単位で寸法を変えて即座に確認できます。
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigateTo('simulator')}
              style={{ background: '#f59e0b', color: '#000', fontWeight: 800, padding: '12px 28px', borderRadius: 9999, border: 'none', cursor: 'pointer', fontSize: 15, boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)' }}
            >
              無料3Dシミュレーターを起動する ▸
            </button>
            <button
              onClick={() => navigateTo('consultation')}
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontWeight: 700, padding: '12px 24px', borderRadius: 9999, border: '1px solid rgba(255, 255, 255, 0.25)', cursor: 'pointer', fontSize: 14 }}
            >
              建築士に無料相談する
            </button>
          </div>
        </div>

      </main>

      {/* 写真拡大モーダル */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 900, width: '100%', background: '#0f172a', borderRadius: 12, overflow: 'hidden', border: '1px solid #334155' }}
          >
            <div style={{ position: 'relative' }}>
              <img src={selectedPhoto.src} alt={selectedPhoto.title} style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block' }} />
              <button 
                onClick={() => setSelectedPhoto(null)}
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '16px 20px', background: '#0f172a', color: '#fff' }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{selectedPhoto.title}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{selectedPhoto.caption}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
