"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { WalletConnection } from "./wallet-connection"
import Link from "next/link"

export function Header() {
  const [ftsoOpen, setFtsoOpen] = useState(false)
  const [fdcOpen, setFdcOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const ftsoGuides = [
    { name: "FTSO Overview", href: "/ftso-guides/overview" },
    { name: "Build Your First Application", href: "/ftso-guides/build-first-app" },
    { name: "Read Data Feeds On-Chain", href: "/ftso-guides/read-feeds-onchain" },
   // { name: "Read Data Feeds Off-Chain", href: "/ftso-guides/read-feeds-offchain" },
   // { name: "FTSO Data Feed IDs", href: "/ftso-guides/data-feed-ids" },
   // { name: "FTSO Decimals", href: "/ftso-guides/decimals" },
   // { name: "Use FTSO.js Library", href: "/ftso-guides/ftso-js-library" },
  //  { name: "Use FTSO Provider", href: "/ftso-guides/ftso-provider" },
  //  { name: "Use FTSO Manager", href: "/ftso-guides/ftso-manager" }
  ]

  const fdcGuides = [
    { name: "Getting Started", href: "/fdc/overview" },
    { name: "Web2JSON", href: "/fdc/web2json" },
   // { name: "Getting Attestations", href: "/fdc/getting-attestations" },
   // { name: "Attestation Types", href: "/fdc/attestation-types" }
  ]

  // Close dropdowns when clicking outside - simplified approach
  useEffect(() => {
    const handleClickOutside = () => {
      setFtsoOpen(false)
      setFdcOpen(false)
    }

    // Only add event listener if any dropdown is open
    if (ftsoOpen || fdcOpen) {
      document.addEventListener("click", handleClickOutside)
      
      return () => {
        document.removeEventListener("click", handleClickOutside)
      }
    }
  }, [ftsoOpen, fdcOpen])

  // Prevent the dropdown buttons from triggering the outside click
  const handleFtsoClick = (e) => {
    e.stopPropagation()
    setFtsoOpen(!ftsoOpen)
    setFdcOpen(false) // Close other dropdown
  }

  const handleFdcClick = (e) => {
    e.stopPropagation()
    setFdcOpen(!fdcOpen)
    setFtsoOpen(false) // Close other dropdown
  }

  // Close mobile menu when clicking links
  const handleMobileLinkClick = () => {
    setMobileOpen(false)
    setFtsoOpen(false)
    setFdcOpen(false)
  }

  return (
    <header className="fixed   border-b top-0 left-0 right-0 z-50 bg-[#ffe4e8]">
      <div className="container px-8 md:px-14 flex w-full mx-auto py-6 items-center justify-between">

        {/* Logo */}
        <Link href='/'>
        <Image
          src="/flarelogo.png"
          alt="Flare Studio Logo"
          width={150}
          height={150}
          className="w-32 h-auto cursor-pointer"
        />
</Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href='/'> Home </Link>
          {/* FTSO Guides Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              onClick={handleFtsoClick}
            >
              FTSO Guides
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${ftsoOpen ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`absolute top-full left-0 mt-2 w-64 bg-[#fff1f3] rounded-lg shadow-lg border py-2 transition-all duration-200 ${
              ftsoOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}>
              {ftsoGuides.map((guide) => (
                <a 
                  key={guide.href} 
                  href={guide.href} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#ffe4e8] transition-colors duration-150"
                  onClick={() => setFtsoOpen(false)}
                >
                  {guide.name}
                </a>
              ))}
            </div>
          </div>

          {/* FDC Guides Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              onClick={handleFdcClick}
            >
              FDC Guides
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${fdcOpen ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`absolute top-full left-0 mt-2 w-48 bg-[#fff1f3] rounded-lg shadow-lg border py-2 transition-all duration-200 ${
              fdcOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}>
              {fdcGuides.map((guide) => (
                <a 
                  key={guide.href} 
                  href={guide.href} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#ffe4e8] transition-colors duration-150"
                  onClick={() => setFdcOpen(false)}
                >
                  {guide.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Wallet */}
          <WalletConnection /> 
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 hover:bg-[#fff1f3] rounded-lg transition-colors duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`md:hidden bg-[#fff1f3] border-t transition-all duration-300 overflow-hidden ${
        mobileOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
      }`}>
        <div className="px-6">
          {/* FTSO Guides Mobile */}
          <button
            className="flex w-full justify-between items-center py-3 font-medium text-gray-700 hover:bg-[#ffe4e8] rounded-lg px-2 transition-colors duration-200"
            onClick={() => setFtsoOpen(!ftsoOpen)}
          >
            FTSO Guides
            <ChevronDown className={`transition-transform duration-200 ${ftsoOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${
            ftsoOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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

          {/* FDC Guides Mobile */}
          <button
            className="flex w-full justify-between items-center py-3 font-medium text-gray-700 hover:bg-[#ffe4e8] rounded-lg px-2 transition-colors duration-200"
            onClick={() => setFdcOpen(!fdcOpen)}
          >
            FDC Guides
            <ChevronDown className={`transition-transform duration-200 ${fdcOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${
            fdcOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
            </div>
          </div>

          {/* Wallet inside sidebar 
          <div className="pt-4 border-t mt-4">
            <WalletConnection />
          </div>*/}
        </div>
      </div>
    </header>
  )
}