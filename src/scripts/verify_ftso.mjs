import { JsonRpcProvider, Contract } from "ethers"
import { nameToAbi, nameToAddress } from "@flarenetwork/flare-periphery-contract-artifacts"

// Flare Mainnet Configuration
const FLARE_MAINNET = {
    name: "flare",
    rpc: "https://flare-api.flare.network/ext/C/rpc",
    chainId: 14,
}

const MAIN_FTSO_SYMBOLS = ["BTC", "ETH", "FLR", "XRP"]

async function main() {
    console.log("🔄 Connecting to Flare Mainnet...")
    const provider = new JsonRpcProvider(FLARE_MAINNET.rpc)

    try {
        const network = await provider.getNetwork()
        console.log(`✅ Connected to chainId: ${network.chainId}`)
    } catch (error) {
        console.error("❌ Failed to connect to RPC:", error.message)
        process.exit(1)
    }

    console.log("🔄 Resolving FtsoRegistry...")
    try {
        const registryAbi = nameToAbi("FtsoRegistry", FLARE_MAINNET.name)
        const registryAddress = await nameToAddress("FtsoRegistry", FLARE_MAINNET.name, provider)
        console.log(`✅ FtsoRegistry Address: ${registryAddress}`)

        const registry = new Contract(registryAddress, registryAbi, provider)

        console.log("\n🔄 Fetching Prices...")
        for (const symbol of MAIN_FTSO_SYMBOLS) {
            try {
                // Test the specific overload we are using
                const result = await registry["getCurrentPriceWithDecimals(string)"](symbol)

                const price = Number(result[0]) / Math.pow(10, Number(result[2]))
                const timestamp = new Date(Number(result[1]) * 1000).toISOString()

                console.log(`✅ ${symbol}: $${price} (Time: ${timestamp})`)
            } catch (err) {
                console.error(`❌ Failed to fetch ${symbol}:`, err.message)
            }
        }

    } catch (error) {
        console.error("❌ Error resolving contract:", error)
    }
}

main()
