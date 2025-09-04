import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Wrench, AlertTriangle, CheckCircle, Package, Eye, History } from "lucide-react";
import { AddAssetDialog } from "./AddAssetDialog";
import { AssetActionDialog } from "./AssetActionDialog";

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
  // Sample data
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
      condition: "excellent"
    }
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState(userRole === "employee" ? "my-assets" : "assigned");
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");
  const [sortBy, setSortBy] = useState<"all" | "assigned" | "unassigned" | "maintenance">("all");

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
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Asset Management</h2>
          <p className="text-muted-foreground">
            Manage and track all company assets across locations
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{assetCounts.assigned}</div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{assetCounts.maintenance}</div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Assets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{assetCounts.unassigned}</div>
          </CardContent>
        </Card>
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
                {userRole === "admin" && (
                  <>
                    <AddAssetDialog />
                    <AssetActionDialog userRole={userRole} mode="admin" />
                  </>
                )}
                {userRole !== "admin" && (
                  <AssetActionDialog userRole={userRole} mode="user" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Asset Inventory</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overall">All Assets</TabsTrigger>
                <TabsTrigger value="assigned">Assigned</TabsTrigger>
                <TabsTrigger value="unassigned">Available</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                {userRole === "employee" && (
                  <TabsTrigger value="my-assets">My Assets</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
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
                  </TableRow>
                ))}
                {filteredAssets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No assets found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
