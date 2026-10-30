"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Share2,
  ExternalLink,
  Lock,
  Check,
  Sparkles,
  Users,
  Flame,
  ArrowUpRight
} from "lucide-react";
import defaultData from "../../data/links.json";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { SiteData, LinkItem } from "@/types";

export default function HomePage() {
  const [data, setData] = useState<SiteData>(defaultData as SiteData);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Check local storage for instantaneous reactive state
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

  const handleLinkClick = (id: string, url: string) => {
    const updatedLinks = data.links.map((link) =>
      link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link
    );
    const updated = { ...data, links: updatedLinks };
    setData(updated);
    localStorage.setItem("dan1elcodm_links_data", JSON.stringify(updated));
  };

  // Find prominent links
  const activeLinks = data.links.filter((l) => l.active !== false);
  const whatsappLink = activeLinks.find((l) => l.platform === "whatsapp");
  const otherLinks = activeLinks.filter((l) => l.platform !== "whatsapp");

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-4 sm:p-6 relative selection:bg-blue-500 selection:text-white pb-24">
      <BackgroundGrid theme={data.profile.theme} />

      {/* Top Bar: Share & Status */}
      <header className="w-full max-w-lg flex items-center justify-between pt-2 pb-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase">Online & Active</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md transition-all text-slate-200 shadow-sm"
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
        </motion.button>
      </header>

      {/* Profile & Avatar Section */}
      <section className="w-full max-w-lg flex flex-col items-center text-center z-10 mb-6">
        {/* Animated Avatar Glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative mb-4 group"
        >
          {/* Pulsing Aura */}
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />

          {/* Avatar Ring */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-slate-950 border-2 border-white/20 shadow-2xl overflow-hidden">
            <img
              src={data.profile.avatar || "/images/avatar.png"}
              alt={data.profile.name}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Verified Badge */}
          {data.profile.verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-1 right-1 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full p-1 border-2 border-slate-950 shadow-lg"
              title="Verified Creator"
            >
              <CheckCircle2 className="w-4 h-4 text-white fill-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Display Name with Shimmer Gradient */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-2xl sm:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400"
        >
          {data.profile.name}
        </motion.h1>

        {/* Handle */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm font-semibold text-blue-400 tracking-wider mt-1"
        >
          {data.profile.handle}
        </motion.p>

        {/* Bio */}
        {data.profile.bio && (
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-xs sm:text-sm text-slate-300/90 max-w-sm mt-2.5 leading-relaxed px-4"
          >
            {data.profile.bio}
          </motion.p>
        )}
      </section>

      {/* BENTO GRID OF CARDS */}
      <section className="w-full max-w-lg z-10 space-y-3.5">
        {/* HERO CARD 1: WhatsApp VIP Community (Full Width Bento Hero) */}
        {whatsappLink && (
          <SpotlightCard
            href={whatsappLink.url}
            onClick={() => handleLinkClick(whatsappLink.id, whatsappLink.url)}
            spotlightColor="rgba(37, 211, 102, 0.25)"
            className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/80 p-5 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* Glow Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 p-2.5">
                  <img src={whatsappLink.icon || "/images/icons/whatsapp.svg"} alt="WhatsApp" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-emerald-400" />
                      <span>VIP Community</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {whatsappLink.title}
                  </h3>
                  <p className="text-xs text-slate-400">Join our squad chats, announcements & updates</p>
                </div>
              </div>

              {/* Action Arrow */}
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-slate-300 group-hover:text-white group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </SpotlightCard>
        )}

        {/* 2-COLUMN BENTO GRID FOR SOCIALS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {otherLinks.map((link, index) => {
            const isTikTok = link.platform === "tiktok";
            const isSnapchat = link.platform === "snapchat";
            const isInstagram = link.platform === "instagram";

            let spotlight = "rgba(59, 130, 246, 0.2)";
            if (isTikTok) spotlight = "rgba(0, 242, 254, 0.25)";
            if (isSnapchat) spotlight = "rgba(255, 252, 0, 0.25)";
            if (isInstagram) spotlight = "rgba(225, 48, 108, 0.25)";

            return (
              <SpotlightCard
                key={link.id}
                href={link.url}
                onClick={() => handleLinkClick(link.id, link.url)}
                spotlightColor={spotlight}
                className="group cursor-pointer p-4 flex flex-col justify-between h-36"
              >
                {/* Top Row: Icon + External Arrow */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md p-2 overflow-hidden"
                    style={{ backgroundColor: link.bgColor || "#1e293b" }}
                  >
                    {link.icon ? (
                      <img src={link.icon} alt={link.title} className="w-full h-full object-contain" />
                    ) : (
                      <ExternalLink className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom Row: Title & Subtext */}
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                    {link.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* FLOATING ACTION DOCK (Apple-style pill at the bottom) */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-4 z-40 flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80"
      >
        {activeLinks.slice(0, 5).map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            title={l.title}
            className="w-9 h-9 rounded-full flex items-center justify-center p-2 hover:scale-115 active:scale-95 transition-all hover:bg-white/10"
          >
            <img src={l.icon} alt={l.title} className="w-5 h-5 object-contain" />
          </a>
        ))}

        <div className="w-px h-5 bg-white/10 mx-1" />

        <Link
          href="/admin"
          title="Admin Settings"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <Lock className="w-4 h-4" />
        </Link>
      </motion.div>
    </main>
  );
}
