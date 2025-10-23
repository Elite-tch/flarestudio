// src/components/CodeExample.js
"use client"

import React, { useState } from "react"
import Editor from "@monaco-editor/react"
import { Clipboard } from "lucide-react"
import { toast } from "react-hot-toast"

export default function CodeExample({ codeSnippets }) {
  const [language, setLanguage] = useState("javascript")

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[language])
    toast.success("Code copied to clipboard!")
  }

  return (
    <div className="mt-6 md:p-4 bg-transparent rounded-lg ">
      {/* Language Tabs */}
      <div className="flex gap-2 mb-2">
        {Object.keys(codeSnippets).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1 rounded-t-lg text-xs md:text-sm font-medium ${
              language === lang ? "bg-[#e93b6c] text-white" : "bg-[#ffe4e8] text-gray-700"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
        
      </div>

      {/* Monaco Editor */}
      <Editor
        height="350px"
        defaultLanguage={language}
        language={language}
        value={codeSnippets[language]}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollbar: { 
            vertical: 'hidden',
            horizontal: 'hidden',
            useShadows: false,
            verticalScrollbarSize: 0,
            horizontalScrollbarSize: 0,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollBeyondLastLine: false,
          padding: { top: 16 },
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
        }}
      />
      
      {/* Copy Button */}
      <div className="flex justify-end items-end mt-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-2 bg-[#e93b6c] rounded font-medium text-white hover:bg-[#d42a5b] transition-colors"
        >
          <Clipboard className="w-4 h-4" />
          Copy
        </button>
      </div>
    </div>
  )
}