import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' })
  }

  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()

    // Check environment variables
    const envCheck = {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      DATABASE_URL: !!process.env.DATABASE_URL
    }

    // Test if we can create a user (dry run)
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: new Date()
    }

    const testAccount = {
      type: 'oauth',
      provider: 'google',
      providerAccountId: 'test123',
      access_token: 'test_token',
      userId: 'test_user_id'
    }

    res.status(200).json({
      status: 'OK',
      database: {
        connected: true,
        userCount,
        accountCount,
        sessionCount
      },
      environment: envCheck,
      googleOAuth: {
        configured: envCheck.GOOGLE_CLIENT_ID && envCheck.GOOGLE_CLIENT_SECRET,
        callbackUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`
      },
      testStructures: {
        userModel: Object.keys(testUser),
        accountModel: Object.keys(testAccount)
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug OAuth error:', error)
    res.status(500).json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
    })
  }
}