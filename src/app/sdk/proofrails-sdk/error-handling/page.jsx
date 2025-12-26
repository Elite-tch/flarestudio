import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function ErrorHandling() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Error Handling</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Turn technical errors into user-friendly messages.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Friendly Errors</h3>
                <p>
                    The SDK includes a utility to convert raw errors (like EVM reverts or network failures)
                    into human-readable messages with solutions.
                </p>
                <CodeBlock code={`import { getFriendlyError } from '@proofrails/sdk';

try {
  await sdk.receipts.create(...);
} catch (err) {
  const friendly = getFriendlyError(err);
  
  console.log(friendly.title);    // "Insufficient Funds"
  console.log(friendly.message);  // "You don't have enough FLR..."
  console.log(friendly.solution); // "Add funds to your wallet..."
}`} />

                <h3>Formatted Display</h3>
                <p>Get a formatted string ready for UI display (toasts/alerts).</p>
                <CodeBlock code={`import { formatErrorForDisplay } from '@proofrails/sdk';

// Returns "Insufficient Funds: You don't have..."
alert(formatErrorForDisplay(err));`} />
            </div>
        </div>
    );
}
