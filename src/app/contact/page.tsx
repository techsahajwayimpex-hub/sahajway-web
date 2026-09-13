import React from "react";
import { Metadata } from "next";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, MessageSquare } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import PageHero from "@/components/ui/PageHero";
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

      <PageHero
        title={
          <>
            Connect With <span className="text-gradient-gold">Sahajway Impex</span>
          </>
        }
        subtitle="Initiate bulk purchasing pipelines, request private labeling options, or arrange customs clearance specifications directly with our Anand headquarters."
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[{ name: "Contact Trade Desk", url: "/contact" }]}
        align="center"
      />

      <main className="flex-1 min-h-screen py-16 relative overflow-hidden bg-gradient-premium">
        {/* Background glow effects */}
        <div className="absolute top-1/4 right-1/10 w-[400px] h-[400px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/10 w-[350px] h-[350px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col gap-10">

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
                <div className="p-6 rounded-3xl glass-panel glass-panel-hover flex gap-4 items-start shadow-sm">
                  <div className="p-3.5 rounded-2xl bg-accent-gold/10 text-accent-gold shrink-0 border border-accent-gold/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Registered Office</span>
                    <span className="text-slate-900 text-sm font-semibold">Anand, Gujarat, India</span>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-6 rounded-3xl glass-panel glass-panel-hover flex gap-4 items-start shadow-sm">
                  <div className="p-3.5 rounded-2xl bg-accent-blue/10 text-accent-blue shrink-0 border border-accent-blue/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Corporate Mail Desk</span>
                    <a href="mailto:contact@sahajwayimpex.com" className="text-slate-900 text-sm font-semibold hover:text-accent-blue transition-colors">
                      contact@sahajwayimpex.com
                    </a>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="p-6 rounded-3xl glass-panel glass-panel-hover flex gap-4 items-start shadow-sm">
                  <div className="p-3.5 rounded-2xl bg-accent-blue/10 text-accent-blue shrink-0 border border-accent-blue/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Direct Hotline</span>
                    <a href="tel:+919638007789" className="text-slate-900 text-sm font-semibold hover:text-accent-blue transition-colors">
                      +91 96380 07789
                    </a>
                  </div>
                </div>
              </div>

              {/* Social channels card */}
              <div className="p-6 rounded-3xl glass-panel shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Social Channels</span>
                <div className="flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-2xl glass-pill text-slate-700 hover:text-accent-blue hover:bg-white transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
                  >
                    <Linkedin className="w-4 h-4 text-accent-blue" />
                    LinkedIn
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-2xl glass-pill text-slate-700 hover:text-pink-600 hover:bg-white transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram
                  </a>
                </div>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-2xl glass-pill text-slate-700 hover:text-accent-blue hover:bg-white transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
                  >
                    <Facebook className="w-4 h-4 text-accent-blue" />
                    Facebook
                  </a>
                  <a
                    href="https://wa.me/919638007789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-2xl glass-pill text-slate-700 hover:text-emerald-600 hover:bg-white transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Trust statement */}
              <div className="p-5 rounded-2xl glass-pill border border-accent-blue/20 text-xs text-slate-600 flex items-center shadow-sm">
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
