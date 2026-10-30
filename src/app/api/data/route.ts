import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import defaultData from "../../../../data/links.json";

const dataFilePath = path.join(process.cwd(), "data", "links.json");

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, "utf8");
      return NextResponse.json(JSON.parse(fileData));
    }
    return NextResponse.json(defaultData);
  } catch (error) {
    return NextResponse.json(defaultData);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Attempt to write to file if supported
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
    } catch (fsErr) {
      // In serverless environments with read-only file systems, writeFileSync may fail gracefully
      console.warn("Could not write to local file system (expected on serverless):", fsErr);
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save data" },
      { status: 500 }
    );
  }
}

