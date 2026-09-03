import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Info, Compass, Box, Truck, ShieldAlert } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import InquiryButton from "@/components/products/InquiryButton";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fetch single product by slug
async function getProductBySlug(slug: string) {
  if (isUsingMockDB) {
    const data = readMockDB();
    return data.products.find((p: any) => p.slug === slug && p.status) || null;
  }

  try {
    await connectDB();
    const product = await ProductModel.findOne({ slug, status: true }).lean();
    if (!product) {
      // Direct mock fallback if not found in live DB
      const data = readMockDB();
      return data.products.find((p: any) => p.slug === slug && p.status) || null;
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Failed to query product from MongoDB. Using mock DB:", error);
    const data = readMockDB();
    return data.products.find((p: any) => p.slug === slug && p.status) || null;
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found | Sahajway Impex",
    };
  }

  return {
    title: `${product.seoTitle || product.name} | Sahajway Impex`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: `${product.name} - Premium Export Specifications`,
      description: product.shortDescription,
      images: [{ url: product.images?.[0] || "" }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Generate structured product schema for SEO ranking
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.shortDescription,
    "category": product.category,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "price": "Contact for Quote",
      "offeredBy": {
        "@type": "Organization",
        "name": "Sahajway Impex",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Anand",
          "addressRegion": "Gujarat",
          "addressCountry": "IN"
        }
      }
    }
  };

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Navbar />

      <main className="flex-1 min-h-screen pt-32 pb-24 relative bg-gradient-premium">
        {/* Decorative background gradients */}
        <div className="absolute top-1/6 right-1/12 w-[400px] h-[400px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/6 left-1/12 w-[350px] h-[350px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-8">
          {/* Back button */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-900 transition-colors w-fit focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Export Catalog
          </Link>

          {/* Cinematic Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left side: Images gallery & specifications */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              {/* Product Gallery Images */}
              <div className="flex flex-col gap-4">
                <div className="h-[400px] md:h-[500px] rounded-3xl border border-slate-200/60 glass-panel overflow-hidden relative">
                  <Image
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030810]/80 via-transparent to-transparent" />
                </div>
                
                {/* Secondary images row */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {product.images.slice(1, 4).map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className="h-28 rounded-2xl border border-slate-200/60 glass-panel overflow-hidden relative"
                      >
                        <Image
                          src={imgUrl}
                          alt={`${product.name} detail view ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications Card */}
              <div className="p-8 rounded-3xl border border-slate-200/60 glass-panel backdrop-blur-sm flex flex-col gap-6">
                <h3 className="text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2 border-b border-slate-200/60 pb-4">
                  <Info className="w-4.5 h-4.5 text-accent-gold" />
                  Product Specifications
                </h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.map((spec: string, idx: number) => {
                      const parts = spec.split(":");
                      if (parts.length >= 2) {
                        return (
                          <div key={idx} className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 text-left">
                            <span className="text-[10px] font-mono uppercase text-slate-400">
                              {parts[0].trim()}
                            </span>
                            <span className="text-sm text-slate-600 font-sans font-medium">
                              {parts.slice(1).join(":").trim()}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="flex gap-2 items-center text-sm text-slate-600 border-b border-slate-200/60 pb-2 py-1 text-left">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
                          <span>{spec}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">No specifications provided.</p>
                )}
              </div>

              {/* Export details card */}
              <div className="p-8 rounded-3xl border border-slate-200/60 glass-panel backdrop-blur-sm flex flex-col gap-6 text-left">
                <h3 className="text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2 border-b border-slate-200/60 pb-4">
                  <Truck className="w-4.5 h-4.5 text-accent-blue" />
                  Logistics & Export Terms
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-sans">
                  {product.exportInformation || "Contact our B2B desk for custom MOQ, container logistics, and payment terms."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[10px] uppercase text-slate-400 mt-2">
                  <div className="flex gap-2 items-center">
                    <Compass className="w-4 h-4 text-accent-blue" />
                    <span>Incoterms: FOB, CIF, CFR</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Box className="w-4 h-4 text-accent-gold" />
                    <span>Port of Loading: Mundra / Kandla</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <CheckCircle2 className="w-4 h-4 text-[#00d4ff]" />
                    <span>Documentation: COO, Phytosanitary, BL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Summary Details & CTAs (Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6">
              <div className="p-8 rounded-3xl border border-slate-200/60 glass-panel backdrop-blur-md flex flex-col gap-6 text-left">
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-1 rounded-full text-[10px] font-mono bg-accent-blue/10 border border-accent-blue/20 text-accent-blue w-fit uppercase tracking-widest">
                    {product.category}
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    {product.name}
                  </h1>
                </div>

                <div className="h-[1px] bg-slate-100/60" />

                {/* Short Description */}
                <p className="text-slate-600 text-sm leading-relaxed font-sans">
                  {product.shortDescription}
                </p>

                {/* Features Checklist */}
                {product.features && product.features.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Key Highlights
                    </span>
                    <ul className="flex flex-col gap-2 text-xs text-slate-500">
                      {product.features.map((feat: string, idx: number) => (
                        <li key={idx} className="flex gap-2.5 items-start">
                          <CheckCircle2 className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="h-[1px] bg-slate-100/60" />

                {/* B2B Quote Button triggers custom Client Modal */}
                <InquiryButton productName={product.name} />

                {/* Extra Trust Banner */}
                <div className="flex gap-2.5 items-center justify-center p-3.5 rounded-xl border border-slate-200/60 bg-slate-100/40 text-[10px] font-mono text-slate-400 uppercase">
                  <ShieldAlert className="w-4 h-4 text-accent-blue shrink-0" />
                  <span>Sourcing verified & SGS checks supported</span>
                </div>
              </div>

              {/* Rich Text Editor HTML Description Preview */}
              {product.description && product.description !== "<p></p>" && (
                <div className="p-8 rounded-3xl border border-slate-200/60 glass-panel backdrop-blur-sm flex flex-col gap-4 text-left">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">
                    Product Narrative
                  </h3>
                  <div 
                    className="prose prose-invert text-slate-500 text-sm leading-relaxed font-sans max-w-none 
                               prose-p:mb-4 prose-ul:list-disc prose-ul:pl-4 prose-li:mb-1.5"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
