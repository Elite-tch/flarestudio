"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * ErrorMessage Component
 * Displays error messages with retry functionality
 * @param {string} message - Error message to display
 * @param {function} onRetry - Optional retry callback
 */
export function ErrorMessage({ message = "Something went wrong", onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
            <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </Button>
            )}
        </div>
    )
}
