import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function PricingApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-navy mb-6">
            💰 Entry Safe Pricing - Pricing App
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            The Entry Safe Pricing app helps you understand and compare subscription tiers for the Entry Safe ecosystem. Access detailed breakdowns of features, benefits, and costs.
          </p>
        </div>

        {/* Platform Badges */}
        <div className="flex justify-center gap-4 mb-12">
          <span className="bg-navy text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            📱 Coming to Google Play Store
          </span>
          <span className="bg-navy text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            💻 Coming to Microsoft Store
          </span>
          <span className="bg-gold text-navy px-6 py-3 rounded-full font-semibold shadow-lg">
            🌐 Available on Website
          </span>
        </div>

        {/* Availability Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12 text-center">
          <p className="text-lg text-blue-800 font-semibold">
            🚀 The Entry Safe Pricing App will be made available on Google Play Store and Microsoft Store when ready.
          </p>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            ✨ What the Pricing App Offers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Tier Comparison</h3>
              <p className="text-gray-200">View all subscription tiers side-by-side with feature comparisons</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
              <p className="text-gray-200">Get personalized tier recommendations based on your business needs</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold mb-2">Cost Calculator</h3>
              <p className="text-gray-200">Calculate your total cost based on selected features and users</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-bold mb-2">Platform Coverage</h3>
              <p className="text-gray-200">See which apps are included in each subscription tier</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-xl font-bold mb-2">Upgrade Path</h3>
              <p className="text-gray-200">Visualize your upgrade journey from Starter to Premium to Annual</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="text-xl font-bold mb-2">Direct Subscription</h3>
              <p className="text-gray-200">Subscribe to your chosen tier directly from the app</p>
            </div>
          </div>
        </div>

        {/* Why Use the Pricing App */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🚀 Why Use the Entry Safe Pricing App?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Clear & Transparent</h3>
              <p className="text-gray-200">
                No hidden fees. See exactly what you get with each subscription tier.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Compare Before You Buy</h3>
              <p className="text-gray-200">
                Make an informed decision by comparing all features side-by-side.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Easy Upgrades</h3>
              <p className="text-gray-200">
                Upgrade or downgrade your subscription anytime from the app.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Mobile-Friendly</h3>
              <p className="text-gray-200">
                Review pricing and subscribe on-the-go from your Android or Windows device.
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Tiers Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-6 text-center">
            📦 Available Subscription Tiers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-navy mb-2">Starter</h3>
              <p className="text-3xl font-bold text-gold mb-2">R199/month</p>
              <p className="text-gray-600">Perfect for small businesses</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-gold to-yellow-500 rounded-xl text-center border-4 border-gold">
              <div className="text-sm font-bold text-navy mb-2">⭐ MOST POPULAR</div>
              <h3 className="text-2xl font-bold text-navy mb-2">Premium</h3>
              <p className="text-3xl font-bold text-navy mb-2">R499/month</p>
              <p className="text-navy">Full access, ad-free</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-navy mb-2">Annual Professional</h3>
              <p className="text-3xl font-bold text-gold mb-2">R4,999/year</p>
              <p className="text-gray-600">Best value for businesses</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Choose Your Plan?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            View detailed pricing information and subscribe to the plan that fits your business.
          </p>
          <a 
            href="/apps" 
            className="inline-block bg-gold hover:bg-gold-dark text-navy font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all hover:scale-105"
          >
            View Full Pricing & Subscribe →
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
