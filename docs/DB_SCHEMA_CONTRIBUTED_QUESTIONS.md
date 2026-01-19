# Question Contribution Database Schema - Summary

## Created Table: `contributed_questions`

### Purpose
Input queue for user-contributed questions with full workflow support from submission to approval/rejection.

### Key Columns

#### Contributor Info
- `contributor_email` - Required email address
- `contributor_phone` - Optional phone number  
- `subscriber_id` - Link to user if logged in (optional)

#### Question Data
- `question_text` - The submitted question
- `suggested_category` - AI-suggested category
- `assigned_category` - Final category after review

#### Status Workflow
- `status` - **submitted** | **accepted** | **rejected**
- `rejection_reason` - **duplicate** | inappropriate | unclear | too_specific | too_general | off_topic | other
- `duplicate_of_question_id` - Link to existing question if duplicate
- `similarity_score` - AI similarity score (0-1)

#### Reward Tracking
- `reward_status` - pending | credited | notified | claimed | expired
- `reward_amount` - Dollar value of reward
- `reward_claimed_at` - When reward was claimed

#### Admin Review
- `reviewed_by` - Admin who reviewed
- `reviewed_at` - Review timestamp
- `admin_notes` - Internal notes

#### AI Processing
- `embedding` - Vector embedding for similarity search (1536 dimensions)
- `ai_processed` - Whether AI has processed this question
- `ai_processed_at` - When AI processing completed

#### Audit Fields (Standard)
- ✅ `created_by` - Who created the record
- ✅ `created_at` - When created
- ✅ `updated_by` - Who last updated
- ✅ `updated_at` - When last updated

### Workflow States

```
┌─────────────┐
│  submitted  │ ← Initial state when user submits
└──────┬──────┘
       │
       ├──────→ ┌──────────┐
       │        │ accepted │ ← Approved, added to questions table
       │        └──────────┘
       │
       └──────→ ┌──────────┐
                │ rejected │ ← Rejected (see rejection_reason)
                └──────────┘
```

### Key Features

1. **Duplicate Detection**
   - Vector embeddings for semantic similarity
   - Links to existing questions if duplicate
   - Stores similarity score

2. **Category Assignment**
   - AI suggests category based on existing structure
   - Admin can override/assign final category
   - Can create new categories if needed

3. **Reward System**
   - Tracks reward status independently
   - Supports credits and physical gifts
   - Claim code system (future)

4. **Anti-Abuse**
   - IP address tracking
   - User agent logging
   - Rate limiting support

### Helper Functions

- `find_similar_contributed_questions()` - Find duplicates in contributions
- `find_similar_existing_questions()` - Find duplicates in main questions table

### Security

- Row Level Security (RLS) enabled
- Contributors can view their own submissions
- Only admins can update/delete
- Public can insert (contribute)

## File Location

**SQL Schema:** `d:\WIP\MyLegacyLife\MyLegacyLife_V1\db\09_contributed_questions.sql`

**Note:** This file is outside the git repository. Copy to `mylegacylife-app/supabase/migrations/` when ready to deploy.

## Next Steps

1. Review schema with team
2. Test migration in development
3. Implement API endpoints for submission
4. Build admin review interface
5. Set up AI duplicate detection pipeline
6. Configure reward amounts and rules

---

**Created:** 2026-01-19
**Status:** Schema designed, not yet deployed
