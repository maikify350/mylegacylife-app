/**
 * Logger utility for MyLegacyLife.AI
 * Follows syslog severity levels (RFC 5424)
 * 
 * Modes:
 * - CONCISE: Major events only (routes, initialization, authentication)
 * - VERBOSE: All events including CRUD operations
 * - OFF: No logging
 */

export type LogLevel = 'emergency' | 'alert' | 'critical' | 'error' | 'warning' | 'notice' | 'info' | 'debug'
export type LogMode = 'concise' | 'verbose' | 'off'

interface LogEntry {
    timestamp: string
    level: LogLevel
    category: string
    message: string
    metadata?: Record<string, any>
}

class Logger {
    private mode: LogMode = 'verbose' // Default to verbose in development
    private logs: LogEntry[] = []
    private maxLogs = 1000 // Keep last 1000 entries

    constructor() {
        // Load mode from localStorage
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('app-log-mode') as LogMode
            if (savedMode) {
                this.mode = savedMode
            }
            this.loadLogs()
        }
    }

    setMode(mode: LogMode) {
        this.mode = mode
        if (typeof window !== 'undefined') {
            localStorage.setItem('app-log-mode', mode)
        }
        this.info('Logger', `Log mode set to: ${mode}`)
    }

    getMode(): LogMode {
        return this.mode
    }

    getLogs(): LogEntry[] {
        return [...this.logs]
    }

    clearLogs() {
        this.logs = []
        if (typeof window !== 'undefined') {
            localStorage.removeItem('mylegacylife_logs')
        }
        // Don't log the clear action itself - would create a new entry
    }

    private saveLogs() {
        if (typeof window !== 'undefined') {
            try {
                const recentLogs = this.logs.slice(-100) // Keep last 100 in storage
                localStorage.setItem('mylegacylife_logs', JSON.stringify(recentLogs))
            } catch (e) {
                // Ignore storage errors
            }
        }
    }

    private loadLogs() {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('mylegacylife_logs')
                if (stored) {
                    this.logs = JSON.parse(stored)
                }
            } catch (e) {
                console.error('Failed to load logs from storage', e)
            }
        }
    }

    private log(level: LogLevel, category: string, message: string, metadata?: Record<string, any>, isConcise = false) {
        if (this.mode === 'off') return

        // In concise mode, only log if isConcise is true
        if (this.mode === 'concise' && !isConcise) return

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            metadata
        }

        this.logs.push(entry)

        // Keep only last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs)
        }

        this.saveLogs()

        // Console output in development
        if (process.env.NODE_ENV === 'development') {
            const color = this.getConsoleColor(level)
            const emoji = this.getEmoji(level)
            const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
            console.log(`%c${emoji} [${category}] ${message}${metaStr}`, `color: ${color}; font-weight: bold`)
        }
    }

    private getConsoleColor(level: LogLevel): string {
        const colors: Record<LogLevel, string> = {
            emergency: '#8B0000',
            alert: '#FF0000',
            critical: '#FF4500',
            error: '#FF6347',
            warning: '#FFA500',
            notice: '#00BFFF',
            info: '#32CD32',
            debug: '#808080'
        }
        return colors[level]
    }

    private getEmoji(level: LogLevel): string {
        const emojis: Record<LogLevel, string> = {
            emergency: '🚨',
            alert: '🔴',
            critical: '❗',
            error: '❌',
            warning: '⚠️',
            notice: '📢',
            info: 'ℹ️',
            debug: '🔍'
        }
        return emojis[level]
    }

    // Syslog severity levels (concise = major events only)

    emergency(category: string, message: string, metadata?: Record<string, any>) {
        this.log('emergency', category, message, metadata, true)
    }

    alert(category: string, message: string, metadata?: Record<string, any>) {
        this.log('alert', category, message, metadata, true)
    }

    critical(category: string, message: string, metadata?: Record<string, any>) {
        this.log('critical', category, message, metadata, true)
    }

    error(category: string, message: string, metadata?: Record<string, any>) {
        this.log('error', category, message, metadata, true)
    }

    warning(category: string, message: string, metadata?: Record<string, any>) {
        this.log('warning', category, message, metadata, true)
    }

    notice(category: string, message: string, metadata?: Record<string, any>) {
        this.log('notice', category, message, metadata, true)
    }

    // Info and debug are verbose-only (not shown in concise mode)
    info(category: string, message: string, metadata?: Record<string, any>) {
        this.log('info', category, message, metadata, false)
    }

    debug(category: string, message: string, metadata?: Record<string, any>) {
        this.log('debug', category, message, metadata, false)
    }

    // Convenience methods for common operations

    // CONCISE: Routes and major navigation
    route(path: string, method = 'GET') {
        this.notice('Route', `${method} ${path}`)
    }

    // CONCISE: Application lifecycle
    appInit(message: string) {
        this.notice('App', message)
    }

    // CONCISE: Authentication events
    auth(message: string, metadata?: Record<string, any>) {
        this.notice('Auth', message, metadata)
    }

    // VERBOSE: CRUD operations
    crud(operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE', table: string, metadata?: Record<string, any>) {
        this.info('CRUD', `${operation} ${table}`, metadata)
    }

    // VERBOSE: API calls
    api(endpoint: string, method: string, status?: number) {
        this.info('API', `${method} ${endpoint}`, { status })
    }

    // VERBOSE: Database queries
    db(query: string, metadata?: Record<string, any>) {
        this.debug('Database', query, metadata)
    }

    // Export logs as JSON
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2)
    }
}

// Singleton instance
export const logger = new Logger()

// Initialize logging
if (typeof window !== 'undefined') {
    logger.appInit('Application initialized')
}

// Legacy categories for backward compatibility
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
