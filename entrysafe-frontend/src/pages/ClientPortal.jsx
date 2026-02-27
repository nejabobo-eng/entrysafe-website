import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { FileText, CreditCard, Settings, Download, Calendar, TrendingUp, Shield, Bell } from "lucide-react"

export default function ClientPortal() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-navy mb-2">Welcome to Entry Safe</h1>
            <p className="text-lg text-gray-600">Your business command center</p>
          </div>

          {/* Welcome Banner with Subscription Status */}
          <div className="bg-gradient-to-r from-navy via-navy-dark to-navy-light text-white rounded-2xl shadow-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-300 mb-1">Welcome back,</p>
                <p className="text-3xl font-bold mb-2">{user?.email}</p>
                <div className="flex items-center gap-2">
                  <Shield className="text-gold" size={20} />
                  <span className="text-gray-300">Account Verified</span>
                </div>
              </div>
              <div className="bg-gold text-navy px-6 py-4 rounded-xl shadow-lg">
                <p className="text-sm font-semibold mb-1">Current Plan</p>
                <p className="text-2xl font-bold">Free Tier</p>
                <Link to="/apps" className="text-sm text-navy-dark hover:underline mt-1 block">
                  Upgrade to Premium →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <FileText className="text-navy" size={32} />
                <span className="text-green-600 text-sm font-semibold">+3 this month</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">My Documents</p>
              <p className="text-4xl font-bold text-navy">12</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-gold" size={32} />
                <span className="text-blue-600 text-sm font-semibold">Active</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">Services</p>
              <p className="text-4xl font-bold text-navy">3</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <Bell className="text-purple-600" size={32} />
                <span className="text-red-600 text-sm font-semibold">2 new</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">Notifications</p>
              <p className="text-4xl font-bold text-navy">5</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-green-600" size={32} />
              </div>
              <p className="text-gray-500 text-sm mb-1">Last Login</p>
              <p className="text-xl font-bold text-navy">Today, 10:45 AM</p>
            </div>
          </div>

          {/* Entry Safe Apps Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-navy">Entry Safe Apps</h2>
              <Link to="/apps" className="text-gold hover:text-gold-dark font-semibold flex items-center gap-2">
                View All Apps →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* App 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-lg font-bold text-navy mb-2">Entry Safe Accounting</h3>
                <p className="text-sm text-gray-600 mb-4">Complete accounting system</p>
                <button className="w-full bg-navy/10 text-navy font-semibold py-2 rounded-lg hover:bg-navy/20 transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download
                </button>
              </div>

              {/* App 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-lg font-bold text-navy mb-2">Entry Safe Docs</h3>
                <p className="text-sm text-gray-600 mb-4">Document management</p>
                <button className="w-full bg-navy/10 text-navy font-semibold py-2 rounded-lg hover:bg-navy/20 transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download
                </button>
              </div>

              {/* App 3 */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-lg font-bold text-navy mb-2">Entry Safe Pricing</h3>
                <p className="text-sm text-gray-600 mb-4">Intelligent pricing engine</p>
                <button className="w-full bg-navy/10 text-navy font-semibold py-2 rounded-lg hover:bg-navy/20 transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download
                </button>
              </div>

              {/* App 4 */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all">
                <div className="text-5xl mb-4">💾</div>
                <h3 className="text-lg font-bold text-navy mb-2">SD Storage Helper</h3>
                <p className="text-sm text-gray-600 mb-4">Storage management</p>
                <button className="w-full bg-navy/10 text-navy font-semibold py-2 rounded-lg hover:bg-navy/20 transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-2xl font-bold mb-2">My Documents</h3>
              <p className="text-blue-100 mb-6">Access and download your uploaded documents securely</p>
              <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors w-full">
                View Documents
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-2xl font-bold mb-2">My Services</h3>
              <p className="text-green-100 mb-6">View your active services, packages, and billing</p>
              <button className="bg-white text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-green-50 transition-colors w-full">
                View Services
              </button>
            </div>

            <div className="bg-gradient-to-br from-gold to-gold-dark text-navy rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-2xl font-bold mb-2">Support</h3>
              <p className="text-navy-dark mb-6">Contact our support team for assistance anytime</p>
              <button className="bg-navy text-white font-bold py-3 px-6 rounded-lg hover:bg-navy-dark transition-colors w-full">
                Get Help
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-navy mb-6">📋 Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    📄
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Document uploaded: Business_Plan_2024.pdf</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <button className="text-navy hover:text-gold transition-colors">View</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    ✅
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Service activated: Tax Assistance Package</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>
                <button className="text-navy hover:text-gold transition-colors">View</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    💬
                  </div>
                  <div>
                    <p className="font-semibold text-navy">New message from support team</p>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
                <button className="text-navy hover:text-gold transition-colors">Read</button>
              </div>
            </div>
          </div>

          {/* Portal Status */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-4">✅ Client Portal Active!</h3>
            <p className="text-lg opacity-90 mb-4">
              This page is exclusively for users with the <strong>"client"</strong> role.
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="font-semibold mb-2">🔒 Security Test:</p>
              <p className="text-sm">
                Try accessing <Link to="/admin" className="underline font-bold">/admin</Link> - you should be redirected (access denied for clients)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
