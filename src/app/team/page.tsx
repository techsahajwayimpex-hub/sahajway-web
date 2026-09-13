import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Mail, Linkedin, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import PageHero from "@/components/ui/PageHero";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import TeamMemberModel from "@/lib/models/TeamMember";

import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Executive Board & Leadership | Sahajway Impex",
  description:
    "Meet the executive leadership team directing Sahajway Impex across India and international destinations. Leading B2B textile trade, ethical artisan sourcing, and global logistics.",
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Executive Board & Leadership | Sahajway Impex",
    description:
      "Meet the leadership team managing Indian artisan partnerships and international B2B export logistics.",
    url: "/team",
  },
};

// Fetch team members dynamically from MongoDB (or local mock DB)
async function getTeamMembers() {
  if (isUsingMockDB) {
    const data = readMockDB();
    return (data.team || [])
      .filter((t: any) => t.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const data = readMockDB();
      return (data.team || [])
        .filter((t: any) => t.active)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }
    const team = await TeamMemberModel.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    if (!team || team.length === 0) {
      const data = readMockDB();
      return (data.team || [])
        .filter((t: any) => t.active)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }
    return JSON.parse(JSON.stringify(team));
  } catch (error) {
    console.error("Team query failed, using mock data fallback:", error);
    const data = readMockDB();
    return (data.team || [])
      .filter((t: any) => t.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/team#webpage`,
    url: `${siteUrl}/team`,
    name: "Executive Leadership & Board | Sahajway Impex",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: teamMembers.map((member: any, index: number) => ({
        "@type": "Person",
        position: index + 1,
        name: member.name,
        jobTitle: member.designation,
        worksFor: {
          "@type": "Organization",
          name: "Sahajway Impex",
        },
        image: member.image,
        description: member.bio,
      })),
    },
  };

  return (
    <>
      <JsonLd schema={teamSchema} />
      <Navbar />

      <PageHero
        title={
          <>
            Meet Our <span className="text-gradient-gold">Team</span>
          </>
        }
        subtitle="Directing trade logistics, artisanal manufacturing partnerships, quality compliance, and international client relationships between Anand, Gujarat and global trade channels."
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[{ name: "Our Team", url: "/team" }]}
        align="center"
      />

      <main className="flex-1 min-h-screen py-16 relative overflow-hidden bg-gradient-premium">
        {/* Decorative background visual elements */}
        <div className="absolute top-1/6 right-1/10 w-[450px] h-[450px] rounded-full bg-glow-blue opacity-10 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/6 left-1/10 w-[350px] h-[350px] rounded-full bg-glow-gold opacity-10 filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-12">
          {/* TEAM MEMBERS GRID */}
          {teamMembers.length === 0 ? (
            <div className="py-24 text-center glass-panel rounded-3xl p-12 max-w-lg mx-auto flex flex-col items-center gap-4">
              <Users className="w-12 h-12 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">
                Leadership Board Updating
              </h3>
              <p className="text-sm text-slate-500">
                Team member profiles are currently being updated. Please check
                back shortly.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-accent-gold to-white hover:opacity-90 transition-opacity mt-2"
              >
                Contact Headquarters
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member: any) => (
                <div
                  key={member._id || member.name}
                  className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between gap-6 hover:border-white transition-all duration-300 group shadow-sm hover:shadow-2xl"
                >
                  <div className="flex flex-col gap-5">
                    {/* Member Photo Container */}
                    <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-inner">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Users className="w-16 h-16" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>

                    {/* Member Info */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-accent-blue font-bold uppercase tracking-wider">
                          {member.designation}
                        </span>
                        {member.country && (
                          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider px-2.5 py-0.5 rounded-full glass-pill font-bold">
                            {member.country}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {member.name}
                      </h3>
                      {member.bio && (
                        <p className="text-slate-600 text-sm leading-relaxed mt-2 font-sans line-clamp-4">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Social / Contact Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono text-slate-700 hover:text-slate-900 glass-pill hover:bg-white transition-colors shadow-sm"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="w-3.5 h-3.5 text-accent-blue" />
                        <span className="truncate">{member.email}</span>
                      </a>
                    )}

                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl glass-pill text-slate-600 hover:text-accent-blue hover:bg-white transition-colors shrink-0 shadow-sm"
                        aria-label={`${member.name} LinkedIn Profile`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
