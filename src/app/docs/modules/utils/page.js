'use client'

export default function UtilsPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Utils Module</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Essential helper functions for working with the Flare Network.
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Features</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Convert between Wei and Ether</li>
                    <li>Format and validate addresses</li>
                    <li>Handle decimals for various tokens</li>
                    <li>Standardized error formatting</li>
                </ul>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Usage</h2>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Unit Conversion</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`// Convert Ether to Wei
const wei = sdk.utils.toWei('1.5');
console.log(wei); // 1500000000000000000

// Convert Wei to Ether
const ether = sdk.utils.fromWei('1500000000000000000');
console.log(ether); // 1.5`}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Address Validation</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`const isValid = sdk.utils.isValidAddress('0x123...');
console.log(isValid); // false

const checksum = sdk.utils.toChecksumAddress('0xabc...');
console.log(checksum); // 0xAbC...`}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Decimal Handling</h3>
                    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                            {`// Convert value with 6 decimals (e.g., USDC)
const value = sdk.utils.toDecimals('100', 6);
console.log(value); // 100000000`}
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
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">toWei(ether)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Converts Ether string to Wei string.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">fromWei(wei)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Converts Wei string to Ether string.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">isValidAddress(addr)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Checks if a string is a valid Ethereum address.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[#e93b6c]">toDecimals(val, dec)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Converts a value to its smallest unit based on decimals.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
