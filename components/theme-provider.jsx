"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// hooks/use-theme.js
import { useTheme as useNextTheme } from "next-themes"

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme()
  return { theme, setTheme }
}
