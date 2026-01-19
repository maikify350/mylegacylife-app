"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function DevHealthIndicator() {
    const [supabaseStatus, setSupabaseStatus] = useState<'healthy' | 'error' | 'checking'>('checking')
    const [languageToolStatus, setLanguageToolStatus] = useState<'healthy' | 'error' | 'checking'>('checking')

    useEffect(() => {
        // Only show in development
        if (process.env.NODE_ENV !== 'development') return

        const checkHealth = async () => {
            // Check Supabase
            try {
                const supabase = createClient()
                const { error } = await supabase.from('questions').select('count').limit(1)
                setSupabaseStatus(error ? 'error' : 'healthy')
            } catch {
                setSupabaseStatus('error')
            }

            // Check LanguageTool
            try {
                const response = await fetch('https://api.languagetool.org/v2/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'text=test&language=en-US'
                })
                setLanguageToolStatus(response.ok ? 'healthy' : 'error')
            } catch {
                setLanguageToolStatus('error')
            }
        }

        checkHealth()
        const interval = setInterval(checkHealth, 30000) // Check every 30 seconds

        return () => clearInterval(interval)
    }, [])

    // Don't render in production
    if (process.env.NODE_ENV !== 'development') return null

    const hasError = supabaseStatus === 'error' || languageToolStatus === 'error'

    return (
        <div className="fixed top-4 left-4 z-50 flex flex-col gap-1 bg-black/90 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-mono">
            {/* DEV Mode Badge */}
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="font-bold">DEV MODE</span>
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
        </div>
    )
}
