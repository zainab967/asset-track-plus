import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssetMaintenanceDialogProps {
  userRole?: string;
}

export function AssetMaintenanceDialog({ userRole }: AssetMaintenanceDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Maintenance Request Submitted",
      description: "Your asset maintenance request has been submitted successfully.",
    });
    setOpen(false);
  };

  const canSubmitRequest = userRole === "employee" || userRole === "hr" || userRole === "admin" || userRole === "manager";

  if (!canSubmitRequest) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wrench className="h-4 w-4" />
          Asset Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Asset Maintenance Request</DialogTitle>
          <DialogDescription>
            Submit a maintenance request for an asset.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Your department" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetName">Asset Name</Label>
            <Input id="assetName" placeholder="Name of the asset" required />
          </div>

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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}