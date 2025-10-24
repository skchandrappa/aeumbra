# 🚀 Deploy FastAPI Backend to Railway - Complete Guide

## 📋 **Prerequisites**
- ✅ Railway CLI installed
- ✅ GitHub repository with backend code
- ✅ Railway account (free tier available)

## 🚀 **Step-by-Step Deployment**

### **Step 1: Login to Railway**
```bash
# Open terminal and run:
railway login

# This will open your browser for authentication
# Click "Authorize Railway" in the browser
```

### **Step 2: Navigate to Backend Directory**
```bash
cd /Users/suchithkc/projects/aeumbra/pythonbackend
```

### **Step 3: Initialize Railway Project**
```bash
# Initialize Railway project
railway init

# This will:
# - Create railway.json config
# - Set up deployment settings
# - Connect to your GitHub repo
```

### **Step 4: Deploy Backend**
```bash
# Deploy your backend
railway up

# This will:
# - Build your FastAPI app
# - Deploy to Railway servers
# - Give you a public URL
```

### **Step 5: Add PostgreSQL Database**
```bash
# Add PostgreSQL database
railway add postgresql

# This will:
# - Create a PostgreSQL database
# - Set DATABASE_URL environment variable
# - Connect your app to the database
```

### **Step 6: Configure Environment Variables**
```bash
# Set environment variables
railway variables set SECRET_KEY="your-secret-key-here"
railway variables set ENVIRONMENT="production"
railway variables set FRONTEND_URL="https://your-netlify-app.netlify.app"

# Generate a secret key:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### **Step 7: Run Database Migrations**
```bash
# Run Alembic migrations
railway run alembic upgrade head

# This will:
# - Create all database tables
# - Set up the database schema
# - Prepare for production use
```

### **Step 8: Get Your Backend URL**
```bash
# Get your backend URL
railway domain

# This will show your backend URL like:
# https://your-backend.railway.app
```

## 🔧 **Manual Deployment (Alternative)**

### **Option A: Railway Dashboard**
1. **Go to** https://railway.app
2. **Sign up/Login** with GitHub
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Choose** your repository
6. **Set root directory** to `pythonbackend`
7. **Add PostgreSQL database** (free tier)
8. **Configure environment variables**

### **Option B: Railway CLI (Recommended)**
```bash
# 1. Login to Railway
railway login

# 2. Navigate to backend
cd pythonbackend

# 3. Initialize project
railway init

# 4. Deploy backend
railway up

# 5. Add database
railway add postgresql

# 6. Set environment variables
railway variables set SECRET_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(32))')"
railway variables set ENVIRONMENT="production"
railway variables set FRONTEND_URL="https://your-netlify-app.netlify.app"

# 7. Run migrations
railway run alembic upgrade head

# 8. Get your URL
railway domain
```

## 📊 **Expected Results**

### **Your Backend URLs:**
- **API Base:** `https://your-backend.railway.app/api/v1`
- **API Docs:** `https://your-backend.railway.app/docs`
- **Health Check:** `https://your-backend.railway.app/health`

### **Database:**
- **PostgreSQL** database automatically created
- **DATABASE_URL** environment variable set
- **All tables** created via migrations

## 🔧 **Environment Variables Required**

```bash
# Required environment variables:
DATABASE_URL=postgresql://user:pass@host:port/db  # Auto-set by Railway
SECRET_KEY=your-secret-key-here                  # Set manually
ENVIRONMENT=production                            # Set manually
FRONTEND_URL=https://your-netlify-app.netlify.app # Set manually
```

## 🚀 **Update Frontend**

### **Step 1: Get Backend URL**
```bash
railway domain
# Copy the URL (e.g., https://your-backend.railway.app)
```

### **Step 2: Update Netlify Environment Variables**
1. **Go to** Netlify Dashboard
2. **Select** your site
3. **Go to** Site settings → Environment variables
4. **Add:**
   ```
   REACT_APP_API_BASE_URL=https://your-backend.railway.app/api/v1
   ```

### **Step 3: Redeploy Frontend**
```bash
# Push changes to trigger Netlify rebuild
git push origin develop
```

## 📈 **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Netlify       │    │   Railway       │    │   Railway       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • React App     │    │ • FastAPI       │    │ • PostgreSQL    │
│ • Static Files  │    │ • Authentication│    │ • User Data     │
│ • Global CDN    │    │ • API Routes    │    │ • Bookings      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 **Testing Your Deployment**

### **Test Backend:**
1. **Visit** `https://your-backend.railway.app/docs`
2. **Check** API documentation loads
3. **Test** health endpoint
4. **Verify** database connection

### **Test Frontend:**
1. **Visit** your Netlify URL
2. **Try logging in** - Should connect to Railway backend
3. **Check** demo banner disappears (real backend working)
4. **Test** all features with real data

## 🔒 **Security Considerations**

### **Production Checklist:**
- ✅ **HTTPS enabled** - Railway provides SSL
- ✅ **CORS configured** - Only allow your frontend domain
- ✅ **Environment variables** - No secrets in code
- ✅ **Database security** - Railway manages connection pooling
- ✅ **Rate limiting** - Consider adding to FastAPI
- ✅ **Input validation** - Already implemented with Pydantic

## 📊 **Monitoring & Analytics**

### **Railway Dashboard:**
- **Deployment logs** - Real-time build and runtime logs
- **Performance metrics** - CPU, memory, network usage
- **Database usage** - Connection count, query performance
- **Error tracking** - Automatic error detection and logging

### **Cost Management:**
- **Free tier** - $5/month credit
- **Database** - Included in free tier
- **Bandwidth** - Generous limits
- **Scaling** - Automatic based on usage

## 🎉 **Success Indicators**

### **Backend Working:**
- ✅ **API docs accessible** at `/docs`
- ✅ **Health check** returns 200
- ✅ **Database connected** and migrations run
- ✅ **Environment variables** set correctly

### **Frontend Connected:**
- ✅ **No demo banner** (using real backend)
- ✅ **Login works** with real authentication
- ✅ **Data persists** between sessions
- ✅ **All features** work with real data

## 🚀 **Quick Commands Summary**

```bash
# Complete deployment in one go:
railway login
cd pythonbackend
railway init
railway up
railway add postgresql
railway variables set SECRET_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(32))')"
railway variables set ENVIRONMENT="production"
railway variables set FRONTEND_URL="https://your-netlify-app.netlify.app"
railway run alembic upgrade head
railway domain
```

---

## 🎯 **Ready to Deploy!**

Your FastAPI backend will be live on Railway with:
- ✅ **Automatic deployments** from GitHub
- ✅ **PostgreSQL database** included
- ✅ **Global CDN** for fast API responses
- ✅ **SSL certificates** automatically managed
- ✅ **Environment variable** management
- ✅ **Real-time monitoring** and logs

**Your full-stack app will be production-ready!** 🚀
