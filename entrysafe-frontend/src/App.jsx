import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import Services from "./pages/Services"
import About from "./pages/About"
import Apps from "./pages/Apps"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/apps" element={<Apps />} />

        {/* Legacy redirects - maintain old URLs for backwards compatibility */}
        <Route path="/entry-safe" element={<Apps />} />
        <Route path="/entry-safe-docs" element={<Apps />} />
        <Route path="/entry-safe-pricing" element={<Apps />} />
        <Route path="/testimonials" element={<Home />} />

        {/* Home Route - Public for all visitors */}
        <Route 
          path="/" 
          element={<Home />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
