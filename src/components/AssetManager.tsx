import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Wrench, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { AddAssetDialog } from "./AddAssetDialog";

interface Asset {
  id: string;
  name: string;
  category: string;
  assignedTo: string | null;
  department: string;
  status: "assigned" | "unassigned" | "maintenance";
  value: number;
  purchaseDate: string;
  condition: "excellent" | "good" | "fair" | "poor";
}

interface AssetManagerProps {
  userRole?: "employee" | "hr" | "admin";
  currentUser?: string;
}

export function AssetManager({ userRole = "admin", currentUser = "Current User" }: AssetManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("assigned");

  const assets: Asset[] = [
    {
      id: "1",
      name: "MacBook Pro 16-inch",
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
      name: "Dell Monitor 27-inch",
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
      name: "Office Printer",
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
      name: "Conference Room TV",
      category: "Electronics",
      assignedTo: "Meeting Room A",
      department: "Operations",
      status: "maintenance",
      value: 899,
      purchaseDate: "2022-11-05",
      condition: "poor"
    }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === "all" || asset.department === departmentFilter;
    const matchesTab = asset.status === activeTab;
    
    // Filter based on user role
    let roleFilter = true;
    if (userRole === "employee") {
      roleFilter = asset.assignedTo === currentUser || asset.status === "unassigned";
    }
    
    return matchesSearch && matchesDepartment && matchesTab && roleFilter;
  });

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
            {userRole === "employee" ? "My Assets" : userRole === "hr" ? "HR Asset Management" : "Asset Manager"}
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
        {(userRole === "hr" || userRole === "admin") && <AddAssetDialog />}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userRole === "employee" ? (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">My Assets</p>
                    <p className="text-2xl font-bold text-green-600">
                      {assets.filter(a => a.assignedTo === currentUser).length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available to Request</p>
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
                    <p className="text-sm text-muted-foreground">My Pending Requests</p>
                    <p className="text-2xl font-bold text-orange-600">2</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
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
        )}
      </div>

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
          </div>
        </CardContent>
      </Card>

      {/* Assets Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
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
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
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
                    /<div className="flex justify-between text-sm">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}