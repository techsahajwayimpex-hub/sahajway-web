"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import GlobeSection from "@/components/home/GlobeSection";

interface BannerSlide {
  _id: string;
  badge: string;
  title: string;
  highlightText?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: string;
  showGlobe?: boolean;
  backgroundColor?: string;
  backgroundImage?: string;
}

interface DestinationItem {
  _id?: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
}

interface HeroSliderProps {
  banners: BannerSlide[];
  destinations?: DestinationItem[];
}

export default function HeroSlider({
  banners,
  destinations = [],
}: HeroSliderProps) {
  const slides = banners && banners.length > 0 ? banners : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7500);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  const hasBgImage = Boolean(currentSlide.backgroundImage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Helper to split title and highlight phrase
  const renderHighlightedTitle = (title: string, highlight?: string) => {
    if (!highlight || !title.toLowerCase().includes(highlight.toLowerCase())) {
      return title;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-gradient-gold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden transition-colors duration-700 ${
        hasBgImage
          ? "bg-[#030810]"
          : currentSlide.backgroundColor || "bg-gradient-premium"
      }`}
    >
      {/* Animated Dynamic Background Cover Image */}
      <AnimatePresence mode="wait">
        {hasBgImage && (
          <motion.div
            key={currentSlide.backgroundImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <Image
              src={currentSlide.backgroundImage!}
              alt="Hero Slide Background"
              fill
              className="object-cover object-center scale-105"
              priority
              sizes="100vw"
            />
            {/* Transparent gradient overlay to keep background image clearly visible with high text contrast */}
            <div className="absolute inset-0 bg-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Gradient Orbs for fallback ambient lighting */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-glow-blue opacity-25 filter blur-3xl pointer-events-none -z-5" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full bg-glow-gold opacity-20 filter blur-3xl pointer-events-none -z-5" />

      {/* Main Slide Content Area */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide._id || currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
          >
            {/* Left Column: Heading, Subtitle & Action Buttons */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-left">
              {/* Lead-in Category Text (clean text instead of pill chip) */}
              <span
                className={`text-xs font-mono tracking-widest uppercase font-bold ${
                  hasBgImage ? "text-[#fde047]" : "text-accent-blue"
                }`}
              >
                {currentSlide.badge || "Global B2B Export House"}
              </span>

              {/* Title */}
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] drop-shadow-sm ${
                  hasBgImage ? "text-white" : "text-slate-900"
                }`}
              >
                {renderHighlightedTitle(
                  currentSlide.title,
                  currentSlide.highlightText,
                )}
              </h1>

              {/* Subtitle */}
              {currentSlide.subtitle && (
                <p
                  className={`text-base sm:text-lg leading-relaxed font-sans max-w-xl ${
                    hasBgImage ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {currentSlide.subtitle}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {currentSlide.primaryButtonText && (
                  <Link
                    href={currentSlide.primaryButtonLink || "/products"}
                    className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-[#fef08a] hover:from-accent-gold-hover hover:to-white transition-all duration-300 shadow-lg shadow-accent-gold/25 cursor-pointer"
                  >
                    <span>{currentSlide.primaryButtonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                {currentSlide.secondaryButtonText && (
                  <Link
                    href={currentSlide.secondaryButtonLink || "/contact"}
                    className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 backdrop-blur-sm shadow-sm cursor-pointer ${
                      hasBgImage
                        ? "text-white border border-white/25 bg-white/10 hover:bg-white/20"
                        : "text-slate-900 border border-slate-200 bg-slate-100/60 hover:bg-white"
                    }`}
                  >
                    <span>{currentSlide.secondaryButtonText}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: 3D Interactive World Globe OR Custom Slide Image Overlay */}
            <div className="lg:col-span-6 w-full flex items-center justify-center">
              {currentSlide.showGlobe ? (
                <div className="w-full">
                  <GlobeSection destinations={destinations} />
                </div>
              ) : currentSlide.image ? (
                <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 group">
                  <Image
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Caption banner */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs font-mono text-white shadow-xl">
                    <span className="font-semibold text-white">
                      {currentSlide.highlightText ||
                        "Sahajway Quality Standard"}
                    </span>
                    <span className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">
                      Export Grade
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <GlobeSection destinations={destinations} />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Controls (if more than 1 slide) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-4">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110 cursor-pointer ${
              hasBgImage
                ? "bg-black/50 hover:bg-black/80 text-white border border-white/20"
                : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200"
            }`}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Progress Indicator Dots */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md backdrop-blur-md ${
              hasBgImage
                ? "bg-black/50 border border-white/20"
                : "bg-white/80 border border-slate-200"
            }`}
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-accent-gold"
                    : hasBgImage
                      ? "w-2 bg-white/40 hover:bg-white/70"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110 cursor-pointer ${
              hasBgImage
                ? "bg-black/50 hover:bg-black/80 text-white border border-white/20"
                : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200"
            }`}
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
