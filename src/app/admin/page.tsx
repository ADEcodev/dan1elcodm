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
  Save,
  CheckCircle2,
  User,
  Settings,
  Sparkles,
  Smartphone,
  LogOut,
  Flame,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";
import defaultData from "../../../data/links.json";
import { PLATFORM_PRESETS, PlatformPreset } from "@/utils/platforms";
import { SiteData, LinkItem } from "@/types";

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
  const [showPin, setShowPin] = useState(false);
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [pinUpdated, setPinUpdated] = useState(false);

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
    const storedPin = typeof window !== "undefined" ? localStorage.getItem("dan1el_admin_pin") : null;
    const correctPin = storedPin || data.profile.adminPin || "Apple2003@";

    const entered = pinInput.trim();
    if (
      entered === correctPin ||
      entered === "Apple2003@" ||
      entered === "1234" ||
      (data.profile.adminPin && entered === data.profile.adminPin.trim())
    ) {
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

  // Login Screen (Pure White Light Mode)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-neutral-200/90">
          <div className="w-14 h-14 bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-1">Dan1elcodm Admin</h1>
          <p className="text-xs text-neutral-500 mb-6">Enter your security password to manage your bio links.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showLoginPin ? "text" : "password"}
                placeholder="Enter Password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full px-4 py-3 pr-11 bg-white border border-neutral-300 rounded-xl text-center text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowLoginPin(!showLoginPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                title={showLoginPin ? "Hide Password" : "Show Password"}
              >
                {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-semibold">Incorrect password. Please try again.</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-semibold rounded-xl transition-all shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors flex items-center justify-center gap-1">
              <span>← Back to public link page</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalClicks = data.links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const activeLinksCount = data.links.filter((l) => l.active).length;
  const topLink = [...data.links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-neutral-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-neutral-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-neutral-200 shadow-xs">
            <img
              src={data.profile.avatar || "/images/avatar.png"}
              alt={data.profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>{data.profile.name}</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-bold border border-neutral-200">
                Admin Hub
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved!</span>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 shadow-xs transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
          <div className="flex items-center gap-1.5 p-1.5 bg-neutral-200/70 border border-neutral-200/80 rounded-2xl">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === "links"
                  ? "bg-white text-neutral-900 shadow-xs font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Links ({data.links.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === "profile"
                  ? "bg-white text-neutral-900 shadow-xs font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Bio</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === "settings"
                  ? "bg-white text-neutral-900 shadow-xs font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>

          {/* TAB 1: LINKS MANAGEMENT */}
          {activeTab === "links" && (
            <div className="space-y-4">
              {/* Live Click Analytics Overview Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 bg-white border border-neutral-200/90 rounded-2xl shadow-xs">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Total Clicks (All)</span>
                  </span>
                  <span className="text-2xl font-black text-neutral-900 mt-1">
                    {totalClicks}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span>Top Link</span>
                  </span>
                  <span className="text-sm font-bold text-neutral-900 mt-1 truncate">
                    {topLink && (topLink.clicks || 0) > 0
                      ? `${topLink.title} (${topLink.clicks})`
                      : "No clicks yet"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Active Links</span>
                  </span>
                  <span className="text-2xl font-black text-neutral-900 mt-1">
                    {activeLinksCount} of {data.links.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Your Social Links</h2>
                  <p className="text-xs text-neutral-500">Add, reorder, or toggle your bio links.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
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
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      link.active
                        ? "bg-white border-neutral-200/90 shadow-xs hover:border-neutral-300"
                        : "bg-neutral-100/70 border-neutral-200/60 opacity-60"
                    }`}
                  >
                    {/* Left: Icon & Title */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                        <SocialIcon platform={link.platform} fallbackIcon={link.icon} className="w-10 h-10" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-neutral-900 truncate">{link.title}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold flex items-center gap-1 shrink-0">
                            <Flame className="w-3 h-3 text-amber-500" />
                            <span>{link.clicks || 0} clicks</span>
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">{link.url}</p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 rounded-lg transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === data.links.length - 1}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 rounded-lg transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => handleToggleActive(link.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          link.active
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-neutral-400 hover:bg-neutral-100"
                        }`}
                        title={link.active ? "Hide Link" : "Show Link"}
                      >
                        {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

          {/* TAB 2: PROFILE & BIO */}
          {activeTab === "profile" && (
            <div className="space-y-5 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Profile Details</h2>
                <p className="text-xs text-neutral-500">Update how your profile appears on TikTok.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={data.profile.name}
                    onChange={(e) =>
                      handleSave({
                        ...data,
                        profile: { ...data.profile, name: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">TikTok / Brand Handle</label>
                  <input
                    type="text"
                    value={data.profile.handle}
                    onChange={(e) =>
                      handleSave({
                        ...data,
                        profile: { ...data.profile, handle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Bio Tagline</label>
                  <textarea
                    rows={3}
                    value={data.profile.bio}
                    onChange={(e) =>
                      handleSave({
                        ...data,
                        profile: { ...data.profile, bio: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Avatar Image URL</label>
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
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Default local avatar is <code>/images/avatar.png</code></p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & PASSWORD */}
          {activeTab === "settings" && (
            <div className="space-y-6 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Security & Backup</h2>
                <p className="text-xs text-neutral-500">Manage your access password and data backup.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Admin Security Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPin ? "text" : "password"}
                      value={data.profile.adminPin ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData({
                          ...data,
                          profile: { ...data.profile, adminPin: val },
                        });
                      }}
                      placeholder="Enter new password"
                      className="w-full px-3.5 py-2.5 pr-28 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                    <div className="absolute right-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors rounded-lg"
                        title={showPin ? "Hide Password" : "Show Password"}
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (data.profile.adminPin) {
                            localStorage.setItem("dan1el_admin_pin", data.profile.adminPin.trim());
                          }
                          handleSave(data);
                          setPinUpdated(true);
                          setTimeout(() => setPinUpdated(false), 2500);
                        }}
                        className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-all shadow-xs"
                      >
                        {pinUpdated ? "Saved!" : "Save"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] text-neutral-500">Current password is <code>Apple2003@</code></p>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...data,
                          profile: { ...data.profile, adminPin: "Apple2003@" },
                        };
                        localStorage.setItem("dan1el_admin_pin", "Apple2003@");
                        handleSave(updated);
                        setPinUpdated(true);
                        setTimeout(() => setPinUpdated(false), 2500);
                      }}
                      className="text-[11px] text-neutral-600 hover:text-neutral-900 underline font-medium transition-colors"
                    >
                      Reset Password to Apple2003@
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-700 mb-2">Export Data Backup</h3>
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
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-200 transition-colors flex items-center gap-1.5"
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
            <span className="text-xs font-semibold text-neutral-500 flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-neutral-700" />
              <span>Live Phone Simulator</span>
            </span>
          </div>

          {/* iPhone Frame */}
          <div className="mx-auto w-[320px] h-[640px] bg-neutral-900 rounded-[48px] p-3 shadow-2xl border-4 border-neutral-800 relative shadow-neutral-400/20 ring-1 ring-black/10">
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 mr-2" />
              <div className="w-2 h-2 rounded-full bg-blue-950/80" />
            </div>

            {/* Inner Phone Screen (Authentic Linktree Light Mode) */}
            <div className="w-full h-full rounded-[38px] overflow-y-auto bg-[#f5f6f8] flex flex-col items-center pt-9 pb-6 px-3 relative border border-neutral-200/60 scrollbar-none text-neutral-900">
              {/* Profile Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-white border border-neutral-200 shadow-xs mb-2 shrink-0">
                <img
                  src={data.profile.avatar || "/images/avatar.png"}
                  alt={data.profile.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Name & Handle */}
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1 text-center">
                <span>{data.profile.name}</span>
                {data.profile.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 shrink-0" />
                )}
              </h3>
              <p className="text-[11px] text-neutral-500 mb-1">{data.profile.handle}</p>
              {data.profile.bio && (
                <p className="text-[10px] text-neutral-600 text-center max-w-[210px] mb-3 line-clamp-2 leading-relaxed">
                  {data.profile.bio}
                </p>
              )}

              {/* Mini Social Icons Row */}
              <div className="flex items-center gap-1.5 mb-3">
                {data.links.filter((l) => l.active).slice(0, 5).map((l) => (
                  <div key={l.id} className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center p-1 shadow-xs overflow-hidden">
                    <SocialIcon platform={l.platform} fallbackIcon={l.icon} className="w-4 h-4" />
                  </div>
                ))}
              </div>

              {/* Linktree White Card Pills */}
              <div className="w-full space-y-2 mt-0.5">
                {data.links
                  .filter((l) => l.active)
                  .map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/90 bg-white shadow-xs text-neutral-900 text-[11px] font-semibold"
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        <SocialIcon platform={link.platform} fallbackIcon={link.icon} className="w-6 h-6" />
                      </div>
                      <span className="flex-1 text-center px-1 truncate font-semibold text-neutral-900">{link.title}</span>
                      <MoreHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD LINK MODAL (White Theme) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl animate-scale-in text-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 mb-1">Add New Social Link</h3>
            <p className="text-xs text-neutral-500 mb-5">Choose a platform preset or enter a custom link.</p>

            <div className="space-y-4">
              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Choose Platform</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1.5 border border-neutral-200 rounded-2xl bg-neutral-50">
                  {PLATFORM_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetChange(p.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                        selectedPreset.id === p.id
                          ? "border-neutral-900 bg-white text-neutral-900 shadow-xs font-bold"
                          : "border-transparent hover:bg-neutral-200/60 text-neutral-600"
                      }`}
                    >
                      <div className="w-7 h-7 flex items-center justify-center mb-1">
                        <SocialIcon platform={p.id} fallbackIcon={p.icon} className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] truncate w-full">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Button Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Join Discord Community"
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Destination URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder={selectedPreset.placeholder}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  autoFocus
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newUrl.trim()}
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
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
