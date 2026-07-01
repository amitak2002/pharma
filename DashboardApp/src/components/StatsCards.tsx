import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface StatsCardsProps {
  thisMonthSales: number;
  lastMonthSales: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  thisMonthSales,
  lastMonthSales
}) => {
  const { t } = useLanguage();

  // Calculate dynamic growth rate compared to last month
  const mtoMChange = lastMonthSales > 0
    ? ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100
    : 0;

  // Format currency helpers (INR)
  const formatCurrency = (val: number) => {
    <StatsCards
      thisMonthSales={0}
      lastMonthSales={0}
    />
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="stats-grid">
      {/* This Month's Sales */}
      <div className="card stat-card current-month">
        <div className="stat-icon-wrapper cyan">
          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
          </svg>
        </div>
        <div className="stat-info">
          <h3 className="stat-label">{t('kpiThisMonth')}</h3>
          <div className="stat-value">{formatCurrency(thisMonthSales)}</div>
          <div className="stat-trend">
            <span className={`trend-badge ${mtoMChange >= 0 ? 'up' : 'down'}`}>
              <svg viewBox="0 0 24 24" className="trend-arrow">
                <path d={mtoMChange >= 0 ? "M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" : "M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"} />
              </svg>
              {Math.abs(mtoMChange).toFixed(1)}%
            </span>
            <span className="trend-text">
              {mtoMChange >= 0 ? t('kpiTrendUp') : t('kpiTrendDown')}
            </span>
          </div>
        </div>
      </div>

      {/* Last Month's Sales */}
      <div className="card stat-card last-month">
        <div className="stat-icon-wrapper blue">
          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
          </svg>
        </div>
        <div className="stat-info">
          <h3 className="stat-label">{t('kpiLastMonth')}</h3>
          <div className="stat-value">{formatCurrency(lastMonthSales)}</div>
          <div className="stat-trend">
            <span className="badge badge-info">Baseline</span>
            <span className="trend-text">Target: {formatCurrency(lastMonthSales * 1.05)}</span>
          </div>
        </div>
      </div>



      <style>{`
        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon-wrapper.cyan {
          background-color: rgba(6, 182, 212, 0.12);
          color: #06b6d4;
        }

        .stat-icon-wrapper.blue {
          background-color: rgba(59, 130, 246, 0.12);
          color: #3b82f6;
        }

        .stat-icon-wrapper.emerald {
          background-color: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }

        .stat-icon {
          width: 28px;
          height: 28px;
          fill: currentColor;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
        }

        .stat-value {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .trend-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        .trend-badge.up {
          background-color: rgba(16, 185, 129, 0.12);
          color: var(--success);
        }

        .trend-badge.down {
          background-color: rgba(239, 68, 68, 0.12);
          color: var(--danger);
        }

        .trend-arrow {
          width: 12px;
          height: 12px;
          fill: currentColor;
        }

        .trend-text {
          font-size: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .stat-card {
            padding: 16px;
          }
          .stat-value {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};
