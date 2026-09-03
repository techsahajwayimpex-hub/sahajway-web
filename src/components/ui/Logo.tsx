import React from "react";
import Image from "next/image";
import logoImg from "../../../public/logo.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "", showText = true }: LogoProps) {
  if (!showText) {
    return (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-9 h-9 ${className}`}
      >
        {/* Globe Center */}
        <circle cx="20" cy="20" r="18" fill="#003b95" />
        
        {/* Globe Grid Lines (White) */}
        <ellipse cx="20" cy="20" rx="12" ry="18" stroke="#ffffff" strokeWidth="1.2" fill="none" />
        <ellipse cx="20" cy="20" rx="5" ry="18" stroke="#ffffff" strokeWidth="1.2" fill="none" />
        <line x1="20" y1="2" x2="20" y2="38" stroke="#ffffff" strokeWidth="1.2" />
        
        <path d="M 4 12 Q 20 18 36 12" stroke="#ffffff" strokeWidth="1.2" fill="none" />
        <path d="M 2 20 H 38" stroke="#ffffff" strokeWidth="1.2" fill="none" />
        <path d="M 4 28 Q 20 22 36 28" stroke="#ffffff" strokeWidth="1.2" fill="none" />
      </svg>
    );
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <Image
        src={logoImg}
        alt="Sahajway Impex Logo"
        className="h-14 w-auto object-contain"
        preload
      />
    </div>
  );
}

