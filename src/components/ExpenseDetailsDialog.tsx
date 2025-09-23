import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Building } from "lucide-react";
import { PKRIcon } from "@/components/ui/pkr-icon";
import { formatCurrency } from "@/lib/currency";
import { Expense } from "@/contexts/ExpenseContext";

interface ExpenseDetailsDialogProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpenseDetailsDialog({ expense, isOpen, onClose }: ExpenseDetailsDialogProps) {


  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Expense Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{expense.name}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <PKRIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">{formatCurrency(expense.amount)}</p>
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
                <p className="text-sm text-muted-foreground">Building</p>
                <p className="font-medium">{expense.building}</p>
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
                {expense.description || "Business travel expenses for client meeting in New York. Includes flight, hotel accommodation for 2 nights, and meals during the trip. All receipts are attached for verification."}
              </p>
            </div>
          </div>
          

        </div>
      </DialogContent>
    </Dialog>
  );
}