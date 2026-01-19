export interface TableInfo {
    name: string
    count: number
    category: 'core' | 'community' | 'system' | 'audit' | 'other'
    error?: string
}

export interface TablesResponse {
    tables: TableInfo[]
    totalTables: number
    totalRecords: number
    timestamp: string
}

export interface TableExplorerDialogProps {
    open: boolean
    onClose: () => void
}
