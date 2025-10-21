// components/ftso-dashboard/FtsoStats.jsx
'use client';

export default function FtsoStats({ prices, providers }) {
  const activeProviders = providers.filter(p => p.isActive);
  const totalRewards = providers.reduce((sum, provider) => sum + (provider.currentRewards || 0), 0);
  const avgReliability = activeProviders.length > 0 
    ? activeProviders.reduce((sum, provider) => sum + provider.reliability, 0) / activeProviders.length
    : 0;

  const stats = [
    {
      label: 'Active Data Providers',
      value: activeProviders.length.toString(),
      description: 'Currently providing price data'
    },
    {
      label: 'Average Reliability',
      value: `${(avgReliability * 100).toFixed(1)}%`,
      description: 'Across all providers'
    },
    {
      label: 'Total Tracked Assets',
      value: prices.length.toString(),
      description: 'Supported tokens'
    },
    {
      label: 'Total Rewards',
      value: `${totalRewards.toFixed(0)} FLR`,
      description: 'Current epoch'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">FTSO Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-gray-500">
              {stat.description}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Update Frequency</span>
          <span className="font-medium text-gray-900">Every 5 minutes</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Current Epoch</span>
          <span className="font-medium text-gray-900">Loading...</span>
        </div>
      </div>
    </div>
  );
}