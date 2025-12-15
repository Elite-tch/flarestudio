const { JsonRpcProvider, Contract } = require('ethers');

const RPC = "https://coston2-api.flare.network/ext/C/rpc";
const REGISTRY_ADDR = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
const REGISTRY_ABI = ['function getContractAddressByName(string) view returns (address)'];

async function main() {
    const provider = new JsonRpcProvider(RPC);
    const registry = new Contract(REGISTRY_ADDR, REGISTRY_ABI, provider);

    try {
        const names = ['StateConnector', 'Relay', 'FdcRelay', 'FdcHub', 'Submission'];

        for (const name of names) {
            try {
                console.log(`Looking up '${name}'...`);
                const addr = await registry.getContractAddressByName(name);
                console.log(`${name}: ${addr}`);
            } catch (e) {
                console.log(`${name}: Not Found (or error: ${e.message})`);
            }
        }
    } catch (e) {
        console.error("Registry Lookup Failed:", e.message);
    }
}

main();
