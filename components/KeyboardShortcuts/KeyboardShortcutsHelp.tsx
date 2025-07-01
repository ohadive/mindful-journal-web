import React from 'react'
import { FaTimes } from 'react-icons/fa'

interface KeyboardShortcut {
  keys: string[]
  description: string
  category: 'Navigation' | 'Editing' | 'Actions' | 'General'
}

const shortcuts: KeyboardShortcut[] = [
  { keys: ['Ctrl', 'N'], description: 'Create new entry', category: 'Actions' },
  { keys: ['Ctrl', 'S'], description: 'Save current entry', category: 'Actions' },
  { keys: ['Ctrl', 'D'], description: 'Delete current entry', category: 'Actions' },
  { keys: ['Ctrl', 'F'], description: 'Focus search bar', category: 'Navigation' },
  { keys: ['↑', '↓'], description: 'Navigate entry list', category: 'Navigation' },
  { keys: ['Escape'], description: 'Clear search / Close modals', category: 'General' },
  { keys: ['Ctrl', '/'], description: 'Show this help', category: 'General' },
]

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null

  const categorizedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            title="Close help"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {Object.entries(categorizedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-lg font-medium text-foreground mb-3">{category}</h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs mx-1">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Additional info */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> On Mac, use Cmd instead of Ctrl for shortcuts.
              Most shortcuts work globally, but some require focus on specific elements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}