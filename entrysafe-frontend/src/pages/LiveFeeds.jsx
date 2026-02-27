import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Euro, PoundSterling, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LiveFeeds() {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      // Using exchangerate-api.com free tier
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/ZAR');
      const data = await response.json();
      setExchangeRates(data.rates);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchExchangeRates, 300000);
    return () => clearInterval(interval);
  }, []);

  const majorCurrencies = [
    { code: 'USD', name: 'US Dollar', icon: <DollarSign size={24} />, flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', icon: <Euro size={24} />, flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', icon: <PoundSterling size={24} />, flag: '🇬🇧' },
    { code: 'AUD', name: 'Australian Dollar', icon: <DollarSign size={24} />, flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', icon: <DollarSign size={24} />, flag: '🇨🇦' },
    { code: 'CNY', name: 'Chinese Yuan', icon: <DollarSign size={24} />, flag: '🇨🇳' },
  ];

  const financialNews = [
    {
      title: 'South African Rand Strengthens Against Major Currencies',
      source: 'Business News',
      time: '2 hours ago',
      url: '#',
    },
    {
      title: 'SARS Announces New Tax Filing Guidelines for 2026',
      source: 'Tax Update',
      time: '5 hours ago',
      url: '#',
    },
    {
      title: 'CIPC Streamlines Business Registration Process',
      source: 'Business Update',
      time: '1 day ago',
      url: '#',
    },
    {
      title: 'SME Growth Trends in South Africa: Q1 2026 Report',
      source: 'Market Analysis',
      time: '1 day ago',
      url: '#',
    },
    {
      title: 'New Compliance Requirements for Small Businesses',
      source: 'Regulatory News',
      time: '2 days ago',
      url: '#',
    },
  ];

  const complianceAlerts = [
    {
      title: 'SARS Tax Filing Deadline Approaching',
      date: 'Due: 31 March 2026',
      severity: 'high',
      description: 'Ensure all provisional tax returns are submitted before the deadline.',
    },
    {
      title: 'CIPC Annual Returns Due',
      date: 'Due: 30 April 2026',
      severity: 'medium',
      description: 'Companies must file annual returns within the required period.',
    },
    {
      title: 'New BEE Compliance Regulations',
      date: 'Effective: 1 June 2026',
      severity: 'info',
      description: 'Updated BEE scorecards and compliance requirements published.',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-navy via-navy-dark to-navy text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gold" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Live Financial Feeds
            </h1>
            <p className="text-base lg:text-lg text-gray-200 max-w-3xl mx-auto">
              Stay updated with real-time exchange rates, financial news, and compliance alerts
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          {/* Exchange Rates Section */}
          <section className="mb-12" data-testid="exchange-rates-section">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-2">
                  Exchange Rates
                </h2>
                <p className="text-sm text-gray-600">
                  ZAR (South African Rand) to major currencies
                </p>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {lastUpdated}
                  </p>
                )}
              </div>
              <button
                onClick={fetchExchangeRates}
                disabled={loading}
                data-testid="refresh-rates-btn"
                className="bg-navy text-white hover:bg-navy-dark px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                <span>Refresh</span>
              </button>
            </div>

            {loading && !exchangeRates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-white p-6 rounded-xl shadow-lg">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {majorCurrencies.map((currency) => {
                  const rate = exchangeRates?.[currency.code];
                  const zarToCurrency = rate ? (1 / rate).toFixed(4) : 'N/A';

                  return (
                    <div
                      key={currency.code}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200"
                      data-testid={`currency-card-${currency.code}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-4xl">{currency.flag}</span>
                          <div>
                            <p className="font-bold text-navy">{currency.code}</p>
                            <p className="text-xs text-gray-500">{currency.name}</p>
                          </div>
                        </div>
                        <div className="text-gold">
                          {currency.icon}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">1 ZAR =</p>
                        <p className="text-2xl font-bold text-navy font-mono">
                          {zarToCurrency} {currency.code}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Compliance Alerts Section */}
          <section className="mb-12" data-testid="compliance-alerts-section">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-navy mb-2">
                Compliance Alerts
              </h2>
              <p className="text-sm text-gray-600">
                Important deadlines and regulatory updates
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {complianceAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${
                    alert.severity === 'high'
                      ? 'border-red-500'
                      : alert.severity === 'medium'
                      ? 'border-gold'
                      : 'border-blue-500'
                  }`}
                  data-testid={`alert-card-${index}`}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <AlertCircle 
                      className={
                        alert.severity === 'high'
                          ? 'text-red-500'
                          : alert.severity === 'medium'
                          ? 'text-gold'
                          : 'text-blue-500'
                      } 
                      size={24} 
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-navy mb-1">
                        {alert.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        {alert.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Financial News Section */}
          <section data-testid="financial-news-section">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-navy mb-2">
                Latest Financial News
              </h2>
              <p className="text-sm text-gray-600">
                Stay informed with trending business updates
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {financialNews.map((news, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 cursor-pointer group"
                  data-testid={`news-card-${index}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-navy-dark transition-colors">
                        {news.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="bg-gold text-navy px-2 py-1 rounded font-semibold">
                          {news.source}
                        </span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                    <ExternalLink 
                      className="text-navy group-hover:text-gold transition-colors flex-shrink-0 ml-4" 
                      size={20} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* News Ticker */}
            <div className="mt-8 bg-navy text-white p-4 rounded-lg overflow-hidden">
              <div className="flex items-center space-x-4">
                <span className="bg-gold text-navy px-3 py-1 rounded font-bold text-sm whitespace-nowrap">
                  LIVE
                </span>
                <div className="overflow-hidden flex-grow">
                  <div className="whitespace-nowrap text-sm animate-scroll">
                    ZAR/USD: 0.055 • ZAR/EUR: 0.052 • ZAR/GBP: 0.045 • JSE All Share: +1.2% • Gold: R1,234/oz • Oil: $85/barrel
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* External Resources */}
          <section className="mt-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-navy mb-6">
                External Financial Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://www.moneyweb.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="resource-moneyweb"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-navy hover:text-white transition-all group"
                >
                  <span className="font-semibold">Moneyweb</span>
                  <ExternalLink size={18} className="group-hover:text-gold" />
                </a>
                <a
                  href="https://www.businesstech.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="resource-businesstech"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-navy hover:text-white transition-all group"
                >
                  <span className="font-semibold">BusinessTech</span>
                  <ExternalLink size={18} className="group-hover:text-gold" />
                </a>
                <a
                  href="https://www.xe.com/currencyconverter/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="resource-xe"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-navy hover:text-white transition-all group"
                >
                  <span className="font-semibold">XE Currency Converter</span>
                  <ExternalLink size={18} className="group-hover:text-gold" />
                </a>
                <a
                  href="https://www.reuters.com/markets"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="resource-reuters"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-navy hover:text-white transition-all group"
                >
                  <span className="font-semibold">Reuters Markets</span>
                  <ExternalLink size={18} className="group-hover:text-gold" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </>
  );
}
