"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Share2, ExternalLink, Lock, Check } from "lucide-react";
import defaultData from "../../data/links.json";
import { SiteData, LinkItem } from "@/types";

export default function HomePage() {
  const [data, setData] = useState<SiteData>(defaultData as SiteData);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. First check local storage for instant sync
    const saved = localStorage.getItem("dan1elcodm_links_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fetch from server API
    fetch("/api/data")
      .then((res) => res.json())
      .then((serverData) => {
        if (serverData && serverData.profile) {
          setData(serverData);
          localStorage.setItem("dan1elcodm_links_data", JSON.stringify(serverData));
        }
      })
      .catch((err) => console.log("Using cached/default data", err));
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkClick = (id: string, url: string) => {
    // Increment clicks count locally
    const updatedLinks = data.links.map((link) =>
      link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link
    );
    const updated = { ...data, links: updatedLinks };
    setData(updated);
    localStorage.setItem("dan1elcodm_links_data", JSON.stringify(updated));
  };

  // Theme styling configurations
  const themeStyles = {
    midnight: {
      bg: "bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950",
      card: "bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 shadow-lg shadow-black/40",
      accent: "text-indigo-400",
      glow: "from-indigo-500/20 via-purple-500/10 to-transparent",
    },
    amoled: {
      bg: "bg-black",
      card: "bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700",
      accent: "text-white",
      glow: "from-white/10 via-white/5 to-transparent",
    },
    cyberpunk: {
      bg: "bg-gradient-to-b from-purple-950 via-slate-950 to-pink-950",
      card: "bg-purple-950/60 hover:bg-purple-900/70 border border-fuchsia-500/30 hover:border-fuchsia-400/60 shadow-lg shadow-fuchsia-950/50",
      accent: "text-cyan-400",
      glow: "from-fuchsia-600/20 via-cyan-500/15 to-transparent",
    },
    sunset: {
      bg: "bg-gradient-to-b from-stone-950 via-red-950/80 to-amber-950",
      card: "bg-stone-900/80 hover:bg-stone-800/90 border border-amber-900/40 hover:border-amber-600/50 shadow-lg shadow-black/40",
      accent: "text-amber-400",
      glow: "from-orange-500/20 via-red-500/15 to-transparent",
    },
    minimal: {
      bg: "bg-zinc-950",
      card: "bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700",
      accent: "text-zinc-400",
      glow: "from-zinc-500/10 via-transparent to-transparent",
    },
  };

  const currentTheme = themeStyles[data.profile.theme || "midnight"] || themeStyles.midnight;
  const activeLinks = data.links.filter((l) => l.active !== false);

  return (
    <main className={`min-h-screen ${currentTheme.bg} text-white flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden`}>
      {/* Background Ambient Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b ${currentTheme.glow} blur-3xl pointer-events-none rounded-full`} />

      {/* Share Profile Button (Top Right) */}
      <div className="w-full max-w-md flex justify-end pt-2 z-10">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all active:scale-95 text-slate-200"
          title="Share Profile"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center z-10 my-auto py-6">
        {/* Profile Avatar */}
        <div className="relative group mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden p-1 ring-2 ring-white/20 group-hover:ring-emerald-400/80 transition-all duration-300 shadow-xl bg-slate-900">
            <img
              src={data.profile.avatar || "/images/avatar.png"}
              alt={data.profile.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {data.profile.verified && (
            <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1 border-2 border-slate-950 shadow-md" title="Verified Creator">
              <CheckCircle2 className="w-4 h-4 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Name & Handle */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center justify-center gap-1.5">
            {data.profile.name}
          </h1>
          <p className="text-sm font-medium text-slate-400 tracking-wide mt-0.5">
            {data.profile.handle}
          </p>
        </div>

        {/* Bio */}
        {data.profile.bio && (
          <p className="text-center text-sm text-slate-300/90 max-w-xs mb-8 leading-relaxed px-2">
            {data.profile.bio}
          </p>
        )}

        {/* Links Stack */}
        <div className="w-full space-y-3.5">
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id, link.url)}
              style={{
                backgroundColor: link.bgColor ? `${link.bgColor}15` : undefined,
                borderColor: link.bgColor ? `${link.bgColor}40` : undefined,
              }}
              className={`group flex items-center justify-between w-full p-3.5 rounded-2xl ${currentTheme.card} transition-all duration-200 active:scale-[0.98] cursor-pointer`}
            >
              {/* Left: Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden"
                style={{ backgroundColor: link.bgColor || "#1e293b" }}
              >
                {link.icon ? (
                  <img
                    src={link.icon}
                    alt={link.title}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <ExternalLink className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Middle: Title */}
              <div className="flex-1 text-center px-3 font-semibold text-sm sm:text-base tracking-wide text-white group-hover:text-white transition-colors truncate">
                {link.title}
              </div>

              {/* Right: Subtle arrow */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer & Admin Secret Link */}
      <footer className="w-full text-center text-xs text-slate-500 py-4 flex items-center justify-center gap-2 z-10">
        <span>© {new Date().getFullYear()} {data.profile.name}</span>
        <span>•</span>
        <Link
          href="/admin"
          className="hover:text-slate-300 transition-colors flex items-center gap-1 p-1 rounded"
          title="Open Admin Dashboard"
        >
          <Lock className="w-3 h-3" />
          <span>Admin</span>
        </Link>
      </footer>
    </main>
  );
}

