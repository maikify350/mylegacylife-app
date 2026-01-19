'use client'

import { TableInfo } from './types'

interface TableListViewProps {
    tables: TableInfo[]
    isLoading: boolean
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
    core: { label: 'CORE TABLES', icon: '📦' },
    community: { label: 'COMMUNITY TABLES', icon: '👥' },
    system: { label: 'SYSTEM TABLES', icon: '🔧' },
    audit: { label: 'AUDIT TABLES', icon: '📋' },
    other: { label: 'OTHER TABLES', icon: '📁' }
}

const TABLE_ICONS: Record<string, string> = {
    subscribers: '👤',
    questions: '❓',
    answers: '📝',
    contributed_questions: '📋',
    user_progress: '📈',
    'auth.users': '🔐',
    'storage.objects': '📦',
    audit_logs: '📊',
    activity_logs: '📉'
}

export function TableListView({ tables, isLoading }: TableListViewProps) {
    // Group tables by category
    const groupedTables = tables.reduce((acc, table) => {
        const category = table.category || 'other'
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(table)
        return acc
    }, {} as Record<string, TableInfo[]>)

    // Sort categories: core first, then alphabetically
    const sortedCategories = Object.keys(groupedTables).sort((a, b) => {
        if (a === 'core') return -1
        if (b === 'core') return 1
        return a.localeCompare(b)
    })

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2" />
                        <div className="space-y-2">
                            <div className="h-12 bg-gray-200 rounded" />
                            <div className="h-12 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (tables.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">🗄️</div>
                <div>No tables found</div>
            </div>
        )
    }

    return (
        <div className="space-y-3 p-2 max-h-[500px] overflow-y-auto">
            {sortedCategories.map(category => {
                const categoryInfo = CATEGORY_LABELS[category] || CATEGORY_LABELS.other
                const categoryTables = groupedTables[category]

                return (
                    <div key={category}>
                        <div className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-600">
                            <span>{categoryInfo.icon}</span>
                            <span>{categoryInfo.label}</span>
                        </div>

                        <div className="space-y-0.5">
                            {categoryTables.map(table => {
                                const icon = TABLE_ICONS[table.name] || '📄'
                                const hasError = !!table.error

                                return (
                                    <div
                                        key={table.name}
                                        className={`
                                            flex items-center justify-between px-2 py-1 rounded border
                                            ${hasError
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                            }
                                            transition-all cursor-pointer
                                        `}
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className="text-lg">{icon}</span>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm text-gray-900">
                                                    {table.name}
                                                </div>
                                                {hasError && (
                                                    <div className="text-xs text-red-600">
                                                        Error: {table.error}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className={`
                                                text-xs font-semibold px-2 py-0.5 rounded-full
                                                ${hasError
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }
                                            `}>
                                                {hasError ? '—' : `${table.count}`}
                                            </div>
                                            {!hasError && (
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                    onClick={() => {
                                                        // Phase 2: Open detail view
                                                        console.log('View table:', table.name)
                                                    }}
                                                >
                                                    View →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
