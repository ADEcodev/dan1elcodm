// Helper to sanitize key for counter service
export function sanitizeKey(key: string): string {
  return (key || "").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}

export async function getCountForLink(id: string): Promise<number> {
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

export async function incrementLinkCount(id: string): Promise<number> {
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

export async function getAllCounts(linkIds: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  await Promise.all(
    linkIds.map(async (lid) => {
      counts[lid] = await getCountForLink(lid);
    })
  );
  return counts;
}

