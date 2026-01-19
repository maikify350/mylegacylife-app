# Skip Question Dialog Enhancement

## Feature Request
Add a third option to the "Skip Question" dialog to permanently exclude questions from future prompts.

## Current Behavior
**Dialog has 2 buttons:**
1. **Cancel** (left) - Close dialog, keep current question
2. **Skip Question** (right, brown) - Get a new random question

**Problem:** Skipped questions can appear again later, which is frustrating for questions users never want to answer.

## Proposed Enhancement

### Three-Button Layout:
```
┌─────────────────────────────────────────────┐
│ Skip this question?                         │
│                                             │
│ ┃ "What is your earliest childhood memory?" │
│ ┃ Describe it in as much detail as you can  │
│ ┃ remember."                                │
│                                             │
│ You'll get a new random question. You can   │
│ always come back to this one later.         │
│                                             │
│  [Cancel]  [Never Ask Again]  [Skip]        │
└─────────────────────────────────────────────┘
```

### Button Specifications:

1. **Cancel** (left)
   - Style: White/outline
   - Action: Close dialog, stay on current question
   
2. **Never Ask Again** (middle) ⭐ NEW
   - Style: Red/destructive (warning color)
   - Alternative labels to consider:
     - "Don't Ask Again"
     - "Exclude Forever"
     - "Hide Question"
     - "Not Interested"
   - Action: 
     - Mark question as excluded for this subscriber
     - Load new random question
     - Never show this question to this user again

3. **Skip** (right)
   - Style: Brown (current theme color)
   - Action: Get new random question (question may appear again later)

## Database Implementation

### Option 1: New `excluded_questions` table (Recommended)
```sql
CREATE TABLE excluded_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    excluded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subscriber_id, question_id)
);

CREATE INDEX idx_excluded_questions_subscriber ON excluded_questions(subscriber_id);
```

### Option 2: Add to existing `answers` table
```sql
-- Add new column to answers table
ALTER TABLE answers ADD COLUMN is_excluded BOOLEAN DEFAULT FALSE;

-- When user clicks "Never Ask Again", create answer record with:
-- is_excluded = TRUE
-- answer_text = NULL or empty
```

**Recommendation:** Use Option 1 (separate table) because:
- Cleaner separation of concerns
- Doesn't clutter answers table with non-answers
- Easier to query excluded questions
- Can add metadata (reason, excluded_at, etc.)

## Code Changes Needed

### 1. Update `loadRandomQuestion()` function
```typescript
// Current: SELECT random question
// New: SELECT random question WHERE id NOT IN (excluded_questions for this user)

const { data: excludedIds } = await supabase
    .from('excluded_questions')
    .select('question_id')
    .eq('subscriber_id', userId)

const { data: question } = await supabase
    .from('questions')
    .select('*')
    .not('id', 'in', excludedIds.map(e => e.question_id))
    .order('random()')
    .limit(1)
    .single()
```

### 2. Add `handleNeverAskAgain()` function
```typescript
const handleNeverAskAgain = async () => {
    if (!question) return
    
    // Insert into excluded_questions
    await supabase
        .from('excluded_questions')
        .insert({
            subscriber_id: userId,
            question_id: question.id
        })
    
    // Load new question
    loadRandomQuestion()
    setShowSkipDialog(false)
}
```

### 3. Update AlertDialog
```tsx
<AlertDialogFooter className="flex gap-2">
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <Button 
        variant="destructive" 
        onClick={handleNeverAskAgain}
    >
        Never Ask Again
    </Button>
    <AlertDialogAction 
        onClick={confirmSkip} 
        className="bg-[#4A3728] hover:bg-[#5A4738]"
    >
        Skip
    </AlertDialogAction>
</AlertDialogFooter>
```

## User Experience Considerations

### Confirmation for "Never Ask Again"?
**Option A:** No confirmation (immediate action)
- Pros: Faster, cleaner UX
- Cons: Accidental clicks are permanent

**Option B:** Show confirmation dialog
- Pros: Prevents mistakes
- Cons: Extra click, more dialogs

**Recommendation:** Option A (no confirmation) because:
- Users can always contact support to restore questions
- The button label is clear about the action
- We can add an "undo" feature later if needed

### Future Enhancement: Manage Excluded Questions
Add a settings page where users can:
- View all excluded questions
- Restore excluded questions
- See when they were excluded

## Testing Checklist
- [ ] Excluded questions don't appear in random selection
- [ ] Multiple users can exclude the same question independently
- [ ] Deleting a subscriber cascades to excluded_questions
- [ ] Deleting a question cascades to excluded_questions
- [ ] UI shows all three buttons properly on mobile
- [ ] Button labels are clear and not truncated

## Priority
**Medium-High** - This is a quality-of-life improvement that prevents user frustration.

## Estimated Effort
- Database migration: 15 minutes
- Backend logic: 30 minutes
- Frontend UI: 30 minutes
- Testing: 30 minutes
- **Total: ~2 hours**

---

**Created:** 2026-01-19
**Status:** Documented (not implemented)
**Assigned:** TBD
