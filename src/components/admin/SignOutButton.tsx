"use client";

import React from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

const isClerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

export default function AdminSignOutButton() {
  if (!isClerkConfigured) {
    return (
      <Link
        href="/"
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-400 rounded-xl hover:bg-red-500/5 transition-all w-full"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span>Bypass Dashboard</span>
      </Link>
    );
  }

  return (
    <SignOutButton redirectUrl="/">
      <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-400 rounded-xl hover:bg-red-500/5 transition-all w-full text-left cursor-pointer">
        <LogOut className="w-4 h-4 shrink-0" />
        <span>Sign Out</span>
      </button>
    </SignOutButton>
  );
}
