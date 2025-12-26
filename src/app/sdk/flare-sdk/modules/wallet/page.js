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

export default function WalletPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Wallet Module</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Complete wallet integration for your dApp. Connect to MetaMask and other Web3 wallets, send transactions, sign messages, and manage user balances on Flare Network.
                </p>
            </div>

            {/* Quick Start */}
            <div className="bg-pink-50 border-l-4 border-[#e93b6c] p-6 rounded-r-lg">
                <h3 className="text-lg font-bold text-[#e93b6c] mb-2">Quick Start</h3>
                <p className="text-gray-700 mb-4">
                    Connect a wallet in just 2 lines of code. Works with MetaMask, Rabby, Coinbase Wallet, and any EIP-1193 compatible wallet.
                </p>
                <CodeBlock code={`import ${'{ FlareSDK }'} from '@flarestudio/flare-sdk';

const sdk = new FlareSDK(${'{ network: "flare" }'});

// Connect wallet
const address = await sdk.wallet.connect(window.ethereum);
console.log('Connected:', address);`} />
            </div>

            {/* Core Features */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Core Features for dApp Development</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">✓ Wallet Connection</h3>
                        <p className="text-sm text-gray-600">Connect to MetaMask, Rabby, Coinbase Wallet, and more</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">✓ Send Transactions</h3>
                        <p className="text-sm text-gray-600">Send FLR/SGB with automatic gas estimation</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">✓ Message Signing</h3>
                        <p className="text-sm text-gray-600">Sign messages for authentication and verification</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">✓ Balance Queries</h3>
                        <p className="text-sm text-gray-600">Get native FLR/SGB balances in real-time</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">✓ Connection State</h3>
                        <p className="text-sm text-gray-600">Check if wallet is connected</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">✓ Error Handling</h3>
                        <p className="text-sm text-gray-600">Detailed error messages for debugging</p>
                    </div>
                </div>
            </div>

            {/* Step-by-Step Guide */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Step-by-Step Guide</h2>

                {/* Step 1: Connect Wallet */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 1: Connect to User&apos;s Wallet</h3>
                    <p className="text-gray-600 mb-3">
                        Connect to the user&apos;s Web3 wallet. This prompts the user to approve the connection.
                    </p>
                    <CodeBlock code={`import ${'{ FlareSDK }'} from '@flarestudio/flare-sdk';

const sdk = new FlareSDK(${'{ network: "flare" }'});

try ${'{'} 
  // Connect to MetaMask or any injected wallet
  const address = await sdk.wallet.connect(window.ethereum);
  console.log('Connected wallet:', address);
  // Output: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
${'}'} catch (error) ${'{'}
  console.error('Connection failed:', error.message);
${'}'}`} />
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> This will trigger a wallet popup asking the user to connect. Make sure to call this in response to a user action (button click) for better UX.
                        </p>
                    </div>
                </div>

                {/* Step 2: Get Wallet Address */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 2: Get Connected Address</h3>
                    <p className="text-gray-600 mb-3">
                        Retrieve the currently connected wallet address.
                    </p>
                    <CodeBlock code={`// Get the connected address
const address = await sdk.wallet.getAddress();
console.log('Wallet address:', address);

// Check if wallet is connected first
if (sdk.wallet.isConnected()) ${'{'}
  const address = await sdk.wallet.getAddress();
  console.log('Connected:', address);
${'}'} else ${'{'}
  console.log('No wallet connected');
${'}'}`} />
                </div>

                {/* Step 3: Get Balance */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 3: Check Wallet Balance</h3>
                    <p className="text-gray-600 mb-3">
                        Get the native FLR or SGB balance of the connected wallet.
                    </p>
                    <CodeBlock code={`const balance = await sdk.wallet.getBalance();
console.log(\`Balance: \$${'{'}balance.flr${'}'} FLR\`);

// Example output:
// ${'{'} 
//   flr: "1234.567890123456789" 
// ${'}'}

// Display formatted balance
const flrBalance = parseFloat(balance.flr).toFixed(2);
console.log(\`You have \$${'{'}flrBalance${'}'} FLR\`);`} />
                </div>

                {/* Step 4: Send Transaction */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 4: Send Transactions</h3>
                    <p className="text-gray-600 mb-3">
                        Send FLR or SGB to another address. Gas is estimated automatically.
                    </p>
                    <CodeBlock code={`// Send 1.5 FLR to an address
const tx = await sdk.wallet.send(${'{'}
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  value: '1.5'  // Amount in FLR
${'}'});

console.log('Transaction hash:', tx.hash);

// Wait for transaction to be mined
const receipt = await tx.wait();
console.log('Transaction confirmed!', receipt);

// Send with custom data (for contract calls)
const txWithData = await sdk.wallet.send(${'{'}
  to: '0xContractAddress...',
  value: '0',
  data: '0x...'  // Encoded contract call data
${'}'});`} />
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Important:</strong> Always wait for <code className="bg-yellow-100 px-1 rounded">tx.wait()</code> to confirm the transaction was mined before showing success to users.
                        </p>
                    </div>
                </div>

                {/* Step 5: Sign Messages */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 5: Sign Messages</h3>
                    <p className="text-gray-600 mb-3">
                        Sign messages for authentication, verification, or proof of ownership.
                    </p>
                    <CodeBlock code={`// Sign a message
const message = "Sign in to FlareStudio";
const signature = await sdk.wallet.signMessage(message);
console.log('Signature:', signature);

// Example: Sign-in with Ethereum (SIWE)
const siweMessage = \`Welcome to FlareStudio!

Click to sign in and accept the Terms of Service.

URI: https://flarestudio.xyz
Version: 1
Chain ID: 14
Nonce: \$${'{'}Math.random().toString(36)${'}'}
Issued At: \$${'{'}new Date().toISOString()${'}'}\`;

const signature = await sdk.wallet.signMessage(siweMessage);
// Send signature to your backend for verification`} />
                </div>
            </div>

            {/* React/Next.js Integration */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">React/Next.js Integration</h2>
                <p className="text-gray-600">
                    Complete example of wallet integration in a React dApp:
                </p>
                <CodeBlock code={`'use client';
import ${'{ useState, useEffect }'} from 'react';
import ${'{ FlareSDK }'} from '@flarestudio/flare-sdk';

export default function WalletConnect() ${'{'}
  const [sdk] = useState(() => new FlareSDK(${'{ network: "flare" }'}));
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Connect wallet
  const connectWallet = async () => ${'{'} 
    try ${'{'} 
      setLoading(true);
      const addr = await sdk.wallet.connect(window.ethereum);
      setAddress(addr);
      
      // Get balance after connecting
      const bal = await sdk.wallet.getBalance();
      setBalance(bal.flr);
    ${'}'} catch (error) ${'{'}
      console.error('Failed to connect:', error);
      alert('Failed to connect wallet');
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Send transaction
  const sendTransaction = async () => ${'{'} 
    try ${'{'} 
      const tx = await sdk.wallet.send(${'{'}
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        value: '0.1'
      ${'}'});
      
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      alert('Transaction confirmed!');
      
      // Refresh balance
      const bal = await sdk.wallet.getBalance();
      setBalance(bal.flr);
    ${'}'} catch (error) ${'{'}
      console.error('Transaction failed:', error);
      alert('Transaction failed');
    ${'}'}
  ${'}'};

  return (
    <div>
      ${'{'} !address ? (
        <button onClick=${'{'}connectWallet${'}'} disabled=${'{'}loading${'}'}>
          ${'{'} loading ? 'Connecting...' : 'Connect Wallet' ${'}'}
        </button>
      ) : (
        <div>
          <p>Connected: ${'{'} address.slice(0, 6) ${'}'}...${'{'} address.slice(-4) ${'}'}</p>
          <p>Balance: ${'{'} parseFloat(balance).toFixed(2) ${'}'} FLR</p>
          <button onClick=${'{'}sendTransaction${'}'}>Send 0.1 FLR</button>
        </div>
      ) ${'}'}
    </div>
  );
${'}'}`} />
            </div>

            {/* Error Handling */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Error Handling</h2>
                <p className="text-gray-600 mb-3">
                    Handle common wallet errors gracefully:
                </p>
                <CodeBlock code={`try ${'{'}
  const address = await sdk.wallet.connect(window.ethereum);
${'}'} catch (error) ${'{'}
  if (error.code === 'WALLET_NOT_CONNECTED') ${'{'}
    console.error('User rejected connection');
  ${'}'} else if (error.code === 'TRANSACTION_FAILED') ${'{'}
    console.error('Transaction was rejected or failed');
  ${'}'} else if (error.code === 'INSUFFICIENT_FUNDS') ${'{'}
    console.error('Not enough FLR for transaction');
  ${'}'} else if (error.code === 'SIGNATURE_REJECTED') ${'{'}
    console.error('User rejected signature request');
  ${'}'} else ${'{'}
    console.error('Unexpected error:', error.message);
  ${'}'}
${'}'}`} />
            </div>

            {/* Best Practices */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Best Practices for dApp Development</h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Check wallet availability:</strong>
                            <p className="text-gray-600 text-sm">Always check if <code className="bg-gray-100 px-1 rounded text-xs">window.ethereum</code> exists before connecting</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Handle user rejection:</strong>
                            <p className="text-gray-600 text-sm">Users can reject connection or transaction requests - always handle these gracefully</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Wait for confirmations:</strong>
                            <p className="text-gray-600 text-sm">Always use <code className="bg-gray-100 px-1 rounded text-xs">await tx.wait()</code> before showing success</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Show loading states:</strong>
                            <p className="text-gray-600 text-sm">Display loading indicators during wallet operations for better UX</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Format addresses:</strong>
                            <p className="text-gray-600 text-sm">Display shortened addresses like <code className="bg-gray-100 px-1 rounded text-xs">0x742d...f0bEb</code> for better readability</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Listen to account changes:</strong>
                            <p className="text-gray-600 text-sm">Use <code className="bg-gray-100 px-1 rounded text-xs">window.ethereum.on(&apos;accountsChanged&apos;)</code> to detect when users switch accounts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced: Account Change Detection */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Advanced: Detect Account Changes</h2>
                <p className="text-gray-600 mb-3">
                    Listen for when users switch accounts in their wallet:
                </p>
                <CodeBlock code={`useEffect(() => ${'{'}
  if (!window.ethereum) return;

  // Listen for account changes
  const handleAccountsChanged = async (accounts) => ${'{'} 
    if (accounts.length === 0) ${'{'}
      // User disconnected wallet
      setAddress(null);
      setBalance(null);
    ${'}'} else ${'{'}
      // User switched to a different account
      const newAddress = accounts[0];
      setAddress(newAddress);
      
      // Refresh balance for new account
      const bal = await sdk.wallet.getBalance();
      setBalance(bal.flr);
    ${'}'}
  ${'}'};

  window.ethereum.on('accountsChanged', handleAccountsChanged);

  // Cleanup
  return () => ${'{'} 
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  ${'}'};
${'}'}, [sdk]);`} />
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">connect(provider)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">provider: any</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;string&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Connect to wallet, returns address</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getAddress()</td>
                                <td className="px-6 py-4 text-sm text-gray-600">-</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;string&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Get connected wallet address</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getBalance()</td>
                                <td className="px-6 py-4 text-sm text-gray-600">-</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;WalletBalance&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Get native FLR/SGB balance</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">send(options)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">{`{to, value?, data?}`}</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;TransactionResponse&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Send transaction</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">signMessage(message)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">message: string</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;string&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Sign a message</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">isConnected()</td>
                                <td className="px-6 py-4 text-sm text-gray-600">-</td>
                                <td className="px-6 py-4 text-sm text-gray-600">boolean</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Check if wallet is connected</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Common Use Cases */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Common dApp Use Cases</h2>

                <div className="space-y-4">
                    <div className="border-l-4 border-gray-300 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">1. User Authentication</h3>
                        <p className="text-sm text-gray-600 mb-2">Use wallet signatures for secure login without passwords</p>
                        <CodeBlock code={`const message = \`Sign this message to log in to FlareStudio
Nonce: \$${'{'}Math.random().toString(36)${'}'}
Timestamp: \$${'{'}Date.now()${'}'}\`;

const signature = await sdk.wallet.signMessage(message);
// Send to your backend for verification`} />
                    </div>

                    <div className="border-l-4 border-gray-300 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">2. Payment Processing</h3>
                        <p className="text-sm text-gray-600 mb-2">Accept FLR payments in your dApp</p>
                        <CodeBlock code={`const paymentTx = await sdk.wallet.send(${'{'}
  to: YOUR_PAYMENT_ADDRESS,
  value: '10.0'  // 10 FLR
${'}'});

await paymentTx.wait();
// Payment confirmed - deliver product/service`} />
                    </div>

                    <div className="border-l-4 border-gray-300 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">3. NFT Minting</h3>
                        <p className="text-sm text-gray-600 mb-2">Call your NFT contract&apos;s mint function</p>
                        <CodeBlock code={`// Encode the mint function call
const mintData = '0x...';  // Your encoded contract call

const tx = await sdk.wallet.send(${'{'}
  to: NFT_CONTRACT_ADDRESS,
  value: '0.1',  // Mint price
  data: mintData
${'}'});

await tx.wait();
console.log('NFT minted!');`} />
                    </div>
                </div>
            </div>
            {/* Complete Example */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Complete React/Next.js Example</h2>
                <p className="text-gray-600">
                    A production-ready Wallet Dashboard allowing users to connect, view balances, send funds, and sign messages.
                </p>
                <CodeBlock code={`'use client';
import { useState, useEffect } from 'react';
import { FlareSDK } from '@flarestudio/flare-sdk';

export default function WalletDashboard() {
    const [sdk] = useState(() => new FlareSDK({ network: 'coston2' }));
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState('0');
    const [loading, setLoading] = useState(false);
    
    // Transaction State
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

    // Connect Handler
    const connect = async () => {
        try {
            setLoading(true);
            const addr = await sdk.wallet.connect(window.ethereum);
            setAddress(addr);
            setConnected(true);
            await refreshBalance();
        } catch (e) {
            console.error(e);
            alert('Failed to connect wallet');
        } finally {
            setLoading(false);
        }
    };

    // Refresh Balance
    const refreshBalance = async () => {
        if (!sdk.wallet.isConnected()) return;
        const bal = await sdk.wallet.getBalance();
        setBalance(bal.flr);
    };

    // Send Handlers
    const handleSend = async () => {
        if (!recipient || !amount) return;
        try {
            setStatus('Initiating transaction...');
            const tx = await sdk.wallet.send({
                to: recipient,
                value: amount
            });
            setStatus(\`Transaction sent! Hash: \${tx.hash}\`);
            
            await tx.wait();
            setStatus('Transaction Confirmed! ✅');
            await refreshBalance();
            setRecipient('');
            setAmount('');
        } catch (e) {
            setStatus(\`Error: \${e.message}\`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            <div className="max-w-md mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Wallet Dashboard
                    </h1>
                    <p className="text-gray-400">Flare Network Integration</p>
                </div>

                {/* Wallet Card */}
                {!connected ? (
                    <button
                        onClick={connect}
                        disabled={loading}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-transform hover:scale-[1.02] disabled:opacity-50"
                    >
                        {loading ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                        
                        {/* Account Info */}
                        <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Connected Account</div>
                            <div className="font-mono text-green-400 bg-green-400/10 inline-block px-3 py-1 rounded-full text-sm">
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </div>
                        </div>

                        {/* Balance */}
                        <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Balance</div>
                            <div className="text-4xl font-bold flex items-baseline gap-2">
                                {parseFloat(balance).toFixed(4)}
                                <span className="text-lg text-pink-500">C2FLR</span>
                            </div>
                        </div>

                        <hr className="border-slate-800" />

                        {/* Send Form */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-300">Send Funds</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Recipient Address (0x...)"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-pink-500 outline-none transition-colors"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-pink-500 outline-none transition-colors"
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="bg-pink-600 hover:bg-pink-500 px-6 rounded-lg font-bold transition-colors"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                            {status && (
                                <div className="p-3 bg-slate-800 rounded-lg text-xs font-mono text-blue-300 break-all">
                                    {status}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}`} />
            </div>
        </div>
    );
}
