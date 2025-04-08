import { useContext } from "react"
import { ThemeContext } from "../ThemeContext"
import type { ThemeContextType } from "../ThemeContext"

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme has to be used inside a child of the theme provider")
  }
  return context
}
