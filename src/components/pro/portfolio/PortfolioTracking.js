"use client"

import { useState, useEffect } from "react"
import { TierBadge } from "../shared/TierBadge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Wallet, TrendingUp, Activity, Plus, Trash2, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "../shared/LoadingSpinner"
import {
    getWalletBalance,
    getTransactionCount,
    getFLRPrice,
    isValidAddress,
    getNetworkConfig
} from "@/lib/pro/portfolioService"

/**
 * PortfolioTracking Component
 * Multi-wallet dashboard with real blockchain data
 */
export function PortfolioTracking() {
    const [network, setNetwork] = useState('mainnet') // 'mainnet' or 'testnet'
    const [wallets, setWallets] = useState([])
    const [loading, setLoading] = useState(false)
    const [flrPrice, setFlrPrice] = useState(0)
    const [newWalletAddress, setNewWalletAddress] = useState('')
    const [newWalletName, setNewWalletName] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)

    // Projects state (Project Monitoring tab)
    const [projects, setProjects] = useState([])
    const [showAddProjectForm, setShowAddProjectForm] = useState(false)
    const [newProjectName, setNewProjectName] = useState('')
    const [newProjectAddress, setNewProjectAddress] = useState('')

    const networkConfig = getNetworkConfig(network)

    // Fetch FLR price
    useEffect(() => {
        const fetchPrice = async () => {
            const price = await getFLRPrice(network)
            setFlrPrice(price)
        }
        fetchPrice()
    }, [network])

    // Refresh wallet data when network changes
    useEffect(() => {
        if (wallets.length > 0) {
            refreshWallets()
        }
    }, [network])

    const refreshWallets = async () => {
        setLoading(true)
        const updatedWallets = await Promise.all(
            wallets.map(async (wallet) => {
                const balance = await getWalletBalance(wallet.address, network)
                const txCount = await getTransactionCount(wallet.address, network)
                const value = (parseFloat(balance) * flrPrice).toFixed(2)

                return {
                    ...wallet,
                    balance: `${parseFloat(balance).toFixed(4)} ${networkConfig.currency}`,
                    value: `$${value}`,
                    txCount
                }
            })
        )
        setWallets(updatedWallets)
        setLoading(false)
    }

    const handleAddWallet = async () => {
        if (!isValidAddress(newWalletAddress)) {
            alert('Invalid wallet address')
            return
        }

        if (wallets.length >= 5) {
            alert('Pro tier allows up to 5 wallets. Upgrade to Enterprise for unlimited.')
            return
        }

        setLoading(true)
        const balance = await getWalletBalance(newWalletAddress, network)
        const txCount = await getTransactionCount(newWalletAddress, network)
        const value = (parseFloat(balance) * flrPrice).toFixed(2)

        const newWallet = {
            address: newWalletAddress,
            name: newWalletName || `Wallet ${wallets.length + 1}`,
            balance: `${parseFloat(balance).toFixed(4)} ${networkConfig.currency}`,
            value: `$${value}`,
            txCount
        }

        setWallets([...wallets, newWallet])
        setNewWalletAddress('')
        setNewWalletName('')
        setShowAddForm(false)
        setLoading(false)
    }

    const handleRemoveWallet = (index) => {
        setWallets(wallets.filter((_, i) => i !== index))
    }

    const handleAddProject = async () => {
        if (!newProjectName.trim()) {
            alert('Please provide a project name')
            return
        }

        // pro tier supports up to 3 projects, show warning when reached
        if (projects.length >= 3) {
            alert('Pro tier allows up to 3 projects. Upgrade to Enterprise for unlimited.')
            return
        }

        setLoading(true)

        const project = {
            name: newProjectName.trim(),
            address: newProjectAddress.trim() || 'N/A'
        }

        setProjects([...projects, project])
        setNewProjectName('')
        setNewProjectAddress('')
        setShowAddProjectForm(false)
        setLoading(false)
    }

    const handleRemoveProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index))
    }

    const totalBalance = wallets.reduce((sum, wallet) => {
        const balance = parseFloat(wallet.balance.split(' ')[0])
        return sum + balance
    }, 0)

    const totalValue = wallets.reduce((sum, wallet) => {
        const value = parseFloat(wallet.value.replace('$', ''))
        return sum + value
    }, 0)

    const totalTxs = wallets.reduce((sum, wallet) => sum + wallet.txCount, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Portfolio Tracking</h2>
                    <p className="text-gray-600 mt-2">
                        Multi-wallet dashboard with real-time blockchain data
                    </p>
                </div>
                <TierBadge tier="pro" size="lg" />
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
                    {/* Wallet Limits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Free Tier</div>
                            <div className="text-2xl font-bold text-gray-900">1 wallet</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Pro Tier</div>
                            <div className="text-2xl font-bold text-[#e93b6c]">5 wallets</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Enterprise Tier</div>
                            <div className="text-2xl font-bold text-[#e93b6c]">Unlimited</div>
                        </div>
                    </div>

                    {/* Tracked Wallets */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">Tracked Wallets ({wallets.length}/5)</h4>
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
                                            <Button
                                                onClick={() => handleRemoveWallet(index)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Free Tier</div>
                            <div className="text-2xl font-bold text-gray-900">0 projects</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Pro Tier</div>
                            <div className="text-2xl font-bold text-[#e93b6c]">3 projects</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Enterprise Tier</div>
                            <div className="text-2xl font-bold text-[#e93b6c]">Unlimited</div>
                        </div>
                    </div>

                    {/* Project Monitoring */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">Monitored Projects ({projects.length}/3)</h4>
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
                                            <Button
                                                onClick={() => handleRemoveProject(index)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
