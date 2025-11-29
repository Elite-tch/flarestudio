"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

/**
 * DataTable Component
 * Reusable table with sorting, filtering, and pagination
 * @param {Array} columns - Array of column definitions [{key, label, sortable}]
 * @param {Array} data - Array of data objects
 * @param {number} pageSize - Items per page (default: 10)
 */
export function DataTable({ columns = [], data = [], pageSize = 10 }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [currentPage, setCurrentPage] = useState(1)

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data

        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key]
            const bVal = b[sortConfig.key]

            if (aVal === bVal) return 0

            const comparison = aVal > bVal ? 1 : -1
            return sortConfig.direction === "asc" ? comparison : -comparison
        })
    }, [data, sortConfig])

    // Pagination logic
    const totalPages = Math.ceil(sortedData.length / pageSize)
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return sortedData.slice(start, start + pageSize)
    }, [sortedData, currentPage, pageSize])

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }))
    }

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
        }
        return sortConfig.direction === "asc" ? (
            <ChevronUp className="w-4 h-4 text-[#e93b6c]" />
        ) : (
            <ChevronDown className="w-4 h-4 text-[#e93b6c]" />
        )
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No data available
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-3 text-left font-medium text-gray-700 ${column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                                        }`}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable && <SortIcon columnKey={column.key} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.map((row, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-4 py-3 text-gray-900">
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                        {sortedData.length} results
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
