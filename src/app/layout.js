import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  metadataBase: new URL("https://www.flarestudio.xyz"),
  title: "FlareStudio - Flare Network Developer Toolkit & Playground",
  description:
    "The ultimate Flare Network developer platform. Connect wallets, access FTSO price feeds, bring Web2 data on-chain with FDC, test RPC calls, and deploy with ready-to-use Hardhat & Foundry examples, also proofrails sdk.",
  keywords:
    "Flare Network, FTSO, FDC, blockchain development, Web3 toolkit, smart contracts, price oracles, Web2 data, Hardhat, Foundry, developer tools, Flare sdk",
  icons: {
    icon: "/flarelogo.png",
    shortcut: "/flarelogo.png",
    apple: "/flarelogo.png",
  },
  openGraph: {
    title: "FlareStudio - Flare Network Developer Toolkit & Playground",
    description:
      "Build dApps faster on Flare Network with our interactive developer toolkit. Access FTSO oracles, FDC data, and ready-to-deploy code examples.",
    type: "website",
    url: "https://www.flarestudio.xyz",
    siteName: "FlareStudio",
    images: [
      {
        url: "/flarelogo.png",
        width:800,
        height: 230,
        alt: "FlareStudio - Flare Network Developer Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlareStudio - Flare Network Developer Toolkit",
    description:
      "The all-in-one platform for building on Flare Network with FTSO, FDC, and interactive code examples.",
    creator: "@FlareStudioXYZ",
    images: ["/flarelogo.png"],
  },
  alternates: {
    canonical: "https://www.flarestudio.xyz",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head className="bg-[#ffe4e8] px-4">
        <title>FlareStudio - Flare Network Developer Toolkit & Playground</title>
        <link rel="apple-touch-icon" sizes="380x380" href="/apple-touch-icon.png"/>
<link rel="icon" type="image/png" sizes="320x300" href="/favicon-32x32.png"/>
<link rel="icon" type="image/png" sizes="160x300" href="/favicon-16x16.png"/>
<link rel="manifest" href="/site.webmanifest"/>
      </head>
      <body className="font-sans bg-background text-foreground">
        <Providers>
          <Header />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}