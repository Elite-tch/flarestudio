import { ethers } from "ethers"

/**
 * FTSO Data Service
 * Utilities for fetching FTSO price feed data from Flare Network
 */

// Flare Network RPC endpoints
const RPC_ENDPOINTS = {
    flare: "https://flare-api.flare.network/ext/C/rpc",
    coston2: "https://coston2-api.flare.network/ext/C/rpc",
}

// FTSO Registry contract address (Flare Mainnet)
const FTSO_REGISTRY_ADDRESS = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"

// Simplified ABI for FtsoRegistry
const FTSO_REGISTRY_ABI = [
    "function getSupportedSymbols() external view returns (string[] memory)",
    "function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals)",
]

// Simplified ABI for individual FTSO contracts
const FTSO_ABI = [
    "function getCurrentPrice() external view returns (uint256 _price, uint256 _timestamp)",
    "function getCurrentPriceWithDecimals() external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals)",
]

/**
 * Get provider for Flare network
 * @param {string} network - "flare" | "coston2"
 * @returns {ethers.JsonRpcProvider}
 */
export function getProvider(network = "flare") {
    try {
        return new ethers.JsonRpcProvider(RPC_ENDPOINTS[network])
    } catch (error) {
        console.error("Failed to create provider:", error)
        throw new Error(`Failed to connect to ${network} network`)
    }
}

/**
 * Get supported FTSO symbols
 * @param {string} network - "flare" | "coston2"
 * @returns {Promise<string[]>}
 */
export async function getSupportedSymbols(network = "flare") {
    try {
        const provider = getProvider(network)
        const registry = new ethers.Contract(
            FTSO_REGISTRY_ADDRESS,
            FTSO_REGISTRY_ABI,
            provider
        )
        const symbols = await registry.getSupportedSymbols()
        return symbols
    } catch (error) {
        console.error("Failed to fetch supported symbols:", error)
        return ["BTC", "ETH", "FLR", "XRP", "LTC", "DOGE", "ADA", "ALGO", "XLM"] // Fallback
    }
}

/**
 * Get current price for a symbol
 * @param {string} symbol - Asset symbol (e.g., "BTC")
 * @param {string} network - "flare" | "coston2"
 * @returns {Promise<{price: number, timestamp: number, decimals: number}>}
 */
export async function getCurrentPrice(symbol, network = "flare") {
    try {
        const provider = getProvider(network)
        const registry = new ethers.Contract(
            FTSO_REGISTRY_ADDRESS,
            FTSO_REGISTRY_ABI,
            provider
        )

        const [price, timestamp, decimals] = await registry.getCurrentPriceWithDecimals(symbol)

        return {
            price: Number(price) / Math.pow(10, Number(decimals)),
            timestamp: Number(timestamp),
            decimals: Number(decimals),
            symbol,
        }
    } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error)
        throw error
    }
}

/**
 * Get current prices for multiple symbols
 * @param {string[]} symbols - Array of symbols
 * @param {string} network - "flare" | "coston2"
 * @returns {Promise<Array>}
 */
export async function getMultiplePrices(symbols, network = "flare") {
    try {
        const promises = symbols.map((symbol) =>
            getCurrentPrice(symbol, network).catch((err) => ({
                symbol,
                error: err.message,
                price: null,
                timestamp: null,
            }))
        )
        return await Promise.all(promises)
    } catch (error) {
        console.error("Failed to fetch multiple prices:", error)
        throw error
    }
}

/**
 * Generate mock historical data for a symbol
 * This is a placeholder - in production, you'd fetch from a backend/indexer
 * @param {string} symbol - Asset symbol
 * @param {number} hours - Number of hours of data
 * @returns {Array}
 */
export function generateMockHistoricalData(symbol, hours = 24) {
    const data = []
    const now = Date.now()
    const basePrice = {
        BTC: 45000,
        ETH: 2500,
        FLR: 0.025,
        XRP: 0.6,
        LTC: 75,
        DOGE: 0.08,
        ADA: 0.45,
        ALGO: 0.25,
        XLM: 0.12,
    }[symbol] || 100

    for (let i = hours; i >= 0; i--) {
        const timestamp = new Date(now - i * 60 * 60 * 1000)
        const volatility = 0.02 // 2% volatility
        const randomChange = (Math.random() - 0.5) * 2 * volatility
        const price = basePrice * (1 + randomChange)

        data.push({
            time: timestamp.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            timestamp: timestamp.getTime(),
            price: parseFloat(price.toFixed(6)),
            symbol,
        })
    }

    return data
}

/**
 * Calculate price statistics
 * @param {Array} data - Historical price data
 * @returns {Object}
 */
export function calculatePriceStats(data) {
    if (!data || data.length === 0) {
        return {
            min: 0,
            max: 0,
            avg: 0,
            change: 0,
            changePercent: 0,
        }
    }

    const prices = data.map((d) => d.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const change = lastPrice - firstPrice
    const changePercent = (change / firstPrice) * 100

    return {
        min: parseFloat(min.toFixed(6)),
        max: parseFloat(max.toFixed(6)),
        avg: parseFloat(avg.toFixed(6)),
        change: parseFloat(change.toFixed(6)),
        changePercent: parseFloat(changePercent.toFixed(2)),
    }
}
