import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import defaultData from "../../../../data/links.json";
import { getAllCounts } from "@/utils/clicks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // 1. Get current links & profile
  let siteData = defaultData;
  const dataFilePath = path.join(process.cwd(), "data", "links.json");
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, "utf8");
      siteData = JSON.parse(fileData);
    }
  } catch (e) {}

  // 2. Fetch live click counts
  const linkIds = siteData.links.map((l) => l.id);
  const clickCounts = await getAllCounts(linkIds);

  // 3. Merge live counts with link metadata
  const enrichedLinks = siteData.links.map((link) => {
    const liveClicks =
      typeof clickCounts[link.id] === "number" && clickCounts[link.id] >= (link.clicks || 0)
        ? clickCounts[link.id]
        : (link.clicks || 0);

    return {
      id: link.id,
      title: link.title,
      platform: link.platform,
      url: link.url,
      clicks: liveClicks,
      badge: link.badge || null,
      active: link.active !== false,
    };
  });

  // 4. Calculate summary stats
  const totalClicks = enrichedLinks.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinks = enrichedLinks.filter((l) => l.active).length;

  const linksWithShare = enrichedLinks.map((l) => ({
    ...l,
    percentage: totalClicks > 0 ? `${((l.clicks / totalClicks) * 100).toFixed(1)}%` : "0.0%",
  }));

  const sortedByClicks = [...linksWithShare].sort((a, b) => b.clicks - a.clicks);
  const topLink = sortedByClicks.length > 0 ? sortedByClicks[0] : null;

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    profile: {
      name: siteData.profile.name,
      handle: siteData.profile.handle,
      verified: siteData.profile.verified,
      businessEmail: siteData.profile.businessEmail || null,
    },
    summary: {
      totalClicks,
      totalLinks: enrichedLinks.length,
      activeLinks,
      topLink: topLink
        ? {
            id: topLink.id,
            title: topLink.title,
            platform: topLink.platform,
            clicks: topLink.clicks,
            percentage: topLink.percentage,
            url: topLink.url,
          }
        : null,
    },
    links: linksWithShare,
  });
}
