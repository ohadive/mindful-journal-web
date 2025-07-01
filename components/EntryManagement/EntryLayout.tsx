import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import EntrySidebar from './EntrySidebar'
import ClientOnlyEditor from '../Editor/ClientOnlyEditor'
import { FaSave, FaSpinner, FaCheck, FaExclamationTriangle, FaBars, FaCog } from 'react-icons/fa'
import { useKeyboardShortcuts } from '../KeyboardShortcuts/KeyboardShortcutsProvider'
import KeyboardShortcutsHelp from '../KeyboardShortcuts/KeyboardShortcutsHelp'
import { useToast } from '../ui/Toast'
import { useConfirmDialog } from '../ui/ConfirmDialog'
import ExportButton from '../Export/ExportButton'
import SettingsModal, { useSettings } from '../Settings/SettingsModal'

interface JournalEntry {
  id: string
  title: string
  content: string
  preview: string
  wordCount: number
  isPrivate: boolean
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

interface EntryLayoutProps {
  className?: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function EntryLayout({ className = '' }: EntryLayoutProps) {
  const { data: session } = useSession()
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isNewEntry, setIsNewEntry] = useState(false)
  const [lastSavedContent, setLastSavedContent] = useState('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([])
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(-1)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Hooks
  const { updateHandlers } = useKeyboardShortcuts()
  const { showToast } = useToast()
  const { confirm } = useConfirmDialog()
  const { settings, updateSettings } = useSettings()
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleEntrySelect = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry)
    setContent(entry.content)
    setLastSavedContent(entry.content)
    setIsNewEntry(false)
    setSaveStatus('idle')
  }, [])

  const handleNewEntry = useCallback(() => {
    setSelectedEntry(null)
    setContent('')
    setLastSavedContent('')
    setIsNewEntry(true)
    setSaveStatus('idle')
  }, [])

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    
    // Reset save status if content has changed
    if (saveStatus === 'saved' && newContent !== lastSavedContent) {
      setSaveStatus('idle')
    }

    // Auto-save if enabled
    if (settings.autoSaveInterval > 0) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        if (newContent !== lastSavedContent && newContent.trim()) {
          saveEntry()
        }
      }, settings.autoSaveInterval * 1000)
    }
  }, [saveStatus, lastSavedContent, settings.autoSaveInterval])

  const saveEntry = useCallback(async () => {
    if (!session?.user || !content.trim()) return

    setSaveStatus('saving')
    
    try {
      const isUpdating = selectedEntry && !isNewEntry
      const url = isUpdating ? `/api/entries/${selectedEntry.id}` : '/api/entries'
      const method = isUpdating ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title: extractTitleFromContent(content),
          isPrivate: selectedEntry?.isPrivate ?? true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save entry')
      }

      const savedEntry = await response.json()
      setSelectedEntry(savedEntry)
      setLastSavedContent(content)
      setIsNewEntry(false)
      setSaveStatus('saved')

      // Show toast notification
      showToast({
        type: 'success',
        title: 'Entry Saved',
        message: isUpdating ? 'Entry updated successfully' : 'New entry created successfully'
      })

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)

    } catch (error) {
      console.error('Error saving entry:', error)
      setSaveStatus('error')
      
      // Show error toast
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save entry. Please try again.'
      })
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    }
  }, [session, content, selectedEntry, isNewEntry, showToast])

  const extractTitleFromContent = (content: string): string => {
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    const firstLine = textContent.split('\n')[0].trim()
    return firstLine.length > 50 
      ? firstLine.substring(0, 50) + '...'
      : firstLine || 'Untitled Entry'
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <FaSpinner className="animate-spin text-blue-500" />
      case 'saved':
        return <FaCheck className="text-green-500" />
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />
      default:
        return <FaSave className="text-muted-foreground" />
    }
  }

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return 'Saved'
      case 'error':
        return 'Error saving'
      default:
        return 'Save'
    }
  }

  const hasUnsavedChanges = content !== lastSavedContent && content.trim() !== ''

  // Delete entry function
  const deleteEntry = useCallback(async () => {
    if (!selectedEntry || !session?.user) return

    confirm({
      title: 'Delete Entry',
      message: `Are you sure you want to delete "${selectedEntry.title}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/entries/${selectedEntry.id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error('Failed to delete entry')
          }

          showToast({
            type: 'success',
            title: 'Entry Deleted',
            message: `"${selectedEntry.title}" has been deleted`
          })

          // Reset state
          setSelectedEntry(null)
          setContent('')
          setLastSavedContent('')
          setIsNewEntry(false)
          setSaveStatus('idle')

          // Refresh entries list
          // This would typically trigger a refresh in the sidebar
        } catch (error) {
          console.error('Error deleting entry:', error)
          showToast({
            type: 'error',
            title: 'Delete Failed',
            message: 'Failed to delete entry. Please try again.'
          })
        }
      }
    })
  }, [selectedEntry, session, confirm, showToast])

  // Focus search function
  const focusSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  // Navigation functions
  const navigateEntries = useCallback((direction: 'up' | 'down') => {
    if (allEntries.length === 0) return

    let newIndex = selectedEntryIndex
    if (direction === 'up') {
      newIndex = selectedEntryIndex > 0 ? selectedEntryIndex - 1 : allEntries.length - 1
    } else {
      newIndex = selectedEntryIndex < allEntries.length - 1 ? selectedEntryIndex + 1 : 0
    }

    setSelectedEntryIndex(newIndex)
    const entry = allEntries[newIndex]
    if (entry) {
      handleEntrySelect(entry)
    }
  }, [allEntries, selectedEntryIndex, handleEntrySelect])

  // Clear search and close modals
  const handleEscape = useCallback(() => {
    if (showKeyboardHelp) {
      setShowKeyboardHelp(false)
    } else if (showSettings) {
      setShowSettings(false)
    } else if (searchInputRef.current) {
      searchInputRef.current.value = ''
      searchInputRef.current.blur()
    }
  }, [showKeyboardHelp, showSettings])

  // Setup keyboard shortcuts
  useEffect(() => {
    if (!settings.keyboardShortcutsEnabled) return

    updateHandlers({
      onNewEntry: handleNewEntry,
      onFocusSearch: focusSearch,
      onSave: () => {
        if (selectedEntry || isNewEntry) {
          saveEntry()
        }
      },
      onDelete: deleteEntry,
      onEscape: handleEscape,
      onShowHelp: () => setShowKeyboardHelp(true),
      onNavigateUp: () => navigateEntries('up'),
      onNavigateDown: () => navigateEntries('down'),
    })
  }, [
    settings.keyboardShortcutsEnabled,
    updateHandlers,
    handleNewEntry,
    focusSearch,
    saveEntry,
    deleteEntry,
    handleEscape,
    navigateEntries,
    selectedEntry,
    isNewEntry
  ])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  if (!session?.user) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Welcome to Your Journal
          </h2>
          <p className="text-muted-foreground">
            Please sign in to start writing and managing your entries.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-full ${className}`}>
      {/* Sidebar - responsive */}
      <div className="w-80 flex-shrink-0 hidden md:block">
        <EntrySidebar
          selectedEntryId={selectedEntry?.id}
          onEntrySelect={handleEntrySelect}
          onNewEntry={handleNewEntry}
          onEntriesChange={(entries) => {
            setAllEntries(entries)
            // Update selected entry index
            const index = entries.findIndex(e => e.id === selectedEntry?.id)
            setSelectedEntryIndex(index)
          }}
          searchInputRef={searchInputRef}
          className="h-full"
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)}>
          <div className="w-80 h-full bg-card" onClick={(e) => e.stopPropagation()}>
            <EntrySidebar
              selectedEntryId={selectedEntry?.id}
              onEntrySelect={(entry) => {
                handleEntrySelect(entry)
                setIsMobileSidebarOpen(false)
              }}
              onNewEntry={() => {
                handleNewEntry()
                setIsMobileSidebarOpen(false)
              }}
              onEntriesChange={(entries) => {
                setAllEntries(entries)
                const index = entries.findIndex(e => e.id === selectedEntry?.id)
                setSelectedEntryIndex(index)
              }}
              searchInputRef={searchInputRef}
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="border-b border-border p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
                title="Open entries menu"
              >
                <FaBars className="w-4 h-4" />
              </button>
              
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {selectedEntry?.title || (isNewEntry ? 'New Entry' : 'Select an entry')}
                </h1>
                {selectedEntry && (
                  <p className="text-sm text-muted-foreground">
                    {selectedEntry.wordCount} words • 
                    Last updated {new Date(selectedEntry.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Export Button */}
              {selectedEntry && (
                <ExportButton
                  entry={selectedEntry}
                  type="single"
                  className="hidden sm:block"
                />
              )}
              
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-md hover:bg-accent transition-colors"
                title="Settings"
              >
                <FaCog className="w-4 h-4" />
              </button>

              {/* Save Button */}
              {(selectedEntry || isNewEntry) && (
                <button
                  onClick={saveEntry}
                  disabled={saveStatus === 'saving' || !hasUnsavedChanges}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    hasUnsavedChanges
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {getSaveStatusIcon()}
                  <span className="text-sm">{getSaveStatusText()}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-4 bg-background overflow-auto">
          {selectedEntry || isNewEntry ? (
            <div className="max-w-4xl mx-auto">
              <ClientOnlyEditor
                content={content}
                onChange={handleContentChange}
                placeholder={
                  isNewEntry
                    ? "Start writing your new journal entry..."
                    : "Continue writing..."
                }
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Ready to write?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Select an entry from the sidebar to continue writing, or create a new entry to get started.
                </p>
                <button
                  onClick={handleNewEntry}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create New Entry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  )
}