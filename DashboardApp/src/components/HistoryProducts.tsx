import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getDaySales, type Sale as ApiSale } from '../api';

interface HistoryProductsProps {
  dateKey: string;
  dateLabel: string;
  monthLabel: string;
  onBack: () => void;
  onBackToMonths: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Antibiotics': '#ef4444',
  'Painkillers': '#f59e0b',
  'Vitamins': '#10b981',
  'Medical Devices': '#3b82f6',
  'Other OTC': '#8b5cf6',
};

export const HistoryProducts: React.FC<HistoryProductsProps> = ({
  dateKey,
  dateLabel,
  monthLabel,
  onBack,
  onBackToMonths,
}) => {
  const { t } = useLanguage();
  const [salesData, setSalesData] = useState<ApiSale[]>([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchDaySales = async () => {
      setLoading(true);
      setError(null);
      try {
        const [year, month, day] = dateKey.split('-').map(Number);
        const res = await getDaySales(year, month, day, page, limit);
        if (active) {
          setSalesData(res.sales);
          setSummary(res.summary || { totalAmount: 0, totalItems: 0 });
          setTotalPages(res.pagination.totalPages);
          setTotalRows(res.pagination.total);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to fetch day sales details');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchDaySales();
    return () => {
      active = false;
    };
  }, [dateKey, page, limit]);

  const products = React.useMemo(() => {
    const list: any[] = [];
    salesData.forEach((sale) => {
      if (sale.items && sale.items.length > 0) {
        sale.items.forEach((item, index) => {
          list.push({
            id: sale._id,
            uniqueKey: `${sale._id}-${index}`,
            productName: item.medicineName,
            category: item.category,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalAmount: item.totalAmount || (item.quantity * item.unitPrice),
          });
        });
      }
    });
    return list.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [salesData]);

  return (
    <div className="history-screen">
      {/* Breadcrumb */}
      <div className="history-breadcrumb">
        <button className="history-back-btn" onClick={onBackToMonths}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('navHistory')}
        </button>
        <span className="breadcrumb-sep">/</span>
        <button className="history-back-btn" onClick={onBack}>
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

      {loading ? (
        <div className="history-loading">
          <span className="spinner"></span>
        </div>
      ) : error ? (
        <div className="history-error">{error}</div>
      ) : (
        <>
          {/* Day summary */}
          <div className="products-summary-bar">
            <div className="products-summary-item">
              <span className="products-summary-value">{products.length}</span>
              <span className="products-summary-label">{t('historyProducts')}</span>
            </div>
            <div className="products-summary-item">
              <span className="products-summary-value">{summary.totalItems}</span>
              <span className="products-summary-label">{t('historyItemsSold')}</span>
            </div>
            <div className="products-summary-item">
              <span className="products-summary-value">₹{summary.totalAmount.toLocaleString('en-IN')}</span>
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
                    key={product.uniqueKey}
                    className="product-row"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td>
                      <span className="product-invoice">{product.id.slice(-6).toUpperCase()}</span>
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
                  <td className="products-footer-value">{summary.totalItems}</td>
                  <td></td>
                  <td className="products-footer-value">₹{summary.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="table-pagination">
            <span className="pagination-info">
              {`Showing ${totalRows > 0 ? (page - 1) * limit + 1 : 0}-${Math.min(page * limit, totalRows)} of ${totalRows}`}
            </span>

            <div className="pagination-controls">
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                &laquo; Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`btn btn-sm ${page === pageNum ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="btn btn-secondary btn-sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
              >
                Next &raquo;
              </button>
            </div>
          </div>
        </>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="history-empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.3">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
          <p>{t('tableNoData')}</p>
        </div>
      )}

      <style>{`
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

        .history-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 20px;
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

        .table-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          margin-top: 16px;
          border-radius: 14px;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 16px;
        }

        .pagination-info {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .pagination-controls {
          display: flex;
          gap: 6px;
          align-items: center;
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
