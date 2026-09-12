import React, { useState } from 'react';
import { Home, Compass, Layers, Wrench, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Header({ currentRoute, setCurrentRoute }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'top', label: 'トップ', icon: Home },
    { id: 'plan-hobby', label: '愛車・ホビーガレージ', planNum: '01' },
    { id: 'plan-storage', label: '狭小・変形地ストッカー', planNum: '02' },
    { id: 'plan-agri', label: '農機具アグリシェッド', planNum: '03' },
  ];

  const handleNav = (routeId) => {
    setCurrentRoute(routeId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(251, 250, 248, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* ブランドロゴ */}
        <div 
          onClick={() => handleNav('top')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Home size={22} />
          </div>
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-wood)',
              letterSpacing: '0.08em'
            }}>
              木造自由設計ガレージ・倉庫
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: 'var(--text-main)',
              fontFamily: 'var(--font-family-heading)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              スマイチ ガレージ
            </div>
          </div>
        </div>

        {/* デスクトップナビ */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--text-main)',
                  background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {item.planNum && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-wood)',
                    background: isActive ? '#fff' : 'var(--color-wood-light)',
                    padding: '2px 6px',
                    borderRadius: 4
                  }}>
                    P{item.planNum}
                  </span>
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 右側CTA（3Dシミュレーター直通） */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => handleNav('simulator')}
            className="btn-accent"
            style={{
              padding: '10px 20px',
              fontSize: 14,
              boxShadow: '0 3px 12px rgba(224, 122, 95, 0.35)'
            }}
          >
            <Compass size={17} />
            <span>3Dシミュレーターを開く</span>
          </button>

          {/* モバイルハンバーガー */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              padding: 8,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              background: 'var(--bg-muted)'
            }}
            aria-label="メニューを開く"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* モバイルドロワー */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: 'var(--shadow-md)'
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 15,
                fontWeight: currentRoute === item.id ? 700 : 500,
                color: currentRoute === item.id ? 'var(--color-primary)' : 'var(--text-main)',
                background: currentRoute === item.id ? 'var(--color-primary-soft)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{item.label}</span>
              <ArrowRight size={16} opacity={0.5} />
            </button>
          ))}
          <button
            onClick={() => handleNav('simulator')}
            className="btn-accent"
            style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
          >
            <Compass size={18} />
            <span>無料3Dシミュレーターを起動</span>
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
