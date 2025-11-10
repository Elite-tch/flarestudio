"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { WalletConnection } from "./wallet-connection"
import Link from "next/link"

export function Header() {
  const [ftsoOpen, setFtsoOpen] = useState(false)
  const [fdcOpen, setFdcOpen] = useState(false)
  const [web2jsonOpen, setWeb2jsonOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const ftsoGuides = [
    { name: "FTSO Overview", href: "/ftso-guides/overview" },
    { name: "Build Your First Application", href: "/ftso-guides/build-first-app" },
    { name: "Read Data Feeds On-Chain", href: "/ftso-guides/read-feeds-onchain" },
  ]

  const fdcGuides = [
    { name: "Getting Started", href: "/fdc/overview" },
  ]

  const web2json = [
    { name: "Hardhat", href: "/fdc/guides/web2json/hardhat" },
    { name: "Foundry", href: "/fdc/guides/web2json/foundry" },
  ]

  useEffect(() => {
    const handleClickOutside = () => {
      setFtsoOpen(false)
      setFdcOpen(false)
      setWeb2jsonOpen(false)
    }

    if (ftsoOpen || fdcOpen || web2jsonOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [ftsoOpen, fdcOpen, web2jsonOpen])

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
    setFtsoOpen(false)
    setFdcOpen(false)
    setWeb2jsonOpen(false)
  }

  return (
    <header className="fixed border-b top-0 left-0 right-0 z-50 bg-[#ffe4e8]">
      <div className="container px-8 md:px-14 flex w-full mx-auto py-6 items-center justify-between">

        <Link href='/'>
          <Image
            src="/flarelogo.png"
            alt="Flare Studio Logo"
            width={150}
            height={150}
            className="w-32 h-auto cursor-pointer"
          />
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link href='/'> Home </Link>

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

          <div className="relative">
            <button
              className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              onClick={handleFdcClick}
            >
              FDC Guides
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${fdcOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`absolute top-full left-0 mt-2 w-56 bg-[#fff1f3] rounded-lg shadow-lg border py-2 transition-all duration-200 ${
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
                    }}
                    
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <WalletConnection />
        </nav>

        <button
          className="md:hidden p-2 hover:bg-[#fff1f3] rounded-lg transition-colors duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`md:hidden bg-[#fff1f3] border-t transition-all duration-300 overflow-hidden ${
        mobileOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
      }`}>

        <div className="px-6">
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
                    className="block py-2  px-4  text-sm text-gray-700 hover:bg-[#ffe4e8] rounded-lg"
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
    </header>
  )
}
