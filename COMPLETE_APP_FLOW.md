# Security Guard App - Complete User Flow Documentation

## 🎯 **Overview**
This document outlines the complete user journey for both **Guards** and **Consumers** in the security guard freelancing platform, covering all APIs, database tables, and business cases.

---

## 🔐 **PHASE 1: ONBOARDING & AUTHENTICATION**

### **1.1 User Registration Flow**
```
1. POST /api/auth/register
   - Create user account (users table)
   - Generate email verification token
   - Send verification email

2. POST /api/auth/verify-email
   - Verify email address
   - Activate user account
   - Create initial profile (profiles table)
   - Create default settings (user_settings table)

3. POST /api/auth/login
   - Authenticate user
   - Generate JWT access & refresh tokens
   - Update last_login timestamp
```

### **1.2 Profile Setup**
```
4. PUT /api/users/profile
   - Complete profile information
   - Set user_type (guard/consumer/admin)
   - Add demographics and location data
   - Upload profile picture and cover photo

5. PUT /api/users/settings
   - Configure notification preferences
   - Set privacy settings
   - Choose language and timezone
   - Enable/disable two-factor authentication
```

---

## 🛡️ **GUARD-SPECIFIC FLOW**

### **2.1 Guard Onboarding & Verification**
```
6. GET /api/verification/document-types
   - View required documents for guards
   - Check verification requirements

7. POST /api/verification/documents
   - Upload identity documents (ID, passport)
   - Upload professional certifications
   - Upload background check documents
   - Submit for verification

8. POST /api/verification/background-checks
   - Initiate criminal background check
   - Submit employment verification
   - Request reference checks

9. GET /api/verification/documents
   - Track verification status
   - View pending/approved/rejected documents

10. Admin Review Process:
    - GET /api/verification/admin/pending
    - POST /api/verification/admin/{id}/approve
    - POST /api/verification/admin/{id}/reject
```

### **2.2 Guard Profile & Availability Setup**
```
11. PUT /api/users/profile
    - Add professional experience
    - Set years of experience
    - Add certifications and skills
    - Set availability schedule
    - Define service areas and travel distance

12. POST /api/users/profile/upload-avatar
    - Upload professional headshot
    - Update profile visibility

13. Configure pricing (when pricing API is implemented):
    - Set hourly rates by location
    - Define special service pricing
    - Set availability windows
```

### **2.3 Guard Social Presence**
```
14. POST /api/posts
    - Create professional posts
    - Share work updates and achievements
    - Post availability announcements
    - Share security tips and insights

15. POST /api/posts/{id}/media
    - Add photos from security events
    - Upload training certificates
    - Share professional videos

16. Engage with community:
    - Like and comment on other posts
    - Follow other guards and consumers
    - Build professional network
```

### **2.4 Guard Booking Management**
```
17. GET /api/bookings
    - View incoming booking requests
    - Check booking calendar
    - Filter by date, location, event type

18. POST /api/bookings/{id}/confirm
    - Accept booking requests
    - Confirm availability
    - Add guard-specific notes

19. POST /api/bookings/{id}/complete
    - Mark booking as completed
    - Add completion notes
    - Update work history

20. POST /api/bookings/{id}/cancel
    - Cancel bookings if necessary
    - Provide cancellation reason
    - Handle emergency situations
```

### **2.5 Guard Payment & Earnings**
```
21. GET /api/payments/methods
    - View payment methods
    - Add bank account details
    - Set up direct deposit

22. GET /api/analytics/user/dashboard
    - View earnings summary
    - Track completed bookings
    - Monitor performance metrics
    - View payment history
```

---

## 👥 **CONSUMER-SPECIFIC FLOW**

### **3.1 Consumer Profile Setup**
```
23. PUT /api/users/profile
    - Complete consumer profile
    - Add company/organization details
    - Set location and service areas
    - Define security needs

24. POST /api/verification/documents
    - Upload business license (if required)
    - Submit company verification
    - Add emergency contact information
```

### **3.2 Consumer Event Planning**
```
25. GET /api/search/guards
    - Search for available guards
    - Filter by location, experience, ratings
    - View guard profiles and reviews

26. GET /api/search/events
    - Browse event types
    - Check guard availability
    - Compare pricing options
```

### **3.3 Consumer Booking Process**
```
27. POST /api/bookings
    - Create new booking request
    - Specify event details and requirements
    - Set date, time, and location
    - Add special requirements
    - Select preferred guards

28. GET /api/bookings
    - Track booking status
    - View booking history
    - Manage upcoming events

29. PUT /api/bookings/{id}
    - Modify booking details
    - Update requirements
    - Change event timing
```

### **3.4 Consumer Payment Process**
```
30. POST /api/payments/methods
    - Add payment methods
    - Set up credit cards
    - Configure billing preferences

31. POST /api/payments/process
    - Process booking payments
    - Handle payment confirmations
    - Manage refunds if needed
```

### **3.5 Consumer Review & Feedback**
```
32. POST /api/reviews
    - Rate guard performance
    - Write detailed reviews
    - Provide feedback on service

33. GET /api/reviews
    - View own reviews given
    - Check review responses
    - Track rating history
```

---

## 🔄 **SHARED FLOWS**

### **4.1 Social Interaction**
```
34. GET /api/posts
    - Browse community posts
    - Discover security insights
    - Stay updated with industry news

35. POST /api/posts/{id}/like
    - Like interesting posts
    - Show appreciation for content

36. POST /api/posts/{id}/comments
    - Comment on posts
    - Ask questions
    - Share experiences

37. Follow other users:
    - Build professional network
    - Stay connected with regular clients
    - Follow industry leaders
```

### **4.2 Communication & Notifications**
```
38. GET /api/notifications
    - View all notifications
    - Check booking updates
    - Read system messages

39. POST /api/notifications/mark-read
    - Mark notifications as read
    - Manage notification preferences

40. GET /api/notifications/unread-count
    - Check unread notification count
    - Stay updated in real-time
```

### **4.3 Dispute Resolution**
```
41. POST /api/complaints
    - File complaints about service
    - Report inappropriate behavior
    - Request dispute resolution

42. GET /api/complaints
    - Track complaint status
    - View complaint history
    - Check resolution updates

43. Admin Resolution:
    - Review complaints
    - Investigate issues
    - Provide resolutions
    - Update complaint status
```

---

## 📊 **ADMIN FLOWS**

### **5.1 Platform Management**
```
44. GET /api/admin/dashboard
    - View platform statistics
    - Monitor user activity
    - Check system health

45. GET /api/admin/users
    - Manage user accounts
    - Handle user reports
    - Monitor user behavior

46. GET /api/admin/moderation/posts
    - Review flagged content
    - Moderate inappropriate posts
    - Manage content policies
```

### **5.2 Verification Management**
```
47. GET /api/verification/admin/pending
    - Review pending verifications
    - Check document authenticity
    - Process verification requests

48. POST /api/verification/admin/{id}/approve
    - Approve verified documents
    - Grant verification status
    - Update user permissions

49. POST /api/verification/admin/{id}/reject
    - Reject invalid documents
    - Request additional information
    - Provide rejection reasons
```

---

## 🗄️ **DATABASE TABLE USAGE BY FLOW**

### **Authentication & Users**
- `users` - User accounts and authentication
- `profiles` - User profile information
- `user_settings` - User preferences and settings
- `user_follows` - Social connections

### **Verification System**
- `verification_document_types` - Document requirements
- `verifications` - Document submissions
- `background_checks` - Background verification
- `verification_document_types` - Document categories

### **Social Features**
- `posts` - User posts and content
- `post_media` - Media attachments
- `post_likes` - Post engagement
- `post_comments` - Comments and discussions
- `comment_likes` - Comment engagement

### **Booking System**
- `event_types` - Event categories
- `bookings` - Booking requests and management
- `booking_status_history` - Status tracking
- `pricing_zones` - Geographic pricing
- `guard_pricing` - Guard-specific rates
- `pricing_factors` - Dynamic pricing factors

### **Payment System**
- `payment_methods` - User payment options
- `transactions` - Payment processing
- `transaction_status_history` - Payment tracking

### **Reviews & Feedback**
- `reviews` - User reviews and ratings
- `review_responses` - Review replies
- `review_votes` - Review helpfulness

### **Complaints & Disputes**
- `complaint_categories` - Complaint types
- `complaints` - Dispute reports
- `complaint_updates` - Resolution tracking

### **Notifications**
- `notification_types` - Notification categories
- `notifications` - User notifications

### **System Management**
- `app_settings` - Platform configuration

---

## 🔄 **TYPICAL USER JOURNEYS**

### **New Guard Journey (First Time)**
1. Register → Verify Email → Complete Profile
2. Upload Documents → Submit for Verification
3. Wait for Admin Approval → Get Verified
4. Set Availability → Configure Pricing
5. Start Accepting Bookings → Build Reviews
6. Grow Social Presence → Expand Network

### **New Consumer Journey (First Time)**
1. Register → Verify Email → Complete Profile
2. Search for Guards → Compare Options
3. Create First Booking → Process Payment
4. Experience Service → Leave Review
5. Build Guard Network → Repeat Bookings

### **Returning User Journey**
1. Login → Check Notifications
2. Browse Feed → Engage Socially
3. Manage Bookings → Process Payments
4. Update Profile → Maintain Verification
5. Handle Disputes → Provide Feedback

---

## 🎯 **KEY BUSINESS CASES COVERED**

### **Guard Success Cases**
- ✅ Complete verification and onboarding
- ✅ Set up professional profile and pricing
- ✅ Accept and complete bookings
- ✅ Build reputation through reviews
- ✅ Grow social presence and network
- ✅ Manage earnings and payments

### **Consumer Success Cases**
- ✅ Find and book qualified guards
- ✅ Manage event security needs
- ✅ Process payments securely
- ✅ Provide feedback and reviews
- ✅ Build trusted guard relationships
- ✅ Handle disputes professionally

### **Platform Success Cases**
- ✅ Maintain quality through verification
- ✅ Facilitate secure transactions
- ✅ Enable social community building
- ✅ Provide dispute resolution
- ✅ Generate analytics and insights
- ✅ Scale with user growth

This comprehensive flow covers all implemented APIs and database tables, providing a complete roadmap for both user types and all business scenarios in the security guard freelancing platform.
