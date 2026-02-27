import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-navy mb-2">🛡️ Admin Dashboard</h1>
            <p className="text-xl text-gray-600">Complete system control and management</p>
          </div>

          {/* Admin Badge */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-100 mb-1">Logged in as</p>
                <p className="text-2xl font-bold">{user?.email}</p>
              </div>
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold">ADMIN</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Users</p>
                  <p className="text-4xl font-bold text-navy">247</p>
                </div>
                <div className="text-5xl opacity-20">👥</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Documents</p>
                  <p className="text-4xl font-bold text-navy">1,423</p>
                </div>
                <div className="text-5xl opacity-20">📄</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gold hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Active Sessions</p>
                  <p className="text-4xl font-bold text-navy">89</p>
                </div>
                <div className="text-5xl opacity-20">🔒</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Admin Actions</p>
                  <p className="text-4xl font-bold text-navy">34</p>
                </div>
                <div className="text-5xl opacity-20">⚡</div>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-2">User Management</h3>
              <p className="text-blue-100 mb-6">View, edit, and manage all user accounts and roles</p>
              <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors w-full">
                Manage Users
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-2xl font-bold mb-2">Document Management</h3>
              <p className="text-green-100 mb-6">Upload, organize, and manage client documents securely</p>
              <button className="bg-white text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-green-50 transition-colors w-full">
                Manage Docs
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-2">Testimonials</h3>
              <p className="text-purple-100 mb-6">Review and approve pending testimonials</p>
              <Link to="/admin/testimonials" className="block bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-purple-50 transition-colors text-center">
                Manage Testimonials
              </Link>
            </div>

            <div className="bg-gradient-to-br from-gold to-gold-dark text-navy rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-2">Analytics</h3>
              <p className="text-navy-dark mb-6">View platform statistics, usage metrics, and reports</p>
              <button className="bg-navy text-white font-bold py-3 px-6 rounded-lg hover:bg-navy-dark transition-colors w-full">
                View Stats
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-navy mb-6">✅ Admin Access Confirmed</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-3">Active Features:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Firestore User Profiles</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Role Storage (admin/client)</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> AdminRoute Protection</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Role Loading in AuthContext</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Role-Based Redirects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-3">Security Test:</h4>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-sm text-red-700">
                    <strong>Try accessing:</strong> <Link to="/portal" className="underline">/portal</Link>
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    You should be redirected to home (access denied for admins)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
