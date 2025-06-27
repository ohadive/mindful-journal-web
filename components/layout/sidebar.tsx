import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Settings, 
  PenTool, 
  Heart,
  Search,
  User,
  Menu,
  X
} from 'lucide-react'
import { cn } from '../../src/lib/utils'
import { Button } from '../../src/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Write', href: '/write', icon: PenTool },
  { name: 'Entries', href: '/entries', icon: BookOpen },
  { name: 'Mood Tracker', href: '/mood', icon: Heart },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Search', href: '/search', icon: Search },
]

const secondaryNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        'relative z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-foreground" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-background px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-foreground lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
          Mindful Journal
        </div>
      </div>
    </>
  )
}

function SidebarContent() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4 border-r border-border">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Mindful Journal
          </span>
        </Link>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {/* Current streak */}
          <li>
            <div className="text-xs font-semibold leading-6 text-muted-foreground uppercase tracking-wide">
              Writing Streak
            </div>
            <div className="mt-2 p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">7</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep it up! You're doing great.
              </p>
            </div>
          </li>

          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = router.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {/* User info */}
          {session?.user && (
            <li className="border-t border-border pt-4">
              <div className="flex items-center gap-x-3">
                <div className="h-8 w-8 rounded-full bg-primary center text-primary-foreground text-sm font-medium">
                  {session.user.name?.[0]?.toUpperCase() || session.user.email[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.user.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}