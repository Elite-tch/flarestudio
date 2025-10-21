// components/ftso-dashboard/ProviderList.jsx
'use client';

export default function ProviderList({ providers }) {
  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getReliabilityColor = (reliability) => {
    if (reliability >= 0.9) return 'text-green-600';
    if (reliability >= 0.7) return 'text-orange-500';
    return 'text-red-500';
  };

  const activeProviders = providers.filter(p => p.isActive);
  const inactiveProviders = providers.filter(p => !p.isActive);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Data Providers</h3>
        <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
          {activeProviders.length} Active
        </span>
      </div>

      <div className="space-y-4">
        {activeProviders.slice(0, 10).map((provider, index) => (
          <div key={provider.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-bold">{index + 1}</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {provider.name || formatAddress(provider.address)}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className={getReliabilityColor(provider.reliability)}>
                    {(provider.reliability * 100).toFixed(1)}% reliable
                  </span>
                </div>
              </div>
            </div>
            
            {provider.currentRewards && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {provider.currentRewards.toFixed(2)} FLR
                </div>
                <div className="text-xs text-gray-500">rewards</div>
              </div>
            )}
          </div>
        ))}

        {activeProviders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No provider data available</p>
          </div>
        )}

        {inactiveProviders.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Inactive Providers</span>
              <span className="text-sm text-gray-400">{inactiveProviders.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}