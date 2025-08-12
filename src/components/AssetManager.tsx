import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Wrench, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { AddAssetDialog } from "./AddAssetDialog";
import { AssetActionDialog } from "./AssetActionDialog";

interface Asset {
  id: string;
  name: string;
  assetid: string;
  category: string;
  assignedTo: string | null;
  department: string;
  status: "assigned" | "unassigned" | "maintenance";
  value: number;
  purchaseDate: string;
  condition: "excellent" | "good" | "fair" | "poor";
}

interface AssetManagerProps {
  userRole?: "employee" | "hr" | "admin" | "manager";
  currentUser?: string;
}

export function AssetManager({ userRole = "admin", currentUser = "Current User" }: AssetManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState(userRole === "employee" ? "my-assets" : "assigned");
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");
  const [sortBy, setSortBy] = useState<"all" | "assigned" | "unassigned" | "maintenance">("all");
  

  // Debug logging
  console.log('AssetManager Debug:', { userRole, currentUser, activeTab });

  const assets: Asset[] = [
    {
      id: "1",
      name: "MacBook Pro 16\"",
      assetid: "l-3232",
      category: "Laptop",
      assignedTo: "John Doe",
      department: "Engineering",
      status: "assigned",
      value: 2499,
      purchaseDate: "2023-06-15",
      condition: "excellent"
    },
    {
      id: "2",
      name: "Standing Desk",
      assetid: "f-323",
      category: "Furniture",
      assignedTo: "Jane Smith",
      department: "Engineering",
      status: "assigned",
      value: 799,
      purchaseDate: "2023-08-20",
      condition: "good"
    },
    {
      id: "3",
      name: "4K Monitor",
      assetid: "M-32323",
      category: "Monitor",
      assignedTo: null,
      department: "Unassigned",
      status: "unassigned",
      value: 399,
      purchaseDate: "2023-09-10",
      condition: "excellent"
    },
    {
      id: "4",
      name: "Conference Phone",
      assetid: "e-32323",
      category: "Equipment",
      assignedTo: "Shared Resource",
      department: "Operations",
      status: "maintenance",
      value: 1200,
      purchaseDate: "2022-03-15",
      condition: "fair"
    },
    {
      id: "5",
      name: "Projector",
      assetid: "e-323",
      category: "Electronics",
      assignedTo: "Meeting Room A",
      department: "Operations",
      status: "maintenance",
      value: 899,
      purchaseDate: "2022-11-05",
      condition: "poor"
    },
    {
      id: "6",
      name: "Wireless Mouse",
      assetid: "p-3233",
      category: "Peripheral",
      assignedTo: "Current User",
      department: "Engineering",
      status: "assigned",
      value: 89,
      purchaseDate: "2023-12-01",
      condition: "excellent"
    },
    {
      id: "7",
      name: "Mechanical Keyboard",
      assetid: "M-2323",
      category: "Peripheral",
      assignedTo: "Current User",
      department: "Engineering",
      status: "assigned",
      value: 159,
      purchaseDate: "2023-12-01",
      condition: "good"
    }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.assetid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === "all" || asset.department === departmentFilter;
    
    // Filter based on sort criteria
    let matchesSort = true;
    if (sortBy !== "all") {
      switch (sortBy) {
        case "assigned":
          matchesSort = asset.status === "assigned";
          break;
        case "unassigned":
          matchesSort = asset.status === "unassigned";
          break;
        case "maintenance":
          matchesSort = asset.status === "maintenance";
          break;
      }
    }
    
    // Handle different tab filtering
    let matchesTab = false;
    if (activeTab === "overall") {
      matchesTab = true; // Show all assets for overall view
    } else if (activeTab === "my-assets" && userRole === "employee") {
      matchesTab = asset.assignedTo === currentUser; // Show only user's assets
    } else {
      matchesTab = asset.status === activeTab; // Standard status filtering
    }
    
    // Filter based on user role
    let roleFilter = true;
    if (userRole === "employee" && activeTab !== "my-assets" && activeTab !== "overall") {
      roleFilter = asset.assignedTo === currentUser || asset.status === "unassigned";
    }
    
    // Debug logging for employee assets
    if (userRole === "employee" && activeTab === "my-assets") {
      console.log('Employee asset filter debug:', {
        assetName: asset.name,
        assignedTo: asset.assignedTo,
        currentUser,
        matchesTab,
        matchesSearch,
        matchesDepartment,
        matchesSort,
        roleFilter
      });
    }
    
    return matchesSearch && matchesDepartment && matchesTab && roleFilter && matchesSort;
  });

  // More debug logging
  console.log('Assets assigned to current user:', assets.filter(a => a.assignedTo === currentUser));
  console.log('Filtered assets count:', filteredAssets.length);
  console.log('Employee view - is showing My Assets card?', userRole === "employee");
  console.log('Employee assets for card:', assets.filter(a => a.assignedTo === currentUser));

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

  const assetCounts = {
    assigned: assets.filter(a => a.status === "assigned").length,
    unassigned: assets.filter(a => a.status === "unassigned").length,
    maintenance: assets.filter(a => a.status === "maintenance").length
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {userRole === "employee" ? "My Assets" : userRole === "hr" ? "HR Asset Management" : "Assets"}
          </h2>
          <p className="text-muted-foreground">
            {userRole === "employee" 
              ? "View your assigned assets and request new ones"
              : userRole === "hr"
              ? "Manage asset requests and company inventory"
              : "Track and manage company assets across departments"
            }
          </p>
        </div>
        <div className="flex gap-2">
          {userRole !== "employee" && <AddAssetDialog />}
        </div>
      </div>


{/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4">
        {userRole === "employee" ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  My Assets
                </CardTitle>
                <AssetActionDialog userRole={userRole} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assets.filter(a => a.assignedTo === currentUser).length > 0 ? (
                  assets.filter(a => a.assignedTo === currentUser).map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(asset.status)}
                        <div>
                          <p className="font-medium">{asset.assetid}</p>
                          <p className="text-sm text-muted-foreground">{asset.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">${asset.value.toLocaleString()}</p>
                        <p className={`text-xs capitalize ${getConditionColor(asset.condition)}`}>{asset.condition}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No assets assigned to you yet</p>
                    <p className="text-sm">Check the Available tab to request assets</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Assets</p>
                    <p className="text-2xl font-bold text-green-600">{assetCounts.assigned}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Assets</p>
                    <p className="text-2xl font-bold text-blue-600">{assetCounts.unassigned}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Needs Maintenance</p>
                    <p className="text-2xl font-bold text-orange-600">{assetCounts.maintenance}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
          </div>
        )}
      </div>

      {/* My Assets Box for non-employee roles */}
      {userRole !== "employee" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              My Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assets.filter(a => a.assignedTo === currentUser).length > 0 ? (
                assets.filter(a => a.assignedTo === currentUser).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(asset.status)}
                      <div>
                        <p className="font-medium">{asset.assetid}</p>
                        <p className="text-sm text-muted-foreground">{asset.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono">${asset.value.toLocaleString()}</p>
                      <p className={`text-xs capitalize ${getConditionColor(asset.condition)}`}>{asset.condition}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No assets assigned to you yet</p>
                  <p className="text-sm">Check the Available tab to request assets</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search assets, categories, or assignees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: "all" | "assigned" | "unassigned" | "maintenance") => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${userRole === "employee" ? "grid-cols-5" : "grid-cols-4"}`}>
          <TabsTrigger value="assigned" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Assigned ({assetCounts.assigned})
          </TabsTrigger>
          <TabsTrigger value="unassigned" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Available ({assetCounts.unassigned})
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance ({assetCounts.maintenance})
          </TabsTrigger>
          {userRole === "employee" && (
            <TabsTrigger value="my-assets" className="flex items-center gap-2">
              <span className="h-4 w-4" />
              My Assets
            </TabsTrigger>
          )}
          <TabsTrigger value="overall" className="flex items-center gap-2">
            <span className="h-4 w-4" />
            Overall
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <Card key={asset.id} className="hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{asset.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{asset.category}</p>
                      </div>
                      {getStatusIcon(asset.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="font-medium">
                          {asset.assignedTo || "Unassigned"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Department:</span>
                        <span>{asset.department}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Value:</span>
                        <span className="font-mono">${asset.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Condition:</span>
                        <span className={`font-medium capitalize ${getConditionColor(asset.condition)}`}>
                         {asset.condition}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      {userRole === "employee" ? (
                        asset.status === "unassigned" ? (
                          <Button size="sm" variant="outline" className="flex-1">
                            Request Asset
                          </Button>
                        ) : asset.assignedTo === currentUser ? (
                          <Button size="sm" variant="outline" className="flex-1">
                            Report Issue
                          </Button>
                        ) : null
                      ) : (
                        <>
                          {asset.status === "maintenance" ? (
                            <Button size="sm" variant="outline" className="flex-1">
                              Mark Fixed
                            </Button>
                          ) : asset.status === "unassigned" ? (
                            <Button size="sm" variant="outline" className="flex-1">
                              Assign
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="flex-1">
                              Edit
                            </Button>
                          )}
                          {asset.status !== "maintenance" && (
                            <Button size="sm" variant="outline">
                              <Wrench className="h-3 w-3" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">Asset ID</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Assigned To</th>
                        <th className="text-left p-4 font-medium">Department</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Value</th>
                        <th className="text-left p-4 font-medium">Condition</th>
                        <th className="text-left p-4 font-medium">Purchase Date</th>
                        {userRole !== "employee" && (
                          <th className="text-left p-4 font-medium">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr key={asset.id} className="border-b hover:bg-muted/30">
                          <td className="p-4 font-medium">{asset.assetid}</td>
                          <td className="p-4 text-muted-foreground">{asset.category}</td>
                          <td className="p-4">{asset.assignedTo || "Unassigned"}</td>
                          <td className="p-4">{asset.department}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(asset.status)}
                              <span className="capitalize">{asset.status}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono">${asset.value.toLocaleString()}</td>
                          <td className="p-4">
                            <Badge variant="outline" className={getConditionColor(asset.condition)}>
                              {asset.condition}
                            </Badge>
                          </td>
                          <td className="p-4">{asset.purchaseDate}</td>
                          {userRole !== "employee" && (
                            <td className="p-4">
                              <div className="flex gap-2">
                                {asset.status === "maintenance" ? (
                                  <Button size="sm" variant="outline">Mark Fixed</Button>
                                ) : asset.status === "unassigned" ? (
                                  <Button size="sm" variant="outline">Assign</Button>
                                ) : (
                                  <Button size="sm" variant="outline">Edit</Button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

    </div>
  );
}
