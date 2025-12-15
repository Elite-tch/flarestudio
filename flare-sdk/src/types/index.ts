import type { JsonRpcProvider } from 'ethers';

/**
 * Supported Flare networks
 */
export type FlareNetwork = 'flare' | 'coston2' | 'songbird' | 'coston';

/**
 * Network configuration
 */
export interface NetworkConfig {
    chainId: number;
    name: string;
    rpc: string;
    explorer: string;
    testnet?: boolean;
}

/**
 * SDK configuration options
 */
export interface SDKConfig {
    /** Network to connect to */
    network?: FlareNetwork;
    /** Custom RPC URL (overrides network default) */
    rpcUrl?: string;
    /** Custom provider instance */
    provider?: JsonRpcProvider | null;
    /** Enable caching */
    cacheEnabled?: boolean;
    /** Cache TTL in seconds */
    cacheTTL?: number;
    /** Enable debug logging */
    debug?: boolean;
}

/**
 * Price data from FTSO
 */
export interface FTSOPrice {
    symbol: string;
    price: number;
    timestamp: Date;
    decimals: number;
    rawPrice: string;
}

/**
 * Historical price data point
 */
export interface HistoricalPrice {
    timestamp: Date;
    price: number;
    volume?: number;
}

/**
 * Price subscription callback
 */
export type PriceCallback = (price: FTSOPrice) => void;

/**
 * Unsubscribe function
 */
export type UnsubscribeFunction = () => void;

/**
 * Cache options
 */
export interface CacheOptions {
    cache?: boolean;
    ttl?: number;
}

/**
 * Transaction options
 */
export interface TransactionOptions {
    from?: string;
    to?: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
}

/**
 * Wallet balance
 */
export interface WalletBalance {
    flr: string;
    wflr?: string;
}

/**
 * Token info
 */
export interface TokenInfo {
    address: string;
    symbol: string;
    decimals: number;
    name?: string;
}

/**
 * Attestation data
 */
export interface Attestation {
    id: string;
    type: string;
    status: 'pending' | 'submitted' | 'success' | 'failed';
    blockNumber: number;
    timestamp: Date;
    data?: unknown;
}

/**
 * Delegation info
 */
export interface DelegationInfo {
    provider: string;
    percentage: number;
    amount: string;
}

/**
 * Reward info
 */
export interface RewardInfo {
    epoch: number;
    amount: string;
    claimed: boolean;
    timestamp: Date;
}

/**
 * Provider stats
 */
export interface ProviderStats {
    address: string;
    name?: string;
    apy: number;
    apr: number;
    totalStake: string;
    rewardRate: number;
}
