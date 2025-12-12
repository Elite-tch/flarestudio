import { BrowserProvider, JsonRpcSigner, formatEther, parseEther, TransactionResponse, TransactionRequest } from 'ethers';
import { WalletError, ErrorCodes } from '../../core/errors';
import { WalletBalance, TransactionOptions } from '../../types';

/**
 * Wallet Module
 * Utility functions for wallet interaction and transaction management
 */
export class WalletModule {
    private provider: BrowserProvider | null = null;
    private signer: JsonRpcSigner | null = null;

    constructor() { }

    /**
     * Connect to a wallet (e.g., MetaMask)
     * @param provider - The EIP-1193 provider (e.g., window.ethereum)
     */
    async connect(provider: any): Promise<string> {
        try {
            this.provider = new BrowserProvider(provider);
            this.signer = await this.provider.getSigner();
            const address = await this.signer.getAddress();
            return address;
        } catch (error: any) {
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
    async getAddress(): Promise<string> {
        this.ensureConnected();
        return await this.signer!.getAddress();
    }

    /**
     * Get the balance of the connected wallet
     */
    async getBalance(): Promise<WalletBalance> {
        this.ensureConnected();
        try {
            const balance = await this.provider!.getBalance(await this.signer!.getAddress());
            return {
                flr: formatEther(balance),
                // wflr: TODO: Implement wrapped FLR balance fetching
            };
        } catch (error: any) {
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
    async send(options: TransactionOptions): Promise<TransactionResponse> {
        this.ensureConnected();
        try {
            const tx: TransactionRequest = {
                to: options.to,
                value: options.value ? parseEther(options.value) : undefined,
                data: options.data,
            };

            return await this.signer!.sendTransaction(tx);
        } catch (error: any) {
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
    async signMessage(message: string): Promise<string> {
        this.ensureConnected();
        try {
            return await this.signer!.signMessage(message);
        } catch (error: any) {
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
    isConnected(): boolean {
        return !!this.signer;
    }

    /**
     * Ensure wallet is connected
     */
    private ensureConnected(): void {
        if (!this.signer || !this.provider) {
            throw new WalletError(
                'Wallet not connected',
                ErrorCodes.WALLET_NOT_CONNECTED
            );
        }
    }
}
