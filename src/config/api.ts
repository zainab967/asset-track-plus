export const API_BASE_URL = "https://localhost:7214/api";

// Configuration for fetch calls
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Expenses
  EXPENSES: `${API_BASE_URL}/Expense`,  // Changed to match C# controller
  EXPENSE_BY_ID: (id: string) => `${API_BASE_URL}/Expense/${id}`,
  
  // Reimbursements
  REIMBURSEMENTS: `${API_BASE_URL}/Asset/reimbursements`,  // Changed to match C# controller
  REIMBURSEMENT_BY_ID: (id: string) => `${API_BASE_URL}/Asset/reimbursements/${id}`,
  
  // Complaints & Suggestions
  FEEDBACK: `${API_BASE_URL}/ComplaintsSuggestions`,  // Changed to match C# controller
  FEEDBACK_BY_ID: (id: string) => `${API_BASE_URL}/ComplaintsSuggestions/${id}`,
  
  // Assets
  ASSETS: `${API_BASE_URL}/assets`,
  ASSET_BY_ID: (id: string) => `${API_BASE_URL}/assets/${id}`,
};
