import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { getToken } from 'next-auth/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' })
  }

  try {
    // Get session using NextAuth
    const session = await getServerSession(req, res, authOptions)
    
    // Get JWT token directly
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // Check cookies
    const cookies = req.headers.cookie || ''
    const sessionTokens = {
      nextAuthSessionToken: cookies.includes('next-auth.session-token'),
      secureCookies: cookies.includes('__Secure-next-auth.session-token')
    }

    res.status(200).json({
      status: 'OK',
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name
        },
        expires: session.expires
      } : null,
      token: token ? {
        sub: token.sub,
        id: token.id,
        email: token.email,
        name: token.name,
        iat: token.iat,
        exp: token.exp,
        jti: token.jti
      } : null,
      cookies: sessionTokens,
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        hasSecret: !!process.env.NEXTAUTH_SECRET
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug session error:', error)
    res.status(500).json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
    })
  }
}