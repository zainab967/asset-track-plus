import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  relatedEntityType?: string;
  relatedEntityId?: string;
}): Promise<Notification> {
  const response = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
    method: 'POST',
    ...API_CONFIG,
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to create notification: ${response.statusText}`);
  }

  return response.json();
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/user/${userId}`, {
    method: 'GET',
    ...API_CONFIG
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
  }

  return response.json();
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`, {
    method: 'PUT',
    ...API_CONFIG
  });

  if (!response.ok) {
    throw new Error(`Failed to mark notification as read: ${response.statusText}`);
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/user/${userId}/read-all`, {
    method: 'PUT',
    ...API_CONFIG
  });

  if (!response.ok) {
    throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
  }
}