'use client'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  variant?: 'inline' | 'card'
}

export default function ErrorMessage({ message, onDismiss, variant = 'inline' }: ErrorMessageProps) {
  const ExclamationTriangleIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  )

  const XMarkIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )

  if (variant === 'card') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4">
          <ExclamationTriangleIcon />
        </div>
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
          Erro
        </h3>
        <p className="text-red-700 dark:text-red-300 mb-4">
          {message}
        </p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-2 flex-shrink-0">
          <ExclamationTriangleIcon />
        </div>
        <span className="text-sm">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-red-500 hover:text-red-700 dark:hover:text-red-300"
        >
          <XMarkIcon />
        </button>
      )}
    </div>
  )
}
