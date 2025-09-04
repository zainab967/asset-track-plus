import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssetActionDialogProps {
  userRole?: string;
  isOpen?: boolean;
  onClose?: () => void;
  mode?: "admin" | "user";
}

export function AssetActionDialog({ userRole, isOpen, onClose, mode = "user" }: AssetActionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [actionType, setActionType] = useState(mode === "admin" ? "log" : "maintenance");
  const [assetStatus, setAssetStatus] = useState("assigned");
  const [requestType, setRequestType] = useState("permanent");
  const { toast } = useToast();

  const dialogOpen = isOpen !== undefined ? isOpen : internalOpen;
  const setDialogOpen = onClose ? (open: boolean) => !open && onClose() : setInternalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: `Your ${actionType} request has been submitted successfully.`,
    });
    setDialogOpen(false);
  };

  const canSubmitRequest = userRole === "employee" || userRole === "hr" || userRole === "admin" || userRole === "manager";

  if (!canSubmitRequest) {
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isOpen && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {mode === "admin" ? "Log New Asset" : "Asset Actions"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asset Management</DialogTitle>
          <DialogDescription>
            {mode === "admin" 
              ? "Log new assets in the system"
              : "Submit asset maintenance requests or request new assets"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Action Type Selection */}
          {mode === "user" && (
            <div className="space-y-3">
              <Label>Action Type</Label>
              <RadioGroup value={actionType} onValueChange={setActionType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintenance" id="maintenance" />
                  <Label htmlFor="maintenance">Asset Maintenance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request" id="request" />
                  <Label htmlFor="request">Asset Request</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" required />
            </div>
            
            {actionType !== "log" && (
              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Office" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Etihad Office</SelectItem>
                    <SelectItem value="marketing">Abdalian Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {actionType === "request" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="request-type">Request Type</Label>
                  <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {requestType === "temporary" && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input type="number" id="duration" min="1" max="30" required />
                  </div>
                )}
              </>
            )}

            {actionType === "maintenance" && (
              <div className="space-y-2">
                <Label htmlFor="maintenance-type">Maintenance Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="upgrade">Upgrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {mode === "admin" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="printer">Printer</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={assetStatus} onValueChange={setAssetStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Value ($)</Label>
                  <Input type="number" id="value" min="0" step="0.01" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchase-date">Purchase Date</Label>
                  <Input type="date" id="purchase-date" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              placeholder={actionType === "maintenance" ? "Describe the maintenance needed..." : "Describe your request..."}
              required
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <DialogFooter>
            <Button type="submit" className="w-full">
              {mode === "admin" ? "Add Asset" : `Submit ${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Request`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
