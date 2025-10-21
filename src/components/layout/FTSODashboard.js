// components/ftso-dashboard/FtsoDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import PriceChart from './ftso/PriceChart';
import PriceCardsGrid from './ftso/PriceCardsGrid';
import ProviderList from './ftso/ProviderList';
import FtsoStats from './ftso/FtsoStats';

export default function FtsoDashboard() {
  const [ftsoData, setFtsoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedToken, setSelectedToken] = useState('FLR');

  const fetchFtsoData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current price data from Flare FTSO API
      const priceResponse = await fetch('https://flare-api.flare.network/ext/ftso');
      if (!priceResponse.ok) throw new Error('Failed to fetch FTSO data');
      
      const priceData = await priceResponse.json();
      
      // Fetch provider data
      const providerResponse = await fetch('https://flare-api.flare.network/ext/ftso/providers');
      const providerData = providerResponse.ok ? await providerResponse.json() : { providers: [] };
      
      // Fetch historical data for charts
      const historicalResponse = await fetch(`https://flare-api.flare.network/ext/ftso/history?symbol=${selectedToken}&hours=24`);
      const historicalData = historicalResponse.ok ? await historicalResponse.json() : { history: [] };

      const transformedData = {
        prices: priceData.prices || [],
        providers: providerData.providers || [],
        history: historicalData.history || [],
        lastUpdate: new Date().toISOString()
      };

      setFtsoData(transformedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch FTSO data');
      console.error('FTSO Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFtsoData();
    const interval = setInterval(fetchFtsoData, 30000);
    return () => clearInterval(interval);
  }, [selectedToken]);

  if (loading && !ftsoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Error loading FTSO data</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button 
                  onClick={fetchFtsoData}
                  className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">FTSO Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time Flare Time Series Oracle data</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {ftsoData?.lastUpdate && (
              <span className="text-sm text-gray-500">
                Last update: {new Date(ftsoData.lastUpdate).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchFtsoData}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Prices and Chart */}
          <div className="lg:col-span-2 space-y-6">
            <PriceCardsGrid 
              prices={ftsoData?.prices || []} 
              selectedToken={selectedToken}
              onTokenSelect={setSelectedToken}
            />
            
            <PriceChart 
              history={ftsoData?.history || []}
              selectedToken={selectedToken}
              prices={ftsoData?.prices || []}
            />
            
            <FtsoStats 
              prices={ftsoData?.prices || []}
              providers={ftsoData?.providers || []}
            />
          </div>

          {/* Right Column - Providers */}
          <div className="space-y-6">
            <ProviderList providers={ftsoData?.providers || []} />
          </div>
        </div>
      </div>
    </div>
  );
}