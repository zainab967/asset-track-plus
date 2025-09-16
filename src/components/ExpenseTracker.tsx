import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Clock, CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";
import { AddExpenseSheet } from "./AddExpenseSheet";
import { RejectExpenseDialog } from "./RejectExpenseDialog";
import { useToast } from "@/hooks/use-toast";
import { updateExpenseStatus } from "@/services/expenses";
import { createNotification } from "@/services/notifications";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { useExpenses, Expense } from "@/contexts/ExpenseContext";
import { API_ENDPOINTS } from "@/config/api";
import { formatCurrency } from "@/lib/currency";

interface ExpenseTrackerProps {
  selectedDepartment?: string;
  userRole?: "employee" | "hr" | "admin" | "manager";
}

export function ExpenseTracker({ selectedDepartment, userRole = "admin" }: ExpenseTrackerProps) {
  const { expenses, addExpense, setExpenses } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpenses();
  }, [selectedDepartment]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.EXPENSES, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setExpenses(data);
      } else if (data.items && Array.isArray(data.items)) {
        setExpenses(data.items);
      } else if (data.data && Array.isArray(data.data)) {  // Handle .NET API response format
        setExpenses(data.data);
      } else {
        console.error('Unexpected data format:', data);
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to connect to the server. Please ensure the backend is running.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pendingClaims = expenses.filter(e => e.status === "pending").length;

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = async (newExpense: Partial<Expense>) => {
    try {
      const response = await fetch(API_ENDPOINTS.EXPENSES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error('Failed to save expense');
      }

      const savedExpense = await response.json();
      setExpenses(prev => [...prev, savedExpense]);
      setIsAddingNew(false);

      toast({
        title: "Success",
        description: "Expense saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save expense",
        variant: "destructive"
      });
    }
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
  };

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      toast({
        title: "No Data",
        description: "No expenses to export",
        variant: "destructive"
      });
      return;
    }

    // Define CSV headers
    const headers = ['Name', 'User', 'Building', 'Amount', 'Category', 'Charged To', 'Date', 'Status', 'Type'];
    
    // Convert expenses to CSV format
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        `"${expense.name}"`,
        `"${expense.user}"`,
        `"${expense.building}"`,
        expense.amount,
        `"${expense.category}"`,
        `"${expense.chargedTo || ''}"`,
        expense.date,
        expense.status,
        `"${expense.type || ''}"`
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `Exported ${filteredExpenses.length} expenses to CSV`,
    });
  };

  const handleApproveExpense = async (expense: Expense) => {
    try {
      setIsProcessing(true);
      
      // Update expense status
      const updatedExpense = await updateExpenseStatus(expense.id, 'approved');
      
      // Update local state
      setExpenses(prev => prev.map(exp => 
        exp.id === expense.id ? { ...exp, status: 'approved' } : exp
      ));

      // Create notification for the employee
      await createNotification({
        user_id: expense.user, // Using 'user' property from the context
        title: "Expense Approved",
        message: `Your expense "${expense.name}" for $${expense.amount} has been approved.`,
        type: 'success',
        related_entity_type: 'expense',
        related_entity_id: expense.id
      });

      toast({
        title: "Success",
        description: "Expense approved successfully",
      });
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Error",
        description: "Failed to approve expense",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowRejectDialog(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!selectedExpense) return;

    try {
      setIsProcessing(true);
      
      // Update expense status with rejection reason
      await updateExpenseStatus(selectedExpense.id, 'rejected', reason);
      
      // Update local state
      setExpenses(prev => prev.map(exp => 
        exp.id === selectedExpense.id 
          ? { ...exp, status: 'rejected', rejection_reason: reason } 
          : exp
      ));

      // Create notification for the employee
      await createNotification({
        user_id: selectedExpense.user, // Using 'user' property from the context
        title: "Expense Rejected",
        message: `Your expense "${selectedExpense.name}" for $${selectedExpense.amount} has been rejected. Reason: ${reason}`,
        type: 'error',
        related_entity_type: 'expense',
        related_entity_id: selectedExpense.id
      });

      toast({
        title: "Success",
        description: "Expense rejected and employee notified",
      });

      setShowRejectDialog(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: "Error",
        description: "Failed to reject expense",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredExpenses = (expenses || []).filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    const matchesDate = !selectedDate || expense.date === selectedDate.toISOString().split('T')[0];
    const matchesBuilding = !selectedDepartment || expense.building === selectedDepartment;
    return matchesSearch && matchesStatus && matchesDate && matchesBuilding;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex-1">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        {pendingClaims > 0 && (
          <p className="text-yellow-600 font-medium">
            {pendingClaims} pending claims require attention
          </p>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="border-b border-border/20 p-3">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevMonth}
                            className="h-7 w-7"
                          >
                            <span>&lt;</span>
                          </Button>
                          <span className="text-sm font-medium">
                            {currentMonth.toLocaleString("default", { 
                              month: "long",
                              year: "numeric"
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextMonth}
                            className="h-7 w-7"
                          >
                            <span>&gt;</span>
                          </Button>
                        </div>
                      </div>
                      <ReactDatePicker
                        selected={selectedDate}
                        onChange={(date: Date) => {
                          setSelectedDate(date);
                          setShowDatePicker(false);
                        }}
                        inline
                        calendarClassName="shadow-none border-none"
                      />
                    </PopoverContent>
                  </Popover>

                  <Button 
                    onClick={handleExportCSV} 
                    size="icon"
                    variant="outline"
                    title="Export CSV"
                    disabled={filteredExpenses.length === 0}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead className="w-[150px]">Building</TableHead>
                    <TableHead className="w-[120px]">Amount</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[150px]">Charged To</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>

                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.name}</TableCell>
                      <TableCell>{expense.building}</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.chargedTo || '-'}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{getStatusBadge(expense.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setSelectedExpense(expense);
                              setShowDetailsDialog(true);
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {expense.status === "pending" && (userRole === "hr" || userRole === "admin") && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApproveExpense(expense)}
                                disabled={isProcessing}
                                title="Approve"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectExpense(expense)}
                                disabled={isProcessing}
                                title="Reject"
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <ExpenseDetailsDialog 
        expense={selectedExpense}
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
      />
      <AddExpenseSheet 
        isOpen={isAddingNew}
        onClose={() => setIsAddingNew(false)}
        onSubmit={handleSaveNew}
      />
      <RejectExpenseDialog
        isOpen={showRejectDialog}
        onClose={() => {
          setShowRejectDialog(false);
          setSelectedExpense(null);
        }}
        onConfirm={handleConfirmReject}
        expenseName={selectedExpense?.name || ""}
        isLoading={isProcessing}
      />
    </div>
  );
}
