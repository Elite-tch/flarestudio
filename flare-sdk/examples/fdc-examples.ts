import { FlareSDK } from '@flarestudio/flare-sdk';

/**
 * Example 1: Verify Bitcoin Payment
 */
async function example1_verifyPayment() {
    const sdk = new FlareSDK({ network: 'coston2' });

    try {
        const verification = await sdk.fdc.verifyBitcoinPayment({
            txHash: '0x1234567890abcdef...',
            sourceAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            destinationAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
            amount: 0.5,
        });

        console.log('Payment Verified:', verification.verified);
        console.log('Block Number:', verification.blockNumber);
    } catch (error) {
        console.error('Verification failed:', error);
    }
}

/**
 * Example 2: Get Recent Attestations
 */
async function example2_recentAttestations() {
    const sdk = new FlareSDK({ network: 'coston2' });

    const attestations = await sdk.fdc.getRecentAttestations({
        type: 'Payment',
        limit: 5
    });

    console.log('Recent Attestations:', attestations);
}

/**
 * Example 3: Subscribe to Attestations
 */
function example3_subscribe() {
    const sdk = new FlareSDK({ network: 'coston2' });

    console.log('Subscribing to Payment attestations...');

    const unsubscribe = sdk.fdc.subscribe('Payment', (attestation) => {
        console.log('New Attestation:', attestation.id);
    });

    // Unsubscribe after 30 seconds
    setTimeout(() => {
        unsubscribe();
        console.log('Unsubscribed');
    }, 30000);
}

// Run examples
// example1_verifyPayment();
// example2_recentAttestations();
// example3_subscribe();
