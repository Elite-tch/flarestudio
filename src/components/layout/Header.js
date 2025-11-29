"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { WalletConnection } from "./wallet-connection"
import Link from "next/link"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Sparkles, MessageSquare } from "lucide-react";
import { GeneratorModal } from "./GeneratorModal";
import { motion } from "framer-motion";

export default function Header() {
  const [developersGuideOpen, setDevelopersGuideOpen] = useState(false)
  const [ftsoOpen, setFtsoOpen] = useState(false)
  const [fdcOpen, setFdcOpen] = useState(false)
  const [web2jsonOpen, setWeb2jsonOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  const ftsoGuides = [
    { name: "FTSO Overview", href: "/ftso-guides/overview" },
    { name: "Build Your First Application", href: "/ftso-guides/build-first-app" },
    { name: "Read Data Feeds On-Chain", href: "/ftso-guides/read-feeds-onchain" },
  ]

  const fdcGuides = [
    { name: "Getting Started", href: "/fdc-guides/overview" },
  ]

  const web2json = [
    { name: "Hardhat", href: "/fdc-guides/web2json/hardhat" },
    { name: "Foundry", href: "/fdc-guides/web2json/foundry" },
  ]

  useEffect(() => {
    const handleClickOutside = () => {
      setDevelopersGuideOpen(false)
      setFtsoOpen(false)
      setFdcOpen(false)
      setWeb2jsonOpen(false)
    }

    if (developersGuideOpen || ftsoOpen || fdcOpen || web2jsonOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [developersGuideOpen, ftsoOpen, fdcOpen, web2jsonOpen])

  const handleDevelopersGuideClick = (e) => {
    e.stopPropagation()
    setDevelopersGuideOpen(!developersGuideOpen)
  }

  const handleFtsoClick = (e) => {
    e.stopPropagation()
    setFtsoOpen(!ftsoOpen)
    setFdcOpen(false)
    setWeb2jsonOpen(false)
  }

  const handleFdcClick = (e) => {
    e.stopPropagation()
    const newState = !fdcOpen
    setFdcOpen(newState)
    setFtsoOpen(false)
    if (!newState) {
      setWeb2jsonOpen(false)
    }
  }

  const handleWeb2jsonClick = (e) => {
    e.stopPropagation()
    setWeb2jsonOpen(!web2jsonOpen)
    setFtsoOpen(false)
  }

  const handleMobileLinkClick = () => {
    setMobileOpen(false)
    setDevelopersGuideOpen(false)
    setFtsoOpen(false)
    setFdcOpen(false)
    setWeb2jsonOpen(false)
  }

  return (
    <header className="fixed border-b top-0 left-0 right-0 z-50 bg-[#ffe4e8]">
      <div className="container px-8 md:px-14 flex w-full mx-auto py-4 items-center justify-between">

        <Link href='/'>
          <Image
            src="/flarelogo.png"
            alt="Flare Studio Logo"
            width={150}
            height={150}
            className="w-32 h-auto cursor-pointer"
          />
        </Link>

        <nav className="hidden md:flex justify-between gap-6 items-center">
        

          <div className="relative  ">
            <button
              className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              onClick={handleDevelopersGuideClick}
            >
              Developers Guide
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${developersGuideOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`absolute top-full left-0 mt-2 w-64 bg-[#fff1f3] rounded-lg shadow-lg border py-2 transition-all duration-200 ${developersGuideOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
              }`}>
              {/* FTSO Guides Submenu */}
              <div className="relative">
                <button
                  className="flex w-full justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#ffe4e8] transition-colors"
                  onClick={handleFtsoClick}
                >
                  FTSO Guides
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${ftsoOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`${ftsoOpen ? "block" : "hidden"} pl-4`}>
                  {ftsoGuides.map((guide) => (
                    <a
                      key={guide.href}
                      href={guide.href}
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-[#ffe4e8] rounded-lg"
                      onClick={() => {
                        setFtsoOpen(false)
                        setDevelopersGuideOpen(false)
                      }}
                    >
                      {guide.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* FDC Guides Submenu */}
              <div className="relative">
                <button
                  className="flex w-full justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#ffe4e8] transition-colors"
                  onClick={handleFdcClick}
                >
                  FDC Guides
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${fdcOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`${fdcOpen ? "block" : "hidden"} pl-4`}>
                  {fdcGuides.map((guide) => (
                    <a
                      key={guide.href}
                      href={guide.href}
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-[#ffe4e8] rounded-lg"
                      onClick={() => {
                        setFdcOpen(false)
                        setDevelopersGuideOpen(false)
                      }}
                    >
                      {guide.name}
                    </a>
                  ))}

                  <button
                    className="flex w-full justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#ffe4e8] transition-colors"
                    onClick={handleWeb2jsonClick}
                  >
                    Web2JSON
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${web2jsonOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`${web2jsonOpen ? "block" : "hidden"} pl-6`}>
                    {web2json.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="block py-2 px-4 text-sm text-gray-700 hover:bg-[#ffe4e8] rounded-lg"
                        onClick={() => {
                          setWeb2jsonOpen(false)
                          setFdcOpen(false)
                          setDevelopersGuideOpen(false)
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
             
            </div>
           
          </div>
<div>
            <Link href="/analytics-dashboard"
             whileTap={{ scale: 0.95 }}
            >
               
                Analytics Dashboard
                
            </Link>
        </div>


          <div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        className=" bg-[#e93b6c] text-white py-2 text-md rounded-md px-6 shadow-lg  transition-all duration-200 flex items-center justify-center group hover:bg-[#d12d5a]"
                       
                        whileTap={{ scale: 0.95 }}
                       
                    >
                      Ask AI
                    </motion.button>
                </TooltipTrigger>
               
            </Tooltip>

            <GeneratorModal open={isOpen} onOpenChange={setIsOpen} />
        </div>
        
         
        </nav>
       <div className="hidden md:block">
       <WalletConnection />
       </div>
        <button
          className="md:hidden p-2 hover:bg-[#fff1f3] rounded-lg transition-colors duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`md:hidden bg-[#fff1f3]  border-t transition-all duration-300 overflow-hidden ${mobileOpen ? "h-[350px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}>

        <div className="px-6 flex flex-col gap-1">
          <button
            className="flex w-full justify-between items-center py-3 font-medium text-gray-700 hover:bg-[#ffe4e8] rounded-lg px-2 transition-colors duration-200"
            onClick={() => setDevelopersGuideOpen(!developersGuideOpen)}
          >
            Developers Guide
            <ChevronDown className={`transition-transform duration-200 ${developersGuideOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${developersGuideOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}>
            <div className="pl-4 py-2">
              {/* FTSO Guides */}
              <button
                className="flex w-full justify-between items-center py-2 font-medium text-gray-700 hover:bg-[#ffe4e8] rounded-lg transition-colors duration-200"
                onClick={() => setFtsoOpen(!ftsoOpen)}
              >
                FTSO Guides
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${ftsoOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${ftsoOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="pl-4 py-2">
                  {ftsoGuides.map((guide) => (
                    <a
                      key={guide.href}
                      href={guide.href}
                      className="block py-2 px-2 text-sm text-gray-700 hover:bg-[#ffe4e8] rounded-lg transition-colors duration-150"
                      onClick={handleMobileLinkClick}
                    >
                      {guide.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* FDC Guides */}
              <button
                className="flex w-full justify-between items-center py-2 font-medium text-gray-700 hover:bg-[#ffe4e8] rounded-lg transition-colors duration-200"
                onClick={() => setFdcOpen(!fdcOpen)}
              >
                FDC Guides
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${fdcOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${fdcOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="pl-4 py-2">
                  {fdcGuides.map((guide) => (
                    <a
                      key={guide.href}
                      href={guide.href}
                      className="block py-2 px-2 text-sm text-gray-700 hover:bg-[#ffe4e8] rounded-lg transition-colors duration-150"
                      onClick={handleMobileLinkClick}
                    >
                      {guide.name}
                    </a>
                  ))}

                  <button
                    className="flex w-full justify-between items-center py-2 font-medium text-gray-700 hover:bg-[#ffe4e8] rounded-lg transition-colors duration-200"
                    onClick={() => setWeb2jsonOpen(!web2jsonOpen)}
                  >
                    Web2JSON
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${web2jsonOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`${web2jsonOpen ? "block" : "hidden"} pl-6`}>
                    {web2json.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="block py-2 px-4 text-sm text-gray-700 hover:bg-[#ffe4e8] rounded-lg"
                        onClick={() => {
                          handleMobileLinkClick()
                          setFdcOpen(false)
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div>
            <Link href="/analytics-dashboard"
             whileTap={{ scale: 0.95 }}
            >
               
                Analytics Dashboard
                
            </Link>
        </div>
          <div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        className=" bg-[#e93b6c] text-white py-2 text-md rounded-md px-6 shadow-lg  transition-all duration-200 flex items-center justify-center group hover:bg-[#d12d5a]"
                       
                        whileTap={{ scale: 0.95 }}
                       
                    >
                      Ask AI
                    </motion.button>
                </TooltipTrigger>
               
            </Tooltip>

            <GeneratorModal open={isOpen} onOpenChange={setIsOpen} />
        </div>

        <div className="mt-12">
      <WalletConnection />
      </div>
        </div> 
     
      </div>
    </header>
  )
}
