import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Clock, CheckCircle, XCircle, Save, X, Upload, FileText, Image, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseDescriptionDialog } from "@/components/ExpenseDescriptionDialog";
import { useToast } from "@/hooks/use-toast";

interface Reimbursement {
  id: string;
  name: string;
  amount: number;
  user: string;
  category: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  type: "medical" | "travel" | "equipment" | "other";
  building: string;
  description?: string;
  media?: File[];
}

interface ReimbursementPageProps {
  userRole?: "employee" | "hr" | "admin" | "manager";
}

export default function ReimbursementPage({ userRole = "admin" }: ReimbursementPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newReimbursement, setNewReimbursement] = useState<Partial<Reimbursement>>({});
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [currentExpenseForDescription, setCurrentExpenseForDescription] = useState<any>(null);
  const [uploadedMedia, setUploadedMedia] = useState<File[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null);
  const { toast } = useToast();

  const mockReimbursements: Reimbursement[] = [
    {
      id: "1",
      name: "Medical checkup reimbursement",
      amount: 350,
      user: "John Doe",
      category: "Healthcare",
      date: "2024-01-15",
      status: "approved",
      type: "medical",
      building: "Etihad Office"
    },
    {
      id: "2",
      name: "Business travel expenses",
      amount: 1200,
      user: "Jane Smith",
      category:" Sales",
      date: "2024-01-14",
      status: "pending",
      type: "travel",
      building: "Etihad Office"
    },
    {
      id: "3",
      name: "Home office equipment",
      amount: 800,
      user: "Mike Johnson",
      category: "Equipment",
      date: "2024-01-13",
      status: "approved",
      type: "equipment",
      building: "Abdalian Office"
    }
  ];

  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(mockReimbursements);

  const recurringReimbursements = [
    { name: "Monthly internet allowance", category: "Utilities", amount: 80, building: "All", type: "other" },
    { name: "Quarterly health checkup", category: "Healthcare", amount: 300, building: "All", type: "medical" },
    { name: "Work from home setup", category: "Equipment", amount: 500, building: "Etihad Office", type: "equipment" }
  ];

  const handleAddNew = () => {
    setIsAddingNew(true);
    setUploadedMedia([]);
    setNewReimbursement({
      id: Date.now().toString(),
      name: "",
      amount: 0,
      user: "Current User",
      building: "",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      type: "other",
      category: ""
    });
  };

  const handleSaveNew = () => {
    if (!newReimbursement.name || !newReimbursement.category || !newReimbursement.building || !newReimbursement.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Open description dialog
    setCurrentExpenseForDescription(newReimbursement);
    setShowDescriptionDialog(true);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedMedia(prev => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionSave = (data: { description: string; media: File[] }) => {
    const allMedia = [...uploadedMedia, ...(data.media || [])];
    const reimbursement: Reimbursement = {
      id: newReimbursement.id!,
      name: newReimbursement.name!,
      amount: Number(newReimbursement.amount),
      user: newReimbursement.user!,
      category: newReimbursement.category!,
      date: newReimbursement.date!,
      status: newReimbursement.status as "pending" | "approved" | "rejected",
      type: newReimbursement.type as "medical" | "travel" | "equipment" | "other",
      building: newReimbursement.building!,
      description: data.description,
      media: allMedia
    };

    setReimbursements(prev => [reimbursement, ...prev]);
    setIsAddingNew(false);
    setNewReimbursement({});
    setUploadedMedia([]);
    setCurrentExpenseForDescription(null);
    
    toast({
      title: "Success",
      description: "Reimbursement request submitted successfully",
    });
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewReimbursement({});
    setUploadedMedia([]);
  };

  const handleSelectRecurring = (value: string) => {
    const idx = parseInt(value);
    const recurring = recurringReimbursements[idx];
    if (recurring) {
      setNewReimbursement(prev => ({
        ...prev,
        name: recurring.name,
        category: recurring.category,
        amount: recurring.amount,
        building: recurring.building === "All" ? "" : recurring.building,
        type: recurring.type as "medical" | "travel" | "equipment" | "other"
      }));
    }
  };

  const handleViewDetails = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement);
    setIsViewDialogOpen(true);
  };

  const filteredReimbursements = reimbursements.filter(reimbursement => {
    const matchesSearch = reimbursement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reimbursement.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reimbursement.status === statusFilter;
    const matchesBuilding = buildingFilter === "all" || reimbursement.building === buildingFilter;

    return matchesSearch && matchesStatus && matchesBuilding;
  });

  const pendingClaims = reimbursements.filter(r => r.status === "pending").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      rejected: "destructive", 
      pending: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      medical: "bg-blue-100 text-blue-800",
      travel: "bg-green-100 text-green-800",
      equipment: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reimbursement Management</h2>
          <p className="text-muted-foreground">
            {pendingClaims > 0 && (
              <span className="text-yellow-600 font-medium">
                {pendingClaims} pending reimbursement requests require attention
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reimbursements Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reimbursement Requests</CardTitle>
            <Button 
              onClick={handleAddNew} 
              size="sm" 
              className="flex items-center gap-2"
              disabled={isAddingNew}
            >
              <Plus className="h-4 w-4" />
              Add Request
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Details</TableHead>
                {(userRole === "hr" || userRole === "admin" || userRole === "manager") && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAddingNew && (
                <>
                  <TableRow className="bg-muted/30">
                    <TableCell>
                      <Input
                        value={newReimbursement.name || ""}
                        onChange={(e) => setNewReimbursement(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Reimbursement name"
                        className="h-8"
                      />
                      <Select onValueChange={handleSelectRecurring}>
                        <SelectTrigger className="h-6 text-xs mt-1">
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
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{newReimbursement.user}</TableCell>
                    <TableCell>
                      <Select value={newReimbursement.building || ""} onValueChange={(value) => setNewReimbursement(prev => ({ ...prev, building: value }))}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Building" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                          <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={newReimbursement.amount || ""}
                        onChange={(e) => setNewReimbursement(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        placeholder="0"
                        className="h-8 font-mono"
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={newReimbursement.type || "other"} onValueChange={(value: "medical" | "travel" | "equipment" | "other") => setNewReimbursement(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{newReimbursement.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pending</Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={newReimbursement.category || ""} onValueChange={(value) => setNewReimbursement(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Travel">Travel</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" onClick={handleSaveNew} className="h-7 w-7 p-0">
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelNew} className="h-7 w-7 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/20">
                    <TableCell colSpan={8} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Media Upload */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Media
                          </label>
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
                            <div className="space-y-1">
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
                    </TableCell>
                  </TableRow>
                </>
              )}
              {filteredReimbursements.map((reimbursement) => (
                <TableRow key={reimbursement.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{reimbursement.name}</TableCell>
                  <TableCell>{reimbursement.user}</TableCell>
                  <TableCell>{reimbursement.category}</TableCell>
                  <TableCell className="font-mono">${reimbursement.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {getTypeBadge(reimbursement.type)}
                  </TableCell>
                  <TableCell>{reimbursement.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(reimbursement.status)}
                      {getStatusBadge(reimbursement.status)}
                    </div>
                  </TableCell>
                  <TableCell>{reimbursement.building}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 px-2"
                      onClick={() => handleViewDetails(reimbursement)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                  {(userRole === "hr" || userRole === "admin" || userRole === "manager") && (
                    <TableCell>
                      <div className="flex gap-2">
                        {reimbursement.status === "pending" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 px-2">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 h-7 px-2">
                              Reject
                            </Button>
                          </>
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

      <ExpenseDescriptionDialog
        isOpen={showDescriptionDialog}
        onClose={() => {
          setShowDescriptionDialog(false);
          setCurrentExpenseForDescription(null);
        }}
        onSave={handleDescriptionSave}
        expense={currentExpenseForDescription}
      />

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reimbursement Details</DialogTitle>
          </DialogHeader>
          {selectedReimbursement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{selectedReimbursement.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className="font-mono text-lg">${selectedReimbursement.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div>{getTypeBadge(selectedReimbursement.type)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedReimbursement.status)}
                    {getStatusBadge(selectedReimbursement.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User</label>
                  <p>{selectedReimbursement.user}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Building</label>
                  <p>{selectedReimbursement.building}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p>{selectedReimbursement.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p>{selectedReimbursement.date}</p>
                </div>
              </div>

              {selectedReimbursement.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{selectedReimbursement.description}</p>
                </div>
              )}

              {((selectedReimbursement.media && selectedReimbursement.media.length > 0)
               && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Attachments</label>
                  <div className="space-y-3 mt-2">
                    {/* Documents */}
                    {selectedReimbursement.media && selectedReimbursement.media.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Media</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedReimbursement.media.map((file, index) => (
                            <div key={index} className="p-2 border rounded flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}