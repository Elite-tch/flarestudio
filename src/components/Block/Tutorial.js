// src/components/TutorialSection.js
"use client"

import React from "react"
import CodeExample from "../code/code "
import BlockMetricsCharts from "./BlockMetricsCharts"

export default function TutorialSection({ blocks }) {
  const codeSnippets = {
    javascript: `import axios from "axios";

async function fetchBlocks() {
  try {
    const response = await axios.get("https://flare-explorer.flare.network/api/v2/blocks");
    const blocks = response.data.items;
    console.log(blocks);
  } catch (error) {
    console.error("Error fetching blocks:", error);
  }
}

fetchBlocks();`,
    typescript: `import axios from "axios";

interface Block { height: number; timestamp: string; /* ...other fields */ }

async function fetchBlocks(): Promise<Block[]> {
  try {
    const response = await axios.get("https://flare-explorer.flare.network/api/v2/blocks");
    const blocks: Block[] = response.data.items;
    console.log(blocks);
    return blocks;
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return [];
  }
}

fetchBlocks();`,
    python: `import requests

def fetch_blocks():
    try:
        response = requests.get("https://flare-explorer.flare.network/api/v2/blocks")
        blocks = response.json().get("items", [])
        print(blocks)
    except Exception as e:
        print("Error fetching blocks:", e)

fetch_blocks()`,
  }

  return (
    <div className="mt-8 p-4 md:p-6 bg-transaprent rounded-xl shadow border border-gray-200 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Understanding Flare Blocks</h2>
      <p className="text-gray-600 text-sm md:text-base">
        Blocks are the fundamental units of a blockchain, containing validated transactions. Here&apos;s a breakdown of the metrics you see above.
      </p>

      <ol className="list-decimal list-inside text-gray-700 space-y-2">
        <li><strong>Block Height:</strong> Sequential number of the block.</li>
        <li><strong>Age / Time:</strong> Timestamp when the block was created.</li>
        <li><strong>Gas Used:</strong> Total gas consumed by transactions.</li>
        <li><strong>Miner:</strong> Account that validated the block.</li>
        <li><strong>Reward:</strong> Tokens rewarded to the miner.</li>
        <li><strong>Burnt Fees:</strong> Transaction fees removed from circulation.</li>
        <li><strong>Base Fee:</strong> Minimum gas price for transactions in the block.</li>
      </ol>

      <p className="text-gray-600">
        You can fetch these blocks programmatically using the Flare Explorer API. Try the interactive code snippet below.
      </p>

      <CodeExample codeSnippets={codeSnippets} />
      <BlockMetricsCharts blocks={blocks} />

      <p className="text-gray-500 text-sm">
        This section helps you understand block data visually and integrate it into your dashboards or dApps.
      </p>
    </div>
  )
}
