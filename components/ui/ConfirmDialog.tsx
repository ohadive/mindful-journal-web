import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void | Promise<void>
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  isOpen: boolean
  isLoading?: boolean
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => void
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null)

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider')
  }
  return context
}

interface ConfirmDialogProviderProps {
  children: ReactNode
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
  const [dialog, setDialog] = useState<ConfirmDialogState | null>(null)

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    setDialog({
      ...options,
      isOpen: true,
      confirmText: options.confirmText ?? 'Confirm',
      cancelText: options.cancelText ?? 'Cancel',
      type: options.type ?? 'info',
    })
  }, [])

  const handleConfirm = async () => {
    if (!dialog) return

    setDialog(prev => prev ? { ...prev, isLoading: true } : null)
    
    try {
      await dialog.onConfirm()
      setDialog(null)
    } catch (error) {
      console.error('Error in confirm action:', error)
      setDialog(prev => prev ? { ...prev, isLoading: false } : null)
    }
  }

  const handleCancel = () => {
    setDialog(null)
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmDialog
          dialog={dialog}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmDialogContext.Provider>
  )
}

interface ConfirmDialogProps {
  dialog: ConfirmDialogState
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ dialog, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!dialog.isOpen) return null

  const getIcon = () => {
    switch (dialog.type) {
      case 'danger':
        return <FaExclamationTriangle className="w-6 h-6 text-red-500" />
      case 'warning':
        return <FaExclamationTriangle className="w-6 h-6 text-yellow-500" />
      case 'info':
      default:
        return <FaExclamationTriangle className="w-6 h-6 text-blue-500" />
    }
  }

  const getConfirmButtonStyles = () => {
    switch (dialog.type) {
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700'
      case 'warning':
        return 'bg-yellow-600 text-white hover:bg-yellow-700'
      case 'info':
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!dialog.isLoading ? onCancel : undefined}
      />
      
      {/* Dialog Content */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 className="text-lg font-semibold text-foreground">{dialog.title}</h2>
          </div>
          {!dialog.isLoading && (
            <button
              onClick={onCancel}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              title="Cancel"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground mb-6">{dialog.message}</p>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={dialog.isLoading}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dialog.cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={dialog.isLoading}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getConfirmButtonStyles()}`}
            >
              {dialog.isLoading ? 'Loading...' : dialog.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}