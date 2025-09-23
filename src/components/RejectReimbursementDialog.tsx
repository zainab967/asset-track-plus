import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";

interface RejectReimbursementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  reimbursementName: string;
}

export function RejectReimbursementDialog({
  isOpen,
  onClose,
  onConfirm,
  reimbursementName,
}: RejectReimbursementDialogProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  const reasonOptions = [
    "Not stamped", 
    "Overwriting", 
    "Original invoice not received",
    "Other"
  ];

  const handleSubmit = () => {
    let finalReason = selectedReason;
    
    if (selectedReason === "Other" && additionalComments.trim()) {
      finalReason = `Other - ${additionalComments}`;
    } else if (additionalComments.trim()) {
      finalReason = `${selectedReason} - ${additionalComments}`;
    }
    
    if (!finalReason || (selectedReason === "Other" && !additionalComments.trim())) {
      return;
    }
    
    onConfirm(finalReason);
    setSelectedReason("");
    setAdditionalComments("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Reimbursement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          <div className="space-y-3">
            <div>
              <Label className="text-base font-medium">Reason for Rejection</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Select the primary reason for rejecting this reimbursement request
              </p>
              <RadioGroup 
                value={selectedReason} 
                onValueChange={setSelectedReason} 
                className="space-y-1"
              >
                {reasonOptions.map((option) => (
                  <div 
                    key={option} 
                    className={`flex items-center space-x-2 py-1 px-2 rounded-md ${
                      selectedReason === option ? "bg-muted/50" : ""
                    }`}
                  >
                    <RadioGroupItem value={option} id={option.replace(/\s+/g, '-').toLowerCase()} />
                    <Label 
                      htmlFor={option.replace(/\s+/g, '-').toLowerCase()} 
                      className="font-normal cursor-pointer w-full"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="additional-comments">
                {selectedReason === "Other" ? "Specify Reason" : "Additional Comments"} 
                {selectedReason === "Other" && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Textarea
                id="additional-comments"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder={selectedReason === "Other" 
                  ? "Please specify the reason for rejection..." 
                  : "Add any additional details or context..."}
                className="min-h-[80px]"
                required={selectedReason === "Other"}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!selectedReason || (selectedReason === "Other" && !additionalComments.trim())}
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}