-- ==========================================================
-- SECURITY GUARD FREELANCING APP - COMPLETE DATABASE SCHEMA (FIXED)
-- ==========================================================
-- This schema creates a comprehensive database for a security guard
-- freelancing platform similar to Uber, with social features like Instagram/Facebook
-- 
-- Features:
-- - User authentication and profiles
-- - Guard/Consumer/Admin role management
-- - Social posting with media (Instagram-like)
-- - Booking system (Uber-like)
-- - Dynamic pricing based on location
-- - Payment processing
-- - Review and rating system
-- - Complaint and dispute resolution
-- - Verification system
-- ==========================================================

-- ========================
-- 1. CORE USER TABLES
-- ========================

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles with demographics and location
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    bio TEXT,
    profile_picture_url TEXT,
    cover_photo_url TEXT,
    
    -- Address information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'US',
    
    -- Geolocation for proximity searches
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_accuracy INTEGER, -- in meters
    
    -- User type and status
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('guard', 'consumer', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
    
    -- Guard-specific fields
    years_experience INTEGER,
    certifications TEXT[], -- Array of certification names
    languages_spoken TEXT[], -- Array of language codes
    availability_schedule JSONB, -- Weekly availability schedule
    max_travel_distance INTEGER, -- in miles/kilometers
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Social media links
    linkedin_url TEXT,
    instagram_handle VARCHAR(100),
    twitter_handle VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User settings and preferences
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    
    -- Privacy settings
    profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
    location_sharing BOOLEAN DEFAULT TRUE,
    show_online_status BOOLEAN DEFAULT TRUE,
    
    -- Security settings
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_method VARCHAR(20) CHECK (two_factor_method IN ('sms', 'email', 'authenticator')),
    login_notifications BOOLEAN DEFAULT TRUE,
    
    -- App preferences
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    currency VARCHAR(10) DEFAULT 'USD',
    distance_unit VARCHAR(10) DEFAULT 'miles' CHECK (distance_unit IN ('miles', 'kilometers')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 2. VERIFICATION SYSTEM
-- ========================

-- Document types for verification
CREATE TABLE verification_document_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    required_for_guards BOOLEAN DEFAULT FALSE,
    required_for_consumers BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- User verifications
CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    document_type_id INTEGER REFERENCES verification_document_types(id),
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    document_hash VARCHAR(255), -- For integrity checking
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Verification status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    verified_by INTEGER REFERENCES users(id), -- Admin who verified
    verification_notes TEXT,
    verified_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Document details
    document_number VARCHAR(255), -- ID number, license number, etc.
    issuing_authority VARCHAR(255),
    issued_date DATE,
    expiry_date DATE,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Background check records
CREATE TABLE background_checks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    check_type VARCHAR(50) NOT NULL, -- 'criminal', 'employment', 'education', 'reference'
    provider VARCHAR(100), -- Background check service provider
    reference_id VARCHAR(255), -- External reference ID
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'expired')),
    result_data JSONB, -- Store detailed results
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- ========================
-- 3. SOCIAL FEATURES (Instagram/Facebook-like)
-- ========================

-- Posts table for guards to share updates
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    post_type VARCHAR(20) DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'carousel')),
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Visibility settings
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
    allow_comments BOOLEAN DEFAULT TRUE,
    allow_sharing BOOLEAN DEFAULT TRUE,
    
    -- Engagement metrics
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    flagged_reason TEXT,
    moderated_by INTEGER REFERENCES users(id),
    moderated_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media attachments for posts
CREATE TABLE post_media (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
    thumbnail_url TEXT,
    file_size INTEGER,
    duration INTEGER, -- For videos, in seconds
    width INTEGER,
    height INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post likes
CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Post comments
CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES post_comments(id), -- For replies
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comment likes
CREATE TABLE comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES post_comments(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id)
);

-- User follows (social connections)
CREATE TABLE user_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id)
);

-- ========================
-- 4. BOOKING SYSTEM (Uber-like)
-- ========================

-- Event types for bookings
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(20) UNIQUE NOT NULL, -- Human-readable reference
    
    -- Parties involved
    guard_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    consumer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event details
    event_type_id INTEGER REFERENCES event_types(id),
    event_name VARCHAR(255) NOT NULL,
    event_description TEXT,
    
    -- Location details
    venue_name VARCHAR(255),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'US',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Timing
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    duration_hours DECIMAL(4,2) GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_datetime - start_datetime)) / 3600
    ) STORED,
    
    -- Pricing
    hourly_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (
        hourly_rate * EXTRACT(EPOCH FROM (end_datetime - start_datetime)) / 3600
    ) STORED,
    platform_fee DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) GENERATED ALWAYS AS (
        (hourly_rate * EXTRACT(EPOCH FROM (end_datetime - start_datetime)) / 3600) + platform_fee
    ) STORED,
    
    -- Status and workflow
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed'
    )),
    
    -- Special requirements
    special_requirements TEXT,
    uniform_required BOOLEAN DEFAULT FALSE,
    equipment_provided BOOLEAN DEFAULT TRUE,
    
    -- Communication
    consumer_notes TEXT,
    guard_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancelled_by INTEGER REFERENCES users(id),
    cancellation_reason TEXT
);

-- Booking status history
CREATE TABLE booking_status_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 5. PRICING SYSTEM
-- ========================

-- Geographic zones for pricing
CREATE TABLE pricing_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'US',
    center_latitude DECIMAL(10, 8),
    center_longitude DECIMAL(11, 8),
    radius_miles INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guard pricing profiles
CREATE TABLE guard_pricing (
    id SERIAL PRIMARY KEY,
    guard_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pricing_zone_id INTEGER REFERENCES pricing_zones(id),
    
    -- Base rates
    base_hourly_rate DECIMAL(10,2) NOT NULL,
    minimum_hours INTEGER DEFAULT 1,
    maximum_hours INTEGER DEFAULT 24,
    
    -- Time-based multipliers
    weekend_multiplier DECIMAL(3,2) DEFAULT 1.0,
    holiday_multiplier DECIMAL(3,2) DEFAULT 1.5,
    night_shift_multiplier DECIMAL(3,2) DEFAULT 1.2, -- 10 PM - 6 AM
    emergency_multiplier DECIMAL(3,2) DEFAULT 2.0,
    
    -- Event type adjustments
    corporate_event_adjustment DECIMAL(3,2) DEFAULT 1.0,
    private_event_adjustment DECIMAL(3,2) DEFAULT 1.0,
    security_event_adjustment DECIMAL(3,2) DEFAULT 1.0,
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    available_from TIMESTAMP,
    available_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(guard_id, pricing_zone_id)
);

-- Dynamic pricing factors
CREATE TABLE pricing_factors (
    id SERIAL PRIMARY KEY,
    factor_name VARCHAR(100) UNIQUE NOT NULL,
    factor_type VARCHAR(50) NOT NULL, -- 'demand', 'supply', 'time', 'weather'
    multiplier DECIMAL(3,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 6. PAYMENT SYSTEM
-- ========================

-- Payment methods
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    method_type VARCHAR(20) NOT NULL CHECK (method_type IN ('card', 'bank_account', 'wallet', 'paypal')),
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'square'
    provider_method_id VARCHAR(255) NOT NULL, -- External reference
    is_default BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Card details (if applicable)
    last_four_digits VARCHAR(4),
    card_brand VARCHAR(50),
    expiry_month INTEGER,
    expiry_year INTEGER,
    
    -- Bank details (if applicable)
    bank_name VARCHAR(100),
    account_type VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_reference VARCHAR(50) UNIQUE NOT NULL,
    
    -- Related entities
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    payer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    payee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Amount details
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    platform_fee DECIMAL(12,2) DEFAULT 0.00,
    processing_fee DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (
        amount + platform_fee + processing_fee
    ) STORED,
    
    -- Transaction details
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN (
        'booking_payment', 'refund', 'payout', 'adjustment', 'platform_fee', 'penalty'
    )),
    payment_method_id INTEGER REFERENCES payment_methods(id),
    provider_transaction_id VARCHAR(255), -- External payment provider ID
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
    )),
    
    -- Metadata
    description TEXT,
    metadata JSONB,
    initiated_by INTEGER REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction status history
CREATE TABLE transaction_status_history (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 7. REVIEW AND RATING SYSTEM
-- ========================

-- Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reviewed_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Rating details
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
    professionalism_rating INTEGER CHECK (professionalism_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    
    -- Review content
    review_text TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    flagged_reason TEXT,
    moderated_by INTEGER REFERENCES users(id),
    moderated_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(reviewer_id, booking_id) -- One review per booking
);

-- Review responses
CREATE TABLE review_responses (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    responder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Review helpfulness votes
CREATE TABLE review_votes (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(review_id, user_id)
);

-- ========================
-- 8. COMPLAINT AND DISPUTE RESOLUTION
-- ========================

-- Complaint categories
CREATE TABLE complaint_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Complaints
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    complaint_reference VARCHAR(20) UNIQUE NOT NULL,
    
    -- Parties involved
    complainant_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    defendant_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Complaint details
    category_id INTEGER REFERENCES complaint_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Status and resolution
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed', 'escalated')),
    resolution TEXT,
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaint updates/communications
CREATE TABLE complaint_updates (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- Internal admin notes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 9. NOTIFICATIONS SYSTEM
-- ========================

-- Notification types
CREATE TABLE notification_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    template_subject TEXT,
    template_body TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type_id INTEGER REFERENCES notification_types(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional data for the notification
    
    -- Delivery status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Delivery methods
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,
    sent_push BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 10. SYSTEM CONFIGURATION
-- ========================

-- App settings
CREATE TABLE app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 11. INDEXES FOR PERFORMANCE
-- ========================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_active ON users(is_active);

-- Profile indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_location ON profiles(latitude, longitude);
CREATE INDEX idx_profiles_status ON profiles(status);

-- Post indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_location ON posts(latitude, longitude);
CREATE INDEX idx_posts_visibility ON posts(visibility);

-- Booking indexes
CREATE INDEX idx_bookings_guard_id ON bookings(guard_id);
CREATE INDEX idx_bookings_consumer_id ON bookings(consumer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_datetime ON bookings(start_datetime, end_datetime);
CREATE INDEX idx_bookings_location ON bookings(latitude, longitude);

-- Transaction indexes
CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_payer_id ON transactions(payer_id);
CREATE INDEX idx_transactions_payee_id ON transactions(payee_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Review indexes
CREATE INDEX idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ========================
-- 12. TRIGGERS FOR DATA INTEGRITY
-- ========================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON verifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guard_pricing_updated_at BEFORE UPDATE ON guard_pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_responses_updated_at BEFORE UPDATE ON review_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update post engagement counts
CREATE OR REPLACE FUNCTION update_post_engagement_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'post_likes' THEN
            UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_TABLE_NAME = 'post_comments' THEN
            UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'post_likes' THEN
            UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
        ELSIF TG_TABLE_NAME = 'post_comments' THEN
            UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply engagement count triggers
CREATE TRIGGER update_post_like_count AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_engagement_counts();

CREATE TRIGGER update_post_comment_count AFTER INSERT OR DELETE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_engagement_counts();

-- ========================
-- 13. SAMPLE DATA INSERTION
-- ========================

-- Insert default verification document types
INSERT INTO verification_document_types (name, description, required_for_guards, required_for_consumers) VALUES
('Driver License', 'Valid driver license', TRUE, FALSE),
('Security License', 'Professional security guard license', TRUE, FALSE),
('Background Check', 'Criminal background check', TRUE, FALSE),
('Identity Verification', 'Government issued ID', TRUE, TRUE),
('Address Verification', 'Proof of address', FALSE, TRUE);

-- Insert default event types
INSERT INTO event_types (name, description) VALUES
('Corporate Event', 'Business meetings, conferences, corporate parties'),
('Private Party', 'Birthday parties, anniversaries, private celebrations'),
('Wedding', 'Wedding ceremonies and receptions'),
('Concert', 'Music concerts and live performances'),
('Sports Event', 'Sports games and tournaments'),
('Festival', 'Public festivals and community events'),
('Construction Site', 'Construction site security'),
('Retail Security', 'Store and retail security'),
('Residential Security', 'Home and residential security'),
('Emergency Response', 'Emergency security situations');

-- Insert default complaint categories
INSERT INTO complaint_categories (name, description) VALUES
('No Show', 'Guard or consumer did not show up for booking'),
('Late Arrival', 'Arrived significantly late to booking'),
('Unprofessional Behavior', 'Inappropriate or unprofessional conduct'),
('Payment Issues', 'Problems with payment processing or disputes'),
('Safety Concerns', 'Safety or security related issues'),
('Equipment Problems', 'Issues with provided equipment'),
('Communication Issues', 'Poor communication or responsiveness'),
('Other', 'Other complaints not covered above');

-- Insert default notification types
INSERT INTO notification_types (name, description, template_subject, template_body) VALUES
('Booking Confirmed', 'Booking has been confirmed', 'Booking Confirmed - {{event_name}}', 'Your booking for {{event_name}} on {{date}} has been confirmed.'),
('Booking Cancelled', 'Booking has been cancelled', 'Booking Cancelled - {{event_name}}', 'Your booking for {{event_name}} on {{date}} has been cancelled.'),
('New Message', 'New message received', 'New Message', 'You have received a new message.'),
('Payment Received', 'Payment has been received', 'Payment Received', 'Payment of ${{amount}} has been received.'),
('Review Received', 'New review received', 'New Review', 'You have received a new review.'),
('Verification Required', 'Document verification required', 'Verification Required', 'Please submit required documents for verification.');

-- Insert default app settings
INSERT INTO app_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', 'GuardHub', 'string', 'Application name', TRUE),
('app_version', '1.0.0', 'string', 'Current app version', TRUE),
('platform_fee_percentage', '10', 'number', 'Platform fee percentage', FALSE),
('max_booking_hours', '24', 'number', 'Maximum hours for a single booking', TRUE),
('min_booking_hours', '1', 'number', 'Minimum hours for a single booking', TRUE),
('max_advance_booking_days', '90', 'number', 'Maximum days in advance for booking', TRUE),
('cancellation_policy_hours', '24', 'number', 'Hours before booking for free cancellation', TRUE);

-- ========================
-- 14. VIEWS FOR COMMON QUERIES
-- ========================

-- View for guard profiles with ratings
CREATE VIEW guard_profiles_with_ratings AS
SELECT 
    p.*,
    u.email,
    u.is_active,
    u.is_verified,
    COALESCE(AVG(r.overall_rating), 0) as average_rating,
    COUNT(r.id) as total_reviews,
    COUNT(CASE WHEN r.overall_rating = 5 THEN 1 END) as five_star_reviews,
    COUNT(CASE WHEN r.overall_rating = 4 THEN 1 END) as four_star_reviews,
    COUNT(CASE WHEN r.overall_rating = 3 THEN 1 END) as three_star_reviews,
    COUNT(CASE WHEN r.overall_rating = 2 THEN 1 END) as two_star_reviews,
    COUNT(CASE WHEN r.overall_rating = 1 THEN 1 END) as one_star_reviews
FROM profiles p
JOIN users u ON p.user_id = u.id
LEFT JOIN reviews r ON p.user_id = r.reviewed_user_id
WHERE p.user_type = 'guard'
GROUP BY p.id, u.email, u.is_active, u.is_verified;

-- View for booking summary
CREATE VIEW booking_summary AS
SELECT 
    b.*,
    guard_profile.first_name as guard_first_name,
    guard_profile.last_name as guard_last_name,
    guard_profile.profile_picture_url as guard_profile_picture,
    consumer_profile.first_name as consumer_first_name,
    consumer_profile.last_name as consumer_last_name,
    et.name as event_type_name
FROM bookings b
JOIN profiles guard_profile ON b.guard_id = guard_profile.user_id
JOIN profiles consumer_profile ON b.consumer_id = consumer_profile.user_id
LEFT JOIN event_types et ON b.event_type_id = et.id;

-- ========================
-- END OF SCHEMA
-- ========================

-- Add comments for documentation
COMMENT ON DATABASE aeumbre IS 'Security Guard Freelancing Platform Database';
COMMENT ON TABLE users IS 'Core user authentication table';
COMMENT ON TABLE profiles IS 'Extended user profile information with demographics and location';
COMMENT ON TABLE bookings IS 'Main booking system for guard assignments';
COMMENT ON TABLE transactions IS 'Payment and financial transaction records';
COMMENT ON TABLE reviews IS 'User review and rating system';
COMMENT ON TABLE posts IS 'Social media style posts for guards to share updates';
COMMENT ON TABLE complaints IS 'Complaint and dispute resolution system';
