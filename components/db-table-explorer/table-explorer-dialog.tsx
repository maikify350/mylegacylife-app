'use client'

import { useState, useEffect, useRef } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { TableExplorerDialogProps, TablesResponse } from './types'
import { TableListView } from './table-list-view'
import { TableDetailView } from './table-detail-view'
import { logger } from '@/lib/logger'

export function TableExplorerDialog({ open, onClose }: TableExplorerDialogProps) {
    const [data, setData] = useState<TablesResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [position, setPosition] = useState({ x: 100, y: 100 }) // Default position
    const [size, setSize] = useState({ width: 800, height: 600 }) // Default size
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isResizing, setIsResizing] = useState(false)
    const [resizeDirection, setResizeDirection] = useState<'right' | 'bottom' | 'corner' | null>(null)
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
    const dialogRef = useRef<HTMLDivElement>(null)
    const [currentView, setCurrentView] = useState<'list' | 'detail'>('list')
    const [selectedTable, setSelectedTable] = useState<string | null>(null)

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

    // Load position and size from localStorage on mount
    useEffect(() => {
        const savedPos = localStorage.getItem('tableExplorerPosition')
        const savedSize = localStorage.getItem('tableExplorerSize')

        if (savedPos) {
            try {
                setPosition(JSON.parse(savedPos))
            } catch (e) {
                // Use default
            }
        }

        if (savedSize) {
            try {
                setSize(JSON.parse(savedSize))
            } catch (e) {
                // Use default
            }
        }
    }, [])

    // Save position and size to localStorage when they change
    useEffect(() => {
        localStorage.setItem('tableExplorerPosition', JSON.stringify(position))
    }, [position])

    useEffect(() => {
        localStorage.setItem('tableExplorerSize', JSON.stringify(size))
    }, [size])

    // Resize handlers
    const handleResizeStart = (e: React.MouseEvent, direction: 'right' | 'bottom' | 'corner') => {
        e.stopPropagation()
        e.preventDefault()
        setIsResizing(true)
        setResizeDirection(direction)
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        })
    }

    useEffect(() => {
        const handleResizeMove = (e: MouseEvent) => {
            if (!isResizing || !resizeDirection) return

            const deltaX = e.clientX - resizeStart.x
            const deltaY = e.clientY - resizeStart.y

            let newWidth = size.width
            let newHeight = size.height

            if (resizeDirection === 'right' || resizeDirection === 'corner') {
                newWidth = Math.max(350, Math.min(1200, resizeStart.width + deltaX))
            }

            if (resizeDirection === 'bottom' || resizeDirection === 'corner') {
                newHeight = Math.max(400, Math.min(900, resizeStart.height + deltaY))
            }

            setSize({ width: newWidth, height: newHeight })
        }

        const handleResizeEnd = () => {
            setIsResizing(false)
            setResizeDirection(null)
        }

        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove)
            document.addEventListener('mouseup', handleResizeEnd)
        }

        return () => {
            document.removeEventListener('mousemove', handleResizeMove)
            document.removeEventListener('mouseup', handleResizeEnd)
        }
    }, [isResizing, resizeDirection, resizeStart, size])

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
            setCurrentView('list') // Reset to list view when opening
            setSelectedTable(null)
        }
    }, [open])

    const handleRefresh = () => {
        fetchTables()
    }

    const handleViewTable = (tableName: string) => {
        setSelectedTable(tableName)
        setCurrentView('detail')
        logger.notice('UI', `Viewing table: ${tableName}`)
    }

    const handleBackToList = () => {
        setCurrentView('list')
        setSelectedTable(null)
    }

    return (
        <>
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 z-[9999]"
                    />

                    {/* Dialog */}
                    <div
                        ref={dialogRef}
                        onMouseDown={handleMouseDown}
                        className="fixed z-[10000] bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col p-1"
                        style={{
                            left: `${position.x}px`,
                            top: `${position.y}px`,
                            width: `${size.width}px`,
                            height: `${size.height}px`,
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

                        {/* Content Area - Conditional Rendering */}
                        <div className="flex-1 overflow-hidden">
                            {currentView === 'list' ? (
                                <>
                                    {/* Summary Stats - Only show in list view */}
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
                                    <TableListView
                                        tables={data?.tables || []}
                                        isLoading={isLoading && !data}
                                        onViewTable={handleViewTable}
                                    />
                                </>
                            ) : (
                                /* Table Detail View */
                                selectedTable && (
                                    <TableDetailView
                                        tableName={selectedTable}
                                        onBack={handleBackToList}
                                    />
                                )
                            )}
                        </div>

                        {/* Right Resize Handle */}
                        <div
                            onMouseDown={(e) => handleResizeStart(e, 'right')}
                            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200/50 transition-colors"
                            style={{ cursor: isResizing && resizeDirection === 'right' ? 'ew-resize' : 'ew-resize' }}
                        />

                        {/* Bottom Resize Handle */}
                        <div
                            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
                            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-200/50 transition-colors"
                            style={{ cursor: isResizing && resizeDirection === 'bottom' ? 'ns-resize' : 'ns-resize' }}
                        />

                        {/* Corner Resize Handle */}
                        <div
                            onMouseDown={(e) => handleResizeStart(e, 'corner')}
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-blue-400/50 transition-colors"
                            style={{ cursor: isResizing && resizeDirection === 'corner' ? 'nwse-resize' : 'nwse-resize' }}
                        />
                    </div>
                </>
            )}
        </>
    )
}
