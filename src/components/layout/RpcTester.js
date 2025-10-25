'use client'
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import LiveSandboxModal from "../Block/LiveSandboxModal"
import toast from "react-hot-toast"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Copy, RotateCcw } from "lucide-react"

// Quick Methods Definition
const QUICK_METHODS = {
  getBalance: { method: "eth_getBalance", paramsSchema: ["address", "blockTag"], description: "Get the balance of an account" },
  getTransactionCount: { method: "eth_getTransactionCount", paramsSchema: ["address", "blockTag"], description: "Get the number of transactions sent from an account" },
  getBlockNumber: { method: "eth_blockNumber", paramsSchema: [], description: "Get the current block number" },
  getBlock: { method: "eth_getBlockByNumber", paramsSchema: ["blockTag", "fullTx"], description: "Get block information by block number" },
  getTransaction: { method: "eth_getTransactionByHash", paramsSchema: ["txHash"], description: "Get transaction by hash" },
  getTransactionReceipt: { method: "eth_getTransactionReceipt", paramsSchema: ["txHash"], description: "Get transaction receipt by hash" },
  getGasPrice: { method: "eth_gasPrice", paramsSchema: [], description: "Get the current gas price" },
  call: { method: "eth_call", paramsSchema: ["transaction", "blockTag"], description: "Execute a message call without creating a transaction" },
  estimateGas: { method: "eth_estimateGas", paramsSchema: ["transaction", "blockTag"], description: "Estimate the gas needed for a transaction" }
}

// Header Component
function Header({ rpcUrl, setRpcUrl }) {
  return (
    <div className="flex md:items-center justify-between md:flex-row flex-col gap-2 p-4 bg-[#ffe4e8] shadow-sm">
      <div className="text-lg font-semibold">FlareStudio RPC Tester</div>
      <div className="flex gap-2 items-end justify-start md:items-center ">
        <Input
          className="md:w-96 w-fit"
          placeholder="RPC URL, e.g. https://flare-api.flare.network/ext/C/rpc"
          value={rpcUrl}
          onChange={e => setRpcUrl(e.target.value)}
        />
      </div>
    </div>
  )
}

// Method Selector
function MethodSelector({ selected, setSelected, customMethod, setCustomMethod, loading }) {
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleValueChange = (value) => {
    if (value === "custom") {
      setShowCustomInput(true)
      setCustomMethod("")
    } else {
      setSelected(value)
      setShowCustomInput(false)
      setCustomMethod("")
    }
  }

  const currentMethod = showCustomInput ? customMethod : QUICK_METHODS[selected]?.method

  return (
    <div className="space-y-2 bg-[#ffe4e8]">
      <label className="text-sm font-medium">Select Method</label>
      {!showCustomInput ? (
        <Select value={selected} onValueChange={handleValueChange} disabled={loading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select method">{currentMethod}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(QUICK_METHODS).map(([key, { method, description }]) => (
              <SelectItem key={key} value={key}>
                <div className="flex flex-col">
                  <span className="font-medium">{method}</span>
                  <span className="text-xs text-gray-500 ">{description}</span>
                </div>
              </SelectItem>
            ))}
            <SelectItem value="custom">
              <div className="flex flex-col">
                <span className="font-medium text-[#e93b6c]">+ Custom Method</span>
                <span className="text-xs text-gray-500">Enter a custom RPC method</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom method name"
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value)}
              disabled={loading}
            />
            <Button
            className='bg-[#e93b6c] hover:bg-[#e93b6c] text-white hover:text-white'
              variant="outline"
              onClick={() => {
                setShowCustomInput(false)
                setSelected("getBalance")
                setCustomMethod("")
              }}
              disabled={loading}
            >
              Back
            </Button>
          </div>
          <p className="text-xs text-gray-500">Enter any JSON-RPC method name</p>
        </div>
      )}
      {QUICK_METHODS[selected]?.description && !showCustomInput && (
        <p className="text-sm text-gray-600 p-2 bg-[#fff1f3] rounded border">{QUICK_METHODS[selected].description}</p>
      )}
    </div>
  )
}

// Quick Mode Component
function QuickMode({ onSend, loading }) {
  const [selected, setSelected] = useState("getBalance")
  const [customMethod, setCustomMethod] = useState("")
  const [address, setAddress] = useState("")
  const [blockTag, setBlockTag] = useState("latest")
  const [txHash, setTxHash] = useState("")
  const [fullTx, setFullTx] = useState(true)
  const [transaction, setTransaction] = useState('{"to": "0x...", "data": "0x..."}')

  const currentMethod = customMethod || QUICK_METHODS[selected]?.method

  function buildParams() {
    if (customMethod) return []
    const schema = QUICK_METHODS[selected]?.paramsSchema || []
    const params = []
    schema.forEach(item => {
      if (item === "address") params.push(address || "")
      if (item === "blockTag") params.push(blockTag || "latest")
      if (item === "txHash") params.push(txHash || "")
      if (item === "fullTx") params.push(fullTx)
      if (item === "transaction") {
        try { params.push(JSON.parse(transaction || "{}")) }
        catch { params.push({}) }
      }
    })
    return params
  }

  const handleSend = () => {
    if (!currentMethod) { alert("Please select or enter a method"); return }
    onSend({ method: currentMethod, params: buildParams() })
  }

  const showCustomInput = !!customMethod

  return (
    <div className="p-4 bg-[#ffe4e8] rounded shadow-sm">
      <MethodSelector
        selected={selected}
        setSelected={setSelected}
        customMethod={customMethod}
        setCustomMethod={setCustomMethod}
        loading={loading}
      />
      {!showCustomInput && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          {QUICK_METHODS[selected]?.paramsSchema.includes("address") && <Input placeholder="Wallet address" value={address} onChange={e => setAddress(e.target.value)} disabled={loading} />}
          {QUICK_METHODS[selected]?.paramsSchema.includes("blockTag") && <Input placeholder="Block tag" value={blockTag} onChange={e => setBlockTag(e.target.value)} disabled={loading} />}
          {QUICK_METHODS[selected]?.paramsSchema.includes("txHash") && <Input placeholder="Transaction hash" value={txHash} onChange={e => setTxHash(e.target.value)} disabled={loading} />}
          {QUICK_METHODS[selected]?.paramsSchema.includes("transaction") && <Textarea placeholder='Transaction object' value={transaction} onChange={e => setTransaction(e.target.value)} disabled={loading} className="h-20" />}
          {QUICK_METHODS[selected]?.paramsSchema.includes("fullTx") && (
            <div className="flex items-center space-x-2">
              <Checkbox id="fullTx" checked={fullTx} onCheckedChange={setFullTx} disabled={loading} />
              <label htmlFor="fullTx" className="text-sm font-medium leading-none">Fetch full transactions</label>
            </div>
          )}
        </div>
      )}
      {showCustomInput && <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">For custom methods, use Advanced Mode to specify parameters manually.</div>}
      <Button onClick={handleSend} disabled={loading || !currentMethod} className="w-full bg-[#e93b6c] hover:bg-[#e93b6c] mt-2">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send {showCustomInput ? 'Custom' : 'Quick'} Request
      </Button>
    </div>
  )
}

// Advanced Mode Component
function AdvancedMode({ onSend, loading }) {
  const [method, setMethod] = useState("")
  const [paramsText, setParamsText] = useState("")
  const [advancedLoading, setAdvancedLoading] = useState(false)
  const isLoading = loading || advancedLoading

  const send = async () => {
    let parsed = []
    try {
      parsed = JSON.parse(paramsText)
      if (!Array.isArray(parsed)) throw new Error("Params must be a JSON array")
    } catch (err) {
      alert("Invalid params JSON: " + err.message)
      return
    }
    setAdvancedLoading(true)
    try { await onSend({ method, params: parsed }) } finally { setAdvancedLoading(false) }
  }

  return (
    <div className="p-4 bg-[#ffe4e8] rounded shadow-sm mt-4">
      <div className="flex gap-2 items-center">
        <Input value={method} onChange={e => setMethod(e.target.value)} disabled={isLoading} placeholder="RPC method eg. eth_call" />
        <Button className="ml-auto bg-[#e93b6c] hover:bg-[#e93b6c]" onClick={send} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Advanced
        </Button>
      </div>
      <Textarea className="w-full text-sm mt-3" value={paramsText} onChange={e => setParamsText(e.target.value)} placeholder='eg. ["0x4da91D45521998F8341", "latest"]' disabled={isLoading} rows={4} />
      <div className="mt-2 text-xs text-gray-500">Enter parameters as a JSON array.</div>
    </div>
  )
}

// Response Viewer
function ResponseViewer({ response, loading, error, onTryLive }) {
  const [showReadable, setShowReadable] = useState(false)

  const toReadable = obj => {
    try {
      return JSON.stringify(obj, (key, val) => {
        if (typeof val === "string" && val.startsWith("0x")) {
          const num = parseInt(val, 16)
          if (!isNaN(num)) return `${val} (${num})`
        }
        return val
      }, 2)
    } catch { return JSON.stringify(obj, null, 2) }
  }

  const displayData = showReadable ? toReadable(response) : JSON.stringify(response, null, 2)

  return (
    <div className="p-4 mt-4 bg-[#ffe4e8] rounded shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-medium">Response</div>
        <div className="flex items-center gap-3">
        {response && (
          <Button className='py-2' variant="outline"  onClick={() => setShowReadable(!showReadable)}>
            {showReadable ? "View Raw" : "View Readable"}
          </Button>
        )}

{response &&  onTryLive && (
          <Button
            className=" bg-[#e93b6c] hover:bg-[#e93b6c] text-white"
            onClick={onTryLive}
          >
            Try Live
          </Button>
        )}
        </div>
      </div>

      <div className="mt-3">
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="text-sm font-medium text-red-800 mb-1">Error:</div>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{String(error)}</pre>
          </div>
        )}

        {response && (
          <pre className="bg-gray-50 border rounded p-3 text-sm overflow-auto max-h-96">
            {displayData}
          </pre>
        )}

        {!response && !error && !loading && (
          <div className="text-sm text-gray-700 p-4 text-center border-2 border-[#e93b6c]/40 border-dashed rounded">
            No response yet. Send a request above.
          </div>
        )}

        {/* Try Live Button */}
       
      </div>
    </div>
  )
}


// Main RpcTester Component
export default function RpcTester() {
  const [rpcUrl, setRpcUrl] = useState("https://flare-api.flare.network/ext/C/rpc")
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastPayload, setLastPayload] = useState(null)
  const [mode, setMode] = useState("quick") // quick or advanced
  const [sandboxOpen, setSandboxOpen] = useState(false)


  const handleSend = async ({ method, params }) => {
    if (!rpcUrl) { alert("Please set an RPC URL first"); return }
    const payload = { jsonrpc: "2.0", id: Date.now(), method, params: params || [] }
    setLastPayload(payload)
    setLoading(true)
    setError(null)
    setResponse(null)
    try {
      const res = await fetch(rpcUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const text = await res.text()
      try { setResponse(JSON.parse(text)) } catch { setResponse({ raw: text }) }
      if (!res.ok) setError(`HTTP ${res.status} ${res.statusText}`)
    } catch (err) { setError(err.message || String(err)) } finally { setLoading(false) }
  }

  const copyPayload = async () => {
    if (!lastPayload) {
      toast.error("No payload to copy. Send a request first.")
      return
    }
  
    try {
      await navigator.clipboard.writeText(JSON.stringify(lastPayload, null, 2))
      toast.success("Payload copied to clipboard!")
    } catch {
      toast.error("Failed to copy payload.")
    }
  }
  
  const resetRpc = () => { setRpcUrl("https://flare-api.flare.network/ext/C/rpc"); setResponse(null); setError(null); setLastPayload(null) }

  return (
    <div className="min-h-screen bg-[#fff1f3] p-6">
      <div className="max-w-5xl mx-auto">
        <Header rpcUrl={rpcUrl} setRpcUrl={setRpcUrl} />
        
        {/* Mode Toggle */}
        <div className="flex gap-2 mt-4">
  <Button
    className={`${
      mode === "quick" ? "bg-[#e93b6c] text-white" : "bg-[#ffe4e8] text-gray-700"
    } hover:${mode === "quick" ? "bg-[#e93b6c]/70" : "bg-[#ffe4e8]"}`}
    onClick={() => setMode("quick")}
  >
    Quick Mode
  </Button>

  <Button
    className={`${
      mode === "advanced" ? "bg-[#e93b6c] text-white" : "bg-[#ffe4e8] text-gray-700"
    } hover:${mode === "advanced" ? "bg-[#e93b6c]/70" : "bg-[#ffe4e8]"}`}
    onClick={() => setMode("advanced")}
  >
    Advanced Mode
  </Button>

  
</div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            {mode === "quick" && <QuickMode onSend={handleSend} loading={loading} />}
            {mode === "advanced" && <AdvancedMode onSend={handleSend} loading={loading} />}
          </div>

          <div>
            <div className="p-4 bg-[#ffe4e8] rounded shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">Last Request</div>
                <div className="text-sm text-gray-500">ID: {lastPayload?.id ?? "-"}</div>
              </div>

              <div className="mt-3">
                {lastPayload ? (
                  <pre className="bg-gray-50 border rounded p-3 text-sm">{JSON.stringify(lastPayload, null, 2)}</pre>
                ) : (
                  <div className="text-sm text-gray-500">No request sent yet.</div>
                )}

                <div className="mt-3 flex gap-6">
                <Button
  className={`flex items-center gap-1 text-sm font-medium
    ${!lastPayload || loading
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-pink-100 text-pink-700 hover:bg-pink-200"
    }`}
  onClick={copyPayload}
  disabled={!lastPayload || loading}
  size="sm"
>
  <Copy className="h-4 w-4" />
  Copy
</Button>


                  <Button variant="outline" onClick={resetRpc} disabled={loading} size="sm" className='bg-[#e93b6c] hover:bg-[#e93b6c] hover:text-white text-white'>
                    <RotateCcw className="h-4 w-4" /> Reset RPC URL
                  </Button>
                </div>
              </div>
            </div>
            <ResponseViewer response={response} loading={loading} error={error}  onTryLive={() => setSandboxOpen(true)} />
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Tip: use Quick Mode to run common methods, or Advanced Mode to paste custom method and params.
        </div>

        <LiveSandboxModal
  isOpen={sandboxOpen}
  onClose={() => setSandboxOpen(false)}
  examplePayload={lastPayload}
  rpcUrl={rpcUrl}
/>

      </div>
    </div>
  )
}
