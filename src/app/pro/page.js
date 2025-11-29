"use client"

import { useState } from "react"
import { ProLayout } from "@/components/pro/ProLayout"
import { FTSOAnalytics } from "@/components/pro/ftso-analytics/FTSOAnalytics"
import { FDCAnalytics } from "@/components/pro/fdc-analytics/FDCAnalytics"
//import { NetworkAnalytics } from "@/components/pro/network-analytics/NetworkAnalytics"
import { DeveloperTools } from "@/components/pro/developer-tools/DeveloperTools"
import { PortfolioTracking } from "@/components/pro/portfolio/PortfolioTracking"
import { ResearchTools } from "@/components/pro/research/ResearchTools"
import { PremiumSupport } from "@/components/pro/support/PremiumSupport"

/**
 * Pro Page
 * Main FlareStudio Pro dashboard with all premium features
 */
export default function ProPage() {
    const [activeFeature, setActiveFeature] = useState("ftso-analytics")

    // Render the active feature component
    const renderFeature = () => {
        switch (activeFeature) {
            case "ftso-analytics":
                return <FTSOAnalytics />
            case "fdc-analytics":
                return <FDCAnalytics />
           { /*  case "network-analytics":
                return <NetworkAnalytics /> */}
            case "developer-tools":
                return <DeveloperTools />
            case "portfolio":
                return <PortfolioTracking />
            case "research":
                return <ResearchTools />
            case "support":
                return <PremiumSupport />
            default:
                return <FTSOAnalytics />
        }
    }

    return (
        <ProLayout activeFeature={activeFeature} onFeatureChange={setActiveFeature}>
            {renderFeature()}
        </ProLayout>
    )
}
