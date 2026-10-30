"use client";

import React from "react";

export const BackgroundGrid: React.FC<{ theme?: string }> = ({ theme = "midnight" }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating Ambient Glowing Orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/10 blur-[130px] rounded-full" />
      <div className="absolute top-1/3 -left-48 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-10 -right-48 w-[450px] h-[450px] bg-fuchsia-600/15 blur-[140px] rounded-full" />
    </div>
  );
};

