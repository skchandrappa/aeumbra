# 🚀 Render Deployment - FINAL SOLUTION

## ⚠️ IMPORTANT: Use Native Build (NOT Docker)

Render's Docker build has build context issues with monorepo structure.  
**Use Native Python build instead!**

---

## ✅ Quick Deploy Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Configure for Render native build"
git push origin develop
```

### 2. Go to Render Dashboard

- Visit: https://render.com
- Sign up/login
- Connect GitHub repository

### 3. Create Web Service (Native Build)

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. **Configure Settings:**

#### General Settings:
- **Name**: `aeumbra-backend`
- **Region**: Choose closest
- **Branch**: `develop` or `main`

#### Build Settings:
- **Environment**: `Python 3`
- **Root Directory**: `pythonbackend` ⚠️ **IMPORTANT!**
- **Build Command**: Leave **EMPTY** (auto-detected)
- **Start Command**: Leave **EMPTY** (uses `Procfile`)

**Render will automatically:**
- Detect Python from `pythonbackend/runtime.txt`
- Use `pythonbackend/Procfile` for start command
- Install dependencies from `pythonbackend/requirements.txt`

### 4. Add Environment Variables

After creating the service, go to **Environment** tab:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | From `security-app-db` → Info tab → Internal URL |
| `SECRET_KEY` | Generate: `openssl rand -hex 32` |
| `ENVIRONMENT` | `production` |
| `DEBUG` | `false` |

### 5. Deploy!

1. Click **"Create Web Service"**
2. Build will start automatically
3. Wait 2-3 minutes
4. Service URL: `https://aeumbra-backend.onrender.com`

---

## 🎯 Why This Works

### Native Build Benefits:
✅ No Docker build context issues  
✅ Simpler configuration  
✅ Faster builds  
✅ Uses existing `Procfile` and `runtime.txt`  
✅ Auto-detects Python requirements  

### Files Used:
- `pythonbackend/Procfile` → Start command
- `pythonbackend/runtime.txt` → Python version
- `pythonbackend/requirements.txt` → Dependencies

---

## ✅ Verification

```bash
# Health check
curl https://aeumbra-backend.onrender.com/api/v1/health

# Expected response:
# {"status":"ok"}
```

---

## 🚫 DON'T Use Docker

The Dockerfile has build context issues because:
- Render builds from repository root
- COPY commands expect `pythonbackend/` path
- Complex to fix with monorepo structure

**Solution**: Use Native Build instead!

---

## 📝 Summary

1. **Root Directory**: `pythonbackend`
2. **Build Command**: Empty (auto-detect)
3. **Start Command**: Empty (uses Procfile)
4. **Add environment variables**
5. **Deploy!**

---

## 🎉 Done!

Your backend will be live at:
```
https://aeumbra-backend.onrender.com
```

Update your frontend API URL to this!

