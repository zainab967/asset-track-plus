# Backend Architecture Report for Corporate Management System

## Overview
This report outlines the complete backend architecture required to support the Corporate Management System. The system handles expense tracking, asset management, reimbursements, complaints/suggestions, and user management with role-based access control.

## 1. Entities / Data Models

### 1.1 User Management

#### User
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role NOT NULL DEFAULT 'employee',
    department VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'hr', 'employee');
```

#### UserPermissions
```sql
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, permission)
);
```

### 1.2 Department Management

#### Department
```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES users(id),
    budget DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 1.3 Expense Management

#### Expense
```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    department_id UUID REFERENCES departments(id) NOT NULL,
    date DATE NOT NULL,
    status expense_status DEFAULT 'pending',
    type expense_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    receipt_url VARCHAR(500),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE expense_type AS ENUM ('one-time', 'recurring');
```

#### ExpenseDocument
```sql
CREATE TABLE expense_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 1.4 Asset Management

#### Asset
```sql
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    assigned_to UUID REFERENCES users(id),
    department_id UUID REFERENCES departments(id) NOT NULL,
    status asset_status DEFAULT 'unassigned',
    value DECIMAL(15,2) NOT NULL,
    purchase_date DATE NOT NULL,
    condition asset_condition NOT NULL,
    location VARCHAR(255),
    warranty_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE asset_status AS ENUM ('assigned', 'unassigned', 'maintenance', 'retired');
CREATE TYPE asset_condition AS ENUM ('excellent', 'good', 'fair', 'poor');
```

#### AssetRequest
```sql
CREATE TABLE asset_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    requested_date DATE NOT NULL,
    reason TEXT NOT NULL,
    duration_type duration_type NOT NULL,
    return_date DATE,
    specifications TEXT,
    department_id UUID REFERENCES departments(id) NOT NULL,
    status request_status DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE duration_type AS ENUM ('permanent', 'temporary');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'fulfilled');
```

#### AssetMaintenance
```sql
CREATE TABLE asset_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES users(id) NOT NULL,
    issue_description TEXT NOT NULL,
    maintenance_type maintenance_type NOT NULL,
    priority priority_level DEFAULT 'medium',
    status maintenance_status DEFAULT 'pending',
    assigned_to UUID REFERENCES users(id),
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE maintenance_type AS ENUM ('repair', 'replacement', 'upgrade', 'inspection');
CREATE TYPE maintenance_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
```

### 1.5 Reimbursement Management

#### Reimbursement
```sql
CREATE TABLE reimbursements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    department_id UUID REFERENCES departments(id) NOT NULL,
    date DATE NOT NULL,
    status reimbursement_status DEFAULT 'pending',
    type reimbursement_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    receipt_urls TEXT[],
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE reimbursement_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
CREATE TYPE reimbursement_type AS ENUM ('medical', 'travel', 'equipment', 'other');
```

### 1.6 Complaints & Suggestions

#### ComplaintSuggestion
```sql
CREATE TABLE complaint_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type feedback_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority priority_level DEFAULT 'medium',
    status feedback_status DEFAULT 'open',
    submitted_by UUID REFERENCES users(id) NOT NULL,
    department_id UUID REFERENCES departments(id) NOT NULL,
    assigned_to UUID REFERENCES users(id),
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE feedback_type AS ENUM ('complaint', 'suggestion');
CREATE TYPE feedback_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');
```

### 1.7 Ledger & Accounting

#### LedgerEntry
```sql
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id UUID NOT NULL, -- Can reference expense, reimbursement, etc.
    reference_type entry_type NOT NULL,
    account_code VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    department_id UUID REFERENCES departments(id),
    posted_by UUID REFERENCES users(id) NOT NULL,
    posting_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE entry_type AS ENUM ('expense', 'reimbursement', 'asset_purchase', 'adjustment');
```

## 2. Relationships Between Models

### Primary Relationships:
- **Users** ↔ **Departments**: Many-to-One (users belong to departments)
- **Users** ↔ **Assets**: One-to-Many (users can be assigned multiple assets)
- **Users** ↔ **Expenses**: One-to-Many (users create multiple expenses)
- **Users** ↔ **Reimbursements**: One-to-Many (users submit multiple reimbursements)
- **Users** ↔ **AssetRequests**: One-to-Many (users make multiple asset requests)
- **Users** ↔ **ComplaintSuggestions**: One-to-Many (users submit multiple feedback items)
- **Assets** ↔ **AssetMaintenance**: One-to-Many (assets have maintenance records)
- **Expenses** ↔ **ExpenseDocuments**: One-to-Many (expenses can have multiple documents)
- **LedgerEntries** ↔ **All Financial Entities**: Polymorphic relationship via reference_id

## 3. API Endpoints

### 3.1 Authentication & User Management
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
PUT    /api/auth/profile

GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
PUT    /api/users/:id/role
GET    /api/users/:id/permissions
PUT    /api/users/:id/permissions
```

### 3.2 Department Management
```
GET    /api/departments
POST   /api/departments
GET    /api/departments/:id
PUT    /api/departments/:id
DELETE /api/departments/:id
GET    /api/departments/:id/users
GET    /api/departments/:id/budget
```

### 3.3 Expense Management
```
GET    /api/expenses
POST   /api/expenses
GET    /api/expenses/:id
PUT    /api/expenses/:id
DELETE /api/expenses/:id
PUT    /api/expenses/:id/approve
PUT    /api/expenses/:id/reject
POST   /api/expenses/:id/documents
DELETE /api/expenses/:id/documents/:docId
GET    /api/expenses/categories
GET    /api/expenses/reports
```

### 3.4 Asset Management
```
GET    /api/assets
POST   /api/assets
GET    /api/assets/:id
PUT    /api/assets/:id
DELETE /api/assets/:id
PUT    /api/assets/:id/assign
PUT    /api/assets/:id/unassign
GET    /api/assets/my-assets

GET    /api/asset-requests
POST   /api/asset-requests
GET    /api/asset-requests/:id
PUT    /api/asset-requests/:id
PUT    /api/asset-requests/:id/approve
PUT    /api/asset-requests/:id/reject

GET    /api/asset-maintenance
POST   /api/asset-maintenance
GET    /api/asset-maintenance/:id
PUT    /api/asset-maintenance/:id
PUT    /api/asset-maintenance/:id/complete
```

### 3.5 Reimbursement Management
```
GET    /api/reimbursements
POST   /api/reimbursements
GET    /api/reimbursements/:id
PUT    /api/reimbursements/:id
DELETE /api/reimbursements/:id
PUT    /api/reimbursements/:id/approve
PUT    /api/reimbursements/:id/reject
PUT    /api/reimbursements/:id/pay
```

### 3.6 Complaints & Suggestions
```
GET    /api/feedback
POST   /api/feedback
GET    /api/feedback/:id
PUT    /api/feedback/:id
PUT    /api/feedback/:id/assign
PUT    /api/feedback/:id/resolve
GET    /api/feedback/categories
```

### 3.7 Ledger & Reporting
```
GET    /api/ledger
POST   /api/ledger/entries
GET    /api/ledger/entries/:id
GET    /api/reports/expenses
GET    /api/reports/assets
GET    /api/reports/reimbursements
GET    /api/reports/departmental
GET    /api/reports/financial-summary
```

## 4. Authentication and Roles

### 4.1 Authentication Strategy
- **JWT-based authentication** with refresh tokens
- **Session persistence** in secure HTTP-only cookies
- **Multi-factor authentication** for admin users
- **Password reset** functionality via email

### 4.2 Role-Based Access Control (RBAC)

#### Role Hierarchy:
1. **Admin**: Full system access
2. **Manager**: Department-level management access
3. **HR**: Employee and policy management access
4. **Employee**: Limited access to personal data

#### Permission Matrix:
| Feature | Admin | Manager | HR | Employee |
|---------|-------|---------|----|---------| 
| View All Expenses | ✓ | Dept Only | ✓ | Own Only |
| Approve Expenses | ✓ | Dept Only | ✓ | ✗ |
| Manage Assets | ✓ | Dept Only | ✓ | Request Only |
| Approve Asset Requests | ✓ | Dept Only | ✓ | ✗ |
| View Reimbursements | ✓ | Dept Only | ✓ | Own Only |
| Manage Users | ✓ | ✗ | ✓ | ✗ |
| View Reports | ✓ | Dept Only | ✓ | Limited |
| Handle Complaints | ✓ | Dept Only | ✓ | Submit Only |

### 4.3 API Security
- **Rate limiting**: 100 requests per minute per user
- **CORS configuration**: Restrict to known domains
- **Input validation**: All endpoints validate input data
- **SQL injection protection**: Use parameterized queries
- **XSS protection**: Sanitize all user inputs

## 5. Validation Rules

### 5.1 User Data Validation
```typescript
// User creation/update
{
  email: "Valid email format, unique in system",
  name: "2-100 characters, letters and spaces only",
  role: "Must be one of: admin, manager, hr, employee",
  department: "Must exist in departments table",
  password: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
}
```

### 5.2 Financial Data Validation
```typescript
// Expense validation
{
  amount: "Positive decimal, max 2 decimal places, < $100,000",
  date: "Cannot be future date, within 90 days",
  category: "Must be from predefined categories",
  description: "5-500 characters",
  receipts: "Valid file formats: PDF, JPG, PNG, max 5MB each"
}

// Reimbursement validation
{
  amount: "Positive decimal, max 2 decimal places, < $50,000",
  type: "Must be: medical, travel, equipment, other",
  medicalAmount: "Max $10,000 per year per employee",
  travelAmount: "Requires manager approval > $1,000"
}
```

### 5.3 Asset Data Validation
```typescript
// Asset validation
{
  serialNumber: "Unique across all assets",
  value: "Positive number, required for tracking",
  purchaseDate: "Cannot be future date",
  condition: "Must be: excellent, good, fair, poor",
  assignedTo: "Must be active employee"
}
```

## 6. Business Rules

### 6.1 Expense Management Rules
1. **Approval Workflow**:
   - Expenses < $500: Auto-approved for employees
   - Expenses $500-$2000: Requires manager approval
   - Expenses > $2000: Requires admin approval
   - Recurring expenses: Require annual review

2. **Department Budget Rules**:
   - Cannot exceed monthly department budget
   - Warn at 80% of budget utilization
   - Block non-critical expenses at 95% utilization

3. **Receipt Requirements**:
   - Mandatory for all expenses > $25
   - Must be uploaded within 7 days of expense
   - Automatic rejection after 30 days without receipt

### 6.2 Asset Management Rules
1. **Assignment Rules**:
   - One laptop per employee maximum
   - High-value assets (>$1000) require manager approval
   - Temporary assignments auto-expire after specified period

2. **Maintenance Rules**:
   - Assets in 'poor' condition automatically flagged for maintenance
   - Preventive maintenance scheduled annually for electronics
   - Critical priority maintenance requires immediate attention

3. **Depreciation Rules**:
   - Electronics: 3-year depreciation schedule
   - Furniture: 7-year depreciation schedule
   - Vehicles: 5-year depreciation schedule

### 6.3 Reimbursement Rules
1. **Medical Reimbursements**:
   - Annual limit: $10,000 per employee
   - Requires valid medical receipts
   - Pre-approval required for procedures > $5,000

2. **Travel Reimbursements**:
   - Domestic travel: Manager approval required
   - International travel: Admin approval required
   - Per diem rates based on location

3. **Equipment Reimbursements**:
   - Home office equipment: Max $2,000 per year
   - Must be work-related purchases
   - Equipment becomes company property

### 6.4 User Access Rules
1. **Role Assignment**:
   - Only admins can assign admin roles
   - HR can assign up to manager roles
   - Managers can assign employee roles in their department

2. **Data Access**:
   - Employees see only their own data
   - Managers see department data
   - HR sees all employee data
   - Admins have unrestricted access

## 7. API Payloads

### 7.1 Authentication & User Management

#### POST /api/auth/login
**Request:**
```json
{
  "email": "user@company.com",
  "password": "SecurePass123",
  "rememberMe": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "employee",
      "department": "IT",
      "active": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### GET /api/users
**Request Query Params:**
```
?page=1&limit=20&role=employee&department=IT&search=john&active=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "john.doe@company.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "employee",
        "department": "IT",
        "active": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### POST /api/users
**Request:**
```json
{
  "email": "newuser@company.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "employee",
  "department": "HR",
  "password": "TempPass123",
  "sendWelcomeEmail": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@company.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employee",
      "department": "HR",
      "active": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "User created successfully"
}
```

### 7.2 Department Management

#### GET /api/departments
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Information Technology",
      "description": "Handles all IT operations and support",
      "managerId": "uuid",
      "managerName": "John Manager",
      "budget": 500000.00,
      "currentSpending": 350000.00,
      "employeeCount": 25,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/departments
**Request:**
```json
{
  "name": "Marketing",
  "description": "Marketing and brand management",
  "managerId": "uuid",
  "budget": 300000.00
}
```

### 7.3 Expense Management

#### GET /api/expenses
**Request Query Params:**
```
?page=1&limit=20&status=pending&department=IT&dateFrom=2024-01-01&dateTo=2024-01-31&userId=uuid
```

**Response:**
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "uuid",
        "name": "Office Supplies",
        "amount": 156.75,
        "userId": "uuid",
        "userName": "John Doe",
        "departmentId": "uuid",
        "departmentName": "IT",
        "date": "2024-01-15",
        "status": "pending",
        "type": "one-time",
        "category": "Office Supplies",
        "description": "Notebooks, pens, and paper for team",
        "receiptUrl": "https://storage.example.com/receipts/receipt-123.pdf",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    },
    "summary": {
      "totalAmount": 15675.50,
      "pendingAmount": 5432.25,
      "approvedAmount": 8765.75,
      "rejectedAmount": 1477.50
    }
  }
}
```

#### POST /api/expenses
**Request:**
```json
{
  "name": "Client Lunch Meeting",
  "amount": 85.50,
  "date": "2024-01-15",
  "type": "one-time",
  "category": "Business Meals",
  "description": "Lunch meeting with potential client ABC Corp",
  "receiptFile": "base64-encoded-file-data"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "expense": {
      "id": "uuid",
      "name": "Client Lunch Meeting",
      "amount": 85.50,
      "status": "pending",
      "receiptUrl": "https://storage.example.com/receipts/receipt-456.pdf",
      "createdAt": "2024-01-15T14:30:00Z"
    }
  },
  "message": "Expense submitted successfully"
}
```

#### PUT /api/expenses/:id/approve
**Request:**
```json
{
  "approvalNotes": "Approved for Q1 budget allocation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "expense": {
      "id": "uuid",
      "status": "approved",
      "approvedBy": "uuid",
      "approvedAt": "2024-01-16T09:15:00Z"
    }
  },
  "message": "Expense approved successfully"
}
```

### 7.4 Asset Management

#### GET /api/assets
**Request Query Params:**
```
?page=1&limit=20&status=assigned&category=laptop&assignedTo=uuid&condition=good
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "id": "uuid",
        "name": "MacBook Pro 14-inch",
        "category": "Laptop",
        "serialNumber": "MBP2024001",
        "assignedTo": "uuid",
        "assignedToName": "John Doe",
        "departmentId": "uuid",
        "departmentName": "IT",
        "status": "assigned",
        "value": 2499.00,
        "purchaseDate": "2024-01-10",
        "condition": "excellent",
        "location": "Office Floor 3",
        "warrantyExpiry": "2027-01-10",
        "createdAt": "2024-01-10T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 250,
      "totalPages": 13
    },
    "summary": {
      "totalValue": 856750.00,
      "assignedCount": 180,
      "unassignedCount": 45,
      "maintenanceCount": 15,
      "retiredCount": 10
    }
  }
}
```

#### POST /api/assets
**Request:**
```json
{
  "name": "Dell OptiPlex 7090",
  "category": "Desktop",
  "serialNumber": "DOP2024001",
  "departmentId": "uuid",
  "value": 899.00,
  "purchaseDate": "2024-01-15",
  "condition": "excellent",
  "location": "Office Floor 2",
  "warrantyExpiry": "2026-01-15",
  "specifications": {
    "processor": "Intel i7",
    "ram": "16GB",
    "storage": "512GB SSD"
  }
}
```

#### POST /api/asset-requests
**Request:**
```json
{
  "assetName": "MacBook Pro for Development",
  "requestedDate": "2024-01-20",
  "reason": "Current laptop is outdated and affecting productivity",
  "durationType": "permanent",
  "specifications": "MacBook Pro 14-inch, 16GB RAM, 512GB SSD",
  "departmentId": "uuid"
}
```

#### POST /api/asset-maintenance
**Request:**
```json
{
  "assetId": "uuid",
  "issueDescription": "Screen flickering intermittently",
  "maintenanceType": "repair",
  "priority": "medium",
  "estimatedCost": 350.00
}
```

### 7.5 Reimbursement Management

#### GET /api/reimbursements
**Response:**
```json
{
  "success": true,
  "data": {
    "reimbursements": [
      {
        "id": "uuid",
        "name": "Medical Checkup",
        "amount": 285.00,
        "userId": "uuid",
        "userName": "John Doe",
        "departmentId": "uuid",
        "departmentName": "IT",
        "date": "2024-01-12",
        "status": "pending",
        "type": "medical",
        "category": "Preventive Care",
        "description": "Annual health checkup as per company policy",
        "receiptUrls": [
          "https://storage.example.com/receipts/medical-001.pdf"
        ],
        "createdAt": "2024-01-13T08:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 32,
      "totalPages": 2
    }
  }
}
```

#### POST /api/reimbursements
**Request:**
```json
{
  "name": "Business Travel to NYC",
  "amount": 1250.00,
  "date": "2024-01-18",
  "type": "travel",
  "category": "Airfare",
  "description": "Flight tickets for client meeting in New York",
  "receiptFiles": [
    "base64-encoded-file-1",
    "base64-encoded-file-2"
  ]
}
```

### 7.6 Complaints & Suggestions

#### GET /api/feedback
**Response:**
```json
{
  "success": true,
  "data": {
    "feedback": [
      {
        "id": "uuid",
        "title": "Improve cafeteria food quality",
        "description": "The current food options are limited and quality has declined",
        "type": "suggestion",
        "category": "Facilities",
        "priority": "medium",
        "status": "open",
        "submittedBy": "uuid",
        "submitterName": "Jane Smith",
        "departmentId": "uuid",
        "departmentName": "HR",
        "assignedTo": null,
        "createdAt": "2024-01-14T11:45:00Z"
      }
    ]
  }
}
```

#### POST /api/feedback
**Request:**
```json
{
  "title": "AC not working in conference room B",
  "description": "The air conditioning unit in conference room B has been malfunctioning for 3 days",
  "type": "complaint",
  "category": "Facilities",
  "priority": "high"
}
```

### 7.7 Ledger & Reporting

#### GET /api/ledger
**Request Query Params:**
```
?page=1&limit=50&dateFrom=2024-01-01&dateTo=2024-01-31&accountCode=EXP&referenceType=expense
```

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "uuid",
        "referenceId": "uuid",
        "referenceType": "expense",
        "accountCode": "EXP-001",
        "description": "Office Supplies - IT Department",
        "debitAmount": 156.75,
        "creditAmount": 0.00,
        "departmentId": "uuid",
        "departmentName": "IT",
        "postedBy": "uuid",
        "postedByName": "System",
        "postingDate": "2024-01-15",
        "createdAt": "2024-01-15T16:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1205,
      "totalPages": 25
    },
    "summary": {
      "totalDebits": 145230.50,
      "totalCredits": 145230.50,
      "balance": 0.00
    }
  }
}
```

#### GET /api/reports/expenses
**Request Query Params:**
```
?period=monthly&year=2024&month=1&department=IT&groupBy=category
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportMetadata": {
      "period": "January 2024",
      "department": "IT",
      "generatedAt": "2024-02-01T10:00:00Z",
      "generatedBy": "uuid"
    },
    "summary": {
      "totalExpenses": 15675.50,
      "approvedExpenses": 12450.25,
      "pendingExpenses": 2875.75,
      "rejectedExpenses": 349.50,
      "budgetUtilization": 72.5
    },
    "categoryBreakdown": [
      {
        "category": "Office Supplies",
        "amount": 3245.50,
        "count": 45,
        "percentage": 20.7
      },
      {
        "category": "Software Licenses",
        "amount": 5670.00,
        "count": 12,
        "percentage": 36.2
      }
    ],
    "monthlyTrend": [
      {
        "month": "2024-01",
        "amount": 15675.50
      }
    ]
  }
}
```

#### GET /api/reports/financial-summary
**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalExpenses": 245670.50,
      "totalReimbursements": 67890.25,
      "totalAssetValue": 1256780.00,
      "budgetUtilization": 68.5,
      "reportPeriod": "Q1 2024"
    },
    "departmentBreakdown": [
      {
        "departmentId": "uuid",
        "departmentName": "IT",
        "expenses": 45670.50,
        "reimbursements": 12340.25,
        "assetValue": 356780.00,
        "budgetUtilization": 72.3
      }
    ],
    "trends": {
      "expenseGrowth": 5.2,
      "reimbursementGrowth": -2.1,
      "assetGrowth": 12.8
    }
  }
}
```

### 7.8 Error Response Format
**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be greater than 0"
      },
      {
        "field": "date",
        "message": "Date cannot be in the future"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `422`: Unprocessable Entity
- `500`: Internal Server Error
   - HR sees all employee data
   - Admins see all data

3. **Approval Authority**:
   - Cannot approve own requests
   - Must have higher role than requester
   - Department managers limited to department budget

### 6.5 Notification Rules
1. **Email Notifications**:
   - Expense approvals/rejections
   - Asset assignment confirmations
   - Maintenance due alerts
   - Budget threshold warnings

2. **System Notifications**:
   - Real-time approval status updates
   - Document upload confirmations
   - Deadline reminders

## 7. Implementation Recommendations

### 7.1 Technology Stack
- **Backend Framework**: Node.js with Express or NestJS
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth with JWT
- **File Storage**: Supabase Storage
- **Email Service**: SendGrid or Supabase Edge Functions
- **Queue System**: Bull.js with Redis (for notifications)

### 7.2 Database Optimization
- **Indexing Strategy**:
  - User email (unique index)
  - Expense date and department (composite index)
  - Asset serial number (unique index)
  - Ledger posting date (index)

- **Audit Trail**:
  - All tables include created_at, updated_at
  - Soft delete for important records
  - Change log table for sensitive operations

### 7.3 Security Considerations
- **Data Encryption**: Encrypt sensitive fields at rest
- **Backup Strategy**: Daily automated backups
- **Access Logging**: Log all admin operations
- **Compliance**: GDPR-ready data handling

This architecture provides a scalable foundation for the corporate management system with clear separation of concerns, robust security, and efficient data management.