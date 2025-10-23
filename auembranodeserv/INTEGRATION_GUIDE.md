# Backend Integration Guide

This guide explains how to integrate the React frontend with the Python FastAPI backend.

## 🔧 **Setup Instructions**

### 1. **Backend Setup**
```bash
# Navigate to Python backend
cd ../pythonbackend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. **Frontend Setup**
```bash
# Navigate to React frontend
cd auembranodeserv

# Install dependencies
npm install

# Start the development server
npm start
```

## 🔗 **API Integration**

### **Authentication Flow**
The frontend integrates with the backend authentication system:

1. **Login**: `POST /api/auth/login`
2. **Register**: `POST /api/auth/register`
3. **Token Refresh**: `POST /api/auth/refresh`
4. **Logout**: `POST /api/auth/logout`

### **Service Layer Architecture**
```
src/
├── services/
│   ├── api.ts              # Axios configuration with interceptors
│   ├── authService.ts      # Authentication operations
│   ├── userService.ts     # User profile management
│   ├── postService.ts      # Social posts operations
│   ├── bookingService.ts   # Booking management
│   └── notificationService.ts # Notifications
├── hooks/
│   ├── usePosts.ts         # React Query hooks for posts
│   ├── useBookings.ts      # React Query hooks for bookings
│   └── useNotifications.ts  # React Query hooks for notifications
└── config/
    └── api.ts              # API configuration and endpoints
```

## 🚀 **Key Features Integrated**

### **1. Authentication Context**
- JWT token management
- Automatic token refresh
- User session persistence
- Role-based access control

### **2. Real-time Data Fetching**
- React Query for caching and synchronization
- Optimistic updates for better UX
- Error handling and retry logic
- Background refetching

### **3. API Services**
- **AuthService**: Login, register, logout, password reset
- **UserService**: Profile management, settings, file uploads
- **PostService**: Social feed, posts, comments, likes
- **BookingService**: Booking management, confirmations
- **NotificationService**: Real-time notifications

## 📡 **API Endpoints Used**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### **User Management**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update settings

### **Social Features**
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create post
- `POST /api/posts/{id}/like` - Like post
- `POST /api/posts/{id}/comments` - Add comment

### **Booking System**
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/{id}/confirm` - Confirm booking
- `POST /api/bookings/{id}/cancel` - Cancel booking

### **Notifications**
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications/{id}/mark-read` - Mark as read

## 🔄 **Data Flow**

### **1. Authentication Flow**
```
User Login → API Call → Token Storage → Context Update → Redirect
```

### **2. Data Fetching Flow**
```
Component Mount → React Query Hook → API Service → Backend → Cache Update
```

### **3. Real-time Updates**
```
User Action → Optimistic Update → API Call → Success/Error → Cache Invalidation
```

## 🛠️ **Configuration**

### **Environment Variables**
Create a `.env` file in the frontend root:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Aeumbra Security
REACT_APP_VERSION=1.0.0
```

### **API Configuration**
The API configuration is centralized in `src/config/api.ts`:
- Base URL configuration
- Endpoint definitions
- Timeout settings
- Retry logic

## 🔒 **Security Features**

### **Token Management**
- Automatic token refresh
- Secure token storage
- Request/response interceptors
- Session timeout handling

### **Error Handling**
- Global error boundaries
- API error standardization
- User-friendly error messages
- Retry mechanisms

## 📱 **Mobile Responsiveness**

### **Responsive Design**
- Mobile-first approach
- Bottom navigation for mobile
- Sidebar for desktop
- Adaptive layouts

### **Performance Optimizations**
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

## 🧪 **Testing Integration**

### **API Testing**
```bash
# Test backend endpoints
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

### **Frontend Testing**
```bash
# Run frontend tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🚀 **Deployment**

### **Backend Deployment**
1. Set up production database
2. Configure environment variables
3. Run migrations
4. Deploy with Docker or cloud service

### **Frontend Deployment**
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, AWS S3)
3. Configure environment variables
4. Set up CDN for assets

## 🔧 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   - Ensure backend CORS is configured
   - Check allowed origins in backend settings

2. **Authentication Issues**
   - Verify JWT secret in backend
   - Check token expiration settings
   - Ensure proper token storage

3. **API Connection Issues**
   - Verify backend is running on correct port
   - Check API_BASE_URL configuration
   - Ensure network connectivity

### **Debug Tools**
- React Query DevTools (development)
- Browser Network tab
- Backend API documentation at `/docs`

## 📚 **Additional Resources**

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Query Documentation](https://react-query.tanstack.com/)
- [Material-UI Documentation](https://mui.com/)
- [Axios Documentation](https://axios-http.com/)

## 🤝 **Support**

For integration issues:
1. Check the browser console for errors
2. Verify backend API responses
3. Review network requests in DevTools
4. Check authentication token validity

---

**Integration Status**: ✅ Complete
**Last Updated**: January 2024
**Version**: 1.0.0
