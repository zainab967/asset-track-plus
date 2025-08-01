import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, User, Building, DollarSign } from "lucide-react";

interface ExpenseDetailsDialogProps {
  expense: {
    id: string;
    description: string;
    amount: number;
    user: string;
    department: string;
    date: string;
    status: string;
    type: string;
    category: string;
    details?: string;
  };
}

export function ExpenseDetailsDialog({ expense }: ExpenseDetailsDialogProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      Approved: "bg-green-100 text-green-800 hover:bg-green-100",
      Rejected: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Expense Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{expense.description}</h3>
            <Badge className={getStatusBadge(expense.status)}>
              {expense.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">${expense.amount.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{expense.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Employee</p>
                <p className="font-medium">{expense.user}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{expense.department}</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Type</p>
            <p className="font-medium">{expense.type}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Category</p>
            <p className="font-medium">{expense.category}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Description</p>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                {expense.details || "Business travel expenses for client meeting in New York. Includes flight, hotel accommodation for 2 nights, and meals during the trip. All receipts are attached for verification."}
              </p>
            </div>
          </div>
          
          {expense.status === "Pending" && (
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                Reject
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}