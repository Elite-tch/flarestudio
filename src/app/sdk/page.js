'use client'
import { useState } from "react";
import Link from 'next/link';
import { ArrowRight, Code, Check, Copy } from 'lucide-react';


export default function Home() {
    return (
        <main className="min-h-screen  bg-[#ffe4e8]">
         {/* Hero Section */}
            <section className="md:pt-32 pt-28 pb-20 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <h1 className="text-3xl md:text-4xl  text-[#e93b6c] font-bold mb-4 tracking-tight">
                        Flare Studios SDKs
                       
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 text-balance">
                        Powerful tools for building on the Flare Network. Choose the SDK that fits your needs.
                    </p>

                    {/* SDK Cards */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <SDKCard
                            title="Flare SDK"
                            description="A JavaScript SDK for interacting with Flare Network protocols. Access FTSO price feeds, verify Data Connector attestations, manage wallets, handle staking, and work with fAssets."
                            npmPackage="@flarestudio/flare-sdk"
                            href="/sdk/flare-sdk"
                        />
                        <SDKCard
                            title="ProofRails SDK"
                            description="The banking-standard receipt generation layer for blockchain payments. Generate ISO 20022 compliant receipts for every blockchain transaction, anchored permanently on the Flare network."
                            npmPackage="@proofrails/sdk"
                            href="/sdk/proofrails-sdk/overview"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

function SDKCard({ title, description, npmPackage, href }) {

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(`npm install ${npmPackage}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
    };

    return (
        <div className="p-8 rounded-2xl bg-[#fff1f3]  border border-slate-200  hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl text-[#e93b6c] flex items-center justify-center  mb-6">
                <Code size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-left">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-left mb-6 leading-relaxed">
                {description}
            </p>
            <div className="mb-6">
                <p className="text-sm text-left font-medium text-slate-700 dark:text-slate-300 mb-2">Installation</p>
                <div
                    onClick={handleCopy}
                    className="bg-slate-900 text-left rounded-lg p-4 font-mono text-sm text-slate-300 cursor-pointer flex justify-between items-center"
                >
                    <code>npm install {npmPackage}</code>
                    {copied ? (
                        <Check size={16} className="text-green-400 ml-2" />
                    ) : (
                        <Copy size={16} className="text-slate-300 ml-2" />
                    )}
                </div>
            </div>
            <Link
                href={href}
                className="inline-flex items-center text-sm gap-2 px-6 py-3 rounded-lg bg-[#e93b6c] text-white font-semibold hover:opacity-90 transition-opacity"
            >
                View Docs <ArrowRight size={18} />
            </Link>
        </div>
    );
}
