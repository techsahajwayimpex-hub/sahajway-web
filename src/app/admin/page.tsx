import React from "react";
import Link from "next/link";
import { ShoppingBag, Layers, Users, Mail, ArrowRight, Clock } from "lucide-react";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import CategoryModel from "@/lib/models/Category";
import TeamMemberModel from "@/lib/models/TeamMember";
import InquiryModel from "@/lib/models/Inquiry";

export const revalidate = 0;

async function getDashboardStats() {
  if (isUsingMockDB) {
    const db = readMockDB();
    return {
      products: db.products.length,
      categories: db.categories.length,
      team: db.team.length,
      inquiries: db.inquiries.length,
      recentInquiries: db.inquiries.slice(0, 4),
    };
  }

  try {
    await connectDB();
    const [prodCount, catCount, teamCount, inqCount, recentInqs] = await Promise.all([
      ProductModel.countDocuments(),
      CategoryModel.countDocuments(),
      TeamMemberModel.countDocuments(),
      InquiryModel.countDocuments(),
      InquiryModel.find().sort({ createdAt: -1 }).limit(4).lean(),
    ]);

    return {
      products: prodCount,
      categories: catCount,
      team: teamCount,
      inquiries: inqCount,
      recentInquiries: JSON.parse(JSON.stringify(recentInqs)),
    };
  } catch (err) {
    console.error("Failed to query dashboard database counters. Using mock fallback:", err);
    const db = readMockDB();
    return {
      products: db.products.length,
      categories: db.categories.length,
      team: db.team.length,
      inquiries: db.inquiries.length,
      recentInquiries: db.inquiries.slice(0, 4),
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Products", value: stats.products, icon: ShoppingBag, color: "text-accent-blue" },
    { label: "Total Categories", value: stats.categories, icon: Layers, color: "text-accent-gold" },
    { label: "Active Team Members", value: stats.team, icon: Users, color: "text-green-400" },
    { label: "B2B Client Inquiries", value: stats.inquiries, icon: Mail, color: "text-cyan-400" },
  ];

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 text-sm">
          Analytics dashboard monitoring products, categories, team listings, and trade communication pipelines.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200/60 bg-slate-100/40 flex items-center justify-between hover:border-slate-200 transition-all duration-300"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono uppercase text-slate-400">{card.label}</span>
                <span className="text-3xl font-bold text-slate-900 tracking-tight mt-1">{card.value}</span>
              </div>
              <div className={`p-4 rounded-xl bg-slate-100/60 border border-slate-200 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Grid: Recent inquiries and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Inquiries Panel */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-slate-200/60 bg-slate-100/40 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">
              Recent Trade Inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="group flex items-center gap-1.5 text-xs font-semibold text-accent-blue hover:text-slate-900 transition-colors"
            >
              Manage Inquiries
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {stats.recentInquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No inquiries logged yet. Active B2B submissions will populate here.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.recentInquiries.map((inq: any) => (
                <div
                  key={inq._id}
                  className="p-4 rounded-xl border border-slate-200/60 glass-panel flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left hover:border-slate-200 transition-colors"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-slate-900">
                      {inq.name} <span className="text-slate-400 font-normal">({inq.companyName || "Personal"})</span>
                    </span>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="text-accent-blue font-mono font-medium">{inq.productInterest}</span>
                      <span>{inq.country}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-200/60 bg-slate-100/40 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-wide border-b border-slate-200/60 pb-4 text-left">
            CMS Quick Actions
          </h2>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/products?action=new"
              className="py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-black bg-[#d4af37] hover:bg-[#e5a93c] transition-colors text-center shadow-md shadow-[#d4af37]/10"
            >
              Add New Product
            </Link>
            
            <Link
              href="/admin/categories?action=new"
              className="py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-900 border border-slate-200 hover:bg-slate-100/60 transition-colors text-center"
            >
              Add New Category
            </Link>

            <Link
              href="/admin/team?action=new"
              className="py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-900 border border-slate-200 hover:bg-slate-100/60 transition-colors text-center"
            >
              Register Board Director
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
