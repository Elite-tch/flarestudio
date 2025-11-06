"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import FoundryGuide from "./component/foundry"
import HardHatTab from "./component/hardhatTab"

export default function BuildFirstApp() {
 // const [activeTool, setActiveTool] = useState("hardhat")
   
  const [activeTool, setActiveTool] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTool") || "hardhat"
    }
    return "hardhat"
  })
  
  const changeTool = (tool) => {
    setActiveTool(tool)
    localStorage.setItem("activeTool", tool)
  }
  

  return (
    <div className=" pt-[30%] pb-[5%] overflow-hidden md:pt-[10%] bg-[#ffe4e8] mx-auto">
      {/* Header */}
     <div className="max-w-6xl mx-auto  w-[90%]">
     <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12  mx-auto"
      >
          <h1 className="md:text-4xl text-3xl font-bold text-gray-900 mb-2">
          Build your first FTSOv2 app
        </h1>
        <p className="text-md text-gray-600">
          This guide is for developers who want to build an FTSOv2 application using either Foundry or Hardhat.
        </p>
      </motion.div>

      {/* Quick Start 
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 What We're Building</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
          <p className="text-gray-700 text-lg mb-4">
            We're creating a smart contract that can read <strong>real-time cryptocurrency prices</strong> from Flare's FTSOv2 system.
          </p>
          <p className="text-gray-600">
            By the end, you'll have a smart contract running on the Flare testnet that can tell you the current price of FLR, BTC, and ETH in USD!
          </p>
        </div>
      </motion.section>
*/}
      {/* Tool Selection */}
      <div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 ">
        <h2 className="text-2xl font-semibold mb-4">Choose Development Tools</h2>
        <div className="flex space-x-4 mb-4">
          <button
           
            onClick={() => changeTool("hardhat")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTool === "hardhat" 
                ? "bg-[#e93b6c] text-white shadow-lg" 
                : "bg-[#fff1f3] text-gray-700 hover:bg-[#fff1f3]"
            }`}
          >
            Hardhat 
          </button>
          <button
           onClick={() => changeTool("foundry")} 
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTool === "foundry" 
                ? "bg-[#e93b6c] text-white shadow-lg" 
                : "bg-[#fff1f3] text-gray-700 hover:bg-[#fff1f3]"
            }`}
          >
            Foundry 
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          {activeTool === "hardhat" 
            ? "Hardhat is a development tool that simplifies writing, testing and deploying smart contracts on Ethereum. (Recommended for Beginners) " 
            : "Foundry is a development tool that simplifies writing, testing and deploying smart contracts on Ethereum. (Recommended for Advanced Users) "}
        </p>
      </div>

      {activeTool === "hardhat" && (
        <HardHatTab/>
      )}

{activeTool === "foundry" && (
      <FoundryGuide/>
      )}




      {/* Celebration */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-center bg-[#fff1f3] pb-8 p-4 md:p-8 rounded-2xl "
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4"> You Did It!</h2>
        <p className="text-gray-600 mb-6">
          You&apos;ve just built and deployed your first FTSOv2 application! 
          You now have a smart contract running on the Flare network that can read real cryptocurrency prices.
        </p>
        <div className="space-y-4 justify-between items-center pb-4 flex md:flex-row flex-col">
          <a
            href="https://dev.flare.network/ftso/guides/build-first-app"
            className="inline-flex items-center px-6 py-3 bg-[#e93b6c] text-white font-medium rounded-lg  transition-colors shadow-lg"
          >
            Flare FTSOV2 Guide →
          </a>
          <a
            href="/ftso/read-feeds-onchain"
            className="inline-flex items-center px-6 py-3 bg-[#e93b6c] text-white font-medium rounded-lg  transition-colors shadow-lg"
          >
            Next: Learn to Read Multiple Price Feeds →
          </a>
          
        </div>
        <p className="text-gray-500 text-sm">
            Ready to build something more advanced? Learn how to work with multiple price feeds and advanced FTSO features.
          </p>
      </motion.section>
     </div>
    </div>
  )
}