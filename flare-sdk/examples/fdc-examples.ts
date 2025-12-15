import { FlareSDK } from '@flarestudio/flare-sdk';
import { Wallet, JsonRpcProvider } from 'ethers';

/**
 * Example 1: Request Bitcoin Payment Verification
 * Note: This requires a funded wallet to pay gas fees.
 */
async function example1_verifyPayment() {
    const sdk = new FlareSDK({ network: 'coston2' });

    // Setup wallet (replace with private key for node execution)
    // const provider = new JsonRpcProvider('https://coston2-api.flare.network/ext/C/rpc');
    // const signer = new Wallet('PRIVATE_KEY', provider);

    // For this example, we assume we have a signer.
    // In a browser app: const signer = await provider.getSigner();
    const signer = null; // Placeholder

    if (!signer) {
        console.log('Skipping Example 1: No signer configured.');
        return;
    }

    try {
        console.log('Submitting verification request...');
        const tx = await sdk.fdc.verifyBitcoinPayment({
            txHash: '0x1234567890abcdef...',
            sourceAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            destinationAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
            amount: 0.5,
        }, signer);

        console.log('Transaction Sent:', tx.hash);
        await tx.wait();
        console.log('Request Confirmed.');
    } catch (error) {
        console.error('Verification request failed:', error);
    }
}

/**
 * Example 2: Get Recent Attestations
 */
async function example2_recentAttestations() {
    const sdk = new FlareSDK({ network: 'coston2' });

    console.log('Fetching recent attestations...');
    const attestations = await sdk.fdc.getRecentAttestations({
        limit: 5
    });

    console.log('Recent Attestations:', attestations);
}

/**
 * Example 3: Subscribe to Attestations
 */
function example3_subscribe() {
    const sdk = new FlareSDK({ network: 'coston2' });

    console.log('Subscribing to AttestationRequest events...');

    const unsubscribe = sdk.fdc.subscribe((attestation) => {
        console.log('New Attestation Request:', attestation.id);
        console.log('Block:', attestation.blockNumber);
    });

    // Unsubscribe after 30 seconds
    setTimeout(() => {
        unsubscribe();
        console.log('Unsubscribed');
    }, 30000);
}

// Run examples
// example1_verifyPayment();
example2_recentAttestations();
// example3_subscribe();
