"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { TierBadge } from "../shared/TierBadge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Wallet, TrendingUp, Activity, Plus, Trash2, Network, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "../shared/LoadingSpinner"
import { SubscriptionModal } from "./SubscriptionModal"
import { ethers } from "ethers"
import { toast } from "react-hot-toast"
import {
    getWalletBalance,
    getTransactionCount,
    getFLRPrice,
    isValidAddress,
    getNetworkConfig
} from "@/lib/pro/portfolioService"
import {
    getUserProfile,
    getPortfolio,
    addToPortfolio,
    removeFromPortfolio,
    SUBSCRIPTION_PLANS
} from "@/lib/pro/subscriptionService"

/**
 * PortfolioTracking Component
 * Multi-wallet dashboard with real blockchain data and subscription-based limits
 */
export function PortfolioTracking() {
    const [network, setNetwork] = useState('mainnet')
    const [connectedAddress, setConnectedAddress] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [wallets, setWallets] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [flrPrice, setFlrPrice] = useState(0)
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

    // Form states
    const [newWalletAddress, setNewWalletAddress] = useState('')
    const [newWalletName, setNewWalletName] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)

    const [newProjectName, setNewProjectName] = useState('')
    const [newProjectAddress, setNewProjectAddress] = useState('')
    const [showAddProjectForm, setShowAddProjectForm] = useState(false)

    const networkConfig = getNetworkConfig(network)

    // Check if wallet is connected
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum)
                try {
                    const accounts = await provider.listAccounts()
                    if (accounts.length > 0) {
                        setConnectedAddress(accounts[0].address)
                    }
                } catch (e) {
                    console.error("Error checking wallet connection", e)
                }
            }
        }
        checkConnection()
    }, [])

    // Refs for accessing latest state in effects without triggering re-runs
    const walletsRef = useRef(wallets)
    const projectsRef = useRef(projects)

    useEffect(() => { walletsRef.current = wallets }, [wallets])
    useEffect(() => { projectsRef.current = projects }, [projects])

    const enrichWallets = useCallback(async (rawWallets) => {
        const enriched = await Promise.all(rawWallets.map(async (w) => {
            const balance = await getWalletBalance(w.address, network)
            const txCount = await getTransactionCount(w.address, network)
            const value = (parseFloat(balance) * flrPrice).toFixed(2)
            return {
                ...w,
                balance: `${parseFloat(balance).toFixed(4)} ${networkConfig.currency}`,
                value: `$${value}`,
                txCount
            }
        }))
        setWallets(enriched)
    }, [network, flrPrice, networkConfig.currency])

    const enrichProjects = useCallback(async (rawProjects) => {
        const enriched = await Promise.all(rawProjects.map(async (p) => {
            let txCount = 0
            let status = 'Pending'
            if (p.address && isValidAddress(p.address)) {
                txCount = await getTransactionCount(p.address, network)
                status = 'Active'
            }
            return { ...p, txCount, status }
        }))
        setProjects(enriched)
    }, [network])

    const fetchUserData = useCallback(async () => {
        setLoading(true)
        try {
            const profile = await getUserProfile(connectedAddress)
            setUserProfile(profile)

            const portfolio = await getPortfolio(connectedAddress)

            // Separate wallets and projects
            const rawWallets = portfolio.filter(item => item.type === 'wallet')
            const rawProjects = portfolio.filter(item => item.type === 'project')

            // Enrich with blockchain data
            await enrichWallets(rawWallets)
            await enrichProjects(rawProjects)

        } catch (error) {
            console.error("Error fetching user data:", error)
        } finally {
            setLoading(false)
        }
    }, [connectedAddress, enrichWallets, enrichProjects])

    // Fetch User Profile & Portfolio
    useEffect(() => {
        if (connectedAddress) {
            fetchUserData()
        }
    }, [connectedAddress, fetchUserData])

    // Fetch FLR price
    useEffect(() => {
        const fetchPrice = async () => {
            const price = await getFLRPrice(network)
            setFlrPrice(price)
        }
        fetchPrice()
    }, [network])

    // Refresh data when network changes
    useEffect(() => {
        if (walletsRef.current.length > 0) enrichWallets(walletsRef.current)
        if (projectsRef.current.length > 0) enrichProjects(projectsRef.current)
    }, [network, enrichWallets, enrichProjects])

    const handleConnectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum)
                const accounts = await provider.send("eth_requestAccounts", [])
                setConnectedAddress(accounts[0])
            } catch (error) {
                console.error("Error connecting wallet:", error)
            }
        } else {
            toast.error("Please install Metamask to use this feature.")
        }
    }

    const confirmDelete = (message, onConfirm) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[250px]">
                <p className="font-medium text-gray-900">{message}</p>
                <div className="flex gap-2 justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.dismiss(t.id)}
                        className="h-8 px-3"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            toast.dismiss(t.id)
                            onConfirm()
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white h-8 px-3"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' })
    }

    const handleAddWallet = async () => {
        if (!isValidAddress(newWalletAddress)) {
            toast.error('Invalid wallet address')
            return
        }

        try {
            setLoading(true)
            await addToPortfolio(connectedAddress, {
                type: 'wallet',
                address: newWalletAddress,
                name: newWalletName || `Wallet ${wallets.length + 1}`
            })

            await fetchUserData() // Refresh all data
            setNewWalletAddress('')
            setNewWalletName('')
            setShowAddForm(false)
            toast.success('Wallet added successfully')
        } catch (error) {
            console.error("Error adding wallet:", error)
            if (error.message.includes("Upgrade to")) {
                toast.error(error.message, { duration: 4000 })
                setShowSubscriptionModal(true)
            } else {
                toast.error(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveWallet = (id) => {
        confirmDelete("Remove this wallet from tracking?", async () => {
            try {
                setLoading(true)
                await removeFromPortfolio(id, connectedAddress)
                await fetchUserData()
                toast.success('Wallet removed')
            } catch (error) {
                console.error("Error removing wallet:", error)
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        })
    }

    const handleAddProject = async () => {
        if (!newProjectName.trim()) {
            toast.error('Please provide a project name')
            return
        }

        try {
            setLoading(true)
            await addToPortfolio(connectedAddress, {
                type: 'project',
                address: newProjectAddress.trim() || 'N/A',
                name: newProjectName.trim()
            })

            await fetchUserData()
            setNewProjectName('')
            setNewProjectAddress('')
            setShowAddProjectForm(false)
            toast.success('Project added successfully')
        } catch (error) {
            console.error("Error adding project:", error)
            if (error.message.includes("Upgrade to")) {
                toast.error(error.message, { duration: 4000 })
                setShowSubscriptionModal(true)
            } else {
                toast.error(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveProject = (id) => {
        confirmDelete("Stop monitoring this project?", async () => {
            try {
                setLoading(true)
                await removeFromPortfolio(id, connectedAddress)
                await fetchUserData()
                toast.success('Project removed')
            } catch (error) {
                console.error("Error removing project:", error)
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        })
    }

    const totalBalance = wallets.reduce((sum, wallet) => {
        const balance = parseFloat(wallet.balance ? wallet.balance.split(' ')[0] : '0')
        return sum + (isNaN(balance) ? 0 : balance)
    }, 0)

    const totalValue = wallets.reduce((sum, wallet) => {
        const value = parseFloat(wallet.value ? wallet.value.replace('$', '') : '0')
        return sum + (isNaN(value) ? 0 : value)
    }, 0)

    const totalTxs = wallets.reduce((sum, wallet) => sum + (wallet.txCount === '100+' ? 100 : (wallet.txCount || 0)), 0)

    if (!connectedAddress) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Connect Wallet to Track Portfolio</h2>
                    <p className="text-gray-600 mt-2 max-w-md mx-auto">
                        Connect your wallet to access the dashboard. Your wallet address is your identity.
                    </p>
                </div>
                <Button
                    onClick={handleConnectWallet}
                    className="bg-[#e93b6c] hover:bg-[#d12d5a] text-white px-8 py-6 text-lg"
                >
                    Connect Wallet
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                currentTier={userProfile?.tier || 'free'}
                onSuccess={() => {
                    toast.success("Subscription successful! Welcome to " + userProfile?.tier)
                    fetchUserData()
                }}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Portfolio Tracking</h2>
                    <p className="text-gray-600 mt-2">
                        Connected: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{connectedAddress}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowSubscriptionModal(true)}
                        className="gap-2 border-[#e93b6c] text-[#e93b6c] hover:bg-pink-50"
                    >
                        <Zap className="w-4 h-4" />
                        {userProfile?.tier === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                    </Button>
                    <TierBadge tier={userProfile?.tier || 'free'} size="lg" />
                </div>
            </div>

            {/* Network Switcher */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-[#e93b6c]" />
                        <span className="font-semibold text-gray-900">Network:</span>
                        <span className="text-gray-600">{networkConfig.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            Chain ID: {networkConfig.chainId}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setNetwork('mainnet')}
                            variant={network === 'mainnet' ? 'default' : 'outline'}
                            className={network === 'mainnet' ? 'bg-[#e93b6c] hover:bg-[#d12d5a]' : ''}
                        >
                            Mainnet
                        </Button>
                        <Button
                            onClick={() => setNetwork('testnet')}
                            variant={network === 'testnet' ? 'default' : 'outline'}
                            className={network === 'testnet' ? 'bg-[#e93b6c] hover:bg-[#d12d5a]' : ''}
                        >
                            Testnet
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="wallets" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                    <TabsTrigger value="wallets">Multi-Wallet Dashboard</TabsTrigger>
                    <TabsTrigger value="projects">Project Monitoring</TabsTrigger>
                </TabsList>

                <TabsContent value="wallets" className="mt-6 space-y-6">
                    {/* Shared Limits Display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`bg-white rounded-lg p-4 border ${userProfile?.tier === 'free' ? 'border-[#e93b6c] ring-1 ring-[#e93b6c]' : 'border-gray-200'}`}>
                            <div className="text-sm text-gray-600 mb-1">Free Tier</div>
                            <div className="text-xl font-bold text-gray-900">1 Wallet</div>
                        </div>
                        <div className={`bg-white rounded-lg p-4 border ${userProfile?.tier === 'pro' ? 'border-[#e93b6c] ring-1 ring-[#e93b6c]' : 'border-gray-200'}`}>
                            <div className="text-sm text-gray-600 mb-1">Pro Tier</div>
                            <div className="text-xl font-bold text-[#e93b6c]">5 Wallets</div>
                        </div>
                        <div className={`bg-white rounded-lg p-4 border ${userProfile?.tier === 'enterprise' ? 'border-[#e93b6c] ring-1 ring-[#e93b6c]' : 'border-gray-200'}`}>
                            <div className="text-sm text-gray-600 mb-1">Enterprise Tier</div>
                            <div className="text-xl font-bold text-[#e93b6c]">Unlimited</div>
                        </div>
                    </div>

                    {/* Usage Progress */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                        <div>
                            <span className="font-semibold text-gray-900">Current Usage: </span>
                            <span className="text-[#e93b6c] font-bold">
                                {wallets.length + projects.length} / {SUBSCRIPTION_PLANS[userProfile?.tier || 'free'].limit} Items
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                                ({wallets.length} Wallets + {projects.length} Projects)
                            </span>
                        </div>
                        {userProfile?.tier === 'free' && (
                            <Button
                                variant="link"
                                onClick={() => setShowSubscriptionModal(true)}
                                className="text-[#e93b6c] h-auto p-0"
                            >
                                Upgrade to increase limit &rarr;
                            </Button>
                        )}
                    </div>

                    {/* Tracked Wallets */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">
                                Tracked Wallets
                            </h4>
                            <Button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="bg-[#e93b6c] hover:bg-[#d12d5a] text-white gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Wallet
                            </Button>
                        </div>

                        {/* Add Wallet Form */}
                        {showAddForm && (
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Wallet Address
                                        </label>
                                        <input
                                            type="text"
                                            value={newWalletAddress}
                                            onChange={(e) => setNewWalletAddress(e.target.value)}
                                            placeholder="0x..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Wallet Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={newWalletName}
                                            onChange={(e) => setNewWalletName(e.target.value)}
                                            placeholder="My Wallet"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleAddWallet}
                                            disabled={loading}
                                            className="bg-[#e93b6c] hover:bg-[#d12d5a] text-white"
                                        >
                                            {loading ? 'Adding...' : 'Add Wallet'}
                                        </Button>
                                        <Button
                                            onClick={() => setShowAddForm(false)}
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && wallets.length === 0 ? (
                            <LoadingSpinner message="Loading wallets..." />
                        ) : wallets.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p>No wallets tracked yet</p>
                                <p className="text-sm mt-1">Add a wallet address to start tracking</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {wallets.map((wallet, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#e93b6c] to-[#d12d5a] rounded-full flex items-center justify-center">
                                                <Wallet className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">{wallet.name}</div>
                                                <div className="text-sm font-mono text-gray-500">{wallet.address}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-900">{wallet.balance}</div>
                                                <div className="text-sm text-gray-500">{wallet.value}</div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Portfolio Summary */}
                    {wallets.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                    <Wallet className="w-4 h-4" />
                                    Total Balance
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {totalBalance.toFixed(4)} {networkConfig.currency}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">${totalValue.toFixed(2)} USD</div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                    <Activity className="w-4 h-4" />
                                    Total Transactions
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{totalTxs}</div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                    <TrendingUp className="w-4 h-4" />
                                    {networkConfig.currency} Price
                                </div>
                                <div className="text-2xl font-bold text-gray-900">${flrPrice.toFixed(4)}</div>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="projects" className="mt-6 space-y-6">
                    {/* Project Limits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`bg-white rounded-lg p-4 border ${userProfile?.tier === 'free' ? 'border-[#e93b6c] ring-1 ring-[#e93b6c]' : 'border-gray-200'}`}>
                            <div className="text-sm text-gray-600 mb-1">Free Tier</div>
                            <div className="text-xl font-bold text-gray-900">1 Project</div>
                        </div>
                        <div className={`bg-white rounded-lg p-4 border ${userProfile?.tier === 'pro' ? 'border-[#e93b6c] ring-1 ring-[#e93b6c]' : 'border-gray-200'}`}>
                            <div className="text-sm text-gray-600 mb-1">Pro Tier</div>
                            <div className="text-xl font-bold text-[#e93b6c]">5 Projects</div>
                        </div>
                        <div className={`bg-white rounded-lg p-4 border ${userProfile?.tier === 'enterprise' ? 'border-[#e93b6c] ring-1 ring-[#e93b6c]' : 'border-gray-200'}`}>
                            <div className="text-sm text-gray-600 mb-1">Enterprise Tier</div>
                            <div className="text-xl font-bold text-[#e93b6c]">Unlimited</div>
                        </div>
                    </div>

                    {/* Project Monitoring */}
                    {/* Usage Progress */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                        <div>
                            <span className="font-semibold text-gray-900">Current Usage: </span>
                            <span className="text-[#e93b6c] font-bold">
                                {wallets.length + projects.length} / {SUBSCRIPTION_PLANS[userProfile?.tier || 'free'].limit} Items
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                                ({wallets.length} Wallets + {projects.length} Projects)
                            </span>
                        </div>
                        {userProfile?.tier === 'free' && (
                            <Button
                                variant="link"
                                onClick={() => setShowSubscriptionModal(true)}
                                className="text-[#e93b6c] h-auto p-0"
                            >
                                Upgrade to increase limit &rarr;
                            </Button>
                        )}
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">
                                Monitored Projects
                            </h4>
                            <Button
                                onClick={() => setShowAddProjectForm(!showAddProjectForm)}
                                className="bg-[#e93b6c] hover:bg-[#d12d5a] text-white gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Project
                            </Button>
                        </div>
                        {/* Add Project Form */}
                        {showAddProjectForm && (
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                        <input
                                            type="text"
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            placeholder="My Project"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contract / Address (Optional)</label>
                                        <input
                                            type="text"
                                            value={newProjectAddress}
                                            onChange={(e) => setNewProjectAddress(e.target.value)}
                                            placeholder="0x... or Project ID"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleAddProject}
                                            disabled={loading}
                                            className="bg-[#e93b6c] hover:bg-[#d12d5a] text-white"
                                        >
                                            {loading ? 'Adding...' : 'Add Project'}
                                        </Button>
                                        <Button
                                            onClick={() => setShowAddProjectForm(false)}
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && projects.length === 0 ? (
                            <LoadingSpinner message="Loading projects..." />
                        ) : projects.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p>No projects monitored yet</p>
                                <p className="text-sm mt-1">Add your deployed projects to start monitoring</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {projects.map((project, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#e93b6c] to-[#d12d5a] rounded-full flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">{project.name}</div>
                                                <div className="text-sm font-mono text-gray-500">{project.address}</div>
                                            </div>

                                            {/* Project Stats */}
                                            <div className="text-right mr-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {project.txCount ? `${project.txCount} Txs` : '0 Txs'}
                                                </div>
                                                <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${project.status === 'Active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {project.status || 'Pending'}
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
