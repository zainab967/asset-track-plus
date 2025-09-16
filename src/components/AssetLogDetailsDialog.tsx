import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetLogDto, MaintenanceType } from "@/types/api";
import { formatCurrency } from "@/lib/currency";

interface AssetLogDetailsDialogProps {
  asset: AssetLogDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getMaintenanceTypeBadge = (type: MaintenanceType) => {
  const typeMap = {
    [MaintenanceType.Preventive]: { label: "Preventive", variant: "default" as const },
    [MaintenanceType.Corrective]: { label: "Corrective", variant: "secondary" as const },
    [MaintenanceType.Emergency]: { label: "Emergency", variant: "destructive" as const },
  };
  
  const { label, variant } = typeMap[type];
  return <Badge variant={variant}>{label}</Badge>;
};

export function AssetLogDetailsDialog({ 
  asset, 
  open, 
  onOpenChange 
}: AssetLogDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{asset.name} - Details</DialogTitle>
          <DialogDescription>
            View assignment history and maintenance logs for this asset
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asset Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current User</p>
                <p className="font-medium">{asset.currentUser || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purchase Date</p>
                <p className="font-medium">{new Date(asset.purchaseDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purchase Price</p>
                <p className="font-medium">{formatCurrency(asset.purchasePrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{asset.location}</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="assignments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assignments">Assignment History</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assignment History</CardTitle>
                  <CardDescription>
                    All users who have been assigned this asset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {asset.assignments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No assignment history found
                    </p>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Assigned Date</TableHead>
                            <TableHead>Returned Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {asset.assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                              <TableCell className="font-medium">
                                {assignment.userName}
                              </TableCell>
                              <TableCell>
                                {new Date(assignment.assignedDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {assignment.returnedDate 
                                  ? new Date(assignment.returnedDate).toLocaleDateString()
                                  : "Current"
                                }
                              </TableCell>
                              <TableCell>
                                <Badge variant={assignment.isActive ? "default" : "outline"}>
                                  {assignment.isActive ? "Active" : "Returned"}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {assignment.notes || "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maintenance History</CardTitle>
                  <CardDescription>
                    All maintenance activities performed on this asset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {asset.maintenanceLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No maintenance logs found
                    </p>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Performed By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Next Scheduled</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {asset.maintenanceLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                {getMaintenanceTypeBadge(log.maintenanceType)}
                              </TableCell>
                              <TableCell className="max-w-xs">
                                <div>
                                  <p className="font-medium">{log.description}</p>
                                  {log.notes && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {log.notes}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(log.cost)}</TableCell>
                              <TableCell>{log.performedByUser}</TableCell>
                              <TableCell>
                                {new Date(log.performedDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {log.nextScheduledDate 
                                  ? new Date(log.nextScheduledDate).toLocaleDateString()
                                  : "N/A"
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}