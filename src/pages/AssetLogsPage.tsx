import { useState, useEffect } from "react";
import { Eye, Search, Plus, Wrench, AlertTriangle, CheckCircle, Download, FileText, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { Table as TableIcon } from "lucide-react";

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

interface AssetLogsPageProps {
  userRole?: "hr" | "admin" | "employee" | "manager";
  currentUser?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "assigned": return <CheckCircle className="h-4 w-4 text-success" />;
    case "unassigned": return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "maintenance": return <Wrench className="h-4 w-4 text-destructive" />;
    default: return null;
  }
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "excellent": return "text-success";
    case "good": return "text-primary";
    case "fair": return "text-warning";
    case "poor": return "text-destructive";
    default: return "";
  }
};

export default function AssetLogsPage({ userRole = "admin", currentUser = "Current User" }: AssetLogsPageProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseText, setResponseText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockAssets: Asset[] = [
        {
          id: "1",
          name: "MacBook Pro 16\"",
          assetid: "l-3232",
          category: "Computer Equipment",
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
            }
          ]
        },
        {
          id: "2",
          name: "Dell XPS 15",
          assetid: "l-3233",
          category: "Computer Equipment",
          assignedTo: "Jane Smith",
          building: "Abdalian Office",
          status: "assigned",
          value: 1899,
          purchaseDate: "2023-05-10",
          condition: "good",
          description: "Laptop for design team"
        },
        {
          id: "3",
          name: "HP LaserJet Pro",
          assetid: "p-1001",
          category: "Electrical Appliances",
          assignedTo: null,
          building: "Etihad Office",
          status: "maintenance",
          value: 399,
          purchaseDate: "2022-11-22",
          condition: "fair",
          description: "Office printer - needs cartridge replacement"
        },
        {
          id: "4",
          name: "Conference Room Table",
          assetid: "f-2201",
          category: "Furniture and Fixtures",
          assignedTo: null,
          building: "Abdalian Office",
          status: "unassigned",
          value: 1200,
          purchaseDate: "2023-01-15",
          condition: "excellent",
          description: "Large conference table for meeting room"
        }
      ];
      setAssets(mockAssets);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailsDialogOpen(true);
  };
  
  const handleExportCSV = () => {
    if (filteredAssets.length === 0) {
      toast({
        title: "No Data",
        description: "No assets to export",
        variant: "destructive"
      });
      return;
    }

    // Define CSV headers
    const headers = ['Asset ID', 'Name', 'Category', 'Assigned To', 'Building', 'Status', 'Condition', 'Value', 'Purchase Date'];
    
    // Convert assets to CSV format
    const csvContent = [
      headers.join(','),
      ...filteredAssets.map(asset => [
        `"${asset.assetid}"`,
        `"${asset.name}"`,
        `"${asset.category}"`,
        `"${asset.assignedTo || ''}"`,
        `"${asset.building}"`,
        asset.status,
        asset.condition,
        asset.value,
        asset.purchaseDate
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `assets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `Exported ${filteredAssets.length} assets to CSV`,
    });
  };
  
  const handleExportExcel = () => {
    if (filteredAssets.length === 0) {
      toast({
        title: "No Data",
        description: "No assets to export",
        variant: "destructive"
      });
      return;
    }

    // Create XML content for Excel
    const headers = ['Asset ID', 'Name', 'Category', 'Assigned To', 'Building', 'Status', 'Condition', 'Value', 'Purchase Date'];
    
    let excelContent = '<table><tr>';
    headers.forEach(header => {
      excelContent += `<th>${header}</th>`;
    });
    excelContent += '</tr>';
    
    filteredAssets.forEach(asset => {
      excelContent += '<tr>';
      excelContent += `<td>${asset.assetid}</td>`;
      excelContent += `<td>${asset.name}</td>`;
      excelContent += `<td>${asset.category}</td>`;
      excelContent += `<td>${asset.assignedTo || ''}</td>`;
      excelContent += `<td>${asset.building}</td>`;
      excelContent += `<td>${asset.status}</td>`;
      excelContent += `<td>${asset.condition}</td>`;
      excelContent += `<td>${asset.value}</td>`;
      excelContent += `<td>${asset.purchaseDate}</td>`;
      excelContent += '</tr>';
    });
    
    excelContent += '</table>';
    
    // Create a data URI for the Excel file
    const excelBlob = new Blob(['\ufeff', excelContent], { type: 'application/vnd.ms-excel' });
    const excelUrl = URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = excelUrl;
    link.download = `assets_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(excelUrl);
    
    toast({
      title: "Success",
      description: `Exported ${filteredAssets.length} assets to Excel`,
    });
  };
  
  const handleExportPDF = async () => {
    if (filteredAssets.length === 0) {
      toast({
        title: "No Data",
        description: "No assets to export",
        variant: "destructive"
      });
      return;
    }

    // Using a simple HTML to PDF approach
    const headers = ['Asset ID', 'Name', 'Category', 'Assigned To', 'Building', 'Status', 'Condition', 'Value', 'Purchase Date'];
    
    // Create a printable HTML document
    let printContent = `
      <html>
      <head>
        <title>Asset Logs Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; font-weight: bold; }
          h1 { text-align: center; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Asset Logs Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <tr>
    `;
    
    headers.forEach(header => {
      printContent += `<th>${header}</th>`;
    });
    
    printContent += '</tr>';
    
    filteredAssets.forEach(asset => {
      printContent += '<tr>';
      printContent += `<td>${asset.assetid}</td>`;
      printContent += `<td>${asset.name}</td>`;
      printContent += `<td>${asset.category}</td>`;
      printContent += `<td>${asset.assignedTo || ''}</td>`;
      printContent += `<td>${asset.building}</td>`;
      printContent += `<td>${asset.status}</td>`;
      printContent += `<td>${asset.condition}</td>`;
      printContent += `<td>${formatCurrency(asset.value)}</td>`;
      printContent += `<td>${new Date(asset.purchaseDate).toLocaleDateString()}</td>`;
      printContent += '</tr>';
    });
    
    printContent += `
        </table>
        <div class="footer">
          Asset Track Plus - Asset Logs Report
        </div>
      </body>
      </html>
    `;
    
    // Open a new window and print to PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Let the page render before triggering print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      
      toast({
        title: "Success",
        description: `Prepared ${filteredAssets.length} assets for PDF export`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to open PDF preview. Please check your popup blocker settings.",
        variant: "destructive"
      });
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset.assignedTo?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesBuilding = buildingFilter === "all" || asset.building === buildingFilter;
    
    return matchesSearch && matchesBuilding;
  });

  return (
    <div className="flex-1">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 animate-fade-in">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  <SelectItem value="Etihad Office">Etihad Office</SelectItem>
                  <SelectItem value="Abdalian Office">Abdalian Office</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={filteredAssets.length === 0}
                      title="Export data"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuItem onClick={handleExportCSV}>
                      <FileText className="h-4 w-4 mr-2" />
                      <span>CSV</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportExcel}>
                      <TableIcon className="h-4 w-4 mr-2" />
                      <span>Excel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF}>
                      <FileType className="h-4 w-4 mr-2" />
                      <span>PDF</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading assets...</div>
              </div>
            ) : (
              <div className="rounded-md border">
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
                    {filteredAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                          No assets found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssets.map((asset) => (
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
                          <TableCell className="font-mono">{formatCurrency(asset.value)}</TableCell>
                          <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewDetails(asset)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
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

        {/* Asset Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
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
                    <p className="text-sm font-mono">{formatCurrency(selectedAsset.value)}</p>
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
              <textarea
                placeholder="Enter your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-[100px] w-full p-2 border rounded"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // TODO: Implement response handling
                setShowResponseDialog(false);
                setResponseText("");
              }}>
                Add Response
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}