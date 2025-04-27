import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AnimatedCursor } from "@/components/animated-cursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NVision - Quantum NV Center Detection",
  description: "An algorithmic solution for identifying Nitrogen-Vacancy centers in FSM scans of delta-doped diamond",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <AnimatedCursor />
        </ThemeProvider>
      </body>
    </html>
  )
}
