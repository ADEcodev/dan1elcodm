import React from "react";

interface SocialIconProps {
  platform: string;
  className?: string;
  fallbackIcon?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = "w-5 h-5", fallbackIcon }) => {
  const norm = (platform || "").toLowerCase();

  switch (norm) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#25D366" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.5 14.38c-.28-.14-1.63-.8-1.89-.89-.25-.09-.44-.14-.62.14-.19.28-.72.89-.88 1.08-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.24-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .14.19 2.03 3.1 4.93 4.35.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.56-.09 1.63-.67 1.86-1.31.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32z"
            fill="#ffffff"
          />
        </svg>
      );

    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#000000" />
          <path
            d="M16.8 7.5a4.7 4.7 0 0 0 2.7.9V5.6c-.9-.1-1.8-.5-2.4-1.2-.5-.5-.8-1.2-.9-1.9H13.7v12.2a2.4 2.4 0 1 1-2.4-2.4c.3 0 .7.1 1 .2V9.8a5.1 5.1 0 0 0-1-.1c-2.8 0-5.1 2.3-5.1 5.1s2.3 5.1 5.1 5.1 5.1-2.3 5.1-5.1V9.7a7.2 7.2 0 0 0 4.1 1.3V8.2a4.6 4.6 0 0 1-3.7-.7z"
            fill="#ffffff"
          />
        </svg>
      );

    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 7a5 5 0 0 0-5 5v0a5 5 0 0 0 5 5 5 5 0 0 0 5-5v0a5 5 0 0 0-5-5zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm4.8-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM12 4.4c2.5 0 2.8 0 3.7.1 1 .04 1.5.2 1.9.36.5.2.9.44 1.3.84.4.4.64.8.84 1.3.16.4.32.9.36 1.9.05.9.06 1.2.06 3.7s0 2.8-.06 3.7c-.04 1-.2 1.5-.36 1.9-.2.5-.44.9-.84 1.3-.4.4-.8.64-1.3.84-.4.16-.9.32-1.9.36-.9.05-1.2.06-3.7.06s-2.8 0-3.7-.06c-1-.04-1.5-.2-1.9-.36a3.5 3.5 0 0 1-1.3-.84 3.5 3.5 0 0 1-.84-1.3c-.16-.4-.32-.9-.36-1.9-.05-.9-.06-1.2-.06-3.7s0-2.8.06-3.7c.04-1 .2-1.5.36-1.9.2-.5.44-.9.84-1.3.4-.4.8-.64 1.3-.84.4-.16.9-.32 1.9-.36.9-.05 1.2-.06 3.7-.06z"
            fill="#ffffff"
          />
        </svg>
      );

    case "snapchat":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#FFFC00" />
          <path
            d="M12 4.5c-2.3 0-3.8 1.6-4 3.4-.1 1.2 0 2.4.1 3.2-.2 0-.8.2-1.3.4-.3.1-.4.4-.2.7.2.3.8.7 1.4.9-.1.6-.4 1.8-1.8 2.6-.4.2-.3.6.1.7.9.3 1.7.2 2.2.8.3.4.7 1.3 2.1 1.3 1.3 0 1.8-.9 2.1-1.3.5-.6 1.3-.5 2.2-.8.4-.1.5-.5.1-.7-1.4-.8-1.7-2-1.8-2.6.6-.2 1.2-.6 1.4-.9.2-.3.1-.6-.2-.7-.5-.2-1.1-.4-1.3-.4.1-.8.2-2 .1-3.2-.2-1.8-1.7-3.4-4-3.4z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "discord":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#5865F2" />
          <path
            d="M16.5 6.5s-.8-.7-1.8-.9c-.1.2-.2.5-.3.7-1-.1-2.2-.1-3.2 0-.1-.2-.2-.5-.3-.7-1 .2-1.8.9-1.8.9-1.6 2.5-2 4.9-1.8 7.3 1 .8 2.1 1.3 3.1 1.3.3-.3.5-.7.7-1-.6-.2-1.1-.5-1.6-.9.1.1.3.2.4.3 1.3.6 2.7.9 4.1.9s2.8-.3 4.1-.9c.1-.1.3-.2.4-.3-.5.4-1 .7-1.6.9.2.3.4.7.7 1 1 0 2.1-.5 3.1-1.3.2-2.4-.2-4.8-1.8-7.3zm-6.2 6.1c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3zm3.4 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3z"
            fill="#ffffff"
          />
        </svg>
      );

    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#FF0000" />
          <path d="M10 15l5-3-5-3v6z" fill="#ffffff" />
        </svg>
      );

    case "twitch":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#9146FF" />
          <path
            d="M6 5.5v11h3v2h2l2-2h2.5l3.5-3.5v-7.5H6zm10 6.5l-2 2h-2.5l-2 2v-2H8v-7h8v5zm-4.5-3.5h1.5v3.5h-1.5V8.5zm3.5 0h1.5v3.5H15V8.5z"
            fill="#ffffff"
          />
        </svg>
      );

    case "kick":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#53FC18" />
          <path d="M7 6h3v4.5l3.5-4.5h3.5l-4 5 4.5 7h-3.5L10 13v5H7V6z" fill="#000000" />
        </svg>
      );

    case "telegram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#229ED9" />
          <path
            d="M17.5 7L5.5 11.5l3.5 1.5 1.5 4.5 2-2 3.5 2.5 1.5-11z"
            fill="#ffffff"
          />
        </svg>
      );

    case "x":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#000000" />
          <path
            d="M14.7 6h2.2l-4.8 5.5L17.8 18h-4.4l-3.5-4.5L6 18H3.8l5.2-5.9L3.5 6h4.5l3.1 4.1L14.7 6zm-.8 10.7h1.2L7.6 7.2H6.3l7.6 9.5z"
            fill="#ffffff"
          />
        </svg>
      );

    default:
      if (fallbackIcon) {
        return <img src={fallbackIcon} alt={platform} className={`${className} object-contain`} />;
      }
      return (
        <div className={`${className} bg-neutral-900 rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
          {platform.slice(0, 1).toUpperCase()}
        </div>
      );
  }
};

