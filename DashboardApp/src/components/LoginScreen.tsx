import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { login, setAuth, signup } from '../api';
import type { User } from '../api';

interface LoginScreenProps {
  onAuthSuccess: (token: string, user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthSuccess }) => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await login(email, password);
        console.log("token s : ", response)
        let { token, user } = response
        setAuth(token, user)
        onAuthSuccess(token, user);
      } else {
        const response = await signup(name, email, password, role);
        console.log("token s : ", response)
        let { token, user } = response
        setAuth(token, user)
        onAuthSuccess(token, user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card card">
        <div className="login-header">
          <div className="logo-wrapper">
            <svg viewBox="0 0 24 24" className="login-logo-icon">
              <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
            </svg>
          </div>
          <h1 className="login-title">Prince Pharma</h1>
          <p className="login-subtitle">
            {isLogin ? 'Sign in to access your pharmacy analytics dashboard' : 'Create an account to join pharmacy management'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error-alert">{error}</div>}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                disabled={loading}
              >
                <option value="viewer">Viewer (Read-only)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="login-toggle-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>

      <style>{`
        .login-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          background-color: var(--bg-primary);
          padding: 24px;
        }

        .login-card {
          max-width: 440px;
          width: 100%;
          padding: 40px !important;
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          border-radius: 24px;
          animation: loginFadeIn 0.5s ease both;
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: var(--accent-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .login-logo-icon {
          width: 32px;
          height: 32px;
          fill: var(--accent);
          filter: drop-shadow(0 2px 8px var(--accent-glow));
        }

        .login-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .login-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-error-alert {
          background-color: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--danger);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }

        .login-btn {
          width: 100%;
          padding: 12px !important;
          font-size: 15px;
          font-weight: 700;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .login-toggle-btn {
          background: none;
          border: none;
          color: var(--accent);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .login-toggle-btn:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes loginFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
