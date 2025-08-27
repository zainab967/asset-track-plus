import { API_ENDPOINTS } from "@/config/api";

export interface Reimbursement {
  id: string;
  name: string;
  amount: number;
  user: string;
  building: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  type: string;
  description?: string;
  media?: File[];
}

export async function fetchReimbursements() {
  const response = await fetch(API_ENDPOINTS.REIMBURSEMENTS, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization header when you implement JWT
      // 'Authorization': `Bearer ${token}`
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch reimbursements');
  }
  
  return response.json();
}

export async function createReimbursement(data: Omit<Reimbursement, 'id'>) {
  const response = await fetch(API_ENDPOINTS.REIMBURSEMENTS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create reimbursement');
  }
  
  return response.json();
}

export async function updateReimbursementStatus(id: string, status: 'approved' | 'rejected') {
  const response = await fetch(`${API_ENDPOINTS.REIMBURSEMENT_BY_ID(id)}/${status}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to ${status} reimbursement`);
  }
  
  return response.json();
}
