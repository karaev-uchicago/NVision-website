import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { writeFile, mkdir, readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"
import { promisify } from "util"

const execPromise = promisify(exec)

// Create a temporary directory for uploads and results
const TEMP_DIR = join(process.cwd(), "tmp")
const RESULTS_DIR = join(TEMP_DIR, "results")
const UPLOADS_DIR = join(TEMP_DIR, "uploads")

// Ensure directories exist
async function ensureDirsExist() {
  try {
    if (!existsSync(TEMP_DIR)) {
      await mkdir(TEMP_DIR, { recursive: true })
    }
    if (!existsSync(RESULTS_DIR)) {
      await mkdir(RESULTS_DIR, { recursive: true })
    }
    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true })
    }
    return true
  } catch (error) {
    console.error("Error creating directories:", error)
    return false
  }
}

// Process the data using JavaScript (fallback when Python is not available)
async function processWithJavaScript(data, thresholdFactor, minDistance, fileId) {
  try {
    console.log("Processing with JavaScript fallback")

    // Extract scan data
    const scanCounts = data.datasets.ScanCounts
    const xSteps = data.datasets.xSteps || Array.from({ length: scanCounts[0].length }, (_, i) => i)
    const ySteps = data.datasets.ySteps || Array.from({ length: scanCounts.length }, (_, i) => i)

    // Calculate mean and standard deviation
    let sum = 0
    let count = 0
    let min = Number.MAX_VALUE
    let max = Number.MIN_VALUE

    for (let y = 0; y < scanCounts.length; y++) {
      for (let x = 0; x < scanCounts[y].length; x++) {
        const value = scanCounts[y][x]
        sum += value
        count++
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
    }

    const mean = sum / count

    // Calculate standard deviation
    let sumSquaredDiff = 0
    for (let y = 0; y < scanCounts.length; y++) {
      for (let x = 0; x < scanCounts[y].length; x++) {
        const value = scanCounts[y][x]
        sumSquaredDiff += Math.pow(value - mean, 2)
      }
    }

    const stdDev = Math.sqrt(sumSquaredDiff / count)

    // Calculate threshold
    const threshold = mean + thresholdFactor * stdDev

    // Simple smoothing (average of neighbors)
    const smoothed = Array(scanCounts.length)
      .fill(0)
      .map(() => Array(scanCounts[0].length).fill(0))

    for (let y = 0; y < scanCounts.length; y++) {
      for (let x = 0; x < scanCounts[y].length; x++) {
        let sum = 0
        let count = 0

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy
            const nx = x + dx

            if (ny >= 0 && ny < scanCounts.length && nx >= 0 && nx < scanCounts[y].length) {
              sum += scanCounts[ny][nx]
              count++
            }
          }
        }

        smoothed[y][x] = sum / count
      }
    }

    // Find local maxima (peaks)
    const coordinates = []

    for (let y = 1; y < scanCounts.length - 1; y++) {
      for (let x = 1; x < scanCounts[y].length - 1; x++) {
        if (smoothed[y][x] > threshold) {
          let isLocalMax = true

          // Check if it's a local maximum
          for (let dy = -1; dy <= 1 && isLocalMax; dy++) {
            for (let dx = -1; dx <= 1 && isLocalMax; dx++) {
              if (dy === 0 && dx === 0) continue

              const ny = y + dy
              const nx = x + dx

              if (smoothed[ny][nx] > smoothed[y][x]) {
                isLocalMax = false
              }
            }
          }

          if (isLocalMax) {
            // Check minimum distance from existing peaks
            let tooClose = false

            for (const [cy, cx] of coordinates) {
              const distance = Math.sqrt(Math.pow(cy - y, 2) + Math.pow(cx - x, 2))
              if (distance < minDistance) {
                tooClose = true
                break
              }
            }

            if (!tooClose) {
              coordinates.push([y, x])
            }
          }
        }
      }
    }

    // Map coordinates to actual positions
    const xPositions = coordinates.map(([_, x]) => xSteps[x])
    const yPositions = coordinates.map(([y, _]) => ySteps[y])
    const intensities = coordinates.map(([y, x]) => scanCounts[y][x])

    // Create a mask for visualization
    const mask = Array(scanCounts.length)
      .fill(0)
      .map(() => Array(scanCounts[0].length).fill(0))

    for (let y = 0; y < scanCounts.length; y++) {
      for (let x = 0; x < scanCounts[y].length; x++) {
        mask[y][x] = smoothed[y][x] > threshold ? 1 : 0
      }
    }

    // Create results object
    const results = {
      scanData: data,
      coordinates,
      x_positions: xPositions,
      y_positions: yPositions,
      intensities,
      processed_image: smoothed,
      threshold,
      mask,
      stats: {
        mean,
        stdDev,
        min,
        max,
      },
    }

    // Save results as JSON
    const resultsJsonPath = join(RESULTS_DIR, `${fileId}.json`)
    await writeFile(resultsJsonPath, JSON.stringify(results))

    return {
      resultsJsonPath,
      results,
    }
  } catch (error) {
    console.error("Error in JavaScript processing:", error)
    throw error
  }
}

// Create a Python script that exactly replicates the GUI.py behavior
async function createPythonScript() {
  const scriptPath = join(TEMP_DIR, "analyze.py")

  const pythonScript = `
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import json
from scipy import ndimage
from skimage.feature import peak_local_max
import sys
import os
import traceback

def detect_nv_centers(data, threshold_factor=2.5, min_distance=10):
    """Detect NV centers in FSM scan data"""
    try:
        # Extract scan data
        scan_counts = np.array(data['datasets']['ScanCounts'])
        
        # Handle x and y steps
        if 'xSteps' in data['datasets']:
            x_steps = np.array(data['datasets']['xSteps'])
        else:
            x_steps = np.linspace(-15, 15, scan_counts.shape[1])
            
        if 'ySteps' in data['datasets']:
            y_steps = np.array(data['datasets']['ySteps'])
        else:
            y_steps = np.linspace(-15, 15, scan_counts.shape[0])
        
        # Calculate mean and std
        mean_count = np.nanmean(scan_counts)
        std_count = np.nanstd(scan_counts)
        
        # Calculate threshold
        threshold = mean_count + threshold_factor * std_count
        
        # Apply Gaussian blur to reduce noise
        smoothed = ndimage.gaussian_filter(scan_counts, sigma=1)
        
        # Find local peaks
        coordinates = peak_local_max(
            smoothed, 
            min_distance=min_distance, 
            threshold_abs=threshold
        )
        
        # Map coordinates to actual positions
        if len(coordinates) > 0:
            y_indices = coordinates[:, 0]
            x_indices = coordinates[:, 1]
            
            # Map to actual positions
            y_positions = np.interp(y_indices, np.arange(len(y_steps)), y_steps)
            x_positions = np.interp(x_indices, np.arange(len(x_steps)), x_steps)
            
            # Get intensity values at the peaks
            intensities = [scan_counts[y, x] for y, x in coordinates]
        else:
            y_positions = np.array([])
            x_positions = np.array([])
            intensities = np.array([])
        
        # Calculate statistics
        stats = {
            'mean': float(mean_count),
            'stdDev': float(std_count),
            'min': float(np.nanmin(scan_counts)),
            'max': float(np.nanmax(scan_counts))
        }
        
        return {
            'coordinates': coordinates.tolist() if len(coordinates) > 0 else [],
            'x_positions': x_positions.tolist() if len(x_positions) > 0 else [],
            'y_positions': y_positions.tolist() if len(y_positions) > 0 else [],
            'intensities': intensities if isinstance(intensities, list) else intensities.tolist() if len(intensities) > 0 else [],
            'processed_image': smoothed.tolist(),
            'threshold': float(threshold),
            'stats': stats
        }
    except Exception as e:
        print(f"Error in detect_nv_centers: {str(e)}")
        traceback.print_exc()
        raise

def visualize_results(data, results, output_path):
    """Visualize the detection results exactly like the original GUI"""
    try:
        # Extract data
        scan_counts = np.array(data['datasets']['ScanCounts'])
        
        # Handle x and y steps
        if 'xSteps' in data['datasets']:
            x_steps = np.array(data['datasets']['xSteps'])
        else:
            x_steps = np.linspace(-15, 15, scan_counts.shape[1])
            
        if 'ySteps' in data['datasets']:
            y_steps = np.array(data['datasets']['ySteps'])
        else:
            y_steps = np.linspace(-15, 15, scan_counts.shape[0])
            
        threshold = results['threshold']
        smoothed = np.array(results['processed_image'])
        coordinates = np.array(results['coordinates']) if len(results['coordinates']) > 0 else np.array([]).reshape(0, 2)
        
        # Create figure with the same layout as the GUI
        plt.rcParams.update({'font.size': 10})
        fig = plt.figure(figsize=(15, 10), dpi=100)
        
        # Plot original scan
        ax1 = fig.add_subplot(231)
        extent = [min(x_steps), max(x_steps), min(y_steps), max(y_steps)]
        im1 = ax1.imshow(scan_counts, cmap='hot', origin='lower', extent=extent, aspect='auto')
        plt.colorbar(im1, ax=ax1, label='Counts/s')
        ax1.set_title('Original FSM Scan')
        ax1.set_xlabel('X Position (μm)')
        ax1.set_ylabel('Y Position (μm)')
        
        # Plot smoothed scan
        ax2 = fig.add_subplot(232)
        im2 = ax2.imshow(smoothed, cmap='hot', origin='lower', extent=extent, aspect='auto')
        plt.colorbar(im2, ax=ax2, label='Counts/s (smoothed)')
        ax2.set_title('Smoothed Scan')
        ax2.set_xlabel('X Position (μm)')
        ax2.set_ylabel('Y Position (μm)')
        
        # Plot threshold mask
        ax3 = fig.add_subplot(233)
        mask = smoothed > threshold
        im3 = ax3.imshow(mask, cmap='gray', origin='lower', extent=extent, aspect='auto')
        ax3.set_title(f'Threshold Mask (>{threshold:.1f} counts/s)')
        ax3.set_xlabel('X Position (μm)')
        ax3.set_ylabel('Y Position (μm)')
        
        # Plot detected NV centers on original scan
        ax4 = fig.add_subplot(234)
        im4 = ax4.imshow(scan_counts, cmap='hot', origin='lower', extent=extent, aspect='auto')
        plt.colorbar(im4, ax=ax4, label='Counts/s')
        ax4.set_title(f'Detected NV Centers: {len(coordinates)}')
        ax4.set_xlabel('X Position (μm)')
        ax4.set_ylabel('Y Position (μm)')
        
        # Plot markers at NV centers
        if len(coordinates) > 0:
            x_positions = np.array(results['x_positions'])
            y_positions = np.array(results['y_positions'])
            ax4.scatter(x_positions, y_positions, s=100, facecolors='none', edgecolors='red', linewidths=2)
        
        # Plot 3D surface of the scan
        ax5 = fig.add_subplot(235, projection='3d')
        X, Y = np.meshgrid(x_steps, y_steps)
        ax5.plot_surface(X, Y, scan_counts, cmap='hot', linewidth=0, antialiased=True)
        ax5.set_title('3D Surface Plot')
        ax5.set_xlabel('X Position (μm)')
        ax5.set_ylabel('Y Position (μm)')
        ax5.set_zlabel('Counts/s')
        
        # Plot intensity histogram with threshold
        ax6 = fig.add_subplot(236)
        ax6.hist(scan_counts.flatten(), bins=50, alpha=0.7, color='blue')
        ax6.axvline(x=threshold, color='red', linestyle='--', 
                   label=f'Threshold: {threshold:.1f}')
        ax6.set_title('Intensity Histogram')
        ax6.set_xlabel('Counts/s')
        ax6.set_ylabel('Frequency')
        ax6.legend()
        
        plt.tight_layout()
        
        # Ensure the output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save the figure with high quality
        canvas = FigureCanvas(fig)
        fig.savefig(output_path, format='png', dpi=150, bbox_inches='tight')
        plt.close(fig)
        
        # Verify the file was created and has content
        if not os.path.exists(output_path):
            raise FileNotFoundError(f"Failed to create output file: {output_path}")
            
        file_size = os.path.getsize(output_path)
        if file_size == 0:
            raise ValueError(f"Output file is empty: {output_path}")
            
        print(f"Successfully saved visualization to {output_path} (size: {file_size} bytes)")
        
    except Exception as e:
        print(f"Error in visualize_results: {str(e)}")
        traceback.print_exc()
        raise

def main():
    try:
        if len(sys.argv) != 5:
            print("Usage: python analyze.py <input_file> <output_file> <threshold_factor> <min_distance>")
            sys.exit(1)
        
        input_file = sys.argv[1]
        output_file = sys.argv[2]
        threshold_factor = float(sys.argv[3])
        min_distance = int(sys.argv[4])
        
        print(f"Processing file: {input_file}")
        print(f"Output will be saved to: {output_file}")
        print(f"Parameters: threshold_factor={threshold_factor}, min_distance={min_distance}")
        
        # Check if input file exists
        if not os.path.exists(input_file):
            raise FileNotFoundError(f"Input file not found: {input_file}")
            
        # Load data
        with open(input_file) as f:
            data = json.load(f)
        
        # Validate data structure
        if 'datasets' not in data or 'ScanCounts' not in data['datasets']:
            raise ValueError("Invalid JSON structure: missing 'datasets.ScanCounts'")
        
        # Detect NV centers
        results = detect_nv_centers(data, threshold_factor=threshold_factor, min_distance=min_distance)
        
        # Visualize and save results
        visualize_results(data, results, output_file)
        
        # Save the results as JSON for potential further processing
        results_json_path = output_file.replace('.png', '.json')
        with open(results_json_path, 'w') as f:
            json.dump({
                'scanData': data,
                **results
            }, f)
        
        print(f"Analysis complete. Detected {len(results['coordinates'])} NV centers.")
        print(f"Results saved to {output_file} and {results_json_path}")
        
    except Exception as e:
        print(f"Error in main: {str(e)}")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
`

  await writeFile(scriptPath, pythonScript)
  return scriptPath
}

// Generate sample data for fallback
async function generateSampleData() {
  const sampleData = {
    datasets: {
      ScanCounts: Array(100)
        .fill(0)
        .map(() =>
          Array(100)
            .fill(0)
            .map(() => 20000 + Math.random() * 10000),
        ),
      xSteps: Array.from({ length: 100 }, (_, i) => -15 + (i * 30) / 99),
      ySteps: Array.from({ length: 100 }, (_, i) => -15 + (i * 30) / 99),
    },
    params: {
      CenterOfScan: [0.0, 0.0],
      sweepRanges: [30.0, 30.0],
      scanPointsPerAxis: 100,
    },
  }

  // Add some NV centers as bright spots
  const nvCenters = [
    { x: 25, y: 35, intensity: 120000 },
    { x: 42, y: 67, intensity: 140000 },
    { x: 78, y: 23, intensity: 130000 },
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
            sampleData.datasets.ScanCounts[ny][nx] += (intensity - 30000) * factor
          }
        }
      }
    }
  })

  const fileId = uuidv4()
  const samplePath = join(UPLOADS_DIR, `${fileId}.json`)
  await writeFile(samplePath, JSON.stringify(sampleData))
  return { samplePath, fileId, sampleData }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting API request processing")

    // Ensure directories exist
    const dirsCreated = await ensureDirsExist()
    if (!dirsCreated) {
      console.error("Failed to create necessary directories")
      return NextResponse.json({ error: "Failed to create necessary directories" }, { status: 500 })
    }

    // Get form data
    let formData
    try {
      formData = await request.formData()
      console.log("Form data parsed successfully")
    } catch (error) {
      console.error("Error parsing form data:", error)
      return NextResponse.json(
        {
          error: `Failed to parse form data: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 400 },
      )
    }

    const file = formData.get("file") as File | null
    if (!file) {
      console.error("No file provided in form data")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const thresholdFactor = Number.parseFloat((formData.get("thresholdFactor") as string) || "2.5")
    const minDistance = Number.parseInt((formData.get("minDistance") as string) || "10", 10)

    console.log(`Processing with parameters: thresholdFactor=${thresholdFactor}, minDistance=${minDistance}`)

    // Generate unique IDs for the files
    const fileId = uuidv4()
    const inputPath = join(UPLOADS_DIR, `${fileId}.json`)
    const outputPath = join(RESULTS_DIR, `${fileId}.png`)
    const resultsJsonPath = join(RESULTS_DIR, `${fileId}.json`)

    console.log(`File paths: inputPath=${inputPath}, outputPath=${outputPath}`)

    // Save the uploaded file
    let jsonData
    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      await writeFile(inputPath, fileBuffer)
      console.log("File saved successfully")

      // Validate JSON structure
      const fileContent = await readFile(inputPath, "utf8")
      try {
        jsonData = JSON.parse(fileContent)
        console.log("JSON parsed successfully")
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError)
        return NextResponse.json(
          {
            error: `Invalid JSON file: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
          },
          { status: 400 },
        )
      }

      // Check for required fields
      if (!jsonData.datasets || !jsonData.datasets.ScanCounts) {
        console.error("Invalid JSON structure: missing 'datasets.ScanCounts'")
        return NextResponse.json(
          {
            error: "Invalid JSON structure: missing 'datasets.ScanCounts'",
          },
          { status: 400 },
        )
      }

      // Check if ScanCounts is a 2D array
      if (!Array.isArray(jsonData.datasets.ScanCounts) || !Array.isArray(jsonData.datasets.ScanCounts[0])) {
        console.error("Invalid JSON structure: 'datasets.ScanCounts' must be a 2D array")
        return NextResponse.json(
          {
            error: "Invalid JSON structure: 'datasets.ScanCounts' must be a 2D array",
          },
          { status: 400 },
        )
      }
    } catch (error) {
      console.error("Error saving or validating file:", error)
      return NextResponse.json(
        {
          error: `Error processing file: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 400 },
      )
    }

    // Try JavaScript processing first (always works)
    try {
      console.log("Starting JavaScript processing")
      const { results } = await processWithJavaScript(jsonData, thresholdFactor, minDistance, fileId)
      console.log("JavaScript processing completed successfully")

      // Return the results
      return NextResponse.json({
        resultsUrl: `/api/results/${fileId}.json`,
        message: "Analysis completed successfully with JavaScript",
        results,
        jsProcessed: true,
      })
    } catch (jsError) {
      console.error("JavaScript processing failed:", jsError)
      // Continue to try Python processing
    }

    // Try Python processing as a fallback
    let scriptPath
    try {
      scriptPath = await createPythonScript()
      console.log("Python script created successfully")
    } catch (error) {
      console.error("Error creating Python script:", error)
      return NextResponse.json({ error: "Failed to create Python script" }, { status: 500 })
    }

    try {
      // Check if Python is available
      await execPromise("python --version")
      console.log("Python is available")
    } catch (error) {
      console.error("Python is not available:", error)

      // Use sample data as fallback
      try {
        const { fileId: sampleId, sampleData } = await generateSampleData()
        console.log("Sample data generated successfully")

        // Process with JavaScript
        const { results } = await processWithJavaScript(sampleData, thresholdFactor, minDistance, sampleId)

        return NextResponse.json({
          error: "Python is not installed or not available. Using sample data instead.",
          resultsUrl: `/api/results/${sampleId}.json`,
          message: "Analysis completed with sample data (JavaScript processing)",
          results,
          isSample: true,
          jsProcessed: true,
        })
      } catch (sampleError) {
        console.error("Error generating sample data:", sampleError)
        return NextResponse.json({ error: "Failed to process with fallback method" }, { status: 500 })
      }
    }

    try {
      // Check if required packages are installed
      await execPromise('python -c "import numpy, matplotlib, scipy, skimage"')
      console.log("Required Python packages are available")
    } catch (error) {
      console.error("Required Python packages are not installed:", error)

      // Return the JavaScript processed results
      const { results } = await processWithJavaScript(jsonData, thresholdFactor, minDistance, fileId)

      return NextResponse.json({
        error: "Required Python packages are not installed. Using JavaScript processing instead.",
        resultsUrl: `/api/results/${fileId}.json`,
        message: "Analysis completed with JavaScript processing",
        results,
        jsProcessed: true,
      })
    }

    try {
      // Run the Python script with detailed output
      console.log(
        `Running Python script: python ${scriptPath} ${inputPath} ${outputPath} ${thresholdFactor} ${minDistance}`,
      )

      const { stdout, stderr } = await execPromise(
        `python ${scriptPath} ${inputPath} ${outputPath} ${thresholdFactor} ${minDistance}`,
        { maxBuffer: 10 * 1024 * 1024 }, // Increase buffer size to 10MB
      )

      console.log("Python stdout:", stdout)

      if (stderr) {
        console.error("Python stderr:", stderr)
      }

      // Check if the output file was created
      if (!existsSync(outputPath)) {
        console.error("Python script did not generate the output file")
        throw new Error("Python script did not generate the output file")
      }

      // Check if the file has content
      const stats = await readFile(outputPath)
      if (stats.length === 0) {
        console.error("Generated image file is empty")
        throw new Error("Generated image file is empty")
      }

      // Check if results JSON was created
      let resultsData = null
      if (existsSync(resultsJsonPath)) {
        const resultsJson = await readFile(resultsJsonPath, "utf8")
        resultsData = JSON.parse(resultsJson)
        console.log("Results JSON parsed successfully")
      }

      // Return the path to the generated image and results
      return NextResponse.json({
        imageUrl: `/api/results/${fileId}.png`,
        resultsUrl: resultsData ? `/api/results/${fileId}.json` : null,
        message: "Analysis completed successfully with Python",
        results: resultsData,
      })
    } catch (error) {
      console.error("Error running Python script:", error)

      // Return the JavaScript processed results as a fallback
      const { results } = await processWithJavaScript(jsonData, thresholdFactor, minDistance, fileId)

      return NextResponse.json({
        error: `Python processing failed: ${error instanceof Error ? error.message : String(error)}. Using JavaScript processing instead.`,
        resultsUrl: `/api/results/${fileId}.json`,
        message: "Analysis completed with JavaScript processing (Python failed)",
        results,
        jsProcessed: true,
      })
    }
  } catch (error) {
    console.error("Error processing request:", error)

    // Provide more detailed error information
    let errorMessage = "Failed to process the file"
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`
      console.error(error.stack)
    } else {
      errorMessage = `${errorMessage}: ${String(error)}`
    }

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
