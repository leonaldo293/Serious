'use client'

import { useState } from 'react'
import { X, CreditCard, MessageCircle } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  programTitle: string
  amount: string
  programId: string
}

export default function PaymentModal({ isOpen, onClose, programTitle, amount, programId }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'whatsapp'>('paypal')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayPalPayment = async () => {
    setIsProcessing(true)
    try {
      // PayPal SDK integration
      const paypal = await (window as any).paypal
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.replace('R$', '').replace(',', '.').trim()
              },
              description: programTitle
            }]
          })
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log('Payment completed', details)
            // TODO: Send payment confirmation to backend
            alert('Pagamento realizado com sucesso!')
            onClose()
          })
        },
        onError: (err: any) => {
          console.error('PayPal error', err)
          alert('Erro no pagamento. Tente novamente.')
          setIsProcessing(false)
        }
      }).render('#paypal-button-container')
    } catch (error) {
      console.error('PayPal initialization error', error)
      // Fallback for when PayPal SDK is not loaded
      alert('Redirecionando para PayPal...')
      window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=payments@eltx-hub.com&item_name=${encodeURIComponent(programTitle)}&amount=${encodeURIComponent(amount.replace('R$', '').replace(',', '.').trim())}&currency_code=BRL`, '_blank')
      setIsProcessing(false)
    }
  }

  const handleWhatsAppPayment = () => {
    const message = `Olá! Gostaria de realizar o pagamento do programa "${programTitle}" no valor de ${amount}. Meu ID de programa é ${programId}.`
    const whatsappUrl = `https://wa.me/939947819?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Finalizar Pagamento
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white">{programTitle}</p>
            <p className="text-2xl font-bold text-african-gold">{amount}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'paypal'
                  ? 'border-african-gold bg-african-gold/10'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">PayPal</p>
            </button>

            <button
              onClick={() => setPaymentMethod('whatsapp')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'whatsapp'
                  ? 'border-african-gold bg-african-gold/10'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">WhatsApp</p>
            </button>
          </div>

          {paymentMethod === 'paypal' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Pague com segurança usando PayPal. Aceitamos cartão de crédito, débito e saldo PayPal.
              </p>
              <div id="paypal-button-container" className="min-h-[45px]"></div>
              {!isProcessing && (
                <button
                  onClick={handlePayPalPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Pagar com PayPal
                </button>
              )}
            </div>
          )}

          {paymentMethod === 'whatsapp' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Envie uma mensagem para nosso WhatsApp e receberá instruções para pagamento via transferência bancária ou outros métodos locais.
              </p>
              <button
                onClick={handleWhatsAppPayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Enviar Mensagem no WhatsApp
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Seu pagamento é processado com segurança e criptografia.</p>
          <p>Dúvidas? WhatsApp: +244 939 947 819</p>
        </div>
      </div>
    </div>
  )
}
