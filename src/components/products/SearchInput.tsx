"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  // Update input value if search param changes elsewhere
  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value);
      params.delete("page"); // Reset page on new search
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search product name, slug, or details..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-12 pr-10 py-3.5 rounded-full text-sm font-sans text-slate-900 placeholder-gray-500 bg-slate-100/60 border border-slate-200 focus:border-accent-blue focus:outline-none transition-colors duration-300 backdrop-blur-sm"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}
