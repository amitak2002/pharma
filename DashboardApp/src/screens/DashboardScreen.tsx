import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { StatsCards } from '../components/StatsCards';
import { SalesChart } from '../components/SalesChart';
import { SalesTable } from '../components/SalesTable';
import { useSales } from '../context/SalesContext';

const DAILY_BASELINE_JUNE_SUM = 205600;
const DAILY_BASELINE_MAY_SUM = 195000;
const LAST_YEAR_SALES_STATIC = 2840000;

export const DashboardScreen: React.FC = () => {
  const { t } = useLanguage();
  const { sales, isAdmin, openAddModal, openEditModal, deleteSale } = useSales();

  const juneSalesSum = sales
    .filter((s) => new Date(s.date).getMonth() === 5)
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const maySalesSum = sales
    .filter((s) => new Date(s.date).getMonth() === 4)
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const totalThisMonth = DAILY_BASELINE_JUNE_SUM + juneSalesSum;
  const totalLastMonth = DAILY_BASELINE_MAY_SUM + maySalesSum;

  return (
    <>
      {/* Dynamic statistics overview */}
      <StatsCards
        thisMonthSales={totalThisMonth}
        lastMonthSales={totalLastMonth}
        lastYearSales={LAST_YEAR_SALES_STATIC}
      />

      {/* Dynamic visual charts */}
      <SalesChart sales={sales} />

      {/* Transaction Table */}
      <div className="table-section-header">
        <h2 className="text-h2">{t('kpiTotalSales')}</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAddModal}>
            <svg viewBox="0 0 24 24" className="btn-icon">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            {t('btnAddSale')}
          </button>
        )}
      </div>

      <SalesTable
        sales={sales}
        isAdmin={isAdmin}
        onEdit={openEditModal}
        onDelete={deleteSale}
      />

      <style>{`
        .table-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }

        .table-section-header h2 {
          color: var(--text-primary);
          font-size: 18px;
        }

        .btn-icon {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }
      `}</style>
    </>
  );
};
