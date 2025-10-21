// components/ftso-dashboard/PriceChart.jsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceChart({ history, selectedToken, prices }) {
  const currentPrice = prices.find(p => p.symbol === selectedToken);
  
  const formatChartData = () => {
    return history
      .filter(item => item.symbol === selectedToken)
      .map(item => ({
        timestamp: item.timestamp,
        price: item.price,
        time: new Date(item.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        date: new Date(item.timestamp).toLocaleDateString()
      }));
  };

  const chartData = formatChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{`${selectedToken}: $${payload[0].value.toFixed(4)}`}</p>
          <p className="text-gray-600 text-sm">{new Date(label).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedToken} Price Chart (24h)
        </h3>
        {currentPrice && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${currentPrice.value.toFixed(4)}
            </div>
            <div className="text-sm text-gray-500">Current Price</div>
          </div>
        )}
      </div>

      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time"
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tickFormatter={(value) => `$${value.toFixed(4)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#f97316', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No historical data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}