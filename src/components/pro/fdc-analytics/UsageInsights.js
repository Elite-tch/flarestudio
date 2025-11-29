"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "../shared/LoadingSpinner"
import { TierBadge } from "../shared/TierBadge"
import { ChartWrapper } from "../shared/ChartWrapper"
import { DataTable } from "../shared/DataTable"
import {
    getAttestationTypeDistribution,
    getProviderPerformance,
} from "@/lib/pro/fdcDataService"
import { PieChart, TrendingUp, Users, Zap } from "lucide-react"

/**
 * UsageInsights Component
 * FDC usage trends, popular attestation types, and gas cost analysis
 */
export function UsageInsights({ data = [], loading = false }) {
    const [typeDistribution, setTypeDistribution] = useState([])
    const [providerPerformance, setProviderPerformance] = useState([])

    useEffect(() => {
        if (data.length > 0) {
            const distribution = getAttestationTypeDistribution(data)
            const performance = getProviderPerformance(data)
            setTypeDistribution(distribution)
            setProviderPerformance(performance)
        }
    }, [data])

    if (loading) {
        return <LoadingSpinner size="lg" message="Analyzing usage data..." />
    }

    const typeColumns = [
        {
            key: "type",
            label: "Attestation Type",
            sortable: true,
            render: (value) => (
                <span className="font-medium text-gray-900">{value}</span>
            ),
        },
        {
            key: "count",
            label: "Count",
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-900">{value.toLocaleString()}</span>
            ),
        },
        {
            key: "percentage",
            label: "Percentage",
            sortable: true,
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                            className="bg-[#e93b6c] h-2 rounded-full"
                            style={{ width: `${value}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{value}%</span>
                </div>
            ),
        },
    ]

    const providerColumns = [
        {
            key: "provider",
            label: "Provider",
            sortable: true,
            render: (value) => (
                <span className="font-medium text-gray-900">{value}</span>
            ),
        },
        {
            key: "total",
            label: "Total Attestations",
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-900">{value.toLocaleString()}</span>
            ),
        },
        {
            key: "successRate",
            label: "Success Rate",
            sortable: true,
            render: (value) => (
                <span className="text-sm font-medium text-green-600">{value}%</span>
            ),
        },
        {
            key: "avgResponseTime",
            label: "Avg Response Time",
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-900">{value}ms</span>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">FDC Usage Insights</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Network-wide trends and usage patterns
                    </p>
                </div>
                <TierBadge tier="pro" />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <PieChart className="w-4 h-4" />
                        Attestation Types
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {typeDistribution.length}
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <Users className="w-4 h-4" />
                        Active Providers
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {providerPerformance.length}
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <Zap className="w-4 h-4" />
                        Total Events
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {data.length}
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-gray-600 text-sm mb-2">Avg Gas/Attestation</div>
                    <div className="text-2xl font-bold text-gray-900">
                        -
                    </div>
                </div>
            </div>

            {/* Attestation Type Distribution */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Attestation Type Distribution
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <DataTable columns={typeColumns} data={typeDistribution} pageSize={10} />
                    </div>
                    <div>
                        <ChartWrapper
                            type="bar"
                            data={typeDistribution}
                            dataKeys={[{ key: "count", color: "#e93b6c", name: "Count" }]}
                            xAxisKey="type"
                            height="300px"
                        />
                    </div>
                </div>
            </div>

            {/* Provider Performance */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Provider Performance Metrics
                </h4>
                <DataTable columns={providerColumns} data={providerPerformance} pageSize={10} />
            </div>

            {/* Peak Usage Times (Enterprise Feature) */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">Peak Usage Analysis</h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Identify peak usage times and optimize your attestation requests
                        </p>
                    </div>
                    <TierBadge tier="enterprise" />
                </div>
                <p className="text-sm text-gray-600">
                    Advanced usage pattern analysis with hourly, daily, and weekly breakdowns. Available in Enterprise tier.
                </p>
            </div>
        </div>
    )
}
