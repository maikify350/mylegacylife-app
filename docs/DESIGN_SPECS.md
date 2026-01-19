# MyLegacyLife.AI - Design Specifications

## Layout Principles

### Spacing & Density

#### General Spacing Guidelines
- **Minimize white space**: The application should favor compact, dense layouts over spacious ones
- **Default padding**: Use `2px` as the default padding for card content and similar containers
- **Avoid excessive padding**: Replace large utility classes like `p-6` (24px) with `p-2` (8px) or custom `2px` padding

#### Component-Specific Guidelines

##### CardContent Component
- **Default padding**: `2px` on all sides
- **Override capability**: Allow inline styles or className to override defaults
- **Location**: `components/ui/card.tsx`

##### Question Lists & Numbered Content
- **Prefer tables over flex for text-only content**: When displaying simple numbered lists or text-only content without graphics, use HTML tables instead of flexbox layouts
- **Rationale**: Flexbox with decorative elements (like circular badges) creates unnecessary vertical spacing
- **Implementation**:
  ```tsx
  // ❌ AVOID: Flex with large decorative elements
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-full bg-accent">1</div>
    <p>Question text</p>
  </div>
  
  // ✅ PREFER: Table with minimal padding
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      <tr>
        <td style={{ padding: '2px 8px 2px 4px', textAlign: 'right', width: '30px' }}>
          1
        </td>
        <td style={{ padding: '2px 4px' }}>
          <p>Question text</p>
        </td>
      </tr>
    </tbody>
  </table>
  ```

##### Table Layouts
- **Cell padding**: Use `2px` for top/bottom padding in table cells
- **Border collapse**: Always use `borderCollapse: 'collapse'` to eliminate cell spacing
- **Vertical alignment**: Use `verticalAlign: 'top'` for consistent alignment
- **Number columns**: 
  - Width: `30px` (sufficient for 2-digit numbers)
  - Alignment: `textAlign: 'right'`
  - Padding: `2px 8px 2px 4px` (right padding for spacing from content)

### When to Use Tables vs Flex

#### Use Tables When:
- Content is primarily text-based
- You need a simple two-column layout (e.g., number + description)
- Minimizing vertical spacing is critical
- No graphics or complex visual elements are involved

#### Use Flex When:
- You need responsive wrapping behavior
- Content includes images, icons, or complex visual elements
- You need dynamic spacing based on content
- Alignment needs to be flexible across different screen sizes

## Typography

### Line Height
- **Compact text**: Use `lineHeight: '1.2'` for dense layouts
- **Body text**: Use default or `1.5` for better readability in paragraphs

### Margins & Padding
- **Text elements**: Set `margin: '0'` and `padding: '0'` explicitly to avoid browser defaults
- **Consistency**: Always specify these values rather than relying on defaults

## Color & Visual Design

### Accent Colors
- Use `text-accent` class for emphasis on numbers, labels, and key information
- Maintain consistency with the accent color throughout the application

### Hover States
- **Subtle transitions**: Use `transition-colors` for smooth hover effects
- **Background changes**: `bg-muted/30` → `bg-muted/50` for subtle hover feedback
- **Border highlights**: `border-transparent` → `border-accent` for interactive elements

## Performance Considerations

### Inline Styles vs Classes
- **Precise values**: Use inline styles for specific pixel values (e.g., `2px` padding)
- **Utility classes**: Use Tailwind classes for standard spacing values
- **Override patterns**: Inline styles take precedence, allowing component-level customization

## Examples

### Questions Page Implementation
- **Location**: `app/questions/page.tsx`
- **Pattern**: Table-based layout with 2px padding
- **Result**: ~34px row height vs previous 40px+ with circular badges
- **Improvement**: ~15% reduction in vertical space

## Future Considerations

- Apply table-based layouts to other list-heavy pages (e.g., story lists, family tree views)
- Consider creating a reusable `<CompactList>` component that encapsulates this pattern
- Document any exceptions where larger spacing is intentionally used

## Common Issues & Solutions

### Next.js Image Component with Tailwind CSS

**Issue**: Next.js Image component throws aspect ratio warning when using Tailwind width/height classes
```
Image with src "..." has either width or height modified, but not the other.
If you use CSS to change the size of your image, also include the styles 
'width: "auto"' or 'height: "auto"' to maintain the aspect ratio.
```

**Root Cause**: 
- Next.js Image component requires both `width` and `height` props for optimization
- When Tailwind classes like `w-48` or `h-auto` are applied, they override one dimension via CSS
- Next.js detects this CSS override and warns about potential aspect ratio distortion

**Solution**:
Use `className="w-auto h-auto"` to let the image use its intrinsic dimensions:

```tsx
// ✅ CORRECT: Both dimensions set to auto
<Image
  src="/logo.png"
  alt="Logo"
  width={192}
  height={192}
  className="w-auto h-auto"
  priority
/>

// ❌ AVOID: Setting only one dimension
<Image
  src="/logo.png"
  alt="Logo"
  width={192}
  height={192}
  className="w-48"  // Only width specified
  priority
/>

// ❌ AVOID: Setting width with auto height
<Image
  src="/logo.png"
  alt="Logo"
  width={192}
  height={192}
  className="w-48 h-auto"  // Mixed fixed/auto dimensions
  priority
/>
```

**Why This Works**:
- The `width` and `height` props tell Next.js the intrinsic dimensions for optimization
- `className="w-auto h-auto"` tells CSS to use those intrinsic dimensions without override
- This satisfies Next.js's aspect ratio check while maintaining proper image sizing

**When to Use Different Approaches**:
- **Responsive sizing**: Use Next.js `sizes` prop instead of Tailwind width classes
- **Container-based sizing**: Wrap Image in a sized div and use `fill` prop with `object-fit`
- **Fixed dimensions**: If you need specific pixel dimensions, use inline styles on both width and height

---

**Last Updated**: 2026-01-18  
**Version**: 1.1
