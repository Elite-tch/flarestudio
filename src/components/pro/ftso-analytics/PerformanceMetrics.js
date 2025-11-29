"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react"
import { getAllCurrentPrices, MAIN_FTSO_SYMBOLS } from "@/lib/pro/ftsoBlockchainService"

/**
 * PerformanceMetrics Component
 * Displays real-time session performance for FTSO assets
 */
export function PerformanceMetrics() {
    const [metrics, setMetrics] = useState([])
    const [loading, setLoading] = useState(true)
    const [initialPrices, setInitialPrices] = useState({})
    const [topGainer, setTopGainer] = useState(null)
    const [topLoser, setTopLoser] = useState(null)

    useEffect(() => {
        // Initial fetch to set baseline
        const init = async () => {
            try {
                const prices = await getAllCurrentPrices()
                const initialMap = {}
                prices.forEach(p => {
                    initialMap[p.symbol] = p.price
                })
                setInitialPrices(initialMap)
                updateMetrics(prices, initialMap)
                setLoading(false)
            } catch (error) {
                console.error("Failed to initialize metrics:", error)
                setLoading(false)
            }
        }

        init()

        // Periodic updates
        const interval = setInterval(async () => {
            try {
                const prices = await getAllCurrentPrices()
                updateMetrics(prices, initialPrices)
            } catch (error) {
                console.error("Failed to update metrics:", error)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, []) // Empty dependency array to run once on mount

    // Update metrics based on current vs initial prices
    const updateMetrics = (currentPrices, startPrices) => {
        if (Object.keys(startPrices).length === 0) return

        const newMetrics = currentPrices.map(p => {
            const startPrice = startPrices[p.symbol] || p.price
            const change = p.price - startPrice
            const changePercent = startPrice !== 0 ? (change / startPrice) * 100 : 0

            return {
                symbol: p.symbol,
                price: p.price,
                change,
                changePercent
            }
        })

        setMetrics(newMetrics)

        // Find top gainer/loser
        if (newMetrics.length > 0) {
            const sorted = [...newMetrics].sort((a, b) => b.changePercent - a.changePercent)
            setTopGainer(sorted[0])
            setTopLoser(sorted[sorted.length - 1])
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Session Performance</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Real-time performance since page load
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Activity className="w-4 h-4" />
                    Live Updates
                </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topGainer && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-green-800">Top Gainer</div>
                            <div className="text-2xl font-bold text-green-900 mt-1">{topGainer.symbol}</div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                                <TrendingUp className="w-5 h-5" />
                                +{topGainer.changePercent.toFixed(2)}%
                            </div>
                            <div className="text-sm text-green-700">
                                ${topGainer.price.toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}

                {topLoser && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100 flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-red-800">Top Loser</div>
                            <div className="text-2xl font-bold text-red-900 mt-1">{topLoser.symbol}</div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-red-600 font-bold text-lg">
                                <TrendingDown className="w-5 h-5" />
                                {topLoser.changePercent.toFixed(2)}%
                            </div>
                            <div className="text-sm text-red-700">
                                ${topLoser.price.toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map(metric => (
                    <div key={metric.symbol} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-900">{metric.symbol}</span>
                            {metric.change >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                            ${metric.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </div>
                        <div className={`text-xs font-medium mt-1 ${metric.change >= 0 ? "text-green-600" : "text-red-600"
                            }`}>
                            {metric.change >= 0 ? "+" : ""}
                            {metric.changePercent.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
