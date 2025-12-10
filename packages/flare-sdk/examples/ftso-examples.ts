import { FlareSDK } from '@flarestudio/flare-sdk';

/**
 * Example 1: Basic Price Fetching
 */
async function example1_basicPrice() {
    // Initialize SDK
    const sdk = new FlareSDK({
        network: 'flare',
        debug: true
    });

    // Get single price
    const btcPrice = await sdk.ftso.getPrice('BTC/USD');
    console.log('BTC Price:', btcPrice);
    // Output: { symbol: 'BTC/USD', price: 45000.50, timestamp: Date, decimals: 5, rawPrice: '...' }

    // Get multiple prices
    const prices = await sdk.ftso.getPrices(['BTC/USD', 'ETH/USD', 'XRP/USD']);
    console.log('Multiple Prices:', prices);

    // Cleanup
    sdk.disconnect();
}

/**
 * Example 2: Price Subscription (Live Updates)
 */
async function example2_subscription() {
    const sdk = new FlareSDK({ network: 'flare' });

    // Subscribe to BTC price updates (every 5 seconds)
    const unsubscribe = sdk.ftso.subscribe('BTC/USD', (price) => {
        console.log('New BTC Price:', price.price);
    }, 5000);

    // Unsubscribe after 30 seconds
    setTimeout(() => {
        unsubscribe();
        sdk.disconnect();
    }, 30000);
}

/**
 * Example 3: Caching
 */
async function example3_caching() {
    const sdk = new FlareSDK({
        network: 'flare',
        cacheEnabled: true,
        cacheTTL: 60 // 60 seconds
    });

    // First call - fetches from blockchain
    const price1 = await sdk.ftso.getPrice('BTC/USD');
    console.log('First call (from blockchain):', price1);

    // Second call within 60 seconds - returns cached value
    const price2 = await sdk.ftso.getPrice('BTC/USD');
    console.log('Second call (from cache):', price2);

    // Force fresh data (bypass cache)
    const price3 = await sdk.ftso.getPrice('BTC/USD', { cache: false });
    console.log('Third call (fresh data):', price3);

    sdk.disconnect();
}

/**
 * Example 4: Get Supported Symbols
 */
async function example4_supportedSymbols() {
    const sdk = new FlareSDK({ network: 'flare' });

    const symbols = await sdk.ftso.getSupportedSymbols();
    console.log('Supported symbols:', symbols);
    // Output: ['BTC/USD', 'ETH/USD', 'XRP/USD', 'ADA/USD', ...]

    sdk.disconnect();
}

/**
 * Example 5: Network Switching
 */
async function example5_networkSwitching() {
    const sdk = new FlareSDK({ network: 'flare' });

    // Get price on Flare mainnet
    const flarePrice = await sdk.ftso.getPrice('BTC/USD');
    console.log('Flare mainnet price:', flarePrice);

    // Switch to Coston2 testnet
    await sdk.switchNetwork('coston2');

    // Get price on Coston2
    const coston2Price = await sdk.ftso.getPrice('BTC/USD');
    console.log('Coston2 testnet price:', coston2Price);

    sdk.disconnect();
}

/**
 * Example 6: Error Handling
 */
async function example6_errorHandling() {
    const sdk = new FlareSDK({ network: 'flare' });

    try {
        // Try to get price for invalid symbol
        const price = await sdk.ftso.getPrice('INVALID/USD');
    } catch (error) {
        if (error.name === 'FTSOError') {
            console.error('FTSO Error:', error.message);
            console.error('Error Code:', error.code);
        }
    }

    sdk.disconnect();
}

// Run examples
// example1_basicPrice();
// example2_subscription();
// example3_caching();
// example4_supportedSymbols();
// example5_networkSwitching();
// example6_errorHandling();
