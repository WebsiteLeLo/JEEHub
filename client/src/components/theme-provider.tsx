import { createContext, useContext, useEffect, useState } from "react"
import { userProfileStorage } from "@/lib/storage"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "jee-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from user profile first
    const userProfile = userProfileStorage.get()
    if (userProfile?.preferences.theme === 'dark' || userProfile?.preferences.theme === 'light') {
      return userProfile.preferences.theme
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem(storageKey) as Theme
    return stored || defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      
      // Update user profile if it exists
      const userProfile = userProfileStorage.get()
      if (userProfile && (theme === 'dark' || theme === 'light')) {
        userProfileStorage.update({
          preferences: {
            ...userProfile.preferences,
            theme: theme
          }
        })
      }
      
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}