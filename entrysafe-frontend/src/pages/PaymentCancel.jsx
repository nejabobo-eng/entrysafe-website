import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-3xl font-bold text-navy mb-4">Payment Cancelled</h1>
          <p className="text-gray-700 mb-8">
            You cancelled the payment process. No charges were made to your account.
          </p>

          <div className="space-y-4">
            <p className="text-gray-600">
              Need help choosing the right plan?
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                to="/apps"
                className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-all inline-block"
              >
                View Plans Again
              </Link>

              <Link
                to="/contact"
                className="bg-gray-200 text-navy px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all inline-block"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-navy mb-2">Why Subscribe?</h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Unlock all 4 Entry Safe apps
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                AI-powered business management
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                SARS-compliant accounting
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Secure cloud storage
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
