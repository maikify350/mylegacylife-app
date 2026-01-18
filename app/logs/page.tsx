"use client"

import { useEffect, useState } from "react"
import { logger, LogCategory } from "@/lib/logger"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

interface LogEntry {
    timestamp: string
    level: LogLevel
    category: string
    message: string
    data?: any
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [filter, setFilter] = useState<LogLevel | 'all'>('all')
    const [autoRefresh, setAutoRefresh] = useState(true)

    useEffect(() => {
        loadLogs()

        if (autoRefresh) {
            const interval = setInterval(loadLogs, 1000)
            return () => clearInterval(interval)
        }
    }, [autoRefresh])

    const loadLogs = () => {
        const allLogs = logger.getLogs()
        setLogs(allLogs)
    }

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.level === filter)

    const handleClear = () => {
        if (confirm('Clear all logs?')) {
            logger.clearLogs()
            loadLogs()
        }
    }

    const handleExport = () => {
        const json = logger.exportLogs()
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mylegacylife-logs-${new Date().toISOString()}.json`
        a.click()
    }

    const getLevelColor = (level: LogLevel) => {
        switch (level) {
            case 'debug': return 'text-muted-foreground'
            case 'info': return 'text-blue-500'
            case 'warn': return 'text-yellow-500'
            case 'error': return 'text-red-500'
            case 'success': return 'text-green-500'
        }
    }

    const getLevelEmoji = (level: LogLevel) => {
        switch (level) {
            case 'debug': return '🔍'
            case 'info': return 'ℹ️'
            case 'warn': return '⚠️'
            case 'error': return '❌'
            case 'success': return '✅'
        }
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-5xl font-serif font-bold mb-2">
                            System Logs
                        </h1>
                        <p className="text-2xl text-muted-foreground">
                            {filteredLogs.length} {filter === 'all' ? 'total' : filter} logs
                        </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setAutoRefresh(!autoRefresh)}
                        >
                            {autoRefresh ? '⏸️ Pause' : '▶️ Resume'}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleExport}
                        >
                            📥 Export
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleClear}
                        >
                            🗑️ Clear
                        </Button>
                        <Link href="/">
                            <Button variant="outline" size="lg">
                                Home
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3 flex-wrap">
                            {(['all', 'debug', 'info', 'warn', 'error', 'success'] as const).map((level) => (
                                <Button
                                    key={level}
                                    variant={filter === level ? 'default' : 'outline'}
                                    size="lg"
                                    onClick={() => setFilter(level)}
                                >
                                    {level === 'all' ? '📋 All' : `${getLevelEmoji(level)} ${level}`}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Log Entries</CardTitle>
                        <CardDescription className="text-lg">
                            Real-time system activity {autoRefresh && '(auto-refreshing)'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredLogs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <p className="text-xl text-muted-foreground">
                                    No logs yet. Use the app to generate activity.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {filteredLogs.slice().reverse().map((log, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors font-mono text-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{getLevelEmoji(log.level)}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(log.timestamp).toLocaleTimeString()}
                                                    </span>
                                                    <span className={`text-xs font-semibold ${getLevelColor(log.level)}`}>
                                                        {log.level.toUpperCase()}
                                                    </span>
                                                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                                                        {log.category}
                                                    </span>
                                                </div>
                                                <p className="text-base leading-relaxed break-words">
                                                    {log.message}
                                                </p>
                                                {log.data && (
                                                    <pre className="mt-2 p-2 bg-black/10 rounded text-xs overflow-x-auto">
                                                        {JSON.stringify(log.data, null, 2)}
                                                    </pre>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid md:grid-cols-5 gap-4">
                    {(['debug', 'info', 'warn', 'error', 'success'] as const).map((level) => {
                        const count = logs.filter(log => log.level === level).length
                        return (
                            <Card key={level}>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-4xl mb-2">{getLevelEmoji(level)}</div>
                                    <div className={`text-3xl font-bold ${getLevelColor(level)}`}>
                                        {count}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {level}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
