# Community Question Contribution Feature

## Overview
Allow non-logged-in users to contribute questions in exchange for rewards (credits, gifts). This crowdsources question creation and builds community engagement.

## User Flow

### 1. Entry Point (Homepage Footer)
**Button Location:** Bottom of homepage (footer area, near "How It Works" type content)

**Button Design:**
```
┌─────────────────────────────────────────────┐
│  📦 💵  Contribute Questions for Rewards    │
└─────────────────────────────────────────────┘
```

**Icons:**
- 🎁 Gift icon (left)
- 💵 Dollar bills icon (wavy money)
- Text: "Contribute Questions for Rewards"

**Placement:** Footer section, doesn't consume top navigation space

### 2. Welcome Dialog (Modal)
When user clicks the button, show modal:

```
┌──────────────────────────────────────────────────┐
│  Thank You for Contributing! 🎁                  │
│                                                  │
│  Thank you for taking the moment to contribute   │
│  questions! For your efforts, we will provide    │
│  you with credits in our software or gifts that  │
│  we randomly select on a monthly basis.          │
│                                                  │
│  Examples of gifts:                              │
│  • Engraved coaster with your monogram          │
│  • MyLegacyLife subscription credits            │
│  • And more!                                     │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Email: [________________]  (Required)      │ │
│  │ Phone: [________________]  (Optional)      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  [Cancel]              [Start Contributing]     │
└──────────────────────────────────────────────────┘
```

### 3. Question Submission Dialog
After entering email/phone:

```
┌──────────────────────────────────────────────────┐
│  Submit a Question                               │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Type your question here...                 │ │
│  │                                            │ │
│  │ (Simple text input, no formatting)         │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  [PROOFREAD]                                     │
│                                                  │
│  [Cancel]  [Submit Question]  [Submit & Add More]│
└──────────────────────────────────────────────────┘
```

**Features:**
- Simple textarea (no rich text editor)
- PROOFREAD button (LanguageTool integration)
- Max length: ~200 characters (typical question length)
- Two submit options:
  - "Submit Question" - Submit and close
  - "Submit & Add More" - Submit and clear form for another

### 4. Confirmation Message
After submission:

```
┌──────────────────────────────────────────────────┐
│  Question Submitted! ✅                          │
│                                                  │
│  Your question will be evaluated for duplicates  │
│  against our bank of questions and you'll be     │
│  notified via email to claim your reward.        │
│                                                  │
│  Thank you for contributing to MyLegacyLife.AI!  │
│                                                  │
│  [Submit Another Question]  [Close]              │
└──────────────────────────────────────────────────┘
```

## Database Schema

### New Table: `contributed_questions`
```sql
CREATE TABLE contributed_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contributor info
    contributor_email VARCHAR(255) NOT NULL,
    contributor_phone VARCHAR(50),
    
    -- Question data
    question_text TEXT NOT NULL,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Awaiting review
        'approved',     -- Approved, added to questions table
        'duplicate',    -- Duplicate of existing question
        'rejected',     -- Rejected (inappropriate, unclear, etc.)
        'rewarded'      -- Reward has been claimed
    )),
    
    -- Duplicate detection
    duplicate_of_question_id UUID REFERENCES questions(id),
    
    -- Reward tracking
    reward_type VARCHAR(50), -- 'credit', 'gift', null
    reward_amount DECIMAL(10,2), -- Credit amount if applicable
    reward_claimed_at TIMESTAMP WITH TIME ZONE,
    
    -- Admin notes
    admin_notes TEXT,
    reviewed_by UUID REFERENCES subscribers(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contributed_questions_email ON contributed_questions(contributor_email);
CREATE INDEX idx_contributed_questions_status ON contributed_questions(status);
CREATE INDEX idx_contributed_questions_created ON contributed_questions(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_contributed_questions_updated_at
    BEFORE UPDATE ON contributed_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### New Table: `contributor_rewards`
Track rewards given to contributors:

```sql
CREATE TABLE contributor_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    contributor_email VARCHAR(255) NOT NULL,
    
    -- Reward details
    reward_type VARCHAR(50) NOT NULL, -- 'credit', 'gift'
    reward_description TEXT, -- "Engraved coaster", "$10 credit", etc.
    reward_value DECIMAL(10,2),
    
    -- Questions that earned this reward
    contributed_question_ids UUID[], -- Array of question IDs
    questions_count INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',   -- Reward allocated but not claimed
        'notified',  -- Email sent to claim
        'claimed',   -- User claimed reward
        'expired'    -- Claim period expired
    )),
    
    -- Claim tracking
    claim_code VARCHAR(50) UNIQUE, -- Unique code to claim reward
    notified_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contributor_rewards_email ON contributor_rewards(contributor_email);
CREATE INDEX idx_contributor_rewards_status ON contributor_rewards(status);
CREATE INDEX idx_contributor_rewards_claim_code ON contributor_rewards(claim_code);
```

## API Endpoints

### 1. Submit Question
```typescript
POST /api/contribute-question

Request:
{
    email: string,
    phone?: string,
    question_text: string
}

Response:
{
    success: boolean,
    message: string,
    question_id: string
}
```

### 2. Check for Duplicates (Admin)
```typescript
POST /api/admin/check-duplicate-question

Request:
{
    question_text: string
}

Response:
{
    is_duplicate: boolean,
    similar_questions: Array<{
        id: string,
        question_text: string,
        similarity_score: number
    }>
}
```

## Admin Dashboard Features

### Question Review Page
Admins need a page to review contributed questions:

```
┌────────────────────────────────────────────────────────┐
│  Contributed Questions Review                          │
│                                                        │
│  Filters: [All] [Pending] [Approved] [Duplicate]      │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Question #1 - Pending                            │ │
│  │ From: john@example.com                           │ │
│  │ "What was your favorite childhood toy?"          │ │
│  │                                                  │ │
│  │ Similar Questions:                               │ │
│  │ • "What toys did you play with as a child?" 85%  │ │
│  │                                                  │ │
│  │ [Approve] [Mark Duplicate] [Reject]              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Question #2 - Pending                            │ │
│  │ ...                                              │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## Reward System

### Initial Implementation (Credits Only)
- **1 approved question** = $1 credit
- **5 approved questions** = $5 credit + entry into monthly gift drawing
- **10+ approved questions** = $10 credit + guaranteed gift

### Monthly Gift Drawing
- Run on 1st of each month
- Select random contributors from previous month
- Gifts: Engraved coasters, photo frames, subscription months, etc.

### Email Notifications

**1. Question Received:**
```
Subject: Thank you for contributing a question!

Hi [Name],

Thank you for submitting a question to MyLegacyLife.AI!

Your question: "[question_text]"

We'll review it for duplicates and quality. If approved, you'll 
receive a reward notification within 3-5 business days.

Thanks for helping us build a better storytelling experience!

- The MyLegacyLife.AI Team
```

**2. Question Approved:**
```
Subject: Your question was approved! 🎉 Claim your reward

Hi [Name],

Great news! Your question has been approved and added to our 
question bank.

Your question: "[question_text]"

Reward: $1 credit toward MyLegacyLife.AI subscription

Claim Code: CONTRIB-XXXX-YYYY

Click here to claim: [link]

You've now contributed [X] questions. Keep going to unlock 
bigger rewards!

- The MyLegacyLife.AI Team
```

**3. Question Duplicate:**
```
Subject: Update on your contributed question

Hi [Name],

Thank you for your contribution! We found that your question 
is very similar to one already in our database:

Your question: "[question_text]"
Existing: "[existing_question_text]"

While we can't accept duplicates, we appreciate your effort! 
Feel free to submit more unique questions.

- The MyLegacyLife.AI Team
```

## Duplicate Detection Strategy

### Simple Approach (Phase 1)
- Lowercase comparison
- Remove punctuation
- Check for exact matches
- Flag for manual review if >80% similar

### Advanced Approach (Phase 2)
- Use OpenAI embeddings for semantic similarity
- Calculate cosine similarity between questions
- Auto-reject if >90% similar
- Flag for review if 70-90% similar

```typescript
async function checkDuplicate(newQuestion: string) {
    // Get embedding for new question
    const newEmbedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: newQuestion
    })
    
    // Compare with existing questions
    const { data: questions } = await supabase
        .from('questions')
        .select('id, question_text, embedding')
    
    const similarities = questions.map(q => ({
        id: q.id,
        text: q.question_text,
        similarity: cosineSimilarity(newEmbedding, q.embedding)
    }))
    
    const mostSimilar = similarities.sort((a, b) => b.similarity - a.similarity)[0]
    
    return {
        isDuplicate: mostSimilar.similarity > 0.9,
        similarQuestions: similarities.filter(s => s.similarity > 0.7)
    }
}
```

## Anti-Abuse Measures

### Rate Limiting
- Max 10 questions per email per day
- Max 3 questions per IP per hour
- Require email verification for rewards

### Quality Checks
- Min length: 10 characters
- Max length: 200 characters
- No spam keywords
- No URLs
- No profanity

### Fraud Prevention
- Track IP addresses
- Require unique email per reward claim
- Manual review for high-value rewards
- Expire claim codes after 30 days

## Implementation Phases

### Phase 1: MVP (Week 1)
- [ ] Create database tables
- [ ] Build contribution button and dialogs
- [ ] Simple duplicate detection (exact match)
- [ ] Email collection
- [ ] Admin review page (basic)
- [ ] Email notifications

### Phase 2: Rewards (Week 2)
- [ ] Credit system integration
- [ ] Claim code generation
- [ ] Reward tracking
- [ ] Monthly gift drawing automation

### Phase 3: Advanced (Week 3+)
- [ ] AI-powered duplicate detection
- [ ] Contributor leaderboard
- [ ] Public question suggestions (voting)
- [ ] Contributor badges/gamification

## Success Metrics
- Questions contributed per week
- Approval rate (target: >60%)
- Duplicate rate (target: <30%)
- Contributor retention (return contributors)
- Cost per approved question

## Budget Considerations
- **Credits**: $1 per approved question
- **Gifts**: $5-20 per gift (monthly drawing)
- **Estimated cost**: $100-500/month depending on volume
- **ROI**: Cheaper than hiring writers, builds community

---

**Created:** 2026-01-19
**Status:** Documented (not implemented)
**Priority:** Medium
**Estimated Effort:** 2-3 weeks (full implementation)
