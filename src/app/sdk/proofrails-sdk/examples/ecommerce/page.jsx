import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function Ecommerce() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">E-commerce Integration</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Generating receipts for checkout purchases.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Checkout Logic</h3>
                <p>
                    In an e-commerce context, you often want to generate a receipt immediately after the transaction is confirmed.
                </p>
                <CodeBlock code={`// CheckoutComponent.js
import { useProofRails, useProofRailsPayment } from '@proofrails/sdk/react';

function CheckoutButton({ cartTotal, cartId }) {
  const sdk = useProofRails({ apiKey: process.env.NEXT_PUBLIC_KEY });
  const { send, loading } = useProofRailsPayment(sdk);

  const onCheckout = async () => {
    // 1. Calculate total
    const amount = cartTotal.toString();
    
    // 2. Merchant Wallet
    const merchantAddress = "0xMerchantWallet...";

    // 3. Process
    await send({
      amount: amount,
      to: merchantAddress,
      purpose: \`Order #\${cartId}\`,
      // Advanced: Add metadata for backend reconciliation
      metadata: {
        cartId: cartId,
        items: ["item1", "item2"]
      }
    });
    
    // 4. Redirect to success
    window.location.href = \`/success?order=\${cartId}\`;
  };

  return (
    <button onClick={onCheckout} className="btn-primary">
      Pay {cartTotal} FLR
    </button>
  );
}`} />

                <h3>Backend Verification (Optional)</h3>
                <p>
                    On your server, you can listen for the receipt to confirm the order status.
                </p>
                <CodeBlock code={`// server.js (Node.js)
import ProofRails from '@proofrails/sdk';

const sdk = new ProofRails({ apiKey: process.env.API_KEY });

app.post('/webhook/proofrails', async (req, res) => {
  const { receiptId } = req.body;
  
  // Verify receipt is valid and anchored
  const result = await sdk.verify.byReceiptId(receiptId);
  
  if (result.isValid) {
    await db.orders.update({ status: 'paid', receipt: receiptId });
  }
});`} />
            </div>
        </div>
    );
}
