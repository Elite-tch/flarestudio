import { NextResponse } from "next/server";
import solc from "solc";
import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        const { files } = await req.json();

        if (!files || !Array.isArray(files) || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        // Prepare sources for solc
        const sources = {};
        files.forEach(file => {
            // Only compile solidity files
            if (file.path.endsWith(".sol")) {
                // Remove "contracts/" or "src/" prefix for solc input if needed, 
                // but usually keeping the relative path is fine as long as imports match.
                // For simplicity, we use the full path provided by the generator.
                sources[file.path] = {
                    content: file.content
                };
            }
        });

        const input = {
            language: "Solidity",
            sources: sources,
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["*"]
                    }
                }
            }
        };

        // Helper to find imports
        const findImports = (importPath) => {
            try {
                // 1. Handle relative imports (e.g. "./ERC721.sol" or "../utils/Context.sol")
                if (importPath.startsWith(".")) {
                    // Clean up the import path (remove ./ or ../)
                    // This is a simple heuristic. A real resolver would need full path resolution.
                    const normalizedImport = importPath.replace(/^(\.\/|\.\.\/)+/, "");

                    // Try to find a file that ends with this path
                    const foundFile = files.find(f => f.path.endsWith(normalizedImport) || f.path.endsWith("/" + normalizedImport));

                    if (foundFile) {
                        return { contents: foundFile.content };
                    }

                    return { error: `File not found: ${importPath}` };
                }

                // 2. Handle library imports (OpenZeppelin, Flare, Forge Std)
                let libraryPath;
                if (importPath.startsWith("@openzeppelin/")) {
                    libraryPath = path.resolve(process.cwd(), "node_modules", importPath);
                } else if (importPath.startsWith("@flarenetwork/")) {
                    libraryPath = path.resolve(process.cwd(), "node_modules", importPath);
                } else if (importPath.startsWith("forge-std/")) {
                    // Map forge-std/X.sol -> node_modules/forge-std/X.sol (NPM package structure is flat)
                    const relativePath = importPath.replace("forge-std/", "");
                    libraryPath = path.resolve(process.cwd(), "node_modules", "forge-std", relativePath);
                } else if (importPath.startsWith("ds-test/")) {
                    // Map ds-test/X.sol -> node_modules/ds-test/src/X.sol (ds-test usually has src)
                    const relativePath = importPath.replace("ds-test/", "");
                    // Check if ds-test has src or is flat. Usually it has src.
                    // Let's assume src for now, but we might need to check.
                    // Actually, ds-test npm package structure:
                    // node_modules/ds-test/src/test.sol
                    libraryPath = path.resolve(process.cwd(), "node_modules", "ds-test", "src", relativePath);
                }

                if (libraryPath && fs.existsSync(libraryPath)) {
                    return {
                        contents: fs.readFileSync(libraryPath, "utf8")
                    };
                }

                return { error: "File not found" };
            } catch (e) {
                return { error: e.message };
            }
        };

        // Compile
        const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

        // Check for errors
        const errors = [];
        const warnings = [];

        if (output.errors) {
            output.errors.forEach(err => {
                if (err.severity === "error") {
                    errors.push(err.formattedMessage);
                } else {
                    warnings.push(err.formattedMessage);
                }
            });
        }

        if (errors.length > 0) {
            return NextResponse.json({
                success: false,
                errors,
                warnings
            });
        }

        return NextResponse.json({
            success: true,
            warnings
        });

    } catch (error) {
        console.error("Compilation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
