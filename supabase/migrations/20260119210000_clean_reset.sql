-- Clean Reset Migration
-- WARNING: This drops and recreates all tables
-- Questions data will be preserved, all other data will be lost

-- ============================================
-- BACKUP QUESTIONS DATA
-- ============================================
CREATE TEMP TABLE questions_backup AS 
SELECT * FROM public.questions WHERE 1=1;

-- ============================================
-- DROP ALL TABLES (CASCADE to remove dependencies)
-- ============================================
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.answers CASCADE;
DROP TABLE IF EXISTS public.contributed_questions CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.subscribers CASCADE;

-- ============================================
-- RECREATE TABLES WITH PROPER STRUCTURE
-- ============================================

-- SUBSCRIBERS TABLE
CREATE TABLE public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    full_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NULL,
    updated_by UUID NULL
);

-- QUESTIONS TABLE
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    category VARCHAR(100),
    order_index INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NULL,
    updated_by UUID NULL
);

-- ANSWERS TABLE
CREATE TABLE public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NULL,
    updated_by UUID NULL
);

-- USER_PROGRESS TABLE
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
    current_question_id UUID REFERENCES public.questions(id),
    total_answered INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NULL,
    updated_by UUID NULL
);

-- CONTRIBUTED_QUESTIONS TABLE
CREATE TABLE public.contributed_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Contributor Information
    contributor_email VARCHAR(255) NOT NULL,
    contributor_phone VARCHAR(50),
    subscriber_id UUID, -- No FK - subscribers might not exist
    
    -- Question Data
    question_text TEXT NOT NULL,
    suggested_category VARCHAR(100),
    assigned_category VARCHAR(100),
    
    -- Status Workflow
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN (
        'submitted',
        'accepted',
        'rejected'
    )),
    
    -- Rejection Tracking
    rejection_reason VARCHAR(100) CHECK (rejection_reason IN (
        'duplicate',
        'inappropriate',
        'unclear',
        'too_specific',
        'too_general',
        'off_topic',
        'other'
    )),
    duplicate_of_question_id UUID,
    similarity_score DECIMAL(3,2),
    
    -- Reward Tracking
    reward_status VARCHAR(50) DEFAULT 'pending' CHECK (reward_status IN (
        'pending',
        'credited',
        'notified',
        'claimed',
        'expired'
    )),
    reward_amount DECIMAL(10,2),
    reward_claimed_at TIMESTAMPTZ,
    
    -- Admin Review
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NULL,
    updated_by UUID NULL
);

-- ============================================
-- RESTORE QUESTIONS DATA
-- ============================================
INSERT INTO public.questions (id, question_text, category, order_index, is_active, created_at, updated_at, created_by, updated_by)
SELECT 
    id,
    question_text,
    category,
    order_index,
    COALESCE(is_active, true),
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW()),
    created_by,
    updated_by
FROM questions_backup;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_subscribers_email ON public.subscribers(email);
CREATE INDEX idx_answers_subscriber ON public.answers(subscriber_id);
CREATE INDEX idx_answers_question ON public.answers(question_id);
CREATE INDEX idx_user_progress_subscriber ON public.user_progress(subscriber_id);
CREATE INDEX idx_contributed_questions_email ON public.contributed_questions(contributor_email);
CREATE INDEX idx_contributed_questions_status ON public.contributed_questions(status) WHERE status = 'submitted';
CREATE INDEX idx_contributed_questions_created ON public.contributed_questions(created_at DESC);
CREATE INDEX idx_contributed_questions_reward ON public.contributed_questions(reward_status) WHERE reward_status IN ('pending', 'notified');

-- ============================================
-- AUTO-UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at
    BEFORE UPDATE ON public.answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributed_questions_updated_at
    BEFORE UPDATE ON public.contributed_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributed_questions ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for development)
CREATE POLICY "Allow all for now" ON public.subscribers FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.questions FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.answers FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.user_progress FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.contributed_questions FOR ALL USING (true);
