
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThirdwebProvider } from "thirdweb/react"
import { Header } from "@/components/layout/Header"
import { Toaster } from "react-hot-toast"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata = {
  title: "FlareStudio - Interactive Flare Blockchain Playground",
  description:
    "Connect wallets, explore network data, test RPC queries, and learn Flare development with interactive code snippets.",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <ThirdwebProvider>
          <Header />
          {children}
          <Toaster position="top-right" />
          </ThirdwebProvider>
      </body>
    </html>
  )
}
