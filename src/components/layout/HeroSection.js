"use client"

import { motion } from "framer-motion"
import { Code2, Database, Zap, Terminal } from "lucide-react"

export function HeroSection() {
  const features = [
    { icon: Code2, label: "Code Snippets" },
    { icon: Database, label: "Live Data" },
    { icon: Zap, label: "FTSO Oracle" },
    { icon: Terminal, label: "RPC Testing" },
    { icon: Terminal, label: "SDK" },
  ]

  return (
    <section className="relative bg-[#ffe4e8] pt-[50%] md:pt-[13%]  md:pb-20 min-h-screen px-4 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-background opacity-50" />

      {/* Gradient orbs */}
      <div className="absolute top-[32%] left-1/4 w-96 h-96 bg-[#e93b6c]/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-[20%] w-96 h-96 bg-[#e93b6c]/30 rounded-full blur-3xl" />

       

      <div className="container mx-auto relative z-10 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
         <h1 className="text-4xl cursor-pointer sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-balance leading-tight">
         Interactive Playground  {" "}
            <span className="bg-gradient-to-r from-[#e93b6c] to-[#e93b6c]/20 bg-clip-text text-transparent">
            & Developer Toolkit 
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-lg text mb-8 md:mb-12  text-gray-700 max-w-2xl mx-auto px-4">
            Connect your wallet, explore network data, view live oracle information, test RPC queries, use SDK and learn through
            ready-to-use code snippets.
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="flex items-center cursor-pointer gap-2 px-3 md:px-4 py-2 rounded-full bg-[#e93b6c] text-white "
              >
                <feature.icon className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
