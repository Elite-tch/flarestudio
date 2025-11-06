"use client"
import { Copy } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function CodeBlock({ code, language = 'javascript' }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy code')
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden my-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <span className="text-gray-300 text-sm font-medium">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <Copy size={16} />
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-gray-100 text-sm leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}