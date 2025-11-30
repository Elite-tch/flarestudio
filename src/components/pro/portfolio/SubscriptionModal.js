"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, ShieldCheck } from "lucide-react"
import { SUBSCRIPTION_PLANS, processSubscription } from "@/lib/pro/subscriptionService"
import { ethers } from "ethers"

export function SubscriptionModal({ isOpen, onClose, currentTier, onSuccess }) {
    const [loading, setLoading] = useState(null) // Changed from false to null
    const [selectedPlan, setSelectedPlan] = useState(null)

    const handleSubscribe = async (planId) => {
        setLoading(planId) // Set loading to the specific plan ID
        try {
            // Check if wallet is connected
            if (!window.ethereum) {
                alert("Please install a wallet like Metamask to subscribe.")
                return
            }

            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()

            // Switch to Coston2 Testnet if not connected
            const network = await provider.getNetwork()
            if (network.chainId !== 114n) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x72' }], // 114 in hex
                    })
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0x72',
                                    chainName: 'Coston2 Testnet',
                                    nativeCurrency: {
                                        name: 'Coston2 Flare',
                                        symbol: 'C2FLR',
                                        decimals: 18,
                                    },
                                    rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc'],
                                    blockExplorerUrls: ['https://coston2-explorer.flare.network/'],
                                },
                            ],
                        })
                    } else {
                        throw switchError
                    }
                }
            }

            await processSubscription(signer, planId)

            onSuccess(planId)
            onClose()
        } catch (error) {
            console.error("Subscription failed:", error)
            alert("Subscription failed: " + (error.reason || error.message))
        } finally {
            setLoading(null) // Reset loading
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] bg-white text-gray-900">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Upgrade Your Portfolio</DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        Choose a plan to unlock more wallets and advanced features.
                        <br />
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2 inline-block">
                            Testnet Mode: Payments in C2FLR
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Free Plan */}
                    <div className={`border rounded-xl p-6 relative ${currentTier === 'free' ? 'border-[#e93b6c] bg-pink-50' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-bold">Free</h3>
                        <div className="text-3xl font-bold mt-2">0 <span className="text-sm font-normal text-gray-500">C2FLR/mo</span></div>
                        <ul className="mt-6 space-y-3 text-sm">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1 Wallet</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1 Monitored Project</li>
                            <li className="flex items-center gap-2 text-gray-500"><ShieldCheck className="w-4 h-4" /> 24h Removal Lock</li>
                        </ul>
                        <Button className="w-full mt-6" variant="outline" disabled>
                            {currentTier === 'free' ? 'Current Plan' : 'Downgrade'}
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className={`border rounded-xl p-6 relative ${currentTier === 'pro' ? 'border-[#e93b6c] bg-pink-50' : 'border-gray-200 shadow-lg'}`}>
                        {currentTier !== 'pro' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e93b6c] text-white px-3 py-1 rounded-full text-xs font-bold">POPULAR</div>}
                        <h3 className="text-lg font-bold">Pro</h3>
                        <div className="text-3xl font-bold mt-2">20 <span className="text-sm font-normal text-gray-500">C2FLR/mo</span></div>
                        <ul className="mt-6 space-y-3 text-sm">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 5 Wallets</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 5 Monitored Projects</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Instant Removal</li>
                        </ul>
                        <Button
                            className={`w-full mt-6 ${currentTier === 'pro' ? '' : 'bg-[#e93b6c] hover:bg-[#d12d5a] text-white'}`}
                            variant={currentTier === 'pro' ? 'outline' : 'default'}
                            disabled={currentTier === 'pro' || loading === 'pro'}
                            onClick={() => handleSubscribe('pro')}
                        >
                            {loading === 'pro' ? <Loader2 className="w-4 h-4 animate-spin" /> : currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                        </Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className={`border rounded-xl p-6 relative ${currentTier === 'enterprise' ? 'border-[#e93b6c] bg-pink-50' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-bold">Enterprise</h3>
                        <div className="text-3xl font-bold mt-2">50 <span className="text-sm font-normal text-gray-500">C2FLR/mo</span></div>
                        <ul className="mt-6 space-y-3 text-sm">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited Wallets</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited Projects</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority Support</li>
                        </ul>
                        <Button
                            className="w-full mt-6"
                            variant={currentTier === 'enterprise' ? 'outline' : 'default'}
                            disabled={currentTier === 'enterprise' || loading === 'enterprise'}
                            onClick={() => handleSubscribe('enterprise')}
                        >
                            {loading === 'enterprise' ? <Loader2 className="w-4 h-4 animate-spin" /> : currentTier === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
