const { JsonRpcProvider, Contract } = require('ethers');

const RPC = "https://114.rpc.thirdweb.com";
const SC_ADDR = "0x1000000000000000000000000000000000000001";
const ABI = [
    'function lastConfirmedRoundId() external view returns (uint256)'
];

async function main() {
    console.log("Testing connection to Coston2...");
    const provider = new JsonRpcProvider(RPC);
    const sc = new Contract(SC_ADDR, ABI, provider);

    try {
        const net = await provider.getNetwork();
        console.log("Connected to Chain ID:", net.chainId.toString());

        console.log("Calling lastConfirmedRoundId()...");
        const id = await sc.lastConfirmedRoundId();
        console.log("Success! Last Round ID:", id.toString());
    } catch (e) {
        console.error("FAILED:");
        console.error("Code:", e.code);
        console.error("Message:", e.message);
        console.error("Data:", e.data);
    }
}

main();
