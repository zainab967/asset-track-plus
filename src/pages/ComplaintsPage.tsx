import { useState, useEffect } from "react";
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
import { API_ENDPOINTS } from "@/config/api";

interface ComplaintSuggestion {
  id: string;
  title: string;
  description: string;
  type: "complaint" | "suggestion";
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved" | string;
  resolved?: boolean;
  createdAt: string;
  department?: string;
  assignedTo?: string;
  attachments?: File[];
  responses?: {
    id: string;
    text: string;
    createdAt: string;
    user: string;
  }[];
  submittedBy: string;
  building: string;
  date: string;
  attachedmedia?: File[];
}

import { useAuth, User } from "@/hooks/useAuth";

interface ComplaintsPageProps {
  userRole?: string;
}

export default function ComplaintsPage({ userRole = "employee" }: ComplaintsPageProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplaintSuggestion | null>(null);
  const [items, setItems] = useState<ComplaintSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Dummy data for testing
  const dummyComplaints: ComplaintSuggestion[] = [
    {
      id: "C1001",
      title: "AC Not Working",
      description: "The air conditioning in the main conference room has stopped working properly. Temperature is too high for meetings.",
      type: "complaint",
      category: "Facilities",
      priority: "high",
      status: "in-progress",
      createdAt: "2025-08-30T09:00:00Z",
      department: "Operations",
      assignedTo: "Maintenance Team",
      submittedBy: "Sara Ahmed",
      building: "Main Office",
      date: "2025-08-30",
      responses: [
        {
          id: "R1",
          text: "Maintenance team has been notified. Will check today.",
          createdAt: "2025-08-30T10:00:00Z",
          user: "Facility Manager"
        }
      ]
    },
    {
      id: "C1002",
      title: "Suggestion for Team Building",
      description: "Monthly team building activities would help improve team collaboration and morale.",
      type: "suggestion",
      category: "HR",
      priority: "medium",
      status: "open",
      createdAt: "2025-08-29T14:00:00Z",
      department: "HR",
      assignedTo: "HR Manager",
      submittedBy: "Ali Hassan",
      building: "Main Office",
      date: "2025-08-29",
      responses: []
    },
    {
      id: "C1003",
      title: "Printer Not Working",
      description: "The printer on the 2nd floor is showing paper jam error but there's no paper jam.",
      type: "complaint",
      category: "IT Equipment",
      priority: "medium",
      status: "resolved",
      createdAt: "2025-08-28T11:00:00Z",
      department: "IT",
      assignedTo: "IT Support",
      submittedBy: "Zainab Khan",
      building: "Tech Center",
      date: "2025-08-28",
      responses: [
        {
          id: "R2",
          text: "Issue has been resolved. Printer cartridge was empty.",
          createdAt: "2025-08-28T13:00:00Z",
          user: "IT Support"
        }
      ]
    },
    {
      id: "C1004",
      title: "Cafeteria Menu Suggestion",
      description: "Can we include more vegetarian options in the cafeteria menu?",
      type: "suggestion",
      category: "Facilities",
      priority: "low",
      status: "in-progress",
      createdAt: "2025-08-27T10:00:00Z",
      department: "Operations",
      assignedTo: "Cafeteria Manager",
      submittedBy: "Fatima Ali",
      building: "Main Office",
      date: "2025-08-27",
      responses: [
        {
          id: "R3",
          text: "Thank you for the suggestion. We are reviewing menu options.",
          createdAt: "2025-08-27T11:00:00Z",
          user: "Cafeteria Manager"
        }
      ]
    },
    {
      id: "C1005",
      title: "Internet Connectivity Issues",
      description: "Frequent internet disconnections in Meeting Room 3",
      type: "complaint",
      category: "IT",
      priority: "high",
      status: "open",
      createdAt: "2025-08-26T15:00:00Z",
      department: "IT",
      assignedTo: "Network Team",
      submittedBy: "Omar Khan",
      building: "Tech Center",
      date: "2025-08-26",
      responses: []
    }
  ];

  const [editingItem, setEditingItem] = useState<ComplaintSuggestion | null>(null);

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    type: "complaint" as "complaint" | "suggestion",
    category: "",
    department: ""
  });

  const [uploadedMedia, setUploadedMedia] = useState<File[]>([]);

  useEffect(() => {
    // For development/testing, use dummy data
    // In production, uncomment fetchComplaints() and comment out the dummy data loading
    setIsLoading(true);
    setTimeout(() => {
      setItems(dummyComplaints);
      setIsLoading(false);
    }, 1000);
    // fetchComplaints();
  }, []);

  // Uncomment this function when ready to use real API
  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.FEEDBACK, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });

      const errorText = await response.text();
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.title || 'Failed to fetch complaints';
        } catch {
          errorMessage = errorText || `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(errorText);
      } catch {
        throw new Error('Invalid JSON response from server');
      }

      if (Array.isArray(data)) {
        setItems(data);
      } else if (data.items && Array.isArray(data.items)) {
        setItems(data.items);
      } else if (data.data && Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        console.error('Unexpected data format:', data);
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to connect to the complaints server. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(API_ENDPOINTS.FEEDBACK, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to submit (HTTP ${response.status})`);
      }

      const newComplaint = await response.json();
      setItems(prev => [...prev, newComplaint]);
      setIsSubmitDialogOpen(false);
      setNewItem({
        title: "",
        description: "",
        type: "complaint",
        category: "",
        department: ""
      });
      setUploadedMedia([]);

      toast({
        title: "Success",
        description: "Successfully submitted",
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ComplaintSuggestion["status"]) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.FEEDBACK_BY_ID(id)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update status (HTTP ${response.status})`);
      }

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredItems = items.filter(item => {
    // Apply filters
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedMedia(prev => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = async (id: string, updates: Partial<ComplaintSuggestion>) => {
    try {
      const response = await fetch(API_ENDPOINTS.FEEDBACK_BY_ID(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update (HTTP ${response.status})`);
      }

      const updatedItem = await response.json();
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      ));
      setIsEditDialogOpen(false);
      setEditingItem(null);

      toast({
        title: "Success",
        description: "Successfully updated",
      });
    } catch (error) {
      console.error('Edit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update",
        variant: "destructive",
      });
    }
  };

  const statusColors = {
    'open': 'text-yellow-500',
    'in-progress': 'text-blue-500',
    'resolved': 'text-green-500'
  };

  return (
    <div className="flex-1">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Complaints & Suggestions</h2>
          <Button onClick={() => setIsSubmitDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Submit New
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="complaint">Complaints</SelectItem>
                    <SelectItem value="suggestion">Suggestions</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                Loading...
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Title</TableHead>
                      <TableHead className="w-[120px]">Type</TableHead>
                      <TableHead className="w-[150px]">Category</TableHead>
                      <TableHead className="w-[120px]">Priority</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[150px]">Building</TableHead>
                      <TableHead className="w-[150px]">Submitted By</TableHead>
                      <TableHead className="w-[120px]">Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'complaint' ? 'destructive' : 'default'}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Badge variant={
                            item.priority === "high" ? "destructive" :
                            item.priority === "medium" ? "secondary" :
                            "outline"
                          }>
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={statusColors[item.status]}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{item.building}</TableCell>
                        <TableCell>{item.submittedBy}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(user?.role === 'Admin' || user?.role === 'HR') && item.status !== 'resolved' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Dialog */}
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit New Complaint/Suggestion</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append('title', newItem.title);
              formData.append('description', newItem.description);
              formData.append('type', newItem.type);
              formData.append('category', newItem.category);
              formData.append('department', newItem.department);
              formData.append('submittedBy', user?.name || 'Unknown User');
              uploadedMedia.forEach((file, index) => {
                formData.append(`media${index}`, file);
              });
              handleSubmit(formData);
            }}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newItem.type}
                  onValueChange={(value: "complaint" | "suggestion") => 
                    setNewItem(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={newItem.category} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workplace Environment">Workplace Environment</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="HR Policy">HR Policy</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    onChange={handleMediaUpload}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {uploadedMedia.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {uploadedMedia.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-background p-2 rounded border">
                        <span className="truncate">{file.name}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMedia(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={!newItem.title || !newItem.description || !newItem.category}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <p className="font-medium">{selectedItem.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <div>
                      <Badge variant={selectedItem.type === 'complaint' ? 'destructive' : 'default'}>
                        {selectedItem.type}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div>
                      <span className={statusColors[selectedItem.status]}>
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p>{selectedItem.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <div>
                      <Badge variant={
                        selectedItem.priority === "high" ? "destructive" :
                        selectedItem.priority === "medium" ? "secondary" :
                        "outline"
                      }>
                        {selectedItem.priority}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Building</label>
                    <p>{selectedItem.building}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm">{selectedItem.description}</p>
                </div>

                {selectedItem.responses && selectedItem.responses.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Responses</label>
                    <div className="space-y-2 mt-2">
                      {selectedItem.responses.map((response) => (
                        <div key={response.id} className="bg-muted p-3 rounded-md">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{response.user}</span>
                            <span className="text-muted-foreground">{response.createdAt}</span>
                          </div>
                          <p className="mt-1 text-sm">{response.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Attachments</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedItem.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(user?.role === 'Admin' || user?.role === 'HR') && selectedItem.status !== 'resolved' && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedItem.id, 'in-progress')}
                      disabled={selectedItem.status === 'in-progress'}
                    >
                      Mark In Progress
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleUpdateStatus(selectedItem.id, 'resolved')}
                      disabled={selectedItem.status === "resolved"}
                    >
                      Mark Resolved
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                if (!editingItem) return;

                handleEdit(editingItem.id, {
                  title: editingItem.title,
                  description: editingItem.description,
                  category: editingItem.category,
                  priority: editingItem.priority,
                  status: editingItem.status,
                });
              }}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editingItem.title}
                    onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={editingItem.category}
                    onValueChange={(value) => setEditingItem(prev => prev ? ({ ...prev, category: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workplace Environment">Workplace Environment</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="HR Policy">HR Policy</SelectItem>
                      <SelectItem value="Facilities">Facilities</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={editingItem.priority}
                    onValueChange={(value: "low" | "medium" | "high") => 
                      setEditingItem(prev => prev ? ({ ...prev, priority: value }) : null)
                    }
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editingItem.status}
                    onValueChange={(value: "open" | "in-progress" | "resolved") => 
                      setEditingItem(prev => prev ? ({ ...prev, status: value }) : null)
                    }
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

                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
