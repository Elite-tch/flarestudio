// src/lib/getNetworkData.js

export const FLARE_NETWORKS = {
    mainnet: {
      name: "Flare Mainnet",
      rpc: "https://flare-api.flare.network/ext/C/rpc",
      explorer: "https://flare-explorer.flare.network",
    },
  };
  
  // Get the latest 10 blocks from Flare Explorer
  export async function getNetworkData() {
    try {
      const response = await fetch(
        "https://flare-explorer.flare.network/api/v2/blocks?limit=10"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching network data:", error);
      return null;
    }
  }
  
  // Get current gas price
  export async function getGasPrice() {
    try {
      const response = await fetch(
        "https://flare-explorer.flare.network/api/v2/stats"
      );
      const data = await response.json();
      return data?.gasPrice || "N/A";
    } catch (error) {
      console.error("Error fetching gas price:", error);
      return "N/A";
    }
  }
  