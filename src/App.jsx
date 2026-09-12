import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TopPage from './pages/TopPage';
import PlanHobbyPage from './pages/PlanHobbyPage';
import PlanStoragePage from './pages/PlanStoragePage';
import PlanAgriPage from './pages/PlanAgriPage';
import SimulatorPage from './pages/SimulatorPage';
import StaffAdminPage from './pages/StaffAdminPage';
import ChatRoomModal from './components/ChatRoomModal';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('top');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [customerModelData, setCustomerModelData] = useState(null);

  // ルート変更時に100%確実にページ最上部（Y=0）へ即座にスクロールリセット
  useEffect(() => {
    window.scrollTo(0, 0);
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
        <Header currentRoute={currentRoute} setCurrentRoute={handleRouteNavigation} />
      )}

      {/* メインコンテンツ切り替え */}
      <main style={{ flex: 1 }}>
        {currentRoute === 'top' && <TopPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-hobby' && <PlanHobbyPage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-storage' && <PlanStoragePage setCurrentRoute={handleRouteNavigation} />}
        {currentRoute === 'plan-agri' && <PlanAgriPage setCurrentRoute={handleRouteNavigation} />}
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
    </div>
  );
}
