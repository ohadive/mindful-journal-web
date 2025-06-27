import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../../src/components/ui/button'
import { 
  PenTool, 
  Heart, 
  Calendar, 
  Search, 
  Lightbulb,
  BarChart3,
  ArrowRight
} from 'lucide-react'

const quickActions = [
  {
    title: 'New Entry',
    description: 'Start writing your thoughts',
    icon: PenTool,
    href: '/write',
    color: 'bg-blue-500 hover:bg-blue-600',
    textColor: 'text-white',
  },
  {
    title: 'Log Mood',
    description: 'Track how you\'re feeling',
    icon: Heart,
    href: '/mood/new',
    color: 'bg-pink-500 hover:bg-pink-600',
    textColor: 'text-white',
  },
  {
    title: 'View Calendar',
    description: 'See your writing pattern',
    icon: Calendar,
    href: '/calendar',
    color: 'bg-green-500 hover:bg-green-600',
    textColor: 'text-white',
  },
  {
    title: 'Search Entries',
    description: 'Find past reflections',
    icon: Search,
    href: '/search',
    color: 'bg-purple-500 hover:bg-purple-600',
    textColor: 'text-white',
  },
  {
    title: 'Writing Prompts',
    description: 'Get inspiration to write',
    icon: Lightbulb,
    href: '/prompts',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    textColor: 'text-white',
  },
  {
    title: 'Analytics',
    description: 'View your insights',
    icon: BarChart3,
    href: '/analytics',
    color: 'bg-indigo-500 hover:bg-indigo-600',
    textColor: 'text-white',
  },
]

export function QuickActions() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform hover:bg-accent hover:text-accent-foreground rounded-md"
            >
                <div className={`p-3 rounded-full ${action.color} transition-colors`}>
                  <action.icon className={`h-5 w-5 ${action.textColor}`} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm text-foreground">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}