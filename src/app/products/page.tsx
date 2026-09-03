import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowLeft, ArrowRight, Layers, SlidersHorizontal, RefreshCw } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import SearchInput from "@/components/products/SearchInput";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import CategoryModel from "@/lib/models/Category";

import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Premium B2B Export Product Catalog | Sahajway Impex",
  description: "Browse our premium export products catalog including hand-block printed baby bathrobes, double quilts, and canvas tote bags sourced directly from Anand, Gujarat, India.",
  keywords: ["Textile Exporter India", "Indian Cotton Products", "Jaipuri Quilts Wholesale", "Premium Cotton Bags"],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Premium B2B Export Catalog | Sahajway Impex",
    description: "Ethical sourcing and premium textiles exported worldwide from Gujarat, India.",
    type: "website",
    url: "/products",
  },
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

// Fetch categories from DB or Mock
async function getCategories() {
  if (isUsingMockDB) {
    const data = readMockDB();
    return data.categories.filter((c: any) => c.status);
  }

  try {
    await connectDB();
    const categories = await CategoryModel.find({ status: true }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Categories fetch failed, returning mock:", error);
    const data = readMockDB();
    return data.categories.filter((c: any) => c.status);
  }
}

// Fetch filtered products
async function getFilteredProducts(searchQuery: string, categoryFilter: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  if (isUsingMockDB) {
    const data = readMockDB();
    let products = [...data.products];

    // Filter published products
    products = products.filter((p: any) => p.status);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p: any) => p.name.toLowerCase().includes(q) || 
             p.shortDescription.toLowerCase().includes(q) ||
             (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (categoryFilter) {
      products = products.filter(
        (p: any) => p.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    const total = products.length;
    const paginated = products.slice(skip, skip + limit);
    return { products: paginated, total };
  }

  try {
    await connectDB();
    const query: any = { status: true };

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { shortDescription: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } }
      ];
    }

    if (categoryFilter) {
      // Direct category name check (case-insensitive)
      query.category = { $regex: new RegExp(`^${categoryFilter}$`, "i") };
    }

    const total = await ProductModel.countDocuments(query);
    const products = await ProductModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return { 
      products: JSON.parse(JSON.stringify(products)), 
      total 
    };
  } catch (error) {
    console.error("Products query failed, falling back to mock:", error);
    const mockData = readMockDB();
    let products = mockData.products.filter((p: any) => p.status);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p: any) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (categoryFilter) {
      products = products.filter(
        (p: any) => p.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    const total = products.length;
    return { products: products.slice(skip, skip + limit), total };
  }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const categoryFilter = params.category || "";
  const currentPage = parseInt(params.page || "1", 10);
  const limit = 6;

  const categories = await getCategories();
  const { products, total } = await getFilteredProducts(searchQuery, categoryFilter, currentPage, limit);
  const totalPages = Math.ceil(total / limit);

  // Helper to build URL with kept params
  const getFilterUrl = (catName: string | null) => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set("search", searchQuery);
    if (catName) queryParams.set("category", catName);
    return `/products?${queryParams.toString()}`;
  };

  const getPageUrl = (pageNum: number) => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set("search", searchQuery);
    if (categoryFilter) queryParams.set("category", categoryFilter);
    queryParams.set("page", pageNum.toString());
    return `/products?${queryParams.toString()}`;
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((prod: any, index: number) => ({
      "@type": "ListItem",
      position: (currentPage - 1) * limit + index + 1,
      name: prod.name,
      url: `${baseUrl}/products/${prod.slug}`,
    })),
  };

  return (
    <>
      <JsonLd schema={itemListSchema} />
      <Navbar />

      <main className="flex-1 min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-premium">
        {/* Background glow effects */}
        <div className="absolute top-1/6 right-1/12 w-[400px] h-[400px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/6 left-1/12 w-[350px] h-[350px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-8">
          <Breadcrumbs items={[{ name: "Products Catalog", url: "/products" }]} />

          {/* Header titles */}
          <div className="flex flex-col gap-4 text-left max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Export <span className="text-gradient-gold">Product Catalog</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Explore our export-ready collection of luxury B2B cotton products, hand-block printed bathrobes, double-bed Jaipuri quilts, and quilted canvas bags. Sourced, stitched, and quality-tested in Anand, Gujarat.
            </p>
          </div>

          {/* Search and Category Filter Section */}
          <div className="flex flex-col gap-8 p-6 rounded-3xl border border-slate-200/60 glass-panel backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Search form component */}
              <Suspense fallback={<div className="h-12 w-64 bg-slate-100/60 animate-pulse rounded-full" />}>
                <SearchInput />
              </Suspense>

              {/* Status metrics summary */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-accent-blue" />
                <span>Showing {products.length} of {total} products matching search</span>
              </div>
            </div>

            {/* Category Filter buttons */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent-gold" />
                Select Category Segment
              </span>
              <div className="flex flex-wrap gap-2.5">
                {/* 'All' Button */}
                <Link
                  href={getFilterUrl(null)}
                  className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 border ${
                    !categoryFilter
                      ? "bg-gradient-to-r from-accent-gold to-[#fef08a] text-black border-transparent shadow-lg shadow-accent-gold/15"
                      : "bg-slate-100/40 border-slate-200 text-slate-500 hover:text-white hover:bg-slate-100/60"
                  }`}
                >
                  All Products
                </Link>

                {/* Categories */}
                {categories.map((cat: any) => {
                  const isActive = categoryFilter.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <Link
                      key={cat.slug}
                      href={getFilterUrl(cat.name)}
                      className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 border ${
                        isActive
                          ? "bg-gradient-to-r from-accent-gold to-[#fef08a] text-black border-transparent shadow-lg shadow-accent-gold/15"
                          : "bg-slate-100/40 border-slate-200 text-slate-500 hover:text-white hover:bg-slate-100/60"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          {products.length === 0 ? (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-200 bg-slate-100/40 flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-slate-100/60 text-accent-gold">
                <RefreshCw className="w-8 h-8 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">No products found</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                We couldn&apos;t find any matching export products. Try expanding your keywords or selecting another category segment.
              </p>
              <Link
                href="/products"
                className="mt-2 text-xs uppercase tracking-wider font-semibold text-accent-blue hover:text-slate-900 transition-colors"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any, index: number) => {
                const mainImage = product.images?.[0] || "/placeholder.jpg";
                return (
                  <div
                    key={product.slug}
                    className="glass-panel rounded-3xl overflow-hidden group hover:border-slate-300/60 transition-all duration-500 flex flex-col justify-between"
                  >
                    {/* Header Image Frame */}
                    <div className="h-64 relative overflow-hidden bg-slate-900 shrink-0">
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030810] via-[#030810]/20 to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono bg-black/60 border border-slate-200 text-accent-gold uppercase tracking-wider">
                        {product.category}
                      </div>
                    </div>

                    {/* Meta info & Description */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-8">
                      <div className="flex flex-col gap-3 text-left">
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-accent-blue transition-colors duration-300 line-clamp-1">
                          {product.name}
                        </h2>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        {/* Bullet point previews (first 2 features) */}
                        {product.features && product.features.length > 0 && (
                          <ul className="text-xs text-slate-400 flex flex-col gap-1.5 text-left pl-1">
                            {product.features.slice(0, 2).map((feat: string, idx: number) => (
                              <li key={idx} className="flex gap-2 items-center truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <Link
                          href={`/products/${product.slug}`}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-accent-gold hover:text-black transition-colors duration-300 shadow-md"
                        >
                          View Specifications
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-8 mt-4 font-mono text-xs">
              <Link
                href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100/40 text-slate-600 transition-colors ${
                  currentPage === 1
                    ? "pointer-events-none opacity-30"
                    : "hover:bg-slate-100/60 hover:text-white"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Page
              </Link>

              <span className="text-slate-400 font-mono">
                Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
                <strong className="text-slate-900">{totalPages}</strong>
              </span>

              <Link
                href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100/40 text-slate-600 transition-colors ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-30"
                    : "hover:bg-slate-100/60 hover:text-white"
                }`}
              >
                Next Page
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
