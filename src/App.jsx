import React, { useState } from 'react';
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

  const handleRouteNavigation = (route) => {
    if (route === 'chat') {
      setIsChatModalOpen(true);
      return;
    }
    setCurrentRoute(route);
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 共通チャットモーダル */}
      <ChatRoomModal 
        isOpen={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)} 
      />

      {/* 共通ヘッダー */}
      <Header currentRoute={currentRoute} setCurrentRoute={handleRouteNavigation} />

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
