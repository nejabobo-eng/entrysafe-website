import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function AdminRoute({ children }) {
  const { user } = useAuth()

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" />
  }

  // Logged in but not admin - redirect to home
  if (user.role !== "admin") {
    return <Navigate to="/" />
  }

  // Is admin - allow access
  return children
}
