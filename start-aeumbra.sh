#!/bin/bash

echo "🚀 Starting Aeumbra Security App with Tailscale..."

# Get Tailscale IP
TAILSCALE_IP=$(tailscale ip -4)
echo "📍 Your Tailscale IP: $TAILSCALE_IP"

# Start Backend (FastAPI)
echo "🔧 Starting Backend..."
cd /Users/suchithkc/projects/aeumbra/pythonbackend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) on port 8000"

# Start Frontend (React)
echo "🎨 Starting Frontend..."
cd /Users/suchithkc/projects/aeumbra/auembranodeserv
export PATH="/Users/suchithkc/projects/aeumbra/node-v20.10.0-darwin-x64/bin:$PATH"
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID) on port 3000"

echo ""
echo "🌐 Access your app securely at:"
echo "   Frontend: http://$TAILSCALE_IP:3000"
echo "   Backend:  http://$TAILSCALE_IP:8000"
echo ""
echo "📱 Share these URLs with trusted users who have Tailscale installed"
echo "🔒 Only devices in your Tailscale network can access these URLs"
echo ""
echo "Press Ctrl+C to stop all services"

# Keep script running
wait
