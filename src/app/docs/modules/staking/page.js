'use client';
import { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

function CodeBlock({ code, language = 'javascript' }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <button
                onClick={copyToClipboard}
                className="absolute right-3 top-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                title="Copy code"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                )}
            </button>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-gray-300 font-mono text-sm">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

function TabbedCode({ jsCode, tsCode }) {
    const [activeTab, setActiveTab] = useState('js');

    return (
        <div>
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => setActiveTab('js')}
                    className={`px-4 py-2 rounded-t-lg font-semibold text-sm ${activeTab === 'js'
                        ? 'bg-[#e93b6c] text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                >
                    JavaScript
                </button>
                <button
                    onClick={() => setActiveTab('ts')}
                    className={`px-4 py-2 rounded-t-lg font-semibold text-sm ${activeTab === 'ts'
                        ? 'bg-[#e93b6c] text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                >
                    TypeScript
                </button>
            </div>
            <CodeBlock code={activeTab === 'js' ? jsCode : tsCode} />
        </div>
    );
}

export default function StakingPage() {
    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Staking & Delegation Module</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Earn rewards on Flare Network by wrapping FLR to WFLR and delegating to FTSO data providers. Learn how staking and delegation work on Flare.
                </p>
            </div>



            {/* Quick Start */}
            <div className="bg-pink-50 border-l-4 border-[#e93b6c] p-6 rounded-r-lg">
                <h3 className="text-lg font-bold text-[#e93b6c] mb-2">Quick Start</h3>
                <p className="text-gray-700 mb-4">
                    Initialize the SDK and start wrapping FLR. Works on Flare Mainnet, Coston2, Songbird, and Coston testnets.
                </p>
                <TabbedCode
                    jsCode={`import ${'{ FlareSDK }'} from '@flarestudio/flare-sdk';

// Initialize SDK (choose your network)
const sdk = new FlareSDK(${'{ network: "flare" }'}); // or 'coston2', 'songbird', 'coston'

// Wrap 100 FLR to WFLR
const tx = await sdk.staking.wrap('100', signer);
await tx.wait();
console.log('Wrapped successfully!');`}
                    tsCode={`import ${'{ FlareSDK }'} from '@flarestudio/flare-sdk';
import type ${'{ Signer }'} from 'ethers';

// Initialize SDK (choose your network)
const sdk = new FlareSDK(${'{ network: "flare" }'}); // or 'coston2', 'songbird', 'coston'

// Wrap 100 FLR to WFLR
const tx = await sdk.staking.wrap('100', signer as Signer);
await tx.wait();
console.log('Wrapped successfully!');`}
                />
            </div>

            {/* How Staking Works */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">How Staking Works on Flare</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div className="border-l-4 border-[#e93b6c] pl-4 bg-gray-50 p-4 rounded-r">
                        <h3 className="font-semibold text-gray-900 mb-2">1. Wrap FLR to WFLR</h3>
                        <p className="text-sm text-gray-600">Convert your native FLR to WFLR (Wrapped FLR) to participate in delegation</p>
                    </div>
                    <div className="border-l-4 border-[#e93b6c] pl-4 bg-gray-50 p-4 rounded-r">
                        <h3 className="font-semibold text-gray-900 mb-2">2. Delegate to FTSO Providers</h3>
                        <p className="text-sm text-gray-600">Delegate your WFLR to up to 2 FTSO data providers (split 50/50 or 100% to one)</p>
                    </div>
                    <div className="border-l-4 border-[#e93b6c] pl-4 bg-gray-50 p-4 rounded-r">
                        <h3 className="font-semibold text-gray-900 mb-2">3. Earn Rewards</h3>
                        <p className="text-sm text-gray-600">Rewards are distributed every ~3.5 days based on provider performance</p>
                    </div>
                    <div className="border-l-4 border-[#e93b6c] pl-4 bg-gray-50 p-4 rounded-r">
                        <h3 className="font-semibold text-gray-900 mb-2">4. Claim Rewards</h3>
                        <p className="text-sm text-gray-600">Claim your rewards within 90 days or they expire and are burned</p>
                    </div>
                </div>
            </div>

            {/* SDK Methods */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">SDK Methods</h2>

                {/* Wrap */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Wrap FLR to WFLR</h3>
                    <p className="text-gray-600 mb-3">
                        Convert native FLR to WFLR. This is required before you can delegate.
                    </p>
                    <TabbedCode
                        jsCode={`// Wrap 100 FLR
const tx = await sdk.staking.wrap('100', signer);
console.log('Transaction hash:', tx.hash);

// Wait for confirmation
await tx.wait();
console.log('Wrapped successfully!');`}
                        tsCode={`import type ${'{ Signer, TransactionResponse }'} from 'ethers';

// Wrap 100 FLR
const tx: TransactionResponse = await sdk.staking.wrap('100', signer as Signer);
console.log('Transaction hash:', tx.hash);

// Wait for confirmation
await tx.wait();
console.log('Wrapped successfully!');`}
                    />
                </div>

                {/* Unwrap */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Unwrap WFLR to FLR</h3>
                    <p className="text-gray-600 mb-3">
                        Convert WFLR back to native FLR. No lock-up period required.
                    </p>
                    <TabbedCode
                        jsCode={`// Unwrap 50 WFLR back to FLR
const tx = await sdk.staking.unwrap('50', signer);
await tx.wait();
console.log('Unwrapped successfully!');`}
                        tsCode={`import type ${'{ Signer }'} from 'ethers';

// Unwrap 50 WFLR back to FLR
const tx = await sdk.staking.unwrap('50', signer as Signer);
await tx.wait();
console.log('Unwrapped successfully!');`}
                    />
                </div>

                {/* Get Balance */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Get WFLR Balance</h3>
                    <p className="text-gray-600 mb-3">
                        Check your WFLR balance. No wallet connection required.
                    </p>
                    <TabbedCode
                        jsCode={`const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
const balance = await sdk.staking.getWNatBalance(address);
console.log(\`WFLR Balance: \$${'{'}balance${'}'} WFLR\`);
// Output: "WFLR Balance: 1234.56 WFLR"`}
                        tsCode={`const address: string = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
const balance: string = await sdk.staking.getWNatBalance(address);
console.log(\`WFLR Balance: \$${'{'}balance${'}'} WFLR\`);
// Output: "WFLR Balance: 1234.56 WFLR"`}
                    />
                </div>

                {/* Delegate */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Delegate to FTSO Provider</h3>
                    <p className="text-gray-600 mb-3">
                        Delegate your vote power to an FTSO provider. You can delegate to up to 2 providers.
                    </p>
                    <TabbedCode
                        jsCode={`const providerAddress = '0xProviderAddress...';

// Delegate 50% of your vote power
const tx = await sdk.staking.delegate(providerAddress, 50, signer);
await tx.wait();
console.log('Delegated 50% to provider');

// Delegate 100% to one provider
const tx2 = await sdk.staking.delegate(providerAddress, 100, signer);
await tx2.wait();`}
                        tsCode={`import type ${'{ Signer }'} from 'ethers';

const providerAddress: string = '0xProviderAddress...';

// Delegate 50% of your vote power
const tx = await sdk.staking.delegate(providerAddress, 50, signer as Signer);
await tx.wait();
console.log('Delegated 50% to provider');

// Delegate 100% to one provider
const tx2 = await sdk.staking.delegate(providerAddress, 100, signer as Signer);
await tx2.wait();`}
                    />
                </div>

                {/* Get Delegations */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Current Delegations</h3>
                    <p className="text-gray-600 mb-3">
                        View your current delegation setup.
                    </p>
                    <TabbedCode
                        jsCode={`const delegations = await sdk.staking.getDelegations(address);

delegations.forEach(del => ${'{'}
  console.log(\`Provider: \$${'{'}del.provider${'}'}\`);
  console.log(\`Percentage: \$${'{'}del.percentage${'}'}%\`);
${'}'});

// Example output:
// ${'{'} 
//   provider: '0x123...',
//   percentage: 50
// ${'}'}
// ${'{'} 
//   provider: '0x456...',
//   percentage: 50
// ${'}'}`}
                        tsCode={`import type ${'{ DelegationInfo }'} from '@flarestudio/flare-sdk';

const delegations: DelegationInfo[] = await sdk.staking.getDelegations(address);

delegations.forEach((del: DelegationInfo) => ${'{'}
  console.log(\`Provider: \$${'{'}del.provider${'}'}\`);
  console.log(\`Percentage: \$${'{'}del.percentage${'}'}%\`);
${'}'});`}
                    />
                </div>

                {/* Claim Rewards */}
                <div className="border-l-4 border-[#e93b6c] pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Claim Rewards</h3>
                    <p className="text-gray-600 mb-3">
                        Claim your FTSO delegation rewards. Rewards expire after 90 days!
                    </p>
                    <TabbedCode
                        jsCode={`// Get unclaimed epochs first
const epochs = await sdk.staking.getUnclaimedEpochs(address);
console.log(\`Unclaimed epochs: \$${'{'}epochs.length${'}'}\`);

// Claim all unclaimed rewards
const tx = await sdk.staking.claimRewards(undefined, signer);
await tx.wait();
console.log('Rewards claimed!');

// Or claim specific epochs
const tx2 = await sdk.staking.claimRewards([100, 101, 102], signer);
await tx2.wait();`}
                        tsCode={`import type ${'{ Signer }'} from 'ethers';

// Get unclaimed epochs first
const epochs: number[] = await sdk.staking.getUnclaimedEpochs(address);
console.log(\`Unclaimed epochs: \$${'{'}epochs.length${'}'}\`);

// Claim all unclaimed rewards
const tx = await sdk.staking.claimRewards(undefined, signer as Signer);
await tx.wait();
console.log('Rewards claimed!');

// Or claim specific epochs
const tx2 = await sdk.staking.claimRewards([100, 101, 102], signer as Signer);
await tx2.wait();`}
                    />
                </div>
            </div>

            {/* Complete React Example */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Complete React/Next.js Example</h2>
                <p className="text-gray-600">
                    Full production-ready staking dashboard with wallet connection, balance display, wrapping, unwrapping, delegation, and reward claiming. Includes beautiful UI with gradient design.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Make sure to match your SDK network with your MetaMask network. Use <code className="bg-yellow-100 px-1 rounded">&apos;coston2&apos;</code> for testnet or <code className="bg-yellow-100 px-1 rounded">&apos;flare&apos;</code> for mainnet.
                    </p>
                </div>
                <TabbedCode
                    jsCode={`'use client';
import ${'{ useState }'} from 'react';
import ${'{ FlareSDK }'} from '@flarestudio/flare-sdk';

export default function StakingDashboard() ${'{'}
  const [sdk] = useState(() => new FlareSDK(${'{ network: "coston2" }'}));
  const [address, setAddress] = useState('');
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Balances
  const [flrBalance, setFlrBalance] = useState('0');
  const [wflrBalance, setWflrBalance] = useState('0');
  const [votePower, setVotePower] = useState('0');
  
  // Delegations
  const [delegations, setDelegations] = useState([]);
  
  // Rewards
  const [unclaimedEpochs, setUnclaimedEpochs] = useState([]);
  const [totalRewards, setTotalRewards] = useState('0');

  // Load all data
  const loadData = async (addr) => ${'{'}
    const targetAddress = addr || address;
    if (!targetAddress) return;

    try ${'{'}
      const balance = await sdk.wallet.getBalance();
      setFlrBalance(parseFloat(balance.flr).toFixed(2));

      const wflr = await sdk.staking.getWNatBalance(targetAddress);
      setWflrBalance(parseFloat(wflr).toFixed(2));

      const vp = await sdk.staking.getVotePower(targetAddress);
      setVotePower(parseFloat(vp).toFixed(2));

      const dels = await sdk.staking.getDelegations(targetAddress);
      setDelegations(dels);

      const epochs = await sdk.staking.getUnclaimedEpochs(targetAddress);
      setUnclaimedEpochs(epochs);

      if (epochs.length > 0) ${'{'}
        let total = 0;
        for (const epoch of epochs) ${'{'}
          const reward = await sdk.staking.getUnclaimedReward(targetAddress, epoch);
          total += parseFloat(reward);
        ${'}'}
        setTotalRewards(total.toFixed(4));
      ${'}'}
    ${'}'} catch (error) ${'{'}
      console.error('Failed to load data:', error);
      alert('Failed to load data: ' + error.message);
    ${'}'}
  ${'}'};

  // Connect wallet
  const connectWallet = async () => ${'{'} 
    try ${'{'} 
      setLoading(true);
      if (!window.ethereum) ${'{'}
        alert('Please install MetaMask!');
        return;
      ${'}'}

      const ${'{ BrowserProvider }'} = await import('ethers');
      const provider = new BrowserProvider(window.ethereum);
      const walletSigner = await provider.getSigner();
      setSigner(walletSigner);
      
      const addr = await walletSigner.getAddress();
      setAddress(addr);
      await sdk.wallet.connect(window.ethereum);
      
      await loadData(addr);
      alert('Wallet connected!');
    ${'}'} catch (error) ${'{'}
      alert('Failed to connect: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Wrap FLR
  const handleWrap = async () => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    const amount = prompt('Enter amount of FLR to wrap:');
    if (!amount || isNaN(amount)) return;

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.wrap(amount, signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\\nWaiting for confirmation...\`);
      
      await tx.wait();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert('Wrapped successfully!');
      await loadData();
    ${'}'} catch (error) ${'{'}
      alert('Wrap failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Unwrap WFLR
  const handleUnwrap = async () => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    const amount = prompt('Enter amount of WFLR to unwrap:');
    if (!amount || isNaN(amount)) return;

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.unwrap(amount, signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\\nWaiting for confirmation...\`);
      
      await tx.wait();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert('Unwrapped successfully!');
      await loadData();
    ${'}'} catch (error) ${'{'}
      alert('Unwrap failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Delegate
  const handleDelegate = async () => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    const provider = prompt('Enter FTSO provider address:');
    if (!provider) return;

    const percentage = prompt('Enter percentage to delegate (0-100):');
    if (!percentage || isNaN(percentage) || percentage < 0 || percentage > 100) ${'{'}
      alert('Invalid percentage');
      return;
    ${'}'}

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.delegate(provider, parseFloat(percentage), signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\`);
      await tx.wait();
      alert('Delegation successful!');
      await loadData();
    ${'}'} catch (error) ${'{'}
      alert('Delegation failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Claim rewards
  const handleClaimRewards = async () => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    if (unclaimedEpochs.length === 0) ${'{'}
      alert('No unclaimed rewards');
      return;
    ${'}'}

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.claimRewards(undefined, signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\`);
      await tx.wait();
      alert('Rewards claimed successfully!');
      await loadData();
    ${'}'} catch (error) ${'{'}
      alert('Claim failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Undelegate all
  const handleUndelegateAll = async () => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    if (!confirm('Are you sure you want to undelegate from all providers?')) return;

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.undelegateAll(signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\`);
      await tx.wait();
      alert('Undelegated successfully!');
      await loadData();
    ${'}'} catch (error) ${'{'}
      alert('Undelegate failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Flare Staking Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Wrap FLR, delegate to FTSO providers, and claim rewards
          </p>
        </div>

        <div className="space-y-6">
          {/* Address & Controls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Address</p>
                <p className="text-white font-mono text-lg">
                  ${'{'}address ? \`\$${'{'}address.slice(0, 6)${'}'}...\$${'{'}address.slice(-4)${'}'}\` : 'Not connected'${'}'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                ${'{'} !signer && (
                  <button
                    onClick=${'{'}connectWallet${'}'}
                    disabled=${'{'}loading${'}'}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                  >
                    Connect Wallet
                  </button>
                ) ${'}'}
                <button
                  onClick=${'{'}() => loadData()${'}'}
                  disabled=${'{'}loading${'}'}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                   Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
              <p className="text-blue-300 text-sm mb-2">FLR Balance</p>
              <p className="text-white text-3xl font-bold">${'{'}flrBalance${'}'}</p>
              <p className="text-blue-200 text-xs mt-1">Native FLR</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <p className="text-purple-300 text-sm mb-2">WFLR Balance</p>
              <p className="text-white text-3xl font-bold">${'{'}wflrBalance${'}'}</p>
              <p className="text-purple-200 text-xs mt-1">Wrapped FLR</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30">
              <p className="text-pink-300 text-sm mb-2">Vote Power</p>
              <p className="text-white text-3xl font-bold">${'{'}votePower${'}'}</p>
              <p className="text-pink-200 text-xs mt-1">Delegatable</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick=${'{'}handleWrap${'}'}
                disabled=${'{'}loading${'}'}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                Wrap FLR
              </button>
              <button
                onClick=${'{'}handleUnwrap${'}'}
                disabled=${'{'}loading${'}'}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                Unwrap
              </button>
              <button
                onClick=${'{'}handleDelegate${'}'}
                disabled=${'{'}loading${'}'}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                Delegate
              </button>
              <button
                onClick=${'{'}handleUndelegateAll${'}'}
                disabled=${'{'}loading${'}'}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                Undelegate All
              </button>
            </div>
          </div>

          {/* Delegations */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Current Delegations</h3>
            ${'{'} delegations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No active delegations</p>
            ) : (
              <div className="space-y-3">
                ${'{'} delegations.map((del, i) => (
                  <div key=${'{'}i${'}'} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Provider</p>
                        <p className="text-white font-mono text-sm">
                          ${'{'}del.provider.slice(0, 10)${'}'}...${'{'}del.provider.slice(-8)${'}'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs mb-1">Percentage</p>
                        <p className="text-white text-2xl font-bold">${'{'}del.percentage${'}'}%</p>
                      </div>
                    </div>
                  </div>
                )) ${'}'}
              </div>
            ) ${'}'}
          </div>

          {/* Rewards */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Unclaimed Rewards</h3>
                <p className="text-green-200 text-sm">
                  ${'{'}unclaimedEpochs.length${'}'} epoch${'{'}unclaimedEpochs.length !== 1 ? 's' : ''${'}'} available
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-300 text-sm mb-1">Total</p>
                <p className="text-white text-3xl font-bold">${'{'}totalRewards${'}'} FLR</p>
              </div>
            </div>
            
            ${'{'} unclaimedEpochs.length > 0 && (
              <button
                onClick=${'{'}handleClaimRewards${'}'}
                disabled=${'{'}loading${'}'}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                ${'{'}loading ? 'Claiming...' : 'Claim All Rewards'${'}'}
              </button>
            ) ${'}'}
          </div>

          {/* Loading Overlay */}
          ${'{'} loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                <p className="text-white text-center">Processing...</p>
              </div>
            </div>
          ) ${'}'}
        </div>
      </div>
    </div>
  );
${'}'}`}
                    tsCode={`'use client';
import ${'{ useState }'} from 'react';
import ${'{ FlareSDK }'} from '@flarestudio/flare-sdk';
import type ${'{ Signer }'} from 'ethers';
import type ${'{ DelegationInfo }'} from '@flarestudio/flare-sdk';

export default function StakingDashboard() ${'{'}
  const [sdk] = useState(() => new FlareSDK(${'{ network: "coston2" }'}));
  const [address, setAddress] = useState<string>('');
  const [signer, setSigner] = useState<Signer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Balances
  const [flrBalance, setFlrBalance] = useState<string>('0');
  const [wflrBalance, setWflrBalance] = useState<string>('0');
  const [votePower, setVotePower] = useState<string>('0');
  
  // Delegations
  const [delegations, setDelegations] = useState<DelegationInfo[]>([]);
  
  // Rewards
  const [unclaimedEpochs, setUnclaimedEpochs] = useState<number[]>([]);
  const [totalRewards, setTotalRewards] = useState<string>('0');

  // Load all data
  const loadData = async (addr?: string): Promise<void> => ${'{'}
    const targetAddress = addr || address;
    if (!targetAddress) return;

    try ${'{'}
      const balance = await sdk.wallet.getBalance();
      setFlrBalance(parseFloat(balance.flr).toFixed(2));

      const wflr = await sdk.staking.getWNatBalance(targetAddress);
      setWflrBalance(parseFloat(wflr).toFixed(2));

      const vp = await sdk.staking.getVotePower(targetAddress);
      setVotePower(parseFloat(vp).toFixed(2));

      const dels = await sdk.staking.getDelegations(targetAddress);
      setDelegations(dels);

      const epochs = await sdk.staking.getUnclaimedEpochs(targetAddress);
      setUnclaimedEpochs(epochs);

      if (epochs.length > 0) ${'{'}
        let total = 0;
        for (const epoch of epochs) ${'{'}
          const reward = await sdk.staking.getUnclaimedReward(targetAddress, epoch);
          total += parseFloat(reward);
        ${'}'}
        setTotalRewards(total.toFixed(4));
      ${'}'}
    ${'}'} catch (error: any) ${'{'}
      console.error('Failed to load data:', error);
      alert('Failed to load data: ' + error.message);
    ${'}'}
  ${'}'};

  // Connect wallet
  const connectWallet = async (): Promise<void> => ${'{'} 
    try ${'{'} 
      setLoading(true);
      if (!window.ethereum) ${'{'}
        alert('Please install MetaMask!');
        return;
      ${'}'}

      const ${'{ BrowserProvider }'} = await import('ethers');
      const provider = new BrowserProvider(window.ethereum);
      const walletSigner = await provider.getSigner();
      setSigner(walletSigner);
      
      const addr = await walletSigner.getAddress();
      setAddress(addr);
      await sdk.wallet.connect(window.ethereum);
      
      await loadData(addr);
      alert('Wallet connected!');
    ${'}'} catch (error: any) ${'{'}
      alert('Failed to connect: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Wrap FLR
  const handleWrap = async (): Promise<void> => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    const amount = prompt('Enter amount of FLR to wrap:');
    if (!amount || isNaN(Number(amount))) return;

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.wrap(amount, signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\\nWaiting for confirmation...\`);
      
      await tx.wait();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert('Wrapped successfully!');
      await loadData();
    ${'}'} catch (error: any) ${'{'}
      alert('Wrap failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Unwrap WFLR
  const handleUnwrap = async (): Promise<void> => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    const amount = prompt('Enter amount of WFLR to unwrap:');
    if (!amount || isNaN(Number(amount))) return;

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.unwrap(amount, signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\\nWaiting for confirmation...\`);
      
      await tx.wait();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert('Unwrapped successfully!');
      await loadData();
    ${'}'} catch (error: any) ${'{'}
      alert('Unwrap failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Delegate
  const handleDelegate = async (): Promise<void> => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    const provider = prompt('Enter FTSO provider address:');
    if (!provider) return;

    const percentageStr = prompt('Enter percentage to delegate (0-100):');
    const percentage = Number(percentageStr);
    if (!percentageStr || isNaN(percentage) || percentage < 0 || percentage > 100) ${'{'}
      alert('Invalid percentage');
      return;
    ${'}'}

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.delegate(provider, percentage, signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\`);
      await tx.wait();
      alert('Delegation successful!');
      await loadData();
    ${'}'} catch (error: any) ${'{'}
      alert('Delegation failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Claim rewards
  const handleClaimRewards = async (): Promise<void> => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    if (unclaimedEpochs.length === 0) ${'{'}
      alert('No unclaimed rewards');
      return;
    ${'}'}

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.claimRewards(undefined, signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\`);
      await tx.wait();
      alert('Rewards claimed successfully!');
      await loadData();
    ${'}'} catch (error: any) ${'{'}
      alert('Claim failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  // Undelegate all
  const handleUndelegateAll = async (): Promise<void> => ${'{'} 
    if (!signer) ${'{'}
      alert('Please connect wallet first');
      return;
    ${'}'}
    
    if (!confirm('Are you sure you want to undelegate from all providers?')) return;

    try ${'{'} 
      setLoading(true);
      const tx = await sdk.staking.undelegateAll(signer);
      alert(\`Transaction sent: \$${'{'}tx.hash${'}'}\`);
      await tx.wait();
      alert('Undelegated successfully!');
      await loadData();
    ${'}'} catch (error: any) ${'{'}
      alert('Undelegate failed: ' + error.message);
    ${'}'} finally ${'{'}
      setLoading(false);
    ${'}'}
  ${'}'};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Flare Staking Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Wrap FLR, delegate to FTSO providers, and claim rewards
          </p>
        </div>

        <div className="space-y-6">
          {/* Address & Controls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Address</p>
                <p className="text-white font-mono text-lg">
                  ${'{'}address ? \`\$${'{'}address.slice(0, 6)${'}'}...\$${'{'}address.slice(-4)${'}'}\` : 'Not connected'${'}'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                ${'{'} !signer && (
                  <button
                    onClick=${'{'}connectWallet${'}'}
                    disabled=${'{'}loading${'}'}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                  >
                    Connect Wallet
                  </button>
                ) ${'}'}
                <button
                  onClick=${'{'}() => loadData()${'}'}
                  disabled=${'{'}loading${'}'}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
              <p className="text-blue-300 text-sm mb-2">FLR Balance</p>
              <p className="text-white text-3xl font-bold">${'{'}flrBalance${'}'}</p>
              <p className="text-blue-200 text-xs mt-1">Native FLR</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <p className="text-purple-300 text-sm mb-2">WFLR Balance</p>
              <p className="text-white text-3xl font-bold">${'{'}wflrBalance${'}'}</p>
              <p className="text-purple-200 text-xs mt-1">Wrapped FLR</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30">
              <p className="text-pink-300 text-sm mb-2">Vote Power</p>
              <p className="text-white text-3xl font-bold">${'{'}votePower${'}'}</p>
              <p className="text-pink-200 text-xs mt-1">Delegatable</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick=${'{'}handleWrap${'}'}
                disabled=${'{'}loading${'}'}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                Wrap FLR
              </button>
              <button
                onClick=${'{'}handleUnwrap${'}'}
                disabled=${'{'}loading${'}'}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                Unwrap
              </button>
              <button
                onClick=${'{'}handleDelegate${'}'}
                disabled=${'{'}loading${'}'}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                Delegate
              </button>
              <button
                onClick=${'{'}handleUndelegateAll${'}'}
                disabled=${'{'}loading${'}'}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                Undelegate All
              </button>
            </div>
          </div>

          {/* Delegations */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Current Delegations</h3>
            ${'{'} delegations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No active delegations</p>
            ) : (
              <div className="space-y-3">
                ${'{'} delegations.map((del, i) => (
                  <div key=${'{'}i${'}'} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Provider</p>
                        <p className="text-white font-mono text-sm">
                          ${'{'}del.provider.slice(0, 10)${'}'}...${'{'}del.provider.slice(-8)${'}'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs mb-1">Percentage</p>
                        <p className="text-white text-2xl font-bold">${'{'}del.percentage${'}'}%</p>
                      </div>
                    </div>
                  </div>
                )) ${'}'}
              </div>
            ) ${'}'}
          </div>

          {/* Rewards */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Unclaimed Rewards</h3>
                <p className="text-green-200 text-sm">
                  ${'{'}unclaimedEpochs.length${'}'} epoch${'{'}unclaimedEpochs.length !== 1 ? 's' : ''${'}'} available
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-300 text-sm mb-1">Total</p>
                <p className="text-white text-3xl font-bold">${'{'}totalRewards${'}'} FLR</p>
              </div>
            </div>
            
            ${'{'} unclaimedEpochs.length > 0 && (
              <button
                onClick=${'{'}handleClaimRewards${'}'}
                disabled=${'{'}loading${'}'}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
              >
                ${'{'}loading ? 'Claiming...' : 'Claim All Rewards'${'}'}
              </button>
            ) ${'}'}
          </div>

          {/* Loading Overlay */}
          ${'{'} loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                <p className="text-white text-center">Processing...</p>
              </div>
            </div>
          ) ${'}'}
        </div>
      </div>
    </div>
  );
${'}'}`}

                />
            </div>

            {/* Comprehensive Guides */}
            <div className="space-y-8 mb-16">
                <h2 className="text-2xl font-bold text-gray-900">Comprehensive Guides</h2>

                {/* Wrapping Guide */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Wrapping & Unwrapping</h3>
                        <p className="text-gray-600">
                            Before you can delegate your FLR tokens to earn rewards, you must wrap them into Wrapped Flare (WFLR).
                            WFLR is an ERC-20 token that represents your FLR 1:1. You can unwrap back to FLR at any time.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Methods</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">wrap(amount, signer)</code>
                                <span className="text-sm text-gray-600">Converts native FLR to WFLR. Requires a connected signer.</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">unwrap(amount, signer)</code>
                                <span className="text-sm text-gray-600">Converts WFLR back to native FLR.</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">getWNatBalance(address)</code>
                                <span className="text-sm text-gray-600">Checks your current WFLR balance.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Delegation Guide */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Delegation</h3>
                        <p className="text-gray-600">
                            Delegating your WFLR vote power to FTSO data providers allows you to earn rewards.
                            You can delegate up to 100% of your vote power to one or two providers.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Methods</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">delegate(provider, %, signer)</code>
                                <span className="text-sm text-gray-600">Delegates a percentage (0-100) to a provider address.</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">getDelegations(address)</code>
                                <span className="text-sm text-gray-600">Returns a list of your current active delegations.</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">undelegateAll(signer)</code>
                                <span className="text-sm text-gray-600">Removes all delegations instantly.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Rewards Guide */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Claiming Rewards</h3>
                        <p className="text-gray-600">
                            Rewards accrue every epoch (approx. 3.5 days). You must claim them within 90 days, or they are burned.
                            The SDK handles the complexity of checking multiple epochs and providers.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Methods</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">getUnclaimedEpochs(address)</code>
                                <span className="text-sm text-gray-600">Finds which past epochs have unclaimed rewards.</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">getUnclaimedReward(addr, epoch)</code>
                                <span className="text-sm text-gray-600">Calculates the exact reward amount for a specific epoch.</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">claimRewards(epochs, signer)</code>
                                <span className="text-sm text-gray-600">Claims rewards for specified epochs (or all if undefined).</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Utilities Guide */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Utilities & Helpers</h3>
                        <p className="text-gray-600">
                            The SDK includes helper methods to calculate potential rewards and manage data.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Methods</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">calculatePotentialRewards(amount, apy, days)</code>
                                <span className="text-sm text-gray-600">Estimates rewards based on APY and duration.</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="text-sm font-mono text-[#e93b6c] bg-white px-2 py-1 rounded border">getVotePower(address)</code>
                                <span className="text-sm text-gray-600">Gets your exact delegatable vote power (WFLR balance).</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* API Reference */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">API Reference</h2>

                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameters</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returns</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">wrap(amount, signer)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">amount: string, signer: Signer</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;TransactionResponse&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Wrap FLR to WFLR</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">unwrap(amount, signer)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">amount: string, signer: Signer</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;TransactionResponse&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Unwrap WFLR to FLR</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getWNatBalance(address)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">address: string</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;string&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Get WFLR balance</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getVotePower(address)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">address: string</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;string&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Get delegatable vote power</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">delegate(provider, %, signer)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">provider: string, percentage: number, signer: Signer</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;TransactionResponse&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Delegate to FTSO provider</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getDelegations(address)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">address: string</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;DelegationInfo[]&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Get current delegations</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">claimRewards(epochs, signer)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">epochs?: number[], signer: Signer</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;TransactionResponse&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Claim rewards</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">getUnclaimedEpochs(address)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">address: string</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;number[]&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Get unclaimed reward epochs</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-sm text-[#e93b6c]">undelegateAll(signer)</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <code className="text-xs">signer: Signer</code>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">Promise&lt;TransactionResponse&gt;</td>
                                <td className="px-6 py-4 text-sm text-gray-600">Remove all delegations</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Best Practices */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Best Practices</h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Match your network:</strong>
                            <p className="text-gray-600 text-sm">Always ensure your SDK network matches your MetaMask network (e.g., both on &apos;coston2&apos; or both on &apos;flare&apos;)</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Wait for confirmations:</strong>
                            <p className="text-gray-600 text-sm">Always use <code className="bg-gray-100 px-1 rounded text-xs">await tx.wait()</code> before showing success</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Claim rewards regularly:</strong>
                            <p className="text-gray-600 text-sm">Rewards expire after 90 days - set up auto-claiming or claim manually every few weeks</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">No lock-up period:</strong>
                            <p className="text-gray-600 text-sm">Your WFLR stays in your wallet - you can unwrap or change delegation anytime</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#e93b6c] text-sm">✓</span>
                        </div>
                        <div>
                            <strong className="text-gray-900">Research providers:</strong>
                            <p className="text-gray-600 text-sm">Check provider performance on <a href="https://flaremetrics.io" target="_blank" className="text-[#e93b6c] underline">flaremetrics.io</a> before delegating</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contract Addresses */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Contract Addresses</h2>
                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WNat Contract</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Flare Mainnet</td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Coston2 Testnet</td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Songbird</td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Helpful Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="https://portal.flare.network" target="_blank" className="border rounded-lg p-4 hover:border-[#e93b6c] transition-colors">
                        <h3 className="font-semibold text-gray-900 mb-1">Flare Portal</h3>
                        <p className="text-sm text-gray-600">Official portal for wrapping, delegating, and claiming</p>
                    </a>
                    <a href="https://flaremetrics.io" target="_blank" className="border rounded-lg p-4 hover:border-[#e93b6c] transition-colors">
                        <h3 className="font-semibold text-gray-900 mb-1">Flare Metrics</h3>
                        <p className="text-sm text-gray-600">Compare FTSO provider performance and fees</p>
                    </a>
                    <a href="https://docs.flare.network" target="_blank" className="border rounded-lg p-4 hover:border-[#e93b6c] transition-colors">
                        <h3 className="font-semibold text-gray-900 mb-1">Flare Docs</h3>
                        <p className="text-sm text-gray-600">Technical documentation and contract ABIs</p>
                    </a>
                    <a href="https://flarescan.com" target="_blank" className="border rounded-lg p-4 hover:border-[#e93b6c] transition-colors">
                        <h3 className="font-semibold text-gray-900 mb-1">FlareScan</h3>
                        <p className="text-sm text-gray-600">Block explorer for Flare Network</p>
                    </a>
                </div>
            </div>
        </div>
    )
}
