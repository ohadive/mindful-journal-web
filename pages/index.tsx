import { GetServerSideProps } from 'next'
import { MainLayout } from '../components/layout/main-layout'
import { StatsCards } from '../components/dashboard/stats-cards'
import { RecentEntries } from '../components/dashboard/recent-entries'
import { QuickActions } from '../components/dashboard/quick-actions'
import { MoodChart } from '../components/dashboard/mood-chart'
import { requireAuth, AuthenticatedPageProps } from '../lib/auth-utils'

// Mock data - replace with actual data fetching
const mockStats = {
  totalEntries: 47,
  currentStreak: 7,
  thisWeekEntries: 5,
  avgMoodScore: 7.2,
  totalWords: 12847,
  timeSpent: 1260, // minutes
}

const mockRecentEntries = [
  {
    id: '1',
    title: 'Morning Reflections',
    content: 'Today started with a beautiful sunrise. I noticed how the light gradually filled my room, and it made me think about new beginnings. There\'s something magical about mornings that always fills me with hope and possibility.',
    mood: 'happy',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    title: 'Thoughts on Growth',
    content: 'Been thinking a lot about personal growth lately. Sometimes it feels like progress is so slow, but looking back at where I was a year ago, I can see how much I\'ve changed. Growth isn\'t always linear.',
    mood: 'calm',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    title: null,
    content: 'Had a challenging day at work today. Feeling a bit overwhelmed with all the deadlines, but I know this feeling will pass. Taking deep breaths and focusing on one task at a time.',
    mood: 'anxious',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
]

const mockMoodData = [
  { date: '2024-01-20', mood: 8, label: 'Great day' },
  { date: '2024-01-21', mood: 6, label: 'Good day' },
  { date: '2024-01-22', mood: 4, label: 'Tough day' },
  { date: '2024-01-23', mood: 7, label: 'Better day' },
  { date: '2024-01-24', mood: 9, label: 'Excellent day' },
  { date: '2024-01-25', mood: 7, label: 'Good day' },
  { date: '2024-01-26', mood: 8, label: 'Great day' },
]

export default function Dashboard({ session }: AuthenticatedPageProps) {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's how your mindful journaling journey is going.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={mockStats} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <RecentEntries entries={mockRecentEntries} />
            <MoodChart data={mockMoodData} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Writing Prompt Card */}
            <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800 animate-slide-up">
              <h3 className="font-semibold text-foreground mb-2">
                Today's Writing Prompt
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                "What three things are you most grateful for today, and why do they matter to you?"
              </p>
              <button className="btn-writing text-sm px-4 py-2 rounded-md transition-colors">
                Start Writing
              </button>
            </div>

            {/* Inspiration Quote */}
            <div className="card p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800 animate-slide-up">
              <h3 className="font-semibold text-foreground mb-2">
                Daily Inspiration
              </h3>
              <blockquote className="text-sm text-muted-foreground italic">
                "The act of writing is the act of discovering what you believe."
              </blockquote>
              <p className="text-xs text-muted-foreground mt-2">
                — David Hare
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = requireAuth()