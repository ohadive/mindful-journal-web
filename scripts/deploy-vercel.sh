#!/bin/bash

echo "🚀 Deploying Mindful Journal to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Set environment variables for production
echo "🔧 Setting up environment variables..."

echo "Setting DATABASE_URL..."
vercel env add DATABASE_URL production <<< "postgres://neondb_owner:npg_XfoWFk9TUb4e@ep-polished-cloud-a2elmkwh-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

echo "Setting NEXTAUTH_URL (replace with your domain)..."
vercel env add NEXTAUTH_URL production <<< "https://your-app-name.vercel.app"

echo "Setting NEXTAUTH_SECRET..."
read -s -p "Enter NEXTAUTH_SECRET: " NEXTAUTH_SECRET
echo ""
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"

echo "Setting GOOGLE_CLIENT_ID..."
read -p "Enter GOOGLE_CLIENT_ID: " GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_ID production <<< "$GOOGLE_CLIENT_ID"

echo "Setting GOOGLE_CLIENT_SECRET..."
read -s -p "Enter GOOGLE_CLIENT_SECRET: " GOOGLE_CLIENT_SECRET
echo ""
vercel env add GOOGLE_CLIENT_SECRET production <<< "$GOOGLE_CLIENT_SECRET"

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔍 Check your deployment at: https://vercel.com/dashboard"
echo "🧪 Test database connection: https://your-app.vercel.app/api/debug/database"