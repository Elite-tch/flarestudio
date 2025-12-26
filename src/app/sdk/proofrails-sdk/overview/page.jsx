import Link from 'next/link';
import { ArrowRight, Shield, Globe, code } from 'lucide-react';
import { CodeBlock } from '@/components/proofrails/CodeBlock';
export default function Overview() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-[#e93b6c] mb-4 inline-block">
                    ProofRails SDK
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                    The banking-standard receipt generation layer for blockchain payments.
                </p>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">Quick Imports</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Import components and hooks directly from the package:
                </p>
                <CodeBlock language="typescript" code={`// React Hooks & Components
import { 
  useProofRails, 
  useProofRailsPayment, 
  useProofRailsForm, 
  useReceiptDetails, 
  useReceiptsList, 
  useCreateProject, 
  useRateLimitInfo
} from '@proofrails/sdk/react';

// Core SDK
import { ProofRails } from '@proofrails/sdk';`} />
            </div>

            <div className="p-6 bg-[#fff1f3] border border-purple-100 dark:border-purple-800/30 rounded-2xl">
                <h3 className="text-lg font-semibold text-[#943745] mb-2">
                    Why ProofRails?
                </h3>
                <p className="text-[#943745] ">
                    Sending tokens is easy. Proving it to a bank, auditor, or government is hard.
                    ProofRails bridges this gap by generating **ISO 20022 compliant receipts** for every blockchain transaction,
                    anchored permanently on the Flare network.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border bg-[#fff1f3]">
                    <Shield className="w-8 h-8 text-[#e93b6c] mb-4" />
                    <h3 className="text-lg font-bold mb-2">Banking Grade</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Receipts follow PAIN.001 and CAMT.053 standards used by SWIFT and SEPA.
                    </p>
                </div>
                <div className="p-6 rounded-2xl border bg-[#fff1f3]">
                    <Globe className="w-8 h-8 text-[#e93b6c] mb-4" />
                    <h3 className="text-lg font-bold mb-2">Universal Verification</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Anyone can verify a receipt's authenticity without needing your API keys.
                    </p>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        <span><strong>Zero Config:</strong> Auto-detects network (Mainnet/Testnet) from user's wallet.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <span><strong>Production Ready:</strong> Built-in retries, rate limiting, and failover protection.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#e93b6c] flex-shrink-0" />
                        <span><strong>Framework Agnostic:</strong> Works with React, Next.js, Node.js, and vanilla JS.</span>
                    </li>
                </ul>
            </div>

            <div className="flex justify-end pt-8">
                <Link
                    href="/docs/getting-started"
                    className="flex items-center gap-2 text-[#e93b6c] font-semibold hover:gap-3 transition-all"
                >
                    Get Started <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
}
