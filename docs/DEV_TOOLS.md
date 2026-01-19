# Development Tools System - Complete Guide

## Overview
The MyLegacyLife development tools provide a comprehensive, performance-first debugging and monitoring environment. This system is designed to be **always available in development mode** while maintaining **zero performance impact** through intelligent lazy loading and on-demand execution.

---

## Core Components

### 1. Dev Health Indicator Panel
**File**: `components/dev-health-indicator.tsx`

A floating, draggable panel that provides real-time monitoring and quick access to development tools.

#### Features:
- **Health Monitoring**
  - Supabase connection status
  - LanguageTool API status
  - Real-time health checks every 30 seconds
  
- **Integrated Logger**
  - Two modes: CONCISE (major events) and VERBOSE (everything)
  - Real-time log updates (500ms refresh)
  - Auto-scroll to latest entries (tail -f behavior)
  - Persistent storage (last 100 entries in localStorage)
  - F12 hotkey to toggle log view
  
- **Git Integration**
  - Real-time working tree status
  - One-click commit with auto-generated messages
  - Shows changed file count
  
- **Database Explorer**
  - Quick access to table statistics
  - Real-time record counts
  - Manual refresh on-demand
  
- **Test Log Generator**
  - Creates mix of CONCISE and VERBOSE logs
  - Useful for testing log viewer functionality

#### Hotkeys:
- **F10**: Toggle panel visibility
- **F12**: Toggle log view

#### Position & Size:
- **Draggable**: Click and drag anywhere on panel
- **Resizable**: Drag bottom edge to resize vertically
- **Persistent**: Position and height saved to localStorage
- **Constraints**: 
  - Min height: 280px
  - Max width: 400px
  - Min width: 280px
- **Z-Index**: 9999 (always on top)

#### Performance Optimizations:
- Health checks: Every 30 seconds (not every render)
- Log refresh: Every 500ms (only when log view is open)
- Table count: On-demand only (initial load + manual refresh)
- Git status: On mount only (not continuous polling)

---

### 2. Database Table Explorer
**File**: `components/db-table-explorer/table-explorer-dialog.tsx`

A draggable dialog for inspecting database tables and record counts.

#### Features:
- **Table List View**
  - Auto-discovers all tracked tables
  - Categorized display (Core, Community, System, Audit)
  - Alphabetically sorted within categories
  - Real-time record counts
  - Error handling for missing tables
  
- **Compact Design**
  - Tight spacing (1-2px gaps)
  - Minimal padding (4px dialog, 2px content)
  - Small fonts (text-xs, text-sm)
  - Maximum real estate utilization
  
- **Windows-Style UI**
  - Solid blue header (bg-blue-600)
  - 30px header height
  - White text on blue background
  - Standard close button (×)
  
- **Draggable**
  - Grab header to drag
  - Position persists in localStorage
  - Independent from dev panel (decoupled drag)
  
- **Manual Refresh Only**
  - Fetches on dialog open
  - Manual refresh button with spinner
  - No auto-refresh (performance first)

#### Z-Index Layering:
- **Backdrop**: 9999 (above dev panel)
- **Dialog**: 10000 (above backdrop)

#### Tracked Tables:
```typescript
const coreTables = [
  'subscribers',
  'questions', 
  'answers',
  'contributed_questions',
  'user_progress'
]
```

#### Performance Optimizations:
- **No auto-refresh**: Only fetches when explicitly requested
- **On-demand loading**: Only queries when dialog is opened
- **Efficient queries**: Uses `count: 'exact', head: true` for fast counts
- **Error resilience**: Failed table queries don't break the UI

---

### 3. Logger System
**File**: `lib/logger.ts`

A syslog-compliant logging system with two modes and persistent storage.

#### Log Levels (Syslog Standard):

**CONCISE Logs** (Always visible):
- 🚨 `emergency` - System unusable
- 🔴 `alert` - Action required immediately
- ❗ `critical` - Critical conditions
- ❌ `error` - Error conditions
- ⚠️ `warning` - Warning conditions
- 📢 `notice` - Normal but significant

**VERBOSE Logs** (Only in verbose mode):
- ℹ️ `info` - Informational messages
- 🔍 `debug` - Debug messages

#### Convenience Methods:
```typescript
logger.route('/api/endpoint', 'POST')      // CONCISE
logger.appInit('Application started')       // CONCISE
logger.auth('User logged in', { userId })   // CONCISE
logger.crud('CREATE', 'users', { id })      // VERBOSE
logger.api('/api/endpoint', 'POST', 200)    // VERBOSE
logger.db('SELECT * FROM users')            // VERBOSE
```

#### Storage:
- **In-memory**: Last 1000 entries
- **localStorage**: Last 100 entries
- **Auto-cleanup**: Oldest entries removed first

#### Integration:
See `docs/LOGGER_INTEGRATION.md` for complete integration guide.

---

## API Endpoints

### `/api/admin/tables`
**Purpose**: Fetch table statistics for database explorer

**Method**: GET

**Response**:
```json
{
  "tables": [
    {
      "name": "subscribers",
      "count": 12,
      "category": "core"
    }
  ],
  "totalTables": 5,
  "totalRecords": 142,
  "timestamp": "2026-01-19T..."
}
```

**Performance**:
- Uses `count: 'exact', head: true` for efficiency
- Only queries tracked tables (not all tables)
- Error handling per table (one failure doesn't break all)

**Security**:
- Development mode only (`NODE_ENV !== 'development'`)
- Returns 403 in production

---

### `/api/dev-git`
**Purpose**: Git operations (status, commit)

**Method**: POST

**Actions**:
- `status`: Get working tree status
- `commit`: Auto-commit with generated message

**Performance**:
- Called on dev panel mount only
- Not polled continuously
- Fast git commands (status only, no log)

---

## Performance Philosophy

### Core Principles:

1. **Lazy Loading**
   - Components only render when needed
   - API calls only when explicitly triggered
   - No background polling unless necessary

2. **On-Demand Execution**
   - Table counts: Only on open + manual refresh
   - Git status: Only on mount
   - Logs: Only refresh when log view is open

3. **Efficient Queries**
   - Use `head: true` for count-only queries
   - Limit result sets
   - Cache when appropriate

4. **Minimal Re-renders**
   - State updates only when values change
   - Memoization where beneficial
   - Debounced updates for rapid changes

5. **Smart Intervals**
   - Health checks: 30 seconds (not critical)
   - Log refresh: 500ms (only when visible)
   - Table counts: Manual only (rarely changes)

### Performance Metrics:

| Feature | Frequency | Impact |
|---------|-----------|--------|
| Health checks | 30s | Low |
| Log refresh | 500ms (when visible) | Low |
| Table counts | Manual only | None |
| Git status | On mount only | None |
| Position save | On change | Negligible |

---

## File Structure

```
mylegacylife-app/
├── components/
│   ├── dev-health-indicator.tsx          # Main dev panel
│   └── db-table-explorer/
│       ├── table-explorer-dialog.tsx     # Main dialog
│       ├── table-list-view.tsx           # Table list component
│       └── types.ts                      # TypeScript interfaces
├── lib/
│   └── logger.ts                         # Logger system
├── app/api/
│   ├── admin/
│   │   └── tables/
│   │       └── route.ts                  # Table stats API
│   └── dev-git/
│       └── route.ts                      # Git operations API
└── docs/
    ├── DEV_TOOLS.md                      # This file
    └── LOGGER_INTEGRATION.md             # Logger integration guide
```

---

## Usage Guide

### For Developers:

#### Starting Development:
1. Run `npm run dev`
2. Dev panel appears automatically in top-left
3. Press **F10** to toggle visibility
4. Press **F12** to toggle log view

#### Monitoring Health:
- Green dot: All systems healthy
- Red dot: Service error
- Click service name for details

#### Viewing Logs:
1. Press **F12** or click "View Log"
2. Toggle between CONCISE/VERBOSE modes
3. Use "Clear" to reset logs
4. Logs auto-scroll to latest entries

#### Checking Database:
1. Click "🗄️ Tables" button
2. View table counts by category
3. Click "Refresh" to update counts
4. Drag dialog to preferred position

#### Git Operations:
1. View changed file count in panel
2. Click "💾 Git Commit" to auto-commit
3. Generated message includes file list

#### Testing Logs:
1. Click "🧪 Generate Test Logs"
2. Creates mix of CONCISE and VERBOSE logs
3. Watch real-time updates

---

## Integration Checklist

When adding new features, integrate logging:

- [ ] Import logger: `import { logger } from '@/lib/logger'`
- [ ] Log route entry (API): `logger.route('/api/path', 'METHOD')`
- [ ] Log validation failures: `logger.warning('Category', 'Message')`
- [ ] Log CRUD operations: `logger.crud('CREATE', 'table', { id })`
- [ ] Log success: `logger.notice('Category', 'Success message')`
- [ ] Log errors: `logger.error('Category', 'Error', { error })`
- [ ] Test in both CONCISE and VERBOSE modes

---

## Troubleshooting

### Dev Panel Not Appearing:
- Check `NODE_ENV` is 'development'
- Press F10 to toggle visibility
- Check browser console for errors

### Logs Not Updating:
- Ensure log view is open (F12)
- Check if mode is CONCISE (some logs won't show)
- Verify logger is imported correctly

### Table Explorer Not Loading:
- Check API endpoint is accessible
- Verify tables exist in database
- Check browser console for errors
- Click "Refresh" to retry

### Performance Issues:
- Disable log view when not needed (F12)
- Close table explorer when not in use
- Check for excessive logging in code

---

## Future Enhancements

### Phase 2: Table Detail View
- Click table name to drill down
- View actual table data
- Pagination (10/25/50 per page)
- Search and filter
- Column sorting
- Export to CSV
- Inline editing (CRUD operations)

### Phase 3: Advanced Features
- SQL query builder
- Table relationship viewer
- Data visualization
- Change history tracking
- Backup/restore functionality
- Schema editor

---

## Best Practices

### DO:
✅ Use logger throughout the application  
✅ Choose appropriate log levels (CONCISE vs VERBOSE)  
✅ Include useful metadata in logs  
✅ Test with dev panel open  
✅ Keep dev panel compact and out of the way  
✅ Use manual refresh for infrequent updates  

### DON'T:
❌ Log in tight loops (performance impact)  
❌ Log sensitive data (passwords, tokens)  
❌ Auto-refresh data that rarely changes  
❌ Poll APIs continuously  
❌ Leave debug logs in production code  
❌ Ignore performance metrics  

---

## Security Considerations

### Development Only:
- All dev tools check `NODE_ENV !== 'development'`
- APIs return 403 in production
- No dev panel in production builds

### Data Safety:
- Read-only operations by default
- Write operations require explicit user action
- No automatic data modifications
- Confirmation dialogs for destructive actions

### Access Control:
- Currently: Development mode only
- Future: Admin authentication when needed
- No public access to dev tools

---

## Maintenance

### Regular Tasks:
- Review log categories for consistency
- Update tracked tables list as schema evolves
- Monitor performance metrics
- Clean up old localStorage data
- Update documentation

### Code Quality:
- TypeScript strict mode
- ESLint compliance
- Proper error handling
- Comprehensive logging
- Performance monitoring

---

## Summary

The MyLegacyLife dev tools provide a **powerful, performance-first development environment** that:

- ✅ **Always available** in development mode
- ✅ **Zero performance impact** through lazy loading
- ✅ **Comprehensive monitoring** of health, logs, and database
- ✅ **Intuitive UI** with draggable panels and hotkeys
- ✅ **Persistent state** across sessions
- ✅ **Extensible architecture** for future enhancements

**Performance First. Usability Second. Always Essential.**

---

*Last Updated: 2026-01-19*  
*Version: 1.0*  
*Maintained by: Development Team*
