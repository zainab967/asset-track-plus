import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface RejectExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  expenseName: string;
  isLoading?: boolean;
}

export function RejectExpenseDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  expenseName,
  isLoading = false 
}: RejectExpenseDialogProps) {
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }
    
    onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Expense</DialogTitle>
          <DialogDescription>
            You are about to reject the expense: <strong>{expenseName}</strong>
            <br />
            Please provide a reason for rejection. The employee will be notified.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Rejection</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why this expense is being rejected..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Rejecting..." : "Reject Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}