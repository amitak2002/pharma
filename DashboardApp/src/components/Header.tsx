import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { LanguageType } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import type { ThemeType } from '../context/ThemeContext';

interface HeaderProps {
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <header className="dashboard-header card">
      <div className="header-brand">
        <h1 className="text-h1">{t('title')}</h1>
        <p className="text-body">{t('subtitle')}</p>
      </div>

      <div className="header-controls">
        {/* Language Selector */}
        <div className="control-group">
          <label className="control-label">{t('navLanguage')}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageType)}
            className="form-select control-select"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>

        {/* Theme Selector */}
        <div className="control-group">
          <label className="control-label">{t('navTheme')}</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeType)}
            className="form-select control-select"
          >
            <option value="dark">{t('themeDark')}</option>
            <option value="light">{t('themeLight')}</option>
            <option value="emerald">{t('themeEmerald')}</option>
          </select>
        </div>

        {/* Quick Role status */}
        <div className="header-role-badge">
          <span className={`badge ${isAdmin ? 'badge-success' : 'badge-warning'}`}>
            {isAdmin ? t('adminStatus') : t('viewerMode')}
          </span>
        </div>
      </div>

      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-radius: 16px;
        }

        .header-brand h1 {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .header-brand p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .control-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }

        .control-select {
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          min-width: 130px;
          border-radius: 8px;
        }

        .header-role-badge {
          display: flex;
          align-items: center;
          align-self: flex-end;
          height: 32px;
        }

        .header-role-badge .badge {
          padding: 6px 12px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 16px;
          }
          .header-controls {
            width: 100%;
            flex-wrap: wrap;
            gap: 12px;
          }
          .control-select {
            min-width: auto;
            flex: 1;
          }
        }
      `}</style>
    </header>
  );
};
