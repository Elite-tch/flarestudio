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


export default function PaymentPageWrapper() {
  return (
    <ProofRailsProvider apiKey={process.env.NEXT_PUBLIC_PROOFRAILS_KEY} network="auto">
      <PaymentPage />
    </ProofRailsProvider>
  );
}

function PaymentPage() {
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
    <div className="p-8 max-w-6xl mx-auto border rounded-xl space-y-10">
      <h1 className="text-2xl font-bold mb-6 pt-28">ProofRails SDK Test Dashboard</h1>

      <div className='grid md:grid-cols-2 gap-10'>
        {/* Project Management */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Project Management</h2>
          <input placeholder="Project Label" value={projectLabel} onChange={e => setProjectLabel(e.target.value)} className="w-full p-2 border rounded" />
          <input placeholder="Network (flare/coston2)" value={projectNetwork} onChange={e => setProjectNetwork(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={handleCreateProject} disabled={loading} className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">{loading ? 'Processing...' : 'Create Project'}</button>
          {projectResult && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(projectResult, null, 2)}</pre>}
        </section>

        {/* Payment */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Send Payment</h2>
          <input placeholder="Recipient Address (0x...)" value={to} onChange={e => setTo(e.target.value)} className="w-full p-2 border rounded" />
          <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded" />
          <input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full p-2 border rounded" />
          <input placeholder="Transaction Hash (optional)" value={txHash} onChange={e => setTxHash(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={handleSend} disabled={isLoading} className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">{isLoading ? 'Processing...' : 'Send Payment'}</button>
          {receipt && <div className="bg-green-50 p-4 rounded-lg text-green-800 mt-2">✅ Receipt Created!<br />ID: {receipt.id}</div>}
          {error && <div className="text-red-500 text-sm">{error.message}</div>}
        </section>

        {/* Templates */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Templates: Payment</h2>
          <button onClick={handleTemplatePayment} disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{loading ? 'Processing...' : 'Create Payment Template'}</button>
          {templateResult && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(templateResult, null, 2)}</pre>}
        </section>

        {/* Receipt Operations */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Receipt Operations</h2>
          <input placeholder="Receipt ID" value={receiptId} onChange={e => setReceiptId(e.target.value)} className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <button onClick={handleGetReceipt} className="p-2 bg-gray-200 rounded">Get Receipt</button>
            <button onClick={handleListReceipts} className="p-2 bg-gray-200 rounded">List Receipts</button>
            <button onClick={handleGetArtifacts} className="p-2 bg-gray-200 rounded">Get Artifacts</button>
          </div>


          {receiptDetails && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(receiptDetails, null, 2)}</pre>}
          {receiptsList.length > 0 && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(receiptsList, null, 2)}</pre>}
          {result && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(result, null, 2)}</pre>}
        </section>

        {/* Verification */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Verification</h2>
          <input placeholder="Bundle Hash" value={verifyHash} onChange={e => setVerifyHash(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={handleVerifyHash} className="p-2 bg-gray-200 rounded">Verify by Hash</button>
          <input placeholder="Bundle URL" value={verifyUrl} onChange={e => setVerifyUrl(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={handleVerifyUrl} className="p-2 bg-gray-200 rounded">Verify by URL</button>
          {verifyResult && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(verifyResult, null, 2)}</pre>}
        </section>

        {/* Validation */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Validation</h2>
          <select value={validationType} onChange={e => setValidationType(e.target.value)} className="w-full p-2 border rounded">
            <option value="amount">Amount</option>
            <option value="txHash">Transaction Hash</option>
            <option value="apiKey">API Key</option>
            <option value="purpose">Purpose</option>
          </select>
          <input placeholder="Value to validate" value={validationInput} onChange={e => setValidationInput(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={handleValidate} className="p-2 bg-gray-200 rounded">Validate</button>
          {validationResult !== null && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(validationResult, null, 2)}</pre>}
        </section>



        {/* Hooks */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">Hooks</h2>
          <div className="flex gap-2">
            <button onClick={handleFetchReceipts} className="p-2 bg-gray-200 rounded">Fetch Receipts (Hook)</button>
            <button onClick={handleFetchReceiptDetails} className="p-2 bg-gray-200 rounded">Fetch Receipt Details (Hook)</button>
            <button onClick={handleCreateProjectHook} className="p-2 bg-gray-200 rounded">Create Project (Hook)</button>
          </div>
          {receipts && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(receipts, null, 2)}</pre>}
          {hookReceipt && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(hookReceipt, null, 2)}</pre>}
          {rateLimitInfo && <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(rateLimitInfo, null, 2)}</pre>}
          {errorReceipts && <div className="text-red-500 text-sm">{errorReceipts.message}</div>}
          {errorReceiptDetails && <div className="text-red-500 text-sm">{errorReceiptDetails.message}</div>}
        </section>
      </div>
    </div>
  );
}