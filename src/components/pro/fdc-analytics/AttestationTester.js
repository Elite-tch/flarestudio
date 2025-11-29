"use client"

import { useState } from "react"
import { TierBadge } from "../shared/TierBadge"
import { Button } from "@/components/ui/button"
import { Play, Code, DollarSign } from "lucide-react"

/**
 * AttestationTester Component
 * Test attestation requests before deploying
 */
export function AttestationTester() {
    const [attestationType, setAttestationType] = useState("Payment")
    const [testResult, setTestResult] = useState(null)
    const [testing, setTesting] = useState(false)

    const attestationTypes = [
        "Payment",
        "BalanceDecreasingTransaction",
        "ConfirmedBlockHeightExists",
        "ReferencedPaymentNonexistence",
        "AddressValidity",
    ]

    const handleTest = async () => {
        setTesting(true)
        setTestResult(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Mock test result
        const mockResult = {
            success: Math.random() > 0.2,
            responseTime: Math.floor(Math.random() * 3000) + 500,
            gasEstimate: Math.floor(Math.random() * 100000) + 50000,
            proofGenerated: Math.random() > 0.3,
            message: Math.random() > 0.2
                ? "Attestation request successful"
                : "Failed to generate proof",
        }

        setTestResult(mockResult)
        setTesting(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Custom Attestation Testing</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Test attestation requests before deploying to production
                    </p>
                </div>
                <TierBadge tier="pro" />
            </div>

            {/* Test Form */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Configure Test</h4>

                <div className="space-y-4">
                    {/* Attestation Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attestation Type
                        </label>
                        <select
                            value={attestationType}
                            onChange={(e) => setAttestationType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e93b6c] focus:border-transparent"
                        >
                            {attestationTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Test Parameters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Test Parameters (JSON)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#e93b6c] focus:border-transparent"
                            rows={8}
                            placeholder={`{\n  "transactionHash": "0x...",\n  "sourceChain": "BTC",\n  "amount": "1000000"\n}`}
                            defaultValue={`{\n  "transactionHash": "0x1234567890abcdef",\n  "sourceChain": "BTC",\n  "amount": "1000000"\n}`}
                        />
                    </div>

                    {/* Test Button */}
                    <Button
                        onClick={handleTest}
                        disabled={testing}
                        className="w-full bg-[#e93b6c] hover:bg-[#d12d5a] text-white"
                    >
                        {testing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Testing...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Run Test
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Test Results */}
            {testResult && (
                <div className={`rounded-lg p-6 border-2 ${testResult.success
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-gray-600 text-sm mb-1">Status</div>
                            <div className={`text-lg font-semibold ${testResult.success ? "text-green-600" : "text-red-600"
                                }`}>
                                {testResult.success ? "Success" : "Failed"}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-gray-600 text-sm mb-1">Response Time</div>
                            <div className="text-lg font-semibold text-gray-900">
                                {testResult.responseTime}ms
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-gray-600 text-sm mb-1">Gas Estimate</div>
                            <div className="text-lg font-semibold text-gray-900">
                                {testResult.gasEstimate.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Message</span>
                        </div>
                        <p className="text-sm text-gray-900">{testResult.message}</p>
                    </div>

                    {testResult.proofGenerated && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Proof Data (Mock)</div>
                            <pre className="text-xs font-mono text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto">
                                {`{
  "merkleProof": ["0xabc...", "0xdef..."],
  "attestationData": "0x123...",
  "timestamp": ${Date.now()}
}`}
                            </pre>
                        </div>
                    )}
                </div>
            )}

            {/* Cost Estimation */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-[#e93b6c]" />
                    <h4 className="text-lg font-semibold text-gray-900">Cost Estimation</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Estimated Gas</div>
                        <div className="text-xl font-bold text-gray-900">~75,000</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Gas Price</div>
                        <div className="text-xl font-bold text-gray-900">25 Gwei</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Total Cost (FLR)</div>
                        <div className="text-xl font-bold text-[#e93b6c]">~0.002 FLR</div>
                    </div>
                </div>
            </div>

            {/* Proof Verification (Enterprise Feature) */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">Advanced Proof Verification</h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Verify attestation proofs and simulate on-chain verification
                        </p>
                    </div>
                    <TierBadge tier="enterprise" />
                </div>
                <p className="text-sm text-gray-600">
                    Test proof verification logic before deploying your smart contracts. Available in Enterprise tier.
                </p>
            </div>
        </div>
    )
}
