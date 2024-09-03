import { createContext, useState, useEffect, ReactNode } from "react";

export type SettingsContextType = {
  defaultPageSize: number;
  handleChangePageSize: (page: number) => void;
  getSettingsFromStorage: () => void
}

export const SettingsContext = createContext<SettingsContextType | null>(null)

export const SettingsProvider = ({children}: { children: ReactNode }) => {
  const [defaultPageSize, setDefaultPageSize] = useState(10)

  const contextData: SettingsContextType = {
    defaultPageSize,
    handleChangePageSize: (pageSize) => setDefaultPageSize(pageSize),
    getSettingsFromStorage: () => {}
  }

  return (
    <SettingsContext.Provider value={contextData}>
      {children}
    </SettingsContext.Provider>
  )
}
