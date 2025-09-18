import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MessageSquare, CreditCard } from "lucide-react";

interface UserProfilePageProps {
  userRole?: string;
}

export default function UserProfilePage({ userRole = "employee" }: UserProfilePageProps) {
  const { userId } = useParams();
  
  // Mock user data - in real app, fetch based on userId or current user
  const userData = {
    id: userId || "current-user",
    name: userId ? `User ${userId}` : "John Doe",
    role: "Employee",
    department: "IT",
    email: "john.doe@company.com",
    joinDate: "2023-01-15"
  };

  // Mock activity data
  const complaints = [
    {
      id: "1",
      title: "Air conditioning not working",
      status: "in-progress",
      date: "2024-01-20",
      building: "Etihad Office"
    },
    {
      id: "2", 
      title: "Laptop keyboard issue",
      status: "resolved",
      date: "2024-01-15",
      building: "Etihad Office"
    }
  ];

  const assetRequests = [
    {
      id: "1",
      name: "Standing Desk",
      status: "approved",
      date: "2024-01-18",
      category: "Furniture"
    },
    {
      id: "2",
      name: "External Monitor",
      status: "pending",
      date: "2024-01-22",
      category: "Electronics"
    }
  ];

  const currentAssets = [
    {
      id: "1",
      name: "MacBook Pro 16\"",
      assetId: "L-3232",
      assignedDate: "2023-06-15",
      condition: "excellent",
      building: "Etihad Office"
    },
    {
      id: "2",
      name: "Dell Monitor 27\"",
      assetId: "M-1145",
      assignedDate: "2023-06-15", 
      condition: "good",
      building: "Etihad Office"
    }
  ];

  const reimbursements = [
    {
      id: "1",
      name: "Office supplies",
      amount: 125.50,
      status: "approved",
      date: "2024-01-20"
    },
    {
      id: "2",
      name: "Travel expenses",
      amount: 450.00,
      status: "pending",
      date: "2024-01-22"
    },
    {
      id: "3",
      name: "Training course fees",
      amount: 350.00,
      status: "in-progress",
      date: "2024-01-25"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* User Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{userData.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{userData.role}</Badge>
                <Badge variant="outline">{userData.department}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">{userData.email}</p>
              <p className="text-sm text-muted-foreground">Joined: {userData.joinDate}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Activity Tabs */}
      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="complaints" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Complaints
          </TabsTrigger>
          <TabsTrigger value="asset-requests" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Asset Requests
          </TabsTrigger>
          <TabsTrigger value="current-assets" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Current Assets
          </TabsTrigger>
          <TabsTrigger value="reimbursements" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Reimbursements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <CardTitle>Complaints Lodged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{complaint.title}</h4>
                      <p className="text-sm text-muted-foreground">{complaint.building} • {complaint.date}</p>
                    </div>
                    <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asset-requests">
          <Card>
            <CardHeader>
              <CardTitle>Asset Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{request.name}</h4>
                      <p className="text-sm text-muted-foreground">{request.category} • {request.date}</p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current-assets">
          <Card>
            <CardHeader>
              <CardTitle>Current Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{asset.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {asset.assetId} • {asset.building} • Assigned: {asset.assignedDate}
                      </p>
                    </div>
                    <Badge variant="outline">{asset.condition}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reimbursements">
          <Card>
            <CardHeader>
              <CardTitle>Reimbursement Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reimbursements.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.amount.toFixed(2)} • {item.date}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}