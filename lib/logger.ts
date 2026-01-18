/**
 * Logger utility for MyLegacyLife.AI
 * Provides verbose logging for debugging and monitoring
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

interface LogEntry {
    timestamp: string
    level: LogLevel
    category: string
    message: string
    data?: any
}

class Logger {
    private logs: LogEntry[] = []
    private maxLogs = 1000
    private isVerbose = process.env.NODE_ENV === 'development'

    private formatTimestamp(): string {
        return new Date().toISOString()
    }

    private createEntry(level: LogLevel, category: string, message: string, data?: any): LogEntry {
        return {
            timestamp: this.formatTimestamp(),
            level,
            category,
            message,
            data,
        }
    }

    private addLog(entry: LogEntry) {
        this.logs.push(entry)

        // Keep only last N logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift()
        }

        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
            try {
                const recentLogs = this.logs.slice(-100) // Keep last 100 in storage
                localStorage.setItem('mylegacylife_logs', JSON.stringify(recentLogs))
            } catch (e) {
                // Ignore storage errors
            }
        }
    }

    private consoleLog(entry: LogEntry) {
        if (!this.isVerbose && entry.level === 'debug') return

        const emoji = {
            debug: '🔍',
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
            success: '✅',
        }[entry.level]

        const style = {
            debug: 'color: #888',
            info: 'color: #0ea5e9',
            warn: 'color: #f59e0b',
            error: 'color: #ef4444',
            success: 'color: #10b981',
        }[entry.level]

        console.log(
            `%c${emoji} [${entry.category}] ${entry.message}`,
            style,
            entry.data || ''
        )
    }

    debug(category: string, message: string, data?: any) {
        const entry = this.createEntry('debug', category, message, data)
        this.addLog(entry)
        this.consoleLog(entry)
    }

    info(category: string, message: string, data?: any) {
        const entry = this.createEntry('info', category, message, data)
        this.addLog(entry)
        this.consoleLog(entry)
    }

    warn(category: string, message: string, data?: any) {
        const entry = this.createEntry('warn', category, message, data)
        this.addLog(entry)
        this.consoleLog(entry)
    }

    error(category: string, message: string, data?: any) {
        const entry = this.createEntry('error', category, message, data)
        this.addLog(entry)
        this.consoleLog(entry)
    }

    success(category: string, message: string, data?: any) {
        const entry = this.createEntry('success', category, message, data)
        this.addLog(entry)
        this.consoleLog(entry)
    }

    // Get all logs
    getLogs(): LogEntry[] {
        return [...this.logs]
    }

    // Get logs by category
    getLogsByCategory(category: string): LogEntry[] {
        return this.logs.filter(log => log.category === category)
    }

    // Get logs by level
    getLogsByLevel(level: LogLevel): LogEntry[] {
        return this.logs.filter(log => log.level === level)
    }

    // Clear logs
    clearLogs() {
        this.logs = []
        if (typeof window !== 'undefined') {
            localStorage.removeItem('mylegacylife_logs')
        }
    }

    // Export logs as JSON
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2)
    }

    // Load logs from localStorage
    loadLogs() {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('mylegacylife_logs')
                if (stored) {
                    this.logs = JSON.parse(stored)
                }
            } catch (e) {
                this.error('Logger', 'Failed to load logs from storage', e)
            }
        }
    }
}

// Singleton instance
export const logger = new Logger()

// Load existing logs on initialization
if (typeof window !== 'undefined') {
    logger.loadLogs()
}

// Categories for organization
export const LogCategory = {
    VOICE: 'Voice',
    DATABASE: 'Database',
    AUTH: 'Auth',
    STORAGE: 'Storage',
    UI: 'UI',
    API: 'API',
    NAVIGATION: 'Navigation',
    ERROR: 'Error',
} as const
