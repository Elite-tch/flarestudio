// src/components/layout/NetworkOverview.js

import React, { useEffect, useState } from "react"
import axios from "axios"
import { RefreshCw, Eye } from "lucide-react"
import TransactionModal from "./TransactionModal"
import TutorialSection from "../Block/Tutorial"

export default function NetworkOverview() {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(null)

  const fetchBlocks = async () => {
    try {
      setRefreshing(true)
      const response = await axios.get("https://flare-explorer.flare.network/api/v2/blocks")
      let items = response.data.items || []
      items = items.sort((a, b) => b.height - a.height).slice(0, 5)
      setBlocks(items)
    } catch (error) {
      console.error("Error fetching blocks:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBlocks()
    const interval = setInterval(fetchBlocks, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num) => (num ? num.toLocaleString() : "-")

  const baseFeeColor = (fee) => {
    if (!fee) return "text-gray-600"
    const gwei = Number(fee) / 1e9
    if (gwei < 20) return "text-green-600"
    if (gwei < 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="bg-[#fff1f3] rounded py-10 px-4 md:px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col gap-2 sm:flex-row justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Latest Blocks</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Get a quick view of what’s happening on the Flare network right now.
          </p>
        </div>
        <button
          onClick={fetchBlocks}
          className={`flex items-center justify-end gap-2 w-fit text-sm font-medium text-[#e93b6c] border border-[#e93b6c] px-3 py-1.5 rounded-lg transition ${
            refreshing && "opacity-70 cursor-wait"
          }`}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-[#fff1f3] rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-[#ffe4e8] text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">Block</th>
                <th className="py-3 px-4 text-left">Age / Time</th>
                <th className="py-3 px-4 text-left">Gas Used</th>
                <th className="py-3 px-4 text-left">Miner</th>
                <th className="py-3 px-4 text-left">Reward (FLR)</th>
                <th className="py-3 px-4 text-left">Burnt Fees (FLR)</th>
                <th className="py-3 px-4 text-left">Base Fee</th>
                <th className="py-3 px-4 text-left">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500 italic">
                    Loading latest blocks...
                  </td>
                </tr>
              ) : (
                blocks.map((block) => (
                  <tr key={block.height} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-[#e93b6c]">{block.height}</td>
                    <td className="py-3 px-4">
                      {block.timestamp
                        ? new Date(block.timestamp).toLocaleString([], {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">{formatNumber(block.gas_used)}</td>
                    <td className="py-3 px-4 truncate max-w-[100px]">
                      {block.miner?.hash ? block.miner.hash.slice(0, 6) + "..." : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      {block.block_reward
                        ? (Number(block.block_reward) / 1e18).toFixed(8)
                        : "0.00000000"}
                    </td>
                    <td className="py-3 px-4">
                      {block.burnt_fees
                        ? (Number(block.burnt_fees) / 1e18).toFixed(8)
                        : "0.00000000"}
                    </td>
                    <td className={`py-3 px-4 ${baseFeeColor(block.base_fee)}`}>
                      {block.base_fee
                        ? `${(Number(block.base_fee) / 1e9).toFixed(4)} Gwei`
                        : "25.0000 Gwei"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedBlock(block)}
                        className="text-[#e93b6c] flex items-center gap-1 "
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Button */}
        <div className="p-4 text-center border-t bg-[#ffe4e8]">
          <button
            onClick={() => window.open("https://flare-explorer.flare.network/blocks", "_blank")}
            className="text-[#e93b6c] font-medium transition"
          >
            View All Blocks →
          </button>
        </div>

       
      </div>

      {/* Modal for Transactions */}
      {selectedBlock && (
        <TransactionModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}

      <div>
      <TutorialSection blocks={blocks} />
      </div>
    </div>
  )
}
