"use client"
import { motion } from "framer-motion"
import { CodeBlock } from "../component/code"

export default function FTSOOverview() {
  return (
    <div className=" bg-[#ffe4e8] pt-[10%] pb-[5%]">
     <div className="max-w-6xl mx-auto w-[90%]">

 {/* Hero Section 
 <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          FTSO Overview
        </h1>
        <p className="text-md text-gray-600 max-w-3xl mx-auto">
          The Flare Time Series Oracle (FTSO) provides decentralized price data feeds 
          to smart contracts on the Flare network. Learn how to access and use these 
          reliable data feeds in your applications.
        </p>
      </motion.div> */}

      {/* What is FTSO Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What is FTSO?</h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            The <strong>Flare Time Series Oracle (FTSO)</strong> is a decentralized oracle system 
            that provides regularly updated price data for various assets. It aggregates data 
            from multiple providers to ensure accuracy and decentralization.
          </p>
          <p className="text-gray-700 mb-4">
            FTSO data feeds are available for cryptocurrencies, traditional assets, and other 
            financial data. These feeds are crucial for DeFi applications, prediction markets, 
            and any smart contract that requires reliable external data.
          </p>
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#fff1f3]  p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">🎯 Decentralized</h3>
            <p className="text-gray-700">
              Data is aggregated from multiple independent providers, ensuring no single point of failure.
            </p>
          </div>
          <div className="bg-[#fff1f3]  p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">⚡ Real-time Updates</h3>
            <p className="text-gray-700">
              Prices are updated every 3 minutes, providing fresh data for time-sensitive applications.
            </p>
          </div>
          <div className="bg-[#fff1f3]  p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">🔒 Secure</h3>
            <p className="text-gray-700">
              Cryptographic proofs ensure data integrity and prevent manipulation.
            </p>
          </div>
          <div className="bg-[#fff1f3]  p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">🌐 Multi-asset Support</h3>
            <p className="text-gray-700">
              Supports a wide range of cryptocurrencies, forex pairs, and commodities.
            </p>
          </div>
        </div>
      </motion.section>

      {/* How FTSO Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How FTSO Works</h2>
        <div className="bg-[#fff1f3]  p-6 rounded-lg border border-gray-200">
          <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
          The FTSO system works in repeating cycles where price data is collected and finalized:
</p>
<ol className="list-decimal list-inside space-y-3 text-gray-700">
  <li><strong>Data providers</strong> submit price estimates for supported assets.</li>
  <li><strong>Aggregation</strong> calculates a median price from all submissions in each cycle.</li>
  <li><strong>Reward distribution</strong> automatically rewards providers whose estimates are closest to the final price.</li>
  <li><strong>Smart contracts</strong> can read and use the finalized price data on chain.</li>
</ol>
          </div>
        </div>
      </motion.section>

      {/* Quick Start Example */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start Example</h2>
        
        <div className="bg-[#fff1f3]  p-6 rounded-lg border border-gray-200">
          <CodeBlock
            code={`// Simple FTSO price reading example
const { ethers } = require("ethers");

// FTSO Contract Address
const FTSO_ADDRESS = "0x1000000000000000000000000000000000000001";

// FTSO ABI (simplified)
const FTSO_ABI = [
  "function getCurrentPrice() external view returns (uint256 _price, uint256 _timestamp)"
];

async function getCurrentPrice() {
  const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
  const ftso = new ethers.Contract(FTSO_ADDRESS, FTSO_ABI, provider);
  
  const [price, timestamp] = await ftso.getCurrentPrice();
  console.log("Current Price:", price.toString());
  console.log("Last Updated:", new Date(timestamp * 1000).toLocaleString());
}`}
            language="javascript"
          />
          
          <div className="mt-4 p-4 bg-[#ffe4e8]  rounded-lg">
            <h3 className="font-semibold  mb-2 text-">What this code does:</h3>
            <p className="">
  This example connects to the FTSO contract and reads the latest price. 
  You will need to replace YOUR_RPC_URL with a working Flare RPC endpoint. 
  The getCurrentPrice function returns the price and the time it was last updated, 
  so you can see both the value and when it became final.
</p>

          </div>
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Building?</h2>
        <p className="text-gray-600 mb-6">
          Continue to the next guide to build your first application with FTSO data feeds.
        </p>
       <div className="flex items-center md:flex-row flex-col justify-between">
       <a
          href="https://dev.flare.network/ftso/guides"
          className="inline-flex items-center px-6 py-3 bg-[#e93b6c] text-white font-medium rounded-lg hover:underline transition-colors"
        >
         Flare FTSO Docs
        </a>
       <a
          href="/ftso-guides/build-first-app"
          className="inline-flex items-center px-6 py-3 bg-[#e93b6c] text-white font-medium rounded-lg hover:underline transition-colors"
        >
          Build Your First Application →
        </a>
       </div>
      </motion.section>

     </div>
    </div>
  )
}