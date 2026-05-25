import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-glass)',
      background: 'rgba(9, 9, 11, 0.9)',
      padding: '2.5rem 1.5rem 2rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1250px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.2rem'
      }}>
        <div>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: 'white',
            fontFamily: 'var(--font-heading)'
          }}>
            HighPulse<span style={{ color: 'var(--primary)' }}>.ai</span>
          </span>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--neutral-mid)',
            marginTop: '0.25rem'
          }}>
            © {new Date().getFullYear()} HighPulse Social Intelligence Platform. All rights reserved.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <a href="#" style={{ color: 'var(--neutral-mid)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--neutral-mid)'}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--neutral-mid)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--neutral-mid)'}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--neutral-mid)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--neutral-mid)'}>API Status</a>
        </div>
      </div>
    </footer>
  );
};
