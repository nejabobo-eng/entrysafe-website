import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function PricingApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-navy mb-6">
            💰 Entry Safe Pricing App
          </h1>
          <p className="text-2xl font-bold text-gold mb-4">
            AI-Powered Tender Pricing & Bid Management System
          </p>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your intelligent tender management system. Find, prepare, price, submit, and manage tenders from start to finish with AI-powered assistance.
          </p>
        </div>

        {/* Platform Badges */}
        <div className="flex justify-center gap-4 mb-12">
          <span className="bg-navy text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            📱 Coming to Google Play Store
          </span>
          <span className="bg-navy text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            💻 Coming to Microsoft Store
          </span>
          <span className="bg-gold text-navy px-6 py-3 rounded-full font-semibold shadow-lg">
            🌐 Available on Website
          </span>
        </div>

        {/* Availability Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12 text-center">
          <p className="text-lg text-blue-800 font-semibold">
            🚀 The Entry Safe Pricing App will be made available on Google Play Store and Microsoft Store when ready.
          </p>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            ✨ What the Pricing App Actually Does
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="text-xl font-bold mb-2">AI Tender Assistant</h3>
              <p className="text-gray-200">Analyzes tender documents, extracts key requirements, flags compliance risks, and suggests pricing strategies</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📂</div>
              <h3 className="text-xl font-bold mb-2">Tender Command Center</h3>
              <p className="text-gray-200">Dashboard of all tenders with status tracking (Draft/Submitted/Awarded/Lost), timeline monitoring, and document storage</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📥</div>
              <h3 className="text-xl font-bold mb-2">Tender Document Upload</h3>
              <p className="text-gray-200">Upload full tender packs (PDF, DOCX). AI reads, summarizes requirements, and identifies missing documents</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold mb-2">Smart Tender Pricing Engine</h3>
              <p className="text-gray-200">Calculates competitive pricing, suggests markup strategies, estimates profitability with risk-adjusted recommendations</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Bid History & Analytics</h3>
              <p className="text-gray-200">Track past tenders, win/loss ratio analytics, performance reports, and historical pricing comparisons</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="text-xl font-bold mb-2">Quote & Invoice Generator</h3>
              <p className="text-gray-200">When tender is awarded: auto-generate quotes, convert POs to invoices, sync with Entry Safe Accounting</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-xl font-bold mb-2">Full Workflow Integration</h3>
              <p className="text-gray-200">Works seamlessly with Entry Safe Accounting and Entry Safe Docs for centralized AI business intelligence</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-xl font-bold mb-2">Deadline Management</h3>
              <p className="text-gray-200">Automated deadline reminders, submission tracking, and tender lifecycle monitoring</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-navy to-navy-light rounded-xl text-white">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Compliance Checking</h3>
              <p className="text-gray-200">AI flags missing requirements, CIDB/BEE compliance needs, and regulatory documentation gaps</p>
            </div>
          </div>
        </div>

        {/* Why Use the Pricing App */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🚀 Why Use the Entry Safe Pricing App?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Complete Tender Lifecycle Management</h3>
              <p className="text-gray-200">
                From discovery to payment collection - manage the entire tender process in one place.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ AI-Driven Competitive Edge</h3>
              <p className="text-gray-200">
                Smart pricing analysis and compliance checking gives you an advantage over competitors.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Reduce Errors & Missed Requirements</h3>
              <p className="text-gray-200">
                AI highlights missing documents, compliance gaps, and approaching deadlines automatically.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Automated Financial Flow</h3>
              <p className="text-gray-200">
                Seamlessly convert tenders → purchase orders → quotes → invoices with zero manual work.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Centralized Business Intelligence</h3>
              <p className="text-gray-200">
                All tenders, documents, pricing history, and financial impact tracked in one ecosystem.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-gold">✅ Win More Tenders</h3>
              <p className="text-gray-200">
                Data-driven insights from past bids help you improve win rates and profitability.
              </p>
            </div>
          </div>
        </div>

        {/* Who Is It For */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-navy mb-6 text-center">
            📦 Who Is the Pricing App For?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-4xl mb-3">🏗️</div>
              <h3 className="text-xl font-bold text-navy mb-2">Construction Companies</h3>
              <p className="text-gray-600">Manage building tenders, pricing, and compliance</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-4xl mb-3">🛠️</div>
              <h3 className="text-xl font-bold text-navy mb-2">Service Providers</h3>
              <p className="text-gray-600">IT, consulting, maintenance, and professional services</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="text-xl font-bold text-navy mb-2">Government Suppliers</h3>
              <p className="text-gray-600">Public sector tenders with CIDB/BEE compliance</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-bold text-navy mb-2">SMEs Scaling Up</h3>
              <p className="text-gray-600">Growing businesses entering procurement markets</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="text-xl font-bold text-navy mb-2">Suppliers & Logistics</h3>
              <p className="text-gray-600">Supply chain, transport, and delivery tenders</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="text-4xl mb-3">💼</div>
              <h3 className="text-xl font-bold text-navy mb-2">Business Consultants</h3>
              <p className="text-gray-600">Tender support and bid management services</p>
            </div>
          </div>
        </div>

        {/* Integration Note */}
        <div className="bg-gradient-to-r from-gold to-yellow-500 rounded-2xl shadow-xl p-8 mb-12 text-navy">
          <h2 className="text-3xl font-bold mb-4 text-center">
            🔗 Complete Business Ecosystem Integration
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto">
            The Pricing App integrates seamlessly with <strong>Entry Safe Accounting</strong> and <strong>Entry Safe Docs</strong> to create a complete business management ecosystem. 
            From tender discovery to invoice payment, everything is connected.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Win More Tenders?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Transform your tender management with AI-powered intelligence and automated workflows.
          </p>
          <a 
            href="/apps" 
            className="inline-block bg-gold hover:bg-gold-dark text-navy font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all hover:scale-105"
          >
            Explore Subscription Plans →
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
