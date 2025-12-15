import { JsonRpcProvider, TransactionResponse } from 'ethers';

/**
 * Supported Flare networks
 */
type FlareNetwork = 'flare' | 'coston2' | 'songbird' | 'coston';
/**
 * Network configuration
 */
interface NetworkConfig {
    chainId: number;
    name: string;
    rpc: string;
    explorer: string;
    testnet?: boolean;
}
/**
 * SDK configuration options
 */
interface SDKConfig {
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
interface FTSOPrice {
    symbol: string;
    price: number;
    timestamp: Date;
    decimals: number;
    rawPrice: string;
}
/**
 * Historical price data point
 */
interface HistoricalPrice {
    timestamp: Date;
    price: number;
    volume?: number;
}
/**
 * Price subscription callback
 */
type PriceCallback = (price: FTSOPrice) => void;
/**
 * Unsubscribe function
 */
type UnsubscribeFunction = () => void;
/**
 * Cache options
 */
interface CacheOptions {
    cache?: boolean;
    ttl?: number;
}
/**
 * Transaction options
 */
interface TransactionOptions {
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
interface WalletBalance {
    flr: string;
    wflr?: string;
}
/**
 * Token info
 */
interface TokenInfo {
    address: string;
    symbol: string;
    decimals: number;
    name?: string;
}
/**
 * Attestation data
 */
interface Attestation {
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
interface DelegationInfo {
    provider: string;
    percentage: number;
    amount: string;
}
/**
 * Reward info
 */
interface RewardInfo {
    epoch: number;
    amount: string;
    claimed: boolean;
    timestamp: Date;
}
/**
 * Provider stats
 */
interface ProviderStats {
    address: string;
    name?: string;
    apy: number;
    apr: number;
    totalStake: string;
    rewardRate: number;
}

declare class FTSOModule {
    private provider;
    private contractRegistryAddress;
    private ftsoRegistryAddressPromise;
    private cache;
    private cacheTTL;
    private subscriptions;
    constructor(provider: JsonRpcProvider, network: string, cacheTTL?: number);
    /**
     * Get the FTSO Registry address from the Contract Registry
     */
    private getFtsoRegistryAddress;
    /**
     * Get current price for a single asset
     */
    getPrice(symbol: string, options?: CacheOptions): Promise<FTSOPrice>;
    /**
     * Get current prices for multiple assets
     */
    getPrices(symbols: string[], options?: CacheOptions): Promise<FTSOPrice[]>;
    /**
     * Get list of supported symbols
     */
    getSupportedSymbols(): Promise<string[]>;
    /**
     * Subscribe to price updates (polling-based)
     */
    subscribe(symbol: string, callback: PriceCallback, interval?: number): UnsubscribeFunction;
    /**
     * Clear all cached prices
     */
    clearCache(): void;
    /**
     * Cleanup all subscriptions
     */
    cleanup(): void;
}

/**
 * Wallet Module
 * Utility functions for wallet interaction and transaction management
 */
declare class WalletModule {
    private provider;
    private signer;
    constructor();
    /**
     * Connect to a wallet (e.g., MetaMask)
     * @param provider - The EIP-1193 provider (e.g., window.ethereum)
     */
    connect(provider: any): Promise<string>;
    /**
     * Get the connected wallet address
     */
    getAddress(): Promise<string>;
    /**
     * Get the balance of the connected wallet
     */
    getBalance(): Promise<WalletBalance>;
    /**
     * Send a transaction
     */
    send(options: TransactionOptions): Promise<TransactionResponse>;
    /**
     * Sign a message
     */
    signMessage(message: string): Promise<string>;
    /**
     * Check if wallet is connected
     */
    isConnected(): boolean;
    /**
     * Ensure wallet is connected
     */
    private ensureConnected;
}

/**
 * Utils Module
 * Helper utilities for common blockchain operations
 */
declare class UtilsModule {
    private cacheStore;
    constructor();
    /**
     * Convert Wei to Ether
     */
    fromWei(wei: string | bigint): string;
    /**
     * Convert Ether to Wei
     */
    toWei(ether: string): bigint;
    /**
     * Convert value to specific decimals
     */
    toDecimals(value: string, decimals: number): bigint;
    /**
     * Convert value from specific decimals
     */
    fromDecimals(value: string | bigint, decimals: number): string;
    /**
     * Validate an address
     */
    isValidAddress(address: string): boolean;
    /**
     * Get checksum address
     */
    toChecksumAddress(address: string): string;
    /**
     * Format error object
     */
    formatError(error: any): {
        code: string;
        message: string;
        details?: any;
    };
    /**
     * Cache utilities
     */
    cache: {
        set: (key: string, value: any, ttlSeconds: number) => void;
        get: (key: string) => any | null;
        clear: () => void;
    };
}

/**
 * FDC Module
 * Interact with the Flare Data Connector to request and view attestations.
 */
declare class FDCModule {
    private provider;
    private network;
    private contractRegistryAddress;
    private fdcHubAddress;
    constructor(provider: JsonRpcProvider, network: string);
    /**
     * Resolve FdcHub or StateConnector address from registry
     */
    private getFdcHubAddress;
    /**
     * Request a Bitcoin Payment Verification (Simulated encoding for MVP)
     * In a full implementation, 'params' would be encoded into the specific byte sequence required by the specific Attestation Type definition.
     */
    verifyBitcoinPayment(params: {
        txHash: string;
        sourceAddress: string;
        destinationAddress: string;
        amount: number;
    }, signer: any): Promise<any>;
    /**
     * Request an EVM Transaction Verification (Ethereum, simple payment or contract call)
     */
    verifyEVMTransaction(params: {
        txHash: string;
        chainId: number;
    }, signer: any): Promise<any>;
    /**
     * Get recent attestation requests from the chain
     */
    getRecentAttestations(options?: {
        limit?: number;
    }): Promise<Attestation[]>;
    /**
     * Subscribe to new attestation requests
     */
    subscribe(callback: (attestation: Attestation) => void): () => void;
}

/**
 * Staking Module
 * Wrap FLR, delegate to FTSO providers, and claim rewards
 */
declare class StakingModule {
    private provider;
    private network;
    private wnatAddress;
    private contractRegistryAddress;
    private rewardManagerAddress;
    constructor(provider: JsonRpcProvider, network: string);
    /**
     * Get the FtsoRewardManager address from the Contract Registry
     */
    private getRewardManagerAddress;
    /**
     * Wrap native FLR/SGB to WFLR/WSGB
     * @param amount Amount to wrap in FLR/SGB
     * @param signer Wallet signer (must be connected)
     */
    wrap(amount: string, signer: any): Promise<any>;
    /**
     * Unwrap WFLR/WSGB to native FLR/SGB
     * @param amount Amount to unwrap in WFLR/WSGB
     * @param signer Wallet signer (must be connected)
     */
    unwrap(amount: string, signer: any): Promise<any>;
    /**
     * Get WFLR/WSGB balance
     * @param address Wallet address
     */
    getWNatBalance(address: string): Promise<string>;
    /**
     * Get vote power (delegatable amount)
     * @param address Wallet address
     */
    getVotePower(address: string): Promise<string>;
    /**
     * Delegate vote power to a provider
     * @param providerAddress FTSO provider address
     * @param percentage Percentage to delegate (0-100)
     * @param signer Wallet signer (must be connected)
     */
    delegate(providerAddress: string, percentage: number, signer: any): Promise<any>;
    /**
     * Undelegate all vote power
     * @param signer Wallet signer (must be connected)
     */
    undelegateAll(signer: any): Promise<any>;
    /**
     * Get current delegations
     * @param address Wallet address
     */
    getDelegations(address: string): Promise<DelegationInfo[]>;
    /**
     * Get unclaimed reward epochs
     * @param address Wallet address
     */
    getUnclaimedEpochs(address: string): Promise<number[]>;
    /**
     * Get unclaimed reward amount for a specific epoch
     * @param address Wallet address
     * @param epoch Reward epoch number
     */
    getUnclaimedReward(address: string, epoch: number): Promise<string>;
    /**
     * Claim rewards for specific epochs
     * @param epochs Array of epoch numbers to claim (leave empty for all unclaimed)
     * @param signer Wallet signer (must be connected)
     */
    claimRewards(epochs: number[] | undefined, signer: any): Promise<any>;
    /**
     * Get rewards history (claimed and unclaimed)
     * @param address Wallet address
     */
    getRewardsHistory(address: string): Promise<RewardInfo[]>;
    /**
     * Get provider list with stats
     * Note: This would require additional data sources or indexing
     * For now, returns empty array - implement with your preferred data source
     */
    getProviders(options?: {
        sortBy?: 'apy' | 'totalStake' | 'rewardRate';
        limit?: number;
    }): Promise<ProviderStats[]>;
    /**
     * Calculate potential rewards (estimate)
     * @param amount Amount to delegate
     * @param apy Annual percentage yield (default 12%)
     * @param days Number of days
     */
    calculatePotentialRewards(amount: string, apy?: number, days?: number): string;
}

/**
 * fAssets Module
 * Bridge and mint synthetic assets on Flare
 */
declare class FAssetsModule {
    private provider;
    private network;
    private contractRegistryAddress;
    constructor(provider: JsonRpcProvider, network: string);
    /**
     * Get AssetManager address from Registry
     */
    private getAssetManagerAddress;
    /**
     * Get fAsset Token address
     */
    private getFAssetAddress;
    /**
     * Get fAsset balance
     */
    getBalance(address: string, symbol: string): Promise<{
        balance: string;
        decimals: number;
        symbol: string;
    }>;
    /**
     * Get collateral requirements for minting
     * @param symbol fAsset symbol (e.g. fXRP)
     * @param lots Number of lots to mint
     */
    getCollateralRequirements(symbol: string, lots: number): Promise<{
        required: string;
        currency: string;
    }>;
    /**
     * Mint fAssets (Reserve Collateral)
     * Note: This is Step 1 of minting. Step 2 requires paying underlying asset. Step 3 is executing minting.
     * @param symbol fAsset symbol
     * @param lots Number of lots to mint
     * @param options { agent: string } Agent address to mint against
     * @param signer Connected signer
     */
    mint(symbol: string, lots: number, options: {
        agent: string;
    }, signer: any): Promise<TransactionResponse>;
    /**
     * Redeem fAssets
     * @param symbol fAsset symbol
     * @param lots Number of lots to redeem
     * @param options { to: string } Underlying address to receive assets
     * @param signer Connected signer
     */
    redeem(symbol: string, lots: number, options: {
        to: string;
    }, signer: any): Promise<TransactionResponse>;
    /**
     * Get supported fAssets
     * This is a helper that returns hardcoded list for now, as Registry enumeration is complex
     */
    getSupportedAssets(): Promise<string[]>;
    /**
     * Get all available agents
     */
    getAgents(symbol: string): Promise<string[]>;
    /**
     * Get Lot Size
     */
    getLotSize(symbol: string): Promise<string>;
}

/**
 * State Connector Module
 * interact with the State Connector contract to read confirmed voting rounds and merkle roots.
 * (No Mock Data - Direct Blockchain Interaction)
 */
declare class StateConnectorModule {
    private provider;
    private network;
    private contractRegistryAddress;
    private stateConnectorAddress;
    constructor(provider: JsonRpcProvider, network: string);
    /**
     * Resolve StateConnector address from registry
     */
    private getStateConnectorAddress;
    /**
     * Get the ID of the last finalized voting round
     */
    getLastConfirmedRoundId(): Promise<number>;
    /**
     * Get the merkle root for a specific round
     */
    getMerkleRoot(roundId: number): Promise<string>;
    /**
     * Subscribe to RoundFinalized events
     */
    subscribeToFinalizedRounds(callback: (roundId: number, merkleRoot: string) => void): () => void;
}

/**
 * Main FlareSDK class
 * Entry point for all SDK functionality
 */
declare class FlareSDK {
    private _provider;
    private _network;
    private _config;
    private _initialized;
    ftso: FTSOModule;
    wallet: WalletModule;
    utils: UtilsModule;
    fdc: FDCModule;
    staking: StakingModule;
    fassets: FAssetsModule;
    stateConnector: StateConnectorModule;
    constructor(config?: SDKConfig);
    /**
     * Initialize the RPC provider
     */
    private _initializeProvider;
    /**
     * Get the current provider
     */
    get provider(): JsonRpcProvider;
    /**
     * Get the current network
     */
    get network(): FlareNetwork;
    /**
     * Get the network configuration
     */
    get networkConfig(): NetworkConfig;
    /**
     * Check if SDK is initialized
     */
    get isInitialized(): boolean;
    /**
     * Get SDK configuration
     */
    get config(): Readonly<Required<SDKConfig>>;
    /**
     * Switch to a different network
     */
    switchNetwork(network: FlareNetwork): Promise<void>;
    /**
     * Disconnect and cleanup
     */
    disconnect(): void;
}

/**
 * Network configurations for all supported Flare networks
 */
declare const NETWORKS: Record<FlareNetwork, NetworkConfig>;
/**
 * Get network configuration by name
 */
declare function getNetworkConfig(network: FlareNetwork): NetworkConfig;
/**
 * Get network by chain ID
 */
declare function getNetworkByChainId(chainId: number): FlareNetwork | undefined;

/**
 * Base error class for all SDK errors
 */
declare class SDKError extends Error {
    code: string;
    details?: unknown | undefined;
    constructor(message: string, code: string, details?: unknown | undefined);
}
/**
 * FTSO module errors
 */
declare class FTSOError extends SDKError {
    constructor(message: string, code: string, details?: unknown);
}
/**
 * FDC module errors
 */
declare class FDCError extends SDKError {
    constructor(message: string, code: string, details?: unknown);
}
/**
 * fAssets module errors
 */
declare class FAssetsError extends SDKError {
    constructor(message: string, code: string, details?: unknown);
}
/**
 * Wallet module errors
 */
declare class WalletError extends SDKError {
    constructor(message: string, code: string, details?: unknown);
}
/**
 * Staking module errors
 */
declare class StakingError extends SDKError {
    constructor(message: string, code: string, details?: unknown);
}
/**
 * State Connector module errors
 */
declare class StateConnectorError extends SDKError {
    constructor(message: string, code: string, details?: unknown);
}
/**
 * Error codes
 */
declare const ErrorCodes: {
    readonly INVALID_PARAMETER: "INVALID_PARAMETER";
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly NOT_INITIALIZED: "NOT_INITIALIZED";
    readonly SYMBOL_NOT_FOUND: "SYMBOL_NOT_FOUND";
    readonly PRICE_NOT_AVAILABLE: "PRICE_NOT_AVAILABLE";
    readonly INVALID_TIME_RANGE: "INVALID_TIME_RANGE";
    readonly ATTESTATION_NOT_FOUND: "ATTESTATION_NOT_FOUND";
    readonly VERIFICATION_FAILED: "VERIFICATION_FAILED";
    readonly INVALID_PROOF: "INVALID_PROOF";
    readonly ASSET_NOT_SUPPORTED: "ASSET_NOT_SUPPORTED";
    readonly INSUFFICIENT_COLLATERAL: "INSUFFICIENT_COLLATERAL";
    readonly MINTING_FAILED: "MINTING_FAILED";
    readonly REDEMPTION_FAILED: "REDEMPTION_FAILED";
    readonly WALLET_NOT_CONNECTED: "WALLET_NOT_CONNECTED";
    readonly INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS";
    readonly TRANSACTION_FAILED: "TRANSACTION_FAILED";
    readonly SIGNATURE_REJECTED: "SIGNATURE_REJECTED";
    readonly DELEGATION_FAILED: "DELEGATION_FAILED";
    readonly CLAIM_FAILED: "CLAIM_FAILED";
    readonly PROVIDER_NOT_FOUND: "PROVIDER_NOT_FOUND";
    readonly NO_REWARDS: "NO_REWARDS";
    readonly INVALID_PARAMS: "INVALID_PARAMS";
    readonly PROOF_VERIFICATION_FAILED: "PROOF_VERIFICATION_FAILED";
    readonly INVALID_ATTESTATION_TYPE: "INVALID_ATTESTATION_TYPE";
};

export { type Attestation, type CacheOptions, type DelegationInfo, ErrorCodes, FAssetsError, FAssetsModule, FDCError, FDCModule, FTSOError, FTSOModule, type FTSOPrice, type FlareNetwork, FlareSDK, type HistoricalPrice, NETWORKS, type NetworkConfig, type PriceCallback, type ProviderStats, type RewardInfo, type SDKConfig, SDKError, StakingError, StakingModule, StateConnectorError, StateConnectorModule, type TokenInfo, type TransactionOptions, type UnsubscribeFunction, UtilsModule, type WalletBalance, WalletError, WalletModule, getNetworkByChainId, getNetworkConfig };
