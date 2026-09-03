"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, Upload, X, Loader2, PlusCircle, MinusCircle } from "lucide-react";
import { createProduct, updateProduct, deleteProduct, toggleProductStatus } from "@/app/actions/product";
import TipTapEditor from "./TipTapEditor";

interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  images: string[];
  specifications: string[];
  features: string[];
  exportInformation: string;
  seoTitle: string;
  seoDescription: string;
  status: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductCMSClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductCMSClient({ initialProducts, categories }: ProductCMSClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [exportInformation, setExportInformation] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState(true);

  // Specifications state: list of "Key: Value"
  const [specifications, setSpecifications] = useState<string[]>([]);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecVal, setNewSpecVal] = useState("");

  // Features state: list of highlight strings
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  // Images state: existing image urls and new base64 image files
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<string[]>([]); // base64 strings

  const [isPending, startTransition] = useTransition();
  const [errorBanner, setErrorBanner] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setNewImagePreviews((prev) => [...prev, base64]);
          setNewImageFiles((prev) => [...prev, base64]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewImage = (idx: number) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecVal.trim()) {
      setSpecifications((prev) => [...prev, `${newSpecKey.trim()}: ${newSpecVal.trim()}`]);
      setNewSpecKey("");
      setNewSpecVal("");
    }
  };

  const removeSpecification = (idx: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== idx));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategory(categories[0]?.name || "");
    setShortDescription("");
    setDescription("");
    setSpecifications([]);
    setFeatures([]);
    setExportInformation("");
    setSeoTitle("");
    setSeoDescription("");
    setStatus(true);
    setExistingImages([]);
    setNewImagePreviews([]);
    setNewImageFiles([]);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setCategory(prod.category);
    setShortDescription(prod.shortDescription);
    setDescription(prod.description);
    setSpecifications(prod.specifications || []);
    setFeatures(prod.features || []);
    setExportInformation(prod.exportInformation || "");
    setSeoTitle(prod.seoTitle || "");
    setSeoDescription(prod.seoDescription || "");
    setStatus(prod.status);
    setExistingImages(prod.images || []);
    setNewImagePreviews([]);
    setNewImageFiles([]);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner("");

    if (!name.trim()) return setErrorBanner("Product Name is required");
    if (!slug.trim()) return setErrorBanner("Product Slug is required");
    if (!category) return setErrorBanner("Product Category is required");
    if (!editingProduct && newImageFiles.length === 0) return setErrorBanner("At least one product image is required");

    startTransition(async () => {
      let res;
      if (editingProduct) {
        res = await updateProduct(editingProduct._id, {
          name,
          slug,
          shortDescription,
          description,
          category,
          images: existingImages,
          imageFiles: newImageFiles,
          specifications,
          features,
          exportInformation,
          seoTitle,
          seoDescription,
          status,
        });
      } else {
        res = await createProduct({
          name,
          slug,
          shortDescription,
          description,
          category,
          imageFiles: newImageFiles,
          specifications,
          features,
          exportInformation,
          seoTitle,
          seoDescription,
          status,
        });
      }

      if (res.success) {
        window.location.reload();
      } else {
        setErrorBanner(res.message || "Failed to save product details");
      }
    });
  };

  const handleDelete = async (id: string, imgs: string[], slug: string) => {
    if (!confirm(`Are you sure you want to delete ${slug}? This will remove all image attachments.`)) return;

    startTransition(async () => {
      const res = await deleteProduct(id, imgs, slug);
      if (res.success) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert(res.message || "Failed to delete product");
      }
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, slug: string) => {
    const newStatus = !currentStatus;
    setProducts(products.map((p) => (p._id === id ? { ...p, status: newStatus } : p)));

    const res = await toggleProductStatus(id, newStatus, slug);
    if (!res.success) {
      setProducts(products.map((p) => (p._id === id ? { ...p, status: currentStatus } : p)));
      alert(res.message || "Failed to toggle status");
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Overview Headings */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 text-sm">
            Manage product catalog specifications, rich descriptions, and photo galleries.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 cursor-pointer shadow-lg shadow-accent-gold/15"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>

      {errorBanner && (
        <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 text-red-400 text-xs font-mono">
          {errorBanner}
        </div>
      )}

      {/* CRUD PRODUCT FORM */}
      {isFormOpen && (
        <div className="p-8 rounded-3xl border border-slate-200/60 bg-slate-100/40 flex flex-col gap-6 max-w-3xl">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">
              {editingProduct ? "Modify Product Details" : "Register New Product"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            {/* ROW 1: Name, Slug & Category dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Jaipuri Quilts"
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
                  placeholder="jaipuri-quilts"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3.5 rounded-xl glass-panel border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name} className="bg-slate-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROW 2: Short Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Short Description
              </label>
              <input
                type="text"
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief single-sentence product summary displayed in listings..."
                className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
              />
            </div>

            {/* ROW 3: TipTap Rich Text Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Detailed Narrative Copy
              </label>
              <TipTapEditor value={description} onChange={setDescription} />
            </div>

            {/* ROW 4: Image Gallery uploader */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Photo Gallery / Attachments
              </label>
              
              {/* Display existing images */}
              {existingImages.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Existing Images:</span>
                  <div className="flex flex-wrap gap-3">
                    {existingImages.map((url, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200/60 relative group shrink-0 bg-slate-900">
                        <Image src={url} alt="Gallery" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload controls */}
              <div className="flex items-center gap-6 mt-1">
                {newImagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {newImagePreviews.map((preview, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 relative group shrink-0">
                        <Image src={preview} alt="New" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <label className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-100/60 hover:bg-white/10 text-xs font-mono text-slate-600 hover:text-slate-900 cursor-pointer transition-all flex items-center gap-2 shrink-0">
                  <Upload className="w-4 h-4" />
                  Upload Photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* ROW 5: Specifications & Features dynamic list builders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specifications Builder */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-200/60 bg-white/1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Specifications List (e.g. Dimensions, Weight)
                </span>
                
                {/* Current Specifications */}
                {specifications.length > 0 && (
                  <ul className="flex flex-col gap-2 text-xs text-slate-600 bg-black/25 p-3 rounded-xl max-h-40 overflow-y-auto">
                    {specifications.map((spec, idx) => (
                      <li key={idx} className="flex justify-between items-center gap-2">
                        <span className="truncate">{spec}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecification(idx)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add new Specification inputs */}
                <div className="flex gap-2 items-center mt-1">
                  <input
                    type="text"
                    placeholder="Key (e.g. Material)"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-100/60 border border-slate-200 text-slate-900 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 100% Cotton)"
                    value={newSpecVal}
                    onChange={(e) => setNewSpecVal(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-100/60 border border-slate-200 text-slate-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="p-2 bg-slate-100/60 text-accent-blue rounded-lg border border-slate-200"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Features Highlights Builder */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-200/60 bg-white/1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Highlight Highlights (e.g. Washable, Organic)
                </span>

                {/* Current features list */}
                {features.length > 0 && (
                  <ul className="flex flex-col gap-2 text-xs text-slate-600 bg-black/25 p-3 rounded-xl max-h-40 overflow-y-auto">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex justify-between items-center gap-2">
                        <span className="truncate">{feat}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add new feature input */}
                <div className="flex gap-2 items-center mt-1">
                  <input
                    type="text"
                    placeholder="Highlight highlight feature copy..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-100/60 border border-slate-200 text-slate-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="p-2 bg-slate-100/60 text-accent-gold rounded-lg border border-slate-200"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ROW 6: Export Information */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Logistics & Export Parameters
              </label>
              <textarea
                value={exportInformation}
                onChange={(e) => setExportInformation(e.target.value)}
                rows={2}
                placeholder="Include MOQ details, loading ports, lead times, freight terms (FOB/CIF)..."
                className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* ROW 7: SEO Meta Titles & Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  SEO Title Tag
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Jaipuri Quilts B2B Exporter India"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  SEO Description tag
                </label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Bulk sourcing jaipuri hand quilted quilts..."
                  className="px-4 py-3.5 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* ROW 8: Published Status Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="prodStatus"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-200 text-accent-gold bg-slate-100/60 focus:ring-0"
              />
              <label htmlFor="prodStatus" className="text-xs font-semibold text-slate-600 select-none">
                Publish publicly on export catalog listings
              </label>
            </div>

            {/* Actions */}
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
                    Saving Product...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCTS TABLE LIST */}
      {!isFormOpen && (
        <div className="rounded-2xl border border-slate-200/60 bg-slate-100/40 overflow-hidden">
          {products.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No products found in the catalog. Click &quot;Add Product&quot; to register your first.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200/60 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-white/1">
                    <th className="p-4 pl-6">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Short Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => {
                    const mainImage = p.images?.[0] || "/placeholder.jpg";
                    return (
                      <tr key={p._id} className="hover:bg-white/1 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200/60 relative bg-slate-900">
                            <Image src={mainImage} alt={p.name} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-900 truncate max-w-[160px]">{p.name}</td>
                        <td className="p-4">
                          <span className="text-xs font-mono text-[#00d4ff] bg-[#00d4ff]/5 border border-[#00d4ff]/10 px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-500">{p.shortDescription}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(p._id, p.status, p.slug)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                              p.status
                                ? "bg-green-500/5 border-green-500/20 text-green-400"
                                : "bg-gray-500/5 border-gray-500/20 text-slate-500"
                            }`}
                          >
                            {p.status ? (
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
                              onClick={() => openEditForm(p)}
                              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer"
                              aria-label="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id, p.images, p.slug)}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
                              aria-label="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
