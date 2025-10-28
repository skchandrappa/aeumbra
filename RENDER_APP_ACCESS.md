# Render App Access - Complete Setup Guide

## 🎯 Application URL
**Once deployed, your API will be available at:**
```
https://aeumbra-backend.onrender.com
```
(Replace with your actual Render service URL if different)

## 🔐 Required Environment Variables

### In Render Dashboard → Your Service → Environment Tab

Add these environment variables:

#### 1. DATABASE_URL (Required)
```
Key: DATABASE_URL
Value: postgresql+asyncpg://admin:lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU@dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com:5432/aeumbre
```

#### 2. SECRET_KEY (Required for Production)
```
Key: SECRET_KEY
Value: cqv9uTRGiJIjmZbUXkqzuNkyqharCxQ3V9b8m7nyEVI
```

#### 3. ENVIRONMENT (Optional but Recommended)
```
Key: ENVIRONMENT
Value: production
```

#### 4. DEBUG (Optional but Recommended)
```
Key: DEBUG
Value: false
```

## 📋 Quick Setup Steps

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com
   - Navigate to your service

2. **Open Environment Tab**
   - Click on your service
   - Click on **"Environment"** in the left sidebar

3. **Add Environment Variables**
   - Click **"Add Environment Variable"**
   - Add each of the 4 variables listed above
   - Click **"Save Changes"**

4. **Deploy**
   - Render will automatically rebuild with new environment variables

## 🔑 Secret Key Details

### Generated Secret Key
```
cqv9uTRGiJIjmZbUXkqzuNkyqharCxQ3V9b8m7nyEVI
```

### What it's used for
- JWT token generation for authentication
- Session security
- API security

### Storage
- ✅ Safe to use: This key is randomly generated and secure
- ⚠️ Never commit this key to version control
- ⚠️ Keep this key secret and private

## 🌐 Database Connection

### PostgreSQL Database (Already Configured)
- **Host**: `dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com`
- **Database**: `aeumbre`
- **User**: `admin`
- **Password**: `lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU`
- **Port**: `5432`

### Connection Status
✅ Database is already set up and tables are created

## 🚀 Testing Your API

Once deployed, test the API with:

### Health Check
```bash
curl https://aeumbra-backend.onrender.com/health
```

### API Docs (Swagger)
```
https://aeumbra-backend.onrender.com/docs
```

### API Base URL
```
https://aeumbra-backend.onrender.com/api/v1
```

## 📱 Frontend Integration

Update your frontend API config to point to:
```
https://aeumbra-backend.onrender.com
```

## 🛠️ Build Configuration

- **Runtime**: Python 3.11
- **Build**: Docker
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 📊 Monitoring

Monitor your service in Render Dashboard:
- **Logs**: View real-time logs
- **Metrics**: CPU, Memory, Response times
- **Events**: Deployments and errors

## 🔒 Security Checklist

- ✅ Secure secret key generated
- ✅ Environment variables set
- ✅ Database connection secured
- ✅ CORS configured
- ✅ HTTPS enabled (by default on Render)

## 📞 Support Resources

- Render Documentation: https://render.com/docs
- Your service logs: Available in Render Dashboard
- Database logs: PostgreSQL logs in Render

---

**Next Steps:**
1. Add environment variables in Render
2. Wait for deployment to complete
3. Test API endpoints
4. Update frontend to use production URL

