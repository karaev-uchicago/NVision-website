import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { stat } from "fs/promises"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  const filename = params.filename

  // Handle JavaScript-generated images - we'll generate these client-side instead
  if (filename.endsWith(".js.png")) {
    try {
      // Extract the fileId from the filename
      const fileId = filename.replace(".js.png", "")
      const resultsJsonPath = join(process.cwd(), "tmp", "results", `${fileId}.json`)

      if (!existsSync(resultsJsonPath)) {
        console.error(`Results JSON file not found: ${resultsJsonPath}`)
        return NextResponse.json({ error: "Results file not found" }, { status: 404 })
      }

      // Read the results JSON and return it
      const resultsJson = await readFile(resultsJsonPath, "utf8")

      // Return the JSON with appropriate headers
      const headers = new Headers()
      headers.set("Content-Type", "application/json")
      headers.set("Cache-Control", "public, max-age=31536000")

      return new NextResponse(resultsJson, {
        status: 200,
        headers,
      })
    } catch (error) {
      console.error(`Error serving JavaScript results: ${error}`)
      return NextResponse.json(
        { error: `Error serving results: ${error instanceof Error ? error.message : String(error)}` },
        { status: 500 },
      )
    }
  }

  // Handle regular files
  const filePath = join(process.cwd(), "tmp", "results", filename)

  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  try {
    // Check file size
    const fileStats = await stat(filePath)
    if (fileStats.size === 0) {
      console.error(`File exists but is empty: ${filePath}`)
      return NextResponse.json({ error: "File exists but is empty" }, { status: 500 })
    }

    const fileBuffer = await readFile(filePath)

    // Set appropriate headers based on file extension
    const headers = new Headers()

    if (filename.endsWith(".png")) {
      headers.set("Content-Type", "image/png")
    } else if (filename.endsWith(".json")) {
      headers.set("Content-Type", "application/json")
    } else {
      headers.set("Content-Type", "application/octet-stream")
    }

    headers.set("Cache-Control", "public, max-age=31536000")
    headers.set("Content-Length", fileStats.size.toString())

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error(`Error serving file ${filePath}:`, error)
    return NextResponse.json(
      { error: `Error serving file: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
