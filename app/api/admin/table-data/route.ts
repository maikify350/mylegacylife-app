import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
    }

    try {
        const { table, page = 1, perPage = 10, search = '' } = await request.json()

        if (!table) {
            return NextResponse.json({ error: 'Table name required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Calculate offset
        const offset = (page - 1) * perPage

        // Build query
        let query = supabase
            .from(table)
            .select('*', { count: 'exact' })

        // Add search if provided
        if (search && search.trim()) {
            // Get table columns first to build search query
            const { data: columns } = await supabase
                .from(table)
                .select('*')
                .limit(1)

            if (columns && columns.length > 0) {
                const columnNames = Object.keys(columns[0])
                const searchTerm = search.trim()

                // Build OR conditions for text search
                // Cast all columns to text for searching
                const searchConditions = columnNames
                    .map(col => `${col}::text.ilike.%${searchTerm}%`)
                    .join(',')

                query = query.or(searchConditions)
            }
        }

        // Add pagination
        query = query.range(offset, offset + perPage - 1)

        // Determine which column to order by
        if (search && search.trim()) {
            // We already fetched a sample row for search, use those columns
            const { data: sampleRow } = await supabase
                .from(table)
                .select('*')
                .limit(1)

            if (sampleRow && sampleRow.length > 0) {
                const columns = Object.keys(sampleRow[0])
                if (columns.includes('id')) {
                    query = query.order('id', { ascending: false })
                } else if (columns.includes('created_at')) {
                    query = query.order('created_at', { ascending: false })
                }
            }
        } else {
            // No search, fetch sample to check columns
            const { data: sampleRow } = await supabase
                .from(table)
                .select('*')
                .limit(1)

            if (sampleRow && sampleRow.length > 0) {
                const columns = Object.keys(sampleRow[0])
                if (columns.includes('id')) {
                    query = query.order('id', { ascending: false })
                } else if (columns.includes('created_at')) {
                    query = query.order('created_at', { ascending: false })
                }
            }
        }

        const { data, error, count } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const totalPages = count ? Math.ceil(count / perPage) : 0
        const filtered = count || 0

        return NextResponse.json({
            data: data || [],
            total: count || 0,
            filtered,
            page,
            perPage,
            totalPages,
            search
        })
    } catch (error) {
        console.error('Table data fetch error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch table data' },
            { status: 500 }
        )
    }
}
