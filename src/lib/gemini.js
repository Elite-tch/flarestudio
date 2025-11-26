import { GoogleGenerativeAI } from "@google/generative-ai";

// use v1 automatically
const apiKey = "AIzaSyACvlmo2kvHTO0MoYMlc_5W6__ZUcvDmb0";
const genAI = new GoogleGenerativeAI(apiKey);

async function retryWithBackoff(fn, retries = 3, delay = 2000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || (!error.message.includes("429") && !error.message.includes("503"))) {
      throw error;
    }
    console.log(`API Error (${error.message}). Retrying in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

// MAIN FIX: use v1 model name
const MODEL_NAME = "gemini-2.5-flash";

export async function generateContractModification(baseContract, spec) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME
  });

  const prompt = `
    ** Flare Network Context:**
    - ** Network **: Coston2 (Testnet) is the default.
    - ** Reference Repos **: 
      - Hardhat: https://github.com/flare-foundation/flare-hardhat-starter.git
      - Hardhat: https://github.com/flare-foundation/flare-hardhat-starter.git
      - **CRITICAL**: Follow the syntax and patterns in these repositories exactly.
    - ** Imports **: Use \`@flarenetwork/flare-periphery-contracts/coston2/...\`.
    - ** ContractRegistry **: Use \`ContractRegistry\` to fetch contracts dynamically.
      - Import: \`import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";\`
      - Usage: \`TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();\`
    - ** FTSOv2 (Current Standard) **: 
      - Import: \`import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";\`
      - Usage: \`TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();\`
      - **Method Signature**: \`function getFeedById(bytes21 _feedId) external view returns (uint256 _value, int8 _decimals, uint64 _timestamp);\`
      - **Feed IDs**: Use \`bytes21\` for Feed IDs (e.g. \`bytes21(0x01...)\`).
    - ** FTSO v1 (Legacy) **:
      - Only use if explicitly requested.
      - Import: \`import {IFtso} from "@flarenetwork/flare-periphery-contracts/coston2/IFtso.sol";\`
      - Usage: \`IFtso ftso = ContractRegistry.getFtso(symbol);\`.
    - ** FDC (Flare Data Connector) **:
      - Import: \`import {IFdcHub} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcHub.sol";\`
      - Import: \`import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";\`
      - Usage: Use \`ContractRegistry.getFdcHub()\` (or similar) to get the FDC Hub instance.
    
    - ** Documentation **:
      - FTSO Guides: https://dev.flare.network/ftso/guides
      - FTSO Reference: https://dev.flare.network/ftso/solidity-reference
      - FDC Overview: https://dev.flare.network/fdc/overview
      - FDC Reference: https://dev.flare.network/fdc/reference
    
    **Rules:**
    1. **CRITICAL: ABSOLUTELY NO MOCK CONTRACTS**. Do not generate \`MockStateConnector\`, \`MockFtso\`, or any file starting with \`Mock\`.
    2. **NO HARDCODED ADDRESSES**: Use \`ContractRegistry\` to fetch addresses dynamically.
    3. **Production Ready**: The code must be ready for deployment.
    4. **Dual Network Support**: 
       - Write the code for **Coston2 (Testnet)** by default.
       - **CRITICAL**: Inside the function, add a COMMENT showing the **Mainnet** equivalent code.
    5. **Educational**: Add detailed comments explaining *why* you are doing things.
    6. Keep the core logic intact but do NOT mention "OpenZeppelin" in comments or documentation.
    7. **Imports**: Use correct \`@flarenetwork/flare-periphery-contracts/coston2/...\` paths.
    8. Return ONLY the modified Solidity code. No markdown formatting, no explanation.
    9. **STRICT SYNTAX**: 
       - Use standard Solidity types (e.g., \`uint256\`, NOT \`uint252\`).
       - **Pragma**: ALWAYS use \`pragma solidity ^0.8.25;\`.
       - **Feed IDs**: ALWAYS use \`bytes21(keccak256(abi.encodePacked("BTC/USD")))\` (or just "BTC") to generate IDs. Do NOT use hardcoded hex literals like \`0x7b...\` as they cause type errors.
       - **Decimals Casting**: When converting \`int8 _decimals\` to \`uint256\`, ALWAYS cast to \`uint8\` first: \`uint256(uint8(_decimals))\`. Direct cast from \`int8\` to \`uint256\` is not allowed.
       - **Constants**: Do NOT declare \`constant\` variables inside functions. Declare them at the contract level or use regular variables.
       - **Visibility**: If a function is called from within the contract (e.g. by another function), it MUST be \`public\`, NOT \`external\`.
       - **Variable Declaration Order**: ALWAYS use \`<type> <visibility> <mutability> <name>;\` (e.g., \`bytes21 private immutable FLR_FEED_ID;\`). NEVER put visibility before type.
    10. **Correct Paths**: 
        - For external libraries, use full package path.
        - For local helper files you generate, use **\`./\`** (e.g. \`import "./MyHelper.sol";\`), NOT \`../\`.
    11. **NO EXTERNAL LIBRARIES**: Do NOT use \`@openzeppelin/contracts\`. You MUST implement all necessary logic (ERC20, ERC721, Context, Ownable, etc.) YOURSELF.
    12. **Self-Contained**: 
        - **Generate ALL necessary custom code**. If a contract or interface is NOT available in the Flare library, you MUST generate it as a separate file.
        - Use the separator below to add these files.
    13. **FTSOv2 Signature**: 
        - **CRITICAL**: \`getFeedById\` returns \`(uint256 value, int8 decimals, uint64 timestamp)\`.
        - Example: \`(uint256 price, int8 decimals, uint64 timestamp) = ftsoV2.getFeedById(feedId);\`.
    14. Ensure the code is syntactically correct and compiles with Solidity ^0.8.20.
    15. If you need to add helper files (interfaces, etc.), strictly append them at the end using this separator:
       \`---FILE: path/to/File.sol---\`
       followed by the content.
    16. **CRITICAL**: In this step, generate **ONLY Solidity (.sol)** files. Do NOT generate \`.js\`, \`.json\`, \`.env\`, or test files. Those are handled separately.
    
    **Base Contract:**
    ${baseContract}
    
    **Specification:**
    ${JSON.stringify(spec, null, 2)}
  `;

  const result = await retryWithBackoff(() => model.generateContent(prompt));
  const response = await result.response;

  let text = response.text();
  text = text.replace(/^```solidity\n/, "").replace(/^```\n/, "").replace(/```$/, "");

  return text;
}

export async function parseUserPrompt(userText, modules, toolchain) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    You are a strict parser.
    Input: "${userText}"
    Selected Modules: ${JSON.stringify(modules)}
    Toolchain: ${toolchain}

    Return a JSON object with:
    - project_name (string, PascalCase, SHORT and CONCISE, max 2-3 words)
    - contract_type
    - solidity_version
    - main_features
    - additional_requirements
    - flare_integrations
  `;

  const result = await retryWithBackoff(() => model.generateContent(prompt));
  const response = await result.response;

  return JSON.parse(response.text());
}

export async function generateTestAndScript(contractCode, spec, toolchain) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME
  });

  const prompt = `
    You are a Blockchain Engineer.
    I have a Solidity contract and I need you to generate:
    1. A test file (using ${toolchain === 'hardhat' ? 'Hardhat/Ethers.js' : 'Foundry/Solidity'}).
    2. A deployment script (using ${toolchain === 'hardhat' ? 'Hardhat/Ethers.js' : 'Foundry/Solidity'}).

    **Contract Code:**
    ${contractCode}

    **Project Info:**
    Name: ${spec.project_name}
    Toolchain: ${toolchain}

    **Output Format:**
    Return the code for the test file, the deployment script, and a .env.example file separated by a specific marker.
    
    ${toolchain === 'hardhat' ? `
    Example Output for Hardhat:
    ---FILE: test/${spec.project_name}.test.js---
    (Ethers.js test code)
    ---FILE: scripts/deploy.js---
    (Ethers.js deployment code)
    ---FILE: .env.example---
    (Environment variables template)
    ` : `
    (Foundry is disabled)
    `}
    
    **Rules:**
    1. **CRITICAL: NO MOCKS**. Do not deploy mock contracts. 
    2. **Deployment Script**: 
       - Use \`process.env\` variables for all addresses.
       - **Strict Naming**: Use EXACTLY these variable names:
         - \`PRIVATE_KEY\`
         - \`FLARE_RPC_URL\`, \`COSTON_RPC_URL\`
         - \`VERIFIER_URL_TESTNET\`, \`VERIFIER_URL_MAINNET\`
       - Do NOT hardcode addresses in the script.
       - Add comments in the script with the default Coston addresses for user reference.
    3. **.env.example**: Generate a template file with EXACTLY the following content (no more, no less):
       \`\`\`
       # User data
       PRIVATE_KEY="0x0000000000000000000000000000000000000000000000000000000000000000"

       # API keys
       FLARE_RPC_API_KEY=""
       VERIFIER_API_KEY_MAINNET=""
       VERIFIER_API_KEY_TESTNET=""
       X_API_KEY=""
       FLARESCAN_API_KEY=""
       FLARE_EXPLORER_API_KEY=""

       # Verifiers
       VERIFIER_URL_TESTNET="https://fdc-verifiers-testnet.flare.network/"
       VERIFIER_URL_MAINNET="https://fdc-verifiers-mainnet.flare.network/"
       JQ_VERIFIER_URL_TESTNET="https://jq-verifier-test.flare.rocks/"
       WEB2JSON_VERIFIER_URL_TESTNET="https://web2json-verifier-test.flare.rocks/"

       # DALayer
       COSTON_DA_LAYER_URL="https://ctn-data-availability.flare.network/"
       COSTON2_DA_LAYER_URL="https://ctn2-data-availability.flare.network/"
       FLARE_DA_LAYER_URL="https://sgb-data-availability.flare.network/"
       SONGBIRD_DA_LAYER_URL="https://flr-data-availability.flare.network/"

       # RPC urls
       COSTON_RPC_URL="https://coston-api.flare.network/ext/C/rpc?x-apikey="
       COSTON2_RPC_URL="https://coston2-api.flare.network/ext/C/rpc?x-apikey="
       SONGBIRD_RPC_URL="https://songbird-api.flare.network/ext/C/rpc?x-apikey="
       FLARE_RPC_URL="https://flare-api.flare.network/ext/C/rpc?x-apikey="
       XRPLEVM_RPC_URL_TESTNET="https://rpc.testnet.xrplevm.org"

       # Flare Explorer
       COSTON_FLARE_EXPLORER_API="https://coston-explorer.flare.network/api"
       COSTON2_FLARE_EXPLORER_API="https://coston2-explorer.flare.network/api"
       SONGBIRD_FLARE_EXPLORER_API="https://songbird-explorer.flare.network/api"
       FLARE_FLARE_EXPLORER_API="https://flare-explorer.flare.network/api"

       # Flarescan
       COSTON_FLARESCAN_API="https://api.routescan.io/v2/network/testnet/evm/16/etherscan/api"
       COSTON2_FLARESCAN_API="https://api.routescan.io/v2/network/testnet/evm/114/etherscan/api"
       SONGBIRD_FLARESCAN_API="https://api.routescan.io/v2/network/mainnet/evm/19/etherscan/api"
       FLARE_FLARESCAN_API="https://api.routescan.io/v2/network/mainnet/evm/14/etherscan/api"

       # WebSocket urls
       COSTON_WEBSOCKET_URL="wss://coston-api.flare.network/ext/C/ws"
       COSTON2_WEBSOCKET_URL="wss://coston2-api.flare.network/ext/C/ws"
       SONGBIRD_WEBSOCKET_URL="wss://songbird-api.flare.network/ext/C/ws"
       FLARE_WEBSOCKET_URL="wss://flare-api.flare.network/ext/C/ws"

       # Weather Insurance
       OPEN_WEATHER_API_KEY=""

       # Tenderly
       TENDERLY_USERNAME=""
       TENDERLY_PROJECT_SLUG=""
       \`\`\`
    4. **Hardhat Config**: Configure the \`hardhat\` network to fork the Coston testnet so tests can run against live data.
    5. **Educational**: Add comments explaining the test steps and deployment logic. Do NOT mention OpenZeppelin.
    6. For Hardhat, use 'ethers' v6 syntax.
    7. **Correct Paths**: Ensure imports point to the correct locations (e.g. \`../contracts/MyContract.sol\` for Hardhat).
    9. **Imports**: Use \`@flarenetwork/flare-periphery-contracts/coston2/...\` for interfaces.
    10. **Test Reliability**: 
        - Write SIMPLE, ROBUST tests.
        - Focus on checking if the contract deployed successfully (check address).
        - Check basic read functions.
        - Avoid complex logic that depends on specific block states unless necessary.
    10. **Test Reliability**: 
        - Write SIMPLE, ROBUST tests.
        - Focus on checking if the contract deployed successfully (check address).
        - Check basic read functions.
        - Avoid complex logic that depends on specific block states unless necessary.
        - **Always** wait for deployment transaction to be mined.
        - **Forking**: Use \`uint256 forkId = vm.createFork(url);\` followed by \`vm.selectFork(forkId);\`. Do NOT use \`createSelectFork\`.
    11. Return ONLY the file contents separated by the marker.
  `;

  const result = await retryWithBackoff(() => model.generateContent(prompt));
  const response = await result.response;
  let text = response.text();

  // Clean up markdown
  text = text.replace(/^```javascript\n/, "").replace(/^```solidity\n/, "").replace(/^```\n/, "").replace(/```$/, "");

  return text;
}

export async function handleChatInteraction(history, currentProject, lastMessage) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    You are **Flare AI**, an expert developer assistant for the **Flare Network**.
    Your goal is to help developers build, debug, and understand smart contracts on Flare.

    **Capabilities:**
    1. **Dual Toolchain Expert**: You are fluent in both **Hardhat** (JavaScript/TypeScript, Ethers.js) and **Foundry** (Solidity, Forge, Cast).
    2. **Code Generation**: You can write complete smart contracts, scripts, and tests ON DEMAND.
    3. **Debugging**: You can analyze error messages and provide fixes.
    4. **Education**: You explain concepts simply (FTSO, FDC, State Connector).

    **Flare Network Documentation:**
    - **FTSO (Data Feeds)**: https://dev.flare.network/ftso/overview
    - **FDC (Data Connector)**: https://dev.flare.network/fdc/overview
    - **State Connector**: https://dev.flare.network/state-connector/overview
    - **C-Chain API**: https://dev.flare.network/api/rpc/c-chain
    - **Foundry Guide**: https://dev.flare.network/run-node/foundry-support

    **System Constraints:**
    You are writing Solidity for the **Flare Starter Repos** (\`flare-foundry-starter\` / \`flare-hardhat-starter\`).
    Follow these rules for **EVERY** contract you generate:

    1. **Solidity Version**: ALWAYS use \`pragma solidity ^0.8.25;\`.
    2. **Imports**:
       - Only import from real files available in the starter repos.
       - **Valid Remappings**:
         - \`flare-periphery/...\` (maps to \`@flarenetwork/flare-periphery-contracts/...\`)
         - \`forge-std/...\` (for Foundry tests)
       - **CRITICAL IMPORT RULE**: ALWAYS use \`flare-periphery/src/coston2/...\` for Flare contracts.
         - **CORRECTION**: \`IFtsoV2Interface.sol\` does NOT exist. Use \`FtsoV2Interface.sol\`.
         - Correct: \`import { FtsoV2Interface } from "flare-periphery/src/coston2/FtsoV2Interface.sol";\`
       
       **Available Contracts in \`flare-periphery/src/coston2/\`**:
       (Also available in \`src/flare/\` and \`src/songbird/\` - use these prefixes ONLY if explicitly requested)
       - \`ContractRegistry.sol\`
       - \`FtsoV2Interface.sol\`
       - \`TestFtsoV2Interface.sol\`
       - \`IAddressBinder.sol\`
       - \`IAddressValidity.sol\`
       - \`IAddressValidityVerification.sol\`
       - \`IAgentOwnerRegistry.sol\`
       - \`IAssetManager.sol\`
       - \`IClaimSetupManager.sol\`
       - \`IDistributionToDelegators.sol\`
       - \`IFdcHub.sol\`
       - \`IFdcVerification.sol\`
       - \`IFeeCalculator.sol\`
       - \`IFlareContractRegistry.sol\`
       - \`IFtso.sol\`
       - \`IFtsoManager.sol\`
       - \`IFtsoRegistry.sol\`
       - \`IFtsoRewardManager.sol\`
       - \`IGovernanceSettings.sol\`
       - \`IGovernor.sol\`
       - \`IJsonApi.sol\`
       - \`IJsonApiVerification.sol\`
       - \`IPayment.sol\`
       - \`IPaymentVerification.sol\`
       - \`IPollingFtso.sol\`
       - \`IPriceSubmitter.sol\`
       - \`IRNat.sol\`
       - \`IRelay.sol\`
       - \`IRewardManager.sol\`
       - \`ISubmission.sol\`
       - \`IVPToken.sol\`
       - \`IValidatorRegistry.sol\`
       - \`IVoterRegistry.sol\`
       - \`IWNat.sol\`
       - \`IWeb2Json.sol\`
       - \`IWeb2JsonVerification.sol\`
       
       **NOTE**: If a contract is NOT in this list (e.g. \`IFlareDaemon\`), do NOT import it. Define a local interface instead.
       
       **Network Selection**:
       - **DEFAULT**: Use \`flare-periphery/src/coston2/...\` (Coston2 Testnet).
       - **IF REQUESTED**: Use \`flare-periphery/src/flare/...\` (Flare Mainnet).
       - **IF REQUESTED**: Use \`flare-periphery/src/songbird/...\` (Songbird Canary).
       - **FORBIDDEN**: Do NOT use \`@openzeppelin/...\` unless you are sure it's installed. Prefer implementing minimal versions yourself.
    3. **Missing Interfaces**:
       - If you need an interface or type that might not exist on disk (like \`IFlareDaemon\`), **define a minimal local version** inside the file instead of importing a non-existent contract.
       - **CRITICAL**: Do NOT invent file paths for missing interfaces.
    4. **Patterns**:
       - Favor patterns present in \`src/\`: simple constructors, explicit structs/enums.
       - No inheritance from unknown parents.
       - No callbacks unless they exist in the repo.
    5. **Comments**: Keep them short and functional. Avoid console.log or pseudo-code.
    6. **Mental Build**: Ensure contracts compile with the current dependencies. Run \`forge build\` mentally to catch missing files.

    **Reference Repositories**:
    - Foundry: https://github.com/flare-foundation/flare-foundry-starter
    - Hardhat: https://github.com/flare-foundation/flare-hardhat-starter

    **Conversation History:**
    ${history.map(m => `${m.role}: ${m.content}`).join("\n")}

    **User's Latest Message:**
    "${lastMessage}"

    **Response Format:**
    Return a JSON object with:
    - "response": (string) Your helpful response, including any code blocks.
    - "suggestedQuestions": (array of strings) 4 short, relevant follow-up questions the user might want to ask next.
    - "updatedFiles": (array) Empty array [] (Legacy field).
  `;

  const result = await retryWithBackoff(() => model.generateContent(prompt));
  const response = await result.response;
  return JSON.parse(response.text());
}
