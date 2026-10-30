"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Check,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Globe
} from "lucide-react";
import defaultData from "../../data/links.json";
import { SocialIcon } from "@/components/SocialIcon";
import { SiteData, LinkItem } from "@/types";

export default function HomePage() {
  const [data, setData] = useState<SiteData>(defaultData as SiteData);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Instant local reactive state
    const saved = localStorage.getItem("dan1elcodm_links_data");
    let localData: SiteData | null = null;
    if (saved) {
      try {
        localData = JSON.parse(saved);
        if (localData && localData.profile) {
          setData(localData);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fetch server data with timestamp guard
    fetch("/api/data")
      .then((res) => res.json())
      .then((serverData) => {
        if (serverData && serverData.profile) {
          const localTime = (localData as any)?.updatedAt || 0;
          const serverTime = (serverData as any)?.updatedAt || 0;

          // Only overwrite if server is strictly newer or no valid local data exists
          if (!localData || serverTime > localTime) {
            setData(serverData);
            localStorage.setItem("dan1elcodm_links_data", JSON.stringify(serverData));
          }
        }
      })
      .catch((err) => console.log("Using cached data", err));

    // 3. Fetch real-time cloud click analytics
    fetch("/api/clicks")
      .then((res) => res.json())
      .then((clickRes) => {
        if (clickRes && clickRes.clicks) {
          setData((prev) => {
            const merged = prev.links.map((link) => {
              const cloudVal = clickRes.clicks[link.id];
              return typeof cloudVal === "number" && cloudVal > (link.clicks || 0)
                ? { ...link, clicks: cloudVal }
                : link;
            });
            return { ...prev, links: merged };
          });
        }
      })
      .catch(() => {});

    // Close menu on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = (id: string) => {
    // 1. Instant local increment
    setData((prev) => {
      const updatedLinks = prev.links.map((link) =>
        link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link
      );
      const updated = {
        ...prev,
        links: updatedLinks,
      };
      localStorage.setItem("dan1elcodm_links_data", JSON.stringify(updated));
      return updated;
    });

    // 2. Reliable cloud hit increment
    try {
      const hitUrl = `/api/clicks?action=hit&id=${encodeURIComponent(id)}`;
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(hitUrl);
      } else {
        fetch(hitUrl, { method: "POST", keepalive: true }).catch(() => {});
      }
    } catch {}
  };

  const handleCopyLink = (e: React.MouseEvent, link: LinkItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link.url);
      setCopiedLinkId(link.id);
      setTimeout(() => {
        setCopiedLinkId(null);
        setActiveMenuId(null);
      }, 1500);
    }
  };

  const handleOpenBrowser = (e: React.MouseEvent, link: LinkItem) => {
    e.preventDefault();
    e.stopPropagation();
    handleLinkClick(link.id);
    setActiveMenuId(null);
    window.open(link.url, "_blank");
  };

  const activeLinks = data.links.filter((l) => l.active !== false);

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex flex-col items-center pt-8 sm:pt-12 pb-10 px-4 sm:px-6 font-sans">
      {/* Profile Section (Pure Black & White Linktree Style) */}
      <div className="w-full max-w-xl flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-3.5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-0.5 bg-white border-2 border-neutral-200 shadow-md">
            <img
              src={data.profile.avatar || "/images/avatar.png"}
              alt={data.profile.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {data.profile.verified && (
            <div
              className="absolute bottom-0 right-1 bg-black rounded-full p-1 border-2 border-white shadow-xs flex items-center justify-center"
              title="Verified Creator"
            >
              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight flex items-center justify-center gap-1.5">
          {data.profile.name}
        </h1>

        {/* Handle */}
        <p className="text-sm font-semibold text-neutral-500 mt-0.5">
          {data.profile.handle}
        </p>

        {/* Welcome Message / Bio (With line breaks preserved) */}
        {data.profile.bio && (
          <p className="text-sm font-medium text-neutral-700 max-w-md mt-3 leading-relaxed px-4 whitespace-pre-line">
            {data.profile.bio}
          </p>
        )}

        {/* Social Icons Bar (Header vector icons) */}
        <div className="flex items-center gap-3 my-5">
          {activeLinks.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(l.id)}
              title={l.title}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all overflow-hidden"
            >
              <SocialIcon platform={l.platform} fallbackIcon={l.icon} className="w-full h-full" />
            </a>
          ))}
        </div>

        {/* Links Cards (Clean Black & White Linktree Pills) */}
        <div className="w-full space-y-3.5 px-2 relative" ref={menuRef}>
          {activeLinks.map((link) => (
            <div key={link.id} className="relative">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="linktree-card group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200 hover:border-black/40 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-neutral-900 cursor-pointer transition-all"
              >
                {/* Left: Vector Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  <SocialIcon platform={link.platform} fallbackIcon={link.icon} className="w-11 h-11" />
                </div>

                {/* Center: Title */}
                <div className="flex-1 text-center font-bold text-sm sm:text-base text-black px-3 tracking-tight truncate">
                  {link.title}
                </div>

                {/* Right: Three Dots Trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === link.id ? null : link.id);
                  }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors shrink-0"
                  title="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </a>

              {/* Three Dots Dropdown Menu */}
              {activeMenuId === link.id && (
                <div className="absolute right-2 top-full mt-1.5 w-48 bg-white border border-neutral-200 rounded-2xl shadow-xl py-1.5 z-30 animate-fade-in text-left">
                  {/* Copy Link Option */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(e, link)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 flex items-center gap-2.5 transition-colors"
                  >
                    {copiedLinkId === link.id ? (
                      <>
                        <Check className="w-4 h-4 text-black stroke-[2.5]" />
                        <span className="text-black font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-neutral-500" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  {/* Open in Browser Option */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenBrowser(e, link)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 flex items-center gap-2.5 transition-colors border-t border-neutral-100"
                  >
                    <Globe className="w-4 h-4 text-neutral-500" />
                    <span>Open in Browser</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-neutral-400 pt-8 pb-4 mt-auto">
        <span>© {new Date().getFullYear()} {data.profile.name} • All Rights Reserved</span>
      </footer>
    </main>
  );
}
