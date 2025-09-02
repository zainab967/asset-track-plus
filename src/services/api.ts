import { API_BASE_URL, API_CONFIG } from '@/config/api';
import {
    DepartmentDto,
    CreateDepartmentDto,
    UserDto,
    CreateUserDto,
    AssetDto,
    CreateAssetDto,
    ExpenseDto,
    CreateExpenseDto,
    ComplaintSuggestionDto,
    CreateComplaintSuggestionDto
} from '@/types/api';

// Department APIs
export const departmentApi = {
    getAll: async (): Promise<DepartmentDto[]> => {
        const response = await fetch(`${API_BASE_URL}/departments`, API_CONFIG);
        if (!response.ok) throw new Error('Failed to fetch departments');
        return response.json();
    },

    getById: async (id: string): Promise<DepartmentDto> => {
        const response = await fetch(`${API_BASE_URL}/departments/${id}`, API_CONFIG);
        if (!response.ok) throw new Error('Failed to fetch department');
        return response.json();
    },

    create: async (data: CreateDepartmentDto): Promise<DepartmentDto> => {
        const response = await fetch(`${API_BASE_URL}/departments`, {
            ...API_CONFIG,
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create department');
        return response.json();
    },

    update: async (id: string, data: CreateDepartmentDto): Promise<DepartmentDto> => {
        const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
            ...API_CONFIG,
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update department');
        return response.json();
    }
};

// Asset APIs
export const assetApi = {
    getAll: async (): Promise<AssetDto[]> => {
        const response = await fetch(`${API_BASE_URL}/assets`, API_CONFIG);
        if (!response.ok) throw new Error('Failed to fetch assets');
        return response.json();
    },

    create: async (data: CreateAssetDto): Promise<AssetDto> => {
        const response = await fetch(`${API_BASE_URL}/assets`, {
            ...API_CONFIG,
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create asset');
        return response.json();
    }
};

// Expense APIs
export const expenseApi = {
    getAll: async (): Promise<ExpenseDto[]> => {
        const response = await fetch(`${API_BASE_URL}/expense`, API_CONFIG);
        if (!response.ok) throw new Error('Failed to fetch expenses');
        return response.json();
    },

    create: async (data: CreateExpenseDto): Promise<ExpenseDto> => {
        const response = await fetch(`${API_BASE_URL}/expense`, {
            ...API_CONFIG,
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create expense');
        return response.json();
    }
};

// Complaint/Suggestion APIs
export const complaintApi = {
    getAll: async (): Promise<ComplaintSuggestionDto[]> => {
        const response = await fetch(`${API_BASE_URL}/ComplaintsSuggestions`, API_CONFIG);
        if (!response.ok) throw new Error('Failed to fetch complaints');
        return response.json();
    },

    create: async (data: CreateComplaintSuggestionDto): Promise<ComplaintSuggestionDto> => {
        const response = await fetch(`${API_BASE_URL}/ComplaintsSuggestions`, {
            ...API_CONFIG,
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create complaint/suggestion');
        return response.json();
    }
};
