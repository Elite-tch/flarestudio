import { Contract, keccak256, toUtf8Bytes } from "ethers";
import { nameToAbi, nameToAddress } from "@flarenetwork/flare-periphery-contract-artifacts";

export const NETWORK = {
  name: "coston", // change to "coston2" if you want that network
  rpc: "https://coston-api.flare.network/ext/C/rpc",
  chainId: 16 // Coston chain id, verify if using a different network
};

// Load contracts given a provider or signer
export async function loadFtsoContracts(providerOrSigner) {
  const network = NETWORK.name;

  const priceSubmitterAbi = nameToAbi("PriceSubmitter", network);
  const priceSubmitterAddr = await nameToAddress("PriceSubmitter", network, providerOrSigner.provider || providerOrSigner);

  const ftsoRegistryAbi = nameToAbi("FtsoRegistry", network);
  const ftsoRegistryAddr = await nameToAddress("FtsoRegistry", network, providerOrSigner.provider || providerOrSigner);

  const ftsoManagerAbi = nameToAbi("FtsoManager", network);
  const ftsoManagerAddr = await nameToAddress("FtsoManager", network, providerOrSigner.provider || providerOrSigner);

  return {
    priceSubmitter: new Contract(priceSubmitterAddr, priceSubmitterAbi, providerOrSigner),
    ftsoRegistry: new Contract(ftsoRegistryAddr, ftsoRegistryAbi, providerOrSigner),
    ftsoManager: new Contract(ftsoManagerAddr, ftsoManagerAbi, providerOrSigner),
  };
}

// Helper to scale price to integer. Adjust decimals to the protocol expectation.
export function scalePriceToInt(rawPrice, decimals = 5) {
  const factor = Math.pow(10, decimals);
  const scaled = Math.floor(Number(rawPrice) * factor);
  return scaled;
}

// Helper to build commit hash (replaces ethers.utils.solidityKeccak256)
export async function makeCommitHash(epochId, scaledPrice, randomHex) {
  // ethers v6 no longer has `utils.solidityKeccak256`, use keccak256 with ABI encoding
  const { solidityPacked } = await import("ethers"); // dynamic import for ESM
  return keccak256(solidityPacked(["uint256", "uint256", "bytes32"], [epochId, scaledPrice, randomHex]));
}
