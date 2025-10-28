#!/bin/bash

echo "🚀 Deploying Aeumbra Security App to Production"
echo "================================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔧 Step 1: Deploy Backend to Railway"
echo "===================================="

cd pythonbackend

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Initialize Railway project
echo "🚀 Initializing Railway project..."
railway init

# Deploy backend
echo "📤 Deploying backend to Railway..."
railway up

# Get Railway URL
echo "🌐 Getting Railway URL..."
RAILWAY_URL=$(railway domain)
echo "Backend URL: $RAILWAY_URL"

cd ..

echo ""
echo "🔧 Step 2: Deploy Frontend to Netlify"
echo "====================================="

cd auembranodeserv

# Update environment variables
echo "⚙️  Updating environment variables..."
echo "REACT_APP_API_BASE_URL=$RAILWAY_URL/api/v1" > .env.production

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Deploy to Vercel (alternative to Netlify)
echo "📤 Deploying frontend to Vercel..."
vercel --prod

# Get Vercel URL
echo "🌐 Getting Vercel URL..."
VERCEL_URL=$(vercel ls | grep -o 'https://[^ ]*' | head -1)
echo "Frontend URL: $VERCEL_URL"

cd ..

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo "Backend URL: $RAILWAY_URL"
echo "Frontend URL: $VERCEL_URL"
echo ""
echo "🔧 Next Steps:"
echo "1. Update CORS settings in Railway dashboard"
echo "2. Set FRONTEND_URL environment variable in Railway"
echo "3. Test the deployed application"
echo ""
echo "🎉 Your app is now live and accessible from anywhere!"
