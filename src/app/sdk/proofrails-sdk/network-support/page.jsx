import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function NetworkSupport() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Network Support</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    ProofRails supports both the Flare Mainnet and Coston2 Testnet.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white ">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <h3 className="text-xl font-bold">Coston2 (Testnet)</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Use for development and testing. Tokens (C2FLR) have no real value.
                    </p>
                    <ul className="text-sm space-y-2 text-slate-500">
                        <li>• Chain ID: <strong>114</strong></li>
                        <li>• Currency: <strong>C2FLR</strong></li>
                        <li>• Free faucet available</li>
                    </ul>
                </div>

                <div className="p-6 rounded-2xl bg-white ">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-[#e93b6c]" />
                        <h3 className="text-xl font-bold">Flare (Mainnet)</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Use for production. Tokens (FLR) have real value.
                    </p>
                    <ul className="text-sm space-y-2 text-slate-500">
                        <li>• Chain ID: <strong>14</strong></li>
                        <li>• Currency: <strong>FLR</strong></li>
                        <li>• Fast finality & low fees</li>
                    </ul>
                </div>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Smart Auto-Detection</h3>
                <p>
                    When using the React hooks, the SDK automatically detects the network from the user's connected wallet.
                    You rarely need to configure this manually.
                </p>
                <CodeBlock code={`// User connects wallet on Chain ID 14 (Flare)
const { send } = useProofRailsPayment(sdk);

await send({ ... }); 
// ✅ Automatically uses 'flare' network and 'FLR' currency`} />

                <h3>Manual Override</h3>
                <p>
                    For advanced use cases (e.g., backend scripts), you can force a specific network.
                </p>
                <CodeBlock code={`// Force Coston2 even if wallet is on Mainnet
const sdk = new ProofRails({
  apiKey: "...",
  network: "coston2"
});

// OR override per-request
await sdk.templates.payment({
  ...data,
  chain: "coston2",
  currency: "C2FLR"
});`} />
            </div>
        </div>
    );
}
