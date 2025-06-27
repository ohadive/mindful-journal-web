import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { Button } from '../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { 
  BookOpen, 
  Heart, 
  Lock, 
  Brain, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your thoughts are encrypted and stored securely. Only you have access to your journal entries.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Discover patterns in your thoughts and emotions with intelligent analysis and personalized recommendations.',
  },
  {
    icon: Heart,
    title: 'Mood Tracking',
    description: 'Track your emotional journey over time with visual charts and meaningful insights.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'See your writing habits, mood trends, and personal growth with detailed analytics.',
  },
  {
    icon: Sparkles,
    title: 'Writing Prompts',
    description: 'Get inspired with AI-generated prompts tailored to your interests and goals.',
  },
  {
    icon: BookOpen,
    title: 'Beautiful Writing Experience',
    description: 'Enjoy a distraction-free writing environment designed for focus and creativity.',
  },
]

const benefits = [
  'End-to-end encryption for complete privacy',
  'Unlimited journal entries and storage',
  'Advanced mood and emotion tracking',
  'AI-powered insights and analytics',
  'Beautiful, responsive design',
  'Export your data anytime',
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Mindful Journal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Sign In
              </Link>
              <Link href="/auth/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Digital
            <span className="text-primary"> Sanctuary</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A private, secure space for reflection, growth, and mindfulness. 
            Track your thoughts, emotions, and journey toward well-being with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="inline-flex items-center justify-center rounded-md text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-3">
              Start Journaling Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-md text-lg font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need for mindful journaling
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you develop a consistent journaling practice
              and gain deeper insights into your thoughts and emotions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why choose Mindful Journal?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We believe journaling should be private, insightful, and inspiring. 
                That's why we've built the most secure and intelligent journaling platform.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
                <p className="mb-6 opacity-90">
                  Join thousands of people who have transformed their mental well-being 
                  through mindful journaling.
                </p>
                <Link href="/auth/signup" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">
                  Mindful Journal
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                A private, secure platform for mindful journaling and personal growth.
              </p>
              <p className="text-sm text-muted-foreground">
                © 2024 Mindful Journal. All rights reserved.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}