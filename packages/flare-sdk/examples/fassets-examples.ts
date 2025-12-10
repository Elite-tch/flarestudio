import { FlareSDK } from '@flarestudio/flare-sdk';
import { Wallet, JsonRpcProvider } from 'ethers';

// Setup (Mock for example purposes)
// In a real application, you would get the signer from the user's wallet (e.g., MetaMask)
const provider = new JsonRpcProvider('https://coston2-api.flare.network/ext/C/rpc');
const signer = Wallet.createRandom(provider);

/**
 * Example 1: Get fAsset Balance
 */
async function example1_balance() {
    const sdk = new FlareSDK({ network: 'coston2' });

    try {
        const balance = await sdk.fassets.getBalance(signer.address, 'fXRP');
        console.log('fXRP Balance:', balance);
    } catch (error) {
        console.error('Failed to get balance:', error);
    }
}

/**
 * Example 2: Mint fAssets (Reserve Collateral)
 */
async function example2_mint() {
    const sdk = new FlareSDK({ network: 'coston2' });

    // 1. Get collateral requirements
    try {
        const collateral = await sdk.fassets.getCollateralRequirements('fXRP', 1); // 1 lot
        console.log('Collateral Required:', collateral.required, collateral.currency);

        // 2. Mint (Reserve)
        const tx = await sdk.fassets.mint('fXRP', 1, {
            agent: '0xAgentAddress...'
        }, signer);

        console.log('Mint TX:', tx.hash);
        await tx.wait();
        console.log('Collateral reserved');
    } catch (error) {
        console.error('Minting failed:', error);
    }
}

/**
 * Example 3: Redeem fAssets
 */
async function example3_redeem() {
    const sdk = new FlareSDK({ network: 'coston2' });

    try {
        const tx = await sdk.fassets.redeem('fXRP', 1, {
            to: 'rXRPAddress...' // Destination address on underlying chain
        }, signer);

        console.log('Redeem TX:', tx.hash);
        await tx.wait();
        console.log('Redemption initiated');
    } catch (error) {
        console.error('Redemption failed:', error);
    }
}

/**
 * Example 4: Get Supported Assets
 */
async function example4_supportedAssets() {
    const sdk = new FlareSDK({ network: 'coston2' });

    const assets = await sdk.fassets.getSupportedAssets();
    console.log('Supported fAssets:', assets);
}

/**
 * Example 5: Bridge to Flare (Minting alias)
 */
async function example5_bridgeToFlare() {
    const sdk = new FlareSDK({ network: 'coston2' });

    try {
        const tx = await sdk.fassets.bridgeToFlare('fXRP', 1, {
            agent: '0xAgentAddress...'
        }, signer);

        console.log('Bridge to Flare TX:', tx.hash);
        await tx.wait();
        console.log('Bridging initiated (Collateral reserved)');
    } catch (error) {
        console.error('Bridging to Flare failed:', error);
    }
}

/**
 * Example 6: Bridge to Native (Redemption alias)
 */
async function example6_bridgeToNative() {
    const sdk = new FlareSDK({ network: 'coston2' });

    try {
        const tx = await sdk.fassets.bridgeToNative('fXRP', 1, {
            to: 'rXRPAddress...'
        }, signer);

        console.log('Bridge to Native TX:', tx.hash);
        await tx.wait();
        console.log('Bridging to Native initiated');
    } catch (error) {
        console.error('Bridging to Native failed:', error);
    }
}

// Run examples
// example1_balance();
// example2_mint();
// example3_redeem();
// example4_supportedAssets();
// example5_bridgeToFlare();
// example6_bridgeToNative();
