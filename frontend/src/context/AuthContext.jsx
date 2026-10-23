import { createContext, useContext, useEffect, useState } from 'react'

const AUTH_STORAGE_KEY = 'cafe_aurora_auth_user'

const DEFAULT_ADMIN = {
  email: 'admin@cafeaurora.cr',
  password: 'aurora2026',
  name: 'Administrador Aurora',
  role: 'admin',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Sincronizar en localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    } catch {
      // Ignorar fallos de cuota o modo privado
    }
  }, [user])

  /**
   * Inicia sesión con credenciales administrativas
   * @param {{ email: string, password: string }} credentials
   * @returns {{ success: boolean, error?: string, user?: object }}
   */
  const login = async ({ email = '', password = '' }) => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    // Validar con credenciales autorizadas
    const isEmailValid =
      cleanEmail === DEFAULT_ADMIN.email || cleanEmail === 'admin'
    const isPasswordValid = cleanPassword === DEFAULT_ADMIN.password

    if (isEmailValid && isPasswordValid) {
      const authUser = {
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        role: DEFAULT_ADMIN.role,
        loggedAt: new Date().toISOString(),
      }
      setUser(authUser)
      return { success: true, user: authUser }
    }

    return {
      success: false,
      error: 'Credenciales inválidas. Verifica tu correo o PIN administrativo.',
    }
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un <AuthProvider>')
  }
  return context
}
