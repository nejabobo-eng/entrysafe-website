import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function AccountingApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-navy mb-6">
            📱 Entry Safe - Accounting App
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Complete accounting solution for Android and Windows. Track income, expenses, and financial reports with confidence.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
          <p className="text-lg text-blue-800 font-semibold">
            🚀 Coming Soon - Content being updated
          </p>
          <p className="text-gray-600 mt-2">
            This page is being redesigned with major updates. Check back soon!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
