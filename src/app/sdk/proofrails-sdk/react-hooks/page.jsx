import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function ReactHooks() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-4">React Hooks</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    The easiest way to integrate ProofRails into React/Next.js applications.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>useProofRails</h3>
                <p>Initialize the SDK client.</p>
                <CodeBlock code={`const sdk = useProofRails({ apiKey: "..." });`} />

                <h3>useProofRailsPayment</h3>
                <p>Send payments with auto-detection and validation.</p>
                <CodeBlock code={`const { send, loading, error, receipt, txHash } = useProofRailsPayment(sdk);

await send({
  amount: "1.5",
  to: "0x...",
  purpose: "Services"
});`} />

                <h3>useProofRailsForm</h3>
                <p>Manage form state with auto-save to localStorage.</p>
                <CodeBlock code={`const { 
  apiKey, setApiKey,
  recipient, setRecipient,
  amount, setAmount,
  purpose, setPurpose,
  resetForm
} = useProofRailsForm();

// Auto-saves API key to browser storage`} />

                <h3>useCreateProject</h3>
                <p>Programmatically create new projects.</p>
                <CodeBlock code={`const { create, loading } = useCreateProject();
const { apiKey, projectId } = await create("My New Project", "flare");`} />

                <h3>useReceiptDetails</h3>
                <p>Fetch and verify a single receipt.</p>
                <CodeBlock code={`const { fetch, receipt, loading, error } = useReceiptDetails(sdk);

await fetch(receiptId);
console.log(receipt.valid); // true/false`} />

                <h3>useReceiptsList</h3>
                <p>Fetch paginated list of receipts.</p>
                <CodeBlock code={`const { fetch, receipts, loading, error } = useReceiptsList(sdk);

await fetch({ limit: 10, status: 'anchored' });
console.log(receipts); // Array of receipts`} />

                <h3>useRateLimitInfo</h3>
                <p>Monitor your API usage in real-time.</p>
                <CodeBlock code={`const info = useRateLimitInfo(sdk);
// info = { limit: 1000, remaining: 950, reset: 1234567890 }`} />
            </div>
        </div>
    );
}
