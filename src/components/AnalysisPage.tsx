import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  BarChart, 
  Calendar,
  MessageSquare,
  Download,
  AlertTriangle,
  FileSearch
} from 'lucide-react';
import type { Analysis } from '../types';
import { SourcesInspector } from './SourcesInspector';

const parseLineInlineElements = (lineText: string) => {
  // Matches bold markings (**bold**) and markdown anchors ([text](url))
  const tokenRegex = /(\*\*.*?\*\*|\[.*?\]\(https?:\/\/.*?\))/g;
  const parts = lineText.split(tokenRegex);
  
  return parts.map((part, index) => {
    // 1. Highlight Bold Words
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} style={{ color: 'var(--neutral-high)', fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    
    // 2. Render Citations
    if (part.startsWith('[') && part.includes('](')) {
      const match = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/.exec(part);
      if (match) {
        const linkText = match[1];
        const linkUrl = match[2];
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--secondary)',
              textDecoration: 'underline',
              fontWeight: 600,
              margin: '0 0.2rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
          >
            {linkText}
          </a>
        );
      }
    }
    
    // 3. Render Normal Text
    return part;
  });
};

const renderFormattedText = (text: string) => {
  if (!text) return null;

  const lines = text.split('\n');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ height: '0.4rem' }} />;
        
        // A. Parse Section Headers: ### Header
        if (trimmed.startsWith('###')) {
          const headerText = trimmed.replace(/^###\s*/, '');
          return (
            <h4 
              key={idx} 
              style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--neutral-high)',
                marginTop: '1.4rem',
                marginBottom: '0.5rem',
                borderLeft: '4px solid var(--secondary)',
                paddingLeft: '0.75rem',
                letterSpacing: '0.02em'
              }}
            >
              {parseLineInlineElements(headerText)}
            </h4>
          );
        }
        
        // B. Parse Bullet Points: - Item
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const itemText = trimmed.replace(/^[-*]\s*/, '');
          return (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '0.6rem', 
                paddingLeft: '1rem',
                fontSize: '0.96rem',
                lineHeight: '1.55',
                color: 'var(--neutral-mid)'
              }}
            >
              <span style={{ color: 'var(--secondary)', fontWeight: 'bold', marginTop: '0.1rem' }}>•</span>
              <span>{parseLineInlineElements(itemText)}</span>
            </div>
          );
        }

        // C. Standard Paragraph
        return (
          <p 
            key={idx} 
            style={{ 
              fontSize: '0.98rem',
              lineHeight: '1.65', 
              color: 'var(--neutral-mid)',
              margin: 0,
              textAlign: 'justify'
            }}
          >
            {parseLineInlineElements(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

interface AnalysisPageProps {
  analysis: Analysis | null;
  onAnalyze: (query: string) => void;
  onOpenChat: () => void;
  onExport: () => void;
  loading: boolean;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  analysis,
  onAnalyze,
  onOpenChat,
  onExport,
  loading
}) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onAnalyze(query.trim());
    }
  };

  // Extract sentiment percentages (e.g. "Positive: 58%, Neutral: 27%, Negative: 15%")
  const extractSentiment = () => {
    if (!analysis) return { pos: 50, neu: 30, neg: 20, raw: '' };
    const text = analysis.analysis.sentiment_analysis;
    
    let pos = 50, neu = 30, neg = 20;
    try {
      const posMatch = text.match(/Positive:?\s*(\d+)%/i);
      const neuMatch = text.match(/Neutral:?\s*(\d+)%/i);
      const negMatch = text.match(/Negative:?\s*(\d+)%/i);
      
      if (posMatch) pos = parseInt(posMatch[1]);
      if (neuMatch) neu = parseInt(neuMatch[1]);
      if (negMatch) neg = parseInt(negMatch[1]);
      
      // Ensure they total 100
      const total = pos + neu + neg;
      if (total !== 100 && total > 0) {
        pos = Math.round((pos / total) * 100);
        neu = Math.round((neu / total) * 100);
        neg = 100 - pos - neu;
      }
    } catch (e) {
      console.warn("Failed to extract sentiment ratios from text", e);
    }
    return { pos, neu, neg, raw: text };
  };

  const { pos, neu, neg, raw: sentimentText } = extractSentiment();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>
      
      {/* Search Input Bar */}
      <div className="card-glass" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <FileSearch size={18} style={{
              position: 'absolute',
              top: '50%',
              left: '1rem',
              transform: 'translateY(-50%)',
              color: 'var(--neutral-mid)'
            }} />
            <input 
              type="text" 
              className="input-lean" 
              placeholder="What topic, brand, or innovation would you like to audit?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '2.8rem', height: '50px' }}
              disabled={loading}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-lean btn-lean-primary" 
            style={{ height: '50px', padding: '0 2rem' }}
            disabled={loading}
          >
            {loading ? 'Executing Parallel Audits...' : 'Launch Deep Analysis'}
          </button>
        </form>
      </div>

      {/* Loading Dashboard State */}
      {loading && (
        <div className="card-glass" style={{
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div className="spinner-lean"></div>
          
          <div>
            <h3 style={{ color: 'white', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
              Executing Concurrent Scrapes
            </h3>
            <p style={{ color: 'var(--neutral-mid)', maxWidth: '520px', margin: '0 auto', fontSize: '0.92rem' }}>
              HighPulse backend is firing asynchronous requests in parallel across YouTube, Reddit, Wikipedia, Google Trends, and Web Search indexes to bypass network overheads.
            </p>
          </div>

          {/* Parallel Platform Status indicators */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '600px'
          }}>
            {['reddit', 'youtube', 'wikipedia', 'web', 'google_trends'].map((platform, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '30px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.82rem',
                  color: 'white',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
              >
                <span className="dot-pulse" style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'inline-block'
                }}></span>
                <span>{platform.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Showcase View */}
      {analysis && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Metadata block */}
          <div className="card-glass" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            borderLeft: '4px solid var(--primary)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Social Audit Report
              </span>
              <h2 style={{ fontSize: '1.8rem', color: 'white', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>
                "{analysis.query}"
              </h2>
              <div style={{ display: 'flex', gap: '1.2rem', color: 'var(--neutral-mid)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> {new Date(analysis.created_at || Date.now()).toLocaleString()}
                </span>
                <span>📊 {analysis.source_count} items analyzed</span>
              </div>
            </div>

            {/* Export and Action buttons */}
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button onClick={onExport} className="btn-lean btn-lean-outline">
                <Download size={16} />
                <span>Export Report</span>
              </button>
              
              <button onClick={onOpenChat} className="btn-lean btn-lean-primary">
                <MessageSquare size={16} />
                <span>Chat with Gemini</span>
              </button>
            </div>
          </div>

          {/* Elegant Sticky Table of Contents Header-Bar */}
          <div className="card-glass" style={{
            position: 'sticky',
            top: '0.8rem',
            zIndex: 10,
            padding: '0.8rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            overflowX: 'auto',
            backdropFilter: 'blur(20px)',
            background: 'rgba(15, 10, 30, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            scrollbarWidth: 'none'
          }}>
            <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              <Sparkles size={14} /> Quick Jumps:
            </span>
            <a href="#overview" className="toc-link" style={navLinkStyle}>📖 Overview</a>
            <a href="#commercial" className="toc-link" style={navLinkStyle}>💼 Commercial</a>
            <a href="#opinions" className="toc-link" style={navLinkStyle}>👥 Public Opinion</a>
            <a href="#sentiment" className="toc-link" style={navLinkStyle}>❤️ Sentiment</a>
            <a href="#trends" className="toc-link" style={navLinkStyle}>📈 Trends</a>
          </div>

          {/* Unified Cascading Detailed Executive Report */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. OVERVIEW SECTION */}
            <div id="overview" className="card-glass" style={{ padding: '2.5rem', scrollMarginTop: '6rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <Sparkles size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ color: 'white', fontSize: '1.45rem', fontFamily: 'var(--font-heading)', margin: 0, fontWeight: 700 }}>
                  Detailed Topic Overview & Anatomy
                </h3>
              </div>
              <div className="analysis-formatted" style={{ color: 'var(--neutral-mid)', whiteSpace: 'pre-line' }}>
                {renderFormattedText(analysis.analysis.detailed_explanation)}
              </div>
            </div>

            {/* 2. COMMERCIAL SECTION */}
            <div id="commercial" className="card-glass" style={{ padding: '2.5rem', scrollMarginTop: '6rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--secondary)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <TrendingUp size={22} style={{ color: 'var(--secondary)' }} />
                <h3 style={{ color: 'white', fontSize: '1.45rem', fontFamily: 'var(--font-heading)', margin: 0, fontWeight: 700 }}>
                  Commercial Appraisal & SWOT Matrix
                </h3>
              </div>
              <div className="analysis-formatted" style={{ color: 'var(--neutral-mid)', whiteSpace: 'pre-line' }}>
                {renderFormattedText(analysis.analysis.market_analysis)}
              </div>
            </div>

            {/* 3. PUBLIC OPINION SECTION */}
            <div id="opinions" className="card-glass" style={{ padding: '2.5rem', scrollMarginTop: '6rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#a78bfa' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <MessageSquare size={22} style={{ color: '#a78bfa' }} />
                <h3 style={{ color: 'white', fontSize: '1.45rem', fontFamily: 'var(--font-heading)', margin: 0, fontWeight: 700 }}>
                  Public Opinions & User Reception Audits
                </h3>
              </div>
              <div className="analysis-formatted" style={{ color: 'var(--neutral-mid)', whiteSpace: 'pre-line' }}>
                {renderFormattedText(analysis.analysis.public_opinion)}
              </div>
            </div>

            {/* 4. SENTIMENT LANDSCAPE */}
            <div id="sentiment" className="card-glass" style={{ padding: '2.5rem', scrollMarginTop: '6rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <BarChart size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ color: 'white', fontSize: '1.45rem', fontFamily: 'var(--font-heading)', margin: 0, fontWeight: 700 }}>
                  Consumer Emotional Sentiment Landscape
                </h3>
              </div>
              
              {/* Premium Progress Bar visualization */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--neutral-mid)', marginBottom: '0.6rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🟢 Positive: {pos}%</span>
                  <span style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🔵 Neutral: {neu}%</span>
                  <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🔴 Negative: {neg}%</span>
                </div>

                <div style={{
                  height: '24px',
                  borderRadius: '8px',
                  display: 'flex',
                  overflow: 'hidden',
                  border: '1px solid var(--border-glass)'
                }}>
                  <div style={{ width: `${pos}%`, background: 'linear-gradient(90deg, #10b981, var(--secondary))', transition: 'width 0.5s ease' }} title={`Positive: ${pos}%`}></div>
                  <div style={{ width: `${neu}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', transition: 'width 0.5s ease' }} title={`Neutral: ${neu}%`}></div>
                  <div style={{ width: `${neg}%`, background: 'linear-gradient(90deg, #ef4444, var(--accent))', transition: 'width 0.5s ease' }} title={`Negative: ${neg}%`}></div>
                </div>
              </div>

              <div className="analysis-formatted" style={{ color: 'var(--neutral-mid)', whiteSpace: 'pre-line' }}>
                {renderFormattedText(sentimentText)}
              </div>
            </div>

            {/* 5. TRENDS & PREDICTIONS */}
            <div id="trends" className="card-glass" style={{ padding: '2.5rem', scrollMarginTop: '6rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--secondary)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <TrendingUp size={22} style={{ color: 'var(--secondary)' }} />
                <h3 style={{ color: 'white', fontSize: '1.45rem', fontFamily: 'var(--font-heading)', margin: 0, fontWeight: 700 }}>
                  Market Interest Trends & Trajectory Predictions
                </h3>
              </div>

              {/* Display visual SVG trend chart if trends exist */}
              {analysis.google_trends && analysis.google_trends.trends && analysis.google_trends.trends.length > 0 ? (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '1.2rem', fontWeight: 600 }}>Interest Over Time (last 12 months)</h4>
                  
                  <svg viewBox="0 0 500 150" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                    
                    {(() => {
                      const data = analysis.google_trends.trends;
                      const points = data.map((d, index) => {
                        const x = (index / (data.length - 1)) * 500;
                        const y = 140 - (d.value / 100) * 120;
                        return `${x},${y}`;
                      }).join(' ');
                      
                      return (
                        <>
                          <polyline
                            fill="none"
                            stroke="url(#trendGradient)"
                            strokeWidth="4"
                            points={points}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polygon
                            fill="url(#areaGradient)"
                            points={`0,140 ${points} 500,140`}
                          />
                        </>
                      );
                    })()}

                    <defs>
                      <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--secondary)" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--neutral-mid)', marginTop: '0.8rem' }}>
                    <span>12 Months Ago</span>
                    <span>Current Interest</span>
                  </div>

                  {/* Related Queries */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                    {analysis.google_trends.top_related && analysis.google_trends.top_related.length > 0 && (
                      <div style={{
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '10px'
                      }}>
                        <h5 style={{ color: 'white', fontSize: '0.85rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.3rem' }}>Top Queries</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {analysis.google_trends.top_related.slice(0, 5).map((q, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--neutral-mid)' }}>
                              <span>{q.query}</span>
                              <span style={{ fontWeight: 600, color: 'white' }}>{q.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.google_trends.rising_related && analysis.google_trends.rising_related.length > 0 && (
                      <div style={{
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '10px'
                      }}>
                        <h5 style={{ color: 'white', fontSize: '0.85rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.3rem' }}>Rising Queries</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {analysis.google_trends.rising_related.slice(0, 5).map((q, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--neutral-mid)' }}>
                              <span>{q.query}</span>
                              <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>+{q.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  color: 'var(--neutral-mid)',
                  background: 'rgba(0,0,0,0.15)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  marginBottom: '1.5rem'
                }}>
                  <AlertTriangle size={24} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.9rem' }}>Interest trends could not be calculated. Google Trends API throttled or no matching interest recorded for this specific parameter.</p>
                </div>
              )}

              <div className="analysis-formatted" style={{ color: 'var(--neutral-mid)', whiteSpace: 'pre-line' }}>
                {renderFormattedText(analysis.analysis.trend_analysis)}
              </div>
            </div>

          </div>

          {/* Accordion Sources Inspector */}
          <SourcesInspector sources={analysis.scraped_sources} />

        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dot-pulse {
          animation: pulse 1.4s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.85); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .toc-link {
          color: var(--neutral-mid);
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .toc-link:hover {
          color: white !important;
          background: var(--primary-glow);
          border-color: rgba(124, 58, 237, 0.25);
        }
      `}</style>
    </div>
  );
};

const navLinkStyle: React.CSSProperties = {
  color: 'var(--neutral-mid)',
  fontSize: '0.88rem',
  fontWeight: 600,
  textDecoration: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap'
};
