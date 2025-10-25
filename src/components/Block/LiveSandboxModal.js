'use client'
import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, Code, Eye } from "lucide-react"
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react"

export default function LiveSandboxModal({ isOpen, onClose, rpcUrl, examplePayload }) {
  const [running, setRunning] = useState(false)
  const [activeView, setActiveView] = useState('both') // 'code', 'preview', 'both'

  const buildCode = () => {
    const payload = JSON.stringify(examplePayload, null, 2)

    return `import React, { useEffect, useState } from "react"

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const payload = ${payload}
      try {
        const res = await fetch("${rpcUrl}", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const result = await res.json()
        if (result.result) {
          setData(result.result)
        } else {
          setError("No result found")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const hexToDec = (val) => {
    if (typeof val === "string" && val.startsWith("0x")) {
      try {
        return parseInt(val, 16).toLocaleString()
      } catch {
        return val
      }
    }
    return val
  }

  const renderValue = (val) => {
    if (val === null || val === undefined) return "null"
    if (typeof val === "string" || typeof val === "number") return hexToDec(val)
    if (Array.isArray(val)) return "[" + val.length + " items]"
    if (typeof val === "object") return "{object}"
    return String(val)
  }

  const extractImportant = (method, result) => {
    if (!result || typeof result !== "object") return result

    switch (method) {
      case "eth_getBlockByNumber":
      case "eth_getBlockByHash":
        return {
          BlockNumber: parseInt(result.number, 16),
          Hash: result.hash,
          Miner: result.miner,
          GasUsed: parseInt(result.gasUsed, 16),
          GasLimit: parseInt(result.gasLimit, 16),
          Timestamp: new Date(parseInt(result.timestamp, 16) * 1000).toLocaleString(),
          Transactions: result.transactions ? result.transactions.length : 0,
        }
      case "eth_getBalance":
        return { Balance: hexToDec(result) }
      case "eth_blockNumber":
        return { LatestBlock: hexToDec(result) }
      default:
        return result
    }
  }

  const clean = extractImportant("${examplePayload?.method}", data)

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h2 style={{ fontSize : 20 }}>Live RPC Result</h2>
      <p>RPC URL: ${rpcUrl}</p>
      <p>Method: ${examplePayload?.method}</p>

      {loading && <p>Fetching data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {clean && !error && (
        <div style={{
         textAlign: 'left',
          padding: 15,
          borderRadius: 8,
          marginTop: 10,
          lineHeight: 1.6,
          fontSize: "14px"
        }}>
          <h3>Response Summary</h3>
          <ul>
            {typeof clean === "object"
              ? Object.entries(clean).map(([key, val]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {renderValue(val)}
                  </li>
                ))
              : <p>{renderValue(clean)}</p>}
          </ul>
        </div>
      )}
    </div>
  )
}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] h-[95vh] p-3 flex flex-col">
        <div className="">
          <DialogHeader>
            <DialogTitle className='pt-3'>Live RPC Sandbox</DialogTitle>
            <DialogClose />
          </DialogHeader>
        </div>

        {/* Mobile View Toggle - Only shows on mobile */}
        <div className="md:hidden flex gap-1 mb-3">
          <Button
            variant={activeView === 'code' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('code')}
            className="flex-1 flex items-center gap-1 text-xs"
          >
            <Code className="w-3 h-3" />
            Code
          </Button>
          <Button
            variant={activeView === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('preview')}
            className="flex-1 flex items-center gap-1 text-xs"
          >
            <Eye className="w-3 h-3" />
            Preview
          </Button>
         
        </div>

        <SandpackProvider
          key={running ? "run" : "idle"}
          template="react"
          theme="dark"
          files={{
            "/App.js": buildCode(),
          }}
          options={{
            showTabs: false,
            showLineNumbers: true,
            activeFile: "/App.js",
            visibleFiles: ["/App.js"],
          }}
        >
          {/* Desktop Layout - Always side by side */}
          <div className="hidden md:block flex-1">
            <SandpackLayout>
              <SandpackCodeEditor style={{ height: "75vh" }} />
              <SandpackPreview style={{ height: "75vh" }} />
            </SandpackLayout>
          </div>

          {/* Mobile Layout - Switchable views */}
          <div className="md:hidden flex-1">
            
            
            {activeView === 'code' && (
              <div className="h-full border rounded-lg overflow-hidden">
                <SandpackCodeEditor style={{ height: "70vh" }} />
              </div>
            )}
            
            {activeView === 'preview' && (
              <div className="h-full border rounded-lg overflow-hidden">
                <SandpackPreview style={{ height: "70vh" }} />
              </div>
            )}
          </div>
        </SandpackProvider>

        <div className="text-xs text-gray-500 mt-2">
          Displays only key details depending on the tested RPC method.
          <span className="md:hidden block mt-1">Switch between Code and Preview views using the buttons above.</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}