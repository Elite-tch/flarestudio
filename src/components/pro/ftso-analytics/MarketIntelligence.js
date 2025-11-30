"use client"

import { useState, useEffect } from "react"
//import { TierBadge } from "../shared/TierBadge"
import { DataTable } from "../shared/DataTable"
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react"
import { getAllCurrentPrices, MAIN_FTSO_SYMBOLS } from "@/lib/pro/ftsoBlockchainService"
import { getCexPrices } from "@/lib/pro/marketService"

/**
 * MarketIntelligence Component
 * Real-time Volatility indicators, correlation matrix, arbitrage opportunities
 */
export function MarketIntelligence() {
    const [volatilityData, setVolatilityData] = useState([])
    const [arbitrageOpportunities, setArbitrageOpportunities] = useState([])
    const [priceHistory, setPriceHistory] = useState({}) // Store history for volatility calc
    const [loading, setLoading] = useState(true)

    // Initialize price history structure
    useEffect(() => {
        const initialHistory = {}
        MAIN_FTSO_SYMBOLS.forEach(s => initialHistory[s] = [])
        setPriceHistory(initialHistory)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch FTSO Prices
                const ftsoPrices = await getAllCurrentPrices()

                // 2. Update Price History & Calculate Volatility
                updateVolatility(ftsoPrices)

                // 3. Fetch CEX Prices & Calculate Arbitrage
                const symbols = ftsoPrices.map(p => p.symbol)
                const cexPrices = await getCexPrices(symbols)
                calculateArbitrage(ftsoPrices, cexPrices)

                setLoading(false)
            } catch (error) {
                console.error("Error fetching market intelligence data:", error)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [])

    const updateVolatility = (currentPrices) => {
        setPriceHistory(prev => {
            const newHistory = { ...prev }
            const newVolatilityData = []

            currentPrices.forEach(p => {
                if (!newHistory[p.symbol]) newHistory[p.symbol] = []

                // Add new price, keep last 20
                newHistory[p.symbol] = [...newHistory[p.symbol], p.price].slice(-20)

                // Calculate Volatility (Standard Deviation of % changes)
                const prices = newHistory[p.symbol]
                let volatility = 0
                let trend = "flat"

                if (prices.length > 1) {
                    // Calculate % changes
                    const changes = []
                    for (let i = 1; i < prices.length; i++) {
                        changes.push((prices[i] - prices[i - 1]) / prices[i - 1])
                    }

                    // Std Dev
                    const mean = changes.reduce((a, b) => a + b, 0) / changes.length
                    const variance = changes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / changes.length
                    volatility = Math.sqrt(variance) * 100 * Math.sqrt(prices.length) // Annualized-ish scaling

                    // Simple Trend
                    trend = prices[prices.length - 1] > prices[0] ? "up" : "down"
                }

                newVolatilityData.push({
                    symbol: p.symbol,
                    volatility: volatility.toFixed(2),
                    trend,
                    rsi: prices.length > 10 ? calculateRSI(prices) : "...",
                })
            })

            setVolatilityData(newVolatilityData)
            return newHistory
        })
    }

    const calculateRSI = (prices) => {
        // Simple RSI approximation
        let gains = 0
        let losses = 0
        for (let i = 1; i < prices.length; i++) {
            const diff = prices[i] - prices[i - 1]
            if (diff >= 0) gains += diff
            else losses -= diff
        }
        if (losses === 0) return 100
        const rs = gains / losses
        return Math.floor(100 - (100 / (1 + rs)))
    }

    const calculateArbitrage = (ftsoPrices, cexPrices) => {
        const opportunities = []

        ftsoPrices.forEach(ftso => {
            const cex = cexPrices[ftso.symbol]
            if (cex) {
                const diff = ftso.price - cex.price
                const pct = (diff / cex.price) * 100

                opportunities.push({
                    symbol: ftso.symbol,
                    ftsoPrice: ftso.price,
                    cexPrice: cex.price,
                    difference: diff,
                    percentage: pct
                })
            }
        })

        // Sort by percentage difference (descending)
        opportunities.sort((a, b) => Math.abs(b.percentage) - Math.abs(a.percentage))

        setArbitrageOpportunities(opportunities)
    }

    const volatilityColumns = [
        {
            key: "symbol",
            label: "Symbol",
            sortable: true,
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>,
        },
        {
            key: "volatility",
            label: "Volatility Index",
            sortable: true,
            render: (value) => (
                <span className="text-sm font-medium text-gray-900">{value}</span>
            ),
        },
        {
            key: "trend",
            label: "Session Trend",
            sortable: true,
            render: (value) => (
                <span
                    className={`inline-flex items-center gap-1 ${value === "up" ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {value === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                    {value === "up" ? "Bullish" : "Bearish"}
                </span>
            ),
        },
        {
            key: "rsi",
            label: "RSI (Session)",
            sortable: true,
            render: (value) => {
                const val = parseInt(value)
                if (isNaN(val)) return <span className="text-gray-400">...</span>
                const color =
                    val > 70 ? "text-red-600" : val < 30 ? "text-green-600" : "text-gray-900"
                return <span className={`text-sm font-medium ${color}`}>{value}</span>
            },
        },
    ]

    const arbitrageColumns = [
        {
            key: "symbol",
            label: "Symbol",
            sortable: true,
            render: (value) => <span className="font-semibold text-gray-900">{value}</span>,
        },
        {
            key: "ftsoPrice",
            label: "FTSO Price",
            sortable: true,
            render: (value) => <span className="text-sm text-gray-900">${(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>,
        },
        {
            key: "cexPrice",
            label: "CEX Price (Coinbase)",
            sortable: true,
            render: (value) => <span className="text-sm text-gray-900">${(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>,
        },
        {
            key: "percentage",
            label: "Spread",
            sortable: true,
            render: (value) => {
                const color = Math.abs(value) > 0.5 ? "text-orange-600" : "text-gray-600"
                return <span className={`text-sm font-medium ${color}`}>{Math.abs(value).toFixed(2)}%</span>
            },
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Market Intelligence</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Real-time analytics and arbitrage opportunities
                    </p>
                </div>
                 {/*     <TierBadge tier="pro" /> */}
            </div>

            {/* Volatility Analysis */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-[#e93b6c]" />
                    <h4 className="text-lg font-semibold text-gray-900">Real-Time Volatility</h4>
                </div>
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Gathering market data...</div>
                ) : (
                    <DataTable columns={volatilityColumns} data={volatilityData} pageSize={7} />
                )}
            </div>

            {/* Arbitrage Opportunities */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Live Arbitrage (FTSO vs CEX)</h4>
                    {!loading && (
                        <span className="ml-auto text-xs text-gray-500 font-mono">
                            Last update: {new Date().toLocaleTimeString()}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Price differences between decentralized FTSO feeds and centralized exchanges
                </p>
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Scanning markets...</div>
                ) : arbitrageOpportunities.length > 0 ? (
                    <DataTable columns={arbitrageColumns} data={arbitrageOpportunities} pageSize={5} />
                ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        No arbitrage opportunities detected (or CEX data unavailable)
                    </div>
                )}
            </div>

            
        </div>
    )
}
