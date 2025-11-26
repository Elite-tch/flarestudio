import { NextResponse } from "next/server";
import { generateContractModification, parseUserPrompt, generateTestAndScript } from "@/lib/gemini";
import { fetchBaseContract } from "@/lib/openzeppelin";

export const maxDuration = 60; // Allow longer timeout for AI generation

export async function POST(req) {
    try {
        let { category, modules, toolchain, prompt } = await req.json();

        // FORCE HARDHAT ONLY
        toolchain = "hardhat";

        // 1. Parse User Prompt
        const spec = await parseUserPrompt(prompt, modules, toolchain);

        // 2. Fetch Base Contract
        const baseContract = await fetchBaseContract(category, modules);

        // 3. Generate Modified Contract
        const generatedCode = await generateContractModification(baseContract, spec);
        console.log("Generated Code Length:", generatedCode.length);
        console.log("Generated Code Preview:", generatedCode.substring(0, 200));

        // 4. Parse generated code for multiple files (if any)
        const files = [];
        // Use regex to split, handling potential spaces
        const parts = generatedCode.split(/--- ?FILE: ?/);

        // The first part is the main contract (or empty if the first line is a marker)
        let mainContractContent = parts[0].trim();

        // If the first part is empty (because the file started with a marker), skip it
        // But usually generateContractModification returns just code, or code + helpers.
        // If it returns code first, parts[0] is code.

        if (mainContractContent) {
            // Ensure license identifier and pragma are present if missing (basic check)
            if (!mainContractContent.includes("SPDX-License-Identifier")) {
                mainContractContent = "// SPDX-License-Identifier: MIT\n" + mainContractContent;
            }
            if (!mainContractContent.includes("pragma solidity")) {
                mainContractContent = `pragma solidity >=0.8.0 <0.9.0;\n` + mainContractContent;
            }

            files.push({
                path: `contracts/${spec.project_name}.sol`,
                content: mainContractContent
            });
        }

        // Handle helper files
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            // Split by "---" to separate filename from content
            // The regex split removes the "---FILE:" part, so we just look for the end marker "---"
            // But wait, the prompt says: ---FILE: path/to/file---
            // So splitting by "---FILE:" gives us: "path/to/file---\ncontent..."

            const endOfLineIndex = part.indexOf("---");
            if (endOfLineIndex !== -1) {
                let filePath = part.substring(0, endOfLineIndex).trim();
                const content = part.substring(endOfLineIndex + 3).trim();

                if (filePath && content) {
                    // Fix: Remove 'contracts/' prefix if the AI added it, to avoid contracts/contracts/
                    filePath = filePath.replace(/^contracts\//, "").replace(/^\.\/contracts\//, "");

                    // Fix: Only allow .sol files in this step. 
                    // The AI sometimes hallucinates deploy.js or .env here, which belongs in other steps.
                    if (filePath.endsWith(".sol")) {
                        files.push({
                            path: `contracts/${filePath}`,
                            content: content
                        });
                    }
                }
            }
        }

        // 5. Generate Tests and Scripts
        const testAndScriptCode = await generateTestAndScript(mainContractContent, spec, toolchain);
        const extraParts = testAndScriptCode.split(/--- ?FILE: ?/);

        for (let i = 1; i < extraParts.length; i++) {
            const part = extraParts[i];
            const endOfLineIndex = part.indexOf("---");
            if (endOfLineIndex !== -1) {
                const filePath = part.substring(0, endOfLineIndex).trim();
                const content = part.substring(endOfLineIndex + 3).trim();

                if (filePath && content) {
                    files.push({
                        path: filePath,
                        content: content
                    });
                }
            }
        }

        // 6. Generate Scaffolding (Hardhat/Foundry)
        if (toolchain === "hardhat") {
            files.push({
                path: "hardhat.config.js",
                content: `
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "${spec.solidity_version}",
  networks: {
    hardhat: {
      forking: {
        url: "https://coston-api.flare.network/ext/C/rpc",
        enabled: true
      }
    },
    coston: {
      url: "https://coston-api.flare.network/ext/C/rpc",
      accounts: [process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"]
    }
  }
};
`
            });
            files.push({
                path: "package.json",
                content: JSON.stringify({
                    name: spec.project_name.toLowerCase(),
                    version: "1.0.0",
                    scripts: {
                        "test": "hardhat test",
                        "compile": "hardhat compile",
                        "deploy": "hardhat run scripts/deploy.js --network coston"
                    },
                    dependencies: {
                        "@flarenetwork/flare-periphery-contracts": "^0.1.38",
                        "dotenv": "^16.0.0"
                    },
                    devDependencies: {
                        "hardhat": "^2.19.0",
                        "@nomicfoundation/hardhat-toolbox": "^4.0.0"
                    }
                }, null, 2)
            });
        } else {
            // Foundry - DISABLED
            // This block should not be reached due to the forced override above.
        }

        const readmeContent = toolchain === "hardhat" ? `# ${spec.project_name}

Generated by FlareAI (Hardhat).

## Features
${spec.main_features.map(f => `- ${f}`).join("\n")}

## Setup

1. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**:
   - Copy \`.env.example\` to \`.env\`.
   - Fill in your \`PRIVATE_KEY\` and API keys.

## Usage

- **Compile**: \`npm run compile\`
- **Test**: \`npm run test\`
- **Deploy**: \`npm run deploy\`
` : `# ${spec.project_name}

Generated by FlareAI (Foundry).

## Features
${spec.main_features.map(f => `- ${f}`).join("\n")}

## Setup

1. **Install Foundry**:
   \`\`\`bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   \`\`\`

2. **Install Dependencies (via NPM)**:
   \`\`\`bash
   npm install
   \`\`\`
   (This installs Flare contracts and forge-std into \`node_modules\`)

3. **Environment Variables**:
   - Copy \`.env.example\` to \`.env\`.
   - Fill in your \`PRIVATE_KEY\` and API keys.

## Usage

- **Compile**: \`npm run build\` (or \`forge build\`)
- **Test**: \`npm run test\` (or \`forge test\`)
- **Deploy**: \`npm run deploy\`
`;

        files.push({
            path: "README.md",
            content: readmeContent
        });

        console.log("Final Files Count:", files.length);
        console.log("Final Files Paths:", files.map(f => f.path));

        return NextResponse.json({
            projectName: spec.project_name,
            files: files
        });

    } catch (error) {
        console.error("Generation failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
