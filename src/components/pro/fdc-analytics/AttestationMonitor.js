"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "../shared/LoadingSpinner"
import { ErrorMessage } from "../shared/ErrorMessage"
import { TierBadge } from "../shared/TierBadge"
import { DataTable } from "../shared/DataTable"
import { ChartWrapper } from "../shared/ChartWrapper"
import {
    calculateFDCStats,
    getHourlyUsageTrends,
} from "@/lib/pro/fdcDataService"
import { CheckCircle, XCircle, Clock, Activity } from "lucide-react"

/**
 * AttestationMonitor Component
 * Track all FDC attestation requests with success/failure rates and response times
 */
export function AttestationMonitor({ data = [], loading = false, error = null }) {
    const [stats, setStats] = useState(null)
    const [hourlyTrends, setHourlyTrends] = useState([])
    const [filter, setFilter] = useState("all") // all, success, failed, pending

    useEffect(() => {
        if (data.length > 0) {
            const fdcStats = calculateFDCStats(data)
            const trends = getHourlyUsageTrends(data, 24)
            setStats(fdcStats)
            setHourlyTrends(trends)
        }
    }, [data])

    if (loading) {
        return <LoadingSpinner size="lg" message="Connecting to Flare Network..." />
    }

    if (error) {
        return <ErrorMessage message={error} />
    }

    const filteredAttestations =
        filter === "all"
            ? data
            : data.filter((a) => a.status === filter)

    const columns = [
        {
            key: "id",
            label: "ID",
            sortable: true,
            render: (value) => (
                <span className="font-mono text-xs text-gray-600" title={value}>{value}</span>
            ),
        },
        {
            key: "type",
            label: "Type",
            sortable: true,
            render: (value) => (
                <span className="text-sm font-medium text-gray-900">{value}</span>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => {
                const config = {
                    success: { color: "green", icon: CheckCircle, label: "Confirmed" },
                    failed: { color: "red", icon: XCircle, label: "Failed" },
                    pending: { color: "yellow", icon: Clock, label: "Pending" },
                }[value] || { color: "gray", icon: Activity, label: value }

                const Icon = config.icon

                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-700`}
                    >
                        <Icon className="w-3 h-3" />
                        {config.label}
                    </span>
                )
            },
        },
        {
            key: "blockNumber",
            label: "Block",
            sortable: true,
            render: (value) => (
                <span className="font-mono text-xs text-gray-600">#{value}</span>
            ),
        },
        {
            key: "timestamp",
            label: "Time",
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {new Date(value).toLocaleTimeString()}
                </span>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Attestation Monitoring</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Real-time tracking of FDC attestation requests
                    </p>
                </div>
                <TierBadge tier="pro" />
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                            <Activity className="w-4 h-4" />
                            Total Requests
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                            <CheckCircle className="w-4 h-4" />
                            Confirmed
                        </div>
                        <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                        <div className="text-xs text-gray-500 mt-1">{stats.successRate}% rate</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
                            <XCircle className="w-4 h-4" />
                            Failed
                        </div>
                        <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-yellow-600 text-sm mb-2">
                            <Clock className="w-4 h-4" />
                            Pending
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </div>
                </div>
            )}

            {/* Hourly Trends Chart */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Hourly Activity (Last 24 Hours)
                </h4>
                <ChartWrapper
                    type="area"
                    data={hourlyTrends}
                    dataKeys={[
                        { key: "count", color: "#e93b6c", name: "Total" },
                    ]}
                    xAxisKey="hour"
                    height="300px"
                />
            </div>

            {/* Attestations Table */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Live Attestations ({filteredAttestations.length})
                </h4>
                <DataTable columns={columns} data={filteredAttestations} pageSize={10} />
            </div>
        </div>
    )
}
