import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import JsonLd from "./JsonLd";
import { BreadcrumbItem, getBreadcrumbSchema } from "@/lib/seo/schemas";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [{ name: "Home", url: "/" }, ...items];
  const schema = getBreadcrumbSchema(fullItems);

  return (
    <>
      <JsonLd schema={schema} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-xs text-slate-400 font-mono overflow-x-auto py-2 ${className}`}
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-accent-gold transition-colors shrink-0"
          title="Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="sr-only">Home</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={item.url}>
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
              {isLast ? (
                <span
                  className="text-slate-200 font-medium truncate max-w-[240px] sm:max-w-md"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-accent-gold transition-colors truncate max-w-[150px]"
                >
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
