import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow in both development and production for debugging deployment issues
  
  try {
    // Test basic database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as connection_test`
    
    // Test user table exists and get count
    const userCount = await prisma.user.count()
    
    // Test account table for OAuth
    const accountCount = await prisma.account.count()
    
    // Get database URL info (without exposing credentials)
    const databaseUrl = process.env.DATABASE_URL || ''
    const isPostgres = databaseUrl.includes('postgres://') || databaseUrl.includes('postgresql://')
    const isSQLite = databaseUrl.includes('sqlite') || databaseUrl.includes('.db')
    const isNeon = databaseUrl.includes('neon.tech')
    
    // Check Prisma client info
    const prismaVersion = require('@prisma/client/package.json').version
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        connection: 'success',
        type: isPostgres ? 'PostgreSQL' : isSQLite ? 'SQLite' : 'Unknown',
        isNeon,
        userCount,
        accountCount,
        rawTest: dbTest
      },
      prisma: {
        version: prismaVersion,
        clientGenerated: true
      },
      deployment: {
        platform: process.env.VERCEL ? 'Vercel' : 'Local',
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'localhost'
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    
    const databaseUrl = process.env.DATABASE_URL || ''
    const isPostgres = databaseUrl.includes('postgres://') || databaseUrl.includes('postgresql://')
    const isSQLite = databaseUrl.includes('sqlite') || databaseUrl.includes('.db')
    
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'UnknownError',
        code: (error as any)?.code || 'UNKNOWN'
      },
      database: {
        configured: !!process.env.DATABASE_URL,
        type: isPostgres ? 'PostgreSQL' : isSQLite ? 'SQLite' : 'Unknown',
        urlPresent: !!databaseUrl,
        urlLength: databaseUrl.length
      },
      deployment: {
        platform: process.env.VERCEL ? 'Vercel' : 'Local',
        region: process.env.VERCEL_REGION || 'unknown'
      },
      troubleshooting: {
        suggestions: [
          'Check DATABASE_URL environment variable is set correctly',
          'Ensure Prisma schema matches database type',
          'Verify database is accessible from deployment region',
          'Check if database requires SSL connection'
        ]
      }
    })
  }
}