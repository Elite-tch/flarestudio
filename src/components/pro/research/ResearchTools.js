"use client"

import { TierBadge } from "../shared/TierBadge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TrendingUp, BarChart3 } from "lucide-react"

/**
 * ResearchTools Component
 * Strategy backtesting and market research
 */
export function ResearchTools() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Research & Backtesting Tools</h2>
                    <p className="text-gray-600 mt-2">
                        Advanced analytics for serious traders and researchers
                    </p>
                </div>
                <TierBadge tier="enterprise" size="lg" />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="backtesting" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                    <TabsTrigger value="backtesting">Strategy Backtesting</TabsTrigger>
                    <TabsTrigger value="research">Market Research</TabsTrigger>
                </TabsList>

                <TabsContent value="backtesting" className="mt-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-12 border-2 border-purple-200 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Strategy Backtesting</h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Test your FTSO-based trading strategies against historical data. Analyze performance metrics, risk factors, and optimize your approach before going live.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <div className="text-sm text-gray-600 mb-1">Historical Simulation</div>
                                <div className="text-lg font-semibold text-gray-900">Up to 1 year</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <div className="text-sm text-gray-600 mb-1">Performance Metrics</div>
                                <div className="text-lg font-semibold text-gray-900">Sharpe, Sortino, Max DD</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <div className="text-sm text-gray-600 mb-1">Risk Analysis</div>
                                <div className="text-lg font-semibold text-gray-900">VaR, CVaR, Beta</div>
                            </div>
                        </div>
                        <TierBadge tier="enterprise" size="lg" />
                        <p className="text-sm text-gray-600 mt-4">
                            Available exclusively in Enterprise tier
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="research" className="mt-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-12 border-2 border-purple-200 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Market Research Tools</h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Advanced statistical analysis, custom data queries, correlation studies, and ML-powered trend forecasting for deep market insights.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <div className="text-sm text-gray-600 mb-1">Custom Queries</div>
                                <div className="text-lg font-semibold text-gray-900">SQL & GraphQL</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <div className="text-sm text-gray-600 mb-1">Statistical Tools</div>
                                <div className="text-lg font-semibold text-gray-900">Regression, PCA, etc.</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <div className="text-sm text-gray-600 mb-1">ML Forecasting</div>
                                <div className="text-lg font-semibold text-gray-900">LSTM, ARIMA</div>
                            </div>
                        </div>
                        <TierBadge tier="enterprise" size="lg" />
                        <p className="text-sm text-gray-600 mt-4">
                            Available exclusively in Enterprise tier
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
