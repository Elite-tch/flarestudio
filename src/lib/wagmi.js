"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';

// Define Flare Mainnet
export const flare = {
    id: 14,
    name: 'Flare',
    nativeCurrency: {
        decimals: 18,
        name: 'Flare',
        symbol: 'FLR',
    },
    rpcUrls: {
        default: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Flare Explorer', url: 'https://flare-explorer.flare.network' },
    },
};

// Define Coston2 Testnet
export const coston2 = {
    id: 114,
    name: 'Coston2',
    nativeCurrency: {
        decimals: 18,
        name: 'Coston Flare',
        symbol: 'C2FLR',
    },
    rpcUrls: {
        default: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Coston2 Explorer', url: 'https://coston2-explorer.flare.network' },
    },
    testnet: true,
};

export const config = getDefaultConfig({
    appName: 'FlareStudio',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains: [flare, coston2],
    transports: {
        [flare.id]: http(),
        [coston2.id]: http(),
    },
    ssr: true,
});
