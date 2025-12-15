'use client';

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

            addLog(`Request Submitted: ${JSON.stringify(response)}`);
        } catch (e) {
            console.error(e);
            addLog(`Error: ${e.message}`);
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
                                        <div className="text-lg font-mono text-pink-400">${p.price.toFixed(4)}</div>
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
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${verificationType === 'bitcoin' ? 'bg-[#e93b6c] text-white' : 'text-gray-500 hover:text-white'}`}
                                    onClick={() => setVerificationType('bitcoin')}
                                >
                                    Bitcoin
                                </button>
                                <button
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${verificationType === 'evm' ? 'bg-[#e93b6c] text-white' : 'text-gray-500 hover:text-white'}`}
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
}