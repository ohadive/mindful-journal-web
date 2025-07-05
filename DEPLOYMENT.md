# Vercel Deployment Configuration

## Environment Variables Required

Set these environment variables in your Vercel dashboard (Settings → Environment Variables):

### Database
```
DATABASE_URL = postgres://neondb_owner:npg_XfoWFk9TUb4e@ep-polished-cloud-a2elmkwh-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### NextAuth.js
```
NEXTAUTH_URL = https://your-app-name.vercel.app
NEXTAUTH_SECRET = your-super-secret-jwt-secret-here-make-it-long-and-random
```

### Google OAuth
```
GOOGLE_CLIENT_ID = your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = your-google-client-secret
```

## Vercel CLI Commands

### Install Vercel CLI
```bash
npm i -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy
```bash
vercel --prod
```

### Set Environment Variables via CLI
```bash
# Database URL
vercel env add DATABASE_URL

# NextAuth URL (replace with your actual domain)
vercel env add NEXTAUTH_URL

# NextAuth Secret
vercel env add NEXTAUTH_SECRET

# Google OAuth
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
```

## Important Notes

1. **Database**: Make sure you're using the PostgreSQL URL from Neon, not SQLite
2. **NEXTAUTH_URL**: Must match your Vercel deployment URL exactly
3. **Google OAuth**: Update Google Cloud Console with your Vercel domain
4. **SSL**: Neon requires SSL, ensure `?sslmode=require` is in DATABASE_URL

## Troubleshooting

### SQLite Error on Vercel
- Check that DATABASE_URL is set correctly in Vercel dashboard
- Ensure Prisma schema uses `provider = "postgresql"`
- Verify the build process runs `prisma generate` correctly

### OAuth Issues
- Update Google Cloud Console redirect URIs:
  - `https://your-app.vercel.app/api/auth/callback/google`
- Ensure NEXTAUTH_URL matches your deployment URL exactly

### Database Connection Issues
- Check Neon database is running and accessible
- Verify SSL mode is enabled in connection string
- Test connection string locally first

## Deployment Checklist

- [ ] Environment variables set in Vercel dashboard
- [ ] DATABASE_URL points to PostgreSQL (Neon)
- [ ] NEXTAUTH_URL matches deployment domain
- [ ] Google OAuth redirect URIs updated
- [ ] Build process includes `prisma generate`
- [ ] Database schema deployed to Neon