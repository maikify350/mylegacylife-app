# MyLegacyLife.AI - Project Configuration

## Agent Behavior Preferences

### Auto-Execute Commands
**Default: AUTO-ACCEPT git commands**

The following commands should auto-execute without requiring user approval:
- `git add -A`
- `git commit -m "..."`
- `git status`
- `git log`
- `git diff`

**Rationale:**
- Git operations are safe and reversible
- Frequent commits are part of our workflow
- User can always revert if needed
- Reduces friction in development flow

### Commands That REQUIRE Approval
- `git push` - Affects remote repository
- `npm install` - Modifies dependencies (though usually safe)
- `supabase db push` - Affects production database
- File deletions
- Destructive operations

### User Preference
> "I want git commits to auto-run by default. I'll tell you when NOT to commit."

---

## Development Workflow

### Standard Flow
1. Make code changes
2. Auto-commit with descriptive message
3. Continue working
4. User can review git history anytime

### When NOT to Auto-Commit
- User explicitly says "don't commit yet"
- Working on experimental features
- Mid-refactor (incomplete state)

---

## Git Commit Standards

### Message Format
- Use imperative mood: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference rule violations fixed (e.g., "Fix Rule #1 violation")

### Commit Frequency
- After each logical change
- After fixing bugs
- After adding features
- After updating documentation

---

**Last Updated:** 2026-01-19
**Status:** Active preference
