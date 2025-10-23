# 🔒 Aeumbra App - Tailscale Secure Access Setup

## 📋 **Complete Setup Guide**

### **Step 1: Complete Tailscale Authentication**
```bash
# Run this command in Terminal:
sudo tailscale up
```

**What happens:**
1. Opens browser to https://login.tailscale.com
2. Sign in with Google, GitHub, or Microsoft
3. Authorize your device
4. Returns to terminal when complete

### **Step 2: Get Your Tailscale IP**
```bash
# After authentication, run:
tailscale ip -4
```
**Example output:** `100.64.1.2`

### **Step 3: Start Your App**
```bash
# Run the startup script:
./start-aeumbra.sh
```

**This will:**
- Start backend on port 8000
- Start frontend on port 3000
- Show your Tailscale URLs

### **Step 4: Access Your App**
- **Frontend:** `http://YOUR_TAILSCALE_IP:3000`
- **Backend API:** `http://YOUR_TAILSCALE_IP:8000`
- **API Docs:** `http://YOUR_TAILSCALE_IP:8000/docs`

## 👥 **Sharing Access with Others**

### **For Others to Access:**
1. **Install Tailscale** on their device
2. **Sign in** with the same account
3. **Access your URLs** using your Tailscale IP

### **Example Sharing:**
```
🔒 Secure Access to Aeumbra Security App

Frontend: http://100.64.1.2:3000
Backend:  http://100.64.1.2:8000

Requirements:
- Install Tailscale: https://tailscale.com/download
- Sign in with the same account
- Access the URLs above
```

## 🛡️ **Security Features**

✅ **End-to-end encryption** - All data encrypted
✅ **Zero-trust network** - Only authorized devices
✅ **No public exposure** - Private network only
✅ **Device authentication** - Must be in your network
✅ **Audit logs** - Track all connections

## 🚨 **Troubleshooting**

### **If Tailscale IP changes:**
```bash
# Get current IP
tailscale ip -4

# Restart services with new IP
./start-aeumbra.sh
```

### **If services won't start:**
```bash
# Check if ports are free
lsof -i :3000
lsof -i :8000

# Kill existing processes
pkill -f "python main.py"
pkill -f "npm start"
```

### **If CORS errors:**
- The backend is configured to allow all origins
- Check that both services are running
- Verify Tailscale is connected

## 📱 **Mobile Access**

1. **Install Tailscale** on mobile device
2. **Sign in** with same account
3. **Open browser** and go to your Tailscale IP
4. **Access the app** securely from anywhere

## 🔧 **Advanced Configuration**

### **Custom Domain (Optional):**
```bash
# Set up MagicDNS
tailscale set --accept-dns=false
```

### **Access Control:**
- Go to https://login.tailscale.com/admin
- Manage device access
- Set up access policies

## 📊 **Monitoring**

### **Check Tailscale Status:**
```bash
tailscale status
```

### **View Connected Devices:**
```bash
tailscale status --json
```

### **Check App Health:**
- Frontend: `http://YOUR_IP:3000`
- Backend: `http://YOUR_IP:8000/health`

---

## 🎯 **Quick Start Commands**

```bash
# 1. Authenticate Tailscale
sudo tailscale up

# 2. Get your IP
tailscale ip -4

# 3. Start the app
./start-aeumbra.sh

# 4. Share the URLs with trusted users
```

**Your app is now securely accessible only to devices in your Tailscale network!** 🔒
