import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SubmitExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [expenseType, setExpenseType] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Expense Submitted",
      description: "Your expense claim has been submitted for approval.",
    });
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Expense Actions
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-[400px] ml-auto right-0 left-auto rounded-l-lg">
        <DrawerHeader>
          <DrawerTitle>Submit New Expense</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Employee Name</Label>
              <Input id="employeeName" placeholder="Enter your full name" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="designation">Employee Designation</Label>
              <Input id="designation" placeholder="Enter your job title" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chargedTo">Charged To</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select charged to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-hub-etihad">One Hub Etihad</SelectItem>
                  <SelectItem value="team-web">Team Web</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="0.00" step="0.01" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required />
            </div>
            
            <div className="space-y-3">
              <Label>Type of Expense</Label>
              <RadioGroup value={expenseType} onValueChange={setExpenseType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time">One-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="repeating" id="repeating" />
                    <Label htmlFor="repeating">Recurring</Label>
                </div>
              </RadioGroup>
            </div>
            
                {expenseType === "repeating" && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Recurring Duration</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Provide details about the expense..."
                className="min-h-[80px]"
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Expense
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}