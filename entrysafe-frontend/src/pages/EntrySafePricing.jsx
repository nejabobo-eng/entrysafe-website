import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function EntrySafePricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-navy mb-6">
            💰 Entry Safe Pricing
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
            Simple, transparent pricing. One subscription unlocks everything.
          </p>
          <p className="text-2xl font-bold text-gold">
            ✨ Subscribe Once → Access All Platforms ✨
          </p>
        </div>

        {/* Platform Coverage */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-6 text-center">
            📱 What's Included in Every Subscription
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white text-center">
              <div className="text-5xl mb-3">📱</div>
              <h3 className="text-2xl font-bold mb-2">Entry Safe</h3>
              <p className="text-gray-200">Complete accounting system</p>
              <div className="mt-4 space-y-2">
                <span className="block bg-white bg-opacity-20 px-3 py-1 rounded">Android</span>
                <span className="block bg-white bg-opacity-20 px-3 py-1 rounded">Windows</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white text-center">
              <div className="text-5xl mb-3">📄</div>
              <h3 className="text-2xl font-bold mb-2">Entry Safe Docs</h3>
              <p className="text-gray-200">Document management</p>
              <div className="mt-4 space-y-2">
                <span className="block bg-white bg-opacity-20 px-3 py-1 rounded">Android</span>
                <span className="block bg-white bg-opacity-20 px-3 py-1 rounded">Windows</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-gold to-yellow-500 rounded-xl text-navy text-center">
              <div className="text-5xl mb-3">🌐</div>
              <h3 className="text-2xl font-bold mb-2">Entry Safe Website</h3>
              <p className="text-navy-light font-semibold">Web portal access</p>
              <div className="mt-4 space-y-2">
                <span className="block bg-white bg-opacity-40 px-3 py-1 rounded">Knowledge Hub</span>
                <span className="block bg-white bg-opacity-40 px-3 py-1 rounded">Live Feeds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-navy mb-2">Free Plan</h3>
              <p className="text-5xl font-bold text-gray-700 mb-2">R0</p>
              <p className="text-gray-600">Forever free</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span>Access to Entry Safe Website</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span>Knowledge Hub articles</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span>Live Feeds (ZAR rates & news)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span>Contact support</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 text-xl mr-3">✗</span>
                <span className="text-gray-500">Entry Safe accounting app</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 text-xl mr-3">✗</span>
                <span className="text-gray-500">Entry Safe Docs</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 text-xl mr-3">⚠</span>
                <span className="text-gray-500">Android app has ads</span>
              </li>
            </ul>

            <a
              href="/register"
              className="block w-full bg-gray-200 text-navy text-center px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              Get Started Free
            </a>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl shadow-2xl p-8 border-4 border-gold relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gold text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                ⭐ MOST POPULAR
              </span>
            </div>

            <div className="text-center mb-6 text-white">
              <h3 className="text-3xl font-bold mb-2">Premium All-Access</h3>
              <p className="text-5xl font-bold mb-2">R499</p>
              <p className="text-gray-200">per month</p>
              <p className="text-gold font-semibold mt-2">💎 Unlock Everything</p>
            </div>

            <ul className="space-y-4 mb-8 text-white">
              <li className="flex items-start">
                <span className="text-gold text-xl mr-3">✓</span>
                <span>✨ All Free features included</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold text-xl mr-3">✓</span>
                <span><strong>Entry Safe</strong> - Full accounting system</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold text-xl mr-3">✓</span>
                <span><strong>Entry Safe Docs</strong> - Document management</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold text-xl mr-3">✓</span>
                <span>Android + Windows apps</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold text-xl mr-3">✓</span>
                <span><strong>Ad-Free</strong> on all platforms</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold text-xl mr-3">✓</span>
                <span>Priority customer support</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold text-xl mr-3">✓</span>
                <span>Multi-device sync</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold text-xl mr-3">✓</span>
                <span>Advanced reporting & analytics</span>
              </li>
            </ul>

            <a
              href="/register"
              className="block w-full bg-gold text-navy text-center px-6 py-3 rounded-lg font-bold hover:shadow-2xl transition-all transform hover:scale-105"
            >
              🚀 Start Premium Trial
            </a>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            📊 Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="text-left p-4 text-navy font-bold">Feature</th>
                  <th className="text-center p-4 text-navy font-bold">Free</th>
                  <th className="text-center p-4 text-gold font-bold">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Entry Safe Website Access</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Knowledge Hub</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Live Feeds (ZAR & News)</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-semibold">Entry Safe Accounting App</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-semibold">Entry Safe Docs</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Android App</td>
                  <td className="text-center p-4">⚠️ With Ads</td>
                  <td className="text-center p-4">✅ Ad-Free</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Windows App</td>
                  <td className="text-center p-4">Limited</td>
                  <td className="text-center p-4">✅ Full</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Multi-Platform Sync</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Priority Support</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2 text-gold">Can I try before I buy?</h3>
              <p className="text-gray-200">
                Yes! Start with our free plan and upgrade to Premium anytime. We also offer a 14-day free trial of Premium features.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-gold">Does one subscription cover all platforms?</h3>
              <p className="text-gray-200">
                Absolutely! One Premium subscription gives you full access to Entry Safe, Entry Safe Docs, and the Entry Safe Website on Android, Windows, and Web.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-gold">Can I cancel anytime?</h3>
              <p className="text-gray-200">
                Yes, no contracts or commitments. Cancel your subscription anytime from your account settings.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-gold">Do you offer discounts for annual payments?</h3>
              <p className="text-gray-200">
                Yes! Pay annually and save 20%. Contact us for custom pricing for teams and enterprises.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Unlock Full Access?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join hundreds of businesses managing their finances the smart way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-gradient-to-r from-navy to-navy-light text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              🚀 Start Free Trial
            </a>
            <a
              href="/contact"
              className="bg-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              📞 Contact Sales
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
