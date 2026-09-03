"use client";

import React, { useActionState, useEffect } from "react";
import { submitInquiry, InquiryFormState } from "@/app/actions/inquiry";
import { Send, Loader2, CheckCircle, Globe } from "lucide-react";
import confetti from "canvas-confetti";

const initialState: InquiryFormState = {
  success: false,
  message: "",
  errors: {},
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState);

  // Trigger confetti particles on successful submission
  useEffect(() => {
    if (state?.success) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#d4af37", "#00d4ff", "#ffffff"],
      });
    }
  }, [state?.success]);

  return (
    <div className="glass-panel p-8 md:p-10 rounded-3xl w-full text-left relative overflow-hidden">
      {state?.success ? (
        <div className="py-12 flex flex-col items-center gap-6 text-center">
          <div className="p-4 rounded-full bg-accent-gold/10 text-accent-gold">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-slate-900">Inquiry Received</h3>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              {state.message}
            </p>
          </div>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-5">
          {state?.message && !state.success && (
            <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 text-red-400 text-xs font-mono">
              {state.message}
            </div>
          )}

          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Full Name <span className="text-accent-gold">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="John Doe"
                className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
              {state?.errors?.name && (
                <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.name[0]}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="companyName" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Company Name <span className="text-accent-gold">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                required
                placeholder="Enterprise Import LLC"
                className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
              {state?.errors?.companyName && (
                <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.companyName[0]}</span>
              )}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Corporate Email <span className="text-accent-gold">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="john@company.com"
                className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
              {state?.errors?.email && (
                <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.email[0]}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Phone Number <span className="text-accent-gold">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                placeholder="+1 (555) 019-2834"
                className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
              {state?.errors?.phone && (
                <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.phone[0]}</span>
              )}
            </div>
          </div>

          {/* Row 3: Destination Country & Product Interest */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Destination Country <span className="text-accent-gold">*</span>
              </label>
              <input
                type="text"
                name="country"
                id="country"
                required
                placeholder="United States"
                className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
              {state?.errors?.country && (
                <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.country[0]}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="productInterest" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Product Interest / Segment <span className="text-accent-gold">*</span>
              </label>
              <input
                type="text"
                name="productInterest"
                id="productInterest"
                required
                placeholder="Baby Bathrobes, Jaipuri Quilts, Canvas Bags, etc."
                className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
              {state?.errors?.productInterest && (
                <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.productInterest[0]}</span>
              )}
            </div>
          </div>

          {/* Message textarea */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Inquiry Message <span className="text-accent-gold">*</span>
            </label>
            <textarea
              name="message"
              id="message"
              required
              rows={5}
              placeholder="Provide detailed specifications, fabric preferences, required quantities, target dispatch dates, or pricing structure expectations..."
              className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors resize-none"
            />
            {state?.errors?.message && (
              <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.message[0]}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/60 pt-5 mt-2">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-accent-blue animate-spin-slow" />
              GLOBAL TRADE ROUTING SYSTEM ONLINE
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Dispatching Form...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send B2B Message
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
