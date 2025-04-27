"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Github } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="mr-2 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold hover:scale-105 transition-transform">NVision Demo</h1>
            <p className="text-muted-foreground">Watch a demonstration of the NVision Python program</p>
          </div>
        </div>

        {/* Removed Alert here */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Demo Video</CardTitle>
              <CardDescription>Watch a demonstration of NVision in action</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center min-h-[400px] bg-black/20 rounded-md">
              <div className="w-full" style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                <iframe
                  src="https://www.youtube.com/embed/lvYw3H5Yv7s?si=yGfya87x8WhEZUOF"
                  title="NVision Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "0.375rem" // matches rounded-md
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Download NVision</CardTitle>
              <CardDescription>Get the NVision software from GitHub</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                NVision is available as a Python package that you can download from our GitHub repository. The package
                includes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Core NVision detection algorithm</li>
                <li>Visualization tools for FSM scan data</li>
                <li>Example datasets and scripts</li>
                <li>Comprehensive documentation</li>
              </ul>
              <div className="bg-black/10 p-4 rounded-md mt-4">
                <h3 className="text-sm font-medium mb-2">System Requirements</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>Python 3.7 or higher</li>
                  <li>NumPy, SciPy, Matplotlib</li>
                  <li>scikit-image for peak detection</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full hover:scale-105 transition-transform">
                <Link href="https://github.com/karaev-uchicago/quantum-NVision">
                  <Github className="mr-2 h-4 w-4" />
                  Download from GitHub
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-black/20 rounded-xl border border-border">
          <h2 className="text-xl font-semibold mb-4 hover:scale-105 transition-transform">How NVision Works</h2>
          <p className="mb-4">
            NVision is a Python-based algorithm designed to identify Nitrogen-Vacancy (NV) centers in Fluorescence
            Scanning Microscopy (FSM) scans of diamond samples. The software processes JSON-formatted scan data through
            several key steps:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="text-lg font-medium mb-4 hover:scale-105 transition-transform">Key Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Data Import</p>
                    <p className="text-sm text-muted-foreground">
                      Loads FSM scan data from JSON files containing scan counts and position information.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Noise Reduction</p>
                    <p className="text-sm text-muted-foreground">
                      Applies Gaussian filtering to reduce noise while preserving signal features
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Peak Detection</p>
                    <p className="text-sm text-muted-foreground">
                      Identifies local maxima using statistical thresholding to locate NV centers
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Visualization</p>
                    <p className="text-sm text-muted-foreground">
                      Generates comprehensive plots showing original data, processed data, and detected centers
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 hover:scale-105 transition-transform">Getting Started</h3>
              <div className="bg-black rounded-lg p-4 overflow-x-auto text-sm h-[300px] overflow-y-auto">
                <pre className="text-gray-300">
                  {`# Basic usage of NVision
import json
from nvision import detect_nv_centers, visualize_results

# Load FSM scan data
with open('fsm_scan.json', 'r') as f:
    data = json.load(f)

# Detect NV centers
results = detect_nv_centers(
    data, 
    threshold_factor=2.5,
    min_distance=10
)

# Print detection results
print(f"Detected {len(results['coordinates'])} NV centers")
print(f"Threshold: {results['threshold']:.1f} counts/s")

# Visualize the results
fig = visualize_results(data, results)
fig.savefig('nv_centers_analysis.png')
`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
