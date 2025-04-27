import Link from "next/link"
import { ArrowRight, Github, Zap, Database, Microscope, Code, Download, Settings, Play, Video } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full opacity-80"></div>
                <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight">NVision</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#about"
              className="text-sm font-medium transition-colors hover:text-primary hover:scale-110 transition-transform"
            >
              About
            </Link>
            <Link
              href="#technology"
              className="text-sm font-medium transition-colors hover:text-primary hover:scale-110 transition-transform"
            >
              Technology
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-primary hover:scale-110 transition-transform"
            >
              Features
            </Link>
            <Link
              href="#documentation"
              className="text-sm font-medium transition-colors hover:text-primary hover:scale-110 transition-transform"
            >
              Documentation
            </Link>
            <Link
              href="/demo"
              className="text-sm font-medium transition-colors hover:text-primary hover:scale-110 transition-transform"
            >
              Demo
            </Link>
            <Link
              href="https://github.com/karaev-uchicago/quantum-NVision"
              className="text-sm font-medium transition-colors hover:text-primary hover:scale-110 transition-transform"
            >
              GitHub
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild className="hover:scale-105 transition-transform">
              <Link href="https://github.com/karaev-uchicago/quantum-NVision">
                <Github className="mr-2 h-4 w-4" />
                Download
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black py-24 md:py-32">
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.3),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(78,210,214,0.3),transparent_70%)]"></div>
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="bg-gradient-to-r from-purple-400 via-cyan-500 to-purple-400 bg-clip-text text-transparent text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl hover:scale-105 transition-transform duration-300 pb-2 leading-tight">
              Quantum Precision
              <br />
              Algorithmic Vision
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-300">
              NVision is an advanced algorithmic solution for identifying Nitrogen-Vacancy centers in FSM scans of
              delta-doped diamond, revolutionizing quantum sensing and computing applications.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="hover:scale-105 transition-transform">
                <Link href="#technology">
                  Explore Technology
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform">
                <Link href="/demo">Watch Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform">
                <Link href="https://github.com/karaev-uchicago/quantum-NVision">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-black to-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6 hover:scale-105 transition-transform duration-300">
                  What is NVision?
                </h2>
                <p className="text-lg mb-4 text-muted-foreground">
                  NVision is a cutting-edge algorithmic solution designed to identify and analyze Nitrogen-Vacancy (NV)
                  centers in delta-doped diamond samples using Fluorescence Scanning Microscopy (FSM) scans.
                </p>
                <p className="text-lg mb-6 text-muted-foreground">
                  Developed by quantum researchers, NVision automates the detection process, significantly improving
                  accuracy and efficiency compared to manual identification methods.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" asChild className="hover:scale-105 transition-transform">
                    <Link href="#technology">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Diamond lattice visualization */}
                  <div className="relative w-4/5 h-4/5">
                    {/* Diamond lattice structure */}
                    <div className="absolute inset-0">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={`row-${i}`}
                          className="absolute w-full border-t border-white/10"
                          style={{ top: `${i * 10}%` }}
                        />
                      ))}
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={`col-${i}`}
                          className="absolute h-full border-l border-white/10"
                          style={{ left: `${i * 10}%` }}
                        />
                      ))}
                    </div>

                    {/* NV centers */}
                    {Array.from({ length: 8 }).map((_, i) => {
                      const x = Math.random() * 100
                      const y = Math.random() * 100
                      const size = Math.random() * 1.5 + 0.5

                      return (
                        <div
                          key={`nv-${i}`}
                          className="absolute rounded-full animate-pulse"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${size}rem`,
                            height: `${size}rem`,
                            backgroundColor: `rgba(${Math.floor(100 + Math.random() * 155)}, ${Math.floor(100 + Math.random() * 155)}, 255, 0.6)`,
                            boxShadow: `0 0 ${size * 5}px rgba(120, 120, 255, 0.8)`,
                            transform: "translate(-50%, -50%)",
                            animationDuration: `${3 + Math.random() * 2}s`,
                          }}
                        />
                      )
                    })}

                    {/* Carbon atoms */}
                    {Array.from({ length: 60 }).map((_, i) => {
                      const x = Math.random() * 100
                      const y = Math.random() * 100

                      return (
                        <div
                          key={`atom-${i}`}
                          className="absolute rounded-full bg-white/30"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: "0.15rem",
                            height: "0.15rem",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm">Visualization of NV centers in diamond lattice</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4 hover:scale-105 transition-transform duration-300">
                Advanced Quantum Technology
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                NVision leverages sophisticated algorithms to identify and characterize Nitrogen-Vacancy centers,
                crucial components for quantum computing and sensing applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/5 dark:bg-white/5 p-8 rounded-xl border border-border hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Microscope className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 hover:scale-105 transition-transform duration-300">
                  Precision Detection
                </h3>
                <p className="text-muted-foreground">
                  Identifies NV centers with nanometer precision from FSM scans, enabling accurate mapping of quantum
                  resources in diamond substrates.
                </p>
              </div>

              <div className="bg-black/5 dark:bg-white/5 p-8 rounded-xl border border-border hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Code className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 hover:scale-105 transition-transform duration-300">
                  Algorithmic Analysis
                </h3>
                <p className="text-muted-foreground">
                  Employs advanced image processing and machine learning algorithms to distinguish NV centers from
                  background noise and artifacts.
                </p>
              </div>

              <div className="bg-black/5 dark:bg-white/5 p-8 rounded-xl border border-border hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 hover:scale-105 transition-transform duration-300">
                  Data Integration
                </h3>
                <p className="text-muted-foreground">
                  Seamlessly processes and integrates data from various microscopy sources, providing comprehensive
                  analysis of diamond samples.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 hover:scale-105 transition-transform duration-300">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                NVision provides researchers and quantum engineers with powerful tools to accelerate their work with NV
                centers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative">
                <div className="aspect-square rounded-xl overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Visualization of NV centers */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="/sample-analysis.png"
                        alt="Detected NV Centers in FSM Scan"
                        className="object-contain w-full h-full rounded-xl"
                        style={{ background: 'black' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold hover:scale-105 transition-transform duration-300">
                        Automated Detection
                      </h3>
                    </div>
                    <p className="text-gray-300 pl-11">
                      Automatically identifies NV centers from FSM scans with high accuracy, eliminating the need for
                      manual identification.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold hover:scale-105 transition-transform duration-300">
                        Statistical Analysis
                      </h3>
                    </div>
                    <p className="text-gray-300 pl-11">
                      Provides comprehensive statistical analysis of NV center distributions, densities, and
                      characteristics.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold hover:scale-105 transition-transform duration-300">
                        Visualization Tools
                      </h3>
                    </div>
                    <p className="text-gray-300 pl-11">
                      Generates clear visualizations of NV center locations and properties for easy interpretation and
                      presentation.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold hover:scale-105 transition-transform duration-300">
                        Batch Processing
                      </h3>
                    </div>
                    <p className="text-gray-300 pl-11">
                      Process multiple scans in batch mode, saving time and ensuring consistent analysis across samples.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section id="documentation" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6 hover:scale-105 transition-transform duration-300">
                  Comprehensive Documentation
                </h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Get started quickly with our detailed documentation, including installation guides, API references,
                  and example workflows.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">1</span>
                    </div>
                    <p className="font-medium">Installation and Setup</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">2</span>
                    </div>
                    <p className="font-medium">Data Preparation</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">3</span>
                    </div>
                    <p className="font-medium">Running Analysis</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">4</span>
                    </div>
                    <p className="font-medium">Interpreting Results</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Button asChild className="hover:scale-105 transition-transform">
                    <Link href="https://github.com/karaev-uchicago/quantum-NVision/blob/main/README.md">
                      View Documentation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="bg-black/5 dark:bg-white/5 p-6 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1"></div>
                  <div className="text-xs text-muted-foreground">NVision Workflow</div>
                </div>

                {/* Interactive visualization instead of code */}
                <div className="bg-black rounded-lg p-4 h-[300px] relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 flex items-center justify-center border-b border-white/10 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5"></div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Download className="h-8 w-8 text-purple-400" />
                        </div>
                        <p className="text-white font-medium">1. Download NVision</p>
                        <p className="text-xs text-white/60 mt-1">From GitHub repository</p>
                      </div>
                    </div>

                    <div className="flex-1 flex">
                      <div className="w-1/2 flex items-center justify-center border-r border-white/10 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5"></div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Settings className="h-6 w-6 text-purple-400" />
                          </div>
                          <p className="text-white font-medium">2. Configure</p>
                          <p className="text-xs text-white/60 mt-1">Set detection parameters</p>
                        </div>
                      </div>

                      <div className="w-1/2 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5"></div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Play className="h-6 w-6 text-purple-400" />
                          </div>
                          <p className="text-white font-medium">3. Analyze</p>
                          <p className="text-xs text-white/60 mt-1">Run NV center detection</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6 hover:scale-105 transition-transform duration-300">
                  Download NVision
                </h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Get the NVision software package from our GitHub repository. The package includes all the necessary
                  tools to identify and analyze Nitrogen-Vacancy centers in your diamond samples.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="font-medium">Download the complete package</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Github className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="font-medium">Access source code and documentation</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="font-medium">View example scripts and workflows</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="font-medium">Watch demonstration videos</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Button size="lg" asChild className="hover:scale-105 transition-transform">
                    <Link href="https://github.com/karaev-uchicago/quantum-NVision">
                      <Github className="mr-2 h-4 w-4" />
                      Download from GitHub
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* GitHub repository visualization */}
                    <div className="relative w-4/5 h-4/5 bg-black/50 rounded-lg overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-8 bg-black/70 flex items-center px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs text-white/70 mx-auto">quantum-NVision Repository</div>
                      </div>

                      <div className="absolute top-8 inset-x-0 bottom-0 flex">
                        <div className="w-1/3 border-r border-white/10 p-2">
                          <div className="h-full bg-black/30 rounded p-2">
                            <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
                            <div className="w-3/4 h-4 bg-white/10 rounded mb-4"></div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-purple-500/50"></div>
                                <div className="w-full h-3 bg-white/10 rounded"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-cyan-500/50"></div>
                                <div className="w-full h-3 bg-white/10 rounded"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-green-500/50"></div>
                                <div className="w-full h-3 bg-white/10 rounded"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-yellow-500/50"></div>
                                <div className="w-full h-3 bg-white/10 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-2/3 p-2">
                          <div className="h-full bg-black/30 rounded p-2">
                            <div className="space-y-3">
                              <div className="w-full h-4 bg-white/10 rounded"></div>
                              <div className="w-full h-4 bg-white/10 rounded"></div>
                              <div className="w-3/4 h-4 bg-white/10 rounded"></div>
                              <div className="w-full h-4 bg-white/10 rounded"></div>
                              <div className="w-1/2 h-4 bg-white/10 rounded"></div>
                              <div className="w-full h-4 bg-white/10 rounded"></div>
                              <div className="w-3/4 h-4 bg-white/10 rounded"></div>
                              <div className="w-full h-4 bg-white/10 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full opacity-50 blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6 hover:scale-105 transition-transform duration-300">
              Ready to Revolutionize Your Quantum Research?
            </h2>
            <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
              Start using NVision today and transform how you identify and analyze Nitrogen-Vacancy centers in your
              diamond samples.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="hover:scale-105 transition-transform">
                <Link href="https://github.com/karaev-uchicago/quantum-NVision">
                  <Github className="mr-2 h-4 w-4" />
                  Get Started on GitHub
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform">
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background/80">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full opacity-80"></div>
                  <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
                <span className="font-bold text-xl tracking-tight">NVision</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                NVision is an algorithmic solution for identifying Nitrogen-Vacancy centers in FSM scans of delta-doped
                diamond, developed for quantum research applications.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="https://github.com/karaev-uchicago/quantum-NVision"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#documentation"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/karaev-uchicago/quantum-NVision/blob/main/README.md"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Installation Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/karaev-uchicago/quantum-NVision/issues"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Report Issues
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Project</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/karaev-uchicago/quantum-NVision"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub Repository
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/karaev-uchicago/quantum-NVision/blob/main/LICENSE"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    License
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/karaev-uchicago/quantum-NVision/blob/main/CONTRIBUTING.md"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contributing
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} NVision. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
