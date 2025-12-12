'use client'

import { useState } from 'react'
import { Save, X } from 'lucide-react'

interface Field {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date' | 'tel'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: (value: string) => string | null
}

interface AdminFormProps {
  fields: Field[]
  initialData?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitText?: string
  cancelText?: string
}

export default function AdminForm({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Salvar',
  cancelText = 'Cancelar'
}: AdminFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateField = (field: Field, value: string | number): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} é obrigatório`
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value.toString())) {
        return 'Email inválido'
      }
    }

    if (field.validation && value) {
      return field.validation(value.toString())
    }

    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '')
      if (error) {
        newErrors[field.name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const renderField = (field: Field) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]

    const baseClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-700 dark:text-white"
    const errorClasses = error ? "border-red-500" : "border-gray-300 dark:border-gray-600"

    const commonProps = {
      id: field.name,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleChange(field.name, e.target.value),
      className: `${baseClasses} ${errorClasses}`,
      placeholder: field.placeholder,
      required: field.required
    }

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
          />
        )

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Selecione...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            onChange={(e) => handleChange(field.name, Number(e.target.value))}
          />
        )

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
          />
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <X className="w-4 h-4" />
          {cancelText}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-white bg-african-gold rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Salvando...' : submitText}
        </button>
      </div>
    </form>
  )
}

// Common field configurations
export const userFields: Field[] = [
  {
    name: 'firstName',
    label: 'Nome',
    type: 'text',
    required: true,
    placeholder: 'Digite o nome'
  },
  {
    name: 'lastName',
    label: 'Sobrenome',
    type: 'text',
    required: true,
    placeholder: 'Digite o sobrenome'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'email@exemplo.com'
  },
  {
    name: 'phone',
    label: 'Telefone',
    type: 'tel',
    placeholder: '+244 999 000 000'
  },
  {
    name: 'role',
    label: 'Função',
    type: 'select',
    required: true,
    options: [
      { value: 'user', label: 'Usuário' },
      { value: 'student', label: 'Estudante' },
      { value: 'mentor', label: 'Mentor' },
      { value: 'instructor', label: 'Instrutor' },
      { value: 'admin', label: 'Administrador' },
      { value: 'superadmin', label: 'Super Administrador' }
    ]
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
      { value: 'suspended', label: 'Suspenso' }
    ]
  },
  {
    name: 'bio',
    label: 'Biografia',
    type: 'textarea',
    placeholder: 'Breve descrição sobre o usuário'
  },
  {
    name: 'location',
    label: 'Localização',
    type: 'text',
    placeholder: 'Cidade, País'
  }
]

export const courseFields: Field[] = [
  {
    name: 'title',
    label: 'Título do Curso',
    type: 'text',
    required: true,
    placeholder: 'Digite o título do curso'
  },
  {
    name: 'description',
    label: 'Descrição',
    type: 'textarea',
    required: true,
    placeholder: 'Descreva o curso em detalhes'
  },
  {
    name: 'instructor',
    label: 'Instrutor',
    type: 'text',
    required: true,
    placeholder: 'Nome do instrutor'
  },
  {
    name: 'duration',
    label: 'Duração',
    type: 'text',
    required: true,
    placeholder: 'Ex: 8 semanas, 40 horas'
  },
  {
    name: 'level',
    label: 'Nível',
    type: 'select',
    required: true,
    options: [
      { value: 'beginner', label: 'Iniciante' },
      { value: 'intermediate', label: 'Intermediário' },
      { value: 'advanced', label: 'Avançado' }
    ]
  },
  {
    name: 'price',
    label: 'Preço (AOA)',
    type: 'number',
    required: true,
    placeholder: '0.00'
  },
  {
    name: 'category',
    label: 'Categoria',
    type: 'select',
    required: true,
    options: [
      { value: 'technology', label: 'Tecnologia' },
      { value: 'business', label: 'Negócios' },
      { value: 'language', label: 'Idiomas' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' }
    ]
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
      { value: 'draft', label: 'Rascunho' }
    ]
  }
]

export const programFields: Field[] = [
  {
    name: 'title',
    label: 'Título do Programa',
    type: 'text',
    required: true,
    placeholder: 'Digite o título do programa'
  },
  {
    name: 'description',
    label: 'Descrição',
    type: 'textarea',
    required: true,
    placeholder: 'Descreva o programa em detalhes'
  },
  {
    name: 'type',
    label: 'Tipo',
    type: 'select',
    required: true,
    options: [
      { value: 'bootcamp', label: 'Bootcamp' },
      { value: 'course', label: 'Curso' },
      { value: 'workshop', label: 'Workshop' }
    ]
  },
  {
    name: 'duration',
    label: 'Duração',
    type: 'text',
    required: true,
    placeholder: 'Ex: 12 semanas, 60 horas'
  },
  {
    name: 'level',
    label: 'Nível',
    type: 'select',
    required: true,
    options: [
      { value: 'beginner', label: 'Iniciante' },
      { value: 'intermediate', label: 'Intermediário' },
      { value: 'advanced', label: 'Avançado' }
    ]
  },
  {
    name: 'price',
    label: 'Preço (AOA)',
    type: 'number',
    required: true,
    placeholder: '0.00'
  },
  {
    name: 'category',
    label: 'Categoria',
    type: 'select',
    required: true,
    options: [
      { value: 'technology', label: 'Tecnologia' },
      { value: 'business', label: 'Negócios' },
      { value: 'language', label: 'Idiomas' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' }
    ]
  },
  {
    name: 'mentor',
    label: 'Mentor',
    type: 'text',
    placeholder: 'Nome do mentor responsável'
  },
  {
    name: 'startDate',
    label: 'Data de Início',
    type: 'date',
    required: true
  },
  {
    name: 'endDate',
    label: 'Data de Término',
    type: 'date',
    required: true
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
      { value: 'draft', label: 'Rascunho' }
    ]
  }
]

export const tutorFields: Field[] = [
  {
    name: 'firstName',
    label: 'Nome',
    type: 'text',
    required: true,
    placeholder: 'Digite o nome'
  },
  {
    name: 'lastName',
    label: 'Sobrenome',
    type: 'text',
    required: true,
    placeholder: 'Digite o sobrenome'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'email@exemplo.com'
  },
  {
    name: 'bio',
    label: 'Biografia',
    type: 'textarea',
    required: true,
    placeholder: 'Descreva a experiência e qualificações'
  },
  {
    name: 'expertise',
    label: 'Áreas de Especialização',
    type: 'text',
    required: true,
    placeholder: 'Ex: JavaScript, React, Node.js'
  },
  {
    name: 'experience',
    label: 'Experiência',
    type: 'text',
    required: true,
    placeholder: 'Ex: 5 anos de experiência em desenvolvimento web'
  },
  {
    name: 'rating',
    label: 'Avaliação (1-5)',
    type: 'number',
    required: true,
    placeholder: '5.0',
    validation: (value) => {
      const num = Number(value)
      if (num < 1 || num > 5) {
        return 'Avaliação deve estar entre 1 e 5'
      }
      return null
    }
  },
  {
    name: 'hourlyRate',
    label: 'Taxa Horária (AOA)',
    type: 'number',
    required: true,
    placeholder: '0.00'
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' }
    ]
  }
]
