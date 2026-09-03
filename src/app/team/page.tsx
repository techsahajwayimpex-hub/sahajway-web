import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Mail, Linkedin, MapPin, Sparkles, Shield } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import TeamMemberModel from "@/lib/models/TeamMember";

import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Executive Board & Leadership | Sahajway Impex",
  description: "Meet the executive board directing Sahajway Impex in India and USA. Premium B2B trade leaders connecting local craft centers with global ports.",
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Executive Board & Leadership | Sahajway Impex",
    description: "Meet the leaders managing Indian artisan partnerships and international B2B logistics.",
    url: "/team",
  },
};

// Fetch team members dynamically from MongoDB (or local mock DB)
async function getTeamMembers() {
  if (isUsingMockDB) {
    const data = readMockDB();
    return data.team
      .filter((t: any) => t.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }

  try {
    await connectDB();
    const team = await TeamMemberModel.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    if (!team || team.length === 0) {
      const data = readMockDB();
      return data.team
        .filter((t: any) => t.active)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    }
    return JSON.parse(JSON.stringify(team));
  } catch (error) {
    console.error("Team query failed, using mock data fallback:", error);
    const data = readMockDB();
    return data.team
      .filter((t: any) => t.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  }
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

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

  // Find Prit Patel for special India MD spotlight
  const indiaMd = teamMembers.find(
    (t: any) => t.name.toLowerCase().includes("prit") || t.designation.toLowerCase().includes("india")
  );

  // Remaining board directors (e.g. USA Director)
  const remainingDirectors = teamMembers.filter((t: any) => t._id !== indiaMd?._id);

  return (
    <>
      <JsonLd schema={teamSchema} />
      <Navbar />

      <main className="flex-1 min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-premium">
        {/* Decorative background visual elements */}
        <div className="absolute top-1/6 right-1/10 w-[450px] h-[450px] rounded-full bg-glow-blue opacity-5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/6 left-1/10 w-[350px] h-[350px] rounded-full bg-glow-gold opacity-5 filter blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col gap-10">
          <Breadcrumbs items={[{ name: "Leadership Team", url: "/team" }]} />

          {/* Section Titles */}
          <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
            <h1 className="text-xs font-mono tracking-widest text-[#00d4ff] uppercase">
              Corporate Governance
            </h1>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Executive <span className="text-gradient-gold">Leadership Board</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Leading the trade logistics, quality compliance, and international client relationships between India and global destination channels.
            </p>
          </div>

          {/* SPOTLIGHT SECTION: MANAGING DIRECTOR (INDIA) */}
          {indiaMd && (
            <section className="flex flex-col gap-8 text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5 pl-1">
                <Shield className="w-4 h-4 text-accent-gold" />
                Central HQ Command
              </span>
              
              <div className="glass-panel p-8 md:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center hover:border-slate-200 transition-all duration-500">
                {/* Director Avatar image */}
                <div className="md:col-span-5 h-[320px] rounded-2xl overflow-hidden relative border border-slate-200/60 bg-slate-900 shadow-2xl">
                  <Image
                    src={indiaMd.image}
                    alt={indiaMd.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030810]/75 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-[10px] font-mono text-accent-gold uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-full border border-slate-200">
                    <MapPin className="w-3 h-3" />
                    <span>{indiaMd.country}</span>
                  </div>
                </div>

                {/* Director Bio Copy */}
                <div className="md:col-span-7 flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-mono text-accent-blue font-semibold uppercase tracking-wider">
                      {indiaMd.designation}
                    </span>
                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {indiaMd.name}
                    </h3>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed font-sans">
                    {indiaMd.bio}
                  </p>

                  <div className="h-[1px] bg-slate-100/60 w-full" />

                  {/* Social contact triggers */}
                  <div className="flex gap-4">
                    <a
                      href={`mailto:${indiaMd.email}`}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono text-slate-600 hover:text-slate-900 border border-slate-200/60 bg-slate-100/40 hover:bg-slate-100/60 transition-all"
                    >
                      <Mail className="w-4 h-4 text-accent-blue" />
                      <span>{indiaMd.email}</span>
                    </a>
                    {indiaMd.linkedin && (
                      <a
                        href={indiaMd.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono text-slate-600 hover:text-slate-900 border border-slate-200/60 bg-slate-100/40 hover:bg-slate-100/60 transition-all"
                      >
                        <Linkedin className="w-4 h-4 text-accent-blue" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECONDARY LEADERSHIP GRID: MANAGING DIRECTOR (USA) */}
          <section className="flex flex-col gap-8 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5 pl-1">
              <Sparkles className="w-4 h-4 text-accent-blue" />
              Global Division Board
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {remainingDirectors.map((director: any) => (
                <div
                  key={director.name}
                  className="glass-panel p-8 rounded-3xl flex flex-col justify-between gap-8 hover:border-slate-200 transition-all duration-500 group"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Director avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden relative border border-slate-200 bg-slate-900 shrink-0">
                      <Image
                        src={director.image}
                        alt={director.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Director designations */}
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-xs font-mono text-accent-blue font-semibold uppercase tracking-wider">
                        {director.designation}
                      </span>
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                        {director.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-accent-gold" />
                        {director.country}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed font-sans text-left">
                    {director.bio}
                  </p>

                  <div className="h-[1px] bg-slate-100/60 w-full" />

                  {/* Social contacts */}
                  <div className="flex gap-4">
                    <a
                      href={`mailto:${director.email}`}
                      className="p-2.5 rounded-xl border border-slate-200/60 bg-slate-100/40 text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-all"
                      aria-label={`Email ${director.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    {director.linkedin && (
                      <a
                        href={director.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200/60 bg-slate-100/40 text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-all"
                        aria-label={`${director.name} LinkedIn`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
