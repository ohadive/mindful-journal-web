import { useRouter } from 'next/router'
import Link from 'next/link'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { AuthLayout } from '../../components/auth/auth-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../src/components/ui/button'

const errorMessages: Record<string, string> = {
  'Signin': 'There was a problem signing you in.',
  'OAuthSignin': 'There was a problem signing you in with the provider.',
  'OAuthCallback': 'There was a problem signing you in with the provider.',
  'OAuthCreateAccount': 'Could not create account with the provider.',
  'EmailCreateAccount': 'Could not create account with this email.',
  'Callback': 'There was a problem with the callback.',
  'OAuthAccountNotLinked': 'This account is not linked to your email address.',
  'EmailSignin': 'Check your email for a sign-in link.',
  'CredentialsSignin': 'Invalid email or password.',
  'SessionRequired': 'Please sign in to access this page.',
  'default': 'An unexpected error occurred.',
}

export default function AuthError() {
  const router = useRouter()
  const error = router.query.error as string

  const errorMessage = errorMessages[error] || errorMessages.default

  return (
    <AuthLayout>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold">Authentication Error</CardTitle>
          <CardDescription>
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => router.back()}
              variant="default"
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Link 
              href="/auth/signin"
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Go to Sign In
            </Link>
            
            <Link 
              href="/"
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          
          {error && (
            <div className="mt-6 p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                Error code: <code className="font-mono">{error}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}