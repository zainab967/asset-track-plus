// Enums
export enum UserRole {
    Employee = 0,
    Manager = 1,
    Admin = 2
}

export enum AssetStatus {
    Available = 0,
    InUse = 1,
    UnderMaintenance = 2,
    Retired = 3
}

export enum AssetCondition {
    New = 0,
    Good = 1,
    Fair = 2,
    Poor = 3
}

export enum MaintenanceType {
    Preventive = 0,
    Corrective = 1,
    Emergency = 2
}

export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

export enum ExpenseStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export enum ExpenseType {
    Travel = 0,
    Office = 1,
    Equipment = 2,
    Other = 3
}

export enum ComplaintType {
    Complaint = 0,
    Suggestion = 1,
    Other = 2
}

// DTOs
export interface DepartmentDto {
    id: string;
    name: string;
    description: string;
    managerId?: string;
    managerName?: string;
    budget: number;
    currentSpending: number;
    employeeCount: number;
    createdAt: string;
}

export interface CreateDepartmentDto {
    name: string;
    description: string;
    managerId?: string;
    budget: number;
}

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    role: UserRole;
    department: string;
    departmentId: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    departmentId: string;
    password: string;
    sendWelcomeEmail: boolean;
}

export interface AssetDto {
    id: string;
    name: string;
    category: string;
    serialNumber: string;
    assignedTo?: string;
    assignedUser?: string;
    departmentId: string;
    department: string;
    status: AssetStatus;
    value: number;
    purchasePrice: number;
    purchaseDate: string;
    condition: AssetCondition;
    location: string;
    warrantyExpiry?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAssetDto {
    name: string;
    category: string;
    serialNumber: string;
    departmentId: string;
    purchasePrice: number;
    purchaseDate: string;
    condition: AssetCondition;
    location: string;
    warrantyExpiry?: string;
}

export interface ExpenseDto {
    id: string;
    name: string;
    amount: number;
    userId: string;
    user: string;
    departmentId: string;
    department: string;
    date: string;
    status: ExpenseStatus;
    type: ExpenseType;
    category: string;
    description: string;
    receiptUrl?: string;
    approvedBy?: string;
    approvedByUser?: string;
    approvedAt?: string;
    rejectionReason?: string;
    reviewedAt?: string;
    reviewedById?: string;
    reviewedByUser?: string;
    reviewNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateExpenseDto {
    name: string;
    amount: number;
    departmentId: string;
    date: string;
    type: ExpenseType;
    category: string;
    description: string;
    receiptUrl?: string;
}

export interface ComplaintSuggestionDto {
    id: string;
    title: string;
    description: string;
    type: ComplaintType;
    category: string;
    priority: Priority;
    status: number;
    submittedBy: string;
    submittedByUser: string;
    departmentId: string;
    department: string;
    assignedTo?: string;
    assignedToUser?: string;
    resolution?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateComplaintSuggestionDto {
    title: string;
    description: string;
    type: ComplaintType;
    category: string;
    priority: Priority;
    departmentId: string;
}

export interface AssetAssignmentDto {
    id: string;
    assetId: string;
    assetName: string;
    userId: string;
    userName: string;
    assignedDate: string;
    returnedDate?: string;
    notes?: string;
    isActive: boolean;
}

export interface AssetMaintenanceLogDto {
    id: string;
    assetId: string;
    maintenanceType: MaintenanceType;
    description: string;
    cost: number;
    performedBy: string;
    performedByUser: string;
    performedDate: string;
    nextScheduledDate?: string;
    notes?: string;
    createdAt: string;
}

export interface AssetLogDto {
    id: string;
    name: string;
    currentUser?: string;
    assignDate?: string;
    purchaseDate: string;
    purchasePrice: number;
    status: AssetStatus;
    location: string;
    assignments: AssetAssignmentDto[];
    maintenanceLogs: AssetMaintenanceLogDto[];
}
