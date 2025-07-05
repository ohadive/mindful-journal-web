# Vercel PostgreSQL Deployment Fix

## Problem
Vercel deployment was getting SQLite errors despite having PostgreSQL configured locally. The issue was with environment variables and build configuration.

## Root Cause
1. **Missing Environment Variables**: DATABASE_URL not properly set in Vercel
2. **Build Process**: Vercel wasn't running proper Prisma commands
3. **Configuration**: No Vercel-specific build configuration

## Solution Applied

### 1. ✅ Verified Prisma Schema
```prisma
datasource db {
  provider = "postgresql"  // ✅ Correct
  url      = env("DATABASE_URL")
}
```

### 2. ✅ Created Vercel Configuration
`vercel.json`:
```json
{
  "buildCommand": "npm run vercel-build",
  "functions": {
    "pages/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "framework": "nextjs"
}
```

### 3. ✅ Enhanced Build Scripts
`package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma db push && next build",
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  }
}
```

### 4. ✅ Environment Variables Required
Set these in Vercel Dashboard (Settings → Environment Variables):

```
DATABASE_URL = postgres://neondb_owner:npg_XfoWFk9TUb4e@ep-polished-cloud-a2elmkwh-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_URL = https://your-app-name.vercel.app

NEXTAUTH_SECRET = your-super-secret-jwt-secret-here

GOOGLE_CLIENT_ID = your-google-client-id.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET = your-google-client-secret
```

### 5. ✅ Debug Endpoints Created
- `/api/debug/database` - Test database connection
- `/api/debug/oauth` - Test OAuth configuration  
- `/api/debug/session` - Test session handling

## Deployment Steps

### Manual Deployment via Vercel CLI:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Set environment variables
vercel env add DATABASE_URL production
# Paste: postgres://neondb_owner:npg_XfoWFk9TUb4e@ep-polished-cloud-a2elmkwh-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

vercel env add NEXTAUTH_URL production
# Paste: https://your-app-name.vercel.app

vercel env add NEXTAUTH_SECRET production
# Paste: your-long-random-secret

vercel env add GOOGLE_CLIENT_ID production
# Paste: your-google-client-id.apps.googleusercontent.com

vercel env add GOOGLE_CLIENT_SECRET production
# Paste: your-google-client-secret

# 4. Deploy
vercel --prod
```

### Or use the deployment script:
```bash
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

## Testing the Fix

### 1. Test Database Connection
```
GET https://your-app.vercel.app/api/debug/database
```
Should return:
```json
{
  "status": "OK",
  "database": {
    "connection": "success",
    "type": "PostgreSQL",
    "isNeon": true
  }
}
```

### 2. Test Authentication
```
GET https://your-app.vercel.app/api/debug/oauth
```

### 3. Test Session Handling
```
GET https://your-app.vercel.app/api/debug/session
```

## Important Notes

1. **Database URL**: Must include `?sslmode=require` for Neon
2. **NEXTAUTH_URL**: Must exactly match your Vercel deployment URL
3. **Google OAuth**: Update redirect URIs in Google Cloud Console
4. **Build Process**: `vercel-build` ensures Prisma generates correctly

## Verification Checklist

- [ ] Environment variables set in Vercel dashboard
- [ ] DATABASE_URL points to Neon PostgreSQL
- [ ] Build process completes successfully
- [ ] `/api/debug/database` returns PostgreSQL connection
- [ ] Authentication works with OAuth
- [ ] No SQLite errors in deployment logs

## Common Issues & Solutions

### Still getting SQLite errors?
1. Clear Vercel cache: `vercel --prod --force`
2. Verify environment variables in Vercel dashboard
3. Check build logs for Prisma generation

### Database connection fails?
1. Test DATABASE_URL locally first
2. Ensure SSL mode is enabled
3. Check Neon database is running

### OAuth issues?
1. Update Google Cloud Console redirect URIs
2. Verify NEXTAUTH_URL is correct
3. Check environment variables are set

The deployment should now work correctly with PostgreSQL instead of SQLite!