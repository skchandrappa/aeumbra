# 🚀 Deploy to Render - Step by Step

## ✅ Current Status

- Database: `security-app-db` (already created on Render)
- Using: Native Python build (NOT Docker)

---

## 📋 Deployment Steps

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Configure for Render native build"
git push origin develop
```

---

### Step 2: In Render Dashboard

Go to: **https://render.com**

1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository

---

### Step 3: Configure Service Settings

#### General:
- **Name**: `aeumbra-backend`
- **Region**: Choose closest to you
- **Branch**: `develop`

#### Build & Deploy:
- **Environment**: **Select "Python"** (important!)
- **Root Directory**: `pythonbackend`
- **Build Command**: **Leave EMPTY**
- **Start Command**: **Leave EMPTY**

Render will automatically detect:
- Python version from `pythonbackend/runtime.txt`
- Start command from `pythonbackend/Procfile`
- Dependencies from `pythonbackend/requirements.txt`

---

### Step 4: Add Environment Variables

After creating the service, click on it and go to **Environment** tab:

Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Go to `security-app-db` → Info tab → Copy "Internal Database URL" |
| `SECRET_KEY` | Run: `openssl rand -hex 32` |
| `ENVIRONMENT` | `production` |
| `DEBUG` | `false` |

---

### Step 5: Deploy!

1. Click **"Create Web Service"** (or **"Save Changes"**)
2. Render will start building
3. Watch the build logs
4. Wait 2-3 minutes
5. Your service will be live!

**Service URL**: `https://aeumbra-backend.onrender.com`

---

## ✅ Verify Deployment

```bash
# Test health endpoint
curl https://aeumbra-backend.onrender.com/api/v1/health

# Expected response:
# {"status":"ok"}
```

---

## 🎯 Important Notes

### ⚠️ Don't Use Docker!
- Render keeps trying to use Docker
- This causes "pythonbackend/ not found" errors
- **Solution**: Select "Python" environment, NOT Docker

### ✅ Use Native Build!
- Environment: Python
- Root Directory: `pythonbackend`
- Build/Start commands: EMPTY

---

## 📁 Required Files (Already Created)

✅ `pythonbackend/Procfile`  
✅ `pythonbackend/runtime.txt`  
✅ `pythonbackend/requirements.txt`  

These files make native build work automatically!

---

## 🆘 Troubleshooting

**"pythonbackend/ not found"**:  
→ Render is using Docker. Change to Python environment in settings.

**Build fails**:  
→ Check build logs for missing dependencies in `requirements.txt`

**Can't connect to database**:  
→ Verify `DATABASE_URL` is correct  
→ Check database is running

---

## 🎉 Success!

Once deployed, update your frontend:
```typescript
// auembranodeserv/src/config/api.ts
export const BASE_URL = "https://aeumbra-backend.onrender.com/api/v1";
```

Then deploy frontend to Vercel/Netlify!

