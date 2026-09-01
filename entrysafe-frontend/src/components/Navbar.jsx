import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import Logo from "./Logo"

const links = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Apps", path: "/apps" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const linkClass = ({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? "text-gold" : "text-white/75 hover:text-white"}`

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 shadow-lg shadow-navy/10 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link to="/" aria-label="EntrySafe home" className="shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <Logo light />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => <NavLink key={link.path} to={link.path} className={linkClass}>{link.name}</NavLink>)}
          <Link to="/contact" className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20">
            Let’s talk
          </Link>
        </div>

        <button type="button" className="grid h-11 w-11 place-items-center rounded-xl text-white hover:bg-white/10 md:hidden" aria-label="Toggle navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-navy px-5 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => <NavLink key={link.path} to={link.path} className={`${linkClass} rounded-lg px-3 py-3`} onClick={() => setMobileMenuOpen(false)}>{link.name}</NavLink>)}
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="mt-2 rounded-xl bg-gold px-4 py-3 text-center text-sm font-extrabold text-navy">Let’s talk</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
