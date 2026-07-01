import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSales } from '../context/SalesContext';

const MONTH_NAMES: Record<string, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  hinglish: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export const HistoryDatewiseScreen: React.FC = () => {
  const { monthKey } = useParams<{ monthKey: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { sales } = useSales();

  // Derive month label from monthKey
  const monthLabel = useMemo(() => {
    if (!monthKey) return '';
    const [year, monthStr] = monthKey.split('-');
    const monthIndex = parseInt(monthStr) - 1;
    const names = MONTH_NAMES[language] || MONTH_NAMES.en;
    return `${names[monthIndex]} ${year}`;
  }, [monthKey, language]);

  const dateData = useMemo(() => {
    if (!monthKey) return [];
    const [year, month] = monthKey.split('-').map(Number);
    const filtered = sales.filter((s) => {
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    const grouped: Record<string, { totalAmount: number; totalItems: number; count: number }> = {};

    filtered.forEach((sale) => {
      const key = sale.date;
      if (!grouped[key]) {
        grouped[key] = { totalAmount: 0, totalItems: 0, count: 0 };
      }
      grouped[key].totalAmount += sale.totalAmount;
      grouped[key].totalItems += sale.quantity;
      grouped[key].count += 1;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, data]) => {
        const d = new Date(key);
        const label = d.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        return { key, label, ...data };
      });
  }, [sales, monthKey]);

  const monthTotal = dateData.reduce((sum, d) => sum + d.totalAmount, 0);

  return (
    <div className="history-screen">
      {/* Breadcrumb / Back */}
      <div className="history-breadcrumb">
        <button className="history-back-btn" onClick={() => navigate('/history')}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('historyBackToMonths')}
        </button>
      </div>

      <div className="history-header">
        <div className="history-header-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 4h-2v-2h2v2zm4 0h-2v-2h2v2z" />
          </svg>
        </div>
        <div>
          <h2 className="history-title">{monthLabel}</h2>
          <p className="history-subtitle">
            {t('historyDatewiseSubtitle')} — ₹{monthTotal.toLocaleString('en-IN')} {t('historyTotalSale').toLowerCase()}
          </p>
        </div>
      </div>

      {/* Summary banner */}
      <div className="datewise-summary-bar">
        <div className="datewise-summary-item">
          <span className="datewise-summary-value">{dateData.length}</span>
          <span className="datewise-summary-label">{t('historyActiveDays')}</span>
        </div>
        <div className="datewise-summary-item">
          <span className="datewise-summary-value">{dateData.reduce((s, d) => s + d.count, 0)}</span>
          <span className="datewise-summary-label">{t('historyTransactions')}</span>
        </div>
        <div className="datewise-summary-item">
          <span className="datewise-summary-value">₹{monthTotal.toLocaleString('en-IN')}</span>
          <span className="datewise-summary-label">{t('historyTotalSale')}</span>
        </div>
      </div>

      {/* Date list */}
      <div className="datewise-list">
        {dateData.map((day, index) => (
          <button
            key={day.key}
            className="datewise-card"
            onClick={() => navigate(`/history/${monthKey}/${day.key}`)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="datewise-left">
              <div className="datewise-date-badge">
                <span className="datewise-day">{new Date(day.key).getDate()}</span>
                <span className="datewise-weekday">{new Date(day.key).toLocaleDateString('en', { weekday: 'short' })}</span>
              </div>
              <div className="datewise-info">
                <span className="datewise-date-label">{day.label}</span>
                <span className="datewise-meta">{day.count} {t('historyTransactions').toLowerCase()} · {day.totalItems} {t('historyItemsSold').toLowerCase()}</span>
              </div>
            </div>
            <div className="datewise-right">
              <span className="datewise-amount">₹{day.totalAmount.toLocaleString('en-IN')}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="datewise-arrow">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {dateData.length === 0 && (
        <div className="history-empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.3">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
          <p>{t('tableNoData')}</p>
        </div>
      )}

      <style>{`
        .history-breadcrumb {
          margin-bottom: 20px;
        }

        .history-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .history-back-btn:hover {
          background: var(--accent-glow);
          color: var(--accent);
          border-color: var(--accent);
        }

        .datewise-summary-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px 20px;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: 14px;
        }

        .datewise-summary-item {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: center;
          gap: 2px;
        }

        .datewise-summary-value {
          font-size: 18px;
          font-weight: 800;
          color: var(--accent);
        }

        .datewise-summary-label {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .datewise-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .datewise-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: 14px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: histSlideUp 0.4s ease both;
        }

        .datewise-card:hover {
          border-color: var(--accent);
          box-shadow: 0 6px 20px var(--accent-glow);
          transform: translateX(4px);
        }

        .datewise-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .datewise-date-badge {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .datewise-day {
          font-size: 18px;
          font-weight: 800;
          line-height: 1;
        }

        .datewise-weekday {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.85;
        }

        .datewise-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .datewise-date-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .datewise-meta {
          font-size: 12px;
          color: var(--text-muted);
        }

        .datewise-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .datewise-amount {
          font-size: 16px;
          font-weight: 700;
          color: var(--accent);
        }

        .datewise-arrow {
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .datewise-card:hover .datewise-arrow {
          color: var(--accent);
          transform: translateX(2px);
        }

        @media (max-width: 768px) {
          .datewise-summary-bar {
            flex-direction: column;
            gap: 12px;
          }
          .datewise-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .datewise-right {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};
