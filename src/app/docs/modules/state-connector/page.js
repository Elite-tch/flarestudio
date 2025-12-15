'use client'
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="relative group bg-gray-900 rounded-lg p-4">
            <button onClick={copy} className="absolute right-2 top-2 p-1 text-gray-400 hover:text-white">
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                {code}
            </pre>
        </div>
    );
}

export default function StateConnectorPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">State Connector Module</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Read the pulse of the Flare Network. The State Connector allows you to read confirmed voting rounds and Merkle roots, representing the consensus state of external blockchains.
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Features</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Real-time consensus tracking:</strong> Listen for finalized voting rounds.</li>
                    <li><strong>Merkle Root lookup:</strong> Fetch the confirmed state root for any historical round.</li>
                    <li><strong>No Mocks:</strong> Direct interaction with the StateConnector smart contract.</li>
                </ul>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Usage</h2>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">1. Get Last Confirmed Round</h3>
                    <p className="text-gray-600">Check which voting round was last finalized on the network.</p>
                    <CodeBlock code={`const roundId = await sdk.stateConnector.getLastConfirmedRoundId();
console.log('Last Confirmed Round:', roundId);`} />
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">2. Get Merkle Root</h3>
                    <p className="text-gray-600">Retrieve the confirmed Merkle root for a specific round.</p>
                    <CodeBlock code={`const root = await sdk.stateConnector.getMerkleRoot(roundId);
console.log('Merkle Root:', root);`} />
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">3. Subscribe to Updates</h3>
                    <p className="text-gray-600">Listen for <code>RoundFinalized</code> events in real-time.</p>
                    <CodeBlock code={`const unsubscribe = sdk.stateConnector.subscribeToFinalizedRounds((roundId, root) => {
    console.log(\`Round \${roundId} finalized with root \${root}\`);
});

// Later...
unsubscribe();`} />
                </div>
            </div>

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
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">getLastConfirmedRoundId()</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Returns the latest finalized round ID.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">getMerkleRoot(roundId)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Returns the Merkle root for the given round.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">subscribeToFinalizedRounds(cb)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Subscribes to live RoundFinalized events.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Complete Example */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Complete React/Next.js Example</h2>
                <p className="text-gray-600">
                    Build a live State Connector Explorer to track consensus rounds and Merkle roots.
                </p>
                <CodeBlock code={`'use client';
import { useState, useEffect } from 'react';
import { FlareSDK } from '@flarestudio/flare-sdk';

export default function StateConnectorExplorer() {
    const [sdk] = useState(() => new FlareSDK({ network: 'coston2' }));
    const [lastRound, setLastRound] = useState(0);
    const [history, setHistory] = useState([]);
    const [liveEvents, setLiveEvents] = useState([]);

    useEffect(() => {
        // 1. Initial Fetch
        const init = async () => {
            try {
                const round = await sdk.stateConnector.getLastConfirmedRoundId();
                setLastRound(round);

                // Fetch last 5 roots
                const uploads = [];
                for (let i = 0; i < 5; i++) {
                    const r = round - i;
                    if (r < 0) break;
                    try {
                        const root = await sdk.stateConnector.getMerkleRoot(r);
                        uploads.push({ round: r, root });
                    } catch (e) { console.error(e); }
                }
                setHistory(uploads);
            } catch (e) {
                console.error("Failed to fetch state:", e);
            }
        };
        init();

        // 2. Subscribe to Live Events
        const unsubscribe = sdk.stateConnector.subscribeToFinalizedRounds((round, root) => {
            const event = { round, root, time: new Date().toLocaleTimeString() };
            setLiveEvents(prev => [event, ...prev].slice(0, 10)); // Keep last 10
            setLastRound(round); // Update current round
        });

        // Cleanup
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [sdk]);

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-400">State Connector Explorer</h1>
                    <p className="text-gray-400">Live Consensus Tracking</p>
                </div>

                {/* Current Status */}
                <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 text-center">
                    <div className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-2">Last Confirmed Round</div>
                    <div className="text-6xl font-mono font-bold text-white tracking-tighter">
                        {lastRound > 0 ? lastRound : <span className="text-2xl text-gray-500">Loading...</span>}
                    </div>
                </div>

                {/* Live Feed */}
                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                    <div className="p-4 bg-slate-700/50 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold">🔴 Live Finalization Events</h3>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-pulse">Live</span>
                    </div>
                    <div className="divide-y divide-slate-700 max-h-60 overflow-y-auto">
                        {liveEvents.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 italic">Waiting for next round...</div>
                        ) : (
                            liveEvents.map((e) => (
                                <div key={e.round} className="p-3 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-bold text-blue-400">Round #{e.round}</span>
                                        <span className="text-gray-500 text-xs">{e.time}</span>
                                    </div>
                                    <div className="font-mono text-xs text-gray-400 break-all">{e.root}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Historical Data */}
                <div className="space-y-2">
                    <h3 className="font-bold text-gray-400 px-1">Recent History (Last 5)</h3>
                    <div className="space-y-2">
                        {history.map((item) => (
                            <div key={item.round} className="bg-slate-800 p-4 rounded-lg flex items-center justify-between border border-slate-700">
                                <div className="font-mono text-blue-400 font-bold">#{item.round}</div>
                                <div className="font-mono text-xs text-gray-500 hidden sm:block">{item.root}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}`} />
            </div>
        </div>
    )
}
