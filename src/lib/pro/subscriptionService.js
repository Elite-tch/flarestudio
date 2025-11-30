import { createClient } from '@supabase/supabase-js'
import { ethers } from 'ethers'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

// Treasury address to receive subscription payments (Coston2 Testnet)
// Currently set to a burn address for testing. Replace with your actual treasury wallet.
export const TREASURY_ADDRESS = "0xd99b1ea077A9440c908F8A7A6cC3f42E7aCCB485"

export const SUBSCRIPTION_PLANS = {
    free: {
        id: 'free',
        name: 'Free',
        price: 0,
        limit: 1 // Total items (Wallets + Projects)
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 100, // 100 C2FLR
        limit: 5 // Total items
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 500, // 500 C2FLR
        limit: 999 // Unlimited
    }
}

/**
 * Get user profile (tier and expiry)
 */
export async function getUserProfile(walletAddress) {
    try {
        if (!supabase) throw new Error("Supabase not configured")

        const normalizedAddress = walletAddress.toLowerCase()

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', normalizedAddress)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            throw error
        }

        if (!data) {
            // Create new free user if not exists
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{ wallet_address: normalizedAddress, tier: 'free' }])
                .select()
                .single()

            if (createError) throw createError
            return newUser
        }

        // Check expiry
        if (data.tier !== 'free' && data.subscription_expiry) {
            const expiry = new Date(data.subscription_expiry)
            if (expiry < new Date()) {
                // Expired, revert to free
                await updateUserTier(normalizedAddress, 'free', null)
                return { ...data, tier: 'free' }
            }
        }

        return data
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return { tier: 'free', wallet_address: walletAddress }
    }
}

/**
 * Update user tier after payment
 */
export async function updateUserTier(walletAddress, tier, expiryDate) {
    try {
        if (!supabase) throw new Error("Supabase not configured")

        const normalizedAddress = walletAddress.toLowerCase()

        const { error } = await supabase
            .from('users')
            .upsert({
                wallet_address: normalizedAddress,
                tier: tier,
                subscription_expiry: expiryDate
            })

        if (error) throw error
        return true
    } catch (error) {
        console.error("Error updating user tier:", error)
        throw error
    }
}

/**
 * Get user's portfolio items
 */
export async function getPortfolio(walletAddress) {
    try {
        if (!supabase) throw new Error("Supabase not configured")

        const normalizedAddress = walletAddress.toLowerCase()

        const { data, error } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_wallet', normalizedAddress)

        if (error) throw error
        return data || []
    } catch (error) {
        console.error("Error fetching portfolio:", error)
        return []
    }
}

/**
 * Add item to portfolio
 */
export async function addToPortfolio(walletAddress, item) {
    try {
        if (!supabase) throw new Error("Supabase not configured")

        const normalizedAddress = walletAddress.toLowerCase()

        // 1. Check limits (SHARED LIMIT for Wallets + Projects)
        const profile = await getUserProfile(normalizedAddress)
        const portfolio = await getPortfolio(normalizedAddress)

        const totalItems = portfolio.length
        const limit = SUBSCRIPTION_PLANS[profile.tier].limit

        if (totalItems >= limit) {
            throw new Error(`Limit reached (${limit} items). Upgrade to add more.`)
        }

        // 2. Add item
        const { data, error } = await supabase
            .from('portfolios')
            .insert([{
                user_wallet: normalizedAddress,
                type: item.type,
                address: item.address,
                name: item.name
            }])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error("Error adding to portfolio:", error)
        throw error
    }
}

/**
 * Remove item from portfolio
 */
export async function removeFromPortfolio(itemId, walletAddress) {
    try {
        if (!supabase) throw new Error("Supabase not configured")

        const normalizedAddress = walletAddress.toLowerCase()

        // 1. Check anti-abuse for Free tier
        const profile = await getUserProfile(normalizedAddress)

        if (profile.tier === 'free') {
            const { data: item, error: fetchError } = await supabase
                .from('portfolios')
                .select('added_at')
                .eq('id', itemId)
                .single()

            if (fetchError) throw fetchError

            const addedAt = new Date(item.added_at)
            const now = new Date()
            const hoursSinceAdded = (now - addedAt) / (1000 * 60 * 60)

            if (hoursSinceAdded < 24) {
                throw new Error("Free tier: Cannot remove items within 24 hours of adding them.")
            }
        }

        // 2. Remove item
        const { error } = await supabase
            .from('portfolios')
            .delete()
            .eq('id', itemId)

        if (error) throw error
        return true
    } catch (error) {
        console.error("Error removing from portfolio:", error)
        throw error
    }
}

/**
 * Process Subscription Payment
 */
export async function processSubscription(signer, planId) {
    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan || plan.price === 0) return true

    try {
        const tx = await signer.sendTransaction({
            to: TREASURY_ADDRESS,
            value: ethers.parseEther(plan.price.toString())
        })

        await tx.wait()

        // Calculate expiry (30 days from now)
        const expiry = new Date()
        expiry.setDate(expiry.getDate() + 30)

        const address = await signer.getAddress()
        await updateUserTier(address.toLowerCase(), planId, expiry.toISOString())

        return true
    } catch (error) {
        console.error("Payment failed:", error)
        throw error
    }
}
