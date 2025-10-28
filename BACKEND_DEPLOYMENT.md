# 🚀 Deploy FastAPI Backend to Railway

## 📋 **Complete Backend Deployment Guide**

### **Step 1: Prepare Backend for Production**

#### **Files Created:**
- ✅ `Procfile` - Railway deployment command
- ✅ `runtime.txt` - Python version specification  
- ✅ `railway.json` - Railway configuration
- ✅ Updated `main.py` - Production port handling

### **Step 2: Deploy to Railway**

#### **Option A: Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd /Users/suchithkc/projects/aeumbra/pythonbackend
railway init
railway up
```

#### **Option B: Railway Dashboard**
1. **Go to** https://railway.app
2. **Sign up/Login** with GitHub
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Choose** your repository
6. **Set root directory** to `pythonbackend`
7. **Add PostgreSQL database** (free tier)

### **Step 3: Configure Environment Variables**

#### **In Railway Dashboard:**
```
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=your-secret-key-here
ENVIRONMENT=production
FRONTEND_URL=https://your-netlify-app.netlify.app
```

#### **Generate Secret Key:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

### **Step 4: Update Frontend API URL**

#### **Update Netlify Environment Variables:**
1. **Go to** Netlify Dashboard
2. **Select** your site
3. **Go to** Site settings → Environment variables
4. **Add:**
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

#### **Or Update Frontend Code:**
```typescript
// In auembranodeserv/src/config/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend.railway.app';
```

### **Step 5: Database Setup**

#### **Run Migrations:**
```bash
# Connect to Railway database
railway connect

# Run migrations
alembic upgrade head
```

#### **Or Use Railway CLI:**
```bash
railway run alembic upgrade head
```

## 🌐 **Alternative Hosting Options**

### **Option 2: Render**
```bash
# 1. Go to https://render.com
# 2. Connect GitHub repository
# 3. Set build command: pip install -r requirements.txt
# 4. Set start command: uvicorn main:app --host 0.0.0.0 --port $PORT
# 5. Add PostgreSQL database
```

### **Option 3: Fly.io**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy
```

## 🔧 **Production Configuration**

### **Update CORS Settings:**
```python
# In main.py - update CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-netlify-app.netlify.app",  # Add your Netlify URL
        "https://your-custom-domain.com"  # If you have custom domain
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### **Environment Variables for Production:**
```bash
# Backend (Railway)
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
ENVIRONMENT=production
FRONTEND_URL=https://your-app.netlify.app

# Frontend (Netlify)
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_ENVIRONMENT=production
```

## 📊 **Architecture Overview**

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

## 🚀 **Quick Start Commands**

### **Deploy Backend:**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
cd pythonbackend
railway init
railway up

# 3. Get your backend URL
railway domain
```

### **Update Frontend:**
```bash
# 1. Update API URL in Netlify
# 2. Redeploy frontend
git push origin main
```

## 🔒 **Security Considerations**

### **Production Checklist:**
- ✅ **HTTPS only** - Both frontend and backend
- ✅ **CORS configured** - Only allow your frontend domain
- ✅ **Environment variables** - No secrets in code
- ✅ **Database security** - Use connection pooling
- ✅ **Rate limiting** - Prevent abuse
- ✅ **Input validation** - Sanitize all inputs

## 📈 **Monitoring & Analytics**

### **Railway Dashboard:**
- **Deployment logs**
- **Performance metrics**
- **Database usage**
- **Error tracking**

### **Netlify Analytics:**
- **Page views**
- **Build times**
- **Deployment status**

## 🎯 **Expected Results**

### **Your URLs:**
- **Frontend:** `https://your-app.netlify.app`
- **Backend:** `https://your-backend.railway.app`
- **API Docs:** `https://your-backend.railway.app/docs`

### **Features:**
- ✅ **Full-stack application** running in production
- ✅ **Database persistence** for user data
- ✅ **Authentication** working end-to-end
- ✅ **Global CDN** for fast loading
- ✅ **Automatic deployments** from GitHub

---

## 🎉 **Ready to Deploy!**

Your backend will be live and connected to your Netlify frontend! 🚀
