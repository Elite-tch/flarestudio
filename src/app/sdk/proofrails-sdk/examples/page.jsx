import Link from 'next/link';
import { ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';

export default function Examples() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Examples</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Real-world integration scenarios.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Link
                    href="/docs/examples/payment-dapp"
                    className="group block p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-lg transition-all"
                >
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                        <CreditCard size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">Payment dApp</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        A simple React application that allows users to connect their wallet and send a payment with a receipt.
                    </p>
                    <div className="flex items-center text-sm font-semibold text-purple-600">
                        View Example <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <Link
                    href="/docs/examples/ecommerce"
                    className="group block p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">E-commerce Integration</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        How to integrate ProofRails into a checkout flow to generate receipts for customer purchases.
                    </p>
                    <div className="flex items-center text-sm font-semibold text-blue-600">
                        View Example <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
