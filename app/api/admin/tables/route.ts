import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
    // Development only
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
    }

    logger.route('/api/admin/tables', 'GET')

    try {
        const supabase = await createClient()

        // Define core tables to track
        const coreTables = [
            'subscribers',
            'questions',
            'answers',
            'contributed_questions',
            'user_progress'
        ]

        const tables = []

        // Get count for each table
        for (const tableName of coreTables) {
            try {
                const { count, error } = await supabase
                    .from(tableName)
                    .select('*', { count: 'exact', head: true })

                if (error) {
                    logger.warning('API', `Failed to get count for ${tableName}`, { error: error.message })
                    tables.push({
                        name: tableName,
                        count: 0,
                        error: error.message,
                        category: getCategoryForTable(tableName)
                    })
                } else {
                    tables.push({
                        name: tableName,
                        count: count || 0,
                        category: getCategoryForTable(tableName)
                    })
                }
            } catch (err) {
                logger.error('API', `Error querying ${tableName}`, {
                    error: err instanceof Error ? err.message : 'Unknown'
                })
                tables.push({
                    name: tableName,
                    count: 0,
                    error: 'Query failed',
                    category: getCategoryForTable(tableName)
                })
            }
        }

        const totalRecords = tables.reduce((sum, table) => sum + (table.count || 0), 0)

        logger.info('API', 'Tables fetched successfully', {
            tableCount: tables.length,
            totalRecords
        })

        return NextResponse.json({
            tables: tables.sort((a, b) => a.name.localeCompare(b.name)),
            totalTables: tables.length,
            totalRecords,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        logger.error('API', 'Tables API error', {
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        return NextResponse.json(
            { error: 'Failed to fetch tables' },
            { status: 500 }
        )
    }
}

function getCategoryForTable(tableName: string): string {
    const categories: Record<string, string[]> = {
        core: ['subscribers', 'questions', 'answers', 'user_progress'],
        community: ['contributed_questions'],
        system: ['auth.users', 'storage.objects'],
        audit: ['audit_logs', 'activity_logs']
    }

    for (const [category, tables] of Object.entries(categories)) {
        if (tables.includes(tableName)) {
            return category
        }
    }

    return 'other'
}
