const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// const API_BASE_URL = 'https://pharma-1-2lx4.onrender.com/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

export interface SaleItem {
  _id?: string;
  medicineName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount?: number;
}

export interface Sale {
  _id: string;
  saleDate: string;
  items: SaleItem[];
  totalAmount: number;
  totalItems: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  createdBy: string;
  createdAt?: string;
}

export interface DashboardData {
  currentMonth: {
    month: string;
    totalAmount: number;
    totalItems: number;
    totalSales: number;
  };
  lastMonth: {
    month: string;
    totalAmount: number;
    totalItems: number;
    totalSales: number;
  };
  comparison: {
    percentageChange: string;
    trend: 'up' | 'down';
  };
  chartData: {
    allTimeTotal: number;
    categoryBreakdown: { category: string; totalAmount: number }[];
  };
  recentSales: {
    data: Sale[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface MonthlySummaryItem {
  month: number; // 1-12
  totalAmount: number;
  totalItems: number;
  totalSales: number;
}

export interface DailySalesItem {
  day: number;
  totalAmount: number;
  totalItems: number;
  totalSales: number;
}

export interface DaySalesResponse {
  summary: {
    totalAmount: number;
    totalItems: number;
  };
  sales: Sale[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  console.log("url is : ", `${API_BASE_URL}${endpoint}`)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || 'Network request failed');
  }

  return resData;
};

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const res = await authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  console.log("after api call is : ", res)
  if (res.success && res.token && res.user) {
    setAuth(res.token, res.user);
  }
  return { token: res?.data?.token, user: res?.data?.user };
};

export const signup = async (name: string, email: string, password: string, role: 'admin' | 'viewer'): Promise<{ token: string; user: User }> => {
  const res = await authFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
  if (res.success && res.token && res.user) {
    setAuth(res.token, res.user);
  }
  return { token: res.token, user: res.user };
};

export const logout = () => {
  removeAuth();
};

export const getDashboardData = async (page = 1, limit = 10): Promise<DashboardData> => {
  try {
    const res = await authFetch(`/dashboard?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("error while fetching home screen data : ", error)
  }
};

export const createSale = async (saleData: {
  saleDate?: string;
  items: { medicineName: string; category: string; quantity: number; unitPrice: number }[];
  paymentMethod?: string;
}): Promise<Sale> => {
  const res = await authFetch('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  });
  return res.data;
};

export const getSalesHistory = async (params: { year?: number; month?: number; page?: number; limit?: number; search?: string; category?: string } = {}): Promise<{ data: Sale[]; pagination: any }> => {
  const queryParts = [];
  if (params.year) queryParts.push(`year=${params.year}`);
  if (params.month) queryParts.push(`month=${params.month}`);
  if (params.page) queryParts.push(`page=${params.page}`);
  if (params.limit) queryParts.push(`limit=${params.limit}`);
  if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params.category && params.category !== 'All') queryParts.push(`category=${encodeURIComponent(params.category)}`);

  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const res = await authFetch(`/sales/history${query}`);
  return { data: res.data, pagination: res.pagination };
};

export const getMonthlySummary = async (year: number): Promise<MonthlySummaryItem[]> => {
  const res = await authFetch(`/sales/monthly-summary?year=${year}`);
  return res.data;
};

export const getDailySales = async (year: number, month: number): Promise<DailySalesItem[]> => {
  const res = await authFetch(`/sales/daily/${year}/${month}`);
  return res.data;
};

export const getDaySales = async (year: number, month: number, day: number, page = 1, limit = 10): Promise<DaySalesResponse> => {
  const res = await authFetch(`/sales/daily/${year}/${month}/${day}?page=${page}&limit=${limit}`);
  return res.data;
};

export const updateSale = async (id: string, saleData: {
  saleDate?: string;
  items: { medicineName: string; category: string; quantity: number; unitPrice: number }[];
  paymentMethod?: string;
}): Promise<Sale> => {
  const res = await authFetch(`/sales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(saleData),
  });
  return res.data;
};

export const deleteSale = async (id: string): Promise<{ success: boolean; message: string }> => {
  return await authFetch(`/sales/${id}`, {
    method: 'DELETE',
  });
};
