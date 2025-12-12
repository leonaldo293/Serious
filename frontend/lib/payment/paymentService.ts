import { apiClient } from '../api/apiClient';

export interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  courseId?: string;
  userId?: string;
  planType?: 'monthly' | 'yearly' | 'lifetime';
}

export interface WhatsAppPaymentData {
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  courseId?: string;
}

class PaymentService {
  private readonly WHATSAPP_NUMBER = '+23939947819'; // Número WhatsApp fornecido
  
  /**
   * Create PayPal order
   */
  async createPayPalOrder(paymentData: PaymentData): Promise<PayPalOrder> {
    try {
      const response = await apiClient.post('/api/paypal/create-order', paymentData);
      return response.data;
    } catch (error) {
      console.error('Failed to create PayPal order:', error);
      throw error;
    }
  }

  /**
   * Capture PayPal payment
   */
  async capturePayPalPayment(orderId: string): Promise<any> {
    try {
      const response = await apiClient.post('/api/paypal/capture-payment', { orderId });
      return response.data;
    } catch (error) {
      console.error('Failed to capture PayPal payment:', error);
      throw error;
    }
  }

  /**
   * Initiate PayPal payment flow
   */
  async initiatePayPalPayment(paymentData: PaymentData): Promise<void> {
    try {
      // Create order
      const order = await this.createPayPalOrder(paymentData);
      
      // Find approval URL
      const approvalLink = order.links.find(link => link.rel === 'approve');
      
      if (approvalLink) {
        // Redirect to PayPal for approval
        window.location.href = approvalLink.href;
      } else {
        throw new Error('PayPal approval link not found');
      }
    } catch (error) {
      console.error('PayPal payment initiation failed:', error);
      throw error;
    }
  }

  /**
   * Generate WhatsApp payment message
   */
  generateWhatsAppMessage(paymentData: WhatsAppPaymentData): string {
    const message = `🎓 *ELTx HUB - Solicitação de Pagamento*

📋 *Detalhes:*
• *Curso/Plano:* ${paymentData.description}
• *Valor:* €${paymentData.amount} ${paymentData.currency}
• *Cliente:* ${paymentData.customerName}
• *Email:* ${paymentData.customerEmail}
• *Telefone:* ${paymentData.customerPhone}

💳 *Método de Pagamento:* WhatsApp
📱 *Número:* ${this.WHATSAPP_NUMBER}

🔗 *Para confirmar o pagamento, por favor:*
1. Envie "CONFIRMAR PAGAMENTO" para este número
2. Anexe o comprovante de transferência
3. Aguarde a confirmação e ativação do acesso

📚 *Acesso será liberado em até 24h após confirmação.*

*ELTx HUB - Educação de Qualidade*`;

    return encodeURIComponent(message);
  }

  /**
   * Initiate WhatsApp payment flow
   */
  initiateWhatsAppPayment(paymentData: WhatsAppPaymentData): void {
    const message = this.generateWhatsAppMessage(paymentData);
    const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER.replace(/[^\d]/g, '')}?text=${message}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Process course enrollment payment
   */
  async processCoursePayment(
    courseId: string,
    amount: number,
    method: 'paypal' | 'whatsapp',
    userId?: string
  ): Promise<void> {
    const paymentData: PaymentData = {
      amount,
      currency: 'EUR',
      description: `Course enrollment - Course ID: ${courseId}`,
      courseId,
      userId,
    };

    if (method === 'paypal') {
      await this.initiatePayPalPayment(paymentData);
    } else {
      // For WhatsApp, we need additional user data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const whatsappData: WhatsAppPaymentData = {
        ...paymentData,
        customerName: `${user.firstName} ${user.lastName}` || 'Nome do Cliente',
        customerEmail: user.email || 'cliente@email.com',
        customerPhone: user.phone || '+0000000000',
      };
      
      this.initiateWhatsAppPayment(whatsappData);
    }
  }

  /**
   * Process subscription payment
   */
  async processSubscriptionPayment(
    planType: 'monthly' | 'yearly' | 'lifetime',
    amount: number,
    method: 'paypal' | 'whatsapp',
    userId?: string
  ): Promise<void> {
    const paymentData: PaymentData = {
      amount,
      currency: 'EUR',
      description: `Subscription - ${planType} plan`,
      planType,
      userId,
    };

    if (method === 'paypal') {
      await this.initiatePayPalPayment(paymentData);
    } else {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const whatsappData: WhatsAppPaymentData = {
        ...paymentData,
        customerName: `${user.firstName} ${user.lastName}` || 'Nome do Cliente',
        customerEmail: user.email || 'cliente@email.com',
        customerPhone: user.phone || '+0000000000',
      };
      
      this.initiateWhatsAppPayment(whatsappData);
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/payments/status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      throw error;
    }
  }

  /**
   * Get payment history for user
   */
  async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/api/payments/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get payment history:', error);
      throw error;
    }
  }

  /**
   * Generate payment receipt
   */
  async generateReceipt(paymentId: string): Promise<string> {
    try {
      const response = await apiClient.get(`/api/payments/receipt/${paymentId}`);
      return response.data.receiptUrl;
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
