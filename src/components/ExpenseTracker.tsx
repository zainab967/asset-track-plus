import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Clock, Eye, Download, Trash2, FileText, Table as TableIcon, FileType } from "lucide-react";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";
import { AddExpenseSheet } from "./AddExpenseSheet";
import { useToast } from "@/hooks/use-toast";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { useExpenses, Expense } from "@/contexts/ExpenseContext";
import { API_ENDPOINTS } from "@/config/api";
import { formatCurrency } from "@/lib/currency";

interface ExpenseTrackerProps {
  selectedDepartment?: string;
  userRole?: "employee" | "hr" | "admin" | "IT";
}

export function ExpenseTracker({ selectedDepartment, userRole = "admin" }: ExpenseTrackerProps) {
  const { expenses, addExpense, setExpenses } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch(`${API_ENDPOINTS.EXPENSES}/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      // Remove from local state
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));

      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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
    const headers = ['Name', 'User', 'Building', 'Amount', 'Category', 'Charged To', 'Date', 'Type'];
    
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
  
  const handleExportExcel = () => {
    if (filteredExpenses.length === 0) {
      toast({
        title: "No Data",
        description: "No expenses to export",
        variant: "destructive"
      });
      return;
    }

    // Create XML content for Excel
    const headers = ['Name', 'User', 'Building', 'Amount', 'Category', 'Charged To', 'Date', 'Type'];
    
    let excelContent = '<table><tr>';
    headers.forEach(header => {
      excelContent += `<th>${header}</th>`;
    });
    excelContent += '</tr>';
    
    filteredExpenses.forEach(expense => {
      excelContent += '<tr>';
      excelContent += `<td>${expense.name}</td>`;
      excelContent += `<td>${expense.user}</td>`;
      excelContent += `<td>${expense.building}</td>`;
      excelContent += `<td>${expense.amount}</td>`;
      excelContent += `<td>${expense.category}</td>`;
      excelContent += `<td>${expense.chargedTo || ''}</td>`;
      excelContent += `<td>${expense.date}</td>`;
      excelContent += `<td>${expense.type || ''}</td>`;
      excelContent += '</tr>';
    });
    
    excelContent += '</table>';
    
    // Create a data URI for the Excel file
    const excelBlob = new Blob(['\ufeff', excelContent], { type: 'application/vnd.ms-excel' });
    const excelUrl = URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = excelUrl;
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(excelUrl);
    
    toast({
      title: "Success",
      description: `Exported ${filteredExpenses.length} expenses to Excel`,
    });
  };
  
  const handleExportPDF = async () => {
    if (filteredExpenses.length === 0) {
      toast({
        title: "No Data",
        description: "No expenses to export",
        variant: "destructive"
      });
      return;
    }

    // Using a simple HTML to PDF approach
    const headers = ['Name', 'User', 'Building', 'Amount', 'Category', 'Charged To', 'Date', 'Type'];
    
    // Create a printable HTML document
    let printContent = `
      <html>
      <head>
        <title>Expenses Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; font-weight: bold; }
          h1 { text-align: center; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Expenses Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <tr>
    `;
    
    headers.forEach(header => {
      printContent += `<th>${header}</th>`;
    });
    
    printContent += '</tr>';
    
    filteredExpenses.forEach(expense => {
      printContent += '<tr>';
      printContent += `<td>${expense.name}</td>`;
      printContent += `<td>${expense.user}</td>`;
      printContent += `<td>${expense.building}</td>`;
      printContent += `<td>${expense.amount}</td>`;
      printContent += `<td>${expense.category}</td>`;
      printContent += `<td>${expense.chargedTo || ''}</td>`;
      printContent += `<td>${expense.date}</td>`;
      printContent += `<td>${expense.type || ''}</td>`;
      printContent += '</tr>';
    });
    
    printContent += `
        </table>
        <div class="footer">
          Asset Track Plus - Expense Report
        </div>
      </body>
      </html>
    `;
    
    // Open a new window and print to PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Let the page render before triggering print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      
      toast({
        title: "Success",
        description: `Prepared ${filteredExpenses.length} expenses for PDF export`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to open PDF preview. Please check your popup blocker settings.",
        variant: "destructive"
      });
    }
  };

  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  // Delete function replaces approve/reject functionality

  const filteredExpenses = (expenses || []).filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || expense.date === selectedDate.toISOString().split('T')[0];
    const matchesBuilding = !selectedDepartment || expense.building === selectedDepartment;
    return matchesSearch && matchesDate && matchesBuilding;
  });

  return (
    <div className="flex-1">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
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

                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={filteredExpenses.length === 0}
                          title="Export data"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                        <DropdownMenuItem onClick={handleExportCSV}>
                          <FileText className="h-4 w-4 mr-2" />
                          <span>CSV</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportExcel}>
                          <TableIcon className="h-4 w-4 mr-2" />
                          <span>Excel</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPDF}>
                          <FileType className="h-4 w-4 mr-2" />
                          <span>PDF</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
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
