# 🚀 Deploy to Render (Native Build - No Docker)

## Why Native Build?
Native build is **simpler** and **faster** for Python apps. Docker is not required!

---

## Step-by-Step Guide

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Add Procfile and runtime.txt for Render"
git push origin develop
```

---

### 2. Create Render Account
- Go to https://render.com
- Sign up with GitHub
- Connect your repository

---

### 3. Get Database URL from security-app-db

✅ **Your Database Already Exists!**

- In Render Dashboard, click on `security-app-db`
- Go to **"Info"** tab
- Copy the **"Internal Database URL"**

---

### 4. Create Web Service

1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repo
4. Configure settings:

**General:**
- **Name**: `aeumbra-backend`
- **Region**: Choose closest to you

**Build:**
- **Root Directory**: `pythonbackend`
- **Build Command**: Leave **EMPTY** (auto-detected from Procfile)
- **Start Command**: Leave **EMPTY** (uses Procfile)

**OR manually set:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

### 5. Add Environment Variables

Go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | From your `security-app-db` info tab |
| `SECRET_KEY` | Generate with: `openssl rand -hex 32` |
| `ENVIRONMENT` | `production` |
| `DEBUG` | `false` |

To generate SECRET_KEY:
```bash
openssl rand -hex 32
```

---

### 6. Deploy!

1. Click **"Create Web Service"**
2. Render will automatically:
   - Detect Python from `runtime.txt`
   - Use `Procfile` for start command
   - Install dependencies from `requirements.txt`
3. Wait 2-3 minutes for build
4. Your service will be live!

---

### 7. Verify Deployment

```bash
# Health check
curl https://aeumbra-backend.onrender.com/api/v1/health
```

---

## 📝 Required Files (Already Created)

✅ `pythonbackend/Procfile`  
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

✅ `pythonbackend/runtime.txt`  
```
python-3.11.5
```

✅ `pythonbackend/requirements.txt`  
(All dependencies listed)

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables added
- [ ] DATABASE_URL from security-app-db
- [ ] Build successful
- [ ] Health check passes

---

## 🎯 Next Steps

1. Update frontend to use Render backend URL
2. Deploy frontend to Vercel/Netlify
3. Update CORS settings if needed
4. Test end-to-end!

---

## 🆘 Troubleshooting

**Build fails**:  
- Check `requirements.txt` exists in `pythonbackend/`
- Verify Python version in `runtime.txt`

**Database connection error**:  
- Check `DATABASE_URL` format
- Ensure database is running

**Import errors**:  
- All dependencies must be in `requirements.txt`
- Check build logs for missing packages

---

## 🎉 Success!

Your backend will be available at:
```
https://aeumbra-backend.onrender.com
```

Update your frontend API URL to point to this!

