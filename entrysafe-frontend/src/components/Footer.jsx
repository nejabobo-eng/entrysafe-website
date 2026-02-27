import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageCircle, Shield, FileText, Calculator, TrendingUp, Briefcase, Palette } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Knowledge Hub', path: '/knowledge-hub' },
    { name: 'Live Feeds', path: '/live-feeds' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    { name: 'Business Registration', icon: <FileText size={16} />, path: '/services' },
    { name: 'Tax Assistance', icon: <Calculator size={16} />, path: '/services' },
    { name: 'Accounting Advisory', icon: <TrendingUp size={16} />, path: '/services' },
    { name: 'Financial Statements', icon: <Briefcase size={16} />, path: '/services' },
    { name: 'Business Planning', icon: <Shield size={16} />, path: '/services' },
    { name: 'Logo & Branding', icon: <Palette size={16} />, path: '/services' },
  ];

  return (
    <footer className="bg-gradient-to-br from-navy via-navy-dark to-navy text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Section 1 - Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
              <span className="text-3xl">🔐</span>
              <span className="text-2xl font-bold">EntrySafe</span>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              Empowering South African entrepreneurs with professional business services and secure document management.
            </p>
            <p className="text-xs text-gold font-semibold">
              A service by Mlu Accounting Services
            </p>
            <p className="text-xs text-gray-400 mt-1">
              CIBA Certified Accountant
            </p>
            <p className="text-xs text-gold mt-2">
              🌐 entrysafe.co.za
            </p>
          </div>

          {/* Section 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-gold transition-colors flex items-center space-x-2"
                  >
                    <span className="text-gold">▸</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/portal"
                  className="text-sm text-gold hover:text-gold-light transition-colors flex items-center space-x-2 font-semibold"
                >
                  <span>🔒</span>
                  <span>Client Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3 - Services Summary */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-sm text-gray-300 hover:text-gold transition-colors flex items-center space-x-2"
                  >
                    <span className="text-gold">{service.icon}</span>
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 - Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <Phone className="text-gold flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <a href="tel:+27622475462" className="hover:text-gold transition-colors">
                    062 247 5462
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <Mail className="text-gold flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <a href="mailto:entrysafeapps@gmail.com" className="hover:text-gold transition-colors">
                    entrysafeapps@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="text-gold flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p>Verulam, KwaZulu-Natal</p>
                  <p>South Africa</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <Clock className="text-gold flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p>Mon - Fri: 8:00 AM - 5:00 PM</p>
                  <p>Sat: By Appointment</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MessageCircle className="text-gold flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <a
                    href="https://wa.me/27622475462"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold-light transition-colors font-semibold"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-gray-300 text-center md:text-left">
            <p>
              © {currentYear} <span className="font-semibold text-white">Mlu Accounting Services</span>. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-gold font-semibold">entrysafe.co.za</span> – Empowering South African Entrepreneurs
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/about"
              className="text-xs text-gray-300 hover:text-gold transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/about"
              className="text-xs text-gray-300 hover:text-gold transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-gray-600">•</span>
            <a
              href="https://www.cipc.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-300 hover:text-gold transition-colors flex items-center space-x-1"
            >
              <Shield size={12} />
              <span>CIPC Compliant</span>
            </a>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="bg-navy-dark py-3 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield size={14} className="text-gold" />
              <span>Secure Document Storage</span>
            </div>
            <span className="hidden md:block">•</span>
            <div className="flex items-center space-x-2">
              <FileText size={14} className="text-gold" />
              <span>CIPC Registered Agent</span>
            </div>
            <span className="hidden md:block">•</span>
            <div className="flex items-center space-x-2">
              <Calculator size={14} className="text-gold" />
              <span>CIBA Certified Accountant</span>
            </div>
            <span className="hidden md:block">•</span>
            <div className="flex items-center space-x-2">
              <TrendingUp size={14} className="text-gold" />
              <span>500+ Businesses Served</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
