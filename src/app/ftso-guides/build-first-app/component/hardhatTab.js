"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Screenshot } from "./screenshot"
import { CodeBlock } from "./code-block"

export default function HardHatTab() {
  

  return (
    <div className="">
     
        <div>
          {/* Step 1: Setup */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
  {/* First Time Setup */}
  <motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="mb-12"
>
  <h2 className="md:text-3xl text-2xl font-bold text-gray-900 mb-6">Before You Start: First Time Setup</h2>
  
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
    <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important: Do this only if you&apos;re new to Hardhat</h3>
    <p className="text-yellow-800">
      If you&apos;ve never used Hardhat before, complete these steps first.
    </p>
  </div>

  <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200">
    <h3 className="text-2xl font-semibold mb-4">1. Install Node.js</h3>
    <CodeBlock
      code={`# Check if Node.js is already installed
node --version

# If not installed, download from nodejs.org
# Or use a package manager like:
# Windows: chocolatey install nodejs
# Mac: brew install node`}
      language="bash"
    />
    
    <div className="mt-4 p-4 bg-[#ffe4e8] rounded-lg">
      <p className="text-yellow-800 ">
        Node.js is the environment that runs JavaScript code on your computer. You need version v22.21.1 to work with Hardhat.
      </p>
    </div>

    <Screenshot 
      src="/f1.png" 
      alt="Terminal showing node --version command"
    />
  </div>

  <div className="bg-[#fff1f3] px-4 md:p-6 rounded-lg border border-gray-200 mt-6">
    <h3 className="text-2xl font-semibold mb-4">2. Install Hardhat Globally</h3>
    <CodeBlock
      code={`# Install Hardhat globally on your computer
npm install -g hardhat

# Verify installation
npx hardhat --version`}
      language="bash"
    />
    
    <div className="mt-4 p-4 bg-[#ffe4e8] rounded-lg">
      <p className="text-yellow-800 ">
        This installs Hardhat so you can use it in any project. The <code>-g</code> flag means &ldquo;globally&ldquo; - available everywhere on your computer.
      </p>
    </div>

    <Screenshot 
      src="/f2.png" 
      alt="Terminal showing successful Hardhat installation"
    />
  </div>


  <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200 mt-6">
    <h3 className="text-2xl font-semibold mb-4">4. Get Testnet Tokens</h3>
    <CodeBlock
      code={`# Visit the Coston2 faucet to get test tokens:
# https://faucet.flare.network/

# You'll need testnet FLR for deployment gas fees`}
      language="bash"
    />
    
    <div className="mt-4 p-4 bg-[#ffe4e8] rounded-lg">
      <p className="text-yellow-800 ">
        Testnet tokens are free cryptocurrency used for testing. You need them to pay for transaction fees when deploying contracts.
        They have no real value and are only for practice.
      </p>
    </div>
  </div>
</motion.section>


            <div className="flex items-center mb-6">
              <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">1</div>
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Get the Starter Kit</h2>
            </div>
            
            <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
              <p className="text-yellow-800 mb-4">
                Instead of building everything from scratch, we&apos;ll use Flare&apos;s pre-built starter template:
              </p>
              
              <CodeBlock
                code={`# Download the Flare starter project
git clone https://github.com/flare-foundation/flare-hardhat-starter.git

# Move into the project folder
cd flare-hardhat-starter

# Install all the required tools
yarn install`}
                language="bash"
              />
              
              <div className="mt-4 p-4 bg-[#ffe4e8]  text-yellow-800 rounded-lg ">
                <h4 className="font-semibold text-md mb-2 ">What&apos;s happening here?</h4>
                <p className="">
                  This downloads a project that already has Hardhat, TypeScript, and all the Flare-specific tools configured. 
                  It&apos;s like getting a pre-built kitchen instead of buying each appliance separately.
                </p>
              </div>

              <Screenshot 
                src="/f3.png" 
                alt="My terminal showing the project cloning successfully"
                caption="This is what you should see when the setup completes"
              />
            </div>
          </motion.section>

          <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200 mt-6">
    <h3 className="text-2xl font-semibold mb-4">3. Set Up Environment File</h3>
    <CodeBlock
      code={`# Create environment file
cp .env.example .env

# Open the file in your text editor
# Add your private key and RPC URL`}
      language="bash"
    />
    
    <div className="mt-4 p-4 bg-red-100 rounded-lg">
      <h4 className="font-semibold mb-2 text-red-900">🚨 Security Warning</h4>
      <p className="text-red-800">
        Never share your private keys. Never put private keys in source code. Never commit private keys to Git.
        The .env file is automatically ignored by Git to keep your keys safe.
      </p>
    </div>

    <div className="mt-4 p-4  rounded-lg">
      <p className="text-gray-800">
        Your .env file should look like this (use your own values):
      </p>
      <CodeBlock
        code={`PRIVATE_KEY=your_private_key_here
COSTON2_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
FLARE_RPC_URL=https://flare-api.flare.network/ext/C/rpc`}
        language="bash"
      />
<div>
    <p> If you do not have a private key visit
        <a className="text-blue-600 underline" href='https://dev.flare.network/network/getting-started'> Get Started in flare docs </a></p>
    
</div>

    </div>
  </div>




          {/* Step 2: Configure Hardhat */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-12"
          >
            <div className="flex items-center mt-6 mb-6">
              <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">2</div>
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Configure Your Compiler</h2>
            </div>
            
            <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
              <p className="text-yellow-800 mb-4">
                Update your <code>hardhat.config.ts</code> file to use the Shanghai EVM version:
              </p>
              
              <CodeBlock
                code={`module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};`}
                language="javascript"
              />
              
              <div className="mt-4 p-4 bg-[#ffe4e8] rounded-lg ">
                <h4 className="font-semibold mb-2 text-gray-700">Why this configuration matters</h4>
                <p className="text-yellow-800">
                  The Shanghai EVM version includes the latest Ethereum features and optimizations. 
                  The optimizer makes your contract smaller and cheaper to deploy by simplifying the code.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Step 3: Understanding the Contract */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">3</div>
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Create Your Price Reader Contract</h2>
            </div>
            
            <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
              <p className="text-yellow-800 mb-4">
                Create a new file at <code>contracts/FTSOV2Consumer.sol</code> and let&apos;s build it piece by piece:
              </p>

              {/* Contract Breakdown */}
              <div className="space-y-6">
                {/* Part 1: Imports */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 ">Import the Tools</h4>
                  <CodeBlock
                    code={`import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";`}
                    language="solidity"
                  />
                  <div className="mt-2 p-3 bg-[#ffe4e8] rounded-lg">
                    <p className="text-yellow-800 ">
                      These are like importing libraries in other languages. They give us pre-built functions to talk to FTSOv2.
                    </p>
                  </div>
                </div>

                {/* Part 2: Feed IDs */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 ">Define Which Prices We Want</h4>
                  <CodeBlock
                    code={`bytes21 public constant flrUsdId = 0x01464c522f55534400000000000000000000000000; // FLR/USD

bytes21[] public feedIds = [
    bytes21(0x01464c522f55534400000000000000000000000000), // FLR/USD
    bytes21(0x014254432f55534400000000000000000000000000), // BTC/USD  
    bytes21(0x014554482f55534400000000000000000000000000)  // ETH/USD
];`}
                    language="solidity"
                  />
                  <div className="mt-2 p-3 bg-[#ffe4e8] rounded-lg">
                    <p className="text-yellow-800 ">
                      These special codes are like product IDs for each price feed. Each cryptocurrency pair has its own unique ID.
                    </p>
                  </div>
                </div>

                {/* Part 3: Main Function */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 ">The Magic Function</h4>
                  <CodeBlock
                    code={`function getFlrUsdPrice() external view returns (uint256, int8, uint64) {
    TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
    return ftsoV2.getFeedById(flrUsdId);
}`}
                    language="solidity"
                  />
                  <div className="mt-2 p-3 bg-[#ffe4e8] rounded-lg">
                    <p className="text-yellow-800">
                      This function does three things: 
                      1. Connects to FTSOv2, 2. Asks for the FLR/USD price, 3. Returns the price, decimal places, and timestamp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Complete Contract */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Complete Contract</h4>
                <CodeBlock
                  code={`// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";

contract FtsoV2Consumer {
    bytes21 public constant flrUsdId = 0x01464c522f55534400000000000000000000000000;
    
    bytes21[] public feedIds = [
        bytes21(0x01464c522f55534400000000000000000000000000), // FLR/USD
        bytes21(0x014254432f55534400000000000000000000000000), // BTC/USD
        bytes21(0x014554482f55534400000000000000000000000000)  // ETH/USD
    ];

    function getFlrUsdPrice() external view returns (uint256, int8, uint64) {
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        return ftsoV2.getFeedById(flrUsdId);
    }
    
    function getMultiplePrices() external view returns (uint256[] memory, int8[] memory, uint64) {
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        return ftsoV2.getFeedsById(feedIds);
    }
}`}
                  language="solidity"
                />
              </div>
            </div>
          </motion.section>

          {/* Step 4: Compile */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">4</div>
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Compile Your Contract</h2>
            </div>
            
            <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <CodeBlock
                code={`npx hardhat compile`}
                language="bash"
              />
              
              <div className="mt-4 p-4 bg-[#ffe4e8] rounded-lg border ">
                <h4 className="font-semibold mb-2 text-yellow-900"> What is compiling?</h4>
                <p className="text-yellow-800">
                  Compiling converts your human-readable Solidity code into bytecode that the blockchain can understand. 
                  It&apos;s like translating a recipe into instructions a robot chef can follow.
                </p>
              </div>

              <Screenshot 
                src="/f4.png" 
                alt="My terminal showing successful compilation"
                caption="You'll see this when your contract compiles without errors"
              />
            </div>
          </motion.section>

          
          {/* Step 5: Test */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">5</div>
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Test It Works</h2>
            </div>
            
            <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-700 mb-4">
                Let&apos;s create a simple test to make sure our contract actually returns price data:  test/price.test.js file
              </p>
              
              <CodeBlock
                code={`
import { expect } from "chai";
import { ethers } from "hardhat";

describe("FtsoV2Consumer", function () {
  let ftsoV2Consumer: any;

  beforeEach(async function () {
    const FtsoV2ConsumerFactory = await ethers.getContractFactory("FtsoV2Consumer");
    ftsoV2Consumer = await FtsoV2ConsumerFactory.deploy();
    await ftsoV2Consumer.waitForDeployment();
  });

  it("Should return the FLR/USD price, decimals, and timestamp", async function () {
    const result = await ftsoV2Consumer.getFlrUsdPrice();

    console.log("\n=== getFlrUsdPrice ===");
    console.log("Price:", result[0].toString());
    console.log("Decimals:", result[1].toString());
    console.log("Timestamp:", result[2].toString());

    expect(result[0]).to.be.a("bigint");
    expect(result[0]).to.be.gt(0);
    expect(result[1]).to.be.a("bigint");
    expect(result[2]).to.be.a("bigint");
    expect(result[2]).to.be.gt(0);
  });

  it("Should return the FLR/USD price in Wei and timestamp", async function () {
    const result = await ftsoV2Consumer.getFlrUsdPriceWei();

    console.log("\n=== getFlrUsdPriceWei ===");
    console.log("Price in Wei:", result[0].toString());
    console.log("Timestamp:", result[1].toString());

    expect(result[0]).to.be.a("bigint");
    expect(result[0]).to.be.gt(0);
    expect(result[1]).to.be.a("bigint");
    expect(result[1]).to.be.gt(0);
  });

  it("Should return current feed values for multiple feeds", async function () {
    const result = await ftsoV2Consumer.getFtsoV2CurrentFeedValues();

    console.log("\n=== getFtsoV2CurrentFeedValues ===");
    console.log("Feed Values:", result[0].map((v: bigint) => v.toString()));
    console.log("Decimals:", result[1].map((d: bigint) => d.toString()));
    console.log("Timestamp:", result[2].toString());

    expect(result[0]).to.be.an("array");
    expect(result[0]).to.have.lengthOf(3);
    expect(result[1]).to.be.an("array");
    expect(result[1]).to.have.lengthOf(3);
    expect(result[2]).to.be.a("bigint");
    expect(result[2]).to.be.gt(0);
  });

  it("Should have the correct constant flrUsdId", async function () {
    const flrUsdId = await ftsoV2Consumer.flrUsdId();

    console.log("\n=== flrUsdId ===");
    console.log("FLR/USD ID:", flrUsdId);

    expect(flrUsdId).to.equal("0x01464c522f55534400000000000000000000000000");
  });

  it("Should have the correct initial feedIds array", async function () {
    const feedId1 = await ftsoV2Consumer.feedIds(0);
    const feedId2 = await ftsoV2Consumer.feedIds(1);
    const feedId3 = await ftsoV2Consumer.feedIds(2);

    console.log("\n=== feedIds ===");
    console.log("Feed 1:", feedId1);
    console.log("Feed 2:", feedId2);
    console.log("Feed 3:", feedId3);

    expect(feedId1).to.equal("0x01464c522f55534400000000000000000000000000");
    expect(feedId2).to.equal("0x014254432f55534400000000000000000000000000");
    expect(feedId3).to.equal("0x014554482f55534400000000000000000000000000");
  });
});`}
                language="javascript"
              />
              
              <div className="mt-4 p-4 text-yellow-800 bg-[#ffe4e8] rounded-lg ">
               <div>
                <p>Lines 1-2: Import testing framework (Chai) and Hardhat Ethereum library </p>
                <p>Lines 4-5: Define test suite for the FtsoV2Consumer contract </p>
                <p>Lines 6-10: Before each test, deploy a fresh contract instance to ensure test isolation </p>
                <p>Lines 12-24: Test that retrieves FLR/USD price data and validates the return types and values </p>
                <p>Lines 26-36: Test that gets price in Wei format and verifies the data structure </p>
                <p> Lines 38-50: Test that fetches multiple price feeds simultaneously and checks array structures</p>
                <p>Lines 52-59: Test that verifies the constant FTSO identifier matches expected format </p>
                <p>Lines 61-72: Test that confirms the feed IDs array contains the correct predefined values</p>

               </div>

                <h4 className="font-semibold mb-2 pt-3"> Why testing matters</h4>
                <p className="">
                  Tests let you verify your contract works before spending real money to deploy it. 
                  They&apos;re like test-driving a car before buying it.
                </p>
              </div>

              <CodeBlock
                code={`npx hardhat test --network coston2`}
                language="bash"
              />

              <Screenshot 
                src="/f5.png" 
                alt="My terminal showing all tests passing with actual price data"
                caption="Your tests should show real price data from the Flare network"
              />
            </div>
          </motion.section>


         {/* Step 6: */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.45 }}
  className="mb-12"
>
  <div className="flex items-center mb-6">
    <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">5</div>
    <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Create Deployment Script</h2>
  </div>
  
  <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
    <p className="text-gray-700 mb-4">
      Create a file called <code>scripts/deployFTSOConsumer.ts</code> with this simple deployment script:
    </p>
    
    <CodeBlock
      code={`import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying and Testing FtsoV2Consumer...");

  const [deployer] = await ethers.getSigners();
  console.log("📧 Deployer:", deployer.address);

  // Deploy contract
  const FtsoV2ConsumerFactory = await ethers.getContractFactory("FtsoV2Consumer");
  const contract = await FtsoV2ConsumerFactory.deploy();
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log("✅ Contract deployed to:", address);

  console.log("\n🔍 Testing Contract Functions...");

  const [price, decimals, timestamp] = await contract.getFlrUsdPrice();
  const [priceWei, timestampWei] = await contract.getFlrUsdPriceWei();
  const [feedValues, decimalsArray, feedTimestamp] = await contract.getFtsoV2CurrentFeedValues();
  const flrUsdId = await contract.flrUsdId();
  const feedId1 = await contract.feedIds(0);
  const feedId2 = await contract.feedIds(1);
  const feedId3 = await contract.feedIds(2);
}

main().catch(console.error);`}
      language="javascript"
    />

    <div className="mt-4 p-4 bg-[#ffe4e8]  rounded-lg text-yellow-800">
      <div>
        <p>Lines 1-2: Import Hardhat Ethereum library for deployment and interaction</p>
        <p>Lines 4-6: Define the async <code>main</code> function that will run the deployment</p>
        <p>Line 8: Log that deployment is starting</p>
        <p>Lines 10-11: Grab the deployer wallet and log the address</p>
        <p>Lines 13-16: Deploy the <code>FtsoV2Consumer</code> contract and wait until deployment is confirmed</p>
        <p>Line 18: Get and log the deployed contract address</p>
        <p>Line 20: Begin testing contract functions immediately after deployment</p>
        <p>Lines 22-27: Call <code>getFlrUsdPrice</code>, <code>getFlrUsdPriceWei</code>, and <code>getFtsoV2CurrentFeedValues</code> to log their outputs</p>
        <p>Lines 28-32: Check constant variables like <code>flrUsdId</code> and the <code>feedIds</code> array</p>
        <p>Line 34: Catch and log any errors that occur during deployment</p>
      </div>

      <h4 className="font-semibold mb-2"> Why this deployment matters</h4>
      <p className="">
        This script deploys your contract to the blockchain and verifies its core functions immediately. 
        It&apos;s like sending your code to Flare and opening it right away to make sure everything works.
      </p>
    </div>
  </div>
</motion.section>


          

          {/* Step 7: Deploy */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">7</div>
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Deploy to Testnet</h2>
            </div>
            
            <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <CodeBlock
                code={`npx hardhat run scripts/deployFTSOConsumer.ts --network coston2`}
                language="bash"
              />
              
              <div className="mt-4 p-4 bg-[#ffe4e8] rounded-lg ">
                <h4 className="font-semibold mb-2 text-yellow-800"> About Testnet</h4>
                <p className="text-yellow-800">
                  Coston2 is Flare&apos;s test network where you can deploy contracts for free using test tokens. 
                  It&apos;s identical to the real network but uses fake money - perfect for learning!
                </p>
              </div>

              <Screenshot 
                src="/f6.png" 
                alt="My terminal showing successful deployment with contract address"
                caption="You'll get a contract address that you can use to interact with your deployed contract"
              />
            </div>
          </motion.section>
        </div>
     

     
    </div>
  )
}