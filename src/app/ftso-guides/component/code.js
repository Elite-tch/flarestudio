"use client"
import Editor from '@monaco-editor/react'

export function CodeBlock({ code, language = 'javascript' }) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <Editor
        height="350px"
        language={language}
        value={code}
        beforeMount={(monaco) => {
          // Define a custom theme
          monaco.editor.defineTheme('my-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
              'editor.background': '#1a1a1a',
              'editor.lineNumbers': '#666',
            }
          })
        }}
        onMount={(editor) => {
          editor.updateOptions({
            readOnly: true
          })
          monaco.editor.setTheme('my-dark')
        }}
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
            quickSuggestions: false,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
          }}
      />
    </div>
  )
}