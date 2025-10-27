# PostgreSQL Setup on Railway

## 🔍 Answer: Railway Does NOT Include PostgreSQL Server

Railway provides **PostgreSQL as a separate managed service** that you need to **add to your project**.

---

## ✅ How Railway PostgreSQL Works

### 1. **Add PostgreSQL Service** (FREE Tier Available)
   - Go to your Railway project dashboard
   - Click **"New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway will automatically provision a PostgreSQL database

### 2. **Auto-Generated Connection String**
   - Railway automatically creates a `DATABASE_URL` environment variable
   - This will be available to your backend service
   - Format: `postgresql://user:password@host:port/dbname`

### 3. **Your Backend Connects Automatically**
   - Your FastAPI app uses the `DATABASE_URL` environment variable
   - No additional configuration needed!

---

## 🚀 Complete Setup Steps

### Step 1: Create PostgreSQL Service in Railway

1. In Railway dashboard, click **"New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will create and provision the database

### Step 2: Link Backend to PostgreSQL

1. Click on your **backend service**
2. Go to **Variables** tab
3. Click **"New Variable"**
4. Railway will show the PostgreSQL connection automatically
5. Click **"Connect"** or add manually:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

### Step 3: Additional Environment Variables

Add these environment variables to your backend service:

```bash
# Database (auto from PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secret
SECRET_KEY=your-super-secret-key-change-this-in-production

# Algorithm
ALGORITHM=HS256

# Token Expiration
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Environment
ENVIRONMENT=production
DEBUG=False

# CORS (add your frontend domain)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

---

## 🗄️ Database Schema Setup

### Option 1: Auto-Create Tables (Recommended for Production)

Update your `main.py` to auto-create tables on startup:

```python
# In main.py lifespan function
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    
    # Startup
    async with AsyncSessionLocal() as session:
        # Create all tables
        from db.base import Base
        engine = AsyncSessionLocal.bind
        await engine.run_sync(Base.metadata.create_all)
        print("✅ Database tables created successfully")
    
    yield
    
    # Shutdown
    print("🛑 Application shutting down")
```

### Option 2: Manual Migration (For Production)

If you have migrations, you can run them in the build command:

Update `railway.toml`:
```toml
[build]
builder = "NIXPACKS"
buildCommand = "pip install -r requirements.txt && python -m alembic upgrade head"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

---

## 📊 Railway PostgreSQL Pricing

### Free Tier
- **Storage**: 256 MB
- **Connections**: Up to 5
- **Backups**: 7 days retention
- **Price**: FREE

### Paid Tier
- **Storage**: 1 GB - Unlimited
- **Connections**: Unlimited
- **Backups**: 30 days retention
- **Price**: Starting at $5/month

**Note**: Free tier is sufficient for development and small applications!

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] PostgreSQL service created in Railway
- [ ] `DATABASE_URL` environment variable set
- [ ] Backend service connected to PostgreSQL
- [ ] Application starts without database errors
- [ ] Tables created successfully (check logs)
- [ ] API endpoints working
- [ ] Can create users/posts via API

---

## 🔍 How to Check Your Database

### Using Railway Dashboard:
1. Click on **PostgreSQL** service
2. Go to **"Data"** tab
3. You can view tables and data directly

### Using Railway CLI:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Connect to database
railway connect

# Run SQL commands
railway shell
```

### Using psql (if you have it installed):
```bash
# Get connection string from Railway
railway variables

# Connect using psql
psql $DATABASE_URL
```

---

## 🚨 Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: 
- Verify `DATABASE_URL` is set correctly
- Check Railway PostgreSQL service is running
- Ensure your backend service is connected to PostgreSQL service

### Issue: "Table does not exist"
**Solution**:
- Ensure `DATABASE_URL` uses correct database name
- Check if `Base.metadata.create_all()` is being called
- Review startup logs for table creation errors

### Issue: "Connection timeout"
**Solution**:
- Check if PostgreSQL service is provisioned
- Verify network connectivity
- Increase connection pool timeout in settings

---

## 📝 Important Notes

1. **Data Persistence**: Railway PostgreSQL data persists even if you redeploy
2. **Auto-scaling**: Railway handles database scaling automatically
3. **SSL**: All connections are encrypted with SSL by default
4. **Backups**: Free tier includes 7-day backup retention
5. **Connection Pooling**: Use the `DATABASE_URL` directly; Railway handles pooling

---

## 🎯 Summary

✅ **Railway does NOT run PostgreSQL server**  
✅ **Railway provides managed PostgreSQL as a separate service**  
✅ **You must add PostgreSQL service to your project**  
✅ **It's FREE for small projects**  
✅ **Very easy to set up** (just click "Add PostgreSQL")

Your backend will automatically use the `DATABASE_URL` that Railway provides!

