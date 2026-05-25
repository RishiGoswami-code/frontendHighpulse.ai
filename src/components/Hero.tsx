import React from 'react';
import { Rocket, PlayCircle, Eye, ShieldAlert, Cpu } from 'lucide-react';

interface HeroProps {
  onGetStartedClick: () => void;
  onWatchDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStartedClick, onWatchDemoClick }) => {
  return (
    <section style={{
      textAlign: 'center',
      padding: '5rem 0 4rem 0',
      position: 'relative'
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 5vw, 4rem)',
        lineHeight: 1.15,
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, #a78bfa 0%, #10b981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'var(--font-heading)',
        fontWeight: 800
      }}>
        Transform Social Data Into <br />
        <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Strategic Intelligence
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        color: 'var(--neutral-mid)',
        maxWidth: '780px',
        margin: '0 auto 2.5rem auto',
        lineHeight: 1.6
      }}>
        HighPulse.ai leverages cutting-edge artificial intelligence to perform concurrent deep-dives across Reddit, YouTube, Wikipedia, and Google Web indexes in parallel. Discover rising trends, inspect real-time consumer sentiment, and gain instant market clarity.
      </p>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '4rem',
        flexWrap: 'wrap'
      }}>
        <button onClick={onGetStartedClick} className="btn-lean btn-lean-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
          <Rocket size={18} />
          <span>Get Started Free</span>
        </button>
        <button onClick={onWatchDemoClick} className="btn-lean btn-lean-outline" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
          <PlayCircle size={18} style={{ color: 'var(--secondary)' }} />
          <span>Explore Sandbox</span>
        </button>
      </div>

      {/* Interactive Metrical Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto 4rem auto'
      }}>
        <div className="card-glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Cpu size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
            &lt; 3.0s
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--neutral-mid)', marginTop: '0.2rem' }}>
            Parallel Multi-Thread Scrapes
          </div>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Eye size={24} style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
            100%
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--neutral-mid)', marginTop: '0.2rem' }}>
            Source Level Traceability
          </div>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <ShieldAlert size={24} style={{ color: '#ec4899', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
            Grounded
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--neutral-mid)', marginTop: '0.2rem' }}>
            No-Hallucination AI Insights
          </div>
        </div>
      </div>
    </section>
  );
};
