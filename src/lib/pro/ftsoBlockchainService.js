import { JsonRpcProvider, Contract, ethers } from "ethers";
import { nameToAbi, nameToAddress } from "@flarenetwork/flare-periphery-contract-artifacts";

// Flare Mainnet Configuration
export const FLARE_MAINNET = {
  name: "flare",
  rpc: "https://flare-api.flare.network/ext/C/rpc",
  chainId: 14,
};

// Default symbols to track
export const MAIN_FTSO_SYMBOLS = ["BTC", "ETH", "FLR", "XRP"];

// Create provider
const provider = new JsonRpcProvider(FLARE_MAINNET.rpc);

let ftsoRegistryCache = null;
let ftsoManagerCache = null;

/**
 * Load FTSO Registry contract
 */
export async function getFtsoRegistry() {
  if (ftsoRegistryCache) return ftsoRegistryCache;

  const registryAbi = nameToAbi("FtsoRegistry", FLARE_MAINNET.name);
  const registryAddress = await nameToAddress("FtsoRegistry", FLARE_MAINNET.name, provider);

  ftsoRegistryCache = new Contract(registryAddress, registryAbi, provider);
  return ftsoRegistryCache;
}

/**
 * Load FTSO Manager contract
 */
export async function getFtsoManager() {
  if (ftsoManagerCache) return ftsoManagerCache;

  const managerAbi = nameToAbi("FtsoManager", FLARE_MAINNET.name);
  const managerAddress = await nameToAddress("FtsoManager", FLARE_MAINNET.name, provider);

  ftsoManagerCache = new Contract(managerAddress, managerAbi, provider);
  return ftsoManagerCache;
}

/**
 * Get current price for a specific symbol from FTSO
 */
export async function getCurrentFtsoPrice(symbol) {
  try {
    const registry = await getFtsoRegistry();

    // Use the string overload explicitly
    const [price, timestamp, decimals] = await registry["getCurrentPriceWithDecimals(string)"](symbol);

    return {
      symbol,
      price: Number(price) / Math.pow(10, Number(decimals)),
      timestamp: new Date(Number(timestamp) * 1000),
      decimals: Number(decimals),
      rawPrice: price.toString(),
    };
  } catch (error) {
    console.error(`Error fetching FTSO price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get current prices for all main symbols
 */
export async function getAllCurrentPrices(symbols = MAIN_FTSO_SYMBOLS) {
  const pricePromises = symbols.map(symbol => getCurrentFtsoPrice(symbol));
  const prices = await Promise.all(pricePromises);
  return prices.filter(p => p !== null);
}

/**
 * Get all supported symbols from the FTSO Registry
 */
export async function getSupportedSymbols() {
  try {
    const registry = await getFtsoRegistry();
    return await registry.getSupportedSymbols();
  } catch (error) {
    console.error("Error fetching supported symbols:", error);
    return [];
  }
}

/**
 * Get FTSO epoch information
 */
export async function getCurrentEpochInfo() {
  try {
    const ftsoManager = await getFtsoManager();
    const currentEpochId = await ftsoManager.getCurrentPriceEpochId();

    return {
      epochId: Number(currentEpochId),
    };
  } catch (error) {
    console.error("Error fetching epoch info:", error);
    return {
      epochId: Math.floor(Date.now() / 10000), // fallback approximate
    };
  }
}
