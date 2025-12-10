import { describe, it, expect } from 'vitest';
import { FlareSDK } from '../src/core/FlareSDK';

describe('FlareSDK', () => {
    it('should initialize with default settings', () => {
        const sdk = new FlareSDK();
        expect(sdk).toBeDefined();
        expect(sdk.ftso).toBeDefined();
        expect(sdk.wallet).toBeDefined();
        expect(sdk.utils).toBeDefined();
        expect(sdk.fdc).toBeDefined();
        expect(sdk.staking).toBeDefined();
        expect(sdk.fassets).toBeDefined();
        expect(sdk.stateConnector).toBeDefined();
    });

    it('should initialize with custom network', () => {
        const sdk = new FlareSDK({ network: 'coston2' });
        expect(sdk).toBeDefined();
        // We can't easily check private properties, but if it didn't throw, it's good.
    });

    it('should initialize with debug mode', () => {
        const sdk = new FlareSDK({ debug: true });
        expect(sdk).toBeDefined();
    });
});
