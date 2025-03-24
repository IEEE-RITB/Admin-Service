"use client"

import { ThemeProvider, type ThemeProviderProps } from "next-themes"

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function Provider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" {...props} />
  )
}
