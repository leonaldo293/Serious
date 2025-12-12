import { api, handleResponse, handleError } from './api'

export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip' | 'paypal' | 'other'
  last4?: string
  brand?: string
  isDefault: boolean
  expiresAt?: string
  createdAt: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded'
  clientSecret?: string
  paymentMethod?: string
  paymentMethodTypes: string[]
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  number: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void' | 'deleted'
  dueDate?: string
  paidAt?: string
  paymentIntent?: string
  items: Array<{
    id: string
    description: string
    amount: number
    quantity: number
    type: 'course' | 'program' | 'subscription' | 'other'
    referenceId: string
  }>
  customer: {
    id: string
    name: string
    email: string
    taxId?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'all' | 'ended'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  plan: {
    id: string
    name: string
    amount: number
    currency: string
    interval: 'day' | 'week' | 'month' | 'year'
    intervalCount: number
  }
  items: Array<{
    id: string
    price: {
      id: string
      amount: number
      currency: string
    }
    quantity: number
  }>
  defaultPaymentMethod?: string
  latestInvoice?: string
  trialEnd?: string
  createdAt: string
  updatedAt: string
}

class PaymentService {
  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      console.log("PaymentService: Getting payment methods")
      const response = await api.get('/payments/methods')
      console.log("PaymentService: Payment methods response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error getting payment methods:", error)
      return handleError(error, [])
    }
  }

  async addPaymentMethod(paymentMethodData: {
    type: string
    token: string
    isDefault?: boolean
  }): Promise<PaymentMethod> {
    try {
      console.log("PaymentService: Adding payment method:", paymentMethodData)
      const response = await api.post('/payments/methods', paymentMethodData)
      console.log("PaymentService: Payment method added:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error adding payment method:", error)
      throw error
    }
  }

  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      console.log("PaymentService: Removing payment method:", paymentMethodId)
      await api.delete(`/payments/methods/${paymentMethodId}`)
      console.log("PaymentService: Payment method removed:", paymentMethodId)
    } catch (error) {
      console.error("PaymentService: Error removing payment method:", error)
      throw error
    }
  }

  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      console.log("PaymentService: Setting default payment method:", paymentMethodId)
      await api.patch(`/payments/methods/${paymentMethodId}/default`)
      console.log("PaymentService: Default payment method set:", paymentMethodId)
    } catch (error) {
      console.error("PaymentService: Error setting default payment method:", error)
      throw error
    }
  }

  // Payment Intents
  async createPaymentIntent(amount: number, currency: string, metadata: Record<string, any> = {}): Promise<PaymentIntent> {
    try {
      console.log("PaymentService: Creating payment intent:", { amount, currency, metadata })
      const response = await api.post('/payments/intents', { amount, currency, metadata })
      console.log("PaymentService: Payment intent created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error creating payment intent:", error)
      throw error
    }
  }

  async confirmPayment(intentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    try {
      console.log("PaymentService: Confirming payment:", { intentId, paymentMethodId })
      const response = await api.post(`/payments/intents/${intentId}/confirm`, { paymentMethodId })
      console.log("PaymentService: Payment confirmed:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error confirming payment:", error)
      throw error
    }
  }

  async getPaymentIntent(intentId: string): Promise<PaymentIntent> {
    try {
      console.log("PaymentService: Getting payment intent:", intentId)
      const response = await api.get(`/payments/intents/${intentId}`)
      console.log("PaymentService: Payment intent retrieved:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error getting payment intent:", error)
      throw error
    }
  }

  // Invoices
  async getInvoices(params?: { 
    limit?: number 
    startingAfter?: string
    endingBefore?: string
  }): Promise<{
    data: Invoice[]
    hasMore: boolean
  }> {
    try {
      console.log("PaymentService: Getting invoices:", params)
      const response = await api.get('/payments/invoices', { params })
      console.log("PaymentService: Invoices retrieved:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error getting invoices:", error)
      return handleError(error, { data: [], hasMore: false })
    }
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    try {
      console.log("PaymentService: Getting invoice:", invoiceId)
      const response = await api.get(`/payments/invoices/${invoiceId}`)
      console.log("PaymentService: Invoice retrieved:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error getting invoice:", error)
      throw error
    }
  }

  async downloadInvoice(invoiceId: string): Promise<{ url: string }> {
    try {
      console.log("PaymentService: Downloading invoice:", invoiceId)
      const response = await api.get(`/payments/invoices/${invoiceId}/download`)
      console.log("PaymentService: Invoice download URL retrieved:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error downloading invoice:", error)
      throw error
    }
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      console.log("PaymentService: Getting subscriptions")
      const response = await api.get('/payments/subscriptions')
      console.log("PaymentService: Subscriptions retrieved:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error getting subscriptions:", error)
      return handleError(error, [])
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      console.log("PaymentService: Getting subscription:", subscriptionId)
      const response = await api.get(`/payments/subscriptions/${subscriptionId}`)
      console.log("PaymentService: Subscription retrieved:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error getting subscription:", error)
      throw error
    }
  }

  async createSubscription(priceId: string, paymentMethodId?: string): Promise<Subscription> {
    try {
      console.log("PaymentService: Creating subscription:", { priceId, paymentMethodId })
      const response = await api.post('/payments/subscriptions', { priceId, paymentMethodId })
      console.log("PaymentService: Subscription created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error creating subscription:", error)
      throw error
    }
  }

  async updateSubscription(subscriptionId: string, updates: {
    paymentMethodId?: string
    priceId?: string
    quantity?: number
    cancelAtPeriodEnd?: boolean
  }): Promise<Subscription> {
    try {
      console.log("PaymentService: Updating subscription:", { subscriptionId, updates })
      const response = await api.patch(`/payments/subscriptions/${subscriptionId}`, updates)
      console.log("PaymentService: Subscription updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error updating subscription:", error)
      throw error
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<Subscription> {
    try {
      console.log("PaymentService: Canceling subscription:", { subscriptionId, cancelAtPeriodEnd })
      const response = await api.delete(`/payments/subscriptions/${subscriptionId}`, {
        data: { cancelAtPeriodEnd }
      })
      console.log("PaymentService: Subscription canceled:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error canceling subscription:", error)
      throw error
    }
  }

  // Coupons & Promo Codes
  async validateCoupon(code: string): Promise<{
    valid: boolean
    id?: string
    amountOff?: number
    percentOff?: number
    duration: 'forever' | 'once' | 'repeating'
    durationInMonths?: number
    name?: string
    metadata?: Record<string, unknown>
  }> {
    try {
      console.log("PaymentService: Validating coupon:", code)
      const response = await api.get(`/payments/coupons/validate?code=${encodeURIComponent(code)}`)
      console.log("PaymentService: Coupon validated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("PaymentService: Error validating coupon:", error)
      return handleError(error, { valid: false, duration: 'once' })
    }
  }

  // Webhook handling
  async handleWebhookEvent(event: { type: string; data?: unknown }): Promise<void> {
    try {
      console.log("PaymentService: Handling webhook event:", event.type)
      const response = await api.post('/payments/webhook', event)
      console.log("PaymentService: Webhook handled successfully:", response.data)
    } catch (error) {
      console.error("PaymentService: Error handling webhook event:", error)
      throw error
    }
  }
}

const paymentService = new PaymentService()
export default paymentService
