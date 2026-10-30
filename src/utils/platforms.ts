export interface PlatformPreset {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  textColor: string;
  placeholder: string;
  defaultTitle: string;
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Community",
    icon: "/images/icons/whatsapp.svg",
    bgColor: "#25D366",
    textColor: "#ffffff",
    placeholder: "https://chat.whatsapp.com/...",
    defaultTitle: "Join My WhatsApp Community",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "/images/icons/tiktok.svg",
    bgColor: "#000000",
    textColor: "#ffffff",
    placeholder: "https://www.tiktok.com/@...",
    defaultTitle: "Follow Me on TikTok",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/images/icons/instagram.svg",
    bgColor: "#E1306C",
    textColor: "#ffffff",
    placeholder: "https://www.instagram.com/...",
    defaultTitle: "Follow Me on Instagram",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: "/images/icons/snapchat.svg",
    bgColor: "#FFFC00",
    textColor: "#000000",
    placeholder: "https://www.snapchat.com/add/...",
    defaultTitle: "Add Me on Snapchat",
  },
  {
    id: "discord",
    name: "Discord Server",
    icon: "/images/icons/discord.svg",
    bgColor: "#5865F2",
    textColor: "#ffffff",
    placeholder: "https://discord.gg/...",
    defaultTitle: "Join My Discord Server",
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: "/images/icons/twitch.svg",
    bgColor: "#9146FF",
    textColor: "#ffffff",
    placeholder: "https://twitch.tv/...",
    defaultTitle: "Watch Me on Twitch",
  },
  {
    id: "kick",
    name: "Kick",
    icon: "/images/icons/kick.svg",
    bgColor: "#53FC18",
    textColor: "#000000",
    placeholder: "https://kick.com/...",
    defaultTitle: "Watch Me on Kick",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "/images/icons/youtube.svg",
    bgColor: "#FF0000",
    textColor: "#ffffff",
    placeholder: "https://www.youtube.com/@...",
    defaultTitle: "Subscribe to My YouTube",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "/images/icons/telegram.svg",
    bgColor: "#229ED9",
    textColor: "#ffffff",
    placeholder: "https://t.me/...",
    defaultTitle: "Join My Telegram Channel",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "/images/icons/spotify.svg",
    bgColor: "#1DB954",
    textColor: "#000000",
    placeholder: "https://open.spotify.com/...",
    defaultTitle: "Listen on Spotify",
  },
  {
    id: "x",
    name: "X / Twitter",
    icon: "/images/icons/x.svg",
    bgColor: "#000000",
    textColor: "#ffffff",
    placeholder: "https://x.com/...",
    defaultTitle: "Follow on X",
  },
  {
    id: "generic",
    name: "Custom Website / Store",
    icon: "/images/icons/generic-website.svg",
    bgColor: "#1E293B",
    textColor: "#ffffff",
    placeholder: "https://...",
    defaultTitle: "Visit My Website",
  },
];

