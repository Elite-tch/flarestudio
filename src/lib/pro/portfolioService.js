import { createClient } from '@supabase/supabase-js'
import { ethers } from 'ethers'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

// Network configurations
const NETWORKS = {
    mainnet: {
        name: 'Flare Mainnet',
        rpc: 'https://flare-api.flare.network/ext/C/rpc',
        explorerApi: 'https://flare-explorer.flare.network/api',
        explorerApiV2: 'https://flare-explorer.flare.network/api/v2',
        chainId: 14,
        currency: 'FLR'
    },
    testnet: {
        name: 'Coston2 Testnet',
        rpc: 'https://coston2-api.flare.network/ext/C/rpc',
        explorerApi: 'https://coston2-explorer.flare.network/api',
        explorerApiV2: 'https://coston2-explorer.flare.network/api/v2',
        chainId: 114,
        currency: 'C2FLR'
    }
}

/**
 * Get provider for specified network
 */
function getProvider(network = 'mainnet') {
    return new ethers.JsonRpcProvider(NETWORKS[network].rpc)
}

/**
 * Get wallet balance from blockchain
 */
export async function getWalletBalance(address, network = 'mainnet') {
    try {
        const provider = getProvider(network)
        const balance = await provider.getBalance(address)
        return ethers.formatEther(balance)
    } catch (error) {
        console.error('Failed to fetch wallet balance:', error)
        return '0'
    }
}

/**
 * Get transaction count (Nonce) from RPC
 */
export async function getNonce(address, network = 'mainnet') {
    try {
        const provider = getProvider(network)
        return await provider.getTransactionCount(address)
    } catch (error) {
        console.error('Failed to fetch nonce:', error)
        return 0
    }
}

/**
 * Get total transaction count from Explorer API V2
 * Uses the counters endpoint for accurate total counts
 */
export async function getTransactionCount(address, network = 'mainnet') {
    try {
        const config = NETWORKS[network]
        
        // Try V2 API first (Counters)
        if (config.explorerApiV2) {
            try {
                const response = await fetch(`${config.explorerApiV2}/addresses/${address}/counters`)
                if (response.ok) {
                    const data = await response.json()
                    // Return total transactions count + token transfers count for full activity
                    const txCount = parseInt(data.transactions_count || '0')
                    const tokenTxCount = parseInt(data.token_transfers_count || '0')
                    return txCount + tokenTxCount
                }
            } catch (e) {
                console.warn('V2 API failed, falling back to V1', e)
            }
        }

        // Fallback to V1 API (Legacy)
        if (config.explorerApi) {
            const response = await fetch(`${config.explorerApi}?module=account&action=txlist&address=${address}&page=1&offset=1`)
            const data = await response.json()
            if (data.status === '1' && Array.isArray(data.result)) {
                // V1 doesn't give total count easily without pagination hacks
                // Just return nonce as last resort
                return await getNonce(address, network)
            }
        }
        
        // Fallback to nonce if API fails
        return await getNonce(address, network)
    } catch (error) {
        console.error('Failed to fetch total tx count:', error)
        return await getNonce(address, network)
    }
}

/**
 * Get user's portfolios from Supabase
 */
export async function getUserPortfolios(userId) {
    try {
        if (!supabase) {
            throw new Error("Supabase not configured")
        }

        const { data, error } = await supabase
            .from('user_portfolios')
            .select('*')
            .eq('user_id', userId)

        if (error) throw error

        return data || []
    } catch (error) {
        console.error("Failed to fetch user portfolios:", error)
        return []
    }
}

/**
 * Add wallet to user's portfolio
 */
export async function addWalletToPortfolio(userId, walletData) {
    try {
        if (!supabase) {
            throw new Error("Supabase not configured")
        }

        const { data, error } = await supabase
            .from('user_portfolios')
            .insert([{
                user_id: userId,
                ...walletData
            }])
            .select()

        if (error) throw error

        return data[0]
    } catch (error) {
        console.error("Failed to add wallet:", error)
        throw error
    }
}

/**
 * Remove wallet from portfolio
 */
export async function removeWalletFromPortfolio(portfolioId) {
    try {
        if (!supabase) {
            throw new Error("Supabase not configured")
        }

        const { error } = await supabase
            .from('user_portfolios')
            .delete()
            .eq('id', portfolioId)

        if (error) throw error

        return true
    } catch (error) {
        console.error("Failed to remove wallet:", error)
        throw error
    }
}

/**
 * Get FLR price in USD from FTSO
 */
export async function getFLRPrice(network = 'mainnet') {
    try {
        // This is a simplified version - you would need to query FTSO contract
        // For now, return a mock price
        return 0.025 // $0.025 per FLR
    } catch (error) {
        console.error("Failed to fetch FLR price:", error)
        return 0
    }
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address) {
    return ethers.isAddress(address)
}

/**
 * Get network configuration
 */
export function getNetworkConfig(network) {
    return NETWORKS[network] || NETWORKS.mainnet
}
