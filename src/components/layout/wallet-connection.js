"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { flare, coston2 } from '@/lib/wagmi';

export function WalletConnection() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const handleSwitchNetwork = async (targetChainId) => {
    try {
      switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {address && chainId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="gap-1 md:gap-2 py-6 focus:ring-0 text-xs border-0 outline-none md:text-sm bg-[#fff1f3] hover:bg-white"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="hidden sm:inline">
                {chainId === 14 ? "Flare" : "Coston"}
              </span>
              <span className="sm:hidden">
                {chainId === 14 ? "Flare" : "Test"}
              </span>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSwitchNetwork(14)}>
              Flare Mainnet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSwitchNetwork(114)}>
              Coston Testnet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      onClick={openConnectModal}
                      size="lg"
                      className="bg-[#e93b6c] hover:bg-[#d12d5a] text-white py-6"
                    >
                      Connect Wallet
                    </Button>
                  );
                }

                return (
                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    size="lg"
                    className="gap-2 py-6 bg-[#fff1f3] hover:bg-white border-0"
                  >
                    <span className="hidden sm:inline">
                      {account.displayName}
                    </span>
                    <span className="sm:hidden">
                      {account.address.slice(0, 6)}...{account.address.slice(-4)}
                    </span>
                  </Button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}