"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Share2,
  Lock,
  Check,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";
import defaultData from "../../data/links.json";
import { SiteData, LinkItem } from "@/types";

export default function HomePage() {
  const [data, setData] = useState<SiteData>(defaultData as SiteData);
  const [copied, setCopied] = useState(false);

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

        {/* Social Icons Bar (Authentic Linktree header icons) */}
        <div className="flex items-center gap-3 my-5">
          {activeLinks.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              title={l.title}
              className="w-9 h-9 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center p-2 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 transition-all"
            >
              <img src={l.icon} alt={l.title} className="w-4 h-4 object-contain" />
            </a>
          ))}
        </div>

        {/* Links Cards (Clean White Linktree Pills) */}
        <div className="w-full space-y-3.5 px-2">
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className="linktree-card group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-neutral-900 cursor-pointer"
            >
              {/* Left: Brand Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm p-2 overflow-hidden"
                style={{ backgroundColor: link.bgColor || "#000000" }}
              >
                {link.icon ? (
                  <img src={link.icon} alt={link.title} className="w-5 h-5 object-contain" />
                ) : (
                  <ExternalLink className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Center: Title */}
              <div className="flex-1 text-center font-semibold text-sm sm:text-base text-neutral-900 px-3 tracking-tight truncate">
                {link.title}
              </div>

              {/* Right: Three Dots / Subtle Action */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0">
                <MoreHorizontal className="w-5 h-5" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-neutral-400 py-6 flex items-center justify-center gap-2">
        <span>{data.profile.name}</span>
        <span>•</span>
        <Link
          href="/admin"
          className="hover:text-neutral-600 transition-colors flex items-center gap-1"
          title="Admin Panel"
        >
          <Lock className="w-3 h-3" />
          <span>Admin</span>
        </Link>
      </footer>
    </main>
  );
}
