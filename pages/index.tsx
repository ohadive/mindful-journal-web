import { GetServerSideProps } from 'next'
import { requireAuth, AuthenticatedPageProps } from '../lib/auth-utils'

// Redirect authenticated users to dashboard
export default function Home({ session }: AuthenticatedPageProps) {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Use requireAuth to handle authentication, but then redirect to dashboard
  const result = await requireAuth()(context)
  
  // If requireAuth returns a redirect (unauthenticated), return it
  if ('redirect' in result) {
    return result
  }
  
  // If authenticated, redirect to dashboard
  return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  }
}