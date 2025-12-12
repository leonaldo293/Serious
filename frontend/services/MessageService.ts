import { api, handleResponse, handleError } from './api'

export interface User {
  id: string
  name: string
  avatar?: string
  email: string
  role: string
  status: 'online' | 'offline' | 'away' | 'busy'
  lastSeen?: string
}

export interface Message {
  id: string
  conversationId: string
  sender: User
  content: string
  type: 'text' | 'image' | 'file' | 'system'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  name?: string
  participants: User[]
  isGroup: boolean
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

class MessageService {
  // Get all conversations for the current user
  async getConversations(params?: { 
    page?: number 
    limit?: number 
    search?: string
  }): Promise<{
    conversations: Conversation[]
    total: number
    unreadCount: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("MessageService: Getting conversations with params:", params)
      const response = await api.get('/messages/conversations', { params })
      console.log("MessageService: Conversations response:", response.data)
      
      const data = response.data
      if (data && (data.conversations || data.data)) {
        return {
          conversations: data.conversations || data.data || [],
          total: data.total || 0,
          unreadCount: data.unreadCount || 0,
          page: data.page || 1,
          totalPages: data.totalPages || 1
        }
      } else {
        const conversations = Array.isArray(data) ? data : []
        return {
          conversations,
          total: conversations.length,
          unreadCount: conversations.reduce((count: number, conv: Conversation) => count + (conv.unreadCount || 0), 0),
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("MessageService: Error getting conversations:", error)
      return handleError(error, { 
        conversations: [], 
        total: 0, 
        unreadCount: 0, 
        page: 1, 
        totalPages: 1 
      })
    }
  }

  // Get a single conversation by ID
  async getConversation(conversationId: string, params?: {
    before?: string
    limit?: number
  }): Promise<{
    conversation: Conversation
    messages: Message[]
    hasMore: boolean
  }> {
    try {
      console.log("MessageService: Getting conversation:", conversationId, params)
      const response = await api.get(`/messages/conversations/${conversationId}`, { params })
      console.log("MessageService: Conversation response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MessageService: Error getting conversation:", error)
      return handleError(error, { 
        conversation: {} as Conversation, 
        messages: [], 
        hasMore: false 
      })
    }
  }

  // Create a new conversation
  async createConversation(participantIds: string[], name?: string): Promise<Conversation> {
    try {
      console.log("MessageService: Creating conversation:", { participantIds, name })
      const response = await api.post('/messages/conversations', { participantIds, name })
      console.log("MessageService: Conversation created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MessageService: Error creating conversation:", error)
      throw error
    }
  }

  // Update a conversation (e.g., change name, add/remove participants)
  async updateConversation(
    conversationId: string, 
    updates: {
      name?: string
      addParticipants?: string[]
      removeParticipants?: string[]
    }
  ): Promise<Conversation> {
    try {
      console.log("MessageService: Updating conversation:", conversationId, updates)
      const response = await api.patch(`/messages/conversations/${conversationId}`, updates)
      console.log("MessageService: Conversation updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MessageService: Error updating conversation:", error)
      throw error
    }
  }

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      console.log("MessageService: Deleting conversation:", conversationId)
      await api.delete(`/messages/conversations/${conversationId}`)
      console.log("MessageService: Conversation deleted:", conversationId)
    } catch (error) {
      console.error("MessageService: Error deleting conversation:", error)
      throw error
    }
  }

  // Send a message
  async sendMessage(
    conversationId: string, 
    content: string, 
    type: 'text' | 'image' | 'file' = 'text',
    metadata?: Record<string, unknown>
  ): Promise<Message> {
    try {
      console.log("MessageService: Sending message to conversation:", conversationId)
      const response = await api.post(`/messages/conversations/${conversationId}/messages`, {
        content,
        type,
        metadata
      })
      console.log("MessageService: Message sent:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MessageService: Error sending message:", error)
      throw error
    }
  }

  // Mark messages as read
  async markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
    try {
      console.log("MessageService: Marking messages as read:", { conversationId, messageIds })
      await api.patch(`/messages/conversations/${conversationId}/read`, { messageIds })
      console.log("MessageService: Messages marked as read:", messageIds)
    } catch (error) {
      console.error("MessageService: Error marking messages as read:", error)
      throw error
    }
  }

  // Get unread messages count
  async getUnreadCount(): Promise<{ count: number }> {
    try {
      console.log("MessageService: Getting unread messages count")
      const response = await api.get('/messages/unread-count')
      console.log("MessageService: Unread count:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MessageService: Error getting unread count:", error)
      return handleError(error, { count: 0 })
    }
  }

  // Search messages
  async search(query: string, params?: {
    page?: number
    limit?: number
    conversationId?: string
  }): Promise<{
    messages: Message[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("MessageService: Searching messages:", { query, ...params })
      const response = await api.get('/messages/search', { 
        params: { q: query, ...params } 
      })
      console.log("MessageService: Search results:", response.data)
      
      const data = response.data
      if (data && data.messages) {
        return data
      } else {
        return {
          messages: Array.isArray(data) ? data : [],
          total: data?.total || 0,
          page: data?.page || 1,
          totalPages: data?.totalPages || 1
        }
      }
    } catch (error) {
      console.error("MessageService: Error searching messages:", error)
      return handleError(error, { 
        messages: [], 
        total: 0, 
        page: 1, 
        totalPages: 1 
      })
    }
  }

  // Subscribe to real-time messages
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subscribe(conversationId: string, callback: (message: Message) => void): () => void {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll just log that this was called
    console.log(`MessageService: Subscribed to messages for conversation ${conversationId}`)
    
    // Return unsubscribe function
    return () => {
      console.log(`MessageService: Unsubscribed from messages for conversation ${conversationId}`)
    }
  }

  // Upload a file for a message
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<{
    url: string
    path: string
    mimeType: string
    size: number
    name: string
  }> {
    try {
      console.log("MessageService: Uploading file:", file.name)
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/messages/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        }
      })
      
      console.log("MessageService: File uploaded:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MessageService: Error uploading file:", error)
      throw error
    }
  }
}

const messageService = new MessageService()
export default messageService
