import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function PaymentDApp() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Payment dApp Example</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    A complete Single Page Application (SPA) for sending payments.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Full Code</h3>
                <p>
                    This example uses `wagmi` for wallet connection and ProofRails SDK for the payment logic.
                </p>
                <CodeBlock code={`import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProofRails, useProofRailsPayment } from '@proofrails/sdk/react';
import { useState } from 'react';

export default function PaymentPage() {
  const { isConnected } = useAccount();
  
  // 1. Initialize SDK
  const sdk = useProofRails({
    apiKey: process.env.NEXT_PUBLIC_PROOFRAILS_KEY,
    network: 'auto' // Auto-detect from wallet
  });

  // 2. Use Payment Hook
  const { send, loading, error, receipt, txHash } = useProofRailsPayment(sdk);
  
  const [amount, setAmount] = useState('');
  const [to, setTo] = useState('');

  const handleSend = async () => {
    try {
      await send({
        amount,
        to,
        purpose: "Peer Payment"
      });
      alert("Payment Successful!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!isConnected) return <ConnectButton />;

  return (
    <div className="p-8 max-w-md mx-auto border rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Send Crypto</h1>
      
      {receipt ? (
        <div className="bg-green-50 p-4 rounded-lg text-green-800">
          ✅ Receipt Created!
          <br/>
          ID: {receipt.id}
        </div>
      ) : (
        <div className="space-y-4">
          <input
            placeholder="Recipient Address (0x...)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send Payment'}
          </button>
        </div>
      )}
    </div>
  );
}`} />
            </div>
        </div>
    );
}
