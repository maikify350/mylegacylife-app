# Rich Text Editor - Available Features

## ✅ Currently Implemented

### Basic Formatting
- **Bold** - Make text bold
- **Italic** - Make text italic  
- **Underline** - Underline text
- **Undo** - Undo last change
- **Redo** - Redo last undone change

### Lists
- **Bullet List** - Unordered list with bullets
- **Numbered List** - Ordered list with numbers

### Text Styling
- **Text Color** - 7 color options (black, red, green, blue, yellow, magenta, cyan)
- **Highlight** - 6 highlight colors + remove option

### Media
- **Photo** - Insert and edit images with crop/zoom
- **PROOFREAD** - Grammar and spell check via LanguageTool

### Utilities
- **Character Counter** - Shows character and word count
- **Image Editor** - Crop, zoom, and adjust images before inserting

---

## 🎯 Highly Recommended to Add

### 1. **Headings** (H1, H2, H3)
**Why:** Helps organize long stories into sections
**Use case:** "My Childhood", "College Years", "Career"
```tsx
<Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
  H2
</Button>
```

### 2. **Blockquote**
**Why:** Perfect for highlighting memorable quotes or important moments
**Use case:** "As my grandfather always said..."
```tsx
<Button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
  Quote
</Button>
```

### 3. **Horizontal Rule**
**Why:** Visual separator between different topics/time periods
**Use case:** Separate different life chapters
```tsx
<Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
  ---
</Button>
```

### 4. **Text Alignment** (Left, Center, Right)
**Why:** Center important text like titles or quotes
**Use case:** Center a chapter title
```tsx
import TextAlign from '@tiptap/extension-text-align'
// Configure: TextAlign.configure({ types: ['heading', 'paragraph'] })
```

---

## 🤔 Consider Adding (Medium Priority)

### 5. **Superscript/Subscript**
**Why:** For dates, footnotes (e.g., "Born in 1945¹")
**Use case:** Reference notes or dates

### 6. **Strike-through**
**Why:** Show corrections or changes in thinking
**Use case:** "I thought I was 5~~6~~ years old"

### 7. **Code/Monospace**
**Why:** For preserving formatting of letters, addresses
**Use case:** Preserve spacing in old letter transcriptions

### 8. **Link**
**Why:** Reference external sources or family websites
**Use case:** Link to family tree sites, historical references
```tsx
import Link from '@tiptap/extension-link'
```

---

## 📝 Nice to Have (Lower Priority)

### 9. **Table**
**Why:** Organize information (family trees, timelines)
**Use case:** List of siblings, timeline of events
```tsx
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
```

### 10. **Task List** (Checkboxes)
**Why:** Track memories to write about
**Use case:** "Things I want to remember to write about"
```tsx
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
```

### 11. **Indent/Outdent**
**Why:** Better paragraph organization
**Use case:** Nested stories within stories

### 12. **Font Size**
**Why:** Emphasize important parts
**Use case:** Make chapter titles larger

---

## 🚫 Probably Skip (Not Needed for Life Stories)

### 13. **Collaboration/Comments**
- Real-time editing with others
- **Skip:** Single-user focus for now

### 14. **Emoji Picker**
- Insert emojis easily
- **Skip:** Can type emojis directly, not essential

### 15. **Mention (@user)**
- Tag other users
- **Skip:** No multi-user features yet

### 16. **Slash Commands** (Type "/" for menu)
- Quick command menu
- **Skip:** Adds complexity, toolbar is enough

### 17. **Markdown Shortcuts**
- Type `**bold**` to make bold
- **Skip:** Users may not know markdown

---

## 💡 My Top 3 Recommendations

Based on the use case (writing life stories), I recommend adding:

### 1. **Headings (H1, H2, H3)** ⭐⭐⭐
**Impact:** HIGH - Essential for organizing long stories
**Complexity:** LOW - Easy to implement
**User Value:** Helps structure memories by chapter/topic

### 2. **Blockquote** ⭐⭐⭐
**Impact:** HIGH - Perfect for memorable quotes
**Complexity:** LOW - Easy to implement  
**User Value:** Highlights important sayings, quotes from loved ones

### 3. **Horizontal Rule** ⭐⭐
**Impact:** MEDIUM - Nice visual separator
**Complexity:** LOW - Very easy to implement
**User Value:** Separates different time periods or topics

---

## 🎨 Current Toolbar Layout

```
[B] [I] [U] [•] [1.] [🎨] [✏️] [↶] [↷]  |  [📷 PHOTO] [✓ PROOFREAD]
```

## 📋 Proposed Toolbar with Headings + Quote

```
[H1] [H2] [B] [I] [U] ["] [•] [1.] [🎨] [✏️] [↶] [↷]  |  [📷 PHOTO] [✓ PROOFREAD]
```

Or grouped by function:
```
Structure: [H1] [H2] ["] [---]
Format:    [B] [I] [U] [🎨] [✏️]  
Lists:     [•] [1.]
History:   [↶] [↷]
Tools:     [📷 PHOTO] [✓ PROOFREAD]
```

---

## 🤷 What Would You Like?

**Questions to consider:**
1. Do users write long stories that need headings?
2. Do they quote people often (grandparents, parents)?
3. Do they need to separate different time periods visually?
4. Would they use tables for family trees or timelines?

**My recommendation:** Start with **Headings** and **Blockquote** - they're simple, powerful, and perfect for storytelling!

---

**Created:** 2026-01-19
**Status:** Recommendation document
