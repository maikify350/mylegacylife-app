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

        // Add search if provided - use simple approach
        // Note: This searches all text columns but may not work perfectly on all column types
        // For now, skip search to get pagination working, then we can enhance it
        // if (search && search.trim()) {
        //     const searchTerm = `%${search.trim()}%`
        //     // Skip search for now - will implement properly later
        // }

        // Add pagination and ordering
        // Per CODING_RULES.md: All tables must have created_at
        query = query
            .range(offset, offset + perPage - 1)
            .order('created_at', { ascending: false })

        const { data, error, count } = await query

        if (error) {
            console.error('Supabase query error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                table,
                search,
                page,
                perPage
            })
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
