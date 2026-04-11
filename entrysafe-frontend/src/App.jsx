import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import AdminDashboard from "./pages/AdminDashboard"
import AdminTestimonials from "./pages/AdminTestimonials"
import ClientPortal from "./pages/ClientPortal"
import AccountSettings from "./pages/AccountSettings"
import Contact from "./pages/Contact"
import Services from "./pages/Services"
import About from "./pages/About"
import LiveFeeds from "./pages/LiveFeeds"
import AccountingApp from "./pages/AccountingApp"
import DocsApp from "./pages/DocsApp"
import PricingApp from "./pages/PricingApp"
import Testimonials from "./pages/Testimonials"
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentCancel from "./pages/PaymentCancel"
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
          <Route path="/live-feeds" element={<LiveFeeds />} />
          <Route path="/accounting-app" element={<AccountingApp />} />
          <Route path="/docs-app" element={<DocsApp />} />
          <Route path="/pricing-app" element={<PricingApp />} />

          {/* Legacy redirects - maintain old URLs for backwards compatibility */}
          <Route path="/entry-safe" element={<AccountingApp />} />
          <Route path="/entry-safe-docs" element={<DocsApp />} />
          <Route path="/entry-safe-pricing" element={<PricingApp />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

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
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
