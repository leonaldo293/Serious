import { api, handleResponse, handleError } from './api'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'message' | 'course' | 'payment' | 'announcement'
  read: boolean
  actionUrl?: string
  metadata?: Record<string, unknown>
  createdAt: string
  readAt?: string
}

class NotificationService {
  // Get all notifications for the current user
  async getAll(params?: { 
    page?: number 
    limit?: number 
    read?: boolean
    type?: string
  }): Promise<{
    notifications: Notification[]
    total: number
    unreadCount: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("NotificationService: Getting notifications with params:", params)
      const response = await api.get('/notifications', { params })
      console.log("NotificationService: Notifications response:", response.data)
      
      const data = response.data
      if (data && (data.notifications || data.data)) {
        return {
          notifications: data.notifications || data.data || [],
          total: data.total || 0,
          unreadCount: data.unreadCount || 0,
          page: data.page || 1,
          totalPages: data.totalPages || 1
        }
      } else {
        const notifications = Array.isArray(data) ? data : []
        return {
          notifications,
          total: notifications.length,
          unreadCount: notifications.filter((n: Notification) => !n.read).length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("NotificationService: Error getting notifications:", error)
      return handleError(error, { 
        notifications: [], 
        total: 0, 
        unreadCount: 0, 
        page: 1, 
        totalPages: 1 
      })
    }
  }

  // Get a single notification by ID
  async getById(id: string): Promise<Notification | null> {
    try {
      console.log("NotificationService: Getting notification by ID:", id)
      const response = await api.get(`/notifications/${id}`)
      console.log("NotificationService: Notification response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("NotificationService: Error getting notification:", error)
      return handleError(error, null)
    }
  }

  // Mark a notification as read
  async markAsRead(id: string): Promise<Notification> {
    try {
      console.log("NotificationService: Marking notification as read:", id)
      const response = await api.patch(`/notifications/${id}/read`)
      console.log("NotificationService: Notification marked as read:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("NotificationService: Error marking notification as read:", error)
      throw error
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ count: number }> {
    try {
      console.log("NotificationService: Marking all notifications as read")
      const response = await api.patch('/notifications/read-all')
      console.log("NotificationService: All notifications marked as read:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("NotificationService: Error marking all notifications as read:", error)
      throw error
    }
  }

  // Delete a notification
  async delete(id: string): Promise<void> {
    try {
      console.log("NotificationService: Deleting notification:", id)
      await api.delete(`/notifications/${id}`)
      console.log("NotificationService: Notification deleted:", id)
    } catch (error) {
      console.error("NotificationService: Error deleting notification:", error)
      throw error
    }
  }

  // Delete all read notifications
  async deleteAllRead(): Promise<{ count: number }> {
    try {
      console.log("NotificationService: Deleting all read notifications")
      const response = await api.delete('/notifications/read')
      console.log("NotificationService: All read notifications deleted:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("NotificationService: Error deleting read notifications:", error)
      throw error
    }
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<{ count: number }> {
    try {
      console.log("NotificationService: Getting unread notifications count")
      const response = await api.get('/notifications/unread-count')
      console.log("NotificationService: Unread count:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("NotificationService: Error getting unread count:", error)
      return handleError(error, { count: 0 })
    }
  }

  // Subscribe to real-time notifications
  subscribe(callback: (notification: Notification) => void): () => void {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll just log that this was called
    console.log("NotificationService: Subscribed to real-time notifications")
    
    // Return unsubscribe function
    return () => {
      console.log("NotificationService: Unsubscribed from real-time notifications")
    }
  }

  // Send a test notification (admin only)
  async sendTest(notification: {
    userId: string
    title: string
    message: string
    type?: string
    actionUrl?: string
  }): Promise<Notification> {
    try {
      console.log("NotificationService: Sending test notification:", notification)
      const response = await api.post('/notifications/test', notification)
      console.log("NotificationService: Test notification sent:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("NotificationService: Error sending test notification:", error)
      throw error
    }
  }
}

const notificationService = new NotificationService()
export default notificationService
