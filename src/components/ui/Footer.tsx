import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, MessageSquare, Globe } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-slate-200 bg-slate-50 pt-20 pb-10">
      {/* Decorative radial gradients inside footer */}
      <div className="absolute top-0 right-1/4 -z-10 w-[300px] h-[300px] rounded-full bg-glow-blue opacity-8 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 w-[300px] h-[300px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Company Identity */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Logo />
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
            Connecting Indian craftsmanship with international trade corridors. We deliver premium, luxury B2B cotton textiles, custom apparel, and handcrafted home furnishings to worldwide markets.
          </p>
          <div className="flex gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-200/60 text-slate-500 hover:text-accent-blue hover:bg-slate-200 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-200/60 text-slate-500 hover:text-accent-blue hover:bg-slate-200 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-200/60 text-slate-500 hover:text-accent-blue hover:bg-slate-200 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/919638007789"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-200/60 text-slate-500 hover:text-accent-blue hover:bg-slate-200 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex flex-col gap-5">
          <h4 className="text-slate-900 font-sans font-semibold text-sm tracking-wider uppercase">
            Corporate Trade
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link href="/" className="text-slate-500 hover:text-accent-gold transition-colors">
                Home Interface
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-slate-500 hover:text-accent-gold transition-colors">
                Export Catalog
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-slate-500 hover:text-accent-gold transition-colors">
                Corporate Profile
              </Link>
            </li>
            <li>
              <Link href="/team" className="text-slate-500 hover:text-accent-gold transition-colors">
                Leadership Board
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-500 hover:text-accent-gold transition-colors">
                Trade Relations
              </Link>
            </li>
          </ul>
        </div>

        {/* Global Office & Contact info */}
        <div className="flex flex-col gap-5">
          <h4 className="text-slate-900 font-sans font-semibold text-sm tracking-wider uppercase">
            Global Office
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-500">
            <li className="flex gap-3 items-start">
              <MapPin className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <span>Anand, Gujarat, India</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-4 h-4 text-accent-blue shrink-0" />
              <a href="mailto:contact@sahajwayimpex.com" className="hover:text-slate-900 transition-colors">
                contact@sahajwayimpex.com
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="w-4 h-4 text-accent-blue shrink-0" />
              <a href="tel:+919638007789" className="hover:text-slate-900 transition-colors">
                +91 96380 07789
              </a>
            </li>
            <li className="flex gap-2 items-center text-xs font-mono text-accent-blue bg-accent-blue/5 border border-accent-blue/10 px-3 py-1.5 rounded-lg w-fit">
              <Globe className="w-3.5 h-3.5 animate-spin-slow" />
              <span>IEC Status: Active</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div>
          © {currentYear} SAHAJWAY IMPEX. Registered in Anand, Gujarat, India.
        </div>
        <div className="flex gap-6">
          <span className="hover:text-slate-800 cursor-pointer transition-colors">
            Terms of Freight (Incoterms)
          </span>
          <span className="hover:text-slate-800 cursor-pointer transition-colors">
            Privacy Charter
          </span>
        </div>
      </div>
    </footer>
  );
}
