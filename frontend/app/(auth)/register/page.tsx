'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

function RegisterContent() {
  const router = useRouter()
  const { register, user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'mentor' | 'admin' | 'superadmin'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      
      // Redirecionar para dashboard após registro
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-deep-charcoal flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            Criar Conta
          </h2>
          <p className="mt-2 text-gray-300">
            Junte-se à comunidade ELTx HUB
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  Nome *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-pure-white placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  Sobrenome *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-pure-white placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-pure-white placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de Conta *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-pure-white focus:ring-2 focus:ring-tech-teal focus:border-transparent"
              >
                <option value="student">Aluno</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-pure-white placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirmar Senha *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-pure-white placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
                placeholder="Repita sua senha"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-african-gold text-deep-charcoal font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-tech-teal hover:opacity-80 transition">
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="text-center text-gray-400 text-sm">
          <p>Ao criar uma conta, você terá acesso a:</p>
          <ul className="mt-2 space-y-1">
            <li>• Cursos e programas exclusivos</li>
            <li>• Comunidade de desenvolvedores</li>
            <li>• Mentoria e consultoria</li>
            <li>• Certificados de conclusão</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function Register() {
  return <RegisterContent />
}
