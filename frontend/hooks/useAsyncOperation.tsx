'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/components/Toast'

interface UseAsyncOperationOptions {
  successMessage?: string
  errorMessage?: string
  showToast?: boolean
}

export function useAsyncOperation<T = any>(options: UseAsyncOperationOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)
  const { showToast } = useToast()

  const execute = useCallback(async (
    asyncOperation: () => Promise<T>,
    customOptions?: UseAsyncOperationOptions
  ) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await asyncOperation()
      setData(result)
      
      const opts = { ...options, ...customOptions }
      if (opts.showToast && opts.successMessage) {
        showToast({
          type: 'success',
          title: opts.successMessage || 'Operação concluída com sucesso'
        });
      }
      
      return result
    } catch (err: any) {
      const errorMessage = err?.message || 'Ocorreu um erro inesperado'
      setError(errorMessage)
      
      const opts = { ...options, ...customOptions }
      if (opts.showToast) {
        showToast({
          type: 'error',
          title: opts.errorMessage || errorMessage
        });
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [options, showToast])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset
  }
}
