const { ethers } = require("ethers");
const { DataAPIClient } = require("@datastax/astra-db-ts");
require("dotenv").config({ path: ".env.local" });

async function main() {
    console.log("Starting Flare Smart Contract Monitor...");

    if (!process.env.ASTRA_DB_APPLICATION_TOKEN || !process.env.ASTRA_DB_API_ENDPOINT) {
        console.error("Missing Astra DB credentials in .env.local");
        process.exit(1);
    }

    // Database Setup
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);
    const eventsCollection = await getOrCreateCollection(db, "contract_events");
    const contractsCollection = await getOrCreateCollection(db, "contracts");

    // Provider Setup
    const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc"; // or mainnet
    const fetchReq = new ethers.FetchRequest(RPC_URL);
    fetchReq.timeout = 30000; // 30 seconds
    const provider = new ethers.JsonRpcProvider(fetchReq);

    console.log(`Connected to RPC: ${RPC_URL}`);

    async function monitorContracts() {
        const contractsCursor = await contractsCollection.find({});
        const contracts = await contractsCursor.toArray();
        const currentBlock = await provider.getBlockNumber();

        for (const c of contracts) {
            const address = c.address;
            const abi = c.abi || [];
            const contractInstance = abi.length > 0 ? new ethers.Contract(address, abi, provider) : null;
            const normalizedId = (c._id || address || "").toLowerCase();
            const persistedLastBlock = typeof c.last_processed_block === "number" ? c.last_processed_block : 0;

            // If never processed (0), start from recent history (e.g., last 2000 blocks) to avoid infinite backfill
            // Otherwise resume from last processed block
            let fromBlock = persistedLastBlock > 0 ? persistedLastBlock : Math.max(0, currentBlock - 2000);

            console.log(`Checking ${c.name || address} from block ${fromBlock} to ${currentBlock}`);
            const batchSize = 30; // max blocks per request

            while (fromBlock <= currentBlock) {
                const toBlock = Math.min(fromBlock + batchSize - 1, currentBlock);

                try {
                    const logs = await provider.getLogs({ address, fromBlock, toBlock });
                    if (logs.length > 0) {
                        const eventsToInsert = logs.map(log => decodeLog(log, contractInstance));
                        for (const ev of eventsToInsert) {
                            await eventsCollection.insertOne(ev);
                        }
                        console.log(`Saved ${logs.length} events for ${address} (blocks ${fromBlock}-${toBlock})`);
                    }
                } catch (err) {
                    console.error(`Error fetching logs for ${address} (blocks ${fromBlock}-${toBlock}):`, err);
                }

                fromBlock = toBlock + 1;
            }

            if (normalizedId) {
                try {
                    await contractsCollection.updateOne(
                        { _id: normalizedId },
                        { $set: { last_processed_block: currentBlock } },
                        { upsert: false }
                    );
                } catch (updateErr) {
                    console.error(`Failed to update last_processed_block for ${address}:`, updateErr);
                }
            }
        }
    }

    // Initial run
    await monitorContracts();

    // Poll every 30 seconds
    setInterval(monitorContracts, 30000);

    console.log("Monitor service is running. Press Ctrl+C to stop.");
}

// Helper to get or create collection
async function getOrCreateCollection(db, name) {
    try {
        return await db.collection(name);
    } catch {
        console.log(`Collection '${name}' not found, creating...`);
        return await db.createCollection(name);
    }
}

// Decode a log
function decodeLog(log, contract) {
    let eventName = "UnknownEvent";
    let args = {};
    let decoded = false;
    const checksumAddress = log.address;
    const normalizedAddress = checksumAddress.toLowerCase();

    if (contract) {
        try {
            const parsed = contract.interface.parseLog(log);
            if (parsed) {
                eventName = parsed.name;
                args = parsed.args ? parsed.args.toObject() : {};
                decoded = true;
            }
        } catch { }
    }

    if (!decoded) {
        args = { topics: log.topics, data: log.data };
    }

    const serializedArgs = JSON.parse(JSON.stringify(args, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
    ));

    const timestamp = new Date().toISOString(); // optionally fetch block timestamp

    return {
        contract_address: checksumAddress,
        normalized_address: normalizedAddress,
        event_name: eventName,
        block_number: log.blockNumber,
        transaction_hash: log.transactionHash,
        timestamp,
        data: serializedArgs
    };
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
