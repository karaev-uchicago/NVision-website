"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NVisionDemoProps {
  children?: React.ReactNode
}

export function NVisionDemo({ children }: NVisionDemoProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading the Python environment
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Loading Python Environment...</p>
        <p className="text-sm text-muted-foreground">This may take a few moments</p>
      </div>
    )
  }

  return (
    <div>
      <Alert className="mb-6">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Python Environment Ready</AlertTitle>
        <AlertDescription>The NVision algorithm is now ready to process your FSM scan data.</AlertDescription>
      </Alert>

      {children}
    </div>
  )
}
