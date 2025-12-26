import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function Validation() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-4">Input Validation</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Helpers to ensure data integrity before sending to the blockchain.
          All validators return <code>{`{ isValid: boolean, error?: string }`}</code>.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert">
        <h3>validateAddress</h3>
        <p>Checks if a string is a valid EVM address (format, checksum, length).</p>
        <CodeBlock code={`import { validateAddress } from '@proofrails/sdk';

const result = validateAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0b23e");
if (!result.isValid) console.error(result.error);`} />

        <h3>validateAmount</h3>
        <p>Checks if an amount is a valid positive number.</p>
        <CodeBlock code={`import { validateAmount } from '@proofrails/sdk';

validateAmount("100.50"); // true
validateAmount("-50");    // false (must be positive)
validateAmount("abc");    // false (must be number)`} />

        <h3>validateTransactionHash</h3>
        <p>Validates blockchain transaction hashes (length, prefix, hex).</p>
        <CodeBlock code={`import { validateTransactionHash } from '@proofrails/sdk';

const result = validateTransactionHash("0x123...");
// Checks 0x prefix and 66 char length`} />

        <h3>validateApiKey</h3>
        <p>Validates ProofRails API key format.</p>
        <CodeBlock code={`import { validateApiKey } from '@proofrails/sdk';

if (!validateApiKey(process.env.API_KEY).isValid) {
  throw new Error("Invalid API Configuration");
}`} />

        <h3>validatePurpose</h3>
        <p>Validates payment purpose text (length, non-empty).</p>
        <CodeBlock code={`import { validatePurpose } from '@proofrails/sdk';

// Max 500 characters, cannot be empty/whitespace only
validatePurpose("Invoice #123");`} />

        <h3>validatePayment</h3>
        <p>Validates all payment fields at once (amount, address, purpose, hash).</p>
        <CodeBlock code={`import { validatePayment } from '@proofrails/sdk';

const result = validatePayment({
  amount: "100",
  to: "0x...",
  purpose: "Services",
  transactionHash: "0x..." // Optional
});

if (!result.isValid) {
  console.error(result.error);
}`} />
      </div>
    </div>
  );
}
