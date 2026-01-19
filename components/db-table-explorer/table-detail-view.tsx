'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'

interface TableRecord {
    [key: string]: any
}

interface TableDetailViewProps {
    tableName: string
    onBack: () => void
}

export function TableDetailView({ tableName, onBack }: TableDetailViewProps) {
    const [data, setData] = useState<TableRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const fetchData = async () => {
        setIsLoading(true)
        setError(null)

        logger.info('UI', `Fetching data from table: ${tableName}`, { page, perPage, search })

        try {
            const response = await fetch('/api/admin/table-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table: tableName, page, perPage, search })
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const result = await response.json()
            setData(result.data || [])
            setTotal(result.total || 0)
            setTotalPages(result.totalPages || 0)

            logger.notice('UI', `Loaded ${result.data?.length || 0} records from ${tableName}`)
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to fetch data'
            setError(errorMsg)
            logger.error('UI', 'Failed to fetch table data', { error: errorMsg, table: tableName })
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchData()
    }, [tableName, page, perPage, search])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                setSearch(searchInput)
                setPage(1) // Reset to first page on new search
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchInput])

    const handleClearSearch = () => {
        setSearchInput('')
        setSearch('')
        setPage(1)
    }

    const formatValue = (value: any): string => {
        if (value === null || value === undefined) return '-'
        if (typeof value === 'boolean') return value ? 'Yes' : 'No'
        if (typeof value === 'object') return JSON.stringify(value)

        const str = String(value)

        // Truncate long text
        if (str.length > 100) {
            return str.substring(0, 100) + '...'
        }

        return str
    }

    const formatDate = (value: any): string => {
        if (!value) return '-'
        try {
            const date = new Date(value)
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return String(value)
        }
    }

    const columns = data.length > 0 ? Object.keys(data[0]) : []

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-2 pb-2 pt-2 space-y-2">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Back to Tables
                    </button>
                    <button
                        onClick={fetchData}
                        disabled={isLoading}
                        className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">📊 {tableName}</span>
                    <span className="text-xs text-gray-600">({total} records)</span>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search all columns..."
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        {searchInput && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    {search && (
                        <span className="text-xs text-gray-600">
                            Found: {total}
                        </span>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                            Showing {data.length > 0 ? ((page - 1) * perPage + 1) : 0}-{Math.min(page * perPage, total)} of {total}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Per page:</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value))
                                setPage(1)
                            }}
                            className="px-2 py-0.5 border border-gray-300 rounded text-xs"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mx-2 mb-2 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
                    <span className="font-semibold">Error:</span> {error}
                </div>
            )}

            {/* Data Table */}
            <div className="flex-1 overflow-auto px-2">
                {isLoading && !data.length ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        Loading...
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        {search ? 'No records found matching your search' : 'No records in this table'}
                    </div>
                ) : (
                    <table className="w-full text-xs border-collapse">
                        <thead className="sticky top-0 bg-gray-100 border-b border-gray-300">
                            <tr>
                                {columns.map(col => (
                                    <th key={col} className="px-2 py-1 text-left font-semibold text-gray-700">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => (
                                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                    {columns.map(col => (
                                        <td key={col} className="px-2 py-1 text-gray-900">
                                            {col.includes('_at') ? formatDate(row[col]) : formatValue(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="px-2 py-2 border-t flex items-center justify-center gap-2 text-xs">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Prev
                    </button>
                    <span className="text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    )
}
