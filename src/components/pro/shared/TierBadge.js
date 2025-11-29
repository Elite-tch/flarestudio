"use client"

import { Crown, Zap, Sparkles } from "lucide-react"

/**
 * TierBadge Component
 * Displays visual indicator for Free/Pro/Enterprise tiers
 * @param {string} tier - "free" | "pro" | "enterprise"
 * @param {string} size - "sm" | "md" | "lg"
 */
export function TierBadge({ tier = "free", size = "md" }) {
    const configs = {
        free: {
            label: "Free",
            icon: Sparkles,
            bgColor: "bg-gray-100",
            textColor: "text-gray-700",
            borderColor: "border-gray-300",
        },
        pro: {
            label: "Pro",
            icon: Zap,
            bgColor: "bg-pink-100",
            textColor: "text-[#e93b6c]",
            borderColor: "border-[#e93b6c]",
        },
        enterprise: {
            label: "Enterprise",
            icon: Crown,
            bgColor: "bg-purple-100",
            textColor: "text-purple-700",
            borderColor: "border-purple-500",
        },
    }

    const sizes = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-1.5",
    }

    const config = configs[tier.toLowerCase()] || configs.free
    const Icon = config.icon

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizes[size]} font-medium`}
        >
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    )
}
