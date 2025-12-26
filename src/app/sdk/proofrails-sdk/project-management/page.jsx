import { CodeBlock } from "@/components/proofrails/CodeBlock"; 

export default function ProjectManagement() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Project Management</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Programmatically manage projects and API keys.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <h3>Create Project</h3>
                <p>
                    You can create a project programmatically using the static method. This is useful for
                    platforms that want to provision keys for their users.
                </p>
                <CodeBlock code={`import ProofRails from '@proofrails/sdk';

const project = await ProofRails.createProject({
  label: "New User Project",
  network: "flare"
});

console.log(project.apiKey); // "pr_live_..."
console.log(project.projectId);`} />

                <h3>Get Project Info</h3>
                <p>Retrieve details about the current project.</p>
                <CodeBlock code={`const info = await sdk.project.getInfo();
console.log(info.name);
console.log(info.network);`} />

                <h3>Rotate API Key</h3>
                <p>Invalidate the old key and generate a new one.</p>
                <CodeBlock code={`const newKey = await sdk.project.rotateKey();
// Update your env vars with newKey`} />

                <h3>Admin Operations</h3>
                <p>Manage API keys for your organization (requires admin token).</p>
                <CodeBlock code={`// Check current identity
const info = await sdk.project.getInfo();
console.log(info.role); // 'admin' or 'user'

// Create extra keys
const subKey = await sdk.admin.createKey({ 
  label: "Service-Account-1" 
});

// Delete keys
await sdk.admin.deleteKey(subKey.id);`} />
            </div>
        </div>
    );
}
