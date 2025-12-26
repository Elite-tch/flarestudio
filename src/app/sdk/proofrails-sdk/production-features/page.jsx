import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function ProductionFeatures() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Production Features</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Built-in reliability for enterprise-grade applications.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Automatic Retries</h3>
                <p>
                    The SDK automatically handles transient failures using exponential backoff.
                    It retries on:
                </p>
                <ul>
                    <li>Network connection errors</li>
                    <li>5xx Server Errors</li>
                    <li>429 Rate Limit errors</li>
                </ul>
                <CodeBlock code={`// Configure retries
const sdk = new ProofRails({
  apiKey: "...",
  retries: 5,        // Max attempts
  retryDelay: 1000   // Initial delay (1s, 2s, 4s...)
});`} />

                <h3>Rate Limiting</h3>
                <p>
                    The SDK respects API rate limits and tracks your usage automatically.
                    It reads headers from the response to update local state.
                </p>
                <CodeBlock code={`const info = sdk.client.getRateLimitInfo();

if (info) {
  console.log(\`Remaining: \${info.remaining}\`);
  console.log(\`Resets at: \${info.resetDate}\`);
}`} />
            </div>
        </div>
    );
}
