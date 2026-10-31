import React from "react";
import { Mail } from "lucide-react";

interface SocialIconProps {
  platform: string;
  className?: string;
  fallbackIcon?: string;
}

const DESIGNBOLTS_MAP: Record<string, string> = {
  whatsapp: "/images/designbolts_icons/whatsapp.png",
  tiktok: "/images/designbolts_icons/tiktok.png",
  instagram: "/images/designbolts_icons/instagram.png",
  snapchat: "/images/designbolts_icons/snapchat.png",
  youtube: "/images/designbolts_icons/youtube.png",
  discord: "/images/designbolts_icons/discord.png",
  twitter: "/images/designbolts_icons/twitter.png",
  x: "/images/designbolts_icons/twitter.png",
  telegram: "/images/designbolts_icons/telegram.png",
  reddit: "/images/designbolts_icons/reddit.png",
  facebook: "/images/designbolts_icons/facebook.png",
  linkedin: "/images/designbolts_icons/linkedin.png",
  pinterest: "/images/designbolts_icons/pinterest.png",
  line: "/images/designbolts_icons/line.png",
  signal: "/images/designbolts_icons/signal.png",
  dribbble: "/images/designbolts_icons/dribbble.png",
  behance: "/images/designbolts_icons/behance.png",
  tumblr: "/images/designbolts_icons/tumblr.png",
  deviantart: "/images/designbolts_icons/deviantart.png",
  wechat: "/images/designbolts_icons/wechat.png",
  vk: "/images/designbolts_icons/vk.png",
};

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = "w-6 h-6", fallbackIcon }) => {
  const norm = (platform || "").toLowerCase();

  if (norm === "email" || norm === "business" || norm === "contact") {
    return (
      <div className={`${className} bg-black rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs`}>
        <Mail className="w-1/2 h-1/2 text-white stroke-[2.2]" />
      </div>
    );
  }

  const iconSrc = DESIGNBOLTS_MAP[norm] || fallbackIcon;

  if (iconSrc) {
    return (
      <img
        src={iconSrc}
        alt={platform}
        className={`${className} object-contain shrink-0`}
        loading="eager"
      />
    );
  }

  return (
    <div className={`${className} bg-black rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {platform.slice(0, 2).toUpperCase()}
    </div>
  );
};
