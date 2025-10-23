# Security Guard Freelancing App - Database Schema

## Overview
This database schema supports a comprehensive security guard freelancing platform similar to Uber, with social features inspired by Instagram and Facebook. The system enables security guards to offer their services, consumers to book security for events, and includes robust payment, review, and dispute resolution systems.

## Database Architecture

### Technology Stack
- **Database**: PostgreSQL 12+
- **Features**: JSONB, Arrays, Generated Columns, Triggers, Views
- **Design Pattern**: Normalized relational database with hierarchical structure

---

## Hierarchical Table-Level Logical Data Model

### Level 1: Core Foundation Tables
```
┌─────────────────────────────────────────────────────────────┐
│                    CORE FOUNDATION                         │
├─────────────────────────────────────────────────────────────┤
│  users                    │  Authentication & basic data   │
│  profiles                 │  Extended user information     │
│  user_settings           │  User preferences & privacy     │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: Foundation layer for all user-related functionality
**Key Features**: Authentication, demographics, location data, user types (Guard/Consumer/Admin)

---

### Level 2: Verification & Trust Layer
```
┌─────────────────────────────────────────────────────────────┐
│                VERIFICATION & TRUST                        │
├─────────────────────────────────────────────────────────────┤
│  verification_document_types  │  Document type definitions │
│  verifications               │  User document submissions  │
│  background_checks          │  Background verification    │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: Establishes trust and verification for platform users
**Dependencies**: Level 1 (users)
**Key Features**: Document verification, background checks, compliance tracking

---

### Level 3: Social & Content Layer
```
┌─────────────────────────────────────────────────────────────┐
│                SOCIAL & CONTENT                            │
├─────────────────────────────────────────────────────────────┤
│  posts                     │  User-generated content       │
│  post_media               │  Media attachments            │
│  post_likes               │  Content engagement           │
│  post_comments            │  User interactions            │
│  comment_likes            │  Comment engagement           │
│  user_follows             │  Social connections           │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: Social media functionality for guards to share updates
**Dependencies**: Level 1 (users)
**Key Features**: Posts, media sharing, likes, comments, social following

---

### Level 4: Service Definition Layer
```
┌─────────────────────────────────────────────────────────────┐
│                SERVICE DEFINITION                          │
├─────────────────────────────────────────────────────────────┤
│  event_types              │  Types of security events      │
│  pricing_zones            │  Geographic pricing areas      │
│  guard_pricing           │  Guard-specific pricing        │
│  pricing_factors         │  Dynamic pricing factors       │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: Defines available services and pricing structure
**Dependencies**: Level 1 (users), Level 2 (verification)
**Key Features**: Event categorization, geographic pricing, dynamic rate calculation

---

### Level 5: Booking & Transaction Layer
```
┌─────────────────────────────────────────────────────────────┐
│              BOOKING & TRANSACTION                         │
├─────────────────────────────────────────────────────────────┤
│  bookings                 │  Main booking records          │
│  booking_status_history   │  Booking status tracking       │
│  payment_methods         │  User payment options          │
│  transactions            │  Financial transactions        │
│  transaction_status_history │ Transaction status tracking │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: Core business logic for service bookings and payments
**Dependencies**: Level 1 (users), Level 4 (service definition)
**Key Features**: Booking management, payment processing, status tracking

---

### Level 6: Feedback & Quality Layer
```
┌─────────────────────────────────────────────────────────────┐
│              FEEDBACK & QUALITY                            │
├─────────────────────────────────────────────────────────────┤
│  reviews                  │  User ratings & feedback       │
│  review_responses         │  Guard responses to reviews    │
│  review_votes             │  Review helpfulness voting     │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: Quality assurance and reputation management
**Dependencies**: Level 1 (users), Level 5 (bookings)
**Key Features**: Multi-dimensional ratings, review responses, reputation system

---

### Level 7: Dispute Resolution Layer
```
┌─────────────────────────────────────────────────────────────┐
│              DISPUTE RESOLUTION                            │
├─────────────────────────────────────────────────────────────┤
│  complaint_categories     │  Types of complaints           │
│  complaints              │  Dispute records               │
│  complaint_updates       │  Complaint communication       │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: Handles conflicts and dispute resolution
**Dependencies**: Level 1 (users), Level 5 (bookings)
**Key Features**: Complaint tracking, resolution workflow, communication logs

---

### Level 8: Communication Layer
```
┌─────────────────────────────────────────────────────────────┐
│                COMMUNICATION                               │
├─────────────────────────────────────────────────────────────┤
│  notification_types       │  Notification templates        │
│  notifications           │  User notifications            │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: User communication and notifications
**Dependencies**: Level 1 (users)
**Key Features**: Multi-channel notifications, templated messages

---

### Level 9: System Configuration Layer
```
┌─────────────────────────────────────────────────────────────┐
│              SYSTEM CONFIGURATION                          │
├─────────────────────────────────────────────────────────────┤
│  app_settings            │  Application configuration      │
└─────────────────────────────────────────────────────────────┘
```

**Purpose**: System-wide configuration and settings
**Dependencies**: None (system-level)
**Key Features**: Configurable parameters, feature flags, business rules

---

## Table Relationships Summary

### Primary Relationships
```
users (1) ──── (1) profiles
users (1) ──── (1) user_settings
users (1) ──── (0..n) verifications
users (1) ──── (0..n) posts
users (1) ──── (0..n) bookings (as guard)
users (1) ──── (0..n) bookings (as consumer)
users (1) ──── (0..n) transactions (as payer)
users (1) ──── (0..n) transactions (as payee)
users (1) ──── (0..n) reviews (as reviewer)
users (1) ──── (0..n) reviews (as reviewed)
```

### Secondary Relationships
```
bookings (1) ──── (0..n) transactions
bookings (1) ──── (0..n) reviews
bookings (1) ──── (0..n) complaints
posts (1) ──── (0..n) post_media
posts (1) ──── (0..n) post_likes
posts (1) ──── (0..n) post_comments
reviews (1) ──── (0..n) review_responses
complaints (1) ──── (0..n) complaint_updates
```

### Many-to-Many Relationships
```
users (n) ──── (n) users (via user_follows)
posts (n) ──── (n) users (via post_likes)
comments (n) ──── (n) users (via comment_likes)
reviews (n) ──── (n) users (via review_votes)
```

---

## Key Design Patterns

### 1. **Hierarchical Design**
- **Foundation First**: Core user data at the base
- **Layered Dependencies**: Each level builds upon previous levels
- **Clear Separation**: Distinct functional layers

### 2. **Audit Trail Pattern**
- **Status History Tables**: Track changes over time
- **Created/Updated Timestamps**: Automatic timestamp management
- **Change Tracking**: Who made what changes when

### 3. **Soft Delete Pattern**
- **Status Fields**: Use status instead of hard deletes
- **Data Preservation**: Maintain referential integrity
- **Recovery Capability**: Can restore "deleted" data

### 4. **Flexible Metadata Pattern**
- **JSONB Fields**: Store variable data structures
- **Array Fields**: Handle multiple values efficiently
- **Generated Columns**: Automatic calculations

### 5. **Social Media Pattern**
- **Engagement Tracking**: Likes, comments, shares
- **Content Hierarchy**: Posts → Media → Interactions
- **Social Graph**: Follow relationships

---

## Performance Optimizations

### Indexes
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);

-- Location-based searches
CREATE INDEX idx_profiles_location ON profiles(latitude, longitude);
CREATE INDEX idx_bookings_location ON bookings(latitude, longitude);

-- Time-based queries
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_bookings_datetime ON bookings(start_datetime, end_datetime);

-- Status filtering
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_transactions_status ON transactions(status);
```

### Views
```sql
-- Guard profiles with ratings
CREATE VIEW guard_profiles_with_ratings AS ...

-- Booking summaries
CREATE VIEW booking_summary AS ...
```

---

## Data Integrity Features

### Constraints
- **Check Constraints**: Validate data ranges and values
- **Foreign Key Constraints**: Maintain referential integrity
- **Unique Constraints**: Prevent duplicate data
- **Generated Columns**: Automatic calculations

### Triggers
- **Updated_at Triggers**: Automatic timestamp updates
- **Engagement Counters**: Real-time like/comment counts
- **Status History**: Automatic status change tracking

---

## Security Considerations

### Data Protection
- **Password Hashing**: Secure password storage
- **PII Encryption**: Sensitive data protection
- **Access Control**: Role-based permissions

### Privacy Features
- **Profile Visibility**: User-controlled privacy settings
- **Location Sharing**: Optional location tracking
- **Anonymous Reviews**: Privacy-preserving feedback

---

## Scalability Features

### Horizontal Scaling
- **Geographic Partitioning**: Location-based data distribution
- **User Sharding**: User-based data partitioning
- **Read Replicas**: Separate read/write operations

### Vertical Scaling
- **Optimized Indexes**: Fast query performance
- **Efficient Queries**: Well-structured relationships
- **Caching Strategy**: Frequently accessed data

---

## Migration Strategy

### Phase 1: Core Foundation
1. Create user tables (users, profiles, settings)
2. Implement authentication system
3. Add basic verification

### Phase 2: Social Features
1. Add posts and media tables
2. Implement engagement features
3. Add social connections

### Phase 3: Booking System
1. Create booking tables
2. Implement pricing system
3. Add payment processing

### Phase 4: Quality & Support
1. Add review system
2. Implement complaint resolution
3. Add notification system

### Phase 5: Optimization
1. Add performance indexes
2. Create materialized views
3. Implement caching

---

## Maintenance Guidelines

### Regular Tasks
- **Index Maintenance**: Monitor and optimize indexes
- **Data Archiving**: Archive old transactions and logs
- **Performance Monitoring**: Track query performance
- **Backup Strategy**: Regular database backups

### Monitoring
- **Query Performance**: Slow query identification
- **Storage Usage**: Database size monitoring
- **Connection Pooling**: Connection management
- **Error Tracking**: Application error monitoring

---

## File Structure
```
database/
├── README.md                           # This file
├── security_guard_app_schema.sql      # Complete schema
├── security_guard_app_er_diagram.md   # ER diagram
└── createtable.sql                    # Original schema (legacy)
```

---

## Quick Start

1. **Create Database**:
   ```sql
   CREATE DATABASE security_guard_app;
   ```

2. **Run Schema**:
   ```bash
   psql -d security_guard_app -f security_guard_app_schema.sql
   ```

3. **Verify Installation**:
   ```sql
   \dt  -- List all tables
   \dv  -- List all views
   ```

---

## Support

For questions about this database schema:
- Review the ER diagram for visual relationships
- Check table comments for field descriptions
- Refer to the hierarchical model for understanding dependencies
- Consult the performance section for optimization tips
