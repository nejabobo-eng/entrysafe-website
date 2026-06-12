import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ArrowRight } from "lucide-react"

export default function Home() {


  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy text-white pt-24 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">EntrySafe</h1>
            <p className="text-lg md:text-xl text-gold">Professional accounting, tax and compliance services</p>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
              <Link to="/services" className="bg-gold text-navy font-bold px-6 py-3 rounded-lg hover:bg-gold-light transition-all">View Services</Link>
              <Link to="/about" className="bg-white/10 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/30">About Us</Link>
              <Link to="/contact" className="bg-white text-navy font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all">Contact</Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full h-64 md:h-80 bg-cover bg-center rounded-2xl border border-white/10 shadow-xl" style={{ backgroundImage: "url('/images/hero.jpg')" }} />
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy mb-4">What We Do</h2>
              <p className="text-gray-700 mb-4">
                EntrySafe is a professional services website helping entrepreneurs across South Africa start and grow their businesses.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>CIPC company registration and compliance</li>
                <li>Tax registration and returns support</li>
                <li>Accounting advisory and financial statements</li>
                <li>Business profiles, branding and websites</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Link to="/services" className="bg-navy text-white font-semibold px-5 py-3 rounded-lg hover:bg-navy-dark transition-colors">Explore Services</Link>
                <Link to="/contact" className="bg-gold text-navy font-semibold px-5 py-3 rounded-lg hover:bg-gold-light transition-colors">Contact Us</Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="text-6xl mb-4">💼</div>
              <p className="text-gray-600">
                We’ll showcase our work and images here soon. Media content will be added later.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
