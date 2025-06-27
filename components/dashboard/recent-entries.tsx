import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../../src/components/ui/button'
import { BookOpen, Heart, ArrowRight } from 'lucide-react'

interface JournalEntry {
  id: string
  title: string | null
  content: string
  mood?: string
  createdAt: Date
}

interface RecentEntriesProps {
  entries: JournalEntry[]
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  calm: '😌',
  anxious: '😰',
  excited: '🤩',
  neutral: '😐',
}

const moodColors: Record<string, string> = {
  happy: 'mood-happy',
  sad: 'mood-sad',
  calm: 'mood-calm',
  anxious: 'mood-anxious',
  excited: 'mood-excited',
  neutral: 'mood-neutral',
}

export function RecentEntries({ entries }: RecentEntriesProps) {
  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle>Recent Entries</CardTitle>
        </div>
        <Link href="/entries" className="flex items-center gap-1 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-sm">
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No entries yet</p>
            <Link href="/write" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Write Your First Entry
            </Link>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="group p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <Link href={`/entries/${entry.id}`} className="block">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {entry.title || 'Untitled Entry'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  {entry.mood && (
                    <div className="flex items-center gap-1">
                      <span className="text-lg">
                        {moodEmojis[entry.mood] || '😐'}
                      </span>
                      <Heart className={`h-4 w-4 ${moodColors[entry.mood] || 'text-muted-foreground'}`} />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {truncateText(entry.content)}
                </p>
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}