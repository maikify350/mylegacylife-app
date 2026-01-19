# Layout & Styling Debugging Guide

This document helps you quickly resolve common layout and styling issues in the MyLegacyLife.AI application.

## Table of Contents
1. [Critical Issue: Component Default Styles](#critical-issue-component-default-styles)
2. [Card Component Padding Inconsistencies](#card-component-padding-inconsistencies)
3. [Caching Issues](#caching-issues)
4. [Style Application Problems](#style-application-problems)
5. [Best Practices](#best-practices)
6. [Quick Troubleshooting Checklist](#quick-troubleshooting-checklist)

---

## Critical Issue: Component Default Styles

### Problem: Hardcoded Padding in Card Component

**Symptom**: You apply padding/margin styles to a Card component, but they don't take effect or are inconsistent.

**Root Cause**: The `Card` component in `components/ui/card.tsx` previously had a hardcoded `p-6` class (24px padding) that overrode all custom spacing attempts.

**Solution**:
1. **Check `components/ui/card.tsx`** - The base `Card` component should NOT have default padding
2. **Apply padding explicitly** where needed using inline styles or className props
3. **Be consistent** - If you set padding on one Card, check ALL Card usages for consistency

**Example of the fix**:
```typescript
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

## Card Component Padding Inconsistencies

### Problem: Inconsistent Padding Across Card Sub-components

**Symptom**: You set padding on `<Card>` but `<CardHeader>` and `<CardContent>` still have different spacing.

**Root Cause**: Card has **multiple sub-components** (Card, CardHeader, CardContent, CardFooter) that each can have their own default padding. Setting padding on one doesn't affect the others.

**Example of the Problem**:
```typescript
// ❌ INCONSISTENT - Only Card has custom padding
<Card className="bg-gradient">
  <CardContent style={{ padding: '8px' }}>  // ✅ 8px padding
    <div>Stats here</div>
  </CardContent>
</Card>

<Card>
  <CardHeader>  // ❌ Still has default padding!
    <CardTitle>Questions</CardTitle>
  </CardHeader>
  <CardContent>  // ❌ Still has default padding!
    <div>Questions here</div>
  </CardContent>
</Card>
```

**Solution - Apply Padding Consistently**:
```typescript
// ✅ CONSISTENT - All Cards use same padding
<Card className="bg-gradient">
  <CardContent style={{ padding: '8px' }}>
    <div>Stats here</div>
  </CardContent>
</Card>

<Card>
  <CardHeader style={{ padding: '8px' }}>  // ✅ Same 8px
    <CardTitle>Questions</CardTitle>
  </CardHeader>
  <CardContent style={{ padding: '8px' }}>  // ✅ Same 8px
    <div>Questions here</div>
  </CardContent>
</Card>
```

**Checklist When Adjusting Card Styling**:
1. ✅ Search for ALL `<Card` usages in the file
2. ✅ Check if `<CardHeader>`, `<CardContent>`, or `<CardFooter>` are used
3. ✅ Apply the SAME padding value to ALL sub-components
4. ✅ Use inline styles for precise control: `style={{ padding: '8px' }}`
5. ✅ Test in browser with Inspect Element to verify

**Quick Search Command**:
```powershell
# Find all Card usages in a file
grep -n "Card" app/questions/page.tsx
```

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
