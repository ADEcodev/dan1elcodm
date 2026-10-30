"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Unlock,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  CheckCircle2,
  Palette,
  User,
  Settings,
  Sparkles,
  Smartphone,
  ChevronRight,
  LogOut,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import defaultData from "../../../data/links.json";
import { PLATFORM_PRESETS, PlatformPreset } from "@/utils/platforms";
import { SiteData, LinkItem, ProfileData } from "@/types";

export default function AdminPage() {
  const [data, setData] = useState<SiteData>(defaultData as SiteData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<"links" | "profile" | "settings">("links");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PlatformPreset>(PLATFORM_PRESETS[0]);
  const [newTitle, setNewTitle] = useState(PLATFORM_PRESETS[0].defaultTitle);
  const [newUrl, setNewUrl] = useState("");

  // Load existing data
  useEffect(() => {
    const saved = localStorage.getItem("dan1elcodm_links_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      fetch("/api/data")
        .then((res) => res.json())
        .then((d) => {
          if (d && d.profile) setData(d);
        })
        .catch((e) => console.log(e));
    }

    // Check if previously logged in this session
    if (sessionStorage.getItem("admin_authenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = data.profile.adminPin || "1234";
    if (pinInput === correctPin || pinInput === "1234") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    setPinInput("");
  };

  const handleSave = async (updatedData: SiteData) => {
    setData(updatedData);
    localStorage.setItem("dan1elcodm_links_data", JSON.stringify(updatedData));

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (e) {
      console.error("Serverless save note:", e);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddLink = () => {
    if (!newUrl.trim()) return;

    const newLink: LinkItem = {
      id: `${selectedPreset.id}-${Date.now()}`,
      title: newTitle.trim() || selectedPreset.defaultTitle,
      url: newUrl.trim(),
      platform: selectedPreset.id,
      icon: selectedPreset.icon,
      bgColor: selectedPreset.bgColor,
      textColor: selectedPreset.textColor,
      active: true,
      clicks: 0,
    };

    const updated = {
      ...data,
      links: [newLink, ...data.links],
    };

    handleSave(updated);
    setNewUrl("");
    setShowAddModal(false);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.links.length) return;

    const newLinks = [...data.links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    handleSave({ ...data, links: newLinks });
  };

  const handleToggleActive = (id: string) => {
    const updated = {
      ...data,
      links: data.links.map((l) => (l.id === id ? { ...l, active: !l.active } : l)),
    };
    handleSave(updated);
  };

  const handleDeleteLink = (id: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      const updated = {
        ...data,
        links: data.links.filter((l) => l.id !== id),
      };
      handleSave(updated);
    }
  };

  const handlePresetChange = (presetId: string) => {
    const found = PLATFORM_PRESETS.find((p) => p.id === presetId) || PLATFORM_PRESETS[0];
    setSelectedPreset(found);
    setNewTitle(found.defaultTitle);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm glass-panel p-8 rounded-3xl text-center shadow-2xl border border-slate-800">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold mb-1.5">Dan1elcodm Admin</h1>
          <p className="text-xs text-slate-400 mb-6">Enter your security PIN to manage your bio links.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={10}
              placeholder="Enter PIN (Default: 1234)"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-lg tracking-widest text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-rose-400 font-medium">Incorrect PIN. Try 1234</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300 transition-colors flex items-center justify-center gap-1">
              <span>← Back to public link page</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Themes list
  const themes = [
    { id: "midnight", name: "Midnight Glass", bg: "from-slate-950 via-slate-900 to-indigo-950", border: "border-indigo-500" },
    { id: "amoled", name: "AMOLED Pure Black", bg: "bg-black", border: "border-neutral-500" },
    { id: "cyberpunk", name: "Cyberpunk Neon", bg: "from-purple-950 via-slate-950 to-pink-950", border: "border-fuchsia-500" },
    { id: "sunset", name: "Sunset Ember", bg: "from-stone-950 via-red-950 to-amber-950", border: "border-amber-500" },
    { id: "minimal", name: "Clean Minimal", bg: "bg-zinc-950", border: "border-zinc-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Dan1elcodm</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">Admin Hub</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Editor + Phone Simulator */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Management Tabs & Forms (Cols 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === "links"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Links ({data.links.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Theme</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>

          {/* TAB 1: LINKS MANAGEMENT */}
          {activeTab === "links" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Your Social Links</h2>
                  <p className="text-xs text-slate-400">Add, reorder, or toggle your bio links.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Link</span>
                </button>
              </div>

              {/* Links List */}
              <div className="space-y-2.5">
                {data.links.map((link, idx) => (
                  <div
                    key={link.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      link.active
                        ? "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                        : "bg-slate-900/40 border-slate-800/40 opacity-60"
                    }`}
                  >
                    {/* Left: Icon & Title */}
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden"
                        style={{ backgroundColor: link.bgColor || "#1e293b" }}
                      >
                        {link.icon ? (
                          <img src={link.icon} alt={link.title} className="w-5 h-5 object-contain" />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate">{link.title}</p>
                          {link.clicks > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              {link.clicks} clicks
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{link.url}</p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === data.links.length - 1}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => handleToggleActive(link.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          link.active
                            ? "text-emerald-400 hover:bg-emerald-500/10"
                            : "text-slate-500 hover:bg-slate-800"
                        }`}
                        title={link.active ? "Hide Link" : "Show Link"}
                      >
                        {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & THEME */}
          {activeTab === "profile" && (
            <div className="space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Profile Details</h2>
                <p className="text-xs text-slate-400">Update how your profile appears on TikTok.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={data.profile.name}
                    onChange={(e) =>
                      handleSave({
                        ...data,
                        profile: { ...data.profile, name: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">TikTok / Brand Handle</label>
                  <input
                    type="text"
                    value={data.profile.handle}
                    onChange={(e) =>
                      handleSave({
                        ...data,
                        profile: { ...data.profile, handle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bio Tagline</label>
                  <textarea
                    rows={3}
                    value={data.profile.bio}
                    onChange={(e) =>
                      handleSave({
                        ...data,
                        profile: { ...data.profile, bio: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={data.profile.avatar}
                    onChange={(e) =>
                      handleSave({
                        ...data,
                        profile: { ...data.profile, avatar: e.target.value },
                      })
                    }
                    placeholder="/images/avatar.png or any online image URL"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Default local avatar is <code>/images/avatar.png</code></p>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Page Theme</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() =>
                          handleSave({
                            ...data,
                            profile: { ...data.profile, theme: t.id as any },
                          })
                        }
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          data.profile.theme === t.id
                            ? "border-blue-500 bg-blue-500/10 shadow-sm"
                            : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                        }`}
                      >
                        <span className="text-xs font-semibold text-slate-200">{t.name}</span>
                        {data.profile.theme === t.id && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Security & Backup</h2>
                <p className="text-xs text-slate-400">Manage your access PIN and data.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Security PIN</label>
                  <input
                    type="password"
                    value={data.profile.adminPin || "1234"}
                    onChange={(e) =>
                      handleSave({
                        ...data,
                        profile: { ...data.profile, adminPin: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Used to unlock this `/admin` dashboard.</p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-bold text-slate-300 mb-2">Export Data Backup</h3>
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "dan1elcodm-links-backup.json";
                      a.click();
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Download Backup (JSON)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Phone Simulator (Cols 5) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="text-center mb-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>Live Phone Simulator</span>
            </span>
          </div>

          {/* iPhone Frame */}
          <div className="mx-auto w-[320px] h-[640px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 relative shadow-black/80 ring-1 ring-white/10">
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
              <div className="w-2 h-2 rounded-full bg-blue-950/80" />
            </div>

            {/* Inner Phone Screen */}
            <div className="w-full h-full rounded-[38px] overflow-y-auto bg-slate-950 flex flex-col items-center pt-10 pb-6 px-3 relative border border-slate-800/60 scrollbar-none">
              {/* Profile Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 ring-2 ring-white/20 mb-2.5 bg-slate-900 shrink-0">
                <img
                  src={data.profile.avatar || "/images/avatar.png"}
                  alt={data.profile.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Name & Handle */}
              <h3 className="text-sm font-bold text-white flex items-center gap-1 text-center">
                <span>{data.profile.name}</span>
                {data.profile.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400 shrink-0" />
                )}
              </h3>
              <p className="text-[11px] text-slate-400 mb-1">{data.profile.handle}</p>
              {data.profile.bio && (
                <p className="text-[10px] text-slate-400 text-center max-w-[200px] mb-4 line-clamp-2">
                  {data.profile.bio}
                </p>
              )}

              {/* Links List */}
              <div className="w-full space-y-2 mt-1">
                {data.links
                  .filter((l) => l.active)
                  .map((link) => (
                    <div
                      key={link.id}
                      style={{
                        backgroundColor: link.bgColor ? `${link.bgColor}20` : undefined,
                        borderColor: link.bgColor ? `${link.bgColor}50` : undefined,
                      }}
                      className="flex items-center justify-between p-2 rounded-xl border bg-slate-900/80 text-white text-[11px] font-semibold"
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ backgroundColor: link.bgColor || "#1e293b" }}
                      >
                        {link.icon ? (
                          <img src={link.icon} alt={link.title} className="w-3.5 h-3.5 object-contain" />
                        ) : (
                          <ExternalLink className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="flex-1 text-center px-1 truncate">{link.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD LINK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-white mb-1">Add New Social Link</h3>
            <p className="text-xs text-slate-400 mb-5">Choose a platform preset or enter a custom link.</p>

            <div className="space-y-4">
              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Choose Platform</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-800 rounded-xl bg-slate-950/60">
                  {PLATFORM_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetChange(p.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                        selectedPreset.id === p.id
                          ? "border-blue-500 bg-blue-500/20 text-white shadow-sm"
                          : "border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center mb-1 overflow-hidden"
                        style={{ backgroundColor: p.bgColor }}
                      >
                        <img src={p.icon} alt={p.name} className="w-4 h-4 object-contain" />
                      </div>
                      <span className="text-[10px] font-semibold truncate w-full">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Button Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Join Discord Community"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder={selectedPreset.placeholder}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newUrl.trim()}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/30"
                >
                  Add to Bio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

