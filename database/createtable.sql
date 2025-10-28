-- ========================
-- 1. Users Table
-- ========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 2. Profiles Table
-- ========================
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    address TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    user_type VARCHAR(20) CHECK (user_type IN ('guard', 'consumer', 'admin')),
    bio TEXT,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 3. Settings Table
-- ========================
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_verified BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    location_sharing_enabled BOOLEAN DEFAULT TRUE,
    privacy_level VARCHAR(20) DEFAULT 'public',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 4. Verifications Table
-- ========================
CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50),
    document_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 5. Posts Table
-- ========================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    media_url TEXT,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video')),
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 6. Likes Table (Many-to-Many)
-- ========================
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- ========================
-- 7. Comments Table
-- ========================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    commented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 8. Bookings Table
-- ========================
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    guard_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    consumer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100),
    event_description TEXT,
    location TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 9. Pricing Table
-- ========================
CREATE TABLE pricing (
    id SERIAL PRIMARY KEY,
    guard_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    base_rate DECIMAL(10,2) NOT NULL,
    rate_per_hour DECIMAL(10,2),
    geo_zone VARCHAR(100),
    min_booking_hours INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 10. Transactions Table
-- ========================


        -- ========================
        -- 1. Transactions Table
        -- ========================

        CREATE TABLE transactions (
            id SERIAL PRIMARY KEY,
            
            booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
            
            payer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            payee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            
            amount DECIMAL(10, 2) NOT NULL,
            currency VARCHAR(10) DEFAULT 'USD',

            platform_fee DECIMAL(10, 2) DEFAULT 0.00,
            total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (amount + platform_fee) STORED,

            transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN (
                'payment', 'refund', 'adjustment', 'payout', 'fee'
            )),

            payment_method VARCHAR(50), -- e.g., 'stripe', 'paypal', 'wallet'
            payment_reference VARCHAR(100), -- external payment provider reference ID

            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
                'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
            )),
            
            initiated_by INTEGER REFERENCES users(id), -- admin/system/consumer

            description TEXT,
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ========================
        -- 2. Transaction Status Logs Table
        -- ========================
        CREATE TABLE transaction_status_logs (
            id SERIAL PRIMARY KEY,
            transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
            old_status VARCHAR(20),
            new_status VARCHAR(20),
            changed_by INTEGER REFERENCES users(id),
            note TEXT,
            changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ========================
        -- 3. Transaction Metadata Table (Optional)
        -- ========================
        CREATE TABLE transaction_metadata (
            id SERIAL PRIMARY KEY,
            transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
            key VARCHAR(50),
            value TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- ========================
        -- 4. Refunds Table (Optional, if using multiple refund events)
        -- ========================
        CREATE TABLE refunds (
            id SERIAL PRIMARY KEY,
            transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
            refunded_by INTEGER REFERENCES users(id),
            refund_reason TEXT,
            refund_amount DECIMAL(10, 2) NOT NULL,
            refund_reference VARCHAR(100), -- from payment provider
            refund_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );




-- ========================
-- 11. Reviews Table
-- ========================

-- ========================
-- 1. Reviews Table
-- ========================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reviewed_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,

    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    is_testimonial BOOLEAN DEFAULT FALSE, -- shown publicly
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    moderated BOOLEAN DEFAULT FALSE,
    moderated_by INTEGER REFERENCES users(id), -- typically admin
    moderation_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 2. Review Votes Table
-- ========================
CREATE TABLE review_votes (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('helpful', 'not_helpful')),
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (review_id, user_id) -- one vote per user per review
);

-- ========================
-- 3. Review Responses Table
-- ========================
CREATE TABLE review_responses (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    responder_id INTEGER REFERENCES users(id), -- could be admin or guard
    response_text TEXT NOT NULL,
    responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 4. Review Media Table (Optional)
-- ========================
CREATE TABLE review_media (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




----------------------- Compliants Table -----------------------

-- ========================
-- 1. Complaint Phases Table
-- ========================
CREATE TABLE complaint_phases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'open', 'in_review', 'escalated', 'resolved', 'dismissed'
    description TEXT
);

-- ========================
-- 2. Complaints Table
-- ========================
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    complainant_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    defendant_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    current_phase_id INTEGER REFERENCES complaint_phases(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50), -- e.g., 'behavior', 'no-show', 'payment', 'other'
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 3. Complaint Phase Logs Table
-- ========================
CREATE TABLE complaint_phase_logs (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
    from_phase_id INTEGER REFERENCES complaint_phases(id),
    to_phase_id INTEGER REFERENCES complaint_phases(id),
    changed_by INTEGER REFERENCES users(id),
    note TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 4. Complaint Updates Table
-- ========================
CREATE TABLE complaint_updates (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    is_admin_note BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 5. Complaint Resolutions Table
-- ========================
CREATE TABLE resolutions (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER UNIQUE REFERENCES complaints(id) ON DELETE CASCADE,
    resolved_by INTEGER REFERENCES users(id), -- usually admin
    resolution_summary TEXT NOT NULL,
    resolution_type VARCHAR(50) CHECK (resolution_type IN ('refund', 'warning', 'no_action', 'ban', 'other')),
    resolution_status VARCHAR(20) CHECK (resolution_status IN ('resolved', 'dismissed', 'pending')),
    resolution_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 6. Complaint Escalations Table (Optional)
-- ========================
CREATE TABLE complaint_escalations (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
    escalated_by INTEGER REFERENCES users(id),
    escalated_to_role VARCHAR(50), -- e.g., 'admin', 'supervisor'
    reason TEXT,
    escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- PAYMENTS DATA MODEL
-- Complementary to the Transactions Schema
-- ==========================================================

-- ========================
-- 0. Setup ENUM types
-- ========================

CREATE TYPE payment_status_enum AS ENUM (
    'initiated',
    'authorized',
    'captured',
    'settled',
    'failed',
    'refunded',
    'cancelled'
);

CREATE TYPE payment_method_type_enum AS ENUM (
    'card',
    'bank_account',
    'wallet',
    'paypal',
    'crypto'
);

-- ========================
-- 1. Payment Methods Table
-- ========================
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type payment_method_type_enum NOT NULL,
    provider VARCHAR(50), -- e.g., 'stripe', 'paypal'
    provider_method_id VARCHAR(100), -- external reference
    last4 VARCHAR(4),
    exp_month INTEGER,
    exp_year INTEGER,
    brand VARCHAR(50), -- e.g., 'Visa', 'MasterCard'
    country VARCHAR(10),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 2. Payments Table
-- ========================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    
    payment_provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', etc.
    provider_payment_id VARCHAR(100) UNIQUE, -- payment intent / transaction ID
    provider_charge_id VARCHAR(100), -- charge ID if applicable
    
    payment_method_id INTEGER REFERENCES payment_methods(id),
    
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) DEFAULT 'USD',
    
    status payment_status_enum DEFAULT 'initiated',
    failure_reason TEXT,
    
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 3. Payment Status Logs
-- ========================
CREATE TABLE payment_status_logs (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    old_status payment_status_enum,
    new_status payment_status_enum,
    changed_by INTEGER REFERENCES users(id),
    note TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 4. Payment Events (Webhooks / Gateway Notifications)
-- ========================
CREATE TABLE payment_events (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    provider VARCHAR(50),
    event_type VARCHAR(100), -- e.g., 'payment_intent.succeeded'
    event_id VARCHAR(100), -- unique provider event ID
    payload JSONB,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP
);

-- ========================
-- 5. Payment Reconciliations (Optional)
-- ========================
CREATE TABLE payment_reconciliations (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50),
    reference_date DATE NOT NULL,
    total_expected DECIMAL(12, 2),
    total_reported DECIMAL(12, 2),
    discrepancy DECIMAL(12, 2)
        GENERATED ALWAYS AS (total_expected - total_reported) STORED,
    report_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--


