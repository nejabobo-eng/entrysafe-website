import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { User, CreditCard, Bell, Shield, Trash2, AlertCircle, Activity, Database, FileText, Smartphone } from "lucide-react"

export default function AccountSettings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [usageStatus, setUsageStatus] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelClickCount, setCancelClickCount] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Load subscription and usage status
  useEffect(() => {
    fetchSubscriptionStatus()
    fetchUsageStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const token = await user.getIdToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/subscription-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data)
      }
    } catch (err) {
      console.error('Failed to load subscription:', err)
    }
  }

  const fetchUsageStatus = async () => {
    try {
      const token = await user.getIdToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/usage-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsageStatus(data)
      }
    } catch (err) {
      console.error('Failed to load usage status:', err)
    }
  }

  // Hidden cancellation feature: Click "Manage Subscription" 3 times
  const handleManageSubscription = () => {
    setCancelClickCount(prev => prev + 1)

    if (cancelClickCount + 1 >= 3) {
      setShowCancelModal(true)
      setCancelClickCount(0)
    } else {
      // Show PayPal management
      window.open('https://www.paypal.com/myaccount/autopay', '_blank')
    }
  }

  const handleCancelSubscription = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = await user.getIdToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Cancellation failed')
      }

      setSuccess("✅ Subscription cancelled successfully. You'll retain access until the end of your billing period.")
      setShowCancelModal(false)
      
      // Refresh subscription status
      setTimeout(() => {
        fetchSubscriptionStatus()
      }, 2000)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-navy mb-2">⚙️ Account Settings</h1>
            <p className="text-xl text-gray-600">Manage your account, subscription, and preferences</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              {error}
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <User className="text-navy" size={32} />
              <h2 className="text-2xl font-bold text-navy">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={user?.displayName || 'Not set'} 
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <CreditCard className="text-gold" size={32} />
              <h2 className="text-2xl font-bold text-navy">Subscription & Billing</h2>
            </div>

            {subscriptionStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-navy to-navy-dark text-white rounded-lg">
                  <div>
                    <p className="text-sm text-gray-300">Current Plan</p>
                    <p className="text-2xl font-bold">{subscriptionStatus.tier.toUpperCase()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${
                    subscriptionStatus.status === 'active' ? 'bg-green-500' :
                    subscriptionStatus.status === 'cancelled' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}>
                    <p className="font-semibold">{subscriptionStatus.status.toUpperCase()}</p>
                  </div>
                </div>

                {subscriptionStatus.tier !== 'FREE' && subscriptionStatus.status === 'active' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Subscription ID</p>
                        <p className="text-sm font-mono text-gray-800">{subscriptionStatus.subscription_id}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleManageSubscription}
                        className="flex-1 bg-navy text-white font-semibold py-3 px-6 rounded-lg hover:bg-navy-dark transition-colors"
                      >
                        Manage Subscription
                      </button>
                      
                      <button
                        onClick={() => navigate('/apps')}
                        className="flex-1 bg-gold text-navy font-semibold py-3 px-6 rounded-lg hover:bg-gold-dark transition-colors"
                      >
                        Upgrade Plan
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2 text-center">
                      💡 Tip: Click "Manage Subscription" 3 times to reveal advanced options
                    </p>
                  </div>
                )}

                {subscriptionStatus.tier === 'FREE' && (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">You're currently on the free tier</p>
                    <button
                      onClick={() => navigate('/apps')}
                      className="bg-gradient-to-r from-navy to-navy-dark text-white font-bold py-3 px-8 rounded-lg hover:shadow-xl transition-all"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">Loading subscription status...</p>
            )}
          </div>

          {/* Usage & Limits Section - Only show for Free and Starter tiers */}
          {usageStatus && (usageStatus.tier === 'FREE' || usageStatus.tier === 'STARTER') && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <Activity className="text-blue-600" size={32} />
                <h2 className="text-2xl font-bold text-navy">Usage & Limits</h2>
              </div>

              <div className="space-y-6">
                {/* AI Queries Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity size={20} className="text-blue-600" />
                      <span className="font-semibold text-gray-700">AI Queries (Monthly)</span>
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      {usageStatus.usage.ai_queries.used} / {usageStatus.usage.ai_queries.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        usageStatus.usage.ai_queries.percentage >= 90 ? 'bg-red-500' :
                        usageStatus.usage.ai_queries.percentage >= 70 ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(usageStatus.usage.ai_queries.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {usageStatus.usage.ai_queries.percentage >= 90 ? (
                      <span className="text-red-600 font-semibold">⚠️ Almost at limit! Upgrade for unlimited queries.</span>
                    ) : (
                      `${Math.round(100 - usageStatus.usage.ai_queries.percentage)}% remaining`
                    )}
                  </p>
                </div>

                {/* Storage Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database size={20} className="text-green-600" />
                      <span className="font-semibold text-gray-700">Storage</span>
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      {usageStatus.usage.storage.used_gb} GB / {usageStatus.usage.storage.limit_gb} GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        usageStatus.usage.storage.percentage >= 90 ? 'bg-red-500' :
                        usageStatus.usage.storage.percentage >= 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usageStatus.usage.storage.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {usageStatus.usage.storage.percentage >= 90 ? (
                      <span className="text-red-600 font-semibold">⚠️ Storage almost full! Upgrade for unlimited storage.</span>
                    ) : (
                      `${Math.round(100 - usageStatus.usage.storage.percentage)}% remaining`
                    )}
                  </p>
                </div>

                {/* Documents Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-purple-600" />
                      <span className="font-semibold text-gray-700">Documents</span>
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      {usageStatus.usage.documents.used} / {usageStatus.usage.documents.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        usageStatus.usage.documents.percentage >= 90 ? 'bg-red-500' :
                        usageStatus.usage.documents.percentage >= 70 ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${Math.min(usageStatus.usage.documents.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {usageStatus.usage.documents.percentage >= 90 ? (
                      <span className="text-red-600 font-semibold">⚠️ Document limit almost reached!</span>
                    ) : (
                      `${Math.round(100 - usageStatus.usage.documents.percentage)}% remaining`
                    )}
                  </p>
                </div>

                {/* Devices Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone size={20} className="text-orange-600" />
                      <span className="font-semibold text-gray-700">Registered Devices</span>
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      {usageStatus.usage.devices.used} / {usageStatus.usage.devices.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        usageStatus.usage.devices.percentage >= 90 ? 'bg-red-500' :
                        usageStatus.usage.devices.percentage >= 70 ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(usageStatus.usage.devices.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {usageStatus.usage.devices.percentage >= 90 ? (
                      <span className="text-red-600 font-semibold">⚠️ Device limit almost reached!</span>
                    ) : (
                      `${usageStatus.usage.devices.limit - usageStatus.usage.devices.used} devices remaining`
                    )}
                  </p>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="mt-6 p-4 bg-gradient-to-r from-navy to-navy-dark rounded-lg text-white">
                <h3 className="font-bold text-lg mb-2">🚀 Unlock Unlimited Access</h3>
                <p className="text-sm text-gray-200 mb-4">
                  Upgrade to Premium for unlimited AI queries, storage, documents, and devices.
                </p>
                <button
                  onClick={() => navigate('/apps')}
                  className="bg-gold text-navy font-bold py-2 px-6 rounded-lg hover:bg-gold-dark transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

          {/* Premium Unlimited Display */}
          {usageStatus && (usageStatus.tier === 'PREMIUM' || usageStatus.tier === 'ANNUAL') && (
            <div className="bg-gradient-to-br from-navy to-navy-dark rounded-2xl shadow-lg p-8 mb-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <Activity className="text-gold" size={32} />
                <h2 className="text-2xl font-bold">Premium Unlimited</h2>
              </div>
              <p className="text-gray-300 mb-6">
                You're on the {usageStatus.tier} plan with unlimited access to all features!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                  <Activity size={24} className="mx-auto mb-2 text-gold" />
                  <p className="text-sm font-semibold">Unlimited</p>
                  <p className="text-xs text-gray-300">AI Queries</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                  <Database size={24} className="mx-auto mb-2 text-gold" />
                  <p className="text-sm font-semibold">Unlimited</p>
                  <p className="text-xs text-gray-300">Storage</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                  <FileText size={24} className="mx-auto mb-2 text-gold" />
                  <p className="text-sm font-semibold">Unlimited</p>
                  <p className="text-xs text-gray-300">Documents</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                  <Smartphone size={24} className="mx-auto mb-2 text-gold" />
                  <p className="text-sm font-semibold">Unlimited</p>
                  <p className="text-xs text-gray-300">Devices</p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <Bell className="text-purple-600" size={32} />
              <h2 className="text-2xl font-bold text-navy">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-700">Email notifications for new documents</span>
                <input type="checkbox" className="w-5 h-5 text-navy rounded" defaultChecked />
              </label>
              
              <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-700">Payment and billing updates</span>
                <input type="checkbox" className="w-5 h-5 text-navy rounded" defaultChecked />
              </label>
              
              <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-700">Product updates and new features</span>
                <input type="checkbox" className="w-5 h-5 text-navy rounded" />
              </label>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="text-red-600" size={32} />
              <h2 className="text-2xl font-bold text-navy">Security</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full px-4 py-3 border border-navy text-navy font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors">
                Change Password
              </button>
              
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal (Hidden - only appears after 3 clicks) */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <AlertCircle className="text-red-600 mx-auto mb-4" size={64} />
              <h3 className="text-2xl font-bold text-navy mb-2">Cancel Subscription?</h3>
              <p className="text-gray-600">
                Are you sure you want to cancel your subscription? You'll lose access to premium features.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You'll retain access until the end of your current billing period.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Subscription
              </button>
              
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
