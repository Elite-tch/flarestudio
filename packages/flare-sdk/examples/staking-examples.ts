/**
 * Flare SDK - Staking Examples
 * Real examples showing how to wrap FLR, delegate to FTSO providers, and claim rewards
 */

import { FlareSDK } from '../src/index';
import { parseEther } from 'ethers';

async function stakingExamples() {
    // Initialize SDK
    const sdk = new FlareSDK({
        network: 'flare',
        debug: true
    });

    // Example wallet address (replace with actual address)
    const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

    console.log('=== Flare Staking Examples ===\n');

    // 1. Check WFLR Balance
    console.log('1. Checking WFLR Balance...');
    try {
        const wflrBalance = await sdk.staking.getWNatBalance(walletAddress);
        console.log(`WFLR Balance: ${wflrBalance} WFLR\n`);
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 2. Check Vote Power
    console.log('2. Checking Vote Power...');
    try {
        const votePower = await sdk.staking.getVotePower(walletAddress);
        console.log(`Vote Power: ${votePower} WFLR\n`);
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 3. Get Current Delegations
    console.log('3. Getting Current Delegations...');
    try {
        const delegations = await sdk.staking.getDelegations(walletAddress);
        console.log('Current Delegations:');
        delegations.forEach((del, i) => {
            console.log(`  ${i + 1}. Provider: ${del.provider}`);
            console.log(`     Percentage: ${del.percentage}%\n`);
        });
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 4. Get Unclaimed Reward Epochs
    console.log('4. Checking Unclaimed Rewards...');
    try {
        const unclaimedEpochs = await sdk.staking.getUnclaimedEpochs(walletAddress);
        console.log(`Unclaimed Epochs: ${unclaimedEpochs.length}`);
        if (unclaimedEpochs.length > 0) {
            console.log(`Epochs: ${unclaimedEpochs.join(', ')}\n`);
        }
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 5. Get Rewards History
    console.log('5. Getting Rewards History...');
    try {
        const rewards = await sdk.staking.getRewardsHistory(walletAddress);
        console.log(`Total Unclaimed Rewards: ${rewards.length}`);
        rewards.forEach((reward, i) => {
            console.log(`  ${i + 1}. Epoch ${reward.epoch}: ${reward.amount} FLR`);
        });
        console.log();
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 6. Calculate Potential Rewards
    console.log('6. Calculating Potential Rewards...');
    const amount = '10000'; // 10,000 FLR
    const apy = 12; // 12% APY
    const days = 365; // 1 year
    const potentialRewards = sdk.staking.calculatePotentialRewards(amount, apy, days);
    console.log(`If you delegate ${amount} FLR at ${apy}% APY for ${days} days:`);
    console.log(`Potential Rewards: ${potentialRewards} FLR\n`);

    console.log('=== Transaction Examples (Require Wallet Connection) ===\n');

    // NOTE: The following examples require a connected wallet (signer)
    // Uncomment and use with actual wallet connection

    /*
    // Connect wallet first
    const signer = await sdk.wallet.connect(window.ethereum);

    // 7. Wrap FLR to WFLR
    console.log('7. Wrapping FLR to WFLR...');
    try {
        const wrapTx = await sdk.staking.wrap('100', signer); // Wrap 100 FLR
        console.log(`Transaction Hash: ${wrapTx.hash}`);
        await wrapTx.wait();
        console.log('Wrapped successfully!\n');
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 8. Delegate to FTSO Provider
    console.log('8. Delegating to FTSO Provider...');
    try {
        const providerAddress = '0xYourProviderAddress...';
        const delegateTx = await sdk.staking.delegate(providerAddress, 50, signer); // Delegate 50%
        console.log(`Transaction Hash: ${delegateTx.hash}`);
        await delegateTx.wait();
        console.log('Delegated successfully!\n');
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 9. Claim Rewards
    console.log('9. Claiming Rewards...');
    try {
        const claimTx = await sdk.staking.claimRewards(undefined, signer); // Claim all unclaimed
        console.log(`Transaction Hash: ${claimTx.hash}`);
        await claimTx.wait();
        console.log('Rewards claimed successfully!\n');
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 10. Unwrap WFLR back to FLR
    console.log('10. Unwrapping WFLR to FLR...');
    try {
        const unwrapTx = await sdk.staking.unwrap('50', signer); // Unwrap 50 WFLR
        console.log(`Transaction Hash: ${unwrapTx.hash}`);
        await unwrapTx.wait();
        console.log('Unwrapped successfully!\n');
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }

    // 11. Undelegate All
    console.log('11. Undelegating All...');
    try {
        const undelegateTx = await sdk.staking.undelegateAll(signer);
        console.log(`Transaction Hash: ${undelegateTx.hash}`);
        await undelegateTx.wait();
        console.log('Undelegated successfully!\n');
    } catch (error) {
        console.error('Error:', error.message, '\n');
    }
    */
}

// Run examples
stakingExamples().catch(console.error);

/**
 * Example: React Component with Staking
 */
export function StakingComponent() {
    /*
    import { useState, useEffect } from 'react';
    import { FlareSDK } from '@flarestudio/flare-sdk';

    const [sdk] = useState(() => new FlareSDK({ network: 'flare' }));
    const [wflrBalance, setWflrBalance] = useState('0');
    const [delegations, setDelegations] = useState([]);
    const [unclaimedRewards, setUnclaimedRewards] = useState([]);

    // Load data
    useEffect(() => {
        async function loadData() {
            if (!address) return;
            
            const balance = await sdk.staking.getWNatBalance(address);
            setWflrBalance(balance);

            const dels = await sdk.staking.getDelegations(address);
            setDelegations(dels);

            const rewards = await sdk.staking.getRewardsHistory(address);
            setUnclaimedRewards(rewards);
        }
        loadData();
    }, [address]);

    // Wrap FLR
    const handleWrap = async (amount) => {
        const tx = await sdk.staking.wrap(amount, signer);
        await tx.wait();
        // Reload data
    };

    // Delegate
    const handleDelegate = async (provider, percentage) => {
        const tx = await sdk.staking.delegate(provider, percentage, signer);
        await tx.wait();
        // Reload data
    };

    // Claim Rewards
    const handleClaim = async () => {
        const tx = await sdk.staking.claimRewards(undefined, signer);
        await tx.wait();
        // Reload data
    };

    return (
        <div>
            <h2>Staking Dashboard</h2>
            <p>WFLR Balance: {wflrBalance}</p>
            <p>Unclaimed Rewards: {unclaimedRewards.length} epochs</p>
            
            <button onClick={() => handleWrap('100')}>Wrap 100 FLR</button>
            <button onClick={handleClaim}>Claim Rewards</button>
        </div>
    );
    */
}
