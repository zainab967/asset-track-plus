import { useState } from 'react';
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface UseReimbursementStatus {
  showRejectDialog: boolean;
  setShowRejectDialog: (show: boolean) => void;
  selectedReimbursement: any | null;
  setSelectedReimbursement: (reimbursement: any | null) => void;
  handleStatusChange: (id: string, newStatus: "approved" | "rejected", rejectionReason?: string) => Promise<void>;
}

export function useReimbursementStatus(reimbursements: any[], setReimbursements: (reimbursements: any[]) => void): UseReimbursementStatus {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState<any | null>(null);
  const { toast } = useToast();

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected", rejectionReason?: string) => {
    try {
      const reimbursement = reimbursements.find(r => r.id === id);
      if (!reimbursement) throw new Error("Reimbursement not found");

      const response = await fetch(`${API_ENDPOINTS.REIMBURSEMENTS}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...API_CONFIG.headers
        },
        body: JSON.stringify({ 
          status: newStatus,
          rejectionReason: rejectionReason 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update status (HTTP ${response.status})`);
      }

      // Update local state
      setReimbursements((prev: any[]) =>
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );

      // Create notification for rejection
      if (newStatus === "rejected" && rejectionReason) {
        await fetch(`${API_ENDPOINTS.NOTIFICATIONS}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...API_CONFIG.headers
          },
          body: JSON.stringify({
            userId: reimbursement.user,
            type: 'reimbursement_rejected',
            title: 'Reimbursement Rejected',
            message: `Your reimbursement request "${reimbursement.name}" was rejected. Reason: ${rejectionReason}`,
            link: `/reimbursements/${id}`
          })
        });
      }

      toast({
        title: "Success",
        description: `Reimbursement ${newStatus.toLowerCase()} successfully`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return {
    showRejectDialog,
    setShowRejectDialog,
    selectedReimbursement,
    setSelectedReimbursement,
    handleStatusChange
  };
}