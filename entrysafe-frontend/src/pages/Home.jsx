import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ArrowRight, Copy, Check } from "lucide-react"

export default function Home() {
  const [quote, setQuote] = useState("")
  const [lesson, setLesson] = useState("")
  const [accounting, setAccounting] = useState("")
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    fetchDailyContent()
  }, [])

  // Initialize AdSense after content loads (Strict initialization)
  useEffect(() => {
    // Only push after all 3 widgets are loaded
    if (quote && lesson && accounting && window.adsbygoogle) {
      try {
        // Push to adsbygoogle queue to render ads
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        console.log("✅ AdSense initialized - ads should render now")
      } catch (e) {
        console.warn("⚠️ AdSense not ready:", e.message)
      }
    }
  }, [quote, lesson, accounting]) // Re-run only when content changes

  const fetchDailyContent = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      console.log("🔵 Fetching from:", apiUrl + '/api/ai/daily-content')

      const response = await fetch(`${apiUrl}/api/ai/daily-content`)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Content received:", { quote: data.quote?.substring(0, 50), lesson: data.lesson?.substring(0, 50), accounting: data.accounting?.substring(0, 50) })
        setQuote(data.quote)
        setLesson(data.lesson)
        setAccounting(data.accounting)
      } else {
        console.error("❌ API error:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("❌ Failed to fetch daily content:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatForWhatsApp = (text) => {
    return text.replace(/\n{3,}/g, "\n\n").trim()
  }

  const formatForFacebook = (text) => {
    return text
      .replace(/📘|💡|📌|⚖️|✅|❌|🚀|⏰|☀️|💰|🧠|🔁|⚙️|🎨|🧱|💡|⚠️|📋|👉|🔥|📤|🌐|📊/g, "")
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

      {/* Minimal Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy text-white pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-light rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gold">EntrySafe</span>
          </h1>
          <p className="text-lg md:text-xl text-gold">Practical business insights delivered daily</p>
        </div>
      </section>

      {/* Daily AI Content Section - HERO CONTENT */}
      <section className="py-20 bg-gradient-to-br from-navy via-navy-dark to-navy text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              💡 Daily Business Wisdom
            </h2>
            <p className="text-gold">Learn something new every day to grow your business</p>
          </div>
          {/* Widget powered by EntrySafe AI */}

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

              {/* AdSense Banner - Between Lesson and Accounting (High CTR Position) */}
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

              {/* Accounting Card */}
              {accounting && (
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-2 border-cyan-400/50 rounded-xl p-8 hover:shadow-2xl transition-all">
                  <div className="whitespace-pre-wrap text-lg leading-relaxed mb-6 font-medium text-gray-100">
                    {accounting}
                  </div>
                  <div>
                    <p className="text-sm text-cyan-300/80 mb-3 font-semibold">📤 Share this content</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleCopy(accounting, "whatsapp")}
                        className="inline-flex items-center gap-2 bg-cyan-400 text-navy font-semibold px-4 py-2 rounded-lg hover:bg-cyan-300 transition-all text-sm"
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
                        onClick={() => handleCopy(accounting, "facebook")}
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
                        onClick={() => shareToWhatsApp(accounting)}
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

      <Footer />
    </>
  )
}
