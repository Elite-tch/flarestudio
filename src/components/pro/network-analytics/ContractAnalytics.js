"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "../shared/LoadingSpinner"
import { ErrorMessage } from "../shared/ErrorMessage"
//import { TierBadge } from "../shared/TierBadge"
import { DataTable } from "../shared/DataTable"
import { formatLargeNumber, getContractAnalytics } from "@/lib/pro/networkAnalyticsDb"
import { FileCode, Users, Zap } from "lucide-react"

/**
 * ContractAnalytics Component
 * Most active contracts and usage analytics
 */
export function ContractAnalytics() {
    const [contracts, setContracts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchContracts()
        const interval = setInterval(fetchContracts, 60000) // Refresh every minute
        return () => clearInterval(interval)
    }, [])

    const fetchContracts = async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getContractAnalytics()
            setContracts(data)
        } catch (err) {
            console.error("Error fetching contracts:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading && contracts.length === 0) {
        return <LoadingSpinner size="lg" message="Loading contract analytics..." />
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchContracts} />
    }

    const columns = [
        {
            key: "name",
            label: "Contract",
            sortable: true,
            render: (value, row) => (
                <div>
                    <div className="font-semibold text-gray-900">{value}</div>
                    <div className="text-xs font-mono text-gray-500">{row.address?.slice(0, 10)}...</div>
                </div>
            ),
        },
        {
            key: "category",
            label: "Category",
            sortable: true,
            render: (value) => (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {value}
                </span>
            ),
        },
        {
            key: "transactions",
            label: "Transactions",
            sortable: true,
            render: (value) => (
                <span className="text-sm font-medium text-gray-900">{formatLargeNumber(value || 0)}</span>
            ),
        },
        {
            key: "gas_used",
            label: "Gas Used",
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-900">{formatLargeNumber(value || 0)}</span>
            ),
        },
        {
            key: "unique_users",
            label: "Unique Users",
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-900">{formatLargeNumber(value || 0)}</span>
            ),
        },
        {
            key: "last_active",
            label: "Last Active",
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {value ? new Date(value).toLocaleString() : 'N/A'}
                </span>
            ),
        },
    ]

    const totalTxs = contracts.reduce((sum, c) => sum + (c.transactions || 0), 0)
    const totalGas = contracts.reduce((sum, c) => sum + (c.gas_used || 0), 0)
    const totalUsers = contracts.reduce((sum, c) => sum + (c.unique_users || 0), 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Smart Contract Analytics</h3>
                    <p className="text-sm text-gray-600 mt-1">Most active contracts on Flare</p>
                </div>
                 {/*     <TierBadge tier="pro" /> */}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <FileCode className="w-4 h-4" />
                        Total Transactions
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatLargeNumber(totalTxs)}</div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <Zap className="w-4 h-4" />
                        Total Gas Used
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatLargeNumber(totalGas)}</div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <Users className="w-4 h-4" />
                        Total Unique Users
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatLargeNumber(totalUsers)}</div>
                </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Top Contracts by Activity
                </h4>
                {contracts.length > 0 ? (
                    <DataTable columns={columns} data={contracts} pageSize={10} />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No contract data available yet
                    </div>
                )}
            </div>
        </div>
    )
}
