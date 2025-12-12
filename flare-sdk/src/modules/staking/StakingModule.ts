import { Contract, JsonRpcProvider, parseEther, formatEther } from 'ethers';
import { StakingError, ErrorCodes } from '../../core/errors';
import type { DelegationInfo, RewardInfo, ProviderStats } from '../../types';

// WNat (Wrapped Native Token) ABI
const WNAT_ABI = [
    'function deposit() payable',
    'function withdraw(uint256 amount)',
    'function balanceOf(address) view returns (uint256)',
    'function delegate(address to, uint256 bips)',
    'function delegatesOf(address owner) view returns (address[] memory, uint256[] memory)',
    'function undelegateAll()',
    'function votePowerOf(address owner) view returns (uint256)',
];

// FlareContractRegistry ABI
const CONTRACT_REGISTRY_ABI = [
    'function getContractAddressByName(string memory _name) external view returns (address)',
];

// FtsoRewardManager ABI
const REWARD_MANAGER_ABI = [
    'function claimReward(address payable recipient, uint256[] memory epochs) returns (uint256)',
    'function getEpochsWithUnclaimedRewards(address beneficiary) view returns (uint256[] memory)',
    'function getStateOfRewards(address beneficiary, uint256 rewardEpoch) view returns (address[] memory, uint256[] memory, bool[] memory, bool)',
    'function getUnclaimedReward(uint256 epoch, address beneficiary) view returns (uint256)',
];

/**
 * Staking Module
 * Wrap FLR, delegate to FTSO providers, and claim rewards
 */
export class StakingModule {
    private provider: JsonRpcProvider;
    private network: string;
    private wnatAddress: string;
    private contractRegistryAddress: string;
    private rewardManagerAddress: string | null = null;

    constructor(provider: JsonRpcProvider, network: string) {
        this.provider = provider;
        this.network = network;

        // WNat addresses for each network
        const wnatAddresses: Record<string, string> = {
            flare: '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d',
            coston2: '0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273',
            songbird: '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED',
            coston: '0x767b25A658E8FC8ab6eBbd52043495dB61b4ea91',
        };

        // FlareContractRegistry (same for all networks)
        this.contractRegistryAddress = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019';

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
    private async getRewardManagerAddress(): Promise<string> {
        if (this.rewardManagerAddress) {
            return this.rewardManagerAddress;
        }

        try {
            const contractRegistry = new Contract(
                this.contractRegistryAddress,
                CONTRACT_REGISTRY_ABI,
                this.provider
            );

            this.rewardManagerAddress = String(await contractRegistry.getContractAddressByName('FtsoRewardManager'));
            return this.rewardManagerAddress;
        } catch (error: any) {
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
    async wrap(amount: string, signer: any): Promise<any> {
        try {
            const wnat = new Contract(this.wnatAddress, WNAT_ABI, signer);
            const tx = await wnat.deposit({ value: parseEther(amount) });
            return tx;
        } catch (error: any) {
            let message = error.message;
            if (error.message.includes('Failed to fetch') || error.code === -32603) {
                message = 'Network error: Please check your MetaMask connection and RPC URL.';
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
    async unwrap(amount: string, signer: any): Promise<any> {
        try {
            const wnat = new Contract(this.wnatAddress, WNAT_ABI, signer);
            const tx = await wnat.withdraw(parseEther(amount));
            return tx;
        } catch (error: any) {
            let message = error.message;
            if (error.message.includes('Failed to fetch') || error.code === -32603) {
                message = 'Network error: Please check your MetaMask connection and RPC URL.';
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
    async getWNatBalance(address: string): Promise<string> {
        try {
            const wnat = new Contract(this.wnatAddress, WNAT_ABI, this.provider);
            const balance = await wnat.balanceOf(address);
            return formatEther(balance);
        } catch (error: any) {
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
    async getVotePower(address: string): Promise<string> {
        try {
            const wnat = new Contract(this.wnatAddress, WNAT_ABI, this.provider);
            const votePower = await wnat.votePowerOf(address);
            return formatEther(votePower);
        } catch (error: any) {
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
    async delegate(providerAddress: string, percentage: number, signer: any): Promise<any> {
        if (percentage < 0 || percentage > 100) {
            throw new StakingError(
                'Percentage must be between 0 and 100',
                ErrorCodes.INVALID_PARAMS
            );
        }

        try {
            const wnat = new Contract(this.wnatAddress, WNAT_ABI, signer);
            const bips = percentage * 100; // Convert percentage to basis points (10000 = 100%)
            const tx = await wnat.delegate(providerAddress, bips);
            return tx;
        } catch (error: any) {
            let message = error.message;
            if (error.message.includes('Failed to fetch') || error.code === -32603) {
                message = 'Network error: Please check your MetaMask connection and RPC URL.';
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
    async undelegateAll(signer: any): Promise<any> {
        try {
            const wnat = new Contract(this.wnatAddress, WNAT_ABI, signer);
            const tx = await wnat.undelegateAll();
            return tx;
        } catch (error: any) {
            let message = error.message;
            if (error.message.includes('Failed to fetch') || error.code === -32603) {
                message = 'Network error: Please check your MetaMask connection and RPC URL.';
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
    async getDelegations(address: string): Promise<DelegationInfo[]> {
        try {
            const wnat = new Contract(this.wnatAddress, WNAT_ABI, this.provider);
            const [providers, percentages] = await wnat.delegatesOf(address);

            return providers.map((provider: string, index: number) => ({
                provider,
                percentage: Number(percentages[index]) / 100, // Convert bips to percentage
                amount: '0', // Would need to calculate based on total vote power
            }));
        } catch (error: any) {
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
    async getUnclaimedEpochs(address: string): Promise<number[]> {
        try {
            const rewardManagerAddress = await this.getRewardManagerAddress();
            const rewardManager = new Contract(
                rewardManagerAddress,
                REWARD_MANAGER_ABI,
                this.provider
            );

            const epochs = await rewardManager.getEpochsWithUnclaimedRewards(address);
            return epochs.map((epoch: any) => Number(epoch));
        } catch (error: any) {
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
    async getUnclaimedReward(address: string, epoch: number): Promise<string> {
        try {
            const rewardManagerAddress = await this.getRewardManagerAddress();
            const rewardManager = new Contract(
                rewardManagerAddress,
                REWARD_MANAGER_ABI,
                this.provider
            );

            // getStateOfRewards returns:
            // 0: address[] _dataProviders
            // 1: uint256[] _rewardAmounts
            // 2: bool[] _claimed
            // 3: bool _claimable
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
        } catch (error: any) {
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
    async claimRewards(epochs: number[] | undefined, signer: any): Promise<any> {
        try {
            const address = await signer.getAddress();
            const rewardManagerAddress = await this.getRewardManagerAddress();
            const rewardManager = new Contract(
                rewardManagerAddress,
                REWARD_MANAGER_ABI,
                signer
            );

            // If no epochs specified, get all unclaimed epochs
            const epochsToClaim = epochs || await this.getUnclaimedEpochs(address);

            if (epochsToClaim.length === 0) {
                throw new StakingError(
                    'No unclaimed rewards available',
                    ErrorCodes.NO_REWARDS
                );
            }

            const tx = await rewardManager.claimReward(address, epochsToClaim);
            return tx;
        } catch (error: any) {
            let message = error.message;
            if (error.message.includes('Failed to fetch') || error.code === -32603) {
                message = 'Network error: Please check your MetaMask connection and RPC URL.';
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
    async getRewardsHistory(address: string): Promise<RewardInfo[]> {
        try {
            const unclaimedEpochs = await this.getUnclaimedEpochs(address);
            // Note: This only gets unclaimed. For full history including claimed, 
            // we would need an indexer or event logs.

            const rewards: RewardInfo[] = [];

            for (const epoch of unclaimedEpochs) {
                const amount = await this.getUnclaimedReward(address, epoch);
                rewards.push({
                    epoch,
                    amount,
                    claimed: false,
                    timestamp: new Date(), // Would need to calculate actual timestamp
                });
            }

            return rewards;
        } catch (error: any) {
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
    async getProviders(options: {
        sortBy?: 'apy' | 'totalStake' | 'rewardRate';
        limit?: number;
    } = {}): Promise<ProviderStats[]> {
        // This would require:
        // 1. Fetching provider list from VoterWhitelister contract
        // 2. Getting stats from external APIs (flaremetrics.io, etc.)
        // 3. Or indexing on-chain data

        console.warn('getProviders() requires external data source - use flaremetrics.io API or similar');
        return [];
    }

    /**
     * Calculate potential rewards (estimate)
     * @param amount Amount to delegate
     * @param apy Annual percentage yield (default 12%)
     * @param days Number of days
     */
    calculatePotentialRewards(amount: string, apy: number = 12, days: number = 365): string {
        const amountNum = parseFloat(amount);
        const rewards = amountNum * (apy / 100) * (days / 365);
        return rewards.toFixed(4);
    }
}
