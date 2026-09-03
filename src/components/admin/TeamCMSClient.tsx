"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, Upload, X, Loader2, Link2 } from "lucide-react";
import { createTeamMember, updateTeamMember, deleteTeamMember, toggleTeamMemberStatus } from "@/app/actions/team";

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  country: string;
  image: string;
  bio: string;
  email: string;
  linkedin: string;
  displayOrder: number;
  active: boolean;
}

interface TeamCMSClientProps {
  initialTeam: TeamMember[];
}

export default function TeamCMSClient({ initialTeam }: TeamCMSClientProps) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null); // base64

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
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = () => {
    setEditingMember(null);
    setName("");
    setDesignation("");
    setCountry("India");
    setBio("");
    setEmail("");
    setLinkedin("");
    setDisplayOrder(team.length + 1);
    setActive(true);
    setImagePreview(null);
    setImageData(null);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const openEditForm = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setDesignation(member.designation);
    setCountry(member.country);
    setBio(member.bio || "");
    setEmail(member.email || "");
    setLinkedin(member.linkedin || "");
    setDisplayOrder(member.displayOrder || 0);
    setActive(member.active);
    setImagePreview(member.image);
    setImageData(null);
    setErrorBanner("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner("");

    if (!name.trim()) return setErrorBanner("Director Name is required");
    if (!designation.trim()) return setErrorBanner("Director Designation is required");
    if (!country.trim()) return setErrorBanner("Managing Country is required");
    if (!editingMember && !imageData) return setErrorBanner("Profile Photo is required");

    startTransition(async () => {
      let res;
      if (editingMember) {
        res = await updateTeamMember(editingMember._id, {
          name,
          designation,
          country,
          image: editingMember.image,
          imageData: imageData || undefined,
          bio,
          email,
          linkedin,
          displayOrder,
          active,
        });
      } else {
        res = await createTeamMember({
          name,
          designation,
          country,
          imageData: imageData || undefined,
          bio,
          email,
          linkedin,
          displayOrder,
          active,
        });
      }

      if (res.success) {
        window.location.reload();
      } else {
        setErrorBanner(res.message || "Failed to save team member details");
      }
    });
  };

  const handleDelete = async (id: string, img: string) => {
    if (!confirm("Are you sure you want to delete this director profile from public leadership board?")) return;

    startTransition(async () => {
      const res = await deleteTeamMember(id, img);
      if (res.success) {
        setTeam(team.filter((t) => t._id !== id));
      } else {
        alert(res.message || "Failed to delete team member");
      }
    });
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    setTeam(team.map((t) => (t._id === id ? { ...t, active: newActive } : t)));

    const res = await toggleTeamMemberStatus(id, newActive);
    if (!res.success) {
      setTeam(team.map((t) => (t._id === id ? { ...t, active: currentActive } : t)));
      alert(res.message || "Failed to toggle active status");
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Team Members</h1>
          <p className="text-slate-500 text-sm">
            Manage company board directors, display designations, and custom display sorting orders.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 cursor-pointer shadow-lg shadow-accent-gold/15"
          >
            <Plus className="w-4 h-4" />
            Add Director
          </button>
        )}
      </div>

      {errorBanner && (
        <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 text-red-400 text-xs font-mono">
          {errorBanner}
        </div>
      )}

      {/* CRUD TEAM FORM */}
      {isFormOpen && (
        <div className="p-8 rounded-3xl border border-slate-200/60 bg-slate-100/40 flex flex-col gap-6 max-w-2xl">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">
              {editingMember ? "Modify Executive Profile" : "Register Board Director"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            {/* ROW 1: Name, Designation & Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prit Patel"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Designation / Role
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Managing Director"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Managing Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* ROW 2: Photo Upload preview */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Profile Photo
              </label>

              <div className="flex items-center gap-6">
                {imagePreview ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 relative shrink-0">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border border-dashed border-slate-300/60 bg-slate-100/40 flex items-center justify-center text-gray-600 shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                )}

                <div className="flex flex-col gap-1.5 items-start">
                  <label className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-100/60 hover:bg-white/10 text-xs font-mono text-slate-600 hover:text-slate-900 cursor-pointer transition-all">
                    Choose Profile Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <span className="text-[9px] text-slate-400 font-mono">PNG or JPG. Aspect ratio 1:1 is best.</span>
                </div>
              </div>
            </div>

            {/* ROW 3: Bio narrative */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Executive Biography
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Provide biographical summaries, experience, or logistics expertise highlights..."
                className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* ROW 4: Contact Emails & LinkedIn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prit@sahajwayimpex.com"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="px-4 py-3 rounded-xl bg-slate-100/60 border border-slate-200 text-slate-900 text-sm focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* ROW 5: Display order ranking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Sort Display Order
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
                  id="active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-200 text-accent-gold bg-slate-100/60 focus:ring-0"
                />
                <label htmlFor="active" className="text-xs font-semibold text-slate-600 select-none">
                  Display publicly on executive board page
                </label>
              </div>
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
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Director
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TEAM LISTING TABLE */}
      {!isFormOpen && (
        <div className="rounded-2xl border border-slate-200/60 bg-slate-100/40 overflow-hidden">
          {team.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No directors registered. Click &quot;Add Director&quot; to register your first.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200/60 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-white/1">
                    <th className="p-4 pl-6">Photo</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Sort Order</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {team.map((member) => (
                    <tr key={member._id} className="hover:bg-white/1 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200/60 relative bg-slate-900">
                          <Image src={member.image} alt={member.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-900">{member.name}</td>
                      <td className="p-4 font-semibold text-accent-blue">{member.designation}</td>
                      <td className="p-4">{member.country}</td>
                      <td className="p-4 font-mono text-xs text-center md:text-left md:pl-8">{member.displayOrder}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(member._id, member.active)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                            member.active
                              ? "bg-green-500/5 border-green-500/20 text-green-400"
                              : "bg-gray-500/5 border-gray-500/20 text-slate-500"
                          }`}
                        >
                          {member.active ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEditForm(member)}
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer"
                            aria-label="Edit Member"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id, member.image)}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
                            aria-label="Delete Member"
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
