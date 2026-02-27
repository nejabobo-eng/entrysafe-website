import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function EntrySafe() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-navy mb-6">
            📱 Entry Safe - Accounting System
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your complete accounting solution for Android and Windows. Manage your finances, track expenses, and grow your business with confidence.
          </p>
        </div>

        {/* Platform Badges */}
        <div className="flex justify-center gap-4 mb-12">
          <span className="bg-navy text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            📱 Android App
          </span>
          <span className="bg-navy text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            💻 Windows App
          </span>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            ✨ Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold mb-2">Income Tracking</h3>
              <p className="text-gray-200">Monitor all revenue streams and cash flow in real-time</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Expense Management</h3>
              <p className="text-gray-200">Track and categorize all business expenses effortlessly</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-bold mb-2">Financial Reports</h3>
              <p className="text-gray-200">Generate professional reports for tax and compliance</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🧾</div>
              <h3 className="text-xl font-bold mb-2">Invoicing</h3>
              <p className="text-gray-200">Create and send professional invoices instantly</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-xl font-bold mb-2">Multi-Platform Sync</h3>
              <p className="text-gray-200">Access your data seamlessly across Android and Windows</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-xl font-bold mb-2">Bank-Level Security</h3>
              <p className="text-gray-200">Your financial data is encrypted and protected</p>
            </div>
          </div>
        </div>

        {/* Why Entry Safe */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🚀 Why Choose Entry Safe?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Built for South African Businesses</h3>
              <p className="text-gray-200">
                Compliant with SARS requirements, supports ZAR currency, and understands local tax regulations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Affordable & Transparent</h3>
              <p className="text-gray-200">
                No hidden fees. One subscription covers all platforms and features.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Easy to Use</h3>
              <p className="text-gray-200">
                Designed for SMEs and entrepreneurs with no accounting background required.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Expert Support</h3>
              <p className="text-gray-200">
                Our team is here to help you succeed. Get support when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Transform Your Accounting?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Start your free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-gradient-to-r from-navy to-navy-light text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              🚀 Get Started Free
            </a>
            <a
              href="/entry-safe-pricing"
              className="bg-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              💰 View Pricing
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
