import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase()
          }
        })

        if (!user || !user.password) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('🔐 SignIn callback:', {
        user: user ? { id: user.id, email: user.email, name: user.name } : null,
        account: account ? { provider: account.provider, type: account.type } : null,
        profile: profile ? { email: profile.email, name: profile.name } : null
      })
      
      try {
        // Allow credentials sign-ins (email/password)
        if (account?.provider === 'credentials') {
          return true
        }
        
        // Handle OAuth sign-ins (Google)
        if (account?.provider === 'google' && profile?.email) {
          // Check if a user with this email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { accounts: true }
          })
          
          if (existingUser) {
            // Check if this Google account is already linked
            const existingAccount = existingUser.accounts.find(
              acc => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId
            )
            
            if (existingAccount) {
              console.log('✅ Google account already linked to user')
              return true
            }
            
            // User exists but Google account not linked - link it
            console.log('🔗 Linking Google account to existing user:', existingUser.email)
            
            try {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  id_token: account.id_token,
                  refresh_token: account.refresh_token,
                  scope: account.scope,
                  session_state: account.session_state,
                  token_type: account.token_type
                }
              })
              
              console.log('✅ Successfully linked Google account to existing user')
              return true
            } catch (linkError) {
              console.error('❌ Failed to link Google account:', linkError)
              return false
            }
          } else {
            // No existing user, allow new account creation
            console.log('👤 Creating new user with Google account')
            return true
          }
        }
        
        // Default allow for other providers
        return true
      } catch (error) {
        console.error('❌ SignIn callback error:', error)
        return false
      }
    },
    
    async session({ session, token }) {
      console.log('📝 Session callback:', {
        sessionUser: session.user ? { id: session.user.id, email: session.user.email } : null,
        tokenSub: token?.sub,
        tokenId: token?.id,
        tokenEmail: token?.email
      })
      
      // For JWT sessions, get user ID from token
      if (token && session.user) {
        // Use token.sub (subject) which contains the user ID for OAuth
        // or token.id for credentials
        session.user.id = token.id as string || token.sub as string
        
        // Ensure email is set from token if not already present
        if (!session.user.email && token.email) {
          session.user.email = token.email as string
        }
        
        // Ensure name is set from token if not already present
        if (!session.user.name && token.name) {
          session.user.name = token.name as string
        }
      }
      
      console.log('📝 Session callback result:', {
        finalSessionUser: session.user ? { id: session.user.id, email: session.user.email } : null
      })
      
      return session
    },
    
    async jwt({ token, user, account, profile }) {
      console.log('🎫 JWT callback:', {
        tokenSub: token.sub,
        userId: user?.id,
        userEmail: user?.email,
        accountProvider: account?.provider,
        isFirstTime: !!user
      })
      
      // First time sign in
      if (user) {
        token.id = user.id
        
        // For OAuth accounts, ensure user data is stored in token
        if (account?.provider !== 'credentials') {
          // For OAuth, we need to get the user ID from the database
          if (user.email) {
            try {
              const dbUser = await prisma.user.findUnique({
                where: { email: user.email }
              })
              if (dbUser) {
                token.id = dbUser.id
                token.sub = dbUser.id // Set sub to user ID for consistency
              }
            } catch (error) {
              console.error('Error fetching user from database:', error)
            }
          }
        }
      }
      
      console.log('🎫 JWT callback result:', {
        finalTokenId: token.id,
        finalTokenSub: token.sub
      })
      
      return token
    },
    
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback:', { url, baseUrl })
      
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`
        console.log('✅ Redirecting to:', redirectUrl)
        return redirectUrl
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        console.log('✅ Redirecting to same origin:', url)
        return url
      }
      
      console.log('✅ Redirecting to base URL:', baseUrl)
      return baseUrl
    }
  },
  
  events: {
    async signIn(message) {
      console.log('🎉 User signed in:', {
        userId: message.user.id,
        email: message.user.email,
        provider: message.account?.provider
      })
    },
    async signOut(message) {
      console.log('👋 User signed out:', {
        sessionToken: message.token?.jti
      })
    },
    async createUser(message) {
      console.log('👤 New user created:', {
        userId: message.user.id,
        email: message.user.email
      })
    },
    async linkAccount(message) {
      console.log('🔗 Account linked:', {
        userId: message.user.id,
        provider: message.account.provider
      })
    },
    async session(message) {
      console.log('📱 Session accessed for user:', message.session.user?.email || 'unknown')
    }
  },
  
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}