#!/bin/bash

echo "🚀 Deploying Aeumbra Backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to backend directory
cd pythonbackend

echo "📁 Current directory: $(pwd)"

# Check if already logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    echo "   Run: railway login"
    echo "   This will open your browser for authentication"
    echo ""
    read -p "Press Enter after logging in to Railway..."
fi

echo "🚀 Initializing Railway project..."
railway init

echo "🚀 Deploying backend..."
railway up

echo "🗄️ Adding PostgreSQL database..."
railway add postgresql

echo "🔧 Setting environment variables..."

# Generate secret key
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
echo "Generated SECRET_KEY: $SECRET_KEY"

# Set environment variables
railway variables set SECRET_KEY="$SECRET_KEY"
railway variables set ENVIRONMENT="production"
railway variables set FRONTEND_URL="https://your-netlify-app.netlify.app"

echo "🗄️ Running database migrations..."
railway run alembic upgrade head

echo "🌐 Getting your backend URL..."
BACKEND_URL=$(railway domain)
echo "✅ Your backend is deployed at: $BACKEND_URL"
echo "📚 API Documentation: $BACKEND_URL/docs"
echo "🔍 Health Check: $BACKEND_URL/health"

echo ""
echo "🎯 Next Steps:"
echo "1. Update your Netlify environment variable:"
echo "   REACT_APP_API_BASE_URL=$BACKEND_URL/api/v1"
echo ""
echo "2. Test your backend:"
echo "   Visit: $BACKEND_URL/docs"
echo ""
echo "3. Redeploy your frontend to use the real backend"
echo ""

echo "🎉 Deployment complete!"
