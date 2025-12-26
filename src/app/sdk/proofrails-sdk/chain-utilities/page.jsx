import { CodeBlock } from "@/components/proofrails/CodeBlock";

export default function ChainUtilities() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Chain Utilities</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Helpers for interacting with supported networks.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>detectNetwork</h3>
                <p>Get the SDK network name from a Chain ID.</p>
                <CodeBlock code={`import { detectNetwork } from '@proofrails/sdk';

const network = detectNetwork(14); // 'flare'
const testnet = detectNetwork(114); // 'coston2'`} />

                <h3>detectCurrency</h3>
                <p>Auto-detect native currency from Chain ID.</p>
                <CodeBlock code={`import { detectCurrency } from '@proofrails/sdk';

const currency = detectCurrency(14); // 'FLR'
const testCurrency = detectCurrency(114); // 'C2FLR'`} />

                <h3>getChainInfo</h3>
                <p>Get complete metadata about a chain.</p>
                <CodeBlock code={`import { getChainInfo } from '@proofrails/sdk';

const info = getChainInfo(14);
console.log(info.name);        // 'Flare'
console.log(info.currency);    // 'FLR'
console.log(info.rpcUrl);      // RPC endpoint
console.log(info.explorerUrl); // Explorer URL`} />

                <h3>isSupportedChain</h3>
                <p>Check if a chain ID is supported.</p>
                <CodeBlock code={`import { isSupportedChain } from '@proofrails/sdk';

if (isSupportedChain(14)) {
  console.log('Flare is supported!');
}`} />

                <h3>getExplorerUrl</h3>
                <p>Generate block explorer URLs for transactions.</p>
                <CodeBlock code={`import { getExplorerUrl } from '@proofrails/sdk';

const url = getExplorerUrl(14, '0x123...');
// https://flare-explorer.flare.network/tx/0x123...`} />

                <h3>getAddressExplorerUrl</h3>
                <p>Generate block explorer URLs for addresses.</p>
                <CodeBlock code={`import { getAddressExplorerUrl } from '@proofrails/sdk';

const url = getAddressExplorerUrl(14, '0xabc...');
// https://flare-explorer.flare.network/address/0xabc...`} />
            </div>
        </div>
    );
}
