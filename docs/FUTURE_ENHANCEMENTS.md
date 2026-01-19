# Future Enhancements

## Database Table Explorer

### Performance Optimizations
- **Two-stage search query** (ID-based filtering)
  - Current: Search returns all columns directly
  - Proposed: 
    1. First query: Search and return only matching IDs
    2. Second query: Fetch full records using `WHERE id IN (...)`
  - Benefits: Better performance on large tables, cleaner separation of concerns
  - Priority: Medium (only needed when tables grow large)

### UI/UX Improvements
- **JSON formatter toggle**
  - Add button to toggle between raw JSON and formatted/columnar display
  - Useful for debugging complex nested data
  - Priority: Low (nice-to-have for dev tool)

### Search Enhancements
- **Column-specific search**
  - Allow searching within specific columns
  - Example: "email:john" or "status:submitted"
  - Priority: Low (full-text search is sufficient for dev tool)

- **Search result highlighting**
  - Highlight matched terms in search results
  - Priority: Low

### Data Display
- **Row expansion**
  - Click row to expand and show full details
  - Useful for viewing truncated text fields
  - Priority: Medium

- **Column visibility toggle**
  - Show/hide specific columns
  - Reorder columns
  - Priority: Low

### Export Features
- **Export to CSV**
  - Export current view/search results
  - Priority: Low

- **Copy cell value**
  - Click to copy individual cell values
  - Priority: Low

## General Application

### Performance
- **Query caching**
  - Cache frequently accessed data
  - Invalidate on mutations
  - Priority: Medium

### Developer Experience
- **Hot reload for migrations**
  - Auto-detect and prompt to run new migrations
  - Priority: Low

### Documentation
- **Interactive API documentation**
  - Auto-generate from code
  - Priority: Low
