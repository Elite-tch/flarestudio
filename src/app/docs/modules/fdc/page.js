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
                className="absolute right-3 top-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
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

function TabbedCode({ jsCode, tsCode }) {
    const [activeTab, setActiveTab] = useState('js');

    return (
        <div>
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => setActiveTab('js')}
                    className={`px-4 py-2 rounded-t-lg font-semibold text-sm ${activeTab === 'js'
                        ? 'bg-[#e93b6c] text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                >
                    JavaScript
                </button>
                <button
                    onClick={() => setActiveTab('ts')}
                    className={`px-4 py-2 rounded-t-lg font-semibold text-sm ${activeTab === 'ts'
                        ? 'bg-[#e93b6c] text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                >
                    TypeScript
                </button>
            </div>
            <CodeBlock code={activeTab === 'js' ? jsCode : tsCode} />
        </div>
    );
}

export default function FDCPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Flare Data Connector (FDC) Module</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    The Flare Data Connector (FDC) enables the Flare network to reach consensus on the state of other blockchains (like Bitcoin, Ethereum, etc.) and the internet.
                    This allows you to <strong>trustlessly prove</strong> that a transaction happened on another chain, enabling use cases like decentralized bridges, payment verification, and cross-chain interoperability without centralized relayers.
                </p>
            </div>

            {/* Quick Start */}
            <div className="bg-pink-50 border-l-4 border-[#e93b6c] p-6 rounded-r-lg">
                <h3 className="text-lg font-bold text-[#e93b6c] mb-2">Quick Start</h3>
                <p className="text-gray-700 mb-4">
                    Initialize the SDK and subscribe to live attestation requests.
                </p>
                <TabbedCode
                    jsCode={`import { FlareSDK } from '@flarestudio/flare-sdk';

const sdk = new FlareSDK({ network: "coston2" });

// Subscribe to new attestation requests
const unsubscribe = sdk.fdc.subscribe((attestation) => {
    console.log('New Attestation Request:', attestation.id);
    console.log('Block:', attestation.blockNumber);
});`}
                    tsCode={`import { FlareSDK } from '@flarestudio/flare-sdk';
import type { Attestation } from '@flarestudio/flare-sdk';

const sdk = new FlareSDK({ network: "coston2" });

// Subscribe to new attestation requests
const unsubscribe = sdk.fdc.subscribe((attestation: Attestation) => {
    console.log('New Attestation Request:', attestation.id);
    console.log('Block:', attestation.blockNumber);
});`}
                />
            </div>

            {/* Step-by-Step Guide */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Step-by-Step Guide</h2>

                {/* Step 1: Subscribe */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Subscribe to Live Events</h3>
                    <p className="text-gray-600 mb-3">
                        Listen for <code className="bg-gray-100 px-1 rounded">AttestationRequest</code> events in real-time.
                    </p>
                    <TabbedCode
                        jsCode={`sdk.fdc.subscribe((attestation) => {
  console.log('Attestation requested hash:', attestation.id);
  // attestation.data contains the raw byte data
});`}
                        tsCode={`sdk.fdc.subscribe((attestation: Attestation) => {
  console.log('Attestation requested hash:', attestation.id);
  // attestation.data contains the raw byte data
});`}
                    />
                </div>

                {/* Step 2: Fetch Recent */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Fetch Recent Requests</h3>
                    <p className="text-gray-600 mb-3">
                        Query the history of the FDC contract to see recent requests.
                    </p>
                    <TabbedCode
                        jsCode={`const recents = await sdk.fdc.getRecentAttestations({ limit: 10 });
console.log(recents);`}
                        tsCode={`const recents = await sdk.fdc.getRecentAttestations({ limit: 10 });
console.log(recents);`}
                    />
                </div>

                {/* Step 3: Request Verification */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Request Verification</h3>
                    <p className="text-gray-600 mb-3">
                        Submit a transaction to verify a payment (e.g. Bitcoin transaction).
                        <br /><span className="text-xs text-gray-500 italic">Note: Requires a signer to pay gas fees.</span>
                    </p>
                    <TabbedCode
                        jsCode={`// Requires an ethers signer
const tx = await sdk.fdc.verifyBitcoinPayment({
    txHash: '0x123...', 
    sourceAddress: 'bc1q...',
    destinationAddress: 'bc1q...',
    amount: 10.5
}, signer);

await tx.wait();
console.log('Verification request submitted!');`}
                        tsCode={`import type { Signer } from 'ethers';

const tx = await sdk.fdc.verifyBitcoinPayment({
    txHash: '0x123...', 
    sourceAddress: 'bc1q...',
    destinationAddress: 'bc1q...',
    amount: 10.5
}, signer as Signer);

await tx.wait();
console.log('Verification request submitted!');`}
                    />
                </div>
            </div>

            {/* Complete Example */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Complete React/Next.js Example</h2>
                <p className="text-gray-600">
                    A complete example showing how to build an FDC Explorer dashboard that supports both Bitcoin and EVM verification.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-sm text-yellow-700">
                        <strong>Note:</strong> This example includes a manual implementation of <code>verifyEVMTransaction</code> to demonstrate the exact data encoding required for Flare&apos;s FDC.
                    </p>
                </div>
                <TabbedCode
                    jsCode={`'use client';

import { useState, useEffect } from "react";
import { FlareSDK } from "@flarestudio/flare-sdk";

export default function FDCDashboard() {
    const [sdk] = useState(() => new FlareSDK({ network: "coston2" }));
    const [signer, setSigner] = useState(null);
    const [address, setAddress] = useState("");
    const [logs, setLogs] = useState([]);
    const [txHash, setTxHash] = useState("");
    const [verificationType, setVerificationType] = useState('bitcoin');

    const addLog = (msg) => setLogs(prev => [msg, ...prev]);

    const [prices, setPrices] = useState([]);

    // Fetch live prices (FTSO)
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const results = await sdk.ftso.getPrices(['FLR', 'BTC', 'ETH']);
                setPrices(results);
            } catch (e) { console.error(e); }
        };
        fetchPrices();
        const interval = setInterval(fetchPrices, 10000);
        return () => clearInterval(interval);
    }, [sdk]);

    // Connect wallet
    const connectWallet = async () => {
        if (!window.ethereum) return alert("Please install MetaMask");

        try {
            const { BrowserProvider } = await import("ethers");
            const provider = new BrowserProvider(window.ethereum);
            const s = await provider.getSigner();
            setSigner(s);
            setAddress(await s.getAddress());

            await sdk.wallet.connect(window.ethereum);
            addLog("Wallet connected");
        } catch (e) {
            console.error(e);
            alert("Failed to connect wallet");
        }
    };

    // Submit attestation request
    const handleRequest = async () => {
        if (!signer) return alert("Connect wallet first");

        try {
            let response;
            if (verificationType === 'bitcoin') {
                response = await sdk.fdc.verifyBitcoinPayment(
                    {
                        txHash,
                        sourceAddress: "bc1qsource...",
                        destinationAddress: "bc1qdestination...",
                        amount: 0.1,
                    },
                    signer
                );
            } else {
                // Manually implement EVM verification payload
                const { Contract, parseEther } = await import("ethers");

                const registryAbi = ['function getContractAddressByName(string memory _name) external view returns (address)'];
                const registry = new Contract('0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019', registryAbi, signer);
                let hubAddress = await registry.getContractAddressByName('FdcHub').catch(() => null);

                if (!hubAddress || hubAddress === '0x0000000000000000000000000000000000000000') {
                    hubAddress = await registry.getContractAddressByName('StateConnector'); // Fallback
                }

                // Prepare Valid FDC Payload: Type (32 bytes) + Source (32 bytes) + Body
                const type = "45564d5472616e73616374696f6e000000000000000000000000000000000000"; // EVMTransaction
                const source = "7465737445544800000000000000000000000000000000000000000000000000"; // testETH
                const cleanHash = txHash.trim().replace(/^0x/i, '');
                const placeholderData = '0x' + type + source + cleanHash;

                const fdcHubAbi = ['function requestAttestation(bytes calldata _data) external payable'];
                const fdcHub = new Contract(hubAddress, fdcHubAbi, signer);

                // Send with 0.1 C2FLR to cover the fee
                response = await fdcHub.requestAttestation(placeholderData, { value: parseEther("0.1") });
            }

            addLog(\`Request Submitted: \${JSON.stringify(response)}\`);
        } catch (e) {
            console.error(e);
            addLog(\`Error: \${e.message}\`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-6 rounded-xl flex items-center justify-center">
            <div className="max-w-xl w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        FDC Explorer
                    </h2>
                    <p className="text-gray-400 mt-2">Verify state from other chains on Flare</p>
                </div>

                {!address ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <button
                            onClick={connectWallet}
                            className="bg-[#e93b6c] hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-pink-500/20"
                        >
                            Connect Wallet to Start
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Prices Section (FTSO) */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span>📈</span> Live FTSO Prices
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {prices.length === 0 ? <p className="text-gray-500 text-xs">Loading...</p> : prices.map((p) => (
                                    <div key={p.symbol} className="bg-black/20 p-3 rounded-lg text-center">
                                        <div className="text-xs text-gray-400 font-bold">{p.symbol}</div>
                                        <div className="text-lg font-mono text-pink-400">\${p.price.toFixed(4)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Connection Status */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Connected</span>
                                <span className="font-mono text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-sm">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </span>
                            </div>
                        </div>

                        {/* Verification Form */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span>⚡</span> Request Verification (<span className="text-pink-400">FDC</span>)
                            </h3>

                            {/* Type Selector */}
                            <div className="flex bg-black/30 p-1 rounded-lg mb-4">
                                <button
                                    className={\`flex-1 py-2 text-sm font-bold rounded-md transition-all \${verificationType === 'bitcoin' ? 'bg-[#e93b6c] text-white' : 'text-gray-500 hover:text-white'}\`}
                                    onClick={() => setVerificationType('bitcoin')}
                                >
                                    Bitcoin
                                </button>
                                <button
                                    className={\`flex-1 py-2 text-sm font-bold rounded-md transition-all \${verificationType === 'evm' ? 'bg-[#e93b6c] text-white' : 'text-gray-500 hover:text-white'}\`}
                                    onClick={() => setVerificationType('evm')}
                                >
                                    EVM (Ethereum)
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 ml-1">
                                        {verificationType === 'bitcoin' ? 'Bitcoin Transaction Hash' : 'EVM Transaction Hash'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={txHash}
                                        onChange={(e) => setTxHash(e.target.value)}
                                        className="w-full bg-black/30 border border-gray-700 p-3 rounded-lg text-white focus:border-pink-500 outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={handleRequest}
                                    className="w-full bg-gradient-to-r from-[#e93b6c] to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-purple-500/20 transition-all"
                                >
                                    Verify {verificationType === 'bitcoin' ? 'Bitcoin' : 'EVM'} Transaction
                                </button>
                            </div>
                        </div>

                        {/* Logs Console */}
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 h-48 overflow-y-auto">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Activity Log</h4>
                            <div className="font-mono text-xs space-y-1">
                                {logs.length === 0 ? <p className="text-gray-600 italic">No activity yet...</p> :
                                    logs.map((l, i) => (
                                        <div key={i} className="text-gray-300 border-l-2 border-gray-700 pl-2 py-0.5">
                                            <span className="text-purple-400 opacity-50 mr-2">{new Date().toLocaleTimeString()}</span>
                                            {l}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}`}
                    tsCode={`'use client';

import { useState } from "react";
import { FlareSDK } from "@flarestudio/flare-sdk";
import { BrowserProvider, Signer } from "ethers";

export default function FDCDashboard() {
  const [sdk] = useState(() => new FlareSDK({ network: "coston2" }));
  const [signer, setSigner] = useState<Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [txHash, setTxHash] = useState<string>("");
  const [verificationType, setVerificationType] = useState<'bitcoin' | 'evm'>('evm');

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const s = await provider.getSigner();
      setSigner(s);
      setAddress(await s.getAddress());
      await sdk.wallet.connect(window.ethereum);
      addLog("Wallet connected");
    } catch (e: any) {
      console.error(e);
      alert("Failed to connect wallet");
    }
  };

  const handleRequest = async () => {
    if (!signer) return alert("Connect wallet first");

    try {
      let response;
      
      if (verificationType === 'bitcoin') {
          response = await sdk.fdc.verifyBitcoinPayment({
              txHash,
              sourceAddress: "bc1qsource...",
              destinationAddress: "bc1qdestination...",
              amount: 0.1,
          }, signer);
      } else {
          // Manual Production-Ready EVM Verification
          const { Contract, AbiCoder, parseEther } = await import("ethers");
          const abiCoder = AbiCoder.defaultAbiCoder;

          const registryAbi = ['function getContractAddressByName(string memory _name) external view returns (address)'];
          const registry = new Contract('0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019', registryAbi, signer);
          let hubAddress = await registry.getContractAddressByName('FdcHub').catch(() => null);
          if (!hubAddress || hubAddress === '0x0000000000000000000000000000000000000000') {
               hubAddress = await registry.getContractAddressByName('StateConnector');
          }

          // Prepare Payload
          const type = "0x" + "45564d5472616e73616374696f6e000000000000000000000000000000000000"; 
          const source = "0x" + "4554480000000000000000000000000000000000000000000000000000000000";
          
          const requestBody = abiCoder.encode(
              ['bytes32', 'uint256', 'bool', 'bool', 'bool'],
              [txHash.trim(), 1, true, true, false]
          );

          const payload = type + source.slice(2) + requestBody.slice(2);

          const fdcHubAbi = ['function requestAttestation(bytes calldata _data) external payable'];
          const fdcHub = new Contract(hubAddress, fdcHubAbi, signer);
          
          response = await fdcHub.requestAttestation(payload, { value: parseEther("0.1") });
      }

      addLog(\`Request Submitted: \${response.hash}\`);
    } catch (e: any) {
      addLog(\`Error: \${e.message}\`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex justify-center">
      {/* (UI similar to JS version) */}
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">FDC Explorer</h2>
        {!address ? (
           <button onClick={connectWallet} className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold">Connect Wallet</button>
        ) : (
           <div className="space-y-4 bg-slate-800 p-6 rounded-xl border border-slate-700">
               <div className="flex justify-center gap-2 mb-4">
                   <button onClick={() => setVerificationType('bitcoin')} className={\`px-4 py-2 rounded-lg \${verificationType === 'bitcoin' ? 'bg-orange-500' : 'bg-slate-700'}\`}>Bitcoin</button>
                   <button onClick={() => setVerificationType('evm')} className={\`px-4 py-2 rounded-lg \${verificationType === 'evm' ? 'bg-blue-600' : 'bg-slate-700'}\`}>EVM</button>
               </div>
               <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)} className="w-full bg-slate-900 p-3 rounded-lg text-white" />
               <button onClick={handleRequest} className="w-full bg-pink-600 text-white py-3 rounded-lg">Verify Transaction</button>
               <div className="h-32 overflow-y-auto bg-black/30 p-2 rounded text-xs font-mono text-gray-300">{logs.map((l, i) => <div key={i}>{l}</div>)}</div>
           </div>
        )}
      </div>
    </div>
  );
}`}
                />
            </div>

            {/* API Reference */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">API Reference</h2>
                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">verifyBitcoinPayment(params, signer)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Submits a payment verification request transaction.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">verifyEVMTransaction(params, signer)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Submits an EVM token verification request transaction (Manual Implementation shown in example).</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">getRecentAttestations(options)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Fetches recent AttestationRequest events.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">subscribe(callback)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Listens for live attestation requests.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
