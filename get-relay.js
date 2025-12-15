const { JsonRpcProvider, Contract } = require('ethers');
async function main() {
    const p = new JsonRpcProvider("https://coston2-api.flare.network/ext/C/rpc");
    const r = new Contract("0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019", ['function getContractAddressByName(string) view returns (address)'], p);
    const addr = await r.getContractAddressByName('Relay');
    console.log(addr);
}
main();
