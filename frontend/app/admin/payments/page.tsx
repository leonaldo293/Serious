'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageCircle,
  DollarSign,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react'

interface Payment {
  id: string
  orderId: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  currency: string
  method: 'paypal' | 'whatsapp' | 'manual'
  status: 'pending' | 'captured' | 'refunded' | 'failed'
  paypalOrderId?: string
  paypalPaymentId?: string
  whatsappNumber?: string
  whatsappMessage?: string
  createdAt: string
  capturedAt?: string
  refundedAt?: string
  description: string
  metadata?: Record<string, any>
}

interface Filters {
  search: string
  status: string
  method: string
  dateFrom: string
  dateTo: string
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    method: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const paymentsPerPage = 20

  useEffect(() => {
    fetchPayments()
  }, [currentPage, filters])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      
      // Mock API call - replace with actual API
      const mockPayments: Payment[] = [
        {
          id: '1',
          orderId: 'ORD-001',
          userId: 'user1',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          amount: 99.99,
          currency: 'USD',
          method: 'paypal',
          status: 'captured',
          paypalOrderId: 'PAYPAL-123',
          paypalPaymentId: 'PAYID-123',
          createdAt: '2024-03-20T10:30:00Z',
          capturedAt: '2024-03-20T10:35:00Z',
          description: 'Web Development Course'
        },
        {
          id: '2',
          orderId: 'ORD-002',
          userId: 'user2',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          amount: 149.99,
          currency: 'USD',
          method: 'whatsapp',
          status: 'pending',
          whatsappNumber: '+239 123 456 789',
          whatsappMessage: 'Payment for Mobile Apps Course',
          createdAt: '2024-03-19T15:45:00Z',
          description: 'Mobile Apps Course'
        },
        {
          id: '3',
          orderId: 'ORD-003',
          userId: 'user3',
          userName: 'Mike Johnson',
          userEmail: 'mike@example.com',
          amount: 79.99,
          currency: 'USD',
          method: 'paypal',
          status: 'refunded',
          paypalOrderId: 'PAYPAL-456',
          createdAt: '2024-03-18T09:15:00Z',
          capturedAt: '2024-03-18T09:20:00Z',
          refundedAt: '2024-03-19T14:30:00Z',
          description: 'Data Science Course'
        },
        {
          id: '4',
          orderId: 'ORD-004',
          userId: 'user4',
          userName: 'Sarah Wilson',
          userEmail: 'sarah@example.com',
          amount: 199.99,
          currency: 'USD',
          method: 'manual',
          status: 'captured',
          createdAt: '2024-03-17T16:20:00Z',
          capturedAt: '2024-03-17T16:25:00Z',
          description: 'UI/UX Design Course'
        },
        {
          id: '5',
          orderId: 'ORD-005',
          userId: 'user5',
          userName: 'David Brown',
          userEmail: 'david@example.com',
          amount: 129.99,
          currency: 'USD',
          method: 'paypal',
          status: 'failed',
          paypalOrderId: 'PAYPAL-789',
          createdAt: '2024-03-16T11:10:00Z',
          description: 'DevOps Course'
        }
      ]

      // Apply filters
      let filteredPayments = mockPayments
      
      if (filters.search) {
        filteredPayments = filteredPayments.filter(payment => 
          payment.orderId.toLowerCase().includes(filters.search.toLowerCase()) ||
          payment.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
          payment.userEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
          payment.description.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
      
      if (filters.status !== 'all') {
        filteredPayments = filteredPayments.filter(payment => payment.status === filters.status)
      }
      
      if (filters.method !== 'all') {
        filteredPayments = filteredPayments.filter(payment => payment.method === filters.method)
      }

      // Pagination
      const startIndex = (currentPage - 1) * paymentsPerPage
      const endIndex = startIndex + paymentsPerPage
      const paginatedPayments = filteredPayments.slice(startIndex, endIndex)
      
      setPayments(paginatedPayments)
      setTotalPages(Math.ceil(filteredPayments.length / paymentsPerPage))
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(payments.map(payment => payment.id))
    } else {
      setSelectedPayments([])
    }
  }

  const handleSelectPayment = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId])
    } else {
      setSelectedPayments(selectedPayments.filter(id => id !== paymentId))
    }
  }

  const handleCapturePayment = async (paymentId: string) => {
    try {
      // API call to capture payment
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'captured', capturedAt: new Date().toISOString() }
          : payment
      ))
    } catch (error) {
      console.error('Error capturing payment:', error)
    }
  }

  const handleRefundPayment = async (paymentId: string) => {
    if (confirm('Are you sure you want to refund this payment?')) {
      try {
        // API call to refund payment
        setPayments(payments.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'refunded', refundedAt: new Date().toISOString() }
            : payment
        ))
      } catch (error) {
        console.error('Error refunding payment:', error)
      }
    }
  }

  const handleWhatsAppPayment = async (orderId: string, amount: number, description: string) => {
    try {
      const message = `Hello! I'd like to make a payment for ${description} (Order: ${orderId}) - Amount: $${amount}. Please provide payment instructions.`
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/23939947819?text=${encodedMessage}`
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      console.error('Error opening WhatsApp:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      captured: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      refunded: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      failed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    const icons = {
      pending: <RefreshCw className="w-3 h-3 animate-spin" />,
      captured: <CheckCircle className="w-3 h-3" />,
      refunded: <XCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    )
  }

  const getMethodBadge = (method: string) => {
    const colors = {
      paypal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      whatsapp: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      manual: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
    const icons = {
      paypal: <CreditCard className="w-3 h-3" />,
      whatsapp: <MessageCircle className="w-3 h-3" />,
      manual: <DollarSign className="w-3 h-3" />
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[method as keyof typeof colors]}`}>
        {icons[method as keyof typeof icons]}
        {method}
      </span>
    )
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
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage transactions, PayPal payments, and WhatsApp orders
          </p>
        </div>
        <div className="flex space-x-3">
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
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4 mr-2" />
            Manual Payment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$6,589.95</p>
            </div>
            <div className="p-3 bg-african-gold rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$149.99</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Captured</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$5,309.97</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Refunded</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$79.99</p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  placeholder="Search payments..."
                />
              </div>
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
                <option value="pending">Pending</option>
                <option value="captured">Captured</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Method
              </label>
              <select
                value={filters.method}
                onChange={(e) => setFilters({...filters, method: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Methods</option>
                <option value="paypal">PayPal</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', status: 'all', method: 'all', dateFrom: '', dateTo: '' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payments ({payments.length})
            </h3>
            {selectedPayments.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPayments.length} selected
                </span>
                <button className="text-sm text-red-600 hover:text-red-700">
                  Refund Selected
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
                    checked={selectedPayments.length === payments.length && payments.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={(e) => handleSelectPayment(payment.id, e.target.checked)}
                      className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.orderId}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        {payment.userName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.userEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {payment.currency} {payment.amount}
                  </td>
                  <td className="px-6 py-4">
                    {getMethodBadge(payment.method)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {payment.method === 'whatsapp' && payment.status === 'pending' && (
                        <button
                          onClick={() => handleWhatsAppPayment(payment.orderId, payment.amount, payment.description)}
                          className="p-1 text-green-600 hover:text-green-700"
                          title="Open WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handleCapturePayment(payment.id)}
                          className="p-1 text-green-600 hover:text-green-700"
                          title="Capture Payment"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {(payment.status === 'captured' || payment.status === 'pending') && (
                        <button
                          onClick={() => handleRefundPayment(payment.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Refund Payment"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
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
              Showing {((currentPage - 1) * paymentsPerPage) + 1} to {Math.min(currentPage * paymentsPerPage, payments.length)} of {payments.length} results
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
    </div>
  )
}
