import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  Truck,
  Handshake,
  Users,
  Landmark,
  Activity,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import GlobeSection from "@/components/home/GlobeSection";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";

import JsonLd from "@/components/seo/JsonLd";
import {
  getOrganizationSchema,
  getFAQSchema,
  defaultExportFAQs,
  getB2BProcurementHowToSchema,
} from "@/lib/seo/schemas";

// Disable server caching so updates in admin dashboard show up immediately
export const revalidate = 0;

// Query products dynamically from MongoDB (or local mock DB if not connected)
async function getFeaturedProducts() {
  if (isUsingMockDB) {
    const data = readMockDB();
    return data.products.filter((p: any) => p.status).slice(0, 3);
  }

  try {
    await connectDB();
    const products = await ProductModel.find({ status: true }).limit(3).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(
      "Failed to query live MongoDB. Falling back to local mock DB:",
      error,
    );
    const data = readMockDB();
    return data.products.filter((p: any) => p.status).slice(0, 3);
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const schemas = [
    getOrganizationSchema(),
    getFAQSchema(defaultExportFAQs),
    getB2BProcurementHowToSchema(),
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-gradient-premium">
          {/* Top/Side Decorative Orbs */}
          <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-glow-blue opacity-40 filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] rounded-full bg-glow-gold opacity-30 filter blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Column: Heading Copy */}
            <div className="flex flex-col gap-6 text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/60 border border-slate-200 w-fit text-xs font-mono tracking-wider text-accent-blue uppercase">
                <Sparkles className="w-3.5 h-3.5 text-accent-gold animate-pulse" />
                Premium Global B2B Exporter
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Connecting Indian{" "}
                <span className="text-gradient-gold">Craftsmanship</span> With
                Global Markets
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Sahajway Impex supplies handcrafted cotton textiles, quilted
                accessories, baby bathrobes and premium loungewear to importers,
                retailers and private-label brands worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  href="/products"
                  className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-[#fef08a] hover:from-accent-gold-hover hover:to-white transition-all duration-300 shadow-lg shadow-accent-gold/25"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-slate-900 border border-slate-200 bg-slate-100/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Interactive Globe */}
            <div className="w-full">
              <GlobeSection />
            </div>
          </div>
        </section>

        {/* ABOUT PREVIEW SECTION */}
        <section className="py-24 border-y border-slate-200/60 relative bg-slate-50/60">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto flex flex-col gap-6 items-center">
              <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
                Corporate Profile
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Established with a vision for international quality.
              </h3>
              <p className="text-slate-500 text-base leading-relaxed text-center">
                Sourced directly from Anand, Gujarat, the heart of traditional
                craftsmanship, Sahajway Impex curate premium products tailored
                to international standards. Founded with a mission of trust,
                ethical supply lines, and superior quality control, we enable
                seamless trade for wholesale buyers, retailers, and distributors
                globally.
              </p>
              <Link
                href="/about"
                className="group flex items-center gap-1.5 text-sm font-semibold text-accent-blue hover:text-slate-900 transition-colors duration-300 mt-2"
              >
                Read Our Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US: BENTO GRID */}
        <section className="py-28 relative">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
              <h2 className="text-xs font-mono tracking-widest text-accent-blue uppercase">
                Operational Strengths
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Engineered for Global B2B Standards
              </h3>
              <p className="text-slate-500 text-sm">
                How Sahajway Impex ensures trade precision, quality assurance,
                and distribution trust for global clients.
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
              {/* Card 1: Premium Quality (Large Column) */}
              <div className="md:col-span-2 glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 group">
                <div className="flex justify-between items-start">
                  <div className="p-3.5 rounded-2xl bg-[#0a2540] border border-slate-200/60 text-accent-gold group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    QC Check: Passed
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold text-slate-900">
                    Premium Quality
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                    Every batch undergoes rigid inspections. From raw thread
                    count to stitching seam testing, we guarantee flawless
                    craftsmanship across all textile lines.
                  </p>
                </div>
              </div>

              {/* Card 2: Global Standards */}
              <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 group">
                <div className="p-3.5 rounded-2xl bg-[#0a2540] border border-slate-200/60 text-accent-blue w-fit group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold text-slate-900">
                    Global Standards
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Designed to align with regulatory requirements in the USA,
                    EU, and Asian markets.
                  </p>
                </div>
              </div>

              {/* Card 3: Reliable Supply Chain */}
              <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 group">
                <div className="p-3.5 rounded-2xl bg-[#0a2540] border border-slate-200/60 text-accent-blue w-fit group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold text-slate-900">
                    Reliable Supply Chain
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Guaranteed lead times, shipping container coordination, and
                    real-time tracking.
                  </p>
                </div>
              </div>

              {/* Card 4: Trusted Partnerships (Large Column) */}
              <div className="md:col-span-2 glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 group">
                <div className="flex justify-between items-start">
                  <div className="p-3.5 rounded-2xl bg-[#0a2540] border border-slate-200/60 text-accent-gold group-hover:scale-110 transition-transform">
                    <Handshake className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-[#00d4ff] bg-[#00d4ff]/5 border border-[#00d4ff]/10 px-2 py-0.5 rounded">
                    B2B Active
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold text-slate-900">
                    Trusted Partnerships
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                    We establish transparent trade agreements. We prioritize
                    long-term, mutually beneficial relationships with our
                    importers and bulk logistics partners.
                  </p>
                </div>
              </div>

              {/* Card 5: Customer-Centric Approach */}
              <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 group">
                <div className="p-3.5 rounded-2xl bg-[#0a2540] border border-slate-200/60 text-accent-blue w-fit group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold text-slate-900">
                    Customer-Centric
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Custom specifications, OEM private labeling, and dedicated
                    support lines.
                  </p>
                </div>
              </div>

              {/* Card 6: Competitive Pricing */}
              <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 group">
                <div className="p-3.5 rounded-2xl bg-[#0a2540] border border-slate-200/60 text-accent-gold w-fit group-hover:scale-110 transition-transform">
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold text-slate-900">
                    Competitive Pricing
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Optimized sourcing directly from Gujarat manufacturers
                    ensures maximum margins for our clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DYNAMIC FEATURED PRODUCTS SECTION */}
        <section className="py-24 border-t border-slate-200/60 bg-slate-100/40 relative">
          <div className="absolute top-0 left-1/3 -z-10 w-[400px] h-[400px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-4 text-left max-w-xl">
                <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
                  Curated Catalog
                </h2>
                <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Featured B2B Products
                </h3>
                <p className="text-slate-500 text-sm">
                  Explore our lead product offerings available for global
                  dispatch. Sourced and processed ethically in Gujarat, India.
                </p>
              </div>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-900 border border-slate-200 bg-slate-100/60 hover:bg-white/10 transition-all duration-300"
              >
                View Full Catalog
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product: any, index: number) => {
                const mainImage = product.images?.[0] || "/placeholder.jpg";
                return (
                  <div
                    key={product.slug || index}
                    className="glass-panel rounded-3xl overflow-hidden group hover:border-slate-300/60 transition-all duration-500 flex flex-col"
                  >
                    {/* Image frame */}
                    <div className="h-64 relative overflow-hidden bg-slate-900 shrink-0">
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030810] via-[#030810]/20 to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono bg-black/60 border border-slate-200 text-accent-gold uppercase tracking-wider">
                        {product.category}
                      </div>
                    </div>

                    {/* Copy details */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-accent-blue transition-colors duration-300 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-accent-gold transition-colors duration-300"
                      >
                        Trade Specifications
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* GLOBAL REACH SECTION */}
        <section className="py-28 relative border-t border-slate-200/60">
          <div className="absolute bottom-0 right-1/3 -z-10 w-[500px] h-[500px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Stat Counter cards & trade routes */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-mono tracking-widest text-[#00d4ff] uppercase">
                  Global Trade footprint
                </h2>
                <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Seamless Cross-Border Infrastructure
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Sahajway Impex bridges the logistical gap between direct
                  Indian manufacturing and local global warehouses. We optimize
                  multi-modal maritime routes to ensure timely customs
                  clearances and cargo arrival.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-100/40 border border-slate-200/60 font-mono">
                  <span className="text-3xl font-extrabold text-slate-900 block">
                    15+
                  </span>
                  <span className="text-slate-400 text-[10px] tracking-wider uppercase block mt-1">
                    Countries Serviced
                  </span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-100/40 border border-slate-200/60 font-mono">
                  <span className="text-3xl font-extrabold text-slate-900 block">
                    1.2M+
                  </span>
                  <span className="text-slate-400 text-[10px] tracking-wider uppercase block mt-1">
                    Units Shipped Annually
                  </span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-100/40 border border-slate-200/60 font-mono">
                  <span className="text-3xl font-extrabold text-slate-900 block">
                    100%
                  </span>
                  <span className="text-slate-400 text-[10px] tracking-wider uppercase block mt-1">
                    Export QC Compliant
                  </span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-100/40 border border-slate-200/60 font-mono">
                  <span className="text-3xl font-extrabold text-[#d4af37] block">
                    Anand
                  </span>
                  <span className="text-slate-400 text-[10px] tracking-wider uppercase block mt-1">
                    Central Logistics Hub
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Custom Animated Route Map SVG */}
            <div className="lg:col-span-7 w-full h-[320px] md:h-[420px] rounded-3xl border border-slate-200/60 bg-slate-950/40 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 tracking-wider uppercase flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-accent-blue animate-pulse" />
                Live Shipping Route Emulation
              </div>

              {/* SVG Graphic Map */}
              <svg
                viewBox="0 0 800 400"
                className="w-full h-full text-slate-700 max-w-2xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simulated World Continent Node Boundaries (minimal circles representing zones) */}
                {/* North America */}
                <circle
                  cx="160"
                  cy="140"
                  r="45"
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
                <text
                  x="160"
                  y="145"
                  textAnchor="middle"
                  fill="#556270"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  USA / CANADA
                </text>

                {/* Western Europe */}
                <circle
                  cx="420"
                  cy="120"
                  r="35"
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
                <text
                  x="420"
                  y="125"
                  textAnchor="middle"
                  fill="#556270"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  EUROPE
                </text>

                {/* India (Origin Point) */}
                <circle
                  cx="560"
                  cy="210"
                  r="25"
                  fill="rgba(214,175,55,0.06)"
                  stroke="#d4af37"
                  strokeWidth="1.5"
                />
                <text
                  x="560"
                  y="214"
                  textAnchor="middle"
                  fill="#d4af37"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  GUJARAT
                </text>

                {/* East Asia */}
                <circle
                  cx="700"
                  cy="150"
                  r="30"
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
                <text
                  x="700"
                  y="155"
                  textAnchor="middle"
                  fill="#556270"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  JAPAN
                </text>

                {/* Australia */}
                <circle
                  cx="720"
                  cy="300"
                  r="30"
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
                <text
                  x="720"
                  y="305"
                  textAnchor="middle"
                  fill="#556270"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  AUSTRALIA
                </text>

                {/* Animated Paths From Gujarat to Destinations */}
                {/* Path 1: Gujarat to North America (USA) */}
                <path
                  d="M 560 210 Q 360 110 160 140"
                  fill="none"
                  stroke="#00d4ff"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="opacity-75"
                />

                {/* Path 2: Gujarat to Europe */}
                <path
                  d="M 560 210 Q 490 140 420 120"
                  fill="none"
                  stroke="#00d4ff"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="opacity-75"
                />

                {/* Path 3: Gujarat to Japan */}
                <path
                  d="M 560 210 Q 630 160 700 150"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="opacity-75"
                />

                {/* Path 4: Gujarat to Australia */}
                <path
                  d="M 560 210 Q 640 260 720 300"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="opacity-75"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="relative py-32 bg-background overflow-hidden text-center border-t border-slate-200/60">
          <div className="absolute inset-0 bg-radial-gradient from-accent-gold/5 via-transparent to-transparent opacity-60 filter blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
              Importers / Wholesalers / Distributors
            </h2>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Establish Premium Sourcing From India
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
              Partner with Sahajway Impex to streamline your B2B purchasing
              pipelines. Request customized fabric weights, private branding
              options, and secure trade quotes directly from our Anand
              headquarters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                href="/contact"
                className="group flex items-center justify-center gap-2 px-10 py-5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:scale-105 transition-all duration-300 shadow-xl shadow-accent-gold/15"
              >
                Initiate B2B Inquiry
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 px-10 py-5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 border border-slate-300/60 bg-slate-100/40 hover:bg-white/10 transition-all duration-300"
              >
                Inspect Catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
