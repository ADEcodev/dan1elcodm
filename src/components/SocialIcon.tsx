import React from "react";

interface SocialIconProps {
  platform: string;
  className?: string;
  fallbackIcon?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = "w-6 h-6", fallbackIcon }) => {
  const norm = (platform || "").toLowerCase();

  switch (norm) {
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Authentic TikTok chromatic mark */}
          <path
            d="M17.18 8.66c1.57 1.11 3.49 1.76 5.57 1.76V6.48a4.8 4.8 0 0 1-1.17-.12v3.1c-2.08 0-4-.65-5.57-1.76v8.05c0 4.02-3.3 7.29-7.38 7.29-1.52 0-2.93-.45-4.11-1.23 1.34 1.35 3.21 2.19 5.28 2.19 4.08 0 7.38-3.26 7.38-7.29V8.66z"
            fill="#FE2C55"
          />
          <path
            d="M15.15 1.51v-.51h-4.02v15.75c-.01 1.84-1.52 3.32-3.38 3.32-.55 0-1.06-.13-1.52-.36.62.8 1.59 1.32 2.69 1.32 1.86 0 3.37-1.49 3.38-3.32V2.46c.3-.87 1.25-1.5 2.85-1.45z"
            fill="#25F4EE"
          />
          <path
            d="M16.01 7.7c1.57 1.11 3.49 1.76 5.57 1.76V6.36c-1.16-.24-2.18-.84-2.95-1.67-1.32-.82-2.27-2.16-2.55-3.73H13.17v15.75c-.01 1.84-1.52 3.32-3.38 3.32-1.1 0-2.07-.52-2.69-1.31-1.1-.55-1.86-1.68-1.86-2.98 0-1.84 1.51-3.33 3.38-3.33.36 0 .7.05 1.02.15v-3.13C5.64 11.25 2.42 14.48 2.42 18.45c0 1.98.8 3.78 2.1 5.1 1.18.78 2.59 1.23 4.11 1.23 4.08 0 7.38-3.26 7.38-7.29V7.7z"
            fill="#000000"
          />
        </svg>
      );

    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ig-grad" cx="20%" cy="105%" r="130%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect width="24" height="24" rx="6.5" fill="url(#ig-grad)" />
          <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#ffffff" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3.2" stroke="#ffffff" strokeWidth="1.6" />
          <circle cx="15.8" cy="8.2" r="0.9" fill="#ffffff" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#25D366" />
          <path
            d="M17.5 14.3c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.12-.15.22-.32.3-.5.04-.08.06-.17.05-.26 0-.09-.03-.18-.08-.26-.07-.15-.65-1.62-.91-2.2-.22-.5-.46-.5-.67-.51h-.57c-.2 0-.43.08-.66.31-.23.23-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.3 3.79 2.53 1.09 2.53.73 2.99.68.46-.04 1.49-.61 1.7-1.2.21-.59.21-1.09.15-1.2-.06-.1-.23-.17-.53-.32z"
            fill="#ffffff"
          />
        </svg>
      );

    case "snapchat":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6.5" fill="#FFFC00" />
          <path
            d="M12 4.5c-2.4 0-3.6 1.3-3.9 1.6-.5.6-.9 1.3-1.1 2.7-.1 1 0 2.1.03 2.7-.2.03-.7.1-1.2.4-.4.3-.5.6-.4 1 .1.3.4.4.6.4.2 0 .4 0 .6-.1.3-.1.7-.3 1-.3.2 0 .3.1.3.3 0 .4.4 2.1 2.9 3.5.2.1.4.3.4.6 0 .2-.1.4-.4.5-.8.4-1.3.4-1.8.7-.3.2-.2.5 0 .6.7.4 1.3.3 1.8.6.3.2.1.6.4.8.3.2 1.1 0 2.2.4.9.3 1.5 1.2 3.1 1.2s2.2-.9 3.1-1.2c1.1-.4 1.9-.2 2.2-.4.3-.2.1-.6.4-.8.5-.3 1.1-.2 1.8-.6.2-.1.3-.4 0-.6-.5-.3-1-.3-1.8-.7-.3-.1-.4-.3-.4-.5 0-.3.2-.5.4-.6 2.5-1.4 2.9-3.1 2.9-3.5 0-.2.1-.3.3-.3.3 0 .7.2 1 .3.2.1.4.1.6.1.2 0 .5-.1.6-.4.1-.4 0-.7-.4-1-.5-.3-1-.37-1.2-.4.03-.6.13-1.7.03-2.7-.2-1.4-.6-2.1-1.1-2.7-.3-.3-1.5-1.6-3.9-1.6z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
            fill="#FF0000"
          />
          <polygon points="9.545,8.432 15.818,12 9.545,15.568" fill="#ffffff" />
        </svg>
      );

    case "discord":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6.5" fill="#5865F2" />
          <path
            d="M17.5 7.5a13.3 13.3 0 0 0-3.3-1c-.1.3-.3.7-.4 1a12.3 12.3 0 0 0-3.6 0c-.1-.3-.3-.7-.4-1a13.3 13.3 0 0 0-3.3 1C4.4 10.7 3.8 13.8 4.2 16.9a13.5 13.5 0 0 0 4.1 2.1c.3-.4.6-.9.9-1.4-.7-.3-1.3-.6-1.9-1 .2-.1.3-.3.5-.4 3.7 1.7 7.7 1.7 11.4 0 .2.1.3.3.5.4-.6.4-1.2.7-1.9 1 .3.5.6 1 .9 1.4a13.5 13.5 0 0 0 4.1-2.1c.5-3.6-.3-6.7-2.3-9.4zM9.7 14.5c-.8 0-1.5-.7-1.5-1.6 0-.9.7-1.6 1.5-1.6.8 0 1.5.7 1.5 1.6 0 .9-.7 1.6-1.5 1.6zm4.6 0c-.8 0-1.5-.7-1.5-1.6 0-.9.7-1.6 1.5-1.6.8 0 1.5.7 1.5 1.6 0 .9-.7 1.6-1.5 1.6z"
            fill="#ffffff"
          />
        </svg>
      );

    case "x":
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6.5" fill="#000000" />
          <path
            d="M17.2 5.5h2.1l-4.6 5.3 5.4 7.2h-4.2l-3.3-4.3-3.8 4.3H6.7l4.9-5.6L6.4 5.5h4.3l3 4 3.5-4zm-.7 11.2h1.2L10.1 6.7H8.8l7.7 10z"
            fill="#ffffff"
          />
        </svg>
      );

    case "telegram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#229ED9" />
          <path
            d="M5.4 11.7l11.4-4.4c.5-.2 1 .1.9.7l-1.9 9.1c-.1.6-.5.8-1 .5l-2.8-2.1-1.3 1.3c-.2.2-.3.3-.6.3l.2-2.8 5.1-4.6c.2-.2 0-.3-.3-.1l-6.3 4-2.7-.9c-.6-.2-.6-.6.2-.9z"
            fill="#ffffff"
          />
        </svg>
      );

    case "spotify":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#1DB954" />
          <path
            d="M16.5 16.8c-.2 0-.4-.1-.5-.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3.8-.9 7-.5 9.6 1.1.3.2.4.5.2.8-.1.3-.3.4-.3.4zm1.1-2.4c-.2 0-.4-.1-.6-.2-2.6-1.6-6.6-2.1-9.7-1.1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.5-1.1 7.9-.5 10.9 1.3.3.2.4.6.2.9-.2.3-.4.5-.4.5zm.1-2.5c-3.1-1.8-8.3-2-11.3-1.1-.5.1-.9-.2-1.1-.6-.1-.5.2-.9.6-1.1 3.5-1.1 9.2-.8 12.8 1.3.4.2.6.7.3 1.1-.2.4-.6.6-.9.6-.1-.2-.3-.2-.4-.2z"
            fill="#000000"
          />
        </svg>
      );

    case "twitch":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6.5" fill="#9146FF" />
          <path
            d="M6 4.5h12v7.5l-3 3h-2.5l-1.5 1.5v-1.5H8v-3H6v-7.5zm7 3v3h1.5v-3H13zm-3 0v3h1.5v-3H10z"
            fill="#ffffff"
          />
        </svg>
      );

    case "kick":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6.5" fill="#53FC18" />
          <path
            d="M7 6h3v4.5l3.5-4.5h3.5l-4.5 5.5 5 6.5h-3.8L10 13.2V18H7V6z"
            fill="#000000"
          />
        </svg>
      );

    default:
      if (fallbackIcon) {
        return <img src={fallbackIcon} alt={platform} className={`${className} object-contain`} />;
      }
      return (
        <div className={`${className} bg-neutral-900 rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
          {platform.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};
