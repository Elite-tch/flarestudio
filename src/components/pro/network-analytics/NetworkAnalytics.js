"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { NetworkHealth } from "./NetworkHealth"
import { ContractAnalytics } from "./ContractAnalytics"
import { TierBadge } from "../shared/TierBadge"

/**
 * NetworkAnalytics Component
 * Main container for network analytics features
 */
export function NetworkAnalytics() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Network Analytics</h2>
                    <p className="text-gray-600 mt-2">
                        Real-time network monitoring and smart contract analytics
                    </p>
                </div>
                <TierBadge tier="free" size="lg" />
            </div>

            {/* Tabs for Sub-Features */}
            <Tabs defaultValue="health" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                    <TabsTrigger value="health">Network Health</TabsTrigger>
                    <TabsTrigger value="contracts">Contract Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="health" className="mt-6">
                    <NetworkHealth />
                </TabsContent>

                <TabsContent value="contracts" className="mt-6">
                    <ContractAnalytics />
                </TabsContent>
            </Tabs>
        </div>
    )
}
