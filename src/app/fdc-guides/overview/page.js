"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { CodeBlock } from "@/app/ftso-guides/component/code"

export default function FDCOverview() {
  return (
    <div className=" pt-[30%] md:pt-[12%] bg-[#ffe4e8]">
      <div className="max-w-6xl mx-auto w-[90%]">
        {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 "
      >
        <h1 className="md:text-4xl text-3xl font-bold text-gray-900 mb-2">
          Flare Data Connector (FDC) Overview
        </h1>
        <p className="text-md text-gray-600 max-w-3xl">
          The bridge between traditional web data and blockchain smart contracts. 
          Bring any API data onto the Flare network with cryptographic proof.
        </p>
      </motion.div>

      {/* What is FDC Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What is FDC?</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#fff1f3] text-yellow-800 p-6 rounded-2xl ">
            <h3 className="text-xl font-semibold mb-3 text-yellow-900">The Simple Explanation</h3>
            <p className=" mb-4">
              Think of FDC as a <strong>trusted messenger</strong> that can fetch data from any website or API 
              and deliver it to your smart contracts with a <strong>cryptographic proof</strong> that the data is authentic.
            </p>
            <p className=" ">
              It&apos;s like having a notary public for internet data - it verifies that the information came from 
              the source you requested and hasn&apos;t been tampered with.
            </p>
          </div>

          <div className="bg-[#fff1f3] text-yellow-800 p-6 rounded-2xl ">
            <h3 className="text-xl font-semibold mb-3 text-yellow-900">Real-World Analogy</h3>
            <p className=" mb-4">
              Imagine you want to build a DeFi app that uses stock prices from Yahoo Finance. 
            </p>
            <p className="">
              <strong>With FDC</strong>, you can tell it: &quot;Go get me Apple&apos;s current stock price from Yahoo Finance&quot; 
              and it will bring back the price along with proof that it really came from Yahoo.
            </p>
          </div>
        </div>
      </motion.section>

      {/* How FDC Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="md:text-3xl text-2xl font-bold text-gray-900 mb-6">How FDC Works: The Magic Behind the Scenes</h2>
        
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="bg-[#e93b6c] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">1</div>
              <div>
                <h4 className="text-xl font-semibold mb- text-gray-900">Your Request</h4>
                <p className="text-gray-700">
                  Your smart contract asks FDC to fetch specific data from a web API. 
                  You specify the URL, the data you want, and how to extract it.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="bg-[#e93b6c] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">2</div>
              <div>
                <h4 className="text-xl font-semibold mb- text-gray-900">FDC Fetches Data</h4>
                <p className="text-gray-700">
                  FDC calls the API, gets the response, and creates a cryptographic proof (attestation) 
                  that proves the data came from that specific source at that specific time.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="bg-[#e93b6c] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">3</div>
              <div>
                <h4 className="text-xl font-semibold mb- text-gray-900">Verified Delivery</h4>
                <p className="text-gray-700">
                  The data and its proof are delivered to your smart contract. 
                  Your contract can verify the proof to ensure the data is authentic before using it.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Diagram Placeholder */}
          <div className="mt-8 p-6 bg-[#ffe4e8] rounded-lg  text-center">
            <p className="text-gray-600 mb-4">📊 FDC Data Flow Diagram</p>
            <div className="flex justify-center items-center">
            <Image
            width={600}
            height={600}
              src="/diagram.png" 
              alt="Diagram showing FDC data flow from API to smart contract"
              caption="Visual representation of how FDC bridges web data to blockchain"
              className="md:w-[70%] w-[100%] h-[150px] mx-auto md:h-[300px]"
            />
            </div>
          </div> 
        </div>
      </motion.section>

      {/* Key Features */}
      {/* Key Features */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="mb-12"
>
  <h2 className="md:text-3xl text-2xl font-bold text-gray-900 mb-6">Why FDC is Revolutionary</h2>
  
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2">Any API, Any Data</h3>
      <p className="text-gray-700">
        Connect to REST APIs, JSON endpoints, or common web services. Stock prices, weather data,
        sports scores, and more. If it is available online, FDC can bring it on chain in a trusted way.
      </p>
    </div>

    <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2">Cryptographic Proof</h3>
      <p className="text-gray-700">
        Every piece of data comes with a verifiable attestation. This removes blind trust and makes it
        possible to prove that your data is authentic using mathematics.
      </p>
    </div>

    <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2">Fresh Data When Needed</h3>
      <p className="text-gray-700">
        Fetch updated information when your contract requires it. This keeps your smart contracts
        connected to data that changes often.
      </p>
    </div>

    <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2">Cost Effective</h3>
      <p className="text-gray-700">
        Pay only for the data you use. There is no need to run your own oracles or manage separate
        infrastructure for every data source.
      </p>
    </div>

    <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2">Decentralized</h3>
      <p className="text-gray-700">
        Multiple independent attestation providers reduce the chance of failure. Your data remains
        reliable and available even if one provider has issues.
      </p>
    </div>

    <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2">Developer Friendly</h3>
      <p className="text-gray-700">
        Simple integration into your smart contracts. Clear documentation and flexible options make
        it easy to start building with FDC.
      </p>
    </div>
  </div>
</motion.section>


      {/* Use Cases */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="md:text-3xl text-2xl font-bold text-gray-900 mb-6">What Can You Build with FDC?</h2>
        
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-2xl ">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 ">Real-World Applications</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#e93b6c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>DeFi Protocols</strong> using real stock prices or forex rates</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#e93b6c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Insurance dApps</strong> that pay out based on weather data or flight status</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#e93b6c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Gaming & NFTs</strong> with real-world event integration</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#e93b6c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Prediction Markets</strong> based on sports outcomes or election results</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 "> Innovative Ideas</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#e93b6c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Supply Chain</strong> tracking with real shipping API data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#e93b6c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Social Media</strong> integrations for on-chain reputation</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#e93b6c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>IoT Devices</strong> reporting sensor data to smart contracts</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#e93b6c] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Your Imagination</strong> - any web data can become blockchain data!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Example */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">FDC in Action: Simple Example</h2>
        
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl  shadow-sm">
          <p className="text-gray-700 mb-4">
            Here&apos;s a basic example of how you might use FDC to get cryptocurrency prices from an external API:
          </p>

          <CodeBlock
            code={`// Simple FDC contract example
pragma solidity ^0.8.0;

interface IFDC {
    function requestData(
        string memory url,
        string memory path,
        bytes memory callbackData
    ) external returns (uint256);
}

contract PriceConsumer {
    IFDC public fdc;
    address public owner;
    uint256 public currentPrice;
    
    constructor(address _fdc) {
        fdc = IFDC(_fdc);
        owner = msg.sender;
    }
    
    function getBitcoinPrice() external {
        // Request Bitcoin price from CoinGecko API
        fdc.requestData(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
            "bitcoin.usd",
            abi.encode(msg.sender)
        );
    }
    
    // FDC will call this function with the verified price data
    function processData(uint256 price) external {
        require(msg.sender == address(fdc), "Only FDC can call this");
        currentPrice = price;
    }
}`}
            language="solidity"
          />
          
          <div className="mt-4 p-4 bg-[#ffe4e8] text-yellow-800 rounded-lg ">
            <h4 className="font-semibold mb-2 ">Understanding This Example</h4>
            <div className="space-y-2 ">
              <p><strong>Lines 1-8:</strong> We define the FDC interface so our contract knows how to talk to it</p>
              <p><strong>Lines 10-17:</strong> Our contract stores the FDC address and sets up the owner</p>
              <p><strong>Lines 19-26:</strong> We ask FDC to fetch Bitcoin price from CoinGecko API</p>
              <p><strong>Lines 29-33:</strong> FDC calls this function back with the verified price data</p>
            </div>
          </div>

         
        </div>
      </motion.section>

      {/* FDC vs Traditional Oracles */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">FDC vs Traditional Oracles</h2>
        
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-4 font-semibold text-gray-900">Feature</th>
                  <th className="pb-4 font-semibold text-[#e93b6c]">Flare Data Connector</th>
                  <th className="pb-4 font-semibold text-gray-600">Traditional Oracles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 font-medium text-gray-900">Data Sources</td>
                  <td className="py-4 text-[#e93b6c]">Any web API or endpoint</td>
                  <td className="py-4 text-gray-700">Pre-defined data feeds only</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900">Setup Time</td>
                  <td className="py-4 text-[#e93b6c]">Minutes to integrate new APIs</td>
                  <td className="py-4 text-gray-700">Days or weeks for new feeds</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900">Cost</td>
                  <td className="py-4 text-[#e93b6c]">Pay-per-use model</td>
                  <td className="py-4 text-gray-700">Subscription fees</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900">Flexibility</td>
                  <td className="py-4 text-[#e93b6c]">Full control over data parsing</td>
                  <td className="py-4 text-gray-700">Limited to provider&apos;s format</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900">Verification</td>
                  <td className="py-4 text-[#e93b6c]">Cryptographic attestations</td>
                  <td className="py-4 text-gray-700">Trust in oracle provider</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>


            {/* Extra Explanations */}
            <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mb-16 mt-12"
      >
        <h2 className="md:text-3xl text-2xl font-bold text-gray-900 mb-6">Extra Explanations</h2>
        <div className="bg-[#fff1f3] p-4 md:p-6 rounded-xl  shadow-sm space-y-6">

          <div>
            <h3 className="text-xl font-semibold mb-2 ">Attestation Provider</h3>
            <p className="text-gray-700">
              An attestation provider is a trusted service on Flare that collects data from the real world or other blockchains,
              then sends that data on chain. It helps smart contracts use information outside their own network.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 ">Cryptographic Proof</h3>
            <p className="text-gray-700">
              A cryptographic proof is a math based way to prove something is true without showing every detail. It keeps
              information secure and verifiable.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 ">API Rate Limits</h3>
            <p className="text-gray-700">
              Some services only allow a limited number of requests within a short time. Sending too many requests may cause
              slow responses or temporary blocks. Always handle errors and add retries in your code.
            </p>
          </div>

         

        </div>
      </motion.section>


      

      {/* Quick Links */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center pb-16 mt-12"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Continue Your FDC Journey</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <a href="/fdc/getting-started" className="bg-[#fff1f3] p-4 md:p-6 rounded-xl  hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-3"></div>
            <h4 className="font-semibold text-gray-900 mb-2">FDC Hardhat</h4>
            <p className="text-gray-600 text-sm">Set up your first FDC project</p>
          </a>
          <a href="/fdc/web2json" className="bg-[#fff1f3] p-4 md:p-6 rounded-xl  hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-3"></div>
            <h4 className="font-semibold text-gray-900 mb-2">FDC Foundry</h4>
            <p className="text-gray-600 text-sm">Set up your first FDC project</p>
          </a>
          <a href="/fdc/attestation-types" className="bg-[#fff1f3] p-4 md:p-6 rounded-xl  hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-3"></div>
            <h4 className="font-semibold text-gray-900 mb-2">Attestation Types</h4>
            <p className="text-gray-600 text-sm">Understand data verification</p>
          </a>
        </div>
      </motion.section>
      </div>
    </div>
  )
}