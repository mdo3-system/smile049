import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TopPage from './pages/TopPage';
import PlanHobbyPage from './pages/PlanHobbyPage';
import PlanStoragePage from './pages/PlanStoragePage';
import PlanAgriPage from './pages/PlanAgriPage';
import SimulatorPage from './pages/SimulatorPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('top');

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 共通ヘッダー（シミュレーター時もコンパクトに表示し他ページへの導線を維持） */}
      <Header currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />

      {/* メインコンテンツ切り替え */}
      <main style={{ flex: 1 }}>
        {currentRoute === 'top' && <TopPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'plan-hobby' && <PlanHobbyPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'plan-storage' && <PlanStoragePage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'plan-agri' && <PlanAgriPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'simulator' && <SimulatorPage setCurrentRoute={setCurrentRoute} />}
      </main>

      {/* シミュレーター画面以外で共通フッターを表示 */}
      {currentRoute !== 'simulator' && <Footer setCurrentRoute={setCurrentRoute} />}
    </div>
  );
}
