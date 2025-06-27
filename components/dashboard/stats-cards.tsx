import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { BookOpen, Calendar, TrendingUp, Heart, Flame, Clock } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalEntries: number
    currentStreak: number
    thisWeekEntries: number
    avgMoodScore: number
    totalWords: number
    timeSpent: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Entries',
      value: stats.totalEntries.toLocaleString(),
      icon: BookOpen,
      description: 'Journal entries written',
      trend: '+12% from last month',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: Flame,
      description: 'Writing consistently',
      trend: 'Keep it going!',
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'This Week',
      value: stats.thisWeekEntries.toString(),
      icon: Calendar,
      description: 'Entries this week',
      trend: '+2 from last week',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Average Mood',
      value: stats.avgMoodScore.toFixed(1),
      icon: Heart,
      description: 'Out of 10',
      trend: '+0.5 improvement',
      color: 'text-pink-600 dark:text-pink-400',
    },
    {
      title: 'Words Written',
      value: stats.totalWords.toLocaleString(),
      icon: TrendingUp,
      description: 'Total word count',
      trend: '+1,247 this month',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Time Spent',
      value: `${Math.round(stats.timeSpent / 60)}h`,
      icon: Clock,
      description: 'Writing time',
      trend: '+3h this month',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="card-hover animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
              {card.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}