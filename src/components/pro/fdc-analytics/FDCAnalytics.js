"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AttestationMonitor } from "./AttestationMonitor"
import { UsageInsights } from "./UsageInsights"
//import { TierBadge } from "../shared/TierBadge"
import { getRecentAttestations, subscribeToAttestations } from "@/lib/pro/fdcDataService"

/**
 * FDCAnalytics Component
 * Main container for all FDC analytics features
 * Manages real-time data state for child components
 */
export function FDCAnalytics() {
    const [attestations, setAttestations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let unsubscribe = () => { }

        const initData = async () => {
            try {
                setLoading(true)

                // 1. Fetch History (Last 2 hours - ~3,600 blocks at 2s/block)
                const history = await getRecentAttestations(3600)
                setAttestations(history)
                setLoading(false)

                // 2. Subscribe to Live Updates
                unsubscribe = await subscribeToAttestations((newAttestation) => {
                    setAttestations(prev => [newAttestation, ...prev])
                })

            } catch (err) {
                console.error("Failed to initialize FDC data:", err)
                setError("Failed to connect to Flare Network")
                setLoading(false)
            }
        }

        initData()

        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [])

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">FDC Analytics Dashboard</h2>
                    <p className="text-gray-600 mt-2">
                        Real-time attestation monitoring and usage insights
                    </p>
                </div>
               
            </div>

            {/* Tabs for Sub-Features */}
            <Tabs defaultValue="monitor" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                    <TabsTrigger value="monitor">Attestation Monitor</TabsTrigger>
                    <TabsTrigger value="insights">Usage Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="monitor" className="mt-6">
                    <AttestationMonitor
                        data={attestations}
                        loading={loading}
                        error={error}
                    />
                </TabsContent>

                <TabsContent value="insights" className="mt-6">
                    <UsageInsights
                        data={attestations}
                        loading={loading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
