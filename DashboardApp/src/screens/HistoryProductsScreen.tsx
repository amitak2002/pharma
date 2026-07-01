import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSales } from '../context/SalesContext';

const MONTH_NAMES: Record<string, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  hinglish: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const CATEGORY_COLORS: Record<string, string> = {
  'Antibiotics': '#ef4444',
  'Painkillers': '#f59e0b',
  'Vitamins': '#10b981',
  'Medical Devices': '#3b82f6',
  'Other OTC': '#8b5cf6',
};

export const HistoryProductsScreen: React.FC = () => {
  const { monthKey, dateKey } = useParams<{ monthKey: string; dateKey: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { sales } = useSales();

  const monthLabel = useMemo(() => {
    if (!monthKey) return '';
    const [year, monthStr] = monthKey.split('-');
    const monthIndex = parseInt(monthStr) - 1;
    const names = MONTH_NAMES[language] || MONTH_NAMES.en;
    return `${names[monthIndex]} ${year}`;
  }, [monthKey, language]);

  const dateLabel = useMemo(() => {
    if (!dateKey) return '';
    const d = new Date(dateKey);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [dateKey]);

  const products = useMemo(() => {
    if (!dateKey) return [];
    return sales
      .filter((s) => s.date === dateKey)
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [sales, dateKey]);

  const dayTotal = products.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalQty = products.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="history-screen">
      {/* Breadcrumb */}
      <div className="history-breadcrumb">
        <button className="history-back-btn" onClick={() => navigate('/history')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('navHistory')}
        </button>
        <span className="breadcrumb-sep">/</span>
        <button className="history-back-btn" onClick={() => navigate(`/history/${monthKey}`)}>
          {monthLabel}
        </button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{dateLabel}</span>
      </div>

      <div className="history-header">
        <div className="history-header-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h12v12z" />
          </svg>
        </div>
        <div>
          <h2 className="history-title">{dateLabel}</h2>
          <p className="history-subtitle">{t('historyProductSubtitle')}</p>
        </div>
      </div>

      {/* Day summary */}
      <div className="products-summary-bar">
        <div className="products-summary-item">
          <span className="products-summary-value">{products.length}</span>
          <span className="products-summary-label">{t('historyProducts')}</span>
        </div>
        <div className="products-summary-item">
          <span className="products-summary-value">{totalQty}</span>
          <span className="products-summary-label">{t('historyItemsSold')}</span>
        </div>
        <div className="products-summary-item">
          <span className="products-summary-value">₹{dayTotal.toLocaleString('en-IN')}</span>
          <span className="products-summary-label">{t('historyTotalSale')}</span>
        </div>
      </div>

      {/* Products table */}
      <div className="products-table-wrap">
        <table className="products-table">
          <thead>
            <tr>
              <th>{t('tableInvoice')}</th>
              <th>{t('tableProduct')}</th>
              <th>{t('tableCategory')}</th>
              <th>{t('tableQuantity')}</th>
              <th>{t('tableUnitPrice')}</th>
              <th>{t('tableTotal')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="product-row"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  <span className="product-invoice">{product.id}</span>
                </td>
                <td>
                  <span className="product-name">{product.productName}</span>
                </td>
                <td>
                  <span
                    className="product-category-badge"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[product.category] || '#6b7280'}20`,
                      color: CATEGORY_COLORS[product.category] || '#6b7280',
                    }}
                  >
                    {product.category}
                  </span>
                </td>
                <td>
                  <span className="product-qty">{product.quantity}</span>
                </td>
                <td>₹{product.unitPrice.toLocaleString('en-IN')}</td>
                <td>
                  <span className="product-total">₹{product.totalAmount.toLocaleString('en-IN')}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="products-footer-label">{t('historyGrandTotal')}</td>
              <td className="products-footer-value">{totalQty}</td>
              <td></td>
              <td className="products-footer-value">₹{dayTotal.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {products.length === 0 && (
        <div className="history-empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.3">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
          <p>{t('tableNoData')}</p>
        </div>
      )}

      <style>{`
        .history-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 20px;
        }

        .breadcrumb-sep {
          color: var(--text-muted);
          font-size: 13px;
          margin: 0 4px;
        }

        .breadcrumb-current {
          font-size: 13px;
          font-weight: 600;
          color: var(--accent);
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

        .products-summary-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px 20px;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: 14px;
        }

        .products-summary-item {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: center;
          gap: 2px;
        }

        .products-summary-value {
          font-size: 18px;
          font-weight: 800;
          color: var(--accent);
        }

        .products-summary-label {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .products-table-wrap {
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--card-bg);
          backdrop-filter: blur(10px);
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .products-table thead th {
          padding: 14px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          background: var(--bg-tertiary);
        }

        .products-table tbody td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .product-row {
          transition: all 0.2s ease;
          animation: histSlideUp 0.35s ease both;
        }

        .product-row:hover {
          background: var(--accent-glow);
        }

        .product-row:last-child td {
          border-bottom: none;
        }

        .product-invoice {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .product-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .product-category-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .product-qty {
          font-weight: 700;
          color: var(--text-primary);
        }

        .product-total {
          font-weight: 700;
          color: var(--accent);
        }

        .products-table tfoot td {
          padding: 14px 16px;
          font-weight: 700;
          background: var(--bg-tertiary);
          border-top: 2px solid var(--accent);
        }

        .products-footer-label {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-primary);
        }

        .products-footer-value {
          font-size: 15px;
          color: var(--accent);
          font-weight: 800;
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
          .products-summary-bar {
            flex-direction: column;
            gap: 12px;
          }
          .products-table {
            font-size: 12px;
          }
          .products-table thead th,
          .products-table tbody td {
            padding: 10px 12px;
          }
        }
      `}</style>
    </div>
  );
};
