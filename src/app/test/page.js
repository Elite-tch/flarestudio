'use client';
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
                // Debug Raw Call
                try {
                    const raw = await sdk.provider.send('eth_call', [{
                        to: '0x1000000000000000000000000000000000000001',
                        data: '0x082568bc'
                    }, 'latest']);
                    console.log('DEBUG Raw SC Result:', raw);
                } catch (e) { console.error('DEBUG Raw SC Failed:', e); }

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
}