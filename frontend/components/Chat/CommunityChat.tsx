'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { io, Socket } from 'socket.io-client'
import { 
  Send, 
  Users, 
  MessageCircle, 
  Search,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  User,
  Clock,
  Circle
} from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  senderRole: string
  chatRoomId: string
  type: 'text' | 'image' | 'file' | 'system'
  timestamp: string
  readBy: string[]
  replyTo?: string
  reactions?: {
    emoji: string
    users: string[]
  }[]
  attachments?: {
    type: 'image' | 'file'
    url: string
    filename: string
    size: number
  }[]
}

interface ChatRoom {
  id: string
  name: string
  description?: string
  type: 'public' | 'private' | 'direct'
  members: string[]
  admins: string[]
  lastMessage?: {
    content: string
    timestamp: string
    senderName: string
  }
  unreadCount: number
  isActive: boolean
  createdAt: string
}

interface UserStatus {
  userId: string
  status: 'online' | 'away' | 'offline'
  lastSeen?: string
}

export default function CommunityChat() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Socket.IO connection
  useEffect(() => {
    if (!user) return

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('accessToken'),
        userId: user.id
      }
    })

    newSocket.on('connect', () => {
      setConnected(true)
      console.log('Connected to chat server')
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
      console.log('Disconnected from chat server')
    })

    newSocket.on('chat_rooms', (rooms: ChatRoom[]) => {
      setChatRooms(rooms)
    })

    newSocket.on('messages', (roomMessages: Message[]) => {
      setMessages(roomMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()))
    })

    newSocket.on('new_message', (message: Message) => {
      if (currentRoom?.id === message.chatRoomId) {
        setMessages(prev => [...prev, message])
        scrollToBottom()
      }
      
      // Update unread counts
      if (message.senderId !== user.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.chatRoomId]: (prev[message.chatRoomId] || 0) + 1
        }))
      }
    })

    newSocket.on('message_read', (data: { messageId: string, userId: string }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, readBy: [...msg.readBy, data.userId] }
          : msg
      ))
    })

    newSocket.on('typing', (data: { userId: string, userName: string, roomId: string }) => {
      if (currentRoom?.id === data.roomId && data.userId !== user.id) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.userName), data.userName])
        
        // Remove typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== data.userName))
        }, 3000)
      }
    })

    newSocket.on('user_status', (statuses: UserStatus[]) => {
      setUserStatuses(statuses)
      setOnlineUsers(statuses.filter(s => s.status === 'online').map(s => s.userId))
    })

    newSocket.on('room_updated', (updatedRoom: ChatRoom) => {
      setChatRooms(prev => prev.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      ))
      
      if (currentRoom?.id === updatedRoom.id) {
        setCurrentRoom(updatedRoom)
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [user])

  // Join room when selected
  useEffect(() => {
    if (socket && currentRoom) {
      socket.emit('join_room', { roomId: currentRoom.id })
      setMessages([])
      socket.emit('get_messages', { roomId: currentRoom.id })
      
      // Mark messages as read
      socket.emit('mark_messages_read', { roomId: currentRoom.id })
      
      // Clear unread count
      setUnreadCounts(prev => ({ ...prev, [currentRoom.id]: 0 }))
    }
  }, [currentRoom, socket])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = useCallback(() => {
    if (!socket || !currentRoom || !messageInput.trim()) return

    const message: Partial<Message> = {
      content: messageInput.trim(),
      chatRoomId: currentRoom.id,
      type: 'text',
      timestamp: new Date().toISOString()
    }

    socket.emit('send_message', message)
    setMessageInput('')
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    socket.emit('stop_typing', { roomId: currentRoom.id })
  }, [socket, currentRoom, messageInput])

  const handleTyping = (text: string) => {
    setMessageInput(text)
    
    if (socket && currentRoom && text.length > 0) {
      socket.emit('typing', { roomId: currentRoom.id })
      
      // Stop typing after 1 second of inactivity
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { roomId: currentRoom.id })
      }, 1000)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !socket || !currentRoom) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const message: Partial<Message> = {
          content: file.name,
          chatRoomId: currentRoom.id,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          timestamp: new Date().toISOString(),
          attachments: [{
            type: file.type.startsWith('image/') ? 'image' : 'file',
            url: e.target?.result as string,
            filename: file.name,
            size: file.size
          }]
        }
        socket.emit('send_message', message)
      }
      reader.readAsDataURL(file)
    })
  }

  const addReaction = (messageId: string, emoji: string) => {
    if (!socket) return
    socket.emit('add_reaction', { messageId, emoji })
  }

  const markAsRead = (messageId: string) => {
    if (!socket) return
    socket.emit('mark_message_read', { messageId })
  }

  const getUserStatus = (userId: string) => {
    const status = userStatuses.find(s => s.userId === userId)
    return status?.status || 'offline'
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    
    return date.toLocaleDateString()
  }

  const filteredRooms = chatRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '💯', '🤔', '👏', '🙏']

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Please login to access chat</p>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar - Chat Rooms */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Community Chat</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Online Users */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Online</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{onlineUsers.length}</span>
          </div>
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 8).map((userId) => (
              <div key={userId} className="w-8 h-8 bg-african-gold rounded-full flex items-center justify-center text-deep-charcoal text-xs font-bold border-2 border-white dark:border-gray-800">
                {userId.charAt(0).toUpperCase()}
              </div>
            ))}
            {onlineUsers.length > 8 && (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-bold border-2 border-white dark:border-gray-800">
                +{onlineUsers.length - 8}
              </div>
            )}
          </div>
        </div>

        {/* Chat Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setCurrentRoom(room)}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                currentRoom?.id === room.id ? 'bg-african-gold/10 border-l-4 border-l-african-gold' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {room.name}
                    </h3>
                    {room.unreadCount > 0 && (
                      <span className="bg-african-gold text-deep-charcoal text-xs px-2 py-1 rounded-full">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                  {room.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                      {room.description}
                    </p>
                  )}
                  {room.lastMessage && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {room.lastMessage.senderName}: {room.lastMessage.content}
                      </p>
                      <span className="text-xs text-gray-400 ml-2">
                        {formatTimestamp(room.lastMessage.timestamp)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {currentRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentRoom.name}
                </h3>
                {currentRoom.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentRoom.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.senderId === user.id ? 'order-2' : 'order-1'}`}>
                  {message.senderId !== user.id && (
                    <div className="flex items-center mb-1">
                      <div className="w-6 h-6 bg-african-gold rounded-full flex items-center justify-center text-deep-charcoal text-xs font-bold mr-2">
                        {message.senderName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {message.senderName}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.senderId === user.id
                        ? 'bg-african-gold text-deep-charcoal'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.type === 'text' && (
                      <p className="text-sm">{message.content}</p>
                    )}
                    
                    {message.type === 'image' && message.attachments && (
                      <div>
                        <img 
                          src={message.attachments[0].url} 
                          alt={message.attachments[0].filename}
                          className="rounded-lg max-w-full"
                        />
                        <p className="text-xs mt-1">{message.attachments[0].filename}</p>
                      </div>
                    )}
                    
                    {message.type === 'file' && message.attachments && (
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">{message.attachments[0].filename}</span>
                      </div>
                    )}
                    
                    {/* Read receipts */}
                    {message.senderId === user.id && (
                      <div className="flex items-center justify-end mt-1">
                        {message.readBy.length > 0 ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {message.reactions.map((reaction, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => addReaction(message.id, reaction.emoji)}
                        >
                          {reaction.emoji} {reaction.users.length}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex space-x-1">
                  <Circle className="w-2 h-2 animate-bounce" />
                  <Circle className="w-2 h-2 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <Circle className="w-2 h-2 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Smile className="w-5 h-5" />
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1">
                    {commonEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setMessageInput(prev => prev + emoji)
                          setShowEmojiPicker(false)
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <input
                type="text"
                value={messageInput}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              />
              
              <button
                onClick={sendMessage}
                disabled={!messageInput.trim()}
                className="p-2 bg-african-gold text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a chat room
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a room from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
