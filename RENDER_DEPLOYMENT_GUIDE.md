# 🚀 Render Deployment Guide for Python Backend

## Overview
Deploy your FastAPI backend to Render with PostgreSQL database.

---

## Prerequisites
- ✅ GitHub repository with your code
- ✅ Render account (https://render.com)
- ✅ Git installed locally

---

## Step-by-Step Instructions

### Step 1: Push Code to GitHub

```bash
# Navigate to your project
cd /Users/suchithkc/projects/aeumbra

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Push to GitHub
git push origin main
```

---

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

---

### Step 3: Use Existing PostgreSQL Database

✅ **Your Database Already Exists!**

Database Name: **`security-app-db`**

1. In Render Dashboard, find your `security-app-db` service
2. Click on it to open details
3. Go to **"Info"** tab
4. Copy the **"Internal Database URL"**
5. **Save the connection string** - you'll need it!

The URL format will be:
```
postgres://username:password@host:5432/aeumbre
```

---

### Step 4: Deploy Web Service (Backend)

1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Select your repository
   - Choose branch: `main` or `develop`
4. Configure Build & Deploy:
   - **Name**: `aeumbra-backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     cd pythonbackend && pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     cd pythonbackend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Root Directory**: `pythonbackend`

---

### Step 5: Add Environment Variables

In your Web Service settings, add these environment variables:

1. Go to **"Environment"** tab in your web service settings
2. Click **"Add Environment Variable"**
3. Add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your PostgreSQL connection string from `security-app-db` |
| `SECRET_KEY` | Generate with: `openssl rand -hex 32` |
| `ENVIRONMENT` | `production` |
| `DEBUG` | `false` |

Example `DATABASE_URL`:
```
postgresql+asyncpg://username:password@host:5432/aeumbre
```

---

### Step 6: Update CORS Settings

✅ **Already done!** CORS is configured in `main.py` to allow:
- Localhost (development)
- Render URLs
- Vercel URLs
- All origins for flexibility

---

### Step 7: Deploy!

1. Click **"Save Changes"** after adding environment variables
2. Render will automatically start the build
3. Wait for build to complete (~2-3 minutes)
4. Your backend will be live at: `https://your-service-name.onrender.com`

---

### Step 8: Create Database Tables

Once deployed, run this to create tables:

```bash
# Connect to your Render PostgreSQL
PGPASSWORD=your_password psql -h dpg-xxx.a.oregon-postgres.render.com -U admin aeumbre -f database/security_guard_app_schema.sql
```

**Or** let the app create them automatically on first run!

---

### Step 9: Test Your Deployment

```bash
# Health check
curl https://your-service-name.onrender.com/health

# API docs (production mode - docs disabled by default)
curl https://your-service-name.onrender.com/api/v1/health
```

---

## 📝 Files Needed in Repository

Make sure these files exist:

### `Procfile` (in pythonbackend/)
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### `requirements.txt` (in pythonbackend/)
Should include all dependencies:
```
fastapi
uvicorn
sqlalchemy
asyncpg
pydantic
pydantic-settings
...

```

### `runtime.txt` (in pythonbackend/)
```
python-3.11.5
```

---

## 🎯 Quick Reference

### Render Dashboard URLs
- Render: https://dashboard.render.com
- Your backend: `https://your-backend.onrender.com`
- Your database: Shown in Render dashboard

### Environment Variables Required
```bash
DATABASE_URL=postgresql+asyncpg://admin:password@host/db
SECRET_KEY=your-secret-key
ENVIRONMENT=production
DEBUG=false
```

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created on Render
- [ ] Web service deployed
- [ ] Environment variables added
- [ ] CORS configured
- [ ] Database tables created
- [ ] Health check passing
- [ ] API docs accessible

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Render
- Ensure `requirements.txt` is complete
- Verify Python version in `runtime.txt`

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure network access is allowed

### 500 Errors
- Check application logs in Render
- Verify all environment variables are set
- Ensure database tables exist

---

## 🎉 Success!

Once deployed, your backend will be available at:
```
https://aeumbra-backend.onrender.com
```

Update your frontend to use this URL!

