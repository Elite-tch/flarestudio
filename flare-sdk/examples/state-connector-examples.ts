import { FlareSDK } from '@flarestudio/flare-sdk';

/**
 * Example 1: Verify State Proof
 */
async function example1_verifyProof() {
    const sdk = new FlareSDK({ network: 'coston2' });

    const verified = await sdk.stateConnector.verify({
        proof: '0x1234567890abcdef...',
        attestationType: 'Payment',
        sourceChain: 'BTC'
    });

    console.log('Proof Verified:', verified);
}

/**
 * Example 2: Query State
 */
async function example2_queryState() {
    const sdk = new FlareSDK({ network: 'coston2' });

    const state = await sdk.stateConnector.queryState({
        chain: 'ETH',
        blockNumber: 12345678,
        address: '0xUserAddress...'
    });

    console.log('State:', state);
}

/**
 * Example 3: Subscribe to State Updates
 */
function example3_subscribe() {
    const sdk = new FlareSDK({ network: 'coston2' });

    console.log('Subscribing to BTC state updates...');

    const unsubscribe = sdk.stateConnector.subscribe('BTC', (update) => {
        console.log('State Update:', update);
    });

    // Unsubscribe after 30 seconds
    setTimeout(() => {
        unsubscribe();
        console.log('Unsubscribed');
    }, 30000);
}

/**
 * Example 4: Get Proof History
 */
async function example4_history() {
    const sdk = new FlareSDK({ network: 'coston2' });

    const history = await sdk.stateConnector.getProofHistory({
        chain: 'BTC',
        fromBlock: 1000000
    });

    console.log('Proof History:', history);
}

// Run examples
// example1_verifyProof();
// example2_queryState();
// example3_subscribe();
// example4_history();
