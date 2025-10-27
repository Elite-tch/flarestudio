"use client"
import Image from "next/image"

import { WalletConnection } from "./wallet-connection"

export function Header() {
  return (
    <header className="fixed  flex top-0 left-0 right-0 z-50 bg-[#ffe4e8] ">
        
      {/* Gradient orbs */}

      <div className="container md:px-0 px-4 flex md:w-[90%] mx-auto  pt-4 pb-2 items-center justify-between gap-4">
        <div className="flex items-center  gap-2 min-w-0">
          <div className="">
            <Image
              src="/flarelogo.png"
              alt="Flare Studio Logo"
              width={150}
              height={150}
              className=" w-40 h-auto cursor-pointer "
            />
           
          </div>
            </div>

        <div className="flex-shrink-0">

      {/* */} <WalletConnection/>
        </div>
      </div>
    </header>
  )
}
