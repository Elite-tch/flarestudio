import { Contract, JsonRpcProvider, parseEther, formatEther, formatUnits, TransactionResponse } from 'ethers';
import { FAssetsError, ErrorCodes } from '../../core/errors';

// ABIs
const ASSET_MANAGER_ABI = [
    'function reserveCollateral(address agent, uint256 lots) payable returns (uint256, uint256, uint64)',
    'function redeem(uint256 lots, string memory redeemerUnderlyingAddressExecutor, address redeemer) payable returns (uint256, uint64)',
    'function fAsset() view returns (address)',
    'function lotSize() view returns (uint256)',
    'function collateralReservationFee(uint256 lots) view returns (uint256)',
    'function getAllAgents() view returns (address[])'
];

const IERC20_ABI = [
    'function balanceOf(address account) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)'
];

const CONTRACT_REGISTRY_ABI = [
    'function getContractAddressByName(string memory _name) external view returns (address)',
];

/**
 * fAssets Module
 * Bridge and mint synthetic assets on Flare
 */
export class FAssetsModule {
    private provider: JsonRpcProvider;
    private network: string;
    private contractRegistryAddress: string;

    constructor(provider: JsonRpcProvider, network: string) {
        this.provider = provider;
        this.network = network;
        // FlareContractRegistry (same for all networks)
        this.contractRegistryAddress = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019';
    }

    /**
     * Get AssetManager address from Registry
     */
    private async getAssetManagerAddress(symbol: string): Promise<string> {
        try {
            const contractRegistry = new Contract(
                this.contractRegistryAddress,
                CONTRACT_REGISTRY_ABI,
                this.provider
            );

            // Naming convention: AssetManagerSymbol (e.g., AssetManagerFXRP)
            // Remove underscore and uppercase the symbol
            const name = `AssetManager${symbol.toUpperCase()}`;
            const address = await contractRegistry.getContractAddressByName(name);

            if (address === '0x0000000000000000000000000000000000000000') {
                throw new Error(`AssetManager for ${symbol} not found`);
            }

            return address;
        } catch (error: any) {
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
    private async getFAssetAddress(assetManagerAddress: string): Promise<string> {
        const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, this.provider);
        return await assetManager.fAsset();
    }

    /**
     * Get fAsset balance
     */
    async getBalance(address: string, symbol: string): Promise<{ balance: string; decimals: number; symbol: string }> {
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
                symbol: tokenSymbol,
            };
        } catch (error: any) {
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
    async getCollateralRequirements(symbol: string, lots: number): Promise<{ required: string; currency: string }> {
        try {
            const assetManagerAddress = await this.getAssetManagerAddress(symbol);
            const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, this.provider);

            const fee = await assetManager.collateralReservationFee(lots);

            return {
                required: formatEther(fee),
                currency: 'FLR', // Collateral reservation fee is usually in native token (FLR/C2FLR)
            };
        } catch (error: any) {
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
    async mint(symbol: string, lots: number, options: { agent: string }, signer: any): Promise<TransactionResponse> {
        try {
            const assetManagerAddress = await this.getAssetManagerAddress(symbol);
            const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, signer);

            const fee = await assetManager.collateralReservationFee(lots);

            // reserveCollateral(agent, lots) payable
            const tx = await assetManager.reserveCollateral(options.agent, lots, { value: fee });
            return tx;
        } catch (error: any) {
            let message = error.message;
            if (error.message.includes('Failed to fetch')) {
                message = 'Network error: Please check your MetaMask connection and RPC URL.';
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
    async redeem(symbol: string, lots: number, options: { to: string }, signer: any): Promise<TransactionResponse> {
        try {
            const assetManagerAddress = await this.getAssetManagerAddress(symbol);
            const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, signer);

            // redeem(lots, redeemerUnderlyingAddressExecutor, redeemer) payable
            // Note: Some implementations might require paying a redemption fee in native token
            // We'll assume standard redemption for now.

            const tx = await assetManager.redeem(lots, options.to, await signer.getAddress());
            return tx;
        } catch (error: any) {
            let message = error.message;
            if (error.message.includes('Failed to fetch')) {
                message = 'Network error: Please check your MetaMask connection and RPC URL.';
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
    async getSupportedAssets(): Promise<string[]> {
        return ['fXRP', 'fBTC', 'fDOGE', 'fLTC', 'fALGO', 'fFIL'];
    }

    /**
     * Get all available agents
     */
    async getAgents(symbol: string): Promise<string[]> {
        try {
            const assetManagerAddress = await this.getAssetManagerAddress(symbol);
            const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, this.provider);
            return await assetManager.getAllAgents();
        } catch (error: any) {
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
    async getLotSize(symbol: string): Promise<string> {
        try {
            const assetManagerAddress = await this.getAssetManagerAddress(symbol);
            const assetManager = new Contract(assetManagerAddress, ASSET_MANAGER_ABI, this.provider);
            const size = await assetManager.lotSize();
            // Lot size is usually in underlying decimals, but let's return as string
            return size.toString();
        } catch (error: any) {
            throw new FAssetsError(
                `Failed to get lot size: ${error.message}`,
                ErrorCodes.NETWORK_ERROR,
                error
            );
        }
    }
}
