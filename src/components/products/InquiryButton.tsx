"use client";

import React, { useState } from "react";
import { Mail, ShoppingBag } from "lucide-react";
import InquiryModal from "./InquiryModal";

interface InquiryButtonProps {
  productName: string;
}

export default function InquiryButton({ productName }: InquiryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:scale-[1.01] hover:opacity-90 active:scale-[0.99] transition-all duration-300 shadow-lg shadow-accent-gold/15"
      >
        <Mail className="w-4.5 h-4.5 animate-pulse" />
        Request Export Quote
      </button>

      <InquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        productName={productName}
      />
    </>
  );
}
