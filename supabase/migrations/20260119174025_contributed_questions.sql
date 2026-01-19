-- Community Question Contributions Table
-- Stores user-contributed questions for review and approval

CREATE TABLE contributed_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contributor Information
    contributor_email VARCHAR(255) NOT NULL,
    contributor_phone VARCHAR(50),
    subscriber_id UUID REFERENCES subscribers(id) ON DELETE SET NULL,
    
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
    duplicate_of_question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
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
    reviewed_by UUID REFERENCES subscribers(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    -- Audit Fields
    created_by UUID REFERENCES subscribers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES subscribers(id) ON DELETE SET NULL,
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

-- Contributors can view their own submissions
CREATE POLICY "Contributors can view own questions"
    ON contributed_questions
    FOR SELECT
    USING (
        contributor_email = current_setting('app.user_email', true)
        OR subscriber_id = auth.uid()
    );

-- Only admins can update/delete
CREATE POLICY "Admins can manage all questions"
    ON contributed_questions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM subscribers
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );
