// lib/ftsoContracts.js
import { ethers } from "ethers"
import { nameToAbi, nameToAddress } from "@flarenetwork/flare-periphery-contract-artifacts"

export const NETWORK = {
  name: "coston", // change to "coston2" if you want that network
  rpc: "https://coston-api.flare.network/ext/C/rpc",
  chainId: 16 // Coston chain id, verify if using a different network
}

// load contracts given a provider or signer
export async function loadFtsoContracts(providerOrSigner) {
  const network = NETWORK.name

  const priceSubmitterAbi = nameToAbi("PriceSubmitter", network)
  const priceSubmitterAddr = await nameToAddress("PriceSubmitter", network, providerOrSigner.provider || providerOrSigner)

  const ftsoRegistryAbi = nameToAbi("FtsoRegistry", network)
  const ftsoRegistryAddr = await nameToAddress("FtsoRegistry", network, providerOrSigner.provider || providerOrSigner)

  const ftsoManagerAbi = nameToAbi("FtsoManager", network)
  const ftsoManagerAddr = await nameToAddress("FtsoManager", network, providerOrSigner.provider || providerOrSigner)

  return {
    priceSubmitter: new ethers.Contract(priceSubmitterAddr, priceSubmitterAbi, providerOrSigner),
    ftsoRegistry: new ethers.Contract(ftsoRegistryAddr, ftsoRegistryAbi, providerOrSigner),
    ftsoManager: new ethers.Contract(ftsoManagerAddr, ftsoManagerAbi, providerOrSigner)
  }
}

// helper to scale price to integer. Adjust decimals to the protocol expectation.
export function scalePriceToInt(rawPrice, decimals = 5) {
  // rawPrice is a number or numeric string. Multiply by 10^decimals then floor.
  const factor = Math.pow(10, decimals)
  const scaled = Math.floor(Number(rawPrice) * factor)
  return scaled
}

// helper to build commit hash using solidity keccak256 encoding
export function makeCommitHash(epochId, scaledPrice, randomHex) {
  // solidity keccak256 of (uint256 epochId, uint256 price, bytes32 random)
  // use ethers utils solidityKeccak256
  return ethers.utils.solidityKeccak256(
    ["uint256", "uint256", "bytes32"],
    [epochId, scaledPrice, randomHex]
  )
}
