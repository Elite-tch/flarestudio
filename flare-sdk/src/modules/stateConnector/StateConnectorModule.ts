import { JsonRpcProvider, Contract } from 'ethers';
import { SDKError, ErrorCodes } from '../../core/errors';

// Registry ABI
const CONTRACT_REGISTRY_ABI = [
    'function getContractAddressByName(string memory _name) external view returns (address)',
];

// State Connector ABI (Real interface)
const STATE_CONNECTOR_ABI = [
    'function lastConfirmedRoundId() external view returns (uint256)',
    'function merkleRoots(uint256 _roundId) external view returns (bytes32)',
    'event RoundFinalized(uint256 indexed roundId, bytes32 merkleRoot)'
];

/**
 * State Connector Module
 * interact with the State Connector contract to read confirmed voting rounds and merkle roots.
 * (No Mock Data - Direct Blockchain Interaction)
 */
export class StateConnectorModule {
    private provider: JsonRpcProvider;
    private network: string;
    private contractRegistryAddress = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019'; // Flare/Coston2 Registry
    private stateConnectorAddress: string | null = null;

    constructor(provider: JsonRpcProvider, network: string) {
        this.provider = provider;
        this.network = network;
    }

    /**
     * Resolve StateConnector address from registry
     */
    private async getStateConnectorAddress(): Promise<string> {
        if (this.stateConnectorAddress) return this.stateConnectorAddress;

        try {
            const registry = new Contract(this.contractRegistryAddress, CONTRACT_REGISTRY_ABI, this.provider);
            const addr = await registry.getContractAddressByName('StateConnector');

            if (!addr || addr === '0x0000000000000000000000000000000000000000') {
                throw new Error('StateConnector contract not found in registry');
            }

            this.stateConnectorAddress = addr;
            return addr;
        } catch (error: any) {
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
    async getLastConfirmedRoundId(): Promise<number> {
        try {
            const addr = await this.getStateConnectorAddress();
            const sc = new Contract(addr, STATE_CONNECTOR_ABI, this.provider);
            const roundId = await sc.lastConfirmedRoundId();
            return Number(roundId);
        } catch (error: any) {
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
    async getMerkleRoot(roundId: number): Promise<string> {
        try {
            const addr = await this.getStateConnectorAddress();
            const sc = new Contract(addr, STATE_CONNECTOR_ABI, this.provider);
            const root = await sc.merkleRoots(roundId);
            return root;
        } catch (error: any) {
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
    subscribeToFinalizedRounds(callback: (roundId: number, merkleRoot: string) => void): () => void {
        let sc: Contract | null = null;

        const setup = async () => {
            try {
                const addr = await this.getStateConnectorAddress();
                sc = new Contract(addr, STATE_CONNECTOR_ABI, this.provider);

                sc.on('RoundFinalized', (roundId, merkleRoot) => {
                    callback(Number(roundId), merkleRoot);
                });
            } catch (e) {
                console.error('StateConnector Subscription setup failed:', e);
            }
        };

        setup();

        return () => {
            if (sc) {
                sc.removeAllListeners('RoundFinalized');
            }
        };
    }
}
