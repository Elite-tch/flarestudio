import { formatEther, parseEther, formatUnits, parseUnits, isAddress, getAddress } from 'ethers';
import { SDKError } from '../../core/errors';

/**
 * Utils Module
 * Helper utilities for common blockchain operations
 */
export class UtilsModule {
    private cacheStore: Map<string, { value: any; expires: number }> = new Map();

    constructor() { }

    /**
     * Convert Wei to Ether
     */
    fromWei(wei: string | bigint): string {
        return formatEther(wei);
    }

    /**
     * Convert Ether to Wei
     */
    toWei(ether: string): bigint {
        return parseEther(ether);
    }

    /**
     * Convert value to specific decimals
     */
    toDecimals(value: string, decimals: number): bigint {
        return parseUnits(value, decimals);
    }

    /**
     * Convert value from specific decimals
     */
    fromDecimals(value: string | bigint, decimals: number): string {
        return formatUnits(value, decimals);
    }

    /**
     * Validate an address
     */
    isValidAddress(address: string): boolean {
        return isAddress(address);
    }

    /**
     * Get checksum address
     */
    toChecksumAddress(address: string): string {
        try {
            return getAddress(address);
        } catch (error) {
            throw new Error(`Invalid address: ${address}`);
        }
    }

    /**
     * Format error object
     */
    formatError(error: any): { code: string; message: string; details?: any } {
        if (error instanceof SDKError) {
            return {
                code: error.code,
                message: error.message,
                details: error.details,
            };
        }

        return {
            code: 'UNKNOWN_ERROR',
            message: error.message || 'An unknown error occurred',
            details: error,
        };
    }

    /**
     * Cache utilities
     */
    cache = {
        set: (key: string, value: any, ttlSeconds: number): void => {
            this.cacheStore.set(key, {
                value,
                expires: Date.now() + ttlSeconds * 1000,
            });
        },

        get: (key: string): any | null => {
            const item = this.cacheStore.get(key);
            if (!item) return null;

            if (Date.now() > item.expires) {
                this.cacheStore.delete(key);
                return null;
            }

            return item.value;
        },

        clear: (): void => {
            this.cacheStore.clear();
        },
    };
}
