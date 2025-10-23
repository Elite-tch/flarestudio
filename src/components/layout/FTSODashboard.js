"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { loadFtsoContracts } from "@/lib/ftsoContracts";
import { toast } from "react-hot-toast";

const FTSO_SYMBOLS = ['BTC', 'ETH', 'XRP', 'ADA', 'ALGO', 'DOGE', 'FIL', 'LTC', 'XLM'];

export default function FTSODashboard() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [ftsoPrices, setFtsoPrices] = useState({});

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Install MetaMask first.");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const s = await provider.getSigner();
    const addr = await s.getAddress();
    setSigner(s);
    setAddress(addr);
    toast.success("Wallet connected.");
  };

  const fetchAllFTSOPrices = async () => {
    if (!signer) {
      toast.error("Connect wallet first.");
      return;
    }

    setLoading(true);
    const prices = {};

    try {
      const contracts = await loadFtsoContracts(signer);
      
      for (const symbol of FTSO_SYMBOLS) {
        try {
          const ftsoAddress = await contracts.ftsoRegistry.getFtsoBySymbol(symbol);
          if (ftsoAddress && ftsoAddress !== ethers.ZeroAddress) {
            const ftsoAbi = ["function getCurrentPrice() view returns (uint256 price, uint256 timestamp)"];
            const ftso = new ethers.Contract(ftsoAddress, ftsoAbi, signer);
            const [price] = await ftso.getCurrentPrice();
            prices[symbol] = Number(price) / 1e5;
          }
        } catch (err) {
          console.warn(`Could not fetch ${symbol}:`, err);
          prices[symbol] = null;
        }
      }
      
      setFtsoPrices(prices);
      toast.success("FTSO prices updated!");
    } catch (error) {
      console.error("Error fetching FTSO prices:", error);
      toast.error("Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: 20 }}>
      <h1>Flare FTSO Oracle Dashboard</h1>
      
      {/* Wallet Connection */}
      <div style={{ padding: 16, background: "#f5f5f5", borderRadius: 8, marginBottom: 20 }}>
        <div><strong>Wallet:</strong> {address ? `✅ ${address.slice(0,6)}...${address.slice(-4)}` : "❌ Not connected"}</div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={connectWallet} style={btnStyle}>
            Connect Wallet
          </button>
          <button onClick={fetchAllFTSOPrices} style={btnStyle} disabled={loading || !signer}>
            {loading ? "Fetching..." : "Refresh FTSO Prices"}
          </button>
        </div>
      </div>

      {/* FTSO Prices Display */}
      <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #e0e0e0", background: "#f8f9fa" }}>
          <h3 style={{ margin: 0 }}>Live FTSO Oracle Prices</h3>
          <div style={{ fontSize: "0.9em", color: "#666", marginTop: 4 }}>
            Real-time prices from Flare&apos;s decentralized oracle system
          </div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0 }}>
          {FTSO_SYMBOLS.map(symbol => (
            <div key={symbol} style={{ 
              padding: 16, 
              borderBottom: "1px solid #f0f0f0",
              borderRight: "1px solid #f0f0f0",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: 8 }}>
                {symbol}
              </div>
              <div style={{ fontSize: "1.1em", color: "#2c5aa0" }}>
                {ftsoPrices[symbol] ? `$${ftsoPrices[symbol].toLocaleString()}` : "—"}
              </div>
              <div style={{ fontSize: "0.8em", color: "#666", marginTop: 4 }}>
                FTSO Consensus Price
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Info */}
      <div style={{ marginTop: 20, padding: 16, background: "#e8f4fd", borderRadius: 8 }}>
        <h4>About Flare FTSO</h4>
        <p>The Flare Time Series Oracle provides decentralized price data using:</p>
        <ul>
          <li><strong>Weighted Median</strong>: Resistant to manipulation</li>
          <li><strong>Multiple Providers</strong>: Decentralized data sources</li>
          <li><strong>Commit-Reveal</strong>: Prevents gaming the system</li>
          <li><strong>Provider Rewards</strong>: Incentives for accurate data</li>
        </ul>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "#007bff",
  color: "white",
  padding: "10px 16px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};