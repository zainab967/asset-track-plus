import { z } from "zod";

// User management schemas
export const addUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Admin", "Manager", "HR", "Employee"]),
  department: z.string().min(1, "Department is required"),
});

export const manageAccessSchema = z.object({
  userId: z.string(),
  permissions: z.array(z.string()),
  active: z.boolean(),
});

// Asset management schemas
export const assetRequestSchema = z.object({
  assetName: z.string().min(1, "Asset name is required"),
  requestedDate: z.date(),
  reason: z.string().min(10, "Please provide a detailed reason"),
  durationType: z.enum(["permanent", "temporary"]),
  returnDate: z.date().optional(),
  specifications: z.string().optional(),
  department: z.string().min(1, "Department is required"),
});

export const addAssetSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  category: z.string().min(1, "Category is required"),
  serialNumber: z.string().optional(),
  purchaseDate: z.date(),
  value: z.number().min(0, "Value must be positive"),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  location: z.string().min(1, "Location is required"),
  assignedTo: z.string().optional(),
});

// Expense tracking schemas
export const expenseSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
  receipt: z.string().optional(),
  department: z.string().min(1, "Department is required"),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;
export type ManageAccessFormData = z.infer<typeof manageAccessSchema>;
export type AssetRequestFormData = z.infer<typeof assetRequestSchema>;
export type AddAssetFormData = z.infer<typeof addAssetSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;