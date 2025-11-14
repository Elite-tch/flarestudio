import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThirdwebProvider } from "thirdweb/react"
import { Header } from "@/components/layout/Header"
import { Toaster } from "react-hot-toast"
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata = {
  title: "FlareStudio - Flare Network Developer Toolkit & Playground",
  description:
    "The ultimate Flare Network developer platform. Connect wallets, access FTSO price feeds, bring Web2 data on-chain with FDC, test RPC calls, and deploy with ready-to-use Hardhat & Foundry examples.",
  keywords: "Flare Network, FTSO, FDC, blockchain development, Web3 toolkit, smart contracts, price oracles, Web2 data, Hardhat, Foundry, developer tools",
  openGraph: {
    title: "FlareStudio - Flare Network Developer Toolkit & Playground",
    description: "Build dApps faster on Flare Network with our interactive developer toolkit. Access FTSO oracles, FDC data, and ready-to-deploy code examples.",
    type: "website",
    url: "https://www.flarestudio.xyz",
    siteName: "FlareStudio",
    images: [
      {
        url: "/flarelogo.png", // Consider adding an OpenGraph image
        width: 1200,
        height: 630,
        alt: "FlareStudio - Flare Network Developer Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlareStudio - Flare Network Developer Toolkit",
    description: "The all-in-one platform for building on Flare Network with FTSO, FDC, and interactive code examples.",
    creator: "@yourhandle",
    images: ["https://flarestudio.vercel.app/twitter-image.png"], // Add your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <head>
        <title>FlareStudio - Flare Network Developer Toolkit & Playground</title>
      </head>
      <body className="font-sans bg-background text-foreground">
        <ThirdwebProvider>
          <Header />
          {children}
          <Analytics />
          <Toaster position="top-right" />
        </ThirdwebProvider>
      </body>
    </html>
  )
}