// src/components/TransactionModal.js

import React, { useEffect, useState } from "react"
import axios from "axios"

export default function TransactionModal({ block, onClose }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `https://flare-explorer.flare.network/api/v2/blocks/${block.height}/transactions`
        )
        const items = response.data.items || []
        setTransactions(items.slice(0, 5)) // latest 5
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [block.height])

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Transactions in Block {block.height}
          </h2>
          <button onClick={onClose} className="text-red-500 font-medium hover:text-red-700">
            Close
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm text-center">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-2 px-4 text-left">Hash</th>
                  <th className="py-2 px-4 text-left">From</th>
                  <th className="py-2 px-4 text-left">To</th>
                  <th className="py-2 px-4 text-left">Value (FLR)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.hash} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-[#e93b6c] truncate max-w-[150px]">
                      {tx.hash.slice(0, 10)}...
                    </td>
                    <td className="py-2 px-4 truncate max-w-[100px]">
                      {tx.from?.hash ? tx.from.hash.slice(0, 8) + "..." : "N/A"}
                    </td>
                    <td className="py-2 px-4 truncate max-w-[100px]">
                      {tx.to?.hash ? tx.to.hash.slice(0, 8) + "..." : "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {tx.value ? (Number(tx.value) / 1e18).toFixed(6) : "0.000000"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
