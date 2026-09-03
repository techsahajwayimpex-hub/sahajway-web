import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Layers, ShoppingBag, Users, Mail, ArrowLeft, ShieldAlert } from "lucide-react";
import Logo from "@/components/ui/Logo";
import AdminSignOutButton from "@/components/admin/SignOutButton";
import { getAdminSession } from "@/lib/auth";

export const revalidate = 0;

const menuItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Team Members", href: "/admin/team", icon: Users },
  { label: "B2B Inquiries", href: "/admin/inquiries", icon: Mail },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Enforce session check
  if (!session.isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl border border-red-500/10 bg-red-500/5 flex flex-col items-center gap-5 text-center">
          <div className="p-3 rounded-full bg-red-500/10 text-red-400">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your account ({session.email || "Guest"}) does not have administrator privileges to access the trade CMS. Please sign in with an approved corporate email.
          </p>
          <div className="flex gap-4 w-full">
            <Link
              href="/"
              className="flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 border border-slate-200 bg-slate-100/40 text-center hover:bg-slate-100/60"
            >
              Public Site
            </Link>
            <Link
              href="/sign-in"
              className="flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-white text-center hover:bg-gray-100"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-slate-600 font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-slate-200/60 bg-background flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-20">
        <div className="flex flex-col gap-8 p-6">
          {/* Logo Brand */}
          <Link href="/admin" className="focus:outline-none">
            <Logo />
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 text-left">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100/60 transition-all w-full text-left"
                >
                  <IconComp className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-200/60 flex flex-col gap-4 text-left">
          {session.isMock && (
            <div className="px-3 py-2 rounded-lg bg-accent-gold/5 border border-accent-gold/15 text-[10px] font-mono text-accent-gold leading-relaxed">
              ⚡ RUNNING IN MOCK BYPASS MODE
            </div>
          )}
          
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100/60 transition-all w-full text-left"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Public Website</span>
          </Link>
          
          <AdminSignOutButton />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200/60 px-8 flex items-center justify-between shrink-0 relative z-10 bg-background">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            <span>Authorized: <strong className="text-slate-900">{session.email}</strong></span>
          </div>
          <div className="text-[10px] font-mono text-accent-gold uppercase tracking-wider bg-accent-gold/5 px-2.5 py-1 border border-accent-gold/10 rounded">
            Corporate Admin Panel
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="p-8 flex-1 min-h-[calc(100vh-64px)] relative overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
