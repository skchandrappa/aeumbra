# ✅ Connect Railway to Render PostgreSQL

## Database connection is working!

✅ **Database**: `aeumbre`  
✅ **Host**: `dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com`  
✅ **User**: `admin`  
✅ **Port**: `5432`  
✅ **Version**: PostgreSQL 17.6

---

## 🚀 Steps to Connect Railway Backend

### 1. Go to Railway Dashboard
https://railway.app/dashboard

### 2. Select Your Backend Service
Click on your backend service

### 3. Add Environment Variables
Click on **Variables** tab

### 4. Add DATABASE_URL
Click **"New Variable"**

- **Variable Name**: `DATABASE_URL`
- **Variable Value**: 
  ```
  postgresql://admin:lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU@dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com:5432/aeumbre
  ```

Click **Add**

### 5. Railway Will Redeploy
- Railway detects the new environment variable
- Automatically redeploys your backend
- Your backend will connect to Render PostgreSQL!

---

## 🧪 Test Database Connection

Run this from your terminal:

```bash
# Test connection
PGPASSWORD=lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU psql -h dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com -U admin aeumbre

# Once connected, check tables
\dt

# Exit psql
\q
```

---

## 📊 Database Information

```
Connection String: postgresql://admin:lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU@dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com/aeumbre
Host: dpg-d3vgd9uuk2gs73eidngg-a.oregon-postgres.render.com
Database: aeumbre
User: admin
Password: lA6FHfJrmXRUitVZfRfeMq6sqxlcIHLU
Port: 5432
```

---

## 🔧 What Happens Next?

1. Railway backend connects to Render PostgreSQL
2. Your backend detects the database
3. Tables are created automatically (via Alembic migrations)
4. API works with the remote database!

---

## ✅ Success Indicators

After adding `DATABASE_URL`:
- Railway redeploys automatically
- Check logs - should see "Application startup complete"
- Visit your Railway URL + `/health` - should return OK
- Tables appear in the database after first request

