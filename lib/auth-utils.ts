import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'
import { authOptions } from './auth'

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
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
      return {
        redirect: {
          destination: `/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      }
    }

    // Clean session data to prevent serialization issues
    const cleanSession: Session = {
      ...session,
      user: {
        ...session.user,
        email: session.user.email || '',
        name: session.user.name || null,
      }
    }

    if (getServerSideProps) {
      const result = await getServerSideProps(context, cleanSession)
      return {
        props: {
          ...result.props,
          session: cleanSession,
        },
      }
    }

    return {
      props: {
        session: cleanSession,
      },
    }
  }
}

/**
 * Redirect authenticated users away from auth pages
 */
export function redirectIfAuthenticated() {
  return async (context: GetServerSidePropsContext) => {
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