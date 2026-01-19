-- Community Question Contributions Table
-- Stores user-contributed questions for review and approval

CREATE TABLE contributed_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contributor Information
    contributor_email VARCHAR(255) NOT NULL,
    contributor_phone VARCHAR(50),
    subscriber_id UUID, -- Link to subscriber if they're logged in (optional, no FK for now)
    
    -- Question Data
    question_text TEXT NOT NULL,
    suggested_category VARCHAR(100),
    assigned_category VARCHAR(100),
    
    -- Status Workflow: submitted → accepted/rejected
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
    duplicate_of_question_id UUID, -- Link to existing question (no FK for now)
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
    reward_claimed_at TIMESTAMP WITH TIME ZONE,
    
    -- Admin Review
    reviewed_by UUID, -- Admin who reviewed (no FK for now)
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    -- Audit Fields
    created_by UUID, -- Who created (no FK for now)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID, -- Who updated (no FK for now)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contributed_questions_email ON contributed_questions(contributor_email);
CREATE INDEX idx_contributed_questions_status ON contributed_questions(status) WHERE status = 'submitted';
CREATE INDEX idx_contributed_questions_subscriber ON contributed_questions(subscriber_id) WHERE subscriber_id IS NOT NULL;
CREATE INDEX idx_contributed_questions_created ON contributed_questions(created_at DESC);
CREATE INDEX idx_contributed_questions_reward ON contributed_questions(reward_status) WHERE reward_status IN ('pending', 'notified');

-- Trigger for updated_at
CREATE TRIGGER update_contributed_questions_updated_at
    BEFORE UPDATE ON contributed_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE contributed_questions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public contribution)
CREATE POLICY "Anyone can contribute questions"
    ON contributed_questions
    FOR INSERT
    WITH CHECK (true);

-- Anyone can view (for now - will restrict later when subscribers table exists)
CREATE POLICY "Anyone can view questions"
    ON contributed_questions
    FOR SELECT
    USING (true);

-- Only authenticated users can update/delete (simplified for now)
CREATE POLICY "Authenticated users can manage questions"
    ON contributed_questions
    FOR ALL
    USING (auth.uid() IS NOT NULL);
