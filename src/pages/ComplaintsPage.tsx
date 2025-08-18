import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, MessageSquare, AlertCircle, CheckCircle, Clock, Upload, X, Eye, Edit, FileText, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComplaintSuggestion {
  id: string;
  title: string;
  description: string;
  type: "complaint" | "suggestion";
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  submittedBy: string;
  department: string;
  date: string;
  attachedFiles?: File[];
}

interface ComplaintsPageProps {
  userRole?: string;
}

export default function ComplaintsPage({ userRole = "admin" }: ComplaintsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplaintSuggestion | null>(null);
  const [editingItem, setEditingItem] = useState<ComplaintSuggestion | null>(null);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    type: "complaint" as "complaint" | "suggestion",
    category: "",
    department: ""
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const mockData: ComplaintSuggestion[] = [
    {
      id: "1",
      title: "Office temperature too cold",
      description: "The AC is set too low in the engineering department",
      type: "complaint",
      category: "Workplace Environment",
      priority: "medium",
      status: "open",
      submittedBy: "John Doe",
      department: "Engineering",
      date: "2024-01-15"
    },
    {
      id: "2",
      title: "Implement flexible working hours",
      description: "Allow employees to choose their working hours within core business hours",
      type: "suggestion",
      category: "HR Policy",
      priority: "medium",
      status: "in-progress",
      submittedBy: "Jane Smith",
      department: "HR",
      date: "2024-01-14"
    },
    {
      id: "3",
      title: "Coffee machine not working",
      description: "The coffee machine on the 3rd floor has been broken for a week",
      type: "complaint",
      category: "Equipment",
      priority: "low",
      status: "resolved",
      submittedBy: "Mike Johnson",
      department: "Operations",
      date: "2024-01-13"
    }
  ];

  const filteredItems = mockData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-600" />;
      case "open": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      resolved: "default",
      "in-progress": "secondary",
      open: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="capitalize">
        {status.replace("-", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary", 
      low: "outline"
    } as const;
    
    return (
      <Badge variant={variants[priority as keyof typeof variants]} className="capitalize">
        {priority}
      </Badge>
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!newItem.title || !newItem.description || !newItem.category || !newItem.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `${newItem.type === "complaint" ? "Complaint" : "Suggestion"} submitted successfully`,
    });

    setNewItem({ title: "", description: "", type: "complaint", category: "", department: "" });
    setUploadedFiles([]);
    setIsSubmitDialogOpen(false);
  };

  const handleViewDetails = (item: ComplaintSuggestion) => {
    setSelectedItem(item);
    setIsDetailsDialogOpen(true);
  };

  const handleEditItem = (item: ComplaintSuggestion) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStatus = (newStatus: "open" | "in-progress" | "resolved") => {
    if (editingItem) {
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus}`,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleUpdatePriority = (newPriority: "low" | "medium" | "high") => {
    if (editingItem) {
      toast({
        title: "Priority Updated", 
        description: `Priority changed to ${newPriority}`,
      });
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Complaints & Suggestions</h2>
          <p className="text-muted-foreground">Submit feedback and track resolutions</p>
        </div>
        
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Submit Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Complaint or Suggestion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newItem.type} onValueChange={(value: "complaint" | "suggestion") => setNewItem(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workplace Environment">Workplace Environment</SelectItem>
                      <SelectItem value="HR Policy">HR Policy</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Process Improvement">Process Improvement</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Select value={newItem.department} onValueChange={(value) => setNewItem(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief summary of your feedback"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                      multiple
                      onChange={handleFileUpload}
                      className="h-8"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 px-3"
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                  {uploadedFiles.filter(f => !f.type.startsWith('image/')).length > 0 && (
                    <div className="space-y-1">
                      {uploadedFiles.filter(f => !f.type.startsWith('image/')).map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                          <span className="truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadedFiles.indexOf(file))}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Images (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="h-8"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 px-3"
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                  {uploadedFiles.filter(f => f.type.startsWith('image/')).length > 0 && (
                    <div className="space-y-1">
                      {uploadedFiles.filter(f => f.type.startsWith('image/')).map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                          <span className="truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadedFiles.indexOf(file))}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  Submit
                </Button>
                <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="complaint">Complaints</SelectItem>
                <SelectItem value="suggestion">Suggestions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
                {userRole !== "employee" && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === "complaint" ? "destructive" : "default"}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </TableCell>
                  <TableCell>{item.submittedBy}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 px-2"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                  {userRole !== "employee" && (
                    <TableCell>
                      <div className="flex gap-2">
                        {userRole === "admin" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 px-2"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.type === "complaint" ? "Complaint" : "Suggestion"} Details
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="capitalize">{selectedItem.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p>{selectedItem.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <div>{getPriorityBadge(selectedItem.priority)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted By</label>
                  <p>{selectedItem.submittedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <p>{selectedItem.department}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="font-medium">{selectedItem.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{selectedItem.description}</p>
              </div>

              {selectedItem.attachedFiles && selectedItem.attachedFiles.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Attached Files</label>
                  <div className="space-y-3 mt-2">
                    {/* Documents */}
                    {selectedItem.attachedFiles.filter(f => !f.type.startsWith('image/')).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Documents</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedItem.attachedFiles.filter(f => !f.type.startsWith('image/')).map((file, index) => (
                            <div key={index} className="p-2 border rounded flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Images */}
                    {selectedItem.attachedFiles.filter(f => f.type.startsWith('image/')).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Images</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedItem.attachedFiles.filter(f => f.type.startsWith('image/')).map((file, index) => (
                            <div key={index} className="space-y-1">
                              <div className="aspect-video border rounded overflow-hidden bg-muted">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Image className="h-3 w-3" />
                                <span className="truncate">{file.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog for Admin */}
      {userRole === "admin" && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update {editingItem?.type}</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select 
                    value={editingItem.priority} 
                    onValueChange={(value: "low" | "medium" | "high") => handleUpdatePriority(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={editingItem.status} 
                    onValueChange={(value: "open" | "in-progress" | "resolved") => handleUpdateStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}