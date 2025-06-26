import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

export interface AuthenticatedPageProps {
  session: Session
}

/**
 * Higher-order function to protect pages with authentication
 */
export function requireAuth<P = {}>(
  getServerSideProps?: (
    context: GetServerSidePropsContext,
    session: Session
  ) => Promise<{ props: P }>
) {
  return async (context: GetServerSidePropsContext) => {
    const session = await getSession(context)

    if (!session) {
      return {
        redirect: {
          destination: `/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      }
    }

    if (getServerSideProps) {
      const result = await getServerSideProps(context, session)
      return {
        props: {
          ...result.props,
          session,
        },
      }
    }

    return {
      props: {
        session,
      },
    }
  }
}

/**
 * Redirect authenticated users away from auth pages
 */
export function redirectIfAuthenticated() {
  return async (context: GetServerSidePropsContext) => {
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
}

/**
 * Check if user has specific permissions
 */
export function hasPermission(session: Session | null, permission: string): boolean {
  if (!session?.user) return false
  
  // Add your permission logic here
  // For now, all authenticated users have all permissions
  return true
}

/**
 * Get user role from session
 */
export function getUserRole(session: Session | null): string | null {
  if (!session?.user) return null
  
  // Add your role logic here
  // For now, all users are 'user' role
  return 'user'
}