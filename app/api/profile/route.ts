import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/profile - Get current subscriber profile
export async function GET() {
    try {
        const supabase = await createClient()

        // For now, get the default subscriber (Ricardo Garcia)
        // Later this will use auth to get the logged-in user
        const { data, error } = await supabase
            .from('subscribers')
            .select('id, email, phone, full_name, status')
            .eq('email', 'ricardo.garcia@mylegacylife.ai')
            .single()

        if (error) {
            console.error('Profile fetch error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!data) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Profile GET error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT /api/profile - Update subscriber profile
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { full_name, email, phone } = body

        // Validation
        if (!full_name || !email) {
            return NextResponse.json(
                { error: 'Full name and email are required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Update the default subscriber
        // Later this will use auth to update the logged-in user
        const { data, error } = await supabase
            .from('subscribers')
            .update({
                full_name,
                email,
                phone,
                updated_at: new Date().toISOString()
            })
            .eq('email', 'ricardo.garcia@mylegacylife.ai')
            .select('id, email, phone, full_name, status')
            .single()

        if (error) {
            console.error('Profile update error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Profile PUT error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
