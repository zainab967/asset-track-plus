import { API_ENDPOINTS, API_CONFIG } from "@/config/api";
import { AssetLogDto } from "@/types/api";

export const assetLogsApi = {
  async getAll(): Promise<AssetLogDto[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.ASSETS}/logs`, {
        method: 'GET',
        ...API_CONFIG,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch asset logs: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching asset logs:', error);
      
      // Return mock data for development
      return [
        {
          id: "1",
          name: "Dell Laptop",
          currentUser: "John Doe",
          assignDate: "2024-01-15T00:00:00Z",
          purchaseDate: "2023-12-01T00:00:00Z",
          purchasePrice: 1200,
          status: 1, // InUse
          location: "Office Floor 2",
          assignments: [
            {
              id: "a1",
              assetId: "1",
              assetName: "Dell Laptop",
              userId: "u1",
              userName: "John Doe",
              assignedDate: "2024-01-15T00:00:00Z",
              isActive: true,
              notes: "Assigned for software development work"
            },
            {
              id: "a2",
              assetId: "1",
              assetName: "Dell Laptop",
              userId: "u2",
              userName: "Jane Smith",
              assignedDate: "2023-12-05T00:00:00Z",
              returnedDate: "2024-01-10T00:00:00Z",
              isActive: false,
              notes: "Initial setup and testing"
            }
          ],
          maintenanceLogs: [
            {
              id: "m1",
              assetId: "1",
              maintenanceType: 0, // Preventive
              description: "Routine cleaning and software updates",
              cost: 50,
              performedBy: "tech1",
              performedByUser: "Tech Support",
              performedDate: "2024-02-01T00:00:00Z",
              nextScheduledDate: "2024-05-01T00:00:00Z",
              notes: "All systems running smoothly",
              createdAt: "2024-02-01T00:00:00Z"
            }
          ]
        },
        {
          id: "2",
          name: "HP Printer",
          currentUser: undefined,
          assignDate: undefined,
          purchaseDate: "2023-11-15T00:00:00Z",
          purchasePrice: 300,
          status: 0, // Available
          location: "Office Floor 1",
          assignments: [
            {
              id: "a3",
              assetId: "2",
              assetName: "HP Printer",
              userId: "u3",
              userName: "Bob Wilson",
              assignedDate: "2023-11-20T00:00:00Z",
              returnedDate: "2024-01-20T00:00:00Z",
              isActive: false,
              notes: "Used for department reports"
            }
          ],
          maintenanceLogs: [
            {
              id: "m2",
              assetId: "2",
              maintenanceType: 1, // Corrective
              description: "Fixed paper jam issue",
              cost: 25,
              performedBy: "tech2",
              performedByUser: "IT Support",
              performedDate: "2024-01-05T00:00:00Z",
              notes: "Replaced internal mechanism",
              createdAt: "2024-01-05T00:00:00Z"
            }
          ]
        }
      ];
    }
  }
};