import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

const isClerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

export default function SignInPage() {
  if (!isClerkConfigured) {
    return (
      <main className="flex-1 min-h-screen flex items-center justify-center bg-background py-12 px-4 relative overflow-hidden">
        {/* Decorative background grids & glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />
        
        <div className="relative w-full max-w-md">
          {/* Glass Card */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/60 glass-panel backdrop-blur-xl flex flex-col items-center text-center shadow-2xl relative z-10">
            {/* Logo Typographic */}
            <div className="flex flex-col items-center gap-1.5 mb-8">
              <span className="text-2xl font-black tracking-widest text-slate-900 uppercase font-sans">
                SAHAJWAY<span className="text-[#00D4FF]">.</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] font-mono text-accent-gold uppercase">
                Premium Global Portal
              </span>
            </div>

            {/* Sandbox Icon */}
            <div className="w-14 h-14 rounded-2xl bg-slate-100/60 border border-slate-200 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-[#00D4FF]" />
            </div>

            {/* Text details */}
            <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
              Developer Auth Sandbox
            </h2>
            
            <p className="text-slate-500 text-xs leading-relaxed mb-8 max-w-xs font-sans">
              Clerk authentication is not configured in <code className="text-[#00D4FF] bg-slate-100/60 px-1.5 py-0.5 rounded font-mono">.env.local</code>. Operating in local mock bypass mode.
            </p>

            {/* Action buttons */}
            <Link
              href="/admin"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-[#fef08a] hover:opacity-95 transition-opacity shadow-lg shadow-accent-gold/15"
            >
              Bypass to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="mt-4 text-xs font-mono text-slate-400 hover:text-slate-900 transition-colors"
            >
              &larr; Back to public site
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="relative">
        {/* Glow backdrop */}
        <div className="absolute -inset-10 rounded-full bg-glow-blue opacity-8 filter blur-3xl" />
        <div className="relative z-10">
          <SignIn />
        </div>
      </div>
    </main>
  );
}
