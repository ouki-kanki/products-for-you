import { createContext, useContext, useState, ReactNode } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext)

interface IProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: IProviderProps) => {
  const [darkTheme, setDarkTheme] = useState(false)

  // TODO: apply more thant 2 variants
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme !== prevTheme))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

