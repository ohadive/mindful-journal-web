import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      emailVerified?: Date | null
      createdAt?: Date
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    email: string
    name?: string | null
    image?: string | null
    emailVerified?: Date | null
    createdAt?: Date
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

// Extend the built-in session types
declare module 'next-auth' {
  interface Profile {
    id?: string
    name?: string
    email?: string
    image?: string
  }
}