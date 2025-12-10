import { Contract, JsonRpcProvider } from 'ethers';
import type { FTSOPrice, CacheOptions, PriceCallback, UnsubscribeFunction } from '../../types';
import { FTSOError, ErrorCodes } from '../../core/errors';

// Flare Contract Registry ABI - to get actual contract addresses
const CONTRACT_REGISTRY_ABI = [
    'function getContractAddressByName(string memory _name) external view returns (address)',
];

// FTSO Registry ABI - minimal interface for price fetching
const FTSO_REGISTRY_ABI = [
    'function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _assetPriceUsdDecimals)',
    'function getSupportedSymbols() external view returns (string[] memory _supportedSymbols)',
];

/**
 * FTSO Module
 * Access real-time and historical price data from Flare's FTSO system
 */
export class FTSOModule {
    private provider: JsonRpcProvider;
    private contractRegistryAddress: string;
    private ftsoRegistryAddressPromise: Promise<string> | null = null;
    private cache: Map<string, { price: FTSOPrice; timestamp: number }> = new Map();
    private cacheTTL: number;
    private subscriptions: Map<string, NodeJS.Timeout> = new Map();

    constructor(provider: JsonRpcProvider, network: string, cacheTTL = 60) {
        this.provider = provider;
        this.cacheTTL = cacheTTL * 1000; // Convert to milliseconds

        // FlareContractRegistry addresses (same for all networks)
        const contractRegistryAddresses: Record<string, string> = {
            flare: '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019',
            coston2: '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019',
            songbird: '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019',
            coston: '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019',
        };

        this.contractRegistryAddress = contractRegistryAddresses[network];

        if (!this.contractRegistryAddress) {
            throw new FTSOError(
                `Unsupported network: ${network}`,
                ErrorCodes.NETWORK_ERROR
            );
        }
    }

    /**
     * Get the FTSO Registry address from the Contract Registry
     */
    private async getFtsoRegistryAddress(): Promise<string> {
        if (!this.ftsoRegistryAddressPromise) {
            this.ftsoRegistryAddressPromise = (async () => {
                try {
                    const contractRegistry = new Contract(
                        this.contractRegistryAddress,
                        CONTRACT_REGISTRY_ABI,
                        this.provider
                    );

                    // Get the FtsoRegistry contract address
                    const address = await contractRegistry.getContractAddressByName('FtsoRegistry');
                    return address;
                } catch (error: any) {
                    // Reset the promise on error so it can be retried
                    this.ftsoRegistryAddressPromise = null;
                    throw new FTSOError(
                        `Failed to get FTSO Registry address: ${error.message}`,
                        ErrorCodes.NETWORK_ERROR,
                        error
                    );
                }
            })();
        }

        return this.ftsoRegistryAddressPromise;
    }

    /**
     * Get current price for a single asset
     */
    async getPrice(symbol: string, options: CacheOptions = {}): Promise<FTSOPrice> {
        const cacheEnabled = options.cache ?? true;
        const ttl = options.ttl ? options.ttl * 1000 : this.cacheTTL;

        // Check cache
        if (cacheEnabled) {
            const cached = this.cache.get(symbol);
            if (cached && Date.now() - cached.timestamp < ttl) {
                return cached.price;
            }
        }

        try {
            const registryAddress = await this.getFtsoRegistryAddress();
            const registry = new Contract(
                registryAddress,
                FTSO_REGISTRY_ABI,
                this.provider
            );

            const [price, timestamp, decimals] = await registry.getCurrentPriceWithDecimals(symbol);

            const priceData: FTSOPrice = {
                symbol,
                price: Number(price) / Math.pow(10, Number(decimals)),
                timestamp: new Date(Number(timestamp) * 1000),
                decimals: Number(decimals),
                rawPrice: price.toString(),
            };

            // Update cache
            if (cacheEnabled) {
                this.cache.set(symbol, { price: priceData, timestamp: Date.now() });
            }

            return priceData;
        } catch (error: any) {
            throw new FTSOError(
                `Failed to fetch price for ${symbol}: ${error.message}`,
                ErrorCodes.PRICE_NOT_AVAILABLE,
                error
            );
        }
    }

    /**
     * Get current prices for multiple assets
     */
    async getPrices(symbols: string[], options: CacheOptions = {}): Promise<FTSOPrice[]> {
        const pricePromises = symbols.map(symbol => this.getPrice(symbol, options));
        return Promise.all(pricePromises);
    }

    /**
     * Get list of supported symbols
     */
    async getSupportedSymbols(): Promise<string[]> {
        try {
            const registryAddress = await this.getFtsoRegistryAddress();
            const registry = new Contract(
                registryAddress,
                FTSO_REGISTRY_ABI,
                this.provider
            );

            const symbols = await registry.getSupportedSymbols();
            return symbols;
        } catch (error: any) {
            throw new FTSOError(
                `Failed to fetch supported symbols: ${error.message}`,
                ErrorCodes.NETWORK_ERROR,
                error
            );
        }
    }

    /**
     * Subscribe to price updates (polling-based)
     */
    subscribe(symbol: string, callback: PriceCallback, interval = 5000): UnsubscribeFunction {
        // Initial fetch
        this.getPrice(symbol, { cache: false }).then(callback).catch(console.error);

        // Set up polling
        const timer = setInterval(async () => {
            try {
                const price = await this.getPrice(symbol, { cache: false });
                callback(price);
            } catch (error) {
                console.error(`Subscription error for ${symbol}:`, error);
            }
        }, interval);

        this.subscriptions.set(symbol, timer);

        // Return unsubscribe function
        return () => {
            const timer = this.subscriptions.get(symbol);
            if (timer) {
                clearInterval(timer);
                this.subscriptions.delete(symbol);
            }
        };
    }

    /**
     * Clear all cached prices
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Cleanup all subscriptions
     */
    cleanup(): void {
        this.subscriptions.forEach(timer => clearInterval(timer));
        this.subscriptions.clear();
        this.cache.clear();
    }
}
