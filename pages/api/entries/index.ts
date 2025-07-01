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

  try {
    switch (req.method) {
      case 'GET':
        return await getEntries(req, res, userId)
      case 'POST':
        return await createEntry(req, res, userId)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getEntries(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { limit = '50', cursor } = req.query

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId,
        isArchived: false,
      },
      select: {
        id: true,
        title: true,
        content: true,
        wordCount: true,
        isPrivate: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { isFavorite: 'desc' }, // Favorites first
        { updatedAt: 'desc' },  // Then by most recent
      ],
      take: parseInt(limit as string),
      ...(cursor && {
        cursor: { id: cursor as string },
        skip: 1,
      }),
    })

    // Generate preview text from content
    const entriesWithPreview = entries.map(entry => {
      // Extract title from content if not set
      const title = entry.title || extractTitleFromContent(entry.content)
      
      // Generate preview text (first 100 characters, no HTML)
      const preview = extractPreviewFromContent(entry.content, 100)
      
      return {
        ...entry,
        title,
        preview,
      }
    })

    // Get next cursor for pagination
    const nextCursor = entries.length === parseInt(limit as string) 
      ? entries[entries.length - 1].id 
      : null

    return res.status(200).json({
      entries: entriesWithPreview,
      nextCursor,
      hasMore: nextCursor !== null,
    })
  } catch (error) {
    console.error('Error fetching entries:', error)
    return res.status(500).json({ error: 'Failed to fetch entries' })
  }
}

async function createEntry(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { title, content, isPrivate = true } = req.body

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Content is required' })
    }

    // Calculate word count
    const wordCount = calculateWordCount(content)

    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        title: title || extractTitleFromContent(content),
        content,
        wordCount,
        isPrivate,
        readingTime: Math.ceil(wordCount / 200), // Assume 200 WPM reading speed
      },
      select: {
        id: true,
        title: true,
        content: true,
        wordCount: true,
        isPrivate: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const preview = extractPreviewFromContent(entry.content, 100)

    return res.status(201).json({
      ...entry,
      preview,
    })
  } catch (error) {
    console.error('Error creating entry:', error)
    return res.status(500).json({ error: 'Failed to create entry' })
  }
}

// Helper functions
function extractTitleFromContent(content: string): string {
  // Remove HTML tags and get first line
  const textContent = content.replace(/<[^>]*>/g, '').trim()
  const firstLine = textContent.split('\n')[0].trim()
  
  // Limit title length
  return firstLine.length > 50 
    ? firstLine.substring(0, 50) + '...'
    : firstLine || 'Untitled Entry'
}

function extractPreviewFromContent(content: string, maxLength: number): string {
  // Remove HTML tags and get clean text
  const textContent = content.replace(/<[^>]*>/g, '').trim()
  
  // Remove extra whitespace and line breaks
  const cleanContent = textContent.replace(/\s+/g, ' ')
  
  return cleanContent.length > maxLength
    ? cleanContent.substring(0, maxLength) + '...'
    : cleanContent
}

function calculateWordCount(content: string): number {
  // Remove HTML tags and count words
  const textContent = content.replace(/<[^>]*>/g, '').trim()
  const words = textContent.split(/\s+/).filter(word => word.length > 0)
  return words.length
}