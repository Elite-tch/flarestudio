import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function ReceiptOperations() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Receipt Operations</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Core functions for managing receipt lifecycle.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Create Receipt</h3>
                <p>Creates a new receipt. Usually, you'll use a template helper instead of calling this directly.</p>
                <CodeBlock code={`const receipt = await sdk.receipts.create({
  type: 'payment',
  data: { ... },
  chain: 'coston2'
});`} />

                <h3>Get Receipt</h3>
                <p>Retrieve a single receipt by its ID.</p>
                <CodeBlock code={`const receipt = await sdk.receipts.get('rec_123456789');
console.log(receipt.status); // 'anchored'`} />

                <h3>List Receipts</h3>
                <p>List receipts with pagination and filtering.</p>
                <CodeBlock code={`const { items, total } = await sdk.receipts.list({
  limit: 10,
  page: 1,
  status: 'anchored'
});`} />

                <h3>Get Artifacts</h3>
                <p>Download the official ISO 20022 XML files.</p>
                <CodeBlock code={`const artifacts = await sdk.receipts.getArtifacts('rec_123456789');
// Returns { xml_url: "...", json_url: "..." }`} />
            </div>
        </div>
    );
}
