import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function EmbedsEvents() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Embeds & Events</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Drop-in UI components and real-time updates.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Receipt Widget</h3>
                <p>
                    Embed an interactive receipt viewer in your application using an iframe.
                </p>
                <CodeBlock code={`const html = sdk.embed.widget('rec_123456789', {
  theme: 'dark',
  width: '100%',
  height: '600px'
});

// Use in React
<div dangerouslySetInnerHTML={{ __html: html }} />`} />

                <h3>Real-time Events</h3>
                <p>
                    Listen for receipt updates (e.g. when a receipt is anchored to the blockchain) using SSE.
                </p>
                <CodeBlock code={`const stop = sdk.events.listen({
  onReceiptAnchored: (receipt) => {
    console.log(\`Receipt \${receipt.id} is now anchored!\`);
  },
  onPaymentReceived: (data) => {
    console.log("New payment:", data);
  }
});

// Clean up
// stop();`} />
            </div>
        </div>
    );
}
