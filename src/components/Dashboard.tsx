import React from 'react';
import { Search, Clock, Trash2, ArrowRight, TrendingUp, Compass } from 'lucide-react';
import type { Analysis, User } from '../types';

interface DashboardProps {
  user: User;
  analyses: Analysis[];
  onNewAnalysisClick: () => void;
  onSelectAnalysis: (analysis: Analysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onSuggestionClick: (query: string) => void;
  loadingHistory: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  analyses,
  onNewAnalysisClick,
  onSelectAnalysis,
  onDeleteAnalysis,
  onSuggestionClick,
  loadingHistory
}) => {
  const suggestions = [
    "Generative AI Agent Trends",
    "Solid State EV Batteries",
    "Sustainable Bio-Plastics 2026",
    "Apple Vision Pro 2 Adoption",
    "Web3 Decoupled Architectures"
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* Greetings Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        marginTop: '1rem'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
          color: 'white',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800
        }}>
          Welcome Back, <span style={{ color: 'var(--primary)' }}>{user.name}</span>
        </h2>
        <p style={{ color: 'var(--neutral-mid)', fontSize: '1rem' }}>
          Execute deep social analysis parallelly or review your historical findings.
        </p>
      </div>

      {/* Grid: Actions & Dynamic Suggestions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Start Analysis Trigger */}
        <div 
          onClick={onNewAnalysisClick} 
          className="card-glass" 
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem 2rem',
            border: '2px dashed var(--border-glass)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-glass)';
          }}
        >
          <div style={{
            padding: '1rem',
            borderRadius: '50%',
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Search size={32} />
          </div>
          <h3 style={{ color: 'white', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Start New Audit</h3>
          <p style={{ color: 'var(--neutral-mid)', fontSize: '0.88rem', textAlign: 'center' }}>
            Run real-time concurrent scraping queries across all active platform indexes.
          </p>
        </div>

        {/* Suggestions Autocomplete */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
            <Compass size={20} />
            <h3 style={{ color: 'white', fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>Trending Queries</h3>
          </div>
          <p style={{ color: 'var(--neutral-mid)', fontSize: '0.85rem' }}>
            Select a suggested trend parameter to launch a sandbox Deep Analysis instantly:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {suggestions.map((query, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(query)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.65rem 0.8rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--neutral-high)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.88rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-glow)';
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={14} style={{ color: 'var(--secondary)' }} />
                  <span>{query}</span>
                </div>
                <ArrowRight size={14} style={{ opacity: 0.6 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Analyses lists */}
      <div className="card-glass" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Clock size={20} style={{ color: 'var(--primary)' }} />
          <h3 style={{ color: 'white', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
            Your Persistent Analysis History
          </h3>
        </div>

        {loadingHistory ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: '1rem' }}>
            <div className="spinner-lean" style={{ width: '36px', height: '36px' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--neutral-mid)' }}>Synchronizing with Supabase database...</span>
          </div>
        ) : analyses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            color: 'var(--neutral-mid)',
            background: 'rgba(0, 0, 0, 0.15)',
            border: '1px solid var(--border-glass)',
            borderRadius: '10px'
          }}>
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>No past analyses found associated with your account.</p>
            <button onClick={onNewAnalysisClick} className="btn-lean btn-lean-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}>
              Conduct First Search
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {analyses.map((analysis) => (
              <div 
                key={analysis.id || analysis.created_at} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.2rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
                className="history-row"
              >
                <div>
                  <h4 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    "{analysis.query}"
                  </h4>
                  <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.8rem', color: 'var(--neutral-mid)' }}>
                    <span>📅 {new Date(analysis.created_at).toLocaleString()}</span>
                    <span>🔍 {analysis.source_count} sources analyzed</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button 
                    onClick={() => onSelectAnalysis(analysis)} 
                    className="btn-lean btn-lean-outline" 
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    Load Report
                  </button>
                  <button 
                    onClick={() => analysis.id && onDeleteAnalysis(analysis.id)} 
                    className="btn-lean btn-lean-danger" 
                    style={{ padding: '0.45rem', borderRadius: '8px' }}
                    title="Delete permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .history-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .history-row > div:nth-child(2) {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};
