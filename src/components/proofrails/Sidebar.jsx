'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Home, Key, Database, Shield, BookOpen, Activity, Box } from 'lucide-react';

const navigation = [
    { name: 'Overview', href: '/sdk/proofrails-sdk/overview', icon: Home },
    { name: 'Getting Started', href: '/sdk/proofrails-sdk/getting-started', icon: Box },
    { name: 'Create API Key', href: '/sdk/proofrails-sdk/create-api-key', icon: Key },
    {
        name: 'Core SDK',
        icon: Database,
        children: [
            { name: 'Client & Configuration', href: '/sdk/proofrails-sdk/client-configuration' },
            { name: 'Network Support', href: '/sdk/proofrails-sdk/network-support' },
        ]
    },
    {
        name: 'Receipts',
        icon: BookOpen,
        children: [
            { name: 'Receipt Operations', href: '/sdk/proofrails-sdk/receipt-operations' },
            { name: 'Receipt Templates', href: '/sdk/proofrails-sdk/receipt-templates' },
            { name: 'Verification', href: '/sdk/proofrails-sdk/verification' },
        ]
    },
    {
        name: 'Project & Admin',
        icon: Key,
        children: [
            { name: 'Project Management', href: '/sdk/proofrails-sdk/project-management' },
            { name: 'Statements', href: '/sdk/proofrails-sdk/statements' },
        ]
    },
    {
        name: 'Tools & Utilities',
        icon: Activity,
        children: [
            { name: 'Embeds & Events', href: '/sdk/proofrails-sdk/embeds-events' },
            { name: 'React Hooks', href: '/sdk/proofrails-sdk/react-hooks' },
            { name: 'Validation', href: '/sdk/proofrails-sdk/validation' },
            { name: 'Chain Utilities', href: '/sdk/proofrails-sdk/chain-utilities' },
            { name: 'TypeScript & Types', href: '/sdk/proofrails-sdk/typescript-types' },
        ]
    },
    {
        name: 'Advanced',
        icon: Shield,
        children: [
            { name: 'Error Handling', href: '/sdk/proofrails-sdk/error-handling' },
            { name: 'Production Features', href: '/sdk/proofrails-sdk/production-features' },
        ]
    },
    { name: 'API Reference', href: '/sdk/proofrails-sdk/api-reference', icon: Box },
    {
        name: 'Examples',
        icon: Box,
        children: [
            { name: 'Overview', href: '/sdk/proofrails-sdk/examples' },
            { name: 'Payment dApp', href: '/sdk/proofrails-sdk/examples/payment-dapp' },
            { name: 'E-commerce', href: '/sdk/proofrails-sdk/examples/ecommerce' },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (name) => {
        setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
    };

    // Auto-expand active sections
    useEffect(() => {
        const initialExpanded = {};
        navigation.forEach(item => {
            if (item.children) {
                if (item.children.some(child => pathname === child.href)) {
                    initialExpanded[item.name] = true;
                }
            }
        });
        setExpanded(initialExpanded);
    }, [pathname]);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed bottom-4 right-4 z-50 p-2 bg-[#e93b6c] text-white rounded-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed top-0 left-0 h-screen pt-8 w-64 bg-[#fff1f3] border-r 
        transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block md:sticky md:top-0 md:h-[calc(100vh-0px)] md:self-start
      `}>
                <div className="p-6 mt-14">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-[#e93b6c]">
                            ProofRails SDK
                        </span>
                    </Link>

                    <nav className="space-y-1">
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.children ? (
                                    <div>
                                        <button
                                            onClick={() => toggleExpand(item.name)}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-[#ffe4e8] transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={18} />
                                                {item.name}
                                            </div>
                                            {expanded[item.name] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        </button>
                                        {expanded[item.name] && (
                                            <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-800">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={`
                              block px-3 py-1.5 text-sm transition-colors border-l-2 -ml-[1px]
                              ${pathname === child.href
                                                                ? 'border-[#e93b6c] text-[#e93b6c]  font-medium'
                                                                : 'border-[#ffe4e8] text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                                            }
                            `}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`
                      flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${pathname === item.href
                                                ? ' text-[#e93b6c] bg-[#fff1f3]'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-[#ffe4e8] '
                                            }
                    `}
                                    >
                                        <item.icon size={18} />
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}
