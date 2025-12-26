'use client'

import Link from "next/link"
import { ArrowRight, Code, Box, Layers, Shield } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                    Flare Web SDK <span className="text-[#e93b6c]">Documentation</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                    The ultimate toolkit for building decentralized applications on the Flare Network.
                    Access FTSO prices, verify attestations, and manage assets with a developer-friendly API.
                </p>
                <div className="flex gap-4 pt-4">
                    <Link
                        href="/docs/getting-started/installation"
                        className="inline-flex items-center gap-2 bg-[#e93b6c] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d12d5a] transition-colors"
                    >
                        Get Started <ArrowRight size={18} />
                    </Link>
                    <Link
                        href="/docs/modules/ftso"
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Explore Modules
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 gap-6">
                <Card
                    icon={<Code className="text-[#e93b6c]" />}
                    title="Developer Friendly"
                    description="Built with TypeScript for full type safety. Simple, intuitive APIs that abstract away blockchain complexity."
                />
                <Card
                    icon={<Box className="text-[#e93b6c]" />}
                    title="Modular Architecture"
                    description="Import only what you need. Modules for FTSO, FDC, Wallet, Staking, and more are completely decoupled."
                />
                <Card
                    icon={<Layers className="text-[#e93b6c]" />}
                    title="Full Flare Support"
                    description="Native support for all Flare protocols: FTSO price feeds, Data Connector attestations, and fAssets."
                />
                <Card
                    icon={<Shield className="text-[#e93b6c]" />}
                    title="Production Ready"
                    description="Robust error handling, automatic retries, and comprehensive testing for mission-critical apps."
                />
            </section>

            {/* Code Preview */}
            <section className="bg-gray-900 rounded-xl p-6 md:p-8 overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-gray-400 text-sm font-mono">example.ts</span>
                </div>
                <pre className="font-mono text-sm md:text-base text-gray-300 overflow-x-auto">
                    <code>{`import { FlareSDK } from '@flarestudio/flare-sdk';

// Initialize SDK
const sdk = new FlareSDK({ network: 'coston2' });

// 1. Get Real-time Prices
const price = await sdk.ftso.getPrice('BTC/USD');
console.log(\`BTC Price: \${price.price}\`);

// 2. Connect Wallet
await sdk.wallet.connect(window.ethereum);

// 3. Verify Payment (requires signer)
const tx = await sdk.fdc.verifyBitcoinPayment({
  txHash: '0x...',
  sourceAddress: 'bc1q...',
  destinationAddress: 'bc1q...',
  amount: 0.5
}, signer);`}</code>
                </pre>
            </section>
        </div>
    )
}

function Card({ icon, title, description }) {
    return (
        <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#fff1f3] rounded-lg flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    )
}
