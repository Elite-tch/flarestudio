"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    BarChart3,
    Database,
    Code,
    Wallet,
    Menu,
    X,
    ChevronRight,
} from "lucide-react"

export function ProSidebar({ activeFeature, onFeatureChange }) {
    const [isOpen, setIsOpen] = useState(false)

    const features = [
        {
            id: "ftso-analytics",
            name: "FTSO Analytics",
            icon: BarChart3,
            tier: "pro",
            description: "Advanced price feed analytics",
        },
        {
            id: "fdc-analytics",
            name: "FDC Analytics",
            icon: Database,
            tier: "pro",
            description: "Attestation monitoring and insights",
        },
        {
            id: "developer-tools",
            name: "Developer Tools",
            icon: Code,
            tier: "pro",
            description: "API access and data export",
        },
        {
            id: "portfolio",
            name: "Portfolio Tracking",
            icon: Wallet,
            tier: "pro",
            description: "Multi wallet dashboard",
        },
    ]

    useEffect(() => {
        const saved = localStorage.getItem("activeFeature")
        if (saved) {
            onFeatureChange(saved)
        }
    }, [])

    const handleFeatureClick = (featureId) => {
        localStorage.setItem("activeFeature", featureId)
        onFeatureChange(featureId)
        setIsOpen(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-40
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    w-72 overflow-y-auto scrollbar-none
                `}
            >
                <div className="p-6 border-b border-gray-200">
                    <Link href="/" className="flex items-center gap-2 text-[#e93b6c] hover:text-[#d12d5a] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4">
                        FlareStudio <span className="text-[#e93b6c]">Pro</span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Advanced analytics and tools
                    </p>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {features.map((feature) => {
                            const Icon = feature.icon
                            const isActive = activeFeature === feature.id

                            return (
                                <li key={feature.id}>
                                    <button
                                        onClick={() => handleFeatureClick(feature.id)}
                                        className={`
                                            w-full flex items-start gap-3 p-3 rounded-lg transition-all
                                            ${
                                                isActive
                                                    ? "bg-[#ffe4e8] text-[#e93b6c] shadow-sm"
                                                    : "hover:bg-gray-50 text-gray-700"
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? "text-[#e93b6c]" : "text-gray-500"}`} />
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-sm">{feature.name}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {feature.description}
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200 mt-auto">
                    <div className="bg-gradient-to-r from-[#ffe4e8] to-[#fff1f3] rounded-lg p-4">
                        <h3 className="font-semibold text-sm text-gray-900 mb-2">
                            Upgrade to Pro
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                            Unlock advanced analytics, unlimited API access and premium support.
                        </p>
                        <button className="w-full bg-[#e93b6c] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-[#d12d5a] transition-colors">
                            Coming Soon
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
