// components/ftso-dashboard/PriceCardsGrid.jsx
'use client';

export default function PriceCardsGrid({ prices, selectedToken, onTokenSelect }) {
  const majorTokens = ['FLR', 'BTC', 'ETH', 'XRP', 'ADA', 'DOGE'];

  const getTokenPrice = (symbol) => {
    return prices.find(price => price.symbol === symbol);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const getChangeColor = (change) => {
    if (!change) return 'text-gray-500';
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    if (!change) return null;
    return change >= 0 ? '↗' : '↘';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {majorTokens.map(symbol => {
        const priceData = getTokenPrice(symbol);
        const isSelected = selectedToken === symbol;
        
        return (
          <button
            key={symbol}
            onClick={() => onTokenSelect(symbol)}
            className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
              isSelected 
                ? 'border-orange-500 shadow-md' 
                : 'border-gray-100 hover:border-orange-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">{symbol}</span>
              {priceData?.change24h && (
                <span className={`text-sm font-medium ${getChangeColor(priceData.change24h)}`}>
                  {getChangeIcon(priceData.change24h)} {Math.abs(priceData.change24h).toFixed(2)}%
                </span>
              )}
            </div>
            
            <div className="text-left">
              {priceData ? (
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(priceData.value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Updated {new Date(priceData.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">Loading...</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}