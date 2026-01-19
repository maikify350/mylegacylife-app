'use client'

import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { TableExplorerDialogProps, TablesResponse } from './types'
import { TableListView } from './table-list-view'
import { logger } from '@/lib/logger'

export function TableExplorerDialog({ open, onClose }: TableExplorerDialogProps) {
    const [data, setData] = useState<TablesResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

    const fetchTables = async () => {
        setIsLoading(true)
        setError(null)

        logger.info('UI', 'Fetching table statistics')

        try {
            const response = await fetch('/api/admin/tables')

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const result: TablesResponse = await response.json()
            setData(result)
            setLastRefresh(new Date())

            logger.notice('UI', 'Table statistics loaded', {
                tableCount: result.totalTables,
                totalRecords: result.totalRecords
            })
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to fetch tables'
            setError(errorMsg)
            logger.error('UI', 'Failed to fetch table statistics', { error: errorMsg })
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch on open
    useEffect(() => {
        if (open) {
            fetchTables()
        }
    }, [open])

    // Auto-refresh every 3 seconds when open
    useEffect(() => {
        if (!open) return

        const interval = setInterval(() => {
            fetchTables()
        }, 3000)

        return () => clearInterval(interval)
    }, [open])

    const handleRefresh = () => {
        fetchTables()
    }

    const getTimeSinceRefresh = () => {
        if (!lastRefresh) return 'Never'
        const seconds = Math.floor((Date.now() - lastRefresh.getTime()) / 1000)
        if (seconds < 5) return 'Just now'
        if (seconds < 60) return `${seconds}s ago`
        return `${Math.floor(seconds / 60)}m ago`
    }

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-2xl">
                        <span>🗄️</span>
                        <span>Database Table Explorer</span>
                    </AlertDialogTitle>
                </AlertDialogHeader>

                {/* Summary Stats */}
                <div className="px-6 pb-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">📊 Database:</span>
                                <span className="text-gray-600">mylegacylife</span>
                            </div>
                            {data && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">📈 Total:</span>
                                        <span className="text-gray-600">
                                            {data.totalTables} tables, {data.totalRecords.toLocaleString()} records
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-xs">
                                🔄 {getTimeSinceRefresh()}
                            </span>
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                            <span className="font-semibold">Error:</span> {error}
                        </div>
                    )}
                </div>

                {/* Table List */}
                <div className="flex-1 overflow-hidden">
                    <TableListView
                        tables={data?.tables || []}
                        isLoading={isLoading && !data}
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                        Close
                    </button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
