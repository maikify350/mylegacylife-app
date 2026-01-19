-- Audit Fields Migration
-- Ensures all core tables have consistent audit fields
-- Run this to standardize existing tables

-- Standard audit fields that MUST exist on all tables:
-- - id (uuid primary key)
-- - created_at (timestamptz)
-- - updated_at (timestamptz)
-- - created_by (uuid nullable)
-- - updated_by (uuid nullable)

-- ============================================
-- SUBSCRIBERS TABLE
-- ============================================
DO $$ 
BEGIN
    -- Add id if missing (should already exist)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscribers' AND column_name = 'id'
    ) THEN
        ALTER TABLE subscribers ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;

    -- Add created_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscribers' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE subscribers ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
    END IF;

    -- Add updated_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscribers' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE subscribers ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
    END IF;

    -- Add created_by if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscribers' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE subscribers ADD COLUMN created_by uuid NULL;
    END IF;

    -- Add updated_by if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscribers' AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE subscribers ADD COLUMN updated_by uuid NULL;
    END IF;
END $$;

-- ============================================
-- QUESTIONS TABLE
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questions' AND column_name = 'id'
    ) THEN
        ALTER TABLE questions ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questions' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE questions ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questions' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE questions ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questions' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE questions ADD COLUMN created_by uuid NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questions' AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE questions ADD COLUMN updated_by uuid NULL;
    END IF;
END $$;

-- ============================================
-- ANSWERS TABLE
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'answers' AND column_name = 'id'
    ) THEN
        ALTER TABLE answers ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'answers' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE answers ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'answers' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE answers ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'answers' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE answers ADD COLUMN created_by uuid NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'answers' AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE answers ADD COLUMN updated_by uuid NULL;
    END IF;
END $$;

-- ============================================
-- USER_PROGRESS TABLE
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'id'
    ) THEN
        ALTER TABLE user_progress ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE user_progress ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE user_progress ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE user_progress ADD COLUMN created_by uuid NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE user_progress ADD COLUMN updated_by uuid NULL;
    END IF;
END $$;

-- ============================================
-- CONTRIBUTED_QUESTIONS TABLE
-- ============================================
-- This table already has the correct schema from its migration
-- But we'll verify just in case

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contributed_questions' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE contributed_questions ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contributed_questions' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE contributed_questions ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contributed_questions' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE contributed_questions ADD COLUMN created_by uuid NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contributed_questions' AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE contributed_questions ADD COLUMN updated_by uuid NULL;
    END IF;
END $$;

-- ============================================
-- CREATE TRIGGER FUNCTION FOR AUTO-UPDATING updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_subscribers_updated_at ON subscribers;
CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_answers_updated_at ON answers;
CREATE TRIGGER update_answers_updated_at
    BEFORE UPDATE ON answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contributed_questions_updated_at ON contributed_questions;
CREATE TRIGGER update_contributed_questions_updated_at
    BEFORE UPDATE ON contributed_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
