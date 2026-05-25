import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { AnalysisPage } from './components/AnalysisPage';
import { ChatAssistant } from './components/ChatAssistant';
import { Footer } from './components/Footer';
import type { User, Analysis } from './types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { ArrowLeft } from 'lucide-react';

function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  
  // Dashboard & Views routing
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'analysis'>('home');
  const [chatOpen, setChatOpen] = useState(false);
  
  // Scraper/Analysis State
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Persistent History
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 1. Initial Authentication Sync
  useEffect(() => {
    // Check localStorage for quick session restoring
    const cachedUser = localStorage.getItem('highpulse_user');
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser) as User;
      setUser(parsed);
      setCurrentView('dashboard');
      fetchUserHistory(parsed.email);
    }

    if (isSupabaseConfigured && supabase) {
      // Fetch initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const uEmail = session.user.email || '';
          const uName = session.user.user_metadata?.name || uEmail.split('@')[0];
          const loggedUser = { name: uName, email: uEmail };
          
          setUser(loggedUser);
          localStorage.setItem('highpulse_user', JSON.stringify(loggedUser));
          setCurrentView('dashboard');
          fetchUserHistory(uEmail);
          
          // Sync with Backend database
          syncSessionWithBackend(uName, uEmail);
        }
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const uEmail = session.user.email || '';
          const uName = session.user.user_metadata?.name || uEmail.split('@')[0];
          const loggedUser = { name: uName, email: uEmail };
          
          setUser(loggedUser);
          localStorage.setItem('highpulse_user', JSON.stringify(loggedUser));
          setCurrentView('dashboard');
          fetchUserHistory(uEmail);
          
          syncSessionWithBackend(uName, uEmail);
        } else if (event === 'SIGNED_OUT') {
          handleLogout();
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const syncSessionWithBackend = async (name: string, email: string) => {
    try {
      await fetch('http://localhost:5000/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
    } catch (e) {
      console.warn("Failed to synchronize OAuth session with Flask backend database", e);
    }
  };

  // 2. Database History Synchronizer
  const fetchUserHistory = async (email: string) => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`http://localhost:5000/api/analyses?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Failed to fetch past analyses", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 3. User Success handshakes
  const handleAuthSuccess = (uDetails: User) => {
    setUser(uDetails);
    localStorage.setItem('highpulse_user', JSON.stringify(uDetails));
    setCurrentView('dashboard');
    fetchUserHistory(uDetails.email);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setHistory([]);
    setAnalysis(null);
    localStorage.removeItem('highpulse_user');
    setCurrentView('home');
  };

  // 4. Parallel scraping execution hook
  const handleAnalyze = async (query: string) => {
    setLoading(true);
    setAnalysis(null);
    setCurrentView('analysis');
    setChatOpen(false);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          email: user?.email // Auto saves to database history on backend if user is logged in
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Deep Analysis failed');
      }

      setAnalysis(data);
      
      // Update local history array if logged in
      if (user) {
        fetchUserHistory(user.email);
      }
    } catch (err: any) {
      alert(`⚠️ Audit Error: ${err.message || 'Flask backend offline'}. Please ensure python app.py is active.`);
      setCurrentView(user ? 'dashboard' : 'home');
    } finally {
      setLoading(false);
    }
  };

  // 5. Database deletion hook
  const handleDeleteAnalysis = async (id: string) => {
    if (!user) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this analysis permanently from your account history?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/analyses/${id}?email=${encodeURIComponent(user.email)}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Remove from local list
        setHistory(prev => prev.filter(item => item.id !== id));
        if (analysis && analysis.id === id) {
          setAnalysis(null);
          setCurrentView('dashboard');
        }
      } else {
        const errData = await response.json();
        throw new Error(errData.error || 'Delete failed');
      }
    } catch (e: any) {
      alert(`Error deleting analysis: ${e.message}`);
    }
  };

  // 6. Markdown Report Exporter
  const handleExport = () => {
    if (!analysis) return;
    
    // Clean positive, neutral, negative
    const text = analysis.analysis.sentiment_analysis;
    let pos = 50, neu = 30, neg = 20;
    try {
      const posMatch = text.match(/Positive:?\s*(\d+)%/i);
      const neuMatch = text.match(/Neutral:?\s*(\d+)%/i);
      const negMatch = text.match(/Negative:?\s*(\d+)%/i);
      if (posMatch) pos = parseInt(posMatch[1]);
      if (neuMatch) neu = parseInt(neuMatch[1]);
      if (negMatch) neg = parseInt(negMatch[1]);
    } catch(e){}

    let md = `# HighPulse.ai - Executive Social Audit Report
**Query Parameter:** "${analysis.query}"  
**Report Date:** ${new Date(analysis.created_at || Date.now()).toLocaleString()}  
**Data Volume Scraped:** ${analysis.source_count} Feeds  

---

## 📖 1. Detailed Overview
${analysis.analysis.detailed_explanation}

---

## 💼 2. Commercial Appraisal & Strategic Opportunities
${analysis.analysis.market_analysis}

---

## 👥 3. Public Opinion & User Critiques
${analysis.analysis.public_opinion}

---

## ❤️ 4. Real-time Consumer Sentiment
- **Positive Sentiment:** ${pos}%
- **Neutral Sentiment:** ${neu}%
- **Negative Sentiment:** ${neg}%

### Sentiment Breakdown
${analysis.analysis.sentiment_analysis}

---

## 📈 5. Google Trends & Related Queries
${analysis.analysis.trend_analysis}

`;

    if (analysis.google_trends && analysis.google_trends.top_related) {
      md += `\n### Top Related Trends\n`;
      analysis.google_trends.top_related.slice(0, 5).forEach(item => {
        md += `- **${item.query}** (Score: ${item.value})\n`;
      });
    }

    if (analysis.scraped_sources && analysis.scraped_sources.length > 0) {
      md += `\n---\n\n## 🔍 6. Verified Scraped Sources\n`;
      analysis.scraped_sources.forEach((source, idx) => {
        md += `${idx + 1}. **[${source.title}](${source.url})**  
   - Platform: \`${source.platform.toUpperCase()}\`  
   - Meta: ${source.author ? `Author: ${source.author}` : ''} ${source.channel ? `Channel: ${source.channel}` : ''} ${source.views ? `Views: ${source.views.toLocaleString()}` : ''} ${source.upvotes ? `Upvotes: ${source.upvotes}` : ''}  
   - Description: *"${source.content || source.summary || 'Link Post'}"*\n\n`;
      });
    }

    md += `\n\n---\nReport generated dynamically by HighPulse.ai Social Intelligence Engine.\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `highpulse_audit_${analysis.query.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSuggestionClick = (query: string) => {
    handleAnalyze(query);
  };

  return (
    <div className="layout-container">
      {/* Floating Canvas Gradients */}
      <div className="app-bg-animation">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere"></div>
      </div>

      <Header 
        user={user}
        onLoginClick={() => { setAuthModalTab('login'); setAuthModalOpen(true); }}
        onSignupClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
        onLogoutClick={handleLogout}
        onHomeClick={() => setCurrentView(user ? 'dashboard' : 'home')}
        currentView={currentView}
      />

      <main>
        {currentView === 'home' && (
          <>
            <Hero 
              onGetStartedClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
              onWatchDemoClick={() => handleSuggestionClick("Generative AI Agent Trends")}
            />
            <Features />
          </>
        )}

        {currentView === 'dashboard' && user && (
          <Dashboard 
            user={user}
            analyses={history}
            onNewAnalysisClick={() => { setAnalysis(null); setCurrentView('analysis'); }}
            onSelectAnalysis={(selected) => { setAnalysis(selected); setCurrentView('analysis'); }}
            onDeleteAnalysis={handleDeleteAnalysis}
            onSuggestionClick={handleSuggestionClick}
            loadingHistory={loadingHistory}
          />
        )}

        {currentView === 'analysis' && (
          <div style={{ position: 'relative' }}>
            {/* Back to dashboard toggle */}
            <div style={{ marginBottom: '1rem' }}>
              <button 
                onClick={() => setCurrentView(user ? 'dashboard' : 'home')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--neutral-mid)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--neutral-mid)'}
              >
                <ArrowLeft size={16} />
                <span>Back to {user ? 'Dashboard' : 'Home'}</span>
              </button>
            </div>

            <AnalysisPage 
              analysis={analysis}
              onAnalyze={handleAnalyze}
              onOpenChat={() => setChatOpen(true)}
              onExport={handleExport}
              loading={loading}
            />

            <ChatAssistant 
              isOpen={chatOpen}
              onClose={() => setChatOpen(false)}
              analysis={analysis}
            />
          </div>
        )}
      </main>

      <Footer />

      {/* Auth Dialog Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialTab={authModalTab}
      />
    </div>
  );
}

export default App;
