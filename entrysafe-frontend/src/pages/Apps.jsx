import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../contexts/AuthContext"

export default function Apps() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState("premium")

  const apps = [
    {
      name: "Entry Safe Accounting",
      description: "Complete accounting system - Track income, expenses, invoices, and financial reports",
      icon: "📱",
      androidLink: "#", // TODO: Replace with actual download link
      windowsLink: "#", // TODO: Replace with actual download link
      features: ["Income & Expense Tracking", "Invoicing", "Financial Reports", "SARS Compliance"]
    },
    {
      name: "Entry Safe Docs",
      description: "Smart document management - Store, organize, and AI-powered document analysis",
      icon: "📄",
      androidLink: "#",
      windowsLink: "#",
      features: ["Cloud Storage", "AI Categorization", "OCR Scanning", "Secure Sharing"]
    },
    {
      name: "Entry Safe Pricing",
      description: "Intelligent pricing engine - Calculate quotes, manage pricing strategies",
      icon: "💰",
      androidLink: "#",
      windowsLink: "#",
      features: ["Smart Pricing", "Quote Generation", "Profit Analysis", "Competitive Insights"]
    },
    {
      name: "SD Storage Helper",
      description: "Storage management & optimization - Analyze, organize, and optimize device storage",
      icon: "💾",
      androidLink: "#",
      windowsLink: "#",
      features: ["Storage Analysis", "Duplicate Detection", "AI Organization", "Space Optimization"]
    }
  ]

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: 0,
      period: "Forever",
      features: [
        "Entry Safe Website Access",
        "Knowledge Hub & Live Feeds",
        "Basic app features",
        "Ads on Android apps",
        "Limited storage"
      ],
      limitations: [
        "No Entry Safe apps",
        "No SD Storage Helper premium",
        "Ads included"
      ]
    },
    {
      id: "starter",
      name: "Starter",
      price: 199,
      period: "per month",
      features: [
        "✨ All 4 apps unlocked",
        "Basic AI features",
        "Limited cloud storage (5GB)",
        "Ads displayed in apps",
        "Single device",
        "Email support"
      ],
      limitations: [
        "Ads included",
        "Single device only",
        "Limited AI quota"
      ]
    },
    {
      id: "premium",
      name: "Premium All-Access",
      price: 499,
      period: "per month",
      popular: true,
      features: [
        "✨ All Entry Safe apps unlocked",
        "✨ SD Storage Helper premium",
        "Ad-free experience",
        "Unlimited cloud storage",
        "Priority support",
        "Multi-device sync",
        "Advanced AI features",
        "Exclusive templates & tools"
      ]
    },
    {
      id: "annual",
      name: "Annual Professional",
      price: 4999,
      period: "per year",
      savings: "Best Value - Save with Annual Billing!",
      features: [
        "✨ All Premium features included",
        "✨ Full access to all Entry Safe apps",
        "✨ SD Storage Helper premium",
        "Ad-free experience",
        "Unlimited cloud storage",
        "Priority support",
        "Multi-device sync",
        "Advanced AI features",
        "Dedicated account manager"
      ]
    }
  ]

  const handleSubscribe = (planId) => {
    // TODO: Integrate PayFast payment
    if (!user) {
      alert("Please login or register to subscribe")
      return
    }
    
    console.log(`Subscribing to ${planId}`)
    // Redirect to PayFast or payment page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-navy mb-6">
            📱 Entry Safe Apps
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
            Download our complete suite of business management apps for Android and Windows
          </p>

          {/* Important Pricing Disclaimer */}
          <div className="bg-gold/20 border-2 border-gold rounded-xl p-6 max-w-4xl mx-auto mb-4">
            <p className="text-lg font-semibold text-navy mb-2">
              ⚠️ Important: Pricing Clarification
            </p>
            <p className="text-gray-800">
              <strong>The pricing below applies to Entry Safe Applications (Software Platform) only.</strong><br />
              Accounting services, IT support, and business consulting are quoted separately based on your needs.
            </p>
          </div>

          <p className="text-2xl font-bold text-gold">
            ✨ One Subscription = All Apps Unlocked ✨
          </p>
        </div>

        {/* Apps Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            🚀 Available Apps
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {apps.map((app, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="flex items-start mb-4">
                  <div className="text-6xl mr-4">{app.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-navy mb-2">{app.name}</h3>
                    <p className="text-gray-600">{app.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-navy mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {app.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-600 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Download Buttons */}
                <div className="flex gap-3">
                  <a
                    href={app.androidLink}
                    className="flex-1 bg-gradient-to-r from-navy to-navy-light text-white px-4 py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all"
                  >
                    📱 Android
                  </a>
                  <a
                    href={app.windowsLink}
                    className="flex-1 bg-gradient-to-r from-navy to-navy-light text-white px-4 py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all"
                  >
                    💻 Windows
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            💎 Choose Your Plan
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-xl p-6 ${
                  plan.popular ? 'border-4 border-gold relative lg:transform lg:scale-110' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-navy px-4 py-1 rounded-full font-bold text-xs shadow-lg">
                    ⭐ POPULAR
                  </div>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-navy mb-2">{plan.name}</h3>
                  {plan.savings && (
                    <p className="text-green-600 font-semibold text-xs mb-2">{plan.savings}</p>
                  )}
                  <div className="flex items-baseline justify-center mb-1">
                    <span className="text-4xl font-bold text-navy">R{plan.price}</span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.period}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xs">
                      <span className="text-green-600 mr-2 text-sm">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-500">
                      <span className="text-red-600 mr-2 text-sm">✗</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={plan.id === "free"}
                  className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                    plan.popular
                      ? 'bg-gold text-navy hover:shadow-2xl transform hover:scale-105'
                      : plan.id === "free"
                      ? 'bg-gray-200 text-gray-600 cursor-default'
                      : 'bg-navy text-white hover:bg-navy-dark hover:shadow-lg'
                  }`}
                >
                  {plan.id === "free" ? 'Current Plan' : `Subscribe - R${plan.price}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-2xl shadow-xl p-10 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🔄 How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gold text-navy w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold mb-2">Choose Your Plan</h3>
              <p className="text-sm text-gray-200">Select Free or Premium subscription</p>
            </div>
            <div className="text-center">
              <div className="bg-gold text-navy w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold mb-2">Download Apps</h3>
              <p className="text-sm text-gray-200">Get Android & Windows versions</p>
            </div>
            <div className="text-center">
              <div className="bg-gold text-navy w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold mb-2">Login & Sync</h3>
              <p className="text-sm text-gray-200">Use same account across all platforms</p>
            </div>
            <div className="text-center">
              <div className="bg-gold text-navy w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-bold mb-2">Enjoy Premium</h3>
              <p className="text-sm text-gray-200">Access all features ad-free</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-navy mb-2">
                Does one subscription cover all apps?
              </h3>
              <p className="text-gray-700">
                Yes! One Premium subscription gives you full access to Entry Safe Accounting, Entry Safe Docs, 
                Entry Safe Pricing, and SD Storage Helper on both Android and Windows.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy mb-2">
                Can I use the apps on multiple devices?
              </h3>
              <p className="text-gray-700">
                Absolutely! Your subscription syncs across all your devices. Login with the same account 
                on Android, Windows, or Web and your data syncs automatically.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-700">
                We use PayFast for secure payments. You can pay with credit/debit card, EFT, or instant EFT. 
                All payments are processed securely in South African Rands (ZAR).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-700">
                Yes, no long-term contracts. Cancel your subscription anytime from your account settings. 
                You'll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join hundreds of businesses managing their operations the smart way
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Link
                to="/register"
                className="bg-gradient-to-r from-navy to-navy-light text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                🚀 Create Free Account
              </Link>
            )}
            <a
              href="/contact"
              className="bg-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              📞 Contact Sales
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
