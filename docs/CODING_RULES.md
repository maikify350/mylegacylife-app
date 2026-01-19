# MyLegacyLife.AI Coding Rules

## UI/UX Standards

### Rule 1: Never Use Native JavaScript Dialogs
**ALWAYS use shadcn/ui components for user feedback:**

❌ **NEVER USE:**
```typescript
alert('Message')
confirm('Are you sure?')
prompt('Enter value')
```

✅ **ALWAYS USE:**
```typescript
// For messages/notifications
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Title</AlertDialogTitle>
      <AlertDialogDescription>Message</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>OK</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// For confirmations
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Action</AlertDialogTitle>
      <AlertDialogDescription>Are you sure?</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Why?**
- Native dialogs are ugly and inconsistent across browsers
- They block the entire browser (bad UX)
- Cannot be styled to match our theme
- Not accessible or mobile-friendly

### Rule 2: Color Scheme
- **Primary Brown**: `#4A3728` (buttons, accents)
- **Hover Brown**: `#5A4738`
- **Always use these for primary actions**

### Rule 3: Accessibility
- All interactive elements must have `title` or `aria-label`
- Proper heading hierarchy (h1 → h2 → h3)
- Keyboard navigation support
- Color contrast ratios must meet WCAG AA standards

### Rule 4: Database Audit Fields (MANDATORY)
**Every database table MUST include these 4 audit fields:**

```sql
created_at timestamptz not null default now(),
created_by uuid null,
updated_at timestamptz not null default now(),
updated_by uuid null
```

**Why?**
- Track who created/modified records
- Essential for debugging and auditing
- Required for compliance and data integrity
- Consistent across all tables

**Naming Convention:**
- Use lowercase with underscores: `created_at`, not `createdAt` or `CreatedAt`
- Use `timestamptz` (timestamp with timezone), not `TIMESTAMP WITH TIME ZONE`
- Use `uuid null` for user references (nullable since system can create records)

### Rule 5: Responsive Design
- Mobile-first approach
- Test on: Mobile (375px), Tablet (768px), Desktop (1440px)
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

## Code Quality

### Rule 6: TypeScript Strict Mode
- Always use proper types
- No `any` unless absolutely necessary
- Define interfaces for all props

### Rule 7: Component Structure
```typescript
// 1. Imports
import { ... } from '...'

// 2. Types/Interfaces
interface ComponentProps { ... }

// 3. Component
export function Component({ props }: ComponentProps) {
  // 4. State
  const [state, setState] = useState()
  
  // 5. Refs
  const ref = useRef()
  
  // 6. Effects
  useEffect(() => { ... }, [])
  
  // 7. Handlers
  const handleAction = () => { ... }
  
  // 8. Early returns
  if (loading) return <Loading />
  
  // 9. Render
  return (...)
}
```

### Rule 8: Git Commits
- Commit frequently with clear messages
- Format: `verb + what changed`
- Examples:
  - ✅ "Add grammar check dialog"
  - ✅ "Fix TextStyle import syntax"
  - ❌ "updates"
  - ❌ "fix bug"

## Performance

### Rule 9: Image Optimization
- Use Next.js `<Image>` component when possible
- Lazy load images below the fold
- Compress images before upload
- Use WebP format when supported

### Rule 10: Code Splitting
- Use dynamic imports for large components
- Lazy load routes
- Keep bundle size under 200KB per route

## Security

### Rule 11: Environment Variables
- Never commit `.env.local` to git
- Use `NEXT_PUBLIC_` prefix for client-side vars
- Keep API keys server-side when possible

### Rule 12: Input Validation
- Validate all user input
- Sanitize HTML content
- Use Zod or similar for schema validation

## Testing (Future)

### Rule 13: Test Coverage
- Unit tests for utilities
- Integration tests for critical flows
- E2E tests for user journeys
- Aim for 80% coverage

---

**Last Updated**: 2026-01-19
**Maintained By**: Development Team
