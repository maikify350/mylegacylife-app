"use client"

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'

export function DevHealthIndicator() {
    const [supabaseStatus, setSupabaseStatus] = useState<'healthy' | 'error' | 'checking'>('checking')
    const [languageToolStatus, setLanguageToolStatus] = useState<'healthy' | 'error' | 'checking'>('checking')
    const [errorLog, setErrorLog] = useState<Array<{ time: string; service: string; message: string }>>([])
    const [showLog, setShowLog] = useState(false)
    const [gitStatus, setGitStatus] = useState<string>('')
    const [committing, setCommitting] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [position, setPosition] = useState({ x: 16, y: 16 }) // Default top-left
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [height, setHeight] = useState(280) // Default height - same as minimum
    const [isResizing, setIsResizing] = useState(false)
    const [resizeStartY, setResizeStartY] = useState(0)
    const [resizeStartHeight, setResizeStartHeight] = useState(0)
    const panelRef = useRef<HTMLDivElement>(null)
    const logEndRef = useRef<HTMLDivElement>(null)
    const [logRefreshTrigger, setLogRefreshTrigger] = useState(0)

    // Load position from localStorage on mount
    useEffect(() => {
        const savedPosition = localStorage.getItem('dev-health-position')
        const savedVisibility = localStorage.getItem('dev-health-visible')
        const savedHeight = localStorage.getItem('dev-health-height')

        if (savedPosition) {
            setPosition(JSON.parse(savedPosition))
        }
        if (savedVisibility !== null) {
            setIsVisible(savedVisibility === 'true')
        }
        if (savedHeight) {
            setHeight(parseInt(savedHeight))
        }
    }, [])

    // Save position to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('dev-health-position', JSON.stringify(position))
    }, [position])

    // Save visibility to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('dev-health-visible', String(isVisible))
    }, [isVisible])

    // Save height to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('dev-health-height', String(height))
    }, [height])

    // F10 hotkey toggle panel, F12 hotkey toggle log
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F10') {
                e.preventDefault()
                setIsVisible(prev => !prev)
            }
            if (e.key === 'F12') {
                e.preventDefault()
                setShowLog(prev => !prev)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName === 'BUTTON') return // Don't drag when clicking buttons

        setIsDragging(true)
        const rect = panelRef.current?.getBoundingClientRect()
        if (rect) {
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
        }
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return

            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            })
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, dragOffset])

    // Resize handlers
    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent drag
        setIsResizing(true)
        setResizeStartY(e.clientY)
        setResizeStartHeight(height)
    }

    useEffect(() => {
        const handleResizeMove = (e: MouseEvent) => {
            if (!isResizing) return

            const deltaY = e.clientY - resizeStartY
            const newHeight = Math.max(280, Math.min(800, resizeStartHeight + deltaY)) // Min 280px - just enough for buttons
            setHeight(newHeight)
        }

        const handleResizeEnd = () => {
            setIsResizing(false)
        }

        if (isResizing) {
            window.addEventListener('mousemove', handleResizeMove)
            window.addEventListener('mouseup', handleResizeEnd)
        }

        return () => {
            window.removeEventListener('mousemove', handleResizeMove)
            window.removeEventListener('mouseup', handleResizeEnd)
        }
    }, [isResizing, resizeStartY, resizeStartHeight])

    const addToLog = (service: string, message: string) => {
        const time = new Date().toLocaleTimeString()
        setErrorLog(prev => [...prev, { time, service, message }].slice(-20)) // Keep last 20 entries
    }

    const checkGitStatus = async () => {
        try {
            const response = await fetch('/api/dev-git', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'status' })
            })
            const data = await response.json()
            if (data.success) {
                setGitStatus(data.status)
            }
        } catch (err) {
            console.error('Failed to check git status:', err)
        }
    }

    const handleGitCommit = async () => {
        setCommitting(true)
        try {
            const response = await fetch('/api/dev-git', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'commit' })
            })
            const data = await response.json()
            if (data.success) {
                addToLog('Git', 'Committed successfully')
                await checkGitStatus()
            } else {
                addToLog('Git', data.error || 'Commit failed')
            }
        } catch (err) {
            addToLog('Git', err instanceof Error ? err.message : 'Commit failed')
        } finally {
            setCommitting(false)
        }
    }

    useEffect(() => {
        // Only show in development
        if (process.env.NODE_ENV !== 'development') return

        const checkHealth = async () => {
            // Check Supabase
            try {
                const supabase = createClient()
                const { error } = await supabase.from('questions').select('count').limit(1)
                if (error) {
                    setSupabaseStatus('error')
                    addToLog('Supabase', error.message)
                } else {
                    setSupabaseStatus('healthy')
                }
            } catch (err) {
                setSupabaseStatus('error')
                addToLog('Supabase', err instanceof Error ? err.message : 'Connection failed')
            }

            // Check LanguageTool
            try {
                const response = await fetch('https://api.languagetool.org/v2/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'text=test&language=en-US'
                })
                if (response.ok) {
                    setLanguageToolStatus('healthy')
                } else {
                    setLanguageToolStatus('error')
                    addToLog('Grammar API', `HTTP ${response.status}: ${response.statusText}`)
                }
            } catch (err) {
                setLanguageToolStatus('error')
                addToLog('Grammar API', err instanceof Error ? err.message : 'Connection failed')
            }
        }


        checkHealth()
        checkGitStatus()
        const interval = setInterval(checkHealth, 30000) // Check every 30 seconds

        // Real-time log refresh (tail -f behavior)
        const logRefreshInterval = setInterval(() => {
            setLogRefreshTrigger(prev => prev + 1)
        }, 500) // Refresh logs every 500ms

        return () => {
            clearInterval(interval)
            clearInterval(logRefreshInterval)
        }
    }, [])

    // Auto-scroll to bottom when logs update (tail -f behavior)
    useEffect(() => {
        if (showLog && logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [logRefreshTrigger, showLog])

    // Don't render in production
    if (process.env.NODE_ENV !== 'development') return null

    const hasError = supabaseStatus === 'error' || languageToolStatus === 'error'

    if (!isVisible) return null

    return (
        <div
            ref={panelRef}
            onMouseDown={handleMouseDown}
            className="fixed z-50 flex flex-col gap-1 bg-black/90 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-mono select-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                height: `${height}px`,
                maxWidth: '400px',
                minWidth: '280px',
                cursor: isDragging ? 'grabbing' : 'grab',
                position: 'fixed'
            }}
        >
            {/* DEV Mode Badge */}
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="font-bold">DEV MODE</span>
                <span className="text-gray-400 ml-auto text-[10px]">F10: Toggle | F12: Log</span>
            </div>

            <div className="h-px bg-white/30 my-0.5" />

            {/* Supabase Status */}
            <div className="flex items-center gap-2">
                {supabaseStatus === 'checking' && (
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                )}
                {supabaseStatus === 'healthy' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
                {supabaseStatus === 'error' && (
                    <svg className="w-3 h-3 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                )}
                <span className={supabaseStatus === 'error' ? 'text-red-400 font-bold' : ''}>
                    Supabase
                </span>
            </div>

            {/* LanguageTool Status */}
            <div className="flex items-center gap-2">
                {languageToolStatus === 'checking' && (
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                )}
                {languageToolStatus === 'healthy' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
                {languageToolStatus === 'error' && (
                    <svg className="w-3 h-3 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                )}
                <span className={languageToolStatus === 'error' ? 'text-red-400 font-bold' : ''}>
                    Grammar API
                </span>
            </div>

            {/* Error Alert */}
            {hasError && (
                <>
                    <div className="h-px bg-white/30 my-0.5" />
                    <span className="text-red-400 font-bold animate-pulse text-center">⚠ API ERROR</span>
                </>
            )}

            {/* Log Controls */}
            <div className="h-px bg-white/30 my-0.5" />
            <div className="flex gap-1">
                <button
                    onClick={() => setShowLog(!showLog)}
                    className="flex-1 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                >
                    {showLog ? 'Hide Log' : 'View Log'} ({errorLog.length + logger.getLogs().length})
                </button>
                <button
                    onClick={() => {
                        setErrorLog([])
                        logger.clearLogs()
                    }}
                    className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                    disabled={errorLog.length === 0 && logger.getLogs().length === 0}
                >
                    Clear
                </button>
            </div>

            {/* Test Log Generator */}
            <button
                onClick={() => {
                    // Generate mix of concise and verbose test logs
                    let count = 0
                    const interval = setInterval(() => {
                        count++
                        // CONCISE logs (always visible)
                        logger.notice('Test', `Test iteration #${count}`)
                        logger.route(`/test/page/${count}`, 'GET')

                        // VERBOSE logs (only in verbose mode)
                        logger.info('Test', `Verbose info entry #${count}`, { timestamp: Date.now() })
                        logger.crud('CREATE', 'test_table', { id: count })
                        logger.api('/api/test', 'POST', 200)

                        if (count >= 10) {
                            clearInterval(interval)
                            logger.warning('Test', 'Test log generation complete - 10 iterations done')
                        }
                    }, 300) // 300ms between entries
                }}
                className="w-full px-2 py-1 text-xs bg-purple-600/20 hover:bg-purple-600/30 rounded transition-colors"
            >
                🧪 Generate Test Logs
            </button>

            {/* Git Commit Button */}
            <button
                onClick={handleGitCommit}
                disabled={committing || gitStatus === 'Working tree clean'}
                className="w-full px-2 py-1 text-xs bg-green-600/20 hover:bg-green-600/30 disabled:bg-gray-600/20 disabled:cursor-not-allowed rounded transition-colors"
                title={gitStatus}
            >
                {committing ? 'Committing...' : '💾 Git Commit'}
            </button>
            {gitStatus && gitStatus !== 'Working tree clean' && (
                <div className="text-xs text-yellow-400 truncate" title={gitStatus}>
                    {gitStatus.split('\n').length} file(s) changed
                </div>
            )}


            {/* App Logs Display */}
            {showLog && (() => {
                const appLogs = logger.getLogs()
                const combinedLogs = [
                    ...errorLog.map(e => ({ ...e, source: 'API Error' as const })),
                    ...appLogs.map(l => ({
                        time: new Date(l.timestamp).toLocaleTimeString(),
                        service: l.category,
                        message: `[${l.level.toUpperCase()}] ${l.message}`,
                        source: 'App' as const
                    }))
                ].sort((a, b) => a.time.localeCompare(b.time)).slice(-50) // Last 50 entries

                return combinedLogs.length > 0 ? (
                    <div className="flex-1 overflow-y-auto bg-black/50 rounded p-2 space-y-1 min-h-0">
                        <div className="flex justify-between items-center mb-1 sticky top-0 bg-black/80 pb-1">
                            <span className="text-[10px] text-gray-400">
                                Mode: {logger.getMode().toUpperCase()} | {combinedLogs.length} entries
                            </span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => logger.setMode('concise')}
                                    className={`text-[10px] px-1 rounded ${logger.getMode() === 'concise' ? 'bg-blue-600' : 'bg-white/10'}`}
                                >
                                    Concise
                                </button>
                                <button
                                    onClick={() => logger.setMode('verbose')}
                                    className={`text-[10px] px-1 rounded ${logger.getMode() === 'verbose' ? 'bg-blue-600' : 'bg-white/10'}`}
                                >
                                    Verbose
                                </button>
                            </div>
                        </div>
                        <div className="mt-1">
                            {combinedLogs.map((entry, i) => (
                                <div key={i} className={`text-xs border-l-2 pl-2 mb-1 ${entry.source === 'API Error' ? 'border-red-500' : 'border-blue-500'}`}>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">{entry.time}</span>
                                        <span className="text-[10px] text-gray-500">{entry.source}</span>
                                    </div>
                                    <div className="text-yellow-400 font-bold">{entry.service}</div>
                                    <div className={entry.source === 'API Error' ? 'text-red-300' : 'text-blue-300'}>{entry.message}</div>
                                </div>
                            ))}
                        </div>
                        {/* Auto-scroll anchor */}
                        <div ref={logEndRef} />
                    </div>
                ) : (
                    <div className="mt-1 text-xs text-gray-400 text-center py-2">
                        No logs yet
                    </div>
                )
            })()}

            {/* Resize Handle */}
            <div
                onMouseDown={handleResizeStart}
                className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-white/20 transition-colors"
                style={{ cursor: isResizing ? 'ns-resize' : 'ns-resize' }}
                title="Drag to resize"
            />
        </div>
    )
}
