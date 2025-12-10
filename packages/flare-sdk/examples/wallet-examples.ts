import { FlareSDK } from '@flarestudio/flare-sdk';

/**
 * Example 1: Connect Wallet
 * Note: This example assumes running in a browser environment with window.ethereum
 */
async function example1_connectWallet() {
    const sdk = new FlareSDK({ network: 'flare' });

    // In a browser environment:
    // const provider = window.ethereum;

    // Mock provider for example purposes
    const mockProvider = {
        request: async () => ['0x123...']
    };

    try {
        const address = await sdk.wallet.connect(mockProvider);
        console.log('Connected address:', address);
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

/**
 * Example 2: Get Balance
 */
async function example2_getBalance() {
    const sdk = new FlareSDK({ network: 'coston2' });

    // Assume wallet is connected
    // await sdk.wallet.connect(window.ethereum);

    try {
        const balance = await sdk.wallet.getBalance();
        console.log('FLR Balance:', balance.flr);
    } catch (error) {
        console.error('Failed to get balance:', error);
    }
}

/**
 * Example 3: Send Transaction
 */
async function example3_sendTransaction() {
    const sdk = new FlareSDK({ network: 'coston2' });

    // Assume wallet is connected

    try {
        const tx = await sdk.wallet.send({
            to: '0xRecipientAddress...',
            value: '1.5', // 1.5 FLR
        });

        console.log('Transaction sent:', tx.hash);
        await tx.wait();
        console.log('Transaction confirmed');
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

/**
 * Example 4: Sign Message
 */
async function example4_signMessage() {
    const sdk = new FlareSDK({ network: 'flare' });

    try {
        const signature = await sdk.wallet.signMessage('Hello Flare!');
        console.log('Signature:', signature);
    } catch (error) {
        console.error('Signing failed:', error);
    }
}
