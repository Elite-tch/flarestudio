import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for network analytics
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

/**
 * Get contract analytics from Supabase
 */
export async function getContractAnalytics() {
    try {
        if (!supabase) {
            throw new Error("Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file")
        }

        const { data, error } = await supabase
            .from('contract_analytics')
            .select('*')
            .limit(20)

        if (error) {
            console.error("Supabase error:", error)
            throw new Error(`Database error: ${error.message}`)
        }

        console.log("Contract analytics data:", data) // Debug: see what columns exist

        return data || []
    } catch (error) {
        console.error("Failed to fetch contract analytics:", error)
        throw error
    }
}

/**
 * Get network stats from Supabase
 */
export async function getNetworkStats() {
    try {
        if (!supabase) {
            throw new Error("Database not configured")
        }

        const { data, error } = await supabase
            .from('network_stats')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(1)
            .single()

        if (error) throw error

        return data
    } catch (error) {
        console.error("Failed to fetch network stats:", error)
        throw error
    }
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatLargeNumber(num) {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toString()
}

/**
 * Get current network status from blockchain
 */
export async function getNetworkStatus() {
    try {
        const { ethers } = await import('ethers')
        const provider = new ethers.JsonRpcProvider('https://flare-api.flare.network/ext/C/rpc')

        const [blockNumber, gasPrice, networkInfo] = await Promise.all([
            provider.getBlockNumber(),
            provider.getFeeData(),
            provider.getNetwork(),
        ])

        const block = await provider.getBlock(blockNumber)
        const prevBlock = await provider.getBlock(blockNumber - 1)
        const blockTime = block.timestamp - prevBlock.timestamp

        return {
            blockNumber,
            blockTime,
            gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0, "gwei"),
            maxFeePerGas: ethers.formatUnits(gasPrice.maxFeePerGas || 0, "gwei"),
            chainId: networkInfo.chainId.toString(),
            timestamp: block.timestamp,
            status: "healthy",
        }
    } catch (error) {
        console.error("Failed to fetch network status:", error)
        return {
            status: "error",
            error: error.message,
        }
    }
}

/**
 * Generate mock gas price trends (placeholder until real implementation)
 */
export function generateMockGasTrends(hours = 24) {
    const data = []
    const now = Date.now()
    const baseGasPrice = 25

    for (let i = hours; i >= 0; i--) {
        const timestamp = new Date(now - i * 60 * 60 * 1000)
        const volatility = 0.3
        const randomChange = (Math.random() - 0.5) * 2 * volatility
        const gasPrice = baseGasPrice * (1 + randomChange)

        data.push({
            time: timestamp.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            timestamp: timestamp.getTime(),
            gasPrice: parseFloat(gasPrice.toFixed(2)),
            transactions: Math.floor(Math.random() * 1000) + 500,
        })
    }

    return data
}
