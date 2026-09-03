"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Globe } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll trigger to toggle background glass thickness
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-navbar py-4 shadow-md shadow-slate-100/50"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo link */}
          <Link href="/" className="focus:outline-none">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-5 py-2 text-sm font-medium tracking-wide text-slate-600 hover:text-slate-900 transition-colors duration-300 focus:outline-none"
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="active-underline"
                      className="absolute bottom-0 left-5 right-5 h-[2px] bg-gradient-to-r from-accent-blue to-accent-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA / Global Portal Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-[#fef08a] hover:from-accent-gold-hover hover:to-white transition-all duration-300 shadow-md shadow-accent-gold/20 hover:scale-105"
            >
              Inquire Now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Glass Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[80px] z-40 md:hidden bg-background/95 backdrop-blur-xl border-t border-slate-200/60 px-6 py-10 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block text-2xl font-semibold tracking-wide ${
                        isActive
                          ? "text-accent-gold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col gap-6">
              <div className="h-[1px] bg-slate-200" />
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-[#fef08a] text-center hover:opacity-90"
              >
                Inquire Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2 justify-center text-xs text-slate-400 font-mono">
                <Globe className="w-4 h-4 text-accent-blue animate-spin-slow" />
                GLOBAL TRADING CHANNELS ACTIVE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
