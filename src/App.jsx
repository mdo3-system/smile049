import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TopPage from './pages/TopPage';
import PlanHobbyPage from './pages/PlanHobbyPage';
import PlanStoragePage from './pages/PlanStoragePage';
import PlanAgriPage from './pages/PlanAgriPage';
import PlanWorkshopPage from './pages/PlanWorkshopPage';
import SimulatorPage from './pages/SimulatorPage';
import StaffAdminPage from './pages/StaffAdminPage';
import ChatRoomModal from './components/ChatRoomModal';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('top');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [customerModelData, setCustomerModelData] = useState(null);

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
      'admin': '専任スタッフ管理ポータル｜スマイチ'
    };

    if (titleMap[currentRoute]) {
      document.title = titleMap[currentRoute];
    }
  }, [currentRoute]);

  const handleRouteNavigation = (route) => {
    if (route === 'chat') {
      setIsChatModalOpen(true);
      return;
    }
    window.scrollTo(0, 0);
    setCurrentRoute(route);
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 共通チャットモーダル */}
      <ChatRoomModal 
        isOpen={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)} 
      />

      {/* 共通ヘッダー（シミュレーター画面時は3Dモデルを最大表示するため専用極薄バーにする） */}
      {currentRoute !== 'simulator' && (
        <Header currentRoute={currentRoute} setCurrentRoute={handleRouteNavigation} onOpenChat={() => setIsChatModalOpen(true)} />
      )}

      {/* メインコンテンツ切り替え */}
      <main style={{ flex: 1 }}>
        {currentRoute === 'top' && <TopPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-hobby' && <PlanHobbyPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-storage' && <PlanStoragePage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-agri' && <PlanAgriPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-workshop' && <PlanWorkshopPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'simulator' && (
          <SimulatorPage 
            setCurrentRoute={handleRouteNavigation} 
            externalModelData={customerModelData}
          />
        )}
        {currentRoute === 'admin' && (
          <StaffAdminPage 
            setCurrentRoute={handleRouteNavigation}
            onLoadCustomerModel={(model) => {
              setCustomerModelData(model);
              setCurrentRoute('simulator');
            }}
          />
        )}
      </main>

      {/* シミュレーター画面および管理画面以外で共通フッターを表示 */}
      {currentRoute !== 'simulator' && currentRoute !== 'admin' && (
        <Footer setCurrentRoute={handleRouteNavigation} />
      )}

      {/* 画面右下固定の「💬 無料相談チャット」フローティングボタン（シミュレーター・管理画面以外） */}
      {currentRoute !== 'simulator' && currentRoute !== 'admin' && (
        <button
          onClick={() => setIsChatModalOpen(true)}
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
