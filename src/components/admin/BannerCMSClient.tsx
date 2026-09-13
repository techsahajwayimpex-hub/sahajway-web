"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Upload,
  X,
  Loader2,
  Sliders,
  Globe,
  ImageIcon,
  Sparkles,
  Layers,
  Link as LinkIcon,
} from "lucide-react";
import {
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from "@/app/actions/banner";

interface Banner {
  _id: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  image: string;
  showGlobe: boolean;
  backgroundColor: string;
  backgroundImage: string;
  displayOrder: number;
  active: boolean;
}

interface BannerCMSClientProps {
  initialBanners: Banner[];
}

const BG_PRESETS = [
  {
    name: "Global Maritime Port",
    url: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2000&q=80",
  },
  {
    name: "Luxury Textile Mill & Weave",
    url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=80",
  },
  {
    name: "Modern Glass Architecture",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  },
  {
    name: "International Ocean Logistics",
    url: "https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?auto=format&fit=crop&w=2000&q=80",
  },
];

export default function BannerCMSClient({
  initialBanners,
}: BannerCMSClientProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form states
  const [badge, setBadge] = useState("Premium Global B2B Exporter");
  const [title, setTitle] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [primaryButtonText, setPrimaryButtonText] = useState("Explore Products");
  const [primaryButtonLink, setPrimaryButtonLink] = useState("/products");
  const [secondaryButtonText, setSecondaryButtonText] = useState("Contact Us");
  const [secondaryButtonLink, setSecondaryButtonLink] = useState("/contact");
  const [showGlobe, setShowGlobe] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("bg-gradient-premium");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [active, setActive] = useState(true);

  // Overlay Image
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null); // base64

  // Background Image
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);
  const [bgImageData, setBgImageData] = useState<string | null>(null); // base64

  const [isPending, startTransition] = useTransition();
  const [errorBanner, setErrorBanner] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageData(base64String);
        setImageUrl("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBgImagePreview(base64String);
        setBgImageData(base64String);
        setBgImageUrl("");
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = () => {
    setEditingBanner(null);
    setBadge("Premium Global B2B Exporter");
    setTitle("");
    setHighlightText("");
    setSubtitle("");
    setPrimaryButtonText("Explore Products");
    setPrimaryButtonLink("/products");
    setSecondaryButtonText("Contact Us");
    setSecondaryButtonLink("/contact");
    setShowGlobe(false);
    setBackgroundColor("bg-gradient-premium");
    setDisplayOrder(banners.length + 1);
    setActive(true);
    setImageUrl("");
    setImagePreview(null);
    setImageData(null);
    setBgImageUrl("");
    setBgImagePreview(null);
    setBgImageData(null);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const openEditForm = (b: Banner) => {
    setEditingBanner(b);
    setBadge(b.badge || "Premium Global B2B Exporter");
    setTitle(b.title);
    setHighlightText(b.highlightText || "");
    setSubtitle(b.subtitle || "");
    setPrimaryButtonText(b.primaryButtonText || "Explore Products");
    setPrimaryButtonLink(b.primaryButtonLink || "/products");
    setSecondaryButtonText(b.secondaryButtonText || "Contact Us");
    setSecondaryButtonLink(b.secondaryButtonLink || "/contact");
    setShowGlobe(b.showGlobe ?? false);
    setBackgroundColor(b.backgroundColor || "bg-gradient-premium");
    setDisplayOrder(b.displayOrder || 0);
    setActive(b.active);
    setImageUrl(b.image || "");
    setImagePreview(b.image || null);
    setImageData(null);
    setBgImageUrl(b.backgroundImage || "");
    setBgImagePreview(b.backgroundImage || null);
    setBgImageData(null);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner("");

    if (!title.trim()) return setErrorBanner("Slide Headline Title is required");
    if (!showGlobe && !imagePreview && !imageData && !imageUrl) {
      return setErrorBanner("Please either select '3D Interactive World Globe' or provide a Slide Image");
    }

    startTransition(async () => {
      let res;
      const finalImage = imageData ? undefined : imageUrl || editingBanner?.image;
      const finalBgImage = bgImageData ? undefined : bgImageUrl || editingBanner?.backgroundImage;

      if (editingBanner) {
        res = await updateBanner(editingBanner._id, {
          badge,
          title,
          highlightText,
          subtitle,
          primaryButtonText,
          primaryButtonLink,
          secondaryButtonText,
          secondaryButtonLink,
          image: finalImage,
          imageData: imageData || undefined,
          showGlobe,
          backgroundColor,
          backgroundImage: finalBgImage,
          backgroundImageData: bgImageData || undefined,
          displayOrder: Number(displayOrder) || 0,
          active,
        });
      } else {
        res = await createBanner({
          badge,
          title,
          highlightText,
          subtitle,
          primaryButtonText,
          primaryButtonLink,
          secondaryButtonText,
          secondaryButtonLink,
          image: finalImage,
          imageData: imageData || undefined,
          showGlobe,
          backgroundColor,
          backgroundImage: finalBgImage,
          backgroundImageData: bgImageData || undefined,
          displayOrder: Number(displayOrder) || 0,
          active,
        });
      }

      if (res.success) {
        window.location.reload();
      } else {
        setErrorBanner(res.message || "Failed to save hero banner slide");
      }
    });
  };

  const handleDelete = async (id: string, img: string, bgImg?: string) => {
    if (!confirm("Are you sure you want to delete this Hero Banner slide?")) return;

    startTransition(async () => {
      const res = await deleteBanner(id, img, bgImg);
      if (res.success) {
        setBanners(banners.filter((b) => b._id !== id));
      } else {
        alert(res.message || "Failed to delete banner");
      }
    });
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    setBanners(
      banners.map((b) => (b._id === id ? { ...b, active: newActive } : b))
    );

    const res = await toggleBannerStatus(id, newActive);
    if (!res.success) {
      setBanners(
        banners.map((b) => (b._id === id ? { ...b, active: currentActive } : b))
      );
      alert(res.message || "Failed to toggle status");
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hero Banner Slider Management
          </h1>
          <p className="text-slate-500 text-sm">
            Dynamically configure hero slides with custom background cover imagery, title/subtitle text overlays, call-to-action buttons, and right-side interactive 3D globe or product visuals.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 cursor-pointer shadow-lg shadow-accent-gold/15"
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </button>
        )}
      </div>

      {errorBanner && (
        <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 text-red-500 text-xs font-mono">
          {errorBanner}
        </div>
      )}

      {/* CRUD FORM */}
      {isFormOpen && (
        <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50 flex flex-col gap-8 max-w-4xl shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200/80 pb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Sliders className="w-5 h-5 text-accent-blue" />
              {editingBanner ? "Modify Hero Slide" : "Create Hero Slide"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            {/* SECTION 1: DYNAMIC BACKGROUND IMAGE */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent-gold" />
                  Hero Slide Background Cover Image
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  Covers entire hero section with cinematic contrast overlay
                </span>
              </div>

              {/* 1-Click Presets */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Quick Presets:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BG_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setBgImageUrl(preset.url);
                        setBgImagePreview(preset.url);
                        setBgImageData(null);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-mono text-slate-700 text-left truncate transition-colors cursor-pointer"
                      title={preset.name}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL or Upload */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                <div className="md:col-span-8 flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Background Image URL (Unsplash or Cloudinary)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={bgImageUrl}
                      onChange={(e) => {
                        setBgImageUrl(e.target.value);
                        setBgImagePreview(e.target.value || null);
                        setBgImageData(null);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-accent-blue focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="md:col-span-4 flex items-center gap-4">
                  {bgImagePreview ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-inner bg-slate-900">
                      <Image src={bgImagePreview} alt="BG preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setBgImagePreview(null);
                          setBgImageData(null);
                          setBgImageUrl("");
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70 text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}

                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-white text-xs font-mono text-slate-700 cursor-pointer transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    Upload BG
                    <input type="file" accept="image/*" onChange={handleBgImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* SECTION 2: TEXT OVERLAY (BADGE, TITLE, HIGHLIGHT, SUBTITLE) */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-blue" />
                Text Overlay & Messaging
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Header Badge Tag
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Premium Global B2B Exporter"
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Gold Highlight Phrase
                  </label>
                  <input
                    type="text"
                    value={highlightText}
                    onChange={(e) => setHighlightText(e.target.value)}
                    placeholder="e.g. Craftsmanship or Luxury Quilts"
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Main Headline (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Connecting Indian Craftsmanship With Global Markets"
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Subtitle / Narrative Copy
                </label>
                <textarea
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Sahajway Impex supplies handcrafted cotton textiles, baby bathrobes..."
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* SECTION 3: RIGHT-SIDE VISUAL OVERLAY (3D GLOBE vs CUSTOM IMAGE) */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-accent-gold" />
                Right-Side Visual Overlay
              </label>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowGlobe(true)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    showGlobe
                      ? "border-accent-blue bg-accent-blue/10 text-accent-blue shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  3D Interactive World Globe
                </button>

                <button
                  type="button"
                  onClick={() => setShowGlobe(false)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    !showGlobe
                      ? "border-accent-gold bg-accent-gold/10 text-accent-gold shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Custom Product / Hero Image
                </button>
              </div>

              {!showGlobe && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                  <div className="md:col-span-8 flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Product Image URL (Unsplash or Cloudinary)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value || null);
                        setImageData(null);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-accent-blue focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-4 flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-inner bg-slate-900">
                        <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageData(null);
                            setImageUrl("");
                          }}
                          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70 text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : null}

                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-white text-xs font-mono text-slate-700 cursor-pointer transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: CTA BUTTONS & SORT ORDER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary CTA */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-accent-gold" />
                  Primary Action Button
                </span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={primaryButtonText}
                    onChange={(e) => setPrimaryButtonText(e.target.value)}
                    placeholder="Button Label (e.g. Explore Products)"
                    className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={primaryButtonLink}
                    onChange={(e) => setPrimaryButtonLink(e.target.value)}
                    placeholder="Target Link (e.g. /products)"
                    className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-accent-blue" />
                  Secondary Action Button
                </span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={secondaryButtonText}
                    onChange={(e) => setSecondaryButtonText(e.target.value)}
                    placeholder="Button Label (e.g. Contact Us)"
                    className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={secondaryButtonLink}
                    onChange={(e) => setSecondaryButtonLink(e.target.value)}
                    placeholder="Target Link (e.g. /contact)"
                    className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sort Order & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Display Order Sequence
                </label>
                <input
                  type="number"
                  required
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10))}
                  placeholder="1"
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-accent-gold bg-white focus:ring-0 cursor-pointer"
                />
                <label htmlFor="bannerActive" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">
                  Active in Hero Banner Carousel
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 border-t border-slate-200/80 pt-5 mt-2 justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={isPending}
                className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors disabled:opacity-30 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving Slide...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Slide
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BANNERS LISTING TABLE */}
      {!isFormOpen && (
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          {banners.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No hero slides registered. Click &quot;Add Slide&quot; to configure your first hero banner.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="p-4 pl-6">Background</th>
                    <th className="p-4">Visual Overlay</th>
                    <th className="p-4">Title / Headline</th>
                    <th className="p-4">Badge</th>
                    <th className="p-4">CTA</th>
                    <th className="p-4">Order</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {banners.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Background image preview */}
                      <td className="p-4 pl-6">
                        {b.backgroundImage ? (
                          <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 relative bg-slate-900 shadow-sm">
                            <Image src={b.backgroundImage} alt="BG preview" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-mono text-slate-400">
                            Gradient
                          </div>
                        )}
                      </td>

                      {/* Right Visual Overlay */}
                      <td className="p-4">
                        {b.showGlobe ? (
                          <div className="w-10 h-10 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
                            <Globe className="w-5 h-5" />
                          </div>
                        ) : b.image ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 relative bg-slate-900 shadow-sm">
                            <Image src={b.image} alt={b.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      <td className="p-4 font-semibold text-slate-900 max-w-xs truncate">
                        {b.title}
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-500">{b.badge}</td>
                      <td className="p-4 text-xs font-mono text-accent-blue">{b.primaryButtonText}</td>
                      <td className="p-4 font-mono text-xs">{b.displayOrder}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(b._id, b.active)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                            b.active
                              ? "bg-green-500/10 border-green-500/20 text-green-600"
                              : "bg-gray-100 border-gray-200 text-slate-400"
                          }`}
                        >
                          {b.active ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEditForm(b)}
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Edit Banner"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(b._id, b.image, b.backgroundImage)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            aria-label="Delete Banner"
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
