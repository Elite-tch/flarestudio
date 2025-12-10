"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronRight, Menu, X } from "lucide-react"

const sidebarItems = [
    {
        title: "Getting Started",
        items: [
            { name: "Introduction", href: "/docs" },
            { name: "Installation", href: "/docs/getting-started/installation" },
            { name: "Quick Start", href: "/docs/getting-started/quick-start" },
        ]
    },
    {
        title: "Modules",
        items: [
            { name: "FTSO (Price Feeds)", href: "/docs/modules/ftso" },
            { name: "FDC (Attestation)", href: "/docs/modules/fdc" },
            { name: "Wallet", href: "/docs/modules/wallet" },
            { name: "Staking", href: "/docs/modules/staking" },
            { name: "fAssets", href: "/docs/modules/fassets" },
            { name: "State Connector", href: "/docs/modules/state-connector" },
            { name: "Utils", href: "/docs/modules/utils" },
        ]
    },
    {
        title: "Guides",
        items: [
            { name: "Building a DeFi App", href: "/docs/guides/defi-app" },
            { name: "Bridging Assets", href: "/docs/guides/bridging" },
        ]
    }
]

export default function DocsLayout({ children }) {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <div className="flex min-h-screen pt-[80px]">
            {/* Mobile Sidebar Toggle */}
            <button
                className="md:hidden fixed bottom-4 right-4 z-50 bg-[#e93b6c] text-white p-3 rounded-full shadow-lg"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <aside className={`
        fixed md:sticky top-[80px] left-0 h-[calc(100vh-80px)] w-64 bg-white border-r overflow-y-auto transition-transform duration-300 z-40
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#e93b6c] mb-6">Flare SDK</h2>
                    <nav className="space-y-8">
                        {sidebarItems.map((section) => (
                            <div key={section.title}>
                                <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                                <ul className="space-y-2">
                                    {section.items.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    className={`flex items-center justify-between text-sm py-1 px-2 rounded transition-colors ${isActive
                                                            ? "text-[#e93b6c] bg-[#fff1f3] font-medium"
                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                        }`}
                                                    onClick={() => setIsMobileOpen(false)}
                                                >
                                                    {item.name}
                                                    {isActive && <ChevronRight size={14} />}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-[#fff1f3] min-w-0 px-4 md:px-12 py-8 pb-20">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
