import { useState } from "react"
import { Link } from "react-router-dom"
import Logo from "./Logo"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

            <Link to="/apps" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              📱 Apps
            </Link>

            <Link to="/services" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              💼 Services
            </Link>



            <Link to="/about" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              ℹ️ About
            </Link>



            <Link to="/contact" className="text-white hover:text-gold px-3 py-2 rounded-lg transition-colors font-medium">
              📞 Contact
            </Link>

            {/* User Dropdown - removed for frontend-only site */}
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

            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              💼 Services
            </Link>



            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              ℹ️ About
            </Link>

            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors">
              📞 Contact
            </Link>


          </div>
        )}
      </div>
    </nav>
  )
}
