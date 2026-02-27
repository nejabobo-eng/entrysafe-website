import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import AdminDashboard from "./pages/AdminDashboard"
import AdminTestimonials from "./pages/AdminTestimonials"
import ClientPortal from "./pages/ClientPortal"
import Contact from "./pages/Contact"
import Services from "./pages/Services"
import About from "./pages/About"
import KnowledgeHub from "./pages/KnowledgeHub"
import LiveFeeds from "./pages/LiveFeeds"
import EntrySafe from "./pages/EntrySafe"
import EntrySafeDocs from "./pages/EntrySafeDocs"
import EntrySafePricing from "./pages/EntrySafePricing"
import Apps from "./pages/Apps"
import Testimonials from "./pages/Testimonials"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import ClientRoute from "./components/ClientRoute"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/knowledge-hub" element={<KnowledgeHub />} />
          <Route path="/live-feeds" element={<LiveFeeds />} />
          <Route path="/entry-safe" element={<EntrySafe />} />
          <Route path="/entry-safe-docs" element={<EntrySafeDocs />} />
          <Route path="/entry-safe-pricing" element={<EntrySafePricing />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/testimonials" element={<Testimonials />} />

          {/* Home Route - Public for all visitors */}
          <Route 
            path="/" 
            element={<Home />} 
          />

          {/* Admin-Only Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/testimonials" 
            element={
              <AdminRoute>
                <AdminTestimonials />
              </AdminRoute>
            } 
          />

          {/* Client-Only Routes */}
          <Route 
            path="/portal" 
            element={
              <ClientRoute>
                <ClientPortal />
              </ClientRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
