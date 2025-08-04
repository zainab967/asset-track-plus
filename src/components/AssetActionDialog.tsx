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
}

export function AssetActionDialog({ userRole }: AssetActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("maintenance");
  const [assetStatus, setAssetStatus] = useState("assigned");
  const [requestType, setRequestType] = useState("permanent");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: `Your ${actionType} request has been submitted successfully.`,
    });
    setOpen(false);
  };

  const canSubmitRequest = userRole === "Employee" || userRole === "HR" || userRole === "Admin" || userRole === "Manager";

  if (!canSubmitRequest) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Asset Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asset Management</DialogTitle>
          <DialogDescription>
            Submit asset maintenance, requests, or log new assets.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Action Type Selection */}
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
              {(userRole === "HR" || userRole === "Admin") && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="log" id="log" />
                  <Label htmlFor="log">Log Asset</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" required />
            </div>
            
            {actionType !== "log" && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetName">Asset Name</Label>
            <Input id="assetName" placeholder="Name of the asset" required />
          </div>

          {/* Action-specific fields */}
          {actionType === "maintenance" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the maintenance needed..."
                  className="min-h-[80px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document">Attach Picture or Document</Label>
                <div className="flex items-center gap-2">
                  <Input id="document" type="file" accept="image/*,.pdf,.doc,.docx" />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="neededBack">When is it needed back?</Label>
                <Input id="neededBack" type="date" required />
              </div>
            </>
          )}

          {actionType === "request" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea 
                  id="reason" 
                  placeholder="Why do you need this asset?"
                  className="min-h-[80px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeNeeded">Time Asset is Needed</Label>
                <Input id="timeNeeded" type="datetime-local" required />
              </div>
              
              <div className="space-y-3">
                <Label>Request Type</Label>
                <RadioGroup value={requestType} onValueChange={setRequestType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="permanent" id="permanent" />
                    <Label htmlFor="permanent">Permanent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="temporary" id="temporary" />
                    <Label htmlFor="temporary">Temporary</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {requestType === "temporary" && (
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input id="returnDate" type="date" required />
                </div>
              )}
            </>
          )}

          {actionType === "log" && (
            <>
              <div className="space-y-3">
                <Label>Asset Status</Label>
                <RadioGroup value={assetStatus} onValueChange={setAssetStatus}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="assigned" id="assigned" />
                    <Label htmlFor="assigned">Assigned</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unassigned" id="unassigned" />
                    <Label htmlFor="unassigned">Unassigned</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {assetStatus === "assigned" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedName">Assigned To (Name)</Label>
                    <Input id="assignedName" placeholder="Employee name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedDept">Department</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" placeholder="0.00" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" required />
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit {actionType === "maintenance" ? "Maintenance" : actionType === "request" ? "Request" : "Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}