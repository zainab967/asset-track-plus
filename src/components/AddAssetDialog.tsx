import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddAssetDialog() {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [assetStatus, setAssetStatus] = useState("Unassigned");
  const [assigneeName, setAssigneeName] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [computerSubcategory, setComputerSubcategory] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Asset Request Submitted",
      description: "Your asset request has been submitted for processing.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Asset Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Request Type</Label>
            <RadioGroup value={requestType} onValueChange={setRequestType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintenance" id="maintenance" />
                <Label htmlFor="maintenance">Asset Maintenance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="request" id="request" />
                <Label htmlFor="request">Asset Request</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add">Add Asset</Label>
              </div>
            </RadioGroup>
          </div>

          {requestType === "maintenance" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="assignedToName">Assigned To Name</Label>
                <Input id="assignedToName" placeholder="Enter employee name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name</Label>
                <Input id="assetName" placeholder="Enter asset name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept">Department</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">Etihad Office</SelectItem>
                    <SelectItem value="hr">Abdalian Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Employee Position</Label>
                <Input id="position" placeholder="Enter job position" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnDate">When Asset is Needed Back</Label>
                <Input id="returnDate" type="date" required />
              </div>
            </>
          )}

          {requestType === "request" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="requestAssetName">Asset Name</Label>
                <Input id="requestAssetName" placeholder="Enter requested asset name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Asset Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-equipment">Computer Equipment</SelectItem>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="electrical-appliances">Electrical Appliances</SelectItem>
                    <SelectItem value="furniture-fixtures">Furniture and Fixtures</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="safety-security">Safety & Security</SelectItem>
                    <SelectItem value="networking-equipment">Networking Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {category === "computer-equipment" && (
                <div className="space-y-2">
                  <Label htmlFor="computerSubcategory">Equipment Type</Label>
                  <Select value={computerSubcategory} onValueChange={setComputerSubcategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Equipment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lcd">LCD</SelectItem>
                      <SelectItem value="mouse">Mouse</SelectItem>
                      <SelectItem value="headphones">Headphones</SelectItem>
                      <SelectItem value="laptop-bag">Laptop Bag</SelectItem>
                      <SelectItem value="stand">Stand</SelectItem>
                      <SelectItem value="keyboard">Keyboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="requestDept">Building</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                    <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="justification">Justification</Label>
                <Input id="justification" placeholder="Why do you need this asset?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neededBy">Needed By Date</Label>
                <Input id="neededBy" type="date" required />
              </div>
            </>
          )}

          {requestType === "add" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="status">Asset Status</Label>
                <Select value={assetStatus} onValueChange={setAssetStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {assetStatus === "Assigned" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="assigneeName">Assignee Name</Label>
                    <Input
                      id="assigneeName"
                      value={assigneeName}
                      onChange={(e) => setAssigneeName(e.target.value)}
                      placeholder="Enter assignee name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Enter Building"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name</Label>
                <Input id="assetName" placeholder="Enter asset name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetCategory">Asset Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-equipment">Computer Equipment</SelectItem>
                    <SelectItem value="electrical-appliances">Electrical Appliances</SelectItem>
                    <SelectItem value="furniture-fixtures">Furniture and Fixtures</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="safety-security">Safety & Security</SelectItem>
                    <SelectItem value="networking-equipment">Networking Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {category === "computer-equipment" && (
                <div className="space-y-2">
                  <Label htmlFor="computerSubcategory">Equipment Type</Label>
                  <Select value={computerSubcategory} onValueChange={setComputerSubcategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Equipment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="lcd">LCD</SelectItem>
                      <SelectItem value="mouse">Mouse</SelectItem>
                      <SelectItem value="headphones">Headphones</SelectItem>
                      <SelectItem value="laptop-bag">Laptop Bag</SelectItem>
                      <SelectItem value="stand">Stand</SelectItem>
                      <SelectItem value="keyboard">Keyboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="assetCost">Asset Cost</Label>
                <Input id="assetCost" placeholder="Enter asset cost" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="LogDate">Asset bought</Label>
                <Input id="LogDate" type="date" required />
              </div>
            </>
          )}

          {requestType && (
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Request
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
