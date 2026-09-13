"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Search, Download, Eye, Trash2, X, ChevronDown, ChevronUp, ChevronsUpDown, Calendar, Globe, Mail, Phone, Building, Loader2 } from "lucide-react";
import { deleteInquiry } from "@/app/actions/inquiry";

interface Inquiry {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  productInterest: string;
  message: string;
  createdAt: string;
}

interface InquiryCMSClientProps {
  inquiries: Inquiry[];
}

const columnHelper = createColumnHelper<Inquiry>();

export default function InquiryCMSClient({ inquiries }: InquiryCMSClientProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    setDeletingId(id);
    try {
      await deleteInquiry(id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete inquiry");
    } finally {
      setDeletingId(null);
    }
  };

  // Extract unique countries and products for dropdown filters
  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(inquiries.map((i) => i.country))).filter(Boolean).sort();
  }, [inquiries]);

  const uniqueProducts = useMemo(() => {
    return Array.from(new Set(inquiries.map((i) => i.productInterest))).filter(Boolean).sort();
  }, [inquiries]);

  // Client side CSV generator and trigger download
  const handleExportCSV = () => {
    if (inquiries.length === 0) return;

    const headers = ["Inquiry ID", "Name", "Company Name", "Email", "Phone", "Country", "Product Interest", "Message", "Submission Date"];
    
    const rows = inquiries.map((inq) => [
      `"${inq._id}"`,
      `"${inq.name.replace(/"/g, '""')}"`,
      `"${(inq.companyName || "").replace(/"/g, '""')}"`,
      `"${inq.email.replace(/"/g, '""')}"`,
      `"${inq.phone.replace(/"/g, '""')}"`,
      `"${inq.country.replace(/"/g, '""')}"`,
      `"${(inq.productInterest || "").replace(/"/g, '""')}"`,
      `"${inq.message.replace(/"/g, '""')}"`,
      `"${new Date(inq.createdAt).toISOString()}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sahajway_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter inquiries data based on select dropdowns
  const filteredData = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchCountry = !countryFilter || inq.country.toLowerCase() === countryFilter.toLowerCase();
      const matchProduct = !productFilter || inq.productInterest.toLowerCase() === productFilter.toLowerCase();
      return matchCountry && matchProduct;
    });
  }, [inquiries, countryFilter, productFilter]);

  // Define Columns for TanStack Table
  const columns = useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => (
          <span className="font-mono text-xs whitespace-nowrap">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="flex flex-col gap-0.5 text-left">
            <span className="font-semibold text-slate-900 leading-none">{info.getValue()}</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">{info.row.original.companyName || "Personal"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Contact Channels",
        cell: (info) => (
          <div className="flex flex-col gap-0.5 text-left text-[11px] font-mono text-slate-500">
            <span>{info.getValue()}</span>
            <span>{info.row.original.phone}</span>
          </div>
        ),
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: (info) => <span className="font-semibold text-slate-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor("productInterest", {
        header: "Product Interest",
        cell: (info) => (
          <span className="text-xs font-mono text-accent-blue bg-accent-blue/5 border border-accent-blue/10 px-2 py-0.5 rounded">
            {info.getValue() || "General"}
          </span>
        ),
      }),
      columnHelper.accessor("message", {
        header: "Message Segment",
        cell: (info) => (
          <span className="max-w-[150px] truncate text-slate-500 block">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedInquiry(info.row.original)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 cursor-pointer"
              title="Read Inquiry Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original._id)}
              disabled={deletingId === info.row.original._id}
              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer disabled:opacity-50"
              title="Delete Inquiry"
            >
              {deletingId === info.row.original._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  // Initialize TanStack Table Hook
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-8 text-left relative">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">B2B Inquiries</h1>
          <p className="text-slate-500 text-sm">
            Review wholesale purchasing inquiries, export quotes requested, and corporate partnerships proposals.
          </p>
        </div>

        {inquiries.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Dynamic Search & Filters Toolbar */}
      <div className="p-5 rounded-2xl border border-slate-200/60 bg-slate-100/40 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search name, company, email or details..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-sans text-slate-900 bg-slate-100/60 border border-slate-200 focus:border-accent-blue focus:outline-none transition-colors"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Filters Select */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Country */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl glass-panel border border-slate-200 text-slate-900 text-xs focus:border-accent-blue focus:outline-none transition-colors"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Product Interest */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl glass-panel border border-slate-200 text-slate-900 text-xs focus:border-accent-blue focus:outline-none transition-colors"
          >
            <option value="">All Products</option>
            {uniqueProducts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TanStack Data Table */}
      <div className="rounded-2xl border border-slate-200/60 bg-slate-100/40 overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No trade inquiries found matching selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-slate-200/60 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-white/1"
                  >
                    {headerGroup.headers.map((header) => {
                      const isSorted = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={`p-4 first:pl-6 last:pr-6 font-semibold select-none cursor-pointer ${
                            header.column.getCanSort() ? "hover:text-white" : ""
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="text-gray-600">
                                {isSorted === "asc" ? (
                                  <ChevronUp className="w-3 h-3 text-accent-blue" />
                                ) : isSorted === "desc" ? (
                                  <ChevronDown className="w-3 h-3 text-accent-gold" />
                                ) : (
                                  <ChevronsUpDown className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-white/5">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-white/1 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 first:pl-6 last:pr-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Table Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200/60 pt-5 font-mono text-xs text-slate-400">
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100/40 disabled:opacity-20 hover:text-slate-900"
            >
              Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100/40 disabled:opacity-20 hover:text-slate-900"
            >
              Next
            </button>
          </div>

          <span>
            Page <strong className="text-slate-900">{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong className="text-slate-900">{table.getPageCount()}</strong>
          </span>
        </div>
      )}

      {/* DETAIL MODAL DRAWER */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 glass-panel backdrop-blur-md" onClick={() => setSelectedInquiry(null)} />
          
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-[#0a2540]/50 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-mono text-accent-gold uppercase tracking-widest leading-none">Inquiry Inspector</span>
                <h3 className="text-lg font-bold text-slate-900 leading-none mt-1">B2B Specifications</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5 text-sm">
              {/* Row 1: Name and Company */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-lg bg-slate-100/60 text-slate-500">
                  <Building className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Sender Client</span>
                  <span className="font-semibold text-slate-900">{selectedInquiry.name}</span>
                  <span className="text-xs text-accent-blue">{selectedInquiry.companyName || "Personal Sourcing"}</span>
                </div>
              </div>

              {/* Row 2: Contact channels */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-lg bg-slate-100/60 text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Communications</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-slate-900 hover:text-accent-blue transition-colors font-mono text-xs">{selectedInquiry.email}</a>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-slate-500 hover:text-slate-900 transition-colors font-mono text-xs mt-0.5">{selectedInquiry.phone}</a>
                </div>
              </div>

              {/* Row 3: Destination country */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-lg bg-slate-100/60 text-slate-500">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Geographics</span>
                  <span className="text-slate-900 font-semibold">{selectedInquiry.country}</span>
                </div>
              </div>

              {/* Row 4: Product interest */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-lg bg-slate-100/60 text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Requested Segment</span>
                  <span className="text-accent-gold font-mono font-medium">{selectedInquiry.productInterest || "General"}</span>
                </div>
              </div>

              {/* Message block */}
              <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-slate-200/60 bg-black/30">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Client Specifications Message:</span>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap mt-1">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200/60 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-accent-gold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
