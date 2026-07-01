import React from 'react';
import { useLanguage } from '../context/LanguageContext';

import type { User } from '../api';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onLogout,
  activeTab,
  setActiveTab
}) => {
  const isAdmin = user?.role === 'admin';
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg viewBox="0 0 24 24" className="logo-icon">
          <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
        </svg>
        <span>Prince Pharma</span>
      </div>

      <nav className="sidebar-nav">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          {t('navDashboard')}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
          {t('navHistory')}
        </button>

        <button
          onClick={() => {
            if (isAdmin) {
              setActiveTab('add-sale');
            } else {
              alert(t('toastPermissionDenied'));
            }
          }}
          className={`nav-item ${activeTab === 'add-sale' ? 'active' : ''} ${!isAdmin ? 'disabled' : ''}`}
          disabled={!isAdmin}
          title={!isAdmin ? t('toastPermissionDenied') : ''}
        >
          <svg viewBox="0 0 24 24" className="nav-icon">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          {t('navAddSale')}
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="role-panel">
          <div className="role-header" style={{ marginBottom: '4px' }}>
            <span className="role-title" style={{ fontSize: '14px', fontWeight: 800 }}>{user?.name || 'User'}</span>
            <div className={`status-dot ${isAdmin ? 'active' : ''}`} />
          </div>
          <p className="role-desc" style={{ fontSize: '11px', margin: '2px 0 8px 0', opacity: 0.8 }}>
            Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role || 'viewer'}</strong>
          </p>
          <button
            className="btn btn-danger btn-sm role-toggle-btn"
            onClick={onLogout}
            style={{ width: '100%', padding: '6px' }}
          >
            Logout
          </button>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          min-height: 100vh;
          flex-shrink: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px 24px;
          border-bottom: 1px solid var(--border);
          font-size: 20px;
          font-weight: 800;
          color: var(--accent);
        }

        .logo-icon {
          width: 28px;
          height: 28px;
          fill: var(--accent);
          filter: drop-shadow(0 2px 8px var(--accent-glow));
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 24px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: none;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--accent-glow);
          color: var(--accent);
          border-left: 3px solid var(--accent);
          padding-left: 9px;
        }

        .nav-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .role-panel {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .role-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .role-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--text-muted);
        }

        .status-dot.active {
          background-color: var(--success);
          box-shadow: 0 0 8px var(--success);
        }

        .role-desc {
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .role-toggle-btn {
          width: 100%;
          font-size: 12px;
          padding: 8px;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding: 16px;
          }
          .sidebar-logo {
            padding-bottom: 12px;
          }
          .sidebar-nav {
            flex-direction: row;
            margin-top: 12px;
            gap: 12px;
          }
          .role-panel {
            margin-top: 12px;
          }
        }
      `}</style>
    </aside>
  );
};
