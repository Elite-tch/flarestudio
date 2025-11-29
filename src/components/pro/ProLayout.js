"use client"

import { ProSidebar } from "./ProSidebar"

/**
 * ProLayout Component
 * Main layout wrapper for Pro features with sidebar
 * @param {React.ReactNode} children - Content to display
 * @param {string} activeFeature - Currently active feature
 * @param {function} onFeatureChange - Callback when feature changes
 */
export function ProLayout({ children, activeFeature, onFeatureChange }) {
    return (
        <div className="flex min-h-screen bg-[#ffe4e8] pt-20">
            {/* Sidebar */}
            <ProSidebar
                activeFeature={activeFeature}
                onFeatureChange={onFeatureChange}
            />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 overflow-x-hidden">
                <div className="container mx-auto px-4 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
