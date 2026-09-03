import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const isClerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

// Custom wrapper middleware to handle Clerk bypass in mock/dev mode
export default function middleware(req: any, event: any) {
  if (!isClerkConfigured) {
    // Under development mock mode, Clerk middleware is bypassed
    console.log("Clerk is in Mock mode. Admin route protection bypassed for development.");
    return NextResponse.next();
  }

  // Fallback to standard Clerk middleware checking
  return clerkMiddleware(async (auth, request) => {
    if (isAdminRoute(request)) {
      const { userId } = await auth();
      if (!userId) {
        // Force redirect to sign-in page
        const signInUrl = new URL("/sign-in", request.url);
        return NextResponse.redirect(signInUrl);
      }
      
      // Admin email restrictions are verified server-side inside layouts / actions
      // via getAdminSession() checks.
    }
    return NextResponse.next();
  })(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
