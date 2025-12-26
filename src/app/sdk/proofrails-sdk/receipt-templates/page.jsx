import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function ReceiptTemplates() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-4">Receipt Templates</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Pre-defined receipt structures for common financial scenarios.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <section id="payment" className="scroll-mt-20">
                    <h2>Payment Receipt</h2>
                    <p>Standard receipt for goods or services. Maps to ISO 20022 <code>pacs.008</code>.</p>
                    <CodeBlock code={`const receipt = await sdk.templates.payment({
  amount: 100.50,
  from: "0xSender...",
  to: "0xReceiver...",
  purpose: "Invoice #1024",
  transactionHash: "0xTxHash..."
});`} />
                </section>

                <section id="donation" className="scroll-mt-20 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h2>Donation Receipt</h2>
                    <p>For charitable contributions. Includes donor info.</p>
                    <CodeBlock code={`const receipt = await sdk.templates.donation({
  amount: 500,
  donor: "0xDonor...",
  charity: "0xCharity...",
  campaign: "Save the Whales",
  transactionHash: "0xTxHash..."
});`} />
                </section>

                <section id="escrow" className="scroll-mt-20 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h2>Escrow Release</h2>
                    <p>Proof of funds released from an escrow contract.</p>
                    <CodeBlock code={`const receipt = await sdk.templates.escrow({
  amount: 1000,
  beneficiary: "0xSeller...",
  contract: "0xEscrowContract...",
  condition: "Delivery Verified",
  transactionHash: "0xTxHash..."
});`} />
                </section>

                <section id="grant" className="scroll-mt-20 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h2>Grant Support</h2>
                    <p>For grant disbursements and tracking.</p>
                    <CodeBlock code={`const receipt = await sdk.templates.grant({
  amount: 5000,
  grantee: "0xGrantee...",
  program: "DeFi Accelerator 2024",
  milestone: "MVP Launch",
  transactionHash: "0xTxHash..."
});`} />
                </section>

                <section id="refund" className="scroll-mt-20 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h2>Refund</h2>
                    <p>Proof of returned funds.</p>
                    <CodeBlock code={`const receipt = await sdk.templates.refund({
  amount: 50,
  originalReceiptId: "rec_original_123",
  reason: "Item out of stock",
  to: "0xCustomer...",
  transactionHash: "0xTxHash..."
});`} />
                </section>
            </div>
        </div>
    );
}
