"use client";

import React, { useState, useTransition } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
  Globe,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  createDestination,
  updateDestination,
  deleteDestination,
  toggleDestinationStatus,
} from "@/app/actions/destination";

interface Destination {
  _id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  displayOrder: number;
  active: boolean;
}

interface DestinationCMSClientProps {
  initialDestinations: Destination[];
}

const PRESET_PORTS = [
  { name: "New York, USA", country: "United States", lat: 40.7128, lon: -74.006 },
  { name: "London, UK", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo, Japan", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney, Australia", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Frankfurt, Germany", country: "Germany", lat: 50.1109, lon: 8.6821 },
  { name: "Dubai, UAE", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore Port", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Rotterdam, Netherlands", country: "Netherlands", lat: 51.9244, lon: 4.4777 },
  { name: "Los Angeles, USA", country: "United States", lat: 34.0522, lon: -118.2437 },
  { name: "Hong Kong Port", country: "Hong Kong", lat: 22.3193, lon: 114.1694 },
];

export default function DestinationCMSClient({
  initialDestinations,
}: DestinationCMSClientProps) {
  const [destinations, setDestinations] =
    useState<Destination[]>(initialDestinations);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState<number | string>("");
  const [lon, setLon] = useState<number | string>("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [active, setActive] = useState(true);

  const [isPending, startTransition] = useTransition();
  const [errorBanner, setErrorBanner] = useState("");

  const openAddForm = () => {
    setEditingDest(null);
    setName("");
    setCountry("");
    setLat("");
    setLon("");
    setDisplayOrder(destinations.length + 1);
    setActive(true);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const openEditForm = (dest: Destination) => {
    setEditingDest(dest);
    setName(dest.name);
    setCountry(dest.country);
    setLat(dest.lat);
    setLon(dest.lon);
    setDisplayOrder(dest.displayOrder || 0);
    setActive(dest.active);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const handleApplyPreset = (preset: (typeof PRESET_PORTS)[0]) => {
    setName(preset.name);
    setCountry(preset.country);
    setLat(preset.lat);
    setLon(preset.lon);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner("");

    if (!name.trim()) return setErrorBanner("Destination Name is required");
    if (!country.trim()) return setErrorBanner("Country Name is required");
    if (lat === "" || isNaN(Number(lat)))
      return setErrorBanner("Valid Latitude is required (-90 to 90)");
    if (lon === "" || isNaN(Number(lon)))
      return setErrorBanner("Valid Longitude is required (-180 to 180)");

    startTransition(async () => {
      let res;
      if (editingDest) {
        res = await updateDestination(editingDest._id, {
          name,
          country,
          lat: Number(lat),
          lon: Number(lon),
          displayOrder: Number(displayOrder) || 0,
          active,
        });
      } else {
        res = await createDestination({
          name,
          country,
          lat: Number(lat),
          lon: Number(lon),
          displayOrder: Number(displayOrder) || 0,
          active,
        });
      }

      if (res.success) {
        window.location.reload();
      } else {
        setErrorBanner(res.message || "Failed to save destination");
      }
    });
  };

  const handleDelete = async (id: string, destName: string) => {
    if (
      !confirm(
        `Are you sure you want to remove "${destName}" from the global 3D trade network?`
      )
    )
      return;

    startTransition(async () => {
      const res = await deleteDestination(id);
      if (res.success) {
        setDestinations(destinations.filter((d) => d._id !== id));
      } else {
        alert(res.message || "Failed to delete destination");
      }
    });
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    setDestinations(
      destinations.map((d) => (d._id === id ? { ...d, active: newActive } : d))
    );

    const res = await toggleDestinationStatus(id, newActive);
    if (!res.success) {
      setDestinations(
        destinations.map((d) =>
          d._id === id ? { ...d, active: currentActive } : d
        )
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
            Trade Destinations
          </h1>
          <p className="text-slate-500 text-sm">
            Manage global export destinations and coordinates connected to the 3D World Globe on the landing page.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 cursor-pointer shadow-lg shadow-accent-gold/15"
          >
            <Plus className="w-4 h-4" />
            Add Destination
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
        <div className="p-8 rounded-3xl border border-slate-200/60 bg-slate-100/40 flex flex-col gap-6 max-w-2xl">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent-blue" />
              {editingDest ? "Modify Trade Destination" : "Register Trade Destination"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Port Quick Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent-gold" />
              Quick Fill Major Global Ports:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_PORTS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-accent-blue transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 mt-2">
            {/* ROW 1: Name & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Destination Name / Port
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. New York, USA"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* ROW 2: Lat & Lon Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Latitude</span>
                  <span className="text-[9px] text-slate-400 font-normal">(-90 to 90)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="40.7128"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Longitude</span>
                  <span className="text-[9px] text-slate-400 font-normal">(-180 to 180)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  placeholder="-74.0060"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* ROW 3: Sort order & Active Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Display Sort Order
                </label>
                <input
                  type="number"
                  required
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10))}
                  placeholder="1"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="destActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-200 text-accent-gold bg-slate-100/60 focus:ring-0"
                />
                <label
                  htmlFor="destActive"
                  className="text-xs font-semibold text-slate-600 select-none cursor-pointer"
                >
                  Active on 3D Globe & Corridor List
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-slate-200/60 pt-5 mt-2 justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={isPending}
                className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-colors disabled:opacity-30 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Destination
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DESTINATIONS LISTING TABLE */}
      {!isFormOpen && (
        <div className="rounded-2xl border border-slate-200/60 bg-slate-100/40 overflow-hidden">
          {destinations.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No destinations registered. Click &quot;Add Destination&quot; to connect a global export port.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200/60 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-white/1">
                    <th className="p-4 pl-6">Destination</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Coordinates (Lat, Lon)</th>
                    <th className="p-4">Sort Order</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {destinations.map((dest) => (
                    <tr key={dest._id} className="hover:bg-white/1 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent-gold shrink-0" />
                        <span>{dest.name}</span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{dest.country}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">
                        {dest.lat.toFixed(4)}, {dest.lon.toFixed(4)}
                      </td>
                      <td className="p-4 font-mono text-xs">{dest.displayOrder}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(dest._id, dest.active)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                            dest.active
                              ? "bg-green-500/5 border-green-500/20 text-green-500"
                              : "bg-gray-500/5 border-gray-500/20 text-slate-400"
                          }`}
                        >
                          {dest.active ? (
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
                            onClick={() => openEditForm(dest)}
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer"
                            aria-label="Edit Destination"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(dest._id, dest.name)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
                            aria-label="Delete Destination"
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
