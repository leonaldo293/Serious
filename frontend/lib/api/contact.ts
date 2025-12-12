// services/contact.ts
import { api } from './client';

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

class ContactService {
  async sendContactMessage(data: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await api.post<ContactResponse>('/contact', data);
      return response;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw new Error('Não foi possível enviar sua mensagem. Tente novamente.');
    }
  }

  // Validação do formulário
  validateContactForm(data: ContactFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (data.name.trim().length < 3) {
      errors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!data.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }

    if (!data.message.trim()) {
      errors.message = 'Mensagem é obrigatória';
    } else if (data.message.trim().length < 10) {
      errors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    } else if (data.message.trim().length > 1000) {
      errors.message = 'Mensagem deve ter no máximo 1000 caracteres';
    }

    if (data.subject && data.subject.trim().length > 100) {
      errors.subject = 'Assunto deve ter no máximo 100 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export const contactService = new ContactService();
