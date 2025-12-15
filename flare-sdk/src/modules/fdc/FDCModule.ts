import { JsonRpcProvider, Contract, Interface } from 'ethers';
import { FDCError, ErrorCodes } from '../../core/errors';
import { Attestation } from '../../types';

// Registry ABI
const CONTRACT_REGISTRY_ABI = [
    'function getContractAddressByName(string memory _name) external view returns (address)',
];

// FDC Hub / State Connector common ABI
// Note: AttestationRequest signature might vary slightly between network versions (SC vs FDC),
// but we'll try to support the common event structure.
const FDC_HUB_ABI = [
    'event AttestationRequest(uint256 timestamp, bytes data)',
    'function requestAttestation(bytes calldata _data) external payable',
];

/**
 * FDC Module
 * Interact with the Flare Data Connector to request and view attestations.
 */
export class FDCModule {
    private provider: JsonRpcProvider;
    private network: string;
    private contractRegistryAddress: string;
    private fdcHubAddress: string | null = null;

    constructor(provider: JsonRpcProvider, network: string) {
        this.provider = provider;
        this.network = network;
        this.contractRegistryAddress = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019'; // Standard Registry Address
    }

    /**
     * Resolve FdcHub or StateConnector address from registry
     */
    private async getFdcHubAddress(): Promise<string> {
        if (this.fdcHubAddress) return this.fdcHubAddress;

        try {
            const registry = new Contract(this.contractRegistryAddress, CONTRACT_REGISTRY_ABI, this.provider);

            // Try 'FdcHub' first (newer), then 'StateConnector' (older/compat)
            let addr = await registry.getContractAddressByName('FdcHub').catch(() => null);
            if (!addr || addr === '0x0000000000000000000000000000000000000000') {
                addr = await registry.getContractAddressByName('StateConnector');
            }

            if (!addr || addr === '0x0000000000000000000000000000000000000000') {
                throw new Error('FdcHub/StateConnector not found in registry');
            }

            this.fdcHubAddress = addr;
            return addr;
        } catch (error: any) {
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
    async verifyBitcoinPayment(params: {
        txHash: string;
        sourceAddress: string;
        destinationAddress: string;
        amount: number;
    }, signer: any): Promise<any> {
        try {
            const hubAddr = await this.getFdcHubAddress();
            const fdcHub = new Contract(hubAddr, FDC_HUB_ABI, signer);

            // TODO: Real implementation requires strict ABI encoding of the Payment Verification Request.
            // For this SDK demo, we send a placeholder byte sequence to prove chain interaction.
            // 0x + arbitrary bytes
            const placeholderData = '0x1234567890abcdef' + params.txHash.replace('0x', '');

            // Request attestation (usually requires a fee, handled by msg.value if needed, but often 0 on testnet for some types)
            const tx = await fdcHub.requestAttestation(placeholderData);
            return tx;
        } catch (error: any) {
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
    async verifyEVMTransaction(params: {
        txHash: string;
        chainId: number; // e.g. 1 for ETH, 137 for Polygon
    }, signer: any): Promise<any> {
        try {
            const hubAddr = await this.getFdcHubAddress();
            const fdcHub = new Contract(hubAddr, FDC_HUB_ABI, signer);

            // Mock encoding for EVM Transaction Verification
            // 0x + marker for EVM + txHash
            const placeholderData = '0xeeee' + params.txHash.replace('0x', '') + params.chainId.toString(16).padStart(4, '0');

            const tx = await fdcHub.requestAttestation(placeholderData);
            return tx;
        } catch (error: any) {
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
    async getRecentAttestations(options: {
        limit?: number;
    } = {}): Promise<Attestation[]> {
        try {
            const hubAddr = await this.getFdcHubAddress();
            const fdcHub = new Contract(hubAddr, FDC_HUB_ABI, this.provider);
            const limit = options.limit || 10;

            // Fetch last 1000 blocks or so
            const currentBlock = await this.provider.getBlockNumber();
            const fromBlock = Math.max(0, currentBlock - 5000);

            const filter = fdcHub.filters.AttestationRequest();
            const events = await fdcHub.queryFilter(filter, fromBlock, currentBlock);

            // Sort descending and take limit
            const recentEvents = events.reverse().slice(0, limit);

            return recentEvents.map((e: any) => ({
                id: e.transactionHash,
                type: 'AttestationRequest', // Generic type as parsing data requires schema
                status: 'submitted', // Request submitted to chain
                blockNumber: e.blockNumber,
                timestamp: new Date(), // Block timestamp fetching would vary, using current for list
                data: e.args ? { rawData: e.args[1] } : {}
            }));
        } catch (error: any) {
            console.warn('Failed to fetch real attestations, checking network...', error.message);
            return []; // Return empty on error instead of throwing to prevent UI crash
        }
    }

    /**
     * Subscribe to new attestation requests
     */
    subscribe(callback: (attestation: Attestation) => void): () => void {
        let fdcHub: Contract | null = null;
        const setup = async () => {
            try {
                const hubAddr = await this.getFdcHubAddress();
                fdcHub = new Contract(hubAddr, FDC_HUB_ABI, this.provider);

                fdcHub.on('AttestationRequest', (timestamp, data, event) => {
                    const attestation: Attestation = {
                        id: event.log.transactionHash,
                        type: 'AttestationRequest',
                        status: 'pending',
                        blockNumber: event.log.blockNumber,
                        timestamp: new Date(),
                        data: { rawData: data }
                    };
                    callback(attestation);
                });
            } catch (e) {
                console.error('Subscription setup failed:', e);
            }
        };

        setup();

        return () => {
            if (fdcHub) {
                fdcHub.removeAllListeners('AttestationRequest');
            }
        };
    }
}
