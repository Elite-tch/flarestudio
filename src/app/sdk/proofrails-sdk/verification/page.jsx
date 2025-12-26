import { CodeBlock } from "@/components/proofrails/CodeBlock";
export default function Verification() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-4">Verification</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Verify the authenticity of any ProofRails receipt against the Flare blockchain.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert">
        <h3>Verify by Receipt ID</h3>
        <p>
          The simplest way to verify a receipt. The SDK fetches the receipt, checks anchor status,
          and verifies the merkle root against the smart contract.
        </p>
        <CodeBlock code={`const result = await sdk.verify.byReceiptId('rec_123456789');

if (result.valid && result.onChain) {
  console.log("✅ Verified on Flare Network");
  console.log("Anchor TX:", result.anchorTx);
  console.log("Timestamp:", result.timestamp);
} else {
  console.error("❌ Verification Failed");
}`} />

        <h3>Verify by Bundle Hash</h3>
        <p>Verify using the cryptographic bundle hash directly.</p>
        <CodeBlock code={`const result = await sdk.verify.byHash('0x742d35Cc...');
console.log(result.valid); // true/false`} />

        <h3>Verify by Bundle URL</h3>
        <p>Verify from a downloadable evidence bundle.</p>
        <CodeBlock code={`const result = await sdk.verify.byUrl('https://middleware.com/bundles/rec_123.bundle');
console.log(result.valid);`} />

        <h3>Get Merkle Proof</h3>
        <p>Get the cryptographic proof for manual or on-chain verification.</p>
        <CodeBlock code={`const proof = await sdk.verify.getProof('rec_123456789');

console.log(proof.bundleHash);
console.log(proof.anchorTx);
console.log(proof.blockNumber);
console.log(proof.signature);
console.log(proof.contractAddress);`} />
      </div>
    </div>
  );
}
