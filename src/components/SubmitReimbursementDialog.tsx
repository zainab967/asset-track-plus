import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface SubmitReimbursementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: string;
    building: string;
    type: "food" | "medical" | "travel" | "other";
    amount: number;
    description?: string;
    media?: File[];
  }) => void;
}

export function SubmitReimbursementDialog({
  isOpen,
  onClose,
  onSubmit
}: SubmitReimbursementDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [building, setBuilding] = useState("");
  const [type, setType] = useState<"food" | "medical" | "travel" | "other">("other");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState<File[]>([]);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedMedia(prev => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name || !category || !building || !amount) return;
    
    onSubmit({
      name,
      category,
      building,
      type,
      amount: Number(amount),
      description,
      media: uploadedMedia
    });

    // Reset form
    setName("");
    setCategory("");
    setBuilding("");
    setType("other");
    setAmount("");
    setDescription("");
    setUploadedMedia([]);
  };

  const recurringReimbursements = [
    { name: "Monthly internet allowance", category: "Other", amount: 8000, building: "All", type: "other" },
    { name: "Quarterly health checkup", category: "Medical", amount: 30000, building: "All", type: "medical" },
    { name: "Team lunch", category: "Food", amount: 15000, building: "Etihad Office", type: "food" }
  ];

  const handleSelectRecurring = (value: string) => {
    const idx = parseInt(value);
    const recurring = recurringReimbursements[idx];
    if (recurring) {
      setName(recurring.name);
      setCategory(recurring.category);
      setAmount(recurring.amount.toString());
      setBuilding(recurring.building === "All" ? "" : recurring.building);
      setType(recurring.type as "food" | "medical" | "travel" | "other");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit New Reimbursement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Reimbursement name"
            />
            <Select onValueChange={handleSelectRecurring}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Or select recurring" />
              </SelectTrigger>
              <SelectContent>
                {recurringReimbursements.map((recurring, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {recurring.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: "food" | "medical" | "travel" | "other") => setType(value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select value={building} onValueChange={setBuilding}>
                <SelectTrigger id="building">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                  <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (PKR)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in PKR"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,image/*"
                multiple
                onChange={handleMediaUpload}
                className="h-8"
                id="media-upload"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => document.getElementById('media-upload')?.click()}
                className="h-8 px-2"
              >
                <Upload className="h-3 w-3" />
              </Button>
            </div>
            {uploadedMedia.length > 0 && (
              <div className="space-y-1 mt-2">
                {uploadedMedia.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-background p-1 rounded border">
                    <span className="truncate">{file.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMedia(index)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name || !category || !building || !amount}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
