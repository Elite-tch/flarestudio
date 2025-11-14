"use client";
import { 
  ConnectButton, 
  useActiveAccount, 
  useActiveWalletChain, 
  useSwitchActiveWalletChain, 
  lightTheme  
} from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// Define Flare and Coston Testnet manually
const flare = {
  id: 14,
  name: "Flare Mainnet",
  nativeCurrency: { name: "Flare", symbol: "FLR", decimals: 18 },
  rpc: "https://flare-api.flare.network/ext/C/rpc",
  blockExplorers: [
    { name: "Flare Explorer", url: "https://flare-explorer.flare.network" },
  ],
};

const flareTestnet = {
  id: 114,
  name: "Coston2 Testnet",
  nativeCurrency: { name: "Coston Flare", symbol: "C2FLR", decimals: 18 },
  rpc: "https://coston2-api.flare.network/ext/C/rpc",
  blockExplorers: [
    { name: "Coston2 Explorer", url: "https://coston2-explorer.flare.network" },
  ],
  testnet: true,
};

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id",
});

// ADD THIS WALLETS CONFIGURATION
const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram", 
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.trustwallet.app"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("app.phantom"), // Add Phantom for mobile
];

export function WalletConnection() {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const handleSwitchNetwork = async (chainId) => {
    try {
      await switchChain(chainId === 14 ? flare : flareTestnet);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {account && activeChain && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="gap-1 md:gap-2 py-6 focus:ring-0 text-xs border-0 outline-none md:text-sm bg-[#fff1f3] hover:bg-white"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="hidden sm:inline">
                {activeChain.id === 14 ? "Flare" : "Coston"}
              </span>
              <span className="sm:hidden">
                {activeChain.id === 14 ? "Flare" : "Test"}
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

      <ConnectButton
        client={client}
        wallets={wallets} // ADD THIS LINE - CRITICAL FOR MOBILE
        appMetadata={{
          name: "FlareStudio",
          description: "Interactive Flare Blockchain Playground",
          url: typeof window !== 'undefined' ? window.location.origin : "https://flarestudios.com",
          iconUrl: typeof window !== 'undefined' ? `${window.location.origin}/flarelogo.png` : "https://flarestudios.com/flarelogo.png",
        }}
        chains={[flare, flareTestnet]}
        walletConnect={{
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-client-id",
          redirect: {
            native: "metamask://",
            universal: "https://metamask.app.link",
          },
          metadata: {
            name: "FlareStudio",
            description: "Interactive Flare Blockchain Playground",
            url: typeof window !== 'undefined' ? window.location.origin : "https://flarestudios.com",
            icons: [typeof window !== 'undefined' ? `${window.location.origin}/flarelogo.png` : "https://flarestudios.com/flarelogo.png"],
          },
          qrModalOptions: {
            themeMode: "light",
            themeVariables: {
              "--wcm-z-index": "1000",
            },
          },
        }}
        connectModal={{
          size: "compact",
          title: "Connect to FlareStudio",
          showThirdwebBranding: false,
        }}
        theme={lightTheme({
          colors: {
            primaryButtonBg: "#e93b6c",
            primaryButtonText: "#ffffff",
            connectedButtonBg: "#fff1f3",
          },
        })}
      />
    </div>
  );
}