const { JsonRpcProvider, Contract } = require('ethers');

const RPC = "https://114.rpc.thirdweb.com";
const RELAY_ADDR = "0x97702e350CaEda540935d92aAff213307e9069784";
const ABI = [
    'function lastConfirmedRoundId() external view returns (uint256)',
    'function merkleRoots(uint256) external view returns (bytes32)'
];

async function main() {
    const provider = new JsonRpcProvider(RPC);
    const relay = new Contract(RELAY_ADDR, ABI, provider);

    try {
        console.log("Calling Relay.lastConfirmedRoundId()...");
        const id = await relay.lastConfirmedRoundId();
        console.log("Success! Last Round:", id.toString());

        console.log("Calling Relay.merkleRoots(" + id.toString() + ")...");
        const root = await relay.merkleRoots(id);
        console.log("Success! Root:", root);
    } catch (e) {
        console.error("Relay Call Failed:", e.message);
        if (e.data) console.error("Error Data:", e.data);
    }
}

main();
