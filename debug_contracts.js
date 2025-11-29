const { nameToAbi, nameToAddress } = require("@flarenetwork/flare-periphery-contract-artifacts");

console.log("Attempting to find StateConnector...");

try {
    // Try to list keys if possible or just test common names
    const names = ["StateConnector", "IStateConnector", "StateConnectorI", "FlareStateConnector"];

    names.forEach(name => {
        try {
            const abi = nameToAbi(name, "flare");
            console.log(`FOUND: ${name}`);
        } catch (e) {
            console.log(`NOT FOUND: ${name}`);
        }
    });

} catch (error) {
    console.error("Error:", error);
}
