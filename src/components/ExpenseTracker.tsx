import { useState } from "react";
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

interface ExpenseTrackerProps {
  selectedDepartment?: string;
  userRole?: "employee" | "hr" | "admin" | "manager";
}

export function ExpenseTracker({ selectedDepartment, userRole = "admin" }: ExpenseTrackerProps) {
  const { expenses, addExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [buildingFilter, setBuildingFilter] = useState<string>(selectedDepartment || "all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({});
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [currentExpenseForDescription, setCurrentExpenseForDescription] = useState<any>(null);
  const { toast } = useToast();

  const recurringExpenses = [
    { name: "Monthly software licenses", category: "Software", amount: 2400, department: "Etihad Office" },
    { name: "Office supplies", category: "Supplies", amount: 150, department: "Abdalian Offie" },
    { name: "Team lunch", category: "Food", amount: 200, department: "Etihad Office" }
  ];

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewExpense({
      id: Date.now().toString(),
      name: "",
      amount: 0,
      user: "Current User", // In a real app, this would come from auth
      building: "",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      type: "one-time",
      category: ""
    });
  };

  const handleSaveNew = () => {
    if (!newExpense.name || !newExpense.category || !newExpense.building || !newExpense.amount) {
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

  const handleDescriptionSave = (data: { description: string; media: File[] }) => {
    const expense: Expense = {
      id: newExpense.id!,
      name: newExpense.name!,
      amount: Number(newExpense.amount),
      user: newExpense.user!,
      building: newExpense.building!,
      date: newExpense.date!,
      status: newExpense.status as "pending" | "approved" | "rejected",
      type: newExpense.type as "one-time" | "recurring",
      category: newExpense.category!
    };

    // You can use data.media here if needed

    addExpense(expense);
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
  }
 const handlePrevMonth = () => {
  setCurrentMonth(prev => {
    const newMonth = new Date(prev);
    newMonth.setMonth(newMonth.getMonth() - 1);
    return newMonth;
  });
  setSelectedDate(null);
};

const handleNextMonth = () => {
  setCurrentMonth(prev => {
    const newMonth = new Date(prev);
    newMonth.setMonth(newMonth.getMonth() + 1);
    return newMonth;
  });
  setSelectedDate(null);
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
    const expenseDate = new Date(expense.date);
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    const matchesDepartment = buildingFilter === "all" || expense.building === buildingFilter;
    const matchesMonth =
      expenseDate.getFullYear() === currentMonth.getFullYear() &&
      expenseDate.getMonth() === currentMonth.getMonth();
    const matchesDate = !selectedDate ||
      (expenseDate.getFullYear() === selectedDate.getFullYear() &&
        expenseDate.getMonth() === selectedDate.getMonth() &&
        expenseDate.getDate() === selectedDate.getDate());
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesMonth && matchesDate;
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Expense Tracker</h2>
          <p className="text-base text-muted-foreground">
            {pendingClaims > 0 && (
              <span className="text-yellow-600 font-medium">
                {pendingClaims} pending claims require attention
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 hover:shadow-md transition-shadow"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date picker with popover */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="h-8 w-8 hover:shadow-md transition-shadow"
                aria-label="Previous month"
              >
                <span>&lt;</span>
              </Button>
              
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:shadow-md transition-shadow"
                    aria-label="Open calendar"
                  >
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <ReactDatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                      setCurrentMonth(date ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date());
                    }}
                    inline
                    calendarClassName="shadow-none border-none"
                  />
                </PopoverContent>
              </Popover>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="h-8 w-8 hover:shadow-md transition-shadow"
                aria-label="Next month"
                disabled={
                  currentMonth.getMonth() === new Date().getMonth() &&
                  currentMonth.getFullYear() === new Date().getFullYear()
                }
              >
                <span>&gt;</span>
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              {selectedDate && (
                <> — {selectedDate.toLocaleDateString()}</>
              )}
            </span>
          </div>
        </CardContent>
      </Card>
     
{/* Expenses Table */}
<Card className="hover:shadow-md transition-shadow">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Recent Expenses</CardTitle>
      <Button 
        onClick={handleAddNew} 
        size="sm" 
        className="flex items-center gap-2 hover:shadow-md transition-shadow"
        disabled={isAddingNew}
      >
        <Plus className="h-4 w-4" />
        Add Expense
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Name</TableHead>
            <TableHead className="min-w-[100px]">User</TableHead>
            <TableHead className="min-w-[120px]">Building</TableHead>
            <TableHead className="min-w-[100px]">Amount</TableHead>
            <TableHead className="min-w-[100px]">Type</TableHead>
            <TableHead className="min-w-[100px]">Date</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Details</TableHead>
            {(userRole === "hr" || userRole === "admin" || userRole === "manager") && <TableHead className="min-w-[100px]">Action</TableHead>}
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
              <Select value={newExpense.building || ""} onValueChange={(value) => setNewExpense(prev => ({ ...prev, building: value }))}>
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
            <TableCell>{expense.building}</TableCell>
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
    </div>
  </CardContent>
</Card></div>
  );
}