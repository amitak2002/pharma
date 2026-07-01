import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';

import { SalesTable } from './components/SalesTable';
import { SaleModal } from './components/SaleModal';
import { HistoryMonths } from './components/HistoryMonths';
import { HistoryDatewise } from './components/HistoryDatewise';
import { HistoryProducts } from './components/HistoryProducts';
import { LoginScreen } from './components/LoginScreen';
import {
  getToken,
  getUser,
  logout,
  getDashboardData,
  getSalesHistory,
  createSale,
  updateSale,
  deleteSale
} from './api';
import type { User, Sale as ApiSale } from './api';

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

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'danger';
}

const DashboardContent: React.FC = () => {
  const { t } = useLanguage();

  // Auth state
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(getUser());
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState('dashboard');

  // Sales state
  const [sales, setSales] = useState<Sale[]>([]);
  const [thisMonthSales, setThisMonthSales] = useState(0);
  const [lastMonthSales, setLastMonthSales] = useState(0);
  const [_chartData, setChartData] = useState<{
    allTimeTotal: number;
    categoryBreakdown: { category: string; totalAmount: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Table pagination & filter state
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit, setTableLimit] = useState(5);
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('All');
  const [tableTotalPages, setTableTotalPages] = useState(1);
  const [tableTotalRows, setTableTotalRows] = useState(0);

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);

  // Toast Control
  const [toasts, setToasts] = useState<Toast[]>([]);

  // History navigation state
  const [historyView, setHistoryView] = useState<'months' | 'datewise' | 'products'>('months');
  const [selectedMonth, setSelectedMonth] = useState<{ key: string; label: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ key: string; label: string } | null>(null);

  const addToast = (message: string, type: 'success' | 'danger' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const mapApiSaleToFrontendSale = (apiSale: ApiSale): Sale => {
    const item = apiSale.items?.[0] || { medicineName: '', category: 'Other OTC', quantity: 0, unitPrice: 0 };
    const productName = apiSale.items?.map((i) => i.medicineName).join(', ') || item.medicineName;
    const category = item.category || 'Other OTC';
    const quantity = apiSale.totalItems || item.quantity;
    const unitPrice = item.unitPrice || 0;

    return {
      id: apiSale._id,
      productName,
      category,
      quantity,
      unitPrice,
      totalAmount: apiSale.totalAmount,
      date: apiSale.saleDate ? apiSale.saleDate.split('T')[0] : '',
      paymentMethod: apiSale.paymentMethod || 'cash',
    };
  };

  const fetchDashboardSummary = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const dash = await getDashboardData();
      setThisMonthSales(dash.currentMonth.totalAmount);
      setLastMonthSales(dash.lastMonth.totalAmount);
      setChartData(dash.chartData);
    } catch (err: any) {
      console.log("Error in fetching dashboard summary is : ", err)
      addToast(err.message || 'Failed to fetch dashboard data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesTableData = async () => {
    if (!token) return;
    try {
      const hist = await getSalesHistory({
        page: tablePage,
        limit: tableLimit,
        search: tableSearch,
        category: tableCategory
      });
      const mapped = hist.data.map(mapApiSaleToFrontendSale);
      setSales(mapped);
      setTableTotalPages(hist.pagination.totalPages);
      setTableTotalRows(hist.pagination.total);
    } catch (err: any) {
      console.log("Error in fetching sales history : ", err)
      addToast(err.message || 'Failed to fetch sales history', 'danger');
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSalesTableData();
    }, 300); // debounce for search
    return () => clearTimeout(timer);
  }, [token, tablePage, tableLimit, tableSearch, tableCategory]);

  const handleAuthSuccess = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setUser(null);
    setSales([]);
  };

  // Add Sale Modal Opener triggered from Sidebar
  useEffect(() => {
    if (activeTab === 'add-sale') {
      if (isAdmin) {
        setSaleToEdit(null);
        setIsModalOpen(true);
      }
      setActiveTab('dashboard'); // return focus to dashboard
    }
  }, [activeTab, isAdmin]);

  // Reset history view when switching to history tab
  useEffect(() => {
    if (activeTab === 'history') {
      setHistoryView('months');
      setSelectedMonth(null);
      setSelectedDate(null);
    }
  }, [activeTab]);

  // CRUD Actions
  const handleOpenAddModal = () => {
    if (!isAdmin) {
      addToast(t('toastPermissionDenied'), 'danger');
      return;
    }
    setSaleToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sale: Sale) => {
    if (!isAdmin) {
      addToast(t('toastPermissionDenied'), 'danger');
      return;
    }
    setSaleToEdit(sale);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (id: string) => {
    if (!isAdmin) {
      addToast(t('toastPermissionDenied'), 'danger');
      return;
    }
    if (window.confirm(t('confirmDeleteMsg'))) {
      try {
        await deleteSale(id);
        addToast(t('toastDeleted'), 'success');
        fetchDashboardSummary();
        fetchSalesTableData();
      } catch (err: any) {
        addToast(err.message || 'Failed to delete sale', 'danger');
      }
    }
  };

  // const handleSaveSale = async (saleInput: Omit<Sale, 'id' | 'totalAmount'> & { id?: string }) => {
  //   if (!isAdmin) {
  //     addToast(t('toastPermissionDenied'), 'danger');
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       saleDate: saleInput.date,
  //       items: [{
  //         medicineName: saleInput.productName,
  //         category: saleInput.category,
  //         quantity: saleInput.quantity,
  //         unitPrice: saleInput.unitPrice
  //       }],
  //       paymentMethod: 'cash' as const
  //     };

  //     if (saleInput.id) {
  //       await updateSale(saleInput.id, payload);
  //       addToast(t('toastUpdated'), 'success');
  //     } else {
  //       await createSale(payload);
  //       addToast(t('toastAdded'), 'success');
  //     }
  //     fetchData();
  //   } catch (err: any) {
  //     addToast(err.message || 'Failed to save sale', 'danger');
  //   }

  //   setIsModalOpen(false);
  //   setSaleToEdit(null);
  // };

  const handleSaveSale = async (saleData: {
    saleDate: string;
    items: Array<{
      medicineName: string;
      category: string;
      quantity: number;
      unitPrice: number;
      totalAmount: number
    }>;
    paymentMethod: string;
  }) => {
    console.log("saleData is : ", saleData)
    if (!isAdmin) {
      addToast(t('toastPermissionDenied'), 'danger');
      return;
    }

    try {
      const payload = {
        saleDate: saleData.saleDate,
        items: saleData.items,
        paymentMethod: saleData.paymentMethod,
      };

      if (saleToEdit?.id) {
        // For edit, you'll need to implement update API that can handle multiple items
        await updateSale(saleToEdit.id, payload);
        addToast(t('toastUpdated'), 'success');
      } else {
        await createSale(payload);
        addToast(t('toastAdded'), 'success');
      }
      fetchDashboardSummary();
      fetchSalesTableData();
      setIsModalOpen(false);
      setSaleToEdit(null);
    } catch (err: any) {
      addToast(err.message || (t as any)('toastError'), 'danger');
    }
  };



  if (!token || !user) {
    return <LoginScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main dashboard space */}
      <main className="main-content">
        {/* Header toolbar */}
        <Header isAdmin={isAdmin} />

        {loading ? (
          <div className="dashboard-loading">
            <span className="spinner"></span>
          </div>
        ) : activeTab === 'history' ? (
          /* History screens */
          <>
            {historyView === 'months' && (
              <HistoryMonths
                onSelectMonth={(key, label) => {
                  setSelectedMonth({ key, label });
                  setHistoryView('datewise');
                }}
              />
            )}
            {historyView === 'datewise' && selectedMonth && (
              <HistoryDatewise
                monthKey={selectedMonth.key}
                monthLabel={selectedMonth.label}
                onBack={() => {
                  setHistoryView('months');
                  setSelectedMonth(null);
                }}
                onSelectDate={(key, label) => {
                  setSelectedDate({ key, label });
                  setHistoryView('products');
                }}
              />
            )}
            {historyView === 'products' && selectedMonth && selectedDate && (
              <HistoryProducts
                dateKey={selectedDate.key}
                dateLabel={selectedDate.label}
                monthLabel={selectedMonth.label}
                onBack={() => {
                  setHistoryView('datewise');
                  setSelectedDate(null);
                }}
                onBackToMonths={() => {
                  setHistoryView('months');
                  setSelectedMonth(null);
                  setSelectedDate(null);
                }}
              />
            )}
          </>
        ) : (
          /* Dashboard screens */
          <>
            {/* Dynamic statistics overview */}
            <StatsCards
              thisMonthSales={thisMonthSales}
              lastMonthSales={lastMonthSales}
            />

            {/* Dynamic visual charts */}
            {/* {chartData && (
              <SalesChart 
                sales={sales} 
                chartData={chartData}
              />
            )} */}

            {/* Transaction Table */}
            <div className="table-section-header">
              <h2 className="text-h2">{t('kpiTotalSales')}</h2>
              {isAdmin && (
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
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
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteConfirm}
              currentPage={tablePage}
              totalPages={tableTotalPages}
              totalRows={tableTotalRows}
              limit={tableLimit}
              search={tableSearch}
              category={tableCategory}
              onPageChange={setTablePage}
              onLimitChange={(l) => { setTableLimit(l); setTablePage(1); }}
              onSearch={(s) => { setTableSearch(s); setTablePage(1); }}
              onCategoryChange={(c) => { setTableCategory(c); setTablePage(1); }}
            />
          </>
        )}
      </main>

      {/* CRUD Add/Edit Modal */}
      <SaleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSaleToEdit(null);
        }}
        onSave={handleSaveSale}
        saleToEdit={saleToEdit}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type === 'danger' ? 'toast-danger' : ''}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

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

        .dashboard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 4px solid var(--border);
          border-radius: 50%;
          border-top-color: var(--accent);
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DashboardContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
