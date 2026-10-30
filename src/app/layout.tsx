import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dan1elcodm.vercel.app"),
  title: "Dan1elcodm | Official Links",
  description: "Connect with Dan1elcodm. Official WhatsApp community, TikTok, Instagram, Snapchat, and more!",
  icons: {
    icon: "/images/avatar.png",
  },
  openGraph: {
    title: "Dan1elcodm | Official Links",
    description: "Join Dan1elcodm's official WhatsApp community and follow across social media.",
    url: "https://dan1elcodm.vercel.app",
    siteName: "Dan1elcodm",
    images: [
      {
        url: "/images/avatar.png",
        width: 256,
        height: 256,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}

