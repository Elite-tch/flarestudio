export async function fetchBaseContract(category, modules) {
    // Mapping of categories to OpenZeppelin GitHub raw URLs (v5.0.0 for modern Solidity)
    const BASE_URL = "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v5.0.0/contracts";

    let path = "";

    switch (category.toLowerCase()) {
        case "defi":
        case "vault":
            path = "token/ERC20/extensions/ERC4626.sol";
            break;
        case "token":
        case "erc20":
            // Using a standard ERC20 as base, user modules will add functionality
            path = "token/ERC20/ERC20.sol";
            break;
        case "nft":
        case "erc721":
            path = "token/ERC721/ERC721.sol";
            break;
        case "governance":
            path = "governance/Governor.sol";
            break;
        case "custom":
            return "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract CustomContract {\n    // Custom logic will be implemented here\n}";
        default:
            path = "token/ERC20/ERC20.sol"; // Default fallback
    }

    try {
        const response = await fetch(`${BASE_URL}/${path}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch base contract: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching base contract:", error);
        throw error;
    }
}
