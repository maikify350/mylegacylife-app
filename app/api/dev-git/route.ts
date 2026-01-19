import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
    }

    try {
        const { action } = await request.json()

        if (action === 'commit') {
            // Git add all
            await execAsync('git add -A', { cwd: process.cwd() })

            // Git commit with auto-generated message
            const timestamp = new Date().toLocaleString()
            const message = `Auto-commit from dev UI - ${timestamp}`

            const { stdout, stderr } = await execAsync(`git commit -m "${message}"`, { cwd: process.cwd() })

            return NextResponse.json({
                success: true,
                message: 'Committed successfully',
                output: stdout || stderr
            })
        }

        if (action === 'status') {
            const { stdout } = await execAsync('git status --short', { cwd: process.cwd() })
            return NextResponse.json({
                success: true,
                status: stdout || 'Working tree clean'
            })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    } catch (error) {
        console.error('Git command error:', error)
        return NextResponse.json({
            error: 'Git command failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
