import { createContext, useContext, useState, ReactNode } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext)

interface IProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: IProviderProps) => {
  const [theme, setTheme] = useState('light')

  // TODO: apply more thant 2 variants
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

