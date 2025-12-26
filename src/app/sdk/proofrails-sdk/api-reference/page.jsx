import { CodeBlock } from "@/components/proofrails/CodeBlock";


export default function ApiReference() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">API Reference</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Complete type definitions for the SDK.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>SDKReceipt</h3>
                <CodeBlock code={`interface SDKReceipt {
  id: string;
  projectId: string;
  type: string;
  status: 'pending' | 'anchored' | 'failed';
  amount: string;
  currency: string;
  sender: string;
  receiver: string;
  reference: string;
  transactionHash: string;
  blockNumber?: number;
  timestamp?: number;
  metadata: Record<string, any>;
  createdAt: string;
}`} language="typescript" />

                <h3>VerificationResult</h3>
                <CodeBlock code={`interface VerificationResult {
  isValid: boolean;
  status: 'anchored' | 'pending' | 'failed' | 'not_found';
  blockNumber?: number;
  timestamp?: string;
  merkleRoot?: string;
  error?: string;
}`} language="typescript" />

                <h3>ProofRailsError</h3>
                <CodeBlock code={`class ProofRailsError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}`} language="typescript" />
            </div>
        </div>
    );
}
