import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TopPage from './pages/TopPage';
import PlanHobbyPage from './pages/PlanHobbyPage';
import PlanStoragePage from './pages/PlanStoragePage';
import PlanAgriPage from './pages/PlanAgriPage';
import PlanWorkshopPage from './pages/PlanWorkshopPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import StoryPage from './pages/StoryPage';
import SaishinLpPage from './pages/SaishinLpPage';
import SaishinTechPage from './pages/SaishinTechPage';
import SaishinSpecPage from './pages/SaishinSpecPage';
import EieRealEstatePage from './pages/EieRealEstatePage';
import ReRenovationPage from './pages/ReRenovationPage';
import ChatRoomModal from './components/ChatRoomModal';
import { MessageSquare } from 'lucide-react';
import { trackPageView, Analytics } from './utils/analytics';

// 重厚な3Dライブラリ(Three.js)を含むシミュレーターと管理画面をCode Splitting(遅延読込)して初期表示を劇的軽量化
const SimulatorPage = lazy(() => import('./pages/SimulatorPage'));
const StaffAdminPage = lazy(() => import('./pages/StaffAdminPage'));
const SaishinAdsPortalPanel = lazy(() => import('./components/SaishinAdsPortalPanel'));

// パスとルート識別子の相互変換マップ
const ROUTE_MAP = {
  'top': '/',
  'simulator': '/simulator',
  'plan-hobby': '/plan-hobby',
  'plan-storage': '/plan-storage',
  'plan-agri': '/plan-agri',
  'plan-workshop': '/plan-workshop',
  'case-studies': '/cases',
  'stories': '/stories',
  'saishin': '/saishin',
  'saishin-tech': '/saishin/technology',
  'saishin-spec': '/saishin/spec',
  'saishin-ads': '/saishin/ads',
  'eie': '/eie',
  're': '/re',
  'admin': '/admin'
};

const isLocalEnvironment = () => {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
};

const getRouteFromPath = (pathname) => {
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('design') || searchParams.has('d')) {
      return 'simulator';
    }

    // サブドメイン（lp.smile049.jp, eie.smile049.jp, re.smile049.jp）の判定
    const host = window.location.hostname.toLowerCase();
    const cleanPathCheck = (pathname || '').replace(/\/+$/, '').toLowerCase();
    if (host.startsWith('lp.smile049.jp')) {
      if (cleanPathCheck === '/technology' || cleanPathCheck === '/tech' || cleanPathCheck === '/saishin/technology') return 'saishin-tech';
      if (cleanPathCheck === '/spec' || cleanPathCheck === '/environment' || cleanPathCheck === '/saishin/spec') return 'saishin-spec';
      return 'saishin';
    }
    if (host.startsWith('eie.smile049.jp')) {
      return 'eie';
    }
    if (host.startsWith('re.smile049.jp')) {
      return 're';
    }
  }
  const cleanPath = (pathname || '').replace(/\/+$/, '').toLowerCase();
  if (!cleanPath || cleanPath === '') return 'top';
  if (cleanPath === '/simulator') return 'simulator';
  if (cleanPath === '/plan-hobby') return 'plan-hobby';
  if (cleanPath === '/plan-storage') return 'plan-storage';
  if (cleanPath === '/plan-agri') return 'plan-agri';
  if (cleanPath === '/plan-workshop') return 'plan-workshop';
  if (cleanPath === '/cases' || cleanPath === '/case-studies' || cleanPath === '/works' || cleanPath === '/case-01' || cleanPath === '/case-02' || cleanPath === '/casestudy01' || cleanPath === '/cases/01' || cleanPath === '/cases/02') return 'case-studies';
  if (cleanPath === '/stories' || cleanPath === '/story' || cleanPath === '/column' || cleanPath.startsWith('/column/') || cleanPath.startsWith('/stories/')) return 'stories';
  if (cleanPath === '/saishin/technology' || cleanPath === '/saishin/tech' || cleanPath === '/saishin/structure') return 'saishin-tech';
  if (cleanPath === '/saishin/spec' || cleanPath === '/saishin/specification' || cleanPath === '/saishin/environment') return 'saishin-spec';
  
  // 社外秘・広告管理ポータル: ローカル環境のみ許可（本番サーバー公開・外部アクセスは自動遮断）
  if (cleanPath === '/saishin/ads' || cleanPath === '/admin/saishin-ads' || cleanPath === '/saishin-ads') {
    if (isLocalEnvironment()) {
      return 'saishin-ads';
    }
    return 'top';
  }

  if (cleanPath === '/saishin' || cleanPath === '/lp/saishin' || cleanPath === '/saishin-no-ie') return 'saishin';
  if (cleanPath === '/eie' || cleanPath === '/realestate' || cleanPath === '/fudosan') return 'eie';
  if (cleanPath === '/re' || cleanPath === '/renovation' || cleanPath === '/reform') return 're';
  if (cleanPath === '/admin') return 'admin';
  return 'top';
};

const getPathFromRoute = (route) => {
  return ROUTE_MAP[route] || '/';
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      return getRouteFromPath(window.location.pathname);
    }
    return 'top';
  });
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [customerModelData, setCustomerModelData] = useState(null);

  // ブラウザの「戻る」「進む」ボタン操作（popstate）の検知と画面同期
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromPath(window.location.pathname);
      setCurrentRoute(route);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ルート変更時に100%確実にページ最上部（Y=0）へ即座にスクロールリセット ＆ タイトルを動的更新
  useEffect(() => {
    window.scrollTo(0, 0);

    const titleMap = {
      'top': '木造自由設計ガレージ・倉庫【スマイチ】関東・埼玉｜3Dシミュレーション＆自動見積もりで敷地にジャストフィット',
      'simulator': '無料3Dシミュレーター＆自動見積もり｜木造自由設計ガレージ【スマイチ】埼玉・関東',
      'plan-hobby': '愛車・大型バイク・ホビーガレージ｜木造自由設計【スマイチ】大人の秘密基地',
      'plan-storage': '狭小地・変形地ストッカー倉庫｜木造自由設計【スマイチ】敷地境界ぴったり特注設計',
      'plan-agri': '農機具・トラクター大型倉庫（アグリシェッド）｜木造自由設計【スマイチ】市街化調整区域対応',
      'plan-workshop': '15m無柱大空間・スタジオ・道場・事業用倉庫｜木造自由設計【スマイチ】木造トラス構法',
      'case-studies': '【施工実例】市街化調整区域・境界15cm・特注寸法 木造自由設計ガレージ｜スマイチ',
      'stories': '木造自由設計ガレージ物語（公式WEB連載コラム）｜スマイチ',
      'saishin': '【公式LP】再進の家｜鳩山ニュータウン 2,180万円・ほぼ光熱費0円・HEAT20 G2高性能再生住宅',
      'saishin-tech': '【技術レポート】再進の家｜建築士と大工による躯体・スケルトン再生と構造計算エビデンス',
      'saishin-spec': '【物件スペック】再進の家｜HEAT20 G2温熱データ・周辺環境と生活網・物件詳細概要',
      'saishin-ads': '【広告ポータル】再進の家｜Facebook/Instagram/Threads 広告・SNSマーケティング',
      'eie': 'スマイチ不動産 (EIE)｜中古戸建×リノベ・土地探し×ガレージ・自社預かり土地5区画',
      're': 'スマイチ リフォーム (RE)｜新築以上の性能を3/4価格で実現するフルスケルトン高断熱再生',
      'admin': '専任スタッフ管理ポータル｜スマイチ'
    };

    const descriptionMap = {
      'top': 'あと少し大きく、あと少し小さく。規格サイズに土地を合わせるのではなく、敷地に合わせて自分で描く木造自由設計ガレージ・倉庫【スマイチ】。登録不要の3Dシミュレーターで概算金額・パースを即時自動見積もり。関東・埼玉県全域対応、変形地・狭小地・市街化調整区域もワンストップ対応。',
      'simulator': '会員登録不要・無料。敷地寸法・変形地に合わせて1mm単位で自分で間口・奥行き・高さを自由に変更でき、概算建築費用をリアルタイム自動見積もりできるスマイチ3Dシミュレーター。',
      'plan-hobby': '愛車・大型バイク・工具・書斎・ロフトスペースを備えた木造自由設計ホビーガレージ。結露や湿気を抑える木造断熱構造で、大人の秘密基地を実現。',
      'plan-storage': '敷地境界15cm・台形地・三角地・旗竿地にジャストフィットする木造特注ストッカー倉庫。軒ゼロ設計・変形地対応で敷地の余白を無駄なく最大活用。',
      'plan-agri': 'トラクター・コンバインの作業動線から逆算する木造アグリシェッド（大型農業用倉庫）。市街化調整区域の建築許可・農地転用・確認申請まで一括代行。',
      'plan-workshop': '木造トラス構法による15m無柱大空間。スタジオ・道場・配送デポ・事業用倉庫・作業場を鉄骨造より低コスト・短工期で実現。',
      'case-studies': '【施工実例】市街化調整区域・敷地境界15cm・既存アスファルト活用など、大手規格品で断られた厳しい条件を解決した木造自由設計ガレージの施工写真・図面・ドキュメンタリー。',
      'stories': '木造自由設計ガレージ物語。収納・敷地変形・確認申請・コストなど、実際のお客様の課題解決ストーリーと役立つ建築コラム。',
      'saishin': '【公式LP】再進の家｜鳩山ニュータウン 2,180万円（税込）。HEAT20 G2超高断熱・ほぼ光熱費0円・建築士と大工さんが躯体から生まれ変わらせた技術で裏付けられた安心の終の住処。3D間取り＆360度WEB内覧公開中。',
      'saishin-tech': '【技術レポート】再進の家｜建築士と大工によるフルスケルトン金物補強・屋根遮熱通気銀次郎・APW430トリプルガラス樹脂窓・インフラ完全更新の工学エビデンス。',
      'saishin-spec': '【物件スペック】再進の家｜HEAT20 G2温熱シミュレーションデータ（無暖房で朝15℃キープ）、鳩山ニュータウン周辺環境の正直な事実と生活網、詳細物件概要。',
      'saishin-ads': '【広告ポータル】再進の家｜Facebook/Instagram/Threads 広告・SNSマーケティング。Meta広告特別カテゴリ完全準拠・ターゲット自己選定クリエイティブ集。',
      'eie': 'スマイチ不動産 (EIE)｜中古戸建×リノベ・土地探し×ガレージ。ガレージを建てられる広い土地探しから預かり売り地情報までワンストップ対応。',
      're': 'スマイチ リフォーム (RE)｜新築の2/3〜半額で新築以上の暖かさと耐震性を実現するフルスケルトン高断熱再生リノベーション。',
      'admin': '専任スタッフ管理ポータル｜スマイチ'
    };

    if (titleMap[currentRoute]) {
      document.title = titleMap[currentRoute];
    }

    const currentPath = getPathFromRoute(currentRoute);
    const currentUrl = `https://smile049.jp${currentPath === '/' ? '' : currentPath}`;

    // 動的Canonical・Description・OGP同期
    const canonicalElem = document.getElementById('canonical-url');
    if (canonicalElem) canonicalElem.setAttribute('href', currentUrl);

    const descElem = document.getElementById('meta-description');
    if (descElem && descriptionMap[currentRoute]) {
      descElem.setAttribute('content', descriptionMap[currentRoute]);
    }

    const ogUrlElem = document.getElementById('og-url');
    if (ogUrlElem) ogUrlElem.setAttribute('content', currentUrl);

    const ogTitleElem = document.getElementById('og-title');
    if (ogTitleElem && titleMap[currentRoute]) ogTitleElem.setAttribute('content', titleMap[currentRoute]);

    const ogDescElem = document.getElementById('og-description');
    if (ogDescElem && descriptionMap[currentRoute]) ogDescElem.setAttribute('content', descriptionMap[currentRoute]);

    // Google Analytics 4 (GA4) 仮想ページビュー送信
    const pageTitle = titleMap[currentRoute] || document.title;
    trackPageView(currentPath, pageTitle);
  }, [currentRoute]);

  const handleRouteNavigation = (route) => {
    if (route === 'chat') {
      Analytics.trackChatOpen('navigation');
      setIsChatModalOpen(true);
      return;
    }
    const newPath = getPathFromRoute(route);
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    window.scrollTo(0, 0);
    setCurrentRoute(route);
  };

  const isLp = currentRoute === 'saishin' || currentRoute === 'saishin-tech' || currentRoute === 'saishin-spec' || currentRoute === 'saishin-ads' || currentRoute === 'eie' || currentRoute === 're';

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 共通チャットモーダル */}
      <ChatRoomModal 
        isOpen={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)} 
      />

      {/* 共通ヘッダー（シミュレーター画面およびLP特設画面時は非表示） */}
      {currentRoute !== 'simulator' && !isLp && (
        <Header currentRoute={currentRoute} setCurrentRoute={handleRouteNavigation} onOpenChat={() => setIsChatModalOpen(true)} />
      )}

      {/* メインコンテンツ切り替え */}
      <main style={{ flex: 1 }}>
        {currentRoute === 'top' && <TopPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-hobby' && <PlanHobbyPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-storage' && <PlanStoragePage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-agri' && <PlanAgriPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-workshop' && <PlanWorkshopPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'case-studies' && <CaseStudiesPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'stories' && <StoryPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'saishin' && <SaishinLpPage onNavigate={handleRouteNavigation} />}
        {currentRoute === 'saishin-tech' && <SaishinTechPage onNavigate={handleRouteNavigation} />}
        {currentRoute === 'saishin-spec' && <SaishinSpecPage onNavigate={handleRouteNavigation} />}
        {currentRoute === 'saishin-ads' && (
          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>広告ポータルを読み込み中...</div>}>
            <SaishinAdsPortalPanel />
          </Suspense>
        )}
        {currentRoute === 'eie' && <EieRealEstatePage onNavigate={handleRouteNavigation} />}
        {currentRoute === 're' && <ReRenovationPage onNavigate={handleRouteNavigation} />}
        {currentRoute === 'simulator' && (
          <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#ffffff' }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#38bdf8' }}>3Dシミュレーターを準備中...</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>ミリ単位の自由設計・自動積算エンジンを起動しています</div>
            </div>
          }>
            <SimulatorPage 
              setCurrentRoute={handleRouteNavigation} 
              externalModelData={customerModelData}
            />
          </Suspense>
        )}
        {currentRoute === 'admin' && (
          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>管理ポータルを読み込み中...</div>}>
            <StaffAdminPage 
              setCurrentRoute={handleRouteNavigation}
              onLoadCustomerModel={(model) => {
                setCustomerModelData(model);
                handleRouteNavigation('simulator');
              }}
            />
          </Suspense>
        )}
      </main>

      {/* シミュレーター画面、管理画面、LP画面以外で共通フッターを表示 */}
      {currentRoute !== 'simulator' && currentRoute !== 'admin' && !isLp && (
        <Footer setCurrentRoute={handleRouteNavigation} />
      )}

      {/* 画面右下固定の「💬 無料相談チャット」フローティングボタン */}
      {currentRoute !== 'simulator' && currentRoute !== 'admin' && !isLp && (
        <button
          onClick={() => {
            Analytics.trackChatOpen('floating_button');
            setIsChatModalOpen(true);
          }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 90,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '12px 20px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 700,
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          title="質問・相談チャットを開く"
        >
          <MessageSquare size={18} />
          <span>無料相談チャット</span>
        </button>
      )}
    </div>
  );
}
