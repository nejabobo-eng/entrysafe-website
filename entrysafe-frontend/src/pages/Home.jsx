import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Shield, FileText, Calculator, TrendingUp, Users, CheckCircle, ArrowRight, Smartphone, Monitor, Cloud, Lock, Zap, Award, BarChart3, FolderOpen, DollarSign, HardDrive, Phone, Copy, Check } from "lucide-react"

export default function Home() {
  const [quote, setQuote] = useState("")
  const [lesson, setLesson] = useState("")
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    fetchDailyContent()
  }, [])

  const fetchDailyContent = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/daily-content`)
      if (response.ok) {
        const data = await response.json()
        setQuote(data.quote)
        setLesson(data.lesson)
      }
    } catch (error) {
      console.error("Failed to fetch daily content:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatForWhatsApp = (text) => {
    return text.replace(/\n{3,}/g, "\n\n").trim()
  }

  const formatForFacebook = (text) => {
    return text
      .replace(/📘|💡|📌|⚖️|✅|❌|🚀|⏰|☀️|💰|🧠|🔁|⚙️|🎨|🧱|💡|⚠️|📋|👉|🔥|📤|🌐/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  }

  const handleCopy = (text, format = "whatsapp") => {
    const formatted = format === "facebook" ? formatForFacebook(text) : formatForWhatsApp(text)
    navigator.clipboard.writeText(formatted)
    setCopiedId(format)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const shareToWhatsApp = (text) => {
    const formatted = encodeURIComponent(formatForWhatsApp(text))
    window.open(`https://wa.me/?text=${formatted}`, "_blank")
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy text-white pt-32 pb-20 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-light rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Empower Your Business with <span className="text-gold">EntrySafe</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Professional business services, secure document management, and powerful apps - all in one platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/apps"
                className="inline-flex items-center bg-gold text-navy font-bold px-8 py-4 rounded-lg hover:bg-gold-light transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Explore Our Apps
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                View Services
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Shield className="text-gold" size={20} />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="text-gold" size={20} />
                <span>CIBA Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-gold" size={20} />
                <span>CIPC Registered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Entry Safe Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy mb-4">Why Choose Entry Safe?</h2>
            <p className="text-lg text-gray-600">Built by professionals, trusted by entrepreneurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Reason 1 - Certified */}
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-full mb-4">
                <Award className="text-navy" size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">CIBA Certified</h3>
              <p className="text-gray-600">
                Member of the Chartered Institute for Business Accountants
              </p>
            </div>

            {/* Reason 2 - Secure Platform */}
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-navy rounded-full mb-4">
                <Lock className="text-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Bank-level encryption and security for all your business data
              </p>
            </div>

            {/* Reason 3 - 100+ Businesses */}
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-full mb-4">
                <Users className="text-navy" size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">100+ Businesses</h3>
              <p className="text-gray-600">
                Trusted by growing South African entrepreneurs nationwide
              </p>
            </div>

            {/* Reason 4 - Built by Professionals */}
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-navy rounded-full mb-4">
                <Shield className="text-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Built by Professionals</h3>
              <p className="text-gray-600">
                Professional accounting expertise meets modern technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From company registration to AI-powered apps, we provide comprehensive solutions for South African entrepreneurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-navy to-navy-light w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FileText className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">Business Services</h3>
              <p className="text-gray-600 mb-4">
                Company registration, tax compliance, bookkeeping, and professional business support
              </p>
              <Link to="/services" className="text-gold font-semibold hover:text-gold-dark inline-flex items-center">
                Learn More <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-gold to-gold-dark w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Smartphone className="text-navy" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">Mobile & Desktop Apps</h3>
              <p className="text-gray-600 mb-4">
                Powerful Android and Windows apps for accounting, documents, pricing, and storage management
              </p>
              <Link to="/accounting-app" className="text-gold font-semibold hover:text-gold-dark inline-flex items-center">
                Explore Apps <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-navy to-navy-light w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Lock className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">Secure Client Portal</h3>
              <p className="text-gray-600 mb-4">
                Access your documents, track services, and manage your business securely from anywhere
              </p>
              <Link to="/portal" className="text-gold font-semibold hover:text-gold-dark inline-flex items-center">
                Access Portal <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-gold to-gold-dark w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Calculator className="text-navy" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">Tax & Compliance</h3>
              <p className="text-gray-600 mb-4">
                SARS registration, tax returns, PAYE, VAT, and complete compliance solutions
              </p>
              <Link to="/services" className="text-gold font-semibold hover:text-gold-dark inline-flex items-center">
                Get Started <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-navy to-navy-light w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">AI-Powered Tools</h3>
              <p className="text-gray-600 mb-4">
                Intelligent document analysis, smart pricing, and automated bookkeeping with AI assistance
              </p>
              <Link to="/apps" className="text-gold font-semibold hover:text-gold-dark inline-flex items-center">
                Try AI Tools <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-gold to-gold-dark w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-navy" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">Expert Support</h3>
              <p className="text-gray-600 mb-4">
                CIBA certified accountant providing personalized guidance and professional support
              </p>
              <Link to="/contact" className="text-gold font-semibold hover:text-gold-dark inline-flex items-center">
                Contact Us <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Our Powerful App Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four specialized apps designed to streamline your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* App 1 */}
            <Link to="/entry-safe" className="group">
              <div className="bg-gradient-to-br from-navy to-navy-dark text-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-gold rounded-xl mb-4">
                  <BarChart3 className="text-navy" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-gold transition-colors">Entry Safe Accounting</h3>
                <p className="text-gray-300 mb-6">
                  Complete accounting system with income tracking, invoicing, financial reports, and SARS compliance
                </p>
                <div className="flex gap-3">
                  <span className="bg-gold text-navy px-3 py-1 rounded-full text-sm font-semibold">Android</span>
                  <span className="bg-gold text-navy px-3 py-1 rounded-full text-sm font-semibold">Windows</span>
                </div>
              </div>
            </Link>

            {/* App 2 */}
            <Link to="/entry-safe-docs" className="group">
              <div className="bg-gradient-to-br from-gold to-gold-dark text-navy rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-navy rounded-xl mb-4">
                  <FolderOpen className="text-gold" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-navy-dark transition-colors">Entry Safe Docs</h3>
                <p className="text-navy-dark mb-6">
                  Smart document management with AI-powered categorization, OCR scanning, and secure cloud storage
                </p>
                <div className="flex gap-3">
                  <span className="bg-navy text-white px-3 py-1 rounded-full text-sm font-semibold">Android</span>
                  <span className="bg-navy text-white px-3 py-1 rounded-full text-sm font-semibold">Windows</span>
                </div>
              </div>
            </Link>

            {/* App 3 */}
            <Link to="/entry-safe-pricing" className="group">
              <div className="bg-gradient-to-br from-gold to-gold-dark text-navy rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-navy rounded-xl mb-4">
                  <DollarSign className="text-gold" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-navy-dark transition-colors">Entry Safe Pricing</h3>
                <p className="text-navy-dark mb-6">
                  Intelligent pricing engine with quote generation, profit analysis, and competitive insights
                </p>
                <div className="flex gap-3">
                  <span className="bg-navy text-white px-3 py-1 rounded-full text-sm font-semibold">Android</span>
                  <span className="bg-navy text-white px-3 py-1 rounded-full text-sm font-semibold">Windows</span>
                </div>
              </div>
            </Link>

            {/* App 4 */}
            <Link to="/apps" className="group">
              <div className="bg-gradient-to-br from-navy to-navy-dark text-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-gold rounded-xl mb-4">
                  <HardDrive className="text-navy" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-gold transition-colors">SD Storage Helper</h3>
                <p className="text-gray-300 mb-6">
                  Advanced storage management with duplicate detection, AI organization, and space optimization
                </p>
                <div className="flex gap-3">
                  <span className="bg-gold text-navy px-3 py-1 rounded-full text-sm font-semibold">Android</span>
                  <span className="bg-gold text-navy px-3 py-1 rounded-full text-sm font-semibold">Windows</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/accounting-app"
              className="inline-flex items-center bg-navy text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-dark transition-all shadow-lg hover:shadow-xl"
            >
              Download Apps & View Pricing
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Daily AI Content Section */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-dark to-navy text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              💡 Daily Business Wisdom
            </h2>
            <p className="text-xl text-gold">Learn something new every day to grow your business</p>
          </div>

          {!loading ? (
            <div className="space-y-8">
              {/* Quote Card */}
              {quote && (
                <div className="bg-gradient-to-br from-gold/10 to-gold/5 border-2 border-gold rounded-xl p-8 hover:shadow-2xl transition-all">
                  <div className="whitespace-pre-wrap text-lg leading-relaxed mb-6 font-medium text-gray-100">
                    {quote}
                  </div>
                  <div>
                    <p className="text-sm text-gold/80 mb-3 font-semibold">📤 Share this content</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleCopy(quote, "whatsapp")}
                        className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-4 py-2 rounded-lg hover:bg-gold-light transition-all text-sm"
                      >
                        {copiedId === "whatsapp" ? (
                          <>
                            <Check size={16} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} /> 📋 Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(quote, "facebook")}
                        className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-sm border border-white/30"
                      >
                        {copiedId === "facebook" ? (
                          <>
                            <Check size={16} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} /> 📘 Facebook
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => shareToWhatsApp(quote)}
                        className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-all text-sm"
                      >
                        📲 WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AdSense Banner */}
              <div className="flex justify-center py-4">
                <ins
                  className="adsbygoogle"
                  style={{ display: "block", width: "100%", maxWidth: "728px", height: "90px" }}
                  data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                  data-ad-slot="xxxxxxxx"
                  data-ad-format="horizontal"
                  data-full-width-responsive="true"
                ></ins>
              </div>

              {/* Lesson Card */}
              {lesson && (
                <div className="bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-xl p-8 hover:shadow-2xl transition-all">
                  <div className="whitespace-pre-wrap text-lg leading-relaxed mb-6 font-medium text-gray-100">
                    {lesson}
                  </div>
                  <div>
                    <p className="text-sm text-white/70 mb-3 font-semibold">📤 Share this content</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleCopy(lesson, "whatsapp")}
                        className="inline-flex items-center gap-2 bg-white text-navy font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-sm"
                      >
                        {copiedId === "whatsapp" ? (
                          <>
                            <Check size={16} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} /> 📋 Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(lesson, "facebook")}
                        className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-sm border border-white/30"
                      >
                        {copiedId === "facebook" ? (
                          <>
                            <Check size={16} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} /> 📘 Facebook
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => shareToWhatsApp(lesson)}
                        className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-all text-sm"
                      >
                        📲 WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              <p className="mt-4 text-gold">Loading today's wisdom...</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-navy mb-2">100+</div>
              <div className="text-gray-600">Businesses Served</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-gold mb-2">Expert</div>
              <div className="text-gray-600">Tax Advice</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-navy mb-2">4 Apps</div>
              <div className="text-gray-600">Launching Soon</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-gold mb-2">Mon-Fri</div>
              <div className="text-gray-600">9AM - 5PM Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold to-gold-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-navy-dark mb-8">
            Join hundreds of South African entrepreneurs who trust EntrySafe for their business needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center bg-navy text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-dark transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Today
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <a
              href="tel:+27622475462"
              className="inline-flex items-center bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              <Phone className="mr-2" size={20} />
              Call: 062 247 5462
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
