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
        chainId: 14,
        currency: 'FLR'
    },
    testnet: {
        name: 'Coston2 Testnet',
        rpc: 'https://coston2-api.flare.network/ext/C/rpc',
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
 * Get transaction count for wallet
 */
export async function getTransactionCount(address, network = 'mainnet') {
    try {
        const provider = getProvider(network)
        return await provider.getTransactionCount(address)
    } catch (error) {
        console.error('Failed to fetch transaction count:', error)
        return 0
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
