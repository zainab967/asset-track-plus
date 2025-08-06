import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Clock, CheckCircle, XCircle, Save, X } from "lucide-react";
import { SubmitExpenseDialog } from "./SubmitExpenseDialog";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";
import { ExpenseDescriptionDialog } from "./ExpenseDescriptionDialog";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  name: string;
  amount: number;
  user: string;
  department: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  type: "one-time" | "recurring";
  category: string;
}

interface ExpenseTrackerProps {
  selectedDepartment?: string;
  userRole?: "employee" | "hr" | "admin" | "manager";
}

export function ExpenseTracker({ selectedDepartment, userRole = "admin" }: ExpenseTrackerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>(selectedDepartment || "all");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({});
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [currentExpenseForDescription, setCurrentExpenseForDescription] = useState<any>(null);
  const { toast } = useToast();

  const mockExpenses: Expense[] = [
    {
      id: "1",
      name: "Office supplies and equipment",
      amount: 1250,
      user: "John Doe",
      department: "Engineering",
      date: "2024-01-15",
      status: "approved",
      type: "one-time",
      category: "Supplies"
    },
    {
      id: "2", 
      name: "Monthly software licenses",
      amount: 2400,
      user: "Jane Smith",
      department: "Engineering",
      date: "2024-01-14",
      status: "pending",
      type: "recurring",
      category: "Software"
    },
    {
      id: "3",
      name: "Team building event",
      amount: 800,
      user: "Mike Johnson",
      department: "HR",
      date: "2024-01-13",
      status: "approved",
      type: "one-time",
      category: "Events"
    },
    {
      id: "4",
      name: "Marketing campaign budget",
      amount: 5000,
      user: "Sarah Williams",
      department: "Marketing",
      date: "2024-01-12",
      status: "pending",
      type: "one-time",
      category: "Campaigns"
    },
    {
      id: "5",
      name: "Travel expenses - client meeting",
      amount: 650,
      user: "Tom Brown",
      department: "Sales",
      date: "2024-01-11",
      status: "rejected",
      type: "one-time",
      category: "Travel"
    },
    {
      id: "6", 
      name: "chips",
      amount: 50,
      user: "Zainab",
      department: "Operations",
      date: "2024-01-14",
      status: "pending",
      type: "recurring",
      category: "Food"
    }
  ];

  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const recurringExpenses = [
    { name: "Monthly software licenses", category: "Software", amount: 2400, department: "Engineering" },
    { name: "Office supplies", category: "Supplies", amount: 150, department: "Operations" },
    { name: "Team lunch", category: "Food", amount: 200, department: "HR" }
  ];

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewExpense({
      id: Date.now().toString(),
      name: "",
      amount: 0,
      user: "Current User", // In a real app, this would come from auth
      department: "",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      type: "one-time",
      category: ""
    });
  };

  const handleSaveNew = () => {
    if (!newExpense.name || !newExpense.category || !newExpense.department || !newExpense.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Open description dialog
    setCurrentExpenseForDescription(newExpense);
    setShowDescriptionDialog(true);
  };

  const handleDescriptionSave = (data: { description: string; documents: File[]; images: File[] }) => {
    const expense: Expense = {
      id: newExpense.id!,
      name: newExpense.name!,
      amount: Number(newExpense.amount),
      user: newExpense.user!,
      department: newExpense.department!,
      date: newExpense.date!,
      status: newExpense.status as "pending" | "approved" | "rejected",
      type: newExpense.type as "one-time" | "recurring",
      category: newExpense.category!
    };

    setExpenses(prev => [expense, ...prev]);
    setIsAddingNew(false);
    setNewExpense({});
    setCurrentExpenseForDescription(null);
    
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewExpense({});
  };

  const handleSelectRecurring = (value: string) => {
    const idx = parseInt(value);
    const recurring = recurringExpenses[idx];
    if (recurring) {
      setNewExpense(prev => ({
        ...prev,
        name: recurring.name,
        category: recurring.category,
        amount: recurring.amount,
        department: recurring.department
      }));
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || expense.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const pendingClaims = expenses.filter(e => e.status === "pending").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      rejected: "destructive", 
      pending: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Expense Tracker</h2>
          <p className="text-muted-foreground">
            {pendingClaims > 0 && (
              <span className="text-yellow-600 font-medium">
                {pendingClaims} pending claims require attention
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Button 
              onClick={handleAddNew} 
              size="sm" 
              className="flex items-center gap-2"
              disabled={isAddingNew}
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                {(userRole === "hr" || userRole === "admin" || userRole === "manager") && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAddingNew && (
                <TableRow className="bg-muted/30">
                  <TableCell>
                    <Input
                      value={newExpense.name || ""}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Expense name"
                      className="h-8"
                    />
                    <Select onValueChange={handleSelectRecurring}>
                      <SelectTrigger className="h-6 text-xs mt-1">
                        <SelectValue placeholder="Or select recurring" />
                      </SelectTrigger>
                      <SelectContent>
                        {recurringExpenses.map((recurring, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {recurring.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{newExpense.user}</TableCell>
                  <TableCell>
                    <Select value={newExpense.department || ""} onValueChange={(value) => setNewExpense(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={newExpense.amount || ""}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      placeholder="0"
                      className="h-8 font-mono"
                    />
                  </TableCell>
                  <TableCell>
                    <Select value={newExpense.type || "one-time"} onValueChange={(value: "one-time" | "recurring") => setNewExpense(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{newExpense.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Pending</Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={newExpense.category || ""} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Supplies">Supplies</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Campaigns">Campaigns</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleSaveNew} className="h-7 w-7 p-0">
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelNew} className="h-7 w-7 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{expense.name}</TableCell>
                  <TableCell>{expense.user}</TableCell>
                  <TableCell>{expense.department}</TableCell>
                  <TableCell className="font-mono">${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={expense.type === "recurring" ? "default" : "outline"}>
                      {expense.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(expense.status)}
                      {getStatusBadge(expense.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ExpenseDetailsDialog expense={expense} />
                  </TableCell>
                  {(userRole === "hr" || userRole === "admin" || userRole === "manager") && (
                    <TableCell>
                      <div className="flex gap-2">
                        {expense.status === "pending" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 px-2">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 h-7 px-2">
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExpenseDescriptionDialog
        isOpen={showDescriptionDialog}
        onClose={() => {
          setShowDescriptionDialog(false);
          setCurrentExpenseForDescription(null);
        }}
        onSave={handleDescriptionSave}
        expense={currentExpenseForDescription}
      />
    </div>
  );
}