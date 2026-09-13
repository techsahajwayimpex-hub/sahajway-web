import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import PageHero from "@/components/ui/PageHero";

import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getOrganizationSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title: "About Us | Luxury Indian Textile Exporter | Sahajway Impex",
  description:
    "Learn about the origins of Sahajway Impex in Anand, Gujarat. Established in August 2025 with a vision to connect Indian craftsmanship with international B2B trade.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Sahajway Impex - Heritage & Global Trade",
    description:
      "Ethical artisan sourcing, international quality standards, and luxury cotton export.",
    url: "/about",
  },
};

const values = [
  {
    title: "Quality Sourcing",
    description:
      "Every item in our collection undergoes rigid checks, from textile stitch counts to load capacity, aligning with global specifications.",
    backgroundImage:
      "https://images.unsplash.com/photo-1643313260651-9c335822ecde?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Uncompromising Integrity",
    description:
      "We lead transparency at every point of the trade channel. Clear contracts, honest communications, and fair price parameters.",
    backgroundImage:
      "https://images.unsplash.com/photo-1638262052640-82e94d64664a?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Reliable Trust",
    description:
      "We are committed to building long-term partnerships. We focus on continuous delivery, meeting dates, and secure transactions.",
    backgroundImage:
      "https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Design Innovation",
    description:
      "Merging traditional woodblock print aesthetics and organic cotton weaves with modern styling suitable for worldwide buyers.",
    backgroundImage:
      "https://images.unsplash.com/photo-1755408007655-9ac329cfa145?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Customer Commitment",
    description:
      "Dedicated B2B account support, customizable sizes, specialized packaging solutions, and dynamic freight services.",
    backgroundImage:
      "https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    url: `${siteUrl}/about`,
    name: "About Sahajway Impex - Indian B2B Export House",
    description:
      "Corporate heritage, vision, ethical artisan sourcing, and global trade commitments of Sahajway Impex.",
    mainEntity: getOrganizationSchema(),
  };

  return (
    <>
      <JsonLd schema={aboutSchema} />
      <Navbar />

      <PageHero
        title={
          <>
            Our <span className="text-gradient-gold">Global Story</span>
          </>
        }
        subtitle="Based in Anand, Gujarat, Sahajway Impex connects rich Indian heritage craftsmanship and ethical sourcing with modern international B2B commerce."
        backgroundImage="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[{ name: "About Us", url: "/about" }]}
        align="center"
      />

      <main className="flex-1 min-h-screen py-16 relative overflow-hidden bg-gradient-premium">
        {/* Background glow graphics */}
        <div className="absolute top-1/5 left-1/12 w-[400px] h-[400px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/5 right-1/12 w-[350px] h-[350px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col gap-16">
          {/* VISUAL STORYTELLING: TIMELINE */}
          <section className="flex flex-col gap-12 text-left">
            <div className="h-[1px] bg-slate-200 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sticky timeline title */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-4">
                <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest leading-none font-bold">
                  Founding History
                </span>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  The Sourcing Journey
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  How a dedication to Indian mastercraft transformed into a global supply operation.
                </p>
              </div>

              {/* Vertical timeline path with Glass Panels */}
              <div className="lg:col-span-8 flex flex-col gap-6 pl-4 border-l-2 border-accent-gold/30 relative">
                {/* Timeline node 1 */}
                <div className="relative pl-6 glass-panel glass-panel-hover p-6 rounded-2xl">
                  <div className="absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-accent-gold ring-4 ring-white shadow-sm" />
                  <span className="text-xs font-mono text-[#b48e28] font-bold">August 2025</span>
                  <h4 className="text-lg font-bold text-slate-900 mt-1">Foundation in Anand, Gujarat</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2 font-sans">
                    Sahajway Impex was established with a singular vision: to connect premium Indian handcrafts and organic agricultural textiles directly with demanding global buyers. Anand, a center of regional connectivity, was chosen as our operational base.
                  </p>
                </div>

                {/* Timeline node 2 */}
                <div className="relative pl-6 glass-panel glass-panel-hover p-6 rounded-2xl">
                  <div className="absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-accent-blue ring-4 ring-white shadow-sm" />
                  <span className="text-xs font-mono text-accent-blue font-bold">Autumn 2025</span>
                  <h4 className="text-lg font-bold text-slate-900 mt-1">Ethical Sourcing & Product Auditing</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2 font-sans">
                    Our startup journey began with intensive product research. We traveled across weaving clusters to find unique, export-worthy products representing Indian creativity. We established direct relationships with certified cotton cooperatives, bypassing intermediaries to support local artisans.
                  </p>
                </div>

                {/* Timeline node 3 */}
                <div className="relative pl-6 glass-panel glass-panel-hover p-6 rounded-2xl">
                  <div className="absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-accent-gold ring-4 ring-white shadow-sm" />
                  <span className="text-xs font-mono text-slate-400 font-bold">Present Day</span>
                  <h4 className="text-lg font-bold text-slate-900 mt-1">Premium Curated Exports</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2 font-sans">
                    Today, we specialize in high-end, export-compliant collections: organic block-printed bathrobes, luxurious bed quilts, and canvas bags. Every item matches design expectations in Europe, East Asia, and the Americas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* MISSION & VISION SIDE-BY-SIDE */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Mission Card */}
            <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl border border-white/20 shadow-xl group transition-all duration-500 flex flex-col justify-end min-h-[280px]">
              <Image
                src="https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e?auto=format&fit=crop&w=1200&q=80"
                alt="Our Mission - Global Logistics"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

              <div className="relative z-10 flex flex-col gap-3 p-5 rounded-2xl glass-panel-dark">
                <span className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] font-semibold">
                  Purpose & Commitment
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                  Our Mission
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans drop-shadow-sm">
                  Deliver premium Indian products to international markets while maintaining the absolute highest standards of quality check, customer satisfaction, and supply chain trust.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl border border-white/20 shadow-xl group transition-all duration-500 flex flex-col justify-end min-h-[280px]">
              <Image
                src="https://images.unsplash.com/photo-1556208144-ad3c8e2642ef?auto=format&fit=crop&w=1200&q=80"
                alt="Our Vision - Global Horizon"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

              <div className="relative z-10 flex flex-col gap-3 p-5 rounded-2xl glass-panel-dark">
                <span className="text-xs font-mono uppercase tracking-widest text-[#fde047] font-semibold">
                  Long-term Direction
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                  Our Vision
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans drop-shadow-sm">
                  Become a globally recognized export partner known for unwavering logistics reliability, premium artisan design curation, and ethical, transparent trade relationships.
                </p>
              </div>
            </div>
          </section>

          {/* CORE VALUES BOXES */}
          <section className="flex flex-col gap-8 text-left">
            <div className="h-[1px] bg-slate-200 w-full" />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest leading-none font-bold">
                Shared Ethics
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Our Core Values
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl flex flex-col justify-end gap-3 min-h-[240px] group transition-all duration-300"
                >
                  <Image
                    src={val.backgroundImage}
                    alt={val.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

                  <div className="relative z-10 flex flex-col gap-1.5 p-4 rounded-2xl glass-panel-dark">
                    <h4 className="text-lg font-bold text-white drop-shadow-sm">{val.title}</h4>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-sans drop-shadow-sm">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
