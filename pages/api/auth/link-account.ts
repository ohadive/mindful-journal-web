import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { provider, providerAccountId } = req.body

    if (!provider || !providerAccountId) {
      return res.status(400).json({ error: 'Missing provider or providerAccountId' })
    }

    // Check if account is already linked
    const existingAccount = await prisma.account.findFirst({
      where: {
        provider,
        providerAccountId,
        userId: session.user.id
      }
    })

    if (existingAccount) {
      return res.status(200).json({ 
        success: true, 
        message: 'Account already linked',
        account: {
          provider: existingAccount.provider,
          linkedAt: new Date()
        }
      })
    }

    // Check if this OAuth account is linked to a different user
    const accountLinkedToOtherUser = await prisma.account.findFirst({
      where: {
        provider,
        providerAccountId,
        NOT: {
          userId: session.user.id
        }
      }
    })

    if (accountLinkedToOtherUser) {
      return res.status(409).json({ 
        error: 'This account is already linked to another user' 
      })
    }

    // Get current user's accounts to show what's already linked
    const userAccounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      select: { provider: true }
    })

    res.status(200).json({
      success: true,
      message: 'Account linking status checked',
      currentAccounts: userAccounts.map(acc => ({
        provider: acc.provider,
        linkedAt: new Date()
      })),
      canLink: true
    })

  } catch (error) {
    console.error('Link account error:', error)
    res.status(500).json({ 
      error: 'Failed to process account linking',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    })
  }
}