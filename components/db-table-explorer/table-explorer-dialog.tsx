'use client'

import { useState, useEffect, useRef } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { TableExplorerDialogProps, TablesResponse } from './types'
import { TableListView } from './table-list-view'
import { logger } from '@/lib/logger'

export function TableExplorerDialog({ open, onClose }: TableExplorerDialogProps) {
    const [data, setData] = useState<TablesResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [position, setPosition] = useState({ x: 100, y: 100 }) // Default position
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const dialogRef = useRef<HTMLDivElement>(null)

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

    // Load position from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('tableExplorerPosition')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setPosition(parsed)
            } catch (e) {
                // Use default position
            }
        }
    }, [])

    // Save position to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('tableExplorerPosition', JSON.stringify(position))
    }, [position])

    // Drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        // Stop propagation to prevent dev panel from receiving the event
        e.stopPropagation()

        // Only start drag if clicking on header area
        if ((e.target as HTMLElement).closest('[data-drag-handle]')) {
            setIsDragging(true)
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            })
        }
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                })
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, dragOffset])

    // Fetch on open
    useEffect(() => {
        if (open) {
            fetchTables()
        }
    }, [open])

    const handleRefresh = () => {
        fetchTables()
    }

    return (
        <>
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 z-[9999]"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <div
                        ref={dialogRef}
                        onMouseDown={handleMouseDown}
                        className="fixed z-[10000] bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col p-1"
                        style={{
                            left: `${position.x}px`,
                            top: `${position.y}px`,
                            width: '800px',
                            maxHeight: '90vh',
                            cursor: isDragging ? 'grabbing' : 'default'
                        }}
                    >
                        {/* Draggable Header */}
                        <div
                            data-drag-handle
                            className="px-2 py-1 cursor-grab active:cursor-grabbing select-none bg-blue-600 text-white rounded-t flex items-center justify-between"
                            style={{ height: '30px' }}
                        >
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <span>🗄️</span>
                                <span>Database Table Explorer</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 text-lg leading-none px-1"
                            >
                                ×
                            </button>
                        </div>

                        {/* Summary Stats */}
                        <div className="px-2 pb-1 pt-2 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">📊 Database:</span>
                                        <span className="text-gray-600">mylegacylife</span>
                                    </div>
                                    {data && (
                                        <>
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold">📈 Total:</span>
                                                <span className="text-gray-600">
                                                    {data.totalTables} tables, {data.totalRecords.toLocaleString()} records
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                    className="px-3 py-0.5 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                >
                                    {isLoading && <span className="animate-spin">⟳</span>}
                                    {isLoading ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
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
                    </div>
                </>
            )}
        </>
    )
}
