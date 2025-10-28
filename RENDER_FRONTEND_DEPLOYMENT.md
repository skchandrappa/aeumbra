# Deploying Frontend to Render

## Overview

You can deploy your React frontend to Render as a Static Site. This is simpler than deploying as a web service since the frontend is just static files.

## Prerequisites

1. A Render account (free tier is sufficient)
2. Your frontend code on GitHub
3. The built `build/` folder

## Option 1: Deploy Built Frontend Files (Recommended)

Render can serve static files directly. Here's how:

### Step 1: Build the Frontend

The build is already created in `auembranodeserv/build/`. If you need to rebuild:

```bash
cd auembranodeserv
npm run build
```

### Step 2: Create a Render Static Site

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Static Site"**
3. **Connect your repository** or select your GitHub repo
4. **Configure the service**:
   - **Name**: `aeumbra-frontend` (or your preferred name)
   - **Branch**: `develop` (or your main branch)
   - **Root Directory**: `auembranodeserv`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
5. **Click "Create Static Site"**
6. Render will automatically:
   - Detect it's a React app
   - Install dependencies
   - Run the build command
   - Serve the static files

### Step 3: Environment Variables (Optional)

If you need to override the API URL, add in Render:

**Key**: `REACT_APP_API_BASE_URL`
**Value**: `https://aeumbra.onrender.com/api/v1`

(Not needed if using the default in `api.ts`)

### Step 4: Wait for Deployment

- First deploy: 2-5 minutes
- Render will show a live URL when ready
- Example: `https://aeumbra-frontend.onrender.com`

---

## Option 2: Deploy as Web Service (Not Recommended)

You can deploy as a web service, but it's unnecessary for static sites and costs more resources.

---

## Important Configuration

### Update CORS in Backend

After deploying to Render, update the backend CORS settings to allow your frontend URL:

**File**: `pythonbackend/main.py`

Add your Render frontend URL to `allow_origins`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://68fac68582a515d02b55d4ed--sparkling-pika-64b5bf.netlify.app", # Netlify
        "https://aeumbra-frontend.onrender.com", # New Render frontend
        "https://your-render-url.onrender.com", # Your actual Render URL
        "*"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)
```

Then commit and push so the backend redeploys:

```bash
cd pythonbackend
git add main.py
git commit -m "Add Render frontend URL to CORS"
git push origin develop
```

---

## Deployment Steps Summary

1. **Build the frontend** (already done in `auembranodeserv/build/`)
2. **Push to GitHub** (already done)
3. **Go to Render Dashboard**
4. **Create New Static Site**
5. **Connect your repository**
6. **Set Root Directory**: `auembranodeserv`
7. **Set Build Command**: `npm run build`
8. **Set Publish Directory**: `build`
9. **Create the site**
10. **Update backend CORS** with your new frontend URL
11. **Test the deployment**

---

## Expected URLs

After deployment, you'll have:

- **Frontend**: `https://aeumbra-frontend.onrender.com` (or similar)
- **Backend API**: `https://aeumbra.onrender.com`
- **Frontend connects to**: `https://aeumbra.onrender.com/api/v1`

---

## Testing After Deployment

1. Visit your Render frontend URL
2. Navigate to login page
3. Use test credentials:
   - Email: `test@example.com`
   - Password: `testpass123`
4. Wait 30-60 seconds for the first request (cold start)
5. Should login successfully

---

## Cost Consideration

- **Static Site on Render**: Free (generous bandwidth)
- **Backend on Render**: Free (spins down after 15 min inactivity)
- **PostgreSQL on Render**: Not needed (already using Render's free tier)

---

## Alternative: Keep Netlify

If Netlify is working well for you, you can:
1. Keep Netlify for frontend (already deployed)
2. Keep Render for backend only
3. Just update the timeout as we did

This gives you:
- Netlify: Fast CDN for frontend
- Render: Backend API

Both are free tier options.

---

**Last Updated**: October 28, 2025

