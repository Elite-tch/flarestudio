"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Calendar, RefreshCw } from "lucide-react"
import { getAllCurrentPrices, MAIN_FTSO_SYMBOLS } from "@/lib/pro/ftsoBlockchainService"

/**
 * HistoricalCharts Component
 * Displays historical price data for FTSO feeds with interactive charts
 */
export function HistoricalCharts() {
    const [selectedSymbol, setSelectedSymbol] = useState("BTC")
    const [chartType, setChartType] = useState("area") // 'area' or 'line'
    const [timeRange, setTimeRange] = useState("1h") // '1h', '24h', '7d', '30d'
    const [historicalData, setHistoricalData] = useState([])
    const [currentPrices, setCurrentPrices] = useState({})
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(null)

    // Fetch current prices
    useEffect(() => {
        fetchCurrentPrices()
        const interval = setInterval(fetchCurrentPrices, 4000) // Update every second
        return () => clearInterval(interval)
    }, [selectedSymbol])

    // Clear history when symbol changes
    useEffect(() => {
        setHistoricalData([])
    }, [selectedSymbol])

    const fetchCurrentPrices = async () => {
        try {
            console.log("🔄 Fetching FTSO prices from blockchain...")
            const prices = await getAllCurrentPrices()
            console.log("✅ Received prices:", prices)

            const priceMap = {}
            prices.forEach(p => {
                priceMap[p.symbol] = p.price
            })

            console.log("📊 Price map:", priceMap)
            setCurrentPrices(priceMap)
            setLastUpdate(new Date())

            // Add new data point for the selected symbol
            const currentSymbolData = prices.find(p => p.symbol === selectedSymbol)
            if (currentSymbolData) {
                setHistoricalData(prev => {
                    const newDataPoint = {
                        timestamp: currentSymbolData.timestamp.getTime(),
                        time: currentSymbolData.timestamp.toLocaleTimeString(),
                        date: currentSymbolData.timestamp.toLocaleDateString(),
                        price: currentSymbolData.price,
                        volume: 0 // Volume not available yet
                    }

                    // Avoid duplicates if timestamp hasn't changed
                    if (prev.length > 0 && prev[prev.length - 1].timestamp === newDataPoint.timestamp) {
                        return prev
                    }

                    return [...prev, newDataPoint].slice(-50) // Keep last 50 points
                })
            }

            setLoading(false)
        } catch (error) {
            console.error("❌ Error fetching current prices:", error)
            setLoading(false)
        }
    }

    const getPriceChange = () => {
        if (historicalData.length < 2) return { value: 0, percentage: 0, isPositive: true }

        const firstPrice = historicalData[0].price
        const lastPrice = historicalData[historicalData.length - 1].price
        const change = lastPrice - firstPrice
        const percentage = (change / firstPrice) * 100

        return {
            value: change,
            percentage: percentage,
            isPositive: change >= 0
        }
    }

    const priceChange = getPriceChange()

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <p className="text-sm text-gray-600">{data.date}</p>
                    <p className="text-xs text-gray-500">{data.time}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                        ${data.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Volume: ${data.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    {/* Symbol Selection */}
                    <div className="flex gap-2">
                        {MAIN_FTSO_SYMBOLS.map(symbol => (
                            <button
                                key={symbol}
                                onClick={() => setSelectedSymbol(symbol)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedSymbol === symbol
                                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {symbol}
                            </button>
                        ))}
                    </div>

                    {/* Time Range Selection */}
                    <div className="flex gap-2">
                        {["1h", "24h", "7d", "30d"].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${timeRange === range
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Chart Type Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setChartType("area")}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === "area"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Area
                        </button>
                        <button
                            onClick={() => setChartType("line")}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === "line"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Line
                        </button>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={fetchCurrentPrices}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Refresh data"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Price Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-sm text-gray-600 mb-1">Current Price</div>
                    <div className="text-3xl font-bold text-gray-900">
                        ${currentPrices[selectedSymbol]?.toLocaleString() || "Loading..."}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        {selectedSymbol}/USD
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-sm text-gray-600 mb-1">Price Change ({timeRange})</div>
                    <div className={`text-3xl font-bold flex items-center gap-2 ${priceChange.isPositive ? "text-green-600" : "text-red-600"
                        }`}>
                        {priceChange.isPositive ? (
                            <TrendingUp className="w-6 h-6" />
                        ) : (
                            <TrendingDown className="w-6 h-6" />
                        )}
                        {priceChange.percentage.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        ${Math.abs(priceChange.value).toFixed(2)}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-sm text-gray-600 mb-1">Last Update</div>
                    <div className="text-xl font-bold text-gray-900">
                        {lastUpdate ? lastUpdate.toLocaleTimeString() : "Loading..."}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {lastUpdate ? lastUpdate.toLocaleDateString() : ""}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedSymbol} Price History
                </h3>

                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        {chartType === "area" ? (
                            <AreaChart data={historicalData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="time"
                                    stroke="#6b7280"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    tick={{ fontSize: 12 }}
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    fill="url(#colorPrice)"
                                />
                            </AreaChart>
                        ) : (
                            <LineChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="time"
                                    stroke="#6b7280"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    tick={{ fontSize: 12 }}
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Recent Data Points</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Change
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Volume
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {historicalData.slice(-10).reverse().map((data, index) => {
                                const prevPrice = index < historicalData.length - 1
                                    ? historicalData[historicalData.length - index - 2].price
                                    : data.price
                                const change = data.price - prevPrice
                                const changePercent = (change / prevPrice) * 100

                                return (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {data.time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${data.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`flex items-center gap-1 ${change >= 0 ? "text-green-600" : "text-red-600"
                                                }`}>
                                                {change >= 0 ? (
                                                    <TrendingUp className="w-4 h-4" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4" />
                                                )}
                                                {changePercent.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${data.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
