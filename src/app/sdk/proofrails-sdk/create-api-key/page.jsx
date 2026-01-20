'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Copy, Check, Plus, Trash2, Key, Layers, Rocket } from 'lucide-react';

export default function CreateApiKeyPage() {
    const { isConnected, address } = useAccount();
    const [projects, setProjects] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Get wallet-specific storage key
    const getStorageKey = () => {
        return address ? `proofrails_projects_${address.toLowerCase()}` : null;
    };

    // Load projects when wallet connects
    useEffect(() => {
        if (isConnected && address) {
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                setProjects(JSON.parse(saved));
            } else {
                setProjects([]); // Reset projects if nothing saved for this wallet
            }
        } else {
            setProjects([]); // Clear projects when wallet disconnects
        }
    }, [isConnected, address]);

    // Save to local storage (wallet-specific)
    useEffect(() => {
        if (address) {
            const storageKey = getStorageKey();
            if (projects.length > 0) {
                localStorage.setItem(storageKey, JSON.stringify(projects));
            } else {
                // Remove the key if no projects (keeps localStorage clean)
                localStorage.removeItem(storageKey);
            }
        }
    }, [projects, address]);

    const createProject = async (e) => {
        e.preventDefault();
        console.log("🚀 Creating project... calling Production API"); // DEBUG LOG
        const formData = new FormData(e.target);
        const name = formData.get('name');

        try {
            // Call the real production API
            const response = await fetch('https://proofrails-clone-middleware.onrender.com/v1/public/api-keys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(name ? { label: name } : {}) // Send label if provided
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to create project: ${text}`);
            }

            const data = await response.json();

            // Map the API response to our UI structure
            // API returns: { id, project_id, label, api_key }
            const newProject = {
                id: data.project_id || data.id,
                name: data.label || name || 'New Project',
                network: 'flare',
                apiKey: data.api_key,
                createdAt: new Date().toISOString(),
                requests: 0
            };

            setProjects([...projects, newProject]);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to connect to server. Please try again.');
        }
    };

    const deleteProject = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            const updated = projects.filter(p => p.id !== id);
            setProjects(updated);
            // Storage will be automatically updated by the useEffect hook
        }
    };

    if (!isConnected) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Create API Key</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Connect your wallet to generate API keys for your projects.
                    </p>
                </div>

                <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                        <Key size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Connect Wallet Required</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
                        You need to connect your wallet to verify ownership and generate secure API keys.
                    </p>
                    <div className="not-prose">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Create API Key</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Manage your projects and keys.</p>
                </div>
                <div className="flex items-center gap-4 not-prose">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 flex items-center gap-2"
                    >
                        <Plus size={18} /> New Project
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                <StatsCard
                    icon={Layers}
                    label="Active Projects"
                    value={projects.length}
                    color="text-blue-500"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                />
                <StatsCard
                    icon={Rocket}
                    label="Total Requests"
                    value={projects.reduce((acc, p) => acc + p.requests, 0)}
                    color="text-purple-500"
                    bg="bg-purple-50 dark:bg-purple-900/20"
                />
                <StatsCard
                    icon={Key}
                    label="Active Keys"
                    value={projects.length}
                    color="text-amber-500"
                    bg="bg-amber-50 dark:bg-amber-900/20"
                />
            </div>

            {/* Projects List */}
            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed not-prose">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Layers size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-slate-500 mb-6 max-w-xs mx-auto">Create your first project to generate an API key and start building.</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 not-prose">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} onDelete={() => deleteProject(project.id)} />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 not-prose">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Project Name</label>
                                    <input
                                        name="name"
                                        required
                                        placeholder="e.g. My Awesome dApp"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Network</label>
                                    <select
                                        name="network"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option value="coston2">Coston2 Testnet (Dev)</option>
                                        <option value="flare">Flare Mainnet (Prod)</option>
                                    </select>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Choose Coston2 for development (free tokens) or Flare for production.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:opacity-90"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, color, bg }) {
    return (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}

function ProjectCard({ project, onDelete }) {
    const [copied, setCopied] = useState(false);

    const copyKey = () => {
        navigator.clipboard.writeText(project.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold">{project.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${project.network === 'flare'
                            ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                            : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                            }`}>
                            {project.network === 'flare' ? 'Mainnet' : 'Testnet'}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                    onClick={onDelete}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Project"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <code className="font-mono text-sm text-slate-600 dark:text-slate-300 truncate">
                    {project.apiKey}
                </code>
                <button
                    onClick={copyKey}
                    className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    {copied ? <><Check size={14} className="text-green-500" /> Copied</> : <><Copy size={14} /> Copy Key</>}
                </button>
            </div>
        </div>
    );
}
