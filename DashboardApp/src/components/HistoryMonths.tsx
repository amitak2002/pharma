import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getMonthlySummary, type MonthlySummaryItem } from '../api';

interface HistoryMonthsProps {
  onSelectMonth: (monthKey: string, monthLabel: string) => void;
}

const MONTH_NAMES: Record<string, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  hinglish: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export const HistoryMonths: React.FC<HistoryMonthsProps> = ({ onSelectMonth }) => {
  const { t, language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summaryData, setSummaryData] = useState<MonthlySummaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMonthlySummary(selectedYear);
        if (active) {
          setSummaryData(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to fetch monthly summary');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSummary();
    return () => {
      active = false;
    };
  }, [selectedYear]);

  const monthList = React.useMemo(() => {
    return summaryData
      .map((item) => {
        const monthIndex = item.month - 1;
        const names = MONTH_NAMES[language] || MONTH_NAMES.en;
        const label = `${names[monthIndex]} ${selectedYear}`;
        const key = `${selectedYear}-${String(item.month).padStart(2, '0')}`;
        return {
          key,
          label,
          totalAmount: item.totalAmount,
          totalItems: item.totalItems,
          count: item.totalSales,
        };
      })
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [summaryData, language, selectedYear]);

  return (
    <div className="history-screen">
      <div className="history-header">
        <div className="history-header-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
        </div>
        <div style={{ flexGrow: 1 }}>
          <h2 className="history-title">{t('navHistory')}</h2>
          <p className="history-subtitle">{t('historySubtitle')}</p>
        </div>
        {/* Year filter selector */}
        <div className="year-selector">
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ width: '120px' }}
          >
            {Array.from({ length: 2030 - 2022 + 1 }, (_, i) => 2030 - i).map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="history-loading">
          <span className="spinner"></span>
        </div>
      ) : error ? (
        <div className="history-error">{error}</div>
      ) : (
        <div className="history-months-grid">
          {monthList.map((month, index) => (
            <button
              key={month.key}
              className="history-month-card"
              onClick={() => onSelectMonth(month.key, month.label)}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="month-card-top">
                <div className="month-icon-wrap">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 4h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                  </svg>
                </div>
                <span className="month-name">{month.label}</span>
              </div>
              <div className="month-card-stats">
                <div className="month-stat">
                  <span className="month-stat-value">₹{month.totalAmount.toLocaleString('en-IN')}</span>
                  <span className="month-stat-label">{t('historyTotalSale')}</span>
                </div>
                <div className="month-stat-divider" />
                <div className="month-stat">
                  <span className="month-stat-value">{month.count}</span>
                  <span className="month-stat-label">{t('historyTransactions')}</span>
                </div>
                <div className="month-stat-divider" />
                <div className="month-stat">
                  <span className="month-stat-value">{month.totalItems}</span>
                  <span className="month-stat-label">{t('historyItemsSold')}</span>
                </div>
              </div>
              <div className="month-card-arrow">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && monthList.length === 0 && (
        <div className="history-empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.3">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
          <p>{t('tableNoData')}</p>
        </div>
      )}

      <style>{`
        .history-screen {
          animation: histFadeIn 0.4s ease;
        }

        .history-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .history-header-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 16px var(--accent-glow);
        }

        .history-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .history-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .history-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }

        .history-error {
          color: var(--danger);
          text-align: center;
          padding: 24px;
          font-weight: 600;
        }

        .history-months-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 16px;
        }

        .history-month-card {
          position: relative;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: histSlideUp 0.4s ease both;
        }

        .history-month-card:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 24px var(--accent-glow), var(--shadow-lg);
          transform: translateY(-3px);
        }

        .month-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .month-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--accent-glow);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .month-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .month-card-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-top: 1px solid var(--border);
        }

        .month-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .month-stat-value {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .month-stat-label {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .month-stat-divider {
          width: 1px;
          height: 28px;
          background: var(--border);
        }

        .month-card-arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          opacity: 0;
          transition: all 0.2s ease;
        }

        .history-month-card:hover .month-card-arrow {
          opacity: 1;
          color: var(--accent);
          right: 12px;
        }

        .history-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          color: var(--text-muted);
          font-size: 15px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 4px solid var(--border);
          border-radius: 50%;
          border-top-color: var(--accent);
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes histFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes histSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .history-months-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
