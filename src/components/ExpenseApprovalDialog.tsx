import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface ExpenseApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseId: string;
  onApprove: (expenseId: string, chargedTo: string) => void;
}

export function ExpenseApprovalDialog({ open, onOpenChange, expenseId, onApprove }: ExpenseApprovalDialogProps) {
  const [chargedTo, setChargedTo] = useState("");
  const { toast } = useToast();

  const handleApprove = () => {
    if (!chargedTo) {
      toast({
        title: "Error",
        description: "Please select who the expense is charged to",
        variant: "destructive",
      });
      return;
    }

    onApprove(expenseId, chargedTo);
    onOpenChange(false);
    toast({
      title: "Expense Approved",
      description: "The expense has been approved successfully.",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Approve Expense</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chargedTo">Charge Expense To</Label>
              <Select value={chargedTo} onValueChange={setChargedTo} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select who to charge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-hub-etihad">One Hub Etihad</SelectItem>
                  <SelectItem value="team-one">Team One</SelectItem>
                  <SelectItem value="hasan-nasir">Hasan Nasir</SelectItem>
                  <SelectItem value="irfan-bashir">Irfan Bashir</SelectItem>
                  <SelectItem value="zeeshan">Zeeshan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Expense
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}