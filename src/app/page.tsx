"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Share2,
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
  const [copied, setCopied] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Instant local reactive state
    const saved = localStorage.getItem("dan1elcodm_links_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fetch server data
    fetch("/api/data")
      .then((res) => res.json())
      .then((serverData) => {
        if (serverData && serverData.profile) {
          setData(serverData);
          localStorage.setItem("dan1elcodm_links_data", JSON.stringify(serverData));
        }
      })
      .catch((err) => console.log("Using cached data", err));

    // Close menu on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkClick = (id: string) => {
    const updatedLinks = data.links.map((link) =>
      link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link
    );
    const updated = { ...data, links: updatedLinks };
    setData(updated);
    localStorage.setItem("dan1elcodm_links_data", JSON.stringify(updated));

    // Fire background sync
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch(() => {});
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
    <main className="min-h-screen bg-[#f5f6f8] text-neutral-900 flex flex-col items-center justify-between p-4 sm:p-6 font-sans">
      {/* Top Header Bar */}
      <div className="w-full max-w-xl flex items-center justify-end pt-2 pb-6">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white hover:bg-neutral-50 border border-neutral-200/90 text-neutral-700 shadow-sm transition-all active:scale-95"
          title="Share Profile"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Profile Section (Pure Linktree Style) */}
      <div className="w-full max-w-xl flex flex-col items-center text-center my-auto">
        {/* Avatar */}
        <div className="relative mb-3.5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-0.5 bg-white border-2 border-white shadow-md">
            <img
              src={data.profile.avatar || "/images/avatar.png"}
              alt={data.profile.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {data.profile.verified && (
            <div
              className="absolute bottom-0 right-1 bg-blue-500 rounded-full p-1 border-2 border-white shadow-sm"
              title="Verified Creator"
            >
              <CheckCircle2 className="w-4 h-4 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center justify-center gap-1.5">
          {data.profile.name}
        </h1>

        {/* Handle */}
        <p className="text-sm font-medium text-neutral-500 mt-0.5">
          {data.profile.handle}
        </p>

        {/* Bio */}
        {data.profile.bio && (
          <p className="text-sm text-neutral-600 max-w-md mt-2.5 leading-relaxed px-4">
            {data.profile.bio}
          </p>
        )}

        {/* Social Icons Bar (Authentic Linktree header icons with vector SVGs) */}
        <div className="flex items-center gap-3 my-5">
          {activeLinks.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              title={l.title}
              className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 flex items-center justify-center p-2 shadow-xs hover:shadow-md hover:scale-110 active:scale-95 transition-all"
            >
              <SocialIcon platform={l.platform} fallbackIcon={l.icon} className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Links Cards (Clean White Linktree Pills) */}
        <div className="w-full space-y-3.5 px-2 relative" ref={menuRef}>
          {activeLinks.map((link) => (
            <div key={link.id} className="relative">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="linktree-card group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-neutral-900 cursor-pointer"
              >
                {/* Left: Official Vector Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  <SocialIcon platform={link.platform} fallbackIcon={link.icon} className="w-9 h-9" />
                </div>

                {/* Center: Title */}
                <div className="flex-1 text-center font-semibold text-sm sm:text-base text-neutral-900 px-3 tracking-tight truncate">
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0"
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
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors"
                  >
                    {copiedLinkId === link.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Link Copied!</span>
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
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors border-t border-neutral-100"
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
      <footer className="w-full text-center text-xs text-neutral-400 py-6">
        <span>© {new Date().getFullYear()} {data.profile.name} • All Rights Reserved</span>
      </footer>
    </main>
  );
}
