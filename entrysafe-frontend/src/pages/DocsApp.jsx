import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function DocsApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-navy mb-6">
            📄 Entry Safe Docs - Document Management App
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Store, organize, and manage all your business documents securely in one place. Access from anywhere, anytime.
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
            🌐 Web Access Available
          </span>
        </div>

        {/* Availability Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12 text-center">
          <p className="text-lg text-blue-800 font-semibold">
            🚀 The Entry Safe Docs App will be made available on Google Play Store and Microsoft Store when ready.
          </p>
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
              <p className="text-gray-200">Secure cloud backup with tier-based storage limits</p>
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
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Organization</h3>
              <p className="text-gray-200">Smart categorization and tagging powered by AI</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-xl font-bold mb-2">Secure Access</h3>
              <p className="text-gray-200">Role-based permissions and encryption for sensitive files</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-xl font-bold mb-2">Multi-Device Sync</h3>
              <p className="text-gray-200">Access your documents from Android, Windows, or Web</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Version Control</h3>
              <p className="text-gray-200">Track document revisions and restore previous versions</p>
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
              <div className="text-4xl mb-2">📝</div>
              <p className="font-semibold text-navy">Receipts</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">💼</div>
              <p className="font-semibold text-navy">Business Records</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-3xl mb-2">📁</div>
              <p className="font-semibold text-navy">And More...</p>
            </div>
          </div>
        </div>

        {/* Why Entry Safe Docs */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🚀 Why Choose Entry Safe Docs?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Compliance Ready</h3>
              <p className="text-gray-200">
                Keep your documents organized for SARS audits and tax submissions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Access Anywhere</h3>
              <p className="text-gray-200">
                Work from office, home, or on-the-go with multi-platform access.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Secure & Private</h3>
              <p className="text-gray-200">
                Bank-level encryption ensures your sensitive documents stay safe.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Save Time</h3>
              <p className="text-gray-200">
                No more digging through folders - find what you need instantly.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Go Paperless?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join businesses simplifying their document management with Entry Safe Docs.
          </p>
          <a 
            href="/apps" 
            className="inline-block bg-gold hover:bg-gold-dark text-navy font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all hover:scale-105"
          >
            View Subscription Plans →
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
