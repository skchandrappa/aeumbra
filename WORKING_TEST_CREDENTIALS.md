# Working Test Credentials for Frontend

## Problem Fixed

The error was caused by users in the database having password hashes created with a different scheme than what the backend is currently using.

## Solution

Registered new users with the correct password scheme (pbkdf2_sha256).

---

## Working Test Credentials

### Option 1: Recently Registered User
```
Email: newuser2@example.com
Password: testpass123
User Type: consumer
```

### Option 2: Original Test User
```
Email: test@example.com
Password: testpass123
User Type: consumer
```

---

## How to Test

1. **Open Frontend**: Navigate to `http://localhost:3000` (or your Netlify deployment)

2. **Go to Login Page**: Click on the login button/link

3. **Enter Credentials**: Use one of the credentials above

4. **First Request**: May take 30+ seconds due to Render cold start
   - Be patient!
   - The first request after 15+ minutes of inactivity wakes up the service

5. **Login**: After the first request, you should be logged in successfully

---

## Why the Original Error Happened

The user `newuser@example.com` was registered with a password hash that couldn't be verified with the current scheme. This can happen when:
- User was created with a different password hashing scheme
- Database schema was migrated but password hashes weren't updated
- Different backend versions were used over time

## Solution Applied

New users are registered with the `pbkdf2_sha256` scheme which is compatible with the current backend configuration.

---

## Frontend Deployment

For Netlify deployment, make sure:
1. The frontend build connects to: `https://aeumbra.onrender.com/api/v1`
2. The timeout is set to 30 seconds
3. Users are aware of the cold start delay

---

**Last Updated**: October 28, 2025

