-- Fix database schema by adding missing user_type column
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'consumer';

-- Update any existing users to have a default user_type
UPDATE users SET user_type = 'consumer' WHERE user_type IS NULL;

-- Make user_type NOT NULL after setting defaults
ALTER TABLE users ALTER COLUMN user_type SET NOT NULL;
