"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Globe, Code2 } from "lucide-react"
//import { TierBadge } from "../shared/TierBadge"

/**
 * APIAccess Component
 * Flare Network RPC endpoints and documentation
 */
export function APIAccess() {
    const [copiedEndpoint, setCopiedEndpoint] = useState(null)

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopiedEndpoint(id)
        setTimeout(() => setCopiedEndpoint(null), 2000)
    }

    const endpoints = [
        {
            id: "flare-mainnet",
            name: "Flare Mainnet RPC",
            url: "https://flare-api.flare.network/ext/C/rpc",
            chainId: "14",
            description: "Primary RPC endpoint for Flare Mainnet. Use this for production applications interacting with the Flare Network. Supports all standard Ethereum JSON-RPC methods including eth_call, eth_sendTransaction, and eth_getBlockByNumber.",
            tier: "free",
        },
        {
            id: "flare-websocket",
            name: "Flare Mainnet WebSocket",
            url: "wss://flare-api.flare.network/ext/C/ws",
            chainId: "14",
            description: "WebSocket endpoint for real-time event subscriptions on Flare Mainnet. Ideal for listening to new blocks, pending transactions, and contract events. Supports eth_subscribe and eth_unsubscribe methods.",
            tier: "free",
        },
        {
            id: "coston2-testnet",
            name: "Coston2 Testnet RPC",
            url: "https://coston2-api.flare.network/ext/C/rpc",
            chainId: "114",
            description: "RPC endpoint for Coston2 testnet. Use this for development and testing before deploying to mainnet. Free test tokens available from the Flare faucet. Mirrors mainnet functionality without real value.",
            tier: "free",
        },
        {
            id: "coston2-websocket",
            name: "Coston2 Testnet WebSocket",
            url: "wss://coston2-api.flare.network/ext/C/ws",
            chainId: "114",
            description: "WebSocket endpoint for Coston2 testnet. Perfect for testing real-time event subscriptions and WebSocket integrations before moving to production on Flare Mainnet.",
            tier: "free",
        },
        {
            id: "songbird-mainnet",
            name: "Songbird Canary Network RPC",
            url: "https://songbird-api.flare.network/ext/C/rpc",
            chainId: "19",
            description: "RPC endpoint for Songbird, Flare's canary network. New features are tested here before deployment to Flare Mainnet. Useful for early testing of upcoming Flare features with real economic value.",
            tier: "free",
        },
        {
            id: "ftso-registry",
            name: "FTSO Registry Contract",
            url: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
            chainId: "14",
            description: "Flare Time Series Oracle (FTSO) Registry contract address on Flare Mainnet. Query this contract to get current price feeds for supported assets (BTC, ETH, XRP, etc.). Returns price data with decimals and timestamps.",
            tier: "free",
        },
        {
            id: "fdc-hub",
            name: "FDC Hub Contract",
            url: "0xc25C749dC27EFb1864Cb3dADA8845b7687eB2D44",
            chainId: "14",
            description: "Flare Data Connector (FDC) Hub contract on Flare Mainnet. Submit attestation requests for cross-chain data verification including payment proofs, balance changes, and confirmed blocks from external blockchains.",
            tier: "free",
        },
        {
            id: "state-connector",
            name: "State Connector Contract",
            url: "0x1000000000000000000000000000000000000001",
            chainId: "14",
            description: "State Connector contract for accessing verified external blockchain state on Flare. Provides decentralized oracle services for cross-chain data with cryptographic proofs and consensus-based validation.",
            tier: "free",
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Flare Network Endpoints</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Official RPC endpoints and smart contract addresses
                    </p>
                </div>
                {/*     <TierBadge tier="pro" /> */}
            </div>

            {/* Network Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Flare Mainnet</div>
                    <div className="text-xl font-bold text-[#e93b6c]">Chain ID: 14</div>
                    <div className="text-xs text-gray-500 mt-1">Production Network</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Coston2 Testnet</div>
                    <div className="text-xl font-bold text-[#e93b6c]">Chain ID: 114</div>
                    <div className="text-xs text-gray-500 mt-1">Test Network</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Songbird Canary</div>
                    <div className="text-xl font-bold text-[#e93b6c]">Chain ID: 19</div>
                    <div className="text-xs text-gray-500 mt-1">Canary Network</div>
                </div>
            </div>

            {/* Endpoints List */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5 text-[#e93b6c]" />
                    <h4 className="text-lg font-semibold text-gray-900">Available Endpoints</h4>
                </div>
                <div className="space-y-4">
                    {endpoints.map((endpoint) => (
                        <div
                            key={endpoint.id}
                            className="p-5 border border-gray-200 rounded-lg hover:border-[#e93b6c] transition-colors w-full"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex md:hidden justify-end itemes-end mb-3">
                                        <Button
                                            onClick={() => handleCopy(endpoint.url, endpoint.id)}
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5"
                                        >
                                            {copiedEndpoint === endpoint.id ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>

                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <h5 className="font-semibold text-gray-900">{endpoint.name}</h5>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                            Chain ID: {endpoint.chainId}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3 ">
                                        <code className="text-sm font-mono text-[#e93b6c] bg-pink-50 px-3 py-1.5 rounded flex-1 break-all">
                                            {endpoint.url}
                                        </code>
                                   <Button
                                            onClick={() => handleCopy(endpoint.url, endpoint.id)}
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5 hidden md:flex"
                                        >
                                            {copiedEndpoint === endpoint.id ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {endpoint.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Example Usage */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-5 h-5 text-[#e93b6c]" />
                    <h4 className="text-lg font-semibold text-gray-900">Example Usage</h4>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {`// Using ethers.js
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(
  'https://flare-api.flare.network/ext/C/rpc'
);

// Get latest block
const block = await provider.getBlockNumber();
console.log('Latest block:', block);

// Get FTSO price
const ftsoRegistry = new ethers.Contract(
  '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019',
  ftsoRegistryABI,
  provider
);

const price = await ftsoRegistry.getCurrentPrice('BTC');
console.log('BTC Price:', price);`}
                </pre>
            </div>

            {/* Documentation Link */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Official Documentation</h4>
                <p className="text-sm text-gray-600 mb-4">
                    For detailed API documentation, contract ABIs, and integration guides, visit the official Flare documentation.
                </p>
                <a
                    href="https://docs.flare.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#e93b6c] text-white rounded-lg hover:bg-[#d12a5a] transition-colors"
                >
                    <Globe className="w-4 h-4" />
                    Visit Flare Docs
                </a>
            </div>
        </div>
    )
}
