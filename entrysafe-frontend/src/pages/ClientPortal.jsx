import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function ClientPortal() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-navy mb-2">📂 Client Portal</h1>
            <p className="text-xl text-gray-600">Your personal workspace and documents</p>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-navy to-navy-dark text-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200 mb-1">Welcome back,</p>
                <p className="text-2xl font-bold">{user?.email}</p>
              </div>
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg backdrop-blur-sm">
                <p className="text-2xl font-bold">CLIENT</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">My Documents</p>
                  <p className="text-4xl font-bold text-navy">12</p>
                </div>
                <div className="text-5xl opacity-20">📄</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Active Services</p>
                  <p className="text-4xl font-bold text-navy">3</p>
                </div>
                <div className="text-5xl opacity-20">💼</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gold hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Messages</p>
                  <p className="text-4xl font-bold text-navy">5</p>
                </div>
                <div className="text-5xl opacity-20">💬</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Last Login</p>
                  <p className="text-lg font-bold text-navy">Today</p>
                </div>
                <div className="text-5xl opacity-20">🕒</div>
              </div>
            </div>
          </div>

          {/* Service Cards */}
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
