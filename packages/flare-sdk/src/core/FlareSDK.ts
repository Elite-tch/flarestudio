import { JsonRpcProvider } from 'ethers';
import type { SDKConfig, FlareNetwork } from '../types';
import { getNetworkConfig } from './networks';
import { SDKError, ErrorCodes } from './errors';
import { FTSOModule } from '../modules/ftso/FTSOModule';
import { WalletModule } from '../modules/wallet/WalletModule';
import { UtilsModule } from '../modules/utils/UtilsModule';
import { FDCModule } from '../modules/fdc/FDCModule';
import { StakingModule } from '../modules/staking/StakingModule';
import { FAssetsModule } from '../modules/fassets/FAssetsModule';
import { StateConnectorModule } from '../modules/stateConnector/StateConnectorModule';

/**
 * Main FlareSDK class
 * Entry point for all SDK functionality
 */
export class FlareSDK {
    private _provider: JsonRpcProvider | null = null;
    private _network: FlareNetwork;
    private _config: Required<SDKConfig>;
    private _initialized = false;

    // Modules
    public ftso: FTSOModule;
    public wallet: WalletModule;
    public utils: UtilsModule;
    public fdc: FDCModule;
    public staking: StakingModule;
    public fassets: FAssetsModule;
    public stateConnector: StateConnectorModule;

    constructor(config: SDKConfig = {}) {
        // Set defaults
        this._network = config.network || 'flare';
        this._config = {
            network: this._network,
            rpcUrl: config.rpcUrl || getNetworkConfig(this._network).rpc,
            provider: config.provider || null,
            cacheEnabled: config.cacheEnabled ?? true,
            cacheTTL: config.cacheTTL ?? 60,
            debug: config.debug ?? false,
        };

        // Initialize provider
        this._initializeProvider();

        // Initialize modules
        this.ftso = new FTSOModule(this.provider, this._network, this._config.cacheTTL);
        this.wallet = new WalletModule();
        this.utils = new UtilsModule();
        this.fdc = new FDCModule(this.provider, this._network);
        this.staking = new StakingModule(this.provider, this._network);
        this.fassets = new FAssetsModule(this.provider, this._network);
        this.stateConnector = new StateConnectorModule(this.provider, this._network);
    }

    /**
     * Initialize the RPC provider
     */
    private _initializeProvider(): void {
        try {
            if (this._config.provider) {
                this._provider = this._config.provider;
            } else {
                this._provider = new JsonRpcProvider(this._config.rpcUrl);
            }

            this._initialized = true;

            if (this._config.debug) {
                console.log(`[FlareSDK] Connected to ${this._network}`);
            }
        } catch (error) {
            throw new SDKError(
                'Failed to initialize provider',
                ErrorCodes.NETWORK_ERROR,
                error
            );
        }
    }

    /**
     * Get the current provider
     */
    get provider(): JsonRpcProvider {
        if (!this._provider || !this._initialized) {
            throw new SDKError(
                'SDK not initialized',
                ErrorCodes.NOT_INITIALIZED
            );
        }
        return this._provider;
    }

    /**
     * Get the current network
     */
    get network(): FlareNetwork {
        return this._network;
    }

    /**
     * Get the network configuration
     */
    get networkConfig() {
        return getNetworkConfig(this._network);
    }

    /**
     * Check if SDK is initialized
     */
    get isInitialized(): boolean {
        return this._initialized;
    }

    /**
     * Get SDK configuration
     */
    get config(): Readonly<Required<SDKConfig>> {
        return this._config;
    }

    /**
     * Switch to a different network
     */
    async switchNetwork(network: FlareNetwork): Promise<void> {
        if (network === this._network) {
            return;
        }

        this._network = network;
        this._config.network = network;
        this._config.rpcUrl = getNetworkConfig(network).rpc;

        // Reinitialize provider
        this._initializeProvider();

        // Reinitialize modules with new provider
        this.ftso = new FTSOModule(this.provider, this._network, this._config.cacheTTL);

        if (this._config.debug) {
            console.log(`[FlareSDK] Switched network to ${network}`);
        }
    }

    /**
     * Disconnect and cleanup
     */
    disconnect(): void {
        // Cleanup modules
        this.ftso.cleanup();

        this._provider = null;
        this._initialized = false;

        if (this._config.debug) {
            console.log('[FlareSDK] Disconnected');
        }
    }
}
