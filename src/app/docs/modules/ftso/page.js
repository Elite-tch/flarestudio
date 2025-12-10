'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function CodeBlock({ code, language = 'javascript' }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <button
                onClick={copyToClipboard}
                className="absolute right-3 top-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Copy code"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                )}
            </button>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-gray-300 font-mono text-sm">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

export default function FTSOPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">FTSO Module</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Access real-time price feeds from the Flare Time Series Oracle (FTSO). Get accurate, decentralized price data for crypto assets directly from the Flare blockchain.
                </p>
            </div>

            {/* Quick Start */}
            <div className="bg-pink-50 border-l-4 border-[#e93b6c] p-6 rounded-r-lg">
                <h3 className="text-lg font-bold text-[#e93b6c] mb-2">Quick Start</h3>
                <p className="text-gray-700 mb-4">
                    The FTSO module is the easiest to use - it works immediately after SDK initialization with no additional setup required.
                </p>
                <CodeBlock code={QUICK_START_CODE} />
            </div>

            {/* Step-by-Step Guide */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Step-by-Step Guide</h2>

                {/* Step 1 */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 1: Initialize the SDK</h3>
                    <p className="text-gray-600 mb-3">
                        Choose your network and optionally enable debug mode:
                    </p>
                    <CodeBlock code={STEP_1_CODE} />
                </div>

                {/* Step 2 */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 2: Get a Single Price</h3>
                    <p className="text-gray-600 mb-3">
                        Fetch the current price for any supported asset. Use the symbol name only (e.g., &apos;BTC&apos;, not &apos;BTC/USD&apos;).
                    </p>
                    <CodeBlock code={STEP_2_CODE} />
                </div>

                {/* Step 3 */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 3: Get Multiple Prices</h3>
                    <p className="text-gray-600 mb-3">
                        Fetch multiple prices at once for better performance. All requests are made concurrently.
                    </p>
                    <CodeBlock code={STEP_3_CODE} />
                </div>

                {/* Step 4 */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 4: Subscribe to Live Updates</h3>
                    <p className="text-gray-600 mb-3">
                        Get real-time price updates at custom intervals. Perfect for dashboards and live displays.
                    </p>
                    <CodeBlock code={STEP_4_CODE} />
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> FTSO updates on-chain every ~90 seconds. Setting intervals shorter than 90 seconds will poll more frequently, but may return the same price until the next on-chain update.
                        </p>
                    </div>
                </div>
            </div>

            {/* React/Next.js Example */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">React/Next.js Example</h2>
                <p className="text-gray-600">
                    Here&apos;s how to use subscriptions in a React component:
                </p>
                <CodeBlock code={REACT_EXAMPLE_CODE} />
            </div>

            {/* Available Symbols */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Available Price Symbols</h2>
                <p className="text-gray-600">
                    Get a list of all supported symbols dynamically:
                </p>
                <CodeBlock code={SYMBOLS_CODE} />
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        <strong>Common symbols:</strong> BTC, ETH, XRP, FLR, SGB, DOGE, LTC, ADA, ALGO, XLM, DOT, AVAX, BNB, MATIC, SOL, ARB, FIL, and more.
                    </p>
                </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Advanced Options</h2>

                <h3 className="text-lg font-semibold text-gray-800">Caching</h3>
                <p className="text-gray-600 mb-3">
                    Prices are cached for 60 seconds by default to reduce blockchain calls. You can customize this:
                </p>
                <CodeBlock code={CACHING_CODE} />

                <h3 className="text-lg font-semibold text-gray-800 mt-6">User-Defined Refresh Intervals</h3>
                <p className="text-gray-600 mb-3">
                    Let users choose their own refresh rate:
                </p>
                <CodeBlock code={INTERVALS_CODE} />
            </div>

            {/* Complete Example */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Complete Example</h2>
                <p className="text-gray-600">
                    Here&apos;s a full example showing how to build a simple price tracker:
                </p>
                <CodeBlock code={COMPLETE_EXAMPLE_CODE} />
            </div>

            {/* API Reference */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">API Reference</h2>

                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameters</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getPrice(symbol, options?)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">symbol: string</code><br />
                                    <code className="text-xs">options?: {`{cache?, ttl?}`}</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;FTSOPrice&gt;</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getPrices(symbols, options?)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">symbols: string[]</code><br />
                                    <code className="text-xs">options?: {`{cache?, ttl?}`}</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;FTSOPrice[]&gt;</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">subscribe(symbol, callback, interval?)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">symbol: string</code><br />
                                    <code className="text-xs">callback: (price) =&gt; void</code><br />
                                    <code className="text-xs">interval?: number (ms, default: 5000)</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">UnsubscribeFunction</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getSupportedSymbols()</td>
                                <td className="px-6 py-4 text-sm text-gray-600">-</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;string[]&gt;</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">clearCache()</td>
                                <td className="px-6 py-4 text-sm text-gray-600">-</td>
                                <td className="px-6 py-4 text-sm text-gray-600">void</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Configuration Options */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">SDK Configuration Options</h2>
                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm">network</td>
                                <td className="px-6 py-4 text-sm text-gray-600">string</td>
                                <td className="px-6 py-4 text-sm text-gray-600">&apos;flare&apos;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Network to connect to: &apos;flare&apos;, &apos;coston2&apos;, &apos;songbird&apos;, &apos;coston&apos;</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm">debug</td>
                                <td className="px-6 py-4 text-sm text-gray-600">boolean</td>
                                <td className="px-6 py-4 text-sm text-gray-600">false</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Enable detailed console logging</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm">cacheTTL</td>
                                <td className="px-6 py-4 text-sm text-gray-600">number</td>
                                <td className="px-6 py-4 text-sm text-gray-600">60</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Cache duration in seconds</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm">cacheEnabled</td>
                                <td className="px-6 py-4 text-sm text-gray-600">boolean</td>
                                <td className="px-6 py-4 text-sm text-gray-600">true</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Enable/disable price caching</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Error Handling */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Error Handling</h2>
                <p className="text-gray-600 mb-3">
                    Always wrap FTSO calls in try-catch blocks:
                </p>
                <CodeBlock code={ERROR_HANDLING_CODE} />
            </div>

            {/* Best Practices */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Best Practices</h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Use symbols without pairs:</strong>
                            <p className="text-gray-600 text-sm">Use &apos;BTC&apos; instead of &apos;BTC/USD&apos; - the SDK handles this automatically</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Set appropriate intervals:</strong>
                            <p className="text-gray-600 text-sm">FTSO updates every ~90 seconds, so intervals ≥90s ensure fresh data</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Clean up subscriptions:</strong>
                            <p className="text-gray-600 text-sm">Always call the unsubscribe function when done to prevent memory leaks</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Use caching wisely:</strong>
                            <p className="text-gray-600 text-sm">Enable caching for frequently accessed prices to reduce blockchain calls</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Enable debug mode during development:</strong>
                            <p className="text-gray-600 text-sm">Use <code className="bg-gray-100 px-1 rounded text-xs">debug: true</code> to see detailed logs and troubleshoot issues</p>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

const QUICK_START_CODE = `import { FlareSDK } from '@flarestudio/flare-sdk';

// 1. Initialize SDK
const sdk = new FlareSDK({ network: 'flare' });

// 2. Get price - that's it!
const price = await sdk.ftso.getPrice('BTC');
console.log(\`BTC Price: $\${price.price}\`);`;

const STEP_1_CODE = `import { FlareSDK } from '@flarestudio/flare-sdk';

// Basic initialization
const sdk = new FlareSDK({ 
  network: 'flare'  // 'flare', 'coston2', 'songbird', or 'coston'
});

// With debug mode (shows detailed logs)
const sdkDebug = new FlareSDK({ 
  network: 'flare',
  debug: true  // Enable console logging
});

// With custom cache settings
const sdkCustom = new FlareSDK({ 
  network: 'flare',
  cacheTTL: 90,      // Cache prices for 90 seconds (default: 60)
  cacheEnabled: true // Enable/disable caching (default: true)
});`;

const STEP_2_CODE = `const price = await sdk.ftso.getPrice('BTC');

console.log(price);
// Output:
// {
//   symbol: 'BTC',
//   price: 45000.50,        // Already formatted
//   decimals: 5,            // Decimal places used
//   timestamp: Date,        // When price was updated
//   rawPrice: '4500050000'  // Raw blockchain value
// }

// Access specific values
console.log(\`BTC: $\${price.price.toFixed(2)}\`);
console.log(\`Updated: \${price.timestamp.toLocaleString()}\`);`;

const STEP_3_CODE = `const symbols = ['BTC', 'ETH', 'XRP'];
const prices = await sdk.ftso.getPrices(symbols);

prices.forEach(p => {
  console.log(\`\${p.symbol}: $\${p.price.toFixed(2)}\`);
});

// Output:
// BTC: $45000.50
// ETH: $2500.75
// XRP: $0.65`;

const STEP_4_CODE = `// Default interval (5 seconds)
const unsubscribe = sdk.ftso.subscribe('BTC', (price) => {
  console.log(\`New BTC price: $\${price.price}\`);
});

// Custom interval - User A wants updates every 2 seconds
const unsubscribeA = sdk.ftso.subscribe('BTC', (price) => {
  console.log(\`User A - BTC: $\${price.price}\`);
}, 2000);  // 2000ms = 2 seconds

// Custom interval - User B wants updates every 60 seconds
const unsubscribeB = sdk.ftso.subscribe('ETH', (price) => {
  console.log(\`User B - ETH: $\${price.price}\`);
}, 60000);  // 60000ms = 60 seconds

// Custom interval - User C wants updates every 5 minutes
const unsubscribeC = sdk.ftso.subscribe('XRP', (price) => {
  console.log(\`User C - XRP: $\${price.price}\`);
}, 300000);  // 300000ms = 5 minutes

// Stop listening when done
unsubscribe();
unsubscribeA();
unsubscribeB();`;

const REACT_EXAMPLE_CODE = `'use client';
import { useState, useEffect } from 'react';
import { FlareSDK } from '@flarestudio/flare-sdk';

export default function PriceTracker() {
  const [price, setPrice] = useState(null);
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    const sdk = new FlareSDK({ network: "flare" });

    // Subscribe with custom interval (e.g., every 30 seconds)
    const unsub = sdk.ftso.subscribe("BTC", (data) => {
      setPrice(data.price);
      setSymbol(data.symbol);
    }, 30000);  // 30 seconds

    return () => unsub();   // Stop subscription when component unmounts
  }, []);

  return (
    <div>
      { price ? (
        <p>{ symbol }: \${ price.toFixed(2) }</p>
      ) : (
        <p>Loading...</p>
      ) }
    </div>
  );
}`;

const SYMBOLS_CODE = `const symbols = await sdk.ftso.getSupportedSymbols();
console.log(symbols);
// ['BTC', 'ETH', 'XRP', 'FLR', 'SGB', 'DOGE', 'LTC', 'ADA', 'ALGO', ...]`;

const CACHING_CODE = `// Disable cache for this call (always fetch fresh)
const freshPrice = await sdk.ftso.getPrice('BTC', { 
  cache: false 
});

// Custom cache TTL (30 seconds)
const price = await sdk.ftso.getPrice('ETH', { 
  cache: true,
  ttl: 30 
});

// Clear all cached prices
sdk.ftso.clearCache();`;

const INTERVALS_CODE = `function setupPriceUpdates(userPreference) {
  const sdk = new FlareSDK({ network: 'flare' });
  
  // Define interval presets
  const intervals = {
    'realtime': 2000,      // 2 seconds
    'fast': 10000,         // 10 seconds
    'normal': 60000,       // 1 minute
    'slow': 300000,        // 5 minutes
    'hourly': 3600000      // 1 hour
  };
  
  const interval = intervals[userPreference] || 60000;
  
  return sdk.ftso.subscribe('BTC', (price) => {
    console.log(\`BTC: $\${price.price}\`);
  }, interval);
}

// User A chooses "realtime"
const userA = setupPriceUpdates('realtime');

// User B chooses "normal"  
const userB = setupPriceUpdates('normal');`;

const COMPLETE_EXAMPLE_CODE = `import { FlareSDK } from '@flarestudio/flare-sdk';

async function trackPrices() {
  // Initialize with debug mode
  const sdk = new FlareSDK({ 
    network: 'flare',
    debug: true  // See detailed logs
  });
  
  // Get available symbols
  const allSymbols = await sdk.ftso.getSupportedSymbols();
  console.log('Available:', allSymbols);
  
  // Track specific assets
  const watchList = ['BTC', 'ETH', 'XRP'];
  
  // Get initial prices
  const prices = await sdk.ftso.getPrices(watchList);
  prices.forEach(p => {
    console.log(\`\${p.symbol}: $\${p.price.toFixed(2)}\`);
  });
  
  // Subscribe to updates (every 30 seconds)
  watchList.forEach(symbol => {
    sdk.ftso.subscribe(symbol, (price) => {
      const time = price.timestamp.toLocaleTimeString();
      console.log(\`[\${time}] \${symbol}: $\${price.price.toFixed(2)}\`);
    }, 30000);
  });
}

trackPrices();`;

const ERROR_HANDLING_CODE = `try {
  const price = await sdk.ftso.getPrice('BTC');
  console.log(price);
} catch (error) {
  if (error.code === 'PRICE_NOT_AVAILABLE') {
    console.error('Price not available for this symbol');
  } else if (error.code === 'NETWORK_ERROR') {
    console.error('Network connection issue');
  } else {
    console.error('Unexpected error:', error.message);
  }
}`;
