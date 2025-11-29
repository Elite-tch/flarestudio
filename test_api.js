
const SYMBOL_MAP = {
    "BTC": "BTC-USD",
    "ETH": "ETH-USD",
    "XRP": "XRP-USD",
    "FLR": "FLR-USD"
}

async function testFetch() {
    console.log("Testing Coinbase API...")
    const symbols = Object.keys(SYMBOL_MAP);

    for (const symbol of symbols) {
        const pair = SYMBOL_MAP[symbol];
        try {
            const url = `https://api.coinbase.com/v2/prices/${pair}/spot`;
            console.log(`Fetching ${url}...`);
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                continue;
            }
            const data = await response.json();
            console.log(`Success ${symbol}:`, data);
        } catch (error) {
            console.error(`Failed ${symbol}:`, error);
        }
    }
}

testFetch();
