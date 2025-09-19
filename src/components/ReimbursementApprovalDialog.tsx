import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface ReimbursementApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reimbursementId: string;
  amount: number;
  description: string;
  onApprove: (reimbursementId: string, chargedTo: string) => Promise<void>;
}

export function ReimbursementApprovalDialog({ 
  open, 
  onOpenChange, 
  reimbursementId,
  amount,
  description,
  onApprove 
}: ReimbursementApprovalDialogProps) {
  const [chargedTo, setChargedTo] = useState("");
  const { toast } = useToast();

  const handleApprove = async () => {
    if (!chargedTo) {
      toast({
        title: "Error",
        description: "Please select who the reimbursement is charged to",
        variant: "destructive",
      });
      return;
    }

    try {
      await onApprove(reimbursementId, chargedTo);
      onOpenChange(false);
      toast({
        title: "Reimbursement Approved",
        description: "The reimbursement has been approved and will be added to expenses.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve reimbursement. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Approve Reimbursement</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Amount</Label>
              <p className="text-lg font-semibold">₨ {amount.toLocaleString()}</p>
            </div>
            
            <div className="space-y-1">
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chargedTo">Charge To</Label>
              <Select value={chargedTo} onValueChange={setChargedTo} required>
                <SelectTrigger className="w-full focus:ring-offset-0">
                  <SelectValue placeholder="Select who to charge" />
                </SelectTrigger>
                <SelectContent className="overflow-visible">
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
                Approve & Add to Expenses
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}