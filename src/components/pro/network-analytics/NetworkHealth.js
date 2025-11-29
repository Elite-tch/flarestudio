"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "../shared/LoadingSpinner"
import { ErrorMessage } from "../shared/ErrorMessage"
import { TierBadge } from "../shared/TierBadge"
import { ChartWrapper } from "../shared/ChartWrapper"
import { getNetworkStatus, generateMockGasTrends } from "@/lib/pro/networkAnalyticsDb"
import { Activity, Zap, Clock, CheckCircle } from "lucide-react"

/**
 * NetworkHealth Component
 * Real-time network status and monitoring
 */
export function NetworkHealth() {
    const [networkStatus, setNetworkStatus] = useState(null)
    const [gasTrends, setGasTrends] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchNetworkData()
        const interval = setInterval(fetchNetworkData, 30000) // Refresh every 30s
        return () => clearInterval(interval)
    }, [])

    const fetchNetworkData = async () => {
        try {
            setLoading(true)
            setError(null)

            const [status, trends] = await Promise.all([
                getNetworkStatus("flare"),
                Promise.resolve(generateMockGasTrends(24)),
            ])

            setNetworkStatus(status)
            setGasTrends(trends)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading && !networkStatus) {
        return <LoadingSpinner size="lg" message="Loading network data..." />
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchNetworkData} />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Network Health</h3>
                    <p className="text-sm text-gray-600 mt-1">Real-time Flare network monitoring</p>
                </div>
                <TierBadge tier="free" />
            </div>

            {/* Status Cards */}
            {networkStatus && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                            <CheckCircle className="w-4 h-4" />
                            Network Status
                        </div>
                        <div className="text-2xl font-bold text-green-600 capitalize">
                            {networkStatus.status}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                            <Activity className="w-4 h-4" />
                            Latest Block
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {networkStatus.blockNumber?.toLocaleString()}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                            <Clock className="w-4 h-4" />
                            Block Time
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {networkStatus.blockTime}s
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                            <Zap className="w-4 h-4" />
                            Gas Price
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {networkStatus.gasPrice} Gwei
                        </div>
                    </div>
                </div>
            )}

            {/* Gas Price Trends */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Gas Price Trends (Last 24 Hours)
                </h4>
                <ChartWrapper
                    type="line"
                    data={gasTrends}
                    dataKeys={[{ key: "gasPrice", color: "#e93b6c", name: "Gas Price (Gwei)" }]}
                    xAxisKey="time"
                    height="300px"
                />
            </div>

            {/* Transaction Volume */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Transaction Volume (Last 24 Hours)
                </h4>
                <ChartWrapper
                    type="bar"
                    data={gasTrends}
                    dataKeys={[{ key: "transactions", color: "#10b981", name: "Transactions" }]}
                    xAxisKey="time"
                    height="300px"
                />
            </div>
        </div>
    )
}
