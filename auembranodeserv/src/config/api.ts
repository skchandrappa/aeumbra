// API Configuration
const getApiBaseUrl = () => {
  // If we have an environment variable, use it
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // If we're on ngrok, use relative URLs (proxy will handle routing to backend)
  if (window.location.hostname.includes('ngrok')) {
    return '/api/v1';
  }
  
  // Default to localhost for local development
  return 'http://localhost:8000/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.REACT_APP_APP_NAME || 'Aeumbra Security',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
  USERS: {
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
    UPLOAD_AVATAR: '/users/profile/upload-avatar',
    UPLOAD_COVER: '/users/profile/upload-cover',
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    DETAIL: '/posts/:id',
    UPDATE: '/posts/:id',
    DELETE: '/posts/:id',
    LIKE: '/posts/:id/like',
    UNLIKE: '/posts/:id/like',
    COMMENTS: '/posts/:id/comments',
    MEDIA: '/posts/:id/media',
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    DETAIL: '/bookings/:id',
    UPDATE: '/bookings/:id',
    DELETE: '/bookings/:id',
    CONFIRM: '/bookings/:id/confirm',
    CANCEL: '/bookings/:id/cancel',
    COMPLETE: '/bookings/:id/complete',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: '/notifications/:id/mark-read',
    MARK_ALL_READ: '/notifications/mark-read',
    DELETE: '/notifications/:id',
  },
  VERIFICATION: {
    DOCUMENT_TYPES: '/verification/document-types',
    DOCUMENTS: '/verification/documents',
    SUBMIT_DOCUMENT: '/verification/documents',
    BACKGROUND_CHECKS: '/verification/background-checks',
    ADMIN_PENDING: '/verification/admin/pending',
    ADMIN_APPROVE: '/verification/admin/:id/approve',
    ADMIN_REJECT: '/verification/admin/:id/reject',
  },
  SEARCH: {
    GUARDS: '/search/guards',
    EVENTS: '/search/events',
    LOCATIONS: '/search/locations',
  },
  ANALYTICS: {
    USER_DASHBOARD: '/analytics/user/dashboard',
    BOOKING_STATS: '/analytics/bookings',
    EARNINGS: '/analytics/earnings',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PRICING: '/admin/pricing',
    MODERATION: '/admin/moderation',
  },
};
