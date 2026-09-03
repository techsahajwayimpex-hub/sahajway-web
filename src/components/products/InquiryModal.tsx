"use client";

import React, { useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2, Send, Globe, Mail, Phone, Landmark } from "lucide-react";
import { submitInquiry, InquiryFormState } from "@/app/actions/inquiry";
import confetti from "canvas-confetti";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const initialState: InquiryFormState = {
  success: false,
  message: "",
  errors: {},
};

export default function InquiryModal({ isOpen, onClose, productName }: InquiryModalProps) {
  // Use React 19 useActionState to connect form to server action
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState);

  // Trigger confetti particles on success
  useEffect(() => {
    if (state?.success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#00d4ff", "#ffffff", "#0a2540"],
      });
    }
  }, [state?.success]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 glass-panel backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-[#0a2540]/40 backdrop-blur-2xl shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col text-left"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200/60 flex items-center justify-between shrink-0">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest leading-none">
                  Trade Inquiry Console
                </span>
                <h3 className="text-xl font-bold text-slate-900 leading-none mt-1.5">
                  Request Export Quote
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {state?.success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 px-4 flex flex-col items-center gap-6 text-center"
                >
                  <div className="p-4 rounded-full bg-accent-gold/10 text-accent-gold">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-2xl font-bold text-slate-900">Inquiry Lodged</h4>
                    <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                      {state.message}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-accent-gold transition-colors duration-300 shadow-md"
                  >
                    Close Console
                  </button>
                </motion.div>
              ) : (
                <form action={formAction} className="flex flex-col gap-5">
                  {/* General submission error banner */}
                  {state?.message && !state.success && (
                    <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 text-xs font-mono">
                      {state.message}
                    </div>
                  )}

                  {/* Row 1: Full Name & Company Name */}
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
                        className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
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
                        placeholder="Enterprise Global Ltd"
                        className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                      />
                      {state?.errors?.companyName && (
                        <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.companyName[0]}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email Address & Phone Number */}
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
                        className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
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
                        placeholder="+1 (555) 123-4567"
                        className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
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
                        className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                      />
                      {state?.errors?.country && (
                        <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.country[0]}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="productInterest" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Product of Interest <span className="text-accent-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="productInterest"
                        id="productInterest"
                        required
                        defaultValue={productName}
                        placeholder="Baby Bathrobes"
                        className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                      />
                      {state?.errors?.productInterest && (
                        <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.productInterest[0]}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Custom Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Export Specifications & Message <span className="text-accent-gold">*</span>
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      required
                      rows={4}
                      placeholder="Please specify estimated volumes, custom sizing parameters, logistics expectations (FOB/CIF), or packaging requirements..."
                      className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors resize-none"
                    />
                    {state?.errors?.message && (
                      <span className="text-[10px] font-mono text-red-400 mt-1">{state.errors.message[0]}</span>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-5 mt-2">
                    <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <Globe className="w-3.5 h-3.5 text-accent-blue animate-spin-slow" />
                      SECURE B2B LINK ACTIVE
                    </div>
                    
                    <div className="flex gap-3 ml-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-colors disabled:opacity-30"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Lodging Quote...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Submit Inquiry
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
