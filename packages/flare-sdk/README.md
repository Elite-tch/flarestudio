# @flarestudio/flare-sdk

> Official TypeScript/JavaScript SDK for Flare blockchain

[![npm version](https://img.shields.io/npm/v/@flarestudio/flare-sdk.svg)](https://www.npmjs.com/package/@flarestudio/flare-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **FTSO (Price Feeds)**: Access real-time and historical price data
- **FDC (Attestations)**: Verify cross-chain events and data
- **fAssets (Bridging)**: Mint and redeem synthetic assets
- **Wallet**: Connect and interact with wallets
- **Staking**: Delegate and claim rewards
- **State Connector**: Verify blockchain state
- **Utils**: Helper functions for common operations

## 📦 Installation

```bash
npm install @flarestudio/flare-sdk
```

or

```bash
yarn add @flarestudio/flare-sdk
```

## 🎯 Quick Start

```typescript
import { FlareSDK } from '@flarestudio/flare-sdk';

// Initialize SDK
const sdk = new FlareSDK({
  network: 'flare', // or 'coston2', 'songbird', 'coston'
});

// Coming soon: Module examples
// const price = await sdk.ftso.getPrice('BTC/USD');
// const balance = await sdk.wallet.getBalance();
```

## 🏗️ Development Status

**Current Version**: 0.1.0 (Alpha)

This SDK is currently under active development. Core infrastructure is complete:

- ✅ Core SDK class
- ✅ Error handling system
- ✅ Network management
- ✅ TypeScript types
- 🚧 FTSO Module (Coming soon)
- 🚧 FDC Module (Coming soon)
- 🚧 fAssets Module (Coming soon)
- 🚧 Wallet Module (Coming soon)
- 🚧 Staking Module (Coming soon)
- 🚧 State Connector Module (Coming soon)
- 🚧 Utils Module (Coming soon)

## 📚 Documentation

Full documentation will be available at: https://flarestudio.xyz/sdk

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT © FlareStudio

## 🔗 Links

- [Website](https://flarestudio.xyz)
- [GitHub](https://github.com/Elite-tch/flarestudio)
- [npm](https://www.npmjs.com/package/@flarestudio/flare-sdk)

---

**Note**: This SDK is in early development. APIs may change before v1.0.0 release.
