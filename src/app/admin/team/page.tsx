import React from "react";
import TeamCMSClient from "@/components/admin/TeamCMSClient";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import TeamMemberModel from "@/lib/models/TeamMember";

export const revalidate = 0;

async function getTeam() {
  if (isUsingMockDB) {
    const db = readMockDB();
    return db.team;
  }

  try {
    await connectDB();
    const team = await TeamMemberModel.find().sort({ displayOrder: 1 }).lean();
    return JSON.parse(JSON.stringify(team));
  } catch (err) {
    console.error("Failed to query team board, using mock fallback:", err);
    const db = readMockDB();
    return db.team;
  }
}

export default async function AdminTeamPage() {
  const team = await getTeam();

  return <TeamCMSClient initialTeam={team} />;
}
