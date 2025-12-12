'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Mail, MessageSquare } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<'email' | 'whatsapp'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Por favor, informe seu email')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      if (method === 'email') {
        // Simular envio por email
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('Enviar link de recuperação para:', email)
      } else {
        // Simular envio por WhatsApp
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('Enviar link de recuperação via WhatsApp para:', email)
        
        // Simular abertura do WhatsApp
        const message = encodeURIComponent(`🔐 Recuperação de Senha - ELTx HUB\n\nOlá! Solicitei a recuperação de senha para o email: ${email}\n\nPor favor, envie-me o link para redefinir minha senha.\n\nObrigado!`)
        const whatsappUrl = `https://wa.me/23939947819?text=${message}`
        window.open(whatsappUrl, '_blank')
      }
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Erro ao enviar recuperação:', error)
      setError('Ocorreu um erro ao solicitar a recuperação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-charcoal to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Link enviado com sucesso!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {method === 'email' 
              ? `Enviamos um link de recuperação para ${email}. Verifique sua caixa de entrada e spam.`
              : `Abrimos o WhatsApp com o número +23939947819. Entre em contato para receber seu link de recuperação.`
            }
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 px-4 bg-african-gold text-deep-charcoal font-semibold rounded-lg hover:opacity-90 transition"
            >
              Voltar para o login
            </button>
            
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Enviar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-charcoal to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <Image
              src="/logo.jpeg"
              alt="ELTx HUB Logo"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
            <span className="text-3xl font-bold text-pure-white">
              <span className="text-african-gold">ELTx</span>
              <span className="text-tech-teal"> HUB</span>
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-pure-white">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-gray-300">
            Escolha como receber seu link de recuperação
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Método de Recuperação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`p-3 rounded-lg border-2 transition ${
                  method === 'email'
                    ? 'border-african-gold bg-african-gold/10 text-african-gold'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Mail className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Email</span>
              </button>
              
              <button
                type="button"
                onClick={() => setMethod('whatsapp')}
                className={`p-3 rounded-lg border-2 transition ${
                  method === 'whatsapp'
                    ? 'border-african-gold bg-african-gold/10 text-african-gold'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">WhatsApp</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-pure-white placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-african-gold text-deep-charcoal font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Enviando...
                </>
              ) : (
                <>
                  {method === 'email' ? 'Enviar por Email' : 'Enviar via WhatsApp'}
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Lembrou sua senha?{' '}
              <Link href="/login" className="text-tech-teal hover:opacity-80 transition">
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            {method === 'email' 
              ? 'Você receberá um link válido por 24 horas. Verifique também sua caixa de spam.'
              : 'Entraremos em contato via WhatsApp (+23939947819) com seu link de recuperação.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
