import { CodeBlock } from "@/components/proofrails/CodeBlock";
import Link from 'next/link';

export default function ClientConfiguration() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Client & Configuration</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Configuring the ProofRails SDK for your specific needs.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Initialization</h3>
                <p>
                    The `ProofRails` class is the entry point for the SDK. You can configure it with your API key
                    and other optional settings.
                </p>

                <CodeBlock code={`import ProofRails from '@proofrails/sdk';

// Basic Initialization
const sdk = new ProofRails({
  apiKey: "pr_live_abcdef123456"
});

// Advanced Initialization
const sdk = new ProofRails({
  apiKey: "pr_test_abcdef123456",
  network: "coston2", // Force testnet
  timeout: 60000,     // 60s timeout
  retries: 5,         // Retry failed requests 5 times
  retryDelay: 2000    // Wait 2s between retries
});`} />

                <h3>Configuration Options</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800">
                                <th className="py-3 px-4">Option</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Default</th>
                                <th className="py-3 px-4">Description</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                <td className="py-3 px-4 font-mono text-purple-600">apiKey</td>
                                <td className="py-3 px-4 font-mono text-slate-500">string</td>
                                <td className="py-3 px-4 text-slate-500">-</td>
                                <td className="py-3 px-4">Your project API Key (required).</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                <td className="py-3 px-4 font-mono text-purple-600">network</td>
                                <td className="py-3 px-4 font-mono text-slate-500">'coston2' | 'flare'</td>
                                <td className="py-3 px-4 text-slate-500">Auto</td>
                                <td className="py-3 px-4">Network to use. Defaults to auto-detection from wallet.</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                <td className="py-3 px-4 font-mono text-purple-600">retries</td>
                                <td className="py-3 px-4 font-mono text-slate-500">number</td>
                                <td className="py-3 px-4 text-slate-500">3</td>
                                <td className="py-3 px-4">Number of times to retry failed requests.</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                <td className="py-3 px-4 font-mono text-purple-600">timeout</td>
                                <td className="py-3 px-4 font-mono text-slate-500">number</td>
                                <td className="py-3 px-4 text-slate-500">30000</td>
                                <td className="py-3 px-4">Request timeout in milliseconds.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Environment Variables</h3>
                <p>
                    In Next.js applications, you can use environment variables to keep your keys secure.
                    Remember to prefix with `NEXT_PUBLIC_` if you use them on the client side.
                </p>
                <CodeBlock code={`# .env.local
NEXT_PUBLIC_PROOFRAILS_API_KEY=pr_live_...`} language="bash" />
            </div>
        </div>
    );
}
