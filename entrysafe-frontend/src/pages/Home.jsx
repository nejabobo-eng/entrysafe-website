import { Link } from "react-router-dom"
import { ArrowRight, BadgeCheck, Building2, Calculator, FileCheck2, ShieldCheck } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const services = [
  { icon: Building2, title: "Business registration", text: "Set up your company with confidence and the right foundations." },
  { icon: Calculator, title: "Tax & accounting", text: "Practical support that keeps your business organised and compliant." },
  { icon: FileCheck2, title: "Compliance support", text: "Stay on top of the important requirements as your business grows." },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden bg-navy pb-20 pt-16 text-white sm:pb-28 sm:pt-24">
          <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 10% 10%, #1a5bb8 0, transparent 28%), radial-gradient(circle at 88% 22%, #FFC107 0, transparent 16%)" }} />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-gold"><BadgeCheck size={15} /> Professional support for South African businesses</p>
              <h1 className="max-w-3xl text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">Accounting made clear. <span className="text-gold">Business made secure.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/75 sm:text-xl">From registration and tax to bookkeeping and financial reporting, EntrySafe gives South African businesses practical support they can rely on.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-xl hover:shadow-gold/20">Speak to our team <ArrowRight size={18} /></Link>
                <Link to="/services" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:border-white/40 hover:bg-white/10">Explore services</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70"><span className="flex items-center gap-2"><ShieldCheck size={17} className="text-gold" /> CIBA Certified Accountant</span><span className="flex items-center gap-2"><ShieldCheck size={17} className="text-gold" /> Accurate, reliable, compliant</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-gold/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-2 shadow-2xl shadow-black/30 backdrop-blur-sm"><img src="/images/logo/entrysafe-logo-full.png" alt="EntrySafe accounting, tax, bookkeeping and advisory services" className="h-[28rem] w-full rounded-[1.25rem] object-fill sm:h-[34rem]" /></div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-6"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-center text-sm font-bold text-slate-500"><span>Company registration</span><span className="hidden text-gold sm:inline">◆</span><span>Tax assistance</span><span className="hidden text-gold sm:inline">◆</span><span>Accounting advisory</span><span className="hidden text-gold sm:inline">◆</span><span>Compliance support</span></div></section>

        <section className="bg-slate-50 py-20 sm:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-navy">How we help</p><h2 className="mt-3 text-4xl font-bold tracking-tight text-navy sm:text-5xl">The essentials, handled properly.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Clear advice and dependable support for every stage of your business journey.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{services.map(({ icon: Icon, title, text }) => <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl"><span className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-gold"><Icon size={23} /></span><h3 className="mt-7 text-2xl font-bold text-navy">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p><Link to="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-navy transition group-hover:text-navy-light">Learn more <ArrowRight size={16} /></Link></article>)}</div></div></section>

        <section className="bg-white py-20 sm:py-28"><div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8"><div className="rounded-[2rem] bg-navy p-8 text-white sm:p-12"><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">Why EntrySafe</p><h2 className="mt-4 text-4xl font-bold leading-tight">A business partner who speaks plainly.</h2><p className="mt-6 leading-8 text-white/70">We make complex business essentials easier to understand, so you always know your next step.</p><Link to="/about" className="mt-8 inline-flex items-center gap-2 font-extrabold text-gold hover:text-gold-light">Meet EntrySafe <ArrowRight size={17} /></Link></div><div><p className="text-lg leading-8 text-slate-600">From the first registration form to ongoing tax and accounting needs, EntrySafe gives entrepreneurs a reliable place to turn.</p><div className="mt-8 grid gap-6 sm:grid-cols-2"><div className="border-l-2 border-gold pl-5"><h3 className="font-bold text-navy">Straightforward guidance</h3><p className="mt-2 text-sm leading-6 text-slate-600">Know what matters, what it means, and what to do next.</p></div><div className="border-l-2 border-gold pl-5"><h3 className="font-bold text-navy">Built for growing businesses</h3><p className="mt-2 text-sm leading-6 text-slate-600">Support that meets you where you are—and helps you move forward.</p></div></div></div></div></section>

        <section className="bg-gold px-6 py-16 text-center"><div className="mx-auto max-w-3xl"><h2 className="text-4xl font-bold text-navy sm:text-5xl">Ready to move your business forward?</h2><p className="mx-auto mt-4 max-w-xl text-lg text-navy/75">Tell us what you need help with and our team will guide the next step.</p><Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-4 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-navy-dark">Get in touch <ArrowRight size={18} /></Link></div></section>
      </main>
      <Footer />
    </>
  )
}
