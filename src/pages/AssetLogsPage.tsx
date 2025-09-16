import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AssetLogDetailsDialog } from "@/components/AssetLogDetailsDialog";
import { AssetLogDto, AssetStatus } from "@/types/api";
import { assetLogsApi } from "@/services/assetLogs";
import { formatCurrency } from "@/lib/currency";

interface AssetLogsPageProps {
  userRole?: "hr" | "admin" | "employee" | "manager";
}

const getStatusBadge = (status: AssetStatus) => {
  const statusMap = {
    [AssetStatus.Available]: { label: "Available", variant: "default" as const },
    [AssetStatus.InUse]: { label: "In Use", variant: "secondary" as const },
    [AssetStatus.UnderMaintenance]: { label: "Under Maintenance", variant: "destructive" as const },
    [AssetStatus.Retired]: { label: "Retired", variant: "outline" as const },
  };
  
  const { label, variant } = statusMap[status];
  return <Badge variant={variant}>{label}</Badge>;
};

export default function AssetLogsPage({ userRole = "admin" }: AssetLogsPageProps) {
  const [assetLogs, setAssetLogs] = useState<AssetLogDto[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetLogDto | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssetLogs();
  }, []);

  const fetchAssetLogs = async () => {
    try {
      setLoading(true);
      const data = await assetLogsApi.getAll();
      setAssetLogs(data);
    } catch (error) {
      console.error("Failed to fetch asset logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (asset: AssetLogDto) => {
    setSelectedAsset(asset);
    setDetailsDialogOpen(true);
  };

  return (
    <div className="flex-1">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Asset Logs</CardTitle>
            <CardDescription>
              View detailed asset assignment history and maintenance logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading asset logs...</div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Current User</TableHead>
                      <TableHead>Assign Date</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No asset logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      assetLogs.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.name}</TableCell>
                          <TableCell>{asset.currentUser || "Unassigned"}</TableCell>
                          <TableCell>
                            {asset.assignDate 
                              ? new Date(asset.assignDate).toLocaleDateString()
                              : "N/A"
                            }
                          </TableCell>
                          <TableCell>
                            {new Date(asset.purchaseDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{formatCurrency(asset.purchasePrice)}</TableCell>
                          <TableCell>{getStatusBadge(asset.status)}</TableCell>
                          <TableCell>{asset.location}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(asset)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedAsset && (
          <AssetLogDetailsDialog
            asset={selectedAsset}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
          />
        )}
      </div>
    </div>
  );
}