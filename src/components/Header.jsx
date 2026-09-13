import React, { useState } from 'react';
import { Home, Compass, Layers, Wrench, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { APP_VERSION } from '../version.js';


export default function Header({ currentRoute, setCurrentRoute }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'top', label: 'トップ', icon: Home },
    { id: 'plan-hobby', label: '愛車・ホビー', planNum: '01' },
    { id: 'plan-storage', label: '狭小・変形地', planNum: '02' },
    { id: 'plan-agri', label: '農機具倉庫', planNum: '03' },
    { id: 'plan-workshop', label: '大空間・ホール', planNum: '04' },
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
      background: 'rgba(251, 250, 248, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        {/* ブランドロゴ */}
        <div 
          onClick={() => handleNav('top')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0
          }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Home size={20} />
          </div>
          <div>
            <div style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: 'var(--color-wood)',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              lineHeight: 1.2
            }}>
              <span>木造自由設計ガレージ・倉庫</span>
              <span style={{
                background: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
                fontSize: 9.5,
                padding: '1px 5px',
                borderRadius: 4,
                fontWeight: 800
              }}>
                v{APP_VERSION}
              </span>
            </div>
            <div style={{
              fontSize: 17,
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

        {/* デスクトップナビ（P01〜P04） */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  padding: '7px 11px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--text-main)',
                  background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  whiteSpace: 'nowrap'
                }}
              >
                {item.planNum && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: isActive ? '#fff' : 'var(--color-wood)',
                    background: isActive ? 'var(--color-primary)' : 'var(--color-wood-light)',
                    padding: '1px 5px',
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

        {/* 右側CTA（主役の3Dシミュレーターボタンを最優先強調） */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => handleNav('simulator')}
            className="btn-accent"
            style={{
              padding: '9px 20px',
              fontSize: 14,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(224, 122, 95, 0.38)',
              display: 'flex',
              alignItems: 'center',
              gap: 7
            }}
          >
            <Compass size={17} />
            <span>3Dシミュレーター（無料）</span>
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
