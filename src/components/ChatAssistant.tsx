import React from 'react';
import { Send, Sparkles, X, Cpu } from 'lucide-react';
import type { ChatMessage, Analysis } from '../types';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: Analysis | null;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onClose, analysis }) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your HighPulse Social Copilot. Ask me anything about the scraped feed content or key public opinion trends!' }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage.content,
          context: analysis ? analysis.query : 'the dashboard',
          chat_history: messages.map(m => ({ role: m.role, content: m.content })),
          analysis_data: analysis ? {
            platform_status: analysis.platform_status,
            analysis: analysis.analysis,
            source_count: analysis.source_count
          } : {}
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Chat synthesis failed');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Failed to synthesize response: ${err.message || 'Server offline'}. Please ensure the backend is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      maxWidth: '460px',
      height: '100%',
      backgroundColor: 'rgba(9, 9, 11, 0.95)',
      backdropFilter: 'blur(16px)',
      borderLeft: '1px solid var(--border-glass)',
      zIndex: 90,
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)' }} />
          <div>
            <h3 style={{ color: 'white', fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>
              Gemini Audit Copilot
            </h3>
            {analysis && (
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-mid)' }}>
                Auditing: <strong>"{analysis.query}"</strong>
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--neutral-mid)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Message Logger */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'bubbleFade 0.25s ease'
            }}
          >
            {/* Sender Metadata */}
            <span style={{ fontSize: '0.75rem', color: 'var(--neutral-mid)', marginBottom: '0.25rem', padding: '0 0.2rem' }}>
              {msg.role === 'user' ? 'You' : 'Gemini AI'} {msg.timestamp && `• ${msg.timestamp}`}
            </span>
            
            {/* Bubble */}
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: msg.role === 'user' ? '14px 14px 0 14px' : '0 14px 14px 14px',
              backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-glass)',
              color: 'white',
              fontSize: '0.92rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-line'
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing thinking indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
            <Cpu size={14} className="dot-pulse" style={{ color: 'var(--secondary)' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--neutral-mid)' }}>Gemini is synthesizing insights...</span>
          </div>
        )}
      </div>

      {/* Input controls form */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderTop: '1px solid var(--border-glass)'
      }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.6rem' }}>
          <input 
            type="text" 
            className="input-lean" 
            placeholder={analysis ? "Ask about positive pros, concerns..." : "Run an audit search first..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!analysis || loading}
            style={{ height: '44px' }}
          />
          <button 
            type="submit" 
            className="btn-lean btn-lean-primary"
            style={{ width: '44px', height: '44px', padding: 0, borderRadius: '10px' }}
            disabled={!analysis || loading || !input.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes bubbleFade {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
