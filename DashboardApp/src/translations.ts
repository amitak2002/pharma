export interface Translations {
  title: string;
  subtitle: string;
  adminMode: string;
  viewerMode: string;
  adminStatus: string;
  searchPlaceholder: string;
  categoryAll: string;
  categoryAntibiotics: string;
  categoryPainkillers: string;
  categoryVitamins: string;
  categoryDevices: string;
  categoryOther: string;

  // Sidebar
  navDashboard: string;
  navAddSale: string;
  navHistory: string;
  navLanguage: string;
  navTheme: string;

  // KPI Cards
  kpiThisMonth: string;
  kpiLastMonth: string;
  kpiLastYear: string;
  kpiTrendUp: string;
  kpiTrendDown: string;
  kpiGrowth: string;
  kpiTotalSales: string;

  // Chart
  chartSalesTrend: string;
  chartComparison: string;
  chartCategoryTitle: string;
  chartCurrentMonth: string;
  chartLastMonth: string;

  // Table
  tableInvoice: string;
  tableDate: string;
  tableProduct: string;
  tableCategory: string;
  tableQuantity: string;
  tableUnitPrice: string;
  tableTotal: string;
  tableActions: string;
  tableNoData: string;
  tablePaginationInfo: string;

  // CRUD Actions & Buttons
  btnEdit: string;
  btnDelete: string;
  btnAddSale: string;
  btnSave: string;
  btnCancel: string;

  // Modal Fields
  modalAddTitle: string;
  modalEditTitle: string;
  fieldProductName: string;
  fieldCategory: string;
  fieldQuantity: string;
  fieldUnitPrice: string;
  fieldDate: string;
  validationRequired: string;
  validationPositiveNumber: string;

  // Confirmations & Toast
  confirmDeleteTitle: string;
  confirmDeleteMsg: string;
  toastAdded: string;
  toastUpdated: string;
  toastDeleted: string;
  toastPermissionDenied: string;

  // Themes
  themeLight: string;
  themeDark: string;
  themeEmerald: string;

  // History
  historySubtitle: string;
  historyTotalSale: string;
  historyTransactions: string;
  historyItemsSold: string;
  historyBackToMonths: string;
  historyDatewiseSubtitle: string;
  historyActiveDays: string;
  historyProductSubtitle: string;
  historyProducts: string;
  historyGrandTotal: string;
}

export const translations: Record<string, Translations> = {
  en: {
    title: "Prince Pharma DashBoard",
    subtitle: "Medical Shop Sales Analytics",
    adminMode: "Admin Mode",
    viewerMode: "Viewer Mode",
    adminStatus: "Role: Admin",
    searchPlaceholder: "Search medicines, invoices...",
    categoryAll: "All Categories",
    categoryAntibiotics: "Antibiotics",
    categoryPainkillers: "Painkillers",
    categoryVitamins: "Vitamins",
    categoryDevices: "Medical Devices",
    categoryOther: "Other OTC",

    navDashboard: "Dashboard Home",
    navAddSale: "Record New Sale",
    navHistory: "Sales History",
    navLanguage: "Language",
    navTheme: "Theme",

    kpiThisMonth: "This Month's Sales",
    kpiLastMonth: "Previous Month's Sales",
    kpiLastYear: "Previous Year's Sales",
    kpiTrendUp: "higher than last month",
    kpiTrendDown: "lower than last month",
    kpiGrowth: "Growth Rate",
    kpiTotalSales: "Sales Overview",

    chartSalesTrend: "Daily Sales Trend (This Month vs Previous Month)",
    chartComparison: "Sales comparison by date",
    chartCategoryTitle: "Sales Contribution by Medicine Category",
    chartCurrentMonth: "Current Month",
    chartLastMonth: "Previous Month",

    tableInvoice: "Invoice ID",
    tableDate: "Sale Date",
    tableProduct: "Medicine Name",
    tableCategory: "Category",
    tableQuantity: "Qty Sold",
    tableUnitPrice: "Unit Price (₹)",
    tableTotal: "Total Amount (₹)",
    tableActions: "Actions",
    tableNoData: "No sales records found.",
    tablePaginationInfo: "Showing {start} to {end} of {total} records",

    btnEdit: "Edit",
    btnDelete: "Delete",
    btnAddSale: "Add Sale",
    btnSave: "Save Record",
    btnCancel: "Cancel",

    modalAddTitle: "Add New Sale Entry",
    modalEditTitle: "Modify Sale Record",
    fieldProductName: "Medicine Name",
    fieldCategory: "Medicine Category",
    fieldQuantity: "Quantity",
    fieldUnitPrice: "Unit Price (₹)",
    fieldDate: "Sale Date",
    validationRequired: "This field is required",
    validationPositiveNumber: "Must be a positive number",

    confirmDeleteTitle: "Confirm Delete",
    confirmDeleteMsg: "Are you sure you want to delete this sale record? This action cannot be undone.",
    toastAdded: "Sale record added successfully!",
    toastUpdated: "Sale record updated successfully!",
    toastDeleted: "Sale record has been deleted.",
    toastPermissionDenied: "Access denied. Admin privileges required.",

    themeLight: "Light Clinical",
    themeDark: "Dark Pharmacy",
    themeEmerald: "Emerald Mint",

    historySubtitle: "Browse your monthly sales records",
    historyTotalSale: "Total Sale",
    historyTransactions: "Transactions",
    historyItemsSold: "Items Sold",
    historyBackToMonths: "Back to Months",
    historyDatewiseSubtitle: "Date-wise sales breakdown",
    historyActiveDays: "Active Days",
    historyProductSubtitle: "Product-wise sale details",
    historyProducts: "Products",
    historyGrandTotal: "Grand Total"
  },
  hi: {
    title: "प्रिंस फार्मा डैशबोर्ड",
    subtitle: "मेडिकल स्टोर बिक्री विश्लेषिकी",
    adminMode: "एडमिन मोड",
    viewerMode: "व्यूअर मोड",
    adminStatus: "भूमिका: एडमिन",
    searchPlaceholder: "दवाइयाँ या इनवॉइस खोजें...",
    categoryAll: "सभी श्रेणियां",
    categoryAntibiotics: "एंटीबायोटिक्स",
    categoryPainkillers: "दर्द निवारक",
    categoryVitamins: "विटामिन",
    categoryDevices: "चिकित्सा उपकरण",
    categoryOther: "अन्य दवाएं",

    navDashboard: "मुख्य डैशबोर्ड",
    navAddSale: "नई बिक्री दर्ज करें",
    navHistory: "बिक्री इतिहास",
    navLanguage: "भाषा बदलें",
    navTheme: "थीम बदलें",

    kpiThisMonth: "इस महीने की बिक्री",
    kpiLastMonth: "पिछले महीने की बिक्री",
    kpiLastYear: "पिछले वर्ष की बिक्री",
    kpiTrendUp: "पिछले महीने से अधिक",
    kpiTrendDown: "पिछले महीने से कम",
    kpiGrowth: "विकास दर",
    kpiTotalSales: "बिक्री अवलोकन",

    chartSalesTrend: "दैनिक बिक्री का रुझान (इस महीने बनाम पिछला महीना)",
    chartComparison: "तारीख के अनुसार बिक्री की तुलना",
    chartCategoryTitle: "दवा श्रेणी के आधार पर बिक्री का योगदान",
    chartCurrentMonth: "चालू माह",
    chartLastMonth: "पिछला महीना",

    tableInvoice: "इनवॉइस आईडी",
    tableDate: "बिक्री की तारीख",
    tableProduct: "दवा का नाम",
    tableCategory: "श्रेणी",
    tableQuantity: "मात्रा",
    tableUnitPrice: "प्रति इकाई मूल्य (₹)",
    tableTotal: "कुल मूल्य (₹)",
    tableActions: "कार्रवाई",
    tableNoData: "बिक्री का कोई रिकॉर्ड नहीं मिला।",
    tablePaginationInfo: "{total} रिकॉर्ड्स में से {start} से {end} दिखाई दे रहे हैं",

    btnEdit: "संशोधित करें",
    btnDelete: "हटाएं",
    btnAddSale: "बिक्री जोड़ें",
    btnSave: "रिकॉर्ड सहेजें",
    btnCancel: "रद्द करें",

    modalAddTitle: "नई बिक्री प्रविष्टि जोड़ें",
    modalEditTitle: "बिक्री रिकॉर्ड संशोधित करें",
    fieldProductName: "दवा का नाम",
    fieldCategory: "दवा की श्रेणी",
    fieldQuantity: "मात्रा",
    fieldUnitPrice: "इकाई मूल्य (₹)",
    fieldDate: "बिक्री की तारीख",
    validationRequired: "यह फ़ील्ड आवश्यक है",
    validationPositiveNumber: "सकारात्मक संख्या होनी चाहिए",

    confirmDeleteTitle: "हटाने की पुष्टि करें",
    confirmDeleteMsg: "क्या आप वाकई इस बिक्री रिकॉर्ड को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",
    toastAdded: "बिक्री रिकॉर्ड सफलतापूर्वक जोड़ा गया!",
    toastUpdated: "बिक्री रिकॉर्ड सफलतापूर्वक अपडेट किया गया!",
    toastDeleted: "बिक्री रिकॉर्ड हटा दिया गया है।",
    toastPermissionDenied: "पहुंच अस्वीकृत। एडमिन विशेषाधिकार आवश्यक हैं।",

    themeLight: "लाइट क्लीनिकल",
    themeDark: "डार्क फार्मेसी",
    themeEmerald: "एमराल्ड मिंट",

    historySubtitle: "अपने मासिक बिक्री रिकॉर्ड देखें",
    historyTotalSale: "कुल बिक्री",
    historyTransactions: "लेनदेन",
    historyItemsSold: "बेची गई वस्तुएं",
    historyBackToMonths: "महीनों पर वापस जाएं",
    historyDatewiseSubtitle: "तारीख के अनुसार बिक्री विवरण",
    historyActiveDays: "सक्रिय दिन",
    historyProductSubtitle: "उत्पाद-वार बिक्री विवरण",
    historyProducts: "उत्पाद",
    historyGrandTotal: "कुल योग"
  },
  hinglish: {
    title: "MedVeda Dashboard",
    subtitle: "Medical Shop ki Sales Analytics",
    adminMode: "Admin Mode",
    viewerMode: "Viewer Mode",
    adminStatus: "Role: Admin",
    searchPlaceholder: "Medicines ya invoice search karein...",
    categoryAll: "Sabhi Categories",
    categoryAntibiotics: "Antibiotics",
    categoryPainkillers: "Painkillers (Dard Nivarak)",
    categoryVitamins: "Vitamins & Supplements",
    categoryDevices: "Medical Devices",
    categoryOther: "Baki OTC Dawai",

    navDashboard: "Dashboard Home",
    navAddSale: "New Sale Entry",
    navHistory: "Sales History",
    navLanguage: "Bhasha (Language)",
    navTheme: "Theme",

    kpiThisMonth: "Is Month ki Sale",
    kpiLastMonth: "Last Month ki Sale",
    kpiLastYear: "Last Year ki Sale",
    kpiTrendUp: "pichle mahine se zyada",
    kpiTrendDown: "pichle mahine se kam",
    kpiGrowth: "Growth Rate",
    kpiTotalSales: "Sales Overview",

    chartSalesTrend: "Daily Sales Trend (This Month vs Previous Month)",
    chartComparison: "Tarikh ke hisab se sales comparison",
    chartCategoryTitle: "Medicine Category ke hisab se Sales Share",
    chartCurrentMonth: "Yeh Mahina (Current Month)",
    chartLastMonth: "Pichla Mahina (Prev Month)",

    tableInvoice: "Invoice ID",
    tableDate: "Sale ki Date",
    tableProduct: "Medicine ka Naam",
    tableCategory: "Category",
    tableQuantity: "Kitni Biki (Qty)",
    tableUnitPrice: "Ek ka Price (₹)",
    tableTotal: "Total Amount (₹)",
    tableActions: "Actions",
    tableNoData: "Koi sales record nahi mila.",
    tablePaginationInfo: "{total} records mein se {start} se {end} dikh rahe hain",

    btnEdit: "Edit karein",
    btnDelete: "Delete",
    btnAddSale: "Sale Add Karein",
    btnSave: "Record Save Karein",
    btnCancel: "Cancel Karein",

    modalAddTitle: "New Sale Entry Karein",
    modalEditTitle: "Sale Record Edit Karein",
    fieldProductName: "Medicine ka Naam",
    fieldCategory: "Medicine ki Category",
    fieldQuantity: "Quantity (Mantra)",
    fieldUnitPrice: "Unit Price (₹)",
    fieldDate: "Sale ki Date",
    validationRequired: "Yeh field bharna zaroori hai",
    validationPositiveNumber: "Positive number hona chahiye",

    confirmDeleteTitle: "Delete ki Confirmation",
    confirmDeleteMsg: "Kya aap sach me is sale record ko delete karna chahte hain? Yeh wapas nahi aayega.",
    toastAdded: "Sale record successfully add ho gaya!",
    toastUpdated: "Sale record successfully update ho gaya!",
    toastDeleted: "Sale record delete ho gaya hai.",
    toastPermissionDenied: "Access denied. Admin hona zaroori hai.",

    themeLight: "Light Clinical",
    themeDark: "Dark Pharmacy",
    themeEmerald: "Emerald Mint",

    historySubtitle: "Apne monthly sales records dekhein",
    historyTotalSale: "Total Sale",
    historyTransactions: "Transactions",
    historyItemsSold: "Items Sold",
    historyBackToMonths: "Months pe wapas jaayein",
    historyDatewiseSubtitle: "Date ke hisab se sales breakdown",
    historyActiveDays: "Active Days",
    historyProductSubtitle: "Product ke hisab se sale details",
    historyProducts: "Products",
    historyGrandTotal: "Grand Total"
  }
};
