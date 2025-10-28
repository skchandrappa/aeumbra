# Security Guard App - API Specification

## Overview
This document outlines the comprehensive API endpoints needed for the security guard freelancing platform, organized by functional modules and following RESTful principles.

---

## 🔐 Authentication & User Management APIs

### User Registration & Authentication
```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/resend-verification
```

### User Profile Management
```http
GET    /api/users/profile
PUT    /api/users/profile
PATCH  /api/users/profile
DELETE /api/users/profile
GET    /api/users/{user_id}/public-profile
POST   /api/users/profile/upload-avatar
POST   /api/users/profile/upload-cover
```

### User Settings
```http
GET    /api/users/settings
PUT    /api/users/settings
PATCH  /api/users/settings
POST   /api/users/settings/notifications
POST   /api/users/settings/privacy
POST   /api/users/settings/security
```

---

## 🔍 Verification & Trust APIs

### Document Verification
```http
GET    /api/verification/documents
POST   /api/verification/documents
GET    /api/verification/documents/{doc_id}
PUT    /api/verification/documents/{doc_id}
DELETE /api/verification/documents/{doc_id}
POST   /api/verification/documents/{doc_id}/submit
GET    /api/verification/document-types
```

### Background Checks
```http
GET    /api/verification/background-checks
POST   /api/verification/background-checks
GET    /api/verification/background-checks/{check_id}
POST   /api/verification/background-checks/{check_id}/initiate
GET    /api/verification/background-checks/{check_id}/status
```

### Admin Verification Management
```http
GET    /api/admin/verification/pending
POST   /api/admin/verification/{doc_id}/approve
POST   /api/admin/verification/{doc_id}/reject
GET    /api/admin/verification/statistics
```

---

## 📱 Social Features APIs

### Posts & Content
```http
GET    /api/posts
POST   /api/posts
GET    /api/posts/{post_id}
PUT    /api/posts/{post_id}
DELETE /api/posts/{post_id}
GET    /api/posts/user/{user_id}
GET    /api/posts/feed
GET    /api/posts/trending
```

### Media Management
```http
POST   /api/posts/{post_id}/media
GET    /api/posts/{post_id}/media
DELETE /api/posts/{post_id}/media/{media_id}
POST   /api/media/upload
POST   /api/media/upload-multiple
```

### Social Interactions
```http
POST   /api/posts/{post_id}/like
DELETE /api/posts/{post_id}/like
GET    /api/posts/{post_id}/likes
POST   /api/posts/{post_id}/comments
GET    /api/posts/{post_id}/comments
PUT    /api/comments/{comment_id}
DELETE /api/comments/{comment_id}
POST   /api/comments/{comment_id}/like
DELETE /api/comments/{comment_id}/like
```

### Social Connections
```http
POST   /api/users/{user_id}/follow
DELETE /api/users/{user_id}/follow
GET    /api/users/{user_id}/followers
GET    /api/users/{user_id}/following
GET    /api/users/suggestions
```

---

## 📅 Booking System APIs

### Event Types & Services
```http
GET    /api/event-types
POST   /api/event-types
GET    /api/event-types/{type_id}
PUT    /api/event-types/{type_id}
DELETE /api/event-types/{type_id}
```

### Booking Management
```http
GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/{booking_id}
PUT    /api/bookings/{booking_id}
DELETE /api/bookings/{booking_id}
POST   /api/bookings/{booking_id}/confirm
POST   /api/bookings/{booking_id}/cancel
POST   /api/bookings/{booking_id}/complete
```

### Booking Search & Discovery
```http
GET    /api/bookings/search
GET    /api/bookings/available-guards
GET    /api/bookings/guard/{guard_id}
GET    /api/bookings/consumer/{consumer_id}
GET    /api/bookings/status/{status}
```

### Booking Status Management
```http
GET    /api/bookings/{booking_id}/status-history
POST   /api/bookings/{booking_id}/status
PUT    /api/bookings/{booking_id}/status
```

---

## 💰 Pricing & Payment APIs

### Pricing Management
```http
GET    /api/pricing/zones
POST   /api/pricing/zones
GET    /api/pricing/zones/{zone_id}
PUT    /api/pricing/zones/{zone_id}
GET    /api/pricing/guard/{guard_id}
POST   /api/pricing/guard/{guard_id}
PUT    /api/pricing/guard/{guard_id}
GET    /api/pricing/calculate
```

### Payment Methods
```http
GET    /api/payment-methods
POST   /api/payment-methods
GET    /api/payment-methods/{method_id}
PUT    /api/payment-methods/{method_id}
DELETE /api/payment-methods/{method_id}
POST   /api/payment-methods/{method_id}/set-default
```

### Transactions
```http
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/{transaction_id}
GET    /api/transactions/booking/{booking_id}
GET    /api/transactions/user/{user_id}
POST   /api/transactions/{transaction_id}/refund
```

### Payment Processing
```http
POST   /api/payments/process
POST   /api/payments/confirm
POST   /api/payments/cancel
GET    /api/payments/{payment_id}/status
POST   /api/payments/webhook/stripe
POST   /api/payments/webhook/paypal
```

---

## ⭐ Review & Rating APIs

### Reviews Management
```http
GET    /api/reviews
POST   /api/reviews
GET    /api/reviews/{review_id}
PUT    /api/reviews/{review_id}
DELETE /api/reviews/{review_id}
GET    /api/reviews/user/{user_id}
GET    /api/reviews/booking/{booking_id}
```

### Review Interactions
```http
POST   /api/reviews/{review_id}/response
GET    /api/reviews/{review_id}/responses
POST   /api/reviews/{review_id}/vote
DELETE /api/reviews/{review_id}/vote
GET    /api/reviews/{review_id}/votes
```

### Rating Analytics
```http
GET    /api/reviews/analytics/user/{user_id}
GET    /api/reviews/statistics/user/{user_id}
GET    /api/reviews/trending
```

---

## 🚨 Complaint & Dispute APIs

### Complaint Management
```http
GET    /api/complaints
POST   /api/complaints
GET    /api/complaints/{complaint_id}
PUT    /api/complaints/{complaint_id}
GET    /api/complaints/user/{user_id}
GET    /api/complaints/booking/{booking_id}
```

### Complaint Resolution
```http
POST   /api/complaints/{complaint_id}/update
GET    /api/complaints/{complaint_id}/updates
POST   /api/complaints/{complaint_id}/resolve
POST   /api/complaints/{complaint_id}/escalate
GET    /api/complaints/categories
```

### Admin Complaint Management
```http
GET    /api/admin/complaints
GET    /api/admin/complaints/pending
POST   /api/admin/complaints/{complaint_id}/assign
POST   /api/admin/complaints/{complaint_id}/resolve
GET    /api/admin/complaints/statistics
```

---

## 🔔 Notification APIs

### Notification Management
```http
GET    /api/notifications
POST   /api/notifications/mark-read
POST   /api/notifications/mark-all-read
DELETE /api/notifications/{notification_id}
GET    /api/notifications/unread-count
```

### Notification Preferences
```http
GET    /api/notifications/preferences
PUT    /api/notifications/preferences
POST   /api/notifications/test
```

### Push Notifications
```http
POST   /api/notifications/push/register
POST   /api/notifications/push/unregister
POST   /api/notifications/push/send
```

---

## 🔍 Search & Discovery APIs

### Guard Search
```http
GET    /api/search/guards
GET    /api/search/guards/nearby
GET    /api/search/guards/available
POST   /api/search/guards/advanced
GET    /api/search/guards/filters
```

### Event Search
```http
GET    /api/search/events
GET    /api/search/events/nearby
POST   /api/search/events/advanced
GET    /api/search/events/filters
```

### General Search
```http
GET    /api/search
GET    /api/search/suggestions
GET    /api/search/autocomplete
```

---

## 📊 Analytics & Reporting APIs

### User Analytics
```http
GET    /api/analytics/user/dashboard
GET    /api/analytics/user/bookings
GET    /api/analytics/user/earnings
GET    /api/analytics/user/performance
```

### Platform Analytics
```http
GET    /api/analytics/platform/overview
GET    /api/analytics/platform/bookings
GET    /api/analytics/platform/revenue
GET    /api/analytics/platform/users
```

### Admin Reports
```http
GET    /api/admin/analytics/dashboard
GET    /api/admin/analytics/users
GET    /api/admin/analytics/bookings
GET    /api/admin/analytics/financial
POST   /api/admin/analytics/export
```

---

## 🛠️ System & Configuration APIs

### App Configuration
```http
GET    /api/config/app
GET    /api/config/features
GET    /api/config/pricing
PUT    /api/config/app
```

### System Health
```http
GET    /api/health
GET    /api/health/database
GET    /api/health/payments
GET    /api/health/notifications
```

### File Management
```http
POST   /api/files/upload
GET    /api/files/{file_id}
DELETE /api/files/{file_id}
POST   /api/files/upload-multiple
```

---

## 📱 Mobile-Specific APIs

### Location Services
```http
POST   /api/location/update
GET    /api/location/nearby-guards
GET    /api/location/nearby-events
POST   /api/location/geofence
```

### Offline Support
```http
GET    /api/sync/data
POST   /api/sync/upload
GET    /api/sync/status
```

### Push Notifications
```http
POST   /api/mobile/push/register
POST   /api/mobile/push/token
DELETE /api/mobile/push/token
```

---

## 🔒 Security & Admin APIs

### User Management (Admin)
```http
GET    /api/admin/users
GET    /api/admin/users/{user_id}
PUT    /api/admin/users/{user_id}
POST   /api/admin/users/{user_id}/suspend
POST   /api/admin/users/{user_id}/activate
DELETE /api/admin/users/{user_id}
```

### Content Moderation
```http
GET    /api/admin/moderation/posts
GET    /api/admin/moderation/reviews
POST   /api/admin/moderation/flag
POST   /api/admin/moderation/approve
POST   /api/admin/moderation/reject
```

### System Monitoring
```http
GET    /api/admin/monitoring/logs
GET    /api/admin/monitoring/errors
GET    /api/admin/monitoring/performance
GET    /api/admin/monitoring/usage
```

---

## 📋 API Response Standards

### Standard Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "errors": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "code": "INVALID_EMAIL",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "user_type": "guard",
  "permissions": ["read:profile", "write:bookings"],
  "iat": 1642248000,
  "exp": 1642251600
}
```

### Permission Levels
- **Public**: No authentication required
- **User**: Authenticated user required
- **Guard**: Guard role required
- **Consumer**: Consumer role required
- **Admin**: Admin role required
- **Super Admin**: Super admin role required

---

## 📊 Rate Limiting

### Rate Limit Tiers
```yaml
Authentication APIs: 10 requests/minute
Search APIs: 100 requests/minute
Booking APIs: 20 requests/minute
Payment APIs: 5 requests/minute
Social APIs: 200 requests/minute
Admin APIs: 50 requests/minute
```

---

## 🚀 Implementation Priority

### Phase 1: Core APIs (MVP)
1. Authentication & User Management
2. Basic Booking System
3. Payment Processing
4. Review System

### Phase 2: Enhanced Features
1. Social Features
2. Advanced Search
3. Notification System
4. Analytics

### Phase 3: Advanced Features
1. Admin Management
2. Advanced Analytics
3. Mobile-Specific APIs
4. System Monitoring

---

## 📝 API Documentation

### Documentation Tools
- **OpenAPI/Swagger**: Interactive API documentation
- **Postman Collections**: API testing and examples
- **API Versioning**: v1, v2, etc.
- **SDK Generation**: Auto-generated client libraries

### Testing Strategy
- **Unit Tests**: Individual endpoint testing
- **Integration Tests**: End-to-end workflow testing
- **Load Testing**: Performance and scalability testing
- **Security Testing**: Authentication and authorization testing

This comprehensive API specification covers all the functionality needed for your security guard freelancing platform, from basic user management to advanced analytics and admin features.
