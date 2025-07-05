import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    
    console.log('🛡️ Middleware:', {
      pathname,
      hasToken: !!req.nextauth.token,
      tokenSub: req.nextauth.token?.sub,
      tokenId: req.nextauth.token?.id
    })
    
    // Redirect root to landing page if not authenticated
    if (pathname === '/' && !req.nextauth.token) {
      console.log('🔄 Redirecting unauthenticated user to landing')
      return NextResponse.redirect(new URL('/landing', req.url))
    }
    
    // If user is authenticated and on landing page, redirect to dashboard
    if (pathname === '/landing' && req.nextauth.token) {
      console.log('🔄 Redirecting authenticated user to dashboard')
      return NextResponse.redirect(new URL('/', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        console.log('🔐 Authorization check:', {
          pathname,
          hasToken: !!token,
          tokenSub: token?.sub,
          tokenId: token?.id
        })
        
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
          console.log('✅ Public route allowed:', pathname)
          return true
        }
        
        // Require authentication for all other routes
        const isAuthorized = !!token && (!!token.sub || !!token.id)
        console.log('🔐 Authorization result:', { isAuthorized, hasToken: !!token, hasUserId: !!(token?.sub || token?.id) })
        return isAuthorized
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