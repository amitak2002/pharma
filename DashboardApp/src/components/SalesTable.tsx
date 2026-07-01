import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Sale {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  paymentMethod: string;
}

interface SalesTableProps {
  sales: Sale[];
  isAdmin: boolean;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  totalRows: number;
  limit: number;
  search: string;
  category: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  isAdmin,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalRows,
  limit,
  search,
  category,
  onPageChange,
  onLimitChange,
  onSearch,
  onCategoryChange
}) => {
  const { t } = useLanguage();

  const startIndex = totalRows > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endIndex = Math.min(currentPage * limit, totalRows);

  return (
    <div className="card table-card">
      {/* Table Filters & Toolbar */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <svg viewBox="0 0 24 24" className="search-icon">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            className="form-input search-input"
            placeholder={t('searchPlaceholder') || 'Search...'}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="form-select filter-select"
          >
            <option value="All">{t('categoryAll') || 'All Categories'}</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Painkillers">Painkillers</option>
            <option value="Vitamins">Vitamins</option>
            <option value="Medical Devices">Medical Devices</option>
            <option value="Other OTC">Other OTC</option>
          </select>

          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="form-select limit-select"
          >
            <option value={5}>5 Rows</option>
            <option value={10}>10 Rows</option>
            <option value={20}>20 Rows</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="table-responsive">
        <table className="sales-table">
          <thead>
            <tr>
              {/* <th>{t('tableInvoice')}</th> */}
              <th>{t('tableDate')}</th>
              <th>{t('tableProduct')}</th>
              <th>{t('tableCategory')}</th>
              <th className="text-right">{t('tableQuantity')}</th>
              <th className="text-right">{t('tableUnitPrice')}</th>
              <th className="text-right">{t('tableTotal')}</th>
              <th className="text-center">{t('tableActions')}</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale.id}>
                  {/* <td className="font-mono font-bold">{sale.id}</td> */}
                  <td>{new Date(sale.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="font-bold text-highlight">{sale.productName}</td>
                  <td>
                    <span className={`badge ${sale.category === 'Antibiotics' ? 'badge-success' :
                      sale.category === 'Painkillers' ? 'badge-danger' :
                        sale.category === 'Vitamins' ? 'badge-warning' :
                          sale.category === 'Medical Devices' ? 'badge-info' : 'badge-secondary'
                      }`}>
                      {sale.category}
                    </span>
                  </td>
                  <td className="text-right font-mono">{sale.quantity}</td>
                  <td className="text-right font-mono">₹{sale.unitPrice.toFixed(2)}</td>
                  <td className="text-right font-mono font-bold text-accent">₹{sale.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-icon-only"
                        onClick={() => onEdit(sale)}
                        disabled={!isAdmin}
                        title={!isAdmin ? t('toastPermissionDenied') : t('btnEdit')}
                      >
                        <svg viewBox="0 0 24 24" className="action-icon edit">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        className="btn btn-danger btn-icon-only"
                        onClick={() => onDelete(sale.id)}
                        disabled={!isAdmin}
                        title={!isAdmin ? t('toastPermissionDenied') : t('btnDelete')}
                      >
                        <svg viewBox="0 0 24 24" className="action-icon delete">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="table-empty-state">
                  <svg viewBox="0 0 24 24" className="empty-state-icon">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
                  </svg>
                  <p>{t('tableNoData')}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="table-pagination">
        <span className="pagination-info">
          {t('tablePaginationInfo', { start: startIndex, end: endIndex, total: totalRows }) || `Showing ${startIndex}-${endIndex} of ${totalRows}`}
        </span>

        <div className="pagination-controls">
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          >
            &laquo; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          >
            Next &raquo;
          </button>
        </div>
      </div>

      <style>{`
        .table-card {
          padding: 0 !important;
          overflow: hidden;
        }

        .table-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
          max-width: 320px;
          width: 100%;
        }

        .search-input {
          padding-left: 40px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          fill: var(--text-muted);
          pointer-events: none;
        }

        .filter-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .filter-select, .limit-select {
          min-width: 130px;
          padding: 8px 12px;
          font-size: 13px;
        }

        .limit-select {
          min-width: 90px;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .sales-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .sales-table th {
          padding: 16px 24px;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border);
        }

        .sales-table td {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          color: var(--text-primary);
        }

        .sales-table tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        [data-theme='light'] .sales-table tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.01);
        }

        .font-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .font-bold {
          font-weight: 700;
        }

        .text-right {
          text-align: right;
        }

        .text-center {
          text-align: center;
        }

        .text-accent {
          color: var(--accent);
        }

        .text-highlight {
          color: var(--text-primary);
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .action-icon {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .table-empty-state {
          text-align: center;
          padding: 48px !important;
          color: var(--text-muted);
        }

        .empty-state-icon {
          width: 48px;
          height: 48px;
          fill: var(--border);
          margin-bottom: 12px;
        }

        .table-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-top: 1px solid var(--border);
          background-color: var(--bg-tertiary);
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

        .badge-secondary {
          background-color: rgba(148, 163, 184, 0.12);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .table-toolbar {
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
          }
          .search-wrapper {
            max-width: 100%;
          }
          .filter-group {
            width: 100%;
            justify-content: space-between;
          }
          .filter-select, .limit-select {
            flex: 1;
          }
          .sales-table th, .sales-table td {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
};
