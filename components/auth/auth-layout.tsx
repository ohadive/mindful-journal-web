import Link from 'next/link'
import { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
              <BookOpen className="h-12 w-12 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                Mindful Journal
              </span>
            </Link>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Your Digital Sanctuary
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              A private space for reflection, growth, and mindfulness. 
              Track your thoughts, emotions, and journey toward well-being.
            </p>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-primary-foreground text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">Your thoughts are encrypted and secure</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-primary-foreground text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">AI-Enhanced Insights</h3>
                  <p className="text-sm text-muted-foreground">Discover patterns and gain self-awareness</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-primary-foreground text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Mood Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor your emotional journey over time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Mindful Journal
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}