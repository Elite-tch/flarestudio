import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function Statements() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">ISO 20022 Statements</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Generate banking-standard reconciliation reports.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Intraday Statement (CAMT.052)</h3>
                <p>
                    Generates a report of transactions for the current day up to the present moment.
                </p>
                <CodeBlock code={`const xml = await sdk.statements.intraday({
  accountId: "0xWalletAddress..."
});

// Returns XML string
console.log(xml);`} />

                <h3>End of Day Statement (CAMT.053)</h3>
                <p>
                    Generates a finalized report for a specific past date.
                </p>
                <CodeBlock code={`const xml = await sdk.statements.endOfDay({
  date: "2024-12-25",
  accountId: "0xWalletAddress..."
});`} />
            </div>
        </div>
    );
}
