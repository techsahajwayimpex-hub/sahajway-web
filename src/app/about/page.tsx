import React from "react";
import { Metadata } from "next";
import { Compass, Eye, ShieldCheck, Star, Award, Zap, Handshake, Heart } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "About Us | Luxury Indian Textile Exporter | Sahajway Impex",
  description: "Learn about the origins of Sahajway Impex in Anand, Gujarat. Established in August 2025 with a vision to connect Indian craftsmanship with international B2B trade.",
};

const values = [
  {
    title: "Quality Sourcing",
    description: "Every item in our collection undergoes rigid checks, from textile stitch counts to load capacity, aligning with global specifications.",
    icon: Award,
    color: "text-accent-gold",
  },
  {
    title: "Uncompromising Integrity",
    description: "We lead transparency at every point of the trade channel. Clear contracts, honest communications, and fair price parameters.",
    icon: ShieldCheck,
    color: "text-accent-blue",
  },
  {
    title: "Reliable Trust",
    description: "We are committed to building long-term partnerships. We focus on continuous delivery, meeting dates, and secure transactions.",
    icon: Handshake,
    color: "text-accent-gold",
  },
  {
    title: "Design Innovation",
    description: "Merging traditional woodblock print aesthetics and organic cotton weaves with modern styling suitable for worldwide buyers.",
    icon: Zap,
    color: "text-accent-blue",
  },
  {
    title: "Customer Commitment",
    description: "Dedicated B2B account support, customizable sizes, specialized packaging solutions, and dynamic freight services.",
    icon: Heart,
    color: "text-accent-gold",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-premium">
        {/* Background glow graphics */}
        <div className="absolute top-1/5 left-1/12 w-[400px] h-[400px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/5 right-1/12 w-[350px] h-[350px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col gap-28">
          {/* Header titles */}
          <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
            <h1 className="text-xs font-mono tracking-widest text-accent-blue uppercase">
              Corporate Heritage
            </h1>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Our <span className="text-gradient-gold">Global Story</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Based in Anand, Gujarat, Sahajway Impex connects rich heritage craftsmanship with modern international B2B trade.
            </p>
          </div>

          {/* VISUAL STORYTELLING: TIMELINE */}
          <section className="flex flex-col gap-12 text-left">
            <div className="h-[1px] bg-slate-100/60 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sticky timeline title */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-4">
                <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest leading-none">
                  Founding History
                </span>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  The Sourcing Journey
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  How a dedication to Indian mastercraft transformed into a global supply operation.
                </p>
              </div>

              {/* Vertical timeline path */}
              <div className="lg:col-span-8 flex flex-col gap-12 pl-4 border-l border-slate-200/60 relative">
                {/* Timeline node 1 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-gold ring-4 ring-[#030810]" />
                  <span className="text-xs font-mono text-[#d4af37]">August 2025</span>
                  <h4 className="text-lg font-bold text-slate-900 mt-1">Foundation in Anand, Gujarat</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2 font-sans">
                    Sahajway Impex was established with a singular vision: to connect premium Indian handcrafts and organic agricultural textiles directly with demanding global buyers. Anand, a center of regional connectivity, was chosen as our operational base.
                  </p>
                </div>

                {/* Timeline node 2 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-blue ring-4 ring-[#030810]" />
                  <span className="text-xs font-mono text-[#00d4ff]">Autumn 2025</span>
                  <h4 className="text-lg font-bold text-slate-900 mt-1">Ethical Sourcing & Product Auditing</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2 font-sans">
                    Our startup journey began with intensive product research. We traveled across weaving clusters to find unique, export-worthy products representing Indian creativity. We established direct relationships with certified cotton cooperatives, bypassing intermediaries to support local artisans.
                  </p>
                </div>

                {/* Timeline node 3 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-gold ring-4 ring-[#030810]" />
                  <span className="text-xs font-mono text-slate-400">Present Day</span>
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
            <div className="p-8 rounded-3xl border border-slate-200/60 glass-panel backdrop-blur-sm flex flex-col gap-6 group hover:border-[#00d4ff]/20 transition-all duration-500">
              <div className="p-3.5 rounded-2xl bg-accent-blue/5 border border-accent-blue/10 text-accent-blue w-fit">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Our Mission</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-sans">
                  Deliver premium Indian products to international markets while maintaining the absolute highest standards of quality check, customer satisfaction, and supply chain trust.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="p-8 rounded-3xl border border-slate-200/60 glass-panel backdrop-blur-sm flex flex-col gap-6 group hover:border-[#d4af37]/20 transition-all duration-500">
              <div className="p-3.5 rounded-2xl bg-accent-gold/5 border border-accent-gold/10 text-accent-gold w-fit">
                <Eye className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Our Vision</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-sans">
                  Become a globally recognized export partner known for unwavering logistics reliability, premium artisan design curation, and ethical, transparent trade relationships.
                </p>
              </div>
            </div>
          </section>

          {/* CORE VALUES BOXES */}
          <section className="flex flex-col gap-12 text-left">
            <div className="h-[1px] bg-slate-100/60 w-full" />
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest leading-none">
                Shared Ethics
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Our Core Values
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((val, idx) => {
                const IconComp = val.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-slate-200/60 bg-slate-100/40 flex flex-col gap-4 group hover:border-slate-200 hover:bg-slate-100/60 transition-all duration-300"
                  >
                    <div className={`p-2.5 rounded-xl bg-slate-100/60 border border-slate-200 w-fit ${val.color} group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-slate-900">{val.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed mt-1 font-sans">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
