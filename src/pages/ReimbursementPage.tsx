import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, CheckCircle, XCircle, Save, X, Upload, FileText, Image, Eye, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseDescriptionDialog } from "@/components/ExpenseDescriptionDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";
import { SubmitReimbursementDialog } from "@/components/SubmitReimbursementDialog";
import { RejectReimbursementDialog } from "@/components/RejectReimbursementDialog";
import { ReimbursementApprovalDialog } from "@/components/ReimbursementApprovalDialog";
import { useReimbursementStatus } from "@/hooks/useReimbursementStatus";
import { updateReimbursementStatus } from "@/services/reimbursements";
import { createExpense } from "@/services/expenses";

interface Reimbursement {
  id: string;
  name: string;
  amount: number;
  user: string;
  category: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  type: "food" | "medical" | "travel" | "other";
  building: string;
  description?: string;
  media?: File[];
}

interface ReimbursementPageProps {
  userRole?: "employee" | "hr" | "admin" | "manager";
}

export default function ReimbursementPage({ userRole = "employee" }: ReimbursementPageProps) {
  const { user } = useAuth();
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
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Custom approval handling, separate from useReimbursementStatus
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
    try {
      setIsProcessing(true);
      const updatedReimbursement = await updateReimbursementStatus(id, status);
      const updatedList = reimbursements.map((r) =>
        r.id === id ? updatedReimbursement : r
      );
      setReimbursements(updatedList);
      toast({
        title: `Reimbursement ${status}`,
        description: `The reimbursement has been ${status} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${status} reimbursement. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprovalConfirm = async (reimbursementId: string, chargedTo: string) => {
    if (!selectedReimbursement) return;

    try {
      setIsProcessing(true);
      // Update reimbursement status
      await handleStatusChange(reimbursementId, "approved");
      
      // Create corresponding expense entry
      const expenseData = {
        name: selectedReimbursement.name,
        amount: selectedReimbursement.amount,
        description: selectedReimbursement.description || "",
        category: selectedReimbursement.category,
        building: selectedReimbursement.building,
        userId: selectedReimbursement.user,
        status: "pending" as const,
        department: chargedTo,
        date: new Date().toISOString()
      };

      await createExpense(expenseData);
      setShowApprovalDialog(false);
      
      toast({
        title: "Expense Created",
        description: "Expense entry has been created for the approved reimbursement.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process approval and create expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Dummy data for testing
  const dummyReimbursements: Reimbursement[] = [
    {
      id: "R1001",
      name: "Monthly Internet Expense",
      amount: 2500,
      user: "Zainab Ahmed",
      category: "Other",
      date: "2025-08-28",
      status: "approved",
      type: "other",
      building: "Main Office",
      description: "Monthly internet bill reimbursement for work from home setup"
    },
    {
      id: "R1002",
      name: "Medical Checkup",
      amount: 15000,
      user: "Ali Hassan",
      category: "Medical",
      date: "2025-08-25",
      status: "pending",
      type: "medical",
      building: "Branch Office",
      description: "Annual medical checkup at approved hospital"
    },
    {
      id: "R1003",
      name: "Business Trip - Lahore",
      amount: 45000,
      user: "Fatima Khan",
      category: "Travel",
      date: "2025-08-20",
      status: "approved",
      type: "travel",
      building: "Main Office",
      description: "Client meeting and workshop expenses in Lahore"
    },
    {
      id: "R1004",
      name: "Office Supplies",
      amount: 35000,
      user: "Omar Malik",
      category: "Other",
      date: "2025-08-15",
      status: "rejected",
      type: "other",
      building: "Tech Center",
      description: "Office supplies for the department"
    },
    {
      id: "R1005",
      name: "Team Lunch",
      amount: 12000,
      user: "Sara Imran",
      category: "Food",
      date: "2025-08-30",
      status: "pending",
      type: "food",
      building: "Main Office",
      description: "Team lunch for project completion celebration"
    }
  ];

  useEffect(() => {
    // Simulate API call with dummy data
    setIsLoading(true);
    setTimeout(() => {
      const filteredClaims = filterReimbursements(dummyReimbursements);
      setReimbursements(filteredClaims);
      setIsLoading(false);
    }, 1000);
  }, [user?.name]);

  // Filter reimbursements based on user role and current user
  const filterReimbursements = (claims: Reimbursement[]) => {
    // During development, show all claims if there's no user
    if (!user) return claims;
    
    if (userRole === "admin" || userRole === "hr") {
      return claims; // Admin and HR can see all claims
    }
    // Other users can only see their own claims
    return claims.filter(claim => claim.user.toLowerCase() === (user?.name || '').toLowerCase());
  };

  const fetchReimbursements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.REIMBURSEMENTS, {
        method: 'GET',
        headers: API_CONFIG.headers,
        mode: API_CONFIG.mode,
        credentials: API_CONFIG.credentials
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      let claims: Reimbursement[] = [];
      
      if (Array.isArray(data)) {
        claims = data;
      } else if (data.items && Array.isArray(data.items)) {
        claims = data.items;
      } else {
        console.error('Unexpected data format:', data);
        throw new Error('Invalid data format received');
      }

      // Apply user-based filtering
      const filteredClaims = filterReimbursements(claims);
      setReimbursements(filteredClaims);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: `Failed to fetch reimbursements: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter reimbursements based on user role, search term, and filters
  const filteredReimbursements = reimbursements.filter(reimbursement => {
    // First check if user has permission to see this reimbursement
    const isAdminOrHR = userRole === "admin" || userRole === "hr";
    const isOwnReimbursement = reimbursement.user.toLowerCase() === user?.name.toLowerCase();
    
    if (!isAdminOrHR && !isOwnReimbursement) {
      return false;
    }

    // Then apply other filters
    const matchesSearch = 
      reimbursement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reimbursement.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reimbursement.status === statusFilter;
    const matchesBuilding = buildingFilter === "all" || reimbursement.building === buildingFilter;

    return matchesSearch && matchesStatus && matchesBuilding;
  });

  const handleStatusUpdate = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      if (newStatus === "rejected") {
        // For rejected reimbursements, delete them
        const response = await fetch(`${API_ENDPOINTS.REIMBURSEMENTS}/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete reimbursement (HTTP ${response.status})`);
        }

        // Remove from local state
        setReimbursements(prev => prev.filter(r => r.id !== id));
        
        toast({
          title: "Success",
          description: "Reimbursement rejected and removed",
        });
      } else if (newStatus === "approved") {
        // For approvals, show the charge to dialog
        const reimbursement = reimbursements.find(r => r.id === id);
        if (reimbursement) {
          setSelectedReimbursement(reimbursement);
          setShowApprovalDialog(true);
        }
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update reimbursement status",
        variant: "destructive",
      });
    }
  };

  const handleApproveWithCharge = async (reimbursementId: string, chargedTo: string) => {
    try {
      // First update the reimbursement status
      const statusResponse = await fetch(`${API_ENDPOINTS.REIMBURSEMENTS}/${reimbursementId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'approved', chargedTo }),
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to update reimbursement status (HTTP ${statusResponse.status})`);
      }

      // Create corresponding expense entry
      const reimbursement = reimbursements.find(r => r.id === reimbursementId);
      if (!reimbursement) throw new Error('Reimbursement not found');

      const expenseResponse = await fetch(API_ENDPOINTS.EXPENSES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: reimbursement.name,
          amount: reimbursement.amount,
          category: reimbursement.category,
          description: reimbursement.description,
          date: new Date().toISOString(),
          type: reimbursement.type,
          chargedTo: chargedTo,
          reimbursementId: reimbursementId,
          status: 'completed'
        }),
      });

      if (!expenseResponse.ok) {
        throw new Error(`Failed to create expense entry (HTTP ${expenseResponse.status})`);
      }

      // Update local state
      setReimbursements(prev => 
        prev.map(r => r.id === reimbursementId ? { ...r, status: 'approved', chargedTo } : r)
      );

      toast({
        title: "Success",
        description: "Reimbursement approved and expense entry created",
      });
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process approval",
        variant: "destructive",
      });
      throw error; // Re-throw to be handled by the dialog
    }
  };

  const handleSubmitReimbursement = async (formData: FormData) => {
    try {
      const response = await fetch(API_ENDPOINTS.REIMBURSEMENTS, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Failed to submit reimbursement (HTTP ${response.status})`
        );
      }

      const newReimbursement = await response.json();
      setReimbursements(prev => [...prev, newReimbursement]);
      setIsAddingNew(false);
      
      toast({
        title: "Success",
        description: "Reimbursement submitted successfully",
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit reimbursement",
        variant: "destructive",
      });
    }
  };

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

  const handleDescriptionSave = async (data: { description: string; media: File[] }) => {
    try {
      const allMedia = [...uploadedMedia, ...(data.media || [])];
      const formData = new FormData();
      
      formData.append('name', newReimbursement.name || '');
      formData.append('amount', (newReimbursement.amount || 0).toString());
      formData.append('category', newReimbursement.category || '');
      formData.append('type', newReimbursement.type || 'other');
      formData.append('building', newReimbursement.building || '');
      formData.append('description', data.description);
      formData.append('date', newReimbursement.date || new Date().toISOString().split('T')[0]);
      formData.append('user', newReimbursement.user || 'Current User');
      
      allMedia.forEach((file, index) => {
        formData.append(`media${index}`, file);
      });

      await handleSubmitReimbursement(formData);
      setShowDescriptionDialog(false);
      setIsAddingNew(false);
      setNewReimbursement({});
      setUploadedMedia([]);
      setCurrentExpenseForDescription(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reimbursement",
        variant: "destructive"
      });
    }
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
        type: recurring.type as "food" | "medical" | "travel" | "other"
      }));
    }
  };

  const handleViewDetails = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement);
    setIsViewDialogOpen(true);
  };

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
      food: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="flex-1">
      <div className="flex-1 space-y-3 p-3 md:p-6 pt-4">
        {pendingClaims > 0 && (
          <p className="text-yellow-600 font-medium text-sm">
            {pendingClaims} pending reimbursement requests 
          </p>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {userRole === "admin" ? (
                  <>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
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
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by building" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Buildings</SelectItem>
                        <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                        <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Button onClick={() => setShowSubmitDialog(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Submit New
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reimbursements Table */}
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Building</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                        <TableCell className="text-muted-foreground text-sm">
                          {newReimbursement.user}
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={newReimbursement.category || ""} 
                            onValueChange={(value) => setNewReimbursement(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Travel">Travel</SelectItem>
                              <SelectItem value="Food">Food</SelectItem>
                              <SelectItem value="Equipment">Equipment</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={newReimbursement.amount || ""}
                            onChange={(e) => setNewReimbursement(prev => ({ ...prev, amount: Number(e.target.value) }))}
                            placeholder="0"
                            className="h-8 w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={newReimbursement.type || "other"} 
                            onValueChange={(value: "food" | "medical" | "travel" | "other") => 
                              setNewReimbursement(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="food">Food</SelectItem>
                              <SelectItem value="medical">Medical</SelectItem>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {newReimbursement.date}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={newReimbursement.building || ""} 
                            onValueChange={(value) => setNewReimbursement(prev => ({ ...prev, building: value }))}
                          >
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
                        <TableCell colSpan={10} className="p-4">
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
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                  {!isLoading && filteredReimbursements.map((reimbursement) => (
                    <TableRow key={reimbursement.id}>
                      <TableCell className="font-medium">{reimbursement.name}</TableCell>
                      <TableCell>{reimbursement.category}</TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(reimbursement.amount)}
                      </TableCell>
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
                        <div className="flex items-center gap-2 justify-end">
                          {userRole === "admin" && reimbursement.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => {
                                  setSelectedReimbursement(reimbursement);
                                  setShowApprovalDialog(true);
                                }}
                                title="Approve"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedReimbursement(reimbursement);
                                  setShowRejectDialog(true);
                                }}
                                title="Reject"
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => handleViewDetails(reimbursement)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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

        <SubmitReimbursementDialog 
          isOpen={showSubmitDialog}
          onClose={() => setShowSubmitDialog(false)}
          onSubmit={async (data) => {
            try {
              const formData = new FormData();
              formData.append('name', data.name);
              formData.append('amount', data.amount.toString());
              formData.append('category', data.category);
              formData.append('type', data.type);
              formData.append('building', data.building);
              formData.append('description', data.description || '');
              formData.append('date', new Date().toISOString().split('T')[0]);
              formData.append('user', user?.name || 'Current User');
              
              if (data.media) {
                data.media.forEach((file, index) => {
                  formData.append(`media${index}`, file);
                });
              }

              await handleSubmitReimbursement(formData);
              setShowSubmitDialog(false);
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to submit reimbursement",
                variant: "destructive"
              });
            }
          }}
        />

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
                    <p className="font-mono text-lg">{formatCurrency(selectedReimbursement.amount)}</p>
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

                {selectedReimbursement.media && selectedReimbursement.media.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Attachments</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
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
            )}
          </DialogContent>
        </Dialog>

        <RejectReimbursementDialog
          isOpen={showRejectDialog}
          onClose={() => {
            setShowRejectDialog(false);
            setSelectedReimbursement(null);
          }}
          onConfirm={(reason) => {
            if (selectedReimbursement) {
              handleStatusChange(selectedReimbursement.id, "rejected");
            }
            setShowRejectDialog(false);
            setSelectedReimbursement(null);
          }}
          reimbursementName={selectedReimbursement?.name || ""}
        />

        {showApprovalDialog && selectedReimbursement && (
          <ReimbursementApprovalDialog
            open={showApprovalDialog}
            onOpenChange={setShowApprovalDialog}
            reimbursementId={selectedReimbursement.id}
            amount={selectedReimbursement.amount}
            description={selectedReimbursement.description || ""}
            onApprove={handleApprovalConfirm}
          />
        )}
      </div>
    </div>
  );
}
