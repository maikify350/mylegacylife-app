# Layout & Styling Troubleshooting Guide

## ⚠️ CRITICAL: Check These FIRST When Styles Don't Apply

### 1. **Component Default Styles Override Inline Styles**

**Problem**: You add inline styles or Tailwind classes, but they don't work.

**Root Cause**: UI components (Card, Button, etc.) have **hardcoded default classes** that override your styles.

**Example from this project**:
```typescript
// ❌ BAD - Card component had p-6 hardcoded
const Card = ({ className }) => (
  <div className={cn("border p-6", className)} /> // p-6 = 24px padding!
)

// ✅ GOOD - No default padding
const Card = ({ className }) => (
  <div className={cn("border", className)} />
)
```

**How to Fix**:
1. **Check `components/ui/*.tsx` files** for hardcoded spacing classes:
   - Look for: `p-*`, `m-*`, `space-*`, `gap-*`
   - These will override your inline styles!
2. **Remove default spacing** from base components
3. **Add spacing where you use the component** instead

**Files to Check**:
- `components/ui/card.tsx` - Card, CardContent, CardHeader
- `components/ui/button.tsx` - Button variants
- Any custom wrapper components

---

### 2. **Tailwind Class Order Matters**

**Problem**: Tailwind classes don't apply as expected.

**Root Cause**: The `cn()` utility merges classes, but **later classes override earlier ones**.

**Example**:
```typescript
// ❌ Your p-2 gets overridden by component's p-6
<Card className="p-2">  // p-2 comes first
  // Card has: cn("p-6", className)  // p-6 wins!
</Card>

// ✅ Remove p-6 from Card component
<Card className="p-2">  // Now p-2 works!
</Card>
```

---

### 3. **Cache Issues in Development**

**Problem**: Code changes don't reflect in browser.

**Solutions** (in order):
1. **Hard Refresh**: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
2. **Clear Next.js Cache**:
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```
3. **Incognito Mode**: `Ctrl + Shift + N` - Fresh browser state
4. **Check DevTools**: F12 → Network tab → "Disable cache" checkbox
5. **Inspect Element**: Right-click → Inspect → See actual rendered HTML/CSS

---

### 4. **Debugging Workflow**

When styles don't work:

1. **Inspect Element** (F12 → Right-click → Inspect)
   - Check the actual HTML classes rendered
   - Look at "Computed" tab to see final CSS values
   - Look for crossed-out styles (overridden)

2. **Check Component Defaults**
   - Open `components/ui/*.tsx`
   - Search for spacing classes: `p-`, `m-`, `space-`, `gap-`
   - Remove or make them optional

3. **Verify Inline Styles**
   - Inline styles should show in HTML: `style="padding: 4px"`
   - If missing, check if component strips them

4. **Clear All Caches**
   - Browser cache (Ctrl+Shift+Delete)
   - Next.js cache (`Remove-Item .next`)
   - Restart dev server

---

### 5. **Common Gotchas**

| Issue | Cause | Solution |
|-------|-------|----------|
| Spacing too large | Component has `p-6` default | Remove from component |
| Inline styles ignored | Tailwind class overrides | Use `!important` or remove Tailwind class |
| Changes don't show | Cache | Hard refresh + clear .next |
| Gap not working | Parent has `space-y-*` | Use `gap-*` with flexbox instead |
| Line height wrong | Component has `leading-*` | Override with inline style |

---

### 6. **Best Practices**

✅ **DO**:
- Keep UI components **minimal** (no default spacing)
- Add spacing **where you use** the component
- Use **inline styles** for precise control
- **Inspect element** when debugging
- Document component defaults

❌ **DON'T**:
- Add `p-*` or `m-*` to base components
- Assume inline styles always work
- Trust the code without inspecting browser
- Forget to clear cache after component changes

---

## Quick Reference

### Spacing Values
```
gap-1  = 4px
gap-2  = 8px
gap-4  = 16px
gap-6  = 24px

p-1 = 4px
p-2 = 8px
p-4 = 16px
p-6 = 24px
```

### Debug Commands
```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Restart dev server
npm run dev

# Check for hardcoded spacing in components
grep -r "p-[0-9]" components/ui/
```

---

**Last Updated**: January 2026  
**Lesson Learned**: Always check component defaults before debugging styles!
