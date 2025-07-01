import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react'

export interface KeyboardShortcutHandlers {
  onNewEntry?: () => void
  onFocusSearch?: () => void
  onSave?: () => void
  onDelete?: () => void
  onEscape?: () => void
  onShowHelp?: () => void
  onNavigateUp?: () => void
  onNavigateDown?: () => void
}

interface KeyboardShortcutsContextType {
  handlers: React.MutableRefObject<KeyboardShortcutHandlers>
  updateHandlers: (newHandlers: Partial<KeyboardShortcutHandlers>) => void
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null)

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext)
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider')
  }
  return context
}

interface KeyboardShortcutsProviderProps {
  children: ReactNode
  enabled?: boolean
}

export default function KeyboardShortcutsProvider({ 
  children, 
  enabled = true 
}: KeyboardShortcutsProviderProps) {
  const handlers = useRef<KeyboardShortcutHandlers>({})

  const updateHandlers = (newHandlers: Partial<KeyboardShortcutHandlers>) => {
    handlers.current = { ...handlers.current, ...newHandlers }
  }

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, or contenteditable
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow some shortcuts even in inputs
        if (event.key === 'Escape') {
          handlers.current.onEscape?.()
          return
        }
        
        // For search input, allow navigation
        if (target.getAttribute('type') === 'text' && target.getAttribute('placeholder')?.includes('Search')) {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault()
            if (event.key === 'ArrowUp') {
              handlers.current.onNavigateUp?.()
            } else {
              handlers.current.onNavigateDown?.()
            }
            return
          }
        }
        
        // Skip other shortcuts in inputs
        return
      }

      const isCtrl = event.ctrlKey || event.metaKey
      
      switch (true) {
        case isCtrl && event.key === 'n':
          event.preventDefault()
          handlers.current.onNewEntry?.()
          break
          
        case isCtrl && event.key === 'f':
          event.preventDefault()
          handlers.current.onFocusSearch?.()
          break
          
        case isCtrl && event.key === 's':
          event.preventDefault()
          handlers.current.onSave?.()
          break
          
        case isCtrl && event.key === 'd':
          event.preventDefault()
          handlers.current.onDelete?.()
          break
          
        case event.key === 'Escape':
          handlers.current.onEscape?.()
          break
          
        case isCtrl && event.key === '/':
          event.preventDefault()
          handlers.current.onShowHelp?.()
          break
          
        case event.key === 'ArrowUp':
          // Only handle if not in a text input
          if (!target.matches('input, textarea, [contenteditable]')) {
            event.preventDefault()
            handlers.current.onNavigateUp?.()
          }
          break
          
        case event.key === 'ArrowDown':
          // Only handle if not in a text input
          if (!target.matches('input, textarea, [contenteditable]')) {
            event.preventDefault()
            handlers.current.onNavigateDown?.()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])

  return (
    <KeyboardShortcutsContext.Provider value={{ handlers, updateHandlers }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  )
}