# 🚀 GCP Cloud Run Deployment Guide

Deploy your FastAPI backend to Google Cloud Platform using Docker and Cloud Run - **100% FREE tier available!**

---

## ✅ Why Docker + GCP is Better

| Feature | Railway/Render | Docker + GCP Cloud Run |
|---------|----------------|------------------------|
| **Control** | Limited | Full container control |
| **Scalability** | Auto | Auto with Cloud Run |
| **Cost** | Free tier | **Always Free tier** |
| **Cold Start** | Medium | Fast (< 2s) |
| **Global** | Single region | **Multi-region** |
| **Industry Standard** | Platform-specific | Docker everywhere |
| **Production Ready** | Good | **Enterprise-grade** |

---

## 🆓 GCP FREE Tier Includes

- **Cloud Run**: 2 million requests/month FREE
- **Cloud SQL**: N/A (need separate DB)
- **Container Registry**: Free storage
- **Cloud Build**: 120 build-minutes/month FREE

**Total Cost: $0/month** for small applications! 🎉

---

## 📋 Prerequisites

### 1. Install Google Cloud SDK

#### macOS:
```bash
brew install google-cloud-sdk
```

#### Linux:
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

#### Windows:
Download from: https://cloud.google.com/sdk/docs/install

### 2. Create GCP Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project
gcloud projects create aeumbra-app --name="Aeumbra Security Platform"

# Set as default project
gcloud config set project aeumbra-app
```

### 3. Enable Billing
- Go to: https://console.cloud.google.com/billing
- Create a billing account (but Cloud Run has generous FREE tier)
- Link to your project

---

## 🚀 Quick Deploy (Automated)

### Option 1: One-Command Deploy

```bash
cd pythonbackend
export PROJECT_ID=$(gcloud config get-value project)
./deploy-gcp.sh
```

### Option 2: Manual Step-by-Step

```bash
# 1. Enable APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 2. Build Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/aeumbra-backend

# 3. Deploy to Cloud Run
gcloud run deploy aeumbra-backend \
    --image gcr.io/PROJECT_ID/aeumbra-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

---

## 🗄️ Database Setup on GCP

### Option 1: Cloud SQL (Recommended for Production)

```bash
# Create PostgreSQL instance
gcloud sql instances create aeumbra-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1

# Create database
gcloud sql databases create aeumbra --instance=aeumbra-db

# Create user
gcloud sql users create aeumbra-user \
    --instance=aeumbra-db \
    --password=YOUR_STRONG_PASSWORD
```

### Option 2: External PostgreSQL (FREE Options)

- **Supabase**: FREE PostgreSQL (500MB storage)
- **Neon**: FREE PostgreSQL (512MB storage)
- **Railway**: FREE PostgreSQL (256MB storage)

### Option 3: Local Development DB

Continue using your local PostgreSQL for development.

---

## ⚙️ Environment Variables

Set these in Cloud Run:

```bash
gcloud run services update aeumbra-backend \
    --set-env-vars \
    DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname,\
    SECRET_KEY=your-secret-key,\
    ALGORITHM=HS256,\
    ENVIRONMENT=production
```

Or set via console:
1. Go to Cloud Run → aeumbra-backend
2. Edit & Deploy New Revision
3. Variables and Secrets → Add Variable

---

## 📊 Deploy with CI/CD (GitHub Actions)

Create `.github/workflows/deploy-gcp.yml`:

```yaml
name: Deploy to GCP Cloud Run

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - id: auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Build and Deploy
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/aeumbra-backend
          gcloud run deploy aeumbra-backend \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/aeumbra-backend \
            --region us-central1
```

---

## 🔍 Verify Deployment

### Check Service Status:
```bash
gcloud run services list
```

### View Logs:
```bash
gcloud run services logs read aeumbra-backend --region=us-central1
```

### Test API:
```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe aeumbra-backend \
    --region=us-central1 \
    --format='value(status.url)')

# Test health endpoint
curl $SERVICE_URL/health

# View API docs
open $SERVICE_URL/docs
```

---

## 🎯 Production Checklist

- [ ] GCP project created
- [ ] Billing account linked
- [ ] Docker image built successfully
- [ ] Deployed to Cloud Run
- [ ] Database configured (Cloud SQL or external)
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled (automatic)
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented

---

## 💰 Cost Estimation

### Small Application (Most cases - FREE!):
- **Cloud Run**: $0 (within free tier)
- **Cloud SQL**: $7/month (db-f1-micro) OR FREE external DB
- **Container Registry**: $0
- **Cloud Build**: $0 (within free tier)

**Total: $0-7/month** 🎉

### Medium Application:
- **Cloud Run**: ~$5/month
- **Cloud SQL**: $15/month (db-g1-small)
- **Storage**: $2/month

**Total: ~$22/month**

---

## 🚨 Troubleshooting

### Issue: "Permission denied"
**Solution**:
```bash
gcloud auth login
gcloud projects list
gcloud config set project YOUR_PROJECT_ID
```

### Issue: "Container failed to start"
**Solution**: Check logs:
```bash
gcloud run services logs read aeumbra-backend --region=us-central1 --limit=50
```

### Issue: "Database connection timeout"
**Solution**: 
- Use Cloud SQL proxy for Cloud SQL
- For external DB, ensure IP whitelist is configured
- Check firewall rules

---

## 🎉 Advantages of Docker + GCP

✅ **Portable**: Run anywhere Docker runs  
✅ **Consistent**: Same environment dev/prod  
✅ **Scalable**: Auto-scales to zero  
✅ **Standard**: Industry best practice  
✅ **Secure**: Built-in security scanning  
✅ **Cost-effective**: Pay only for usage  
✅ **Global**: Deploy to multiple regions  

---

## 📝 Files Created

- `Dockerfile` - Container definition
- `.dockerignore` - Ignore files in Docker build
- `cloudbuild.yaml` - CI/CD pipeline
- `deploy-gcp.sh` - One-command deployment script

---

## 🚀 Next Steps

1. **Deploy Backend**: Follow quick deploy steps above
2. **Deploy Frontend**: Deploy React app to Firebase Hosting or Cloud Storage
3. **Link Together**: Update frontend API URL to Cloud Run URL
4. **Custom Domain**: Configure custom domain in Cloud Run
5. **Monitor**: Set up Cloud Monitoring alerts

**Your app will be production-ready! 🎉**

