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
      case "assigned": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "unassigned": return <Package className="h-4 w-4 text-blue-600" />;
      case "maintenance": return <Wrench className="h-4 w-4 text-orange-600" />;
      default: return null;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "fair": return "text-yellow-600";
      case "poor": return "text-red-600";
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
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetCounts.assigned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetCounts.maintenance}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Assets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetCounts.unassigned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex-1 md:max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4"
              />
            </div>
          </div>
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
        </div>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overall">All Assets</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          {userRole === "employee" && (
            <TabsTrigger value="my-assets">My Assets</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Purchase Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.assetid}</TableCell>
                    <TableCell>{asset.name}</TableCell>
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
                    <TableCell>${asset.value.toLocaleString()}</TableCell>
                    <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
