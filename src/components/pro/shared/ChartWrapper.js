"use client"

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

/**
 * ChartWrapper Component
 * Reusable chart component with consistent styling
 * @param {string} type - "line" | "area" | "bar"
 * @param {Array} data - Chart data
 * @param {Array} dataKeys - Keys to plot [{key, color, name}]
 * @param {string} xAxisKey - Key for X-axis
 * @param {string} height - Chart height (default: 300px)
 */
export function ChartWrapper({
    type = "line",
    data = [],
    dataKeys = [],
    xAxisKey = "time",
    height = "300px",
}) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center bg-gray-50 rounded-lg" style={{ height }}>
                <p className="text-gray-500 text-sm">No data available</p>
            </div>
        )
    }

    const ChartComponent = {
        line: LineChart,
        area: AreaChart,
        bar: BarChart,
    }[type] || LineChart

    const DataComponent = {
        line: Line,
        area: Area,
        bar: Bar,
    }[type] || Line

    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer>
                <ChartComponent data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey={xAxisKey}
                        stroke="#6b7280"
                        style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: "12px" }}
                        iconType="circle"
                    />
                    {dataKeys.map((item) => (
                        <DataComponent
                            key={item.key}
                            type="monotone"
                            dataKey={item.key}
                            stroke={item.color || "#e93b6c"}
                            fill={item.color || "#e93b6c"}
                            name={item.name || item.key}
                            strokeWidth={2}
                            dot={type === "line" ? { r: 3 } : false}
                            activeDot={type === "line" ? { r: 5 } : false}
                            fillOpacity={type === "area" ? 0.6 : 1}
                        />
                    ))}
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    )
}
