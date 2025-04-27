import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"

// Create a temporary directory for sample data
const TEMP_DIR = join(process.cwd(), "tmp")
const SAMPLES_DIR = join(TEMP_DIR, "samples")

// Ensure directories exist
async function ensureDirsExist() {
  try {
    if (!existsSync(TEMP_DIR)) {
      await mkdir(TEMP_DIR, { recursive: true })
    }
    if (!existsSync(SAMPLES_DIR)) {
      await mkdir(SAMPLES_DIR, { recursive: true })
    }
    return true
  } catch (error) {
    console.error("Error creating directories:", error)
    return false
  }
}

// Generate sample FSM scan data
function generateSampleData() {
  const sampleData = {
    datasets: {
      ScanCounts: Array(100)
        .fill(0)
        .map(() =>
          Array(100)
            .fill(0)
            .map(() => 800 + Math.random() * 400),
        ),
      xSteps: Array(100)
        .fill(0)
        .map((_, i) => i * 0.1),
      ySteps: Array(100)
        .fill(0)
        .map((_, i) => i * 0.1),
    },
    params: {
      CenterOfScan: [5.0, 5.0],
      sweepRanges: [10.0, 10.0],
      scanPointsPerAxis: 100,
    },
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
        if (ny >= 0 && ny < 100 && nx >= 0 && nx < 100) {
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist <= radius) {
            const factor = Math.exp(-(dist * dist) / (radius * 0.5))
            sampleData.datasets.ScanCounts[ny][nx] += (intensity - 1000) * factor
          }
        }
      }
    }
  })

  return sampleData
}

export async function GET() {
  try {
    // Ensure directories exist
    await ensureDirsExist()

    // Generate sample data
    const sampleData = generateSampleData()

    // Generate a unique ID for the sample file
    const fileId = uuidv4()
    const samplePath = join(SAMPLES_DIR, `${fileId}.json`)

    // Save the sample data
    await writeFile(samplePath, JSON.stringify(sampleData))

    // Return the sample data
    return NextResponse.json({
      sampleData,
      message: "Sample FSM scan data generated successfully",
    })
  } catch (error) {
    console.error("Error generating sample data:", error)
    return NextResponse.json(
      {
        error: "Failed to generate sample data",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Ensure directories exist
    await ensureDirsExist()

    // Generate sample data
    const sampleData = generateSampleData()

    // Generate a unique ID for the sample file
    const fileId = uuidv4()
    const samplePath = join(SAMPLES_DIR, `${fileId}.json`)

    // Save the sample data
    await writeFile(samplePath, JSON.stringify(sampleData))

    // Create a File object from the sample data
    const file = new File([JSON.stringify(sampleData)], "sample-fsm-scan.json", {
      type: "application/json",
    })

    return NextResponse.json({
      fileId,
      fileName: "sample-fsm-scan.json",
      filePath: samplePath,
      message: "Sample FSM scan data generated successfully",
    })
  } catch (error) {
    console.error("Error generating sample data:", error)
    return NextResponse.json(
      {
        error: "Failed to generate sample data",
      },
      { status: 500 },
    )
  }
}
