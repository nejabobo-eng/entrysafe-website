import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../lib/firebase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in - fetch their role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            // Merge Firebase Auth user with Firestore data
            setUser({
              ...firebaseUser,
              role: userDoc.data().role || "client"
            })
          } else {
            // No Firestore doc (legacy user or issue) - default to client
            setUser({
              ...firebaseUser,
              role: "client"
            })
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUser({
            ...firebaseUser,
            role: "client"
          })
        }
      } else {
        // User is logged out
        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
