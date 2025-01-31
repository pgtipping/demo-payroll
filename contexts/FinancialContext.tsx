"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

type FinancialContextType = {
  country: string
  currency: string
  setCurrency: (currency: string) => void
  setCountry: (country: string) => void
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export const useFinancial = () => {
  const context = useContext(FinancialContext)
  if (!context) {
    throw new Error("useFinancial must be used within a FinancialProvider")
  }
  return context
}

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [country, setCountry] = useState("US")
  const [currency, setCurrency] = useState("$")

  return (
    <FinancialContext.Provider value={{ country, currency, setCountry, setCurrency }}>
      {children}
    </FinancialContext.Provider>
  )
}

