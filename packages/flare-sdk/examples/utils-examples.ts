import { FlareSDK } from '@flarestudio/flare-sdk';

/**
 * Example 1: Unit Conversion
 */
function example1_unitConversion() {
    const sdk = new FlareSDK({ network: 'flare' });

    // Ether to Wei
    const wei = sdk.utils.toWei('1.5');
    console.log('1.5 FLR in Wei:', wei.toString());
    // Output: 1500000000000000000

    // Wei to Ether
    const flr = sdk.utils.fromWei(wei);
    console.log('Wei back to FLR:', flr);
    // Output: 1.5

    // Custom decimals (e.g., USDC has 6 decimals)
    const usdcUnits = sdk.utils.toDecimals('100.5', 6);
    console.log('100.5 USDC units:', usdcUnits.toString());
    // Output: 100500000
}

/**
 * Example 2: Address Validation
 */
function example2_addressValidation() {
    const sdk = new FlareSDK({ network: 'flare' });

    const validAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
    const invalidAddress = '0xInvalidAddress';

    console.log('Is valid:', sdk.utils.isValidAddress(validAddress)); // true
    console.log('Is valid:', sdk.utils.isValidAddress(invalidAddress)); // false

    // Checksum address
    const lowerCaseAddress = '0x5b38da6a701c568545dcfcb03fcb875f56beddc4';
    console.log('Checksum:', sdk.utils.toChecksumAddress(lowerCaseAddress));
    // Output: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
}

/**
 * Example 3: Caching
 */
function example3_caching() {
    const sdk = new FlareSDK({ network: 'flare' });

    // Store data in cache (expires in 5 seconds)
    sdk.utils.cache.set('my-key', { foo: 'bar' }, 5);

    // Retrieve data
    const data = sdk.utils.cache.get('my-key');
    console.log('Cached data:', data);

    // Wait 6 seconds
    setTimeout(() => {
        const expired = sdk.utils.cache.get('my-key');
        console.log('Expired data:', expired); // null
    }, 6000);
}

/**
 * Example 4: Error Formatting
 */
async function example4_errorFormatting() {
    const sdk = new FlareSDK({ network: 'flare' });

    try {
        // Trigger an error
        await sdk.ftso.getPrice('INVALID');
    } catch (error) {
        const formatted = sdk.utils.formatError(error);
        console.log('Formatted Error:', formatted);
        // Output: { code: 'PRICE_NOT_AVAILABLE', message: '...', details: ... }
    }
}

// Run examples
// example1_unitConversion();
// example2_addressValidation();
// example3_caching();
// example4_errorFormatting();
