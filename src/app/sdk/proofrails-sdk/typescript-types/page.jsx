import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function TypeScriptTypes() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">TypeScript Types</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Comprehensive reference for all exported TypeScript definitions.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Core Types</h3>
                <p>Primary data structures used throughout the SDK.</p>

                <h4>Receipt</h4>
                <CodeBlock language="typescript" code={`export interface Receipt {
  id: string;
  projectId: string;
  status: 'pending' | 'anchored' | 'failed';
  
  // Payment Details
  amount: number;
  currency: string;
  sender: string;
  receiver: string;
  purpose: string;
  reference?: string;
  
  // Blockchain Data
  transactionHash?: string; // The user's payment TX
  chain?: Network;
  
  // ProofRails Anchor Data
  anchorTx?: string;       // The anchoring TX on Flare
  blockNumber?: number;
  timestamp?: number;
  bundleHash?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}`} />

                <h4>Network</h4>
                <CodeBlock language="typescript" code={`export type Network = 'flare' | 'coston2';`} />

                <h3>Template Options</h3>
                <p>Input parameters for creating different types of receipts.</p>

                <h4>PaymentTemplateOptions</h4>
                <CodeBlock language="typescript" code={`export interface PaymentTemplateOptions {
  amount: number;
  from: string;    // Sender address
  to: string;      // Receiver address
  purpose: string; // Description of payment
  transactionHash: string;
  
  // Optional
  chain?: Network;
  currency?: string;
  metadata?: Record<string, any>;
}`} />

                <h4>DonationTemplateOptions</h4>
                <CodeBlock language="typescript" code={`export interface DonationTemplateOptions {
  amount: number;
  donor: string;
  organization: string;
  campaign?: string;
  transactionHash: string;
  
  // Optional
  chain?: Network;
  currency?: string;
}`} />

                <h3>Verification & Validation</h3>

                <h4>VerificationResult</h4>
                <CodeBlock language="typescript" code={`export interface VerificationResult {
  valid: boolean;
  onChain: boolean;
  timestamp?: number;
  anchorTx?: string;
  error?: string;
}`} />

                <h4>ValidationResult</h4>
                <CodeBlock language="typescript" code={`export interface ValidationResult {
  isValid: boolean;
  error?: string;
}`} />

                <h3>Error Handling</h3>

                <h4>ProofRailsError</h4>
                <CodeBlock language="typescript" code={`export class ProofRailsError extends Error {
  code: string;       // e.g. 'RATE_LIMIT_EXCEEDED'
  statusCode: number; // e.g. 429
  details?: any;
  
  constructor(message: string, code: string, statusCode: number, details?: any);
}`} />
            </div>
        </div>
    );
}
