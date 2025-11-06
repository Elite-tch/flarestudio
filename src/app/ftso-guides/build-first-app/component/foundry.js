"use client"
import { motion } from "framer-motion"
import { CodeBlock } from "./code-block"
import { Screenshot } from "./screenshot"

export default function FoundryGuide() {
  return (
    <div>
     

      {/* What You'll Learn */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="md:text-3xl text-2xl font-bold text-gray-900 mb-6"> What You&lsquo;ll Master</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#fff1f3] p-6 rounded-xl ">
            <div className="text-2xl mb-3"></div>
            <h3 className="font-semibold text-gray-900 mb-2">Ultra-Fast Development</h3>
            <p className="text-gray-700 text-sm">
              Foundry compiles and tests in milliseconds, not seconds. Experience development at warp speed!
            </p>
          </div>
          
          <div className="bg-[#fff1f3] p-6 rounded-xl ">
            <div className="text-2xl mb-3"></div>
            <h3 className="font-semibold text-gray-900 mb-2">Built-in Testing</h3>
            <p className="text-gray-700 text-sm">
              Write tests directly in Solidity. No more switching between languages!
            </p>
          </div>
          
          <div className="bg-[#fff1f3] p-6 rounded-xl ">
            <div className="text-2xl mb-3"></div>
            <h3 className="font-semibold text-gray-900 mb-2">Command Line Power</h3>
            <p className="text-gray-700 text-sm">
              Deploy and interact with contracts using powerful command-line tools.
            </p>
          </div>
        </div>
      </motion.section>

    {/* Prerequisites */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="mb-12"
>
  <h2 className="md:text-3xl text-2xl font-bold text-gray-900 mb-6">What You Need</h2>
  
  <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
    <p className="text-gray-700 mb-4">
      If you are using Foundry for the first time follow these steps before you continue.
    </p>

    <div className="p-4 bg-[#ffe4e8]  rounded-lg  mb-6">
      <p className="text-gray-800 font-semibold mb-2">Install Foundry or visit <a href='https://getfoundry.sh/introduction/installation/'>Foundry Docs</a></p>
      <pre className="text-sm bg-black text-white p-3 rounded">
curl -L https://foundry.paradigm.xyz | bash
      </pre>
      <p className="text-gray-700 mt-2">
        After installation run the command below to install the tools.
      </p>
      <pre className="text-sm bg-black text-white p-3 rounded">
foundryup
      </pre>
      <p className="text-gray-700 mt-2">
        To confirm that everything worked run the command below.
      </p>
      <pre className="text-sm bg-black text-white p-3 rounded">
forge --version
      </pre>
    </div>

    <div className="">
    <Screenshot 
            src="/f7.png" 
            alt="Terminal showing Foundry project setup"
            caption="This is what successful Foundry installation looks like"
          />
    </div>
  </div>
</motion.section>

      {/* Step 1: Setup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <div className="flex items-center mb-6">
          <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">1</div>
          <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Get the Foundry Starter Kit</h2>
        </div>
        
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-700 mb-4">
            Foundry has its own starter template. Let&lsquo;s grab it and set things up:
          </p>
          
          <CodeBlock
            code={`# Clone the Flare Foundry starter
git clone https://github.com/flare-foundation/flare-foundry-starter.git

# Move into the project
cd flare-foundry-starter

# Install dependencies using soldeer (Foundry's package manager)
forge soldeer install`}
            language="bash"
          />
          
          <div className="mt-4 p-4 bg-[#ffe4e8]  rounded-lg border text-yellow-800">
            <h4 className="font-semibold mb-2 ">What&lsquo;s soldeer?</h4>
            <p >
              Soldeer is Foundry&lsquo;s package manager. It&lsquo;s like npm but specifically for Solidity dependencies. 
              It handles all the smart contract libraries you&lsquo;ll need.
            </p>
          </div>

          <Screenshot 
            src="/f8.png" 
            alt="Terminal showing Foundry project setup"
            caption="This is what successful Foundry setup looks like"
          />
        </div>

        {/* Remappings Fix */}
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
          <h3 className="text-xl font-semibold mb-4"> Fix Import Paths</h3>
          <p className="text-gray-700 mb-4">
            Update your <code>remappings.txt</code> file to ensure imports work correctly:
          </p>
          
          <CodeBlock
            code={`@openzeppelin-contracts/=dependencies/@openzeppelin-contracts-5.2.0-rc.1/
flare-periphery/=dependencies/flare-periphery-0.1.37/
forge-std/=dependencies/forge-std-1.9.5/src/
surl/=dependencies/surl-0.0.0/src/
solidity-stringutils/=dependencies/surl-0.0.0/lib/solidity-stringutils/`}
            language="text"
          />
          
          <div className="mt-4 p-4 bg-[#ffe4e8] text-yellow-800 rounded-lg">
            <p className="">
              This file tells Foundry where to find your imported contracts. Think of it as a map for your code dependencies.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Step 2: Configure Foundry */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <div className="flex items-center mb-6">
          <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">2</div>
          <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Configure Foundry for Speed</h2>
        </div>
        
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
          <p className="text-gray-700 mb-4">
            Update your <code>foundry.toml</code> to use the Shanghai EVM version:
          </p>
          
          <CodeBlock
            code={`[profile.default]
evm_version = "shanghai"`}
            language="toml"
          />
          
          <div className="mt-4 p-4 bg-[#ffe4e8] text-yellow-800 rounded-lg ">
            <h4 className="font-semibold mb-2 "> Why Shanghai?</h4>
            <p className="">
              The Shanghai EVM version includes the latest optimizations and features. 
              Foundry + Shanghai = Maximum performance for your smart contracts!
            </p>
          </div>
        </div>
      </motion.section>
{/* Step 3: Create Contract */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.5 }}
  className="mb-12"
>
  <div className="flex items-center mb-6">
    <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">3</div>
    <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Build Your Price Reader</h2>
  </div>
  
  <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
  <p className="text-gray-700 mb-4">
            Create <code>src/FtsoV2FeedConsumer.sol</code>. Here&lsquo;s the complete contract:
          </p>
    {/* Complete Contract with Detailed Breakdown */}
    <div className="space-y-8">
      {/* Imports Section */}
      <div>
        <h4 className="text-lg font-semibold mb-3 ">Essential Imports</h4>
        <CodeBlock
          code={`// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Flare's official periphery contracts for FTSO integration
import {TestFtsoV2Interface} from "flare-periphery/src/coston2/TestFtsoV2Interface.sol";
import {ContractRegistry} from "flare-periphery/src/coston2/ContractRegistry.sol";
import {IFeeCalculator} from "flare-periphery/src/coston2/IFeeCalculator.sol";`}
          language="solidity"
        />
        <div className="mt-3 p-4 bg-[#ffe4e8] text-yellow-800 rounded-lg">
          <h5 className="font-semibold  mb-2">Why These Imports Matter:</h5>
          <ul className=" text-sm space-y-1">
            <li>• <strong>TestFtsoV2Interface</strong>: Interface to interact with FTSO price feeds</li>
            <li>• <strong>ContractRegistry</strong>: Access Flare&lsquo;s official contract addresses</li>
            <li>• <strong>IFeeCalculator</strong>: Handle FTSO fee calculations (if needed)</li>
            <li>• These are battle-tested contracts maintained by Flare Foundation</li>
          </ul>
        </div>
      </div>

      {/* Feed IDs Section */}
      <div>
        <h4 className="text-lg font-semibold mb-3 ">Price Feed Configuration</h4>
        <CodeBlock
          code={`contract FtsoV2Consumer {
    // FLR/USD feed ID - this is how FTSO identifies each price feed
    bytes21 public constant FLR_USD_ID = 0x01464c522f55534400000000000000000000000000;

    // Multiple feed support - access various cryptocurrency prices
    bytes21[] public feedIds = [
        bytes21(0x01464c522f55534400000000000000000000000000), // FLR/USD
        bytes21(0x014254432f55534400000000000000000000000000), // BTC/USD  
        bytes21(0x014554482f55534400000000000000000000000000), // ETH/USD
        bytes21(0x0158534c522f55534400000000000000000000000000), // XRP/USD
        bytes21(0x014c494e4b2f55534400000000000000000000000000)  // LINK/USD
    ];`}
          language="solidity"
        />
        <div className="mt-3 p-4 bg-[#ffe4e8] text-yellow-800 rounded-lg">
          <h5 className="font-semibold  mb-2">Understanding Feed IDs:</h5>
          <ul className=" text-sm space-y-1">
            <li>• <strong>Fixed Format</strong>: Each ID follows a specific byte pattern</li>
            <li>• <strong>Human Readable</strong>: 0x01 + &ldquo;FLR/USD&ldquo; in hex + padding</li>
            <li>• <strong>Multiple Feeds</strong>: Support 50+ cryptocurrencies including major pairs</li>
            <li>• <strong>Gas Efficient</strong>: bytes21 is cheaper than strings for storage</li>
          </ul>
          <div className="mt-2 text-xs ">
             <strong>Pro Tip:</strong> Find all available feeds at <code>https://dev.flare.network/ftso/feeds</code>
          </div>
        </div>
      </div>

      {/* Core Functions Section */}
      <div>
        <h4 className="text-lg font-semibold mb-3 "> Core Price Reading Functions</h4>
        
        {/* Single Price Function */}
        <div className="mb-6">
          <h5 className="font-medium  mb-2">1. Get Single Price (Decimal Format)</h5>
          <CodeBlock
            code={`function getFlrUsdPrice() external view returns (uint256 price, int8 decimals, uint64 timestamp) {
    // In production: Use ContractRegistry.getFtsoV2() for mainnet
    TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
    
    // Get the latest FLR/USD price data
    (price, decimals, timestamp) = ftsoV2.getFeedById(FLR_USD_ID);
    
    // Returns: 
    // - price: The actual price value (e.g., 123456789 for $0.123456789)
    // - decimals: Number of decimal places (e.g., -8 for 8 decimal precision)  
    // - timestamp: When this price was last updated (Unix timestamp)
}`}
            language="solidity"
          />
        </div>

        {/* Wei Format Function */}
        <div className="mb-6">
          <h5 className="font-medium  mb-2">2. Get Single Price (Wei Format)</h5>
          <CodeBlock
            code={`function getFlrUsdPriceWei() external view returns (uint256 priceInWei, uint64 timestamp) {
    TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
    
    // Returns price in Wei format (no decimals needed)
    // Useful for direct mathematical operations
    (priceInWei, timestamp) = ftsoV2.getFeedByIdInWei(FLR_USD_ID);
    
    // Example: If FLR/USD = $0.025, returns 25000000000000000
    // (already adjusted for 18 decimal places like Ether)
}`}
            language="solidity"
          />
        </div>

        {/* Batch Price Function */}
        <div>
          <h5 className="font-medium  mb-2">3. Get Multiple Prices (Batch)</h5>
          <CodeBlock
            code={`function getFtsoV2CurrentFeedValues()
    external 
    view 
    returns (
        uint256[] memory prices,
        int8[] memory decimalsArray, 
        uint64 timestamp
    ) 
{
    TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
    
    // Get all configured feeds in one call - saves gas!
    (prices, decimalsArray, timestamp) = ftsoV2.getFeedsById(feedIds);
    
    // Returns arrays in the same order as feedIds
    // prices[0] = FLR/USD, prices[1] = BTC/USD, etc.
}`}
            language="solidity"
          />
        </div>

       
      </div>

      {/* Production vs Test Note */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">🚨 Important: Test vs Production</h4>
        <p className="text-yellow-700 text-sm">
          This example uses <code>ContractRegistry.getTestFtsoV2()</code> for testing. In production, you should use 
          <code>ContractRegistry.getFtsoV2()</code> to access the real FTSO system on Flare mainnet.
        </p>
      </div>

      {/* Complete Contract for Copying */}
      <div>
        <h4 className="text-lg font-semibold mb-3 "> Complete Contract - Copy & Paste Ready</h4>
        <div className="mb-3 p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
          <p className=" text-sm">
            <strong>Copy this entire code into</strong> <code>src/FtsoV2FeedConsumer.sol</code>
          </p>
        </div>
        <CodeBlock
          code={`// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {TestFtsoV2Interface} from "flare-periphery/src/coston2/TestFtsoV2Interface.sol";
import {ContractRegistry} from "flare-periphery/src/coston2/ContractRegistry.sol";
import {IFeeCalculator} from "flare-periphery/src/coston2/IFeeCalculator.sol";

contract FtsoV2Consumer {
    // FLR/USD feed ID
    bytes21 public constant FLR_USD_ID = 0x01464c522f55534400000000000000000000000000;

    // Multiple cryptocurrency price feeds
    bytes21[] public feedIds = [
        bytes21(0x01464c522f55534400000000000000000000000000), // FLR/USD
        bytes21(0x014254432f55534400000000000000000000000000), // BTC/USD
        bytes21(0x014554482f55534400000000000000000000000000), // ETH/USD
        bytes21(0x0158534c522f55534400000000000000000000000000), // XRP/USD
        bytes21(0x014c494e4b2f55534400000000000000000000000000)  // LINK/USD
    ];

    /**
     * @dev Get FLR/USD price with decimal information
     * @return price The price value
     * @return decimals Number of decimal places (negative for precision)
     * @return timestamp When the price was last updated
     */
    function getFlrUsdPrice() external view returns (uint256 price, int8 decimals, uint64 timestamp) {
        // For production: Use ContractRegistry.getFtsoV2() instead
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        (price, decimals, timestamp) = ftsoV2.getFeedById(FLR_USD_ID);
    }

    /**
     * @dev Get FLR/USD price in Wei format (18 decimals)
     * @return priceInWei Price adjusted to 18 decimal places
     * @return timestamp When the price was last updated
     */
    function getFlrUsdPriceWei() external view returns (uint256 priceInWei, uint64 timestamp) {
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        (priceInWei, timestamp) = ftsoV2.getFeedByIdInWei(FLR_USD_ID);
    }

    /**
     * @dev Get current prices for all configured feeds
     * @return prices Array of price values in same order as feedIds
     * @return decimalsArray Array of decimal values for each price
     * @return timestamp When the prices were last updated
     */
    function getFtsoV2CurrentFeedValues()
        external
        view
        returns (
            uint256[] memory prices,
            int8[] memory decimalsArray,
            uint64 timestamp
        )
    {
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        (prices, decimalsArray, timestamp) = ftsoV2.getFeedsById(feedIds);
    }

    /**
     * @dev Get the list of supported feed IDs
     * @return Array of all configured feed IDs
     */
    function getSupportedFeeds() external view returns (bytes21[] memory) {
        return feedIds;
    }
}`}
          language="solidity"
          showLineNumbers={true}
        />
        <div className="mt-3 p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
          <p className="text-gray-700 text-sm">
             <strong>Ready to use!</strong> This contract includes comprehensive documentation and is production-ready 
            (just switch to <code>ContractRegistry.getFtsoV2()</code> for mainnet deployment).
          </p>
        </div>
      </div>
    </div>
  </div>
</motion.section>

      {/* Step 4: Compile */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center mb-6">
          <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">4</div>
          <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Compile at Lightning Speed</h2>
        </div>
        
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
          <CodeBlock
            code={`forge build`}
            language="bash"
          />
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2 text-yellow-900">⚡ Foundry Speed</h4>
            <p className="text-yellow-800">
              Watch how fast Foundry compiles! It&apos;s typically 2-3x faster than Hardhat. 
              This speed boost becomes massive as your project grows.
            </p>
          </div>

          <Screenshot 
            src="/f9.png" 
            alt="Terminal showing ultra-fast Foundry compilation"
            caption="Foundry compilation - notice how quickly it finishes!"
          />
        </div>
      </motion.section>

      {/* Step 5: Advanced Testing */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.7 }}
  className="mb-12"
>
  <div className="flex items-center mb-6">
    <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">5</div>
    <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Solidity-Powered Testing</h2>
  </div>
  
  <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
    <p className="text-gray-700 mb-4 max-w-[90%]">
      Foundry lets you write tests in Solidity! Create <code>test/FtsoV2FeedConsumer_foundry.t.sol</code>:
    </p>

    {/* Test Breakdown */}
    <div className="space-y-6">
      {/* Mock Contracts */}
      <div>
        <h4 className="text-lg font-semibold mb-2 ">Smart Mocks</h4>
        <CodeBlock
          code={`contract MockFtsoV2 {
    function getFeedById(bytes21) external payable returns (uint256, int8, uint64) {
        return (150000, 7, uint64(block.timestamp)); // Returns test data
    }
}`}
          language="solidity"
        />
        <div className="mt-2 p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
          <p className=" text-sm">
            <strong>Step 1:</strong> Mock contracts simulate real FTSOv2 behavior. This lets you test without connecting to the actual network!
          </p>
        </div>
      </div>

      {/* Complete Test */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Complete Foundry Test</h4>
        <CodeBlock
          code={`// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "forge-std/Test.sol";
import {FtsoV2FeedConsumer} from "../src/FtsoV2FeedConsumer.sol";

contract MockFtsoV2 {
    function getFeedById(bytes21) external payable returns (uint256, int8, uint64) {
        return (150000, 7, uint64(block.timestamp));
    }
}

contract MockFeeCalculator {
    function calculateFeeByIds(bytes21[] memory) external pure returns (uint256) {
        return 0; // No fees in testing
    }
}

contract FtsoV2FeedConsumerTest is Test {
    FtsoV2FeedConsumer public feedConsumer;
    MockFtsoV2 public mockFtsoV2;
    MockFeeCalculator public mockFeeCalc;
    bytes21 constant flrUsdId = bytes21(0x01464c522f55534400000000000000000000000000);

    function setUp() public {
        mockFtsoV2 = new MockFtsoV2();
        mockFeeCalc = new MockFeeCalculator();
        feedConsumer = new FtsoV2FeedConsumer(
            address(mockFtsoV2),
            address(mockFeeCalc),
            flrUsdId
        );
    }

    function testGetFlrUsdPrice() public {
        (uint256 price, int8 decimals, uint64 timestamp) = feedConsumer.getFlrUsdPrice{value: 0}();
        
        assertEq(price, 150000, "Price should match mock");
        assertEq(decimals, 7, "Decimals should match mock");
        assertApproxEqAbs(timestamp, uint64(block.timestamp), 2, "Timestamp should be recent");
    }
}`}
          language="solidity"
        />
        
        {/* Step-by-step explanation */}
        <div className="mt-4 space-y-4">
          <div className="p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
            <h5 className="font-semibold  mb-1">Step 2: Test Setup</h5>
            <p className=" text-sm">
              <code>setUp()</code> runs before each test. It creates mock contracts and your main contract.
            </p>
          </div>

          <div className="p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
            <h5 className="font-semibold  mb-1">Step 3: Test Execution</h5>
            <p className=" text-sm">
              <code>testGetFlrUsdPrice()</code> calls your contract and gets the price data.
            </p>
          </div>

          <div className="p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
            <h5 className="font-semibold  mb-1">Step 4: Assertions</h5>
            <p className=" text-sm">
              <code>assertEq()</code> checks if values match expected results from mocks.
            </p>
          </div>

          <div className="p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
            <p className=" text-sm">
              <strong>Key Benefit:</strong> Writing tests in Solidity means you&#39;re testing in the same language as your contract. No context switching!
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Run Command */}
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2"> Run Your Tests</h4>
      <CodeBlock
        code={`forge test`}
        language="bash"
      />
    </div>

    <Screenshot 
      src="/f0.png" 
      alt="Terminal showing blazing fast Foundry tests"
      caption="Foundry tests run incredibly fast - often completing in milliseconds!"
    />
  </div>
</motion.section>

      {/* Step 6: Deployment Power */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-12"
      >
        <div className="flex items-center mb-6">
          <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">6</div>
          <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Command-Line Deployment Magic</h2>
        </div>
        
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
          <p className="text-gray-700 mb-4">
            Foundry gives you powerful command-line tools for deployment. Let&lsquo;s set up everything:
          </p>

          {/* Wallet Creation */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 "> Create a Wallet</h4>
            <CodeBlock
              code={`cast wallet new`}
              language="bash"
            />
            <div className="mt-2 p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
              <p className=" text-sm">
                This creates a new wallet for deployment. Save the address and private key safely!
              </p>
            </div>
          </div>

        {/* Environment Setup */}
<div className="mb-6">
  <h4 className="text-lg font-semibold mb-2 "> Set Environment Variables</h4>
  
  {/* Windows (PowerShell) */}
  <div className="mb-4">
    <h5 className="font-medium  mb-2">Windows (PowerShell)</h5>
    <CodeBlock
      code={`# Create load-env.ps1 file
$env:ACCOUNT = "0xYourWalletAddress"
$env:ACCOUNT_PRIVATE_KEY = "0xYourPrivateKey"
$env:RPC_URL = "https://coston2-api.flare.network/ext/C/rpc"

# FTSOv2 contract addresses
$env:FTSOV2_COSTON2 = "0x3d893C53D9e8056135C26C8c638B76C8b60Df726"
$env:FEECALCULATOR_COSTON2 = "0x88A9315f96c9b5518BBeC58dC6a914e13fAb13e2"
$env:FLRUSD_FEED_ID = "0x01464c522f55534400000000000000000000000000"`}
      language="powershell"
    />
    <div className="mt-2 p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
      <p className=" text-sm">
        Save as <code>load-env.ps1</code> and run: <code>.\load-env.ps1</code>
      </p>
    </div>
  </div>

  {/* Mac/Linux */}
  <div>
    <h5 className="font-medium mb-2"> Mac / Linux</h5>
    <CodeBlock
      code={`# Add to .env file
export ACCOUNT=0xYourWalletAddress
export ACCOUNT_PRIVATE_KEY=0xYourPrivateKey
export RPC_URL="https://coston2-api.flare.network/ext/C/rpc"

# FTSOv2 contract addresses
export FTSOV2_COSTON2=0x3d893C53D9e8056135C26C8c638B76C8b60Df726
export FEECALCULATOR_COSTON2=0x88A9315f96c9b5518BBeC58dC6a914e13fAb13e2
export FLRUSD_FEED_ID=0x01464c522f55534400000000000000000000000000`}
      language="bash"
    />
    <div className="mt-2 p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
      <p className=" text-sm">
        Save as <code>.env</code> and run: <code>source .env</code>
      </p>
    </div>
  </div>
</div>

{/* Deployment */}
<div>
  <h4 className="text-lg font-semibold mb-2 "> Deploy with Forge</h4>
  
  {/* Windows (PowerShell) */}
  <div className="mb-4">
    <h5 className="font-medium  mb-2"> Windows</h5>
    <CodeBlock
      code={`forge create --broadcast src/FtsoV2FeedConsumer.sol:FtsoV2FeedConsumer --private-key $env:ACCOUNT_PRIVATE_KEY --rpc-url $env:RPC_URL --constructor-args $env:FTSOV2_COSTON2 $env:FEECALCULATOR_COSTON2 $env:FLRUSD_FEED_ID`}
      language="powershell"
    />
  </div>

  {/* Mac/Linux */}
  <div>
    <h5 className="font-medium  mb-2"> Mac /  Linux</h5>
    <CodeBlock
      code={`forge create --broadcast src/FtsoV2FeedConsumer.sol:FtsoV2FeedConsumer \\
  --private-key $ACCOUNT_PRIVATE_KEY \\
  --rpc-url $RPC_URL \\
  --constructor-args $FTSOV2_COSTON2 $FEECALCULATOR_COSTON2 $FLRUSD_FEED_ID`}
      language="bash"
    />
  </div>

  <div className="mt-2 p-3 bg-[#ffe4e8] text-yellow-800 rounded-lg">
    <p className=" text-sm">
      This single command compiles and deploys your contract with constructor arguments. Foundry makes it so simple!
    </p>
  </div>
</div>

          <Screenshot 
            src="/f11.png" 
            alt="Terminal showing successful Foundry deployment"
            caption="Foundry deployment - clean, fast, and professional"
          />
        </div>
      </motion.section>

      {/* Step 7: Interact with Cast */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mb-12"
      >
        <div className="flex items-center mb-6">
          <div className="bg-[#e93b6c] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">7</div>
          <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Interact with Your Contract</h2>
        </div>
        <CodeBlock
            code={`export DEPLOYMENT_ADDRESS=<deployed to address above>`}
            language="bash"
          />
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-lg  shadow-sm">
  <p className="text-gray-700 mb-4">
    Use <code>cast</code> to call your deployed contract functions:
  </p>
  
  {/* Windows (PowerShell) */}
  <div className="mb-4">
    <h5 className="font-medium  mb-2"> Windows</h5>
    <CodeBlock
      code={`# Call your price function
cast send --private-key $env:ACCOUNT_PRIVATE_KEY --rpc-url $env:RPC_URL --value 0 $env:DEPLOYMENT_ADDRESS "getFlrUsdPrice()"`}
      language="powershell"
    />
  </div>

  {/* Mac/Linux */}
  <div>
    <h5 className="font-medium  mb-2">Mac / Linux</h5>
    <CodeBlock
      code={`# Call your price function
cast send \\
  --private-key $ACCOUNT_PRIVATE_KEY \\
  --rpc-url $RPC_URL -j \\
  --value 0 $DEPLOYMENT_ADDRESS "getFlrUsdPrice()"`}
      language="bash"
    />
  </div>
  
  <div className="mt-4 p-4 bg-[#ffe4e8] text-yellow-800 rounded-lg">
    <h4 className="font-semibold mb-2 "> Cast Magic</h4>
    <p className="">
      <code>cast</code> is Foundry&apos;s Swiss Army knife for blockchain interaction. 
      It can send transactions, call view functions, and much more - all from your command line!
    </p>
  </div>

  <Screenshot 
    src="/f12.png" 
    alt="Terminal showing cast command interacting with contract"
    caption="Using cast to call your contract functions - powerful and efficient"
  />
</div>
      </motion.section>

     
    </div>
  )
}