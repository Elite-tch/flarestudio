// Quick test script to check available FTSO Registry methods
import { nameToAbi } from "@flarenetwork/flare-periphery-contract-artifacts";

const network = "flare";
const ftsoRegistryAbi = nameToAbi("FtsoRegistry", network);

console.log("FTSO Registry ABI Methods:");
console.log("=".repeat(50));

ftsoRegistryAbi.forEach((item) => {
    if (item.type === "function") {
        const inputs = item.inputs.map(i => `${i.type} ${i.name}`).join(", ");
        const outputs = item.outputs ? item.outputs.map(o => o.type).join(", ") : "void";
        console.log(`${item.name}(${inputs}) -> ${outputs}`);
    }
});
