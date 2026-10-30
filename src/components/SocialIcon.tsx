import React from "react";
import {
  SiTiktok,
  SiInstagram,
  SiSnapchat,
  SiDiscord,
  SiYoutube,
  SiX,
  SiTelegram,
  SiSpotify,
  SiTwitch,
  SiKick
} from "react-icons/si";

interface SocialIconProps {
  platform: string;
  className?: string;
  fallbackIcon?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = "w-6 h-6", fallbackIcon }) => {
  const norm = (platform || "").toLowerCase();

  switch (norm) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Official WhatsApp Chat Bubble with speech pointer tail */}
          <path
            d="M.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24z"
            fill="#25D366"
          />
          {/* Inner Phone Handset */}
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            fill="#ffffff"
          />
        </svg>
      );

    case "tiktok":
      return <SiTiktok className={`${className} text-black shrink-0`} />;

    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ig-grad-official" cx="20%" cy="105%" r="130%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect width="24" height="24" rx="6.5" fill="url(#ig-grad-official)" />
          <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#ffffff" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3.2" stroke="#ffffff" strokeWidth="1.6" />
          <circle cx="15.8" cy="8.2" r="0.9" fill="#ffffff" />
        </svg>
      );

    case "snapchat":
      return (
        <div className={`${className} bg-[#FFFC00] rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden`}>
          <SiSnapchat className="w-full h-full text-black" />
        </div>
      );

    case "youtube":
      return <SiYoutube className={`${className} text-[#FF0000] shrink-0`} />;

    case "discord":
      return <SiDiscord className={`${className} text-[#5865F2] shrink-0`} />;

    case "x":
    case "twitter":
      return <SiX className={`${className} text-black shrink-0`} />;

    case "telegram":
      return <SiTelegram className={`${className} text-[#229ED9] shrink-0`} />;

    case "spotify":
      return <SiSpotify className={`${className} text-[#1DB954] shrink-0`} />;

    case "twitch":
      return <SiTwitch className={`${className} text-[#9146FF] shrink-0`} />;

    case "kick":
      return <SiKick className={`${className} text-[#53FC18] shrink-0`} />;

    default:
      if (fallbackIcon) {
        return <img src={fallbackIcon} alt={platform} className={`${className} object-contain`} />;
      }
      return (
        <div className={`${className} bg-black rounded-xl flex items-center justify-center text-white text-xs font-bold`}>
          {platform.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};
