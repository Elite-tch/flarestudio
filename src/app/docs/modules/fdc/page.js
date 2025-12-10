'use client'

export default function FDCPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">FDC Module</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Verify events from other blockchains using the Flare Data Connector (FDC).
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Features</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Verify Bitcoin payments</li>
                    <li>Query recent attestations</li>
                    <li>Subscribe to new attestation events</li>
                    <li>Verify general attestations by ID</li>
                </ul>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Usage</h2>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Verify Bitcoin Payment</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`const verification = await sdk.fdc.verifyBitcoinPayment({
  txHash: '0x1234567890abcdef...',
  sourceAddress: 'bc1q...',
  destinationAddress: 'bc1q...',
  amount: 0.5
});

console.log('Verified:', verification.verified);`}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Get Recent Attestations</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`const attestations = await sdk.fdc.getRecentAttestations({
  type: 'Payment',
  limit: 10
});`}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Subscribe to Attestations</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`sdk.fdc.subscribe('Payment', (attestation) => {
  console.log('New attestation verified:', attestation.id);
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
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">verifyBitcoinPayment(params)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Verifies a specific Bitcoin transaction.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">verifyAttestation(id)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Verifies an attestation by its Merkle root ID.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">getRecentAttestations(opts)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Fetches a list of recently verified attestations.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">subscribe(type, cb)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Subscribes to new attestations of a specific type.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
