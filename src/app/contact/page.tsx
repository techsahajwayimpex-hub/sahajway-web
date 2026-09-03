import React from "react";
import { Metadata } from "next";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, MessageSquare, ShieldCheck } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/contact/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getLocalBusinessSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title: "Contact B2B Trade Relations | Sahajway Impex",
  description: "Get in touch with Sahajway Impex in Anand, Gujarat. Request custom quotes for B2B textile exports, Jaipuri double quilts, and quilted cotton bags.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact B2B Trade Desk | Sahajway Impex",
    description: "Request custom B2B wholesale pricing, fabric swatches, and international freight quotes.",
    url: "/contact",
  },
};

export default function ContactPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact#webpage`,
    url: `${siteUrl}/contact`,
    name: "Sahajway Impex B2B Trade Desk & Inquiries",
    description: "Direct contact channel for international buyers to procure handcrafted Indian textiles and goods.",
    mainEntity: getLocalBusinessSchema(),
  };

  return (
    <>
      <JsonLd schema={contactSchema} />
      <Navbar />

      <main className="flex-1 min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-premium">
        {/* Background glow effects */}
        <div className="absolute top-1/4 right-1/10 w-[400px] h-[400px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/10 w-[350px] h-[350px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col gap-10">
          <Breadcrumbs items={[{ name: "Contact Trade Desk", url: "/contact" }]} />

          {/* Header titles */}
          <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
            <h1 className="text-xs font-mono tracking-widest text-accent-blue uppercase">
              Trade Desk Console
            </h1>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Connect With <span className="text-gradient-gold">Sahajway Impex</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Initiate bulk purchasing pipelines, request private labeling options, or arrange customs clearance specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
            {/* Left Column: Coordinates details */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest">
                  Corporate HQ Coordinates
                </span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Global Trade Relations
                </h3>
              </div>

              {/* Detail block cards */}
              <div className="flex flex-col gap-4">
                {/* Location Card */}
                <div className="p-6 rounded-2xl bg-slate-100/40 border border-slate-200/60 flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-accent-gold/5 border border-accent-gold/10 text-accent-gold shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Registered Office</span>
                    <span className="text-slate-900 text-sm font-semibold">Anand, Gujarat, India</span>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-6 rounded-2xl bg-slate-100/40 border border-slate-200/60 flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-accent-blue/5 border border-accent-blue/10 text-accent-blue shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Corporate Mail Desk</span>
                    <a href="mailto:contact@sahajwayimpex.com" className="text-slate-900 text-sm font-semibold hover:text-accent-blue transition-colors">
                      contact@sahajwayimpex.com
                    </a>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="p-6 rounded-2xl bg-slate-100/40 border border-slate-200/60 flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-accent-blue/5 border border-accent-blue/10 text-accent-blue shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Direct Hotline</span>
                    <a href="tel:+919638007789" className="text-slate-900 text-sm font-semibold hover:text-accent-blue transition-colors">
                      +91 96380 07789
                    </a>
                  </div>
                </div>
              </div>

              {/* Social channels card */}
              <div className="p-6 rounded-2xl border border-slate-200/60 glass-panel flex flex-col gap-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Social Channels</span>
                <div className="flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </div>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a
                    href="https://wa.me/919638007789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Trust statement */}
              <div className="p-5 rounded-2xl border border-accent-blue/10 bg-accent-blue/5 text-xs text-slate-500 flex gap-3 items-center">
                <ShieldCheck className="w-5 h-5 text-accent-blue shrink-0" />
                <span>We guarantee secure B2B communications and respond within 12-24 hours.</span>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7 w-full">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
