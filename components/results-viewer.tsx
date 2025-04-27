"use client"

import { useState, useRef, useEffect } from "react"
import { RefreshCw, ZoomIn, ZoomOut, Move, Maximize2, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ResultsViewerProps {
  params: {
    threshold: number
    minSize: number
    maxSize: number
    backgroundCorrection: boolean
    colormap: string
    showMarkers: boolean
    confidenceThreshold: number
    medianFilter: boolean
    filterSize: number
  }
  results: any
  onReset: () => void
}

export function ResultsViewer({ params, results, onReset }: ResultsViewerProps) {
  const [activeTab, setActiveTab] = useState("visualization")
  const [activeVisTab, setActiveVisTab] = useState("original")
  const [zoomLevel, setZoomLevel] = useState(1)
  const canvas3DRef = useRef<HTMLCanvasElement>(null)

  // Extract data from the analysis results
  const scanData = results.scanData.datasets.ScanCounts
  const xSteps = results.scanData.datasets.xSteps || []
  const ySteps = results.scanData.datasets.ySteps || []
  const coordinates = results.coordinates || []
  const xPositions = results.x_positions || []
  const yPositions = results.y_positions || []
  const intensities = results.intensities || []
  const processedImage = results.processed_image || []
  const threshold = results.threshold || 0
  const stats = results.stats || { mean: 0, stdDev: 0, min: 0, max: 0 }

  // Initialize 3D plot
  useEffect(() => {
    if (activeTab === "visualization" && activeVisTab === "3d" && canvas3DRef.current) {
      renderSimple3D(canvas3DRef.current)
    }
  }, [activeTab, activeVisTab])

  // Simple 3D rendering function (simplified version of the Python 3D plot)
  function renderSimple3D(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    // Simple isometric projection
    const scale = 20
    const xOffset = width / 2
    const yOffset = height / 2

    // Draw a simplified 3D surface
    for (let y = 0; y < scanData.length - 1; y += 4) {
      for (let x = 0; x < scanData[0].length - 1; x += 4) {
        const value = scanData[y][x]
        const normalizedValue = (value - stats.min) / (stats.max - stats.min) // Normalize to 0-1 range

        // Project 3D to 2D
        const screenX = xOffset + ((x - y) * scale) / 2
        const screenY = yOffset + ((x + y) * scale) / 4 - normalizedValue * scale * 2

        // Color based on height
        const r = Math.min(255, Math.floor(normalizedValue * 255 * 2))
        const g = Math.min(255, Math.floor(normalizedValue * 100))
        const b = 0

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.beginPath()
        ctx.arc(screenX, screenY, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Add axes labels
    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.fillText("X Position (μm)", width - 100, height - 20)
    ctx.fillText("Y Position (μm)", 20, height - 20)
    ctx.fillText("Counts/s", 20, 20)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  // Generate threshold mask
  function generateThresholdMask() {
    const mask = Array(processedImage.length)
      .fill(0)
      .map((_, y) =>
        Array(processedImage[0].length)
          .fill(0)
          .map((_, x) => (processedImage[y][x] > threshold ? 1 : 0)),
      )
    return mask
  }

  // Generate histogram data
  function generateHistogramData() {
    const flatData = scanData.flat()
    const min = stats.min
    const max = stats.max
    const range = max - min
    const binCount = 20
    const binSize = range / binCount

    const bins = Array(binCount)
      .fill(0)
      .map((_, i) => min + i * binSize)
    const counts = Array(binCount).fill(0)

    flatData.forEach((value) => {
      const binIndex = Math.min(binCount - 1, Math.floor((value - min) / binSize))
      counts[binIndex]++
    })

    return { bins, counts }
  }

  // Function to apply colormap to a value
  const applyColormap = (value: number, colormap: string) => {
    // Normalize value to 0-1 range
    const normalizedValue = (value - stats.min) / (stats.max - stats.min)

    if (colormap === "hot") {
      // Hot colormap (red-yellow-white)
      const r = Math.min(255, Math.floor(normalizedValue * 255 * 3))
      const g = Math.min(255, Math.floor(Math.max(0, normalizedValue - 0.33) * 255 * 3))
      const b = Math.min(255, Math.floor(Math.max(0, normalizedValue - 0.66) * 255 * 3))
      return `rgb(${r}, ${g}, ${b})`
    } else if (colormap === "viridis") {
      // Simplified viridis colormap
      const r = Math.floor(68 + normalizedValue * 187)
      const g = Math.floor(1 + normalizedValue * 254)
      const b = Math.floor(84 + normalizedValue * 171)
      return `rgb(${r}, ${g}, ${b})`
    } else if (colormap === "plasma") {
      // Simplified plasma colormap
      const r = Math.floor(13 + normalizedValue * 242)
      const g = Math.floor(8 + normalizedValue * 132)
      const b = Math.floor(135 + normalizedValue * 120)
      return `rgb(${r}, ${g}, ${b})`
    } else if (colormap === "inferno") {
      // Simplified inferno colormap
      const r = Math.floor(0 + normalizedValue * 255)
      const g = Math.floor(0 + normalizedValue * 65)
      const b = Math.floor(4 + normalizedValue * 107)
      return `rgb(${r}, ${g}, ${b})`
    } else if (colormap === "gray") {
      // Grayscale
      const val = Math.floor(normalizedValue * 255)
      return `rgb(${val}, ${val}, ${val})`
    } else {
      // Default hot
      const r = Math.min(255, Math.floor(normalizedValue * 255 * 3))
      const g = Math.min(255, Math.floor(Math.max(0, normalizedValue - 0.33) * 255 * 3))
      const b = Math.min(255, Math.floor(Math.max(0, normalizedValue - 0.66) * 255 * 3))
      return `rgb(${r}, ${g}, ${b})`
    }
  }

  const histogramData = generateHistogramData()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>NV centers detected in your FSM scan</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  <TabsTrigger value="data">Raw Data</TabsTrigger>
                  <TabsTrigger value="histogram">Histogram</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="visualization" className="m-0">
                <div className="border-t border-border">
                  <div className="p-4">
                    <Tabs value={activeVisTab} onValueChange={setActiveVisTab}>
                      <TabsList className="w-full grid grid-cols-4">
                        <TabsTrigger value="original">Original Scan</TabsTrigger>
                        <TabsTrigger value="smoothed">Smoothed Scan</TabsTrigger>
                        <TabsTrigger value="threshold">Threshold Mask</TabsTrigger>
                        <TabsTrigger value="3d">3D Surface</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="relative aspect-square">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <Button variant="secondary" size="icon" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon">
                        <Move className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <div
                        className="relative bg-black"
                        style={{
                          width: `${100 * zoomLevel}%`,
                          height: `${100 * zoomLevel}%`,
                          transform: `scale(${1 / zoomLevel})`,
                        }}
                      >
                        {/* Original Scan Visualization */}
                        {activeVisTab === "original" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                              {/* Render the scan data as a grid of colored pixels */}
                              <div
                                className="absolute inset-0"
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: `repeat(${scanData[0].length}, 1fr)`,
                                  gridTemplateRows: `repeat(${scanData.length}, 1fr)`,
                                }}
                              >
                                {scanData.map((row, rowIndex) =>
                                  row.map((value, colIndex) => (
                                    <div
                                      key={`${rowIndex}-${colIndex}`}
                                      style={{
                                        backgroundColor: applyColormap(value, params.colormap),
                                        gridRow: rowIndex + 1,
                                        gridColumn: colIndex + 1,
                                      }}
                                    />
                                  )),
                                )}
                              </div>

                              {/* NV center markers */}
                              {params.showMarkers &&
                                coordinates.map(([y, x], index) => (
                                  <div
                                    key={index}
                                    className="absolute rounded-full border-2 border-red-500"
                                    style={{
                                      left: `${(x / scanData[0].length) * 100}%`,
                                      top: `${(y / scanData.length) * 100}%`,
                                      width: `10px`,
                                      height: `10px`,
                                      transform: "translate(-50%, -50%)",
                                    }}
                                  />
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Smoothed Scan Visualization */}
                        {activeVisTab === "smoothed" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                              <div
                                className="absolute inset-0"
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: `repeat(${processedImage[0].length}, 1fr)`,
                                  gridTemplateRows: `repeat(${processedImage.length}, 1fr)`,
                                }}
                              >
                                {processedImage.map((row, rowIndex) =>
                                  row.map((value, colIndex) => (
                                    <div
                                      key={`${rowIndex}-${colIndex}`}
                                      style={{
                                        backgroundColor: applyColormap(value, params.colormap),
                                        gridRow: rowIndex + 1,
                                        gridColumn: colIndex + 1,
                                      }}
                                    />
                                  )),
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Threshold Mask Visualization */}
                        {activeVisTab === "threshold" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                              <div
                                className="absolute inset-0"
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: `repeat(${processedImage[0].length}, 1fr)`,
                                  gridTemplateRows: `repeat(${processedImage.length}, 1fr)`,
                                }}
                              >
                                {generateThresholdMask().map((row, rowIndex) =>
                                  row.map((value, colIndex) => (
                                    <div
                                      key={`${rowIndex}-${colIndex}`}
                                      style={{
                                        backgroundColor: value ? "white" : "black",
                                        gridRow: rowIndex + 1,
                                        gridColumn: colIndex + 1,
                                      }}
                                    />
                                  )),
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3D Surface Visualization */}
                        {activeVisTab === "3d" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <canvas ref={canvas3DRef} width={500} height={500} className="w-full h-full"></canvas>
                          </div>
                        )}

                        {/* Colormap scale for non-3D views */}
                        {activeVisTab !== "3d" && activeVisTab !== "threshold" && (
                          <div className="absolute right-4 bottom-4 w-32 h-4 rounded overflow-hidden">
                            <div
                              className="w-full h-full"
                              style={{
                                background:
                                  params.colormap === "hot"
                                    ? "linear-gradient(to right, black, red, yellow, white)"
                                    : params.colormap === "viridis"
                                      ? "linear-gradient(to right, rgb(68,1,84), rgb(59,82,139), rgb(33,144,141), rgb(93,201,99), rgb(253,231,37))"
                                      : params.colormap === "plasma"
                                        ? "linear-gradient(to right, rgb(13,8,135), rgb(84,39,143), rgb(158,55,120), rgb(213,95,78), rgb(244,167,54), rgb(253,231,37))"
                                        : params.colormap === "inferno"
                                          ? "linear-gradient(to right, rgb(0,0,4), rgb(51,13,53), rgb(122,28,46), rgb(192,82,27), rgb(252,169,52), rgb(255,255,255))"
                                          : "linear-gradient(to right, black, white)",
                              }}
                            ></div>
                            <div className="flex justify-between text-xs text-white mt-1">
                              <span>{Math.round(stats.min)}</span>
                              <span>{Math.round(stats.max)}</span>
                            </div>
                          </div>
                        )}

                        {/* Axes labels */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white">
                          X Position (μm)
                        </div>
                        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-white">
                          Y Position (μm)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="data" className="m-0">
                <div className="border-t border-border">
                  <ScrollArea className="h-[500px] w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>X Position (μm)</TableHead>
                          <TableHead>Y Position (μm)</TableHead>
                          <TableHead>Intensity (counts/s)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coordinates.map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{xPositions[index].toFixed(2)}</TableCell>
                            <TableCell>{yPositions[index].toFixed(2)}</TableCell>
                            <TableCell>{intensities[index].toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="histogram" className="m-0">
                <div className="border-t border-border p-6">
                  <div className="h-[400px] flex flex-col">
                    <h3 className="text-lg font-medium mb-4">Intensity Histogram</h3>

                    {/* Histogram visualization */}
                    <div className="flex-1 flex items-end">
                      {histogramData.bins.map((bin, i) => {
                        const count = histogramData.counts[i]
                        const maxCount = Math.max(...histogramData.counts)
                        const height = `${(count / maxCount) * 80}%`

                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className="w-full px-0.5">
                              <div
                                className="w-full bg-blue-500/80 rounded-t"
                                style={{ height }}
                                title={`${count} pixels with intensity around ${bin.toFixed(0)}`}
                              ></div>
                            </div>
                            {i % 4 === 0 && <div className="mt-2 text-xs text-muted-foreground">{bin.toFixed(0)}</div>}
                          </div>
                        )
                      })}
                    </div>

                    {/* Threshold line */}
                    <div className="relative h-8 mt-2">
                      <div
                        className="absolute top-0 h-full w-0.5 bg-red-500"
                        style={{
                          left: `${
                            ((threshold - histogramData.bins[0]) /
                              (histogramData.bins[histogramData.bins.length - 1] - histogramData.bins[0])) *
                            100
                          }%`,
                        }}
                      ></div>
                      <div
                        className="absolute top-0 text-xs text-red-500"
                        style={{
                          left: `${
                            ((threshold - histogramData.bins[0]) /
                              (histogramData.bins[histogramData.bins.length - 1] - histogramData.bins[0])) *
                            100
                          }%`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        Threshold: {threshold.toFixed(0)}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Intensity (counts/s)</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Distribution of pixel intensities with detection threshold shown in red.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
            <CardDescription>Overview of detected NV centers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Total NV Centers</span>
                <Badge variant="outline" className="text-lg font-semibold">
                  {coordinates.length}
                </Badge>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${(coordinates.length / 30) * 100}%` }} />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Intensity</span>
                <span className="font-medium">
                  {intensities.length > 0
                    ? Math.round(intensities.reduce((sum, val) => sum + val, 0) / intensities.length)
                    : 0}{" "}
                  counts/s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scan Range</span>
                <span className="font-medium">
                  {xSteps.length > 0 ? (xSteps[xSteps.length - 1] - xSteps[0]).toFixed(1) : 0} ×{" "}
                  {ySteps.length > 0 ? (ySteps[ySteps.length - 1] - ySteps[0]).toFixed(1) : 0} μm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Density</span>
                <span className="font-medium">
                  {xSteps.length > 0 && ySteps.length > 0
                    ? (
                        coordinates.length /
                        ((xSteps[xSteps.length - 1] - xSteps[0]) * (ySteps[ySteps.length - 1] - ySteps[0]))
                      ).toFixed(2)
                    : 0}{" "}
                  centers/μm²
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Detection Parameters</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Threshold</span>
                  <span>{threshold.toFixed(0)} counts/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Threshold Factor</span>
                  <span>{params.threshold.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Distance</span>
                  <span>{params.minDistance} pixels</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Background Correction</span>
                  <span>{params.backgroundCorrection ? "Enabled" : "Disabled"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gaussian Filter</span>
                  <span>Sigma = {params.filterSize.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Report</CardTitle>
          <CardDescription>Detailed information about the detected NV centers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The analysis identified <strong>{coordinates.length} NV centers</strong> in the provided FSM scan. The
              centers have an average intensity of{" "}
              {intensities.length > 0
                ? Math.round(intensities.reduce((sum, val) => sum + val, 0) / intensities.length)
                : 0}{" "}
              counts/s.
            </p>

            <p>
              The spatial distribution shows a density of{" "}
              {xSteps.length > 0 && ySteps.length > 0
                ? (
                    coordinates.length /
                    ((xSteps[xSteps.length - 1] - xSteps[0]) * (ySteps[ySteps.length - 1] - ySteps[0]))
                  ).toFixed(2)
                : 0}{" "}
              centers per square micrometer, which is {coordinates.length > 10 ? "typical" : "lower than typical"} for
              delta-doped diamond samples with this implantation dose.
            </p>

            <p>
              The intensity distribution indicates that the NV centers are{" "}
              {intensities.length > 0 && intensities.some((i) => i > threshold * 1.5) ? "highly" : "moderately"}{" "}
              fluorescent, with values{" "}
              {intensities.length > 0 && intensities.some((i) => i > threshold * 1.5) ? "significantly" : "slightly"}{" "}
              above the detection threshold of {threshold.toFixed(0)} counts/s. This suggests{" "}
              {intensities.length > 0 && intensities.some((i) => i > threshold * 1.5) ? "good" : "acceptable"} optical
              properties and potential usefulness for quantum sensing and computing applications.
            </p>

            <p>
              The detection algorithm used Gaussian filtering (sigma = {params.filterSize.toFixed(1)}) for noise
              reduction and a local peak finding algorithm with a minimum separation distance of {params.minDistance}{" "}
              pixels. The threshold was set at {params.threshold.toFixed(1)} standard deviations above the mean
              background intensity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
