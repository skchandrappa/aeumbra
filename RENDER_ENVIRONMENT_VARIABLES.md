# Environment Variables for Render Service

## Required Environment Variables

### 1. DATABASE_URL
- **Variable**: `DATABASE_URL`
- **Type**: String
- **Description**: PostgreSQL connection string for your Render database
- **Current Value**: 
  ```
  postgresql+asyncpg://admin:lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU@dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com:5432/aeumbre
  ```
- **How to set in Render**: 
  - Go to your Render service
  - Navigate to **Environment** tab
  - Add new environment variable
  - Key: `DATABASE_URL`
  - Value: Copy the connection string above

### 2. SECRET_KEY (Recommended for Production)
- **Variable**: `SECRET_KEY`
- **Type**: String
- **Description**: Secret key for JWT token generation
- **Default**: `your-secret-key-change-in-production` (NOT SECURE for production!)
- **How to generate**: 
  ```bash
  python3 -c 'import secrets; print(secrets.token_urlsafe(32))'
  ```
- **How to set in Render**: 
  - Run the command above to generate a secure key
  - Add as environment variable in Render dashboard

## Optional Environment Variables

### PORT
- **Type**: Integer
- **Description**: Port on which the application will run
- **Note**: Render automatically sets this - DO NOT manually set it
- **Auto-set by Render**: Yes

### ENVIRONMENT
- **Variable**: `ENVIRONMENT`
- **Type**: String
- **Description**: Application environment
- **Recommended Value**: `production`
- **Default**: `development`

### DEBUG
- **Variable**: `DEBUG`
- **Type**: Boolean
- **Description**: Enable/disable debug mode
- **Recommended Value**: `false` (for production)
- **Default**: `true`

## How to Set Environment Variables in Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Go to your **Web Service**
3. Click on the **Environment** tab
4. Scroll down to **Environment Variables**
5. Click **Add Environment Variable**
6. Enter the variable name and value
7. Click **Save Changes**
8. The service will automatically redeploy

## Environment Variables Summary

| Variable | Required | Type | Default Value |
|----------|----------|------|---------------|
| DATABASE_URL | ✅ Yes | String | (see above) |
| SECRET_KEY | ⚠️ Recommended | String | your-secret-key-change-in-production |
| PORT | ❌ No | Integer | Set by Render |
| ENVIRONMENT | ❌ No | String | development |
| DEBUG | ❌ No | Boolean | true |

## Quick Setup for Render

**Minimum Required** (for basic functionality):
```
DATABASE_URL=postgresql+asyncpg://admin:lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU@dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com:5432/aeumbre
```

**Production Recommended**:
```
DATABASE_URL=postgresql+asyncpg://admin:lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU@dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com:5432/aeumbre
SECRET_KEY=<generate-with-command-above>
ENVIRONMENT=production
DEBUG=false
```

## Database Connection (Already Configured)

Your Render PostgreSQL database is already set up with:
- **Host**: `dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com`
- **Database**: `aeumbre`
- **User**: `admin`
- **Password**: `lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU`
- **Port**: `5432`

The connection string is already configured in your `config.py` file, so you just need to set the `DATABASE_URL` environment variable in Render.

