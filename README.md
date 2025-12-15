# FlareStudio

**The Essential Developer Launchpad for Flare Network**

## What is FlareStudio?

FlareStudio is an interactive developer toolkit designed to eliminate the friction of building on Flare Network. We provide a unified environment where developers can learn, test, and implement Flare's core features without context-switching between multiple tools.

## The Problem We Solve

Building on Flare currently requires developers to juggle between:
- **Multiple documentation sites** for FTSO and FDC
- **Separate block explorers** for network data
- **Disconnected code examples** spread across GitHub repos
- **Isolated testing environments** for smart contracts

This fragmented experience slows down development and increases the learning curve for new Flare developers.

## Our Solution

FlareStudio integrates everything into one cohesive workflow:

### Unified Developer Environment
- **Interactive Guides** with live code examples
- **Built-in FTSO Playground** to test price feeds in real-time
- **FDC Integration Tools** for Web2 data on-chain
- **Network Utilities** with wallet connection and RPC testing

### Core Features
- **Read → Test → Build** workflow in a single interface
- **Copy-paste ready code** for both Hardhat and Foundry
- **Live network data** from Flare Mainnet and Coston Testnet
- **Beginner-friendly tutorials** with instant feedback

## Why FlareStudio?

We're not just another documentation site. We're the **developer launchpad** that:
- **Reduces onboarding time** from days to hours
- **Eliminates context-switching** between tabs and tools
- **Provides immediate hands-on experience** with Flare's unique features
- **Accelerates prototyping** with production-ready code snippets

## 📦 Flare Web SDK

At the heart of FlareStudio is the **Flare Web SDK** (@flarestudio/flare-sdk), a fully typed, modular library that makes interacting with Flare's protocols effortless.

### Installation
```bash
npm install @flarestudio/flare-sdk ethers
```

### Quick Usage
```typescript
import { FlareSDK } from '@flarestudio/flare-sdk';

const sdk = new FlareSDK({ network: 'coston2' });

// 1. Get Live Prices (FTSO)
const price = await sdk.ftso.getPrice('BTC/USD');
console.log(`BTC: $${price.price}`);

// 2. Connector Wallet
await sdk.wallet.connect(window.ethereum);

// 3. Verify Cross-Chain Payment (FDC)
const tx = await sdk.fdc.verifyBitcoinPayment({
    txHash: '0x...', 
    amount: 1.5,
    sourceAddress: 'bc1...',
    destinationAddress: 'bc1...'
}, signer);
```

### Modules
- **FTSO**: Real-time decentralized price feeds.
- **FDC**: Trustless verification of data from other chains (Bitcoin, Ethereum, etc).
- **State Connector**: Read confirmed state from external chains.
- **Wallet**: Seamless connection and transaction management.
- **Micro-Services**: Utilities for attestation encoding and decoding.

## Open for Collaboration

We believe in growing the Flare ecosystem together. We're open to:
- **Feature suggestions** and use cases
- **Code contributions** and improvements
- **Documentation enhancements**
- **Integration ideas** with other Flare projects



**Built with ❤️ for the Flare developer community**