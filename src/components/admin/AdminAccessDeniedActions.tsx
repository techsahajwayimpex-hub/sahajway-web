"use client";

import React from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const isClerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

interface AdminAccessDeniedActionsProps {
  userEmail: string | null;
}

export default function AdminAccessDeniedActions({ userEmail }: AdminAccessDeniedActionsProps) {
  const router = useRouter();
  const clerk = isClerkConfigured ? useClerk() : null;

  const handleSwitchAccount = async () => {
    if (clerk) {
      await clerk.signOut({ redirectUrl: "/sign-in" });
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div className="flex gap-4 w-full">
      <Link
        href="/"
        className="flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 border border-slate-200 bg-slate-100/40 text-center hover:bg-slate-100/60 transition-colors flex items-center justify-center"
      >
        Public Site
      </Link>
      {userEmail ? (
        <button
          type="button"
          onClick={handleSwitchAccount}
          className="flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 bg-white border border-slate-200 text-center hover:bg-slate-50 shadow-sm transition-colors cursor-pointer flex items-center justify-center"
        >
          Switch Account
        </button>
      ) : (
        <Link
          href="/sign-in"
          className="flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 bg-white border border-slate-200 text-center hover:bg-slate-50 shadow-sm transition-colors flex items-center justify-center"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
