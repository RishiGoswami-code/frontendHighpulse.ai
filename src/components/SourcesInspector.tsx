import React from 'react';
import { 
  Database, 
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Eye
} from 'lucide-react';
import type { ScrapedSource } from '../types';

interface SourcesInspectorProps {
  sources: ScrapedSource[] | undefined;
}

export const SourcesInspector: React.FC<SourcesInspectorProps> = ({ sources }) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'reddit' | 'youtube' | 'wikipedia' | 'web'>('all');
  const [inspectorOpen, setInspectorOpen] = React.useState(false);

  if (!sources || sources.length === 0) {
    return (
      <div className="card-glass" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--neutral-mid)' }}>
        ℹ️ Scraped data source lineage not loaded for this analysis session.
      </div>
    );
  }

  const filteredSources = sources.filter(source => {
    if (activeTab === 'all') return true;
    return source.platform === activeTab;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'reddit':
        return <span style={{ color: '#FF4500', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>Reddit</span>;
      case 'youtube':
        return <span style={{ color: '#FF0000', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>YouTube</span>;
      case 'wikipedia':
        return <span style={{ color: '#CCCCCC', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>Wiki</span>;
      default:
        return <span style={{ color: '#3b82f6', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>Web</span>;
    }
  };

  return (
    <div className="card-glass" style={{
      marginTop: '2rem',
      borderColor: inspectorOpen ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-glass)',
      background: 'rgba(10, 10, 15, 0.85)'
    }}>
      {/* Accordion Toggle Header */}
      <div 
        onClick={() => setInspectorOpen(!inspectorOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Database size={20} style={{ color: 'var(--secondary)' }} />
          <h3 style={{ color: 'white', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
            Sources Inspector & Data Drill-Down
          </h3>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.15rem 0.5rem',
            background: 'var(--secondary-glow)',
            color: 'var(--secondary)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            fontWeight: 600
          }}>
            {sources.length} Items Scraped
          </span>
        </div>
        <span style={{ fontSize: '0.9rem', color: 'var(--neutral-mid)' }}>
          {inspectorOpen ? 'Collapse ➖' : 'Expand Data Lineage ➕'}
        </span>
      </div>

      {inspectorOpen && (
        <div style={{ marginTop: '1.5rem', animation: 'slideDown 0.3s ease' }}>
          <p style={{ color: 'var(--neutral-mid)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
            HighPulse.ai grounds Gemini's analyses exclusively in the following content streams. Click any item to explore its verified source link:
          </p>

          {/* Filtering Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {(['all', 'reddit', 'youtube', 'wikipedia', 'web'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  background: activeTab === tab ? 'var(--secondary-glow)' : 'transparent',
                  border: '1px solid',
                  borderColor: activeTab === tab ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                  color: activeTab === tab ? 'var(--secondary)' : 'var(--neutral-mid)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid/Flex Sources list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {filteredSources.map((source, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '1.2rem',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                {/* Meta details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '4px',
                      color: 'white',
                      border: '1px solid var(--border-glass)'
                    }}>
                      {getPlatformIcon(source.platform)}
                    </span>
                    {source.author && <span style={{ fontSize: '0.8rem', color: 'var(--neutral-mid)' }}>👤 {source.author}</span>}
                    {source.channel && <span style={{ fontSize: '0.8rem', color: 'var(--neutral-mid)' }}>📺 {source.channel}</span>}
                  </div>
                  
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.8rem',
                      color: 'var(--secondary)',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    <span>View Origin</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Content title */}
                <h4 style={{ color: 'white', fontSize: '0.98rem', fontWeight: 600, lineHeight: 1.4 }}>
                  {source.title}
                </h4>

                {/* Snippet */}
                {(source.content || source.summary) && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--neutral-mid)',
                    background: 'rgba(0, 0, 0, 0.15)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.02)',
                    lineHeight: 1.5,
                    fontStyle: 'italic'
                  }}>
                    {source.content || source.summary}
                  </p>
                )}

                {/* Metrics */}
                <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.8rem', color: 'var(--neutral-mid)', borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                  {source.upvotes !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ThumbsUp size={12} /> Upvotes: <strong>{source.upvotes}</strong>
                    </span>
                  )}
                  {source.likes !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ThumbsUp size={12} /> Likes: <strong>{source.likes}</strong>
                    </span>
                  )}
                  {source.views !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Eye size={12} /> Views: <strong>{source.views.toLocaleString()}</strong>
                    </span>
                  )}
                  {source.comments !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MessageSquare size={12} /> Comments: <strong>{source.comments}</strong>
                    </span>
                  )}
                  {source.comments_count !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MessageSquare size={12} /> Comments: <strong>{source.comments_count}</strong>
                    </span>
                  )}
                  {source.created && <span>📅 {source.created}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
