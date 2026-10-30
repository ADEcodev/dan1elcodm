import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import defaultData from "../../../../data/links.json";

const dataFilePath = path.join(process.cwd(), "data", "links.json");

// In-memory cache for serverless environments (Vercel)
let inMemoryData: any = null;

export async function GET() {
  try {
    if (inMemoryData) {
      return NextResponse.json(inMemoryData);
    }
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, "utf8");
      const parsed = JSON.parse(fileData);
      inMemoryData = parsed;
      return NextResponse.json(parsed);
    }
    return NextResponse.json(defaultData);
  } catch (error) {
    return NextResponse.json(inMemoryData || defaultData);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    body.updatedAt = Date.now();
    inMemoryData = body;

    // Attempt to write to file if supported
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
    } catch (fsErr) {
      console.warn("Could not write to local file system (read-only on serverless):", fsErr);
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save data" },
      { status: 500 }
    );
  }
}
