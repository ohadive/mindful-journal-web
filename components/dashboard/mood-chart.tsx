import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { TrendingUp } from 'lucide-react'

interface MoodData {
  date: string
  mood: number
  label: string
}

interface MoodChartProps {
  data: MoodData[]
}

export function MoodChart({ data }: MoodChartProps) {
  const maxMood = Math.max(...data.map(d => d.mood))
  const minMood = Math.min(...data.map(d => d.mood))
  const avgMood = data.reduce((sum, d) => sum + d.mood, 0) / data.length

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'bg-green-500'
    if (mood >= 6) return 'bg-yellow-500'
    if (mood >= 4) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊'
    if (mood >= 6) return '🙂'
    if (mood >= 4) return '😐'
    return '😢'
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Mood Trend (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No mood data yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start tracking your mood to see trends
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart */}
            <div className="flex items-end justify-between h-32 gap-2">
              {data.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative flex-1 w-full flex items-end">
                    <div
                      className={`w-full rounded-t transition-all hover:opacity-80 ${getMoodColor(point.mood)}`}
                      style={{ height: `${(point.mood / 10) * 100}%` }}
                      title={`${point.label}: ${point.mood}/10`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {avgMood.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {maxMood} {getMoodEmoji(maxMood)}
                </p>
                <p className="text-xs text-muted-foreground">Highest</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {minMood} {getMoodEmoji(minMood)}
                </p>
                <p className="text-xs text-muted-foreground">Lowest</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}