import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    
    // Redirect root to landing page if not authenticated
    if (pathname === '/' && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/landing', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to auth pages and public routes
        const publicRoutes = [
          '/auth/signin', 
          '/auth/signup', 
          '/auth/error', 
          '/landing',
          '/privacy',
          '/terms',
          '/help',
          '/features',
          '/pricing',
          '/security'
        ]
        
        if (publicRoutes.includes(pathname)) {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
)

export const config = {
  matcher: [
    // Match all pages except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}