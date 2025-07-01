import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userId = session.user.id
  const entryId = req.query.id as string

  if (!entryId) {
    return res.status(400).json({ error: 'Entry ID is required' })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getEntry(req, res, userId, entryId)
      case 'PUT':
        return await updateEntry(req, res, userId, entryId)
      case 'DELETE':
        return await deleteEntry(req, res, userId, entryId)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getEntry(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  entryId: string
) {
  try {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        wordCount: true,
        readingTime: true,
        isPrivate: true,
        isFavorite: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    return res.status(200).json(entry)
  } catch (error) {
    console.error('Error fetching entry:', error)
    return res.status(500).json({ error: 'Failed to fetch entry' })
  }
}

async function updateEntry(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  entryId: string
) {
  try {
    const { title, content, isPrivate, isFavorite } = req.body

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId },
    })

    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    // Calculate word count if content is being updated
    const wordCount = content ? calculateWordCount(content) : existingEntry.wordCount

    const updatedEntry = await prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { 
          content,
          wordCount,
          readingTime: Math.ceil(wordCount / 200),
        }),
        ...(isPrivate !== undefined && { isPrivate }),
        ...(isFavorite !== undefined && { isFavorite }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        content: true,
        wordCount: true,
        readingTime: true,
        isPrivate: true,
        isFavorite: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return res.status(200).json(updatedEntry)
  } catch (error) {
    console.error('Error updating entry:', error)
    return res.status(500).json({ error: 'Failed to update entry' })
  }
}

async function deleteEntry(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  entryId: string
) {
  try {
    // Check if entry exists and belongs to user
    const existingEntry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId },
    })

    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    // Soft delete by archiving instead of hard delete
    await prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        isArchived: true,
        updatedAt: new Date(),
      },
    })

    return res.status(200).json({ message: 'Entry archived successfully' })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return res.status(500).json({ error: 'Failed to delete entry' })
  }
}

function calculateWordCount(content: string): number {
  // Remove HTML tags and count words
  const textContent = content.replace(/<[^>]*>/g, '').trim()
  const words = textContent.split(/\s+/).filter(word => word.length > 0)
  return words.length
}