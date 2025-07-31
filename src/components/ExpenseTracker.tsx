import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Clock, CheckCircle, XCircle } from "lucide-react";

interface Expense {
  id: string;
  description: string;
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
}

export function ExpenseTracker({ selectedDepartment }: ExpenseTrackerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>(selectedDepartment || "all");

  const expenses: Expense[] = [
    {
      id: "1",
      description: "Office supplies and equipment",
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
      description: "Monthly software licenses",
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
      description: "Team building event",
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
      description: "Marketing campaign budget",
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
      description: "Travel expenses - client meeting",
      amount: 650,
      user: "Tom Brown",
      department: "Sales",
      date: "2024-01-11",
      status: "rejected",
      type: "one-time",
      category: "Travel"
    }
  ];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      {/* Header with actions */}
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
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Submit Expense
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by description or user..."
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
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{expense.description}</TableCell>
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
                    {expense.status === "pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 px-2">
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}