import { Terminal } from "lucide-react"

export default function InstallationPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Installation</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Get started with the Flare Web SDK by installing the package into your project.
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Prerequisites</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Node.js 16.0 or later</li>
                    <li>npm, yarn, or pnpm</li>
                    <li>A TypeScript or JavaScript project</li>
                </ul>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Install Package</h2>
                <p className="text-gray-600">Run the following command in your terminal:</p>

                <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-2">
                        <Terminal size={16} className="text-gray-400" />
                        <span className="text-xs text-gray-400 font-mono">Terminal</span>
                    </div>
                    <code className="text-green-400 font-mono block">
                        npm install @flarestudio/flare-sdk ethers
                    </code>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> <code className="bg-blue-100 px-1 rounded">ethers</code> is a peer dependency and must be installed alongside the SDK.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">TypeScript Configuration</h2>
                <p className="text-gray-600">
                    The SDK is written in TypeScript and includes type definitions. No additional `@types` packages are needed.
                    Ensure your <code className="bg-gray-100 px-1 rounded text-sm">tsconfig.json</code> has the following settings for best compatibility:
                </p>

                <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
                    <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                        {`{
  "compilerOptions": {
    "target": "ES2020",
    "moduleResolution": "node",
    "strict": true
  }
}`}
                    </pre>
                </div>
            </div>
        </div>
    )
}
