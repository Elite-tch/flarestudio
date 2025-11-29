"use client"

import { Loader2 } from "lucide-react"

/**
 * LoadingSpinner Component
 * Reusable loading indicator with consistent styling
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} message - Optional loading message
 */
export function LoadingSpinner({ size = "md", message = "" }) {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 gap-3">
            <Loader2 className={`${sizes[size]} animate-spin text-[#e93b6c]`} />
            {message && (
                <p className="text-sm text-gray-600 animate-pulse">{message}</p>
            )}
        </div>
    )
}
