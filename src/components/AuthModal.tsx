import React from 'react';
import { Mail, Lock, User, AlertCircle, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string }) => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>(initialTab);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError(null);
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleTraditionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const targetEmail = email.trim().toLowerCase();
    const targetPassword = password.trim();

    if (!targetEmail || !targetPassword || (activeTab === 'register' && !name.trim())) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Securely route traditional authentication through the Flask backend.
      // This applies bcrypt hashing and ensures a bulletproof automatic fallback
      // to users.csv if Supabase tables have SQL / relation errors.
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = activeTab === 'login' 
        ? { email: targetEmail, password: targetPassword }
        : { name: name.trim(), email: targetEmail, password: targetPassword };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Authentication failed');
      }

      if (resData.success && resData.user) {
        onAuthSuccess(resData.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Real Supabase Google Login
        const { error: err } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (err) throw err;
      } else {
        // Fallback / Demonstration Sandbox Google Login
        console.log("Supabase OAuth unavailable, triggering Gmail demo handshake...");
        
        // Sync sandbox user with backend
        const demoEmail = 'sandbox.analyst@gmail.com';
        const demoName = 'Sandbox Gmail Analyst';
        
        const syncResponse = await fetch('http://localhost:5000/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: demoEmail, name: demoName })
        });
        
        if (!syncResponse.ok) {
          throw new Error('Sandbox sync failed');
        }
        
        const syncData = await syncResponse.json();
        
        // Simulate a small network delay for premium visual feedback
        setTimeout(() => {
          onAuthSuccess({
            name: syncData.user.name,
            email: syncData.user.email
          });
          setLoading(false);
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Gmail login simulation failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100
    }}>
      <div className="card-glass" style={{
        width: '90%',
        maxWidth: '420px',
        padding: '2.5rem 2rem 2rem 2rem',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--neutral-mid)',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--neutral-mid)'}
        >
          <X size={20} />
        </button>

        {/* Modal Header tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-glass)',
          marginBottom: '1.5rem'
        }}>
          <button 
            onClick={() => { setActiveTab('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'login' ? 'var(--neutral-high)' : 'var(--neutral-mid)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Log In
          </button>
          <button 
            onClick={() => { setActiveTab('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'register' ? 'var(--neutral-high)' : 'var(--neutral-mid)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Register
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: 'var(--accent)',
            fontSize: '0.88rem',
            marginBottom: '1.2rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Traditional Form */}
        <form onSubmit={handleTraditionalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {activeTab === 'register' && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={inputIconStyle} />
                <input 
                  type="text" 
                  className="input-lean" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={inputIconStyle} />
              <input 
                type="email" 
                className="input-lean" 
                placeholder="example@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={inputIconStyle} />
              <input 
                type="password" 
                className="input-lean" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-lean btn-lean-primary" 
            style={{ width: '100%', marginTop: '0.4rem', padding: '0.8rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Separator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          color: 'var(--neutral-mid)',
          fontSize: '0.8rem',
          margin: '1.5rem 0'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-glass)' }}></div>
          <span style={{ padding: '0 0.75rem' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-glass)' }}></div>
        </div>

        {/* Gmail Google Login Button */}
        <button 
          onClick={handleGoogleSignIn} 
          className="btn-lean btn-lean-outline" 
          style={{
            width: '100%',
            borderColor: 'var(--border-glass)',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{loading ? 'Initiating Sandbox...' : 'Sign in with Google'}</span>
        </button>

        {!isSupabaseConfigured && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--neutral-mid)',
            textAlign: 'center',
            marginTop: '1.5rem',
            padding: '0.5rem',
            background: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            borderRadius: '6px'
          }}>
            ℹ️ Supabase not configured in client. Google Login will run in premium sandbox demonstration mode.
          </div>
        )}
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--neutral-mid)',
  marginBottom: '0.4rem'
};

const inputIconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '0.9rem',
  transform: 'translateY(-50%)',
  color: 'var(--neutral-mid)',
  pointerEvents: 'none'
};
