import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";
import { AddExpenseSheet } from "./AddExpenseSheet";
import { useToast } from "@/hooks/use-toast";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { useExpenses, Expense } from "@/contexts/ExpenseContext";
import { API_ENDPOINTS } from "@/config/api";

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
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Expense Tracker</h2>
            {pendingClaims > 0 && (
              <p className="text-yellow-600 font-medium">
                {pendingClaims} pending claims require attention
              </p>
            )}
          </div>
        </div>

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
                        ${expense.amount.toLocaleString()}
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
                                onClick={() => {
                                  // Handle approve
                                }}
                                title="Approve"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  // Handle reject
                                }}
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
    </div>
  );
}
