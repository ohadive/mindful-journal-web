const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSampleData() {
  try {
    // Create a test user if not exists
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (!user) {
      const hashedPassword = await bcrypt.hash('password123', 12)
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
        }
      })
      console.log('Created test user:', user.email)
    }

    // Create sample journal entries
    const sampleEntries = [
      {
        title: 'Morning Reflections',
        content: '<p>Today started with a beautiful sunrise. I noticed how the light gradually filled my room, and it made me think about new beginnings.</p><p>There\'s something magical about mornings that always fills me with hope and possibility. I want to make the most of today.</p>',
        wordCount: 45,
        isPrivate: true,
        isFavorite: true,
      },
      {
        title: 'Thoughts on Growth',
        content: '<p>Been thinking a lot about personal growth lately. Sometimes it feels like progress is so slow, but looking back at where I was a year ago, I can see how much I\'ve changed.</p><p>Growth isn\'t always linear, and that\'s okay.</p>',
        wordCount: 42,
        isPrivate: true,
        isFavorite: false,
      },
      {
        title: 'Work Stress',
        content: '<p>Had a challenging day at work today. Feeling a bit overwhelmed with all the deadlines, but I know this feeling will pass.</p><p>Taking deep breaths and focusing on one task at a time. Tomorrow is a new day.</p>',
        wordCount: 38,
        isPrivate: true,
        isFavorite: false,
      },
      {
        title: 'Gratitude Practice',
        content: '<p>Three things I\'m grateful for today:</p><ul><li>The warm cup of coffee this morning</li><li>A phone call from an old friend</li><li>The quiet moment of peace I found during lunch</li></ul><p>These small moments make all the difference.</p>',
        wordCount: 52,
        isPrivate: false,
        isFavorite: true,
      },
    ]

    for (const entry of sampleEntries) {
      await prisma.journalEntry.create({
        data: {
          ...entry,
          userId: user.id,
          readingTime: Math.ceil(entry.wordCount / 200),
        }
      })
    }

    console.log('Created sample journal entries')
    console.log('Test user credentials: test@example.com / password123')
  } catch (error) {
    console.error('Error creating sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleData()