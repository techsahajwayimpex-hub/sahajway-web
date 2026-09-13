import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/User";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.warn("Missing CLERK_WEBHOOK_SECRET in environment variables.");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the raw body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as WebhookEvent;
  } catch (err) {
    console.error("Error verifying Clerk webhook:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  const eventType = evt.type;

  try {
    await connectDB();

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address || "";
      const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "Customer";

      await UserModel.findOneAndUpdate(
        { clerkId: id },
        {
          $set: {
            clerkId: id,
            email: primaryEmail,
            name: fullName,
            imageUrl: image_url || "",
          },
        },
        { upsert: true, new: true }
      );
      console.log(`[Clerk Webhook] Synced user ${id} (${primaryEmail}) to MongoDB.`);
    } else if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await UserModel.findOneAndDelete({ clerkId: id });
        console.log(`[Clerk Webhook] Deleted user ${id} from MongoDB.`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (dbErr: any) {
    console.error("[Clerk Webhook] Error processing event in database:", dbErr);
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }
}
