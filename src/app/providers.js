'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { createRainbowConfig } from '@/lib/wagmi';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig(createRainbowConfig());
  }, []);

  if (!config) return null; // wait for browser

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#e93b6c",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
