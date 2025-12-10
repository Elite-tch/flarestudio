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

export default function FAssetsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">fAssets Module</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Bridge non-smart contract tokens (BTC, XRP, DOGE, etc.) to Flare as fAssets.
          The fAssets system allows these tokens to be used in DeFi on Flare.
        </p>
      </div>

      {/* Comprehensive Guides */}
      <div className="space-y-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900">Comprehensive Guides</h2>

        {/* Minting Guide */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Minting fAssets</h3>
            <p className="text-gray-600 mb-4">
              Minting involves reserving collateral on Flare, paying the underlying asset (e.g., XRP) to an agent, and then proving the payment.
              The SDK currently simplifies the first step: <strong>Reserving Collateral</strong>.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Note:</strong> Full minting requires an indexer to prove the underlying payment.
                The SDK handles the on-chain reservation transaction.
              </p>
              <p className="text-sm text-blue-700">
                <strong>Important:</strong> Only registered and recognized fXRP agents on the Coston2 network can be used for minting or redeeming.
                Ensure you select a valid agent from the fetched list.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Methods</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">getCollateralRequirements(symbol, lots)</code>
                <span className="text-sm text-gray-600">Calculates the collateral fee required to reserve lots.</span>
              </li>
              <li className="flex gap-3">
                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">mint(symbol, lots, options, signer)</code>
                <span className="text-sm text-gray-600">Reserves collateral with an agent. Returns transaction response.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Redeeming Guide */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Redeeming fAssets</h3>
            <p className="text-gray-600">
              Redeeming burns your fAssets on Flare and triggers a payment of the underlying asset (e.g., BTC) to your address on the other chain.
            </p>
          </div>
          <div className="bg-gray-50 p-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Methods</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">redeem(symbol, lots, options, signer)</code>
                <span className="text-sm text-gray-600">Initiates redemption. You must specify the destination address on the underlying chain.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Balances Guide */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Managing Balances</h3>
            <p className="text-gray-600">
              fAssets are standard ERC-20 tokens. You can check balances and transfer them like any other token.
            </p>
          </div>
          <div className="bg-gray-50 p-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Methods</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">getBalance(address, symbol)</code>
                <span className="text-sm text-gray-600">Returns the formatted balance, decimals, and token symbol.</span>
              </li>
              <li className="flex gap-3">
                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">getLotSize(symbol)</code>
                <span className="text-sm text-gray-600">Returns the standard lot size for the fAsset (e.g. 20 XRP).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example Dashboard */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Example Dashboard</h2>
        <p className="text-gray-600">
          A complete example showing how to build a React dashboard for minting and redeeming fAssets.
        </p>

        <TabbedCode
          jsCode={`"use client"

import { useState, useEffect } from 'react';
import { FlareSDK } from '@flarestudio/flare-sdk';

export default function FAssetsDashboard() {
  const [sdk] = useState(() => new FlareSDK({ network: "coston2" }));
  const [address, setAddress] = useState('');
  const [signer, setSigner] = useState(null);

  // Data
  const [nativeBalance, setNativeBalance] = useState('0');
  const [fxrpBalance, setFxrpBalance] = useState('0');
  const [lotSize, setLotSize] = useState('0');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Inputs
  const [mintLots, setMintLots] = useState('1');
  const [mintAgent, setMintAgent] = useState('');
  const [redeemLots, setRedeemLots] = useState('1');
  const [redeemAddress, setRedeemAddress] = useState('');

  // Logs
  const [logs, setLogs] = useState([]);

  const addLog = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ time: timestamp, msg, type }, ...prev]);
  };

  const clearLogs = () => setLogs([]);

  const loadData = async (addr) => {
    const target = addr || address;
    if (!target) return;

    try {
      setLoading(true);
      // Native Balance
      const bal = await sdk.wallet.getBalance();
      if (bal) {
        setNativeBalance(parseFloat(bal.flr).toFixed(4));
      }

      // fAsset Balance
      const fbal = await sdk.fassets.getBalance(target, 'fXRP');
      setFxrpBalance(fbal.balance);

      const size = await sdk.fassets.getLotSize('fXRP');
      setLotSize(size);

      // Agents
      const agentList = await sdk.fassets.getAgents('fXRP');
      setAgents(agentList);
      if (agentList.length > 0 && !mintAgent) {
        setMintAgent(agentList[0]);
      }
    } catch (e) {
      console.error(e);
      addLog(\`Error loading data: \${e.message}\`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x72' }], // 114 in hex
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
            await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                chainId: '0x72',
                chainName: 'Coston2 Testnet',
                rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc'],
                nativeCurrency: {
                    name: 'Coston2 Flare',
                    symbol: 'C2FLR',
                    decimals: 18,
                },
                blockExplorerUrls: ['https://coston2-explorer.flare.network'],
                },
            ],
            });
        } catch (addError) {
            addLog(\`Failed to add Coston2 network: \${addError.message}\`, 'error');
        }
      } else {
        addLog(\`Failed to switch network: \${error.message}\`, 'error');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask');
    try {
      await switchNetwork();

      const { BrowserProvider } = await import('ethers');
      const provider = new BrowserProvider(window.ethereum);
      const s = await provider.getSigner();
      setSigner(s);
      const addr = await s.getAddress();
      setAddress(addr);

      // Connect SDK wallet
      await sdk.wallet.connect(window.ethereum);

      addLog(\`Connected to \${addr.slice(0, 6)}...\${addr.slice(-4)}\`, 'success');
      await loadData(addr);
    } catch (e) {
      addLog(\`Connection failed: \${e.message}\`, 'error');
    }
  };

  const handleRefresh = async () => {
    addLog('Refreshing balances...', 'info');
    await loadData(address);
    addLog('Balances updated', 'success');
  };

  const handleMint = async () => {
    if (!signer) return alert('Connect wallet first');
    if (!mintAgent) return alert('Select an agent');

    try {
      addLog(\`--- Starting Mint Process ---\`, 'info');
      addLog(\`1. Checking collateral requirements for \${mintLots} lots...\`);

      const req = await sdk.fassets.getCollateralRequirements('fXRP', Number(mintLots));
      addLog(\`   Required Fee: \${req.required} \${req.currency}\`);

      addLog(\`2. Sending reservation transaction... Check wallet.\`);
      const tx = await sdk.fassets.mint('fXRP', Number(mintLots), { agent: mintAgent }, signer);
      addLog(\`   Tx Sent: \${tx.hash.slice(0, 10)}...\`, 'info');

      addLog(\`3. Waiting for confirmation...\`);
      await tx.wait();

      addLog(\`Success! Collateral reserved.\`, 'success');
      addLog(\`IMPORTANT: Your fXRP balance will NOT increase yet. You must now send XRP to the agent to complete minting.\`, 'warning');

      await handleRefresh();
    } catch (e) {
      addLog(\`Mint failed: \${e.message}\`, 'error');
    }
  };

  const handleRedeem = async () => {
    if (!signer) return alert('Connect wallet first');
    if (!redeemAddress) return alert('Enter destination address');

    try {
      addLog(\`--- Starting Redemption Process ---\`, 'info');
      addLog(\`1. Initiating redemption for \${redeemLots} lots...\`);
      addLog(\`   Destination: \${redeemAddress}\`);

      addLog(\`2. Sending transaction... Check wallet.\`);
      const tx = await sdk.fassets.redeem('fXRP', Number(redeemLots), { to: redeemAddress }, signer);
      addLog(\`   Tx Sent: \${tx.hash.slice(0, 10)}...\`, 'info');

      addLog(\`3. Waiting for confirmation...\`);
      await tx.wait();

      addLog(\`Success! fAssets burned.\`, 'success');
      addLog(\`The agent will pay you on the XRP Ledger shortly.\`, 'info');

      await handleRefresh();
    } catch (e) {
      addLog(\`Redeem failed: \${e.message}\`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">fAssets Playground</h1>
              <p className="text-gray-400">Learn how to bridge assets to Flare.</p>
            </div>
            {address && (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            )}
          </div>

          {!address ? (
            <button onClick={connectWallet} className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-bold transition-all">
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-6">
              {/* Balances */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <span className="text-4xl font-bold">FLR</span>
                  </div>
                  <p className="text-gray-400 text-sm">Native Balance</p>
                  <p className="text-2xl font-bold text-white">{nativeBalance}</p>
                  <p className="text-xs text-pink-500 mt-1">C2FLR (Used for fees)</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <span className="text-4xl font-bold">XRP</span>
                  </div>
                  <p className="text-gray-400 text-sm">fXRP Balance</p>
                  <p className="text-2xl font-bold text-white">{fxrpBalance}</p>
                  <p className="text-xs text-blue-400 mt-1">fXRP (Minted assets)</p>
                </div>
              </div>

              {/* Mint Section */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-sm">1</span>
                  Mint fXRP
                </h2>
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3 mb-4">
                  <p className="text-xs text-green-200">
                    <strong>Action:</strong> Reserve Collateral<br />
                    <strong>Cost:</strong> Small C2FLR fee<br />
                    <strong>Result:</strong> Reservation ID (fXRP balance does NOT change yet)
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lots (1 lot = {lotSize} XRP)</label>
                    <input
                      type="number"
                      value={mintLots}
                      onChange={(e) => setMintLots(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Select Agent</label>
                    <select
                      value={mintAgent}
                      onChange={(e) => setMintAgent(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm font-mono"
                    >
                      <option value="">Select an agent...</option>
                      {agents.map(a => (
                        <option key={a} value={a}>{a.slice(0, 10)}...{a.slice(-8)}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{agents.length} agents found</p>
                  </div>
                  <button onClick={handleMint} className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition-colors">
                    Reserve Collateral
                  </button>
                </div>
              </div>

              {/* Redeem Section */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-sm">2</span>
                  Redeem fXRP
                </h2>
                <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-4">
                  <p className="text-xs text-red-200">
                    <strong>Action:</strong> Burn fAssets<br />
                    <strong>Cost:</strong> fXRP amount + C2FLR gas<br />
                    <strong>Result:</strong> fXRP balance decreases
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lots</label>
                    <input
                      type="number"
                      value={redeemLots}
                      onChange={(e) => setRedeemLots(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Destination XRP Address</label>
                    <input
                      type="text"
                      value={redeemAddress}
                      onChange={(e) => setRedeemAddress(e.target.value)}
                      placeholder="r..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm font-mono"
                    />
                  </div>
                  <button onClick={handleRedeem} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition-colors">
                    Redeem fXRP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Logs & Info */}
        <div className="space-y-6">
          <div className="bg-black/40 p-6 rounded-xl border border-gray-800 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-300">Transaction Log</h3>
              <button onClick={clearLogs} className="text-xs text-gray-500 hover:text-white">Clear</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm pr-2">
              {logs.length === 0 && <p className="text-gray-600 italic text-center mt-10">Waiting for actions...</p>}
              {logs.map((log, i) => (
                <div key={i} className={\`p-3 rounded border-l-2 \${log.type === 'error' ? 'border-red-500 bg-red-500/10 text-red-200' :
                    log.type === 'success' ? 'border-green-500 bg-green-500/10 text-green-200' :
                      log.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-200' :
                        'border-blue-500 bg-blue-500/10 text-blue-200'
                  }\`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] opacity-50 mb-1 block">{log.time}</span>
                  </div>
                  <p className="break-words">{log.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}`}
          tsCode={`"use client"

import { useState, useEffect } from 'react';
import { FlareSDK } from '@flarestudio/flare-sdk';
import { BrowserProvider, Signer } from 'ethers';

interface Log {
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function FAssetsDashboard() {
  const [sdk] = useState(() => new FlareSDK({ network: "coston2" }));
  const [address, setAddress] = useState<string>('');
  const [signer, setSigner] = useState<Signer | null>(null);

  // Data
  const [nativeBalance, setNativeBalance] = useState<string>('0');
  const [fxrpBalance, setFxrpBalance] = useState<string>('0');
  const [lotSize, setLotSize] = useState<string>('0');
  const [agents, setAgents] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Inputs
  const [mintLots, setMintLots] = useState<string>('1');
  const [mintAgent, setMintAgent] = useState<string>('');
  const [redeemLots, setRedeemLots] = useState<string>('1');
  const [redeemAddress, setRedeemAddress] = useState<string>('');

  // Logs
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ time: timestamp, msg, type }, ...prev]);
  };

  const clearLogs = () => setLogs([]);

  const loadData = async (addr: string) => {
    const target = addr || address;
    if (!target) return;

    try {
      setLoading(true);
      // Native Balance
      const bal = await sdk.wallet.getBalance();
      if (bal) {
        setNativeBalance(parseFloat(bal.flr).toFixed(4));
      }

      // fAsset Balance
      const fbal = await sdk.fassets.getBalance(target, 'fXRP');
      setFxrpBalance(fbal.balance);

      const size = await sdk.fassets.getLotSize('fXRP');
      setLotSize(size);

      // Agents
      const agentList = await sdk.fassets.getAgents('fXRP');
      setAgents(agentList);
      if (agentList.length > 0 && !mintAgent) {
        setMintAgent(agentList[0]);
      }
    } catch (e: any) {
      console.error(e);
      addLog(\`Error loading data: \${e.message}\`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x72' }], // 114 in hex
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
            await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                chainId: '0x72',
                chainName: 'Coston2 Testnet',
                rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc'],
                nativeCurrency: {
                    name: 'Coston2 Flare',
                    symbol: 'C2FLR',
                    decimals: 18,
                },
                blockExplorerUrls: ['https://coston2-explorer.flare.network'],
                },
            ],
            });
        } catch (addError: any) {
            addLog(\`Failed to add Coston2 network: \${addError.message}\`, 'error');
        }
      } else {
        addLog(\`Failed to switch network: \${error.message}\`, 'error');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask');
    try {
      await switchNetwork();

      const { BrowserProvider } = await import('ethers');
      const provider = new BrowserProvider(window.ethereum);
      const s = await provider.getSigner();
      setSigner(s);
      const addr = await s.getAddress();
      setAddress(addr);

      // Connect SDK wallet
      await sdk.wallet.connect(window.ethereum);

      addLog(\`Connected to \${addr.slice(0, 6)}...\${addr.slice(-4)}\`, 'success');
      await loadData(addr);
    } catch (e: any) {
      addLog(\`Connection failed: \${e.message}\`, 'error');
    }
  };

  const handleRefresh = async () => {
    addLog('Refreshing balances...', 'info');
    await loadData(address);
    addLog('Balances updated', 'success');
  };

  const handleMint = async () => {
    if (!signer) return alert('Connect wallet first');
    if (!mintAgent) return alert('Select an agent');

    try {
      addLog(\`--- Starting Mint Process ---\`, 'info');
      addLog(\`1. Checking collateral requirements for \${mintLots} lots...\`);

      const req = await sdk.fassets.getCollateralRequirements('fXRP', Number(mintLots));
      addLog(\`   Required Fee: \${req.required} \${req.currency}\`);

      addLog(\`2. Sending reservation transaction... Check wallet.\`);
      const tx = await sdk.fassets.mint('fXRP', Number(mintLots), { agent: mintAgent }, signer);
      addLog(\`   Tx Sent: \${tx.hash.slice(0, 10)}...\`, 'info');

      addLog(\`3. Waiting for confirmation...\`);
      await tx.wait();

      addLog(\`Success! Collateral reserved.\`, 'success');
      addLog(\`IMPORTANT: Your fXRP balance will NOT increase yet. You must now send XRP to the agent to complete minting.\`, 'warning');

      await handleRefresh();
    } catch (e: any) {
      addLog(\`Mint failed: \${e.message}\`, 'error');
    }
  };

  const handleRedeem = async () => {
    if (!signer) return alert('Connect wallet first');
    if (!redeemAddress) return alert('Enter destination address');

    try {
      addLog(\`--- Starting Redemption Process ---\`, 'info');
      addLog(\`1. Initiating redemption for \${redeemLots} lots...\`);
      addLog(\`   Destination: \${redeemAddress}\`);

      addLog(\`2. Sending transaction... Check wallet.\`);
      const tx = await sdk.fassets.redeem('fXRP', Number(redeemLots), { to: redeemAddress }, signer);
      addLog(\`   Tx Sent: \${tx.hash.slice(0, 10)}...\`, 'info');

      addLog(\`3. Waiting for confirmation...\`);
      await tx.wait();

      addLog(\`Success! fAssets burned.\`, 'success');
      addLog(\`The agent will pay you on the XRP Ledger shortly.\`, 'info');

      await handleRefresh();
    } catch (e: any) {
      addLog(\`Redeem failed: \${e.message}\`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">fAssets Playground</h1>
              <p className="text-gray-400">Learn how to bridge assets to Flare.</p>
            </div>
            {address && (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            )}
          </div>

          {!address ? (
            <button onClick={connectWallet} className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-bold transition-all">
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-6">
              {/* Balances */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <span className="text-4xl font-bold">FLR</span>
                  </div>
                  <p className="text-gray-400 text-sm">Native Balance</p>
                  <p className="text-2xl font-bold text-white">{nativeBalance}</p>
                  <p className="text-xs text-pink-500 mt-1">C2FLR (Used for fees)</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <span className="text-4xl font-bold">XRP</span>
                  </div>
                  <p className="text-gray-400 text-sm">fXRP Balance</p>
                  <p className="text-2xl font-bold text-white">{fxrpBalance}</p>
                  <p className="text-xs text-blue-400 mt-1">fXRP (Minted assets)</p>
                </div>
              </div>

              {/* Mint Section */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-sm">1</span>
                  Mint fXRP
                </h2>
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3 mb-4">
                  <p className="text-xs text-green-200">
                    <strong>Action:</strong> Reserve Collateral<br />
                    <strong>Cost:</strong> Small C2FLR fee<br />
                    <strong>Result:</strong> Reservation ID (fXRP balance does NOT change yet)
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lots (1 lot = {lotSize} XRP)</label>
                    <input
                      type="number"
                      value={mintLots}
                      onChange={(e) => setMintLots(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Select Agent</label>
                    <select
                      value={mintAgent}
                      onChange={(e) => setMintAgent(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm font-mono"
                    >
                      <option value="">Select an agent...</option>
                      {agents.map(a => (
                        <option key={a} value={a}>{a.slice(0, 10)}...{a.slice(-8)}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{agents.length} agents found</p>
                  </div>
                  <button onClick={handleMint} className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition-colors">
                    Reserve Collateral
                  </button>
                </div>
              </div>

              {/* Redeem Section */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-sm">2</span>
                  Redeem fXRP
                </h2>
                <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-4">
                  <p className="text-xs text-red-200">
                    <strong>Action:</strong> Burn fAssets<br />
                    <strong>Cost:</strong> fXRP amount + C2FLR gas<br />
                    <strong>Result:</strong> fXRP balance decreases
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lots</label>
                    <input
                      type="number"
                      value={redeemLots}
                      onChange={(e) => setRedeemLots(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Destination XRP Address</label>
                    <input
                      type="text"
                      value={redeemAddress}
                      onChange={(e) => setRedeemAddress(e.target.value)}
                      placeholder="r..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm font-mono"
                    />
                  </div>
                  <button onClick={handleRedeem} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition-colors">
                    Redeem fXRP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Logs & Info */}
        <div className="space-y-6">
          <div className="bg-black/40 p-6 rounded-xl border border-gray-800 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-300">Transaction Log</h3>
              <button onClick={clearLogs} className="text-xs text-gray-500 hover:text-white">Clear</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm pr-2">
              {logs.length === 0 && <p className="text-gray-600 italic text-center mt-10">Waiting for actions...</p>}
              {logs.map((log, i) => (
                <div key={i} className={\`p-3 rounded border-l-2 \${log.type === 'error' ? 'border-red-500 bg-red-500/10 text-red-200' :
                    log.type === 'success' ? 'border-green-500 bg-green-500/10 text-green-200' :
                      log.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-200' :
                        'border-blue-500 bg-blue-500/10 text-blue-200'
                  }\`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] opacity-50 mb-1 block">{log.time}</span>
                  </div>
                  <p className="break-words">{log.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">mint(symbol, lots, opts, signer)</td>
                <td className="px-6 py-4 text-sm text-gray-600">Reserves collateral for minting.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">redeem(symbol, lots, opts, signer)</td>
                <td className="px-6 py-4 text-sm text-gray-600">Redeems fAssets for the underlying asset.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">getBalance(addr, symbol)</td>
                <td className="px-6 py-4 text-sm text-gray-600">Returns the fAsset balance.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">getCollateralRequirements(...)</td>
                <td className="px-6 py-4 text-sm text-gray-600">Calculates required collateral for minting.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">getLotSize(symbol)</td>
                <td className="px-6 py-4 text-sm text-gray-600">Returns the standard lot size.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
