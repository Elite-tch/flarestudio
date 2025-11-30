"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { HistoricalCharts } from "./HistoricalCharts"
import { PerformanceMetrics } from "./PerformanceMetrics"
import { MarketIntelligence } from "./MarketIntelligence"
// { TierBadge } from "../shared/TierBadge"

/**
 * FTSOAnalytics Component
 * Main container for all FTSO analytics features
 */
export function FTSOAnalytics() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">FTSO Analytics Dashboard</h2>
                    <p className="text-gray-600 mt-2">
                        Advanced price feed analytics, performance monitoring, and market intelligence
                    </p>
                </div>
                 {/*     <TierBadge tier="pro" /> */}
            </div>

            {/* Tabs for Sub-Features */}
            <Tabs defaultValue="historical" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-10 md:mb-2 md:grid-cols-3 bg-white border border-gray-200">
                    <TabsTrigger value="historical">Historical Data</TabsTrigger>
                    <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                    <TabsTrigger value="intelligence">Market Intelligence</TabsTrigger>
                </TabsList>

                <TabsContent value="historical" className="mt-6">
                    <HistoricalCharts />
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                    <PerformanceMetrics />
                </TabsContent>

                <TabsContent value="intelligence" className="mt-6">
                    <MarketIntelligence />
                </TabsContent>
            </Tabs>
        </div>
    )
}
