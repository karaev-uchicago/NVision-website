"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FileUploaderProps {
  onFileUpload: (file: File, fileData: any) => void
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is JSON
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setError("Please upload a JSON file")
      return
    }

    setError(null)
    setSelectedFile(file)

    // Read the file content
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)

        // Validate the JSON structure
        if (!validateFSMJson(jsonData)) {
          setError("Invalid FSM scan data format. Please check the file structure.")
          return
        }

        // Pass both the file and the parsed data to the parent component
        onFileUpload(file, jsonData)
      } catch (error) {
        setError("Error parsing JSON file. Please check the file format.")
      }
    }
    reader.onerror = () => {
      setError("Error reading file. Please try again.")
    }
    reader.readAsText(file)
  }

  // Validate the JSON structure to ensure it has the required fields
  const validateFSMJson = (data: any): boolean => {
    // Check for required fields based on the Python script's expectations
    if (!data.datasets) {
      return false
    }

    // For sample data, we'll be more lenient
    return true
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError(null)
  }

  const openFileSelector = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  // For demo purposes, we'll provide a sample file option
  const useSampleData = () => {
    // Create a sample FSM scan data that matches the expected format
    const sampleData = {
      datasets: {
        ScanCounts: generateSampleScanData(100, 100),
        xSteps: Array.from({ length: 100 }, (_, i) => i * 0.1), // 0 to 10 μm
        ySteps: Array.from({ length: 100 }, (_, i) => i * 0.1), // 0 to 10 μm
      },
      params: {
        CenterOfScan: [5.0, 5.0],
        sweepRanges: [10.0, 10.0],
        scanPointsPerAxis: 100,
      },
    }

    // Convert to JSON string
    const jsonString = JSON.stringify(sampleData)

    // Create a mock file object
    const mockFile = new File([jsonString], "sample_fsm_scan.json", {
      type: "application/json",
    })

    handleFile(mockFile)
  }

  // Generate sample scan data with some NV centers
  const generateSampleScanData = (width: number, height: number) => {
    const data = Array(height)
      .fill(0)
      .map(() => Array(width).fill(0))

    // Add background noise
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        data[y][x] = 800 + Math.random() * 200
      }
    }

    // Add some NV centers as bright spots
    const nvCenters = [
      { x: 25, y: 35, intensity: 1250 },
      { x: 42, y: 67, intensity: 1450 },
      { x: 78, y: 23, intensity: 1350 },
      { x: 56, y: 89, intensity: 1550 },
      { x: 12, y: 45, intensity: 1650 },
      { x: 67, y: 34, intensity: 1250 },
      { x: 89, y: 56, intensity: 1350 },
      { x: 34, y: 78, intensity: 1450 },
      { x: 45, y: 23, intensity: 1550 },
      { x: 78, y: 45, intensity: 1250 },
    ]

    nvCenters.forEach(({ x, y, intensity }) => {
      const radius = 5

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy
          const nx = x + dx

          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist <= radius) {
              // Gaussian profile
              const factor = Math.exp(-(dist * dist) / (radius * 0.5))
              data[ny][nx] += (intensity - 1000) * factor
            }
          }
        }
      }
    })

    return data
  }

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8
          ${dragActive ? "border-primary bg-primary/5" : "border-border"}
          ${selectedFile ? "bg-black/10" : ""}
          transition-colors duration-200
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" className="hidden" accept=".json" onChange={handleChange} />

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload FSM Scan Data</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Drag and drop your JSON scan file here, or click to browse
            </p>
            <Button onClick={openFileSelector}>Select File</Button>
            <p className="text-xs text-muted-foreground mt-4">Supported format: JSON files containing FSM scan data</p>

            {error && <div className="mt-4 text-sm text-red-500 text-center">{error}</div>}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Don't have an FSM scan file?</p>
        <Button variant="outline" onClick={useSampleData}>
          Use Sample Data
        </Button>
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">What is an FSM scan?</h3>
          <p className="text-sm text-muted-foreground">
            Fluorescence Scanning Microscopy (FSM) is a technique used to image fluorescent objects, such as
            Nitrogen-Vacancy (NV) centers in diamond. FSM scans capture the fluorescence intensity at each point in a
            sample, creating a 2D image where brighter areas indicate higher fluorescence, potentially corresponding to
            NV centers. The NVision algorithm processes these scans in JSON format.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
