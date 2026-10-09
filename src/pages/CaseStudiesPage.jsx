import React, { useState, useEffect } from 'react';
import { 
  Compass, ArrowRight, CheckCircle2, Shield, Clock, MapPin, 
  Building2, Ruler, Layers, Sparkles, MessageSquare, ChevronRight,
  Maximize2, X, AlertCircle, FileCheck, Check, Tractor, DoorOpen, HardHat, FileText
} from 'lucide-react';
import { Analytics } from '../utils/analytics';

export default function CaseStudiesPage({ setCurrentRoute, initialCase = 'case-b' }) {
  const [selectedCaseId, setSelectedCaseId] = useState('case-b'); // 最新の調整区域実例を初期表示
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activePhotoCategory, setActivePhotoCategory] = useState('all');

  useEffect(() => {
    if (initialCase) {
      setSelectedCaseId(initialCase);
    }
  }, [initialCase]);

  const navigateTo = (route) => {
    if (route === 'simulator') {
      Analytics.trackSimulatorStart(`case_study_${selectedCaseId}`);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 実例データ（規格外条件・厳しい要望を余裕で叶えた実績）
  const casesData = {
    'case-b': {
      id: 'case-b',
      tag: '市街化調整区域・行政手続き完全対応',
      title: '市街化調整区域での適合証明＆完了検査取得！農機具収納・勝手口直結ロング特注ガレージ',
      subtitle: '大手鉄骨メーカーが対応できない「間口2.73m × 奥行6.37m」の特殊寸法と勝手口動線を木造自由設計で余裕のクリア',
      location: '埼玉県内（市街化調整区域）',
      buildingType: '木造軸組工法（自由設計）平屋建',
      dimensions: '間口 2.73m × 奥行 6.37m（約17.38㎡ / 約5.26坪）',
      specs: [
        { label: '用途', val: '自家用車ガレージ ＋ 奥側農業用物置・機具保管' },
        { label: '敷地区分', val: '市街化調整区域（建築制限区域）' },
        { label: '行政手続き', val: '埼玉県へ適合証明取得・確認申請・完了検査合格（検査済証取得）' },
        { label: '構造・仕様', val: '木造軸組＋高耐震金物、ブラックガルバリウム鋼板、手動ワイドシャッター' },
        { label: '特注仕様', val: '母屋勝手口への最短動線サイドドア、奥側農機具・道具専用スペース' }
      ],
      clientChallenge: {
        title: '施主様が抱えていた悩みと厳しいご要望',
        items: [
          '市街化調整区域のため他社では「建てられない」「手続きが複雑で手配できない」と難色を示された。',
          '敷地形状と愛車＋奥の農業用道具・機具スペースを考慮すると、どうしても「間口2.73m × 奥行6.37m」という縦長特殊寸法が必要だったが、大手S造規格品ではサイズが合わない（規格外）。',
          '雨の日でも濡れずに母屋へ行き来できるよう、出入口ドアを母屋勝手口の正面ピンポイントに配置したかった。',
          '将来にわたって安心できるよう、行政（埼玉県）への適合証明から確認申請、完了検査まで正規に合格させたい。'
        ]
      },
      smileSolution: {
        title: 'スマイチの解決策（木造自由設計だからすべて余裕で実現）',
        items: [
          '【行政ワンストップ対応】一級建築士事務所として、埼玉県への都市計画法適合証明申請・建築確認申請・完了検査まで自社専任スタッフが一貫代行。見事に検査済証を取得。',
          '【ミリ単位の特注寸法】木造軸組の柔軟性を活かし、間口2.73m × 奥行6.37mをオーダーメイド施工。奥側に余裕ある農業用物置スペースを創出。',
          '【動線に合わせた開口部配置】規格品では位置が固定されるドアも、母屋勝手口の真正面にミリ単位で設定。日常の快適な生活動線を実現。',
          '【結露・熱対策】寒暖差の激しい地域でも、木造の自然な調湿性と通気工法により、内部の農機具や車がサビにくい高耐久環境を確保。'
        ]
      },
      constructionSteps: [
        {
          id: 'b-step1',
          category: 'survey',
          stepNum: '01',
          title: '現況調査・地縄・行政事前協議',
          subtitle: '埼玉県との適合証明協議と精密な配置計画',
          desc: '市街化調整区域における建築制限をクリアするため、埼玉県と綿密な事前協議を実施。母屋勝手口との位置関係や給排水・雨水排水計画を踏まえ、ミリ単位の地縄・墨出しを行いました。',
          photos: [
            { src: '/assets/construction/02/IMG_2310.jpeg', title: '施工前現況・配置確認', caption: '母屋との位置関係と敷地高低差の確認' },
            { src: '/assets/construction/02/IMG_2311.jpeg', title: '敷地境界と地縄張り', caption: '間口2.73m×奥行6.37mの精密な位置出し' },
            { src: '/assets/construction/02/IMG_2312.jpeg', title: '基礎位置出し・掘削準備', caption: '支持地盤の確認と掘削ラインの設定' }
          ]
        },
        {
          id: 'b-step2',
          category: 'foundation',
          stepNum: '02',
          title: '基礎工事（配筋・型枠・ベタ基礎打設）',
          subtitle: '重量物や農機具の出し入れにも耐えうる高強度基礎',
          desc: '車の荷重はもちろん、奥に保管する重量のある農機具や機材にも耐えられるよう、強固な配筋と立ち上がり基礎を施工。アンカーボルトを正確に配置し、確実な水平レベル出しを実施しました。',
          photos: [
            { src: '/assets/construction/02/IMG_2337.jpeg', title: '根切り・砕石地業', caption: '砕石転圧による強固な地盤づくり' },
            { src: '/assets/construction/02/IMG_2338.jpeg', title: '防湿シート敷設', caption: '地面からの湿気を完全シャットアウト' },
            { src: '/assets/construction/02/IMG_2339.jpeg', title: '鉄筋配筋組み', caption: '構造計算に基づくD10/D13鉄筋の結束' },
            { src: '/assets/construction/02/IMG_2341.JPG', title: '基礎型枠建込み', caption: '立ち上がり幅・かぶり厚を厳密に確保' },
            { src: '/assets/construction/02/IMG_2342.JPG', title: 'アンカーボルト設置', caption: '木造土台と緊結する高耐震アンカー' },
            { src: '/assets/construction/02/IMG_2343.JPG', title: 'コンクリート打設', caption: 'バイブレーターによるジャンカのない密実な打設' },
            { src: '/assets/construction/02/IMG_2344.JPG', title: '基礎養生・脱型', caption: '十分な強度発現を待って型枠解体' }
          ]
        },
        {
          id: 'b-step3',
          category: 'framing',
          stepNum: '03',
          title: '木造建て方・特注小屋組み',
          subtitle: '奥行6.37mのロングスパンを支える堅牢な軸組',
          desc: '土台敷きから柱・梁の建て方へ。奥行6.37mの縦長空間を堅牢に支えるため、梁せい・金物配置を最適化。母屋勝手口とぴったり重なるサイドドア開口部も正確に組み上げました。',
          photos: [
            { src: '/assets/construction/02/IMG_2422.JPG', title: '土台敷き・防腐防蟻処理', caption: 'ヒノキ土台と基礎パッキンによる通気確保' },
            { src: '/assets/construction/02/IMG_2423.JPG', title: '柱建て・梁架け', caption: '高精度プレカット材による迅速・強固な組み上げ' },
            { src: '/assets/construction/02/IMG_2424.JPG', title: '屋根垂木施工', caption: '雨水の流れを考慮した片流れ屋根勾配' },
            { src: '/assets/construction/02/IMG_2425.JPG', title: '耐震金物締め付け', caption: 'ホールダウン金物・筋交いプレートによる耐震補強' },
            { src: '/assets/construction/02/IMG_2426.JPG', title: '野地板（屋根下地）施工', caption: '高耐水合板による強固な屋根構面' },
            { src: '/assets/construction/02/IMG_2427.JPG', title: '建て方全景（骨組み完成）', caption: '間口2.73m×奥行6.37mの美しい木造フレーム' }
          ]
        },
        {
          id: 'b-step4',
          category: 'exterior',
          stepNum: '04',
          title: '耐力面材・透湿防水・サッシ・外壁施工',
          subtitle: '勝手口ドアの開口と高耐久ガルバリウム外壁',
          desc: '外周部に構造用耐力面材を施工し、透湿防水シート＋通気胴縁で二重の防水・通気層を形成。勝手口への最短動線となるサイドドアやサッシを取り付け、シャープなブラックガルバで仕上げました。',
          photos: [
            { src: '/assets/construction/02/IMG_2430.jpeg', title: '構造用合板耐力壁施工', caption: '建物全体の剛性を極限まで高める耐震面材' },
            { src: '/assets/construction/02/IMG_2433.jpeg', title: '透湿防水シート施工', caption: '雨水浸入を防ぎ内部の湿気を逃がす高機能シート' },
            { src: '/assets/construction/02/IMG_2434.jpeg', title: '通気胴縁・外壁下地', caption: '壁内結露を防止する通気層を確保' },
            { src: '/assets/construction/02/IMG_2435.jpeg', title: 'サッシ・ドア枠取付', caption: '勝手口と直結するサイドドアの開口位置' },
            { src: '/assets/construction/02/IMG_2436.jpeg', title: 'ガルバリウム鋼板外壁施工', caption: 'メンテナンスフリーで耐久性の高い金属サイディング' },
            { src: '/assets/construction/02/IMG_2437.jpeg', title: '軒裏・役物板金施工', caption: '雨仕舞いを徹底した板金ディテール' }
          ]
        },
        {
          id: 'b-step5',
          category: 'cladding',
          stepNum: '05',
          title: 'シャッター取付・電気配線・土間仕上げ',
          subtitle: 'スムーズな開閉と農業用機器のための電源設備',
          desc: '前面にスムーズに開閉できるワイドシャッターを設置。内部には夜間の作業や農機具の充電に便利な照明・専用コンセントを配線し、土間コンクリート金ゴテ仕上げを行いました。',
          photos: [
            { src: '/assets/construction/02/IMG_2440.jpeg', title: '軽量手動シャッター取付', caption: '毎日の開閉が軽快な高耐久シャッター' },
            { src: '/assets/construction/02/IMG_2444.jpeg', title: '内部電気配管・スイッチ設置', caption: '勝手口側とシャッター側の両方から操作できる照明回路' },
            { src: '/assets/construction/02/IMG_2447.jpeg', title: '土間コンクリート仕上', caption: 'タイヤの摩耗に強く掃除しやすいツルツルの金ゴテ仕上げ' },
            { src: '/assets/construction/02/IMG_2452.jpeg', title: 'シャッター水切り納まり', caption: '台風や豪雨でも雨水が吹き込まない水返し納まり' }
          ]
        },
        {
          id: 'b-step6',
          category: 'inspection',
          stepNum: '06',
          title: '埼玉県による完了検査・合格・お引渡し',
          subtitle: '行政の正規検査をパスし、安心の検査済証を取得',
          desc: '工事完了後、埼玉県の建築主事による現地完了検査を実施。建築基準法および都市計画法の基準に適合していることが認められ、正規の「検査済証」を受領。施主様へ安心とともにお引き渡しいたしました。',
          photos: [
            { src: '/assets/construction/02/IMG_2460.jpeg', title: '完了検査・外観全景確認', caption: '申請図面通りに施工された建物の現地検査' },
            { src: '/assets/construction/02/IMG_2466.jpeg', title: '勝手口動線の使い勝手確認', caption: '母屋勝手口とガレージドアが雨に濡れず直結' },
            { src: '/assets/construction/02/IMG_2470.jpeg', title: '奥側農業用物置スペース', caption: '車を停めても奥に農機具・肥料がたっぷり置ける深さ' },
            { src: '/assets/construction/02/IMG_2514.jpeg', title: '完成・正面シャッター外観', caption: '周囲の景観に美しく調和するブラックガルバリウム' },
            { src: '/assets/construction/02/IMG_2522.jpeg', title: '夜間照明点灯確認', caption: 'LED照明により夜間でも安全・快適に作業可能' },
            { src: '/assets/construction/02/IMG_2534.jpeg', title: 'お引き渡し完了', caption: '施主様より「希望通りにすべて収まった」と大絶賛をいただきました' }
          ]
        }
      ]
    },
    'case-a': {
      id: 'case-a',
      tag: '敷地境界15cm・既存舗装活用・法人案件',
      title: '敷地境界15cm＆既存アスファルト活用！法人オーナー様の事業用特注ガレージ・保管庫',
      subtitle: '大手規格メーカーから「基礎・電気・申請は自己手配」「アスファルト全解体」と断られた難条件を、ワンストップ＆コスト大幅カットで完工',
      location: '埼玉県内（商業・事業用地）',
      buildingType: '木造軸組工法（自由設計）平屋建',
      dimensions: '間口 5.46m × 奥行 5.46m（約29.8㎡ / 約9.0坪）2台用ワイド',
      specs: [
        { label: '用途', val: '法人様・事業用資材および車両保管庫' },
        { label: '敷地条件', val: '隣地駐車場境界から実質15cm、既存アスファルト舗装' },
        { label: '行政手続き', val: '建築確認申請・消防協議・完了検査取得' },
        { label: '構造・仕様', val: '木造軸組＋軒ゼロ設計、ブラックガルバリウム鋼板、特注木製壁面棚' },
        { label: '特注仕様', val: '既存車止め再設置、既存アスファルトを活かした外周布基礎' }
      ],
      clientChallenge: {
        title: '施主様が抱えていた悩みと厳しいご要望',
        items: [
          '大手規格メーカーへ相談したが「基礎工事・電気工事・確認申請は自分で手配してほしい」と言われ、総額が高騰し途方に暮れていた。',
          '「既存のアスファルト舗装をそのまま使ってコストを抑えたい」「まだ新しい車止めも外して再設置してほしい」という要望を他社では断られた。',
          '隣地駐車場との境界線ギリギリ（実質15cm）に建てたいが、大手規格品は軒の出や基礎幅の制限で建てられなかった。',
          '工事中に出てきた「壁面に棚をたくさん造作してほしい」という追加要望にも柔軟に対応してほしかった。'
        ]
      },
      smileSolution: {
        title: 'スマイチの解決策（木造自由設計だからすべて余裕で実現）',
        items: [
          '【完全ワンストップ施工】基礎・大工・電気・板金・確認申請まで、すべて自社専任スタッフが一括管理。窓口一本化で中間マージンをカット。',
          '【既存アスファルト活用工法】アスファルトを全面解体せず、外周部に高強度な布基礎を施工。解体・再舗装費用を大幅に削減し車止めも綺麗に再設置。',
          '【軒ゼロ・境界15cm限界設計】木造自由設計の強みを活かし、軒の出をゼロに抑えて隣地境界から外壁仕上離れ15cmの限界施工を実現。',
          '【木造だからできる柔軟な内部造作】工事中にご要望いただいた壁面一面の特注頑丈棚も、自社大工が即座にミリ単位で造作。'
        ]
      },
      constructionSteps: [
        {
          id: 'a-step1',
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
          id: 'a-step2',
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
          id: 'a-step3',
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
          id: 'a-step4',
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
          id: 'a-step5',
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
          id: 'a-step6',
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
        }
      ]
    }
  };

  const currentCase = casesData[selectedCaseId] || casesData['case-b'];

  // 全写真の抽出
  const allPhotos = currentCase.constructionSteps.flatMap(step => 
    step.photos.map(p => ({ ...p, stepNum: step.stepNum, stepTitle: step.title, category: step.category }))
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: '"Inter", "Noto Sans JP", sans-serif' }}>
      
      {/* 1. ヒーローバナー：スマイチの基本スタンス */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)',
        color: '#fff',
        padding: '60px 20px 50px',
        borderBottom: '4px solid #f59e0b',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fbbf24', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
            <Sparkles size={16} />
            木造自由設計ガレージ・現場施工実例集
          </div>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, lineHeight: 1.3, marginBottom: 16, letterSpacing: '-0.02em' }}>
            「規格外だから無理」と断られたすべての方へ。<br />
            <span style={{ color: '#38bdf8' }}>どんな厳しい敷地・法令・寸法条件も、木造自由設計ならすべて余裕で叶えます。</span>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#cbd5e1', maxWidth: 880, lineHeight: 1.7, marginBottom: 28 }}>
            大手鉄骨・既製品メーカーでは断られがちな「市街化調整区域の許可」「敷地境界ギリギリ15cm」「W2.73m×D6.37mなどの特注寸法」「勝手口への最短動線」「既存アスファルトの活用」。<br />
            スマイチは建築士による完全自由設計と自社専任スタッフのワンストップ施工で、お客様の理想を100%形にします。
          </p>

          {/* 3大ポリシーバッジ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Ruler size={24} color="#38bdf8" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>ミリ単位の自由設計</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>規格外寸法・狭小地・境界15cmに対応</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <FileCheck size={24} color="#34d399" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>行政手続き・完了検査対応</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>調整区域の適合証明・確認申請を自社完結</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <HardHat size={24} color="#fbbf24" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>ワンストップ責任施工</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>基礎・大工・電気・申請まで丸投げOK</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. 実例セレクタータブ */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Building2 size={16} /> 施工実例を見る:
          </span>

          <button
            onClick={() => { setSelectedCaseId('case-b'); setActivePhotoCategory('all'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: selectedCaseId === 'case-b' ? '2px solid #0284c7' : '1px solid #e2e8f0',
              background: selectedCaseId === 'case-b' ? '#f0f9ff' : '#fff',
              color: selectedCaseId === 'case-b' ? '#0369a1' : '#475569',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Tractor size={18} color={selectedCaseId === 'case-b' ? '#0284c7' : '#94a3b8'} />
            実例：市街化調整区域・農機具収納・勝手口直結ロング特注ガレージ (W2.73×D6.37)
          </button>

          <button
            onClick={() => { setSelectedCaseId('case-a'); setActivePhotoCategory('all'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: selectedCaseId === 'case-a' ? '2px solid #0284c7' : '1px solid #e2e8f0',
              background: selectedCaseId === 'case-a' ? '#f0f9ff' : '#fff',
              color: selectedCaseId === 'case-a' ? '#0369a1' : '#475569',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={18} color={selectedCaseId === 'case-a' ? '#0284c7' : '#94a3b8'} />
            実例：敷地境界15cm・既存舗装活用！事業用保管庫・ガレージ
          </button>
        </div>
      </section>

      {/* 3. 選択中実例のメインコンテンツ */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* 実例タイトル＆概要カード */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: 36 }}>
          
          <div style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
            {currentCase.tag}
          </div>

          <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, marginBottom: 12 }}>
            {currentCase.title}
          </h2>

          <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>
            {currentCase.subtitle}
          </p>

          {/* スペック表 */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#334155', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={16} color="#0284c7" /> 建築仕様・概要データ
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px 24px' }}>
              {currentCase.specs.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', fontSize: 13, lineHeight: 1.5, borderBottom: '1px dashed #e2e8f0', paddingBottom: 6 }}>
                  <span style={{ width: 100, fontWeight: 700, color: '#64748b', flexShrink: 0 }}>{item.label}</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4. 課題 vs スマイチの解決策（対比ブロック） */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
          
          {/* 施主様の悩み・他社で断られた点 */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid #fee2e2', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontWeight: 800, fontSize: 16, marginBottom: 16 }}>
              <AlertCircle size={22} />
              {currentCase.clientChallenge.title}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentCase.clientChallenge.items.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
                  <span style={{ color: '#ef4444', fontWeight: 800, flexShrink: 0 }}>✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* スマイチの解決策 */}
          <div style={{ background: '#f0fdf4', borderRadius: 16, padding: '28px', border: '1px solid #bbf7d0', boxShadow: '0 4px 16px rgba(34, 197, 94, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 800, fontSize: 16, marginBottom: 16 }}>
              <CheckCircle2 size={22} />
              {currentCase.smileSolution.title}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentCase.smileSolution.items.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#14532d', lineHeight: 1.6 }}>
                  <Check size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 5. 現場施工写真・工程ギャラリー */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0284c7', marginBottom: 4 }}>CONSTRUCTION PROCESS & EVIDENCE</div>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: '#0f172a' }}>
                全工程・現場施工写真ギャラリー（基礎〜建て方〜完了検査）
              </h2>
            </div>

            {/* 写真カテゴリフィルター */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: '全写真表示' },
                { id: 'survey', label: '現況・地縄' },
                { id: 'foundation', label: '基礎工事' },
                { id: 'framing', label: '建て方・木構造' },
                { id: 'exterior', label: '下地・通気防水' },
                { id: 'cladding', label: '外壁・シャッター' },
                { id: 'inspection', label: '検査・完成' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActivePhotoCategory(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: 'none',
                    background: activePhotoCategory === cat.id ? '#0f172a' : '#e2e8f0',
                    color: activePhotoCategory === cat.id ? '#fff' : '#475569',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 工程ステップ別アコーディオン/カード */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {currentCase.constructionSteps
              .filter(step => activePhotoCategory === 'all' || step.category === activePhotoCategory)
              .map((step) => (
                <div key={step.id} style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ background: '#0284c7', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 800 }}>
                      STEP {step.stepNum}
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {step.title}
                    </h3>
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                      — {step.subtitle}
                    </span>
                  </div>

                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>
                    {step.desc}
                  </p>

                  {/* 写真グリッド */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    {step.photos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setSelectedPhoto(photo)}
                        style={{
                          borderRadius: 10,
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ width: '100%', height: 160, background: '#cbd5e1', overflow: 'hidden', position: 'relative' }}>
                          <img
                            src={photo.src}
                            alt={photo.title}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: '50%', padding: 6, display: 'flex' }}>
                            <Maximize2 size={12} />
                          </div>
                        </div>
                        <div style={{ padding: '10px 12px' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>
                            {photo.title}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
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

        {/* 6. 写真拡大モーダル */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
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
                maxWidth: 900,
                width: '100%',
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X size={20} />
              </button>

              <div style={{ maxHeight: '70vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>

              <div style={{ padding: '20px 24px' }}>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                  {selectedPhoto.title}
                </h4>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 7. 3Dシミュレーター誘導CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: 20,
          padding: '40px 32px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 12px 32px rgba(2, 132, 199, 0.25)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
            <Sparkles size={14} /> 敷地にあわせた特注サイズもリアルタイム積算
          </div>

          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, marginBottom: 14 }}>
            あなたのご希望の寸法・敷地条件で3Dシミュレーション
          </h2>

          <p style={{ fontSize: 15, color: '#e0f2fe', maxWidth: 680, lineHeight: 1.7, marginBottom: 28 }}>
            「市街化調整区域で建てられるか相談したい」「うちの変形敷地にもピッタリ収まるか確認したい」など、どんな条件でもお気軽にご相談ください。
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => navigateTo('simulator')}
              style={{
                background: '#f59e0b',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '16px 36px',
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Compass size={20} />
              無料で3Dシミュレーターを試す
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigateTo('stories')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 10,
                padding: '16px 28px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <FileText size={18} />
              お悩み解決コラムを読む
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
