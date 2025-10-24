# Complete Deployment Guide for Aeumbra Security App

## 🎯 **Goal: Host Backend + Frontend for Free**

### **Option 1: Railway Backend + Netlify Frontend (Recommended)**

#### **Step 1: Deploy Backend to Railway**

1. **Sign up for Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Deploy backend
   cd pythonbackend
   railway init
   railway up
   ```

3. **Configure Environment Variables:**
   - `DATABASE_URL` (Railway provides this)
   - `SECRET_KEY` (generate a random string)
   - `FRONTEND_URL` (your Netlify URL)

#### **Step 2: Deploy Frontend to Netlify**

1. **Build Frontend:**
   ```bash
   cd auembranodeserv
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Connect GitHub repo
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **Configure Environment Variables:**
   - `REACT_APP_API_BASE_URL` = `https://your-railway-backend.railway.app/api/v1`

### **Option 2: Render (All-in-One)**

#### **Step 1: Deploy Backend to Render**

1. **Create Web Service:**
   - Go to [render.com](https://render.com)
   - Connect GitHub repo
   - Select `pythonbackend` folder
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Add PostgreSQL Database:**
   - Create new PostgreSQL database
   - Copy connection string to `DATABASE_URL`

#### **Step 2: Deploy Frontend to Render**

1. **Create Static Site:**
   - Select `auembranodeserv` folder
   - Set build command: `npm install && npm run build`
   - Set publish directory: `build`

2. **Configure Environment Variables:**
   - `REACT_APP_API_BASE_URL` = `https://your-render-backend.onrender.com/api/v1`

### **Option 3: Vercel (Serverless)**

#### **Step 1: Deploy Backend to Vercel**

1. **Create `vercel.json` in `pythonbackend`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "main.py"
       }
     ]
   }
   ```

2. **Deploy:**
   ```bash
   cd pythonbackend
   vercel --prod
   ```

#### **Step 2: Deploy Frontend to Vercel**

1. **Deploy Frontend:**
   ```bash
   cd auembranodeserv
   vercel --prod
   ```

2. **Configure Environment Variables:**
   - `REACT_APP_API_BASE_URL` = `https://your-vercel-backend.vercel.app/api/v1`

## 🔧 **Configuration Files Needed**

### **For Railway Backend:**

#### **`pythonbackend/railway.json`:**
```json
{
  "name": "aeumbra-backend",
  "buildCommand": "pip install -r requirements.txt",
  "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"
}
```

#### **`pythonbackend/Procfile`:**
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### **For Netlify Frontend:**

#### **`auembranodeserv/netlify.toml`:**
```toml
[build]
  publish = "build"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "20.10.0"
  NPM_FLAGS = "--production=false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🚀 **Quick Start Commands**

### **Railway + Netlify (Recommended):**

```bash
# 1. Deploy Backend to Railway
cd pythonbackend
railway login
railway init
railway up

# 2. Get Railway URL
railway domain

# 3. Update Frontend Config
cd ../auembranodeserv
# Update REACT_APP_API_BASE_URL in .env

# 4. Deploy Frontend to Netlify
npm run build
# Upload build folder to Netlify or connect GitHub
```

### **Render (All-in-One):**

```bash
# 1. Deploy Backend
# Go to render.com, connect GitHub, select pythonbackend

# 2. Deploy Frontend  
# Go to render.com, create static site, select auembranodeserv

# 3. Update Environment Variables
# Set REACT_APP_API_BASE_URL to your backend URL
```

## 💰 **Cost Comparison**

| Service | Free Tier | Backend | Frontend | Database |
|---------|-----------|---------|----------|----------|
| **Railway + Netlify** | ✅ Free | Railway | Netlify | Railway PostgreSQL |
| **Render** | ✅ Free | Render | Render | Render PostgreSQL |
| **Vercel** | ✅ Free | Vercel | Vercel | External (Supabase) |

## 🎯 **Recommended: Railway + Netlify**

**Why this combination:**
- ✅ **Railway:** Excellent for Python/FastAPI backends
- ✅ **Netlify:** Best for React frontends
- ✅ **Free:** Both have generous free tiers
- ✅ **Easy:** Simple deployment process
- ✅ **Reliable:** Production-ready services

## 📱 **Final Result**

After deployment, you'll have:
- ✅ **Backend:** `https://your-backend.railway.app`
- ✅ **Frontend:** `https://your-app.netlify.app`
- ✅ **Database:** PostgreSQL on Railway
- ✅ **Real Data:** No more mock data
- ✅ **External Access:** Anyone can use your app

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Update `FRONTEND_URL` in backend environment variables

2. **Database Connection:**
   - Check `DATABASE_URL` is set correctly

3. **Build Failures:**
   - Check Node.js version in Netlify settings
   - Check Python version in Railway settings

4. **API Not Working:**
   - Verify `REACT_APP_API_BASE_URL` is set correctly
   - Check backend logs in Railway dashboard

## 🚀 **Next Steps**

1. **Choose your preferred option** (Railway + Netlify recommended)
2. **Follow the deployment steps**
3. **Test the deployed app**
4. **Share the URL with others**

Your app will be live and accessible from anywhere! 🎉
