import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { AuthForm } from '../../components/auth/auth-form'
import { AuthLayout } from '../../components/auth/auth-layout'

export default function SignIn() {
  return (
    <AuthLayout>
      <AuthForm mode="signin" />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            href="/auth/signup" 
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
      
      <div className="mt-8 text-center">
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