import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, Plus, Clock, CheckCircle, XCircle, Save, X } from "lucide-react";
import { SubmitExpenseDialog } from "./SubmitExpenseDialog";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";
import { ExpenseDescriptionDialog } from "./ExpenseDescriptionDialog";
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
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({});
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [currentExpenseForDescription, setCurrentExpenseForDescription] = useState<any>(null);
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
    setNewExpense({
      id: Date.now().toString(),
      name: "",
      amount: 0,
      user: "Current User",
      building: "",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      category: "",
      type: "one-time",
      chargedTo: ""
    });
  };

  const handleSaveNew = async () => {
    if (!newExpense.name || !newExpense.category || !newExpense.building || !newExpense.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

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
      setNewExpense({});

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
    setNewExpense({});
  };

  const recurringExpenses = [
    { name: "Monthly software licenses", category: "Software", amount: 2400, building: "Etihad Office" },
    { name: "Office supplies", category: "Supplies", amount: 150, building: "Abdalian Office" },
    { name: "Team lunch", category: "Food", amount: 200, building: "Etihad Office" }
  ];

  const handleSelectRecurring = (value: string) => {
    const idx = parseInt(value);
    const recurring = recurringExpenses[idx];
    if (recurring) {
      setNewExpense(prev => ({
        ...prev,
        name: recurring.name,
        category: recurring.category,
        amount: recurring.amount,
        building: recurring.building
      }));
    }
  };

  const filteredExpenses = expenses.filter(expense => {
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


                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[180px] pl-3 text-left font-normal">
                      {selectedDate ? (
                        selectedDate.toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
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
              </div>
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
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead className="w-[150px]">User</TableHead>
                    <TableHead className="w-[150px]">Building</TableHead>
                    <TableHead className="w-[120px]">Amount</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[150px]">Charged To</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
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
                      <TableCell className="text-muted-foreground text-sm">
                        {newExpense.user}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={newExpense.building || ""} 
                          onValueChange={(value) => setNewExpense(prev => ({ ...prev, building: value }))}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Building" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                            <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={newExpense.amount || ""}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
                          placeholder="0"
                          className="h-8 w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={newExpense.category || ""} 
                          onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Hardware">Hardware</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={newExpense.chargedTo || ""} 
                          onValueChange={(value) => setNewExpense(prev => ({ ...prev, chargedTo: value }))}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Charged To" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="One Hub Etihad">One Hub Etihad</SelectItem>
                            <SelectItem value="Team Web">Team Web</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {newExpense.date}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
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
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.name}</TableCell>
                      <TableCell>{expense.user}</TableCell>
                      <TableCell>{expense.building}</TableCell>
                      <TableCell className="font-mono">
                        ${expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.chargedTo || '-'}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{getStatusBadge(expense.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
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
    </div>
  );
}
