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
    icon: "/images/designbolts_icons/whatsapp.png",
    bgColor: "#25D366",
    textColor: "#ffffff",
    placeholder: "https://chat.whatsapp.com/...",
    defaultTitle: "Join My WhatsApp Community",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "/images/designbolts_icons/tiktok.png",
    bgColor: "#000000",
    textColor: "#ffffff",
    placeholder: "https://www.tiktok.com/@...",
    defaultTitle: "Follow Me on TikTok",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/images/designbolts_icons/instagram.png",
    bgColor: "#E1306C",
    textColor: "#ffffff",
    placeholder: "https://www.instagram.com/...",
    defaultTitle: "Follow Me on Instagram",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: "/images/designbolts_icons/snapchat.png",
    bgColor: "#FFFC00",
    textColor: "#000000",
    placeholder: "https://www.snapchat.com/add/...",
    defaultTitle: "Add Me on Snapchat",
  },
  {
    id: "discord",
    name: "Discord Server",
    icon: "/images/designbolts_icons/discord.png",
    bgColor: "#5865F2",
    textColor: "#ffffff",
    placeholder: "https://discord.gg/...",
    defaultTitle: "Join My Discord Server",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "/images/designbolts_icons/youtube.png",
    bgColor: "#FF0000",
    textColor: "#ffffff",
    placeholder: "https://www.youtube.com/@...",
    defaultTitle: "Subscribe to My YouTube",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "/images/designbolts_icons/telegram.png",
    bgColor: "#229ED9",
    textColor: "#ffffff",
    placeholder: "https://t.me/...",
    defaultTitle: "Join My Telegram Channel",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: "/images/designbolts_icons/twitter.png",
    bgColor: "#000000",
    textColor: "#ffffff",
    placeholder: "https://twitter.com/...",
    defaultTitle: "Follow Me on Twitter",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: "/images/designbolts_icons/reddit.png",
    bgColor: "#FF4500",
    textColor: "#ffffff",
    placeholder: "https://reddit.com/r/...",
    defaultTitle: "Join My Subreddit",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "/images/designbolts_icons/facebook.png",
    bgColor: "#1877F2",
    textColor: "#ffffff",
    placeholder: "https://facebook.com/...",
    defaultTitle: "Follow on Facebook",
  },
];
