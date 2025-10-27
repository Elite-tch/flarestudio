import { Contract, keccak256, JsonRpcProvider } from "ethers";
import { nameToAbi, nameToAddress } from "@flarenetwork/flare-periphery-contract-artifacts";

export const NETWORK = {
  name: "coston",
  rpc: "https://coston-api.flare.network/ext/C/rpc",
  chainId: 16
};

// Create a read-only provider (no wallet needed)
export function getReadOnlyProvider() {
  return new JsonRpcProvider(NETWORK.rpc);
}

// Load contracts with either a signer OR read-only provider
export async function loadFtsoContracts(providerOrSigner) {
  const network = NETWORK.name;
  const provider = providerOrSigner?.provider || providerOrSigner;

  const priceSubmitterAbi = nameToAbi("PriceSubmitter", network);
  const priceSubmitterAddr = await nameToAddress("PriceSubmitter", network, provider);

  const ftsoRegistryAbi = nameToAbi("FtsoRegistry", network);
  const ftsoRegistryAddr = await nameToAddress("FtsoRegistry", network, provider);

  const ftsoManagerAbi = nameToAbi("FtsoManager", network);
  const ftsoManagerAddr = await nameToAddress("FtsoManager", network, provider);

  return {
    priceSubmitter: new Contract(priceSubmitterAddr, priceSubmitterAbi, providerOrSigner),
    ftsoRegistry: new Contract(ftsoRegistryAddr, ftsoRegistryAbi, providerOrSigner),
    ftsoManager: new Contract(ftsoManagerAddr, ftsoManagerAbi, providerOrSigner),
  };
}

// Helper to scale price to integer
export function scalePriceToInt(rawPrice, decimals = 5) {
  const factor = Math.pow(10, decimals);
  const scaled = Math.floor(Number(rawPrice) * factor);
  return scaled;
}

// Helper to build commit hash
export async function makeCommitHash(epochId, scaledPrice, randomHex) {
  const { solidityPacked } = await import("ethers");
  return keccak256(solidityPacked(["uint256", "uint256", "bytes32"], [epochId, scaledPrice, randomHex]));
}