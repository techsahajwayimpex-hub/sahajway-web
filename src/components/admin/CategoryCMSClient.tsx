"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, Upload, X, Loader2 } from "lucide-react";
import { createCategory, updateCategory, deleteCategory, toggleCategoryStatus } from "@/app/actions/category";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  status: boolean;
}

interface CategoryCMSClientProps {
  initialCategories: Category[];
}

export default function CategoryCMSClient({ initialCategories }: CategoryCMSClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null); // base64 representation
  
  const [isPending, startTransition] = useTransition();
  const [errorBanner, setErrorBanner] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      // Auto generate slug for new categories
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageData(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setStatus(true);
    setImagePreview(null);
    setImageData(null);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const openEditForm = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setStatus(cat.status);
    setImagePreview(cat.image);
    setImageData(null); // No new image upload yet
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner("");

    if (!name.trim()) return setErrorBanner("Category Name is required");
    if (!slug.trim()) return setErrorBanner("Category Slug is required");
    if (!editingCategory && !imageData) return setErrorBanner("Category Image is required");

    startTransition(async () => {
      let res;
      if (editingCategory) {
        // Edit category
        res = await updateCategory(editingCategory._id, {
          name,
          slug,
          image: editingCategory.image,
          imageData: imageData || undefined,
          description,
          status,
        });
      } else {
        // Create category
        res = await createCategory({
          name,
          slug,
          imageData: imageData || undefined,
          description,
          status,
        });
      }

      if (res.success) {
        // Simulate immediate clientside reload by refreshing categories local state
        // In next navigation refresh, it will come directly from server.
        window.location.reload();
      } else {
        setErrorBanner(res.message || "Failed to submit category form");
      }
    });
  };

  const handleDelete = async (id: string, img: string) => {
    if (!confirm("Are you sure you want to delete this category? All products under it might lose category assignments.")) return;
    
    startTransition(async () => {
      const res = await deleteCategory(id, img);
      if (res.success) {
        setCategories(categories.filter(c => c._id !== id));
      } else {
        alert(res.message || "Failed to delete category");
      }
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic update
    setCategories(categories.map(c => c._id === id ? { ...c, status: newStatus } : c));

    const res = await toggleCategoryStatus(id, newStatus);
    if (!res.success) {
      // Revert if error
      setCategories(categories.map(c => c._id === id ? { ...c, status: currentStatus } : c));
      alert(res.message || "Failed to toggle category status");
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 text-sm">
            Configure segment categories to organize and display export product lines.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-accent-gold/10"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {/* ERROR BANNER */}
      {errorBanner && (
        <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 text-red-400 text-xs font-mono">
          {errorBanner}
        </div>
      )}

      {/* CRUD Form overlay or drawer */}
      {isFormOpen && (
        <div className="p-8 rounded-3xl border border-slate-200/60 bg-slate-100/40 flex flex-col gap-6 max-w-2xl">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">
              {editingCategory ? "Modify Category Details" : "Register New Category"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            {/* Input row 1: Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Home Decor"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. home-decor"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Input row 2: Image upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Category Image Representative
              </label>
              
              <div className="flex items-center gap-6">
                {/* Preview frame */}
                {imagePreview ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 relative shrink-0">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl border border-dashed border-slate-300/60 bg-slate-100/40 flex items-center justify-center text-gray-600 shrink-0">
                    <Upload className="w-6 h-6" />
                  </div>
                )}

                {/* Upload inputs */}
                <div className="flex flex-col gap-1.5 items-start">
                  <label className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100/60 hover:bg-white/10 text-xs font-mono text-slate-600 hover:text-slate-900 cursor-pointer transition-all">
                    Choose Image File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[9px] text-slate-400 font-mono">
                    PNG, JPG, or WEBP. Cloudinary auto-optimization is active.
                  </span>
                </div>
              </div>
            </div>

            {/* Input row 3: Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Segment Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide details about the category segment..."
                className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Input row 4: Status Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="status"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-200 text-accent-gold bg-slate-100/60 focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="status" className="text-xs font-semibold text-slate-600 select-none">
                Publish publicly on catalog filters
              </label>
            </div>

            {/* Form actions */}
            <div className="flex gap-3 border-t border-slate-200/60 pt-5 mt-2 justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category List Table */}
      {!isFormOpen && (
        <div className="rounded-2xl border border-slate-200/60 bg-slate-100/40 overflow-hidden">
          {categories.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No categories registered yet. Click &quot;Add Category&quot; to begin.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200/60 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-white/1">
                    <th className="p-4 pl-6">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-white/1 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200/60 relative bg-slate-900">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-900">{cat.name}</td>
                      <td className="p-4 font-mono text-xs text-accent-blue">{cat.slug}</td>
                      <td className="p-4 max-w-xs truncate text-slate-500">{cat.description}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(cat._id, cat.status)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                            cat.status
                              ? "bg-green-500/5 border-green-500/20 text-green-400"
                              : "bg-gray-500/5 border-gray-500/20 text-slate-500"
                          }`}
                        >
                          {cat.status ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEditForm(cat)}
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer"
                            aria-label="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id, cat.image)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
                            aria-label="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
