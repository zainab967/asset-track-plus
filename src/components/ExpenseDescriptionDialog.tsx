import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Upload, X, Image } from "lucide-react";

interface ExpenseDescriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { description: string; media: File[] }) => void;
  expense?: {
    name: string;
    amount: number;
    category: string;
  };
}

export function ExpenseDescriptionDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  expense 
}: ExpenseDescriptionDialogProps) {
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<File[]>([]);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMedia(prev => [...prev, ...files]);
  };
  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ description, media });
    setDescription("");
    setMedia([]);
    onClose();
  };

  const handleCancel = () => {
    setDescription("");
    setMedia([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Expense Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {expense && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium">{expense.name}</h4>
              <p className="text-sm text-muted-foreground">
                ${expense.amount.toLocaleString()} - {expense.category}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed description of the expense..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Media</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('media-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Add Media
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    PDF, DOC, TXT, Excel files, Images
                  </span>
                </div>
                
                {media.length > 0 && (
                  <div className="space-y-2">
                    {media.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedia(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!description.trim()}
            >
             Save Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}