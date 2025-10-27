# Fix Railway Deployment Issue

## The Problem
Railway can't detect your app because your repository root contains multiple directories (frontend + backend).

## The Solution

### Option 1: Configure Railway Settings (EASIEST) ⭐

1. In Railway dashboard, go to your **backend service settings**
2. Under **Settings** → **Root Directory**, set:
   ```
   pythonbackend
   ```
3. Save the settings
4. Railway will now build from the `pythonbackend/` directory

### Option 2: Use Nixpacks Explicitly

1. Set **Build Command**:
   ```bash
   cd pythonbackend && pip install -r requirements.txt
   ```

2. Set **Start Command**:
   ```bash
   cd pythonbackend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Option 3: Monorepo Structure (Advanced)

If you want to deploy both frontend and backend from the same repo:

1. In Railway, create **TWO** separate services:
   - Service 1: Backend (Root Directory: `pythonbackend`)
   - Service 2: Frontend (Root Directory: `auembranodeserv`)

2. Add PostgreSQL database to the backend service

3. Set environment variables in backend:
   ```
   DATABASE_URL=<from-postgres-service>
   SECRET_KEY=<your-secret-key>
   ```

---

## Quick Fix Commands

If you want to deploy **ONLY** the backend to Railway:

1. **Set Root Directory in Railway Dashboard**:
   - Settings → Root Directory → `pythonbackend`

2. **Verify files exist**:
   ```bash
   ls pythonbackend/
   # Should show: requirements.txt, main.py, railway.toml, etc.
   ```

3. **Set Environment Variables**:
   - `DATABASE_URL` (auto from PostgreSQL service)
   - `SECRET_KEY` (generate a strong key)
   - `ALGORITHM=HS256`
   - `ENVIRONMENT=production`
   - `DEBUG=False`

4. **Redeploy**: Railway will rebuild automatically

---

## Files Created

✅ `pythonbackend/railway.toml` - Railway configuration
✅ `pythonbackend/start.sh` - Start script  
✅ `pythonbackend/runtime.txt` - Python version
✅ `.railwayignore` - Ignore irrelevant files

---

## Verification

After deployment, check:
- Backend URL: `https://your-app.railway.app/api/v1/`
- Health check: `https://your-app.railway.app/health`
- API docs: `https://your-app.railway.app/docs`

