// src/components/BlockMetricsCharts.js
"use client"

import React from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"

export default function BlockMetricsCharts({ blocks }) {
  if (!blocks || blocks.length === 0) return null

  // Safe data transformation with fallbacks
  const chartData = blocks.map((b) => {
    // Safely parse each value with fallbacks
    const height = Number(b.height) || 0
    const gasUsed = (Number(b.gas_used) || 0) / 1e6
    const reward = (Number(b.block_reward) || 0) / 1e18
    const baseFee = (Number(b.base_fee) || 0) / 1e9

    // Return safe values
    return {
      height,
      gasUsed,
      reward,
      baseFee,
    }
  })

  // Custom tooltip formatter to handle NaN values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{`Block: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${isNaN(entry.value) ? 'N/A' : entry.value.toFixed(4)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Block Metrics Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Gas Used (millions)</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="height" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="gasUsed" 
                stroke="#e93b6c" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Block Reward (FLR)</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="height" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="reward" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Base Fee (Gwei)</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="height" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="baseFee" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}