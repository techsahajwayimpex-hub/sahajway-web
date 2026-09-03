import { auth, currentUser } from "@clerk/nextjs/server";

export interface AdminSession {
  isAuthenticated: boolean;
  email: string | null;
  name: string | null;
  isMock: boolean;
}

const isClerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

const getAdminEmails = (): string[] => {
  const adminEmailsString = process.env.ADMIN_EMAILS || "admin@gmail.com,contact@sahajwayimpex.com";
  return adminEmailsString.split(",").map(email => email.trim().toLowerCase());
};

/**
 * Checks if the current visitor is an authorized admin.
 * Falls back to a simulated developer admin session if Clerk keys are missing.
 */
export async function getAdminSession(): Promise<AdminSession> {
  if (!isClerkConfigured) {
    // Return mock admin session for local development
    return {
      isAuthenticated: true,
      email: "admin@sahajwayimpex.com",
      name: "Developer Admin",
      isMock: true,
    };
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        isAuthenticated: false,
        email: null,
        name: null,
        isMock: false,
      };
    }

    const user = await currentUser();
    if (!user) {
      return {
        isAuthenticated: false,
        email: null,
        name: null,
        isMock: false,
      };
    }

    // Extract emails
    const emails = user.emailAddresses.map(address => address.emailAddress.toLowerCase());
    const adminEmails = getAdminEmails();

    const isAdmin = emails.some(email => adminEmails.includes(email));

    if (!isAdmin) {
      return {
        isAuthenticated: false,
        email: emails[0] || null,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
        isMock: false,
      };
    }

    return {
      isAuthenticated: true,
      email: emails[0] || null,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
      isMock: false,
    };
  } catch (error) {
    console.error("Clerk auth check failed, falling back to false:", error);
    return {
      isAuthenticated: false,
      email: null,
      name: null,
      isMock: false,
    };
  }
}
