'use client'

export default function StateConnectorPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">State Connector Module</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Verify the state of any connected blockchain (e.g., Bitcoin, Ethereum, XRP).
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Features</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Verify state proofs (Merkle proofs)</li>
                    <li>Query state from external chains</li>
                    <li>Subscribe to state updates</li>
                    <li>Get proof verification history</li>
                </ul>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Usage</h2>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Verify State Proof</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`const verified = await sdk.stateConnector.verify({
  proof: '0x1234567890abcdef...',
  attestationType: 'Payment',
  sourceChain: 'BTC'
});

console.log('Is valid proof:', verified);`}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Query External State</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`const state = await sdk.stateConnector.queryState({
  chain: 'ETH',
  blockNumber: 15000000,
  address: '0xUserAddress...'
});

console.log('Balance on ETH:', state.balance);`}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Subscribe to Updates</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`sdk.stateConnector.subscribe('BTC', (update) => {
  console.log('New BTC state update:', update);
});`}
                        </pre>
                    </div>
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
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">verify(params)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Verifies a Merkle proof for a specific chain state.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">queryState(params)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Queries the state of an external blockchain.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">subscribe(chain, cb)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Subscribes to state updates for a chain.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">getProofHistory(params)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Returns a history of verified proofs.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
