import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function ClientRoute({ children }) {
  const { user } = useAuth()

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" />
  }

  // Logged in but not client - redirect to home
  if (user.role !== "client") {
    return <Navigate to="/" />
  }

  // Is client - allow access
  return children
}
