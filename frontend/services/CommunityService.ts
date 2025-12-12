import { api, handleResponse, handleError } from './api'

export interface CommunityPost {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  authorAvatar?: string
  category: string
  tags: string[]
  likes: number
  comments: number
  replies: number
  views: number
  status: 'published' | 'draft' | 'archived'
  featured: boolean
  isPinned: boolean
  isLocked: boolean
  createdAt: string
  updatedAt: string
}

export interface CommunityComment {
  id: string
  postId: string
  author: string
  authorId: string
  authorAvatar?: string
  content: string
  likes: number
  status: 'active' | 'hidden'
  createdAt: string
  updatedAt: string
}

class CommunityService {
  async getAll(params?: { page?: number; limit?: number; search?: string; category?: string; featured?: boolean }): Promise<{
    posts: CommunityPost[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("CommunityService: Getting posts with params:", params)
      const response = await api.get('/community', { params })
      console.log("CommunityService: Posts response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          posts: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.posts) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const posts = Array.isArray(data) ? data : []
        return {
          posts,
          total: posts.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("CommunityService: Error getting posts:", error)
      return handleError(error, { posts: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  async getById(id: string): Promise<CommunityPost | null> {
    try {
      console.log("CommunityService: Getting post by ID:", id)
      const response = await api.get(`/community/${id}`)
      console.log("CommunityService: Post response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("CommunityService: Error getting post:", error)
      return handleError(error, null)
    }
  }

  async create(postData: Partial<CommunityPost>): Promise<CommunityPost> {
    try {
      console.log("CommunityService: Creating post:", postData)
      const response = await api.post('/community', postData)
      console.log("CommunityService: Post created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("CommunityService: Error creating post:", error)
      throw error
    }
  }

  async update(id: string, postData: Partial<CommunityPost>): Promise<CommunityPost> {
    try {
      console.log("CommunityService: Updating post:", id, postData)
      const response = await api.patch(`/community/${id}`, postData)
      console.log("CommunityService: Post updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("CommunityService: Error updating post:", error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log("CommunityService: Deleting post:", id)
      await api.delete(`/community/${id}`)
      console.log("CommunityService: Post deleted:", id)
    } catch (error) {
      console.error("CommunityService: Error deleting post:", error)
      throw error
    }
  }

  // Comments
  async getComments(postId: string): Promise<CommunityComment[]> {
    try {
      console.log("CommunityService: Getting comments for post:", postId)
      const response = await api.get(`/community/${postId}/comments`)
      console.log("CommunityService: Comments response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("CommunityService: Error getting comments:", error)
      return handleError(error, [])
    }
  }

  async createComment(postId: string, commentData: Partial<CommunityComment>): Promise<CommunityComment> {
    try {
      console.log("CommunityService: Creating comment:", postId, commentData)
      const response = await api.post(`/community/${postId}/comments`, commentData)
      console.log("CommunityService: Comment created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("CommunityService: Error creating comment:", error)
      throw error
    }
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    try {
      console.log("CommunityService: Deleting comment:", postId, commentId)
      await api.delete(`/community/${postId}/comments/${commentId}`)
      console.log("CommunityService: Comment deleted:", commentId)
    } catch (error) {
      console.error("CommunityService: Error deleting comment:", error)
      throw error
    }
  }

  // Like/Unlike
  async likePost(postId: string): Promise<void> {
    try {
      console.log("CommunityService: Liking post:", postId)
      await api.post(`/community/${postId}/like`)
      console.log("CommunityService: Post liked:", postId)
    } catch (error) {
      console.error("CommunityService: Error liking post:", error)
      throw error
    }
  }

  async unlikePost(postId: string): Promise<void> {
    try {
      console.log("CommunityService: Unliking post:", postId)
      await api.delete(`/community/${postId}/like`)
      console.log("CommunityService: Post unliked:", postId)
    } catch (error) {
      console.error("CommunityService: Error unliking post:", error)
      throw error
    }
  }

  // Admin specific methods
  async adminGetAll(params?: { page?: number; limit?: number; search?: string; category?: string; status?: string }): Promise<{
    posts: CommunityPost[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("CommunityService: Getting admin posts with params:", params)
      const response = await api.get('/admin/community', { params })
      console.log("CommunityService: Admin posts response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          posts: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.posts) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const posts = Array.isArray(data) ? data : []
        return {
          posts,
          total: posts.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("CommunityService: Error getting admin posts:", error)
      return handleError(error, { posts: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  async adminCreate(postData: Partial<CommunityPost>): Promise<CommunityPost> {
    try {
      console.log("CommunityService: Creating admin post:", postData)
      const response = await api.post('/admin/community', postData)
      console.log("CommunityService: Admin post created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("CommunityService: Error creating admin post:", error)
      throw error
    }
  }

  async adminUpdate(id: string, postData: Partial<CommunityPost>): Promise<CommunityPost> {
    try {
      console.log("CommunityService: Updating admin post:", id, postData)
      const response = await api.patch(`/admin/community/${id}`, postData)
      console.log("CommunityService: Admin post updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("CommunityService: Error updating admin post:", error)
      throw error
    }
  }

  async adminDelete(id: string): Promise<void> {
    try {
      console.log("CommunityService: Deleting admin post:", id)
      await api.delete(`/admin/community/${id}`)
      console.log("CommunityService: Admin post deleted:", id)
    } catch (error) {
      console.error("CommunityService: Error deleting admin post:", error)
      throw error
    }
  }

  // Get featured posts
  async getFeaturedPosts(limit: number = 6): Promise<CommunityPost[]> {
    try {
      console.log("CommunityService: Getting featured posts")
      const response = await api.get('/community/featured', { params: { limit } })
      console.log("CommunityService: Featured posts response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("CommunityService: Error getting featured posts:", error)
      return handleError(error, [])
    }
  }

  // Get posts by category
  async getPostsByCategory(category: string, params?: { page?: number; limit?: number }): Promise<{
    posts: CommunityPost[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("CommunityService: Getting posts by category:", category, params)
      const response = await api.get(`/community/category/${category}`, { params })
      console.log("CommunityService: Category posts response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          posts: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.posts) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const posts = Array.isArray(data) ? data : []
        return {
          posts,
          total: posts.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("CommunityService: Error getting category posts:", error)
      return handleError(error, { posts: [], total: 0, page: 1, totalPages: 1 })
    }
  }
}

export default new CommunityService()
