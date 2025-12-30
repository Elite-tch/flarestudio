'use client'

import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  ProofRailsProvider,
  useProofRails,
  useProofRailsPayment,
  useReceiptsList,
  useReceiptDetails,
  useCreateProject,
  useRateLimitInfo
} from '@proofrails/sdk/react';
import { useState } from 'react';
import ProofRails from '@proofrails/sdk';
import {
  validateAmount,
  validateTransactionHash,
  validateApiKey,
  validatePurpose
} from '@proofrails/sdk';
import { Download } from 'lucide-react';


export default function PaymentPageWrapper() {
  const [apiKey, setApiKey] = useState('');

  return (
    <ProofRailsProvider
      apiKey={apiKey}
      network="auto"
      baseUrl="https://proofrails-clone-middleware.onrender.com"
    >
      <PaymentPage setApiKey={setApiKey} hasApiKey={!!apiKey} />
    </ProofRailsProvider>
  );
}

function PaymentPage({ setApiKey, hasApiKey }) {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const sdk = useProofRails();
  const { createPayment, isLoading, error, receipt } = useProofRailsPayment();
  const [amount, setAmount] = useState('');
  const [to, setTo] = useState('');
  const [purpose, setPurpose] = useState('Peer Payment');
  const [txHash, setTxHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  // Receipt operations
  const [receiptId, setReceiptId] = useState('');
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [receiptsList, setReceiptsList] = useState([]);
  // Template
  const [templateResult, setTemplateResult] = useState(null);
  // Verification
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyUrl, setVerifyUrl] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  // Validation
  const [validationInput, setValidationInput] = useState('');
  const [validationType, setValidationType] = useState('amount');
  const [validationResult, setValidationResult] = useState(null);
  // Project
  const [projectLabel, setProjectLabel] = useState('Test Project');
  const [projectNetwork, setProjectNetwork] = useState('flare');
  const [projectResult, setProjectResult] = useState(null);
  // Hooks
  const { fetch: fetchReceipts, receipts, loading: loadingReceipts, error: errorReceipts } = useReceiptsList(sdk);
  const { fetch: fetchReceiptDetails, receipt: hookReceipt, loading: loadingReceiptDetails, error: errorReceiptDetails } = useReceiptDetails(sdk);
  const { create: createProject, loading: loadingCreateProject } = useCreateProject();
  const rateLimitInfo = useRateLimitInfo(sdk);



  if (!isConnected) return <ConnectButton />;

  // Payment
  const handleSend = async () => {
    if (!hasApiKey) {
      alert('Please create a project first to generate an API Key.');
      return;
    }
    try {
      let finalTxHash = txHash;

      if (!finalTxHash) {
        if (!amount || !to) {
          alert('Please provide amount and recipient');
          return;
        }
        finalTxHash = await sendTransactionAsync({
          to,
          value: parseEther(amount)
        });
        setTxHash(finalTxHash);
      }

      const newReceipt = await createPayment({
        amount: Number(amount),
        from: address,
        to,
        purpose,
        transactionHash: finalTxHash
      });

      // Auto-fill fields for easier testing
      if (newReceipt && newReceipt.id) {
        setReceiptId(newReceipt.id);
        setVerifyHash(finalTxHash);
        // Note: Bundle URL is not available immediately, it requires anchoring
      }

      alert('Payment Successful! Receipt ID copied to operations panel.');
    } catch (err) {
      console.error(err);
      alert('Error: ' + (err.message || err));
    }
  };





  // Template: Payment
  const handleTemplatePayment = async () => {
    setLoading(true);
    try {
      const res = await sdk.templates.payment({
        amount: Number(amount),
        from: address,
        to,
        purpose,
        transactionHash: txHash
      });
      setTemplateResult(res);
    } catch (err) {
      setTemplateResult(err);
    }
    setLoading(false);
  };

  // Receipt Operations
  const handleGetReceipt = async () => {
    setLoading(true);
    try {
      const res = await sdk.receipts.get(receiptId);
      setReceiptDetails(res);
    } catch (err) {
      setReceiptDetails(err);
    }
    setLoading(false);
  };
  const handleListReceipts = async () => {
    setLoading(true);
    try {
      const res = await sdk.receipts.list({ limit: 5, page: 1 });
      setReceiptsList(res.items || []);
    } catch (err) {
      setReceiptsList([err]);
    }
    setLoading(false);
  };
  const handleGetArtifacts = async () => {
    setLoading(true);
    try {
      const res = await sdk.receipts.getArtifacts(receiptId);
      setResult(res);
    } catch (err) {
      // Handle the "Not Found" specifically for artifacts as "Pending Anchoring"
      if (err.statusCode === 404) {
        setResult({
          status: 'info',
          message: 'Artifacts not found yet. The receipt is likely still anchoring (moving to permanent storage). Please wait 1-2 minutes and try again.',
          originalError: err
        });
      } else {
        setResult(err);
      }
    }
    setLoading(false);
  };

  // Verification
  const handleVerifyHash = async () => {
    setLoading(true);
    try {
      const res = await sdk.verify.byHash(verifyHash);
      setVerifyResult(res);
    } catch (err) {
      setVerifyResult(err);
    }
    setLoading(false);
  };
  const handleVerifyUrl = async () => {
    setLoading(true);
    try {
      const res = await sdk.verify.byUrl(verifyUrl);
      setVerifyResult(res);
    } catch (err) {
      setVerifyResult(err);
    }
    setLoading(false);
  };

  const handleVerifyByReceiptId = async () => {
    setLoading(true);
    try {
      const res = await sdk.verify.byReceiptId(receiptId);
      setVerifyResult(res);
    } catch (err) {
      setVerifyResult(err);
    }
    setLoading(false);
  };


  // Validation
  const handleValidate = () => {
    let res;
    switch (validationType) {
      case 'amount':
        res = validateAmount(validationInput);
        break;
      case 'txHash':
        res = validateTransactionHash(validationInput);
        break;
      case 'apiKey':
        res = validateApiKey(validationInput);
        break;
      case 'purpose':
        res = validatePurpose(validationInput);
        break;
      default:
        res = 'Unknown type';
    }
    setValidationResult(res);
  };

  // Project Management
  const handleCreateProject = async () => {
    setLoading(true);
    try {
      const res = await ProofRails.createProject({
        label: projectLabel,
        network: projectNetwork
      });
      setProjectResult(res);
      if (res && res.apiKey) {
        setApiKey(res.apiKey);
        alert(`Project Created! API Key set to: ${res.apiKey}`);
      }
    } catch (err) {
      setProjectResult(err);
    }
    setLoading(false);
  };

  // Hooks: Receipts List
  const handleFetchReceipts = async () => {
    await fetchReceipts({ limit: 5 });
  };
  // Hooks: Receipt Details
  const handleFetchReceiptDetails = async () => {
    await fetchReceiptDetails(receiptId);
  };
  // Hooks: Create Project
  const handleCreateProjectHook = async () => {
    await createProject(projectLabel, projectNetwork);
  };

  return (
    <div className="min-h-screen bg-[#ffe4e8] p-4 md:p-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-20">
          <h1 className="text-4xl font-bold text-[#e93b6c] mb-2">
            ProofRails SDK Test Dashboard
          </h1>
          <p className="text-gray-600">Test all SDK features in one place</p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Project Management */}
          <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🚀</span> Project Management
            </h2>
            <input
              placeholder="Project Label"
              value={projectLabel}
              onChange={e => setProjectLabel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e93b6c] focus:border-transparent transition"
            />
            <input
              placeholder="Network (flare/coston2)"
              value={projectNetwork}
              onChange={e => setProjectNetwork(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            <button
              onClick={handleCreateProject}
              disabled={loading}
              className="w-full p-3 bg-[#e93b6c] text-white rounded-lg hover:bg-[#d12a5a] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition shadow-md"
            >
              {loading ? 'Creating...' : '✨ Create Project'}
            </button>
            {projectResult && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="text-xs overflow-x-auto">{JSON.stringify(projectResult, null, 2)}</pre>
              </div>
            )}
          </section>

          {/* Send Payment */}
          <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">💸</span> Send Payment
            </h2>
            <input
              placeholder="Recipient Address (0x...)"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e93b6c] focus:border-transparent transition"
            />
            <input
              placeholder="Amount (in native token)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <input
              placeholder="Purpose"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <input
              placeholder="Transaction Hash (optional)"
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-full p-3 bg-[#e93b6c] text-white rounded-lg hover:bg-[#d12a5a] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition shadow-md"
            >
              {isLoading ? 'Processing...' : '💰 Send Payment'}
            </button>
            {receipt && (
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800 font-medium">✅ Receipt Created!</p>
                <p className="text-green-700 text-sm mt-1">ID: <code className="bg-green-100 px-2 py-1 rounded">{receipt.id}</code></p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                <p className="text-red-700 text-sm">{error.message}</p>
              </div>
            )}
          </section>

          {/* Receipt Operations */}
          <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📋</span> Receipt Operations
            </h2>
            <input
              placeholder="Receipt ID"
              value={receiptId}
              onChange={e => setReceiptId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e93b6c] focus:border-transparent transition"
            />
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleGetReceipt}
                className="p-2 bg-[#fff1f3] text-[#e93b6c] rounded-lg hover:bg-[#ffe4e8] transition text-sm font-medium"
              >
                Get Receipt
              </button>
              <button
                onClick={handleListReceipts}
                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
              >
                List All
              </button>
              <button
                onClick={handleGetArtifacts}
                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
              >
                Get Artifacts
              </button>
            </div>
            {receiptDetails && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Receipt Details:</p>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(receiptDetails, null, 2)}</pre>
              </div>
            )}
            {receiptsList.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Receipts List:</p>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(receiptsList, null, 2)}</pre>
              </div>
            )}
            {result && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Artifacts:</p>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </section>

          {/* Verification */}
          <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">✅</span> Verification
            </h2>

            {/* Verify by Hash */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Verify by Hash</label>
              <div className="flex gap-2">
                <input
                  placeholder="Bundle Hash (0x...)"
                  value={verifyHash}
                  onChange={e => setVerifyHash(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e93b6c] focus:border-transparent transition"
                />
                <button
                  onClick={handleVerifyHash}
                  className="px-4 py-2 bg-[#fff1f3] text-[#e93b6c] rounded-lg hover:bg-[#ffe4e8] transition font-medium whitespace-nowrap"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Verify by URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Verify by URL</label>
              <div className="flex gap-2">
                <input
                  placeholder="Bundle URL (https://...)"
                  value={verifyUrl}
                  onChange={e => setVerifyUrl(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  onClick={handleVerifyUrl}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium whitespace-nowrap"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Download ISO 20022 XML */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Download Receipt</label>
              <button
                className="w-full px-4 py-3 bg-[#e93b6c] text-white rounded-lg font-semibold hover:bg-[#d12a5a] flex items-center justify-center gap-2 transition shadow-md"
                onClick={() => window.open(`https://proofrails-clone-middleware.onrender.com/receipt/${receiptId}`, '_blank')}
                disabled={!receiptId}
              >
                <Download className="w-4 h-4" />
                Download ISO 20022 XML
              </button>
            </div>

            {verifyResult && (
              <div className={`p-4 rounded-lg border-l-4 ${verifyResult.matches_onchain
                ? 'bg-green-50 border-green-500'
                : 'bg-yellow-50 border-yellow-500'
                }`}>
                <p className="text-xs font-semibold mb-2">Verification Result:</p>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(verifyResult, null, 2)}</pre>
              </div>
            )}
          </section>

          {/* Templates */}
          <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📄</span> Templates
            </h2>
            <p className="text-sm text-gray-600">Create payment receipts using templates</p>
            <button
              onClick={handleTemplatePayment}
              disabled={loading}
              className="w-full p-3 bg-[#e93b6c] text-white rounded-lg hover:bg-[#d12a5a] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition shadow-md"
            >
              {loading ? 'Processing...' : '📝 Create Payment Template'}
            </button>
            {templateResult && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="text-xs overflow-x-auto">{JSON.stringify(templateResult, null, 2)}</pre>
              </div>
            )}
          </section>

          {/* Validation */}
          <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🔍</span> Validation
            </h2>
            <select
              value={validationType}
              onChange={e => setValidationType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e93b6c] focus:border-transparent transition"
            >
              <option value="amount">Amount</option>
              <option value="txHash">Transaction Hash</option>
              <option value="apiKey">API Key</option>
              <option value="purpose">Purpose</option>
            </select>
            <input
              placeholder="Value to validate"
              value={validationInput}
              onChange={e => setValidationInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
            <button
              onClick={handleValidate}
              className="w-full p-3 bg-[#e93b6c] text-white rounded-lg hover:bg-[#d12a5a] transition font-medium shadow-md"
            >
              ✓ Validate
            </button>
            {validationResult !== null && (
              <div className={`p-4 rounded-lg border-l-4 ${validationResult === true || validationResult?.valid
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
                }`}>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(validationResult, null, 2)}</pre>
              </div>
            )}
          </section>

          {/* Hooks */}
          <section className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🪝</span> React Hooks
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              <button
                onClick={handleFetchReceipts}
                className="p-3 bg-[#fff1f3] text-[#e93b6c] rounded-lg hover:bg-[#ffe4e8] transition font-medium"
              >
                Fetch Receipts
              </button>
              <button
                onClick={handleFetchReceiptDetails}
                className="p-3 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition font-medium"
              >
                Fetch Receipt Details
              </button>
              <button
                onClick={handleCreateProjectHook}
                className="p-3 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition font-medium"
              >
                Create Project
              </button>
            </div>
            {receipts && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Receipts:</p>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(receipts, null, 2)}</pre>
              </div>
            )}
            {hookReceipt && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Receipt Details:</p>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(hookReceipt, null, 2)}</pre>
              </div>
            )}
            {rateLimitInfo && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Rate Limit Info:</p>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(rateLimitInfo, null, 2)}</pre>
              </div>
            )}
            {errorReceipts && (
              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                <p className="text-red-700 text-sm">{errorReceipts.message}</p>
              </div>
            )}
            {errorReceiptDetails && (
              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                <p className="text-red-700 text-sm">{errorReceiptDetails.message}</p>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>ProofRails SDK v1.5+ • Built with Next.js & Rainbow Kit</p>
        </div>
      </div>
    </div>
  );
}