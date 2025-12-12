// WhatsApp utility functions
export const WHATSAPP_NUMBER = '953763326';

export const createWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const createCourseInquiryMessage = (courseTitle: string): string => {
  return `Olá! Gostaria de me inscrever no curso: ${courseTitle}. Poderiam me fornecer mais informações?`;
};

export const createGeneralInquiryMessage = (): string => {
  return `Olá! Gostaria de saber mais sobre os cursos disponíveis na ELTx HUB.`;
};
