import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const { email, phone, question_text } = await request.json()

        // Validation
        if (!email || !question_text) {
            return NextResponse.json(
                { error: 'Email and question are required' },
                { status: 400 }
            )
        }

        if (question_text.length < 10) {
            return NextResponse.json(
                { error: 'Question must be at least 10 characters' },
                { status: 400 }
            )
        }

        if (question_text.length > 500) {
            return NextResponse.json(
                { error: 'Question must be less than 500 characters' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Get IP address and user agent
        const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        const user_agent = request.headers.get('user-agent') || 'unknown'

        // Insert contributed question
        const { data, error } = await supabase
            .from('contributed_questions')
            .insert({
                contributor_email: email,
                contributor_phone: phone || null,
                question_text: question_text.trim(),
                status: 'submitted',
                ip_address,
                user_agent,
            })
            .select()
            .single()

        if (error) {
            console.error('Error inserting question:', error)
            return NextResponse.json(
                { error: 'Failed to submit question' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Question submitted successfully',
            question_id: data.id
        })

    } catch (error) {
        console.error('Error in contribute-question API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
