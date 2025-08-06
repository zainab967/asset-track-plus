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
  onSave: (data: { description: string; documents: File[]; images: File[] }) => void;
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
  const [documents, setDocuments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ description, documents, images });
    setDescription("");
    setDocuments([]);
    setImages([]);
    onClose();
  };

  const handleCancel = () => {
    setDescription("");
    setDocuments([]);
    setImages([]);
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
              <Label>Upload Documents</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('document-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Add Documents
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    PDF, DOC, TXT, Excel files
                  </span>
                </div>
                
                {documents.length > 0 && (
                  <div className="space-y-2">
                    {documents.map((file, index) => (
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
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Images</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Add Images
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    JPG, PNG, GIF files
                  </span>
                </div>
                
                {images.length > 0 && (
                  <div className="space-y-2">
                    {images.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
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