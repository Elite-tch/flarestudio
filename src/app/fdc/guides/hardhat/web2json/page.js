"use client"
import { motion } from "framer-motion"
import { CodeBlock } from "@/app/ftso-guides/build-first-app/component/code-block"
import { Screenshot } from "@/app/ftso-guides/build-first-app/component/screenshot"

export default function Web2JSONHardhatComplete() {
  return (
    <div className=" pt-[30%] pb-[3%] md:pt-[12%] bg-[#ffe4e8]">
      <div className="max-w-6xl mx-auto w-[90%]">
       {/* Header */}
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <h1 className="md:text-4xl text-3xl font-bold text-gray-900 mb-4">Complete Web2JSON Guide: From Setup to Production</h1>
        <p className="text-md text-gray-600 max-w-3xl">
          Official Flare documentation with complete setup instructions, real terminal outputs, and beginner-friendly explanations.
        </p>
      </motion.div>

      {/* Quick Start Section */}
      <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm  mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Start: Complete Setup Guide</h2>
        
     <h3 className="text-lg font-semibold mb-3">Step 1: Clone and Setup</h3>
        <CodeBlock
          language="bash"
          code={`# Clone the official Flare Hardhat starter
git clone https://github.com/flare-foundation/flare-hardhat-starter
cd flare-hardhat-starter

# Install all dependencies
npm install`}
        />

        <h3 className="text-lg font-semibold mt-6 mb-3">Step 2: Environment Configuration</h3>
        <p className="text-gray-700 mb-2">Create a <code>.env</code> file in the project root:</p>
        <CodeBlock
          language="bash"
          code={`# .env - Fill in these values
PRIVATE_KEY=0xYourPrivateKeyHere
COSTON2_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
FLARE_RPC_URL=https://flare-api.flare.network/ext/C/rpc
VERIFIER_API_KEY_TESTNET=00000000-0000-0000-0000-000000000000
ATTESTATION_PROVIDER_URL_TESTNET="https://web2json-verifier-test.flare.rocks/"
WEB3JSON_VERIFIER_URL_TESTNET=https://fdc-verifiers-testnet.flare.network/
COSTON2_DA_LAYER_URL="https://ctn2-data-availability.flare.network/"`}
        />

        <h3 className="text-lg font-semibold mt-6 mb-3">Step 3: Compile Contracts</h3>
        <CodeBlock
          language="bash"
          code={`# Compile all smart contracts
npx hardhat compile`}
        />

       
      </section>

      {/* Official Documentation Content */}
      <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-2xl font-bold mb-4">Web2Json Attestation Type</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            The Web2Json attestation type enables data collection from an arbitrary Web2 source. You can learn more about it in the official specification.
          </p>
          
          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
            <p className=" text-sm">
              <strong>Info:</strong> The Web2Json attestation type is currently only available on the Flare Testnet Coston2.
            </p>
          </div>

          <p className="text-gray-700 mb-6">
            We will now demonstrate how the FDC protocol can be used to collect the data of a given Star Wars API request. The request we will be making is <code>https://swapi.info/api/people/3</code>. The same procedure works for all public APIs.
          </p>

          <p className="text-gray-700">
            In this guide, we will follow the steps outlined in the FDC overview. We will define a <code>scripts/fdcExample/Web2Json.ts</code> file that will encapsulate the whole process.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Complete Main Script Structure</h3>
        <CodeBlock
  language="typescript"
  code={`import { run, web3 } from "hardhat";
import { StarWarsCharacterListV2 } from "../../typechain-types";

import {
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBaseWithRetry,
} from "../utils/fdc";

const StarWarsCharacterListV2 = artifacts.require("StarWarsCharacterListV2");

const {
    ATTESTATION_PROVIDER_URL_TESTNET,
    VERIFIER_API_KEY_TESTNET,
    COSTON2_DA_LAYER_URL
} = process.env;

// yarn hardhat run scripts/fdcExample/Web2Json.ts --network coston2

// Request data
const apiUrl = "https://swapi.info/api/people/3";
const postProcessJq = \`{name: .name, height: .height, mass: .mass, numberOfFilms: .films | length, uid: (.url | split("/") | .[-1] | tonumber)}\`;
const httpMethod = "GET";
const headers = "{}";
const queryParams = "{}";
const body = "{}";
const abiSignature = \`{"components": [{"internalType": "string", "name": "name", "type": "string"},{"internalType": "uint256", "name": "height", "type": "uint256"},{"internalType": "uint256", "name": "mass", "type": "uint256"},{"internalType": "uint256", "name": "numberOfFilms", "type": "uint256"},{"internalType": "uint256", "name": "uid", "type": "uint256"}],"name": "task","type": "tuple"}\`;

const attestationTypeBase = "Web2Json";
const sourceIdBase = "PublicWeb2";
const verifierUrlBase = ATTESTATION_PROVIDER_URL_TESTNET;

async function prepareAttestationRequest(apiUrl: string, postProcessJq: string, abiSignature: string) {
    const requestBody = {
        url: apiUrl,
        httpMethod: httpMethod,
        headers: headers,
        queryParams: queryParams,
        body: body,
        postProcessJq: postProcessJq,
        abiSignature: abiSignature,
    };

    const url = \`\${verifierUrlBase}Web2Json/prepareRequest\`;
    const apiKey = VERIFIER_API_KEY_TESTNET;

    return await prepareAttestationRequestBase(url, apiKey, attestationTypeBase, sourceIdBase, requestBody);
}

async function retrieveDataAndProof(abiEncodedRequest: string, roundId: number) {
    const url = \`\${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw\`;
    console.log("Url:", url, "n");
    return await retrieveDataAndProofBaseWithRetry(url, abiEncodedRequest, roundId);
}

async function deployAndVerifyContract() {
    const args: any[] = [];
    const characterList: StarWarsCharacterListV2Instance = await StarWarsCharacterListV2.new(...args);
    try {
        await run("verify:verify", {
            address: characterList.address,
            constructorArguments: args,
        });
    } catch (e: any) {
        console.log(e);
    }
    console.log("StarWarsCharacterListV2 deployed to", characterList.address, "\\n");
    return characterList;
}

async function interactWithContract(characterList: StarWarsCharacterListV2Instance, proof: any) {
    console.log("Proof hex:", proof.response_hex, "\\n");

    const IWeb2JsonVerification = await artifacts.require("IWeb2JsonVerification");
    const responseType = IWeb2JsonVerification._json.abi[0].inputs[0].components[1];
    console.log("Response type:", responseType, "\\n");

    const decodedResponse = web3.eth.abi.decodeParameter(responseType, proof.response_hex);
    console.log("Decoded proof:", decodedResponse, "\\n");
    const transaction = await characterList.addCharacter({
        merkleProof: proof.proof,
        data: decodedResponse,
    });
    console.log("Transaction:", transaction.tx, "\\n");
    console.log("Star Wars Characters:\\n", await characterList.getAllCharacters(), "\\n");
}

async function main() {
    const data = await prepareAttestationRequest(apiUrl, postProcessJq, abiSignature);
    console.log("Data:", data, "\\n");

    const abiEncodedRequest = data.abiEncodedRequest;
    const roundId = await submitAttestationRequest(abiEncodedRequest);

    const proof = await retrieveDataAndProof(abiEncodedRequest, roundId);

    const characterList: StarWarsCharacterListV2Instance = await deployAndVerifyContract();

    await interactWithContract(characterList, proof);
}

void main().then(() => {
    process.exit(0);
});`}
/>


        <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
          <p className=" text-sm">
            <strong>Explanation:</strong> This is the main script that coordinates the entire Web2JSON workflow. It prepares the request, submits it to the blockchain, retrieves the verified data, and interacts with your smart contract.
          </p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Run Web2JSON Example</h3>
        <CodeBlock
          language="bash"
          code={`# Execute the complete Web2JSON workflow
npx hardhat run scripts/fdcExample/Web2Json.ts --network coston2`}
        />

        <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
          <p className=" text-sm">
            <strong>Expected Time:</strong> 2-4 minutes total. The script will wait for blockchain finalization automatically.
          </p>
        </div>
      
        {/* Real Terminal Output */}
         
        <div className="">
          <h4 className="font-semibol mt-3">What You&apos;ll See When Running the Script:</h4>
         <div className="flex justify-center mb-6 md:flex-row flex-col gap-6">
         <Screenshot 
            src="/fdc.png" 
            alt="Web2JSON terminal output"
            caption="Live terminal output showing the complete Web2JSON workflow"
          />
           <Screenshot 
            src="/fdc1.png" 
            alt="Web2JSON terminal output"
            
          />
         </div>
         <h3 className="text-lg font-semibold mt-6 mb-3">Output Explanation</h3>
          <CodeBlock
            language="text"
            code={`$ npx hardhat run scripts/fdcExample/Web2Json.ts --network coston2

🔹 Step 1: Preparing attestation request...
Url: https://web2json-verifier-test.flare.rocks/Web2Json/prepareRequest 

Prepared request:
 {
  attestationType: '0x576562324a736f6e000000000000000000000000000000000000000000000000',
  sourceId: '0x5075626c69635765623200000000000000000000000000000000000000000000',
  requestBody: {
    url: 'https://swapi.info/api/people/3',
    httpMethod: 'GET',
    headers: '{}',
    queryParams: '{}',
    body: '{}',
    postProcessJq: '{name: .name, height: .height, mass: .mass, numberOfFilms: .films | length, uid: (.url | split("/") | .[-1] | tonumber)}',
    abiSignature: '{"components": [{"internalType": "string", "name": "name", "type": "string"},{"internalType": "uint256", "name": "height", "type": "uint256"},{"internalType": "uint256", "name": "mass", "type": "uint256"},{"internalType": "uint256", "name": "numberOfFilms", "type": "uint256"},{"internalType": "uint256", "name": "uid", "type": "uint256"}],"name": "task","type": "tuple"}'
  }
} 

Response status is OK

Data: {
  status: 'VALID',
  abiEncodedRequest: '0x576562324a736f6e0000...}

🔹 Step 2: Submitting to blockchain...
Submitted request: 0x4796959e6ad0d697a3acc2ba39463186015f94f05ead7e25d88514e0f07dc937 
Block timestamp: 1762606158n 
First voting round start ts: 1658430000n 
Voting epoch duration seconds: 90n
Calculated round id: 1157512
Received round id: 1157512 
Check round progress at: https://coston2-systems-explorer.flare.rocks/voting-round/1157512?tab=fdc

🔹 Step 3: Waiting for verification...
Url: https://ctn2-data-availability.flare.network/api/v1/fdc/proof-by-request-round-raw n
Waiting for the round to finalize...
Round finalized!

🔹 Step 4: Retrieving proof...
Waiting for the DA Layer to generate the proof...
Proof generated!

Proof: {
  response_hex: '0x00000000000..',
  attestation_type: '0x576562324a736f6e000000000000000000000000000000000000000000000000',
  proof: [
    '0x4305b2025b90e3316dfdadb6f08a4fc6daaa685253f6218529266708b83c16e0',
    '0x2bdf5b10f6027a520f1e99f1aecb61909b3708639cb1cd4209f2e45a125e550a',
    '0xff12aaa4fcb39d21c5086c9e8da732b0e811d4f655037f011f4a1ead08be9e8c',
    '0xadd7610ccf4a2fcea7564b116ae597d12fe22ac1abee1a8010c8685c760f4000'
  ]
}

🔹 Step 5: Deploying contract...
StarWarsCharacterListV2 deployed to 0x9eE...d92d5904Ce5d65B01 

🔹 Step 6: Interacting with contract...
Transaction: 0xcb9cd16bd195661584ee55a8b76cb72674....

Star Wars Characters:
 [
  [
    'R2-D2',
    '6',
    '3',
    '34',
    name: 'R2-D2',
    numberOfMovies: '6',
    apiUid: '3',
    bmi: '34'
  ]
]

 Web2JSON workflow completed successfully!`}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold  mb-2">What Just Happened:</h4>
            <ul className="text-sm  space-y-1">
              <li>• Fetched R2-D2 data from Star Wars API</li>
              <li>• Flare network verified the data</li>
              <li>• Got cryptographic proof of authenticity</li>
              <li>• Stored verified data in your contract</li>
              <li>• Calculated BMI from verified height/mass</li>
            </ul>
          </div>
          
          <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold  mb-2">Timing Expectations:</h4>
            <ul className="text-sm  space-y-1">
              <li>• Request submission: ~15 seconds</li>
              <li>• Round finalization: 1-3 minutes</li>
              <li>• Proof generation: ~30 seconds</li>
              <li>• Total time: 2-4 minutes</li>
            </ul>
          </div>
        </div>
     
      
      </section>

    

      {/* Prepare Request Section */}
<section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
<h2 className="md:text-3xl text-2xl font-semibold mt-6 mb-4">Web2JSON Step-by-Step Process :</h2>
  <h2 className="text-2xl font-bold mb-4">Step 1: Prepare Your Data Request</h2>
  
  <div className="prose prose-lg max-w-none">
    <p className="text-gray-700 mb-4">
      <strong>Simple Explanation:</strong> This is where you tell Flare exactly what data you want and how you want it formatted. Think of it like giving detailed instructions to a food delivery service.
    </p>

    <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
      <p className="">
        <strong>Food Delivery Analogy:</strong><br/>
        • Regular order: &quot;Give me some food&quot; → You get whatever the chef decides<br/>
        • Web2JSON order: &quot;Cheeseburger, no onions, extra pickles, cut in half&quot; → You get exactly what you asked for
      </p>
    </div>

    <h3 className="text-xl font-semibold mb-3">What You&apos;re Telling Flare:</h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Where to Get Data</h4>
        <p className="text-sm ">
        &quot;Go to this website URL and fetch the data for me&quot;
        </p>
      </div>
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">How to Process It</h4>
        <p className="text-sm ">
        &quot;Extract only these specific fields and format them this way&quot;
        </p>
      </div>
    </div>

    <h3 className="text-xl font-semibold mb-3">Required Information</h3>
    <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
      <li><code>attestationType</code> - &quot;I want Web2 data&quot; (always &quot;Web2Json&quot;&quot;)</li>
      <li><code>sourceId</code> - &quot;From public websites&quot; (always &quot;PublicWeb2&quot;)</li>
      <li><code>requestBody</code> - Your specific data instructions</li>
    </ul>

    <p className="text-gray-700 mb-4">
      The <code>requestBody</code> tells Flare exactly what to do:
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

  <div className="prose prose-lg max-w-none mt-6">
    <h3 className="text-xl font-semibold mb-3">Real Example: Getting R2-D2&apos;s Info</h3>
    <p className="text-gray-700 mb-4">
      Here&apos;s what we&apos;re actually doing in our Star Wars example:
    </p>
  </div>

  <CodeBlock
    language="typescript"
    code={`//  WHERE to get data
const apiUrl = "https://swapi.info/api/people/3";
// ↑ "Go to Star Wars API and get character #3 (R2-D2)"

//  WHAT data to extract and HOW to format it
const postProcessJq = \`{
  name: .name,                    // "Get the character's name"
  height: .height,                // "Get their height as a number"  
  mass: .mass,                    // "Get their weight as a number"
  numberOfFilms: .films | length, // "Count how many films they appear in"
  uid: (.url | split("/") | .[-1] | tonumber) // "Extract their ID number from the URL"
}\`;

//  HOW to package for blockchain
const abiSignature = \`{
  "components": [
    {"internalType": "string", "name": "name", "type": "string"},
    {"internalType": "uint256", "name": "height", "type": "uint256"},
    {"internalType": "uint256", "name": "mass", "type": "uint256"}, 
    {"internalType": "uint256", "name": "numberOfFilms", "type": "uint256"},
    {"internalType": "uint256", "name": "uid", "type": "uint256"}
  ],
  "name": "task",
  "type": "tuple"
}\`;
// ↑ "Package the data in this exact structure for the blockchain"`}
  />

  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
    <h4 className="font-semibold text-yellow-800 mb-2">What Happens Behind the Scenes:</h4>
    <ol className="text-sm text-yellow-800 space-y-1">
      <li>1. Flare goes to the Star Wars API and gets ALL of R2-D2&apos;s data</li>
      <li>2. It extracts ONLY the fields we specified (name, height, mass, etc.)</li>
      <li>3. It converts the data to the exact format we requested</li>
      <li>4. It gives us back a &quot;package&quot; ready for blockchain use</li>
    </ol>
  </div>

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <p className=" text-sm">
      <strong>Key Point:</strong> The &quot;Prepare Request&quot; step doesn&apos;t actually fetch the data yet. 
      It just creates a &quot;shopping list&quot; that tells Flare exactly what to get and how to prepare it when we&apos;re ready.
    </p>
  </div>
</section>


 {/* Encoding Functions */}
 <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
  <h2 className="text-2xl font-bold mb-4">Step 2 : Text to Hex Conversion</h2>
  
  <div className="prose prose-lg max-w-none">
    <p className="text-gray-700 mb-4">
      <strong>Simple Explanation:</strong> Blockchain computers don&apos;t understand normal text like &quot;Web2Json&quot;. They only understand numbers and hex codes. These functions translate human words into computer language.
    </p> 

    <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
      <p className="">
        <strong>Language Translation Analogy:</strong><br/>
        • <strong>Human</strong>: &quot;Web2Json&quot; (English)<br/>
        • <strong>Computer</strong>: &quot;0x576562324a736f6e000000000000000000000000000000000000000000000000&quot; (Computer language)
      </p>
    </div>

    <h3 className="text-xl font-semibold mb-3">Why We Need This:</h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <h4 className="font-semibold  mb-2">Without Encoding</h4>
        <p className="text-sm ">Blockchain sees: &quot;Web2Json&quot; → Doesn&apos;t understand!</p>
      </div>
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <h4 className="font-semibold  mb-2">With Encoding</h4>
        <p className="text-sm ">Blockchain sees: &quot;0x576562324a736f6e...&quot; → Perfect!</p>
      </div>
    </div>

    <h3 className="text-xl font-semibold mb-3">Step 1: Convert Text to Hex (toHex)</h3>
    <p className=" mb-4">
      This function takes each letter and converts it to its computer number equivalent.
    </p>
  </div>

  <CodeBlock
    language="typescript"
    code={`function toHex(data: string) {
  var result = "";
  
  // Go through each letter one by one
  for (var i = 0; i < data.length; i++) {
    // Convert: W → 57, e → 65, b → 62, etc.
    result += data.charCodeAt(i).toString(16);
  }
  
  // Make sure it's exactly 64 characters long by adding zeros
  return result.padEnd(64, "0");
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <h4 className="font-semibold text-yellow-800 mb-2"> Real Example:</h4>
    <CodeBlock
      language="text"
      code={`Input: "Web2Json"
Step-by-step conversion:
W → 57
e → 65  
b → 62
2 → 32
J → 4a
s → 73
o → 6f
n → 6e

Result: "576562324a736f6e" + "000000000000000000000000000000000000000000000000"
Final: "576562324a736f6e000000000000000000000000000000000000000000000000"`}
    />
  </div>

  <h3 className="text-lg font-semibold mt-8 mb-3">Step 2: Add &quot;0x&quot; Prefix (toUtf8HexString)</h3>
  <div className="prose prose-lg max-w-none mb-4">
    <p className="text-gray-700">
      Blockchain computers expect hex codes to start with &quot;0x&quot; so they know it&apos;s computer language.
    </p>
  </div>

  <CodeBlock
    language="typescript"
    code={`function toUtf8HexString(data: string) {
  // Just add "0x" to the beginning
  return "0x" + toHex(data);
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <h4 className="font-semibold  mb-2">Final Result:</h4>
    <CodeBlock
      language="text"
      code={`Input: "Web2Json"
Output: "0x576562324a736f6e000000000000000000000000000000000000000000000000"

Input: "PublicWeb2"  
Output: "0x5075626c6963576562320000000000000000000000000000000000000000000000"`}
    />
  </div>

  <div className="prose prose-lg max-w-none mt-6">
    <h3 className="text-xl font-semibold mb-3">Where This Is Used:</h3>
    <ul className="list-disc pl-6 text-gray-700 space-y-2">
      <li><strong>attestationType</strong>: Convert &quot;Web2Json&quot; → hex code</li>
      <li><strong>sourceId</strong>: Convert &quot;PublicWeb2&quot; → hex code</li>
      <li><strong>Any text field</strong> that needs to be understood by the blockchain</li>
    </ul>

    <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
      <p className=" text-sm">
        <strong>Why 64 Characters?</strong> Blockchain computers expect exactly 32 bytes of data (64 hex characters). 
        The padding with zeros ensures everything fits perfectly in the computer&apos;s memory.
      </p>
    </div>

    <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
      <p className="">
        <strong>The Magic:</strong> When you see those long hex codes in your terminal output, 
        these functions are what created them! They&apos;re the translators between human language and computer language.
      </p>
    </div>
  </div>
</section>

    
      {/* Prepare Attestation Request Base */}
      <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
  <h2 className="text-2xl font-bold mb-4">Step 3: Send Your Request to Flare</h2>
  
  <div className="prose prose-lg max-w-none">
    <p className="text-gray-700 mb-4">
      <strong>Simple Explanation:</strong> Now that you&apos;ve prepared your &quot;shopping list,&quot; it&apos;s time to send it to Flare&apos;s verification service. This is like giving your detailed order to the restaurant kitchen.
    </p>

    <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
      <p className="">
        <strong>Restaurant Analogy:</strong><br/>
        • <strong>Step 1</strong>: Write your order (Prepare Request)<br/>
        • <strong>Step 2</strong>: Give it to the cashier (Send to Verifier)<br/>
        • <strong>Step 3</strong>: Get order number (ABI Encoded Request)
      </p>
    </div>

    <h3 className="text-xl font-semibold mb-3">What&apos;s Happening Here:</h3>
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <div className="text-2xl mb-2"></div>
        <h4 className="font-semibold  mb-2">Package Your Order</h4>
        <p className="text-sm ">Wrap up your request with all the details</p>
      </div>
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <div className="text-2xl mb-2"></div>
        <h4 className="font-semibold text-yellow-800 mb-2">Send to Kitchen</h4>
        <p className="text-sm text-yellow-700">Post your request to Flare&apos;s verifier</p>
      </div>
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <div className="text-2xl mb-2"></div>
        <h4 className="font-semibold  mb-2">Get Order Number</h4>
        <p className="text-sm ">Receive ABI encoded request for blockchain</p>
      </div>
    </div>

    <h3 className="text-xl font-semibold mb-3">The Main Function: prepareAttestationRequestBase</h3>
    <p className="text-gray-700 mb-4">
      This is the core function that sends your request to Flare. Think of it as the &quot;cashier&quot; who takes your order to the kitchen.
    </p>
  </div>

  <CodeBlock
    language="typescript"
    code={`async function prepareAttestationRequestBase(
  url: string,                    // Where to send the request
  apiKey: string,                 // Your Flare API key (like restaurant membership)
  attestationTypeBase: string,    // "Web2Json" - type of data you want
  sourceIdBase: string,           // "PublicWeb2" - where data comes from  
  requestBody: any,               // Your detailed order from Step 1
) {
  console.log("Url:", url, "\\n");
  
  // Convert text to hex format that blockchain understands
  const attestationType = toUtf8HexString(attestationTypeBase);
  const sourceId = toUtf8HexString(sourceIdBase);

  // Package everything together
  const request = {
    attestationType: attestationType,
    sourceId: sourceId,
    requestBody: requestBody,     // Your Star Wars API instructions
  };
  console.log("Prepared request:\\n", request, "\\n");

  // Send to Flare's verifier
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,        // Your API key for authentication
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request), // Your order in JSON format
  });
  
  // Check if request was accepted
  if (response.status != 200) {
    throw new Error(
      \`Response status is not OK, status \${response.status} \${response.statusText}\\n\`,
    );
  }
  console.log("Response status is OK\\n");

  // Get your "order number" (ABI encoded request)
  return await response.json();
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <h4 className="font-semibold  mb-2">What You See in Terminal:</h4>
    <CodeBlock
      language="text"
      code={`Url: https://web2json-verifier-test.flare.rocks/Web2Json/prepareRequest
Prepared request: { ...your detailed order... }
Response status is OK
Data: { 
  status: 'VALID', 
  abiEncodedRequest: '0x576562324a736f6e00...' 
}`}
    />
    <p className="text-sm  mt-2">
      The <code>abiEncodedRequest</code> is your &quot;order number&quot; - you&apos;ll use this in the next step!
    </p>
  </div>

  <div className="prose prose-lg max-w-none mt-6">
    <h3 className="text-xl font-semibold mb-3">Simple Wrapper Function</h3>
    <p className=" mb-4">
      To make things easier, we create a simple function that handles the Web2JSON-specific details:
    </p>
  </div>

  <CodeBlock
    language="typescript"
    code={`async function prepareAttestationRequest(
  apiUrl: string,           // Star Wars API URL
  postProcessJq: string,    // Which fields to extract
  abiSignature: string,     // How to format the data
) {
  // Package your specific Web2JSON order
  const requestBody = {
    url: apiUrl,
    httpMethod: "GET",
    headers: "{}",
    queryParams: "{}", 
    body: "{}",
    postProcessJq: postProcessJq,
    abiSignature: abiSignature,
  };

  // Send to the right "counter" (Web2Json endpoint)
  const url = \`\${verifierUrlBase}Web2Json/prepareRequest\`;
  const apiKey = VERIFIER_API_KEY_TESTNET;

  // Let the cashier handle the rest
  return await prepareAttestationRequestBase(
    url,
    apiKey,
    "Web2Json",     // Always Web2Json for this type of data
    "PublicWeb2",   // Always PublicWeb2 for public APIs
    requestBody,
  );
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 p-4  rounded-lg    mt-4">
    <h4 className="font-semibold text-yellow-800 mb-2">Why Two Functions?</h4>
    <ul className="text-sm text-yellow-800 space-y-1">
      <li><strong>prepareAttestationRequestBase</strong>: Generic &quot;cashier&quot; that works for all data types</li>
      <li><strong>prepareAttestationRequest</strong>: Specialized for Web2JSON orders specifically</li>
      <li>This separation makes the code cleaner and reusable for different data types</li>
    </ul>
  </div>

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <p className="">
      <strong>Success Check:</strong> When this step works, you&apos;ll see &quot;Response status is OK&quot; and get back an <code>abiEncodedRequest</code>. 
      This means Flare has accepted your order and is ready to process it in the next step!
    </p>
  </div>
</section>

   
     {/* Submit Request to FDC */}
<section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
  <h2 className="text-2xl font-bold mb-4">Step 4: Submit to Blockchain</h2>
  
  <div className="prose prose-lg max-w-none">
    <p className="text-gray-700 mb-4">
      <strong>Simple Explanation:</strong> Now we take our &quot;order number&quot; from Flare and actually submit it to the blockchain. This is like paying for your order and getting a receipt.
    </p>

    <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
      <p className="">
        <strong>Payment Analogy:</strong><br/>
        • <strong>Step 1</strong>: Write order (Prepare Request)<br/>
        • <strong>Step 2</strong>: Give to cashier (Send to Verifier)<br/>
        • <strong>Step 3</strong>: <strong>Pay and get receipt</strong> (Submit to Blockchain)
      </p>
    </div>

    <h3 className="text-xl font-semibold mb-3">What&apos;s Happening in This Step:</h3>
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <div className="text-2xl mb-2"></div>
        <h4 className="font-semibold  mb-2">Pay Gas Fee</h4>
        <p className="text-sm ">Pay transaction fee to use the blockchain</p>
      </div>
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <div className="text-2xl mb-2"></div>
        <h4 className="font-semibold  mb-2">Get Receipt</h4>
        <p className="text-sm ">Transaction hash proves you submitted</p>
      </div>
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <div className="text-2xl mb-2"></div>
        <h4 className="font-semibold  mb-2">Get Wait Time</h4>
        <p className="text-sm ">Round ID tells you how long to wait</p>
      </div>
    </div>
  </div>

  <h3 className="text-xl font-semibold mb-3">The &quot;Helpers&quot; - Flare&apos;s Toolbox</h3>
  <div className="prose prose-lg max-w-none mb-4">
    <p className="text-gray-700 mb-4">
      Flare provides a special &quot;toolbox&quot; contract that helps us interact with their system. Think of it as a universal remote control for all Flare services.
    </p>
  </div>

  <CodeBlock
    language="solidity"
    code={`contract Helpers {
    // These are like different "buttons" on your remote control:
    
    function getFdcHub() public view returns (IFdcHub) {
        return ContractRegistry.getFdcHub();           // "Submit request" button
    }

    function getFdcRequestFeeConfigurations() public view returns (IFdcRequestFeeConfigurations) {
        return ContractRegistry.getFdcRequestFeeConfigurations(); // "Check price" button
    }

    function getFlareSystemsManager() public view returns (IFlareSystemsManager) {
        return ContractRegistry.getFlareSystemsManager();         // "Check time" button
    }

    function getRelay() public view returns (IRelay) {
        return ContractRegistry.getRelay();                       // "Verify completion" button
    }
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <p className="text-yellow-800 text-sm">
      <strong>Why Helpers?</strong> Instead of remembering complicated addresses, we use this &quot;remote control&quot; to easily access all Flare services.
    </p>
  </div>

  <h3 className="text-xl font-semibold mt-8 mb-3">Main Submission Function</h3>
  <div className="prose prose-lg max-w-none mb-4">
    <p className="text-gray-700">
      This is where we actually submit our request to the blockchain and pay the fee.
    </p>
  </div>

  <CodeBlock
    language="typescript"
    code={`async function submitAttestationRequest(abiEncodedRequest: string) {
  // Get the "submit request" button from our remote control
  const fdcHub = await getFdcHub();

  // Check how much this request costs
  const requestFee = await getFdcRequestFee(abiEncodedRequest);

  // Submit to blockchain and pay the fee
  const transaction = await fdcHub.requestAttestation(abiEncodedRequest, {
    value: requestFee,  // Pay the required fee
  });
  console.log("Submitted request:", transaction.tx, "\\n");

  // Find out which "voting round" we're in
  const roundId = await calculateRoundId(transaction);
  console.log(
    \`Check round progress at: https://\${hre.network.name}-systems-explorer.flare.rocks/voting-epoch/\${roundId}?tab=fdc\\n\`,
  );
  return roundId;  // This tells us how long to wait
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <h4 className="font-semibold  mb-2">What You See in Terminal:</h4>
    <CodeBlock
      language="text"
      code={`Submitted request: 0xe9a316fce6bf67210f2f90b2c868baf0a0fb3d9f8bf694bd7193d0645544923d
Block timestamp: 1762603316
First voting round start ts: 1658430000  
Voting epoch duration seconds: 90
Calculated round id: 1157481
Check round progress at: https://coston2-systems-explorer.flare.rocks/voting-round/1157481?tab=fdc`}
    />
  </div>

  <h3 className="text-xl font-semibold mt-8 mb-3">Checking the Fee</h3>
  <CodeBlock
    language="typescript"
    code={`async function getFdcRequestFee(abiEncodedRequest: string) {
  // Use the "check price" button from our remote control
  const helpers = await getHelpers();
  const feeConfigAddress = await helpers.getFdcRequestFeeConfigurations();
  const feeConfig = await FdcRequestFeeConfigurations.at(feeConfigAddress);
  
  // Ask "How much does this request cost?"
  return await feeConfig.getRequestFee(abiEncodedRequest);
}`}
  />

  <h3 className="text-xl font-semibold mt-8 mb-3">Calculating Wait Time (Round ID)</h3>
  <div className="prose prose-lg max-w-none mb-4">
    <p className="text-gray-700">
      Flare processes requests in &quot;voting rounds&quot; that happen every 90 seconds. We need to figure out which round our request is in.
    </p>
  </div>

  <CodeBlock
    language="typescript"
    code={`async function calculateRoundId(transaction: any) {
  // Check when our transaction happened
  const blockNumber = transaction.receipt.blockNumber;
  const block = await ethers.provider.getBlock(blockNumber);
  const blockTimestamp = BigInt(block!.timestamp);

  // Use the "check time" button from our remote control
  const flareSystemsManager = await getFlareSystemsManager();
  const firstRoundStart = BigInt(await flareSystemsManager.firstVotingRoundStartTs());
  const roundDuration = BigInt(await flareSystemsManager.votingEpochDurationSeconds());

  // Calculate: (Current time - First round time) ÷ 90 seconds
  const roundId = Number(
    (blockTimestamp - firstRoundStart) / roundDuration
  );
  
  console.log("Calculated round id:", roundId, "\\n");
  return roundId;  // This is like getting your "batch number"
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-6">
    <h4 className="font-semibold  mb-2">Real Example from Your Terminal:</h4>
    <ul className="text-sm  space-y-1">
      <li>• <strong>Transaction Time</strong>: 1762603316 (when you submitted)</li>
      <li>• <strong>First Round Ever</strong>: 1658430000 (when Flare system started)</li>
      <li>• <strong>Round Duration</strong>: 90 seconds (each voting period)</li>
      <li>• <strong>Calculation</strong>: (1762603316 - 1658430000) ÷ 90 = <strong>1157481</strong></li>
      <li>• <strong>Meaning</strong>: Your request is in voting round #1,157,481</li>
    </ul>
  </div>

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <p className="">
      <strong>Success Check:</strong> When this step works, you&apos;ll see a transaction hash and round ID. 
      This means your request is officially on the blockchain and waiting to be processed by Flare&apos;s network!
      The script will now automatically wait for the voting round to complete.
    </p>
  </div>
</section>

     
      {/* Use the Data */}
      <section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
  <h2 className="text-2xl font-bold mb-4">Step 5: Use the Verified Data</h2>
  
  <div className="prose prose-lg max-w-none">
    <p className="text-gray-700 mb-4">
      <strong>Simple Explanation:</strong> This is the final step where we actually use the verified Star Wars data in our smart contract. Think of it as receiving your verified package and storing it safely.
    </p>

    <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
      <p className="">
        <strong>Package Delivery Analogy:</strong><br/>
        • <strong>Step 1-4</strong>: Order, pay, wait for delivery, verify package<br/>
        • <strong>Step 5</strong>: <strong>Open package and use the contents</strong>
      </p>
    </div>

    <h3 className="text-xl font-semibold mb-3">What We&apos;re Building:</h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <h4 className="font-semibold  mb-2">Digital Collection</h4>
        <p className="text-sm ">A smart contract that stores verified Star Wars character data</p>
      </div>
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <h4 className="font-semibold  mb-2">Trusted Data</h4>
        <p className="text-sm ">Only accepts data verified by Flare&apos;s network</p>
      </div>
    </div>
  </div>

  <h3 className="text-xl font-semibold mb-3">Data Structures - Our &quot;Storage Boxes&quot;</h3>
  <p className="text-gray-700 mb-4">First, we define what data we want to store:</p>

  <CodeBlock
    language="solidity"
    code={`// What we store in our collection
struct StarWarsCharacter {
    string name;           // Character name (R2-D2)
    uint256 numberOfMovies; // How many films they appeared in
    uint256 apiUid;        // Unique ID from Star Wars API  
    uint256 bmi;           // Calculated BMI (Body Mass Index)
}

// How data arrives from Flare (temporary package)
struct DataTransportObject {
    string name;           // Name from API
    uint256 height;        // Height in cm
    uint256 mass;          // Weight in kg
    uint256 numberOfMovies; // Film count
    uint256 apiUid;        // API ID number
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <h4 className="font-semibold text-yellow-800 mb-2">BMI Calculation:</h4>
    <p className="text-sm text-yellow-800">
      We calculate BMI from the verified height and mass: <code>(mass * 100 * 100) / (height * height)</code><br/>
      This shows how you can <strong>derive new information</strong> from verified data!
    </p>
  </div>

  <h3 className="text-xl font-semibold mt-8 mb-3">The Main Contract - Our &quot;Collection Store&quot;</h3>
  <div className="prose prose-lg max-w-none mb-4">
    <p className="text-gray-700">
      This smart contract acts like a digital collection that only accepts verified Star Wars character data.
    </p>
  </div>

  <CodeBlock
    language="solidity"
    code={`contract StarWarsCharacterList {
    // Our collection storage
    mapping(uint256 => StarWarsCharacter) public characters;  // Store by ID
    uint256[] public characterIds;                           // List of all IDs

    // STEP 1: Verify the data is authentic
    function isWeb2JsonProofValid(IWeb2Json.Proof calldata _proof) 
        private view returns (bool) 
    {
        // Ask Flare: "Is this data legit?"
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }

    // STEP 2: Add a new character to our collection
    function addCharacter(IWeb2Json.Proof calldata data) public {
        // First, verify the proof is valid
        require(isWeb2JsonProofValid(data), "Invalid proof");
        // ↑ If proof is fake, STOP everything!

        // STEP 3: Unpack the verified data
        DataTransportObject memory dto = abi.decode(
            data.data.responseBody.abi_encoded_data,
            (DataTransportObject)
        );
        // ↑ This extracts: name, height, mass, film count, ID

        // STEP 4: Check if we already have this character
        require(characters[dto.apiUid].apiUid == 0, "Character already exists");

        // STEP 5: Calculate BMI from verified height & mass
        uint256 bmi = (dto.mass * 100 * 100) / (dto.height * dto.height);

        // STEP 6: Create our character record
        StarWarsCharacter memory character = StarWarsCharacter({
            name: dto.name,
            numberOfMovies: dto.numberOfFilms,
            apiUid: dto.apiUid,
            bmi: bmi  // Our calculated value!
        });

        // STEP 7: Store in our collection
        characters[dto.apiUid] = character;
        characterIds.push(dto.apiUid);
    }

    // STEP 8: View all characters in our collection
    function getAllCharacters() public view returns (StarWarsCharacter[] memory) {
        StarWarsCharacter[] memory result = new StarWarsCharacter[](characterIds.length);
        
        // Get each character by their ID
        for (uint256 i = 0; i < characterIds.length; i++) {
            result[i] = characters[characterIds[i]];
        }
        
        return result;  // Returns array of all characters
    }
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <h4 className="font-semibold  mb-2">Real Example - R2-D2 Data:</h4>
    <CodeBlock
      language="json"
      code={`// What Flare delivers (DataTransportObject):
{
  "name": "R2-D2",
  "height": 96,        // 96 cm
  "mass": 32,          // 32 kg  
  "numberOfFilms": 7,
  "apiUid": 3
}

// What we store (StarWarsCharacter):
{
  "name": "R2-D2",
  "numberOfMovies": 7,
  "apiUid": 3,
  "bmi": 3472          // (32 * 100 * 100) / (96 * 96)
}`}
    />
  </div>

  <h3 className="text-xl font-semibold mt-8 mb-3">Security Features</h3>
  <div className="grid md:grid-cols-2 gap-4 mb-6">
    <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
      <h4 className="font-semibold  mb-2">Proof Verification</h4>
      <p className="text-sm ">Rejects any data not verified by Flare network</p>
    </div>
    <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
      <h4 className="font-semibold  mb-2">Duplicate Protection</h4>
      <p className="text-sm ">Prevents adding the same character twice</p>
    </div>
  </div>

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-6">
    <h4 className="font-semibold  mb-2">The Magic Happens Here:</h4>
    <ol className="text-sm  space-y-2">
      <li><strong>1. Trust</strong>: Flare verifies the Star Wars data is authentic</li>
      <li><strong>2. Calculation</strong>: We derive new information (BMI) from trusted data</li>
      <li><strong>3. Storage</strong>: Store permanently on blockchain</li>
      <li><strong>4. Access</strong>: Anyone can view but only add verified data</li>
    </ol>
    <p className=" mt-2">
      This demonstrates how Web2JSON lets you build applications that <strong>trustlessly use real-world data</strong> on the blockchain!
    </p>
  </div>
</section>

    {/* Verify Proof */}
<section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
  <h2 className="text-2xl font-bold mb-4">Step 6: Verify the Proof</h2>
  
  <div className="prose prose-lg max-w-none">
    <p className="text-gray-700 mb-4">
      <strong>Simple Explanation:</strong> This is where Flare proves that the data you received is authentic and hasn&apos;t been tampered with. Think of it like checking the security seal on your delivered package.
    </p>

    <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
      <p className="">
        <strong>Package Security Analogy:</strong><br/>
        • <strong>Regular delivery</strong>: Package arrives, you trust it&apos;s correct<br/>
        • <strong>Flare delivery</strong>: Package arrives with <strong>crypto-proof</strong> that it&apos;s authentic
      </p>
    </div>

    <h3 className="text-xl font-semibold mb-3">How Flare&apos;s Proof System Works:</h3>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <h4 className="font-semibold  mb-2">Merkle Trees</h4>
        <p className="text-sm ">Like a family tree for data - each piece connects to prove authenticity</p>
      </div>
      <div className="bg-[#ffe4e8] text-yellow-800 p-4 rounded-lg">
        <h4 className="font-semibold  mb-2">Gas Optimization</h4>
        <p className="text-sm ">Store proofs on-chain, keep data off-chain to save costs</p>
      </div>
    </div>

    <h3 className="text-xl font-semibold mb-3">The Verification Process:</h3>
    <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
      <li><strong>Flare network</strong> fetches and processes the Star Wars data</li>
      <li><strong>Creates cryptographic proof</strong> that this data is authentic</li>
      <li><strong>Stores proof on-chain</strong> (cheap) but keeps data off-chain (expensive)</li>
      <li><strong>Your contract verifies</strong> the proof matches Flare&apos;s records</li>
    </ol>
  </div>

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mb-6">
    <h4 className="font-semibold text-yellow-800 mb-2">Why This Matters:</h4>
    <ul className="text-sm text-yellow-800 space-y-1">
      <li>• <strong>Prevents fake data</strong>: No one can submit made-up Star Wars characters</li>
      <li>• <strong>Saves money</strong>: Storing proofs is much cheaper than storing full data</li>
      <li>• <strong>Maintains trust</strong>: Anyone can verify the data came from the real API</li>
    </ul>
  </div>

  <h3 className="text-xl font-semibold mb-3">Deploying Our Collection Contract</h3>
  <CodeBlock
    language="typescript"
    code={`async function deployAndVerifyContract() {
  const args: any[] = [];
  
  // Deploy our Star Wars collection contract
  const characterList = await StarWarsCharacterList.new(...args);
  
  try {
    // Verify contract on block explorer (optional)
    await run("verify:verify", {
      address: characterList.address,
      constructorArguments: args,
    });
  } catch (e: any) {
    console.log(e);  // If verification fails, just continue
  }
  
  console.log("StarWarsCharacterList deployed to", characterList.address, "\\n");
  return characterList;
}`}
  />
</section>

{/* Interact with Contract */}
<section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
  <h2 className="text-2xl font-bold mb-4">Step 7: Add R2-D2 to Your Collection</h2>
  
  <div className="prose prose-lg max-w-none">
    <p className="text-gray-700 mb-4">
      <strong>Simple Explanation:</strong> This is the final step where we take the verified R2-D2 data and add it to our blockchain collection. Think of it as placing your authenticated collectible in your display case.
    </p>
  </div>

  <CodeBlock
    language="typescript"
    code={`async function interactWithContract(
  characterList: StarWarsCharacterListInstance,
  proof: any,
) {
  console.log("Proof hex:", proof.response_hex, "\\n");

  //  STEP 1: Understand the data structure from Flare
  const IWeb2JsonVerification = await artifacts.require("IWeb2JsonVerification");
  const responseType = IWeb2JsonVerification._json.abi[0].inputs[0].components[1];
  console.log("Response type:", responseType, "\\n");

  // STEP 2: Unpack the verified data
  const decodedResponse = web3.eth.abi.decodeParameter(responseType, proof.response_hex);
  console.log("Decoded proof:", decodedResponse, "\\n");
  
  //  STEP 3: Add R2-D2 to our collection
  const transaction = await characterList.addCharacter({
    merkleProof: proof.proof,    // The crypto-proof from Flare
    data: decodedResponse,       // The actual R2-D2 data
  });
  
  console.log("Transaction:", transaction.tx, "\\n");
  
  //  STEP 4: Display our complete collection
  console.log("Star Wars Characters:\\n", await characterList.getAllCharacters(), "\\n");
}`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-4">
    <h4 className="font-semibold  mb-2">What You&apos;ll See in Terminal:</h4>
    <CodeBlock
      language="text"
      code={`Proof hex: 0x...long_hex_string...
Response type: {components: [...], name: "task", type: "tuple"}
Decoded proof: {
  name: "R2-D2",
  height: 96,
  mass: 32,
  numberOfFilms: 7,
  uid: 3
}
Transaction: 0xabcd...1234
Star Wars Characters:
[
  {
    name: "R2-D2",
    numberOfMovies: 7,
    apiUid: 3,
    bmi: 3472
  }
]`}
    />
  </div>

  <div className="prose prose-lg max-w-none mt-6">
    <p className="text-gray-700">
      Run the complete workflow with this command:
    </p>
  </div>

  <CodeBlock
    language="bash"
    code={`npx hardhat run scripts/fdcExample/Web2Json.ts --network coston2`}
  />

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-6">
    <p className="">
      <strong>Complete Workflow Summary:</strong> You&apos;ve now gone from requesting Star Wars data to having verified R2-D2 information stored permanently on the blockchain! This demonstrates the full power of Web2JSON for bringing real-world data to your smart contracts.
    </p>
  </div>
</section>

{/* Error Handling & Troubleshooting */}
<section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
  <h2 className="text-2xl font-bold mb-4">Common Issues & Solutions</h2>

  <div className="space-y-4">
    <div className="border border-[#ffe4e8] rounded-lg p-4">
      <h3 className="font-semibold text-red-800 mb-2">❌ &quot;Cannot find module&quot; errors</h3>
      <CodeBlock
        language="bash"
        code={`Error: Cannot find module '@flarenetwork/flare-periphery-contracts'`}
      />
      <p className="text-sm text-gray-600 mt-2">
        <strong>Solution:</strong> Run <code>npm install</code> in the project root directory.
      </p>
    </div>
    
    <div className="border border-[#ffe4e8] rounded-lg p-4">
      <h3 className="font-semibold text-red-800 mb-2">❌ &quot;Insufficient funds&quot; error</h3>
      <CodeBlock
        language="text"
        code={`Error: insufficient funds for gas * price + value`}
      />
      <p className="text-sm text-gray-600 mt-2">
        <strong>Solution:</strong> Get testnet FLR from <a href="https://faucet.flare.network/" className="text-blue-600 underline">Flare Faucet</a>.
      </p>
    </div>

    <div className="border border-[#ffe4e8] rounded-lg p-4">
      <h3 className="font-semibold text-red-800 mb-2">❌ &quot;Response status is not OK&quot; from verifier</h3>
      <CodeBlock
        language="text"
        code={`Error: Response status is not OK, status 401 Unauthorized`}
      />
      <p className="text-sm text-gray-600 mt-2">
        <strong>Solution:</strong> Check your <code>VERIFIER_API_KEY_TESTNET</code> in .env file.
      </p>
    </div>

    <div className="border border-[#ffe4e8] rounded-lg p-4">
      <h3 className="font-semibold text-yellow-800 mb-2">Script hangs at &quot;Waiting for round to finalize&quot;</h3>
      <p className="text-sm text-gray-600">
        <strong>This is normal!</strong> The Flare network takes 1-3 minutes to verify data. The script will continue automatically once the round finalizes.
      </p>
    </div>
  </div>
</section>

{/* Customization Examples */}
<section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm mb-8">
  <h2 className="text-2xl font-bold mb-4">Build Your Own Data Feeds</h2>

  <div className="prose prose-lg max-w-none mb-6">
    <p className="text-gray-700">
      Now that you understand Web2JSON, you can fetch data from ANY public API! Here are some examples:
    </p>
  </div>

  <h3 className="text-lg font-semibold mb-3">Crypto Price Feed</h3>
  <CodeBlock
    language="typescript"
    code={`// Fetch Bitcoin price from CoinGecko
const apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
const postProcessJq = \`{ price: .bitcoin.usd }\`;
const abiSignature = \`{"components":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"task","type":"tuple"}\`;

// Your contract can now use verified Bitcoin price for DeFi applications!`}
  />

  <h3 className="text-lg font-semibold mt-6 mb-3">Weather Data</h3>
  <CodeBlock
    language="typescript"
    code={`// Fetch current temperature for New York
const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current=temperature_2m";
const postProcessJq = \`{ temperature: .current.temperature_2m }\`;
const abiSignature = \`{"components":[{"internalType":"uint256","name":"temperature","type":"uint256"}],"name":"task","type":"tuple"}\`;

// Create weather-based insurance or event contracts!`}
  />

  <h3 className="text-lg font-semibold mt-6 mb-3">Sports Scores</h3>
  <CodeBlock
    language="typescript"
    code={`// Fetch football match results
const apiUrl = "https://api.football-data.org/v4/matches";
const postProcessJq = \`{ totalMatches: .resultSet.count }\`;
const abiSignature = \`{"components":[{"internalType":"uint256","name":"totalMatches","type":"uint256"}],"name":"task","type":"tuple"}\`;

// Build prediction markets or fantasy sports!`}
  />

  <div className="bg-[#ffe4e8] text-yellow-8000 rounded-lg p-4 mt-4">
    <p className="">
      <strong>Endless Possibilities:</strong> Stock prices, election results, random numbers, flight prices, real estate data - 
      any public API can become a trusted data source for your blockchain applications!
    </p>
  </div>
</section>

{/* Final Checklist */}
<section className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm pb-8">
  <h2 className="text-2xl font-bold mb-4">Ready to Launch Checklist</h2>

  <div className="space-y-3">
    <div className="flex items-center">
      <div className="w-6 h-6 bg-[#e93b6c] rounded-full flex items-center justify-center mr-3">
        <span className="text-white text-sm">1</span>
      </div>
      <span>Cloned flare-hardhat-starter repository</span>
    </div>
    <div className="flex items-center">
      <div className="w-6 h-6 bg-[#e93b6c] rounded-full flex items-center justify-center mr-3">
        <span className="text-white text-sm">2</span>
      </div>
      <span>Ran <code>npm install</code> successfully</span>
    </div>
    <div className="flex items-center">
      <div className="w-6 h-6 bg-[#e93b6c] rounded-full flex items-center justify-center mr-3">
        <span className="text-white text-sm">3</span>
      </div>
      <span>Created <code>.env</code> file with all required variables</span>
    </div>
    <div className="flex items-center">
      <div className="w-6 h-6 bg-[#e93b6c] rounded-full flex items-center justify-center mr-3">
        <span className="text-white text-sm">4</span>
      </div>
      <span>Got testnet FLR from faucet for gas fees</span>
    </div>
    <div className="flex items-center">
      <div className="w-6 h-6 bg-[#e93b6c] rounded-full flex items-center justify-center mr-3">
        <span className="text-white text-sm">5</span>
      </div>
      <span>Compiled contracts with <code>npx hardhat compile</code></span>
    </div>
    <div className="flex items-center">
      
      <span className="font-semibold">Ready to run: <code>npx hardhat run scripts/fdcExample/Web2Json.ts --network coston2</code></span>
    </div>
  </div>

  <div className="bg-[#ffe4e8] text-yellow-800 rounded-lg p-4 mt-6">
    <p className="">
      <strong>Congratulations! You&apos;re now a Web2JSON expert!</strong> You&apos;ve learned how to bring real-world data to the blockchain trustlessly. 
      This powerful skill opens up endless possibilities for building applications that interact with the real world while maintaining blockchain security and transparency.
    </p>
  </div>
</section>
   </div>

    </div>
  )
}