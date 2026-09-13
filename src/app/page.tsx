import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import DestinationModel from "@/lib/models/Destination";
import BannerModel from "@/lib/models/Banner";

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
    return (data.products || []).filter((p: any) => p.status).slice(0, 3);
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const data = readMockDB();
      return (data.products || []).filter((p: any) => p.status).slice(0, 3);
    }
    const products = await ProductModel.find({ status: true }).limit(3).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(
      "Failed to query live MongoDB. Falling back to local mock DB:",
      error
    );
    const data = readMockDB();
    return (data.products || []).filter((p: any) => p.status).slice(0, 3);
  }
}

// Query active banners dynamically
async function getBanners() {
  if (isUsingMockDB) {
    const data = readMockDB();
    return (data.banners || [])
      .filter((b: any) => b.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const data = readMockDB();
      return (data.banners || [])
        .filter((b: any) => b.active)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }
    const banners = await BannerModel.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    if (!banners || banners.length === 0) {
      const data = readMockDB();
      return (data.banners || [])
        .filter((b: any) => b.active)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }
    return JSON.parse(JSON.stringify(banners));
  } catch (error) {
    console.error("Failed to query banners, falling back to mock:", error);
    const data = readMockDB();
    return (data.banners || [])
      .filter((b: any) => b.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }
}

// Query active trade destinations dynamically
async function getDestinations() {
  if (isUsingMockDB) {
    const data = readMockDB();
    return (data.destinations || [])
      .filter((d: any) => d.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const data = readMockDB();
      return (data.destinations || [])
        .filter((d: any) => d.active)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }
    const destinations = await DestinationModel.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    if (!destinations || destinations.length === 0) {
      const data = readMockDB();
      return (data.destinations || [])
        .filter((d: any) => d.active)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }
    return JSON.parse(JSON.stringify(destinations));
  } catch (error) {
    console.error("Failed to query destinations, falling back to mock:", error);
    const data = readMockDB();
    return (data.destinations || [])
      .filter((d: any) => d.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }
}

export default async function HomePage() {
  const [featuredProducts, banners, destinations] = await Promise.all([
    getFeaturedProducts(),
    getBanners(),
    getDestinations(),
  ]);

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
        {/* SECTION 1: DYNAMIC HERO BANNER SLIDER WITH 3D GLOBE / CUSTOM VISUALS */}
        <HeroSlider banners={banners} destinations={destinations} />

        {/* SECTION 2: DYNAMIC FEATURED B2B PRODUCTS (Directly Under Hero / 3D Globe) */}
        <section className="py-24 border-y border-slate-200/60 bg-slate-50/60 relative">
          <div className="absolute top-0 left-1/3 -z-10 w-[400px] h-[400px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-4 text-left max-w-xl">
                <span className="text-xs font-mono tracking-widest text-accent-blue uppercase font-bold">
                  Curated Export Catalog
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Featured <span className="text-gradient-gold">B2B Products</span>
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Explore our lead product lines manufactured for global dispatch.
                  Sourced and processed ethically in Anand, Gujarat, India.
                </p>
              </div>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-900 border border-slate-200 bg-slate-100/60 hover:bg-slate-200/60 transition-all duration-300"
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
                    className="glass-panel rounded-3xl overflow-hidden group hover:border-slate-300/80 transition-all duration-500 flex flex-col shadow-sm hover:shadow-xl"
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
                      <div className="absolute top-4 left-4 text-[11px] font-mono text-[#fde047] font-semibold uppercase tracking-wider">
                        {product.category}
                      </div>
                    </div>

                    {/* Copy details */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-6 text-left">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-accent-blue transition-colors duration-300 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-sans">
                          {product.shortDescription}
                        </p>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-accent-gold border border-slate-200 transition-colors duration-300"
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

        {/* SECTION 3: CORPORATE PROFILE / ABOUT PREVIEW */}
        <section className="py-24 relative bg-background">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto flex flex-col gap-6 items-center">
              <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">
                Corporate Profile
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Established with a vision for international quality.
              </h3>
              <p className="text-slate-500 text-base leading-relaxed text-center font-sans">
                Sourced directly from Anand, Gujarat, the heart of traditional
                craftsmanship, Sahajway Impex curates premium products tailored
                to international regulatory standards. Founded with a mission of trust,
                ethical supply lines, and rigorous quality control, we enable
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

        {/* SECTION 4: WHY CHOOSE US: BENTO GRID */}
        <section className="py-24 border-t border-slate-200/60 relative bg-slate-50/40">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
              <h2 className="text-xs font-mono tracking-widest text-accent-blue uppercase font-bold">
                Operational Strengths
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Engineered for Global B2B Standards
              </h3>
              <p className="text-slate-500 text-sm">
                How Sahajway Impex ensures trade precision, quality assurance,
                and distribution trust for global importers.
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
              {/* Card 1: Premium Quality (Large Column) */}
              <div className="md:col-span-2 relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-all duration-500 group shadow-md hover:shadow-2xl border border-white/20 text-left">
                <Image
                  src="https://images.unsplash.com/photo-1643313260651-9c335822ecde?auto=format&fit=crop&w=1200&q=80"
                  alt="Rigorous Multi-Tier Quality Control"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

                <div className="relative z-10 flex flex-col gap-2 p-4 rounded-2xl glass-panel-dark">
                  <span className="text-xs font-mono text-[#fde047] uppercase tracking-widest font-bold">
                    Quality Assurance
                  </span>
                  <h4 className="text-xl font-bold text-white drop-shadow-md">
                    Rigorous Multi-Tier Quality Control
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed max-w-xl font-sans drop-shadow-sm">
                    Every export batch undergoes comprehensive inspections for
                    thread density, dye fastness, chemical safety, and tensile
                    durability before container dispatch.
                  </p>
                </div>
              </div>

              {/* Card 2: Global Standards */}
              <div className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-all duration-500 group shadow-md hover:shadow-2xl border border-white/20 text-left">
                <Image
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
                  alt="Global Standards"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

                <div className="relative z-10 flex flex-col gap-2 p-4 rounded-2xl glass-panel-dark">
                  <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-bold">
                    Compliance
                  </span>
                  <h4 className="text-xl font-bold text-white drop-shadow-md">
                    Global Standards
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed font-sans drop-shadow-sm">
                    Designed to align with regulatory requirements in the USA,
                    EU, and Asian trade markets.
                  </p>
                </div>
              </div>

              {/* Card 3: Reliable Supply Chain */}
              <div className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-all duration-500 group shadow-md hover:shadow-2xl border border-white/20 text-left">
                <Image
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80"
                  alt="Reliable Supply Chain"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

                <div className="relative z-10 flex flex-col gap-2 p-4 rounded-2xl glass-panel-dark">
                  <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-bold">
                    Logistics
                  </span>
                  <h4 className="text-xl font-bold text-white drop-shadow-md">
                    Reliable Supply Chain
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed font-sans drop-shadow-sm">
                    Guaranteed lead times, shipping container coordination, and
                    real-time logistics tracking.
                  </p>
                </div>
              </div>

              {/* Card 4: Trusted Partnerships (Large Column) */}
              <div className="md:col-span-2 relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-all duration-500 group shadow-md hover:shadow-2xl border border-white/20 text-left">
                <Image
                  src="https://images.unsplash.com/photo-1638262052640-82e94d64664a?auto=format&fit=crop&w=1200&q=80"
                  alt="Trusted Partnerships"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

                <div className="relative z-10 flex flex-col gap-2 p-4 rounded-2xl glass-panel-dark">
                  <span className="text-xs font-mono text-[#fde047] uppercase tracking-widest font-bold">
                    Trade Relations
                  </span>
                  <h4 className="text-xl font-bold text-white drop-shadow-md">
                    Trusted Partnerships
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed max-w-xl font-sans drop-shadow-sm">
                    We establish transparent trade agreements. We prioritize
                    long-term, mutually beneficial relationships with our
                    importers and bulk logistics partners.
                  </p>
                </div>
              </div>

              {/* Card 5: Customer-Centric Approach */}
              <div className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-all duration-500 group shadow-md hover:shadow-2xl border border-white/20 text-left">
                <Image
                  src="https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?auto=format&fit=crop&w=800&q=80"
                  alt="Customer-Centric"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

                <div className="relative z-10 flex flex-col gap-2 p-4 rounded-2xl glass-panel-dark">
                  <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-bold">
                    Client Success
                  </span>
                  <h4 className="text-xl font-bold text-white drop-shadow-md">
                    Customer-Centric
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed font-sans drop-shadow-sm">
                    Custom specifications, OEM private labeling, and dedicated
                    account management.
                  </p>
                </div>
              </div>

              {/* Card 6: Competitive Pricing */}
              <div className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-all duration-500 group shadow-md hover:shadow-2xl border border-white/20 text-left">
                <Image
                  src="https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=800&q=80"
                  alt="Competitive Pricing"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 backdrop-blur-[2px] transition-colors" />

                <div className="relative z-10 flex flex-col gap-2 p-4 rounded-2xl glass-panel-dark">
                  <span className="text-xs font-mono text-[#fde047] uppercase tracking-widest font-bold">
                    Direct Sourcing
                  </span>
                  <h4 className="text-xl font-bold text-white drop-shadow-md">
                    Competitive Pricing
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed font-sans drop-shadow-sm">
                    Optimized sourcing directly from Gujarat manufacturers
                    ensures maximum margins for our clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: GLOBAL REACH & PORT INFRASTRUCTURE */}
        <section className="py-24 relative overflow-hidden border-t border-slate-200/60 bg-slate-950">
          {/* Background Image with Dark Contrast Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2000&q=80"
              alt="Global Maritime Shipping Port & Logistics"
              fill
              className="object-cover object-center scale-105"
              sizes="100vw"
            />
            {/* Reduced opacity overlay so maritime port image is visible while text remains high contrast */}
            <div className="absolute inset-0 bg-slate-950/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/60 to-slate-950/40" />
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Col: Stat Counter cards & trade routes */}
            <div className="lg:col-span-6 flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-mono tracking-widest text-[#38bdf8] uppercase font-semibold">
                  Global Trade Footprint
                </h2>
                <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                  Seamless Cross-Border Infrastructure
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed font-sans drop-shadow-sm">
                  Sahajway Impex bridges the logistical gap between direct
                  Indian manufacturing and local global warehouses. We optimize
                  multi-modal maritime routes from Mundra and Kandla ports to ensure timely customs
                  clearances and cargo arrival.
                </p>
              </div>

              {/* Statistics Grid with Glassmorphism */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl glass-panel-dark glass-panel-dark-hover font-mono shadow-lg">
                  <span className="text-3xl font-extrabold text-white block drop-shadow-md">
                    15+
                  </span>
                  <span className="text-[#fde047] text-[10px] tracking-wider uppercase block mt-1 font-semibold">
                    Countries Serviced
                  </span>
                </div>
                <div className="p-6 rounded-2xl glass-panel-dark glass-panel-dark-hover font-mono shadow-lg">
                  <span className="text-3xl font-extrabold text-white block drop-shadow-md">
                    1.2M+
                  </span>
                  <span className="text-[#fde047] text-[10px] tracking-wider uppercase block mt-1 font-semibold">
                    Units Shipped Annually
                  </span>
                </div>
                <div className="p-6 rounded-2xl glass-panel-dark glass-panel-dark-hover font-mono shadow-lg">
                  <span className="text-3xl font-extrabold text-white block drop-shadow-md">
                    100%
                  </span>
                  <span className="text-[#fde047] text-[10px] tracking-wider uppercase block mt-1 font-semibold">
                    Export QC Compliant
                  </span>
                </div>
                <div className="p-6 rounded-2xl glass-panel-dark glass-panel-dark-hover font-mono shadow-lg">
                  <span className="text-3xl font-extrabold text-white block drop-shadow-md">
                    24/7
                  </span>
                  <span className="text-[#fde047] text-[10px] tracking-wider uppercase block mt-1 font-semibold">
                    Consignment Tracking
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Logistics Process Timeline */}
            <div className="lg:col-span-6 glass-panel-dark p-8 md:p-10 rounded-3xl flex flex-col gap-6 text-left shadow-2xl transition-all">
              <span className="text-xs font-mono uppercase tracking-widest text-[#fde047] font-bold">
                Export Process Flow
              </span>
              <h4 className="text-2xl font-bold text-white drop-shadow-sm">
                Precision From Loom to Port
              </h4>

              <div className="flex flex-col gap-6 mt-2">
                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent-gold to-[#fef08a] text-black font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                    01
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white drop-shadow-sm">
                      Material Sourcing & Quality Batching
                    </span>
                    <span className="text-xs text-slate-300 font-sans leading-relaxed">
                      100% GOTS certified cotton verified directly at master
                      artisan centers in Gujarat and Rajasthan.
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent-gold to-[#fef08a] text-black font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                    02
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white drop-shadow-sm">
                      Standardized Export Packaging
                    </span>
                    <span className="text-xs text-slate-300 font-sans leading-relaxed">
                      Biodegradable protective wrapping, barcode tagging, and
                      5-ply seaworthy master crates.
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent-gold to-[#fef08a] text-black font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                    03
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white drop-shadow-sm">
                      Customs & Ocean Freight Dispatch
                    </span>
                    <span className="text-xs text-slate-300 font-sans leading-relaxed">
                      Full container load (FCL) and less than container load
                      (LCL) dispatches from Mundra / Nhava Sheva ports.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: FAQ ACCORDION SECTION */}
        <section className="py-24 border-t border-slate-200/60 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-6 flex flex-col gap-12">
            <div className="flex flex-col gap-3 text-center">
              <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
                Got Questions?
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Trade Questions
              </h3>
              <p className="text-slate-500 text-sm">
                Answers to common international procurement, shipping, and OEM inquiries.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {defaultExportFAQs.map((faq, index) => (
                <details
                  key={index}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl group transition-all text-left cursor-pointer open:border-accent-blue/40 open:shadow-lg"
                >
                  <summary className="font-semibold text-slate-900 text-base flex justify-between items-center list-none select-none">
                    <span>{faq.question}</span>
                    <span className="text-accent-gold text-lg transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-slate-600 text-sm mt-4 leading-relaxed font-sans border-t border-slate-200/40 pt-4">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: CONSULTATION CALL TO ACTION */}
        <section className="py-20 relative bg-[#0a2540] text-white overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full bg-accent-blue opacity-15 filter blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="glass-panel-dark p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono tracking-widest text-accent-gold uppercase font-bold">
                  Direct Indian Trade Partnership
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Ready to source premium textiles for your enterprise?
                </h3>
                <p className="text-slate-300 text-sm max-w-xl font-sans">
                  Contact our executive team for custom wholesale rate cards, product sample requests, and OEM manufacturing agreements.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-[#fef08a] hover:from-accent-gold-hover hover:to-white transition-all shadow-xl shadow-accent-gold/20 shrink-0 cursor-pointer"
              >
                Request Trade Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
