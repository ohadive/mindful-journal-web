import { z } from 'zod'

// Authentication form schemas
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})

// Type inference
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

// API response types
export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
    createdAt: Date
  }
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface RegisterResponse extends AuthResponse {
  user?: {
    id: string
    email: string
    name: string
    createdAt: Date
  }
}

// Error types
export interface AuthError {
  message: string
  code?: string
  field?: string
}

// User role and permission types
export type UserRole = 'user' | 'admin' | 'moderator'

export interface UserPermissions {
  canWrite: boolean
  canDelete: boolean
  canModerate: boolean
  canAccess: string[]
}

// Session utility types
export interface AuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role?: UserRole
  permissions?: UserPermissions
  createdAt?: Date
}

// Route protection types
export interface ProtectedRouteProps {
  requiredRole?: UserRole
  requiredPermissions?: string[]
  redirectTo?: string
}

// Auth context types
export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: SignUpFormData) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (data: Partial<AuthUser>) => Promise<void>
}