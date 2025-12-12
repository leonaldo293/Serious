'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  Video,
  Users,
  MapPin,
  Bell,
  Share2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  CalendarRange,
  FileText,
  GraduationCap,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Repeat,
  Link,
  ExternalLink
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description: string
  type: 'class' | 'meeting' | 'workshop' | 'webinar' | 'deadline' | 'holiday' | 'office_hours'
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  allDay: boolean
  location?: string
  virtual?: {
    platform: 'zoom' | 'teams' | 'meet' | 'skype'
    url: string
    meetingId?: string
    password?: string
  }
  attendees: {
    id: string
    name: string
    email: string
    role: string
    status: 'accepted' | 'declined' | 'tentative' | 'pending'
  }[]
  organizer: {
    id: string
    name: string
    email: string
  }
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
    days?: number[]
  }
  reminders: {
    type: 'email' | 'push' | 'popup'
    minutesBefore: number
  }[]
  attachments: string[]
  tags: string[]
  visibility: 'public' | 'private' | 'team'
  createdAt: string
  updatedAt: string
}

interface Filters {
  search: string
  type: string
  status: string
  organizer: string
  dateFrom: string
  dateTo: string
  tags: string[]
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: 'all',
    status: 'all',
    organizer: 'all',
    dateFrom: '',
    dateTo: '',
    tags: []
  })

  const eventsPerPage = 20

  useEffect(() => {
    fetchEvents()
  }, [currentPage, filters, viewMode, currentDate])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      
      // Mock API calls - replace with actual API
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'React 18 New Features Workshop',
          description: 'Deep dive into React 18 concurrent features and best practices',
          type: 'workshop',
          status: 'scheduled',
          startDate: '2024-03-25T14:00:00Z',
          endDate: '2024-03-25T16:00:00Z',
          allDay: false,
          location: 'Virtual - Zoom',
          virtual: {
            platform: 'zoom',
            url: 'https://zoom.us/j/123456789',
            meetingId: '123456789',
            password: 'react2024'
          },
          attendees: [
            { id: '1', name: 'John Smith', email: 'john@example.com', role: 'mentor', status: 'accepted' },
            { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'mentor', status: 'accepted' },
            { id: '3', name: 'Ana Silva', email: 'ana@example.com', role: 'student', status: 'accepted' },
            { id: '4', name: 'Carlos Mendes', email: 'carlos@example.com', role: 'student', status: 'tentative' }
          ],
          organizer: {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com'
          },
          reminders: [
            { type: 'email', minutesBefore: 60 },
            { type: 'popup', minutesBefore: 15 }
          ],
          attachments: ['react-18-slides.pdf', 'workshop-exercises.zip'],
          tags: ['react', 'workshop', 'frontend'],
          visibility: 'public',
          createdAt: '2024-03-10T10:30:00Z',
          updatedAt: '2024-03-20T14:15:00Z'
        },
        {
          id: '2',
          title: 'Mobile App Development Class',
          description: 'Weekly class for React Native course students',
          type: 'class',
          status: 'scheduled',
          startDate: '2024-03-26T10:00:00Z',
          endDate: '2024-03-26T12:00:00Z',
          allDay: false,
          location: 'Room 201, Building A',
          attendees: [
            { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'mentor', status: 'accepted' },
            { id: '5', name: 'Maria Santos', email: 'maria@example.com', role: 'student', status: 'accepted' },
            { id: '6', name: 'João Costa', email: 'joao@example.com', role: 'student', status: 'accepted' }
          ],
          organizer: {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com'
          },
          recurrence: {
            type: 'weekly',
            interval: 1,
            days: [2] // Tuesday
          },
          reminders: [
            { type: 'email', minutesBefore: 1440 },
            { type: 'push', minutesBefore: 30 }
          ],
          attachments: ['mobile-dev-notes.pdf'],
          tags: ['mobile', 'react-native', 'class'],
          visibility: 'team',
          createdAt: '2024-03-01T09:15:00Z',
          updatedAt: '2024-03-15T11:30:00Z'
        },
        {
          id: '3',
          title: 'Data Science Project Deadline',
          description: 'Final project submission for Data Science Fundamentals course',
          type: 'deadline',
          status: 'scheduled',
          startDate: '2024-03-30T23:59:00Z',
          endDate: '2024-03-30T23:59:00Z',
          allDay: true,
          attendees: [
            { id: '3', name: 'Dr. Michael Chen', email: 'michael@example.com', role: 'mentor', status: 'accepted' },
            { id: '7', name: 'Pedro Ferreira', email: 'pedro@example.com', role: 'student', status: 'pending' },
            { id: '8', name: 'Lucia Oliveira', email: 'lucia@example.com', role: 'student', status: 'pending' }
          ],
          organizer: {
            id: '3',
            name: 'Dr. Michael Chen',
            email: 'michael@example.com'
          },
          reminders: [
            { type: 'email', minutesBefore: 2880 },
            { type: 'email', minutesBefore: 1440 },
            { type: 'push', minutesBefore: 60 }
          ],
          attachments: ['project-requirements.pdf', 'grading-rubric.pdf'],
          tags: ['data-science', 'deadline', 'project'],
          visibility: 'public',
          createdAt: '2024-03-05T13:20:00Z',
          updatedAt: '2024-03-20T09:45:00Z'
        },
        {
          id: '4',
          title: 'Team Meeting - Q2 Planning',
          description: 'Quarterly planning meeting for all mentors and admin staff',
          type: 'meeting',
          status: 'scheduled',
          startDate: '2024-03-27T15:00:00Z',
          endDate: '2024-03-27T17:00:00Z',
          allDay: false,
          location: 'Conference Room B',
          attendees: [
            { id: 'admin1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'accepted' },
            { id: '1', name: 'John Smith', email: 'john@example.com', role: 'mentor', status: 'accepted' },
            { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'mentor', status: 'tentative' },
            { id: '3', name: 'Dr. Michael Chen', email: 'michael@example.com', role: 'mentor', status: 'accepted' }
          ],
          organizer: {
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@example.com'
          },
          reminders: [
            { type: 'email', minutesBefore: 1440 },
            { type: 'popup', minutesBefore: 15 }
          ],
          attachments: ['q2-agenda.pdf', 'planning-template.docx'],
          tags: ['meeting', 'planning', 'quarterly'],
          visibility: 'team',
          createdAt: '2024-03-15T10:00:00Z',
          updatedAt: '2024-03-20T16:30:00Z'
        },
        {
          id: '5',
          title: 'UI/UX Design Webinar',
          description: 'Free webinar on modern UI/UX design principles',
          type: 'webinar',
          status: 'completed',
          startDate: '2024-03-20T18:00:00Z',
          endDate: '2024-03-20T19:30:00Z',
          allDay: false,
          location: 'Virtual - YouTube Live',
          virtual: {
            platform: 'meet',
            url: 'https://youtube.com/live/webinar123'
          },
          attendees: [
            { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'mentor', status: 'accepted' },
            { id: '9', name: 'Roberto Silva', email: 'roberto@example.com', role: 'student', status: 'accepted' },
            { id: '10', name: 'Ana Costa', email: 'ana.costa@example.com', role: 'student', status: 'accepted' }
          ],
          organizer: {
            id: '4',
            name: 'Emily Davis',
            email: 'emily@example.com'
          },
          reminders: [
            { type: 'email', minutesBefore: 1440 },
            { type: 'push', minutesBefore: 30 }
          ],
          attachments: ['webinar-slides.pdf'],
          tags: ['design', 'webinar', 'ui', 'ux'],
          visibility: 'public',
          createdAt: '2024-03-10T14:20:00Z',
          updatedAt: '2024-03-20T19:30:00Z'
        }
      ]

      // Apply filters
      let filteredEvents = mockEvents
      
      if (filters.search) {
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
        )
      }
      
      if (filters.type !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.type === filters.type)
      }
      
      if (filters.status !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.status === filters.status)
      }
      
      if (filters.organizer !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.organizer.name === filters.organizer)
      }
      
      if (filters.tags.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filters.tags.some(tag => event.tags.includes(tag))
        )
      }

      // Date filtering
      if (filters.dateFrom) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.startDate) >= new Date(filters.dateFrom)
        )
      }
      
      if (filters.dateTo) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.startDate) <= new Date(filters.dateTo)
        )
      }

      // Pagination for list view
      if (viewMode === 'list') {
        const startIndex = (currentPage - 1) * eventsPerPage
        const endIndex = startIndex + eventsPerPage
        const paginatedEvents = filteredEvents.slice(startIndex, endIndex)
        setEvents(paginatedEvents)
        setTotalPages(Math.ceil(filteredEvents.length / eventsPerPage))
      } else {
        setEvents(filteredEvents)
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEvents(events.map(event => event.id))
    } else {
      setSelectedEvents([])
    }
  }

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId])
    } else {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId))
    }
  }

  const handleExportICS = () => {
    // Generate ICS file
    const icsContent = generateICS(events.filter(event => selectedEvents.includes(event.id)))
    downloadICS(icsContent, 'calendar-events.ics')
  }

  const generateICS = (eventsToExport: CalendarEvent[]) => {
    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ELTx HUB//Calendar//EN\r\nCALSCALE:GREGORIAN\r\n'
    
    eventsToExport.forEach(event => {
      ics += 'BEGIN:VEVENT\r\n'
      ics += `UID:${event.id}\r\n`
      ics += `DTSTART:${formatDateForICS(event.startDate)}\r\n`
      ics += `DTEND:${formatDateForICS(event.endDate)}\r\n`
      ics += `SUMMARY:${event.title}\r\n`
      ics += `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\r\n`
      
      if (event.location) {
        ics += `LOCATION:${event.location}\r\n`
      }
      
      if (event.virtual?.url) {
        ics += `URL:${event.virtual.url}\r\n`
      }
      
      ics += `STATUS:${event.status.toUpperCase()}\r\n`
      ics += `CREATED:${formatDateForICS(event.createdAt)}\r\n`
      ics += `LAST-MODIFIED:${formatDateForICS(event.updatedAt)}\r\n`
      
      if (event.recurrence) {
        ics += 'RRULE:'
        switch (event.recurrence.type) {
          case 'daily':
            ics += `FREQ=DAILY;INTERVAL=${event.recurrence.interval}`
            break
          case 'weekly':
            ics += `FREQ=WEEKLY;INTERVAL=${event.recurrence.interval}`
            if (event.recurrence.days && event.recurrence.days.length > 0) {
              ics += ';BYDAY=' + event.recurrence.days.map(day => ['SU','MO','TU','WE','TH','FR','SA'][day]).join(',')
            }
            break
          case 'monthly':
            ics += `FREQ=MONTHLY;INTERVAL=${event.recurrence.interval}`
            break
          case 'yearly':
            ics += `FREQ=YEARLY;INTERVAL=${event.recurrence.interval}`
            break
        }
        if (event.recurrence.endDate) {
          ics += `;UNTIL=${formatDateForICS(event.recurrence.endDate)}`
        }
        ics += '\r\n'
      }
      
      ics += 'END:VEVENT\r\n'
    })
    
    ics += 'END:VCALENDAR'
    return ics
  }

  const formatDateForICS = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  }

  const downloadICS = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      meeting: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      workshop: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      webinar: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      deadline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      holiday: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      office_hours: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    }
    const icons = {
      class: <GraduationCap className="w-3 h-3" />,
      meeting: <Users className="w-3 h-3" />,
      workshop: <CalendarDays className="w-3 h-3" />,
      webinar: <Video className="w-3 h-3" />,
      deadline: <Clock className="w-3 h-3" />,
      holiday: <CalendarIcon className="w-3 h-3" />,
      office_hours: <MessageCircle className="w-3 h-3" />
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
        {icons[type as keyof typeof icons]}
        {type.replace('_', ' ')}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      ongoing: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      completed: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      cancelled: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
    }
    const icons = {
      scheduled: <Clock className="w-3 h-3" />,
      ongoing: <AlertCircle className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    if (!date) return []
    return events.filter(event => {
      const eventDate = new Date(event.startDate)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar & Events</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage events, classes, workshops, and deadlines
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
              showFilters 
                ? 'border-african-gold text-african-gold bg-african-gold/10' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          <button
            onClick={handleExportICS}
            disabled={selectedEvents.length === 0}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export ICS
          </button>
          
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewMode === 'month'
                ? 'bg-african-gold text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewMode === 'week'
                ? 'bg-african-gold text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewMode === 'day'
                ? 'bg-african-gold text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-sm ${
              viewMode === 'list'
                ? 'bg-african-gold text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            List
          </button>
        </div>
        
        {viewMode === 'month' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedEvents.length > 0 && `${selectedEvents.length} selected`}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  placeholder="Search events..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="class">Class</option>
                <option value="meeting">Meeting</option>
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="deadline">Deadline</option>
                <option value="holiday">Holiday</option>
                <option value="office_hours">Office Hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organizer
              </label>
              <select
                value={filters.organizer}
                onChange={(e) => setFilters({...filters, organizer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Organizers</option>
                <option value="John Smith">John Smith</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                <option value="Emily Davis">Emily Davis</option>
                <option value="Admin User">Admin User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', type: 'all', status: 'all', organizer: 'all', dateFrom: '', dateTo: '', tags: [] })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 dark:bg-gray-900 p-2 text-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayEvents = date ? getEventsForDate(date) : []
              const isToday = date && date.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 p-2 min-h-[100px] ${
                    isToday ? 'ring-2 ring-african-gold' : ''
                  }`}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-african-gold' : 'text-gray-900 dark:text-white'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="text-xs p-1 rounded bg-african-gold/10 text-african-gold truncate cursor-pointer hover:bg-african-gold/20"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Events ({events.length})
              </h3>
              {selectedEvents.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedEvents.length} selected
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Bulk Edit
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEvents.length === events.length && events.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={(e) => handleSelectEvent(event.id, e.target.checked)}
                        className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {event.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {getTypeBadge(event.type)}
                          {event.recurrence && (
                            <span className="text-xs text-gray-400">
                              <Repeat className="w-3 h-3 inline mr-1" />
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getTypeBadge(event.type)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>{formatDate(event.startDate)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {event.allDay ? 'All day' : `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        {event.virtual ? (
                          <>
                            <Video className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="truncate">{event.virtual.platform}</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="truncate">{event.location || 'TBD'}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {event.attendees.length}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        {event.virtual?.url && (
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((currentPage - 1) * eventsPerPage) + 1} to {Math.min(currentPage * eventsPerPage, events.length)} of {events.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week View (Placeholder) */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Week view coming soon...
          </div>
        </div>
      )}

      {/* Day View (Placeholder) */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Day view coming soon...
          </div>
        </div>
      )}
    </div>
  )
}
