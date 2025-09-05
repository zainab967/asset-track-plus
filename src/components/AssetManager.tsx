import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Wrench, AlertTriangle, CheckCircle, Package, Eye, MessageSquare } from "lucide-react";
import { AddAssetDialog } from "./AddAssetDialog";
import { AssetActionDialog } from "./AssetActionDialog";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  assetid: string;
  category: string;
  assignedTo: string | null;
  building: string;
  status: "assigned" | "unassigned" | "maintenance";
  value: number;
  purchaseDate: string;
  condition: "excellent" | "good" | "fair" | "poor";
  description?: string;
  responses?: {
    id: string;
    text: string;
    createdAt: string;
    user: string;
    role: string;
  }[];
}

interface AssetManagerProps {
  userRole?: "employee" | "hr" | "admin" | "manager";
  currentUser?: string;
}

export function AssetManager({ userRole = "admin", currentUser = "Current User" }: AssetManagerProps) {
  // Sample data with responses
  const assets: Asset[] = [
    {
      id: "1",
      name: "MacBook Pro 16\"",
      assetid: "l-3232",
      category: "Laptop",
      assignedTo: "John Doe",
      building: "Etihad Office",
      status: "assigned",
      value: 2499,
      purchaseDate: "2023-06-15",
      condition: "excellent",
      description: "High-performance laptop for development work",
      responses: [
        {
          id: "r1",
          text: "Asset assigned to John Doe for development project",
          createdAt: "2023-06-15T10:00:00Z",
          user: "IT Manager",
          role: "Admin"
        },
        {
          id: "r2", 
          text: "Regular maintenance completed, all systems running optimally",
          createdAt: "2023-08-15T14:30:00Z",
          user: "Tech Support",
          role: "Maintenance"
        }
      ]
    }
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overall");
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");
  const [sortBy, setSortBy] = useState<"all" | "assigned" | "unassigned" | "maintenance">("all");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseText, setResponseText] = useState("");
  const { toast } = useToast();

  const handleAddResponse = () => {
    if (!responseText.trim() || !selectedAsset) return;
    
    const newResponse = {
      id: Date.now().toString(),
      text: responseText,
      createdAt: new Date().toISOString(),
      user: currentUser,
      role: userRole
    };

    // Update the asset with new response
    // In a real app, this would be an API call
    setSelectedAsset(prev => prev ? {
      ...prev,
      responses: [...(prev.responses || []), newResponse]
    } : null);

    setResponseText("");
    setShowResponseDialog(false);
    toast({
      title: "Success",
      description: "Response added successfully"
    });
  };

  // Utility functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned": return <CheckCircle className="h-4 w-4 text-success" />;
      case "unassigned": return <Package className="h-4 w-4 text-primary" />;
      case "maintenance": return <Wrench className="h-4 w-4 text-warning" />;
      default: return null;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent": return "text-success";
      case "good": return "text-primary";
      case "fair": return "text-warning";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  // Counts and filters
  const assetCounts = {
    assigned: assets.filter(a => a.status === "assigned").length,
    unassigned: assets.filter(a => a.status === "unassigned").length,
    maintenance: assets.filter(a => a.status === "maintenance").length
  };

  const filteredAssets = assets.filter(asset => {
    const searchFields = [
      asset.assetid,
      asset.name,
      asset.category,
      asset.assignedTo,
      asset.building
    ].map(field => field?.toLowerCase() || "");
    
    const matchesSearch = searchTerm === "" || searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    const matchesDepartment = buildingFilter === "all" || asset.building === buildingFilter;
    
    let matchesSort = true;
    if (sortBy !== "all") {
      matchesSort = asset.status === sortBy;
    }
    
    let matchesTab = true;
    if (activeTab === "my-assets") {
      matchesTab = asset.assignedTo === currentUser;
    } else if (activeTab !== "overall") {
      matchesTab = asset.status === activeTab;
    }
    
    return matchesSearch && matchesDepartment && matchesSort && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage and track all company assets across locations
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search by asset ID, name, category, or assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Buildings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                  <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                {userRole === "employee" ? (
                  <AssetActionDialog userRole={userRole} mode="user" />
                ) : (
                  <AssetActionDialog userRole={userRole} mode="admin" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="overall">All Assets ({assets.length})</TabsTrigger>
          <TabsTrigger value="assigned">Assigned ({assetCounts.assigned})</TabsTrigger>
          <TabsTrigger value="unassigned">Available ({assetCounts.unassigned})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance ({assetCounts.maintenance})</TabsTrigger>
          <TabsTrigger value="my-assets">My Assets</TabsTrigger>
        </TabsList>

        {/* Assets Table */}
        <Card className="mt-4">
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Asset ID</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[150px]">Assigned To</TableHead>
                    <TableHead className="w-[130px]">Building</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[100px]">Condition</TableHead>
                    <TableHead className="w-[120px]">Value</TableHead>
                    <TableHead className="w-[120px]">Purchase Date</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-sm font-medium">{asset.assetid}</TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{asset.assignedTo || "—"}</TableCell>
                      <TableCell>{asset.building}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(asset.status)}
                          <span className="capitalize">{asset.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getConditionColor(asset.condition)}>
                          {asset.condition}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">${asset.value.toLocaleString()}</TableCell>
                      <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAssets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                        No assets found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Asset Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asset Details - {selectedAsset?.assetid}</DialogTitle>
          </DialogHeader>
          
          {selectedAsset && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{selectedAsset.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-sm">{selectedAsset.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                  <p className="text-sm">{selectedAsset.assignedTo || "Unassigned"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Building</label>
                  <p className="text-sm">{selectedAsset.building}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedAsset.status)}
                    <span className="capitalize text-sm">{selectedAsset.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Condition</label>
                  <p className={`text-sm ${getConditionColor(selectedAsset.condition)}`}>
                    {selectedAsset.condition}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Value</label>
                  <p className="text-sm font-mono">${selectedAsset.value.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Purchase Date</label>
                  <p className="text-sm">{new Date(selectedAsset.purchaseDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedAsset.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1">{selectedAsset.description}</p>
                </div>
              )}

              {/* Responses Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium">Responses & Updates</h4>
                  {userRole !== "employee" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowResponseDialog(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Response
                    </Button>
                  )}
                </div>
                
                {selectedAsset.responses && selectedAsset.responses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAsset.responses.map((response) => (
                      <div key={response.id} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">{response.user}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(response.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{response.text}</p>
                        {response.role && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {response.role}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No responses yet</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Response</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResponse}>
              Add Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}