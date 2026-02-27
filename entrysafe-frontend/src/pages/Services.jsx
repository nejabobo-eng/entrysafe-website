import { Link } from 'react-router-dom';
import { 
  CheckCircle, FileText, Calculator, TrendingUp, Briefcase, Palette, 
  ArrowRight, Phone, Globe, Smartphone, Code, Shield, Users, DollarSign 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Services() {
  const coreServices = [
    {
      icon: <FileText className="w-12 h-12" />,
      title: "Business Registration",
      description: "Complete CIPC registration, company name search, and official documentation for your new business.",
      features: [
        "Company name availability check",
        "CIPC registration & filing",
        "Official registration certificates",
        "Director & shareholder setup"
      ],
      price: "R750",
      popular: true
    },
    {
      icon: <Calculator className="w-12 h-12" />,
      title: "Tax Assistance",
      description: "SARS registration, tax returns support, and professional tax guidance.",
      features: [
        "SARS registration",
        "Tax returns support",
        "Tax compliance advisory",
        "Deadline reminders"
      ],
      price: "R350",
      popular: false
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Business Profile Design",
      description: "Professional business profile to showcase your company to clients and investors.",
      features: [
        "Custom business profile",
        "Professional layout",
        "Company overview",
        "Digital-ready format"
      ],
      price: "R500",
      popular: false
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Logo Design & Branding",
      description: "Professional logo design and branding package to establish your business identity.",
      features: [
        "Custom logo design",
        "Brand color palette",
        "Multiple format exports",
        "Source files included"
      ],
      price: "R400",
      popular: false
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Business Plan Writing",
      description: "Professional business plans for funding applications, investors, and strategic growth.",
      features: [
        "Market research & analysis",
        "Financial projections",
        "Funding-ready documents",
        "Executive summaries"
      ],
      price: "R900",
      popular: false
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Accounting Advisory",
      description: "Professional financial guidance to help your business grow and make informed decisions.",
      features: [
        "Financial consultation",
        "Cash flow management",
        "Budgeting guidance",
        "Business performance analysis"
      ],
      price: "R600",
      popular: false
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "Financial Statements",
      description: "Comprehensive financial statements for compliance and stakeholder reporting.",
      features: [
        "Income statements",
        "Balance sheets",
        "Cash flow statements",
        "Annual financial reporting"
      ],
      price: "R1,200",
      popular: false
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Website Design",
      description: "Professional business website to establish your online presence.",
      features: [
        "Responsive design",
        "Mobile-friendly layout",
        "SEO optimized",
        "Contact forms"
      ],
      price: "R1,000",
      popular: false
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Business & Utility Apps",
      description: "Custom business and utility app development for Android and iOS.",
      features: [
        "Custom app development",
        "Android & iOS compatible",
        "User-friendly interface",
        "Backend integration"
      ],
      price: "R1,000",
      popular: false
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: "Entertainment Media Apps",
      description: "Professional entertainment and media app development for engaging user experiences.",
      features: [
        "Custom entertainment apps",
        "Media streaming features",
        "Interactive UI/UX",
        "Cross-platform support"
      ],
      price: "R2,000",
      popular: false
    }
  ];

  const complianceServices = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "VAT Registration",
      price: "R450"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "PAYE Registration",
      price: "R450"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "UIF Registration",
      price: "R300"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "CIPC Annual Returns Filing",
      price: "R500"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Monthly Bookkeeping",
      price: "R800 - R1,500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Payroll Processing (up to 10 employees)",
      price: "R700/month"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Company Amendments",
      price: "R350"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Tax Clearance Certificate",
      price: "R400"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compliance Health Check",
      price: "R650"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Cash Flow Projections",
      price: "R750"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Company Deregistration",
      price: "R600"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-navy via-navy-dark to-navy text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Professional Business Services
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Everything you need to start, run, and grow your business in South Africa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center bg-gold text-navy font-bold px-8 py-4 rounded-lg hover:bg-gold-light transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <a
                href="tel:+27622475462"
                className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg hover:bg-white/20 transition-all border border-white/30"
              >
                <Phone className="mr-2" size={20} />
                062 247 5462
              </a>
            </div>
          </div>
        </section>

        {/* Core Services Grid */}
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy mb-4">💼 Core Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional services to launch and scale your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 p-8 ${
                  service.popular ? 'border-4 border-gold relative' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-navy px-6 py-2 rounded-full font-bold text-sm">
                    ⭐ Most Popular
                  </div>
                )}
                <div className="text-navy mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-navy mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <div className="mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start mb-2">
                      <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={16} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-2xl font-bold text-navy mb-4">{service.price}</p>
                  <Link
                    to="/contact"
                    className="block w-full bg-gradient-to-r from-navy to-navy-dark text-white font-bold py-3 px-6 rounded-lg hover:from-navy-dark hover:to-navy transition-all text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance & Accounting Services */}
        <section className="py-16 bg-white max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy mb-4">📊 Compliance & Accounting Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay compliant with SARS, CIPC, and maintain healthy financial operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceServices.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 hover:border-gold group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-navy group-hover:text-gold transition-colors">
                    {service.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-navy">{service.price}</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{service.title}</h3>
                <Link
                  to="/contact"
                  className="text-sm text-navy hover:text-gold transition-colors font-semibold flex items-center mt-4"
                >
                  Inquire Now <ArrowRight className="ml-1" size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose EntrySafe */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-navy mb-4">Why Choose EntrySafe?</h2>
              <p className="text-lg text-gray-600">We're more than just a service provider—we're your business partner</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-navy to-navy-dark text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✅
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Fast, Reliable & Affordable</h3>
                <p className="text-gray-600">Quick turnaround times with startup-friendly pricing</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-navy to-navy-dark text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Expert Guidance</h3>
                <p className="text-gray-600">Professional support every step of the way</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-navy to-navy-dark text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  💡
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Digital & Compliance Solutions</h3>
                <p className="text-gray-600">All your business needs in one place</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-navy to-navy-dark text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🇿🇦
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">SA Entrepreneurs Nationwide</h3>
                <p className="text-gray-600">Based in South Africa, serving entrepreneurs everywhere</p>
              </div>
            </div>
          </div>
        </section>

        {/* Entry Safe Platform Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-navy mb-4">
                📱 Entry Safe Platform - All-in-One Business Management
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
                Manage your entire business with our integrated platform suite
              </p>
              <p className="text-2xl font-bold text-gold">
                ✨ One Subscription = Full Access to All Platforms ✨
              </p>
            </div>

            {/* Platform Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-navy to-navy-dark text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="text-6xl mb-4 text-center">📱</div>
                <h3 className="text-2xl font-bold mb-3 text-center">Entry Safe</h3>
                <p className="text-gray-200 mb-6 text-center">Complete Accounting System</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="text-gold mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Income & expense tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-gold mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Professional invoicing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-gold mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Financial reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-gold mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">SARS-ready compliance</span>
                  </li>
                </ul>
                <div className="flex gap-2 justify-center">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">Android</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">Windows</span>
                </div>
                <Link
                  to="/entry-safe"
                  className="block mt-6 bg-gold text-navy font-bold py-3 px-6 rounded-lg hover:bg-gold-light transition-all text-center"
                >
                  Learn More
                </Link>
              </div>

              <div className="bg-gradient-to-br from-navy to-navy-dark text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="text-6xl mb-4 text-center">📄</div>
                <h3 className="text-2xl font-bold mb-3 text-center">Entry Safe Docs</h3>
                <p className="text-gray-200 mb-6 text-center">Document Management</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="text-gold mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Cloud storage & backup</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-gold mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Smart organization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-gold mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Scan & upload receipts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-gold mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Secure sharing</span>
                  </li>
                </ul>
                <div className="flex gap-2 justify-center">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">Android</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">Windows</span>
                </div>
                <Link
                  to="/entry-safe-docs"
                  className="block mt-6 bg-gold text-navy font-bold py-3 px-6 rounded-lg hover:bg-gold-light transition-all text-center"
                >
                  Learn More
                </Link>
              </div>

              <div className="bg-gradient-to-br from-gold to-gold-dark text-navy rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="text-6xl mb-4 text-center">🌐</div>
                <h3 className="text-2xl font-bold mb-3 text-center">Entry Safe Website</h3>
                <p className="text-navy-dark font-semibold mb-6 text-center">Web Portal Access</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="text-navy mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Knowledge Hub access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-navy mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Live financial feeds</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-navy mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">ZAR exchange rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-navy mr-2 flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm">Business resources</span>
                  </li>
                </ul>
                <div className="flex gap-2 justify-center">
                  <span className="bg-white bg-opacity-40 px-3 py-1 rounded text-sm">Web</span>
                  <span className="bg-white bg-opacity-40 px-3 py-1 rounded text-sm">Mobile</span>
                </div>
                <Link
                  to="/entry-safe-pricing"
                  className="block mt-6 bg-navy text-white font-bold py-3 px-6 rounded-lg hover:bg-navy-dark transition-all text-center"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Pricing CTA */}
            <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl p-10 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">💰 Simple, Transparent Pricing</h3>
              <p className="text-xl text-gray-200 mb-6">
                Subscribe once and unlock all platforms - Android, Windows, and Web
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-lg px-8 py-4">
                  <p className="text-sm text-gray-300 mb-1">Free Plan</p>
                  <p className="text-3xl font-bold text-white">R0</p>
                  <p className="text-xs text-gray-300 mt-1">Limited features</p>
                </div>
                <div className="bg-gold text-navy rounded-lg px-8 py-4 border-4 border-white shadow-xl transform scale-110">
                  <p className="text-sm font-semibold mb-1">Premium All-Access</p>
                  <p className="text-4xl font-bold">R499</p>
                  <p className="text-xs font-semibold mt-1">per month</p>
                </div>
              </div>
              <Link
                to="/entry-safe-pricing"
                className="inline-flex items-center bg-gold text-navy font-bold px-8 py-4 rounded-lg hover:bg-gold-light transition-all shadow-lg hover:shadow-xl"
              >
                View Full Pricing Details
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gold to-gold-dark">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-navy mb-6">
              Ready to Start or Grow Your Business?
            </h2>
            <p className="text-xl text-navy-dark mb-8">
              Get professional business services at affordable rates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center bg-navy text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-dark transition-all shadow-lg hover:shadow-xl"
              >
                Contact Us Today
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <a
                href="tel:+27622475462"
                className="inline-flex items-center bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all"
              >
                <Phone className="mr-2" size={20} />
                Call: 062 247 5462
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gold to-gold-dark">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-navy mb-6">
              Ready to Start Your Business Journey?
            </h2>
            <p className="text-xl text-navy-dark mb-8">
              Let us handle the paperwork while you focus on growing your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center bg-navy text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-dark transition-all shadow-lg hover:shadow-xl"
              >
                Contact Us Today
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
