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
        const offset = (page - 1) * perPage

        let query = supabase
            .from(table)
            .select('*', { count: 'exact' })

        // If search is provided, use RPC to get matching IDs, then filter by those IDs
        if (search && search.trim()) {
            // Use simplified RPC to get only matching IDs
            const { data: matchingRows, error: searchError } = await supabase
                .rpc('search_table_ids', {
                    p_table_name: table,
                    p_search_term: search.trim()
                })

            if (searchError) {
                console.error('Search RPC error:', searchError)
                return NextResponse.json({ error: searchError.message }, { status: 500 })
            }

            const matchingIds = matchingRows?.map((row: any) => row.id) || []

            console.log('Search for:', search, 'Found IDs:', matchingIds.length)

            if (matchingIds.length === 0) {
                // No matches
                return NextResponse.json({
                    data: [],
                    total: 0,
                    filtered: 0,
                    page,
                    perPage,
                    totalPages: 0,
                    search
                })
            }

            // Filter by matching IDs
            query = query.in('id', matchingIds)
        }

        // Add pagination and ordering
        query = query
            .range(offset, offset + perPage - 1)
            .order('created_at', { ascending: false })

        const { data, error, count } = await query

        if (error) {
            console.error('Supabase query error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const totalPages = count ? Math.ceil(count / perPage) : 0

        return NextResponse.json({
            data: data || [],
            total: count || 0,
            filtered: count || 0,
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
