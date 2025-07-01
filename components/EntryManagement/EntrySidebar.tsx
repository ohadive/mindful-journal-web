import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { 
  FaPlus, 
  FaHeart, 
  FaRegHeart, 
  FaSearch, 
  FaSpinner,
  FaCalendarDay,
  FaEye,
  FaEyeSlash,
  FaDownload 
} from 'react-icons/fa'
import ExportButton from '../Export/ExportButton'
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns'

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

interface EntrySidebarProps {
  selectedEntryId?: string
  onEntrySelect: (entry: JournalEntry) => void
  onNewEntry: () => void
  onEntriesChange?: (entries: JournalEntry[]) => void
  searchInputRef?: React.RefObject<HTMLInputElement | null>
  className?: string
}

export default function EntrySidebar({
  selectedEntryId,
  onEntrySelect,
  onNewEntry,
  onEntriesChange,
  searchInputRef,
  className = ''
}: EntrySidebarProps) {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async (reset = false) => {
    if (!session?.user) return

    try {
      setIsLoading(reset)
      const response = await fetch('/api/entries')
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries')
      }

      const data = await response.json()
      setEntries(data.entries || [])
      setHasMore(data.hasMore || false)
      setError(null)
      
      // Notify parent of entries change
      onEntriesChange?.(data.entries || [])
    } catch (err) {
      console.error('Error fetching entries:', err)
      setError('Failed to load entries')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchEntries(true)
  }, [fetchEntries])

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFavorite = async (entryId: string, currentFavorite: boolean) => {
    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentFavorite }),
      })

      if (!response.ok) {
        throw new Error('Failed to update favorite status')
      }

      setEntries(prev => prev.map(entry =>
        entry.id === entryId
          ? { ...entry, isFavorite: !currentFavorite }
          : entry
      ))
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const formatEntryDate = (dateString: string) => {
    const date = new Date(dateString)
    
    if (isToday(date)) {
      return `Today ${format(date, 'HH:mm')}`
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`
    } else {
      return format(date, 'MMM d, yyyy')
    }
  }

  if (!session?.user) {
    return (
      <div className={`bg-card border-r border-border h-full flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground text-sm">Please sign in to view entries</p>
      </div>
    )
  }

  return (
    <div className={`bg-card border-r border-border h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Journal Entries</h2>
          <div className="flex items-center gap-2">
            <ExportButton
              entries={entries}
              type="all"
            />
            <button
              onClick={onNewEntry}
              className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              title="New Entry"
            >
              <FaPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <FaSpinner className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-destructive text-sm mb-2">{error}</p>
            <button
              onClick={() => fetchEntries(true)}
              className="text-primary text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-4 text-center">
            {searchQuery ? (
              <p className="text-muted-foreground text-sm">No entries match your search</p>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">No entries yet</p>
                <button
                  onClick={onNewEntry}
                  className="text-primary text-sm hover:underline"
                >
                  Create your first entry
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredEntries.map((entry) => (
              <EntryItem
                key={entry.id}
                entry={entry}
                isSelected={entry.id === selectedEntryId}
                onSelect={() => onEntrySelect(entry)}
                onToggleFavorite={() => toggleFavorite(entry.id, entry.isFavorite)}
                formatDate={formatEntryDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface EntryItemProps {
  entry: JournalEntry
  isSelected: boolean
  onSelect: () => void
  onToggleFavorite: () => void
  formatDate: (date: string) => string
}

function EntryItem({ 
  entry, 
  isSelected, 
  onSelect, 
  onToggleFavorite, 
  formatDate 
}: EntryItemProps) {
  return (
    <div
      className={`p-3 mx-2 rounded-md cursor-pointer transition-colors relative group ${
        isSelected
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-muted'
      }`}
      onClick={onSelect}
    >
      {/* Entry Content */}
      <div className="pr-8"> {/* Space for favorite button */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-sm truncate flex-1">
            {entry.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {entry.isPrivate ? (
              <FaEyeSlash className="w-3 h-3" />
            ) : (
              <FaEye className="w-3 h-3" />
            )}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {entry.preview}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatDate(entry.updatedAt)}</span>
          <span>{entry.wordCount} words</span>
        </div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        className={`absolute top-3 right-3 p-1 rounded transition-colors ${
          entry.isFavorite
            ? 'text-red-500 hover:text-red-600'
            : 'text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100'
        }`}
        title={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {entry.isFavorite ? (
          <FaHeart className="w-3 h-3" />
        ) : (
          <FaRegHeart className="w-3 h-3" />
        )}
      </button>
    </div>
  )
}