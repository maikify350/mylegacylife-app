# Logger Integration Guide

## Overview
The logger is a **global singleton** (`logger`) that can be imported and used anywhere in the application - client components, server components, API routes, and server actions.

## Quick Start

### 1. Import the logger
```typescript
import { logger } from '@/lib/logger'
```

### 2. Use it anywhere
```typescript
// Client components
logger.info('UI', 'Button clicked', { buttonId: 'submit' })

// API routes
logger.route('/api/endpoint', 'POST')
logger.crud('CREATE', 'table_name', { id: newRecord.id })

// Server actions
logger.notice('Auth', 'User logged in', { userId: user.id })
```

## Log Levels (Syslog Standard)

### CONCISE Logs (Always Visible)
These appear in both CONCISE and VERBOSE modes:

```typescript
// 🚨 System unusable
logger.emergency('Category', 'Message', { optional: 'metadata' })

// 🔴 Action required immediately
logger.alert('Category', 'Message')

// ❗ Critical conditions
logger.critical('Category', 'Message')

// ❌ Error conditions
logger.error('Category', 'Error message', { error: err.message })

// ⚠️ Warning conditions
logger.warning('Category', 'Warning message')

// 📢 Normal but significant (MOST COMMON FOR CONCISE)
logger.notice('Category', 'Important event')
```

### VERBOSE Logs (Only in Verbose Mode)
These only appear when mode is set to VERBOSE:

```typescript
// ℹ️ Informational messages
logger.info('Category', 'Info message', { data: value })

// 🔍 Debug messages
logger.debug('Category', 'Debug details', { state: currentState })
```

## Convenience Methods

### Routes (CONCISE)
```typescript
logger.route('/api/users', 'POST')
logger.route('/dashboard', 'GET')
```

### Application Lifecycle (CONCISE)
```typescript
logger.appInit('Application started')
logger.appInit('Database connected')
```

### Authentication (CONCISE)
```typescript
logger.auth('User logged in', { userId: user.id })
logger.auth('Login failed', { email: email })
```

### CRUD Operations (VERBOSE)
```typescript
logger.crud('CREATE', 'users', { id: newUser.id })
logger.crud('READ', 'posts', { count: posts.length })
logger.crud('UPDATE', 'profile', { userId: user.id })
logger.crud('DELETE', 'comment', { id: commentId })
```

### API Calls (VERBOSE)
```typescript
logger.api('/api/endpoint', 'POST', 200)
logger.api('/api/endpoint', 'GET', 404)
```

### Database Queries (VERBOSE)
```typescript
logger.db('SELECT * FROM users WHERE id = $1', { id: userId })
```

## Integration Examples

### API Route Example
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    logger.route('/api/create-user', 'POST')
    
    try {
        const { email, name } = await request.json()
        
        // Validation
        if (!email) {
            logger.warning('API', 'Create user validation failed: missing email')
            return NextResponse.json({ error: 'Email required' }, { status: 400 })
        }
        
        const supabase = await createClient()
        
        logger.info('API', 'Creating new user', { email })
        
        const { data, error } = await supabase
            .from('users')
            .insert({ email, name })
            .select()
            .single()
        
        if (error) {
            logger.error('API', 'Failed to create user', { error: error.message })
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        }
        
        logger.crud('CREATE', 'users', { id: data.id })
        logger.notice('API', 'User created successfully', { userId: data.id })
        
        return NextResponse.json({ success: true, user: data })
        
    } catch (error) {
        logger.error('API', 'Create user API error', { 
            error: error instanceof Error ? error.message : 'Unknown error' 
        })
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
```

### Client Component Example
```typescript
'use client'

import { useState } from 'react'
import { logger } from '@/lib/logger'

export function MyComponent() {
    const [data, setData] = useState(null)
    
    const handleSubmit = async () => {
        logger.info('UI', 'Form submission started')
        
        try {
            const response = await fetch('/api/endpoint', {
                method: 'POST',
                body: JSON.stringify({ /* data */ })
            })
            
            if (!response.ok) {
                logger.warning('UI', 'Form submission failed', { status: response.status })
                return
            }
            
            const result = await response.json()
            logger.notice('UI', 'Form submitted successfully', { id: result.id })
            setData(result)
            
        } catch (error) {
            logger.error('UI', 'Form submission error', { 
                error: error instanceof Error ? error.message : 'Unknown' 
            })
        }
    }
    
    return <button onClick={handleSubmit}>Submit</button>
}
```

### Server Action Example
```typescript
'use server'

import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

export async function saveAnswer(questionId: string, answer: string) {
    logger.info('ServerAction', 'Saving answer', { questionId })
    
    try {
        const supabase = await createClient()
        
        const { data, error } = await supabase
            .from('answers')
            .insert({ question_id: questionId, answer_text: answer })
            .select()
            .single()
        
        if (error) {
            logger.error('ServerAction', 'Failed to save answer', { error: error.message })
            throw new Error('Failed to save answer')
        }
        
        logger.crud('CREATE', 'answers', { id: data.id })
        logger.notice('ServerAction', 'Answer saved successfully', { answerId: data.id })
        
        return { success: true, id: data.id }
        
    } catch (error) {
        logger.error('ServerAction', 'Save answer error', { 
            error: error instanceof Error ? error.message : 'Unknown' 
        })
        throw error
    }
}
```

## Best Practices

### 1. Choose the Right Level
- **CONCISE (notice, warning, error)**: User actions, API endpoints, auth events, major state changes
- **VERBOSE (info, debug)**: CRUD operations, detailed flow, internal state

### 2. Use Consistent Categories
```typescript
// Good categories:
'API', 'UI', 'Auth', 'Database', 'ServerAction', 'Navigation', 'Storage'

// Avoid generic categories:
'App', 'Main', 'Handler'
```

### 3. Include Useful Metadata
```typescript
// Good - includes context
logger.crud('CREATE', 'users', { id: user.id, email: user.email })

// Less useful - no context
logger.crud('CREATE', 'users')
```

### 4. Log Errors with Details
```typescript
try {
    // operation
} catch (error) {
    logger.error('Category', 'Operation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        context: 'additional context'
    })
}
```

### 5. Don't Over-Log
- Avoid logging in tight loops
- Don't log sensitive data (passwords, tokens, full credit cards)
- Use debug level for very detailed logs

## Log Modes

### Switching Modes
Users can switch between CONCISE and VERBOSE modes in the dev panel:
- **CONCISE**: Shows only important events (routes, auth, errors, notices)
- **VERBOSE**: Shows everything including CRUD, API calls, debug info

### Setting Default Mode
```typescript
// In lib/logger.ts
private mode: LogMode = 'verbose' // or 'concise' or 'off'
```

## Viewing Logs

### Dev Panel (Development Only)
- Press **F10** to show/hide dev panel
- Press **F12** to toggle log view
- Click **Concise/Verbose** buttons to switch modes
- Click **Clear** to clear all logs
- Logs auto-refresh every 500ms (tail -f behavior)

### Console (Always Available)
All logs also appear in the browser console with color coding and emojis.

## Future Integration Checklist

When adding logging to new features:

- [ ] Import logger: `import { logger } from '@/lib/logger'`
- [ ] Log route entry (API routes): `logger.route('/api/path', 'METHOD')`
- [ ] Log validation failures: `logger.warning('Category', 'Validation failed')`
- [ ] Log CRUD operations: `logger.crud('CREATE', 'table', { id })`
- [ ] Log success: `logger.notice('Category', 'Operation successful')`
- [ ] Log errors: `logger.error('Category', 'Error message', { error })`
- [ ] Test in both CONCISE and VERBOSE modes
- [ ] Verify logs appear in dev panel

## Categories Reference

Recommended categories for consistency:

| Category | Use For |
|----------|---------|
| `API` | API route handlers |
| `UI` | User interface interactions |
| `Auth` | Authentication/authorization |
| `Database` | Direct database operations |
| `ServerAction` | Server actions |
| `Navigation` | Page navigation |
| `Storage` | File/storage operations |
| `CRUD` | Create/Read/Update/Delete ops |
| `Test` | Test/debug operations |
| `Logger` | Logger system messages |

## Troubleshooting

### Logs not appearing?
1. Check if logger is imported correctly
2. Verify mode is not set to 'off'
3. In CONCISE mode, only notice/warning/error/etc show
4. Check browser console for errors

### Logs not persisting?
- Logs are stored in localStorage (last 100 entries)
- Clear browser data will clear logs
- Use "Clear" button to manually clear

### Performance concerns?
- Logger is optimized for development
- In production, consider setting mode to 'off' or 'concise'
- Logs are capped at 1000 entries in memory
