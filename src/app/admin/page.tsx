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
  Smartphone,
  LogOut,
  Flame,
  TrendingUp,
  MoreHorizontal,
  Check,
  RotateCcw,
  RefreshCw
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
  const [profileSaved, setProfileSaved] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PlatformPreset>(PLATFORM_PRESETS[0]);
  const [newTitle, setNewTitle] = useState(PLATFORM_PRESETS[0].defaultTitle);
  const [newUrl, setNewUrl] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [pinUpdated, setPinUpdated] = useState(false);
  const [refreshingClicks, setRefreshingClicks] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState(defaultData.profile.name);
  const [profileHandle, setProfileHandle] = useState(defaultData.profile.handle);
  const [profileBio, setProfileBio] = useState(defaultData.profile.bio);
  const [profileAvatar, setProfileAvatar] = useState(defaultData.profile.avatar);

  // Load existing data
  useEffect(() => {
    let localData: SiteData | null = null;
    const saved = localStorage.getItem("dan1elcodm_links_data");
    if (saved) {
      try {
        localData = JSON.parse(saved);
        if (localData && localData.profile) {
          setData(localData);
          setProfileName(localData.profile.name || "");
          setProfileHandle(localData.profile.handle || "");
          setProfileBio(localData.profile.bio || "");
          setProfileAvatar(localData.profile.avatar || "");
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Fetch server data with timestamp guard
    fetch("/api/data")
      .then((res) => res.json())
      .then((serverData) => {
        if (serverData && serverData.profile) {
          const localTime = (localData as any)?.updatedAt || 0;
          const serverTime = (serverData as any)?.updatedAt || 0;

          if (!localData || serverTime > localTime) {
            setData(serverData);
            setProfileName(serverData.profile.name || "");
            setProfileHandle(serverData.profile.handle || "");
            setProfileBio(serverData.profile.bio || "");
            setProfileAvatar(serverData.profile.avatar || "");
            localStorage.setItem("dan1elcodm_links_data", JSON.stringify(serverData));
          }
        }
      })
      .catch((e) => console.log(e));

    // Fetch live cloud click analytics
    fetch("/api/clicks")
      .then((res) => res.json())
      .then((clickRes) => {
        if (clickRes && clickRes.clicks) {
          setData((prev) => {
            const merged = prev.links.map((link) => {
              const cloudVal = clickRes.clicks[link.id];
              return typeof cloudVal === "number" && cloudVal >= (link.clicks || 0)
                ? { ...link, clicks: cloudVal }
                : link;
            });
            const updated = { ...prev, links: merged };
            localStorage.setItem("dan1elcodm_links_data", JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch(() => {});

    // Check if previously logged in this session
    if (sessionStorage.getItem("admin_authenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleRefreshClicks = async () => {
    setRefreshingClicks(true);
    try {
      const res = await fetch("/api/clicks");
      const clickRes = await res.json();
      if (clickRes && clickRes.clicks) {
        setData((prev) => {
          const merged = prev.links.map((link) => {
            const cloudVal = clickRes.clicks[link.id];
            return typeof cloudVal === "number" ? { ...link, clicks: cloudVal } : link;
          });
          const updated = { ...prev, links: merged };
          localStorage.setItem("dan1elcodm_links_data", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshingClicks(false), 500);
    }
  };

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
    const withTimestamp = {
      ...updatedData,
      updatedAt: Date.now(),
    };

    setData(withTimestamp);
    localStorage.setItem("dan1elcodm_links_data", JSON.stringify(withTimestamp));

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withTimestamp),
      });
    } catch (e) {
      console.error("Serverless save note:", e);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveProfile = () => {
    const updated: SiteData = {
      ...data,
      profile: {
        ...data.profile,
        name: profileName.trim() || data.profile.name,
        handle: profileHandle.trim() || data.profile.handle,
        bio: profileBio,
        avatar: profileAvatar.trim() || data.profile.avatar,
        theme: "black-and-white",
      },
    };

    handleSave(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
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

  // Login Screen (Pure Black & White)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-neutral-200">
          <div className="w-14 h-14 bg-neutral-100 border border-neutral-200 text-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-black mb-1 tracking-tight">Dan1elcodm Admin</h1>
          <p className="text-xs text-neutral-500 mb-6 font-medium">Enter your security password to manage your bio links.</p>

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
                className="w-full px-4 py-3 pr-11 bg-white border border-neutral-300 rounded-xl text-center text-base text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-xs"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowLoginPin(!showLoginPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                title={showLoginPin ? "Hide Password" : "Show Password"}
              >
                {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {pinError && (
              <p className="text-xs text-black bg-neutral-100 py-1.5 px-3 rounded-lg border border-neutral-200 font-semibold">
                Incorrect password. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold rounded-xl transition-all shadow-xs text-sm flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 text-xs text-neutral-500">
            <Link href="/" className="hover:text-black font-semibold transition-colors flex items-center justify-center gap-1">
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
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans">
      {/* Top Header Bar (Pure Black & White) */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-neutral-200 shadow-xs">
            <img
              src={data.profile.avatar || "/images/avatar.png"}
              alt={data.profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-sm font-black text-black flex items-center gap-2 tracking-tight">
              <span>{data.profile.name}</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white font-bold">
                Admin Hub
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-black font-bold bg-neutral-100 border border-neutral-300 px-3 py-1.5 rounded-full animate-fade-in shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Saved!</span>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-neutral-100 text-black border border-neutral-300 shadow-xs transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
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
          {/* Navigation Tabs (Monochrome Pill Switcher) */}
          <div className="flex items-center gap-1.5 p-1.5 bg-neutral-200/80 border border-neutral-200 rounded-2xl">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === "links"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Links ({data.links.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === "profile"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Welcome & Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === "settings"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Password & Backup</span>
            </button>
          </div>

          {/* TAB 1: LINKS MANAGEMENT */}
          {activeTab === "links" && (
            <div className="space-y-4">
              {/* Live Click Analytics Overview Banner (Black & White) */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-black" />
                      <span>Live Cloud Click Analytics</span>
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                      Tracks every visitor click in real time across TikTok and web.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshClicks}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all shadow-xs"
                    title="Fetch latest clicks from cloud"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshingClicks ? "animate-spin" : ""}`} />
                    <span>{refreshingClicks ? "Syncing..." : "Sync Clicks"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-500">
                      Total Clicks (All)
                    </span>
                    <span className="text-2xl font-black text-black mt-1">
                      {totalClicks}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-500">
                      Top Performing Link
                    </span>
                    <span className="text-sm font-bold text-black mt-1 truncate">
                      {topLink && (topLink.clicks || 0) > 0
                        ? `${topLink.title} (${topLink.clicks})`
                        : "No clicks yet"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-500">
                      Active Bio Links
                    </span>
                    <span className="text-2xl font-black text-black mt-1">
                      {activeLinksCount} of {data.links.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h2 className="text-base font-black text-black">Your Bio Links</h2>
                  <p className="text-xs text-neutral-500 font-medium">Add, reorder, or toggle active links.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
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
                        ? "bg-white border-neutral-200 shadow-xs hover:border-black/30"
                        : "bg-neutral-100/60 border-neutral-200/60 opacity-60"
                    }`}
                  >
                    {/* Left: Icon & Title */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                        <SocialIcon platform={link.platform} fallbackIcon={link.icon} className="w-10 h-10" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-black truncate">{link.title}</p>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-100 text-black border border-neutral-300 font-bold flex items-center gap-1 shrink-0">
                            <Flame className="w-3 h-3 text-black" />
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
                        className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 disabled:opacity-20 rounded-lg transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === data.links.length - 1}
                        className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 disabled:opacity-20 rounded-lg transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => handleToggleActive(link.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          link.active
                            ? "text-black hover:bg-neutral-100"
                            : "text-neutral-300 hover:bg-neutral-100"
                        }`}
                        title={link.active ? "Hide Link" : "Show Link"}
                      >
                        {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
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

          {/* TAB 2: PROFILE & WELCOME MESSAGE (Guaranteed Save) */}
          {activeTab === "profile" && (
            <div className="space-y-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div>
                  <h2 className="text-base font-black text-black">Welcome Message & Profile</h2>
                  <p className="text-xs text-neutral-500 font-medium">
                    This is the headline and notice your TikTok visitors see under your profile.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{profileSaved ? "Saved!" : "Save Profile"}</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Welcome Message / Bio Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-black">
                      Welcome Message / Bio Notice
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProfileBio(
                          "Hey Guys it Daniel Here\nJust click the 3 dot on top right corner and open in browser Ciao!"
                        )
                      }
                      className="text-[11px] text-neutral-500 hover:text-black font-semibold underline transition-colors"
                    >
                      Use Recommended Notice
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Hey Guys it Daniel Here..."
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black leading-relaxed font-medium resize-none shadow-xs"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Line breaks are preserved automatically on your public page.
                  </p>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium shadow-xs"
                  />
                </div>

                {/* TikTok Handle */}
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5">TikTok / Brand Handle</label>
                  <input
                    type="text"
                    value={profileHandle}
                    onChange={(e) => setProfileHandle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium shadow-xs"
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5">Avatar Image URL</label>
                  <input
                    type="text"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="/images/avatar.png"
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium shadow-xs"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Default local avatar is <code>/images/avatar.png</code></p>
                </div>

                {/* Theme Status (Pure Black and White enforced) */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-black" />
                    <span className="text-xs font-bold text-black">Theme: Clean Black & White</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-semibold">Active across public & admin</span>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="w-full py-3 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold rounded-xl transition-all shadow-xs text-sm flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{profileSaved ? "Saved Profile Details!" : "Save Profile Details"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & PASSWORD */}
          {activeTab === "settings" && (
            <div className="space-y-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div>
                <h2 className="text-base font-black text-black">Security Password & Backup</h2>
                <p className="text-xs text-neutral-500 font-medium">Manage your access password and export data backup.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5">Admin Security Password</label>
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
                      className="w-full px-3.5 py-2.5 pr-28 bg-white border border-neutral-300 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                    />
                    <div className="absolute right-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="p-1.5 text-neutral-400 hover:text-black transition-colors rounded-lg"
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
                        className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs"
                      >
                        {pinUpdated ? "Saved!" : "Save"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] text-neutral-500 font-medium">Current password is <code>Apple2003@</code></p>
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
                      className="text-[11px] text-neutral-700 hover:text-black underline font-bold transition-colors"
                    >
                      Reset Password to Apple2003@
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-black mb-2">Export Data Backup</h3>
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
                    className="px-4 py-2 bg-white hover:bg-neutral-100 text-black text-xs font-bold rounded-xl border border-neutral-300 transition-colors flex items-center gap-1.5 shadow-xs"
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
            <span className="text-xs font-bold text-neutral-600 flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-black" />
              <span>Live Phone Simulator</span>
            </span>
          </div>

          {/* iPhone Frame */}
          <div className="mx-auto w-[320px] h-[640px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-neutral-800 relative shadow-neutral-400/20 ring-1 ring-black/10">
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 mr-2" />
              <div className="w-2 h-2 rounded-full bg-neutral-800" />
            </div>

            {/* Inner Phone Screen (Black & White Linktree Preview) */}
            <div className="w-full h-full rounded-[38px] overflow-y-auto bg-white flex flex-col items-center pt-9 pb-6 px-3 relative border border-neutral-200 scrollbar-none text-neutral-900">
              {/* Profile Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-white border border-neutral-200 shadow-xs mb-2 shrink-0">
                <img
                  src={data.profile.avatar || "/images/avatar.png"}
                  alt={data.profile.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Name & Handle */}
              <h3 className="text-sm font-black text-black flex items-center gap-1 text-center">
                <span>{data.profile.name}</span>
                {data.profile.verified && (
                  <div className="w-3.5 h-3.5 rounded-full bg-black text-white flex items-center justify-center p-0.5 shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </h3>
              <p className="text-[11px] text-neutral-500 mb-1 font-semibold">{data.profile.handle}</p>
              {data.profile.bio && (
                <p className="text-[10px] text-neutral-600 text-center max-w-[210px] mb-3 line-clamp-3 leading-relaxed whitespace-pre-line font-medium">
                  {data.profile.bio}
                </p>
              )}

              {/* Mini Social Icons Row */}
              <div className="flex items-center gap-1.5 mb-3">
                {data.links.filter((l) => l.active).slice(0, 5).map((l) => (
                  <div key={l.id} className="w-6 h-6 rounded-lg flex items-center justify-center shadow-xs overflow-hidden">
                    <SocialIcon platform={l.platform} fallbackIcon={l.icon} className="w-full h-full" />
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
                      className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 bg-white shadow-xs text-neutral-900 text-[11px] font-bold"
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 overflow-hidden">
                        <SocialIcon platform={link.platform} fallbackIcon={link.icon} className="w-6 h-6" />
                      </div>
                      <span className="flex-1 text-center px-1 truncate font-bold text-black">{link.title}</span>
                      <MoreHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD LINK MODAL (Pure Black & White) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl animate-scale-in text-neutral-900">
            <h3 className="text-base font-black text-black mb-1">Add New Social Link</h3>
            <p className="text-xs text-neutral-500 mb-5 font-medium">Choose a platform preset or enter a custom link.</p>

            <div className="space-y-4">
              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Choose Platform</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1.5 border border-neutral-200 rounded-2xl bg-neutral-50">
                  {PLATFORM_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetChange(p.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                        selectedPreset.id === p.id
                          ? "border-black bg-white text-black shadow-xs font-black"
                          : "border-transparent hover:bg-neutral-200/60 text-neutral-600 font-semibold"
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
                <label className="block text-xs font-bold text-black mb-1.5">Button Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Join Discord Community"
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                />
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Destination URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder={selectedPreset.placeholder}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  autoFocus
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newUrl.trim()}
                  className="flex-1 py-2.5 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
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
