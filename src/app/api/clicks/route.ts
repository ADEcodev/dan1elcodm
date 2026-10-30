import { NextResponse } from "next/server";
import defaultData from "../../../../data/links.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to sanitize key for counter service
function sanitizeKey(key: string): string {
  return (key || "").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}

async function getCountForLink(id: string): Promise<number> {
  const clean = sanitizeKey(id);
  // Try Abacus first
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/get/dan1elcodm/${clean}`, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") {
        return data.value;
      }
    }
  } catch (e) {}

  // Fallback to CountAPI
  try {
    const res = await fetch(`https://countapi.mileshilliard.com/api/v1/get/dan1elcodm_${clean}`, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") {
        return data.value;
      }
    }
  } catch (e) {}

  return 0;
}

async function incrementLinkCount(id: string): Promise<number> {
  const clean = sanitizeKey(id);
  let value = 0;

  // Try Abacus
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/hit/dan1elcodm/${clean}`, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") {
        value = data.value;
      }
    }
  } catch (e) {}

  // Also sync to CountAPI fallback in background
  try {
    fetch(`https://countapi.mileshilliard.com/api/v1/hit/dan1elcodm_${clean}`, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4000),
    }).catch(() => {});
  } catch (e) {}

  return value;
}

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
  const counts: Record<string, number> = {};

  await Promise.all(
    linkIds.map(async (lid) => {
      counts[lid] = await getCountForLink(lid);
    })
  );

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

