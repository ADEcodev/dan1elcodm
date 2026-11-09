import { NextResponse } from "next/server";
import defaultData from "../../../../data/links.json";
import { getCountForLink, incrementLinkCount, getAllCounts } from "@/utils/clicks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/clicks or GET /api/clicks?action=hit&id=whatsapp-1
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");

  // Handle click hit
  if (action === "hit" && id) {
    const newCount = await incrementLinkCount(id);
    return NextResponse.json({ success: true, id, count: newCount });
  }

  // Handle fetching all counts
  const linkIds = defaultData.links.map((l) => l.id);
  const counts = await getAllCounts(linkIds);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    success: true,
    clicks: counts,
    total,
  });
}

// POST /api/clicks?action=hit&id=whatsapp-1 (for sendBeacon / keepalive)
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");

  if (!id) {
    try {
      const body = await request.json();
      id = body.id;
    } catch {}
  }

  if (id) {
    const newCount = await incrementLinkCount(id);
    return NextResponse.json({ success: true, id, count: newCount });
  }

  return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
}

