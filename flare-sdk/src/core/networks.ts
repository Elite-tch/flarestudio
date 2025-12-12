import type { FlareNetwork, NetworkConfig } from '../types';

/**
 * Network configurations for all supported Flare networks
 */
export const NETWORKS: Record<FlareNetwork, NetworkConfig> = {
    flare: {
        chainId: 14,
        name: 'Flare Mainnet',
        rpc: 'https://flare-api.flare.network/ext/C/rpc',
        explorer: 'https://flare-explorer.flare.network',
        testnet: false,
    },
    coston2: {
        chainId: 114,
        name: 'Coston2 Testnet',
        rpc: 'https://coston2-api.flare.network/ext/C/rpc',
        explorer: 'https://coston2-explorer.flare.network',
        testnet: true,
    },
    songbird: {
        chainId: 19,
        name: 'Songbird Canary Network',
        rpc: 'https://songbird-api.flare.network/ext/C/rpc',
        explorer: 'https://songbird-explorer.flare.network',
        testnet: false,
    },
    coston: {
        chainId: 16,
        name: 'Coston Testnet',
        rpc: 'https://coston-api.flare.network/ext/C/rpc',
        explorer: 'https://coston-explorer.flare.network',
        testnet: true,
    },
};

/**
 * Get network configuration by name
 */
export function getNetworkConfig(network: FlareNetwork): NetworkConfig {
    return NETWORKS[network];
}

/**
 * Get network by chain ID
 */
export function getNetworkByChainId(chainId: number): FlareNetwork | undefined {
    return Object.entries(NETWORKS).find(
        ([_, config]) => config.chainId === chainId
    )?.[0] as FlareNetwork | undefined;
}
