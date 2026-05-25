import React from 'react';
import { BarChart3, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import type { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onHomeClick: () => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onHomeClick,
  currentView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header style={{
      background: 'rgba(9, 9, 11, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1250px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onHomeClick(); }} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'white',
            textDecoration: 'none',
            fontFamily: 'var(--font-heading)'
          }}
        >
          <BarChart3 size={28} style={{ color: 'var(--primary)' }} />
          <span>HighPulse<span style={{ color: 'var(--primary)' }}>.ai</span></span>
        </a>

        {/* Desktop Navigation Links */}
        {currentView === 'home' && (
          <nav style={{ display: 'flex', gap: '2rem' }} className="desktop-only">
            <a href="#features" style={navLinkStyle}>Features</a>
            <a href="#pricing" style={navLinkStyle}>Pricing</a>
            <a href="#about" style={navLinkStyle}>About</a>
          </nav>
        )}

        {/* Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-only">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)'
              }}>
                <User size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--neutral-high)' }}>
                  {user.name}
                </span>
              </div>
              <button 
                onClick={onLogoutClick} 
                className="btn-lean btn-lean-outline" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <button onClick={onLoginClick} className="btn-lean btn-lean-outline" style={{ padding: '0.5rem 1.1rem', fontSize: '0.9rem' }}>
                <LogIn size={16} />
                <span>Log In</span>
              </button>
              <button onClick={onSignupClick} className="btn-lean btn-lean-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                <span>Get Started</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'none'
          }}
          className="mobile-only-flex"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(9, 9, 11, 0.98)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          zIndex: 40
        }} className="mobile-only-flex">
          {currentView === 'home' && (
            <>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Features</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>Pricing</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>About</a>
            </>
          )}
          
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neutral-mid)', fontSize: '0.9rem' }}>
                  <User size={16} />
                  <span>Signed in as: <strong>{user.name}</strong></span>
                </div>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onLogoutClick(); }} 
                  className="btn-lean btn-lean-outline" 
                  style={{ width: '100%', padding: '0.6rem' }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} 
                  className="btn-lean btn-lean-outline" 
                  style={{ width: '100%', padding: '0.6rem' }}
                >
                  <LogIn size={16} />
                  <span>Log In</span>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onSignupClick(); }} 
                  className="btn-lean btn-lean-primary" 
                  style={{ width: '100%', padding: '0.6rem' }}
                >
                  <span>Get Started</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS overrides for responsive desktop/mobile display */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-only { display: flex !important; }
          .mobile-only-flex { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only-flex { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle: React.CSSProperties = {
  color: 'var(--neutral-mid)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  transition: 'color 0.2s',
  cursor: 'pointer'
};

const mobileNavLinkStyle: React.CSSProperties = {
  color: 'var(--neutral-high)',
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  padding: '0.2rem 0'
};
