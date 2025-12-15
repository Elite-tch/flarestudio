import { Contract, BrowserProvider, formatEther, parseEther, parseUnits, formatUnits, isAddress, getAddress, JsonRpcProvider } from 'ethers';

// src/core/FlareSDK.ts

// src/core/networks.ts
var NETWORKS = {
  flare: {
    chainId: 14,
    name: "Flare Mainnet",
    rpc: "https://flare-api.flare.network/ext/C/rpc",
    explorer: "https://flare-explorer.flare.network",
    testnet: false
  },
  coston2: {
    chainId: 114,
    name: "Coston2 Testnet",
    rpc: "https://coston2-api.flare.network/ext/C/rpc",
    explorer: "https://coston2-explorer.flare.network",
    testnet: true
  },
  songbird: {
    chainId: 19,
    name: "Songbird Canary Network",
    rpc: "https://songbird-api.flare.network/ext/C/rpc",
    explorer: "https://songbird-explorer.flare.network",
    testnet: false
  },
  coston: {
    chainId: 16,
    name: "Coston Testnet",
    rpc: "https://coston-api.flare.network/ext/C/rpc",
    explorer: "https://coston-explorer.flare.network",
    testnet: true
  }
};
function getNetworkConfig(network) {
  return NETWORKS[network];
}
function getNetworkByChainId(chainId) {
  return Object.entries(NETWORKS).find(
    ([_, config]) => config.chainId === chainId
  )?.[0];
}

// src/core/errors.ts
var SDKError = class _SDKError extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "SDKError";
    Object.setPrototypeOf(this, _SDKError.prototype);
  }
};
var FTSOError = class _FTSOError extends SDKError {
  constructor(message, code, details) {
    super(message, code, details);
    this.name = "FTSOError";
    Object.setPrototypeOf(this, _FTSOError.prototype);
  }
};
var FDCError = class _FDCError extends SDKError {
  constructor(message, code, details) {
    super(message, code, details);
    this.name = "FDCError";
    Object.setPrototypeOf(this, _FDCError.prototype);
  }
};
var FAssetsError = class _FAssetsError extends SDKError {
  constructor(message, code, details) {
    super(message, code, details);
    this.name = "FAssetsError";
    Object.setPrototypeOf(this, _FAssetsError.prototype);
  }
};
var WalletError = class _WalletError extends SDKError {
  constructor(message, code, details) {
    super(message, code, details);
    this.name = "WalletError";
    Object.setPrototypeOf(this, _WalletError.prototype);
  }
};
var StakingError = class _StakingError extends SDKError {
  constructor(message, code, details) {
    super(message, code, details);
    this.name = "StakingError";
    Object.setPrototypeOf(this, _StakingError.prototype);
  }
};
var StateConnectorError = class _StateConnectorError extends SDKError {
  constructor(message, code, details) {
    super(message, code, details);
    this.name = "StateConnectorError";
    Object.setPrototypeOf(this, _StateConnectorError.prototype);
  }
};
var ErrorCodes = {
  // General
  INVALID_PARAMETER: "INVALID_PARAMETER",
  NETWORK_ERROR: "NETWORK_ERROR",
  NOT_INITIALIZED: "NOT_INITIALIZED",
  // FTSO
  SYMBOL_NOT_FOUND: "SYMBOL_NOT_FOUND",
  PRICE_NOT_AVAILABLE: "PRICE_NOT_AVAILABLE",
  INVALID_TIME_RANGE: "INVALID_TIME_RANGE",
  // FDC
  ATTESTATION_NOT_FOUND: "ATTESTATION_NOT_FOUND",
  VERIFICATION_FAILED: "VERIFICATION_FAILED",
  INVALID_PROOF: "INVALID_PROOF",
  // fAssets
  ASSET_NOT_SUPPORTED: "ASSET_NOT_SUPPORTED",
  INSUFFICIENT_COLLATERAL: "INSUFFICIENT_COLLATERAL",
  MINTING_FAILED: "MINTING_FAILED",
  REDEMPTION_FAILED: "REDEMPTION_FAILED",
  // Wallet
  WALLET_NOT_CONNECTED: "WALLET_NOT_CONNECTED",
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  SIGNATURE_REJECTED: "SIGNATURE_REJECTED",
  // Staking
  DELEGATION_FAILED: "DELEGATION_FAILED",
  CLAIM_FAILED: "CLAIM_FAILED",
  PROVIDER_NOT_FOUND: "PROVIDER_NOT_FOUND",
  NO_REWARDS: "NO_REWARDS",
  INVALID_PARAMS: "INVALID_PARAMS",
  // State Connector
  PROOF_VERIFICATION_FAILED: "PROOF_VERIFICATION_FAILED",
  INVALID_ATTESTATION_TYPE: "INVALID_ATTESTATION_TYPE"
};
var CONTRACT_REGISTRY_ABI = [
  "function getContractAddressByName(string memory _name) external view returns (address)"
];
var FTSO_REGISTRY_ABI = [
  "function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _assetPriceUsdDecimals)",
  "function getSupportedSymbols() external view returns (string[] memory _supportedSymbols)"
];
var FTSOModule = class {
  constructor(provider, network, cacheTTL = 60) {
    this.ftsoRegistryAddressPromise = null;
    this.cache = /* @__PURE__ */ new Map();
    this.subscriptions = /* @__PURE__ */ new Map();
    this.provider = provider;
    this.cacheTTL = cacheTTL * 1e3;
    const contractRegistryAddresses = {
      flare: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
      coston2: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
      songbird: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
      coston: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"
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
  async getFtsoRegistryAddress() {
    if (!this.ftsoRegistryAddressPromise) {
      this.ftsoRegistryAddressPromise = (async () => {
        try {
          const contractRegistry = new Contract(
            this.contractRegistryAddress,
            CONTRACT_REGISTRY_ABI,
            this.provider
          );
          const address = await contractRegistry.getContractAddressByName("FtsoRegistry");
          return address;
        } catch (error) {
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
  async getPrice(symbol, options = {}) {
    const cacheEnabled = options.cache ?? true;
    const ttl = options.ttl ? options.ttl * 1e3 : this.cacheTTL;
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
      const priceData = {
        symbol,
        price: Number(price) / Math.pow(10, Number(decimals)),
        timestamp: new Date(Number(timestamp) * 1e3),
        decimals: Number(decimals),
        rawPrice: price.toString()
      };
      if (cacheEnabled) {
        this.cache.set(symbol, { price: priceData, timestamp: Date.now() });
      }
      return priceData;
    } catch (error) {
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
  async getPrices(symbols, options = {}) {
    const pricePromises = symbols.map((symbol) => this.getPrice(symbol, options));
    return Promise.all(pricePromises);
  }
  /**
   * Get list of supported symbols
   */
  async getSupportedSymbols() {
    try {
      const registryAddress = await this.getFtsoRegistryAddress();
      const registry = new Contract(
        registryAddress,
        FTSO_REGISTRY_ABI,
        this.provider
      );
      const symbols = await registry.getSupportedSymbols();
      return symbols;
    } catch (error) {
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
  subscribe(symbol, callback, interval = 5e3) {
    this.getPrice(symbol, { cache: false }).then(callback).catch(console.error);
    const timer = setInterval(async () => {
      try {
        const price = await this.getPrice(symbol, { cache: false });
        callback(price);
      } catch (error) {
        console.error(`Subscription error for ${symbol}:`, error);
      }
    }, interval);
    this.subscriptions.set(symbol, timer);
    return () => {
      const timer2 = this.subscriptions.get(symbol);
      if (timer2) {
        clearInterval(timer2);
        this.subscriptions.delete(symbol);
      }
    };
  }
  /**
   * Clear all cached prices
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * Cleanup all subscriptions
   */
  cleanup() {
    this.subscriptions.forEach((timer) => clearInterval(timer));
    this.subscriptions.clear();
    this.cache.clear();
  }
};
var WalletModule = class {
  constructor() {
    this.provider = null;
    this.signer = null;
  }
  /**
   * Connect to a wallet (e.g., MetaMask)
   * @param provider - The EIP-1193 provider (e.g., window.ethereum)
   */
  async connect(provider) {
    try {
      this.provider = new BrowserProvider(provider);
      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();
      return address;
    } catch (error) {
      throw new WalletError(
        `Failed to connect wallet: ${error.message}`,
        ErrorCodes.WALLET_NOT_CONNECTED,
        error
      );
    }
  }
  /**
   * Get the connected wallet address
   */
  async getAddress() {
    this.ensureConnected();
    return await this.signer.getAddress();
  }
  /**
   * Get the balance of the connected wallet
   */
  async getBalance() {
    this.ensureConnected();
    try {
      const balance = await this.provider.getBalance(await this.signer.getAddress());
      return {
        flr: formatEther(balance)
        // wflr: TODO: Implement wrapped FLR balance fetching
      };
    } catch (error) {
      throw new WalletError(
        `Failed to get balance: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Send a transaction
   */
  async send(options) {
    this.ensureConnected();
    try {
      const tx = {
        to: options.to,
        value: options.value ? parseEther(options.value) : void 0,
        data: options.data
      };
      return await this.signer.sendTransaction(tx);
    } catch (error) {
      throw new WalletError(
        `Transaction failed: ${error.message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Sign a message
   */
  async signMessage(message) {
    this.ensureConnected();
    try {
      return await this.signer.signMessage(message);
    } catch (error) {
      throw new WalletError(
        `Signing failed: ${error.message}`,
        ErrorCodes.SIGNATURE_REJECTED,
        error
      );
    }
  }
  /**
   * Check if wallet is connected
   */
  isConnected() {
    return !!this.signer;
  }
  /**
   * Ensure wallet is connected
   */
  ensureConnected() {
    if (!this.signer || !this.provider) {
      throw new WalletError(
        "Wallet not connected",
        ErrorCodes.WALLET_NOT_CONNECTED
      );
    }
  }
};
var UtilsModule = class {
  constructor() {
    this.cacheStore = /* @__PURE__ */ new Map();
    /**
     * Cache utilities
     */
    this.cache = {
      set: (key, value, ttlSeconds) => {
        this.cacheStore.set(key, {
          value,
          expires: Date.now() + ttlSeconds * 1e3
        });
      },
      get: (key) => {
        const item = this.cacheStore.get(key);
        if (!item) return null;
        if (Date.now() > item.expires) {
          this.cacheStore.delete(key);
          return null;
        }
        return item.value;
      },
      clear: () => {
        this.cacheStore.clear();
      }
    };
  }
  /**
   * Convert Wei to Ether
   */
  fromWei(wei) {
    return formatEther(wei);
  }
  /**
   * Convert Ether to Wei
   */
  toWei(ether) {
    return parseEther(ether);
  }
  /**
   * Convert value to specific decimals
   */
  toDecimals(value, decimals) {
    return parseUnits(value, decimals);
  }
  /**
   * Convert value from specific decimals
   */
  fromDecimals(value, decimals) {
    return formatUnits(value, decimals);
  }
  /**
   * Validate an address
   */
  isValidAddress(address) {
    return isAddress(address);
  }
  /**
   * Get checksum address
   */
  toChecksumAddress(address) {
    try {
      return getAddress(address);
    } catch (error) {
      throw new Error(`Invalid address: ${address}`);
    }
  }
  /**
   * Format error object
   */
  formatError(error) {
    if (error instanceof SDKError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details
      };
    }
    return {
      code: "UNKNOWN_ERROR",
      message: error.message || "An unknown error occurred",
      details: error
    };
  }
};
var CONTRACT_REGISTRY_ABI2 = [
  "function getContractAddressByName(string memory _name) external view returns (address)"
];
var FDC_HUB_ABI = [
  "event AttestationRequest(uint256 timestamp, bytes data)",
  "function requestAttestation(bytes calldata _data) external payable"
];
var FDCModule = class {
  constructor(provider, network) {
    this.fdcHubAddress = null;
    this.provider = provider;
    this.network = network;
    this.contractRegistryAddress = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
  }
  /**
   * Resolve FdcHub or StateConnector address from registry
   */
  async getFdcHubAddress() {
    if (this.fdcHubAddress) return this.fdcHubAddress;
    try {
      const registry = new Contract(this.contractRegistryAddress, CONTRACT_REGISTRY_ABI2, this.provider);
      let addr = await registry.getContractAddressByName("FdcHub").catch(() => null);
      if (!addr || addr === "0x0000000000000000000000000000000000000000") {
        addr = await registry.getContractAddressByName("StateConnector");
      }
      if (!addr || addr === "0x0000000000000000000000000000000000000000") {
        throw new Error("FdcHub/StateConnector not found in registry");
      }
      this.fdcHubAddress = addr;
      return addr;
    } catch (error) {
      throw new FDCError(
        `Failed to resolve FDC contract: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Request a Bitcoin Payment Verification (Simulated encoding for MVP)
   * In a full implementation, 'params' would be encoded into the specific byte sequence required by the specific Attestation Type definition.
   */
  async verifyBitcoinPayment(params, signer) {
    try {
      const hubAddr = await this.getFdcHubAddress();
      const fdcHub = new Contract(hubAddr, FDC_HUB_ABI, signer);
      const placeholderData = "0x1234567890abcdef" + params.txHash.replace("0x", "");
      const tx = await fdcHub.requestAttestation(placeholderData);
      return tx;
    } catch (error) {
      throw new FDCError(
        `Failed to request verification: ${error.message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Request an EVM Transaction Verification (Ethereum, simple payment or contract call)
   */
  async verifyEVMTransaction(params, signer) {
    try {
      const hubAddr = await this.getFdcHubAddress();
      const fdcHub = new Contract(hubAddr, FDC_HUB_ABI, signer);
      const placeholderData = "0xeeee" + params.txHash.replace("0x", "") + params.chainId.toString(16).padStart(4, "0");
      const tx = await fdcHub.requestAttestation(placeholderData);
      return tx;
    } catch (error) {
      throw new FDCError(
        `Failed to request EVM verification: ${error.message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Get recent attestation requests from the chain
   */
  async getRecentAttestations(options = {}) {
    try {
      const hubAddr = await this.getFdcHubAddress();
      const fdcHub = new Contract(hubAddr, FDC_HUB_ABI, this.provider);
      const limit = options.limit || 10;
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 5e3);
      const filter = fdcHub.filters.AttestationRequest();
      const events = await fdcHub.queryFilter(filter, fromBlock, currentBlock);
      const recentEvents = events.reverse().slice(0, limit);
      return recentEvents.map((e) => ({
        id: e.transactionHash,
        type: "AttestationRequest",
        // Generic type as parsing data requires schema
        status: "submitted",
        // Request submitted to chain
        blockNumber: e.blockNumber,
        timestamp: /* @__PURE__ */ new Date(),
        // Block timestamp fetching would vary, using current for list
        data: e.args ? { rawData: e.args[1] } : {}
      }));
    } catch (error) {
      console.warn("Failed to fetch real attestations, checking network...", error.message);
      return [];
    }
  }
  /**
   * Subscribe to new attestation requests
   */
  subscribe(callback) {
    let fdcHub = null;
    const setup = async () => {
      try {
        const hubAddr = await this.getFdcHubAddress();
        fdcHub = new Contract(hubAddr, FDC_HUB_ABI, this.provider);
        fdcHub.on("AttestationRequest", (timestamp, data, event) => {
          const attestation = {
            id: event.log.transactionHash,
            type: "AttestationRequest",
            status: "pending",
            blockNumber: event.log.blockNumber,
            timestamp: /* @__PURE__ */ new Date(),
            data: { rawData: data }
          };
          callback(attestation);
        });
      } catch (e) {
        console.error("Subscription setup failed:", e);
      }
    };
    setup();
    return () => {
      if (fdcHub) {
        fdcHub.removeAllListeners("AttestationRequest");
      }
    };
  }
};
var WNAT_ABI = [
  "function deposit() payable",
  "function withdraw(uint256 amount)",
  "function balanceOf(address) view returns (uint256)",
  "function delegate(address to, uint256 bips)",
  "function delegatesOf(address owner) view returns (address[] memory, uint256[] memory)",
  "function undelegateAll()",
  "function votePowerOf(address owner) view returns (uint256)"
];
var CONTRACT_REGISTRY_ABI3 = [
  "function getContractAddressByName(string memory _name) external view returns (address)"
];
var REWARD_MANAGER_ABI = [
  "function claimReward(address payable recipient, uint256[] memory epochs) returns (uint256)",
  "function getEpochsWithUnclaimedRewards(address beneficiary) view returns (uint256[] memory)",
  "function getStateOfRewards(address beneficiary, uint256 rewardEpoch) view returns (address[] memory, uint256[] memory, bool[] memory, bool)",
  "function getUnclaimedReward(uint256 epoch, address beneficiary) view returns (uint256)"
];
var StakingModule = class {
  constructor(provider, network) {
    this.rewardManagerAddress = null;
    this.provider = provider;
    this.network = network;
    const wnatAddresses = {
      flare: "0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d",
      coston2: "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273",
      songbird: "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED",
      coston: "0x767b25A658E8FC8ab6eBbd52043495dB61b4ea91"
    };
    this.contractRegistryAddress = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
    this.wnatAddress = wnatAddresses[network];
    if (!this.wnatAddress) {
      throw new StakingError(
        `Unsupported network: ${network}`,
        ErrorCodes.NETWORK_ERROR
      );
    }
  }
  /**
   * Get the FtsoRewardManager address from the Contract Registry
   */
  async getRewardManagerAddress() {
    if (this.rewardManagerAddress) {
      return this.rewardManagerAddress;
    }
    try {
      const contractRegistry = new Contract(
        this.contractRegistryAddress,
        CONTRACT_REGISTRY_ABI3,
        this.provider
      );
      this.rewardManagerAddress = String(await contractRegistry.getContractAddressByName("FtsoRewardManager"));
      return this.rewardManagerAddress;
    } catch (error) {
      throw new StakingError(
        `Failed to get FtsoRewardManager address: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Wrap native FLR/SGB to WFLR/WSGB
   * @param amount Amount to wrap in FLR/SGB
   * @param signer Wallet signer (must be connected)
   */
  async wrap(amount, signer) {
    try {
      const wnat = new Contract(this.wnatAddress, WNAT_ABI, signer);
      const tx = await wnat.deposit({ value: parseEther(amount) });
      return tx;
    } catch (error) {
      let message = error.message;
      if (error.message.includes("Failed to fetch") || error.code === -32603) {
        message = "Network error: Please check your MetaMask connection and RPC URL.";
      }
      throw new StakingError(
        `Failed to wrap tokens: ${message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Unwrap WFLR/WSGB to native FLR/SGB
   * @param amount Amount to unwrap in WFLR/WSGB
   * @param signer Wallet signer (must be connected)
   */
  async unwrap(amount, signer) {
    try {
      const wnat = new Contract(this.wnatAddress, WNAT_ABI, signer);
      const tx = await wnat.withdraw(parseEther(amount));
      return tx;
    } catch (error) {
      let message = error.message;
      if (error.message.includes("Failed to fetch") || error.code === -32603) {
        message = "Network error: Please check your MetaMask connection and RPC URL.";
      }
      throw new StakingError(
        `Failed to unwrap tokens: ${message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Get WFLR/WSGB balance
   * @param address Wallet address
   */
  async getWNatBalance(address) {
    try {
      const wnat = new Contract(this.wnatAddress, WNAT_ABI, this.provider);
      const balance = await wnat.balanceOf(address);
      return formatEther(balance);
    } catch (error) {
      throw new StakingError(
        `Failed to get WNat balance: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get vote power (delegatable amount)
   * @param address Wallet address
   */
  async getVotePower(address) {
    try {
      const wnat = new Contract(this.wnatAddress, WNAT_ABI, this.provider);
      const votePower = await wnat.votePowerOf(address);
      return formatEther(votePower);
    } catch (error) {
      throw new StakingError(
        `Failed to get vote power: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Delegate vote power to a provider
   * @param providerAddress FTSO provider address
   * @param percentage Percentage to delegate (0-100)
   * @param signer Wallet signer (must be connected)
   */
  async delegate(providerAddress, percentage, signer) {
    if (percentage < 0 || percentage > 100) {
      throw new StakingError(
        "Percentage must be between 0 and 100",
        ErrorCodes.INVALID_PARAMS
      );
    }
    try {
      const wnat = new Contract(this.wnatAddress, WNAT_ABI, signer);
      const bips = percentage * 100;
      const tx = await wnat.delegate(providerAddress, bips);
      return tx;
    } catch (error) {
      let message = error.message;
      if (error.message.includes("Failed to fetch") || error.code === -32603) {
        message = "Network error: Please check your MetaMask connection and RPC URL.";
      }
      throw new StakingError(
        `Failed to delegate: ${message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Undelegate all vote power
   * @param signer Wallet signer (must be connected)
   */
  async undelegateAll(signer) {
    try {
      const wnat = new Contract(this.wnatAddress, WNAT_ABI, signer);
      const tx = await wnat.undelegateAll();
      return tx;
    } catch (error) {
      let message = error.message;
      if (error.message.includes("Failed to fetch") || error.code === -32603) {
        message = "Network error: Please check your MetaMask connection and RPC URL.";
      }
      throw new StakingError(
        `Failed to undelegate: ${message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Get current delegations
   * @param address Wallet address
   */
  async getDelegations(address) {
    try {
      const wnat = new Contract(this.wnatAddress, WNAT_ABI, this.provider);
      const [providers, percentages] = await wnat.delegatesOf(address);
      return providers.map((provider, index) => ({
        provider,
        percentage: Number(percentages[index]) / 100,
        // Convert bips to percentage
        amount: "0"
        // Would need to calculate based on total vote power
      }));
    } catch (error) {
      throw new StakingError(
        `Failed to get delegations: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get unclaimed reward epochs
   * @param address Wallet address
   */
  async getUnclaimedEpochs(address) {
    try {
      const rewardManagerAddress = await this.getRewardManagerAddress();
      const rewardManager = new Contract(
        rewardManagerAddress,
        REWARD_MANAGER_ABI,
        this.provider
      );
      const epochs = await rewardManager.getEpochsWithUnclaimedRewards(address);
      return epochs.map((epoch) => Number(epoch));
    } catch (error) {
      throw new StakingError(
        `Failed to get unclaimed epochs: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get unclaimed reward amount for a specific epoch
   * @param address Wallet address
   * @param epoch Reward epoch number
   */
  async getUnclaimedReward(address, epoch) {
    try {
      const rewardManagerAddress = await this.getRewardManagerAddress();
      const rewardManager = new Contract(
        rewardManagerAddress,
        REWARD_MANAGER_ABI,
        this.provider
      );
      const state = await rewardManager.getStateOfRewards(address, epoch);
      const amounts = state[1];
      const claimed = state[2];
      let totalReward = BigInt(0);
      for (let i = 0; i < amounts.length; i++) {
        if (!claimed[i]) {
          totalReward += amounts[i];
        }
      }
      return formatEther(totalReward);
    } catch (error) {
      throw new StakingError(
        `Failed to get unclaimed reward: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Claim rewards for specific epochs
   * @param epochs Array of epoch numbers to claim (leave empty for all unclaimed)
   * @param signer Wallet signer (must be connected)
   */
  async claimRewards(epochs, signer) {
    try {
      const address = await signer.getAddress();
      const rewardManagerAddress = await this.getRewardManagerAddress();
      const rewardManager = new Contract(
        rewardManagerAddress,
        REWARD_MANAGER_ABI,
        signer
      );
      const epochsToClaim = epochs || await this.getUnclaimedEpochs(address);
      if (epochsToClaim.length === 0) {
        throw new StakingError(
          "No unclaimed rewards available",
          ErrorCodes.NO_REWARDS
        );
      }
      const tx = await rewardManager.claimReward(address, epochsToClaim);
      return tx;
    } catch (error) {
      let message = error.message;
      if (error.message.includes("Failed to fetch") || error.code === -32603) {
        message = "Network error: Please check your MetaMask connection and RPC URL.";
      }
      throw new StakingError(
        `Failed to claim rewards: ${message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Get rewards history (claimed and unclaimed)
   * @param address Wallet address
   */
  async getRewardsHistory(address) {
    try {
      const unclaimedEpochs = await this.getUnclaimedEpochs(address);
      const rewards = [];
      for (const epoch of unclaimedEpochs) {
        const amount = await this.getUnclaimedReward(address, epoch);
        rewards.push({
          epoch,
          amount,
          claimed: false,
          timestamp: /* @__PURE__ */ new Date()
          // Would need to calculate actual timestamp
        });
      }
      return rewards;
    } catch (error) {
      throw new StakingError(
        `Failed to get rewards history: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get provider list with stats
   * Note: This would require additional data sources or indexing
   * For now, returns empty array - implement with your preferred data source
   */
  async getProviders(options = {}) {
    console.warn("getProviders() requires external data source - use flaremetrics.io API or similar");
    return [];
  }
  /**
   * Calculate potential rewards (estimate)
   * @param amount Amount to delegate
   * @param apy Annual percentage yield (default 12%)
   * @param days Number of days
   */
  calculatePotentialRewards(amount, apy = 12, days = 365) {
    const amountNum = parseFloat(amount);
    const rewards = amountNum * (apy / 100) * (days / 365);
    return rewards.toFixed(4);
  }
};
var ASSET_MANAGER_ABI = [
  "function reserveCollateral(address agent, uint256 lots) payable returns (uint256, uint256, uint64)",
  "function redeem(uint256 lots, string memory redeemerUnderlyingAddressExecutor, address redeemer) payable returns (uint256, uint64)",
  "function fAsset() view returns (address)",
  "function lotSize() view returns (uint256)",
  "function collateralReservationFee(uint256 lots) view returns (uint256)",
  "function getAllAgents() view returns (address[])"
];
var IERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];
var CONTRACT_REGISTRY_ABI4 = [
  "function getContractAddressByName(string memory _name) external view returns (address)"
];
var FAssetsModule = class {
  constructor(provider, network) {
    this.provider = provider;
    this.network = network;
    this.contractRegistryAddress = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
  }
  /**
   * Get AssetManager address from Registry
   */
  async getAssetManagerAddress(symbol) {
    try {
      const contractRegistry = new Contract(
        this.contractRegistryAddress,
        CONTRACT_REGISTRY_ABI4,
        this.provider
      );
      const name = `AssetManager${symbol.toUpperCase()}`;
      const address = await contractRegistry.getContractAddressByName(name);
      if (address === "0x0000000000000000000000000000000000000000") {
        throw new Error(`AssetManager for ${symbol} not found`);
      }
      return address;
    } catch (error) {
      throw new FAssetsError(
        `Failed to resolve AssetManager for ${symbol}: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get fAsset Token address
   */
  async getFAssetAddress(assetManagerAddress) {
    const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, this.provider);
    return await assetManager.fAsset();
  }
  /**
   * Get fAsset balance
   */
  async getBalance(address, symbol) {
    try {
      const assetManagerAddress = await this.getAssetManagerAddress(symbol);
      const fAssetAddress = await this.getFAssetAddress(assetManagerAddress);
      const fAsset = new Contract(fAssetAddress, IERC20_ABI, this.provider);
      const [balance, decimals, tokenSymbol] = await Promise.all([
        fAsset.balanceOf(address),
        fAsset.decimals(),
        fAsset.symbol()
      ]);
      return {
        balance: formatUnits(balance, decimals),
        decimals: Number(decimals),
        symbol: tokenSymbol
      };
    } catch (error) {
      throw new FAssetsError(
        `Failed to get balance: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get collateral requirements for minting
   * @param symbol fAsset symbol (e.g. fXRP)
   * @param lots Number of lots to mint
   */
  async getCollateralRequirements(symbol, lots) {
    try {
      const assetManagerAddress = await this.getAssetManagerAddress(symbol);
      const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, this.provider);
      const fee = await assetManager.collateralReservationFee(lots);
      return {
        required: formatEther(fee),
        currency: "FLR"
        // Collateral reservation fee is usually in native token (FLR/C2FLR)
      };
    } catch (error) {
      throw new FAssetsError(
        `Failed to get collateral requirements: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Mint fAssets (Reserve Collateral)
   * Note: This is Step 1 of minting. Step 2 requires paying underlying asset. Step 3 is executing minting.
   * @param symbol fAsset symbol
   * @param lots Number of lots to mint
   * @param options { agent: string } Agent address to mint against
   * @param signer Connected signer
   */
  async mint(symbol, lots, options, signer) {
    try {
      const assetManagerAddress = await this.getAssetManagerAddress(symbol);
      const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, signer);
      const fee = await assetManager.collateralReservationFee(lots);
      const tx = await assetManager.reserveCollateral(options.agent, lots, { value: fee });
      return tx;
    } catch (error) {
      let message = error.message;
      if (error.message.includes("Failed to fetch")) {
        message = "Network error: Please check your MetaMask connection and RPC URL.";
      }
      throw new FAssetsError(
        `Failed to mint (reserve collateral): ${message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Redeem fAssets
   * @param symbol fAsset symbol
   * @param lots Number of lots to redeem
   * @param options { to: string } Underlying address to receive assets
   * @param signer Connected signer
   */
  async redeem(symbol, lots, options, signer) {
    try {
      const assetManagerAddress = await this.getAssetManagerAddress(symbol);
      const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, signer);
      const tx = await assetManager.redeem(lots, options.to, await signer.getAddress());
      return tx;
    } catch (error) {
      let message = error.message;
      if (error.message.includes("Failed to fetch")) {
        message = "Network error: Please check your MetaMask connection and RPC URL.";
      }
      throw new FAssetsError(
        `Failed to redeem: ${message}`,
        ErrorCodes.TRANSACTION_FAILED,
        error
      );
    }
  }
  /**
   * Get supported fAssets
   * This is a helper that returns hardcoded list for now, as Registry enumeration is complex
   */
  async getSupportedAssets() {
    return ["fXRP", "fBTC", "fDOGE", "fLTC", "fALGO", "fFIL"];
  }
  /**
   * Get all available agents
   */
  async getAgents(symbol) {
    try {
      const assetManagerAddress = await this.getAssetManagerAddress(symbol);
      const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, this.provider);
      return await assetManager.getAllAgents();
    } catch (error) {
      throw new FAssetsError(
        `Failed to get agents: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get Lot Size
   */
  async getLotSize(symbol) {
    try {
      const assetManagerAddress = await this.getAssetManagerAddress(symbol);
      const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, this.provider);
      const size = await assetManager.lotSize();
      return size.toString();
    } catch (error) {
      throw new FAssetsError(
        `Failed to get lot size: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
};
var CONTRACT_REGISTRY_ABI5 = [
  "function getContractAddressByName(string memory _name) external view returns (address)"
];
var STATE_CONNECTOR_ABI = [
  "function lastConfirmedRoundId() external view returns (uint256)",
  "function merkleRoots(uint256 _roundId) external view returns (bytes32)",
  "event RoundFinalized(uint256 indexed roundId, bytes32 merkleRoot)"
];
var StateConnectorModule = class {
  constructor(provider, network) {
    this.contractRegistryAddress = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
    // Flare/Coston2 Registry
    this.stateConnectorAddress = null;
    this.provider = provider;
    this.network = network;
  }
  /**
   * Resolve StateConnector address from registry
   */
  async getStateConnectorAddress() {
    if (this.stateConnectorAddress) return this.stateConnectorAddress;
    try {
      const registry = new Contract(this.contractRegistryAddress, CONTRACT_REGISTRY_ABI5, this.provider);
      const addr = await registry.getContractAddressByName("StateConnector");
      if (!addr || addr === "0x0000000000000000000000000000000000000000") {
        throw new Error("StateConnector contract not found in registry");
      }
      this.stateConnectorAddress = addr;
      return addr;
    } catch (error) {
      throw new SDKError(
        `Failed to resolve StateConnector contract: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get the ID of the last finalized voting round
   */
  async getLastConfirmedRoundId() {
    try {
      const addr = await this.getStateConnectorAddress();
      const sc = new Contract(addr, STATE_CONNECTOR_ABI, this.provider);
      const roundId = await sc.lastConfirmedRoundId();
      return Number(roundId);
    } catch (error) {
      throw new SDKError(
        `Failed to get last confirmed round: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get the merkle root for a specific round
   */
  async getMerkleRoot(roundId) {
    try {
      const addr = await this.getStateConnectorAddress();
      const sc = new Contract(addr, STATE_CONNECTOR_ABI, this.provider);
      const root = await sc.merkleRoots(roundId);
      return root;
    } catch (error) {
      throw new SDKError(
        `Failed to get merkle root for round ${roundId}: ${error.message}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Subscribe to RoundFinalized events
   */
  subscribeToFinalizedRounds(callback) {
    let sc = null;
    const setup = async () => {
      try {
        const addr = await this.getStateConnectorAddress();
        sc = new Contract(addr, STATE_CONNECTOR_ABI, this.provider);
        sc.on("RoundFinalized", (roundId, merkleRoot) => {
          callback(Number(roundId), merkleRoot);
        });
      } catch (e) {
        console.error("StateConnector Subscription setup failed:", e);
      }
    };
    setup();
    return () => {
      if (sc) {
        sc.removeAllListeners("RoundFinalized");
      }
    };
  }
};

// src/core/FlareSDK.ts
var FlareSDK = class {
  constructor(config = {}) {
    this._provider = null;
    this._initialized = false;
    this._network = config.network || "flare";
    this._config = {
      network: this._network,
      rpcUrl: config.rpcUrl || getNetworkConfig(this._network).rpc,
      provider: config.provider || null,
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTTL: config.cacheTTL ?? 60,
      debug: config.debug ?? false
    };
    this._initializeProvider();
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
  _initializeProvider() {
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
        "Failed to initialize provider",
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }
  /**
   * Get the current provider
   */
  get provider() {
    if (!this._provider || !this._initialized) {
      throw new SDKError(
        "SDK not initialized",
        ErrorCodes.NOT_INITIALIZED
      );
    }
    return this._provider;
  }
  /**
   * Get the current network
   */
  get network() {
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
  get isInitialized() {
    return this._initialized;
  }
  /**
   * Get SDK configuration
   */
  get config() {
    return this._config;
  }
  /**
   * Switch to a different network
   */
  async switchNetwork(network) {
    if (network === this._network) {
      return;
    }
    this._network = network;
    this._config.network = network;
    this._config.rpcUrl = getNetworkConfig(network).rpc;
    this._initializeProvider();
    this.ftso = new FTSOModule(this.provider, this._network, this._config.cacheTTL);
    if (this._config.debug) {
      console.log(`[FlareSDK] Switched network to ${network}`);
    }
  }
  /**
   * Disconnect and cleanup
   */
  disconnect() {
    this.ftso.cleanup();
    this._provider = null;
    this._initialized = false;
    if (this._config.debug) {
      console.log("[FlareSDK] Disconnected");
    }
  }
};

export { ErrorCodes, FAssetsError, FAssetsModule, FDCError, FDCModule, FTSOError, FTSOModule, FlareSDK, NETWORKS, SDKError, StakingError, StakingModule, StateConnectorError, StateConnectorModule, UtilsModule, WalletError, WalletModule, getNetworkByChainId, getNetworkConfig };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map