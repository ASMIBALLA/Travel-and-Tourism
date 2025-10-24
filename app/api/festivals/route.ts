import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

export async function GET(req: NextRequest) {
  try {
    // Path to your XLSX file, e.g., public/festivals.xlsx
    const filePath = path.join(process.cwd(), "E:\sikkim-monastery-360\public\sikkim_festivals_full.xlsx")

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'XLSX file not found' }, { status: 404 })
    }

    // Read the workbook
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0] // Use first sheet
    const sheet = workbook.Sheets[sheetName]

    // Convert to JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" })

    // Normalize to Festival interface
    const festivals = rawData.map((f: any, idx: number) => ({
      id: idx + 1,
      name: f["Festival Name"] || f.name,
      startDate: f.Date || f.startDate,
      endDate: f.EndDate || f.endDate,
      location: f.Location || "Unknown",
      type: (f.Type?.toLowerCase() as "religious" | "cultural" | "music") || "cultural",
      description: f.Description || "",
    }))

    return NextResponse.json(festivals)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to read XLSX file' }, { status: 500 })
  }
}
