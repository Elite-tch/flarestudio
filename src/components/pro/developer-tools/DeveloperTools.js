"use client"

import { APIAccess } from "./APIAccess"
//import { TierBadge } from "../shared/TierBadge"

/**
 * DeveloperTools Component
 * Flare Network RPC endpoints and developer resources
 */
export function DeveloperTools() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Developer Tools</h2>
                    <p className="text-gray-600 mt-2">
                        Flare Network RPC endpoints and developer resources
                    </p>
                </div>
                 {/*     <TierBadge tier="pro" /> */}
            </div>

            {/* Endpoints Content */}
            <APIAccess />
        </div>
    )
}
