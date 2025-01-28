import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getRequiredPermission,
  hasPermission,
  isDevRoute,
  isPublicRoute,
} from "./src/lib/permissions";

// middleware: see https://nextjs.org/docs/app/building-your-application/routing/middleware
export async function middleware(req: NextRequest) {
  // get user session and path
  const session = await auth();
  const path = req.nextUrl.pathname;

  // if home, public route or dev route, allow access
  if (path === "/" || isPublicRoute(path) || isDevRoute(path)) {
    return NextResponse.next();
  }

  // if route requires permission, check it
  const requiredPermission = getRequiredPermission(path);
  if (!requiredPermission) {
    return NextResponse.next();
  }

  // if user is not authenticated, redirect to home
  if (!session?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if user does not have permission, redirect to home
  if (!hasPermission(session.user.role, requiredPermission)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if user has permission, allow access
  return NextResponse.next();
}

// routes excluded from middleware (e.g. api, static files, images, etc.)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
