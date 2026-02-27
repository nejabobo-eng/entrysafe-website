import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function EntrySafeDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-navy mb-6">
            📄 Entry Safe Docs - Document Management
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Store, organize, and manage all your business documents securely in one place. Access from anywhere, anytime.
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
          <span className="bg-gold text-navy px-6 py-3 rounded-full font-semibold shadow-lg">
            🌐 Web Access
          </span>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            ✨ Document Management Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📁</div>
              <h3 className="text-xl font-bold mb-2">Smart Organization</h3>
              <p className="text-gray-200">Organize documents by category, client, or project with ease</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-bold mb-2">Powerful Search</h3>
              <p className="text-gray-200">Find any document instantly with advanced search filters</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">☁️</div>
              <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
              <p className="text-gray-200">Secure cloud backup - never lose an important document</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📤</div>
              <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
              <p className="text-gray-200">Share documents securely with clients or team members</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-xl font-bold mb-2">Scan & Upload</h3>
              <p className="text-gray-200">Scan receipts and invoices directly from your phone</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-xl font-bold mb-2">Secure Access</h3>
              <p className="text-gray-200">Role-based permissions and encryption for sensitive files</p>
            </div>
          </div>
        </div>

        {/* Document Types */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            📋 Supported Document Types
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">🧾</div>
              <p className="font-semibold text-navy">Invoices</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">📄</div>
              <p className="font-semibold text-navy">Contracts</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-navy">Financial Statements</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">🏦</div>
              <p className="font-semibold text-navy">Bank Statements</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">📑</div>
              <p className="font-semibold text-navy">Tax Documents</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-semibold text-navy">Compliance Forms</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">📝</div>
              <p className="font-semibold text-navy">Reports</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">📎</div>
              <p className="font-semibold text-navy">Receipts</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            💎 Benefits of Entry Safe Docs
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Save Time</h3>
              <p className="text-gray-200">
                No more digging through filing cabinets. Find what you need in seconds.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Stay Organized</h3>
              <p className="text-gray-200">
                Keep all business documents in one centralized, organized system.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ SARS Ready</h3>
              <p className="text-gray-200">
                Keep audit-ready records with automatic organization and timestamping.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Access Anywhere</h3>
              <p className="text-gray-200">
                Work from office, home, or on the go with multi-platform access.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Go Paperless?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join hundreds of businesses managing documents the smart way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-gradient-to-r from-navy to-navy-light text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              🚀 Start Free Trial
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
