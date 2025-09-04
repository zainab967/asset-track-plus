import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expense } from "@/contexts/ExpenseContext";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Partial<Expense>) => void;
}

interface RecurringExpense {
  name: string;
  category: string;
  amount: number;
  building: string;
}

const recurringExpenses: RecurringExpense[] = [
  { name: "Monthly software licenses", category: "Software", amount: 2400, building: "Etihad Office" },
  { name: "Office supplies", category: "Supplies", amount: 150, building: "Abdalian Office" },
  { name: "Team lunch", category: "Food", amount: 200, building: "Etihad Office" }
];

export function AddExpenseSheet({ isOpen, onClose, onSubmit }: AddExpenseSheetProps) {
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    id: Date.now().toString(),
    name: "",
    amount: 0,
    user: "Current User",
    building: "",
    date: new Date().toISOString().split('T')[0],
    status: "pending",
    category: "",
    type: "one-time",
    chargedTo: ""
  });
  
  const { toast } = useToast();

  const handleSelectRecurring = (value: string) => {
    const idx = parseInt(value);
    const recurring = recurringExpenses[idx];
    if (recurring) {
      setNewExpense(prev => ({
        ...prev,
        name: recurring.name,
        category: recurring.category,
        amount: recurring.amount,
        building: recurring.building
      }));
    }
  };

  const handleSubmit = () => {
    if (!newExpense.name || !newExpense.category || !newExpense.building || !newExpense.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onSubmit(newExpense);
    setNewExpense({
      id: Date.now().toString(),
      name: "",
      amount: 0,
      user: "Current User",
      building: "",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      category: "",
      type: "one-time",
      chargedTo: ""
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Expense</SheetTitle>
          <SheetDescription>Enter expense details below</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Expense Name</Label>
              <Input
                id="name"
                value={newExpense.name || ""}
                onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter expense name"
              />
            </div>

            <div className="space-y-2">
              <Label>Quick Select</Label>
              <Select onValueChange={handleSelectRecurring}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recurring expense" />
                </SelectTrigger>
                <SelectContent>
                  {recurringExpenses.map((recurring, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {recurring.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newExpense.amount || ""}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newExpense.category || ""}
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select
                value={newExpense.building || ""}
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, building: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                  <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chargedTo">Charged To</Label>
              <Select
                value={newExpense.chargedTo || ""}
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, chargedTo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One Hub Etihad">One Hub Etihad</SelectItem>
                  <SelectItem value="Team Web">Team Web</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter>
            <Button 
              onClick={handleSubmit} 
              className="w-full"
              size="lg"
            >
              Submit Expense
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
