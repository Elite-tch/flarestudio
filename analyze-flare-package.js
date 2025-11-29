const { nameToAbi, flare } = require('@flarenetwork/flare-periphery-contract-artifacts');

console.log('='.repeat(80));
console.log('FLARE PERIPHERY CONTRACT ARTIFACTS - PACKAGE ANALYSIS');
console.log('='.repeat(80));

// 1. Available Products
console.log('\n📦 AVAILABLE PRODUCTS (Flare Network):');
console.log('-'.repeat(80));
const products = Object.keys(flare.products);
products.forEach(p => console.log(`  - ${p}`));

// 2. FtsoRegistry Methods
console.log('\n🔍 FTSO REGISTRY METHODS:');
console.log('-'.repeat(80));
const ftsoRegistryAbi = nameToAbi('FtsoRegistry', 'flare');
const methods = ftsoRegistryAbi.filter(i => i.type === 'function');

methods.forEach(m => {
    const inputs = m.inputs.map(i => `${i.type} ${i.name || ''}`).join(', ');
    const outputs = m.outputs ? m.outputs.map(o => `${o.type} ${o.name || ''}`).join(', ') : 'void';
    console.log(`\n  ${m.name}(${inputs})`);
    console.log(`    → returns (${outputs})`);
    console.log(`    State: ${m.stateMutability}`);
});

// 3. Interface ABIs
console.log('\n\n🔌 AVAILABLE INTERFACE ABIs:');
console.log('-'.repeat(80));
const interfaces = Object.keys(flare.interfaceAbis);
interfaces.forEach(i => console.log(`  - ${i}`));

console.log('\n' + '='.repeat(80));
