import { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeContextType {
  darkTheme: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface IProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: IProviderProps) => {
  // TODO: get the initialvalue from localstorage
  const [darkTheme, setDarkTheme] = useState(() => {
    const isDark = localStorage.getItem("isDark")
    return isDark ? JSON.parse(isDark) : false
  })

  // TODO: apply more thant 2 variants
  const toggleTheme = () => {
    setDarkTheme((prevTheme: boolean) => {
      const isDark = !prevTheme
      localStorage.setItem('isDark', JSON.stringify(isDark))

      return isDark
    })

  }

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

