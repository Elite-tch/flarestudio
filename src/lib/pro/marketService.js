"use server"

/**
 * Market Service
 * Fetches external market data for comparison with FTSO
 * Server Action to avoid CORS issues
 */

// Map FTSO symbols to Coinbase pairs
const SYMBOL_MAP = {
    "BTC": "BTC-USD",
    "ETH": "ETH-USD",
    "XRP": "XRP-USD",
    "FLR": "FLR-USD",
    "LTC": "LTC-USD",
    "DOGE": "DOGE-USD",
    "ADA": "ADA-USD",
    "ALGO": "ALGO-USD"
}

/**
 * Get current CEX prices for specified symbols
 * Uses Coinbase Public API
 * @param {string[]} symbols - Array of symbols (e.g., ["BTC", "ETH"])
 */
export async function getCexPrices(symbols) {
    const prices = {}

    // Fetch in parallel
    const promises = symbols.map(async (symbol) => {
        try {
            const pair = SYMBOL_MAP[symbol]
            if (!pair) return null

            const response = await fetch(`https://api.coinbase.com/v2/prices/${pair}/spot`, { next: { revalidate: 10 } })
            if (!response.ok) return null
            const data = await response.json()

            if (data && data.data) {
                return {
                    symbol,
                    price: parseFloat(data.data.amount),
                    source: "Coinbase"
                }
            }
            return null
        } catch (error) {
            return null
        }
    })

    const results = await Promise.all(promises)

    results.forEach(result => {
        if (result) {
            prices[result.symbol] = result
        }
    })

    return prices
}
