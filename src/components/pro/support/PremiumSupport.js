"use client"

import { TierBadge } from "../shared/TierBadge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { HeadphonesIcon, BookOpen, MessageCircle, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * PremiumSupport Component
 * Priority support and exclusive content
 */
export function PremiumSupport() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Premium Support & Resources</h2>
                    <p className="text-gray-600 mt-2">
                        Priority support and exclusive educational content
                    </p>
                </div>
                <TierBadge tier="enterprise" size="lg" />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="support" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                    <TabsTrigger value="support">Priority Support</TabsTrigger>
                    <TabsTrigger value="content">Exclusive Content</TabsTrigger>
                </TabsList>

                <TabsContent value="support" className="mt-6 space-y-6">
                    {/* Support Tiers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="text-sm font-medium text-gray-600 mb-2">Free Tier</div>
                            <div className="text-xl font-bold text-gray-900 mb-4">Community Support</div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Discord community</li>
                                <li>• Public documentation</li>
                                <li>• Best effort response</li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border-2 border-[#e93b6c]">
                            <div className="text-sm font-medium text-[#e93b6c] mb-2">Pro Tier</div>
                            <div className="text-xl font-bold text-gray-900 mb-4">Email Support</div>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Email support channel</li>
                                <li>• 24-48 hour response</li>
                                <li>• Technical assistance</li>
                                <li>• Code review help</li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-500">
                            <div className="text-sm font-medium text-purple-600 mb-2">Enterprise Tier</div>
                            <div className="text-xl font-bold text-gray-900 mb-4">Priority Support</div>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Dedicated support channel</li>
                                <li>• 4-hour response SLA</li>
                                <li>• Technical consultation</li>
                                <li>• Architecture review</li>
                                <li>• Custom integrations</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <HeadphonesIcon className="w-5 h-5 text-[#e93b6c]" />
                            <h4 className="text-lg font-semibold text-gray-900">Contact Support</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                                <MessageCircle className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <div className="font-medium text-gray-900">Discord Community</div>
                                    <div className="text-sm text-gray-600 mt-1">Join our active community</div>
                                    <Button variant="outline" size="sm" className="mt-3">
                                        Join Discord
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                                <HeadphonesIcon className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <div className="font-medium text-gray-900">Email Support</div>
                                    <div className="text-sm text-gray-600 mt-1">support@flarestudio.xyz</div>
                                    <Button variant="outline" size="sm" className="mt-3">
                                        Send Email
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="content" className="mt-6 space-y-6">
                    {/* Exclusive Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-[#e93b6c]" />
                                <h4 className="text-lg font-semibold text-gray-900">Advanced Tutorials</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                In-depth guides on building production-ready dApps with FTSO and FDC
                            </p>
                            <div className="space-y-2">
                                {[
                                    "Building a DeFi Protocol with FTSO",
                                    "Advanced FDC Integration Patterns",
                                    "Optimizing Gas Costs on Flare",
                                    "Security Best Practices",
                                ].map((tutorial, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-sm text-gray-900">{tutorial}</span>
                                        <TierBadge tier="pro" size="sm" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Video className="w-5 h-5 text-[#e93b6c]" />
                                <h4 className="text-lg font-semibold text-gray-900">Monthly Webinars</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Live sessions with Flare experts and successful project founders
                            </p>
                            <div className="space-y-2">
                                {[
                                    { title: "FTSO Deep Dive", date: "Dec 15, 2024" },
                                    { title: "FDC Use Cases", date: "Jan 20, 2025" },
                                    { title: "Building on Flare", date: "Feb 10, 2025" },
                                ].map((webinar, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{webinar.title}</div>
                                            <div className="text-xs text-gray-500">{webinar.date}</div>
                                        </div>
                                        <TierBadge tier="enterprise" size="sm" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Case Studies */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Stories & Case Studies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: "DeFi Protocol", metric: "$10M TVL" },
                                { title: "NFT Marketplace", metric: "50K users" },
                                { title: "Oracle Service", metric: "1M requests/day" },
                            ].map((story, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="font-medium text-gray-900 mb-1">{story.title}</div>
                                    <div className="text-2xl font-bold text-[#e93b6c] mb-2">{story.metric}</div>
                                    <div className="text-xs text-gray-500">Read case study →</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
