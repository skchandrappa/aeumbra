#!/bin/bash

# Deploy Aeumbra Backend to GCP Cloud Run
# Make this executable: chmod +x deploy-gcp.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Aeumbra Backend to Google Cloud Platform...${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it:${NC}"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${BLUE}🔐 Please login to Google Cloud...${NC}"
    gcloud auth login
fi

# Set project
echo -e "${BLUE}📦 Setting GCP project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${BLUE}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    sqladmin.googleapis.com

# Build and push Docker image
echo -e "${BLUE}🐳 Building Docker image...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/aeumbra-backend

# Deploy to Cloud Run
echo -e "${BLUE}☁️  Deploying to Cloud Run...${NC}"
gcloud run deploy aeumbra-backend \
    --image gcr.io/$PROJECT_ID/aeumbra-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8000 \
    --memory 512Mi \
    --cpu 1 \
    --timeout 300 \
    --max-instances 10 \
    --set-env-vars ENVIRONMENT=production

# Get the service URL
SERVICE_URL=$(gcloud run services describe aeumbra-backend \
    --platform managed \
    --region us-central1 \
    --format 'value(status.url)')

echo -e "\n${GREEN}✅ Deployment successful!${NC}\n"
echo -e "${GREEN}📍 Service URL: ${SERVICE_URL}${NC}"
echo -e "${GREEN}📚 API Docs: ${SERVICE_URL}/docs${NC}\n"

