const { DataAPIClient } = require("@datastax/astra-db-ts");
require("dotenv").config({ path: ".env.local" });

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log("Usage: node scripts/add-contract.js <address> <name> <abi_json_string_or_path>");
        process.exit(1);
    }

    const [address, name, abiInput] = args;

    if (!process.env.ASTRA_DB_APPLICATION_TOKEN || !process.env.ASTRA_DB_API_ENDPOINT) {
        console.error("Missing Astra DB credentials in .env.local");
        process.exit(1);
    }

    // Basic validation
    if (!address.startsWith("0x")) {
        console.error("Invalid address format");
        process.exit(1);
    }

    let abi;
    try {
        // Try parsing as JSON string first
        abi = JSON.parse(abiInput);
    } catch (e) {
        // If fails, assume it's a file path (simplified for now, just treat as empty or error)
        console.log("ABI is not a valid JSON string. For this prototype, please pass minified JSON ABI.");
        // In a real app, we'd read the file here.
        // For now, let's just allow an empty array if user wants to test without decoding
        if (abiInput === "[]") abi = [];
        else process.exit(1);
    }

    const normalizedAddress = address.toLowerCase();
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);

    try {
        try {
            await db.createCollection("contracts");
        } catch (e) {
            // ignore if exists
        }
        const contracts = await db.collection("contracts");

        const existing = await contracts.findOne({ _id: normalizedAddress });
        if (existing) {
            console.log(`Contract ${address} already registered.`);
            process.exit(0);
        }

        await contracts.insertOne({
            _id: normalizedAddress, // Use normalized address as ID for uniqueness
            address,
            normalized_address: normalizedAddress,
            name,
            abi,
            created_at: new Date().toISOString(),
            last_processed_block: 0
        });

        console.log(`Contract ${name} (${address}) added to monitoring.`);
    } catch (error) {
        console.error("Error adding contract:", error);
    }
}

main();
