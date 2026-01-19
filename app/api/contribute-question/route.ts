import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    logger.route('/api/contribute-question', 'POST')

    try {
        const { email, phone, question_text } = await request.json()

        // Validation
        if (!email || !question_text) {
            logger.warning('API', 'Contribute question validation failed: missing fields')
            return NextResponse.json(
                { error: 'Email and question are required' },
                { status: 400 }
            )
        }

        if (question_text.length < 10) {
            logger.warning('API', 'Contribute question validation failed: too short')
            return NextResponse.json(
                { error: 'Question must be at least 10 characters' },
                { status: 400 }
            )
        }

        if (question_text.length > 500) {
            logger.warning('API', 'Contribute question validation failed: too long')
            return NextResponse.json(
                { error: 'Question must be less than 500 characters' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Get IP address and user agent
        const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        const user_agent = request.headers.get('user-agent') || 'unknown'

        logger.info('API', 'Inserting contributed question', { email, question_length: question_text.length })

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
            logger.error('API', 'Failed to insert contributed question', { error: error.message })
            console.error('Error inserting question:', error)
            return NextResponse.json(
                { error: 'Failed to submit question' },
                { status: 500 }
            )
        }

        logger.crud('CREATE', 'contributed_questions', { id: data.id })
        logger.notice('API', 'Question submitted successfully', { question_id: data.id })

        return NextResponse.json({
            success: true,
            message: 'Question submitted successfully',
            question_id: data.id
        })

    } catch (error) {
        logger.error('API', 'Contribute question API error', { error: error instanceof Error ? error.message : 'Unknown error' })
        console.error('Error in contribute-question API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
