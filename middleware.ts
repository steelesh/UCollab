import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { isPublicRoute } from "./src/lib/permissions";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  const token = await getToken({ req });
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token.onboardingStep !== "COMPLETE" && path !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (token.onboardingStep === "COMPLETE" && path === "/onboarding") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.svg|public).*)"],
};
