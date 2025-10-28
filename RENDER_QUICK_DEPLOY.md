# 🚀 Quick Deploy to Render

## TL;DR - Steps

1. **Push code**: `git push origin develop`
2. **Go to Render**: https://render.com
3. **Create PostgreSQL database**
4. **Create Web Service**
5. **Add environment variables**
6. **Deploy!**

---

## 📋 Detailed Steps

### 1. Push to GitHub

```bash
cd /Users/suchithkc/projects/aeumbra
git add .
git commit -m "Prepare for Render deployment with Procfile and runtime.txt"
git push origin develop
```

### 2. Create Render Account

- Visit https://render.com
- Sign up with GitHub
- Connect your repository

### 3. Connect to Existing PostgreSQL Database

✅ **Database Already Created!**

- Database Name: `security-app-db`
- In Render Dashboard, click on `security-app-db`
- Go to **"Info"** tab
- Copy the **"Internal Database URL"** 
- Format: `postgres://admin:password@host:5432/aeumbre`

### 4. Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `aeumbra-backend` (or choose your name)
   - **Root Directory**: `pythonbackend`
   - **Environment**: `Python 3`
   - **Build Command**: Leave empty (auto-detected from Procfile)
   - **Start Command**: Leave empty (uses Procfile)
4. Click **"Create Web Service"**

### 5. Add Environment Variables

After creating the service, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | From your `security-app-db` info tab |
| `SECRET_KEY` | Generate with `openssl rand -hex 32` |
| `ENVIRONMENT` | `production` |
| `DEBUG` | `false` |

### 6. Wait for Deploy

- Build takes 2-3 minutes
- Watch the logs
- URL will be: `https://aeumbra-backend.onrender.com`

### 7. Verify Deployment

```bash
# Health check
curl https://aeumbra-backend.onrender.com/health

# Test API
curl https://aeumbra-backend.onrender.com/api/v1/health
```

---

## 📝 Required Files (Already Created)

✅ `pythonbackend/Procfile` - Start command for Render  
✅ `pythonbackend/runtime.txt` - Python version  
✅ `pythonbackend/requirements.txt` - Dependencies  
✅ `pythonbackend/.dockerignore` - Build exclusions  

---

## 🔑 Environment Variables

Add these in Render Dashboard → Your Service → Environment:

| Key | Value | Required |
|-----|-------|----------|
| `DATABASE_URL` | Render PostgreSQL URL | ✅ Yes |
| `SECRET_KEY` | Random string | ✅ Yes |
| `ENVIRONMENT` | `production` | Yes |
| `DEBUG` | `false` | Yes |

---

## 🎯 Quick Commands

```bash
# Generate SECRET_KEY
openssl rand -hex 32

# Test health
curl https://your-backend.onrender.com/health

# Test API
curl https://your-backend.onrender.com/docs
```

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Backend web service deployed
- [ ] Environment variables added
- [ ] Health check passes
- [ ] Can access /docs

---

## 🆘 Common Issues

**Issue**: Build fails
- **Fix**: Check build logs, ensure all dependencies in requirements.txt

**Issue**: Can't connect to database
- **Fix**: Verify DATABASE_URL format: `postgresql+asyncpg://...`

**Issue**: 404 on /docs
- **Fix**: Set ENVIRONMENT=development (docs hidden in production)

---

## 🎉 Next Steps

1. Once backend is live, update frontend API URL
2. Deploy frontend to Vercel/Netlify
3. Update backend CORS with frontend URL
4. Test end-to-end!

