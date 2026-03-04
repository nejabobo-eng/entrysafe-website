import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { executeAgreement } from '../services/paymentService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Processing your payment...')

  useEffect(() => {
    const activateSubscription = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('No payment token found. Please try again.')
        return
      }

      if (!user) {
        setStatus('error')
        setMessage('You must be logged in to complete payment.')
        return
      }

      try {
        // Get Firebase token
        const firebaseToken = await user.getIdToken()

        // Execute billing agreement
        const result = await executeAgreement(token, firebaseToken)

        setStatus('success')
        setMessage(`Successfully subscribed to ${result.tier} plan!`)

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/portal')
        }, 3000)

      } catch (error) {
        console.error('Payment activation error:', error)
        setStatus('error')
        setMessage(error.message || 'Failed to activate subscription. Please contact support.')
      }
    }

    activateSubscription()
  }, [searchParams, user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy mx-auto mb-6"></div>
              <h1 className="text-3xl font-bold text-navy mb-4">Processing Payment...</h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
              <p className="text-gray-700 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
              <p className="text-gray-700 mb-6">{message}</p>
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/apps')}
                  className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-gray-200 text-navy px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Contact Support
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
