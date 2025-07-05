import { useRouter } from 'next/router'
import Link from 'next/link'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { AuthLayout } from '../../components/auth/auth-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../src/components/ui/button'

const errorMessages: Record<string, { message: string; details: string; solutions: string[] }> = {
  'Signin': {
    message: 'There was a problem signing you in.',
    details: 'The sign-in process encountered an unexpected error.',
    solutions: ['Try signing in again', 'Clear your browser cache', 'Use a different browser']
  },
  'OAuthSignin': {
    message: 'OAuth sign-in failed.',
    details: 'The OAuth provider (Google) could not process your sign-in request.',
    solutions: ['Check your Google account status', 'Try signing in again', 'Contact support if the issue persists']
  },
  'OAuthCallback': {
    message: 'OAuth callback error.',
    details: 'There was an issue processing the response from Google. This could be due to incorrect OAuth configuration or network issues.',
    solutions: ['Try signing in again', 'Check if your Google account has the necessary permissions', 'Verify the OAuth redirect URL is correctly configured']
  },
  'OAuthCreateAccount': {
    message: 'Could not create account with Google.',
    details: 'Failed to create a new account using your Google credentials.',
    solutions: ['Try using a different email address', 'Sign up manually with email/password', 'Contact support']
  },
  'EmailCreateAccount': {
    message: 'Could not create account with this email.',
    details: 'An account with this email may already exist or there was a database error.',
    solutions: ['Try signing in instead of signing up', 'Use a different email address', 'Contact support']
  },
  'Callback': {
    message: 'Authentication callback failed.',
    details: 'The authentication callback process encountered an error.',
    solutions: ['Try the authentication process again', 'Clear browser data', 'Contact support']
  },
  'OAuthAccountNotLinked': {
    message: 'Account linking required.',
    details: 'You have an existing account with this email address. We cannot automatically link your Google account for security reasons.',
    solutions: [
      'Sign in with your email and password first',
      'Then go to Account Settings to link your Google account',
      'Or continue using email/password to sign in',
      'Contact support if you need help linking accounts'
    ]
  },
  'EmailSignin': {
    message: 'Check your email for a sign-in link.',
    details: 'A sign-in link has been sent to your email address.',
    solutions: ['Check your email inbox and spam folder', 'Click the link in the email', 'Request a new sign-in link if needed']
  },
  'CredentialsSignin': {
    message: 'Invalid email or password.',
    details: 'The email and password combination you entered is incorrect.',
    solutions: ['Double-check your email and password', 'Reset your password if forgotten', 'Try signing in with Google instead']
  },
  'SessionRequired': {
    message: 'Please sign in to access this page.',
    details: 'You need to be authenticated to view this content.',
    solutions: ['Sign in to your account', 'Create a new account if you don\'t have one']
  },
  'default': {
    message: 'An unexpected error occurred.',
    details: 'Something went wrong during the authentication process.',
    solutions: ['Try again', 'Clear your browser cache', 'Contact support if the issue persists']
  }
}

export default function AuthError() {
  const router = useRouter()
  const error = router.query.error as string

  const errorInfo = errorMessages[error] || errorMessages.default

  return (
    <AuthLayout>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold">Authentication Error</CardTitle>
          <CardDescription>
            {errorInfo.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">What happened?</h4>
            <p className="text-sm text-muted-foreground">{errorInfo.details}</p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-medium text-sm mb-3">Try these solutions:</h4>
            <ul className="space-y-2">
              {errorInfo.solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{solution}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
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
          
          {/* Technical Details */}
          {error && (
            <div className="mt-6 p-3 bg-muted rounded-md border">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-medium text-muted-foreground">Technical Details</h5>
              </div>
              <p className="text-xs text-muted-foreground">
                Error code: <code className="font-mono bg-background px-1 py-0.5 rounded">{error}</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                If this issue persists, please include this error code when contacting support.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}