# Question Contribution Feature - Setup Instructions

## ✅ What's Been Implemented

1. **Database Migration**: `supabase/migrations/20260119174025_contributed_questions.sql`
2. **API Endpoint**: `app/api/contribute-question/route.ts`
3. **Dialog Component**: `components/contribute-question-dialog.tsx`
4. **Homepage Button**: Added to footer with 🎁💵 icons

## 🚀 To Complete Setup

### Step 1: Run the Database Migration

You need to manually run the migration in your Supabase dashboard:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy the contents of `supabase/migrations/20260119174025_contributed_questions.sql`
5. Paste and click **Run**

**OR** if you have Supabase CLI linked:
```bash
npx supabase db push
```

### Step 2: Verify the Table

After running the migration, verify in Supabase:

1. Go to **Table Editor**
2. You should see a new table: `contributed_questions`
3. Check that it has these columns:
   - id, contributor_email, contributor_phone
   - question_text, status, rejection_reason
   - reward_status, reward_amount
   - created_at, updated_at, etc.

### Step 3: Test the Feature

1. **Refresh your homepage** (localhost:3000)
2. **Scroll to the footer** - you should see the button:
   ```
   🎁 💵 Contribute Questions for Rewards
   ```
3. **Click the button** - should open welcome dialog
4. **Enter email** and click "Start Contributing"
5. **Type a question** and click "Submit Question"
6. **Check Supabase** - go to Table Editor → contributed_questions
7. **You should see your submitted question** with status='submitted'

## 📋 Feature Flow

### User Experience:
1. User clicks "Contribute Questions for Rewards" button
2. Welcome dialog explains rewards (credits, gifts)
3. User enters email (required) and phone (optional)
4. User types question in simple textarea
5. Optional: Click PROOFREAD to check grammar
6. Submit question OR Submit & Add More
7. Success message confirms submission

### Database Flow:
```
User submits question
    ↓
API validates (length, email format)
    ↓
Inserts into contributed_questions table
    ↓
Status = 'submitted'
    ↓
Admin reviews in Supabase dashboard
    ↓
Admin changes status to 'accepted' or 'rejected'
```

## 🎯 Next Steps (Future)

1. **Admin Review Page**: Build UI for admins to review questions
2. **AI Duplicate Detection**: Implement vector embeddings
3. **Reward System**: Automate credit allocation
4. **Email Notifications**: Send confirmation and reward emails
5. **Category Assignment**: AI suggests categories

## 🔍 Troubleshooting

### "Failed to submit question"
- Check that migration ran successfully
- Verify RLS policies are enabled
- Check browser console for errors

### Button doesn't appear
- Clear browser cache
- Check that homepage is using client component ("use client")
- Verify ContributeQuestionDialog import

### Dialog doesn't open
- Check browser console for errors
- Verify state management (showContributeDialog)

## 📊 Viewing Submissions

To view all submitted questions in Supabase:

1. Go to **Table Editor**
2. Select `contributed_questions` table
3. Filter by `status = 'submitted'` to see pending questions
4. Click any row to see full details

To manually approve a question:
1. Find the question in the table
2. Click to edit
3. Change `status` from 'submitted' to 'accepted'
4. Optionally add `reward_amount` (e.g., 1.00 for $1 credit)
5. Save

---

**Created:** 2026-01-19
**Status:** Ready to test after running migration
