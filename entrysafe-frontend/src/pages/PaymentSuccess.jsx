import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { executeAgreement, getSubscriptionStatus } from '../services/paymentService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // processing, polling, success, error
  const [message, setMessage] = useState('Processing your payment...')
  const [pollCount, setPollCount] = useState(0)

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

        // Execute billing agreement (marks as pending_confirmation)
        const result = await executeAgreement(token, firebaseToken)

        // ============================================================================
        // WEBHOOK-VERIFIED ACTIVATION: Poll status until webhook confirms
        // ============================================================================
        if (result.status === 'pending_confirmation') {
          setStatus('polling')
          setMessage('Verifying payment with PayPal...')

          // Poll subscription status every 5 seconds
          const pollInterval = setInterval(async () => {
            try {
              setPollCount(prev => prev + 1)

              const statusResult = await getSubscriptionStatus(firebaseToken)

              if (statusResult.status === 'active') {
                // ✅ Webhook confirmed! Show success
                clearInterval(pollInterval)
                setStatus('success')
                setMessage(`Payment confirmed! Welcome to ${statusResult.tier} plan!`)

                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                  navigate('/portal')
                }, 3000)
              }
            } catch (pollError) {
              console.error('Status poll error:', pollError)
              // Continue polling despite errors (webhook might be delayed)
            }
          }, 5000) // Poll every 5 seconds

          // Timeout after 60 seconds
          setTimeout(() => {
            clearInterval(pollInterval)
            if (status === 'polling') {
              setStatus('error')
              setMessage('Payment verification is taking longer than expected. Your payment was submitted, but confirmation is delayed. Please check your account in a few minutes or contact support if the issue persists.')
            }
          }, 60000) // 60 second timeout

        } else if (result.status === 'active') {
          // Already active (shouldn't happen with new security fix, but handle it)
          setStatus('success')
          setMessage(`Successfully subscribed to ${result.tier} plan!`)

          setTimeout(() => {
            navigate('/portal')
          }, 3000)
        }

      } catch (error) {
        console.error('Payment activation error:', error)
        setStatus('error')

        // Enhanced error messages
        if (error.message.includes('limit exceeded')) {
          setMessage('Your subscription limit has been reached. Please contact support to resolve this issue.')
        } else if (error.message.includes('Authentication')) {
          setMessage('Authentication error. Please log in again and try subscribing.')
        } else {
          setMessage(error.message || 'Failed to activate subscription. Please contact support.')
        }
      }
    }

    activateSubscription()
  }, [searchParams, user, navigate, status])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {(status === 'processing' || status === 'polling') && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy mx-auto mb-6"></div>
              <h1 className="text-3xl font-bold text-navy mb-4">
                {status === 'processing' ? 'Processing Payment...' : 'Verifying Payment...'}
              </h1>
              <p className="text-gray-600 mb-2">{message}</p>
              {status === 'polling' && (
                <p className="text-sm text-gray-500 mt-4">
                  Waiting for PayPal confirmation... ({pollCount * 5}s)
                </p>
              )}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  🔐 <strong>Security Notice:</strong> We're verifying your payment with PayPal before activating your subscription. This ensures your payment is confirmed before granting access.
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Confirmed!</h1>
              <p className="text-gray-700 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Issue</h1>
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
