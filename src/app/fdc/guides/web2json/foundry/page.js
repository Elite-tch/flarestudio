"use client"
import { motion } from "framer-motion"
import { Screenshot } from "@/app/ftso-guides/build-first-app/component/screenshot"

import { CodeBlock } from "@/app/ftso-guides/build-first-app/component/code-block"

export default function FoundryWeb2JSONEducationalGuide() {
  return (
    <div className="pt-[30%] pb-[3%] md:pt-[12%] bg-[#ffe4e8] overflow-hidden">
      <div className="max-w-6xl mx-auto w-[90%]">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="mb-10"
        >
          <h1 className="md:text-4xl text-3xl font-bold text-gray-900 mb-4">
            Complete Foundry Web2JSON Guide: From Setup to Production
          </h1>
          <p className="text-md text-gray-600 max-w-3xl">
            Official Flare Foundry documentation with complete setup instructions, step-by-step breakdowns, and beginner-friendly explanations.
          </p>
        </motion.div>

        {/* Quick Start Section */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Start: Foundry Setup Guide</h2>
          
          <h3 className="text-lg font-semibold mb-3">Step 1: Clone and Setup Foundry</h3>
          <CodeBlock
            language="bash"
            code={`# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Clone the Flare Foundry starter
git clone https://github.com/flare-foundation/flare-foundry-starter
cd flare-foundry-starter

# Install dependencies
forge install`}
          />

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 2: Environment Configuration</h3>
          <p className="text-gray-700 mb-2">Create a <code>.env</code> file in the project root:</p>
          <CodeBlock
            language="bash"
            code={`# .env - Foundry Configuration
PRIVATE_KEY=0xYourPrivateKeyHere
COSTON2_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
FLARE_RPC_URL=https://flare-api.flare.network/ext/C/rpc
VERIFIER_API_KEY=00000000-0000-0000-0000-000000000000
WEB2JSON_VERIFIER_URL_TESTNET=https://web2json-verifier-test.flare.rocks/
COSTON2_DA_LAYER_URL=https://ctn2-data-availability.flare.network/
X_API_KEY=your_da_layer_api_key`}
          />

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 3: Build the Project</h3>
          <CodeBlock
            language="bash"
            code={`# Build all contracts
forge build`}
          />
        </section>

        {/* Web2JSON Overview */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Web2Json Attestation Type</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              The Web2Json attestation type enables data collection from an arbitrary Web2 source. You can learn more about it in the official specification.
            </p>
            
            <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm">
                <strong>Info:</strong> The Web2Json attestation type is currently only available on the Flare Testnet Coston2.
              </p>
            </div>

            <p className="text-gray-700 mb-6">
              We will now demonstrate how the FDC protocol can be used to collect the data of a given Star Wars API request. The request we will be making is <code>https://swapi.info/api/people/3</code>. The same procedure works for all public APIs.
            </p>

            <p className="text-gray-700">
              In this guide, we will follow the steps outlined in the FDC overview. We will define separate scripts in <code>script/fdcExample/Web2Json.s.sol</code> that handle different stages of the validation process.
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Foundry Script Architecture</h3>
          <p className="text-gray-700 mb-4">
            <strong>Simple Explanation:</strong> Foundry uses a modular approach where each step is a separate contract. Think of it like having different specialists for each job in a factory assembly line.
          </p>

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
            <p className="">
              <strong>Factory Assembly Line Analogy:</strong><br/>
              • <strong>PrepareAttestationRequest</strong>: Design department (creates the blueprint)<br/>
              • <strong>SubmitAttestationRequest</strong>: Shipping department (sends to blockchain)<br/>
              • <strong>RetrieveDataAndProof</strong>: Quality control (verifies the product)<br/>
              • <strong>Deploy</strong>: Manufacturing (creates the final product)
            </p>
          </div>

          <CodeBlock
            language="solidity"
            code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "dependencies/forge-std-1.9.5/src/Script.sol";

string constant attestationTypeName = "Web2Json";
string constant dirPath = "data/";

// Each contract handles one specific step
contract PrepareAttestationRequest is Script {
    // Creates the request blueprint
}

contract SubmitAttestationRequest is Script {
    // Sends request to blockchain
}

contract RetrieveDataAndProof is Script {
    // Gets verified data back
}

contract Deploy is Script {
    // Deploys our application contract
}`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <p className="text-sm">
              <strong>Why Multiple Contracts?</strong> This modular approach makes the code more maintainable and allows running individual steps independently. Each contract focuses on one specific responsibility.
            </p>
          </div>
        </section>

        {/* Step 1: Prepare Request */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 1: Prepare Your Data Request</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              <strong>Simple Explanation:</strong> This is where we create a detailed &ldquo;shopping list&ldquo; that tells Flare exactly what data we want and how to process it.
            </p>

            <h3 className="text-xl font-semibold mb-3">Required Fields Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">attestationType</h4>
                <p className="text-sm">Tells Flare &ldquo;I want Web2 data&ldquo; → Converted to hex: &ldquo;Web2Json&ldquo;</p>
              </div>
              <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">sourceId</h4>
                <p className="text-sm">Tells Flare &ldquo;From public websites&ldquo; → Converted to hex: &ldquo;PublicWeb2&ldquo;</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">Request Body Details</h3>
            <p className="text-gray-700 mb-4">
              The <code>requestBody</code> is where we specify exactly what data to fetch and how to process it:
            </p>
          </div>

          <CodeBlock
            language="json"
            code={`{
  "url": "Where to get the data (website address)",
  "httpMethod": "How to fetch it (GET, POST, etc.)", 
  "headers": "Any special headers needed",
  "queryParams": "URL parameters to include",
  "body": "Data to send for POST requests",
  "postProcessJq": "Which fields to extract and how to format them",
  "abiSignature": "How to package the data for blockchain use"
}`}
          />

          <h3 className="text-xl font-semibold mt-8 mb-3">Real Example: Star Wars API Request</h3>
          <p className="text-gray-700 mb-4">
            Here&apos;s the actual configuration we use to fetch R2-D2&apos;s data:
          </p>

          <CodeBlock
            language="solidity"
            code={`// Inside PrepareAttestationRequest contract
string public apiUrl = "https://swapi.info/api/people/3";
string public httpMethod = "GET";
string public headers = '{\\"Content-Type\\":\\"text/plain\\"}';
string public queryParams = "{}";
string public body = "{}";
string public postProcessJq =
    '{name: .name, height: .height, mass: .mass, numberOfFilms: .films | length, uid: (.url | split(\\"/\\") | .[-1] | tonumber)}';
string public abiSignature =
    '{\\"components\\": [{\\"internalType\\": \\"string\\", \\"name\\": \\"name\\", \\"type\\": \\"string\\"},{\\"internalType\\": \\"uint256\\", \\"name\\": \\"height\\", \\"type\\": \\"uint256\\"},{\\"internalType\\": \\"uint256\\", \\"name\\": \\"mass\\", \\"type\\": \\"uint256\\"},{\\"internalType\\": \\"uint256\\", \\"name\\": \\"numberOfFilms\\", \\"type\\": \\"uint256\\"},{\\"internalType\\": \\"uint256\\", \\"name\\": \\"uid\\", \\"type\\": \\"uint256\\"}],\\"name\\": \\"task\\",\\"type\\": \\"tuple\\"}';`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">What Each Field Does:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>postProcessJq</strong>: &ldquo;Extract name, height, mass, count films, and get ID from URL&ldquo;</li>
              <li>• <strong>abiSignature</strong>: &ldquo;Package data as a tuple with these specific types for the blockchain&ldquo;</li>
              <li>• <strong>headers</strong>: &ldquo;Use text/plain content type for this API&ldquo;</li>
            </ul>
          </div>
        </section>

        {/* Step 2: Encoding Functions */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 2: Text to Hex Conversion</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              <strong>Simple Explanation:</strong> Blockchain computers don&apos;t understand normal text. These functions translate human-readable words into computer-readable hex codes.
            </p>

            <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
              <p className="">
                <strong>Language Translation Analogy:</strong><br/>
                • <strong>Human</strong>: &ldquo;Web2Json&ldquo; (English words)<br/>
                • <strong>Computer</strong>: &ldquo;0x576562324a736f6e0000...&ldquo; (Computer language)
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">The Encoding Process</h3>
            <p className="text-gray-700 mb-4">
              Flare provides two key functions in their Base library to handle this conversion:
            </p>
          </div>

          <h4 className="text-lg font-semibold mb-3">1. toHexString - Basic Hex Conversion</h4>
          <CodeBlock
            language="solidity"
            code={`function toHexString(bytes memory data) public pure returns (string memory) {
    bytes memory alphabet = "0123456789abcdef";
    
    bytes memory str = new bytes(2 + data.length * 2);
    str[0] = "0";
    str[1] = "x";
    for (uint i = 0; i < data.length; i++) {
        str[2 + i * 2] = alphabet[uint(uint8(data[i] >> 4))];
        str[3 + i * 2] = alphabet[uint(uint8(data[i] & 0x0f))];
    }
    return string(str);
}`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">How This Works:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Takes raw bytes and converts each byte to two hex characters</li>
              <li>• Adds &ldquo;0x&ldquo; prefix so blockchain knows it&apos;s hex data</li>
              <li>• Example: &ldquo;W&ldquo; → 0x57, &ldquo;e&ldquo; → 0x65, &ldquo;b&ldquo; → 0x62</li>
            </ul>
          </div>

          <h4 className="text-lg font-semibold mt-8 mb-3">2. toUtf8HexString - UTF8 with Padding</h4>
          <CodeBlock
            language="solidity"
            code={`function toUtf8HexString(string memory _string) internal pure returns (string memory) {
    string memory encodedString = toHexString(abi.encodePacked(_string));
    uint256 stringLength = bytes(encodedString).length;
    require(stringLength <= 64, "String too long");
    uint256 paddingLength = 64 - stringLength + 2;
    for (uint256 i = 0; i < paddingLength; i++) {
        encodedString = string.concat(encodedString, "0");
    }
    return encodedString;
}`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Why Padding Matters:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Blockchain expects exactly 32 bytes (64 hex characters)</li>
              <li>• &ldquo;Web2Json&ldquo; is only 8 characters → needs padding to reach 32 bytes</li>
              <li>• Adds zeros to fill the remaining space</li>
              <li>• Final result: &ldquo;0x576562324a736f6e0000000..&ldquo;</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">Real Conversion Examples</h3>
          <CodeBlock
            language="text"
            code={`Input: "Web2Json"
Step 1: Convert to bytes → [0x57, 0x65, 0x62, 0x32, 0x4a, 0x73, 0x6f, 0x6e]
Step 2: Convert to hex → "0x576562324a736f6e"
Step 3: Add padding → "0x576562324a736f6e000..."

Input: "PublicWeb2"  
Output: "0x5075626c696357656232000..."`}
          />
        </section>

        {/* Step 3: Prepare Attestation Request */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 3: Build the Complete Request</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              <strong>Simple Explanation:</strong> Now we package everything together into a proper HTTP request that we can send to Flare&apos;s verifier service.
            </p>

            <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
              <p className="">
                <strong>Shipping Package Analogy:</strong><br/>
                • <strong>Headers</strong>: Shipping label with destination and security info<br/>
                • <strong>Body</strong>: The actual contents of your package<br/>
                • <strong>API Key</strong>: Your security clearance for the shipping company
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">Helper Functions</h3>
            <p className="text-gray-700 mb-4">
              Flare provides helper functions to build the request properly:
            </p>
          </div>

          <CodeBlock
            language="solidity"
            code={`function prepareAttestationRequest(
    string memory attestationType,
    string memory sourceId,
    string memory requestBody
) internal view returns (string[] memory, string memory) {
    // We read the API key from the .env file
    string memory apiKey = vm.envString("VERIFIER_API_KEY");

    // Preparing headers
    string[] memory headers = prepareHeaders(apiKey);
    // Preparing body
    string memory body = prepareBody(attestationType, sourceId, requestBody);

    console.log("headers: %s", string.concat("{", headers[0], ", ", headers[1]), "}");
    console.log("body: %s", body);
    return (headers, body);
}

function prepareHeaders(string memory apiKey) internal pure returns (string[] memory) {
    string[] memory headers = new string[](2);
    headers[0] = string.concat('"X-API-KEY": ', apiKey);
    headers[1] = '"Content-Type": "application/json"';
    return headers;
}

function prepareBody(
    string memory attestationType,
    string memory sourceId,
    string memory body
) internal pure returns (string memory) {
    return string.concat(
        '{"attestationType": ',
        '"', attestationType, '"',
        ', "sourceId": ',
        '"', sourceId, '"',
        ', "requestBody": ',
        body,
        "}"
    );
}`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">What Gets Created:</h4>
            <CodeBlock
              language="json"
              code={`{
  "attestationType": "0x576562324a736f6e000000000000000000000000000000000000000000000000",
  "sourceId": "0x5075626c6963576562320000000000000000000000000000000000000000000000", 
  "requestBody": {
    "url": "https://swapi.info/api/people/3",
    "httpMethod": "GET",
    "headers": "{\\"Content-Type\\":\\"text/plain\\"}",
    "queryParams": "{}",
    "body": "{}",
    "postProcessJq": "{name: .name, height: .height, mass: .mass, numberOfFilms: .films | length, uid: (.url | split(\\"/\\") | .[-1] | tonumber)}",
    "abiSignature": "{\\"components\\": [{\\"internalType\\": \\"string\\", \\"name\\": \\"name\\", \\"type\\": \\"string\\"},{\\"internalType\\": \\"uint256\\", \\"name\\": \\"height\\", \\"type\\": \\"uint256\\"},{\\"internalType\\": \\"uint256\\", \\"name\\": \\"mass\\", \\"type\\": \\"uint256\\"},{\\"internalType\\": \\"uint256\\", \\"name\\": \\"numberOfFilms\\", \\"type\\": \\"uint256\\"},{\\"internalType\\": \\"uint256\\", \\"name\\": \\"uid\\", \\"type\\": \\"uint256\\"}],\\"name\\": \\"task\\",\\"type\\": \\"tuple\\"}"
  }
}`}
            />
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">Running the Prepare Script</h3>
          <CodeBlock
            language="bash"
            code={`source .env
forge script script/fdcExample/Web2Json.s.sol:PrepareAttestationRequest \\
  --private-key $PRIVATE_KEY \\
  --rpc-url $COSTON2_RPC_URL \\
  --etherscan-api-key $FLARE_RPC_API_KEY \\
  --broadcast \\
  --ffi`}
          />


          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <p className="text-sm">
              <strong>What Happens:</strong> This script creates the request and saves the <code>abiEncodedRequest</code> to a file (<code>data/Web2Json_abiEncodedRequest.txt</code>) for the next step.
            </p>
          </div>
        </section>
         
        {/* Step 4: Submit to FDC */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 4: Submit Request to Blockchain</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              <strong>Simple Explanation:</strong> Now we take our prepared request and actually submit it to the Flare blockchain. This is like paying for and shipping your package.
            </p>

            <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
              <p className="">
                <strong>Shipping Process Analogy:</strong><br/>
                • <strong>Check shipping cost</strong>: See how much gas fee is required<br/>
                • <strong>Pay and ship</strong>: Submit transaction with the fee<br/>
                • <strong>Get tracking number</strong>: Receive transaction hash and round ID
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">The Submission Process</h3>
            <p className="text-gray-700 mb-4">
              This step involves interacting with Flare&apos;s smart contracts to submit our request:
            </p>
          </div>

          <CodeBlock
            language="solidity"
            code={`function submitAttestationRequest(bytes memory abiEncodedRequest) internal {
    // Step 1: Load private key and check request fee
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    
    IFdcRequestFeeConfigurations fdcRequestFeeConfigurations = ContractRegistry
        .getFdcRequestFeeConfigurations();
    uint256 requestFee = fdcRequestFeeConfigurations.getRequestFee(abiEncodedRequest);
    console.log("request fee: %s", requestFee);
    vm.stopBroadcast();

    // Step 2: Submit the actual request
    vm.startBroadcast(deployerPrivateKey);
    IFdcHub fdcHub = ContractRegistry.getFdcHub();
    console.log("fcdHub address:");
    console.log(address(fdcHub));
    fdcHub.requestAttestation{value: requestFee}(abiEncodedRequest);
    vm.stopBroadcast();

    // Step 3: Calculate voting round
    IFlareSystemsManager flareSystemsManager = ContractRegistry.getFlareSystemsManager();
    uint32 roundId = flareSystemsManager.getCurrentVotingEpochId();
    console.log("roundId: %s", Strings.toString(roundId));
}`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Step-by-Step Breakdown:</h4>
            <ol className="text-sm text-yellow-800 space-y-2">
              <li><strong>1. Check Fee</strong>: Ask Flare &ldquo;How much does this request cost?&ldquo;</li>
              <li><strong>2. Submit Request</strong>: Pay the fee and send request to FdcHub contract</li>
              <li><strong>3. Get Round ID</strong>: Find out which voting period our request is in</li>
              <li><strong>4. Save Data</strong>: Store round ID for the next step</li>
            </ol>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">Flare&apos;s Contract Registry</h3>
          <p className="text-gray-700 mb-4">
            Flare uses a &ldquo;ContractRegistry&ldquo; system that acts like a universal remote control for all Flare services:
          </p>

          <CodeBlock
            language="solidity"
            code={`// These are like different "buttons" on your remote control:

ContractRegistry.getFdcHub()                    // "Submit request" button
ContractRegistry.getFdcRequestFeeConfigurations() // "Check price" button  
ContractRegistry.getFlareSystemsManager()        // "Check time" button
ContractRegistry.getRelay()                      // "Verify completion" button`}
          />

          <h3 className="text-xl font-semibold mt-8 mb-3">Running the Submit Script</h3>
          <CodeBlock
            language="bash"
            code={`forge script script/fdcExample/Web2Json.s.sol:SubmitAttestationRequest \\
  --private-key $PRIVATE_KEY \\
  --rpc-url $COSTON2_RPC_URL \\
  --etherscan-api-key $FLARE_RPC_API_KEY \\
  --broadcast \\
  --ffi`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <p className="text-sm">
              <strong>What to Expect:</strong> You&apos;ll see the request fee, transaction hash, and voting round ID. The script saves the round ID to <code>data/Web2Json_votingRoundId.txt</code>.
            </p>
          </div>
        </section>

        {/* Step 5: Wait and Retrieve Proof */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 5: Wait for Verification & Get Proof</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              <strong>Simple Explanation:</strong> Flare&apos;s network needs time to verify the data. We wait for the voting round to complete, then retrieve the cryptographic proof.
            </p>

            <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
              <p className="">
                <strong>Quality Control Analogy:</strong><br/>
                • <strong>Waiting period</strong>: Factory quality control checks the product<br/>
                • <strong>Verification</strong>: Multiple validators confirm data is authentic<br/>
                • <strong>Proof generation</strong>: Create certificate of authenticity
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">Voting Round Timing</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Round Duration</h4>
                <p className="text-sm">90 seconds per voting round</p>
              </div>
              <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Finalization Time</h4>
                <p className="text-sm">1-3 minutes total wait</p>
              </div>
              <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Check Progress</h4>
                <p className="text-sm">Use Flare Systems Explorer</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">Retrieving the Proof</h3>
            <p className="text-gray-700 mb-4">
              After waiting, we ask the Data Availability (DA) Layer for the verified data and proof:
            </p>
          </div>

          <CodeBlock
            language="solidity"
            code={`contract RetrieveDataAndProof is Script {
    using Surl for *;
    
    function run() external {
        // Load environment variables and saved data
        string memory daLayerUrl = vm.envString("COSTON2_DA_LAYER_URL");
        string memory apiKey = vm.envString("X_API_KEY");
        
        string memory requestBytes = vm.readLine("data/Web2Json_abiEncodedRequest.txt");
        string memory votingRoundId = vm.readLine("data/Web2Json_votingRoundId.txt");
        
        // Prepare the proof request
        string[] memory headers = Base.prepareHeaders(apiKey);
        string memory body = string.concat(
            '{"votingRoundId":', votingRoundId,
            ',"requestBytes":"', requestBytes, '"}'
        );
        
        // Send request to DA Layer
        string memory url = string.concat(daLayerUrl, "api/v1/fdc/proof-by-request-round-raw");
        (, bytes memory data) = Base.postAttestationRequest(url, headers, body);
        
        // Parse the response
        bytes memory dataJson = parseData(data);
        ParsableProof memory proof = abi.decode(dataJson, (ParsableProof));
        
        // Save proof for later use
        Base.writeToFile(
            dirPath,
            string.concat(attestationTypeName, "_proof"),
            StringsBase.toHexString(abi.encode(_proof)),
            true
        );
    }
}`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">What You Get Back:</h4>
            <CodeBlock
              language="json"
              code={`{
  "attestationType": "0x576562324a736f6e00000000000...",
  "proofs": [
    "0x4305b2025b90e3316dfdad...",
    "0x2bdf5b10f6027a520f1e...",
    "0xff12aaa4fcb39d21c50...",
    "0xadd7610ccf4a2fcea7..."
  ],
  "responseHex": "0x00000000000000000..."
}`}
            />
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">Running the Retrieve Script</h3>
          <CodeBlock
            language="bash"
            code={`forge script script/fdcExample/Web2Json.s.sol:RetrieveDataAndProof \\
  --private-key $PRIVATE_KEY \\
  --rpc-url $COSTON2_RPC_URL \\
  --etherscan-api-key $FLARE_RPC_API_KEY \\
  --broadcast \\
  --ffi`}
          />
        </section>

        {/* Step 6: Verify Proof */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 6: Verify the Cryptographic Proof</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              <strong>Simple Explanation:</strong> This is where we check that the data we received is authentic and hasn&apos;t been tampered with.
            </p>

            <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
              <p className="">
                <strong>Security Seal Analogy:</strong><br/>
                • <strong>Merkle Proof</strong>: Like a tamper-evident security seal<br/>
                • <strong>On-chain verification</strong>: Checking the seal against official records<br/>
                • <strong>Gas optimization</strong>: Store only the proof, not the data
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">How FDC Verification Works</h3>
            <p className="text-gray-700 mb-4">
              FDC uses a clever system to save gas costs while maintaining security:
            </p>
          </div>

          <CodeBlock
            language="solidity"
            code={`// FDC's gas optimization strategy:
// 1. Store only Merkle proofs on-chain (cheap)
// 2. Keep actual data off-chain (expensive to store)
// 3. Verify proofs match on-chain records

function verifyWeb2Json(IWeb2Json.Proof memory _proof) internal view returns (bool) {
    // Format the proof for verification
    IWeb2Json.Proof memory formattedProof = IWeb2Json.Proof(_proof.proofs, _proof.data);
    
    // Ask Flare: "Is this proof valid?"
    bool isValid = ContractRegistry.getFdcVerification().verifyWeb2Json(formattedProof);
    
    console.log("proof is valid: %s", StringsBase.toString(isValid));
    return isValid;
}`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Merkle Tree Explanation:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>Like a family tree for data</strong> - each piece connects to prove authenticity</li>
              <li>• <strong>Root hash</strong> stored on-chain represents all the data</li>
              <li>• <strong>Merkle proof</strong> shows how your data connects to the root</li>
              <li>• <strong>Verification</strong> checks if the proof matches the on-chain root</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">Why This Matters</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Cost Savings</h4>
              <p className="text-sm">Storing proofs is much cheaper than storing full data on-chain</p>
            </div>
            <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Security</h4>
              <p className="text-sm">Anyone can verify data authenticity at any time</p>
            </div>
          </div>
        </section>

        {/* Step 7: Use the Data */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 7: Build Your Application Contract</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              <strong>Simple Explanation:</strong> Now we create a smart contract that actually uses the verified Star Wars data. This is our final application.
            </p>

            <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
              <p className="">
                <strong>Collection Display Analogy:</strong><br/>
                • <strong>Data structures</strong>: Like display cases and labels for your collectibles<br/>
                • <strong>Verification</strong>: Security system that only accepts authenticated items<br/>
                • <strong>Storage</strong>: Your actual collection display
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">Contract Structure</h3>
            <p className="text-gray-700 mb-4">
              We&apos;ll create a Star Wars character collection that only accepts verified data:
            </p>
          </div>

          <CodeBlock
            language="solidity"
            code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// What we want to store permanently
struct StarWarsCharacter {
    string name;
    uint256 numberOfMovies;
    uint256 apiUid;
    uint256 bmi;  // Calculated from verified data!
}

// Temporary structure for data transport  
struct DataTransportObject {
    string name;
    uint256 height;
    uint256 mass; 
    uint256 numberOfMovies;
    uint256 apiUid;
}

// Our main collection contract
contract StarWarsCharacterList {
    mapping(uint256 => StarWarsCharacter) public characters;
    uint256[] public characterIds;

    // STEP 1: Verify the proof is authentic
    function isWeb2JsonProofValid(IWeb2Json.Proof calldata _proof) 
        private view returns (bool) 
    {
        return ContractRegistry.getFdcVerification().verifyWeb2Json(_proof);
    }

    // STEP 2: Add a new character with verification
    function addCharacter(IWeb2Json.Proof calldata data) public {
        // First, verify the proof is valid
        require(isWeb2JsonProofValid(data), "Invalid proof");

        // STEP 3: Unpack the verified data
        DataTransportObject memory dto = abi.decode(
            data.data.responseBody.abi_encoded_data,
            (DataTransportObject)
        );

        // STEP 4: Check for duplicates
        require(characters[dto.apiUid].apiUid == 0, "Character already exists");

        // STEP 5: Calculate BMI from verified height & mass
        uint256 bmi = (dto.mass * 100 * 100) / (dto.height * dto.height);

        // STEP 6: Create and store our character
        StarWarsCharacter memory character = StarWarsCharacter({
            name: dto.name,
            numberOfMovies: dto.numberOfMovies,
            apiUid: dto.apiUid,
            bmi: bmi  // Derived data from verified sources!
        });

        characters[dto.apiUid] = character;
        characterIds.push(dto.apiUid);
    }

    // STEP 7: View the entire collection
    function getAllCharacters() public view returns (StarWarsCharacter[] memory) {
        StarWarsCharacter[] memory result = new StarWarsCharacter[](characterIds.length);
        for (uint256 i = 0; i < characterIds.length; i++) {
            result[i] = characters[characterIds[i]];
        }
        return result;
    }
}`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Real Data Transformation:</h4>
            <CodeBlock
              language="json"
              code={`// What Flare verifies (DataTransportObject):
{
  "name": "R2-D2",
  "height": 96,        // 96 cm
  "mass": 32,          // 32 kg  
  "numberOfMovies": 7,
  "apiUid": 3
}

// What we store (StarWarsCharacter):
{
  "name": "R2-D2",
  "numberOfMovies": 7, 
  "apiUid": 3,
  "bmi": 3472          // (32 * 100 * 100) / (96 * 96) = 3472
}`}
            />
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">Deploy the Contract</h3>
          <CodeBlock
            language="solidity"
            code={`contract DeployContract is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy our collection contract
        StarWarsCharacterList characterList = new StarWarsCharacterList();
        address _address = address(characterList);

        vm.stopBroadcast();

        // Save address for interaction
        Base.writeToFile(
            dirPath,
            string.concat(attestationTypeName, "_address"),
            StringsBase.toHexString(abi.encodePacked(_address)),
            true
        );
    }
}`}
          />

          <CodeBlock
            language="bash"
            code={`# Deploy the contract
forge script script/fdcExample/Web2Json.s.sol:DeployContract \\
  --private-key $PRIVATE_KEY \\
  --rpc-url $COSTON2_RPC_URL \\
  --etherscan-api-key $FLARE_RPC_API_KEY \\
  --broadcast \\
  --verify \\
  --ffi`}
          />

<Screenshot 
            src="/fdcd.png" 
            alt="Web2JSON terminal output"
            caption="Live terminal "
          />
        </section>

        {/* Step 8: Interact with Contract */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 8: Add R2-D2 to Your Collection</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              <strong>Simple Explanation:</strong> Final step! We take our verified R2-D2 data and add it to our on-chain collection.
            </p>

            <h3 className="text-xl font-semibold mb-3">Interaction Script</h3>
            <p className="text-gray-700 mb-4">
              This script loads all our saved data and interacts with the deployed contract:
            </p>
          </div>

          <CodeBlock
            language="solidity"
            code={`contract InteractWithContract is Script {
    function run() external {
        // Load saved data from files
        string memory addressString = vm.readLine("data/Web2Json_address.txt");
        address _address = vm.parseAddress(addressString);
        
        string memory proofString = vm.readLine("data/Web2Json_proof.txt");
        bytes memory proofBytes = vm.parseBytes(proofString);
        IWeb2Json.Proof memory proof = abi.decode(proofBytes, (IWeb2Json.Proof));
        
        // Connect to our deployed contract
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        IStarWarsCharacterList characterList = IStarWarsCharacterList(_address);
        
        // Add R2-D2 to the collection!
        characterList.addCharacter(proof);
        vm.stopBroadcast();
    }
}`}
          />

          <CodeBlock
            language="bash"
            code={`# Add the verified character to your collection
forge script script/fdcExample/Web2Json.s.sol:InteractWithContract \\
  --private-key $PRIVATE_KEY \\
  --rpc-url $COSTON2_RPC_URL \\
  --etherscan-api-key $FLARE_RPC_API_KEY \\
  --broadcast \\
  --ffi`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Complete Workflow Summary:</h4>
            <ol className="text-sm text-yellow-800 space-y-2">
              <li><strong>1. Prepare</strong>: Create request for Star Wars API data</li>
              <li><strong>2. Encode</strong>: Convert text to blockchain-readable hex</li>
              <li><strong>3. Submit</strong>: Send request to Flare network with fee</li>
              <li><strong>4. Wait</strong>: Let Flare validators verify the data</li>
              <li><strong>5. Retrieve</strong>: Get cryptographic proof of verification</li>
              <li><strong>6. Verify</strong>: Check proof matches on-chain records</li>
              <li><strong>7. Deploy</strong>: Create your application contract</li>
              <li><strong>8. Use</strong>: Add verified data to your contract</li>
            </ol>
          </div>
        </section>

        {/* Complete Workflow Section */}
        <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Complete Foundry Workflow</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              Here&apos;s the complete sequence of commands to run the entire Web2JSON workflow with Foundry:
            </p>
          </div>

          <CodeBlock
            language="bash"
            code={`# Step 1: Prepare the attestation request
forge script script/fdcExample/Web2Json.s.sol:PrepareAttestationRequest --private-key $PRIVATE_KEY --rpc-url $COSTON2_RPC_URL --broadcast --ffi

# Step 2: Submit to blockchain  
forge script script/fdcExample/Web2Json.s.sol:SubmitAttestationRequest --private-key $PRIVATE_KEY --rpc-url $COSTON2_RPC_URL --broadcast --ffi

# Wait 2-4 minutes for round finalization...

# Step 3: Retrieve the proof
forge script script/fdcExample/Web2Json.s.sol:RetrieveDataAndProof --private-key $PRIVATE_KEY --rpc-url $COSTON2_RPC_URL --broadcast --ffi

# Step 4: Deploy your contract
forge script script/fdcExample/Web2Json.s.sol:DeployContract --private-key $PRIVATE_KEY --rpc-url $COSTON2_RPC_URL --broadcast --verify --ffi

# Step 5: Use the verified data
forge script script/fdcExample/Web2Json.s.sol:InteractWithContract --private-key $PRIVATE_KEY --rpc-url $COSTON2_RPC_URL --broadcast --ffi`}
          />

          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-6">
            <p className="">
              <strong>Congratulations! </strong> You&apos;ve now mastered the complete Foundry Web2JSON workflow. 
              You&apos;ve learned how to bring real-world data to the blockchain trustlessly using Flare&apos;s FDC protocol with Foundry.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}