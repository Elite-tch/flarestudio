import { CodeBlock } from "@/components/proofrails/CodeBlock";
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function GettingStarted() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-4">Getting Started</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          From zero to blockchain receipt in less than 5 minutes.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert">
        <h3 className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e93b6c] text-white text-sm font-bold">1</span>
          Install the SDK
        </h3>
        <p>Install the package using your preferred package manager.</p>
        <CodeBlock code="npm install @proofrails/sdk Viem" language="bash" />

        <h3 className="flex items-center gap-3 mt-12">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e93b6c] text-white text-sm font-bold">2</span>
          Get your API Key
        </h3>
        <p>
          Go to the <Link href="/proofrails-sdk/create-api-key" className="text-[#e93b6c] hover:underline">Developer Dashboard</Link>,
          connect your wallet, and create a new project. You can choose between
          <strong> Coston2 (Testnet)</strong> or <strong>Flare (Mainnet)</strong>.
        </p>

        <h3 className="flex items-center gap-3 mt-12">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e93b6c] text-white text-sm font-bold">3</span>
          Initialize & Send
        </h3>
        <p>
          The easiest way to use ProofRails is with our React hooks. They handle wallet connection,
          network detection, and error handling for you.
        </p>

        <CodeBlock code={`import { useProofRails, useProofRailsPayment } from '@proofrails/sdk/react';

function PaymentButton() {
  // 1. Initialize SDK
  const sdk = useProofRails({
    apiKey: process.env.NEXT_PUBLIC_PROOFRAILS_KEY
  });

  // 2. Use Payment Hook
  const { send, loading, error, receipt } = useProofRailsPayment(sdk);

  const handlePayment = async () => {
    try {
      await send({
        amount: "100",           // Amount in tokens
        to: "0x123...",          // Recipient Address
        purpose: "Web Design"    // Payment Purpose
      });
      // ✅ Receipt created!
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay 100 FLR'}
    </button>
  );
}`} />
      </div>

      <div className="flex justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/docs/overview"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#e93b6c] transition-colors"
        >
          <ArrowLeft size={20} /> Overview
        </Link>
        <Link
          href="/docs/client-configuration"
          className="flex items-center gap-2 text-[#e93b6c] font-semibold hover:gap-3 transition-all"
        >
          Client Configuration <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
