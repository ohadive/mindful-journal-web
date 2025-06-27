import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import Link from 'next/link'
import { AuthForm } from '../../components/auth/auth-form'
import { AuthLayout } from '../../components/auth/auth-layout'

export default function SignUp() {
  return (
    <AuthLayout>
      <AuthForm mode="signup" />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link 
            href="/auth/signin" 
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <Link href="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>
        </p>
      </div>
      
      <div className="mt-4 text-center">
        <Link 
          href="/" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

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