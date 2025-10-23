'use client'
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import Editor from "@monaco-editor/react"
import { Loader2 } from "lucide-react"

export default function LiveSandboxModal({ isOpen, onClose, examplePayload, rpcUrl }) {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)

  // Prefill editor when modal opens
  useEffect(() => {
    if (isOpen && examplePayload) {
      const exampleCode = `
/**
 * Edit payload or run directly
 */
const payload = ${JSON.stringify(examplePayload, null, 2)}
      `
      setCode(exampleCode)
      setOutput(null)
    }
  }, [isOpen, examplePayload])

  const handleRun = async () => {
    setLoading(true)
    setOutput(null)
    try {
      // Evaluate the code in the editor to get 'payload' object
      const asyncFunc = new Function("fetch", "rpcUrl", code + "\nreturn payload")
      const payloadObj = await asyncFunc(fetch, rpcUrl)

      // Make the RPC request
      const res = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadObj)
      })
      const data = await res.json()
      setOutput(data)
    } catch (err) {
      setOutput({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  // Recursive render function for structured output
  const renderData = (data) => {
    if (data === null || data === undefined) return <span className="text-gray-500">null</span>
    if (typeof data === "object") {
      if (Array.isArray(data)) {
        return <ul className="pl-4 list-disc space-y-1">{data.map((item, i) => <li key={i}>{renderData(item)}</li>)}</ul>
      } else {
        return (
          <div className="pl-2 border-l ml-1 mb-1 space-y-1">
            {Object.entries(data).map(([k,v]) => (
              <div key={k}>
                <strong>{k}: </strong>{renderData(v)}
              </div>
            ))}
          </div>
        )
      }
    }
    return <span>{data.toString()}</span>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-4xl h-[80vh] p-4 flex flex-col">
        <DialogHeader>
          <DialogTitle>Live Sandbox</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="flex-1 mt-2 flex flex-col gap-2">
          {/* Editor */}
          <Editor
            height="40%"
            defaultLanguage="javascript"
            value={code}
            onChange={setCode}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleRun} disabled={loading} className="bg-[#e93b6c] hover:bg-[#e93b6c] text-white">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run
            </Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>

          {/* Output */}
          <div className="mt-2 flex-1 overflow-auto bg-gray-50 border rounded p-3">
            {loading && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Running...</span>
              </div>
            )}
            {!loading && output && renderData(output)}
            {!loading && !output && <span className="text-gray-500">Output will appear here...</span>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
