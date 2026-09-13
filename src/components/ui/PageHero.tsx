import React from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface PageHeroProps {
  title: React.ReactNode;
  subtitle: string;
  backgroundImage: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  align?: "center" | "left";
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
  breadcrumbs,
  align = "center",
}: PageHeroProps) {
  const isCenter = align === "center";

  return (
    <section className="relative w-full pt-32 pb-20 md:pb-24 overflow-hidden border-b border-slate-200/60">
      {/* Background Image with optimized light contrast overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Page Background"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        {/* Light, transparent gradient overlay to make background image clearly visible while keeping text readable */}
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col gap-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="w-fit">
            <div className="px-4 py-1.5 rounded-full glass-panel-dark text-slate-100 text-xs font-mono shadow-md">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          </div>
        )}

        <div
          className={`flex flex-col gap-4 max-w-3xl ${
            isCenter
              ? "mx-auto text-center items-center"
              : "text-left items-start"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            {title}
          </h1>

          <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-2xl font-sans drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
