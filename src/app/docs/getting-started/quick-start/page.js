'use client'
import Link from "next/link"

export default function QuickStartPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Learn how to initialize the SDK and make your first request to the Flare Network.
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">1. Initialize the SDK</h2>
                <p className="text-gray-600">
                    Import `FlareSDK` and create a new instance. You can specify the network (&apos;flare&apos;, &apos;coston2&apos;, &apos;songbird&apos;, &apos;coston&apos;).
                </p>

                <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                    <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                        {`import { FlareSDK } from '@flarestudio/flare-sdk';

// Initialize for Flare Mainnet
const sdk = new FlareSDK({ 
  network: 'flare',
  debug: true // Optional: Enable debug logs
});`}
                    </pre>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">2. Fetch Data</h2>
                <p className="text-gray-600">
                    Use the `ftso` module to get real-time price data.
                </p>

                <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                    <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                        {`// Get a single price
const price = await sdk.ftso.getPrice('BTC/USD');
console.log(price.price);

// Get multiple prices (efficient)
const prices = await sdk.ftso.getPrices(['BTC/USD', 'ETH/USD', 'FLR/USD']);
console.log(prices);`}
                    </pre>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">3. Connect Wallet</h2>
                <p className="text-gray-600">
                    Use the `wallet` module to interact with the user&apos;s wallet (e.g., MetaMask).
                </p>

                <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                    <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                        {`// Connect to browser wallet (window.ethereum)
const address = await sdk.wallet.connect(window.ethereum);
console.log('Connected:', address);

// Get balance
const balance = await sdk.wallet.getBalance();
console.log('Balance:', balance.flr);`}
                    </pre>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">4. Listen for Attestations</h2>
                <p className="text-gray-600">
                    Subscribe to FDC events to see when cross-chain data is verified.
                </p>

                <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                    <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                        {`sdk.fdc.subscribe((event) => {
  console.log('New Attestation Request:', event.id);
  console.log('Data:', event.data);
});`}
                    </pre>
                </div>
            </div>

            <div className="bg-[#fff1f3] border border-[#ffe4e8] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#e93b6c] mb-2">Next Steps</h3>
                <p className="text-gray-700 mb-4">
                    Explore the specific modules to learn more about what you can build.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link href="/docs/modules/ftso" className="text-sm bg-white px-3 py-1.5 rounded border hover:border-[#e93b6c] transition-colors">
                        FTSO Module
                    </Link>
                    <Link href="/docs/modules/fdc" className="text-sm bg-white px-3 py-1.5 rounded border hover:border-[#e93b6c] transition-colors">
                        FDC Module
                    </Link>
                    <Link href="/docs/modules/fassets" className="text-sm bg-white px-3 py-1.5 rounded border hover:border-[#e93b6c] transition-colors">
                        fAssets Module
                    </Link>
                </div>
            </div>
        </div>
    )
}
