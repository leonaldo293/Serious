'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    // Validar token
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        return
      }

      try {
        // Simular validação do token
        await new Promise(resolve => setTimeout(resolve, 1000))
        setTokenValid(true)
      } catch (error) {
        setTokenValid(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Simular reset de senha
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Resetar senha com token:', token)
      
      setIsSuccess(true)
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      setError('Ocorreu um erro ao redefinir sua senha. O link pode ter expirado.')
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-charcoal to-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-african-gold mx-auto mb-4" />
          <p className="text-gray-300">Validando link de recuperação...</p>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-charcoal to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <EyeOff className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Link inválido ou expirado
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Este link de recuperação de senha não é válido ou expirou. Por favor, solicite um novo link.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="block w-full py-3 px-4 bg-african-gold text-deep-charcoal font-semibold rounded-lg hover:opacity-90 transition text-center"
            >
              Solicitar novo link
            </Link>
            
            <Link
              href="/login"
              className="block w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-charcoal to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Senha redefinida com sucesso!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sua senha foi atualizada. Agora você pode fazer login com sua nova senha.
          </p>
          
          <Link
            href="/login"
            className="block w-full py-3 px-4 bg-african-gold text-deep-charcoal font-semibold rounded-lg hover:opacity-90 transition text-center"
          >
            Fazer login
          </Link>
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
            Nova Senha
          </h2>
          <p className="mt-2 text-gray-300">
            Digite sua nova senha abaixo
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

          <form onSubmit={handleSubmit}>
            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Nova Senha *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-pure-white placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirmar Nova Senha *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-pure-white placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
                  placeholder="Repita sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Requisitos da senha:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li className={`flex items-center ${password.length >= 6 ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{password.length >= 6 ? '✓' : '○'}</span>
                  Pelo menos 6 caracteres
                </li>
                <li className={`flex items-center ${password === confirmPassword && password ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{password === confirmPassword && password ? '✓' : '○'}</span>
                  As senhas coincidem
                </li>
              </ul>
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
                  Redefinindo senha...
                </>
              ) : (
                'Redefinir Senha'
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
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-charcoal to-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-african-gold mx-auto mb-4" />
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
