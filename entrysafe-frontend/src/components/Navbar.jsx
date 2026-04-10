import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useAuth } from "../contexts/AuthContext"
import Logo from "./Logo"

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-navy via-navy-light to-navy sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl hover:text-gold transition-colors">
            <span className="text-2xl">🔐</span>
            <span>EntrySafe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              Home
            </Link>

            <Link to="/accounting-app" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              💰 Accounting App
            </Link>

            <Link to="/docs-app" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              📄 Docs App
            </Link>

            <Link to="/pricing-app" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              💎 Pricing App
            </Link>

            <Link to="/services" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              💼 Services
            </Link>

            <Link to="/knowledge-hub" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              📚 Knowledge
            </Link>

            <Link to="/live-feeds" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              📊 Feeds
            </Link>

            <Link to="/about" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              ℹ️ About
            </Link>

            <Link to="/testimonials" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              ⭐ Testimonials
            </Link>

            <Link to="/contact" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              📞 Contact
            </Link>

            {/* Role-based Links */}
            {user?.role === "admin" && (
              <Link to="/admin" className="text-gold hover:text-gold-light px-3 py-2 rounded-lg transition-colors font-semibold">
                🛡️ Admin Dashboard
              </Link>
            )}

            {user?.role === "client" && (
              <Link to="/portal" className="text-gold hover:text-gold-light px-3 py-2 rounded-lg transition-colors font-semibold">
                📂 Client Portal
              </Link>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-2 rounded-lg transition-all border border-white border-opacity-30"
              >
                <span>👤</span>
                <span className="max-w-[150px] truncate text-sm">{user?.email}</span>
                <span className="text-xs">▼</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                    <p className={`text-xs font-bold mt-1 ${user?.role === 'admin' ? 'text-red-600' : 'text-navy'}`}>
                      {user?.role?.toUpperCase()}
                    </p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-navy hover:bg-gray-50 transition-colors font-semibold"
                  >
                    ⚙️ Account Settings
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold border-t border-gray-200"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl focus:outline-none"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              Home
            </Link>

            <Link to="/apps" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              📱 Apps
            </Link>

            <Link to="/accounting-app" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              💰 Accounting App
            </Link>

            <Link to="/docs-app" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              📄 Docs App
            </Link>

            <Link to="/pricing-app" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              💎 Pricing App
            </Link>

            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              💼 Services
            </Link>

            <Link to="/knowledge-hub" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              📚 Knowledge
            </Link>

            <Link to="/live-feeds" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              📊 Feeds
            </Link>

            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              ℹ️ About
            </Link>

            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              📞 Contact
            </Link>

            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-gold hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors font-semibold">
                🛡️ Admin Dashboard
              </Link>
            )}

            {user?.role === "client" && (
              <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="block text-gold hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors font-semibold">
                📂 Client Portal
              </Link>
            )}

            <div className="border-t border-white border-opacity-20 mt-3 pt-3">
              <p className="text-gold text-sm px-3 mb-2">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
